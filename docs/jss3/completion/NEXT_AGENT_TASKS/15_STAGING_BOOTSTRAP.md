# STAGING-BOOTSTRAP — implement the missing first-admin setup

Read EXECUTION_CONTRACT.md. This is code/test implementation, not permission to provision a cloud host or change production. Read STAGE1/REPORT.md and RUNBOOK.md for the actual missing capability. Do not repeat the manifest audit, source inventory or environment questionnaire.

## Inputs already in repo
backend/schema.sql; backend/src/db/bootstrap.ts, pool.ts, seed.ts; backend/src/routes/auth.ts and admin user routes (discover exact filenames); backend/package.json; .github/workflows/jss3-assets.yml; tests/topic-assets.db.test.mts for disposable DB setup conventions.
No private source ZIP is required for the first-admin CLI. Disposable PostgreSQL16 is required for integration tests (CI service is available if local PostgreSQL is unavailable).

## Implement
1. Add a dedicated staging-only first-admin CLI; do not reuse db:seed or its fixed passwords. Default dry-run. Require an explicit staging acknowledgement and exact database-name confirmation for writes. Validate the connected current_database() against confirmation and restrict this helper to newly designated staging/test database names. Never allow existing production by merely passing a flag.
2. Read password from a named environment variable, never argv/logs; reject missing/weak input under current auth policy, store bcrypt hash using existing library. Validate username and school against schema/current auth. No hard-coded secret, email sending or external account side effect.
3. In one transaction, serialize the first-admin operation and refuse if any admin/user state indicates an already provisioned target. Do not overwrite accounts, reset passwords or silently grant roles. Validate school exists. Roll back on every failed guard. No unguarded generic SQL recipe.
4. Add focused real-PostgreSQL tests: dry-run no writes; valid initial admin/login-compatible hash; wrong DB confirmation; missing acknowledgement; missing/invalid password; existing admin/user; missing school; repeat refusal; rollback and cleanup. Guard tests against remote/non-disposable databases. Add test to existing PostgreSQL CI serially.
5. Provide exact PowerShell and bash command groups with placeholders explicitly identified and secure environment input; no guessed API flags. Update STAGE1 runbook account step to this supported CLI. Keep target designation/actual execution/device observation outstanding until performed.

## Done
Code + CLI/package entry + regression tests + CI + updated runbook + concise handoff. Submit passing PR; no worker merge. Do not stop to ask whether to implement the helper: implementation/testing is authorised here. No actual staging or production provisioning is authorised by this task.
