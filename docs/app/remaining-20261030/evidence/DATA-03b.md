# DATA-03b — one-off backfill of `scores.class_name` from promotion history

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified, **not run**).
Owner approval: backfill from promotion history approved 2026-10-30, following D5.
Base: `origin/master` `fc75699`. Files: `backend/src/db/backfillScoreClassLogic.ts`, `backend/src/db/backfillScoreClass.ts`, `backend/package.json` (script `db:backfill-score-class`), this note, one-line status fix in `DATA-03.md`.

## Problem
DATA-03 stamps `scores.class_name` on save. Rows saved before it have NULL, so their reports still follow the student's live class and change when a student is promoted.

## Where the history comes from
`POST /students/:id/promotion` (`students.ts`) writes `audit_log` rows: action `promote_class` or `demote_class`, entity `student`, `entity_id` = student id, detail `"<name>: <from> -> <to>"`, `created_at`. `retain_class` rows change nothing and are ignored. There is no enrolment-history table. Class changes through the generic student edit route are **not** recorded with a class, and `audit()` swallows write failures, so the log can have gaps.

## Rules (`planBackfill`, applied to each score where `class_name IS NULL`)
1. **No promote/demote history for the student** → stamp the student's current class (`no_history_current_class`). This equals what reports already show today; it freezes it against future promotions. It is **wrong for any student who changed class before audit logging existed or by generic edit**.
2. **History exists but is not an unbroken chain ending at the current class** (a gap, an unparseable detail, an unaudited edit) → skip: `event_chain_inconsistent`.
3. **Chain is consistent**, term has start and end dates → let T = the earlier of the row's `updated_at` and the end of the term's last day. If any promotion falls between the start of the term (or T if earlier) and T → skip: `promotion_during_term`. Otherwise stamp the class held at T (`promotion_history`).
4. Term dates missing (rule 3 case) → skip: `term_dates_missing`. Blank current class → skip.

Skipped rows stay NULL and keep today's fallback behaviour. `updated_at` is the last edit, not the first save, hence the term-end cap and the mid-term skip. Term days are read as Africa/Lagos days.

## Worked example (hand computed, not executed)
Student A: events `JSS1 -> JSS2` on 2026-07-25 (term 3 of 2025/26 ended 2026-07-24). Current class JSS2. A Term 3 score with `updated_at` 2026-07-10: T = 2026-07-10, no event in [term start, T], class at T = events[0].from = `JSS1` → stamped JSS1. A Term 1 score edited on 2026-09-01: T is capped at the end of Term 1, so also JSS1 → stamped JSS1. A student promoted on 2026-06-30 (inside Term 3): Term 3 rows get `promotion_during_term` and stay NULL.

## Safety
- Dry run is the default and read-only; prints counts by basis and skip reason. `--report <file>` writes skipped rows (student ids, no names) — keep out of Git.
- Writing needs `--apply --confirm-host <host>` equal to `DATABASE_URL`'s host; one transaction; `UPDATE ... WHERE class_name IS NULL`, so no stamp is ever overwritten, and only `class_name` is set (not `updated_at`).
- Back up the database before `--apply`. Idempotent: a second run stamps nothing new.

## Not changed / not covered
- `students`, `audit_log`, routes, schema, the import scripts (`importFirstTerm.ts`, `importGenuineFirstTerm.ts` still insert scores without a class; their rows are picked up by this backfill but new imports are not stamped).
- Attendance and class remarks (no report groups them by class).

## Not done / not verified
Nothing was run: no tests, typecheck, database connection or dry run. The SQL (`AT TIME ZONE`, `unnest` update), type narrowing and the parsing regex are unexecuted. **Run the dry run first and read the counts before `--apply`.**
