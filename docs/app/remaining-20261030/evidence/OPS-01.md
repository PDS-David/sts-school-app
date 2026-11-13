# OPS-01 — Versioned migration ledger

Task ID: OPS-01
Status: IMPLEMENTED IN BRANCH — awaiting CI/review; no live database command run
Branch: `agent/ops-01-migration-ledger-20261113`

## Implementation
- Replaced schema replay as the default `db:migrate` behavior with numbered, checksum-verified migrations.
- Added `schema_migrations` to the complete fresh-install schema and runner-side bootstrap creation.
- Added immutable `0001_baseline.sql` marker; `schema.sql` stamps its exact SHA-256 on fresh schema replay, so the existing clean bootstrap path records the baseline without weakening its empty-schema guard.
- Added `--all` (default), `--fresh`, and read-only `--status` modes; exposed `db:migrate:fresh` and `db:migrate:status` workspace scripts.
- Migrations are sorted, filename/version validated, protected by a PostgreSQL advisory lock, and each runs in its own transaction.
- Applied migration names/checksums are verified before proceeding; missing/changed files and non-sequential history abort.
- The runner refuses to baseline an existing application schema without OPS-05 drift evidence. It does not silently adopt production databases.

## Changed files
- `backend/src/db/migrate.ts`
- `backend/schema.sql`
- `backend/package.json`
- `backend/migrations/0001_baseline.sql` (new)
- `backend/migrations/README.md` (new)
- `backend/migrations/README.md` (new)
- This evidence file.

## Commits
- Migration runner: `ee941edb74f284c21f972f1b192c0768cf2a9d8b`.
- Safety guards/order: `5dfe791e95f023cbed328daa7490c6ae67e8cc9a`.
- Fresh schema ledger: `38164a0e20456e44ef66ae3e7c99c7fc59a0e4bd`.
- Baseline marker: `78f87f0954683acd6c1cf57c4e59ad5281ec2f56`.
- Package commands: `019c1ea9a5e75b2b60080102b3163e91de08f11a`.
- Migration docs: `dd483cff9bb65b64b08762883d5016196e1cbb75`.
- Empty-db guard: `05d6f0c32ae17855d4956c627cf61446507ec1f8`.
- Schema baseline stamp: `4a28d86e6b3e2bf1b3edc6133bca56c234fc60c4`.
- Verify baseline after fresh replay: `4df16f938aea53789c7c548d6db66e75ac4e9867`.
- Enforce contiguous migration numbering: `0b5b7def1f70d36e8b248eba297510cf0f6ebbcc`.
- Atomic fresh schema replay: `3d81ad5deaab7b944eb92ad15a09611fe1d27509`.
- Restrict `--fresh` to an empty application schema: `8afbacc228e427a78eb4ec9cf699b6387bcb8731`.

## Verification
- Static review confirms default mode is `--all`, `--status` does not create the ledger, migration SQL is wrapped in BEGIN/COMMIT with rollback on error, and the advisory lock is released in a finally block. Fresh schema replay stamps the immutable baseline; `--fresh` is restricted to an empty application schema; default `--all` refuses an untracked schema or an empty uninitialized database.
- Static review confirms an existing schema without a baseline is refused rather than stamped automatically.
- No migration command or live database was run in this session. The repository's PR verify workflow must typecheck the backend and replay the fresh schema before merge.
- Existing databases must not be adopted until OPS-05 schema-drift evidence and owner approval exist.

## Remaining
- CI typecheck/schema replay and review.
- Add a numbered migration for the school_events table in the calendar PR, using this runner as its base dependency.
- Existing production database baseline adoption remains blocked on OPS-05 owner-approved drift evidence.

## Exact next action
Open a focused PR for OPS-01. Then stack the calendar/events PR on this branch and add `0002_school_events.sql`; do not merge or baseline any existing production database without the owner-approved drift evidence.
