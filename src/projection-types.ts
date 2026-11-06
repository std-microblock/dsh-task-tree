/** Client-visible task-tree projection key and its wire view; free of Host runtime imports. */
import type { SessionProjectionSummaryExcluded } from '@deepseek-ai/dsh-session-projection/types'
import type { GenerationMode } from './records.ts'

/** One successful report as published to the Client and folded into the tree. */
export interface TreeRecord {
  /** Report id shared with the Chat row. */
  id: string
  /** Session seq of the result record itself. */
  seq: number
  /** Session seq of the last event visible to the reported context. */
  contextSeq: number
  coveredTurn?: number | undefined
  mode: GenerationMode
  path: string[]
  previousPath: string[]
  detail: string
  decisions: string[]
}

/** Wire value of the `taskTree` projection. */
export interface TaskTreeView {
  records: TreeRecord[]
}

declare module '@deepseek-ai/dsh-session-projection/types' {
  interface SessionProjectionMap {
    /** Successful task-tree reports of this Session in log order; excluded from Session list summaries. */
    taskTree: SessionProjectionSummaryExcluded<TaskTreeView>
  }
}

/** Cross-session row returned by the list RPC and kept in the Host storage index. */
export interface TaskIndexRow {
  sessionId: string
  /** Top-level item of the latest report. */
  rootTitle: string
  path: string[]
  detail: string
  doneCount: number
  totalCount: number
  /** Session seq of the latest result record; the Client compares it with what the user has seen. */
  lastRecordSeq: number
  /** Epoch milliseconds of the latest report. */
  updatedAt: number
}

/** Response of the list RPC. */
export interface TaskListResponse {
  rows: TaskIndexRow[]
  pollIntervalMs: number
}
