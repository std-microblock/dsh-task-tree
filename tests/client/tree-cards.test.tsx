// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DockEntry, FloatEntry } from '../../src/client/TreeCards.tsx'
import type { ViewPreference } from '../../src/client/stores.ts'
import { hook, record, t } from './fixture.ts'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

const records = [record(['发布', '构建']), record(['发布', '上传'])]

function rowStatus(title: string): string | null | undefined {
  return screen.getAllByText(title).map(element => element.closest('[data-status]')).find(row => row !== null)?.getAttribute('data-status')
}

function rowTitles(): (string | null)[] {
  return [...document.querySelectorAll('.dsh-task-tree-row .dsh-task-tree-title')].map(element => element.textContent)
}

function props(view: Partial<ViewPreference>, session = { running: true, openState: 'open' }) {
  return {
    sessionId: 's1',
    useProjection: (_key: string, select: (value: unknown) => unknown) => select({ records }),
    useSession: hook(session),
    useView: hook({ mode: 'dock', dockExpanded: true, floatOpen: true, followScroll: true, ...view }),
    useInput: hook({ phase: 'plain' }), inputActions: {}, focusComposer: vi.fn(),
    setMode: vi.fn(), setDockExpanded: vi.fn(), setFloatOpen: vi.fn(), markSeen: vi.fn(),
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
    t,
  }
}

describe('dock card', () => {
  it('shows the active item without counters, marks the latest report seen, and switches mode', () => {
    const p = props({})
    render(<DockEntry {...p as never} />)
    expect(screen.getByRole('region', { name: '任务树' })).toBeTruthy()
    expect(screen.getAllByText('上传').length).toBeGreaterThan(0)
    expect(screen.getByRole('region', { name: '任务树' }).textContent).not.toMatch(/\d+\/\d+/u)
    expect(rowStatus('上传')).toBe('active')
    expect(p.markSeen).toHaveBeenCalledWith('s1', records[1]!.seq)
    fireEvent.click(screen.getByRole('button', { name: '改为右上角浮窗显示' }))
    expect(p.setMode).toHaveBeenCalledWith('floating')
    fireEvent.click(screen.getByRole('button', { name: '收起任务树' }))
    expect(p.setDockExpanded).toHaveBeenCalledWith(false)
  })

  it('collapses a stopped Session while its title keeps the last item', () => {
    render(<DockEntry {...props({}, { running: false, openState: 'open' }) as never} />)
    expect(rowTitles()).toEqual(['发布'])
    expect(rowStatus('发布')).toBe('done')
    expect(document.querySelector('.dsh-task-tree-card-title')?.textContent).toBe('上传')
  })

  it('renders nothing in floating mode', () => {
    const { container } = render(<DockEntry {...props({ mode: 'floating' }) as never} />)
    expect(container.innerHTML).toBe('')
  })
})

describe('floating card', () => {
  it('toggles from the header and portals the card beside the Session content', () => {
    vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
    document.body.insertAdjacentHTML('beforeend', '<div data-conversation-content data-conversation-session="s1"><div data-conversation-scroll></div></div>')
    const p = props({ mode: 'floating' })
    render(<FloatEntry {...p as never} />)
    fireEvent.click(screen.getByRole('button', { name: '隐藏任务树' }))
    expect(p.setFloatOpen).toHaveBeenCalledWith(false)
    const card = document.body.querySelector<HTMLElement>('.dsh-task-tree-float')!
    expect(card.hasAttribute('data-open')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: '改为输入框上方显示' }))
    expect(p.setMode).toHaveBeenCalledWith('dock')
  })

  it('stays hidden in dock mode or while the Session is not open', () => {
    expect(render(<FloatEntry {...props({}) as never} />).container.innerHTML).toBe('')
    expect(render(<FloatEntry {...props({ mode: 'floating' }, { running: false, openState: 'loading' }) as never} />).container.innerHTML).toBe('')
  })
})
