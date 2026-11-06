import { describe, expect, it } from 'vitest'
import type { RequestMessage } from '@deepseek-ai/dsh-llm'
import { RECORD, readResult } from '../src/records.ts'
import { answer, setup, textChunks } from './fixture.ts'

const resultsOf = (events: { type: string; data: unknown; ignorable?: boolean }[]) =>
  events.map(event => readResult(event)).filter(result => result !== undefined)

describe('task-tree host', () => {
  it('reports with the agent route after enough steps and indexes the Session', async () => {
    const fixture = await setup()
    try {
      fixture.start()
      await fixture.waitRecords(RECORD.result)
      const check = fixture.adapter.checks[0]!
      expect(check.provider).toBe('mock')
      expect(check.purpose).toBe('task-tree')
      const main = fixture.adapter.main.find(request => request.messages.length === check.messages.length - 1)!
      expect(check.messages.slice(0, -1)).toEqual(main.messages)
      const question = check.messages.at(-1) as RequestMessage
      expect(question.content[0]).toMatchObject({ type: 'text' })
      const [result] = resultsOf(fixture.events)
      expect(result).toMatchObject({ mode: 'fork', path: answer.path, previousPath: [], detail: answer.detail, decisions: answer.decisions })
      const request = fixture.events.find(event => event.type === RECORD.request)
      expect(request?.data).toMatchObject({ mode: 'fork', reusedMessages: check.messages.length - 1 })
      await expect.poll(() => fixture.domains.tables.get('sessions')?.get(fixture.agent.session.id)).toMatchObject({
        rootTitle: answer.path[0], path: answer.path, totalCount: 2, doneCount: 0,
      })
    } finally {
      await fixture.close()
    }
  })

  it('uses the cheap route in fork-cheap mode and drops the agent sampling controls', async () => {
    const fixture = await setup({ mode: 'fork-cheap', cheapModel: { provider: 'cheap', model: 'tiny', reasoningEffort: '' } })
    try {
      fixture.start()
      await fixture.waitRecords(RECORD.result)
      const check = fixture.adapter.checks[0]!
      expect(check).toMatchObject({ provider: 'cheap', model: 'tiny' })
      expect(check.tools?.length).toBeGreaterThan(0)
    } finally {
      await fixture.close()
    }
  })

  it('records a configuration failure when the cheap route is missing', async () => {
    const fixture = await setup({ mode: 'checkpoint' })
    try {
      fixture.start()
      await fixture.waitRecords(RECORD.failure)
      expect(fixture.events.find(event => event.type === RECORD.failure)?.data).toMatchObject({ stage: 'config', retryable: false })
      expect(fixture.adapter.checks).toHaveLength(0)
    } finally {
      await fixture.close()
    }
  })

  it('sends a summary plus transcript in checkpoint mode and checkpoints long contexts', async () => {
    const fixture = await setup({
      mode: 'checkpoint', cheapModel: { provider: 'cheap', model: 'tiny', reasoningEffort: '' },
      checkpoint: { everyMessages: 3, keepMessages: 2, summaryMaxTokens: 100, toolResultMaxChars: 50, chunkMaxChars: 1000 },
    })
    fixture.adapter.answers.push(textChunks('Earlier: the agent read fixtures.'))
    try {
      fixture.start()
      await fixture.waitRecords(RECORD.result)
      const checkpoint = fixture.events.find(event => event.type === RECORD.checkpoint)
      expect(checkpoint?.data).toMatchObject({ summary: 'Earlier: the agent read fixtures.' })
      const [summaryCall, reportCall] = fixture.adapter.checks
      expect(summaryCall).toMatchObject({ provider: 'cheap', model: 'tiny', maxTokens: 100 })
      expect(reportCall?.tools).toBeUndefined()
      const text = (reportCall!.messages[0] as RequestMessage).content.map(block => block.type === 'text' ? block.text : '').join('')
      expect(text).toContain('<summary_of_earlier_conversation>\nEarlier: the agent read fixtures.')
      expect(text).toContain('## Result of echo')
      expect(resultsOf(fixture.events)[0]).toMatchObject({ mode: 'checkpoint' })
    } finally {
      await fixture.close()
    }
  })

  it('retries an unparsable answer and then succeeds', async () => {
    const fixture = await setup()
    fixture.adapter.answers.push(textChunks('not json'))
    try {
      fixture.start()
      await fixture.waitRecords(RECORD.result)
      expect(fixture.events.find(event => event.type === RECORD.failure)?.data).toMatchObject({ stage: 'parse', retryable: true, attempt: 1 })
      expect(resultsOf(fixture.events)).toHaveLength(1)
    } finally {
      await fixture.close()
    }
  })

  it('replaces a provider title with the top-level task but keeps a user title', async () => {
    const fixture = await setup({ replaceTitle: true })
    try {
      fixture.titles.titles.set(fixture.agent.session.id, { title: 'Auto title', source: { kind: 'fallback' } })
      fixture.start()
      await fixture.waitRecords(RECORD.title)
      expect(fixture.titles.titles.get(fixture.agent.session.id)?.title).toBe(answer.path[0])
    } finally {
      await fixture.close()
    }
    const pinned = await setup({ replaceTitle: true })
    try {
      pinned.titles.titles.set(pinned.agent.session.id, { title: 'My title', source: { kind: 'user' } })
      pinned.start()
      await pinned.waitRecords(RECORD.result)
      expect(pinned.titles.titles.get(pinned.agent.session.id)?.title).toBe('My title')
      expect(pinned.events.some(event => event.type === RECORD.title)).toBe(false)
    } finally {
      await pinned.close()
    }
  })
})
