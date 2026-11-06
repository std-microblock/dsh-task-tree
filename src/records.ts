/** Versioned, ignorable task-tree records; none are part of the model conversation. */
import { z } from 'zod'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { Branded } from '@deepseek-ai/dsh-brand'
import type { ContentBlock, TokenUsage } from '@deepseek-ai/dsh-llm'

/** Identity of one auxiliary request and its settlement. */
export type ReportId = Branded<'TaskTreeReportId'>
/** Identity of one rolling-summary checkpoint. */
export type CheckpointId = Branded<'TaskTreeCheckpointId'>

/** How the auxiliary request is built. */
export const GENERATION_MODES = ['fork', 'fork-cheap', 'checkpoint'] as const
/** One of {@link GENERATION_MODES}. */
export type GenerationMode = typeof GENERATION_MODES[number]

/** Exact provider route of one auxiliary call. */
export const routeSchema = z.object({
  provider: z.string().min(1),
  model: z.string().min(1),
  reasoningEffort: z.string().min(1).optional(),
}).strict()
/** Provider route recorded with each request. */
export type Route = z.infer<typeof routeSchema>

const itemTitle = z.string().trim().min(1).max(120)

/** Answer validated from model JSON before normalization. */
export const modelAnswerSchema = z.object({
  path: z.array(itemTitle).min(1),
  detail: z.string().trim().min(1).max(400),
  decisions: z.array(z.string().trim().min(1).max(400)).default([]),
})
/** Parsed model answer. */
export type ModelAnswer = z.infer<typeof modelAnswerSchema>

/** Persisted successful report fields consumed by the tree, the Client, and the index. */
export const resultSchema = z.object({
  version: z.literal(1),
  id: z.string().min(1),
  sessionId: z.string().min(1),
  mode: z.enum(GENERATION_MODES),
  /** Session seq of the last event visible to the captured context. */
  contextSeq: z.number().int().nonnegative(),
  coveredStepCount: z.number().int().nonnegative(),
  /** Turn and step current when the context was captured; named to stay out of Conversation coordinates. */
  coveredTurn: z.number().int().nonnegative().optional(),
  coveredStep: z.number().int().nonnegative().optional(),
  path: z.array(z.string().min(1)).min(1),
  previousPath: z.array(z.string().min(1)),
  detail: z.string().min(1),
  decisions: z.array(z.string().min(1)),
})
/** Validated result fields. */
export type ResultData = z.infer<typeof resultSchema>

/** Durable successful report and model accounting. */
export interface ResultRecord extends Omit<ResultData, 'id' | 'sessionId'> {
  id: ReportId
  sessionId: SessionId
  attempt: number
  route: Route
  blocks: ContentBlock[]
  usage?: TokenUsage
}

/** Exact auxiliary input appended to, or replacing, the captured context. */
export interface RequestRecord {
  version: 1
  id: ReportId
  attempt: number
  sessionId: SessionId
  mode: GenerationMode
  route: Route
  contextSeq: number
  /** Number of captured agent-loop messages the request reuses; zero in checkpoint mode. */
  reusedMessages: number
  checkpointId?: CheckpointId
  /** System text of a checkpoint-mode request; fork modes reuse the captured system message. */
  system?: string
  /** The user text appended after the reused messages, or the complete checkpoint-mode input. */
  input: string
  maxTokens?: number
}

/** Rolling summary of the captured messages before a boundary. */
export const checkpointSchema = z.object({
  version: z.literal(1),
  id: z.string().min(1),
  sessionId: z.string().min(1),
  /** Number of leading captured messages the summary replaces. */
  boundary: z.number().int().positive(),
  /** SHA-256 of the canonical JSON of the summarized messages. */
  prefixHash: z.string().regex(/^[0-9a-f]{64}$/u),
  summary: z.string().min(1),
  basedOn: z.string().min(1).optional(),
})
/** Validated checkpoint fields. */
export type CheckpointData = z.infer<typeof checkpointSchema>
/** Durable checkpoint and model accounting. */
export interface CheckpointRecord extends Omit<CheckpointData, 'id' | 'sessionId' | 'basedOn'> {
  id: CheckpointId
  sessionId: SessionId
  basedOn?: CheckpointId
  route: Route
  /** Exact summarization inputs, one per sequential chunk. */
  inputs: string[]
  usage?: TokenUsage
}

/** Operation that failed. */
export type FailureStage = 'config' | 'checkpoint' | 'prepare' | 'request' | 'response' | 'parse' | 'persist'
/** Failed or canceled attempt; it does not move the covered-step watermark. */
export interface FailureRecord {
  version: 1
  id: ReportId
  attempt: number
  sessionId: SessionId
  stage: FailureStage
  retryable: boolean
  message: string
  canceled: boolean
  stack?: string
}

/** Title written by this plugin, so a later rename can tell it from a user's title. */
export const titleSchema = z.object({ version: z.literal(1), title: z.string().min(1) })
/** Durable title-rename marker. */
export type TitleRecord = z.infer<typeof titleSchema>

/** Record type names. */
export const RECORD = {
  request: 'plugin:task-tree/request',
  result: 'plugin:task-tree/result',
  failure: 'plugin:task-tree/failure',
  checkpoint: 'plugin:task-tree/checkpoint',
  title: 'plugin:task-tree/title',
} as const

declare module '@deepseek-ai/dsh-session/types' {
  interface PluginRecordMap {
    'plugin:task-tree/request': RequestRecord
    'plugin:task-tree/result': ResultRecord
    'plugin:task-tree/failure': FailureRecord
    'plugin:task-tree/checkpoint': CheckpointRecord
    'plugin:task-tree/title': TitleRecord
  }
}

/** Minimal event envelope readable from storage, history, or the wire. */
export interface EventLike { type: string; data: unknown; ignorable?: boolean; seq?: number }

/**
 * Read an untrusted result record without importing the Host Session runtime.
 * @param event - event envelope.
 * @returns validated result data, or undefined for any other or malformed event.
 */
export function readResult(event: EventLike): ResultData | undefined {
  if (event.type !== RECORD.result || event.ignorable !== true) return undefined
  const parsed = resultSchema.safeParse(event.data)
  return parsed.success ? parsed.data : undefined
}

/**
 * Read an untrusted checkpoint record.
 * @param event - event envelope.
 * @returns validated checkpoint data, or undefined.
 */
export function readCheckpoint(event: EventLike): CheckpointData | undefined {
  if (event.type !== RECORD.checkpoint || event.ignorable !== true) return undefined
  const parsed = checkpointSchema.safeParse(event.data)
  return parsed.success ? parsed.data : undefined
}

/**
 * Read an untrusted title marker.
 * @param event - event envelope.
 * @returns validated title, or undefined.
 */
export function readTitle(event: EventLike): string | undefined {
  if (event.type !== RECORD.title || event.ignorable !== true) return undefined
  const parsed = titleSchema.safeParse(event.data)
  return parsed.success ? parsed.data.title : undefined
}

/**
 * Whether two task paths name the same items.
 * @param a - first path.
 * @param b - second path.
 * @returns true when every segment is equal.
 */
export function samePath(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((segment, index) => segment === b[index])
}
