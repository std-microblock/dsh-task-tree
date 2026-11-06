/**
 * Task-tree Host plugin: periodically asks a side model call what a running agent is working on, records each
 * answer as an ignorable Session record, and serves a cross-session index of the latest answers.
 */
import { randomUUID } from 'node:crypto'
import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { z as zod } from 'zod'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { isAgentLoopRequest } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, TokenUsage } from '@deepseek-ai/dsh-llm'
import { appendPluginRecord, SessionId } from '@deepseek-ai/dsh-session'
import type { Session } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-session-projection'
import type {} from '@deepseek-ai/dsh-client-connection'
import type {} from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-session-title'
import { LOCALE_SETTINGS_NAMESPACE } from '@deepseek-ai/dsh-client-locale'
import { GENERATION_MODES, modelAnswerSchema, RECORD, samePath } from './records.ts'
import type { CheckpointId, FailureStage, GenerationMode, ReportId, Route } from './records.ts'
import { buildTree, knownDecisions, normalizeText, outlineForPrompt, resolveReportedPath } from './tree.ts'
import type { TaskIndexRow, TaskListResponse } from './projection-types.ts'
import { taskTreeProjection } from './projection.ts'
import { createQuestion, createSummaryInput } from './prompt.ts'
import { callText, CallError, parseJsonAnswer } from './generate/call.ts'
import type { DraftRequest } from './generate/call.ts'
import { checkpointRequest, forkRequest, requestInput, summaryRequest } from './generate/request.ts'
import { chunkTranscript, prefixHash, renderTranscript } from './generate/transcript.ts'
import { planCheckpoint } from './generate/checkpoint.ts'
import type { CheckpointConfig, CheckpointState } from './generate/checkpoint.ts'
import { mayReplaceTitle } from './title.ts'
import { taskIndexSpec } from './index-store.ts'
import { LIST_METHOD, listRequestSchema } from './protocol.ts'
import { registerTaskTreeRpc } from './rpc.ts'

export type { TaskIndexRow, TaskListResponse, TaskTreeView, TreeRecord } from './projection-types.ts'

/** Cheap route edited as plain strings; empty provider or model means not configured. */
export interface CheapModel {
  provider: string
  model: string
  reasoningEffort: string
}

/** Deployment-owned cadence, limits, generation mode, and title policy. */
export interface Config {
  mode: Volatile<GenerationMode>
  cheapModel: Volatile<CheapModel>
  replaceTitle: Volatile<boolean>
  checkpoint: CheckpointConfig
  minSteps: number
  minIntervalMs: number
  maxDepth: number
  timeoutMs: number
  maxResponseBytes: number
  maxParseRetries: number
  includeSubagents: boolean
  promptOutlineMaxItems: number
  recentLimit: number
  listPollIntervalMs: number
}

const positive = () => z.number().min(1).step(1)

/** Validated configuration; `mode`, `cheapModel`, and `replaceTitle` change without restarting. */
export const Config = z.object({
  mode: z.union(GENERATION_MODES.map(mode => z.const(mode))).default('fork').volatile()
    .description('How the side query is built: fork reuses the agent request and model; fork-cheap reuses it with cheapModel; checkpoint sends a rolling summary plus recent messages to cheapModel.'),
  cheapModel: z.object({
    provider: z.string().default(''),
    model: z.string().default(''),
    reasoningEffort: z.string().default(''),
  }).default({ provider: '', model: '', reasoningEffort: '' }).volatile().description('Route used by fork-cheap and checkpoint modes.'),
  replaceTitle: z.boolean().default(false).volatile().description('Replace the session title with the top-level task.'),
  checkpoint: z.object({
    everyMessages: positive().default(40),
    keepMessages: positive().default(8),
    summaryMaxTokens: positive().default(2000),
    toolResultMaxChars: positive().default(2000),
    chunkMaxChars: positive().default(120000),
  }),
  minSteps: positive().default(2),
  minIntervalMs: positive().default(15000),
  maxDepth: z.number().min(1).max(8).step(1).default(4),
  timeoutMs: positive().default(120000),
  maxResponseBytes: positive().default(65536),
  maxParseRetries: z.number().min(0).max(5).step(1).default(2),
  includeSubagents: z.boolean().default(false),
  promptOutlineMaxItems: positive().default(60),
  recentLimit: positive().default(50),
  listPollIntervalMs: positive().default(15000),
})

/** Services whose lifetime owns the scheduler. */
export const inject = ['agents', 'sessions', 'sessionProjections', 'llm', 'storageDomain']

interface Snapshot {
  request: DraftRequest
  signal: AbortSignal | undefined
  stepCount: number
  seq: number
  turn: number | undefined
  step: number | undefined
}
interface Work {
  agent: Agent
  remaining: number
  startedAt: number | undefined
  timer: ReturnType<typeof setTimeout> | undefined
  due: boolean
  snapshot: Snapshot | undefined
  controller: AbortController | undefined
  covered: number
}

/**
 * Resolve the configured cheap route.
 * @param value - configured strings.
 * @returns the route, or undefined when provider or model is empty.
 */
export function cheapRoute(value: CheapModel): Route | undefined {
  if (value.provider.trim() === '' || value.model.trim() === '') return undefined
  return {
    provider: value.provider.trim(), model: value.model.trim(),
    ...value.reasoningEffort.trim() === '' ? {} : { reasoningEffort: value.reasoningEffort.trim() },
  }
}

function addUsage(total: TokenUsage | undefined, next: TokenUsage | undefined): TokenUsage | undefined {
  if (next === undefined) return total
  if (total === undefined) return next
  const sum = (a: number | undefined, b: number | undefined) => a === undefined && b === undefined ? undefined : (a ?? 0) + (b ?? 0)
  const optional = (key: 'totalTokens' | 'cacheReadTokens' | 'cacheWriteTokens' | 'reasoningTokens') => {
    const value = sum(total[key], next[key])
    return value === undefined ? {} : { [key]: value }
  }
  return {
    inputTokens: total.inputTokens + next.inputTokens,
    outputTokens: total.outputTokens + next.outputTokens,
    ...optional('totalTokens'), ...optional('cacheReadTokens'), ...optional('cacheWriteTokens'), ...optional('reasoningTokens'),
  }
}

/**
 * Attach the reporter to live agents, serve the cross-session index, and unwind every timer and call on removal.
 * @param ctx - plugin context.
 * @param config - validated configuration.
 * @returns when the projection and index are ready.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const localeSettings = zod.object({ preference: zod.string().optional() })
  const outputLocale = () => {
    const descriptor = ctx.get('settings')?.describe().find(form => form.ns === LOCALE_SETTINGS_NAMESPACE)
    return descriptor === undefined ? undefined : localeSettings.parse(descriptor.value).preference
  }
  const projection = await ctx.sessionProjections.register(taskTreeProjection)
  const index = await ctx.storageDomain.open(taskIndexSpec)
  const sessions = index.table('sessions')
  const work = new Map<SessionId, Work>()
  let stopped = false
  let active = 0
  const pending = new Set<Promise<void>>()

  ctx.inject(['settings'], child => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)) })

  const running = (entry: Work) => !stopped && work.get(entry.agent.session.id) === entry && entry.agent.status === 'running'
  const stopTimer = (entry: Work) => {
    if (entry.timer !== undefined) clearTimeout(entry.timer)
    entry.timer = undefined
    if (entry.startedAt !== undefined) entry.remaining = Math.max(0, entry.remaining - (performance.now() - entry.startedAt))
    entry.startedAt = undefined
  }
  const pause = (entry: Work) => {
    stopTimer(entry)
    entry.controller?.abort(new Error('agent stopped working'))
    entry.snapshot = undefined
  }
  const arm = (entry: Work) => {
    if (!running(entry) || entry.timer !== undefined || entry.due || entry.controller !== undefined) return
    entry.startedAt = performance.now()
    entry.timer = setTimeout(() => {
      entry.timer = undefined
      entry.startedAt = undefined
      entry.remaining = 0
      entry.due = true
      pump()
    }, entry.remaining)
    entry.timer.unref?.()
  }
  const attach = (agent: Agent) => {
    if (work.has(agent.session.id) || (!config.includeSubagents && agent.session.header.origin === 'subagent')) return
    const entry: Work = {
      agent, remaining: config.minIntervalMs, startedAt: undefined, timer: undefined, due: false,
      snapshot: undefined, controller: undefined, covered: projection.stateOf(agent.session).covered,
    }
    work.set(agent.session.id, entry)
    arm(entry)
  }
  const flush = async (session: Session) => {
    if (!await ctx.sessions.flush(session)) throw new Error('task-tree requires durable session persistence')
  }

  const updateIndex = async (session: Session, seq: number) => {
    const tree = buildTree(projection.stateOf(session).view.records)
    const latest = tree.latest
    if (latest === undefined) return
    const row: TaskIndexRow = {
      sessionId: session.id, rootTitle: latest.path[0] as string, path: latest.path, detail: latest.detail,
      doneCount: tree.doneCount, totalCount: tree.totalCount, lastRecordSeq: seq, updatedAt: Date.now(),
    }
    await sessions.put(session.id, row)
  }
  const updateTitle = (session: Session, root: string) => {
    if (!config.replaceTitle.get()) return
    const titles = ctx.get('sessionTitle')
    if (titles === undefined || ctx.sessions.get(session.id) !== session) return
    if (!mayReplaceTitle(titles.get(session), projection.stateOf(session).lastTitle, root)) return
    const snapshot = titles.rename(session, root)
    appendPluginRecord(session, RECORD.title, { version: 1, title: snapshot.title })
  }

  const checkpointFor = async (
    session: Session, messages: DraftRequest['messages'], route: Route, signal: AbortSignal,
  ): Promise<CheckpointState | undefined> => {
    const plan = planCheckpoint(messages, projection.stateOf(session).checkpoint, config.checkpoint)
    if (plan.kind === 'use') return plan.checkpoint
    const chunks = chunkTranscript(messages, plan.from, plan.boundary, config.checkpoint.chunkMaxChars, config.checkpoint)
    let summary = plan.base?.summary
    let usage: TokenUsage | undefined
    const inputs: string[] = []
    let used: Route = route
    for (const chunk of chunks) {
      const input = createSummaryInput(summary, chunk)
      inputs.push(input)
      const result = await callText(ctx, summaryRequest(route, input, config.checkpoint.summaryMaxTokens, session.id), config.maxResponseBytes, signal)
      used = result.route
      usage = addUsage(usage, result.usage)
      const text = result.text.trim()
      if (text === '') throw new CallError('response', 'the checkpoint summary was empty')
      summary = text
    }
    if (summary === undefined) return plan.base
    const id = randomUUID() as CheckpointId
    const hash = prefixHash(messages, plan.boundary)
    appendPluginRecord(session, RECORD.checkpoint, {
      version: 1, id, sessionId: session.id, boundary: plan.boundary, prefixHash: hash, summary,
      ...plan.base === undefined ? {} : { basedOn: plan.base.id as CheckpointId },
      route: used, inputs, ...usage === undefined ? {} : { usage },
    })
    await flush(session)
    return { id, boundary: plan.boundary, prefixHash: hash, summary }
  }

  const check = async (entry: Work, snapshot: Snapshot, controller: AbortController): Promise<void> => {
    const id = randomUUID() as ReportId
    const { session } = entry.agent
    const signal = controller.signal
    const abort = () => controller.abort(snapshot.signal?.reason)
    snapshot.signal?.addEventListener('abort', abort, { once: true })
    if (snapshot.signal?.aborted) abort()
    const fail = async (attempt: number, stage: FailureStage, error: unknown, retryable: boolean) => {
      const message = error instanceof Error ? error.message : String(error)
      if (ctx.sessions.get(session.id) !== session) return
      try {
        appendPluginRecord(session, RECORD.failure, {
          version: 1, id, attempt, sessionId: session.id, stage, retryable, message, canceled: signal.aborted,
          ...error instanceof Error && error.stack !== undefined ? { stack: error.stack } : {},
        })
        await flush(session)
      } catch (persistError: unknown) {
        ctx.logger.warn(`task-tree ${id}: could not persist failure: ${String(persistError)}`)
      }
      if (!signal.aborted) ctx.logger.warn(`task-tree ${id}, attempt ${attempt}, ${stage}: ${message}`)
    }
    try {
      const mode = config.mode.get()
      const route = mode === 'fork' ? undefined : cheapRoute(config.cheapModel.get())
      if (mode !== 'fork' && route === undefined) {
        await fail(1, 'config', new Error(`generation mode ${mode} requires cheapModel.provider and cheapModel.model`), false)
        return
      }
      const messages = snapshot.request.messages
      let checkpoint: CheckpointState | undefined
      if (mode === 'checkpoint') {
        try {
          checkpoint = await checkpointFor(session, messages, route as Route, signal)
        } catch (error: unknown) {
          await fail(1, 'checkpoint', error, false)
          return
        }
      }
      const state = projection.stateOf(session)
      const tree = buildTree(state.view.records)
      const outline = outlineForPrompt(tree, config.promptOutlineMaxItems)
      const known = knownDecisions(tree)
      for (let attempt = 1; ; attempt++) {
        let stage: FailureStage = 'prepare'
        try {
          signal.throwIfAborted()
          const question = createQuestion({ maxDepth: config.maxDepth, outline, locale: outputLocale(), retry: attempt > 1 })
          const draft = mode === 'checkpoint'
            ? checkpointRequest(route as Route, checkpoint?.summary,
              renderTranscript(messages, checkpoint?.boundary ?? 0, messages.length, config.checkpoint), question, session.id)
            : forkRequest(snapshot.request, question, route)
          const result = await callText(ctx, draft, config.maxResponseBytes, signal, {
            beforeDispatch: async (request, used) => {
              stage = 'request'
              appendPluginRecord(session, RECORD.request, {
                version: 1, id, attempt, sessionId: session.id, mode, route: used, contextSeq: snapshot.seq,
                reusedMessages: mode === 'checkpoint' ? 0 : messages.length,
                ...checkpoint === undefined ? {} : { checkpointId: checkpoint.id as CheckpointId },
                ...mode === 'checkpoint' && request.system !== undefined ? { system: request.system } : {},
                input: mode === 'checkpoint' ? requestInput(request) : question,
                ...request.maxTokens === undefined ? {} : { maxTokens: request.maxTokens },
              })
              await flush(session)
              stage = 'response'
            },
          })
          stage = 'parse'
          const parsed = modelAnswerSchema.safeParse(parseJsonAnswer(result.text))
          if (!parsed.success) throw new CallError('parse', `answer did not match the schema: ${parsed.error.message}`, true)
          if (!running(entry)) throw new Error('agent stopped working')
          const resolved = resolveReportedPath(parsed.data.path.slice(0, config.maxDepth), tree)
          if (resolved.kind === 'unresolved-alias') {
            throw new CallError('parse', `path level ${resolved.depth + 1} uses @ but the existing tree has no item there`, true)
          }
          const path = resolved.path
          const seen = new Set(known)
          const decisions = parsed.data.decisions.filter((decision) => {
            const key = normalizeText(decision)
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
          const previousPath = tree.latest?.path ?? []
          stage = 'persist'
          const seq = appendPluginRecord(session, RECORD.result, {
            version: 1, id, attempt, sessionId: session.id, mode, route: result.route,
            contextSeq: snapshot.seq, coveredStepCount: snapshot.stepCount,
            ...snapshot.turn === undefined ? {} : { coveredTurn: snapshot.turn },
            ...snapshot.step === undefined ? {} : { coveredStep: snapshot.step },
            path, previousPath, detail: parsed.data.detail, decisions,
            blocks: result.blocks, ...result.usage === undefined ? {} : { usage: result.usage },
          })
          await flush(session)
          entry.covered = snapshot.stepCount
          try {
            if (previousPath[0] !== path[0] || !samePath(previousPath.slice(0, 1), path.slice(0, 1))) updateTitle(session, path[0] as string)
          } catch (error: unknown) {
            ctx.logger.warn(`task-tree ${id}: title update failed: ${String(error)}`)
          }
          await updateIndex(session, seq).catch((error: unknown) => {
            ctx.logger.warn(`task-tree ${id}: index update failed: ${String(error)}`)
          })
          return
        } catch (error: unknown) {
          const failedStage = error instanceof CallError ? error.stage : stage
          const retryable = error instanceof CallError && error.retryable
          await fail(attempt, failedStage, error, retryable)
          if (!retryable || attempt > config.maxParseRetries || signal.aborted || !running(entry)) return
        }
      }
    } finally {
      snapshot.signal?.removeEventListener('abort', abort)
    }
  }

  function pump(): void {
    if (stopped) return
    for (const entry of work.values()) {
      if (active >= 1) break
      if (!running(entry) || entry.controller !== undefined || !entry.due) continue
      const snapshot = entry.snapshot
      if (snapshot === undefined || snapshot.stepCount - entry.covered < config.minSteps) continue
      stopTimer(entry)
      entry.due = false
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(new Error('task-tree timed out')), config.timeoutMs)
      timeout.unref?.()
      entry.controller = controller
      active++
      // Defer record writes beyond the Session's synchronous event publication.
      const run = Promise.resolve().then(() => check(entry, snapshot, controller)).catch((error: unknown) => {
        ctx.logger.warn(`task-tree: ${String(error)}`)
      }).finally(() => {
        clearTimeout(timeout)
        pending.delete(run)
        active--
        if (entry.controller === controller) entry.controller = undefined
        entry.remaining = config.minIntervalMs
        arm(entry)
        pump()
      })
      pending.add(run)
    }
  }

  ctx.inject(['connection'], (scope) => {
    registerTaskTreeRpc(scope, async (endpoint, payload) => {
      if (endpoint !== LIST_METHOD || !listRequestSchema.safeParse(payload).success) {
        return { ok: false, error: { code: 'task-tree/invalid-request', message: 'invalid task-tree request', details: {} } }
      }
      const rows = [...sessions.entries()].map(([, row]) => row)
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, config.recentLimit)
      const value: TaskListResponse = { rows, pollIntervalMs: config.listPollIntervalMs }
      return { ok: true, value }
    })
  })

  ctx.on('agent/created', ({ agent }) => { attach(agent); return undefined }, { global: true })
  ctx.on('agent/status', ({ agent, status }) => {
    attach(agent)
    const entry = work.get(agent.session.id)
    if (entry === undefined) return
    if (status === 'idle') pause(entry)
    else arm(entry)
  }, { global: true })
  ctx.on('agent/disposed', ({ agent }) => {
    const entry = work.get(agent.session.id)
    if (entry === undefined) return
    pause(entry)
    work.delete(agent.session.id)
  }, { global: true })
  ctx.on('session/event', (session, event) => {
    const entry = work.get(session.id)
    if (entry !== undefined && 'surfaceOp' in event && event.surfaceOp !== undefined) entry.snapshot = undefined
  }, { global: true })
  ctx.on('llm/stream', (options: GenerateOptions, next) => {
    if (isAgentLoopRequest(options) && options.sessionId !== undefined) {
      const entry = work.get(options.sessionId)
      if (entry !== undefined && running(entry)) {
        const { signal, purpose: _purpose, ...request } = options
        const state = projection.stateOf(entry.agent.session)
        entry.snapshot = {
          request: structuredClone(request), signal, stepCount: state.stepCount,
          seq: Math.max(0, entry.agent.session.seq - 1), turn: state.turn, step: state.step,
        }
        pump()
      }
    }
    return next()
  }, { global: true, prepend: true })
  ctx.effect(() => () => {
    stopped = true
    for (const entry of work.values()) pause(entry)
    work.clear()
    return Promise.allSettled([...pending]).then(() => index.close())
  })
  for (const agent of ctx.agents.list()) attach(agent)
}
