// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import type { ConversationLocation, ConversationNodeContext, ConversationStartMatch } from '@deepseek-ai/dsh-client-ui-conversation/client'
import { taskChangeDefinition } from '../../src/client/definition.ts'

const location: ConversationLocation = { kind: 'turn', turn: { turn: 3 } } as never

function event(data: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  return {
    type: 'plugin:task-tree/result', ignorable: true, seq: 42,
    data: {
      version: 1, id: 'report-1', sessionId: 's1', mode: 'fork', contextSeq: 40, coveredStepCount: 2,
      path: ['A', 'B'], previousPath: ['A'], detail: 'working', decisions: [], ...data,
    },
    ...extra,
  } as never
}

describe('task change definition', () => {
  it('matches path changes and decision-only reports, keyed by report id', () => {
    expect(taskChangeDefinition.match(event({}))).toEqual({ id: 'report-1', role: 'start' })
    expect(taskChangeDefinition.match(event({ previousPath: ['A', 'B'], decisions: ['Use X'] }))).toEqual({ id: 'report-1', role: 'start' })
  })

  it('ignores unchanged reports, other records, and non-ignorable envelopes', () => {
    expect(taskChangeDefinition.match(event({ previousPath: ['A', 'B'] }))).toBeNull()
    expect(taskChangeDefinition.match(event({}, { type: 'plugin:task-tree/request' }))).toBeNull()
    expect(taskChangeDefinition.match(event({}, { ignorable: false }))).toBeNull()
    expect(taskChangeDefinition.match(event({ path: [] }))).toBeNull()
  })

  it('builds a step-run row at the start location, just after the reported context', () => {
    const match = { event: event({ decisions: ['Use X'] }), role: 'start', location } as ConversationStartMatch
    const base = { key: 'k', kind: 'task-tree-change', id: 'report-1', matches: [match], start: match, current: new Map() }
    const state = taskChangeDefinition.start({ ...base, state: undefined } as ConversationNodeContext<never>, match, { previous: () => undefined })
    const node = taskChangeDefinition.buildViewNode!({ ...base, state } as ConversationNodeContext<typeof state>) as Record<string, unknown>
    expect(node).toEqual({
      key: 'k', kind: 'task-tree-change', id: 'report-1', target: 'chat', anchorSeq: 40.5, location, visibility: 'visible',
      data: { id: 'report-1', seq: 42, path: ['A', 'B'], previousPath: ['A'], detail: 'working', decisions: ['Use X'] },
    })
    expect('groupTree' in node).toBe(false)
    expect(taskChangeDefinition.update({ ...base, state } as never, match)).toBe(state)
    expect(taskChangeDefinition.buildViewNode!({ ...base, state: undefined } as never)).toBeNull()
  })
})
