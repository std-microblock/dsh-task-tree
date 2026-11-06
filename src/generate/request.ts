/** Request construction for the three generation modes. */
import { ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { RequestMessage } from '@deepseek-ai/dsh-llm'
import type { Route } from '../records.ts'
import { checkpointContext, reporterSystem } from '../prompt.ts'
import type { DraftRequest } from './call.ts'

/**
 * Proposed call fields for an explicitly configured route; sampling controls use the route's defaults.
 * @param route - configured provider route.
 * @returns provider, model, and optional reasoning effort.
 */
export function routeFields(route: Route): Pick<DraftRequest, 'provider' | 'model' | 'reasoningEffort'> {
  return {
    provider: route.provider, model: route.model,
    ...route.reasoningEffort === undefined ? {} : { reasoningEffort: ReasoningEffortId(route.reasoningEffort) },
  }
}

function userText(text: string): RequestMessage {
  return { role: 'user', content: [{ type: 'text', text }] }
}

/**
 * Reuse the captured agent-loop request and append one question.
 * @param captured - agent-loop request captured from `llm/stream`.
 * @param question - report question.
 * @param route - replacement route; absent keeps the agent's route and controls.
 * @returns the draft request.
 */
export function forkRequest(captured: DraftRequest, question: string, route?: Route): DraftRequest {
  const messages = [...captured.messages, userText(question)]
  if (route === undefined) return { ...captured, messages }
  const { temperature: _temperature, maxTokens: _maxTokens, stop: _stop, reasoningEffort: _effort, ...rest } = captured
  return { ...rest, ...routeFields(route), messages }
}

/**
 * Build a checkpoint-mode report request whose leading text grows only by appending until the next checkpoint.
 * @param route - configured cheap route.
 * @param summary - rolling summary before the boundary.
 * @param transcript - rendered messages after the boundary.
 * @param question - report question.
 * @param sessionId - Session the report belongs to.
 * @returns the draft request.
 */
export function checkpointRequest(route: Route, summary: string | undefined, transcript: string, question: string, sessionId: DraftRequest['sessionId']): DraftRequest {
  return {
    ...routeFields(route),
    system: reporterSystem(),
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: checkpointContext(summary, transcript) },
        { type: 'text', text: `\n</conversation>\n\n${question}` },
      ],
    }],
    ...sessionId === undefined ? {} : { sessionId },
  }
}

/**
 * Text of a checkpoint-mode request input, recorded with the request.
 * @param request - draft built by {@link checkpointRequest}.
 * @returns concatenated user text.
 */
export function requestInput(request: DraftRequest): string {
  const last = request.messages[request.messages.length - 1]
  return last === undefined ? '' : last.content.map(block => block.type === 'text' ? block.text : '').join('')
}

/**
 * Plain summarization request.
 * @param route - configured cheap route.
 * @param input - summarization input.
 * @param maxTokens - output token cap.
 * @param sessionId - Session the summary belongs to.
 * @returns the draft request.
 */
export function summaryRequest(route: Route, input: string, maxTokens: number, sessionId: DraftRequest['sessionId']): DraftRequest {
  return {
    ...routeFields(route),
    system: reporterSystem(),
    maxTokens,
    messages: [userText(input)],
    ...sessionId === undefined ? {} : { sessionId },
  }
}
