// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildTree } from '../../src/tree.ts'
import { TreeView, type TreeViewProps } from '../../src/client/TreeView.tsx'
import { record, t } from './fixture.ts'

afterEach(cleanup)

function rows() {
  return [
    record(['Root', 'Step 1']),
    record(['Root', 'Step 2']),
    record(['Root', 'Step 3']),
    record(['Root', 'Step 4'], { decisions: ['Pick SQLite'] }),
    record(['Root', 'Step 5', 'Sub A']),
  ]
}

function view(props: Partial<TreeViewProps> & Pick<TreeViewProps, 'tree'>) {
  const onJump = vi.fn()
  const onInsert = vi.fn()
  const rendered = render(<TreeView sessionId="s" live running onJump={onJump} onInsert={onInsert} insertDisabled={false} t={t} {...props} />)
  return { onJump, onInsert, container: rendered.container }
}

function statusOf(name: string): string | null | undefined {
  return screen.getByText(name).closest('[data-status]')?.getAttribute('data-status')
}

describe('tree view', () => {
  it('lists the items in progress and hides the completed ones until the item is expanded', () => {
    const records = rows()
    const { container } = view({ tree: buildTree(records) })
    expect(statusOf('Root')).toBe('current')
    expect(statusOf('Sub A')).toBe('active')
    expect(screen.getByText(records[4]!.detail)).toBeTruthy()
    expect(screen.queryByText('Step 3')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '展开 Root' }))
    expect(statusOf('Step 3')).toBe('done')
    expect(container.textContent).not.toMatch(/\d+\/\d+/u)
  })

  it('scrolls the expanded level holding the current item in its own viewport', () => {
    const records = [...rows(), record(['Other', 'Old 1']), record(['Other', 'Old 2']), record(['Root', 'Step 5', 'Sub B'])]
    const { container } = view({ tree: buildTree(records) })
    fireEvent.click(screen.getByRole('button', { name: '展开 Step 5' }))
    const viewport = container.querySelector<HTMLElement>('.dsh-task-tree-scroll-group')!
    expect([...viewport.querySelectorAll('.dsh-task-tree-title')].map(title => title.textContent)).toEqual(['Sub A', 'Sub B'])
    expect(container.querySelectorAll('.dsh-task-tree-scroll-group')).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: '展开 Other' }))
    expect(statusOf('Old 1')).toBe('done')
    expect(screen.getByText('Old 1').closest('.dsh-task-tree-scroll-group')).toBeNull()
  })

  it('toggles an item with children instead of jumping, and jumps from a leaf', () => {
    const records = rows()
    const { onJump } = view({ tree: buildTree(records) })
    const parent = screen.getByRole('button', { name: '展开 Root' })
    expect(parent.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(parent)
    expect(onJump).not.toHaveBeenCalled()
    expect(statusOf('Step 3')).toBe('done')
    fireEvent.click(screen.getByRole('button', { name: '收起 Root' }))
    expect(screen.queryByText('Step 3')).toBeNull()
    fireEvent.click(screen.getByText('Sub A'))
    expect(onJump).toHaveBeenCalledWith({ recordId: records[4]!.id, contextSeq: records[4]!.contextSeq, turn: 1 })
  })

  it('keeps the expand glyph on a collapsed item that still lists items in progress', () => {
    view({ tree: buildTree(rows()) })
    const root = screen.getByRole('button', { name: '展开 Root' })
    expect(root.hasAttribute('data-partial')).toBe(true)
    expect(root.hasAttribute('data-expanded')).toBe(false)
    fireEvent.click(root)
    expect(root.hasAttribute('data-expanded')).toBe(true)
    expect(root.hasAttribute('data-partial')).toBe(false)
    expect(screen.getByRole('button', { name: '展开 Step 5' }).hasAttribute('data-partial')).toBe(true)
  })

  it('quotes a decision into the composer', () => {
    const { onInsert } = view({ tree: buildTree(rows()) })
    fireEvent.click(screen.getByRole('button', { name: '展开 Root' }))
    fireEvent.click(screen.getByRole('button', { name: '1 条决策' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pick SQLite' }))
    expect(onInsert).toHaveBeenCalledWith('Pick SQLite')
  })

  it('disables decision insertion while the composer is busy', () => {
    view({ tree: buildTree(rows()), insertDisabled: true })
    fireEvent.click(screen.getByRole('button', { name: '展开 Root' }))
    fireEvent.click(screen.getByRole('button', { name: '1 条决策' }))
    expect(screen.getByRole('button', { name: 'Pick SQLite' }).hasAttribute('disabled')).toBe(true)
  })

  it('keeps later items as pending at a cutoff and collapses a stopped Session', () => {
    const records = rows()
    view({ tree: buildTree(records, { cutoffSeq: records[2]!.seq }), live: false })
    expect(statusOf('Step 3')).toBe('active')
    expect(statusOf('Step 5')).toBe('pending')
    expect(screen.getAllByRole('img', { name: '尚未开始' }).length).toBeGreaterThan(0)
    cleanup()
    view({ tree: buildTree(records, { cutoffSeq: -1 }), live: false })
    expect(statusOf('Step 1')).toBe('pending')
    cleanup()
    view({ tree: buildTree(records, { settled: true }), running: false })
    expect(statusOf('Root')).toBe('done')
    expect(screen.queryByText('Sub A')).toBeNull()
  })
})
