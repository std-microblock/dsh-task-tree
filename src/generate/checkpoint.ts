/** Rolling checkpoint planning for checkpoint-mode requests. */
import type { RequestMessage } from '@deepseek-ai/dsh-llm'
import { prefixHash, snapBoundary } from './transcript.ts'

/** Latest checkpoint as folded from the Session log. */
export interface CheckpointState {
  id: string
  boundary: number
  prefixHash: string
  summary: string
}

/** Checkpoint cadence and rendering limits. */
export interface CheckpointConfig {
  /** Messages after the boundary that trigger a new checkpoint when exceeded. */
  everyMessages: number
  /** Messages kept verbatim after a new boundary. */
  keepMessages: number
  summaryMaxTokens: number
  toolResultMaxChars: number
  chunkMaxChars: number
}

/** What to do before a checkpoint-mode report. */
export type CheckpointPlan =
  | { kind: 'use'; checkpoint: CheckpointState | undefined }
  | { kind: 'advance'; base: CheckpointState | undefined; from: number; boundary: number }

/**
 * Decide whether the current checkpoint still describes the captured messages and whether to move it.
 * A checkpoint whose summarized prefix no longer matches (after the agent's own compaction, a fork, or a
 * resume) is discarded, and the summary is rebuilt from the first message.
 * @param messages - captured agent-loop messages.
 * @param current - latest checkpoint, when one exists.
 * @param config - cadence.
 * @returns the plan.
 */
export function planCheckpoint(messages: readonly RequestMessage[], current: CheckpointState | undefined, config: CheckpointConfig): CheckpointPlan {
  const valid = current !== undefined && current.boundary < messages.length && prefixHash(messages, current.boundary) === current.prefixHash
  const base = valid ? current : undefined
  const from = base?.boundary ?? 0
  if (messages.length - from <= config.everyMessages) return { kind: 'use', checkpoint: base }
  const boundary = snapBoundary(messages, messages.length - config.keepMessages, from)
  if (boundary === undefined) return { kind: 'use', checkpoint: base }
  return { kind: 'advance', base, from, boundary }
}
