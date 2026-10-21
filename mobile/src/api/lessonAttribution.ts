// Plain-text rendering of the licence/credit records delivered with a lesson (GET /learning/topics/:id/assets).
// Kept free of React so the exact learner-visible wording is unit-tested.
export interface AttributionCredit {
  id: string; role: string; work: string; creators: string; publisher: string; year: number;
  required_credit: string; licence: string; licence_url: string; source_url: string;
  download_line: string | null; changes: string; visuals: { role: string; asset_key: string; displayed: boolean }[];
}
export interface LessonAttribution { supplement_id: string; notice: string; credits: AttributionCredit[] }

export function attributionLines(a: LessonAttribution): { heading: string; notice: string; credits: { key: string; text: string; accessibilityLabel: string }[] } {
  return {
    heading: 'Sources and licences',
    notice: a.notice,
    credits: a.credits.map(c => {
      const parts = [
        `${c.required_credit}.`,
        `${c.role}: ${c.work}.`,
        `${c.creators}; ${c.publisher}, ${c.year}.`,
        `Licence: ${c.licence} (${c.licence_url}).`,
        `Source: ${c.source_url}`,
        `Changes made: ${c.changes}`,
      ];
      if (c.download_line) parts.push(c.download_line);
      return { key: c.id, text: parts.join('\n'), accessibilityLabel: `Credit. ${parts.join(' ')}` };
    }),
  };
}
/** Credits whose requested cover/logo is not displayed — never shown to learners; used by tests and release checks. */
export const undisplayedVisuals = (a: LessonAttribution) => a.credits.flatMap(c => c.visuals.filter(v => !v.displayed).map(v => `${c.id}:${v.role}`));
