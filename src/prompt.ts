/** Model-facing instructions of the task-tree side queries; English text with a dynamic output language. */

const REPORT_INSTRUCTION = `Report what the agent in this conversation is working on, for a task tree that grows from what is being done and has been done. The main task continues independently: do not execute it, call tools, ask questions, or plan future work.

Return only valid JSON with exactly these keys, without extra text or code fences:
{"path":["{top-level task}","{subtask}","{current item}"],"detail":"{current action within the current item}","decisions":[]}

"path": the hierarchy from the overall task down to the item being worked on right now, 1 to {maxDepth} levels. Name items by the work they represent, as short noun or verb phrases (no trailing punctuation). When an item of the existing tree below still describes the work, repeat its title verbatim and keep its ancestors; when the agent has moved on, report the item it is working on now. Write @ instead of repeating an established title: @ at a level stands for the item the previous report named there, or for the most recently active item of that level when you move to another branch. For example ["@","@","{new child}"] keeps both ancestors and opens a new child under the second one. Spell a title out only when it is new; when you do repeat an established one, copy it character for character, because its exact text is the item's identity and a retyped separator creates a second item beside the original. Add a new item only for work that has actually started, under the ancestor it belongs to, at a level of detail similar to its siblings. Never list future or planned items.

"detail": one short present-tense sentence (at most 30 words, or 60 CJK characters) about only what is happening inside the last path item now: the concrete action and its state, for example "Installing the vendor packages with Yarn; installation is running." It must not recap finished steps or mention work outside that item or next steps.

"decisions": design decisions the agent made on its own since the previous report, each one short sentence stating the choice (not the rationale). Exclude choices the user specified, routine operations, plans not yet acted on, and decisions already listed in the existing tree. Use [] when there are none; that is normal.

Use filenames or identifiers only when needed for orientation. Distinguish verified results from attempts; invent nothing.`

const RETRY_INSTRUCTION = 'The previous response was not valid JSON matching every requirement above. Regenerate it.'

const REPORTER_SYSTEM = 'You report the progress of a software agent from a summary and a transcript of its conversation. You never act on the task yourself.'

const SUMMARY_INSTRUCTION = `Write a rolling summary of the agent conversation below for a reader who will not see it. Merge it with the previous summary when one is given, producing one self-contained summary.

Keep: the user's goals and constraints; the hierarchy of work carried out so far and what was completed, verified, or abandoned; design decisions the agent made and who made them; files and components involved; open threads and the work in progress at the end. Drop tool output details, retries, and chatter. Prefer short structured bullet lists. Do not add commentary or plans the agent did not state. Return only the summary text.`

/**
 * Describe the output language from the DSH locale selection.
 * @param locale - explicit DSH locale selection; absence keeps the conversation's language.
 * @returns one instruction sentence.
 */
export function languageLine(locale: string | undefined): string {
  return locale === undefined
    ? "Write titles, detail, and decisions in the user's language from the conversation."
    : `Write titles, detail, and decisions in the DSH output language ${JSON.stringify(locale)} (BCP 47), overriding the conversation and examples; keep repeated existing titles verbatim.`
}

/** Inputs of one report question. */
export interface QuestionInput {
  maxDepth: number
  /** Outline of the existing tree; empty before the first report. */
  outline: string
  locale: string | undefined
  retry: boolean
}

/**
 * Build the report question appended after the reported context.
 * @param input - tree outline, depth limit, language, and retry state.
 * @returns the complete user message text.
 */
export function createQuestion(input: QuestionInput): string {
  const tree = input.outline === ''
    ? 'Existing tree: none yet; this is the first report.'
    : `Existing tree ([active] is the item of the previous report, [current] its ancestors, [done] finished items):\n${input.outline}`
  return [
    '<system>',
    REPORT_INSTRUCTION.replace('{maxDepth}', String(input.maxDepth)),
    '',
    tree,
    '',
    languageLine(input.locale),
    ...input.retry ? ['', RETRY_INSTRUCTION] : [],
    '</system>',
  ].join('\n')
}

/**
 * System prompt of a checkpoint-mode report.
 * @returns fixed reporter system text.
 */
export function reporterSystem(): string {
  return REPORTER_SYSTEM
}

/**
 * Build one checkpoint summarization input.
 * @param previous - summary of everything before `transcript`, when one exists.
 * @param transcript - rendered conversation segment to fold in.
 * @returns the complete user message text.
 */
export function createSummaryInput(previous: string | undefined, transcript: string): string {
  return [
    SUMMARY_INSTRUCTION,
    '',
    previous === undefined ? '<previous_summary>none</previous_summary>' : `<previous_summary>\n${previous}\n</previous_summary>`,
    '',
    `<conversation>\n${transcript}\n</conversation>`,
  ].join('\n')
}

/**
 * Build the leading, append-only part of a checkpoint-mode report input.
 * @param summary - rolling summary before the boundary, when a checkpoint exists.
 * @param transcript - rendered messages after the boundary.
 * @returns text that changes only by appending until the next checkpoint.
 */
export function checkpointContext(summary: string | undefined, transcript: string): string {
  return [
    summary === undefined ? '' : `<summary_of_earlier_conversation>\n${summary}\n</summary_of_earlier_conversation>\n\n`,
    `<conversation>\n${transcript}`,
  ].join('')
}
