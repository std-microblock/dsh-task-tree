// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConfigPage, type HostSettings } from '../../src/client/ConfigPage.tsx'
import type { ModelCatalogSnapshot } from '../../src/client/stores.ts'
import { hook, t } from './fixture.ts'

afterEach(cleanup)

const empty = { provider: '', model: '', reasoningEffort: '' }
const groups = [
  { id: 'deepseek', name: 'DeepSeek', models: [
    { id: 'deepseek-chat', name: 'DeepSeek Chat' },
    { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'high' } },
  ] },
]

function renderPage(value: HostSettings | undefined, options: {
  view?: 'page' | 'summary'; status?: 'ready' | 'unavailable'; writable?: boolean; catalog?: ModelCatalogSnapshot
} = {}) {
  const retryCatalog = vi.fn()
  const setConfig = vi.fn().mockResolvedValue(true)
  const setMode = vi.fn()
  const setFollowScroll = vi.fn()
  const snapshot = { status: options.status ?? 'ready', value, base: undefined, user: undefined, revision: 1, writable: options.writable ?? true }
  const view = render(<ConfigPage {...{
    view: options.view ?? 'page', useConfig: hook(snapshot),
    useView: hook({ mode: 'dock', dockExpanded: false, floatOpen: true, followScroll: true }),
    useCatalog: hook(options.catalog ?? { status: 'ready', groups, partial: false }), retryCatalog,
    setConfig, setMode, setFollowScroll, t,
  } as never} />)
  return { setConfig, setMode, setFollowScroll, retryCatalog, container: view.container }
}

describe('configuration page', () => {
  it('renders nothing for the summary view', () => {
    expect(renderPage({ mode: 'fork', replaceTitle: false }, { view: 'summary' }).container.innerHTML).toBe('')
  })

  it('writes the title switch and the generation mode', () => {
    const { setConfig } = renderPage({ mode: 'fork', replaceTitle: false, cheapModel: { provider: 'deepseek', model: 'deepseek-chat', reasoningEffort: '' } })
    fireEvent.click(screen.getByRole('switch', { name: '用最顶级事项作为会话标题' }))
    expect(setConfig).toHaveBeenCalledWith('replaceTitle', true)
    fireEvent.click(screen.getByRole('tab', { name: '廉价模型 + 断点摘要' }))
    expect(setConfig).toHaveBeenCalledWith('mode', 'checkpoint')
  })

  it('keeps the cheap modes disabled until a cheap model is filled in', () => {
    const { setConfig } = renderPage({ mode: 'fork', replaceTitle: true, cheapModel: empty })
    expect(screen.getByRole('tab', { name: '廉价模型' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByRole('tab', { name: '廉价模型 + 断点摘要' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('在下方选择廉价模型后可用')).toBeTruthy()
    fireEvent.click(screen.getByRole('tab', { name: '廉价模型' }))
    expect(setConfig).not.toHaveBeenCalled()
  })

  it('selects the cheap model from the catalog and writes it with the default effort', async () => {
    const { setConfig } = renderPage({ mode: 'fork', replaceTitle: true, cheapModel: empty })
    fireEvent.click(screen.getByRole('button', { name: '选择模型: 未设置' }))
    expect(screen.getByText('DeepSeek')).toBeTruthy()
    fireEvent.click(screen.getByRole('menuitem', { name: /DeepSeek Reasoner/u }))
    expect(setConfig).toHaveBeenCalledWith('cheapModel', { provider: 'deepseek', model: 'deepseek-reasoner', reasoningEffort: 'high' })
    await waitFor(() => { expect(screen.queryByRole('menu')).toBeNull() })
  })

  it('offers the reasoning effort of the chosen model and clearing', async () => {
    const { setConfig } = renderPage({ mode: 'fork-cheap', replaceTitle: true, cheapModel: { provider: 'deepseek', model: 'deepseek-reasoner', reasoningEffort: 'high' } })
    fireEvent.click(screen.getByRole('button', { name: '推理强度: High' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Low/u }))
    expect(setConfig).toHaveBeenCalledWith('cheapModel', { provider: 'deepseek', model: 'deepseek-reasoner', reasoningEffort: 'low' })
    const picker = screen.getByRole('button', { name: '选择模型: DeepSeek · DeepSeek Reasoner' })
    await waitFor(() => { expect(picker.hasAttribute('disabled')).toBe(false) })
    fireEvent.click(picker)
    fireEvent.click(screen.getByRole('menuitem', { name: '清除' }))
    expect(setConfig).toHaveBeenLastCalledWith('cheapModel', empty)
  })

  it('names a stored model missing from the catalog and retries a failed catalog read', () => {
    const { retryCatalog } = renderPage({ mode: 'fork', replaceTitle: true, cheapModel: { provider: 'gone', model: 'm', reasoningEffort: '' } },
      { catalog: { status: 'error', groups: [], partial: false } })
    expect(screen.getByRole('alert').textContent).toBe('无法加载模型列表')
    fireEvent.click(screen.getByRole('button', { name: '重试' }))
    expect(retryCatalog).toHaveBeenCalledOnce()
    cleanup()
    renderPage({ mode: 'fork', replaceTitle: true, cheapModel: { provider: 'gone', model: 'm', reasoningEffort: '' } })
    expect(screen.getByRole('button', { name: '选择模型: gone · m（不在当前模型列表中）' })).toBeTruthy()
  })

  it('shows only the browser preferences while the Host does not serve the configuration', () => {
    const { setMode, setFollowScroll } = renderPage(undefined, { status: 'unavailable' })
    expect(screen.queryByRole('switch', { name: '用最顶级事项作为会话标题' })).toBeNull()
    fireEvent.click(screen.getByRole('tab', { name: '右上角浮窗' }))
    expect(setMode).toHaveBeenCalledWith('floating')
    fireEvent.click(screen.getByRole('switch', { name: '跟随对话位置' }))
    expect(setFollowScroll).toHaveBeenCalledWith(false)
  })
})
