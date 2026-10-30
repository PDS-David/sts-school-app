# CUR-04 — Add a static SS1 package validator

Status: READY · Depends: none · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: `scripts/ss1/validate_packages.ts` (new), `package.json` (one script entry), `docs/app/remaining-20261030/evidence/CUR-04.md`

## Why

The compiler already enforces many invariants, but only when a package is compiled through `loader.ts` during an importer run or through the three deferred `tests/ss1/*.package.test.mts` files. There is no read-only way to check all 21 packages before a PR. That is why authoring checks in the manual were run ad hoc ("basic authoring checks found no duplicate IDs, body-hash or marking-sum errors in 60 SS1 supplements").

Relevant checks already written, which a validator should reuse rather than re-implement:

- `backend/src/db/ss1/compiler.ts`: `unique()` duplicate-ID guard (line 13), body-hash comparison (line 99), practice mark-total comparison (line 101), delivery-correction identity (line 135).
- `backend/src/db/ss1/subjectPackageSchema.ts`: strict zod schema for every object, including `state`, `provenance` and `coverage`.
- Cross-package rules the compiler cannot see: duplicate coverage/lesson IDs across packages, coverage `lesson_ids` pointing at a lesson that exists, `MARKER` entries naming a marker rule, and `open_items.affected_ids` resolving.

## Do

1. Write `scripts/ss1/validate_packages.ts`:
   - Input: `--dir backend/src/db/ss1/subjects` (default) and optional `--subject <slug>`.
   - Parse every `*.json` with the exported zod schema and report the first error path per package.
   - Recompute each `body_sha256` and each asset `sha256`/`bytes` from the bytes on disk; report mismatches.
   - Check duplicate IDs within and across packages, practice marking sums, `lesson_ids` resolution, `MARKER` → marker-rule resolution, and that every `coverage.source_id` exists in `sources`.
   - Read-only: never touch PostgreSQL, never import `loader.ts`, never write package files.
   - Output: human summary plus `--json` mode. Exit code 1 on findings, 0 when clean.
2. Add one script to root `package.json`: `"ss1:validate": "node --import tsx scripts/ss1/validate_packages.ts"`. Do not add or change any other script.
3. Run it once against the current tree (pure file reads, no database) and record the exact summary in the evidence note — including failures you did not fix. Do not fix curriculum content in this task.
4. Open the PR. Do not merge.

## Acceptance (static)

- The validator compiles as TypeScript by inspection and imports only existing modules already used by `scripts/ss1/build_subject_packages.py`'s node step (`tsx`, zod, Node built-ins).
- Running it on unchanged packages reports the same set of findings recorded in the note, and never mutates a file.
- No test, typecheck, importer or database run is claimed.

## Do not

- Extend the compiler's behaviour or change the schema in this task; report the gap instead.
- Make the validator "fix" packages or auto-format JSON.
- Treat a clean validator run as approval, verification or curriculum completeness.
