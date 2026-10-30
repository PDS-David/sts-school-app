# ASM-03 evidence — make assessment writes atomic

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `f5a0aef` (includes ASM-04 / PR #279, SEC-02 and SEC-04). Prompt line numbers were written against `8ffcd12`; citations below are at `f5a0aef`.
Only file changed in code: `backend/src/routes/learning.ts`. No schema, permission, prompt or marking-arithmetic change.

## Old behaviour (base `f5a0aef`)

- `withTransaction` exists (`backend/src/db/pool.ts:19-33`); the only caller in `backend/src` is `db/seed.ts:89`. No route used it.
- `POST /assessments` (`learning.ts:861-895`): assessment INSERT (876-882), then a question-link loop (886-893) on bare `query()`.
- `POST /topics/:id/complete` generation (`learning.ts:539-589`): question INSERTs (553-561), assessment INSERT (563-569), link INSERTs (571-576), compare-and-set link (579) and loser close (583) all on bare `query()`.
- `POST /assessments/:id/submit` (`learning.ts:1024-1201`): submission INSERT (1096-1102), MCQ/essay answer INSERTs (1118-1168, with the essay INSERT inside the same `try` as the model call), submission UPDATE (1172-1175), `topic_completions` upsert (1186-1197), each a separate autocommit statement. Essay model calls ran while the submission row already existed.

## New behaviour

### 1. `POST /assessments` — one transaction
Inside `withTransaction`: (1) INSERT `assessments`, (2) INSERT `assessment_questions` per question (loop, `ON CONFLICT DO NOTHING` kept). No AI call. Pre-BEGIN: `checkTeacherContentScope` only. Response `201 { assessment }` unchanged.

### 2. `POST /topics/:id/complete` assessment generation — one transaction
- **AI call position:** `generateJSON('generate-questions')` completes **before** `BEGIN`. The transaction contains only DB statements.
- Inside `withTransaction`, in order: (1) INSERT `questions` per draft, (2) INSERT `assessments` (`status='open'`), (3) INSERT `assessment_questions` per question, (4) `UPDATE topics SET generated_assessment_id … WHERE generated_assessment_id IS NULL` (compare-and-set kept), then if it matched nothing: (5) `UPDATE assessments SET status='closed'`, (6) SELECT the winner's status.
- Any throw rolls back all of it and falls into the existing `catch`, so `assessment_status` is `null` exactly as before; the response shape is unchanged.
- Left outside the transaction on purpose (earlier steps, not in the prompt's list): the `topic_completions` completion marker (`:470`) and the summary cache write (`:498`).

### 3. `POST /assessments/:id/submit` — one transaction
- **Pre-BEGIN reads (scope/validation, unchanged):** student lookup, assessment status/window/scope, `assessmentDeliverable`, question load, MCQ auto-score, plus a new early duplicate check (see below).
- **AI call position:** every essay is graded by `generateJSON('essay-mark')` **before** `BEGIN`, collected in memory as `{status, awarded, feedback}`. A failed call becomes `ai_unavailable`, a blank essay becomes `auto` with 0 and no AI call, as before. Only the model call/parsing is inside the `try` now; the INSERT is no longer in it.
- Inside `withTransaction`, in order: (1) INSERT `submissions … ON CONFLICT DO NOTHING RETURNING *` (no row → `throw new AlreadySubmittedError()`), (2) INSERT MCQ `submission_answers`, (3) INSERT essay `submission_answers` (`auto` / `ai_graded` / `ai_unavailable`, same column sets as before, same order: MCQ rows then essay rows), (4) UPDATE `submissions` total and `fully_graded` (via `reviewBacklog`), (5) SELECT topic by `generated_assessment_id`, (6) upsert `topic_completions`.
- `AlreadySubmittedError` is caught outside the transaction and returned as the existing `409 { error: 'Assessment already submitted; previous results are preserved' }`; other errors are rethrown unchanged.
- Success response `{ submission, auto_score }` unchanged.

## Deliberate addition: early duplicate check

Because essays are now graded before the submission row exists, a repeat submit would spend model calls before the 409. A single pre-BEGIN `SELECT 1 FROM submissions WHERE assessment_id=$1 AND student_id=$2` returns the same 409 first. The in-transaction `ON CONFLICT` remains authoritative for two concurrent first submissions (both may grade once; one gets the 409). This is the only new statement.

## Behavioural differences to be aware of

- A crash or error after the old submission INSERT could leave a submission with no answers that returned 409 forever. Now nothing is committed on failure, so the student can resubmit.
- The old code could leave orphan `questions` rows or an assessment missing links if generation failed part-way. Now none are committed.
- Two concurrent topic completions: the second `UPDATE topics` waits for the first transaction's row lock, then re-checks `generated_assessment_id IS NULL` (READ COMMITTED) and loses. This is reasoning from Postgres semantics, not observed.

## Acceptance (static)

- Bare `await query(` remaining in these three handlers are pre-BEGIN reads (student/topic/lock/pin/assessment/question/duplicate lookups) plus the two unlisted earlier writes above. Checked by grep on the working tree.
- Response shapes and status codes for success and duplicate submission are unchanged.
- No isolation-level change, no retry loop, no transaction across `generateJSON`, push or any network call.

## Deliberately not changed

Other routes (separate audit), marking arithmetic, prompts, permissions, schema, `reviewBacklog` semantics from ASM-04, `retireStaleJss3Cache`/`assessmentDeliverable` (still take the module-level `query`, pre-BEGIN).

## Not done / not verified

No tests, typechecks, DB, migrations, device or deploy were run (testing deferred by owner). The TypeScript has not been compiled; the re-indented blocks and the `withTransaction` generic return types are unchecked by a compiler. Rollback and 409 behaviour were not exercised.
