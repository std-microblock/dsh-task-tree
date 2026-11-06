/** Decision block shared by the tree views and the Chat change row; each decision quotes itself into the composer. */
import { useCallback } from 'react'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SnapshotSelectorHook } from '@deepseek-ai/dsh-client-ui-slots'
import type { InputActions, InputState } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { Translate } from './locales.ts'

/** Composer insertion offered to decision rows. */
export interface DecisionInsert {
  /** @param text - decision text to quote at the composer cursor. */
  readonly onInsert: (text: string) => void
  /** Whether the composer currently refuses edits. */
  readonly insertDisabled: boolean
}

/**
 * Render decisions as a bordered block of clickable rows.
 * @param props.decisions - decision texts, oldest first.
 * @param props.onInsert - quotes one decision into the composer.
 * @param props.insertDisabled - whether insertion is unavailable.
 * @param props.t - copy.
 * @returns the block.
 */
export function DecisionList({ decisions, onInsert, insertDisabled, t }: DecisionInsert & {
  decisions: readonly { key: string; text: string }[]
  t: Translate
}) {
  return <div className="dsh-task-tree-decision-block">
    <div className="dsh-task-tree-decision-label" aria-hidden="true">{t('decision.label')}</div>
    <ul className="dsh-task-tree-decision-list" aria-label={t('decision.label')}>
      {decisions.map(decision => <li key={decision.key}>
        <Tooltip label={t('decision.insert')} side="top" align="center" portal delayMs={400} disabled={insertDisabled}>
          <button type="button" className="dsh-task-tree-decision" disabled={insertDisabled}
            onClick={() => { onInsert(decision.text) }}>
            {decision.text}
          </button>
        </Tooltip>
      </li>)}
    </ul>
  </div>
}

/**
 * Text a decision inserts into the composer.
 * @param text - decision.
 * @returns a Markdown quote line followed by a newline.
 */
export function decisionQuote(text: string): string {
  return `> ${text}\n`
}

/** Standard Session composer seats read by {@link useDecisionInsert}. */
export interface ComposerSeats {
  readonly useInput: SnapshotSelectorHook<InputState>
  readonly inputActions: InputActions
  /** Focus this Session's composer. */
  readonly focusComposer: () => void
}

/**
 * Bind decision insertion to one Session's composer: the quote lands at the
 * cursor without replacing a selection, and the draft is persisted and focused.
 * @param seats - composer seats and focus callback.
 * @returns the insertion action and whether the composer accepts edits now.
 */
export function useDecisionInsert({ useInput, inputActions, focusComposer }: ComposerSeats): DecisionInsert {
  const insertDisabled = useInput(state => state.phase !== 'plain')
  const onInsert = useCallback((text: string) => {
    const span = inputActions.captureInsertion()
    if (!inputActions.insertText(decisionQuote(text), { ...span, end: span.start })) return
    inputActions.persistDraft()
    focusComposer()
  }, [inputActions, focusComposer])
  return { onInsert, insertDisabled }
}
