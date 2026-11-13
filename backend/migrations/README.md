# Database migrations

## Commands

Run from the repository root:

- `npm run db:migrate --workspace backend` — apply pending numbered migrations (default mode is `--all`).
- `npm run db:migrate:fresh --workspace backend` — apply the complete `backend/schema.sql` for a clean installation and stamp the immutable `0001_baseline.sql` marker.
- `npm run db:migrate:status --workspace backend` — show applied/pending versions without writing to the database.

## Rules

1. Add new schema changes as a new file under `backend/migrations/`, named `NNNN_short_description.sql`.
2. Never edit a migration after it has been applied. The runner records SHA-256 checksums and aborts if an applied file is renamed, removed or modified.
3. Each migration runs in its own transaction while holding a PostgreSQL advisory lock. A failed migration is rolled back and is not recorded as applied.
4. Keep `backend/schema.sql` as the complete fresh-install schema. When a new migration is added, keep the fresh-install schema in sync.
5. `0001_baseline.sql` is an immutable marker only; do not put later schema changes in it.
6. The runner refuses to stamp an existing application database that has no migration baseline. Do not use `--fresh` on an existing production database as a shortcut. Existing databases require the owner-approved OPS-05 schema-drift review before explicit baseline adoption.
7. `--status` is read-only. It does not create the ledger or alter schema.

## New database setup

Use the existing clean-install/bootstrap procedure, or run the explicit `--fresh` command against an empty database. After the baseline is stamped, the default `db:migrate` command applies all subsequent numbered migrations.

## Existing database adoption

Do not infer that an existing database matches the baseline. Capture the schema-drift evidence required by OPS-05 and obtain owner approval before inserting a baseline row. The normal `--all` command intentionally refuses an untracked existing application schema.
