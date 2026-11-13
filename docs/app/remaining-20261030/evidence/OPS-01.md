# OPS-01 — Versioned migration ledger

Task ID: OPS-01
Status: IMPLEMENTED ON CURRENT MASTER BRANCH — CI/review pending; no school database touched
Base: `master` at `03aa60f0f448caed371e8da9a30ff1f91cb0cbf5`
Branch: `agent/ops-01-rebased-20261113`

## Implementation
- Replaced the cumulative schema replay as the default `db:migrate` behavior with ordered, numbered, SHA-256-verified migrations.
- Added `schema_migrations` to the full fresh-install schema and an immutable `0001_baseline.sql` marker. Clean bootstrap/schema replay stamps the marker's exact SHA-256.
- Added `--all` (default), `--fresh`, and read-only `--status` modes plus `db:migrate:fresh` and `db:migrate:status` workspace scripts.
- Migrations are filename/version validated, contiguous, applied one at a time in their own transaction, and serialized with a PostgreSQL advisory lock.
- Applied names/checksums are verified; missing, changed, out-of-order or non-sequential migration history aborts.
- `--status` does not create or mutate the ledger.
- `--all` refuses an empty/uninitialized database and an existing untracked schema without creating an empty ledger or silently adopting a baseline.
- `--fresh` checks that the public schema has no untracked application objects before creating the ledger and replaying the full schema.
- Existing production database adoption remains deliberately blocked on OPS-05 drift evidence and explicit owner approval.

## Changed files
- `backend/src/db/migrate.ts`
- `backend/schema.sql`
- `backend/package.json`
- `backend/migrations/0001_baseline.sql` (new)
- `backend/migrations/README.md` (new)
- `tests/migration-ledger.db.test.mts` (new)
- `scripts/jss3/run_acceptance.py`
- `README.md`
- This evidence file.

## Commits
- Runner: `35814f8106faf17ceff14d5b15bbeabdde96af47`.
- Baseline marker and docs: `06320d769aec67b3c092f2e2c66f29b92ff1983b`, `f0e68ec82aecfb46746acd21efe7ef8009f1ffd6`.
- Disposable PostgreSQL integration tests: `7b06d27211575779ff08a687db63793090ae5a86`.
- Fresh schema baseline: `5fab6217dd3fa1860f42f16afc2b2fcf9daa62e9`.
- Package commands: `b736f80218c98958e92e85c1f618060b1565d2cd`.
- Acceptance runner registration: `b4b24696034e2bc1bd2fe48b7564253d9c7236fb`.
- Root documentation: `6085f50784c9c767739211a45bf4e3f8d7b5e625`, `8e46631a743058a49be50bce1d318582fee6c943`.
- Safer untracked-schema handling and integration assertion: `0e1bc05122d575d437d7b751948a8bd1a2d7de22`, `3a02ed0ae42745c6106dd8d26e35d78361ed761d`, `1ed3bec74e320fd83dc0443f800bf1a781bd3e23`.

## Verification
- Backend/mobile typechecks passed on an earlier iteration, but that run's static/focused regression failed because the new database suite was not registered in the JSS3 acceptance suite registry. The missing registration was added.
- Added disposable-PostgreSQL tests for read-only status, refusal to invent a baseline, clean fresh baseline stamping, idempotent apply, checksum drift refusal, transactional rollback, and existing-schema refusal.
- The latest current-master branch has not yet completed CI. No local database command or school production database was used.
- Do not claim OPS-01 complete until CI passes and the focused disposable PostgreSQL suite actually executes successfully.

## Remaining
- CI and PostgreSQL integration test execution.
- Review by repository maintainers.
- Stack the calendar/events change as `0002_school_events.sql` only after this runner branch is accepted.
- OPS-05 owner-approved drift/backup/rehearsal remains a separate gated task.

## Exact next action
Open the current-master OPS-01 PR and inspect the complete `verify` workflow and disposable PostgreSQL test result. Fix failures before asking for merge; do not adopt an existing database.
