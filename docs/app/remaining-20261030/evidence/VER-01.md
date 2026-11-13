# VER-01 — Repeatable root test and typecheck commands

Task ID: VER-01
Status: IMPLEMENTED IN BRANCH — awaiting CI/review
Branch: `agent/verify-01-rebased-20261113`

## Added root scripts
- `typecheck`: existing backend and mobile TypeScript projects with `tsc --noEmit`.
- `test:static`: the explicit non-database `.cjs` and `.mts` list already exercised by CI.
- `test:db`: database-backed root `.db.test.mts` suites; requires the local disposable PostgreSQL env vars documented in `scripts/dev/README.md`.
- `test:ss1`: SS1 package and bookkeeping assessment suites.
- `test`: `test:static` followed by `test:ss1`; no database or cloud service required.

## Changed files
- `package.json`
- `scripts/dev/README.md` (new)
- This evidence file.

## Verification
- Static inspection confirms every explicit `.mts` path in `test:static` is already named in the current CI workflow; the SS1 files are the existing four package/assessment test files.
- The commands have not been run locally. CI typecheck and the existing CI suites continue to run independently.
- Database suites retain their local-host guards; `test:db` is not part of `npm test`.

## Remaining
- CI review of the package script changes.
- VER-02 remains separate: add a workflow_dispatch-only job for the root tests missing from the normal CI job. Do not claim that task is complete here.

## Exact next action
Run the PR's existing CI/typecheck workflow, confirm package.json is valid, and merge only after checks pass.
