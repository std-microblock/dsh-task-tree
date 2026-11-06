// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChangeNode, ChangeRow, firstChangedSegment } from '../../src/client/ChangeRow.tsx'
import type { TaskChangeData } from '../../src/client/definition.ts'
import { t } from './fixture.ts'

afterEach(cleanup)

const insert = { onInsert: vi.fn(), insertDisabled: false }

const change: TaskChangeData = {
  id: 'report-7', seq: 70, path: ['TypeORM封装', '准备环境', '配置 Yarn'], previousPath: ['TypeORM封装', '准备环境', '安装 Node'],
  detail: '正在写入 .yarnrc.yml', decisions: [],
}

describe('change row', () => {
  it('labels a path change with its deepest item and carries the record anchors', () => {
    const { container } = render(<ChangeRow data={change} expanded={false} onToggle={vi.fn()} {...insert} t={t} />)
    const root = container.querySelector<HTMLElement>('[data-task-tree-record]')!
    expect(root.dataset.taskTreeRecord).toBe('report-7')
    expect(root.dataset.taskTreeSeq).toBe('70')
    expect(screen.getByText('事项变更')).toBeTruthy()
    expect(screen.getByText('配置 Yarn').hasAttribute('data-changed')).toBe(true)
    expect(screen.queryByText('正在写入 .yarnrc.yml')).toBeNull()
  })

  it('expands into the highlighted breadcrumb, the detail, and the decisions', () => {
    const toggle = vi.fn()
    const view = render(<ChangeRow data={{ ...change, decisions: ['改用 Yarn 4'] }} expanded={false} onToggle={toggle} {...insert} t={t} />)
    fireEvent.click(screen.getByRole('button', { expanded: false }))
    expect(toggle).toHaveBeenCalledOnce()
    view.rerender(<ChangeRow data={{ ...change, decisions: ['改用 Yarn 4'] }} expanded onToggle={toggle} {...insert} t={t} />)
    const crumbs = within(screen.getByRole('list', { name: '事项路径' })).getAllByRole('listitem')
    expect(crumbs.map(item => [item.textContent, item.hasAttribute('data-changed')])).toEqual([
      ['TypeORM封装', false], ['准备环境', false], ['配置 Yarn', true],
    ])
    expect(screen.getByText('正在写入 .yarnrc.yml')).toBeTruthy()
    fireEvent.click(within(screen.getByRole('list', { name: '决策' })).getByRole('button', { name: '改用 Yarn 4' }))
    expect(insert.onInsert).toHaveBeenCalledWith('改用 Yarn 4')
  })

  it('titles a decision-only report with the decision count', () => {
    render(<ChangeRow data={{ ...change, previousPath: change.path, decisions: ['a', 'b'] }} expanded={false} onToggle={vi.fn()} {...insert} t={t} />)
    expect(screen.getByText('新增决策 (2)')).toBeTruthy()
    expect(screen.getByText('配置 Yarn').hasAttribute('data-changed')).toBe(false)
  })

  it('quotes a decision at the composer cursor, then persists and focuses the draft', () => {
    const span = { start: 3, end: 7, revision: 2 }
    const inputActions = { captureInsertion: vi.fn(() => span), insertText: vi.fn(() => true), persistDraft: vi.fn() }
    const focusComposer = vi.fn()
    const props = {
      node: { data: { ...change, decisions: ['改用 Yarn 4'] } }, sessionId: 's1',
      useDisclosure: () => ({ expanded: true, setExpanded: vi.fn(), toggle: vi.fn() }),
      useInput: <S,>(select: (state: { phase: string }) => S) => select({ phase: 'plain' }),
      inputActions, focusComposer, t,
    }
    render(<ChangeNode {...props as never} />)
    fireEvent.click(screen.getByRole('button', { name: '改用 Yarn 4' }))
    expect(inputActions.insertText).toHaveBeenCalledWith('> 改用 Yarn 4\n', { start: 3, end: 3, revision: 2 })
    expect(inputActions.persistDraft).toHaveBeenCalledOnce()
    expect(focusComposer).toHaveBeenCalledWith('s1')
  })

  it('refuses insertion while the composer is not in its plain phase', () => {
    const props = {
      node: { data: { ...change, decisions: ['x'] } }, sessionId: 's1',
      useDisclosure: () => ({ expanded: true, setExpanded: vi.fn(), toggle: vi.fn() }),
      useInput: <S,>(select: (state: { phase: string }) => S) => select({ phase: 'sending' }),
      inputActions: {}, focusComposer: vi.fn(), t,
    }
    render(<ChangeNode {...props as never} />)
    expect(screen.getByRole('button', { name: 'x' }).hasAttribute('disabled')).toBe(true)
  })

  it('finds the first changed segment', () => {
    expect(firstChangedSegment(['a', 'b'], ['a', 'c'])).toBe(1)
    expect(firstChangedSegment(['a'], ['a'])).toBe(1)
    expect(firstChangedSegment(['x'], [])).toBe(0)
  })
})
