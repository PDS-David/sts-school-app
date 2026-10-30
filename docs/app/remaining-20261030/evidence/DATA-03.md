# DATA-03 evidence — historical reports no longer follow today's class

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
**BLOCKED: owner decision D5.** Implemented as the prompt's recommended default (snapshot on the score row), opened as a draft PR. Not for merge until the owner answers D5.
Base: `origin/master` `1764f62`. The prompt's line numbers were written against `8ffcd12`; SEC-01/SEC-01b/SEC-03 have since changed `scores.ts` and `students.ts`, so citations below are at `1764f62`.
OPS-01 (migration ledger) has not landed. Per the README fallback, the schema change is added by hand to `backend/schema.sql` in its existing style; no numbered migration file exists to add.

## Old behaviour (base `1764f62`)

- `backend/src/routes/scores.ts` `GET /report/:student_id`: `class_average`, `class_highest` and `subject_position` subqueries (lines ~306-327) match peers with `st2.class_name=$1` where `$1 = student.class_name` (the live class); the overall ranking (lines ~347-353) uses `st3.class_name = $1` with the same live value.
- `backend/src/routes/students.ts:239-244` documented that no historical snapshot is kept, "per explicit school-owner decision", and `POST /students/:id/promotion` overwrites `students.class_name` (`UPDATE students SET class_name=$1`, ~line 305). So promotion rewrote the class context of every past term's statistics.
- `scores` had no class column (`backend/schema.sql` scores table, ~207-221). Both writers (`POST /scores` and `POST /scores/bulk`) inserted/upserted without one.

## Contradictions with the prompt's premise

- The prompt says "the session report repeats the pattern". At this base `GET /scores/session-report/:student_id` contains **no** class comparison or `class_name` join (it sums the student's own per-term totals). Nothing to change there.
- The prompt suggests `class_records` might need a column "if remarks are also grouped". They are not: the report only reads `class_records` by `student_id`/`term_id`. No column added. `attendance` is also not grouped by class in any report, so it was not touched either (D5's README text mentions attendance rows; owner may want that confirmed).
- `students.ts:239-244` records an earlier explicit owner decision that this change **reverses**. The comment was rewritten to say so. This is the main reason D5 needs an owner answer.

## New behaviour

Schema (`backend/schema.sql`, placed right after the `scores` table): `ALTER TABLE scores ADD COLUMN IF NOT EXISTS class_name TEXT;` Nullable, no default, not backfilled. No `student_term_class` table was added (the prompt allows it only if the owner wants it).

Write paths (`scores.ts`): both `POST /scores` and `POST /scores/bulk` insert `class_name` as `(SELECT class_name FROM students WHERE id=$1)` and on conflict set `class_name=COALESCE(scores.class_name, EXCLUDED.class_name)`. No request field reaches it (`scoreEntrySchema` is untouched), so the stamp cannot come from client input.

Read path (`GET /report/:student_id`):
- Subject statistics: for each score row the target class is `COALESCE(sc.class_name, $1)` and a peer counts when `COALESCE(s2.class_name, st2.class_name)` equals it.
- Overall ranking: the report class is the most common `scores.class_name` among the student's own rows for the term (first seen wins a tie), or `student.class_name` when none is stamped; peers are matched on `COALESCE(s3.class_name, st3.class_name)`.
- Fallback to the live class applies only where the snapshot is null. With all snapshots null, every comparison reduces to the old `st.class_name = $1`.
- Ranking arithmetic, tie handling (`s2.total > sc.total`, position = count + 1) and `GROUP BY` are unchanged.

## Worked example (hand computed)

Term 1 Maths totals, all recorded while in JSS1: A 70, B 60, C 80. At year end A and B are promoted to JSS2; C stays. Suppose no other student currently in JSS2 has a Term 1 Maths score.
- Old, A's Term 1 report: `$1 = 'JSS2'`, peers = {A, B} → average 65, highest 70, position 1 (C is ignored).
- New: A's row carries `class_name='JSS1'`; peers stamped JSS1 = {A, B, C} → average 70, highest 80, position 2.

## Things to know

- **Not backfilled.** Rows written before this column existed have a null snapshot and keep the old behaviour; their reports stay approximate. A backfill would use today's class, which is the very problem being fixed. Not certified.
- **Editing an old unstamped row stamps the current class** (`COALESCE(scores.class_name, EXCLUDED.class_name)`, as the prompt specifies). A late edit to a past term's score after promotion therefore stamps the new class. Class locks (`checkTeacherStudentScope` with a term id) limit teacher edits but this was not analysed further.
- **Other writers are not covered.** Import and seed scripts under `backend/src/db/` insert `scores` directly and were out of this task's Writes; rows they create stay null. Not audited here.
- **Mid-term promotion:** a peer promoted part-way through a term can appear with partial totals in the overall ranking (a result of snapshotting per row).
- **New field in responses:** `GET /scores/report/...` score rows (`sc.*`) now include `class_name`. Additive; `reportPdf.ts` and `MyResultsScreen.tsx` do not read it.

## Deliberately not changed

Promotion ordering (classes.id), the promotion audit record, `students.ts` logic (comment only), session-report logic, class locks, historical rows (no rewrite), and the claim of certification.

## Not done / not verified

No tests, typechecks, DB, migration or deploy were run (testing deferred by owner). The `ALTER TABLE` and the `COALESCE(..., $1)` parameter typing have not been executed. Reports were not rendered.
