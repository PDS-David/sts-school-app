# P4 — retain existing ordering; optional placement activation is separate

Reviewed master 56e2a698daee52e276e972900876c1df9beae7bf, 28 October 2026.
Documentation implementation only. Testing remains deferred.

## Current delivery approach

Keep existing topic ordering, existing stored ranks (if any), pass prerequisites,
PIN configuration and pupil progress unchanged. Do not invoke applyTopicSequence,
write sequence_rank, activate a placement plan or reset existing approved ranks.

The committed backend/src/db/data/jss3SequencePlan.json has school_codes: []
and placements: []. This confirms that this repository plan requests no new
placements. It does NOT prove that a particular live database has no ranks:
no live database or target was inspected.

The shared resolver backend/src/utils/jss3Sequence.ts uses stored rank when
present and falls back to order_index when absent; with no ranks it retains the
legacy chain. No behaviour change is introduced by this documentation task.

## Which approvals matter now

D6 school codes, D7 target PIN setting and signed placement rows are prerequisites
for a future activation operation. They are not prerequisites for retaining
existing behaviour. Do not invent values or ask for those answers merely to
finish source implementation. A later release still needs the actual target
configuration to be recorded and verified; that is not a request to change it.

Do not describe append-only delivery as immediate access to every supplement.
Unplaced supplements retain the existing chain/unlock behaviour. We are not
silently converting them into a new non-gating policy.

## Superseded release warning

R7_RELEASE_PLAN/UPDATE_20261026.md recorded an earlier mandatory sequence_rank
column failure. SEQUENTIAL_CLOSEOUT_20261025/SEQUENCE_SCHEMA_COMPATIBILITY.md
documents the subsequent fix: topic queries read the optional key through
to_jsonb, so absent schema falls back to legacy behaviour. That old warning is
not a current unresolved mandatory-column defect. The fix already existed;
P4 did not implement or re-test it.

Optional placement writes still need their actual schema and approvals.
Historical migration/release instructions remain history, not a current
instruction to run DDL. No merge here runs an importer or applies placements.

## Separate gates

Full source+DB acceptance, protected current-state preservation, historical
certification evidence, actual staging/device observations and operation-specific
production approval remain separate. This task closes only the false dependency
between unchanged ordering and optional activation responses.

Read-only source/diff review only; no tests, typechecks, model execution,
database, importer, apply/rollback, schema, runtime or lesson changes.
