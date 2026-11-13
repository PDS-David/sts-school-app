# Checkpoint — BSEC-020

- **Task ID:** BSEC-020
- **Title:** Enforce score subject ownership and make bulk score writes atomic
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** af35f2f669d10e9b56b2abeae71e7abb3b0a8862
- **Working branch:** agent/backend-score-subject-scope-atomicity-20261113
- **Changed files planned:** backend/src/routes/scores.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
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
- **Exact next action:** inspect the scores table and report authorization helper, then add a locked score-reference validator and use it in both write routes.
