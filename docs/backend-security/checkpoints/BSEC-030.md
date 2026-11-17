# Checkpoint — BSEC-030

- **Task ID:** BSEC-030
- **Title:** Verify encrypted backup and disaster-recovery procedures
- **Status:** merged; implementation and verification complete
- **Working branch:** agent/backend-backup-dr-bsec030-20261116
- **Pull request:** #945 (merged)
- **Merge commit:** 26206e84496002bdcaf124ec68e406c4cb4b95c6
- **Verified head:** 6514505ed7aea138ac35df68817f10951ff9b53e
- **Scope:** encrypted backup creation, scheduled attempts, failure visibility, retention, restore preflight, all-or-nothing restore and recovery drill documentation.
- **Encryption:** AES-256-GCM authenticated encryption with scrypt-derived key; wrong passphrase and modified ciphertext are rejected. The backup CLI writes encrypted files only.
- **Scheduling:** the API scheduler attempts a backup when the last successfully emailed backup is at least seven days old. A session advisory lock prevents duplicate scheduled attempts across instances. Failed or non-delivered attempts are recorded in backup_log and retried no more than once per 24 hours; weekly reminder delivery remains independent.
- **Off-host delivery:** encrypted attachments are emailed to ADMIN_LOG_RECIPIENTS when at or below the 17 MiB attachment limit. Missing recipients, SMTP failure and oversized attachments are not reported as successful backups. Larger files require the documented manual encrypted export to an approved off-host vault.
- **Restore safety:** dry-run is default; apply requires the exact connected database name. Payload shape, row widths, missing/extra tables and schema/column metadata are validated before TRUNCATE. Tables restore in FK order and sequences are reset inside one transaction.
- **Audit-log compatibility:** the append-only audit log is restored as part of the snapshot. Only its TRUNCATE trigger is temporarily disabled inside the confirmed restore transaction, then its original enabled mode is restored before COMMIT. UPDATE/DELETE protection remains active; rollback restores both data and trigger state.
- **Regression coverage:** wrong-key/tampered-file checks, malformed/partial/wrong-schema refusal, migration-ledger preservation, audit-chain restore and trigger reactivation, mid-restore rollback, scheduled failure logging and 24-hour retry backoff.
- **Operational runbook:** docs/operations/BACKUP_AND_DISASTER_RECOVERY.md defines the 8-week/12-month retention policy, separate passphrase storage, email/manual-export limitations, PowerShell export/restore commands and quarterly disposable-database restore drills.
- **CI:** all 5 workflows associated with the verified PR head passed: PostgreSQL backup/restore safeguards, SS1 package integrity, SS23 package integrity, backend fatal-shutdown regression/typecheck and JSS3 implementation/asset checks.
- **Production safety:** all verification uses disposable PostgreSQL and synthetic data. No production database, production passphrase, backup or deployment has been accessed or changed.
- **Remaining:** no outstanding BSEC-030 implementation or verification blockers. The documented off-host retention policy requires the designated operators to retain email/vault copies and store passphrases separately; this is an operational responsibility, not an automated deletion policy.
