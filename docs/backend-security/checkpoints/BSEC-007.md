# Checkpoint — BSEC-007

- **Task ID:** BSEC-007
- **Title:** Audit and remediate vulnerable locked npm dependencies
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-dependency-security-20261113
- **Last commit:** pending
- **Files planned:** root package.json/package-lock.json and/or backend package manifest/lock as needed; dependency security audit workflow; this checkpoint.
- **Finding:** every CI npm ci currently reports 40 dependency vulnerabilities (2 low, 16 moderate, 20 high, 2 critical). It also warns that the locked Multer 1.x version is affected by multiple vulnerabilities patched in Multer 2.x. The exact advisory/package breakdown has not yet been retrieved.
- **Scope boundary:** no active PR changes the root dependency lockfile. PR #692 changes backend/package.json only; other open PRs change source files and tests. Do not blindly apply npm audit fix --force; assess each advisory and compatibility impact.
- **Acceptance criteria:**
  1. Retrieve exact npm audit advisories, affected dependency paths and fixed versions.
  2. Upgrade direct dependencies and transitive dependencies only where supported fixes exist.
  3. Preserve lockfile reproducibility and avoid forced breaking upgrades without code migration/tests.
  4. Run relevant backend/frontend tests and TypeScript/build checks.
  5. Add an enforceable dependency audit gate that fails on unresolved critical/high production vulnerabilities, with an explicit reviewed exception policy if any advisory is unfixable.
  6. No production deployment or data changes.
- **Verification:** CI install logs from PR branches report 40 vulnerabilities (2 low, 16 moderate, 20 high, 2 critical); npm audit has not yet been run to retrieve exact advisories.
- **Remaining:** run npm audit in a disposable CI job, inspect advisory output, remediate with focused commits and verify.
- **Exact next action:** add a temporary diagnostic CI workflow that prints exact advisory metadata and exits with npm audit's original non-zero status.