import { describe, expect, it } from 'vitest'
import { styles } from '../../src/client/styles.ts'

/** Declarations of the first rule whose selector line opens the block, without its descendants. */
function declarationsOf(selector: string): string {
  const opener = `\n${selector} {`
  const start = styles.indexOf(opener)
  expect(start, `${selector} rule is missing`).toBeGreaterThan(-1)
  const body = styles.slice(start + opener.length)
  return body.slice(0, body.indexOf('}'))
}

describe('scroll containment', () => {
  it('keeps the wheel chaining from a clipped latest-level group to the card body', () => {
    // A group whose content still fits its height has a zero scroll range, so
    // overscroll containment on it drops the wheel instead of passing it to the
    // card body; a group grown to the whole card would then freeze the card.
    expect(declarationsOf('.dsh-task-tree-scroll-group')).not.toContain('overscroll-behavior')
    expect(declarationsOf('.dsh-task-tree-scroll-group[data-scrollable]')).not.toContain('overscroll-behavior')
  })

  it('stops the wheel at the card body instead of scrolling the transcript', () => {
    expect(declarationsOf('.dsh-task-tree-scroll')).toContain('overscroll-behavior:contain')
  })
})
