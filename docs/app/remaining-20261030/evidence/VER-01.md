# VER-01 — Repeatable root test and typecheck commands

Task ID: VER-01
Status: PARTIAL IMPLEMENTATION — awaiting CI/review and full static-suite inventory
Branch: `agent/verify-01-rebased-20261113`

## Added root scripts
- `typecheck`: existing backend and mobile TypeScript projects with `tsc --noEmit`.
- `test:static`: the explicit non-database `.cjs` and `.mts` list currently exercised by CI. This is a repeatable CI baseline, not yet proof that every non-database test file in the repository is included.
- `test:db`: database-backed root `.db.test.mts` suites; requires the local disposable PostgreSQL env vars documented in `scripts/dev/README.md`.
- `test:ss1`: SS1 package and bookkeeping assessment suites.
- `test`: `test:static` followed by `test:ss1`; no database or cloud service required.

## Changed files
- `package.json`
- `scripts/dev/README.md` (new)
- This evidence file.

## Verification
- Static inspection confirms the explicit `.mts` paths in `test:static` are named in the current CI workflow; the SS1 paths are the existing four package/assessment test files. A full repository inventory of non-DB `.mts` tests remains outstanding.
- The commands have not been run locally. CI typecheck and the existing CI suites continue to run independently.
- Database suites retain their local-host guards; `test:db` is not part of `npm test`.

## Remaining
- CI review of the package script changes.
- VER-02 remains separate: derive and add a workflow_dispatch-only job for root tests missing from the normal CI job. Do not treat the current `test:static` list as the complete inventory. Do not claim that task is complete here.

## Exact next action
Run the PR's existing CI/typecheck workflow, confirm package.json is valid, and merge only after checks pass.
