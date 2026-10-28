# P1 — JSS3-only curriculum write boundary

Base: `origin/master` c1c21dbc17f6c87272d6644c07f63eff189d36a6 (28 Oct 2026). No `AGENTS.md` exists in the repository; no PRs were open at the time of inspection.

**Verification status: static inspection only.** Testing was deferred by the owner. No tests, type checks, importer commands, database connections or imports were run. Nothing below is a passing runtime result. Line numbers refer to the base commit.

## Reviewed write paths

| # | Path | Write(s) | Existing guard | Verdict |
|---|------|----------|----------------|---------|
| 1 | `db/ingestTopics.ts` generic import (1039–1206) | `INSERT INTO subjects … ON CONFLICT DO NOTHING`; `INSERT INTO topics … ON CONFLICT ON CONSTRAINT topics_ingestion_dedupe DO NOTHING` | Insert-only (no UPDATE/DELETE of topics). Class comes from the audited file plan; school/class compatibility enforced at 541–544; whole-bucket compatibility check against existing rows before insert (1103–1132); post-insert verification of every planned row inside the transaction (1170–1203); `LOCK TABLE`, one transaction, rollback on error. | **Sufficient, unchanged.** It cannot modify an existing Primary/JSS1/JSS2/SS row; it supports other classes when explicitly used for them and must stay generic. |
| 2 | `ingestTopics.ts` `--jss3-supplements` hook (818–827) + `jss3Supplements.ts` `buildJss3SupplementRows` (46–65) | Appends rows to the in-memory plan only; persisted by path 1 | `schoolCode === 'secondary'` required; `className` hard-coded to `'JSS 3'`; each destination must already exist as a JSS 3 subject/term in the original plan (no silent new subject/class); duplicate-add refused; corpus assertion first; any failure is pushed to `errors` and blocks the import. | **Sufficient, unchanged.** |
| 3 | `db/attachTopicAssets.ts` `attachAssets` (190–285) | `INSERT INTO topic_assets … ON CONFLICT DO NOTHING`; `UPDATE topic_assets` (metadata, only with `--update-metadata`) | Generic tool with required explicit `--class-name`. Topic lookup is `school_code + subject + class_name + term_label + order_index`, exactly one row, `FOR UPDATE`, inside one transaction; both writes are keyed by the topic id resolved that way, never by title; optional expected-title guard; sha256/MIME conflicts abort; UPDATE re-asserts sha256+MIME and requires `rowCount === 1`. Never writes `topics`. | **Sufficient, unchanged.** Not JSS3-specific by design; scope is whatever class is explicitly passed and every mutation is on `topic_assets` rows of the resolved topic. |
| 4 | `db/applyTopicSequence.ts` `applySequencePlan` (apply) | `UPDATE topics SET sequence_rank`; `INSERT INTO topic_sequence_audit` | Candidate SELECT is scoped to `school_code`, `class_name='JSS 3'`, `source_file = '<SUP id>.json'`, subject, term; exactly-one-row, title, body-hash, anchor identity/title/range checks; plan must name the school; one transaction. | **Defect (see below) — fixed.** |
| 5 | `applyTopicSequence.ts` `rollbackSequencePlan` | `UPDATE topics SET sequence_rank` (restore); `UPDATE topic_sequence_audit` | School + plan version + not-yet-rolled-back; edited ranks skipped; one transaction. | **Defect (see below) — fixed.** |
| 6 | `utils/jss3DeliveryCorrection.ts` `retireStaleJss3Cache` (called from `routes/learning.ts` 459; reached indirectly via `assessmentDeliverable` 986/1046 and `withdrawnAssessmentIds` 855) | `UPDATE topics SET summary, generated_assessment_id`; `UPDATE assessments SET status='closed'` | Callers only pass a topic that `resolveDelivery` matched. Resolver candidates require `school_code` + `class_name` equality (and shipped corrections: 65/65 are `secondary`/`JSS 3`, all with subject and term); supplement-revision resolver requires `secondary`/`JSS 3`. Single statement, row lock. | **Defect (see below) — fixed.** |
| 7 | `routes/learning.ts` generic student route writes (498 summary cache, 579/583 assessment link/close, topic CRUD 333–412) | per-topic cache/CRUD | Student route checks school/class before use; staff CRUD is permission-gated. Generic (all classes) by design; not JSS3 write boundaries. For corrected JSS 3 topics the summary is already the delivered text, so the generated-summary write is skipped. | **Out of scope, unchanged.** |
| 8 | `db/jss3SupplementRevision.ts`, `jss3SequencePlan.ts`, other `jss3*Resolutions/Corrections/*.ts` | none (pure data/resolvers/validators) | — | No DB writes. |
| 9 | `renameClassNaming.ts`, `cleanupStaleClasses.ts`, `fixStaleAssignedClasses.ts` | class-name / user / classes maintenance | Generic maintenance tools, not curriculum JSS3 import/correction/asset operations. | Not changed; outside this task. |

## Defects found and fixes

1. **`applySequencePlan` UPDATE was not confined to the verified row.** The verified identity (JSS 3, subject, term, source file) existed only in the earlier SELECT, which runs outside the transaction and without a lock. The mutation was `WHERE id AND school_code AND sequence_rank IS NULL`, and a zero-row result was ignored while the audit row was still inserted.
   *Fix:* the UPDATE now also requires `class_name='JSS 3'`, the verified `subject_id`, `term_label`, `source_file`, and the `SUP-….json` pattern, and uses `RETURNING id`; anything other than exactly one changed row throws inside the existing transaction (rollback, nothing committed, no audit row).
2. **`rollbackSequencePlan` restored by topic id with no class/source constraint.** Audit rows were joined to topics by id only.
   *Fix:* the audit SELECT now carries `class_name`/`source_file`; any audit row pointing outside a JSS 3 `SUP-….json` row aborts before any write (dry run included). The restoring UPDATE additionally requires `class_name='JSS 3'` and the `SUP-….json` pattern, with `RETURNING id` and an exactly-one-row check inside the existing transaction.
3. **`retireStaleJss3Cache` mutated by bare topic id.** Its JSS 3 scope lived only in the caller's resolver.
   *Fix:* every clause of the single statement (topic lock, stale-assessment selection, assessment close, topic update) now requires `school_code='secondary'` and `class_name='JSS 3'` as bound parameters. For any other class/school the statement locks, closes and updates nothing. Idempotence and the single-statement atomicity are preserved.

Unchanged by design: existing school, title, body-hash and anchor checks; no title-only fallback was added; no class-name normalisation (literal `'JSS 3'` / `'secondary'` as already used in `jss3SupplementRevision.ts` and `ingestTopics.ts`); the generic importer and generic asset attacher are not restricted.

## Limitations

- Apply/rollback pre-checks (title, body hash, anchor) still run before `BEGIN` and unlocked; the new UPDATE predicates narrow but do not eliminate that window (no body-hash predicate in the UPDATE).
- `createDeliveryResolver` accepts corrections without `subject_name`/`term_label`, in which case its withheld branch matches on school + class + title. All 65 shipped corrections carry both fields, so this is latent, not demonstrable on current data. Left unchanged to avoid altering resolver semantics that existing tests exercise; consider requiring both fields in a separate change.
- `retireStaleJss3Cache` returns `retired: false` (no throw) for an out-of-scope id; callers already fail closed on assessment delivery.
- Nothing here was executed. `tsc` and the DB suites have not run against this change.

## Deferred regression cases (to run in CI/PostgreSQL)

1. Apply: a supplement-shaped row with the same id but another class (e.g. `JSS 2`) or another source file is not updated; apply throws and leaves no audit row.
2. Apply: concurrent change of the target row's class/source_file between precheck and UPDATE → zero rows → throw → full rollback.
3. Rollback: audit row pointing at a non-JSS 3 or non-`SUP-` topic → refused in dry run and apply, nothing written.
4. Rollback: JSS 3 row whose rank was edited after apply is still skipped and reported (existing R1/R2 behaviour unchanged).
5. `retireStaleJss3Cache` with a Primary / JSS 1 / JSS 2 / SS topic id (and with a `secondary` JSS 3 id in another school code) leaves topic summary, `generated_assessment_id` and assessment status unchanged; with a valid JSS 3 `secondary` id behaviour is identical to before (summary replaced, stale assessment closed and unlinked, idempotent on repeat).
6. Existing sequencing suite (10 tests) and delivery-correction tests still pass.
7. Generic importer: a Primary/JSS1/JSS2 import with explicit class still inserts as before; `--jss3-supplements` with a non-`secondary` school code still refuses.
