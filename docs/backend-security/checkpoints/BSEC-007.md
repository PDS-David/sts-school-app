# Checkpoint — BSEC-007

- **Task ID:** BSEC-007
- **Title:** Audit and remediate vulnerable locked npm dependencies
- **Status:** merged
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
- **PR:** https://github.com/PDS-David/sts-school-app/pull/707
- **Merged:** PR #707 merged at 2026-11-13T15:31:22Z; merge commit 5405f45db77c6e5f0d4cfde2b4ef5f60b9ed43a2.
- **Final audit:** 0 critical findings; 0 moderate/high/critical findings in backend production dependencies. The full monorepo retains 4 high, 10 moderate and 2 low findings, all in the explicitly reviewed Expo SDK 56 toolchain exception documented in docs/backend-security/dependency-exceptions.md. CI fails on critical findings, any additional high finding, or any backend production moderate-or-higher finding.
- **Remaining:** remove the narrow Expo exception after a separately tested Expo SDK 58 migration; continue the broader backend/security audit.
- **Exact next action:** add a temporary diagnostic CI workflow that prints exact advisory metadata and exits with npm audit's original non-zero status.