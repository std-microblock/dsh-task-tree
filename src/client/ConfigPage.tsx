/** The bundle's own configuration page in the Plugins manager. */
import { useId, useState, type ReactNode } from 'react'
import {
  Button, IconChevronsUpDownOutlineRegular, Menu, SegmentedControl, StateDot, Switch, type MenuEntry,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-plugin-manager/client'
import type { GenerationMode } from '../records.ts'
import type { Translate } from './locales.ts'
import type { DisplayMode, ModelCatalogSnapshot, ModelCatalogSource, ViewStore } from './stores.ts'

/** Provider route of the cheap modes; empty provider and model mean none. */
export interface CheapModel {
  readonly provider: string
  readonly model: string
  readonly reasoningEffort: string
}

/** Host configuration fields of the `task-tree` entry. */
export interface HostSettings {
  readonly mode: GenerationMode
  readonly replaceTitle: boolean
  readonly cheapModel?: Partial<CheapModel> | undefined
}

/** Sources and writers of the configuration page. */
export interface ConfigPageInjected {
  readonly hooks: { readonly config: ConfigForm<HostSettings>; readonly view: ViewStore; readonly catalog: ModelCatalogSource }
  /** Read the model catalog again after a failure. */
  readonly retryCatalog: () => void
  /**
   * Write one Host field.
   * @param field - field name.
   * @param value - new value.
   * @returns whether the Host accepted the write.
   */
  readonly setConfig: (field: 'mode' | 'replaceTitle' | 'cheapModel', value: unknown) => Promise<boolean>
  readonly setMode: (mode: DisplayMode) => void
  readonly setFollowScroll: (follow: boolean) => void
}

/** Props of the `plugins.bundle.config` entry. */
export type ConfigPageProps = PropsRuntime<'plugins.bundle.config'> & InjectFace<ConfigPageInjected> & { t: Translate }

/**
 * Whether a cheap model is configured.
 * @param cheap - stored cheap model.
 * @returns true when both provider and model are set.
 */
export function hasCheapModel(cheap: Partial<CheapModel> | undefined): boolean {
  return (cheap?.provider ?? '') !== '' && (cheap?.model ?? '') !== ''
}

function SettingLine({ title, description, children, stacked = false }: {
  title: string
  description?: string | undefined
  children: ReactNode
  stacked?: boolean
}) {
  return <div className="dsh-task-tree-config-line" data-stacked={stacked || undefined}>
    <div className="dsh-task-tree-config-text">
      <div className="dsh-task-tree-config-title">{title}</div>
      {description !== undefined && <div className="dsh-task-tree-config-description">{description}</div>}
    </div>
    <div className="dsh-task-tree-config-control">{children}</div>
  </div>
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="dsh-task-tree-config-section">
    <h3 className="dsh-task-tree-config-heading">{title}</h3>
    <p className="dsh-task-tree-config-section-description">{description}</p>
    <div className="dsh-task-tree-config-lines">{children}</div>
  </section>
}

type SaveState = 'idle' | 'saving' | 'failed'

const CLEAR_ID = 'clear'

function routeId(provider: string, model: string): string {
  return JSON.stringify([provider, model])
}

/**
 * Cheap-model picker fed by the Host model catalog; a choice is written at once.
 * @param props - stored route, catalog, write action, and copy.
 * @returns the model and reasoning-effort selectors.
 */
export function CheapModelPicker({ stored, catalog, disabled, onSave, onRetry, t }: {
  stored: Partial<CheapModel> | undefined
  catalog: ModelCatalogSnapshot
  disabled: boolean
  onSave: (value: CheapModel) => Promise<boolean>
  onRetry: () => void
  t: Translate
}) {
  const [modelOpen, setModelOpen] = useState(false)
  const [effortOpen, setEffortOpen] = useState(false)
  const [state, setState] = useState<SaveState>('idle')
  const provider = stored?.provider ?? ''
  const model = stored?.model ?? ''
  const effort = stored?.reasoningEffort ?? ''
  const configured = provider !== '' && model !== ''
  const group = catalog.groups.find(item => item.id === provider)
  const entry = group?.models.find(item => item.id === model)
  const save = (value: CheapModel) => {
    setState('saving')
    void onSave(value).then(ok => { setState(ok ? 'idle' : 'failed') }, () => { setState('failed') })
  }
  const label = !configured ? t('config.unset')
    : entry === undefined || group === undefined
      ? catalog.status === 'ready' ? t('config.unavailableModel', { provider, model }) : `${provider} · ${model}`
      : `${group.name} · ${entry.name}`
  const items: MenuEntry[] = catalog.groups.flatMap((item): MenuEntry[] => [
    { type: 'label', id: `group:${item.id}`, text: item.name },
    ...item.models.map((option): MenuEntry => ({ id: routeId(item.id, option.id), label: option.name })),
  ])
  if (configured) items.push({ type: 'separator', id: 'separator' }, { id: CLEAR_ID, label: t('config.clear') })
  const efforts = entry?.reasoning?.efforts ?? []
  const effortName = efforts.find(item => item.id === effort)?.name ?? t('config.effortDefault')
  const busy = disabled || state === 'saving'
  return <div className="dsh-task-tree-config-picker">
    <div className="dsh-task-tree-config-picker-row">
      <Menu
        open={modelOpen}
        onClose={() => { setModelOpen(false) }}
        portal
        align="end"
        items={items}
        selectedId={configured ? routeId(provider, model) : undefined}
        onSelect={(id) => {
          setModelOpen(false)
          if (id === CLEAR_ID) {
            save({ provider: '', model: '', reasoningEffort: '' })
            return
          }
          const [nextProvider, nextModel] = JSON.parse(id) as [string, string]
          const option = catalog.groups.find(item => item.id === nextProvider)?.models.find(item => item.id === nextModel)
          save({ provider: nextProvider, model: nextModel, reasoningEffort: option?.reasoning?.defaultEffort ?? '' })
        }}
        anchor={<button type="button" className="dsh-task-tree-select" aria-haspopup="menu" aria-expanded={modelOpen}
          aria-label={`${t('config.pickModel')}: ${label}`} disabled={busy || items.length === 0}
          data-empty={!configured || undefined} onClick={() => { setModelOpen(open => !open) }}>
          <span className="dsh-task-tree-select-label">{label}</span>
          <IconChevronsUpDownOutlineRegular size={14} />
        </button>}
      />
      {configured && efforts.length > 0 && <Menu
        open={effortOpen}
        onClose={() => { setEffortOpen(false) }}
        portal
        align="end"
        items={efforts.map(item => ({ id: item.id, label: item.name }))}
        selectedId={effort === '' ? undefined : effort}
        onSelect={(id) => {
          setEffortOpen(false)
          save({ provider, model, reasoningEffort: id })
        }}
        anchor={<button type="button" className="dsh-task-tree-select" aria-haspopup="menu" aria-expanded={effortOpen}
          aria-label={`${t('config.effort')}: ${effortName}`} disabled={busy}
          onClick={() => { setEffortOpen(open => !open) }}>
          <span className="dsh-task-tree-select-label">{effortName}</span>
          <IconChevronsUpDownOutlineRegular size={14} />
        </button>}
      />}
    </div>
    {catalog.status === 'loading' && catalog.groups.length === 0 && <p className="dsh-task-tree-config-status" role="status">
      <StateDot state="ongoing" size={12} /> {t('config.catalogLoading')}
    </p>}
    {catalog.status === 'error' && <p className="dsh-task-tree-config-status" data-tone="error">
      <span role="alert">{t('config.catalogError')}</span>
      <Button variant="outline" size="sm" onClick={onRetry}>{t('config.retry')}</Button>
    </p>}
    {catalog.status === 'ready' && catalog.groups.length === 0 && <p className="dsh-task-tree-config-status">{t('config.catalogEmpty')}</p>}
    {catalog.status === 'ready' && catalog.partial && catalog.groups.length > 0
      && <p className="dsh-task-tree-config-status">{t('config.catalogPartial')}</p>}
    {state === 'failed' && <p className="dsh-task-tree-config-status" data-tone="error" role="alert">{t('config.saveFailed')}</p>}
  </div>
}

/**
 * Render the configuration page: Host generation options while the Host serves
 * them, plus this browser's display preferences.
 * @param props - page view, configuration sources, writers, and copy.
 * @returns the page body, or nothing for the summary view.
 */
export function ConfigPage({ view, useConfig, useView, useCatalog, retryCatalog, setConfig, setMode, setFollowScroll, t }: ConfigPageProps) {
  const config = useConfig(snapshot => snapshot)
  const catalog = useCatalog(snapshot => snapshot)
  const display = useView(value => value.mode)
  const follow = useView(value => value.followScroll)
  const id = useId()
  if (view !== 'page') return null
  const value = config.status === 'ready' ? config.value : undefined
  const locked = !config.writable
  const cheap = hasCheapModel(value?.cheapModel)
  const cheapHint = cheap ? {} : { title: t('config.cheapMissing') }
  return <div className="dsh-task-tree-config">
    {value !== undefined && <>
      <Section title={t('config.generation')} description={t('config.generationDescription')}>
        <SettingLine title={t('config.replaceTitle')} description={t('config.replaceTitleDescription')}>
          <Switch checked={value.replaceTitle} label={t('config.replaceTitle')} disabled={locked}
            onChange={(next) => { void setConfig('replaceTitle', next) }} />
        </SettingLine>
        <SettingLine title={t('config.mode')} description={cheap ? t('config.modeDescription') : t('config.cheapMissing')} stacked>
          <SegmentedControl<GenerationMode>
            id={`${id}-mode`}
            label={t('config.mode')}
            value={value.mode}
            disabled={locked}
            onChange={(next) => { void setConfig('mode', next) }}
            options={[
              { value: 'fork', label: t('config.mode.fork') },
              { value: 'fork-cheap', label: t('config.mode.forkCheap'), disabled: !cheap, ...cheapHint },
              { value: 'checkpoint', label: t('config.mode.checkpoint'), disabled: !cheap, ...cheapHint },
            ]}
          />
        </SettingLine>
      </Section>
      <Section title={t('config.cheapModel')} description={t('config.cheapModelDescription')}>
        <SettingLine title={t('config.pickModel')} stacked>
          <CheapModelPicker stored={value.cheapModel} catalog={catalog} disabled={locked} t={t}
            onSave={next => setConfig('cheapModel', next)} onRetry={retryCatalog} />
        </SettingLine>
        {locked && <p className="dsh-task-tree-config-section-description">{t('config.readOnly')}</p>}
      </Section>
    </>}
    <Section title={t('config.display')} description={t('config.displayDescription')}>
      <SettingLine title={t('config.position')} stacked>
        <SegmentedControl<DisplayMode>
          id={`${id}-display`}
          label={t('config.position')}
          value={display}
          onChange={setMode}
          options={[
            { value: 'dock', label: t('config.position.dock') },
            { value: 'floating', label: t('config.position.floating') },
          ]}
        />
      </SettingLine>
      <SettingLine title={t('config.follow')} description={t('config.followDescription')}>
        <Switch checked={follow} label={t('config.follow')} onChange={setFollowScroll} />
      </SettingLine>
    </Section>
  </div>
}
