/**
 * Latest tree level shown as its newest items, with older siblings hidden
 * above. Scrolling up over it grows it upward while the newest rows stay at
 * its bottom; past the height limit it scrolls inside. Leaving it returns it
 * to its default height. Height follows its target through exponential
 * smoothing on animation frames, written straight to the element.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** Props of {@link ScrollGroup}. */
export interface ScrollGroupProps {
  /** Row key of the oldest row shown by default; rows above it start hidden. */
  readonly anchorKey: string
  /** Changes whenever the rows change. */
  readonly contentKey: string
  readonly children: ReactNode
}

/** Share of the window height the group may grow to before it scrolls inside. */
const LIMIT_SHARE = 0.45
/** Height change per pixel of scroll input. */
const SCROLL_GAIN = 0.4
/** Largest height change one input event may request. */
const STEP_CAP_PX = 60
/** Smoothing time constant while following scroll input. */
const TRACK_TAU_MS = 80
/** Smoothing time constant of the collapse back to the default height. */
const COLLAPSE_TAU_MS = 120
/** Delay after a touch ends before the group collapses. */
const TOUCH_COLLAPSE_MS = 600
/** Pixels per line for wheel events reported in lines. */
const LINE_PX = 16
/** Remaining distance at which the animation snaps to its target. */
const SETTLE_PX = 0.5

interface Metrics { base: number; full: number }

function reducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/**
 * Bottom-anchored, upward-growing viewport of the latest level.
 * @param props - default anchor row, change key, and rows.
 * @returns the group.
 */
export function ScrollGroup({ anchorKey, contentKey, children }: ScrollGroupProps) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const metrics = useRef<Metrics>({ base: 0, full: 0 })
  const height = useRef(0)
  const target = useRef(0)
  const tau = useRef(TRACK_TAU_MS)
  const frame = useRef(0)
  const last = useRef<number | undefined>(undefined)
  const [scrollable, setScrollable] = useState(false)
  const scrollableRef = useRef(false)

  const limit = () => Math.min(metrics.current.full, Math.max(metrics.current.base, Math.round(window.innerHeight * LIMIT_SHARE)))

  const paint = useCallback(() => {
    const element = outer.current
    /* v8 ignore next -- the ref is attached before any paint */
    if (element === null) return
    const { full } = metrics.current
    if (full === 0) {
      element.style.removeProperty('height')
      delete element.dataset.faded
      return
    }
    element.style.height = `${height.current}px`
    const hidden = scrollableRef.current ? element.scrollTop > 0 : height.current < full - SETTLE_PX
    if (hidden) element.dataset.faded = ''
    else delete element.dataset.faded
    const inside = full > limit() && height.current >= limit() - SETTLE_PX && target.current >= limit()
    if (inside !== scrollableRef.current) {
      scrollableRef.current = inside
      setScrollable(inside)
    }
  }, [])

  const step = useCallback((now: number) => {
    frame.current = 0
    // Long frame gaps advance at most two frames, so a stalled frame does not jump.
    const dt = last.current === undefined ? 16 : Math.min(34, now - last.current)
    last.current = now
    const remaining = target.current - height.current
    height.current = Math.abs(remaining) < SETTLE_PX ? target.current : height.current + remaining * (1 - Math.exp(-dt / tau.current))
    paint()
    if (height.current !== target.current) frame.current = requestAnimationFrame(step)
    else last.current = undefined
  }, [paint])

  const animateTo = useCallback((next: number, timeConstant: number) => {
    target.current = next
    tau.current = timeConstant
    if (reducedMotion()) {
      height.current = next
      paint()
      return
    }
    if (frame.current === 0) frame.current = requestAnimationFrame(step)
  }, [paint, step])

  // Layout effect: the default height comes from where the anchor row sits in
  // the rendered content, which only the DOM knows, and must apply before paint.
  const measure = useCallback(() => {
    const content = inner.current
    /* v8 ignore next -- the ref is attached before layout effects and observers run */
    if (content === null) return
    const full = content.offsetHeight
    const anchor = [...content.children].find(child => child instanceof HTMLElement && child.dataset.rowKey === anchorKey)
    const base = anchor instanceof HTMLElement ? full - anchor.offsetTop : full
    const first = metrics.current.full === 0
    metrics.current = { base, full }
    const clamped = Math.min(limit(), Math.max(base, target.current))
    if (first || frame.current === 0) {
      target.current = clamped
      height.current = clamped
      paint()
    } else target.current = clamped
  }, [anchorKey, paint])
  useLayoutEffect(() => {
    measure()
    const content = inner.current
    if (content === null || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    return () => { observer.disconnect() }
  }, [measure, contentKey])

  // Entering inner scrolling starts at the bottom, where the newest rows are.
  useLayoutEffect(() => {
    const element = outer.current
    if (!scrollable || element === null) return
    element.scrollTop = element.scrollHeight
    paint()
  }, [scrollable, contentKey, paint])

  const collapse = useCallback(() => { animateTo(metrics.current.base, COLLAPSE_TAU_MS) }, [animateTo])

  useEffect(() => {
    const element = outer.current
    /* v8 ignore next -- the ref is attached before effects run */
    if (element === null) return
    // Returns whether the input moved the target, so the caller stops the page from also scrolling.
    const apply = (deltaY: number): boolean => {
      const { base } = metrics.current
      if (metrics.current.full === 0) return false
      if (deltaY > 0 && scrollableRef.current && element.scrollTop + element.clientHeight < element.scrollHeight - 1) return false
      if (deltaY < 0 && scrollableRef.current) return false
      const change = Math.max(-STEP_CAP_PX, Math.min(STEP_CAP_PX, -deltaY * SCROLL_GAIN))
      const next = Math.min(limit(), Math.max(base, target.current + change))
      if (next === target.current) return false
      animateTo(next, TRACK_TAU_MS)
      return true
    }
    const onWheel = (event: WheelEvent) => {
      const scale = event.deltaMode === 1 ? LINE_PX : event.deltaMode === 2 ? window.innerHeight : 1
      if (apply(event.deltaY * scale)) event.preventDefault()
    }
    let touchY: number | undefined
    let touchTimer: ReturnType<typeof setTimeout> | undefined
    const onTouchStart = (event: TouchEvent) => {
      clearTimeout(touchTimer)
      touchY = event.touches[0]?.clientY
    }
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY
      if (touchY === undefined || y === undefined) return
      // A finger follows the content directly, so touch skips the wheel gain.
      const deltaY = (touchY - y) / SCROLL_GAIN
      touchY = y
      if (apply(deltaY)) event.preventDefault()
    }
    const onTouchEnd = () => {
      touchY = undefined
      touchTimer = setTimeout(collapse, TOUCH_COLLAPSE_MS)
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchmove', onTouchMove, { passive: false })
    element.addEventListener('touchend', onTouchEnd)
    return () => {
      element.removeEventListener('wheel', onWheel)
      element.removeEventListener('touchstart', onTouchStart)
      element.removeEventListener('touchmove', onTouchMove)
      element.removeEventListener('touchend', onTouchEnd)
      clearTimeout(touchTimer)
      if (frame.current !== 0) cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [animateTo, collapse])

  return <div ref={outer} className="dsh-task-tree-scroll-group" data-scrollable={scrollable || undefined}
    onMouseLeave={collapse} onScroll={paint}>
    <div ref={inner} className="dsh-task-tree-scroll-group-content">{children}</div>
  </div>
}
