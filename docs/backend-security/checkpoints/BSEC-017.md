# Checkpoint — BSEC-017

- **Task ID:** BSEC-017
- **Title:** Serialize academic term creation and current-term updates
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-term-session-atomicity-20261113
- **Changed files planned:** backend/src/routes/academic.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** active PR #797 changes finance.ts; PR #801 changes weeklyEfforts.ts; PR #790 changes auth.ts. No active PR changes academic.ts or term-session test paths.
- **Defects found:** POST /terms performs its duplicate/session-cap checks outside a transaction. The database's unique term constraint prevents duplicate names and, combined with the fixed three-name term enum, already prevents more than three distinct terms; however, concurrent duplicate requests can surface a raw database error instead of a stable conflict response. More importantly, PUT /terms/:id clears the school's current-term flags and updates the selected term in separate autocommit statements; a failure between them can leave no current term. The partial unique current-term index prevents two current terms but concurrent switches can still fail one request. Teacher ownership is checked before the write and should be rechecked under the write transaction.
- **Acceptance criteria:**
  1. Serialize term mutations per school using a transaction-scoped advisory lock.
  2. Create term after rechecking duplicate name and session cap inside the transaction; map database uniqueness conflicts to HTTP 409.
  3. Update current-term selection and the target term in one transaction.
  4. Lock and recheck the target term and teacher school ownership inside the transaction.
  5. Validate request types and return 404 for nonexistent update targets.
  6. Add PostgreSQL HTTP integration regressions for concurrent duplicate creation and current-term switching rollback/consistency.
  7. Backend TypeScript and focused PostgreSQL tests pass; no production data changes.
- **Exact next action:** inspect terms schema and implement transaction-scoped school locking for POST/PUT /terms.
