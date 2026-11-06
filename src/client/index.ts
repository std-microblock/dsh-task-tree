/**
 * Browser half of the task tree: the work-details change row, the dock and
 * floating tree cards, the Tasks main panel with unread marks, and the bundle's
 * configuration page in the Plugins manager.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { MainPanelId } from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type { SessionId, SessionSeq } from '@deepseek-ai/dsh-session/types'
import type {} from '../projection-types.ts'
import { LIST_METHOD, TASK_TREE_CHANNEL } from '../protocol.ts'
import { ChangeNode, type ChangeNodeInjected } from './ChangeRow.tsx'
import { ConfigPage, type ConfigPageInjected, type HostSettings } from './ConfigPage.tsx'
import { CHANGE_KIND, taskChangeDefinition } from './definition.ts'
import { en, NS, zh } from './locales.ts'
import { createModelCatalogSource, createSeenStore, createTaskListSource, createViewStore } from './stores.ts'
import { styles } from './styles.ts'
import { TasksIcon, TasksPage, type TasksInjected } from './TasksPage.tsx'
import { DockEntry, FloatEntry, type TreeCardsInjected } from './TreeCards.tsx'

export type { DisplayMode, SeenStore, TaskListSource, ViewStore } from './stores.ts'

/** Host configuration entry id, also the settings namespace. */
const CONFIG_NAMESPACE = 'task-tree'
const PANEL_ID = 'task-tree' as MainPanelId
/** npm package name keying the bundle configuration page. */
const PACKAGE_NAME = 'dsh-task-tree'

/** Services read by the contributions. */
export const inject = [
  'slots', 'locale', 'uiConversation', 'conversation', 'sessions', 'connection', 'uiWorkspace', 'workspaces', 'configForms',
  'remote', 'remote.session',
]

/**
 * Whether a Session can be opened from the Tasks panel.
 * @param ctx - plugin context.
 * @param id - listed Session.
 * @returns true when the Host lists it and it is not archived.
 */
function canOpen(ctx: Context, id: SessionId): boolean {
  const sessions = ctx.sessions.list.getSnapshot()
  const workspaces = ctx.workspaces.list.getSnapshot()
  if (workspaces.state === 'error' || sessions.phase === 'pending' || workspaces.phase === 'pending') return false
  return !workspaces.archivedSessionIds.includes(id) && sessions.ids.includes(id)
}

/**
 * Register every task-tree contribution.
 * @param ctx - browser plugin context.
 */
export function apply(ctx: Context): void {
  const connection = ctx.get('connection') as ConnectionHandle
  ctx.effect(() => ctx.locale.register(NS, { zh, en }))
  const panelLabel = ctx.locale.bind(NS)
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.dshTaskTree = ''
    style.textContent = styles
    document.head.append(style)
    return () => style.remove()
  })
  ctx.uiConversation.events.register(taskChangeDefinition)

  const view = createViewStore()
  const seen = createSeenStore()
  const taskList = createTaskListSource({
    call: async () => {
      const result = await connection.rpc.call(TASK_TREE_CHANNEL, LIST_METHOD, {})
      if (!result.ok) throw new Error(result.error.message)
      return result.value
    },
    onRows: rows => { seen.prune(new Set(rows.map(row => row.sessionId))) },
  })
  const markSeen = (sessionId: string, seq: number) => { seen.markSeen(sessionId, seq) }
  const focusComposer = (sessionId: string) => {
    const binding = ctx.sessions.binding(sessionId as SessionId)
    if (binding !== undefined) ctx.conversation.input.for(binding.ctx).focus()
  }
  const composer: ChangeNodeInjected = { focusComposer }
  const cards: TreeCardsInjected = {
    hooks: { view },
    setMode: mode => { view.setMode(mode) },
    setDockExpanded: expanded => { view.setDockExpanded(expanded) },
    setFloatOpen: open => { view.setFloatOpen(open) },
    markSeen,
    focusComposer,
    ensureLoaded: async (sessionId, seq) => {
      await ctx.sessions.binding(sessionId as SessionId)?.session.loadThrough(seq as SessionSeq)
    },
  }
  const tasks: TasksInjected = {
    hooks: { taskList, seen },
    openSession: (sessionId, seq) => {
      if (!canOpen(ctx, sessionId as SessionId)) return
      seen.markSeen(sessionId, seq)
      ctx.uiWorkspace.openSession(sessionId as SessionId)
    },
    retry: () => taskList.refresh(),
  }
  const form = ctx.configForms.get<HostSettings>(CONFIG_NAMESPACE)
  const catalog = createModelCatalogSource(() => ctx.remote.session.modelCatalog())
  ctx.effect(() => ctx.remote.$on('llm/adapters-updated', () => { catalog.refresh() }))
  ctx.effect(() => ctx.on('connection/reset', () => { catalog.reset() }))
  const configPage: ConfigPageInjected = {
    hooks: { config: form, view, catalog },
    retryCatalog: () => { catalog.refresh() },
    setConfig: (field, value) => form.set(field, value).catch(() => false),
    setMode: mode => { view.setMode(mode) },
    setFollowScroll: follow => { view.setFollowScroll(follow) },
  }

  ctx.slots.inject('conversation.chat.node', () => ctx.slots.register({
    name: 'conversation.chat.node', key: CHANGE_KIND, locale: NS, inject: () => composer,
  }, ChangeNode))
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock', id: 'task-tree', order: 1, locale: NS, inject: () => cards,
  }, DockEntry))
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities', id: 'task-tree', order: -6, locale: NS, inject: () => cards,
  }, FloatEntry))
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: PANEL_ID, locale: NS, inject: () => tasks,
  }, TasksPage))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist', id: PANEL_ID, order: 15, locale: NS, label: () => panelLabel('panel'), inject: () => tasks,
  }, TasksIcon))
  // Host fields render only while the Host serves the 	ask-tree configuration;
  // the display preferences on the same page are this browser's own.
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
    name: 'plugins.bundle.config', key: PACKAGE_NAME, locale: NS, inject: () => configPage,
  }, ConfigPage))
}