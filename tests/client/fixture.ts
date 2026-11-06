/** Shared builders for the Client specs. */
import type { TreeRecord } from '../../src/projection-types.ts'
import { zh, type TaskTreeKey, type Translate } from '../../src/client/locales.ts'

/**
 * Translate with the Chinese dictionary and `{name}` interpolation.
 * @param key - dictionary key.
 * @param params - interpolation values.
 * @returns the localized text.
 */
export const t = ((key: TaskTreeKey, params?: Record<string, unknown>) =>
  zh[key].replace(/\{(\w+)\}/gu, (_, name: string) => String(params?.[name] ?? ''))) as Translate

let next = 0

/**
 * Build one report.
 * @param path - reported task path.
 * @param fields - overrides.
 * @returns the record.
 */
export function record(path: string[], fields: Partial<TreeRecord> = {}): TreeRecord {
  next++
  return {
    id: `r${next}`, seq: next * 10, contextSeq: next * 10 - 1, coveredTurn: 1, mode: 'fork',
    path, previousPath: [], detail: `detail ${next}`, decisions: [], ...fields,
  }
}

/**
 * Bind a plain value to the selector-hook calling convention.
 * @param value - current value.
 * @returns a selector hook stub.
 */
export function hook<T>(value: T) {
  return <S>(select: (value: T) => S): S => select(value)
}
