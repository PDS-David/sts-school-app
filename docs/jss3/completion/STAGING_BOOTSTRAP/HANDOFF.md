# STAGING-BOOTSTRAP handoff

Task: `15_STAGING_BOOTSTRAP.md`. Base master `5cb360ac2d659772b6a7fa279fec9d69d3a3e6e5`. Branch `staging-bootstrap-20261022`.

**Statuses (kept separate)**
- Implementation: done. Testing: done on disposable PostgreSQL 16.15 (local) — see results below; CI step added, result is the PR's check run.
- Publication: branch + PR to master, **not merged** (integrator merges).
- Target designation, actual first-admin execution, staging provisioning, EAS build and device observation: **outstanding, not performed, not authorised by this task.** No staging/production database, host or account was contacted.

**Behaviour** — `npm run db:create-staging-admin --workspace backend -- <flags>` (`backend/src/db/createStagingAdmin.ts`). Default dry run (READ ONLY transaction). Write needs `--apply --acknowledge-staging-only --confirm-database <name>`; confirmation must equal `current_database()`, and the name must match `staging_*|stg_*|jss3_staging_*|jss3_test_*` (never `prod`/`live`). Requires the `db:bootstrap` marker and **zero** `users` rows; never overwrites, resets or grants. Advisory lock + `LOCK TABLE users` serialise runs; every guard rolls back. Password only from a named env var (≥12 chars, ≤72 bytes, mixed classes, not demo/common, not containing the username); bcrypt cost 10 (same as login), verified with `bcrypt.compare` before commit; never printed. Inserts one `admin` (`must_change_pw=FALSE`) plus an `audit_log` row. `db:seed` untouched.

**Files** — added `backend/src/db/createStagingAdmin.ts`, `tests/staging-admin.db.test.mts`, this file; changed `backend/package.json` (script), `.github/workflows/jss3-assets.yml` (serial step after YO-LICENSE), `docs/jss3/completion/STAGE1/RUNBOOK.md` (§1 naming rule, §5a PowerShell + bash groups with placeholders, §5b student flow retained).

**Tests** (`JSS3_LOCAL_TEST_DATABASE_URL`, loopback only; test creates and drops its own `jss3_test_admin_*` databases): dry run writes nothing; valid admin accepted by the real `/auth/login` route; CLI end to end with no secret in output; missing acknowledgement/confirmation; wrong confirmation; missing/short/weak/typed-as-name password; non-designated and unbootstrapped DB; existing admin/student/teacher; missing school; repeat refusal; concurrent runs (exactly one wins); forced rollback; DB cleanup asserted.

**Commands run (this environment)**: `npm ci --ignore-scripts`; `tsc --noEmit -p backend/tsconfig.json` (clean); `node --import tsx --test tests/staging-admin.db.test.mts` → 16/16 pass against PostgreSQL 16.15; skipped cleanly when the URL is unset; manual `npm run … --workspace backend --` dry run/apply/repeat on a scratch database. **Not run here:** the rest of the CI suite (Python/other node tests; unchanged by this PR), Node 24.19.0 (sandbox has Node 22.22.2).

**Overlap/dependencies**: shared files `jss3-assets.yml` (appended step at end) and `STAGE1/RUNBOOK.md` §1/§5. No dependency on other PRs. No schema, curriculum or application route change. No private input ZIP needed.

**Remaining external input**: owner designates the target and runs §5a themselves.
