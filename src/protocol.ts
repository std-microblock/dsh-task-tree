/** Validated messages on the plugin's authenticated Connection RPC routes. */
import { z } from 'zod'

/** Connection owns authentication, correlation, transport, and cancellation. */
export const TASK_TREE_CHANNEL = '/api'
/** Cross-session task list. */
export const LIST_METHOD = 'task-tree/list'
/** Untrusted browser input of the list method. */
export const listRequestSchema = z.object({}).strict()

const rowSchema = z.object({
  sessionId: z.string().min(1),
  rootTitle: z.string(),
  path: z.array(z.string()),
  detail: z.string(),
  doneCount: z.number().int().nonnegative(),
  totalCount: z.number().int().nonnegative(),
  lastRecordSeq: z.number().int().nonnegative(),
  updatedAt: z.number().nonnegative(),
})
/** Stored and transmitted cross-session row. */
export const taskIndexRowSchema = rowSchema
/** List response received by the browser. */
export const listResponseSchema = z.object({
  rows: z.array(rowSchema),
  pollIntervalMs: z.number().int().positive(),
})
