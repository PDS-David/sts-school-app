# OPS-05 — Drift, backup and restore — runbook (execution gated)

Status: BLOCKED (owner credentials and approval) · Depends: OPS-01 for any schema change · Base: `origin/master` (record the SHA)
Writes: `docs/app/remaining-20261030/evidence/OPS-05.md` only

## Why

`APP_WIDE_AUDIT.md` Part 0 is marked closed on code evidence, but the production drift check that motivated it was never observed running against the real database: the two attempts failed on host syntax and PowerShell quoting, not on the tool. `TODO.md` still carries the handoff line "blocked on a real production drift-check result" and records that nothing auto-runs `db:migrate` on deploy.

`backend/src/db/checkDrift.ts` is safe by design (applies `schema.sql` into a throwaway schema and diffs `information_schema`), but "safe by design" is not evidence. No backup/restore rehearsal has been recorded, and `migrate.ts` currently replays the whole schema.

## Do

1. Write a runbook section in the evidence file covering, in order:
   - **Target**: which database (host class, not credentials), who holds the external URL, how the connection is confirmed without printing it.
   - **Drift**: `npm run db:check-drift` against the external connection string; what a clean and a dirty result look like; where the output is stored (private, never committed); what to do with each class of difference (missing column, extra column, type mismatch, missing index).
   - **Pre-migration backup**: provider-native snapshot or `pg_dump` with a checksum; where the artifact lives; how restore is verified on a disposable database.
   - **Migration rehearsal**: apply pending migrations to a disposable copy first; compare drift after; only then the target, in a paused window.
   - **Rollback**: what is possible for each change class (additive column vs data rewrite); the decision rule that a destructive change needs a forward fix, not a down-migration.
   - **Evidence to retain**: command, timestamp, target identifier, checksum, operator, output hash.
2. Do not run any of it. The file is a plan, not a result. Mark every step `NOT RUN`.
3. Do not include a connection string, hostname with credentials, or screenshot content.

## Acceptance (static)

- The runbook can be followed by a non-author of the code without reading `checkDrift.ts`.
- Every command is copy-pasteable and marked as not run.
- The restore rehearsal is described on a disposable database, never production.
- The document names the owner as the only approver.

## Do not

- Contact any database or provider.
- Mark Part 0 "verified" on the strength of this document.
- Store the drift output in the repository.
