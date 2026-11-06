// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollGroup } from '../../src/client/ScrollGroup.tsx'

afterEach(cleanup)
function motion(reduced: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduced && query.includes('reduce') }))
}
beforeEach(() => {
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
  motion(true)
})
afterEach(() => { vi.unstubAllGlobals() })

// 30px rows; the default shows the last three (90px), the limit is 450px.
function renderGroup(rows = 6, step = 30) {
  const keys = Array.from({ length: rows }, (_, index) => `r${index}`)
  const view = render(<ScrollGroup anchorKey={keys[Math.max(0, rows - 3)]!} contentKey={String(rows)}>
    {keys.map((key, index) => <div key={key} data-row-key={key} ref={(element) => {
      if (element !== null) Object.defineProperty(element, 'offsetTop', { configurable: true, value: index * step })
    }}>{key}</div>)}
  </ScrollGroup>)
  const group = view.container.querySelector<HTMLElement>('.dsh-task-tree-scroll-group')!
  return { view, group }
}

function contentHeight(px: number) {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) { return this.classList.contains('dsh-task-tree-scroll-group-content') ? px : 0 },
  })
}

function wheel(element: HTMLElement, deltaY: number): boolean {
  const event = new WheelEvent('wheel', { deltaY, cancelable: true, bubbles: true })
  act(() => { element.dispatchEvent(event) })
  return event.defaultPrevented
}

describe('latest-level group', () => {
  afterEach(() => { Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight') })

  it('shows the newest rows by default and grows upward with damped wheel input, fading while rows stay hidden', () => {
    contentHeight(180)
    const { group } = renderGroup()
    expect(group.style.height).toBe('90px')
    expect(group.hasAttribute('data-faded')).toBe(true)
    // One 100px notch requests 40px; a large burst is capped at 60px per event.
    expect(wheel(group, -100)).toBe(true)
    expect(group.style.height).toBe('130px')
    expect(wheel(group, -1000)).toBe(true)
    expect(group.style.height).toBe('180px')
    expect(group.hasAttribute('data-faded')).toBe(false)
    // Fully revealed: further wheel-up belongs to the transcript.
    expect(wheel(group, -10)).toBe(false)
    expect(wheel(group, 50)).toBe(true)
    expect(group.style.height).toBe('160px')
  })

  it('glides toward the target on animation frames without large single-frame jumps', () => {
    motion(false)
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', () => {})
    contentHeight(180)
    const { group } = renderGroup()
    wheel(group, -100)
    const heights: number[] = []
    for (let time = 16; frames.length > 0 && time < 2000; time += 16) {
      act(() => { frames.shift()!(time) })
      heights.push(Number.parseFloat(group.style.height))
    }
    expect(heights.at(-1)).toBe(130)
    expect(heights.every((value, index) => index === 0 || value >= heights[index - 1]!)).toBe(true)
    expect(Math.max(...heights.map((value, index) => value - (heights[index - 1] ?? 90)))).toBeLessThan(12)
  })

  it('returns to the default height when the pointer leaves, and lets wheel-down at the default pass through', () => {
    contentHeight(180)
    const { group } = renderGroup()
    expect(wheel(group, 30)).toBe(false)
    wheel(group, -100)
    fireEvent.mouseLeave(group)
    expect(group.style.height).toBe('90px')
  })

  it('stops at the height limit and scrolls inside from there', () => {
    contentHeight(900)
    const { group } = renderGroup(30)
    for (let index = 0; index < 10; index++) wheel(group, -2000)
    expect(group.style.height).toBe('450px')
    expect(group.hasAttribute('data-scrollable')).toBe(true)
    expect(wheel(group, -20)).toBe(false)
  })

  it('collapses after a touch drag ends', () => {
    vi.useFakeTimers()
    contentHeight(180)
    const { group } = renderGroup()
    act(() => {
      group.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientY: 100 } as Touch] }))
      group.dispatchEvent(new TouchEvent('touchmove', { touches: [{ clientY: 150 } as Touch], cancelable: true }))
    })
    expect(group.style.height).toBe('140px')
    act(() => {
      group.dispatchEvent(new TouchEvent('touchend'))
      vi.advanceTimersByTime(700)
    })
    expect(group.style.height).toBe('90px')
    vi.useRealTimers()
  })
})
