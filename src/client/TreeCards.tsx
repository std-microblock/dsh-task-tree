/** Dock card above the composer and floating card over the transcript, both showing one Session's tree. */
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import {
  IconChecklistOutlineRegular, IconChevronDownOutlineRegular, IconChevronUpOutlineRegular, IconCloseOutlineRegular,
  IconPinOutlineRegular, IconRightUpOutlineRegular, IconWorkspaceTreeOutlineRegular, TextShimmer, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import { buildTree, type Tree } from '../tree.ts'
import type { TreeRecord } from '../projection-types.ts'
import { conversationContainer } from './anchors.ts'
import { useDecisionInsert, type DecisionInsert } from './decisions.tsx'
import { useJump, useMarkSeen, useReadingCutoff } from './hooks.ts'
import type { Translate } from './locales.ts'
import type { DisplayMode, ViewStore } from './stores.ts'
import { TreeView } from './TreeView.tsx'

/** Callbacks and sources shared by the dock entry and the header utility. */
export interface TreeCardsInjected {
  readonly hooks: { readonly view: ViewStore }
  readonly setMode: (mode: DisplayMode) => void
  readonly setDockExpanded: (expanded: boolean) => void
  readonly setFloatOpen: (open: boolean) => void
  readonly markSeen: (sessionId: string, seq: number) => void
  readonly ensureLoaded: (sessionId: string, seq: number) => Promise<void>
  /** @param sessionId - Session whose composer takes focus. */
  readonly focusComposer: (sessionId: string) => void
}

type CardFace = InjectFace<TreeCardsInjected> & { t: Translate }

/** Props of the `conversation.input.dock` entry. */
export type DockEntryProps = PropsRuntime<'conversation.input.dock'> & CardFace
/** Props of the `conversation.session.header.utilities` entry. */
export type FloatEntryProps = PropsRuntime<'conversation.session.header.utilities'> & CardFace

const NO_RECORDS: readonly TreeRecord[] = Object.freeze([])

interface CardModel {
  readonly tree: Tree
  readonly live: boolean
  readonly latestSeq: number | undefined
  readonly backToLatest: () => void
  readonly jump: ReturnType<typeof useJump>
  readonly insert: DecisionInsert
}

function useCardModel(props: (DockEntryProps | FloatEntryProps) & { records: readonly TreeRecord[]; running: boolean }): CardModel {
  const { sessionId, records, running, useView, ensureLoaded, focusComposer, useInput, inputActions } = props
  const follow = useView(view => view.followScroll)
  const { cutoff, backToLatest } = useReadingCutoff(sessionId, records, follow)
  const latestSeq = records[records.length - 1]?.seq
  const live = cutoff === undefined || latestSeq === undefined || cutoff >= latestSeq
  // A stopped Session reads as finished; a scrolled-back view shows later items as pending.
  const tree = useMemo(() => buildTree(records, live ? { settled: !running } : { cutoffSeq: cutoff }), [records, live, cutoff, running])
  const jump = useJump(sessionId, ensureLoaded)
  const focus = useCallback(() => { focusComposer(sessionId) }, [focusComposer, sessionId])
  const insert = useDecisionInsert({ useInput, inputActions, focusComposer: focus })
  return { tree, live, latestSeq, backToLatest, jump, insert }
}

function headerTitle(tree: Tree): string {
  const key = tree.activeKey ?? tree.activeKeys[tree.activeKeys.length - 1]
  return key === undefined ? '' : tree.byKey.get(key)?.title ?? ''
}

function SnapshotPill({ onClick, t }: { onClick: () => void; t: Translate }) {
  return <button type="button" className="dsh-task-tree-pill" onClick={onClick}>
    <span>{t('tree.snapshot')}</span>
    <span className="dsh-task-tree-pill-dot" aria-hidden="true" />
    <span className="dsh-task-tree-pill-action">{t('tree.backToLatest')}</span>
  </button>
}

function ModeButton({ mode, onClick, t }: { mode: DisplayMode; onClick: () => void; t: Translate }) {
  const label = t(mode === 'dock' ? 'mode.toFloating' : 'mode.toDock')
  return <Tooltip label={label} side="bottom" portal>
    <button type="button" className="dsh-task-tree-icon-button" aria-label={label} onClick={onClick}>
      {mode === 'dock' ? <IconRightUpOutlineRegular size={14} /> : <IconPinOutlineRegular size={14} />}
    </button>
  </Tooltip>
}

/**
 * Dock entry: a collapsible card above the composer while the dock mode is selected.
 * @param props - framework Session seats, preference, callbacks, and copy.
 * @returns the card, or nothing without reports or in floating mode.
 */
export function DockEntry(props: DockEntryProps) {
  const records = props.useProjection('taskTree', value => value?.records ?? NO_RECORDS)
  const mode = props.useView(view => view.mode)
  if (mode !== 'dock' || records.length === 0) return null
  return <DockCard {...props} records={records} />
}

function DockCard(props: DockEntryProps & { records: readonly TreeRecord[] }) {
  const { sessionId, useSession, useView, setDockExpanded, setMode, markSeen, t } = props
  const expanded = useView(view => view.dockExpanded)
  const running = useSession(session => session.running)
  const model = useCardModel({ ...props, running })
  useMarkSeen(sessionId, model.latestSeq, markSeen)
  const title = headerTitle(model.tree)
  const bodyId = `dsh-task-tree-dock-${sessionId}`
  const toggleLabel = t(expanded ? 'dock.collapse' : 'dock.expand')
  return <section className="dsh-task-tree-dock" aria-label={t('tree.label')} data-expanded={expanded || undefined}>
    <div className="dsh-task-tree-card-header">
      <button type="button" className="dsh-task-tree-card-toggle" aria-expanded={expanded} aria-controls={bodyId}
        aria-label={toggleLabel} onClick={() => { setDockExpanded(!expanded) }}>
        <span className="dsh-task-tree-card-lead" aria-hidden="true"><IconChecklistOutlineRegular size={16} /></span>
        <span className="dsh-task-tree-card-title"><TextShimmer active={running && model.live}>{title}</TextShimmer></span>
      </button>
      {!model.live && <SnapshotPill onClick={model.backToLatest} t={t} />}
      <ModeButton mode="dock" onClick={() => { setMode('floating') }} t={t} />
      <button type="button" className="dsh-task-tree-icon-button" aria-hidden="true" tabIndex={-1}
        onClick={() => { setDockExpanded(!expanded) }}>
        {expanded ? <IconChevronDownOutlineRegular size={14} /> : <IconChevronUpOutlineRegular size={14} />}
      </button>
    </div>
    <div className="dsh-task-tree-collapse" id={bodyId} data-open={expanded || undefined}>
      <div className="dsh-task-tree-collapse-inner" {...(expanded ? {} : { inert: '' })}>
        <div className="dsh-task-tree-scroll">
          <TreeView tree={model.tree} sessionId={sessionId} live={model.live} running={running} onJump={model.jump}
            {...model.insert} t={t} />
        </div>
      </div>
    </div>
  </section>
}

/**
 * Header utility: toggles the floating card while the floating mode is selected.
 * @param props - framework Session seats, preference, callbacks, and copy.
 * @returns the toggle and its portaled card, or nothing.
 */
export function FloatEntry(props: FloatEntryProps) {
  const records = props.useProjection('taskTree', value => value?.records ?? NO_RECORDS)
  const mode = props.useView(view => view.mode)
  const openState = props.useSession(session => session.openState)
  const open = props.useView(view => view.floatOpen)
  if (mode !== 'floating' || openState !== 'open' || records.length === 0) return null
  const label = props.t(open ? 'float.hide' : 'float.show')
  return <>
    <Tooltip label={label} side="bottom" align="end" portal>
      <button type="button" className="dsh-task-tree-header-toggle" aria-label={label} aria-pressed={open}
        onClick={() => { props.setFloatOpen(!open) }}>
        <IconWorkspaceTreeOutlineRegular size={16} />
      </button>
    </Tooltip>
    <FloatCard {...props} records={records} open={open} />
  </>
}

interface Placement { top: number; left: number; width: number; maxHeight: number }
const INSET = 12
const WIDTH = 320

function useContainerPlacement(sessionId: string): Placement | undefined {
  const [placement, setPlacement] = useState<Placement>()
  useEffect(() => {
    // The card is portaled to the body to escape the transcript's clipping, so
    // its fixed position follows the Session's content box in pixels.
    let observed: HTMLElement | null = null
    const observer = new ResizeObserver(() => { measure() })
    function measure() {
      const container = conversationContainer(sessionId)
      if (container !== observed) {
        if (observed !== null) observer.unobserve(observed)
        observed = container
        if (container !== null) observer.observe(container)
      }
      if (container === null) {
        setPlacement(undefined)
        return
      }
      const rect = container.getBoundingClientRect()
      const width = Math.max(0, Math.min(WIDTH, rect.width - INSET * 2))
      const next = { top: rect.top + INSET, left: rect.right - INSET - width, width, maxHeight: Math.max(0, rect.height / 2) }
      setPlacement(current => current !== undefined && current.top === next.top && current.left === next.left
        && current.width === next.width && current.maxHeight === next.maxHeight ? current : next)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [sessionId])
  return placement
}

function FloatCard(props: FloatEntryProps & { records: readonly TreeRecord[]; open: boolean }) {
  const { sessionId, open, useSession, setFloatOpen, setMode, markSeen, t } = props
  const running = useSession(session => session.running)
  const model = useCardModel({ ...props, running })
  useMarkSeen(sessionId, open ? model.latestSeq : undefined, markSeen)
  const placement = useContainerPlacement(sessionId)
  if (placement === undefined) return null
  const style: CSSProperties = {
    top: placement.top, left: placement.left, width: placement.width, maxHeight: placement.maxHeight,
  }
  return createPortal(<section className="dsh-task-tree-float" style={style} data-open={open || undefined}
    aria-label={t('tree.label')} aria-hidden={!open || undefined} {...(open ? {} : { inert: '' })}>
    <div className="dsh-task-tree-card-header">
      <span className="dsh-task-tree-card-lead" aria-hidden="true"><IconChecklistOutlineRegular size={16} /></span>
      <span className="dsh-task-tree-card-title"><TextShimmer active={running && model.live}>{headerTitle(model.tree)}</TextShimmer></span>
      <ModeButton mode="floating" onClick={() => { setMode('dock') }} t={t} />
      <Tooltip label={t('float.close')} side="bottom" align="end" portal>
        <button type="button" className="dsh-task-tree-icon-button" aria-label={t('float.close')}
          onClick={() => { setFloatOpen(false) }}>
          <IconCloseOutlineRegular size={14} />
        </button>
      </Tooltip>
    </div>
    {!model.live && <div className="dsh-task-tree-pill-row"><SnapshotPill onClick={model.backToLatest} t={t} /></div>}
    <div className="dsh-task-tree-scroll dsh-task-tree-float-scroll">
      <TreeView tree={model.tree} sessionId={sessionId} live={model.live} running={running} onJump={model.jump}
        {...model.insert} t={t} />
    </div>
  </section>, document.body)
}
