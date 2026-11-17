# Production PostgreSQL Read-Only Schema Evidence — 2026-11-17

## Scope and safety

This report records read-only catalog queries against the Render PostgreSQL instance `sts-school-db-2` (`dpg-dbqhddbrjlhs738a4s4g-a`) in Frankfurt. Queries were executed through a read-only transaction interface. No application rows, schema objects, migrations, backup settings, credentials, or service configuration were changed.

The repository's existing `backend/src/db/checkDrift.ts` is **not** a pure read-only operation: it creates and drops a temporary schema and executes `backend/schema.sql` within it. It was not run against production. The evidence below comes from direct SELECT queries against PostgreSQL catalogs and existing tables.

## Observed database state

- PostgreSQL 18.6; Render plan Free; observed creation time 2026-11-12 01:30:29 UTC; scheduled expiry 2026-12-12 01:30:29 UTC.
- 40 public base tables, 325 columns, 71 indexes and 254 constraints.
- `public.app_bootstrap` exists and contains version 1 with a checksum and applied timestamp. It is a bootstrap marker, not the migration ledger used by the current migration runner.
- `public.schema_migrations` does not exist.
- `public.school_events` does not exist, although `backend/migrations/0002_school_events.sql` defines it.
- `public.audit_log` has 9 columns and 4 rows; newest row observed at 2026-11-12 08:24:06.918766 UTC.
- `public.backup_log` contains one row: `kind=reminder`, `status=sent`, latest/only record 2026-11-12 08:16:41.590773 UTC. This is not evidence of a completed database backup.
- No user-defined triggers were returned for the public schema. In particular, no append-only audit triggers were found on `public.audit_log`.

## Confirmed schema gaps against current repository schema

Current `backend/schema.sql` defines the BSEC-029 audit additions below, but none are present in the production `audit_log` table:

- `actor_role`
- `actor_school_code`
- `actor_ip`
- `request_id`
- `user_agent`
- `metadata`
- `outcome`
- `previous_hash`
- `event_hash`

The same schema defines:
- `audit_log_reject_mutation()`
- `audit_log_append_only_update_delete` trigger
- `audit_log_append_only_truncate` trigger
- audit indexes including the partial unique event-hash index

The production catalog returned no public user-defined triggers, so those append-only controls are not installed on the live database. This is a material production security/schema drift finding, not merely missing optional metadata.

The `school_events` table is absent while migration 0002 is present in the repository and the current application includes the school-calendar feature. This is an additional un-applied schema change.

## Migration adoption must remain blocked

The current migration runner requires `schema_migrations` for incremental `--all` operation and intentionally refuses to stamp an existing populated application database without an owner-approved OPS-05 drift review. Do not run `db:migrate --fresh`, create a baseline row manually, or apply migration 0002 as a shortcut.

The production `app_bootstrap.version=1` value does not prove that the current `0001_baseline.sql` checksum has been adopted into `schema_migrations`. The bootstrap table has only `version`, `checksum`, and `applied_at`; it is not the migration ledger.

## Backup and health-check delivery constraints

The current backup implementation in `backend/src/utils/backup.ts` has a useful encrypted export format (AES-256-GCM over gzip data), a repeatable-read database snapshot, and a workstation export command (`npm run db:backup-export --workspace=backend`). However, its automatic scheduler is an in-process hourly timer. It attempts to send the encrypted file by SMTP; when no recipient is configured or the file is too large for the 17 MiB attachment limit, it records a non-delivered attempt and points the operator to the manual workstation export. There is no configured object-storage destination in the inspected implementation.

This does not provide a reliable unattended backup on the current Free Render web services: they may spin down while idle, and Render Free outbound SMTP restrictions prevent relying on the standard SMTP ports. The one reminder row in `backup_log` is consistent with a reminder having been sent, not with a completed backup. Until a durable off-host destination and credentials are explicitly selected, the safe path is a manual encrypted export from a trusted workstation followed by checksum verification, separate passphrase custody and a restore rehearsal on a disposable database. No backup was exported in this inspection.

Both Render web services currently have an empty HTTP health-check path. The repository already provides:
- `GET /health/live` — process liveness, independent of PostgreSQL.
- `GET /health/ready` — readiness including a bounded PostgreSQL probe (5-second statement timeout), with no secret or database details in its response.

After the Redis-backed rate-limit dependency is supplied and the service can start, configure `/health/ready` in each Render service's Dashboard → Settings → Health Checks. This is a configuration step only; the connected Render controls exposed for this inspection do not provide a service health-check-path update action. Do not assume the setting has been applied.

## Required next steps

1. Obtain a consistent backup using an approved destination and encryption key, then verify its checksum and rehearse restore into a disposable database.
2. Complete a full schema comparison between production and the exact current `backend/schema.sql` / migration sequence. The present evidence establishes several concrete gaps but is not a complete drift report.
3. Reconcile and safely stage the missing BSEC-029 audit columns, indexes, function and append-only triggers, plus the school-events migration. Do not execute against production until backup/restore evidence and the owner-approved OPS-05 adoption plan exist.
4. Define the correct adoption record for the existing database; do not infer the baseline from `app_bootstrap`.
5. Confirm a durable backup mechanism. The existing single reminder log row is not a backup artifact or restore rehearsal.

## Evidence limitations

- No table contents containing student or user data were exported.
- No credentials, connection strings or secrets were read.
- The full schema drift script was not run because it performs temporary DDL.
- This report does not claim that all differences between `schema.sql` and production have been found.
- No production schema changes or migrations were applied.
