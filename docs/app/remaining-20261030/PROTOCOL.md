# Protocol for every task in this pack

This file is the shared contract. Each prompt adds its own scope; where the two differ, the prompt wins only for scope, never for these safety rules.

## Base and branch

1. `git fetch origin master` and record the exact SHA you start from. Every prompt's line numbers were verified on master `8ffcd12` (2026-10-30); if files moved, re-locate the cited code before editing.
2. Branch name: `app/<task-id>` (e.g. `app/sec-01-report-scope`), created from `origin/master`. One task, one branch, one PR.
3. Open the PR **against `master`**. Never merge, never force-push, never rebase a branch someone else is reviewing.
4. Different task IDs may run concurrently only when their write sets are disjoint — see the collision table in `README.md`. `backend/src/routes/learning.ts` and `backend/schema.sql` are single-writer files.

## Writes

- Only the files listed in the prompt's **Writes** line, plus `docs/app/remaining-20261030/evidence/<TASK-ID>.md`.
- Do not edit another task's evidence note, the SS1 queues/packages, `docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md`, or any shared index. Those belong to their own tasks and to the integrator.
- No source documents, source extracts, private renders, student data, credentials or tokens in Git.
- Schema changes: append to `backend/schema.sql` in the file's existing style (`CREATE TABLE IF NOT EXISTS`, and `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for anything added to an existing table). After `OPS-01` lands, also add the numbered migration file that task defines. Never run SQL.

## Testing is deferred

The owner defers testing. In every task:

- Do **not** run tests, typechecks, the importer, compiler/plan runs, migrations, database or device checks, imports, seeds or deployments.
- You may read files, run `git`, and run pure JSON/text inspection of files you wrote (no database, no network).
- Record the outcome honestly as `IMPLEMENTED_TESTING_DEFERRED` in the PR body and the evidence note: implemented, not approved, not verified.
- Never claim a feature works, a screen renders, or a migration applies.

## Evidence standard

- Every behavioural claim cites `path:line` at your base. A suspicion is not a finding.
- If the code contradicts the prompt's premise, stop and report the contradiction in the evidence note instead of "fixing" non-existent code. The prompt's `Why` is evidence from a dated audit, not a licence to assume.
- If the task needs an owner decision the prompt does not supply, stop at the decision point and leave the branch as a draft PR marked `BLOCKED: owner decision`.

## Definition of done

1. The change is minimal and confined to the listed files.
2. `docs/app/remaining-20261030/evidence/<TASK-ID>.md` records: base SHA, what changed, the exact lines that prove the old behaviour, what was deliberately not changed, and `IMPLEMENTED_TESTING_DEFERRED`.
3. PR title: `<TASK-ID>: <short imperative>`. PR body contains: task, why, files, old behaviour with citations, new behaviour, "no tests/typechecks/DB/migrations/deploy run — testing deferred by owner", and "do not merge without owner review".
4. The branch is pushed; nothing is merged.

## Escalation

Stop and report instead of guessing when the task would require: a policy choice (retake limits, who may see AI marks, data retention), a production credential, a live database, a licence decision, or deleting/rewriting existing curriculum content.
