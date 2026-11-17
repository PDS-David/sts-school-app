# Render PostgreSQL backup and restore procedure

## Current target

- Render database: `sts_school_db_2`
- PostgreSQL major version: 18
- Render Free Postgres expires 30 days after creation and has no Render-managed backups or PITR.
- The GitHub Actions workflow `.github/workflows/render-postgres-backup.yml` creates an encrypted custom-format dump daily at 02:20 UTC and on manual dispatch.
- Encrypted GitHub artifacts are retained for 90 days. This is an immediate recovery bridge, not a substitute for long-term off-site object storage.

## Required GitHub repository secrets

Set these under **Settings → Secrets and variables → Actions → Repository secrets**:

1. `RENDER_POSTGRES_EXTERNAL_URL`: the database's **External** connection URL, with `sslmode=require`. Never put the URL in source control or a workflow input.
2. `BACKUP_AGE_RECIPIENT`: an age public recipient (starts with `age1`). Keep the corresponding private identity offline and outside GitHub.

Generate an age identity on a trusted workstation:

```sh
age-keygen -o backup-identity.txt
```

Store the displayed public recipient in `BACKUP_AGE_RECIPIENT`. Keep `backup-identity.txt` in a secure offline location. Do not commit it or upload it to the repository.

## Run and verify

1. Add both repository secrets.
2. Open **Actions → Render PostgreSQL encrypted backup → Run workflow** on `master`.
3. Confirm the run succeeds and produces one `.dump.age`, its SHA-256 file and a manifest.
4. Download the artifact and verify it locally:

```sh
sha256sum --check sts-school-db-*.dump.age.sha256
age --decrypt --identity backup-identity.txt --output restored.dump sts-school-db-*.dump.age
pg_restore --list restored.dump
```

5. Perform a restore rehearsal into a new, isolated PostgreSQL 18 database. Never restore over production as a test:

```sh
createdb --host <isolated-host> --username <restore-user> ss_restore_test
pg_restore --no-owner --no-acl --dbname <isolated-restore-url> restored.dump
```

6. Verify expected schemas, tables, constraints, indexes and representative row counts. Record the restore result and elapsed time.

## Limitations and next step

- GitHub artifact retention is 90 days; it is not permanent storage. Add an encrypted copy to a durable object-storage bucket (the project already uses Cloudflare R2) after the bucket name and backup credentials are confirmed.
- The current Render Free database has no automatic snapshots or PITR. Upgrade to a paid Postgres plan or migrate to a durable replacement before 2026-12-12 01:30:29 UTC.
- Do not remove the current database or run schema migrations until a backup has been downloaded and a restore rehearsal has passed.
- This workflow is intentionally read-only against production: it only runs `pg_dump` and a read-only version query.
