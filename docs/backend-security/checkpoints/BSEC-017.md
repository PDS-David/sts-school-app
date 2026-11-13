# Checkpoint — BSEC-017

- **Task ID:** BSEC-017
- **Title:** Serialize academic term creation and current-term updates
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-term-session-atomicity-20261113
- **Changed files planned:** backend/src/routes/academic.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** active PR #797 changes finance.ts; PR #801 changes weeklyEfforts.ts; PR #790 changes auth.ts. No active PR changes academic.ts or term-session test paths.
- **Defects found:** POST /terms performs a read-then-insert check for duplicate term names and the three-term session cap without a transaction or lock, so concurrent requests can create duplicate terms or more than three terms. PUT /terms/:id clears the school's current-term flags and updates the selected term in separate autocommit statements; failure between them can leave no current term, while concurrent requests can leave multiple current terms. Teacher ownership is also checked before the write and can become stale if an administrator moves the term concurrently.
- **Acceptance criteria:**
  1. Serialize term mutations per school using a transaction-scoped advisory lock.
  2. Create term after rechecking duplicate name and three-term session cap inside the transaction.
  3. Update current-term selection and the target term in one transaction.
  4. Lock and recheck the target term and teacher school ownership inside the transaction.
  5. Validate request types and return 404 for nonexistent update targets.
  6. Add PostgreSQL HTTP integration regressions for concurrent duplicate/over-cap creation and current-term switching rollback/consistency.
  7. Backend TypeScript and focused PostgreSQL tests pass; no production data changes.
- **Exact next action:** inspect terms schema and implement transaction-scoped school locking for POST/PUT /terms.
