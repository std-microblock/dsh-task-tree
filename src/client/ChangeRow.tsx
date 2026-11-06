/** Work-details row announcing a task-path change or new decisions. */
import { useCallback, useMemo } from 'react'
import { DisclosureRow, IconListPenOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import { samePath } from '../records.ts'
import type { TaskChangeData } from './definition.ts'
import { DecisionList, useDecisionInsert, type DecisionInsert } from './decisions.tsx'
import type { Translate } from './locales.ts'

const ICON = <IconListPenOutlineRegular size={14} />

/**
 * Index of the first path segment that differs from the previous path.
 * @param path - reported path.
 * @param previousPath - path of the preceding report.
 * @returns the index; equal to `path.length` when nothing changed.
 */
export function firstChangedSegment(path: readonly string[], previousPath: readonly string[]): number {
  let index = 0
  while (index < path.length && path[index] === previousPath[index]) index++
  return index
}

/** Props of {@link ChangeRow}. */
export interface ChangeRowProps extends DecisionInsert {
  readonly data: TaskChangeData
  readonly expanded: boolean
  readonly onToggle: () => void
  readonly t: Translate
}

/**
 * Render one change as a reasoning-style disclosure row.
 * @param props - change data, disclosure state, decision insertion, and copy.
 * @returns the row; its root carries the record id and seq used by scroll sync and jumps.
 */
export function ChangeRow({ data, expanded, onToggle, onInsert, insertDisabled, t }: ChangeRowProps) {
  const pathChanged = !samePath(data.path, data.previousPath)
  const changedFrom = firstChangedSegment(data.path, data.previousPath)
  const deepest = data.path[data.path.length - 1] ?? ''
  const title = pathChanged ? t('change.title') : t('change.decisions', { count: data.decisions.length })
  const collapsed = useMemo(() => <>
    <span className="dsh-task-tree-change-separator" data-shimmer-decoration aria-hidden="true" />
    <span className="dsh-task-tree-change-summary" data-changed={pathChanged || undefined}>{deepest}</span>
  </>, [deepest, pathChanged])
  return <div className="dsh-task-tree-change" data-task-tree-record={data.id} data-task-tree-seq={data.seq}
    data-expanded={expanded || undefined}>
    <DisclosureRow icon={ICON} title={title} open={expanded} expandable expandOnRowClick onToggle={onToggle}
      collapsedContent={collapsed} titleClassName="dsh-task-tree-change-title">
      <div className="dsh-task-tree-change-body">
        <ol className="dsh-task-tree-crumbs" aria-label={t('change.path')}>
          {data.path.map((segment, index) => <li key={index} data-changed={pathChanged && index >= changedFrom || undefined}>
            {segment}
          </li>)}
        </ol>
        <p className="dsh-task-tree-change-detail">{data.detail}</p>
        {data.decisions.length > 0 && <DecisionList t={t} onInsert={onInsert} insertDisabled={insertDisabled}
          decisions={data.decisions.map((text, index) => ({ key: String(index), text }))} />}
      </div>
    </DisclosureRow>
  </div>
}

/** Composer focus supplied by the registration. */
export interface ChangeNodeInjected {
  /** @param sessionId - Session whose composer takes focus. */
  readonly focusComposer: (sessionId: string) => void
}

/** Props of the keyed Chat renderer. */
export type ChangeNodeProps = PropsRuntime<'conversation.chat.node', 'task-tree-change'> & ChangeNodeInjected & { t: Translate }

/**
 * Keyed `conversation.chat.node` renderer; the disclosure resets with its enclosing Turn.
 * @param props - framework node and composer seats, focus callback, and copy.
 * @returns the change row.
 */
export function ChangeNode({ node, sessionId, useDisclosure, useInput, inputActions, focusComposer, t }: ChangeNodeProps) {
  const { expanded, toggle } = useDisclosure()
  const focus = useCallback(() => { focusComposer(sessionId) }, [focusComposer, sessionId])
  const insert = useDecisionInsert({ useInput, inputActions, focusComposer: focus })
  return <ChangeRow data={node.data} expanded={expanded} onToggle={toggle} {...insert} t={t} />
}
