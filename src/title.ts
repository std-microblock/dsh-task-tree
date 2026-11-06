/** Session title replacement that never overrides a title chosen by the user. */
import type { Session } from '@deepseek-ai/dsh-session'
import type { SessionTitleSnapshot } from '@deepseek-ai/dsh-session-title'

/**
 * Whether the plugin may replace the current title.
 * A title the user set explicitly stays unless it equals the title this plugin wrote last,
 * because the title service records the plugin's own renames as user renames too.
 * @param current - current title snapshot.
 * @param lastPluginTitle - latest title this plugin wrote to the Session.
 * @param next - candidate title.
 * @returns true when the rename should happen.
 */
export function mayReplaceTitle(current: SessionTitleSnapshot | undefined, lastPluginTitle: string | undefined, next: string): boolean {
  if (current === undefined) return true
  if (current.title === next) return false
  if (current.source.kind !== 'user') return true
  return lastPluginTitle !== undefined && current.title === lastPluginTitle
}

/** Title service operations the plugin uses. */
export interface TitleService {
  get(session: Session): SessionTitleSnapshot | undefined
  rename(session: Session, title: string): SessionTitleSnapshot
}
