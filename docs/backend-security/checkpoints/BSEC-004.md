# Checkpoint — BSEC-004

- **Task ID:** BSEC-004
- **Title:** Make bulk attendance writes all-or-nothing
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-attendance-bulk-atomicity-20261113
- **Last commit:** pending
- **Files planned:** backend/src/routes/attendance.ts; new attendance persistence helper; PostgreSQL integration tests; focused workflow; this checkpoint.
- **Defect:** PUT /attendance/bulk validates the full request before writing, but persists each row using separate pool.query calls without a transaction. A database error or concurrent deletion after prevalidation can leave only part of the class attendance batch committed while the request fails.
- **Scope boundary:** no active PR changes backend/src/routes/attendance.ts or the new persistence helper. PR #698 changes only mobile attendance recovery UI. PR #700 and branch agent/teacher-marking-analytics-20261113 change backend/src/routes/scores.ts; this task does not touch scores.ts.
- **Acceptance criteria:**
  1. All bulk attendance upserts use one PostgreSQL transaction/client.
  2. Any row failure rolls back every write in the batch.
  3. Successful batches still upsert each row and preserve existing route validation and audit behavior.
  4. PostgreSQL integration tests prove success and rollback after a later-row FK violation.
  5. Backend typecheck and focused tests pass; no production database mutation.
  6. Focused PR targets master.
- **Verification:** source inspection confirms individual pool.query writes after validation; no transaction encloses the loop. No production data accessed or changed.
- **Remaining:** implement transaction helper, wire bulk route, add disposable-PostgreSQL tests/workflow, run checks and open PR.
- **Exact next action:** extract the bulk attendance persistence loop into a transaction-backed helper and add integration coverage.
