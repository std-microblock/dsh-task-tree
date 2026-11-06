// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { conversationContainer, readingCutoff, revealStart, startAnchor, FLASH_CLASS } from '../../src/client/anchors.ts'
import { record } from './fixture.ts'

afterEach(() => { document.body.innerHTML = '' })

function rect(top: number, height: number): DOMRect {
  return { top, bottom: top + height, height, left: 0, right: 100, width: 100, x: 0, y: top, toJSON: () => ({}) }
}

function place(element: Element, top: number, height = 20) {
  (element as HTMLElement).getBoundingClientRect = () => rect(top, height)
}

function pane(sessionId: string, scroll: { top: number; height: number; client: number }) {
  document.body.insertAdjacentHTML('beforeend', `
    <div data-conversation-content data-conversation-session="${sessionId}">
      <div data-conversation-scroll style="--dsh-composer-height: 100px"></div>
    </div>`)
  const container = conversationContainer(sessionId)!
  const scroller = container.querySelector<HTMLElement>('[data-conversation-scroll]')!
  Object.defineProperties(scroller, {
    scrollTop: { value: scroll.top }, scrollHeight: { value: scroll.height }, clientHeight: { value: scroll.client },
  })
  place(scroller, 0, scroll.client)
  return { container, scroller }
}

describe('reading cutoff', () => {
  it('is live within the bottom threshold', () => {
    const { container } = pane('s', { top: 960, height: 2000, client: 1000 })
    expect(readingCutoff(container, [record(['A'])])).toBeUndefined()
  })

  it('counts rows, groups, and older unloaded Turns above the reading line', () => {
    const { container, scroller } = pane('s', { top: 0, height: 5000, client: 1000 })
    const early = record(['A'], { coveredTurn: 1 })
    const own = record(['A', 'B'], { coveredTurn: 2 })
    const grouped = record(['A', 'C'], { coveredTurn: 3 })
    const below = record(['A', 'D'], { coveredTurn: 4 })
    scroller.innerHTML = `
      <div data-chat-turn="2"><div data-task-tree-record="${own.id}"></div></div>
      <div data-chat-group-key="g3" data-chat-turn="3"></div>
      <div data-chat-turn="4"><div data-task-tree-record="${below.id}"></div></div>`
    place(scroller.querySelector(`[data-task-tree-record="${own.id}"]`)!, 200)
    place(scroller.querySelector('[data-chat-group-key]')!, 400, 300)
    place(scroller.querySelector(`[data-task-tree-record="${below.id}"]`)!, 950)
    // The reading line sits at 1000 - 100 = 900: the group bottom (700) has passed, the row at 950 has not.
    expect(readingCutoff(container, [early, own, grouped, below])).toBe(grouped.seq)
  })

  it('reports no passed record above the first anchor', () => {
    const { container, scroller } = pane('s', { top: 0, height: 5000, client: 1000 })
    const first = record(['A'], { coveredTurn: 5 })
    scroller.innerHTML = `<div data-chat-turn="5"><div data-task-tree-record="${first.id}"></div></div>`
    place(scroller.querySelector('[data-task-tree-record]')!, 950)
    expect(readingCutoff(container, [first])).toBe(-1)
  })

  it('scopes lookups to one Session pane', () => {
    pane('a', { top: 0, height: 10, client: 10 })
    const { container } = pane('b]x', { top: 0, height: 10, client: 10 })
    expect(conversationContainer('b]x')).toBe(container)
    expect(conversationContainer('missing')).toBeNull()
  })
})

describe('start anchor', () => {
  it('prefers the visible row, then the Turn group, then the last Turn row', () => {
    const { container, scroller } = pane('s', { top: 0, height: 10, client: 10 })
    scroller.innerHTML = `
      <div data-chat-group-key="g" data-chat-turn="2"><div hidden><div data-task-tree-record="hidden-row"></div></div></div>
      <div data-chat-turn="3" id="t3a"></div><div data-chat-turn="3" id="t3b"><div data-task-tree-record="shown"></div></div>`
    place(scroller.querySelector('[data-task-tree-record="shown"]')!, 10)
    expect(startAnchor(container, 'shown', 3)?.dataset.taskTreeRecord).toBe('shown')
    expect(startAnchor(container, 'hidden-row', 2)?.dataset.chatGroupKey).toBe('g')
    expect(startAnchor(container, 'gone', 3)?.id).toBe('t3b')
    expect(startAnchor(container, 'gone', undefined)).toBeUndefined()
  })
})

describe('reveal start', () => {
  // Synchronous frames: each poll runs the next check immediately until the predicate holds or time runs out.
  // Each frame advances the clock so waits and the in-view hold end in bounded time.
  const frame = (callback: () => void) => { vi.setSystemTime(Date.now() + 50); queueMicrotask(callback) }
  beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }) })
  afterEach(() => { vi.useRealTimers() })

  function laidOut(element: Element, visible: () => boolean) {
    (element as HTMLElement).getBoundingClientRect = () => visible() ? rect(100, 20) : rect(0, 0)
  }

  it('opens a folded Turn and a closed process group before scrolling to the row', async () => {
    const { container, scroller } = pane('s', { top: 0, height: 10, client: 10 })
    scroller.innerHTML = `
      <button data-turn-process="4" aria-expanded="false">done</button>
      <div data-chat-group-key="g4" data-chat-turn="4" data-turn-process-hidden="">
        <button aria-controls="body-4" aria-expanded="false">steps</button>
        <div id="body-4" data-step-process-body hidden><div data-task-tree-record="r-target"></div></div>
      </div>`
    const header = scroller.querySelector<HTMLButtonElement>('button[data-turn-process]')!
    const group = scroller.querySelector<HTMLElement>('[data-chat-group-key]')!
    const toggle = group.querySelector<HTMLButtonElement>('button')!
    const body = group.querySelector<HTMLElement>('[data-step-process-body]')!
    const row = scroller.querySelector<HTMLElement>('[data-task-tree-record]')!
    const order: string[] = []
    header.addEventListener('click', () => { order.push('turn'); group.removeAttribute('data-turn-process-hidden'); header.setAttribute('aria-expanded', 'true') })
    toggle.addEventListener('click', () => { order.push('group'); body.removeAttribute('hidden'); toggle.setAttribute('aria-expanded', 'true') })
    laidOut(row, () => !body.hasAttribute('hidden'))
    laidOut(body, () => !body.hasAttribute('hidden'))
    laidOut(group, () => true)
    const scrolled = vi.fn()
    row.scrollIntoView = scrolled
    await expect(revealStart(container, 'r-target', 4, frame)).resolves.toBe(true)
    expect(order).toEqual(['turn', 'group'])
    expect(scrolled).toHaveBeenCalledWith(expect.objectContaining({ block: 'center' }))
    expect(row.classList.contains(FLASH_CLASS)).toBe(true)
  })

  it('falls back to the Turn header when an old record has no row', async () => {
    const { container, scroller } = pane('s', { top: 0, height: 10, client: 10 })
    scroller.innerHTML = '<button data-turn-process="2" aria-expanded="true">done</button><div data-chat-turn="2"></div>'
    const header = scroller.querySelector<HTMLElement>('button')!
    header.scrollIntoView = vi.fn()
    await expect(revealStart(container, 'missing', 2, frame)).resolves.toBe(true)
    expect(header.scrollIntoView).toHaveBeenCalled()
    await expect(revealStart(container, 'missing', undefined, frame)).resolves.toBe(false)
  })

  it('stops waiting when the row never lays out', async () => {
    const { container, scroller } = pane('s', { top: 0, height: 10, client: 10 })
    scroller.innerHTML = '<div data-chat-turn="3"><div hidden><div data-task-tree-record="r"></div></div></div><button data-turn-process="3" aria-expanded="false">x</button>'
    const header = scroller.querySelector<HTMLElement>('button')!
    header.scrollIntoView = vi.fn()
    const slow = (callback: () => void) => { vi.setSystemTime(Date.now() + 700); queueMicrotask(callback) }
    await expect(revealStart(container, 'r', 3, slow)).resolves.toBe(true)
    expect(header.scrollIntoView).toHaveBeenCalled()
  })
  it('waits for loaded history to render the Turn and keeps the target in view while the transcript settles', async () => {
    const { container, scroller } = pane('s', { top: 0, height: 10, client: 10 })
    const scrolled = vi.fn()
    let frames = 0
    const counting = (callback: () => void) => {
      frames++
      if (frames === 3) {
        scroller.insertAdjacentHTML('beforeend', '<div data-chat-turn="6"><div data-task-tree-record="late"></div></div>')
        const row = scroller.querySelector<HTMLElement>('[data-task-tree-record="late"]')!
        // The row first sits far above the scrollport, as after Chat restores its position.
        let top = -4000
        row.getBoundingClientRect = () => rect(top, 20)
        row.scrollIntoView = (options) => { scrolled(options); top = 400 }
      }
      frame(callback)
    }
    await expect(revealStart(container, 'late', 6, counting)).resolves.toBe(true)
    expect(scrolled).toHaveBeenCalledWith({ block: 'center', behavior: 'auto' })
  })
})
