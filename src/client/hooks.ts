/** Component-internal behavioral hooks over the Session's own conversation DOM. */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { TreeRecord } from '../projection-types.ts'
import { conversationContainer, conversationScroller, readingCutoff, revealStart } from './anchors.ts'

/** Reading position of one Session's transcript. */
export interface ReadingPosition {
  /** Undefined while the reader follows the latest output; otherwise the last record above the reading line. */
  readonly cutoff: number | undefined
  /** Scroll the transcript back to its bottom. */
  readonly backToLatest: () => void
}

/**
 * Follow the transcript scroll position and report which records the reader has passed.
 * @param sessionId - Session whose conversation pane is observed.
 * @param records - reports in log order.
 * @param enabled - whether to follow the scroll position; when false the cutoff stays undefined.
 * @returns the cutoff and the action that returns to the latest output.
 */
export function useReadingCutoff(sessionId: string, records: readonly TreeRecord[], enabled = true): ReadingPosition {
  const [measured, setCutoff] = useState<number | undefined>(undefined)
  const cutoff = enabled ? measured : undefined
  const recordsRef = useRef(records)
  recordsRef.current = records
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    let scroller: HTMLElement | null = null
    const measure = () => {
      frame = 0
      const container = conversationContainer(sessionId)
      setCutoff(container === null ? undefined : readingCutoff(container, recordsRef.current))
    }
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure)
    }
    const attach = () => {
      const container = conversationContainer(sessionId)
      const next = container === null ? null : conversationScroller(container)
      if (next === scroller) return
      scroller?.removeEventListener('scroll', schedule)
      scroller = next
      scroller?.addEventListener('scroll', schedule, { passive: true })
    }
    attach()
    schedule()
    // The pane can mount after this view, so the scrollport is re-resolved on resize as well.
    const onResize = () => { attach(); schedule() }
    window.addEventListener('resize', onResize)
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame)
      scroller?.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
    }
  }, [sessionId, records, enabled])
  const backToLatest = useCallback(() => {
    const container = conversationContainer(sessionId)
    const scroller = container === null ? null : conversationScroller(container)
    if (scroller === null) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [sessionId])
  return { cutoff, backToLatest }
}

/** Where one task started, as recorded by the tree. */
export interface JumpTarget {
  readonly recordId: string
  readonly contextSeq: number
  readonly turn: number | undefined
}

/**
 * Build the jump action for one Session.
 * @param sessionId - Session whose transcript is scrolled.
 * @param ensureLoaded - pages the transcript back until the seq is loaded.
 * @returns a stable action revealing where a task started.
 */
export function useJump(sessionId: string, ensureLoaded: (sessionId: string, seq: number) => Promise<void>): (target: JumpTarget) => void {
  return useCallback((target: JumpTarget) => {
    void ensureLoaded(sessionId, target.contextSeq).catch(() => undefined).then(() => {
      requestAnimationFrame(() => {
        const container = conversationContainer(sessionId)
        if (container !== null) void revealStart(container, target.recordId, target.turn)
      })
    })
  }, [sessionId, ensureLoaded])
}

/**
 * Record the latest report as seen while this view is mounted and the page is visible.
 * @param sessionId - Session shown by the view.
 * @param latestSeq - seq of the latest report, if any.
 * @param markSeen - store action.
 */
export function useMarkSeen(sessionId: string, latestSeq: number | undefined, markSeen: (sessionId: string, seq: number) => void): void {
  useEffect(() => {
    if (latestSeq === undefined) return
    const mark = () => {
      if (document.visibilityState === 'visible') markSeen(sessionId, latestSeq)
    }
    mark()
    document.addEventListener('visibilitychange', mark)
    return () => { document.removeEventListener('visibilitychange', mark) }
  }, [sessionId, latestSeq, markSeen])
}
