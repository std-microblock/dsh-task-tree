/** Deterministic text rendering of captured agent-loop messages for checkpoint-mode requests. */
import { createHash } from 'node:crypto'
import type { RequestMessage } from '@deepseek-ai/dsh-llm'

/** Rendering limits. */
export interface TranscriptOptions {
  /** Characters kept from each tool result and tool-call argument string. */
  toolResultMaxChars: number
}

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}…[truncated ${text.length - max} chars]`
}

/**
 * Render a message range as plain text. System and developer messages, reasoning, and binary content are omitted
 * or replaced by markers, so the text grows only by appending as the conversation grows.
 * @param messages - complete captured request messages.
 * @param start - first rendered index.
 * @param end - exclusive end index.
 * @param options - rendering limits.
 * @returns rendered text; empty when the range renders nothing.
 */
export function renderTranscript(messages: readonly RequestMessage[], start: number, end: number, options: TranscriptOptions): string {
  return renderMessages(messages, start, end, options).join('')
}

/**
 * Render each message of a range separately.
 * @param messages - complete captured request messages.
 * @param start - first rendered index.
 * @param end - exclusive end index.
 * @param options - rendering limits.
 * @returns one string per message in the range; empty strings for omitted messages.
 */
export function renderMessages(messages: readonly RequestMessage[], start: number, end: number, options: TranscriptOptions): string[] {
  const toolNames = new Map<string, string>()
  for (const message of messages.slice(0, end)) {
    if (message.role !== 'assistant') continue
    for (const block of message.content) if (block.type === 'tool-call') toolNames.set(block.id, block.name)
  }
  const rendered: string[] = []
  for (let index = start; index < end; index++) {
    const message = messages[index]
    if (message === undefined) continue
    const parts: string[] = []
    for (const block of message.content) {
      switch (block.type) {
        case 'text': parts.push(block.text); break
        case 'tool-call': parts.push(`[call ${block.name} ${clip(block.arguments, options.toolResultMaxChars)}]`); break
        case 'image': parts.push('[image]'); break
        case 'file': parts.push('[file]'); break
        // Reasoning and tool-declaration blocks are not part of the reported work.
        default: break
      }
    }
    const body = parts.join('\n').trim()
    switch (message.role) {
      case 'user': rendered.push(body === '' ? '' : `\n## User\n${body}\n`); break
      case 'assistant': rendered.push(body === '' ? '' : `\n## Assistant\n${body}\n`); break
      case 'tool': {
        const name = toolNames.get(message.toolCallId) ?? 'tool'
        rendered.push(`\n## Result of ${name}${message.isError === true ? ' (error)' : ''}\n${clip(body, options.toolResultMaxChars)}\n`)
        break
      }
      default: rendered.push('')
    }
  }
  return rendered
}

/**
 * Largest boundary at or below `target` that does not separate a tool call from its result.
 * A boundary index is valid when the message at it is a user or assistant message.
 * @param messages - captured request messages.
 * @param target - preferred boundary.
 * @param minimum - smallest acceptable boundary.
 * @returns a valid boundary, or undefined when none lies in `(minimum, target]`.
 */
export function snapBoundary(messages: readonly RequestMessage[], target: number, minimum: number): number | undefined {
  for (let index = Math.min(target, messages.length - 1); index > minimum; index--) {
    const role = messages[index]?.role
    if (role === 'user' || role === 'assistant') return index
  }
  return undefined
}

/**
 * Hash of the model-visible content before a boundary.
 * @param messages - captured request messages.
 * @param boundary - exclusive end.
 * @returns lowercase hex SHA-256.
 */
export function prefixHash(messages: readonly RequestMessage[], boundary: number): string {
  const hash = createHash('sha256')
  for (const message of messages.slice(0, boundary)) {
    hash.update(JSON.stringify([message.role, message.content, 'toolCallId' in message ? message.toolCallId : null]))
    hash.update('\n')
  }
  return hash.digest('hex')
}

/**
 * Group a message range into chunks whose rendered text stays within a character budget.
 * A single message larger than the budget forms its own chunk, clipped to the budget.
 * @param messages - captured request messages.
 * @param start - first index.
 * @param end - exclusive end.
 * @param maxChars - chunk character budget.
 * @param options - rendering limits.
 * @returns rendered chunks in order.
 */
export function chunkTranscript(messages: readonly RequestMessage[], start: number, end: number, maxChars: number, options: TranscriptOptions): string[] {
  const chunks: string[] = []
  let current = ''
  for (const text of renderMessages(messages, start, end, options)) {
    if (text === '') continue
    if (current !== '' && current.length + text.length > maxChars) {
      chunks.push(current)
      current = ''
    }
    current += clip(text, maxChars)
  }
  if (current !== '') chunks.push(current)
  return chunks
}
