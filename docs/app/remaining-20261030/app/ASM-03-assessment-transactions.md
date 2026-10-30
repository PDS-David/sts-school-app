# ASM-03 — Make assessment writes atomic

Status: READY · Depends: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/learning.ts`, `docs/app/remaining-20261030/evidence/ASM-03.md`

## Why (verified at master `8ffcd12`)

`withTransaction` already exists (`backend/src/db/pool.ts:19-33`) and is used by seed and the db scripts, but **no route uses it** — every route calls bare `query()`.

Three assessment paths are multi-statement and can leave partial state:

1. `POST /learning/assessments` (`learning.ts:861-894`): assessment INSERT (`876-882`) then a loop inserting `assessment_questions` (`886-893`). A failure mid-loop leaves an assessment with missing questions and the wrong total.
2. `POST /topics/:id/complete` generation (`413`, inserts at `552-575`): question INSERTs, assessment INSERT, then link rows; the link uses a compare-and-set (`578-580`) but the earlier inserts do not.
3. `POST /assessments/:id/submit` (`1009-1182`): submission INSERT (`1081-1087`), per-answer INSERTs (`1102-1150`), submission total UPDATE (`1153-1157`), and the `topic_completions` upsert (`1167-1179`). A crash after the submission row but before answers leaves a submission that can never be resubmitted (409) and has no marks.

The manual records "generated assessment construction, grading and invoicing are not uniformly one transaction" as a limitation to resolve under an approved scope.

## Do

1. Wrap each of the three paths in `withTransaction`.
2. Keep AI calls **outside** the transaction. In submit, grade essays first (network-bound), collect the results in memory, then open one transaction for: submission insert, answer inserts, total/fully_graded update, and the completion upsert. Do not hold a pool client open across a Gemini call.
3. Refactor the small helpers that currently call the module-level `query` to accept a query function (or a `pg.PoolClient`) so the same SQL runs inside the transaction. Keep signatures minimal; do not introduce a query-builder.
4. On conflict in submit: throw a typed error inside the transaction and translate it to the existing 409 outside, so the rollback does not leak a generic 500.
5. Keep the compare-and-set link for `generated_assessment_id`; inside a transaction it remains correct.
6. Evidence note: list every statement now inside each transaction, and the exact point where AI calls happen relative to BEGIN.

## Acceptance (static)

- No `await query(...)` inside the three paths that bypasses the transaction client, except the pre-BEGIN reads used to validate scope.
- A failure at any statement after the first insert rolls back all of that path's writes.
- Response shapes and status codes are unchanged for success and for duplicate submission.
- No change to marking arithmetic, prompts, permissions or schema.

## Do not

- Add transactions to unrelated routes (that is a separate audit).
- Change isolation levels or add retry loops.
- Hold a transaction across `generateJSON`, push or any other network call.
