/** One bounded auxiliary model call that must answer with text only. */
import type { Context } from '@deepseek-ai/cordis'
import { BlockAssembler } from '@deepseek-ai/dsh-llm'
import type { ContentBlock, GenerateOptions, LlmCallConfig, TokenUsage } from '@deepseek-ai/dsh-llm'
import type { Route } from '../records.ts'

declare module '@deepseek-ai/dsh-llm/types' {
  interface LlmRequestPurposeMap {
    /** Task-tree reports and their checkpoint summaries. */
    'task-tree': true
  }
}

/** Request before route preparation; the call config fields are completed by `prepareCall`. */
export type DraftRequest = Omit<GenerateOptions, 'signal' | 'purpose'>

/** Stage reached when a call failed. */
export type CallStage = 'prepare' | 'request' | 'response' | 'parse'

/** Failure carrying the stage it happened in. */
export class CallError extends Error {
  /**
   * @param stage - operation that failed.
   * @param message - failure description.
   * @param retryable - whether another attempt may succeed with the same input.
   */
  constructor(readonly stage: CallStage, message: string, readonly retryable = false) {
    super(message)
  }
}

/** Assembled text answer. */
export interface CallResult {
  text: string
  blocks: ContentBlock[]
  usage: TokenUsage | undefined
  route: Route
  /** Prepared request exactly as dispatched, without its signal. */
  request: DraftRequest
}

/** Hooks around dispatch. */
export interface CallHooks {
  /** Runs after route preparation and before dispatch; may persist the exact request. */
  beforeDispatch?(request: DraftRequest, route: Route): Promise<void>
}

/**
 * Prepare and stream one call, rejecting tool calls and oversized output.
 * @param ctx - context exposing the LLM service.
 * @param draft - request whose call config is proposed by its provider, model, and controls.
 * @param maxResponseBytes - limit on the serialized size of received chunks.
 * @param signal - cancellation.
 * @param hooks - optional dispatch hooks.
 * @returns the assembled text answer.
 * @throws {CallError} with the failed stage.
 */
export async function callText(ctx: Context, draft: DraftRequest, maxResponseBytes: number, signal: AbortSignal, hooks: CallHooks = {}): Promise<CallResult> {
  let request: DraftRequest
  let prepared
  try {
    const config: LlmCallConfig = {
      provider: draft.provider, model: draft.model,
      ...draft.reasoningEffort === undefined ? {} : { reasoningEffort: draft.reasoningEffort },
      ...draft.temperature === undefined ? {} : { temperature: draft.temperature },
      ...draft.maxTokens === undefined ? {} : { maxTokens: draft.maxTokens },
      ...draft.stop === undefined ? {} : { stop: draft.stop },
    }
    prepared = await ctx.llm.prepareCall(config, signal)
    request = { ...draft, ...prepared.config }
  } catch (error: unknown) {
    if (signal.aborted) throw signal.reason
    throw new CallError('prepare', error instanceof Error ? error.message : String(error))
  }
  signal.throwIfAborted()
  const route: Route = {
    provider: request.provider, model: request.model,
    ...request.reasoningEffort === undefined ? {} : { reasoningEffort: request.reasoningEffort },
  }
  try {
    await hooks.beforeDispatch?.(request, route)
  } catch (error: unknown) {
    throw new CallError('request', error instanceof Error ? error.message : String(error))
  }
  signal.throwIfAborted()
  const assembler = new BlockAssembler()
  let bytes = 0
  let finished = false
  for await (const chunk of prepared.stream({ ...request, purpose: 'task-tree', signal })) {
    signal.throwIfAborted()
    bytes += Buffer.byteLength(JSON.stringify(chunk), 'utf8')
    if (bytes > maxResponseBytes) throw new CallError('response', 'response exceeded maxResponseBytes')
    if (chunk.type === 'tool-call-delta' || (chunk.type === 'block-start' && chunk.blockType === 'tool-call')) {
      throw new CallError('parse', 'the model attempted a tool call', true)
    }
    assembler.push(chunk)
    if (chunk.type === 'finish') finished = true
  }
  signal.throwIfAborted()
  if (!finished || assembler.finish.kind !== 'stop') {
    const finish = assembler.finish
    const reason = finish.kind === 'error' || finish.kind === 'aborted' ? `${finish.kind}: ${finish.failure.message}` : finish.kind
    throw new CallError('response', `the call did not finish normally (${reason})`, finish.kind === 'max-tokens')
  }
  const blocks = assembler.blocks()
  return {
    text: blocks.filter(block => block.type === 'text').map(block => block.text).join(''),
    blocks, usage: assembler.usage, route, request,
  }
}

/**
 * Extract a JSON value from model text that may be wrapped in a code fence.
 * @param text - model answer.
 * @returns parsed JSON.
 * @throws {CallError} parse-stage failure when the text is not JSON.
 */
export function parseJsonAnswer(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?\s*\n/u, '').replace(/\n?```\s*$/u, '')
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  try {
    return JSON.parse(start >= 0 && end > start ? trimmed.slice(start, end + 1) : trimmed)
  } catch (error: unknown) {
    throw new CallError('parse', `invalid JSON: ${error instanceof Error ? error.message : String(error)}`, true)
  }
}
