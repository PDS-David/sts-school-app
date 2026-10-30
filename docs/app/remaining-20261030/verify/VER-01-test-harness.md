# VER-01 — Add repeatable test and typecheck scripts

Status: READY · Depends: none · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: `package.json` (root scripts only), `scripts/dev/README.md` (new, short), `docs/app/remaining-20261030/evidence/VER-01.md`

## Why

There are 55 root JS/TS test files, 3 SS1 package tests and 7 Python tooling tests, and **no** `test`, `typecheck` or `lint` script in the root, `backend/` or `mobile/` `package.json` (verified at `8ffcd12`). Tests are invoked ad hoc with different commands:

- `node --test tests/*.cjs` for the static suites,
- `node --import tsx --test <file>` for most `.mts` suites,
- `python3 -m unittest ...` for the JSS3 tooling tests,
- a separate list of DB suites that require `*_TEST_DATABASE_URL` variables and refuse non-local hosts.

Because the commands are undocumented in one place, CI runs a subset and 17 root tests are never executed by the workflow. The manual's claim that authoring checks were run by hand is a symptom of the same gap.

## Do

1. Add these scripts to the **root** `package.json` (do not touch backend/mobile scripts):
   - `typecheck` — `tsc --noEmit -p backend/tsconfig.json && tsc --noEmit -p mobile/tsconfig.json`.
   - `test:static` — the exact `node --test` list that does not require a database (derive it by reading each file's header; the DB suites all gate on an env var).
   - `test:db` — the DB suites, documented as requiring a local disposable PostgreSQL and the env vars each file names.
   - `test:ss1` — `node --import tsx --test tests/ss1/*.package.test.mts` with the SS1 plan env var noted as required.
   - `test` — `npm run test:static && npm run test:ss1` (what CI should be able to run without a database).
2. Do not invent a new runner, glob dependency or test framework. Use the existing commands and `node:test`.
3. `scripts/dev/README.md`: one page — prerequisites (`npm ci`), which scripts need a database, how to set each env var, and the fact that verification is currently deferred by the owner.
4. **Do not run any of the new scripts.** They are added for the owner to use when testing resumes. Static correctness only: each path must exist.
5. Evidence note: the script → file list mapping, and the names of the 17 files not currently in CI (derive by comparing the workflow's `--test` list with `tests/*`).

## Acceptance (static)

- `npm test` is defined and references only files that exist.
- No script downloads, starts a server, or requires a cloud database.
- `typecheck` uses the two existing tsconfig files.
- Backend/mobile package scripts are unchanged.

## Do not

- Run `npm test`, `tsc`, or any suite.
- Add Jest, Vitest, Playwright or a coverage service.
- Weaken or delete a DB-suite guard that refuses non-local hosts.
