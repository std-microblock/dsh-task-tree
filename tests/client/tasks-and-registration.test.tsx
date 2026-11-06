// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Context } from '@deepseek-ai/cordis'
import { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/src/client/registry.ts'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { apply, inject } from '../../src/client/index.ts'
import { TasksIcon, TasksPage } from '../../src/client/TasksPage.tsx'
import { createSeenStore } from '../../src/client/stores.ts'
import { LIST_METHOD, TASK_TREE_CHANNEL } from '../../src/protocol.ts'
import { hook, t } from './fixture.ts'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

const rows = [
  { sessionId: 's1', rootTitle: '迁移数据库', path: ['迁移数据库', '写脚本'], detail: '处理外键', doneCount: 1, totalCount: 3, lastRecordSeq: 9, updatedAt: Date.now() - 120_000 },
  { sessionId: 's2', rootTitle: '修复登录', path: ['修复登录'], detail: '已完成', doneCount: 2, totalCount: 2, lastRecordSeq: 4, updatedAt: Date.now() - 10_000 },
]

describe('tasks page', () => {
  it('lists Sessions newest first, filters unread, and opens a row', () => {
    const openSession = vi.fn()
    const list = { status: 'ready' as const, rows }
    render(<TasksPage {...{ useTaskList: hook(list), useSeen: hook({ s2: 4 }), openSession, retry: vi.fn(), t } as never} />)
    const buttons = screen.getAllByRole('listitem').map(item => item.textContent)
    expect(buttons[0]).toContain('修复登录')
    expect(buttons[1]).toContain('写脚本 · 处理外键')
    expect(buttons[1]).toContain('2 分钟前')
    expect(screen.getAllByRole('img', { name: '有未读更新' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: '未读' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    fireEvent.click(screen.getByText('迁移数据库'))
    expect(openSession).toHaveBeenCalledWith('s1', 9)
  })

  it('offers retry when the first read fails', () => {
    const retry = vi.fn().mockResolvedValue(undefined)
    render(<TasksPage {...{ useTaskList: hook({ status: 'error', rows: [] }), useSeen: hook({}), openSession: vi.fn(), retry, t } as never} />)
    fireEvent.click(screen.getByRole('button', { name: '重试' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('marks the sidebar icon while any row is unread', () => {
    const view = render(<TasksIcon {...{ size: 20, active: false, useTaskList: hook({ status: 'ready', rows }), useSeen: hook({ s1: 9, s2: 4 }) } as never} />)
    expect(view.container.querySelector('.dsh-task-tree-unread-dot')).toBeNull()
    view.rerender(<TasksIcon {...{ size: 20, active: false, useTaskList: hook({ status: 'ready', rows }), useSeen: hook({ s2: 4 }) } as never} />)
    expect(view.container.querySelector('.dsh-task-tree-unread-dot')).not.toBeNull()
  })
})

describe('registration', () => {
  it('registers every entry, opens listed Sessions, and removes everything on dispose', async () => {
    const ctx = new Context()
    await ctx.plugin(SlotRegistry).await()
    const call = vi.fn().mockResolvedValue({ ok: true, value: { rows, pollIntervalMs: 60_000 } })
    const register = vi.fn(() => () => {})
    const openSession = vi.fn()
    const loadThrough = vi.fn().mockResolvedValue(undefined)
    const form = { ...createSnapshotStore({ status: 'loading', value: undefined, base: undefined, user: undefined, revision: undefined, writable: false }), set: vi.fn() }
    ctx.provide('connection', { rpc: { call } } as never)
    ctx.provide('uiConversation', { events: { register } } as never)
    ctx.provide('locale', { register: () => () => {}, bind: () => (key: string) => key } as never)
    ctx.provide('sessions', {
      list: createSnapshotStore({ phase: 'ready', ids: ['s1'], byId: {} }),
      binding: () => ({ session: { loadThrough }, ctx: {} }),
    } as never)
    ctx.provide('workspaces', { list: createSnapshotStore({ state: 'idle', phase: 'ready', archivedSessionIds: [] }) } as never)
    ctx.provide('uiWorkspace', { openSession } as never)
    const focus = vi.fn()
    ctx.provide('conversation', { input: { for: () => ({ focus }) } } as never)
    ctx.provide('configForms', { get: () => form } as never)
    const modelCatalog = vi.fn().mockResolvedValue({ ok: true, value: { groups: [], failures: [] } })
    const remoteListeners = new Map<string, () => void>()
    ctx.provide('remote', { session: { modelCatalog }, $on: (name: string, listener: () => void) => { remoteListeners.set(name, listener); return () => { remoteListeners.delete(name) } } } as never)
    ctx.provide('remote.session', {} as never)
    const owner = ctx.slots.register({ name: 'root', children: {
      'conversation.chat.node': { kind: 'keyed', scope: 'session' },
      'conversation.input.dock': { kind: 'list', scope: 'session' },
      'conversation.session.header.utilities': { kind: 'list', scope: 'session' },
      'main': { kind: 'keyed', scope: 'root' },
      'sidebar.panellist': { kind: 'list', scope: 'root' },
      'plugins.bundle.config': { kind: 'keyed', scope: 'root' },
    } } as never, () => null)
    const fiber = ctx.plugin({ inject, apply })
    await fiber.await()
    const names = ['conversation.chat.node', 'conversation.input.dock', 'conversation.session.header.utilities',
      'main', 'sidebar.panellist', 'plugins.bundle.config'] as const
    try {
      expect(register).toHaveBeenCalledOnce()
      for (const name of names) expect(ctx.slots.entries(name)).toHaveLength(1)
      expect(document.head.querySelector('style[data-dsh-task-tree]')).not.toBeNull()
      const main = ctx.slots.entries('main')[0]!
      const face = main.inject!(undefined as never) as { openSession(id: string, seq: number): void; hooks: { seen: { getSnapshot(): unknown } } }
      face.openSession('s1', 9)
      face.openSession('s9', 3)
      expect(openSession).toHaveBeenCalledExactlyOnceWith('s1')
      expect(face.hooks.seen.getSnapshot()).toEqual({ s1: 9 })
      const dock = ctx.slots.entries('conversation.input.dock')[0]!
      const cards = dock.inject!('s1' as never) as { ensureLoaded(id: string, seq: number): Promise<void> }
      await cards.ensureLoaded('s1', 12)
      expect(loadThrough).toHaveBeenCalledWith(12)
      const node = ctx.slots.entries('conversation.chat.node')[0]!
      ;(node.inject!('s1' as never) as { focusComposer(id: string): void }).focusComposer('s1')
      expect(focus).toHaveBeenCalledOnce()
      const page = ctx.slots.entries('plugins.bundle.config')[0]!
      expect(page.options.key).toBe('dsh-task-tree')
      const config = page.inject!(undefined as never) as { setConfig(field: string, value: unknown): Promise<boolean>; setFollowScroll(follow: boolean): void; hooks: { view: { getSnapshot(): { followScroll: boolean } }; catalog: { subscribe(listener: () => void): () => void } } }
      form.set.mockResolvedValue(true)
      await expect(config.setConfig('cheapModel', { provider: 'p', model: 'm', reasoningEffort: '' })).resolves.toBe(true)
      expect(form.set).toHaveBeenCalledWith('cheapModel', { provider: 'p', model: 'm', reasoningEffort: '' })
      const offCatalog = config.hooks.catalog.subscribe(() => {})
      expect(modelCatalog).toHaveBeenCalledOnce()
      remoteListeners.get('llm/adapters-updated')!()
      expect(modelCatalog).toHaveBeenCalledTimes(2)
      offCatalog()
      config.setFollowScroll(false)
      expect(config.hooks.view.getSnapshot().followScroll).toBe(false)
      const icon = ctx.slots.entries('sidebar.panellist')[0]!
      const iconFace = icon.inject!(undefined as never) as { hooks: { taskList: { subscribe(listener: () => void): () => void; getSnapshot(): { status: string } } } }
      const off = iconFace.hooks.taskList.subscribe(() => {})
      await vi.waitFor(() => { expect(iconFace.hooks.taskList.getSnapshot().status).toBe('ready') })
      expect(call).toHaveBeenCalledWith(TASK_TREE_CHANNEL, LIST_METHOD, {})
      off()
    } finally {
      await fiber.dispose()
      owner()
    }
    for (const name of names) expect(ctx.slots.entries(name)).toHaveLength(0)
    expect(document.head.querySelector('style[data-dsh-task-tree]')).toBeNull()
    await ctx.fiber.dispose()
    expect(createSeenStore('dsh-task-tree.seen.v1').getSnapshot()).toEqual({ s1: 9 })
  })
})
