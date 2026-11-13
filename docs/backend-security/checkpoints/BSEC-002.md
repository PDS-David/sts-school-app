# Checkpoint — BSEC-002

- **Task ID:** BSEC-002
- **Title:** Make student and parent auto-provisioning atomic and concurrency-safe
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-parent-provisioning-atomicity-20261113
- **Last commit:** pending
- **Files planned:** backend/src/routes/students.ts; backend/src/utils/parentProvisioning.ts; focused regression tests; focused GitHub Actions workflow; this checkpoint.
- **Defect:** POST /students commits the student row before parent lookup/creation and parent_wards linking. A failure during parent provisioning can return HTTP 500 after the student has already been created, leaving a partial workflow and making a retry prone to a duplicate-admission conflict. Parent de-duplication is also a read-then-insert sequence without a transaction-scoped lock, so concurrent requests for the same normalized phone suffix can create duplicate parent accounts.
- **Scope boundary:** no active PR changes backend/src/routes/students.ts or backend/src/utils/parentProvisioning.ts. Active PR #686 changes backend/src/routes/learning.ts and schoolEvents.ts; BSEC-001 PR #692 changes only auth middleware/claims, package script, tests, workflow and checkpoint. The teacher analytics branch changes scores.ts only. Do not touch those concurrent paths.
- **Acceptance criteria:**
  1. Student insert, parent find/create and parent_wards link execute on one PostgreSQL transaction client.
  2. Concurrent provisioning for the same normalized phone suffix is serialized so only one parent is created and reused.
  3. Audit logging remains best-effort and happens after the data transaction commits.
  4. Regression tests cover successful reuse, new-parent creation, lock usage and rollback-safe control flow.
  5. Backend typecheck and focused tests pass; no production database mutation.
  6. Focused PR targets master with test evidence.
- **Verification:** source inspection confirms the partial-commit path and unlocked find-or-create path. Automated tests not yet run.
- **Remaining:** refactor parent provisioning to accept a transaction client, wrap POST /students in withTransaction, add regression coverage and CI, run checks, open PR.
- **Exact next action:** inspect bootstrap/schema test conventions, then implement transaction-client helpers and the route transaction.
