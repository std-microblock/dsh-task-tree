/**
 * DOM lookups that tie task-tree records to rendered Chat rows. Every query is
 * scoped to one Session's conversation content element, so several open panes
 * never read each other's rows.
 */
import type { TreeRecord } from '../projection-types.ts'

/** Distance from the scroll bottom that still counts as following the latest output. */
export const LIVE_THRESHOLD_PX = 48
/** Duration of the highlight a jump leaves on its target. */
export const FLASH_MS = 600
/** Class that plays the jump highlight. */
export const FLASH_CLASS = 'dsh-task-tree-flash'

function attributeValue(value: string): string {
  return `"${value.replace(/["\\]/gu, '\\$&')}"`
}

/**
 * Find the conversation content element of one Session.
 * @param sessionId - Session shown by the pane.
 * @param root - document or subtree to search.
 * @returns the content element, or null while the Session is not rendered.
 */
export function conversationContainer(sessionId: string, root: ParentNode = document): HTMLElement | null {
  return root.querySelector<HTMLElement>(`[data-conversation-content][data-conversation-session=${attributeValue(sessionId)}]`)
}

/**
 * Find the scrollport inside a conversation content element.
 * @param container - conversation content element.
 * @returns the scrollport, or null.
 */
export function conversationScroller(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('[data-conversation-scroll]')
}

/**
 * Whether a Chat row is laid out where the reader can see it: not hidden by a
 * collapsed Turn process and not clipped out of a capped process group body.
 * @param element - rendered row.
 * @returns whether its own position is meaningful.
 */
export function isShown(element: HTMLElement): boolean {
  if (element.closest('[hidden], [data-turn-process-hidden]') !== null) return false
  const rect = element.getBoundingClientRect()
  if (rect.height === 0) return false
  const body = element.closest<HTMLElement>('[data-step-process-body]')
  if (body === null) return true
  const bounds = body.getBoundingClientRect()
  return rect.bottom > bounds.top && rect.top < bounds.bottom
}

interface Anchors {
  rows: Map<string, HTMLElement>
  groups: Map<number, HTMLElement>
  turns: Map<number, HTMLElement>
  firstTurn: number | undefined
}

function collectAnchors(container: HTMLElement): Anchors {
  const rows = new Map<string, HTMLElement>()
  for (const row of container.querySelectorAll<HTMLElement>('[data-task-tree-record]')) {
    const id = row.dataset.taskTreeRecord
    if (id !== undefined && !rows.has(id)) rows.set(id, row)
  }
  const groups = new Map<number, HTMLElement>()
  const turns = new Map<number, HTMLElement>()
  let firstTurn: number | undefined
  for (const element of container.querySelectorAll<HTMLElement>('[data-chat-turn]')) {
    const turn = Number(element.dataset.chatTurn)
    if (!Number.isFinite(turn)) continue
    if (firstTurn === undefined || turn < firstTurn) firstTurn = turn
    if (element.hasAttribute('data-chat-group-key')) groups.set(turn, element)
    // Document order: the last element of a Turn wins.
    turns.set(turn, element)
  }
  return { rows, groups, turns, firstTurn }
}

/**
 * Vertical position at which a record counts as read, or whether it is
 * already behind the loaded window.
 */
function recordEdge(anchors: Anchors, record: Pick<TreeRecord, 'id' | 'coveredTurn'>): number | 'passed' | undefined {
  const row = anchors.rows.get(record.id)
  if (row !== undefined && isShown(row)) return row.getBoundingClientRect().top
  const turn = record.coveredTurn
  if (turn === undefined) return undefined
  const group = anchors.groups.get(turn)
  if (group !== undefined) return group.getBoundingClientRect().bottom
  const last = anchors.turns.get(turn)
  if (last !== undefined) return last.getBoundingClientRect().bottom
  if (anchors.firstTurn !== undefined && turn < anchors.firstTurn) return 'passed'
  return undefined
}

/**
 * Read the record cutoff for the current scroll position.
 * @param container - conversation content element of the Session.
 * @param records - reports in log order.
 * @returns undefined while the reader follows the bottom; otherwise the seq of
 * the last record above the reading line, or -1 when none is.
 */
export function readingCutoff(container: HTMLElement, records: readonly TreeRecord[]): number | undefined {
  const scroller = conversationScroller(container)
  if (scroller === null) return undefined
  if (scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight <= LIVE_THRESHOLD_PX) return undefined
  const composer = Number.parseFloat(getComputedStyle(scroller).getPropertyValue('--dsh-composer-height'))
  const line = scroller.getBoundingClientRect().bottom - (Number.isFinite(composer) ? composer : 0)
  const anchors = collectAnchors(container)
  let cutoff = -1
  for (const record of records) {
    const edge = recordEdge(anchors, record)
    if (edge === 'passed' || (edge !== undefined && edge <= line)) cutoff = record.seq
  }
  return cutoff
}

/**
 * Find where a task started: its own Chat row, then its Turn's process group,
 * then the last rendered row of its Turn.
 * @param container - conversation content element of the Session.
 * @param recordId - report that introduced the task.
 * @param turn - Turn current when that report's context was captured.
 * @returns the element to reveal, or undefined while nothing is rendered.
 */
export function startAnchor(container: HTMLElement, recordId: string, turn: number | undefined): HTMLElement | undefined {
  const anchors = collectAnchors(container)
  const row = anchors.rows.get(recordId)
  if (row !== undefined && isShown(row)) return row
  if (turn === undefined) return row
  const group = anchors.groups.get(turn)
  if (group !== undefined && isShown(group)) return group
  const header = container.querySelector<HTMLElement>(`button[data-turn-process=${attributeValue(String(turn))}]`)
  return header ?? group ?? anchors.turns.get(turn) ?? row
}

/** Longest wait for an expanded container to lay out its rows. */
export const REVEAL_TIMEOUT_MS = 600
/** Longest wait for loaded history to render the target's Turn. */
export const COMMIT_TIMEOUT_MS = 3000

/** Frame scheduler, replaceable in tests. */
export type FrameScheduler = (callback: () => void) => void

const nextFrame: FrameScheduler = callback => { requestAnimationFrame(() => { callback() }) }

function waitUntil(predicate: () => boolean, frame: FrameScheduler, timeoutMs: number): Promise<boolean> {
  const started = Date.now()
  return new Promise((resolve) => {
    const check = () => {
      if (predicate()) resolve(true)
      else if (Date.now() - started >= timeoutMs) resolve(false)
      else frame(check)
    }
    check()
  })
}

function turnOf(element: HTMLElement | undefined, fallback: number | undefined): number | undefined {
  const value = element?.closest<HTMLElement>('[data-chat-turn]')?.dataset.chatTurn
  return value === undefined ? fallback : Number(value)
}

/**
 * Header button of the closed process group that holds a row.
 * @param row - rendered Chat row.
 * @returns the button that opens the group, or undefined when the row is not in a closed group.
 */
function closedGroupToggle(row: HTMLElement): HTMLButtonElement | undefined {
  const group = row.closest<HTMLElement>('[data-chat-group-key]')
  const body = group?.querySelector<HTMLElement>(':scope > [data-step-process-body]')
  if (group == null || body == null || body.id === '') return undefined
  return group.querySelector<HTMLButtonElement>(`button[aria-controls=${attributeValue(body.id)}][aria-expanded="false"]`) ?? undefined
}

/**
 * Open the folded Turn and the closed process group that hide a task's start,
 * wait for the row to lay out, then scroll to it and flash it. Falls back to
 * the Turn's group or header when the row cannot be shown.
 * @param container - conversation content element of the Session.
 * @param recordId - report that introduced the task.
 * @param turn - Turn current when that report's context was captured.
 * @param frame - frame scheduler.
 * @returns whether an element was revealed.
 */
export async function revealStart(container: HTMLElement, recordId: string, turn: number | undefined,
  frame: FrameScheduler = nextFrame): Promise<boolean> {
  const findRow = () => collectAnchors(container).rows.get(recordId)
  // Freshly loaded history can commit a few frames after the load settles.
  const rendered = () => findRow() !== undefined || (turn !== undefined
    && container.querySelector(`[data-chat-turn=${attributeValue(String(turn))}]`) !== null)
  if (!rendered()) await waitUntil(rendered, frame, COMMIT_TIMEOUT_MS)
  const row = findRow()
  if (row === undefined || !isShown(row)) {
    const folded = turnOf(row, turn)
    const header = folded === undefined ? null
      : container.querySelector<HTMLButtonElement>(`button[data-turn-process=${attributeValue(String(folded))}][aria-expanded="false"]`)
    if (header !== null && !header.disabled) {
      header.click()
      await waitUntil(() => {
        const current = findRow()
        return current !== undefined && current.closest('[hidden], [data-turn-process-hidden]') === null
      }, frame, REVEAL_TIMEOUT_MS)
    }
    const current = findRow()
    const toggle = current === undefined || isShown(current) ? undefined : closedGroupToggle(current)
    if (toggle !== undefined) {
      toggle.click()
      await waitUntil(() => {
        const next = findRow()
        return next !== undefined && isShown(next)
      }, frame, REVEAL_TIMEOUT_MS)
    }
  }
  const anchor = startAnchor(container, recordId, turn)
  if (anchor === undefined) return false
  await settleLayout(container, anchor, frame)
  revealAndFlash(anchor)
  await holdInView(container, () => anchor.isConnected ? anchor : startAnchor(container, recordId, turn), frame)
  return true
}

/**
 * Scroll an element to the middle of its scrollport and flash it.
 * @param element - jump target.
 */
export function revealAndFlash(element: HTMLElement): void {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  const scroller = element.closest<HTMLElement>('[data-conversation-scroll]')
  // A long smooth scroll races Chat's own position restoration; far targets jump directly.
  const far = scroller !== null && Math.abs(element.getBoundingClientRect().top - scroller.getBoundingClientRect().top)
    > scroller.clientHeight * 1.5
  element.scrollIntoView({ block: 'center', behavior: reduced || far ? 'auto' : 'smooth' })
  flash(element)
}

/** Longest wait for the transcript layout to stop moving before a jump scrolls. */
export const SETTLE_TIMEOUT_MS = 1000
/** Consecutive unchanged frames that count as settled. */
const SETTLE_FRAMES = 3

/**
 * Wait until the target's position inside the scroll content and the content
 * height stop changing, so a jump does not scroll while Chat is still
 * restoring its reading position after loading history.
 * @param container - conversation content element of the Session.
 * @param target - element the jump will reveal.
 * @param frame - frame scheduler.
 * @returns settlement once stable or after the timeout.
 */
export function settleLayout(container: HTMLElement, target: HTMLElement, frame: FrameScheduler = nextFrame): Promise<boolean> {
  const scroller = conversationScroller(container)
  if (scroller === null) return Promise.resolve(true)
  let previous = ''
  let stable = 0
  return waitUntil(() => {
    const offset = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
    const sample = `:`
    stable = sample === previous ? stable + 1 : 0
    previous = sample
    return stable >= SETTLE_FRAMES
  }, frame, SETTLE_TIMEOUT_MS)
}

/**
 * Play the jump highlight on an element, restarting it when it is already playing.
 * @param element - jump target.
 */
function flash(element: HTMLElement): void {
  element.classList.remove(FLASH_CLASS)
  void element.offsetWidth
  element.classList.add(FLASH_CLASS)
  window.setTimeout(() => { element.classList.remove(FLASH_CLASS) }, FLASH_MS)
}

/** How long a jump keeps its target in view while the transcript settles. */
export const HOLD_MS = 1500
/** Time left for the smooth scroll before the hold starts correcting. */
const HOLD_GRACE_MS = 400

/**
 * Keep a jump target inside the scrollport while freshly loaded history
 * commits: Chat restores its own reading position after a prepend, which can
 * move the transcript away from the target. Any reader input ends the hold.
 * @param container - conversation content element of the Session.
 * @param find - resolves the current target element.
 * @param frame - frame scheduler.
 * @returns settlement after the hold ends.
 */
export function holdInView(container: HTMLElement, find: () => HTMLElement | undefined, frame: FrameScheduler = nextFrame): Promise<void> {
  const scroller = conversationScroller(container)
  if (scroller === null) return Promise.resolve()
  const started = Date.now()
  let interrupted = false
  const stop = () => { interrupted = true }
  const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
  for (const name of inputs) scroller.addEventListener(name, stop, { passive: true })
  return new Promise((resolve) => {
    const check = () => {
      const elapsed = Date.now() - started
      if (interrupted || elapsed >= HOLD_MS) {
        for (const name of inputs) scroller.removeEventListener(name, stop)
        resolve()
        return
      }
      const target = find()
      if (elapsed >= HOLD_GRACE_MS && target !== undefined && target.isConnected) {
        const box = target.getBoundingClientRect()
        const view = scroller.getBoundingClientRect()
        if (box.bottom <= view.top || box.top >= view.bottom) {
          target.scrollIntoView({ block: 'center', behavior: 'auto' })
          flash(target)
        }
      }
      frame(check)
    }
    frame(check)
  })
}
