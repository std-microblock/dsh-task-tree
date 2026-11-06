import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import { createUserMessage, isAgentLoopRequest, LlmAdapter, ReasoningEffortId, ToolCallId } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { defineContentToolFixture } from '@deepseek-ai/dsh-tool-testkit'
import { mountAgentLoopTestDependencies, mountAgentLoopTestHarness } from '@deepseek-ai/dsh-agent-loop-testkit'
import * as Jsonl from '@deepseek-ai/dsh-session-persistence-jsonl'
import * as TaskTree from '../src/index.ts'

export const answer = { path: ['修复会话保存', '验证旧格式'], detail: '正在运行旧格式读取测试。', decisions: ['保留独立的兼容层'] }

export function deferred<T = void>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>(accept => { resolve = accept })
  return { promise, resolve }
}
export function textChunks(text: string): StreamChunk[] {
  return [
    { type: 'block-end', index: 0, block: { type: 'text', text } },
    { type: 'usage', usage: { inputTokens: 42, outputTokens: 20, cacheReadTokens: 36 } },
    { type: 'finish', reason: { kind: 'stop' } },
  ]
}
function toolChunks(prefix: string): StreamChunk[] {
  return [
    { type: 'block-end', index: 0, block: { type: 'tool-call', id: ToolCallId(`${prefix}-0`), name: 'echo', arguments: '{}' } },
    { type: 'finish', reason: { kind: 'tool-calls' } },
  ]
}
async function untilReleased(promise: Promise<void>, signal: AbortSignal | undefined) {
  if (signal?.aborted) return
  let abort!: () => void
  await Promise.race([promise, new Promise<void>(resolve => { abort = resolve; signal?.addEventListener('abort', abort, { once: true }) })])
  signal?.removeEventListener('abort', abort)
}

/** Scripted provider: leading main requests call a tool, then the main request waits for release. */
export class Adapter extends LlmAdapter {
  main: GenerateOptions[] = []
  checks: GenerateOptions[] = []
  release = deferred()
  answers: StreamChunk[][] = []
  answer = textChunks(JSON.stringify(answer))
  toolRounds = 4
  private waiters: { count: number; resolve(): void }[] = []
  private mainCount = 0
  waitForChecks(count: number): Promise<void> {
    if (this.checks.length >= count) return Promise.resolve()
    return new Promise(resolve => this.waiters.push({ count, resolve }))
  }
  override async resolveModel(provider: string, model: string) {
    return { provider, id: model, name: model, reasoning: { efforts: [{ id: ReasoningEffortId('high'), name: 'High' }] } }
  }
  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    if (!isAgentLoopRequest(options)) {
      this.checks.push(options)
      for (const waiter of this.waiters) if (this.checks.length >= waiter.count) waiter.resolve()
      yield* this.answers.shift() ?? this.answer
      return
    }
    this.main.push(options)
    this.mainCount++
    if (this.mainCount <= this.toolRounds) { yield* toolChunks(`call-${this.mainCount}`); return }
    await untilReleased(this.release.promise, options.signal)
    if (!options.signal?.aborted) yield* textChunks('Main task finished.')
  }
}

/** In-memory stand-in for the storage domain facility. */
export function memoryDomains() {
  const tables = new Map<string, Map<string, unknown>>()
  return {
    tables,
    open: async () => ({
      table: (name: string) => {
        const table = tables.get(name) ?? new Map<string, unknown>()
        tables.set(name, table)
        return {
          get: (key: string) => table.get(key),
          entries: () => table.entries(),
          put: async (key: string, value: unknown) => { table.set(key, value) },
        }
      },
      close: async () => {},
    }),
  }
}

/** Title service stand-in recording renames. */
export function memoryTitles() {
  const titles = new Map<string, { title: string; source: { kind: 'user' | 'fallback' } }>()
  return {
    titles,
    get: (session: { id: string }) => {
      const value = titles.get(session.id)
      return value === undefined ? undefined : { ...value, messageSeqs: [], eventSeq: 0, updatedAt: 0 }
    },
    rename: (session: { id: string }, title: string) => {
      titles.set(session.id, { title, source: { kind: 'user' } })
      return { title, source: { kind: 'user' as const }, messageSeqs: [], eventSeq: 0, updatedAt: 0 }
    },
  }
}

export async function setup(config: Record<string, unknown> = {}, adapter = new Adapter()) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-task-tree-test-'))
  const ctx = new Context()
  await mountAgentLoopTestDependencies(ctx)
  await ctx.plugin(Jsonl, { root, compression: 'none' })
  const domains = memoryDomains()
  ctx.provide('storageDomain', domains as never)
  const titles = memoryTitles()
  ctx.provide('sessionTitle', titles as never)
  ctx.llm.registerAdapter(['mock', 'cheap'], adapter)
  ctx.tools.register(defineContentToolFixture({ name: 'echo', description: 'Read a fixture', parameters: {}, async execute() { return [{ type: 'text', text: 'fixture read' }] } }))
  const plugin = await ctx.plugin(TaskTree, { minIntervalMs: 1, minSteps: 1, ...config })
  const harness = await mountAgentLoopTestHarness(ctx)
  const agent = await harness.create(SessionId('task-tree-test'), { provider: 'mock', model: 'fixture', reasoningEffort: ReasoningEffortId('high'), maxTokens: 2000 })
  const events: SessionEvent[] = []
  ctx.on('session/event', (_session, event) => { events.push(event) })
  const start = () => agent.followup(createUserMessage({ source: { kind: 'user' }, content: [{ type: 'text', text: '修复会话保存问题。' }] }))
  const waitRecords = async (type: string, count = 1) => {
    if (events.filter(event => event.type === type).length < count) await new Promise<void>(resolve => {
      const off = ctx.on('session/event', () => {
        if (events.filter(event => event.type === type).length >= count) { off(); resolve() }
      })
    })
    await ctx.sessions.flush(agent.session)
  }
  const close = async () => {
    adapter.release.resolve()
    for (const current of ctx.agents.list()) current.cancel({ kind: 'disposed' })
    await Promise.all(ctx.agents.list().map(current => current.whenIdle()))
    await ctx.fiber.dispose()
    await rm(root, { recursive: true, force: true })
  }
  return { ctx, agent, adapter, events, plugin, start, close, waitRecords, domains, titles }
}
