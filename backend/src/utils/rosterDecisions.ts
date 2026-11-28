import type { PoolClient } from 'pg';

/**
 * One roster decision per student per academic year.
 *
 * A "decision" is a promote, retain or remove made through
 * POST /students/:id/promotion (or 'promoted_in' for the report-only identity a
 * cross-school promotion creates). It is stored in the append-only
 * report_roster_membership_events history, in the event's `details`:
 *
 *   details.academic_year  the academic year of the school's current term
 *   details.decision       'promote' | 'retain' | 'remove' | 'promoted_in',
 *                          or null on a correction event
 *
 * A student's decision for a year is the LATEST event tagged with that year:
 * if it carries a decision, the student has already been decided this year; if
 * it is a correction (administrator demote/reinstate, or a teacher undoing
 * their own removal), the decision is void and the student can be decided
 * again. Events written before this existed carry no academic_year and are
 * ignored. No schema change is needed.
 *
 * Every action takes the membership row FOR UPDATE before it reads the
 * decision, so two concurrent requests for one student are serialised and the
 * second sees the first.
 */

export type RosterDecision = 'promote' | 'retain' | 'remove' | 'promoted_in';

/** Year key used when a school has no current term, so duplicate prevention still applies. */
export const NO_CURRENT_YEAR = '(no current term)';

export interface RosterCycle {
  termId: number | null;
  academicYear: string;
}

export interface ActiveDecision {
  eventId: number;
  decision: RosterDecision;
  actorId: string | null;
  actorRole: string | null;
}

const DECISIONS: readonly string[] = ['promote', 'retain', 'remove', 'promoted_in'];

/** The school's current term and academic year (the decision cycle). */
export async function currentRosterCycle(client: PoolClient, schoolCode: string): Promise<RosterCycle> {
  const { rows } = await client.query(
    'SELECT id, academic_year FROM terms WHERE school_code=$1 AND is_current=TRUE ORDER BY id DESC LIMIT 1',
    [schoolCode],
  );
  if (!rows[0]) return { termId: null, academicYear: NO_CURRENT_YEAR };
  return { termId: Number(rows[0].id), academicYear: String(rows[0].academic_year) };
}

/** The student's standing decision for the academic year, or null when none (or voided). */
export async function activeDecision(
  client: PoolClient,
  studentId: string,
  academicYear: string,
): Promise<ActiveDecision | null> {
  const { rows } = await client.query(
    `SELECT id, actor_id, details
       FROM report_roster_membership_events
      WHERE student_id=$1 AND details->>'academic_year'=$2
      ORDER BY id DESC LIMIT 1`,
    [studentId, academicYear],
  );
  const row = rows[0];
  const decision = row?.details?.decision;
  if (!row || typeof decision !== 'string' || !DECISIONS.includes(decision)) return null;
  return {
    eventId: Number(row.id),
    decision: decision as RosterDecision,
    actorId: row.actor_id ? String(row.actor_id) : null,
    actorRole: typeof row.details?.actor_role === 'string' ? row.details.actor_role : null,
  };
}

/** True when any of the classes is locked for the term. Admins ignore locks; teachers do not. */
export async function lockedClassAmong(
  client: PoolClient,
  schoolCode: string,
  classNames: string[],
  termId: number | null,
): Promise<string | null> {
  if (termId === null) return null;
  const { rows } = await client.query(
    `SELECT class_name FROM class_locks
      WHERE school_code=$1 AND term_id=$2 AND class_name=ANY($3::text[])
      ORDER BY class_name LIMIT 1 FOR SHARE`,
    [schoolCode, termId, classNames],
  );
  return rows[0] ? String(rows[0].class_name) : null;
}

export const DECISION_LABEL: Record<RosterDecision, string> = {
  promote: 'promoted',
  retain: 'retained',
  remove: 'removed',
  promoted_in: 'promoted into this class',
};
