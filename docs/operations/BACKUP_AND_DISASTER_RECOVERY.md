# STS School App — Backup and Disaster-Recovery Runbook

## 1. What the application does

The backend creates an AES-256-GCM encrypted, gzip-compressed database snapshot. The format is an authenticated binary container (`.sts-backup`) containing the source database name, creation time, table/column metadata and row data. A wrong passphrase or any ciphertext modification is rejected before restore.

The API backup scheduler checks hourly (first check one minute after process start). When no successful emailed backup exists in the last seven days, it attempts a backup under a PostgreSQL session advisory lock so multiple API instances do not create concurrent scheduled copies. A failed or non-delivered attempt is recorded in `backup_log`; retries are limited to one attempt per 24 hours. The weekly reminder remains independent of the backup attempt.

The scheduled job emails an encrypted attachment to `ADMIN_LOG_RECIPIENTS` when the attachment is no larger than 17 MiB. The passphrase is never included in the attachment email. If recipients are not configured, SMTP delivery fails, or the attachment is too large, the backup is not counted as successfully off-host. The dashboard status and `backup_log` expose `failed` or `not_emailed`; large backups require the manual export procedure below.

## 2. Required secrets and off-host retention

Configure these values in the deployment secret manager (not in Git):

- `BACKUP_PASSPHRASE`: at least 16 characters; use a high-entropy random secret.
- `ADMIN_LOG_RECIPIENTS`: one or more monitored, access-controlled backup mailbox addresses, comma-separated.
- SMTP credentials: the existing `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` and `SMTP_PASS` settings.

Keep a recovery copy of `BACKUP_PASSPHRASE` in a password manager or secrets vault that is independent of the mailbox/object store containing the backup. Do not send the passphrase in the same email as the backup, commit it, paste it into an issue, or put it in a backup filename.

Retention policy for the designated off-host vault:

- Retain at least the latest 8 weekly backups.
- Retain at least 12 month-end backups.
- Retain one pre-release backup before any schema migration or high-risk deployment.
- Restrict access to named operators; require MFA; enable provider-side versioning/retention lock where available.
- Periodically verify that retained files can be decrypted with the separately stored passphrase. Do not overwrite the only known-good backup.

Email delivery is an off-host copy only while the mailbox retains the attachment. Apply the retention policy above to the mailbox or copy attachments into the approved encrypted object-storage vault. For backups larger than 17 MiB, run the export CLI from a trusted workstation and upload the encrypted file to the same off-host vault. The scheduler deliberately does not label an unemailed file as a successful backup.

## 3. Check backup status and failures

In the admin dashboard, inspect the backup status and most recent result. The backend records attempts in `backup_log` with status values such as `emailed`, `not_emailed` and `failed`.

For a database operator, inspect the latest attempts:

```sql
SELECT id, status, size_bytes, tables, row_count, emailed, detail, created_by, created_at
FROM backup_log
WHERE kind = 'backup'
ORDER BY id DESC
LIMIT 20;
```

A successful scheduled off-host copy has `status = 'emailed'` and `emailed = true`. A `failed` or `not_emailed` row is not a recoverable off-host backup. Correct the reported configuration/SMTP/recipient issue, then use **Back up now** or the export CLI. For a scheduler failure, also inspect the backend logs for the `[backup] scheduled backup failed` entry. The failure is persisted in `backup_log` before the scheduler catches it.

## 4. Create a manual encrypted export

Run this from a trusted workstation with network access to the intended source database. Load `DATABASE_URL` and `BACKUP_PASSPHRASE` from the approved secret manager into the process environment; do not type secret values into a command or shell history.

PowerShell example:

```powershell
npm run db:backup-export --workspace=backend -- --out "C:\SecureBackups\sts-backup-YYYY-MM-DD.sts-backup"
```

The output file is written with owner-only permissions where supported by the host. Verify the resulting file size and copy it to the approved off-host vault. Keep the passphrase separate. Do not use an unencrypted temporary folder or a shared school computer.

## 5. Restore procedure

**Default mode is a dry run.** Restore refuses malformed payloads, duplicate/invalid columns, row-width mismatches, missing target tables, extra target tables, and schema/column metadata drift before destructive writes. It orders tables by foreign-key dependencies and applies the replacement in one transaction. Sequence values are reset after data insertion. The target database must be explicitly confirmed by its exact connected database name.

1. Create or select a maintenance target database. Prefer a disposable recovery database for the first drill.
2. Bring the target schema to the backup's compatible application version. On a new empty target, bootstrap the schema; on an existing managed target, use the versioned migration runner. Do not replay `backend/schema.sql` over an existing production database.
3. Set `DATABASE_URL` to the intended target and load `BACKUP_PASSPHRASE` from the secret manager.
4. Run a dry run first:

```powershell
npm run db:backup-restore --workspace=backend -- --file "C:\SecureBackups\sts-backup-YYYY-MM-DD.sts-backup"
```

5. Review the reported target database and per-table row counts. Confirm that this is the intended target and that the backup is the selected recovery point.
6. Only after approval, run the destructive restore with the exact target database name:

```powershell
npm run db:backup-restore --workspace=backend -- --file "C:\SecureBackups\sts-backup-YYYY-MM-DD.sts-backup" --apply --confirm-database "<exact-current_database-name>"
```

7. Review the completion summary and application smoke tests. Verify audit history with the admin-only endpoint `GET /admin/audit-log/integrity`; a valid result must report `integrity.valid = true`.
8. Record the recovery point, target database, operator, start/end times, row-count summary and validation result in the operations log. Never copy a recovered database into production without the school's explicit change approval.

### Audit-log restore behavior

The audit log is append-only during normal application operation. During an explicitly confirmed restore only, the restore transaction temporarily disables the audit log's TRUNCATE trigger, replaces the snapshot rows, and re-enables the trigger before COMMIT. It does not disable the row-level UPDATE/DELETE trigger. If any restore step fails, PostgreSQL rolls back both the table data and the trigger-state change. Regression tests verify that the restored hash chain is valid and that DELETE/TRUNCATE are rejected again after restore.

## 6. Recovery drill

Run a restore drill at least quarterly and before major schema changes:

- Use a disposable PostgreSQL database and synthetic/non-production data.
- Use a retained encrypted backup and the separately stored passphrase.
- Confirm wrong-passphrase/tampered-file rejection using the automated tests; do not test this against production.
- Complete dry run, then restore with the disposable database's exact name.
- Verify audit-chain integrity, key table counts, school boundaries, user login and read-only report/material access.
- Confirm that append-only audit triggers are enabled after the restore.
- Drop the disposable database after recording evidence.

The integration suite exercises wrong-key/tampered-file rejection, malformed and partial backup refusal, schema drift refusal, migration-ledger preservation, mid-restore rollback, audit-log restoration and trigger reactivation, and scheduled failure logging/retry backoff.

## 7. Operational limits

- The scheduled delivery mechanism uses email and has a 17 MiB attachment ceiling. A `not_emailed` result is not a successful backup.
- The scheduler retries failed/non-delivered attempts at most once every 24 hours; it does not hide the failure. The admin status, `backup_log` and backend logs must be monitored.
- The encrypted file and its passphrase are separate recovery dependencies. Losing either means the backup cannot be restored.
- A successful email send proves delivery to the configured SMTP service, not that the recipient mailbox retained the file or that an external vault is healthy. Retention and quarterly restore drills remain operational responsibilities.
