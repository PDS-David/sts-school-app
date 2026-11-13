# Checkpoint — BSEC-005

- **Task ID:** BSEC-005
- **Title:** Validate teacher school/class/subject assignments atomically in admin user management
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-teacher-assignment-integrity-20261113
- **Last commit:** pending
- **Files planned:** backend/src/routes/admin.ts; teacher-assignment validation helper; PostgreSQL integration tests; focused workflow; this checkpoint.
- **Defects:** admin POST /users inserts a teacher before inserting teacher_subjects; an invalid subject FK can leave a partially created account. PUT /users/:id updates the user and deletes/reinserts teacher_subjects as independent statements; an insert failure can commit a changed user and a partially replaced assignment set. Neither route verifies that assigned subjects and classes belong to the teacher's selected school, so a crafted API request can create cross-school subject assignments.
- **Scope boundary:** no active PR changes backend/src/routes/admin.ts. PR #694 changes backend/src/routes/announcements.ts and mobile UI; other open PRs touch learning, scores, attendance, auth, or students. Do not modify those paths.
- **Acceptance criteria:**
  1. Teacher creation and user/subject-assignment updates are atomic.
  2. Teacher school_code must reference an existing school.
  3. Non-null assigned_class must belong to the selected school.
  4. Every assigned_subject_id must be a valid integer subject belonging to the selected school.
  5. Role changes away from teacher clear teacher_subjects assignments; updates to a teacher preserve/replace only valid same-school assignments.
  6. Regression tests prove invalid assignments do not leave users or partially changed assignments.
  7. Backend typecheck and focused PostgreSQL integration tests pass; no production data mutation.
- **Verification:** admin.ts source inspection confirms separate autocommit user and subject writes, and schema confirms teacher_subjects references subjects without a school-composite constraint. No production data accessed or changed.
- **Remaining:** implement transactional validation/update helpers, integration tests and CI; open PR; verify checks.
- **Exact next action:** inspect the complete admin user create/update route and implement a reusable same-school teacher-assignment validator that runs inside each write transaction.
