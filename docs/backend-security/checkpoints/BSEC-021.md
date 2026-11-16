# Checkpoint — BSEC-021

- **Task ID:** BSEC-021
- **Title:** Enforce school/class authorization and transactional integrity on parent-ward link mutations
- **Status:** implementation committed; CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** e96ab3437e1804f4e9cdac782b03c94531538c3d
- **Working branch:** agent/backend-parent-ward-link-scope-20261116
- **Changed files:**
  - backend/src/routes/students.ts
  - tests/backend-parent-ward-link-scope.integration.test.mts
  - .github/workflows/backend-parent-ward-link-scope.yml
  - docs/backend-security/checkpoints/BSEC-021.md
- **Defect:** POST /students/:id/link-parent and DELETE /students/:id/unlink-parent/:parentId required only the generic grades.write permission. They did not verify the target student was active, nor check the caller's school/class. A teacher could therefore attach or detach parent accounts on another school's students or another class by supplying IDs. Link validation and the write were separate autocommit queries, leaving a race with student reassignment/soft deletion. Linking also accepted inactive parent accounts.
- **Implementation:** both routes validate UUIDs and use a single transaction. The target student row is locked FOR UPDATE before checking active state and caller scope. Admin retains global access; teachers are pinned to their current school and, when assigned, their class. Linking locks and validates an active parent account, inserts idempotently and audits only an actual change. Unlinking is transactional and audits only when a relationship was removed.
- **Regression coverage:** PostgreSQL HTTP tests cover allowed class-teacher link/unlink, duplicate-link idempotency, cross-class and cross-school teacher denial, another-school teacher unlink denial, invalid IDs, non-parent and inactive-parent rejection, deleted-student denial, and administrator cross-school operations.
- **Verification:** source and test commits pushed to the dedicated branch. PostgreSQL 16 integration workflow and backend typecheck are pending. No production data or database was accessed or changed.
- **Remaining:** run focused workflow; fix genuine failures without relaxing assertions; open a focused PR; verify JSS3/SS1 repository-wide gates and merge only after all required checks pass.
- **Exact next action:** open a PR from this branch and inspect PostgreSQL workflow logs.
