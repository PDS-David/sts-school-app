# Checkpoint — BSEC-028

- **Task ID:** BSEC-028
- **Title:** Enforce school-bound administrator scope on user and account management
- **Status:** implementation committed; focused CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 32d4d1677e4cd236f05bcb2c4fb4a86022dfaed8
- **Working branch:** agent/backend-admin-user-school-scope-20261116
- **Changed files:**
  - backend/src/routes/admin.ts
  - tests/backend-admin-user-school-scope.integration.test.mts
  - .github/workflows/backend-admin-user-school-scope.yml
  - docs/backend-security/checkpoints/BSEC-028.md
- **Defect:** school-bound administrators could use the admin router's user-directory and account-management endpoints without tenant enforcement. They could enumerate users and parent/student login records across schools, create accounts in another school, create global finance-admin accounts, move accounts across schools, reset passwords, reissue activation codes, approve or delete users outside their school.
- **Implementation:** add a shared admin school-scope resolver. School-bound admins are pinned to their authenticated school; conflicting school filters are rejected. Global administrators retain cross-school behavior. Scope user-directory reads, account creation, activation-code reissue, account updates, password resets, approvals and deletions. School-bound admins cannot create or promote an account to global finance_admin. Reissue/update/reset/approve/delete SQL predicates retain the school condition at write time to prevent race-based scope changes.
- **Regression coverage added:** PostgreSQL HTTP tests cover user, unlinked-student, parent-login and student-without-login reads; cross-school filters; own-school account creation; denial of finance-admin creation; activation-code reissue; account update and role escalation; password reset; approval; deletion; and preserved global-admin directory access.
- **Verification:** source, test and workflow files fetched back from the dedicated branch and reviewed. A PostgreSQL 16 integration workflow and backend TypeScript check are configured to run on branch pushes and PRs. No local test pass is claimed. No production database or data was accessed or changed.
- **Remaining:** inspect the branch-push workflow result; resolve genuine test/typecheck failures without weakening assertions; open a focused PR; verify current-head CI and repository-wide checks.
- **Exact next action:** inspect the PostgreSQL admin account-scope workflow for this branch head.
