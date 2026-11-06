// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createModelCatalogSource, createSeenStore, createTaskListSource, createViewStore, isUnread } from '../../src/client/stores.ts'

afterEach(() => {
  localStorage.clear()
  vi.useRealTimers()
})

const row = { sessionId: 's1', rootTitle: 'Root', path: ['Root'], detail: 'd', doneCount: 0, totalCount: 1, lastRecordSeq: 9, updatedAt: 1 }

describe('unread state', () => {
  it('treats a row as unread until its latest seq is seen', () => {
    const seen = createSeenStore('test.seen.a')
    expect(isUnread(row, seen.getSnapshot())).toBe(true)
    seen.markSeen('s1', 9)
    expect(isUnread(row, seen.getSnapshot())).toBe(false)
    expect(isUnread({ ...row, lastRecordSeq: 10 }, seen.getSnapshot())).toBe(true)
  })

  it('only raises watermarks, persists them, and prunes unlisted Sessions', () => {
    const seen = createSeenStore('test.seen.b')
    seen.markSeen('s1', 9)
    const snapshot = seen.getSnapshot()
    seen.markSeen('s1', 3)
    expect(seen.getSnapshot()).toBe(snapshot)
    seen.markSeen('s2', 1)
    expect(createSeenStore('test.seen.b').getSnapshot()).toEqual({ s1: 9, s2: 1 })
    seen.prune(new Set(['s2']))
    expect(seen.getSnapshot()).toEqual({ s2: 1 })
  })

  it('discards malformed persisted values', () => {
    localStorage.setItem('test.seen.c', JSON.stringify({ s1: 'x' }))
    expect(createSeenStore('test.seen.c').getSnapshot()).toEqual({})
    localStorage.setItem('test.view.c', JSON.stringify({ mode: 'sideways', dockExpanded: true }))
    expect(createViewStore('test.view.c').getSnapshot()).toEqual({ mode: 'dock', dockExpanded: true, floatOpen: true, followScroll: true })
  })

  it('persists the display mode with dock as the default', () => {
    const view = createViewStore('test.view.d')
    expect(view.getSnapshot().mode).toBe('dock')
    view.setMode('floating')
    view.setFloatOpen(false)
    view.setFollowScroll(false)
    expect(createViewStore('test.view.d').getSnapshot()).toEqual({ mode: 'floating', dockExpanded: false, floatOpen: false, followScroll: false })
  })
})

describe('task list source', () => {
  it('reads on first subscription, validates, and polls at the reported interval', async () => {
    vi.useFakeTimers()
    const call = vi.fn().mockResolvedValue({ rows: [row], pollIntervalMs: 1000 })
    const onRows = vi.fn()
    const source = createTaskListSource({ call, onRows })
    const off = source.subscribe(() => {})
    await vi.waitFor(() => { expect(source.getSnapshot().status).toBe('ready') })
    expect(source.getSnapshot().rows).toEqual([row])
    expect(onRows).toHaveBeenCalledWith([row])
    await vi.advanceTimersByTimeAsync(1000)
    expect(call).toHaveBeenCalledTimes(2)
    off()
    await vi.advanceTimersByTimeAsync(5000)
    expect(call).toHaveBeenCalledTimes(2)
  })

  it('keeps shown rows when a later read fails or is malformed', async () => {
    const call = vi.fn().mockResolvedValueOnce({ rows: [row], pollIntervalMs: 1000 }).mockResolvedValueOnce({ rows: 'bad' })
    const source = createTaskListSource({ call })
    await source.refresh()
    await source.refresh()
    expect(source.getSnapshot()).toEqual({ status: 'error', rows: [row] })
  })
})

describe('model catalog source', () => {
  it('reads on first subscription, marks partial catalogs, and keeps groups after a failed refresh', async () => {
    const groups = [{ id: 'p', name: 'P', models: [{ id: 'm', name: 'M' }] }]
    const load = vi.fn()
      .mockResolvedValueOnce({ ok: true, value: { groups, failures: [{ id: 'x' }] } })
      .mockResolvedValueOnce({ ok: false })
    const source = createModelCatalogSource(load)
    source.refresh()
    expect(load).not.toHaveBeenCalled()
    const off = source.subscribe(() => {})
    await vi.waitFor(() => { expect(source.getSnapshot()).toEqual({ status: 'ready', groups, partial: true }) })
    source.refresh()
    await vi.waitFor(() => { expect(source.getSnapshot()).toEqual({ status: 'error', groups, partial: false }) })
    off()
  })

  it('drops a superseded read and forgets models on reset', async () => {
    let resolveFirst: (value: { ok: true; value: { groups: never[]; failures: never[] } }) => void = () => {}
    const load = vi.fn()
      .mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve }))
      .mockResolvedValue({ ok: true, value: { groups: [], failures: [] } })
    const source = createModelCatalogSource(load)
    const off = source.subscribe(() => {})
    source.reset()
    resolveFirst({ ok: true, value: { groups: [], failures: [] } })
    await vi.waitFor(() => { expect(source.getSnapshot().status).toBe('ready') })
    expect(load).toHaveBeenCalledTimes(2)
    off()
  })
})
