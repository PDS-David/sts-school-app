// DATA-03b — pure planning logic for the one-off scores.class_name backfill.
// No database access here: backfillScoreClass.ts loads the rows and calls this.
//
// Source of history: audit_log rows written by POST /students/:id/promotion
// (action 'promote_class' / 'demote_class', detail "<name>: <from> -> <to>").
// 'retain_class' does not change the class and is ignored. Class changes made
// through the generic student edit route are NOT audited with a class, so the
// chain check below refuses any student whose history does not line up.

export type ClassEvent = { studentId: string; at: Date; from: string; to: string };

export type ScoreRow = {
  scoreId: number;
  studentId: string;
  updatedAt: Date | null;
  termStart: Date | null;       // start of the term's first day (school time)
  termEndExclusive: Date | null; // start of the day AFTER the term's last day
};

export type StudentRow = { studentId: string; currentClass: string | null };

export type Stamp = {
  scoreId: number;
  className: string;
  basis: 'no_history_current_class' | 'promotion_history';
};

export type Skip = { scoreId: number; studentId: string; reason: SkipReason };

export type SkipReason =
  | 'student_missing'
  | 'current_class_blank'
  | 'event_chain_inconsistent'
  | 'term_dates_missing'
  | 'promotion_during_term';

const DETAIL = /^.*: (.+) -> (.+)$/;

/** Parse "<name>: <from> -> <to>". Returns null when the text does not match. */
export function parsePromotionDetail(detail: string | null): { from: string; to: string } | null {
  if (!detail) return null;
  const m = DETAIL.exec(detail);
  if (!m) return null;
  const from = m[1].trim();
  const to = m[2].trim();
  return from && to ? { from, to } : null;
}

/** True when events (sorted by time) form an unbroken chain ending at the current class. */
export function chainIsConsistent(events: ClassEvent[], currentClass: string | null): boolean {
  if (!currentClass) return false;
  for (let i = 1; i < events.length; i++) {
    if (events[i].from !== events[i - 1].to) return false;
  }
  return events[events.length - 1].to === currentClass;
}

/** The class held at instant t, given a consistent, time-sorted chain. */
export function classAt(events: ClassEvent[], t: Date): string {
  let cls = events[0].from;
  for (const e of events) {
    if (e.at.getTime() <= t.getTime()) cls = e.to;
    else break;
  }
  return cls;
}

export function planBackfill(input: {
  scores: ScoreRow[];
  students: StudentRow[];
  events: ClassEvent[];
  /** Students with at least one promote/demote audit row whose detail could not be parsed. */
  studentsWithUnparsedEvents: Set<string>;
}): { stamps: Stamp[]; skipped: Skip[] } {
  const students = new Map(input.students.map(s => [s.studentId, s]));
  const byStudent = new Map<string, ClassEvent[]>();
  for (const e of input.events) {
    const list = byStudent.get(e.studentId) ?? [];
    list.push(e);
    byStudent.set(e.studentId, list);
  }
  for (const list of byStudent.values()) list.sort((a, b) => a.at.getTime() - b.at.getTime());

  const stamps: Stamp[] = [];
  const skipped: Skip[] = [];

  for (const sc of input.scores) {
    const skip = (reason: SkipReason) => skipped.push({ scoreId: sc.scoreId, studentId: sc.studentId, reason });
    const student = students.get(sc.studentId);
    if (!student) { skip('student_missing'); continue; }
    const current = student.currentClass?.trim() || null;
    if (!current) { skip('current_class_blank'); continue; }

    const events = byStudent.get(sc.studentId) ?? [];
    const unparsed = input.studentsWithUnparsedEvents.has(sc.studentId);

    if (events.length === 0 && !unparsed) {
      stamps.push({ scoreId: sc.scoreId, className: current, basis: 'no_history_current_class' });
      continue;
    }
    if (unparsed || !chainIsConsistent(events, current)) { skip('event_chain_inconsistent'); continue; }
    if (!sc.termStart || !sc.termEndExclusive) { skip('term_dates_missing'); continue; }

    // The score was last touched at updatedAt, but never count a moment after the term ended
    // (late edits and bulk imports carry a later updated_at than the term they belong to).
    const endMs = sc.termEndExclusive.getTime();
    const t = new Date(Math.min(sc.updatedAt ? sc.updatedAt.getTime() : endMs, endMs));
    const windowStart = Math.min(sc.termStart.getTime(), t.getTime());
    if (events.some(e => e.at.getTime() >= windowStart && e.at.getTime() <= t.getTime())) {
      skip('promotion_during_term');
      continue;
    }
    stamps.push({ scoreId: sc.scoreId, className: classAt(events, t), basis: 'promotion_history' });
  }
  return { stamps, skipped };
}
