# OPS-05: Production PostgreSQL recovery and migration baseline

**Snapshot date:** 2026-11-17  
**Database:** Render `sts-school-db-2` (`dpg-dbqhddbrjlhs738a4s4g-a`)  
**Application:** Render `sts-school-app` (`srv-dbqmsa142hec73foh6i0`)  
**Duplicate service:** `sts-school-backend` is suspended.

## Safety status

No production DDL or data mutation has been performed as part of this review. Render's SQL inspection action is read-only. Do not run `db:migrate --fresh`, `db:bootstrap`, or manually create application tables in production.

The migration runner refuses `--all` when an existing database has no migration ledger. Keep that guard. A production baseline must not be adopted until an encrypted backup has been exported, its checksum recorded, a restore has succeeded against a disposable PostgreSQL database, and schema drift has been reviewed.

## Verified production findings

- PostgreSQL 18.6, Free plan, Frankfurt, status available.
- Render currently reports expiry at **2026-12-12 01:30:29 UTC**. Free Postgres has no managed backups; after expiry it becomes inaccessible, with a 14-day upgrade grace period before Render deletes the database and its data. Resolve continuity before expiry; do not rely on the grace period as a backup. (See Render's [Free instance limitations](https://render.com/docs/free).)
- 40 public base tables and 325 public columns were observed.
- Comparing table and column names with the current `backend/schema.sql` found:
  - Missing: `schema_migrations`, `school_events`.
  - Extra relative to `schema.sql`: `app_bootstrap`, `backup_log`. Preserve and inspect these; do not drop them.
  - `rate_limit_counters` is also absent; it is supplied by migration `0003_rate_limit_counters.sql`.
- `audit_log` has 4 rows, but lacks `actor_role`, `actor_school_code`, `actor_ip`, `request_id`, `user_agent`, `metadata`, `outcome`, `previous_hash`, and `event_hash`. Both append-only triggers and the expected audit indexes are absent. Its old `actor_id` foreign key is still present, although current schema intentionally removes it so deleting an account cannot alter historical audit events.
- `users.password_hash` is nullable in production. That matches the current schema, which drops NOT NULL on this column for the staff-activation flow (pending-activation accounts have no password yet), so it is not drift and no constraint change is required.
- Observed data counts include 2 schools, 6 terms, 1,408 topics, 1 user, and 4 audit rows. Do not replace or reseed these records.
- `backup_log` has one `reminder` record, not a database export record. This is not evidence of a recoverable backup. The encrypted export utility takes a repeatable-read snapshot and excludes `app_bootstrap`, `backup_log`, and `schema_migrations` from the data payload.
- `app_bootstrap` has a version-1 marker, but its stored checksum does not match the current `schema.sql` plus the current bootstrap configuration. The marker alone therefore does not prove that today's baseline is installed.
- `schema_migrations` does not exist, so there is no recorded migration history to trust.

The active web service's latest available deploy failed at startup with PostgreSQL error `42P01`: `public.rate_limit_counters` does not exist. Database connectivity/TLS had already succeeded.

## Prepared migration

Branch `ops/production-db-audit-repair-20261117` adds:

- `backend/migrations/0004_audit_log_integrity.sql`

It restores the missing audit columns, outcome check, indexes, mutation-rejection triggers, and PUBLIC privilege revocations. It deliberately does not change `users.password_hash`, which stays nullable for pending-activation accounts.

The migration deliberately leaves historical actor snapshots and hash-chain fields NULL where those facts were never captured. It does not invent historical values or delete/replace audit rows.

This migration must only run after baseline adoption and after migrations 0002 and 0003. It is not a baseline-adoption script and has not been run against production.

## Required recovery sequence

### 1. Export an encrypted backup and a schema-only snapshot

Run from the repository's `backend` directory on a trusted local Windows machine. Use the Render **External Database URL** locally; never paste it into chat or commit it. Use a new private backup passphrase and keep it separately.

```powershell
$env:DATABASE_URL = "<Render external database URL>"
$env:BACKUP_PASSPHRASE = "<private backup passphrase>"

npm run db:backup-export -- --out ..\sts-school-production.sts-backup

pg_dump --schema-only --no-owner --no-privileges "$env:DATABASE_URL" |
  Out-File -Encoding utf8 ..\sts-school-production-schema.sql

Get-FileHash ..\sts-school-production.sts-backup -Algorithm SHA256
Get-FileHash ..\sts-school-production-schema.sql -Algorithm SHA256
```

Store both files and their hashes securely. The schema-only dump is needed because the custom encrypted restore tool requires the target schema to match the backup exactly.

### 2. Restore-rehearse on a disposable local PostgreSQL database

Create an empty disposable database locally (not on the production Render instance). Set `DATABASE_URL` to that local database, then:

```powershell
psql "$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f ..\sts-school-production-schema.sql

npm run db:backup-restore -- --file ..\sts-school-production.sts-backup
npm run db:backup-restore -- --file ..\sts-school-production.sts-backup --apply --confirm-database <exact-local-test-database-name>
```

The first restore command is a dry run. Only the second writes, and it must target the disposable local database. Verify the restored table and row counts, inspect errors, and run application smoke tests against the restored copy. Never use `--apply` against production.

### 3. Complete OPS-05 drift review against the restored copy

Compare the restored production schema with the current repository schema, including column types/nullability/defaults, constraints, indexes, triggers, functions, extensions, and all extra tables. Review the `app_bootstrap` and `backup_log` records. Resolve every unexplained difference before baseline adoption.

Do not run `backend/src/db/checkDrift.ts` against production: it creates and drops a temporary schema in the target database. It may be considered only on a disposable clone after review.

### 4. Adopt only the verified baseline

After the owner approves the completed drift report and restore rehearsal, create `public.schema_migrations` and record **only** the immutable `0001_baseline.sql` entry, using the exact SHA-256 checksum computed by the migration runner for that file. Do not stamp 0002 or 0003: their tables are absent and their effects have not been applied.

The exact adoption SQL should be generated/reviewed from the then-current repository files and verified schema report. Do not guess a checksum, copy a checksum from a different commit, or mark migrations applied merely to bypass the guard.

### 5. Apply and verify numbered migrations

After the adoption record is reviewed and committed, deploy the migration files and run from `backend`:

```powershell
npm run db:migrate -- --status
npm run db:migrate -- --all
npm run db:migrate -- --status
```

Expected sequence: 0002 creates `school_events`; 0003 creates `rate_limit_counters`; 0004 restores audit integrity. Verify table definitions, indexes, constraints, triggers, and migration checksums before restarting the application.

### 6. Restore application service and protect database continuity

Deploy/restart only `sts-school-app`. Confirm the startup log no longer reports missing tables, then smoke-test health, authentication, and read/write flows. Keep `sts-school-backend` suspended until external consumers have been ruled out and rollback is no longer needed.

Separately resolve the Render PostgreSQL Free-plan expiry before **2026-12-12 01:30:29 UTC**. Do not create or upgrade paid resources without the owner's explicit decision.

## Current blocker

The required encrypted backup and successful disposable restore rehearsal have not yet been evidenced. Therefore production baseline adoption and all production migrations remain blocked. This is an intentional data-protection gate, not permission to bypass the migration runner.
