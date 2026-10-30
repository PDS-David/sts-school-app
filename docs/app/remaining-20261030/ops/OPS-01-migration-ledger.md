# OPS-01 — Introduce a migration ledger

Status: READY · **Run before any other schema-changing task** · Depends: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/db/migrate.ts`, `backend/migrations/` (new directory), `package.json` (one script), `docs/app/remaining-20261030/evidence/OPS-01.md`

## Why (verified at master `8ffcd12`)

`backend/src/db/migrate.ts:8-15` reads `backend/schema.sql` and executes the whole file in one `pool.query(sql)`. There is no `migrations/` directory, no version table, and no bookkeeping insert anywhere in the schema. `schema.sql` is a live document that has been amended in place (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`), and `APP_WIDE_AUDIT.md` records a production incident traced to a column that existed in `schema.sql` but had never reached the database, because "nothing in this repo auto-runs `db:migrate` on deploy".

Fresh installs and existing databases therefore take the same path, with no record of which amendments a given database has seen.

## Do

1. Create `backend/migrations/` with numbered files: `0001_baseline.sql` (empty or a comment-only marker — do **not** dump the current schema into it), and leave `0002+` for later tasks. Document the naming rule in a header comment.
2. Add `schema_migrations(version TEXT PRIMARY KEY, name TEXT NOT NULL, checksum TEXT NOT NULL, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`.
3. Rewrite `migrate.ts`:
   - `--all` / default: create `schema_migrations` if absent, read `migrations/*.sql` in lexicographic order, compare checksums of already-applied files (mismatch = abort with a clear error), and apply each pending file inside one transaction (lock with `pg_advisory_lock` so two concurrent runs cannot interleave).
   - `--fresh`: keep today's behaviour (apply `schema.sql`) but **also** stamp `schema_migrations` with the baseline version, so a fresh install is not "pending 0001".
   - `--status`: print applied and pending versions; no writes.
   - Never rewrite an applied file; never auto-generate SQL from TypeScript.
4. Add `"db:migrate:status": "tsx src/db/migrate.ts --status"` to `backend/package.json` (keep the existing `db:migrate` script name working).
5. Update `backend/src/db/bootstrap.ts` only if it calls `migrate.ts` directly; do not change its empty-schema requirement.
6. Evidence note: the ledger rule, how a future schema change must be expressed (schema.sql for fresh installs **and** a numbered migration for existing ones), and the checksum-mismatch behaviour.

## Acceptance (static)

- A database at any applied version can be brought forward without re-running applied files.
- A fresh database gets the current schema and a baseline stamp.
- Concurrent runs are serialised.
- `schema.sql` remains the single source of truth for a fresh install; migrations are the incremental history.
- No SQL executed, no database contacted.

## Do not

- Add an ORM or a migration framework dependency.
- Move existing `ALTER` statements out of `schema.sql` (that would break fresh installs).
- Mark any existing production database as migrated — that requires the owner's drift evidence (`OPS-05`).
