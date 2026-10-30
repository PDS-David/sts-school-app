# DATA-03 — Stop historical reports moving with today's class

Status: BLOCKED ON OWNER DECISION D5 · Depends: OPS-01 · Base: `origin/master` (record the SHA)
Writes: `backend/schema.sql`, the OPS-01 migration, `backend/src/routes/scores.ts`, `backend/src/routes/students.ts` (write-time snapshot only), `docs/app/remaining-20261030/evidence/DATA-03.md`

## Why (verified at master `8ffcd12`)

Every term and session report computes class comparison from the student's **current** `class_name`:

- subject average / highest / position subqueries join `students st2 ... st2.class_name=$1`, where `$1 = student.class_name` (`scores.ts:271-291`);
- overall ranking uses `st3.class_name` (`scores.ts:312-318`);
- the session report repeats the pattern.

Promotion overwrites the student row (`students.ts:293-296`), and there is no enrolment-history table: `students.ts:239-244` explicitly documents that no historical snapshot is kept. So promoting a pupil rewrites the class context of every past term's statistics, and a report printed last term can no longer be reproduced.

The manual records this as a limitation to resolve under an approved change scope.

## Do (only after D5 is answered)

Recommended default for D5: **snapshot the class on the academic record at write time**, not a new history table.

1. Schema: add `class_name TEXT` to `scores` (and to `class_records` if remarks are also grouped; confirm by grepping report queries). Keep it nullable for historic rows. Add `student_term_class(student_id, term_id, class_name, first_recorded_at, PRIMARY KEY (student_id, term_id))` **only** if the owner wants a single lookup independent of score writes.
2. Write paths: when inserting or upserting a score, stamp the student's class at that moment (`INSERT ... class_name = (SELECT class_name FROM students WHERE id=$1)`), never from client input. On conflict, keep the original stamp (`COALESCE(scores.class_name, EXCLUDED.class_name)`) so a later class change does not rewrite history.
3. Read paths: group by the snapshot where present, and fall back to `students.class_name` only when it is null. State the fallback in one comment and in the note.
4. Do not backfill: existing rows have no snapshot. Document that historic reports remain approximate until the owner authorises a backfill (source would be the current class, which is itself the problem — say so).
5. If D5 chooses a full `student_class_history` with effective dates instead, stop and produce a written design in the evidence note; do not implement it in this task.

## Acceptance (static)

- A promoted student's previous-term class average, highest and position still use the class they were in when the score was recorded.
- No client-supplied class name reaches the stamp.
- Reports with null snapshots behave exactly as today (fallback).
- No change to ranking arithmetic, tie handling or session ordering.

## Do not

- Rewrite historical rows.
- Change the promotion ordering rule (classes.id order) or the audit record.
- Claim historical reports are certified after this change.
