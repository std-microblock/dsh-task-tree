/**
 * Pure task-tree derivation shared by the Host prompt and the Client views.
 * Items are identified by their title path; a report's path marks the current
 * branch, and every item that leaves the current branch is done until a later
 * path returns to it.
 */
import type { TreeRecord } from './projection-types.ts'

/**
 * Status of one item at the derived point in time: `active` is the deepest current item, `current` its
 * ancestors, `done` an item that left the current branch, and `pending` an item first reported after the cutoff.
 */
export type NodeStatus = 'active' | 'current' | 'done' | 'pending'

/** One item of the derived tree. */
export interface TreeNode {
  key: string
  title: string
  depth: number
  parentKey: string | undefined
  children: TreeNode[]
  status: NodeStatus
  /** Record that introduced the item. */
  firstRecordId: string
  firstSeq: number
  firstContextSeq: number
  firstTurn: number | undefined
  /** Latest folded record whose path contained the item. */
  lastSeq: number | undefined
  /** Record seq at which the item last left the current branch; absent while current or pending. */
  completedSeq: number | undefined
  /** Decisions reported while the item was the deepest current item, oldest first. */
  decisions: { text: string; recordId: string }[]
  /** Latest detail reported while the item was the deepest current item. */
  detail: string | undefined
}

/** Derived tree at one point in time. */
export interface Tree {
  roots: TreeNode[]
  byKey: ReadonlyMap<string, TreeNode>
  /**
   * Node keys of the focused branch, root first: the current branch at the derived point, or the first
   * reported branch when no report precedes the cutoff; empty without records.
   */
  activeKeys: string[]
  /** Key of the `active` item, absent when settled or before the first report. */
  activeKey: string | undefined
  /** Latest record folded into the statuses. */
  latest: TreeRecord | undefined
  included: number
  doneCount: number
  totalCount: number
}

/** Point in time of a derivation. */
export interface BuildOptions {
  /** Only reports whose record seq is at most this value set statuses; later items are `pending`. */
  cutoffSeq?: number | undefined
  /** Treat the current branch as finished, for a Session that stopped working. */
  settled?: boolean | undefined
}

/**
 * Stable identity of the item named by a path prefix.
 * @param path - task path.
 * @param depth - zero-based depth of the item.
 * @returns the identity string.
 */
export function nodeKey(path: readonly string[], depth: number): string {
  return JSON.stringify(path.slice(0, depth + 1))
}

function keysOf(path: readonly string[]): string[] {
  return path.map((_, depth) => nodeKey(path, depth))
}

/**
 * Fold reports into a tree. Every report contributes structure; only reports up to the cutoff set statuses.
 * @param records - successful reports in log order.
 * @param options - cutoff and settlement; a number is accepted as the cutoff.
 * @returns the derived tree.
 */
export function buildTree(records: readonly TreeRecord[], options: BuildOptions | number = {}): Tree {
  const { cutoffSeq, settled = false } = typeof options === 'number' ? { cutoffSeq: options } : options
  const byKey = new Map<string, TreeNode>()
  const roots: TreeNode[] = []
  for (const record of records) {
    const keys = keysOf(record.path)
    keys.forEach((key, depth) => {
      if (byKey.has(key)) return
      const parentKey = depth === 0 ? undefined : keys[depth - 1]
      const node: TreeNode = {
        key, title: record.path[depth] as string, depth, parentKey, children: [], status: 'pending',
        firstRecordId: record.id, firstSeq: record.seq, firstContextSeq: record.contextSeq, firstTurn: record.coveredTurn,
        lastSeq: undefined, completedSeq: undefined, decisions: [], detail: undefined,
      }
      byKey.set(key, node)
      const parent = parentKey === undefined ? undefined : byKey.get(parentKey)
      if (parent === undefined) roots.push(node)
      else parent.children.push(node)
    })
  }
  const seen = new Set<string>()
  let onPath = new Set<string>()
  let latest: TreeRecord | undefined
  let included = 0
  for (const record of records) {
    if (cutoffSeq !== undefined && record.seq > cutoffSeq) continue
    included++
    latest = record
    const keys = keysOf(record.path)
    const next = new Set(keys)
    for (const key of onPath) {
      const node = byKey.get(key)
      if (node !== undefined && !next.has(key)) node.completedSeq = record.seq
    }
    for (const key of keys) {
      const node = byKey.get(key) as TreeNode
      seen.add(key)
      node.lastSeq = record.seq
      node.completedSeq = undefined
    }
    const deepest = byKey.get(keys[keys.length - 1] as string) as TreeNode
    deepest.detail = record.detail
    for (const text of record.decisions) deepest.decisions.push({ text, recordId: record.id })
    onPath = next
  }
  const focus = latest ?? (cutoffSeq !== undefined ? records[0] : undefined)
  const activeKeys = focus === undefined ? [] : keysOf(focus.path)
  const activeKey = latest === undefined || settled ? undefined : activeKeys[activeKeys.length - 1]
  let doneCount = 0
  for (const node of byKey.values()) {
    if (!seen.has(node.key)) node.status = 'pending'
    else if (onPath.has(node.key) && !settled) node.status = node.key === activeKey ? 'active' : 'current'
    else {
      node.status = 'done'
      if (onPath.has(node.key)) node.completedSeq = latest?.seq
    }
    if (node.status === 'done') doneCount++
  }
  return { roots, byKey, activeKeys, activeKey, latest, included, doneCount, totalCount: byKey.size }
}

/** One rendered row of the compact tree view. */
export interface TreeRow {
  kind: 'node'
  node: TreeNode
  depth: number
  /** Whether the item has children. */
  expandable: boolean
  /** Whether the item lists every child because the user expanded it. */
  expanded: boolean
  /**
   * Whether the collapsed item still lists the children that are not done. The view keeps the expand
   * glyph on such a row, so it reads as expandable although children follow it.
   */
  partial: boolean
  /**
   * Identity of the level holding the deepest focused item, shared by that level's items and their
   * descendants; the view scrolls these consecutive rows inside one viewport. Absent outside that level.
   */
  scrollGroup: string | undefined
}

/** Display options of {@link visibleRows}. */
export interface VisibleRowsOptions {
  /** Node keys the user expanded; every item is collapsed by default. */
  toggled: ReadonlySet<string>
}

/**
 * Compact rows of the tree. Every item starts collapsed: it lists the children that are not done and hides
 * the done ones, so work in progress stays visible. An item the user expanded lists all its children, and
 * each of those follows the same rule. The level holding the deepest focused item carries a `scrollGroup`.
 * @param tree - derived tree.
 * @param options - display options.
 * @returns rows in display order.
 */
export function visibleRows(tree: Tree, options: VisibleRowsOptions): TreeRow[] {
  const rows: TreeRow[] = []
  const deepestKey = tree.activeKeys[tree.activeKeys.length - 1]
  const latestParent = deepestKey === undefined ? undefined : tree.byKey.get(deepestKey)?.parentKey ?? ''
  const emitLevel = (siblings: readonly TreeNode[], depth: number, parentKey: string, group: string | undefined) => {
    if (siblings.length === 0) return
    const scrollGroup = group ?? (parentKey === latestParent ? `scroll:${parentKey}` : undefined)
    for (const node of siblings) emitNode(node, depth, scrollGroup)
  }
  const emitNode = (node: TreeNode, depth: number, scrollGroup: string | undefined) => {
    const expandable = node.children.length > 0
    const expanded = expandable && options.toggled.has(node.key)
    const listed = expanded ? node.children : node.children.filter(child => child.status !== 'done')
    rows.push({ kind: 'node', node, depth, expandable, expanded, partial: !expanded && listed.length > 0, scrollGroup })
    emitLevel(listed, depth + 1, node.key, scrollGroup)
  }
  emitLevel(tree.roots, 0, '', undefined)
  return rows
}

/**
 * Indented outline the side query receives as the existing tree.
 * Lists every top-level item and every sibling along the current branch;
 * the oldest done siblings collapse into a count when the outline exceeds `maxItems`.
 * @param tree - derived tree.
 * @param maxItems - maximum listed items.
 * @returns plain-text outline, or an empty string without records.
 */
export function outlineForPrompt(tree: Tree, maxItems: number): string {
  if (tree.latest === undefined) return ''
  const levels: TreeNode[][] = [tree.roots]
  for (const key of tree.activeKeys.slice(0, -1)) {
    const node = tree.byKey.get(key)
    if (node !== undefined && node.children.length > 0) levels.push(node.children)
  }
  const collapsed = levels.map(() => 0)
  const total = () => levels.reduce((sum, level, index) => sum + level.length - (collapsed[index] as number), 0)
  const collapsible = (index: number) => {
    const level = levels[index] as TreeNode[]
    const start = collapsed[index] as number
    const node = level[start]
    return node !== undefined && node.status === 'done' ? 1 : 0
  }
  while (total() > maxItems) {
    let best = -1
    let bestSize = 0
    levels.forEach((level, index) => {
      const remaining = level.length - (collapsed[index] as number)
      if (collapsible(index) > 0 && remaining > bestSize) { best = index; bestSize = remaining }
    })
    if (best < 0) break
    collapsed[best] = (collapsed[best] as number) + 1
  }
  const lines: string[] = []
  const write = (level: number, depth: number) => {
    const nodes = levels[level] as TreeNode[]
    const skip = collapsed[level] as number
    const indent = '  '.repeat(depth)
    if (skip > 0) lines.push(`${indent}- (+${skip} earlier done items)`)
    for (const node of nodes.slice(skip)) {
      lines.push(`${indent}- [${node.status}] ${node.title}`)
      for (const decision of node.decisions.slice(-3)) lines.push(`${indent}    decision: ${decision.text}`)
      if (node.status === 'active' && node.detail !== undefined) lines.push(`${indent}    detail: ${node.detail}`)
      if (node.status !== 'done' && level + 1 < levels.length && levels[level + 1]?.[0]?.parentKey === node.key) write(level + 1, depth + 1)
    }
  }
  write(0, 0)
  return lines.join('\n')
}

/**
 * Every decision already present in the tree, for deduplication.
 * @param tree - derived tree.
 * @returns normalized decision texts.
 */
export function knownDecisions(tree: Tree): Set<string> {
  const known = new Set<string>()
  for (const node of tree.byKey.values()) for (const decision of node.decisions) known.add(normalizeText(decision.text))
  return known
}

/**
 * Case- and whitespace-insensitive comparison form.
 * @param text - free text.
 * @returns normalized text.
 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/gu, ' ').toLowerCase()
}

/** Punctuation, symbols, and whitespace that a retyped title may swap for one another. */
const IDENTITY_NOISE = /[\p{P}\p{S}\s]+/gu

/**
 * Separator-insensitive identity form of an item title. Two titles with the same form name the same item,
 * so a report that retypes `KernelSU/LSPosed` as `KernelSU-LSPosed` keeps the existing item instead of
 * forking a second one under a variant spelling.
 * @param text - item title.
 * @returns the identity form, empty when the title carries no letters or digits.
 */
export function identityText(text: string): string {
  return text.normalize('NFKC').toLowerCase().replace(IDENTITY_NOISE, '')
}

/** Stands for the established item at one level, so a report never retypes a title it already placed. */
export const LATEST_ITEM_ALIAS = '@'

/** Outcome of mapping one reported path onto established item titles. */
export type PathResolution =
  | { readonly kind: 'resolved'; readonly path: string[] }
  /** An alias names a level with no established item, so the answer cannot be placed in the tree. */
  | { readonly kind: 'unresolved-alias'; readonly depth: number }

/**
 * Most recently active item of one level, in creation order for equal recency.
 * @param nodes - siblings at one level.
 * @returns the latest sibling, or undefined for an empty level.
 */
function latestSibling(nodes: readonly TreeNode[]): TreeNode | undefined {
  let latest: TreeNode | undefined
  for (const node of nodes) {
    const seen = node.lastSeq ?? node.firstSeq
    if (latest === undefined || seen >= (latest.lastSeq ?? latest.firstSeq)) latest = node
  }
  return latest
}

/**
 * Map a reported path onto established item titles. {@link LATEST_ITEM_ALIAS} stands for the item the
 * previous report named at that level, or the most recently active sibling of that level when the report
 * moves to another branch, so the model never has to retype a long title. Any other item reuses an
 * established sibling with the same {@link identityText}, which keeps one item when a separator is retyped.
 * @param path - reported items, outermost first.
 * @param tree - tree derived from the preceding reports.
 * @returns resolved titles, or the first level whose alias has no established item.
 */
export function resolveReportedPath(path: readonly string[], tree: Tree): PathResolution {
  const previous = tree.latest?.path ?? []
  const resolved: string[] = []
  let followsPrevious = previous.length > 0
  for (const [depth, candidate] of path.entries()) {
    const parentKey = depth === 0 ? undefined : nodeKey(resolved, depth - 1)
    const siblings = parentKey === undefined ? tree.roots : tree.byKey.get(parentKey)?.children ?? []
    const established = followsPrevious && previous[depth] !== undefined
      ? siblings.find(node => node.title === previous[depth])
      : undefined
    const named = candidate === LATEST_ITEM_ALIAS
      ? established?.title ?? latestSibling(siblings)?.title
      : candidate
    if (named === undefined) return { kind: 'unresolved-alias', depth }
    const identity = identityText(named)
    const folded = identity === ''
      ? undefined
      : siblings.find(node => node.title !== named && identityText(node.title) === identity)
    const title = folded?.title ?? named
    followsPrevious = followsPrevious && title === previous[depth]
    resolved.push(title)
  }
  return { kind: 'resolved', path: resolved }
}
