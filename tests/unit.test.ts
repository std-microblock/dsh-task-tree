import { describe, expect, it } from 'vitest'
import type { RequestMessage } from '@deepseek-ai/dsh-llm'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import type { TreeRecord } from '../src/projection-types.ts'
import { buildTree, identityText, knownDecisions, nodeKey, outlineForPrompt, resolveReportedPath, visibleRows } from '../src/tree.ts'
import { chunkTranscript, prefixHash, renderTranscript, snapBoundary } from '../src/generate/transcript.ts'
import { planCheckpoint } from '../src/generate/checkpoint.ts'
import { createQuestion } from '../src/prompt.ts'
import { forkRequest } from '../src/generate/request.ts'
import { mayReplaceTitle } from '../src/title.ts'

let seq = 10
function record(path: string[], extra: Partial<TreeRecord> = {}): TreeRecord {
  seq += 10
  return { id: `r${seq}`, seq, contextSeq: seq - 1, mode: 'fork', path, previousPath: [], detail: `detail ${path.at(-1)}`, decisions: [], ...extra }
}

describe('buildTree', () => {
  const A = 'TypeORM 插件'
  const records = [
    record([A, '准备环境', '配置 Yarn']),
    record([A, '准备环境', '安装 vendor'], { decisions: ['使用 link 依赖'] }),
    record([A, '实现服务']),
    record([A, '准备环境', '安装 vendor']),
  ]

  it('marks the current branch and completes items that left it, reopening revisited ones', () => {
    const tree = buildTree(records)
    const status = (path: string[]) => tree.byKey.get(nodeKey(path, path.length - 1))?.status
    expect(status([A])).toBe('current')
    expect(status([A, '准备环境'])).toBe('current')
    expect(status([A, '准备环境', '安装 vendor'])).toBe('active')
    expect(status([A, '准备环境', '配置 Yarn'])).toBe('done')
    expect(status([A, '实现服务'])).toBe('done')
    expect(tree.totalCount).toBe(5)
    expect(tree.doneCount).toBe(2)
    expect(knownDecisions(tree)).toEqual(new Set(['使用 link 依赖']))
  })

  it('keeps later items as pending and unchecks later completions before the cutoff', () => {
    const tree = buildTree(records, records[1]!.seq)
    expect(tree.byKey.get(nodeKey([A, '实现服务'], 1))?.status).toBe('pending')
    expect(tree.byKey.get(nodeKey([A, '准备环境'], 1))?.status).toBe('current')
    expect(tree.included).toBe(2)
    const before = buildTree(records, 0)
    expect([...before.byKey.values()].every(node => node.status === 'pending')).toBe(true)
    expect(before.activeKeys).toEqual([nodeKey([A], 0), nodeKey([A, '准备环境'], 1), nodeKey([A, '准备环境', '配置 Yarn'], 2)])
    expect(before.activeKey).toBeUndefined()
  })

  it('marks the current branch done once the Session settles', () => {
    const tree = buildTree(records, { settled: true })
    expect([...tree.byKey.values()].every(node => node.status === 'done')).toBe(true)
    expect(tree.activeKey).toBeUndefined()
  })

  it('lists the children in progress until the item is expanded', () => {
    const tree = buildTree(records)
    const show = (toggled: string[]) => visibleRows(tree, { toggled: new Set(toggled) })
      .map(row => `${row.node.title}${row.expanded ? '-' : row.partial ? '*' : ''}`)
    expect(show([])).toEqual([`${A}*`, '准备环境*', '安装 vendor'])
    expect(show([nodeKey([A], 0)])).toEqual([`${A}-`, '准备环境*', '安装 vendor', '实现服务'])
    expect(show([nodeKey([A, '准备环境'], 1)])).toEqual([`${A}*`, '准备环境-', '配置 Yarn', '安装 vendor'])
  })

  it('marks the level holding the current item for scrolling', () => {
    const tree = buildTree([
      ...['一', '二', '三', '四'].map(title => record(['根', '阶段', title])),
      record(['根', '阶段', '五', '细节']),
      record(['根', '旧', '甲']),
      record(['根', '旧', '乙']),
      record(['根', '阶段', '五', '细节二']),
    ])
    const show = (toggled: string[]) => visibleRows(tree, { toggled: new Set(toggled) })
      .map(row => `${row.depth}:${row.node.title}${row.scrollGroup === undefined ? '' : '*'}`)
    expect(show([])).toEqual(['0:根', '1:阶段', '2:五', '3:细节二*'])
    expect(show([nodeKey(['根', '阶段', '五'], 2)])).toEqual(['0:根', '1:阶段', '2:五', '3:细节*', '3:细节二*'])
    const shallow = buildTree([record(['根', '甲']), record(['根', '乙'])])
    const rows = visibleRows(shallow, { toggled: new Set() })
    expect(rows.map(row => `${row.node.title}${row.scrollGroup === undefined ? '' : '*'}`)).toEqual(['根', '乙*'])
    expect(new Set(rows.flatMap(row => row.scrollGroup ?? [])).size).toBe(1)
  })

  it('outlines the current branch for the prompt and collapses over the cap', () => {
    const tree = buildTree(records)
    expect(outlineForPrompt(tree, 60)).toBe([
      `- [current] ${A}`,
      '  - [current] 准备环境',
      '    - [done] 配置 Yarn',
      '    - [active] 安装 vendor',
      '        decision: 使用 link 依赖',
      '        detail: detail 安装 vendor',
      '  - [done] 实现服务',
    ].join('\n'))
    expect(outlineForPrompt(tree, 4)).toContain('(+1 earlier done items)')
    expect(outlineForPrompt(buildTree([]), 10)).toBe('')
  })
})

describe('reported paths', () => {
  const ROOT = 'OPPO PKM110 手机 root 与 KernelSU/LSPosed 配置'
  const resolvedPath = (path: string[], tree: ReturnType<typeof buildTree>) => {
    const resolution = resolveReportedPath(path, tree)
    return resolution.kind === 'resolved' ? resolution.path : resolution
  }

  it('keeps one item when a retyped separator would fork it', () => {
    const first = record([ROOT, '运行 CVE 注入获取 root'])
    const second = record([ROOT, '安装管理器'])
    const tree = buildTree([first, second])
    expect(identityText('KernelSU/LSPosed')).toBe(identityText('KernelSU-LSPosed'))
    expect(resolvedPath(['OPPO PKM110 手机 root 与 KernelSU-LSPosed 配置', '安装管理器'], tree))
      .toEqual([ROOT, '安装管理器'])
    const folded = buildTree([first, second, record(resolvedPath(['OPPO PKM110 手机 root 与 KernelSU-LSPosed 配置'], tree))])
    expect(folded.roots.map(node => node.title)).toEqual([ROOT])
    expect(folded.totalCount).toBe(3)
  })

  it('takes @ as the previous report item and keeps the ancestors it names', () => {
    const tree = buildTree([record([ROOT, '运行 CVE 注入获取 root']), record([ROOT, '安装管理器'])])
    expect(resolvedPath(['@', '@', '更新 KernelSU 模块'], tree)).toEqual([ROOT, '安装管理器', '更新 KernelSU 模块'])
    expect(resolvedPath(['@'], tree)).toEqual([ROOT])
  })

  it('takes @ as the latest sibling of the level after a move to another branch', () => {
    const tree = buildTree([record(['A', 'A1']), record(['A', 'A2']), record(['C', 'C1'])])
    expect(resolvedPath(['A', '@'], tree)).toEqual(['A', 'A2'])
    expect(resolvedPath(['@'], tree)).toEqual(['C'])
  })

  it('rejects @ where the tree has no item yet', () => {
    expect(resolveReportedPath(['@'], buildTree([]))).toEqual({ kind: 'unresolved-alias', depth: 0 })
    expect(resolveReportedPath(['新任务', '@'], buildTree([record(['A'])]))).toEqual({ kind: 'unresolved-alias', depth: 1 })
  })

  it('keeps items that name different work and items with no identity text', () => {
    const tree = buildTree([record([ROOT])])
    expect(resolvedPath(['另一个任务', '子项'], tree)).toEqual(['另一个任务', '子项'])
    expect(resolvedPath(['...'], tree)).toEqual(['...'])
  })

  it('resolves each level under its own parent', () => {
    const tree = buildTree([record(['A', 'B/x']), record(['C', 'B-y'])])
    expect(resolvedPath(['c', 'b:y'], tree)).toEqual(['C', 'B-y'])
    expect(resolvedPath(['A', 'b.x'], tree)).toEqual(['A', 'B/x'])
  })
})

const user = (text: string): RequestMessage => ({ role: 'user', content: [{ type: 'text', text }] })
const messages = [
  { role: 'system', content: [{ type: 'text', text: 'SYSTEM' }], id: 's', source: { kind: 'system-prompt' } },
  user('请修复'),
  { role: 'assistant', content: [{ type: 'reasoning', text: 'hmm' }, { type: 'tool-call', id: ToolCallId('c1'), name: 'read', arguments: '{"path":"a.ts"}' }], id: 'a1', source: { kind: 'model' } },
  { role: 'tool', toolCallId: ToolCallId('c1'), content: [{ type: 'text', text: 'x'.repeat(30) }], id: 't1', source: { kind: 'tool' } },
  { role: 'assistant', content: [{ type: 'text', text: '完成' }], id: 'a2', source: { kind: 'model' } },
] as unknown as RequestMessage[]

describe('transcript and checkpoints', () => {
  it('renders deterministic append-only text without system prompt or reasoning', () => {
    const text = renderTranscript(messages, 0, messages.length, { toolResultMaxChars: 10 })
    expect(text).toBe('\n## User\n请修复\n\n## Assistant\n[call read {"path":"a…[truncated 5 chars]]\n\n## Result of read\nxxxxxxxxxx…[truncated 20 chars]\n\n## Assistant\n完成\n')
    expect(renderTranscript(messages, 0, 3, { toolResultMaxChars: 10 })).toBe(text.slice(0, renderTranscript(messages, 0, 3, { toolResultMaxChars: 10 }).length))
  })

  it('never places a boundary on a tool result', () => {
    expect(snapBoundary(messages, 3, 0)).toBe(2)
    expect(snapBoundary(messages, 1, 1)).toBeUndefined()
  })

  it('advances when too many messages follow the boundary and rebuilds after a prefix change', () => {
    const config = { everyMessages: 2, keepMessages: 1, summaryMaxTokens: 10, toolResultMaxChars: 10, chunkMaxChars: 1000 }
    expect(planCheckpoint(messages, undefined, config)).toEqual({ kind: 'advance', base: undefined, from: 0, boundary: 4 })
    const current = { id: 'c', boundary: 2, prefixHash: prefixHash(messages, 2), summary: 's' }
    expect(planCheckpoint(messages, current, { ...config, everyMessages: 3 })).toEqual({ kind: 'use', checkpoint: current })
    const changed = [messages[0]!, user('另一个任务'), ...messages.slice(2)]
    expect(planCheckpoint(changed, current, config)).toMatchObject({ kind: 'advance', base: undefined, from: 0 })
    expect(chunkTranscript(messages, 0, 5, 40, { toolResultMaxChars: 10 }).length).toBeGreaterThan(1)
  })
})

describe('requests and titles', () => {
  it('appends the question and swaps only the route for a cheap fork', () => {
    const captured = { provider: 'main', model: 'big', maxTokens: 9000, temperature: 0.3, messages: messages.slice(0, 2), tools: [] }
    const cheap = forkRequest(captured, 'Q', { provider: 'cheap', model: 'tiny' })
    expect(cheap).toEqual({ provider: 'cheap', model: 'tiny', messages: [...captured.messages, user('Q')], tools: [] })
    expect(forkRequest(captured, 'Q')).toMatchObject({ provider: 'main', maxTokens: 9000, temperature: 0.3 })
  })

  it('states the output language and depth', () => {
    const question = createQuestion({ maxDepth: 3, outline: '', locale: 'zh', retry: true })
    expect(question).toContain('1 to 3 levels')
    expect(question).toContain('"zh"')
    expect(question).toContain('Regenerate it.')
  })

  it('keeps titles the user chose', () => {
    const snapshot = (title: string, kind: 'user' | 'fallback') => ({ title, source: { kind }, messageSeqs: [], eventSeq: 0, updatedAt: 0 }) as never
    expect(mayReplaceTitle(undefined, undefined, 'A')).toBe(true)
    expect(mayReplaceTitle(snapshot('X', 'fallback'), undefined, 'A')).toBe(true)
    expect(mayReplaceTitle(snapshot('X', 'user'), undefined, 'A')).toBe(false)
    expect(mayReplaceTitle(snapshot('X', 'user'), 'X', 'A')).toBe(true)
    expect(mayReplaceTitle(snapshot('A', 'user'), 'A', 'A')).toBe(false)
  })
})
