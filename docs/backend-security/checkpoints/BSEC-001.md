# Checkpoint — BSEC-001

- **Task ID:** BSEC-001
- **Title:** Enforce database-authoritative authorization claims on every authenticated request
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-auth-claims-20261113
- **Last commit:** pending
- **Changed files:** docs/backend-security/checkpoints/BSEC-001.md (checkpoint only at initialization)
- **Defect under investigation:** access tokens embed role, school, class and teacher-subject assignments. Admin user-edit routes can change these fields while requireAuth currently checks only active/expiry/deletion/pending-review state. A previously issued token can therefore continue using stale authorization claims until expiry.
- **Scope boundary:** do not touch backend/src/routes/learning.ts; open PR #686 is actively changing it. The old branch fix/agent4-security-reconciliation is 5 commits ahead but 4,458 commits behind master and has no open PR; it is not a safe base and will not be reused. No active PR currently changes backend/src/middleware/auth.ts.
- **Acceptance criteria:**
  1. Authenticated requests use the current database role, school, class and subject assignments, not stale JWT authorization claims.
  2. Existing account-state checks remain fail-closed.
  3. Regression tests prove demotion, school reassignment and teacher-subject revocation override stale token claims.
  4. TypeScript build and focused regression tests pass, or exact execution limitation is recorded.
  5. Focused PR targets master; no production deployment or live database mutation is performed.
- **Verification:** baseline repository/branch/PR inspection completed. Automated tests not yet run.
- **Remaining:** implement canonical claim hydration, add regression tests, run available checks, update this checkpoint, open PR.
- **Exact next action:** add a pure auth-claims resolver, wire it into requireAuth's existing users lookup, and test stale token claim replacement.
