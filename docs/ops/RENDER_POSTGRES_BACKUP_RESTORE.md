# Render PostgreSQL backup and restore procedure

## Current target

- Render database: `sts_school_db_2`
- Source PostgreSQL major version: 18
- Render Free Postgres expires on 2026-12-12 01:30:29 UTC and has no Render-managed backups or PITR.
- The GitHub Actions workflow `.github/workflows/render-postgres-backup.yml` creates an encrypted custom-format dump daily at 02:20 UTC, on a workflow-file update to `master`, and on manual dispatch.
- Encrypted GitHub artifacts are retained for 90 days. This is an immediate recovery bridge, not a substitute for long-term off-site object storage.

## Required GitHub repository secrets

Set these under **Settings → Secrets and variables → Actions → Repository secrets**:

1. `RENDER_POSTGRES_EXTERNAL_URL`: the database's **External** connection URL, with `sslmode=require`. Never put the URL in source control or a workflow input.
2. `BACKUP_AGE_RECIPIENT`: an age public recipient (starts with `age1`). Keep the corresponding private identity offline and outside GitHub.

Generate an age identity on a trusted workstation:

```sh
age-keygen -o backup-identity.txt
```

Store the displayed public recipient in `BACKUP_AGE_RECIPIENT`. Keep `backup-identity.txt` in a secure offline location. Do not commit it or upload it to the repository. Losing the private identity makes every backup encrypted to its public recipient unrecoverable.

## Automated backup and restore verification

The workflow performs these steps against the production database:

1. Connects with TLS and creates a PostgreSQL 18 custom-format `pg_dump`.
2. Starts a disposable PostgreSQL 18 instance.
3. Creates an empty UTF-8 database from `template0`.
4. Runs `pg_restore --list` to inspect the archive.
5. Restores with native `pg_restore --verbose --exit-on-error --single-transaction --no-owner --no-privileges`.
6. Checks the restored database version, public-table count, migration count, student count, physical report-roster membership count and audit-event count.
7. Encrypts the dump with age, removes the plaintext dump from the runner workspace, computes SHA-256 and uploads the encrypted archive, checksum, manifest and restore-verification summary.

The disposable restore is isolated from production. A successful workflow run proves that the archive can be restored into a clean PostgreSQL 18 database; it does not prove that the recipient mailbox or an external vault has retained the artifact indefinitely.

## Run and verify

1. Open **Actions → Render PostgreSQL encrypted backup → Run workflow** on `master`, or wait for the daily schedule.
2. Confirm the run succeeds and produces one `.dump.age`, its SHA-256 file, a manifest and `restore-verification.txt`.
3. Download the artifact and verify it locally:

```sh
unzip sts-school-db-YYYYMMDDTHHMMSSZ.zip
sha256sum --check sts-school-db-*.dump.age.sha256
age --decrypt --identity backup-identity.txt --output restored.dump sts-school-db-*.dump.age
pg_restore --list restored.dump
```

4. For an independent local restore rehearsal, use a **new, empty** PostgreSQL 18 database. Do not reuse or overwrite an existing recovery database:

```sh
createdb --host localhost --port 5433 --username postgres \
  --template=template0 --encoding=UTF8 sts_backup_restore_local
pg_restore --list restored.dump
pg_restore --verbose --exit-on-error --single-transaction \
  --no-owner --no-privileges --host localhost --port 5433 \
  --username postgres --dbname sts_backup_restore_local restored.dump
```

5. Verify expected schemas, tables, constraints, indexes, migration ledger, audit history and representative row counts. Record the restore result and elapsed time.

## Retention and next step

- GitHub artifact retention is 90 days; it is not permanent storage. Download each required recovery point and copy it to the designated encrypted off-site vault. Keep the age private identity separate from the backup files.
- The project can use Cloudflare R2 for durable encrypted storage after the bucket name and credentials are confirmed. Do not invent or assume a bucket or credentials.
- Retain at least eight weekly backups and twelve month-end backups in the durable vault, plus a pre-release backup before schema migrations or high-risk deployments.
- Upgrade the Render Postgres plan or migrate to a durable replacement before 2026-12-12 01:30:29 UTC.
- Do not remove the current database or run production schema migrations until a fresh backup has been downloaded and a restore rehearsal has passed.
