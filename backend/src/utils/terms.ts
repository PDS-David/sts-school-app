// A session is fixed at exactly 3 terms. This is the single source of truth
// for the canonical term names and their order within a session, used by:
//   - routes/academic.ts  (POST /terms — rejects anything outside this list,
//     and caps a school+academic_year at 3 rows total)
//   - routes/scores.ts    (GET /scores/session-report/:student_id — sorts
//     whatever terms exist into 1st → 2nd → 3rd order regardless of the
//     order they were created/imported in)

export const SESSION_TERM_NAMES = ['1st Term', '2nd Term', '3rd Term'] as const;
export type SessionTermName = typeof SESSION_TERM_NAMES[number];

const RANK: Record<string, number> = {
  '1st term': 1,
  '2nd term': 2,
  '3rd term': 3,
};

/** Sort rank for a term name, case/whitespace-insensitive. Unknown names sort last. */
export function termRank(name: string): number {
  return RANK[name.trim().toLowerCase()] ?? 99;
}

export function isValidSessionTermName(name: string): name is SessionTermName {
  return (SESSION_TERM_NAMES as readonly string[]).includes(name);
}
