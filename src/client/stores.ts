/**
 * Client-owned state: the persisted view preference, the persisted seen
 * watermarks, and the polled cross-session task list. Each factory is called
 * once inside `apply`; nothing here is a module-level instance.
 */
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'
import { z } from 'zod'
import { listResponseSchema } from '../protocol.ts'
import type { TaskIndexRow } from '../projection-types.ts'
import type { ModelProviderGroup } from '@deepseek-ai/dsh-api-remotes/client'

/** Where the tree shows: above the composer, or as a floating card. */
export type DisplayMode = 'dock' | 'floating'

/** Persisted presentation preference shared by every Session view. */
export interface ViewPreference {
  readonly mode: DisplayMode
  readonly dockExpanded: boolean
  readonly floatOpen: boolean
  /** Whether the tree follows the transcript scroll position. */
  readonly followScroll: boolean
}

const DEFAULT_VIEW: ViewPreference = { mode: 'dock', dockExpanded: false, floatOpen: true, followScroll: true }
// Each field falls back on its own, so a value stored by an older build keeps its valid fields.
const viewSchema = z.object({
  mode: z.enum(['dock', 'floating']).catch(DEFAULT_VIEW.mode),
  dockExpanded: z.boolean().catch(DEFAULT_VIEW.dockExpanded),
  floatOpen: z.boolean().catch(DEFAULT_VIEW.floatOpen),
  followScroll: z.boolean().catch(DEFAULT_VIEW.followScroll),
}).catch(DEFAULT_VIEW)

/** View preference source plus its mutations. */
export interface ViewStore extends Pick<SnapshotStore<ViewPreference>, 'getSnapshot' | 'subscribe'> {
  /** @param mode - new display mode. */
  setMode(mode: DisplayMode): void
  /** @param expanded - whether the dock card shows its rows. */
  setDockExpanded(expanded: boolean): void
  /** @param open - whether the floating card is shown. */
  setFloatOpen(open: boolean): void
  /** @param follow - whether the tree follows the transcript scroll position. */
  setFollowScroll(follow: boolean): void
}

/**
 * Create the persisted view preference.
 * @param name - localStorage key; tests pass a unique one.
 * @returns the store.
 */
export function createViewStore(name = 'dsh-task-tree.view.v1'): ViewStore {
  const store = createSnapshotStore<ViewPreference>(DEFAULT_VIEW, { persist: { name } })
  // Rehydration does not validate; invalid or missing fields fall back to their defaults.
  const stored = store.getSnapshot()
  const valid = viewSchema.parse(stored)
  if (JSON.stringify(valid) !== JSON.stringify(stored)) store.set(valid)
  const patch = (next: Partial<ViewPreference>) => { store.set({ ...store.getSnapshot(), ...next }) }
  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setMode: mode => { patch({ mode }) },
    setDockExpanded: dockExpanded => { patch({ dockExpanded }) },
    setFloatOpen: floatOpen => { patch({ floatOpen }) },
    setFollowScroll: followScroll => { patch({ followScroll }) },
  }
}

/** Last record seq the user has seen, per Session. */
export type SeenMap = Readonly<Record<string, number>>
const seenSchema = z.record(z.string(), z.number().int())

/** Seen watermarks plus their mutations. */
export interface SeenStore extends Pick<SnapshotStore<SeenMap>, 'getSnapshot' | 'subscribe'> {
  /**
   * Raise one Session's watermark; lower values are ignored.
   * @param sessionId - Session the user looked at.
   * @param seq - latest record seq shown.
   */
  markSeen(sessionId: string, seq: number): void
  /**
   * Drop watermarks of Sessions absent from the list.
   * @param keep - Session ids still listed.
   */
  prune(keep: ReadonlySet<string>): void
}

/**
 * Create the persisted seen watermarks.
 * @param name - localStorage key; tests pass a unique one.
 * @returns the store.
 */
export function createSeenStore(name = 'dsh-task-tree.seen.v1'): SeenStore {
  const store = createSnapshotStore<SeenMap>({}, { persist: { name } })
  if (!seenSchema.safeParse(store.getSnapshot()).success) store.set({})
  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    markSeen: (sessionId, seq) => {
      const current = store.getSnapshot()
      if ((current[sessionId] ?? -1) >= seq) return
      store.set({ ...current, [sessionId]: seq })
    },
    prune: (keep) => {
      const current = store.getSnapshot()
      const entries = Object.entries(current).filter(([id]) => keep.has(id))
      if (entries.length !== Object.keys(current).length) store.set(Object.fromEntries(entries))
    },
  }
}

/**
 * Whether a list row has a report newer than the user's watermark.
 * @param row - list row.
 * @param seen - watermarks.
 * @returns true when unread.
 */
export function isUnread(row: Pick<TaskIndexRow, 'sessionId' | 'lastRecordSeq'>, seen: SeenMap): boolean {
  return row.lastRecordSeq > (seen[row.sessionId] ?? -1)
}

/** Query state of the cross-session task list. */
export interface TaskListSnapshot {
  readonly status: 'loading' | 'ready' | 'error'
  readonly rows: readonly TaskIndexRow[]
}

/** Polled list source; polling runs only while something subscribes. */
export interface TaskListSource {
  getSnapshot(): TaskListSnapshot
  subscribe(listener: () => void): () => void
  /** @returns settlement of an immediate read. */
  refresh(): Promise<void>
}

/** Fallback poll interval before the first successful response states one. */
const INITIAL_POLL_MS = 15_000

/**
 * Create the list source.
 * @param options.call - performs the list RPC and returns its raw value, or throws.
 * @param options.onRows - receives every accepted row set (used to prune watermarks).
 * @returns the source.
 */
export function createTaskListSource(options: {
  call: () => Promise<unknown>
  onRows?: (rows: readonly TaskIndexRow[]) => void
}): TaskListSource {
  let snapshot: TaskListSnapshot = { status: 'loading', rows: [] }
  const listeners = new Set<() => void>()
  let interval = INITIAL_POLL_MS
  let timer: ReturnType<typeof setTimeout> | undefined
  let inflight: Promise<void> | undefined
  const publish = (next: TaskListSnapshot) => {
    snapshot = next
    for (const listener of [...listeners]) listener()
  }
  const schedule = () => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    if (listeners.size === 0) return
    timer = setTimeout(() => {
      timer = undefined
      if (document.visibilityState === 'visible') void refresh()
      else schedule()
    }, interval)
  }
  const read = async () => {
    try {
      const parsed = listResponseSchema.safeParse(await options.call())
      if (!parsed.success) throw parsed.error
      interval = parsed.data.pollIntervalMs
      options.onRows?.(parsed.data.rows)
      publish({ status: 'ready', rows: parsed.data.rows })
    } catch {
      // A failed read keeps the rows already shown; the page offers retry.
      publish({ status: 'error', rows: snapshot.rows })
    }
  }
  const refresh = (): Promise<void> => {
    inflight ??= read().finally(() => {
      inflight = undefined
      schedule()
    })
    return inflight
  }
  const onVisible = () => {
    if (document.visibilityState === 'visible') void refresh()
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      if (listeners.size === 1) {
        window.addEventListener('focus', onVisible)
        document.addEventListener('visibilitychange', onVisible)
        void refresh()
      }
      return () => {
        if (!listeners.delete(listener) || listeners.size > 0) return
        window.removeEventListener('focus', onVisible)
        document.removeEventListener('visibilitychange', onVisible)
        if (timer !== undefined) clearTimeout(timer)
        timer = undefined
      }
    },
    refresh,
  }
}

/** Model catalog state for the cheap-model picker. */
export interface ModelCatalogSnapshot {
  readonly status: 'idle' | 'loading' | 'ready' | 'error'
  readonly groups: readonly ModelProviderGroup[]
  /** Whether some providers failed to list their models. */
  readonly partial: boolean
}

/** Model catalog source; it reads on first subscription and on `refresh`. */
export interface ModelCatalogSource {
  getSnapshot(): ModelCatalogSnapshot
  subscribe(listener: () => void): () => void
  /** Read the catalog again, superseding a read in flight. */
  refresh(): void
  /** Forget Host-specific models and read again, for a new connection generation. */
  reset(): void
}

/**
 * Create the catalog source.
 * @param load - reads the Host model catalog.
 * @returns the source.
 */
export function createModelCatalogSource(load: () => Promise<
  { ok: true; value: { groups: readonly ModelProviderGroup[]; failures: readonly unknown[] } } | { ok: false }
>): ModelCatalogSource {
  let snapshot: ModelCatalogSnapshot = { status: 'idle', groups: [], partial: false }
  let generation = 0
  const listeners = new Set<() => void>()
  const publish = (next: ModelCatalogSnapshot) => {
    snapshot = next
    for (const listener of [...listeners]) listener()
  }
  const read = () => {
    const current = ++generation
    publish({ ...snapshot, status: 'loading' })
    void load().then((result) => {
      if (current !== generation) return
      publish(result.ok
        ? { status: 'ready', groups: result.value.groups, partial: result.value.failures.length > 0 }
        : { status: 'error', groups: snapshot.groups, partial: false })
    }, () => {
      if (current === generation) publish({ status: 'error', groups: snapshot.groups, partial: false })
    })
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      if (snapshot.status === 'idle') read()
      return () => { listeners.delete(listener) }
    },
    refresh: () => {
      if (snapshot.status === 'idle' && listeners.size === 0) return
      read()
    },
    reset: () => {
      generation++
      snapshot = { status: 'idle', groups: [], partial: false }
      if (listeners.size > 0) read()
    },
  }
}