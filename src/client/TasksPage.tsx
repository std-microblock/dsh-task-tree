/** Tasks main panel: every Session's current task, newest first, with unread marks. */
import { useMemo, useState } from 'react'
import {
  Button, IconChecklistOutlineRegular, IconWarningOutlineRegular, relativeTime, StateDot,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { TaskIndexRow } from '../projection-types.ts'
import type { Translate } from './locales.ts'
import { isUnread, type SeenStore, type TaskListSource } from './stores.ts'
import { CheckMark } from './TreeView.tsx'

/** Sources and actions of the Tasks panel and its sidebar icon. */
export interface TasksInjected {
  readonly hooks: { readonly taskList: TaskListSource; readonly seen: SeenStore }
  /**
   * Open a Session and mark its latest report seen.
   * @param sessionId - listed Session.
   * @param seq - latest record seq of the row.
   */
  readonly openSession: (sessionId: string, seq: number) => void
  /** @returns settlement of a list reload. */
  readonly retry: () => Promise<void>
}

/** Props of the `main` entry. */
export type TasksPageProps = PropsRuntime<'main'> & InjectFace<TasksInjected> & { t: Translate }
/** Props of the `sidebar.panellist` entry. */
export type TasksIconProps = PropsRuntime<'sidebar.panellist'> & InjectFace<TasksInjected>

/**
 * Sidebar glyph with a red dot while any listed Session has an unread report.
 * @param props - requested size and list sources.
 * @returns the decorative icon.
 */
export function TasksIcon({ size, useTaskList, useSeen }: TasksIconProps) {
  const rows = useTaskList(list => list.rows)
  const seen = useSeen(value => value)
  const unread = rows.some(row => isUnread(row, seen))
  return <span className="dsh-task-tree-panel-icon">
    <IconChecklistOutlineRegular size={size} />
    {unread && <span className="dsh-task-tree-unread-dot" data-placement="icon" aria-hidden="true" />}
  </span>
}

type Filter = 'all' | 'unread'

/**
 * Completion mark of one row: a check once every item is done, otherwise a hollow step dot.
 * @param props.finished - whether every listed item is done.
 * @param props.t - copy for the accessible status.
 * @returns the status mark.
 */
export function RowMark({ finished, t }: { finished: boolean; t: Translate }) {
  return <span className="dsh-task-tree-glyph" role="img" aria-label={t(finished ? 'page.finished' : 'page.inProgress')}>
    {finished ? <CheckMark /> : <span className="dsh-task-tree-step-dot" aria-hidden="true" />}
  </span>
}

function timeLabel(at: number, now: number, t: Translate): string {
  const { unit, n } = relativeTime(at, now)
  return t(`time.${unit}`, { n })
}

function summaryOf(row: TaskIndexRow): string {
  const tail = row.path.length > 1 ? row.path[row.path.length - 1] : undefined
  return [tail, row.detail].filter((part): part is string => part !== undefined && part !== '').join(' · ')
}

/**
 * Render the cross-session task list.
 * @param props - list sources, actions, and copy.
 * @returns the panel.
 */
export function TasksPage({ useTaskList, useSeen, openSession, retry, t }: TasksPageProps) {
  const list = useTaskList(value => value)
  const seen = useSeen(value => value)
  const [filter, setFilter] = useState<Filter>('all')
  const rows = useMemo(() => list.rows
    .filter(row => filter === 'all' || isUnread(row, seen))
    .toSorted((left, right) => right.updatedAt - left.updatedAt), [list.rows, filter, seen])
  const now = Date.now()
  const populated = list.rows.length > 0
  return <section className="dsh-task-tree-page" aria-label={t('page.title')}>
    <div className="dsh-task-tree-page-scroll">
      <div className="dsh-task-tree-page-content">
        <div className="dsh-task-tree-page-heading"><h1>{t('page.title')}</h1></div>
        <div className="dsh-task-tree-filters" role="group" aria-label={t('page.filter')}>
          {(['all', 'unread'] as const).map(value => <button key={value} type="button" className="dsh-task-tree-filter"
            aria-pressed={filter === value} onClick={() => { setFilter(value) }}>
            {t(value === 'all' ? 'page.all' : 'page.unread')}
          </button>)}
        </div>
        {list.status === 'loading' && !populated && <div className="dsh-task-tree-page-empty" role="status" aria-label={t('page.loading')}>
          <StateDot state="ongoing" />
        </div>}
        {list.status === 'error' && (populated
          ? <div className="dsh-task-tree-notice">
            <p role="alert">{t('page.error')}</p>
            <Button variant="outline" size="sm" onClick={() => { void retry() }}>{t('page.retry')}</Button>
          </div>
          : <div className="dsh-task-tree-page-empty">
            <IconWarningOutlineRegular size={24} className="dsh-task-tree-page-empty-glyph" />
            <p role="alert">{t('page.error')}</p>
            <Button variant="outline" className="dsh-task-tree-page-empty-action" onClick={() => { void retry() }}>{t('page.retry')}</Button>
          </div>)}
        {list.status === 'ready' && rows.length === 0 && <div className="dsh-task-tree-page-empty" role="status">
          <IconChecklistOutlineRegular size={24} className="dsh-task-tree-page-empty-glyph" />
          <p>{t(filter === 'unread' && populated ? 'page.emptyUnread' : 'page.empty')}</p>
        </div>}
        <ul className="dsh-task-tree-page-rows" aria-label={t('page.list')} aria-busy={list.status === 'loading'}>
          {rows.map((row) => {
            const unread = isUnread(row, seen)
            const summary = summaryOf(row)
            return <li key={row.sessionId}>
              <button type="button" className="dsh-task-tree-page-row" data-unread={unread || undefined}
                onClick={() => { openSession(row.sessionId, row.lastRecordSeq) }}>
                <span className="dsh-task-tree-page-glyph">
                  <RowMark finished={row.totalCount > 0 && row.doneCount >= row.totalCount} t={t} />
                </span>
                <span className="dsh-task-tree-page-content-col">
                  <span className="dsh-task-tree-page-title">{row.rootTitle}</span>
                  {summary !== '' && <span className="dsh-task-tree-page-summary">{summary}</span>}
                </span>
                <span className="dsh-task-tree-page-meta">
                  <time dateTime={new Date(row.updatedAt).toISOString()}>{timeLabel(row.updatedAt, now, t)}</time>
                </span>
                <span className="dsh-task-tree-page-unread">
                  {unread && <span className="dsh-task-tree-unread-dot" role="img" aria-label={t('page.unreadMark')} />}
                </span>
              </button>
            </li>
          })}
        </ul>
      </div>
    </div>
  </section>
}
