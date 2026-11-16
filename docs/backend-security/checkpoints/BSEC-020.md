# Checkpoint — BSEC-020

- **Task ID:** BSEC-020
- **Title:** Enforce score subject ownership and make bulk score writes atomic
- **Status:** merged
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
- **Verification status:** first dedicated run 43937683365 exposed a test harness defect, not an application defect: the raw-score GET used a query-only URL and Node fetch rejected it (`Failed to parse URL from ?term_id=7`). The test now uses the server's absolute base URL. Typecheck was skipped because the test step failed. Repository-wide SS1, SS23 and JSS3 gates passed on the first verification head.
- **Correction commits:** c7512accb38b4b7c93a10c4b5c16535854aa1527 (absolute test URL); 9aba07d32493efd04296852b04ea0ac30a3ec63d (teacher SQL placeholder fix)
- **Follow-up PR:** https://github.com/PDS-David/sts-school-app/pull/891 (merged 2026-11-16T19:34:02Z)
- **Merge commit:** 787014e6442f264040a3da79f8f0d296c82f2e3b
- **Additional defect found by the regression:** GET /scores constructed the teacher school filter as `s.school_code=1` rather than a bound `$1` parameter, causing HTTP 500 for teacher score-list requests. Corrected to a proper PostgreSQL bind placeholder; the existing raw-score assertion now exercises the route successfully.
- **Final verification:** Backend score subject scope and batch atomicity workflow 43938982030 passed all steps, including PostgreSQL 16 schema bootstrap, score authorization/batch rollback/report-scope integration tests and backend TypeScript typecheck. On final PR head 85ea9d7137339636e8944c385d168ff54027452b, SS1 43939295415, SS23 43939295538, student report term-scope 43939295125, JSS3 43939295145, verify 43939295079 and integrity gates all passed. The same source/test tree was exercised by the passing focused run 43938982030.
- **Remaining:** none for BSEC-020. Continue the broader backend/security audit.
