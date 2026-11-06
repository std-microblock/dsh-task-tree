/** Durable cross-session index of the latest report per Session. */
import { z } from 'zod'
import { defineDomain, domainTable } from '@deepseek-ai/dsh-storage-domain'
import type { TaskIndexRow } from './projection-types.ts'
import { taskIndexRowSchema } from './protocol.ts'

const rowSchema: z.ZodType<TaskIndexRow> = taskIndexRowSchema

/** Storage domain holding one row per Session that produced a report. */
export const taskIndexSpec = defineDomain({
  name: 'task_tree',
  version: 1,
  layout: 'per-record',
  invalidRecords: 'backup-and-skip',
  tables: { sessions: domainTable<string, TaskIndexRow>(rowSchema) },
})
