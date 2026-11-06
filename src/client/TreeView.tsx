/** Compact task tree shared by the dock card and the floating card. */
import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  AnimatedRows, IconChevronDownOutlineRegular, IconChevronRightOutlineRegular, StateDot, TextShimmer,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { visibleRows, type Tree, type TreeNode, type TreeRow } from '../tree.ts'
import { DecisionList, type DecisionInsert } from './decisions.tsx'
import type { JumpTarget } from './hooks.ts'
import type { Translate } from './locales.ts'
import { ScrollGroup } from './ScrollGroup.tsx'

/** Rows of the latest level visible without scrolling: its three newest rows. */
const VISIBLE_LATEST = 3

/** Props of {@link TreeView}. */
export interface TreeViewProps extends DecisionInsert {
  readonly tree: Tree
  /** Session shown; resets row motion when it changes. */
  readonly sessionId: string
  /** Whether the tree reflects the latest report rather than a scrolled-back position. */
  readonly live: boolean
  /** Whether the Session's agent is running; the active item animates only then. */
  readonly running: boolean
  readonly onJump: (target: JumpTarget) => void
  readonly t: Translate
}

const STATUS_LABEL = {
  done: 'tree.status.done', active: 'tree.status.active', current: 'tree.status.current', pending: 'tree.status.pending',
} as const

/**
 * Glyph drawn for one item status.
 * @param props.status - item status.
 * @param props.running - whether the active item animates.
 * @returns the decorative status mark.
 */
export function StatusMark({ status, running }: { status: TreeNode['status']; running: boolean }) {
  switch (status) {
    case 'done': return <CheckMark />
    case 'active': return running ? <StateDot state="ongoing" size={12} /> : <span className="dsh-task-tree-active-dot" aria-hidden="true" />
    case 'current': return <span className="dsh-task-tree-step-dot" aria-hidden="true" />
    case 'pending': return <span className="dsh-task-tree-pending-dot" aria-hidden="true" />
    /* v8 ignore next -- closed NodeStatus union */
    default: return null
  }
}

/** @returns a neutral check whose stroke draws in when it first appears. */
export function CheckMark() {
  return <svg className="dsh-task-tree-check" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <circle className="dsh-task-tree-check-ring" cx="8" cy="8" r="6.5" />
    <path className="dsh-task-tree-check-path" d="M5 8.3 7.1 10.4 11 6" pathLength={1} />
  </svg>
}

function depthStyle(depth: number): CSSProperties {
  return { '--dsh-task-tree-depth': depth } as CSSProperties
}

function flip(set: ReadonlySet<string>, key: string): ReadonlySet<string> {
  const next = new Set(set)
  if (!next.delete(key)) next.add(key)
  return next
}

/**
 * Render the compact rows of a derived tree. An item with children toggles
 * its children; a leaf item reveals where it started. The latest level scrolls
 * inside its own viewport showing the newest items.
 * @param props - tree, Session, live state, jump and insertion actions, and copy.
 * @returns the row list.
 */
export function TreeView({ tree, sessionId, live, running, onJump, onInsert, insertDisabled, t }: TreeViewProps) {
  const [toggled, setToggled] = useState<ReadonlySet<string>>(() => new Set())
  const [openDecisions, setOpenDecisions] = useState<ReadonlySet<string>>(() => new Set())
  const rows = useMemo(() => visibleRows(tree, { toggled }), [tree, toggled])
  const toggle = (key: string) => { setToggled(current => flip(current, key)) }
  const renderRow = (row: TreeRow) => <NodeRow key={row.node.key} row={row} running={running} onJump={onJump} onToggle={toggle} t={t}
    decisionsOpen={openDecisions.has(row.node.key)} onInsert={onInsert} insertDisabled={insertDisabled}
    onToggleDecisions={() => { setOpenDecisions(current => flip(current, row.node.key)) }} />
  const contentKey = `${tree.latest?.seq ?? ''}:${rows.length}:${[...openDecisions].join('|')}`
  const blocks: ReactNode[] = []
  for (let index = 0; index < rows.length;) {
    const row = rows[index] as TreeRow
    const group = row.scrollGroup
    if (group === undefined) {
      blocks.push(renderRow(row))
      index++
      continue
    }
    const members: TreeRow[] = []
    while (index < rows.length && (rows[index] as TreeRow).scrollGroup === group) members.push(rows[index++] as TreeRow)
    const level = members.filter(member => member.depth === (members[0] as TreeRow).depth)
    const anchor = level[Math.max(0, level.length - VISIBLE_LATEST)] as TreeRow
    blocks.push(<ScrollGroup key={group} anchorKey={anchor.node.key} contentKey={contentKey}>{members.map(renderRow)}</ScrollGroup>)
  }
  return <div className="dsh-task-tree-rows-frame">
    <AnimatedRows
      className="dsh-task-tree-rows"
      role="list"
      label={t('tree.label')}
      rowKeys={rows.map(row => row.node.key)}
      ready
      resetKey={`${sessionId}:${live ? 'live' : 'past'}`}
    >
      {blocks}
    </AnimatedRows>
  </div>
}

function NodeRow({ row, running, onJump, onToggle, t, decisionsOpen, onToggleDecisions, onInsert, insertDisabled }: {
  row: TreeRow
  running: boolean
  onJump: (target: JumpTarget) => void
  onToggle: (key: string) => void
  t: Translate
  decisionsOpen: boolean
  onToggleDecisions: () => void
} & DecisionInsert) {
  const { node } = row
  const decisions = node.decisions.length
  const status = t(STATUS_LABEL[node.status])
  const title = node.status === 'active' ? <TextShimmer active={running}>{node.title}</TextShimmer> : node.title
  return <div role="listitem" data-row-key={node.key} data-status={node.status}
    className="dsh-task-tree-row" style={depthStyle(row.depth)}>
    <div className="dsh-task-tree-line">
      {row.expandable
        ? <button type="button" className="dsh-task-tree-item" data-expandable="" data-expanded={row.expanded || undefined}
          data-partial={row.partial || undefined}
          aria-expanded={row.expanded} aria-label={t(row.expanded ? 'tree.collapse' : 'tree.expand', { title: node.title })}
          onClick={() => { onToggle(node.key) }}>
          <span className="dsh-task-tree-glyph" role="img" aria-label={status}>
            <span className="dsh-task-tree-glyph-status"><StatusMark status={node.status} running={running} /></span>
            <span className="dsh-task-tree-glyph-chevron" aria-hidden="true">
              {row.expanded ? <IconChevronDownOutlineRegular size={14} /> : <IconChevronRightOutlineRegular size={14} />}
            </span>
          </span>
          <span className="dsh-task-tree-title">{title}</span>
        </button>
        : <button type="button" className="dsh-task-tree-item" title={t('tree.jump')}
          onClick={() => { onJump({ recordId: node.firstRecordId, contextSeq: node.firstContextSeq, turn: node.firstTurn }) }}>
          <span className="dsh-task-tree-glyph" role="img" aria-label={status}>
            <StatusMark status={node.status} running={running} />
          </span>
          <span className="dsh-task-tree-title">{title}</span>
        </button>}
      {decisions > 0 && <button type="button" className="dsh-task-tree-badge" aria-expanded={decisionsOpen}
        aria-label={t('tree.decisions', { count: decisions })} onClick={onToggleDecisions}>
        {decisions}
      </button>}
    </div>
    {node.status === 'active' && node.detail !== undefined && <p className="dsh-task-tree-detail">{node.detail}</p>}
    {decisionsOpen && <div className="dsh-task-tree-row-decisions">
      <DecisionList decisions={node.decisions.map((decision, index) => ({ key: `${decision.recordId}:${index}`, text: decision.text }))}
        onInsert={onInsert} insertDisabled={insertDisabled} t={t} />
    </div>}
  </div>
}
