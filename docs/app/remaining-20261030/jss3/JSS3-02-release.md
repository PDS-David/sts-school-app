# JSS3-02 — Designated-target release plan

Status: BLOCKED (owner approval) · Depends: VER-03, VER-04 · Base: the pinned release candidate
Writes: `docs/jss3/completion/NO_RESPONSE_CLOSEOUT/RELEASE_20261030.md` (new), `docs/app/remaining-20261030/evidence/JSS3-02.md`

## Why

`REMAINING.md` R01 is explicit: the target/deployed SHA, backup/restore evidence, release snapshot, cache/assessment preflight, stage rehearsal and operation approval "have not been supplied or observed." Until they are, JSS3 cannot be described as released or in use. V01 (post-PR172 acceptance), V03 (device acceptance) and O01 (unactivated sequence placements) also remain.

JSS3 is otherwise closed: content fixes, corrections, assets and the supplement set are merged, and `applyTopicSequence` must **not** be run for an unchanged order.

## Do

1. Write the release plan with these sections, all marked `NOT RUN` until authorised:
   - candidate SHA and source archive hash (verify `0a5b0d92…` before use);
   - designated target (host class), private secret locations, and the operator;
   - acceptance prerequisite: V01 output with `# skipped 0`, pinned to the candidate;
   - data preservation: P2 current-state snapshot on the designated target, taken in a paused window, stored privately — explicitly not a substitute for E04's historic certification;
   - schema/migration steps under OPS-01's ledger; plan and asset verification; cache and assessment preflight;
   - rollback: what is reversible, what needs a forward fix, and the restore checkpoint;
   - go/no-go criteria and approver.
2. State what is deliberately not included: `applyTopicSequence` for unchanged order (O01), and any claim of historic 2,179-row certification (E04).
3. Keep all execution out of this task.

## Acceptance (static)

- The plan names the candidate, the target, the approver and the rollback point.
- Every step has a verification and an evidence artifact.
- No claim of release, deployment or certification appears.

## Do not

- Run a script, import, migration, snapshot or deployment.
- Declare JSS3 complete.
- Re-run the completed content audits.
