# Backend Security Workstream — Closeout Snapshot (2026-11-16)

## Repository implementation status

**Repository implementation and CI verification are complete for the currently assigned BSEC-001 through BSEC-030 sequence and the five additional BSEC-031 endpoint-authorization findings.** This is an implementation closeout, not an independent third-party security certification and not proof of live production recoverability.

| Workstream | Result | Evidence |
|---|---|---|
| BSEC-001–025 | Merged | Individual checkpoint records under docs/backend-security/checkpoints |
| BSEC-026 | Merged reconciliation | Checkpoint reconciliation for BSEC-024/BSEC-025 |
| BSEC-027 distributed Redis rate limiting | Merged and verified | BSEC-027 checkpoint and PostgreSQL shared-quota workflow |
| BSEC-028 material upload/preview/download security | Merged and verified | PR #934 implementation; PR #939 fixture alignment; focused file-delivery workflow passed |
| BSEC-029 sensitive-action audit logging | Merged and verified | PR #944, merge commit 5b926ac6df8426b8236b3f9ea3719ee54675d338 |
| BSEC-030 encrypted backup/disaster recovery | Merged and verified | PR #945, merge commit 26206e84496002bdcaf124ec68e406c4cb4b95c6 |
| BSEC-031-01–05 additional administrator tenant-scope findings | Merged | Individual BSEC-031 checkpoint records |

## Latest verification evidence

### BSEC-029 — PR #944

All 14 workflows associated with the verified PR head passed, including:

- PostgreSQL audit hash-chain, redaction and append-only regressions.
- Administrator tenant isolation, student roster and parent/ward scope.
- Student login relationship and parent provisioning integrity.
- Attendance atomicity and teacher assignment integrity.
- Redis distributed rate limiting and API health checks.
- Backend fatal-process shutdown.
- SS1, SS23 and JSS3 integrity gates.

The JSS3 staging-admin test cleanup was updated to preserve append-only audit records and use per-test audit ID watermarks. Database immutability was not weakened to make tests pass.

### BSEC-030 — PR #945

All 5 workflows associated with the verified PR head passed:

- PostgreSQL backup/restore safeguards and backend TypeScript check.
- SS1 package integrity.
- SS23 package integrity.
- Backend fatal-process shutdown.
- JSS3 implementation and asset checks.

The PostgreSQL backup/restore suite covers wrong-key and tampered-file rejection, malformed and partial payload refusal, schema drift, migration-ledger preservation, exact target confirmation, audit-log restore, trigger reactivation, mid-restore rollback, scheduled failure logging and retry backoff.

## Controls now present in the repository

- Database-authoritative authentication and role/school/class claims.
- School/term/subject/parent/ward authorization boundaries across the assigned API surfaces.
- Transactional/concurrency-safe account provisioning, student relationships, score/attendance operations and selected academic workflows.
- Distributed Redis-backed request limiting and account-level abuse controls.
- Secure material URL validation, asset ingestion, preview and download.
- Strict sensitive-action audit writes, per-school SHA-256 hash chains, redaction, integrity verification and append-only database triggers.
- AES-256-GCM authenticated database backups, scheduled attempts with advisory locking and observable failures, dry-run/confirmed restore, schema preflight and transactional rollback.
- Dedicated PostgreSQL regression workflows and curriculum integrity gates.

## Production operational sign-off still required

CI uses disposable PostgreSQL databases and synthetic identities. It does not prove that the production Render environment has the correct secrets, that SMTP delivery succeeds, that a real backup is retained off-host, or that an operator can recover the live service. Before describing the live system as disaster-recovery certified, an authorized operator must complete and record these checks:

1. Confirm the production secret manager contains a high-entropy BACKUP_PASSPHRASE of at least 16 characters. Keep its recovery copy in a separate password manager/secrets vault.
2. Confirm ADMIN_LOG_RECIPIENTS and SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS point to monitored, access-controlled backup recipients.
3. Confirm a real scheduled backup produces backup_log status emailed with emailed=true. A failed or not_emailed result is not a successful off-host backup.
4. If the encrypted file exceeds 17 MiB, use the documented manual export and place the encrypted file in the approved off-host vault. The scheduler intentionally does not count an unemailed oversized file as a successful backup.
5. Apply the 8-week and 12-month retention policy in the mailbox or off-host vault; verify that the passphrase is stored separately.
6. Perform an operator-led restore drill into a disposable recovery database using the documented dry-run and exact --confirm-database procedure. Verify row counts, application smoke tests and GET /admin/audit-log/integrity. Record the drill evidence and remove the disposable database.

Runbook: docs/operations/BACKUP_AND_DISASTER_RECOVERY.md

## Production safety boundary

No production database, production secrets, live backup file or deployment was accessed or modified during this implementation. Do not mark production disaster recovery as verified until the operational sign-off above is recorded. The repository code and CI gates are merged; the remaining work is environment-specific operational validation.
