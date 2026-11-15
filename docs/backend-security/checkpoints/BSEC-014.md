# Checkpoint — BSEC-014

- **Task ID:** BSEC-014
- **Title:** Add normalized per-account login brute-force protection
- **Status:** implementation committed; CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-login-account-rate-limit-20261113
- **Latest implementation commits:** auth route 4cc0d54278dd759514182ef5c7548b630afb104b; integration tests 7b4e170a2b6c394627f916d7e88b312816b0f439
- **Changed files:**
  - backend/src/routes/auth.ts
  - tests/backend-credential-attempts.integration.test.mts
  - this checkpoint
- **Finding:** the global /auth limiter is IP-based. There was no independent login-attempt limit per account, so a distributed attacker could make repeated guesses against one username, and a shared school IP could consume a common quota for unrelated accounts.
- **Implementation:** add an express-rate-limit login middleware keyed by SHA-256 of the normalized lowercase username (bounded to 128 characters). Allow 10 failed requests per 15 minutes; successful logins are skipped. Add strict username/password type and username-length validation. The existing global IP limiter remains as defense-in-depth; this change does not modify proxy trust or its global quota.
- **Regression coverage:** PostgreSQL HTTP integration tests verify case/whitespace-normalized usernames share one quota, a second account has an independent quota, the 11th failed attempt returns 429, and a successful login does not consume the failed-attempt quota.
- **Verification:** source/tests fetched back from GitHub and reviewed. The existing PostgreSQL 16 credential workflow includes this test file and auth route; CI pending. No production accounts or data were accessed.
- **Remaining:** run login rate-limit integration tests and backend TypeScript typecheck; verify JSS3/SS1 gates; open focused PR.
- **Exact next action:** inspect current branch head and CI run for BSEC-014.