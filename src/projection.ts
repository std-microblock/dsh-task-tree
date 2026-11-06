/** Session projection of task-tree reports, cadence counters, checkpoints, and plugin-written titles. */
import { z } from 'zod'
import type { ProjectionDefinition } from '@deepseek-ai/dsh-session-projection'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { GENERATION_MODES, readCheckpoint, readResult, readTitle } from './records.ts'
import type { TaskTreeView, TreeRecord } from './projection-types.ts'
import type { CheckpointState } from './generate/checkpoint.ts'

const treeRecordSchema = z.object({
  id: z.string(),
  seq: z.number().int().nonnegative(),
  contextSeq: z.number().int().nonnegative(),
  coveredTurn: z.number().int().nonnegative().optional(),
  mode: z.enum(GENERATION_MODES),
  path: z.array(z.string()),
  previousPath: z.array(z.string()),
  detail: z.string(),
  decisions: z.array(z.string()),
})
const viewSchema = z.object({ records: z.array(treeRecordSchema) })
const stateSchema = z.object({
  sessionId: z.string(),
  inherited: z.number().int().nonnegative(),
  turn: z.number().int().nonnegative().optional(),
  step: z.number().int().nonnegative().optional(),
  stepCount: z.number().int().nonnegative(),
  covered: z.number().int().nonnegative(),
  view: viewSchema,
  checkpoint: z.object({ id: z.string(), boundary: z.number().int().positive(), prefixHash: z.string(), summary: z.string() }).optional(),
  lastTitle: z.string().optional(),
})
/** Folded task-tree state. */
export interface TaskTreeState {
  sessionId: string
  inherited: number
  /** Turn and step of the latest `step/start`. */
  turn?: number | undefined
  step?: number | undefined
  /** Completed steps owned by this Session, excluding a fork-inherited prefix. */
  stepCount: number
  /** `stepCount` covered by the latest successful report of this Session. */
  covered: number
  view: TaskTreeView
  checkpoint?: CheckpointState | undefined
  /** Latest title this plugin wrote. */
  lastTitle?: string | undefined
}

/**
 * Fold one committed event.
 * @param state - previous state.
 * @param event - committed event.
 * @returns next state, the same reference for unrelated events.
 */
export function applyTaskTree(state: TaskTreeState, event: SessionEvent): TaskTreeState {
  if (event.type === 'step/start') return { ...state, turn: event.data.turn, step: event.data.step }
  if (event.type === 'step/end') return event.seq < state.inherited ? state : { ...state, stepCount: state.stepCount + 1 }
  const result = readResult(event)
  if (result !== undefined) {
    const record: TreeRecord = {
      id: result.id, seq: event.seq, contextSeq: result.contextSeq, mode: result.mode,
      ...result.coveredTurn === undefined ? {} : { coveredTurn: result.coveredTurn },
      path: result.path, previousPath: result.previousPath, detail: result.detail, decisions: result.decisions,
    }
    const own = result.sessionId === state.sessionId && event.seq >= state.inherited
    return {
      ...state,
      view: { records: [...state.view.records, record] },
      covered: own ? Math.max(state.covered, Math.min(state.stepCount, result.coveredStepCount)) : state.covered,
    }
  }
  const checkpoint = readCheckpoint(event)
  if (checkpoint !== undefined) {
    return { ...state, checkpoint: { id: checkpoint.id, boundary: checkpoint.boundary, prefixHash: checkpoint.prefixHash, summary: checkpoint.summary } }
  }
  const title = readTitle(event)
  if (title !== undefined) return { ...state, lastTitle: title }
  return state
}

type Definition = ProjectionDefinition<'taskTree', TaskTreeState>

/** Client-visible `taskTree` unit; the view keeps its reference until a report lands. */
export const taskTreeProjection: Omit<Definition, 'wire'> & { wire: NonNullable<Definition['wire']> } = {
  key: 'taskTree',
  stateVersion: 1,
  stateSchema,
  init: (header, inherited) => ({ sessionId: header.id, inherited, stepCount: 0, covered: 0, view: { records: [] } }),
  apply: applyTaskTree,
  wire: { viewSchema, view: state => state.view, summary: false },
}
