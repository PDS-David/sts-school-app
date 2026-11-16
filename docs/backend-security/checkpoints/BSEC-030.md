# Checkpoint — BSEC-030

- **Task ID:** BSEC-030
- **Title:** Verify encrypted backup and disaster-recovery procedures
- **Status:** reserved for the assigned task; implementation and operational verification not yet complete
- **Assignment:** harden and verify database backup creation, retention, restore safety and disaster-recovery evidence.
- **Scope:** inspect `backend/src/utils/backup.ts`, `backend/src/db/exportBackup.ts`, `backend/src/db/restoreBackup.ts`, backup scheduler, admin backup routes, configuration and CI tests.
- **Constraints:** never access or mutate production data during tests; use disposable PostgreSQL databases and synthetic data; never expose backup passphrases or production secrets; do not claim recoverability without an actual restore test.
- **Acceptance:** encrypted backup integrity and authentication validated; malformed, partial, wrong-key and wrong-schema backups rejected before destructive writes; restore is transactionally all-or-nothing and requires explicit target database confirmation; scheduled backup failure is observable; documented off-host retention and recovery steps are actionable.
- **Next action:** audit current backup/export/restore implementation and existing tests, identify gaps, then add isolated PostgreSQL integration coverage and a repeatable restore drill.
- **Related work:** earlier student-roster authorization changes are preserved in BSEC-031-05.
- **Reclassification:** The previous checkpoint content described school-bound administrator student-roster and student-account mutation isolation. It has been preserved as `BSEC-031-05.md` and merged through PR #915.
- **Replacement record:** docs/backend-security/checkpoints/BSEC-031-05.md
