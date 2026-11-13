# Checkpoint — BSEC-015

- **Task ID:** BSEC-015
- **Title:** Enforce invoice fee-item class compatibility and lock financial references during invoice creation
- **Status:** focused verification passed; refreshed PR checks pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 7451e263136b4fedc5fd876f5822c755b6c7b1c7
- **Working branch:** agent/backend-finance-invoice-integrity-refresh-20261113
- **Prior implementation commit:** 9739787b9dda4a779bd2c19ae4ac63fd8432cd57
- **Refreshed branch:** current PR branch
- **Changed files planned:** backend/src/routes/finance.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** PR #788 changes curriculum data and notification client files; PR #790 changes backend/src/routes/auth.ts and credential tests. No active PR changes backend/src/routes/finance.ts or invoice test paths.
- **Defects found:** POST /finance/invoices checks student, term and fee-item school ownership using independent pool queries before starting its write transaction. Concurrent changes/deletes can invalidate those checks before invoice persistence. It also ignores fee_items.class_name, allowing a same-school fee item assigned to another class to be invoiced to a student. Request IDs are not validated before database calls, and duplicate fee_item_ids produce ambiguous count-mismatch behavior.
- **Acceptance criteria:**
  1. Validate invoice request shape, UUID student ID, positive term ID and unique positive fee-item IDs.
  2. In one transaction, lock and re-read the active student, term and all fee items before any invoice write.
  3. Reject cross-school terms/items and class-specific fee items that do not apply to the student's class.
  4. Keep invoice header and all line items atomic; compute total only from locked database fee-item values.
  5. Add PostgreSQL HTTP integration regressions for class mismatch, school mismatch, duplicate/malformed IDs, successful invoice and rollback on line-item failure where feasible.
  6. Run focused PostgreSQL tests and backend typecheck; no production data changes.
- **Exact next action:** inspect current finance route and schema constraints on this branch, then implement a transactional invoice creation helper and tests.
