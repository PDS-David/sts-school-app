# Checkpoint — BSEC-029

- **Task ID:** BSEC-029
- **Title:** Enforce school boundaries on admin operational records and restrict global operations
- **Status:** implementation committed; focused CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** agent/backend-admin-user-school-scope-20261116 (stacked on BSEC-028)
- **Working branch:** agent/backend-admin-operational-school-scope-final-20261116
- **Changed files:**
  - backend/src/routes/admin.ts
  - tests/backend-admin-user-school-scope.integration.test.mts (extended)
  - docs/backend-security/checkpoints/BSEC-029.md
- **Defect:** school-bound administrators could read all audit records, read/reissue term PINs for students in other schools, read/reissue class access codes for other schools, and export another school's workbook. They could also trigger global log-email delivery and full-database backup operations.
- **Implementation:** apply the shared admin school-scope resolver to audit-log, term-PIN reads, class-code reads/writes and Excel export. Pin term-PIN creation to a student in the authenticated school and hold a row lock through the upsert. Validate student UUIDs and term labels, validate class membership before class-code creation, and cap audit-log page size at 500. Restrict log-email, backup status and backup execution to global administrators only.
- **Regression coverage added:** PostgreSQL HTTP tests cover own-school class-code generation and reads, cross-school class-code denial, own-school term-PIN issue/read, cross-school term-PIN denial, audit-log isolation, export school override denial, and global-only backup/log-email restrictions. Global-admin cross-school operations are retained and tested.
- **Verification:** source and test files fetched back from the dedicated branch and reviewed. The BSEC-028 PostgreSQL 16 integration workflow is configured to run the extended test file and backend TypeScript check for this stacked PR. No local test pass is claimed. No production database or data was accessed or changed.
- **Remaining:** inspect the combined PostgreSQL integration workflow and backend typecheck; fix genuine failures without weakening assertions; update the checkpoint with actual CI evidence.
- **Exact next action:** open a stacked PR and verify the PostgreSQL admin operational-scope workflow.
