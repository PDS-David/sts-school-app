/**
 * Detects the standalone WEEK column heading in a scheme-of-work preamble.
 * In these Word sources the table header is laid out as:
 *   SCHEME OF WORK
 *   WEEK
 *   1 Revision
 * The generic WEEK marker regex spans the newline and mistakes this header
 * for a Week 1 lesson. A same-line "WEEK 1" marker remains a real marker.
 */
export function isSchemeWorkWeekHeader(text: string, matchIndex: number, matchText: string): boolean {
  const firstLine = matchText.split(/\r?\n/, 1)[0]?.trim().toLocaleLowerCase('en');
  if (firstLine !== 'week') return false;
  const preceding = text.slice(0, matchIndex).split(/\r?\n/);
  const previousNonEmpty = preceding.reverse().find(line => line.trim().length > 0)?.trim() ?? '';
  return /^scheme\s+of\s+works?$/i.test(previousNonEmpty);
}
