/** Chat rows for reports that move the current task path or add decisions. */
import type { ConversationNodeDefinition } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { ChatConversationViewNode } from '@deepseek-ai/dsh-client-ui-chat/client'
import { readResult, samePath, type EventLike } from '../records.ts'

/** Payload of one task-change Chat row. */
export interface TaskChangeData {
  /** Report id shared with the tree's `firstRecordId`. */
  readonly id: string
  /** Session seq of the result record. */
  readonly seq: number
  readonly path: readonly string[]
  readonly previousPath: readonly string[]
  readonly detail: string
  readonly decisions: readonly string[]
}

declare module '@deepseek-ai/dsh-client-ui-chat/client' {
  interface ChatNodeDataMap {
    'task-tree-change': TaskChangeData
  }
}

/** Chat renderer kind and Definition kind. */
export const CHANGE_KIND = 'task-tree-change'

interface ChangeState { contextSeq: number; data: TaskChangeData }

/**
 * Read a result that the Chat row presents.
 * @param event - Client event envelope.
 * @returns row state, or undefined for unrelated events and reports without a visible change.
 */
function changeOf(event: EventLike): ChangeState | undefined {
  const result = readResult(event)
  if (result === undefined) return undefined
  if (samePath(result.path, result.previousPath) && result.decisions.length === 0) return undefined
  return {
    contextSeq: result.contextSeq,
    data: {
      id: result.id, seq: event.seq ?? result.contextSeq, path: result.path, previousPath: result.previousPath,
      detail: result.detail, decisions: result.decisions,
    },
  }
}

/**
 * One row per report that changes the path or adds decisions. The row joins the
 * work-details run of the Step its record landed in (no `groupTree`) and sorts
 * just after the context the report describes.
 */
export const taskChangeDefinition: ConversationNodeDefinition<ChangeState> = {
  kind: CHANGE_KIND,
  target: 'chat',
  match: (event) => {
    const change = changeOf(event)
    return change === undefined ? null : { id: change.data.id, role: 'start' }
  },
  start: (_context, match) => {
    const change = changeOf(match.event)
    /* v8 ignore next -- match() accepted this event, so it parses again */
    if (change === undefined) throw new Error('task-tree: invalid result record')
    return change
  },
  update: context => context.state,
  buildViewNode: (context): ChatConversationViewNode | null => {
    const state = context.state
    if (state === undefined) return null
    return {
      key: context.key,
      kind: CHANGE_KIND,
      id: context.id,
      target: 'chat',
      anchorSeq: state.contextSeq + 0.5,
      location: context.start?.location ?? context.matches[0]?.location ?? { kind: 'unresolved' },
      visibility: 'visible',
      data: state.data,
    }
  },
}
