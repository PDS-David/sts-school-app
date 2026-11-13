# Checkpoint — BSEC-015

- **Task ID:** BSEC-015
- **Title:** Enforce invoice fee-item class compatibility and lock financial references during invoice creation
- **Status:** implementation and all required CI checks passed; PR review/merge pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 7451e263136b4fedc5fd876f5822c755b6c7b1c7
- **Working branch:** agent/backend-finance-invoice-integrity-refresh-20261113
- **Latest implementation commit:** 8467c9397852b781d3a4e409aa05a60aa14a4132
- **Current PR head:** 26d0e01362b7d29f6fc7b6e754cafb7ffd50915e
- **Changed files planned:** backend/src/routes/finance.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** no other active PR changes backend/src/routes/finance.ts or invoice test paths.
- **Defects found:** POST /finance/invoices checks student, term and fee-item school ownership using independent pool queries before starting its write transaction. Concurrent changes/deletes can invalidate those checks before invoice persistence. It also ignores fee_items.class_name, allowing a same-school fee item assigned to another class to be invoiced to a student. Request IDs are not validated before database calls, and duplicate fee_item_ids produce ambiguous count-mismatch behavior.
- **Acceptance criteria:**
  1. Validate invoice request shape, UUID student ID, positive term ID and unique positive fee-item IDs.
  2. In one transaction, lock and re-read the active student, term and all fee items before any invoice write.
  3. Reject cross-school terms/items and class-specific fee items that do not apply to the student's class.
  4. Keep invoice header and all line items atomic; compute total only from locked database fee-item values.
  5. Add PostgreSQL HTTP integration regressions for class mismatch, school mismatch, duplicate/malformed IDs, successful invoice and rollback on line-item failure where feasible.
  6. Run focused PostgreSQL tests and backend typecheck; no production data changes.
- **Verification:** PR #825 workflows 43473174236 (PostgreSQL invoice integration and backend typecheck), 43473174380 (SS1 package/type/hash integrity), and 43473174246 (JSS3/backend/mobile checks) all passed.
- **Remaining:** merge PR #825 after refreshed head checks pass; no production database or data was changed.
- **Exact next action:** merge PR #825 using expected head SHA 26d0e01362b7d29f6fc7b6e754cafb7ffd50915e after its checkpoint-only update is reverified.
