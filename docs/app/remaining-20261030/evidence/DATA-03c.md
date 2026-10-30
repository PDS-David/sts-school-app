# DATA-03c — class from the First Term report cards; keep the rename script in step

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented, not approved, not verified, **not run**).
Owner approval: all three items approved 2026-10-30.
Base: stacked on `app/data-03b-score-class-backfill` (PR #287, unmerged), which supplies `backfillScoreClass*.ts`. Merge #287 first.
Files: `backend/src/db/classNaming.ts` (new), `backend/src/db/backfillScoreClassLogic.ts`, `backend/src/db/backfillScoreClass.ts`, `backend/src/db/importGenuineFirstTerm.ts`, `backend/src/db/renameClassNaming.ts`, this note.

## Evidence from the owner's attachments (read-only, not committed)
Two zips of 108 First Term report-card HTML files (49 secondary, 59 primary). Each card prints the student's class and term. Counts only (no names are kept in Git):
- Secondary: JSS1 8, JSS2 13, JSS3 5, SS1 13, SS2 8, SS3 2, all printed "First Term 2024/2025".
- Primary: Grade 1 9, Grade 2 15, Grade 3 9, Grade 4 16, Grade 5 10, all printed "First term 2025/2026".
- Against `backend/src/db/data/genuine_first_term_import.json`: 102 of 108 students match by name and all 102 have the same class. 6 cards and 6 JSON students did not match by name; the reason was not investigated.
- **Open question for the owner:** secondary cards say 2024/2025, the importer and database say 2025/2026. Treated here as a printing slip on the cards; the code does not depend on the card's year.

## Changes
1. **Importer** (`importGenuineFirstTerm.ts`): each score is now inserted with `class_name` = the card's class, written in the school's current naming (`JSS1`→`JSS 1`, `Grade 1`→`Primary 1`, only if that name exists in the school's `classes` table; otherwise no stamp). On conflict an existing stamp is kept (`COALESCE(scores.class_name, $9)`). Needs `schema.sql` applied first (the `class_name` column).
2. **Backfill** (`backfillScoreClass*.ts`): rows in the card term (`1st Term` 2025/2026 per school) are stamped from the card class with basis `first_term_report_card`, ahead of the promotion-history rules. Students are matched by school and case-insensitive full name, only when exactly one student has that name; admission numbers are not used (the cards use a different scheme, as the importer documents). The dry run prints how many card students were usable, unmatched, ambiguous, or had a class not in `classes`.
3. **Rename script** (`renameClassNaming.ts`): `['scores','class_name']` added to `TABLES`, so a rename no longer splits stamped scores from `students.class_name`. The name mapping moved to `classNaming.ts` (same values) so the three scripts share it.

## Not changed / not covered
- `importFirstTerm.ts` (its data is actually Second Term, per the other importer's notes) and any later-term data still insert scores without a class; the promotion-history rules cover those rows in the backfill.
- Attachments cover First Term only.
- Class remarks, attendance, routes, schema.

## Not done / not verified
No tests, typechecks, database connection, dry run or import were run (testing deferred by owner). Run the backfill dry run and read the card counts before `--apply`.
