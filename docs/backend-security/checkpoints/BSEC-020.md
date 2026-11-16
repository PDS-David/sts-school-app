# Checkpoint — BSEC-020

- **Task ID:** BSEC-020
- **Title:** Enforce score subject ownership and make bulk score writes atomic
- **Status:** implementation merged; focused regression verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Original implementation PR:** https://github.com/PDS-David/sts-school-app/pull/826 (merged 2026-11-13; merge SHA recorded by GitHub)
- **Working branch:** agent/backend-score-subject-scope-atomicity-20261113
- **Implementation branch:** agent/backend-score-subject-scope-atomicity-20261113 (merged by PR #826)
- **Verification branch:** agent/backend-score-subject-scope-verification-20261116
- **Verification changes:** tests/backend-score-subject-scope-atomicity.integration.test.mts; .github/workflows/backend-score-subject-scope-atomicity.yml; this checkpoint.
- **Agent coordination:** PRs #801/#809/#815/#822/#825 touch weeklyEfforts.ts, academic.ts, attendance.ts, learning.ts and finance.ts respectively. No active PR changes scores.ts or the new score-scope integration test.
- **Defects found:** POST /scores and POST /scores/bulk call checkTeacherStudentScope, which checks student school/class and term ownership but receives no subject ID. Consequently a subject-only teacher can write grades for any subject in their school, not just their assigned subjects. Both routes also accept a subject_id from another school if the student and term are local. Bulk writes are performed as separate autocommit INSERT/UPSERT statements after validation, so a database error part-way through can persist a partial class batch. Report reads join subjects and rank class totals without school predicates, allowing corrupt/legacy cross-school subject references or same-named class records to contaminate reports.
- **Acceptance criteria:**
  1. Lock/re-read student, subject and term rows in the score write transaction and require all three to belong to the same school.
  2. Class teachers remain limited to their assigned class and may enter the subjects allowed by the class-teacher read policy; subject-only teachers may write only their assigned subject IDs.
  3. Apply identical subject/school checks to single and bulk writes.
  4. Make bulk score upserts one transaction; no partial batch persists if any row fails.
  5. Add school predicates to raw score and report joins/rank calculations to keep legacy cross-school references out of reads.
  6. PostgreSQL HTTP regressions cover subject-only allowed/denied subjects, foreign-school subject/term rejection, class teacher behavior, admin data integrity and bulk rollback.
  7. Backend TypeScript and focused PostgreSQL tests pass; no production data changes.
- **Merged implementation:** PR #826 contains locked student/subject/term validation, subject-only teacher authorization, class-teacher class restrictions, all-or-nothing bulk score writes, and school-safe score/report joins. Source is present on current master.
- **Verification gap discovered on reconnection:** the PostgreSQL regression test was merged but no dedicated workflow ran it. Its report assertion expected the wrong JSON shape (`class_size` and `subjects` at the root); the actual endpoint returns `summary.class_size` and score rows under `scores`. The regression also lacked a successful-bulk commit assertion.
- **Correction:** fixed the report response assertions, added a valid-batch persistence assertion, and added a PostgreSQL 16 workflow that bootstraps the disposable schema, runs this integration test and typechecks the backend.
- **Verification status:** workflow pending; the previous PR #826 required repository-wide JSS3 static and SS1 hash gates failed on unrelated package/content checks. Its backend student-report term-scope workflow passed. Do not count those repository-wide failures as score-specific regressions.
- **Remaining:** obtain passing dedicated PostgreSQL integration and backend typecheck results; fix any genuine score-specific failures; merge the focused verification PR; continue the backend audit.
- **Exact next action:** open a focused PR from agent/backend-score-subject-scope-verification-20261116 and inspect its PostgreSQL workflow logs.
