# S-PREP report — reviewable sequencing policy and placement proposal

**Task:** S-PREP (preparation only; not authorisation to change student progression).
**Base:** `master` @ `3d0b78adf37f4b373b0c42caa44a0102bbce06b0` (fetched 23 Oct 2026; re-fetched before publishing). **Re-fetch before publishing:** `master` had advanced to `cf1b559f2f5ba72de3f48429409f8b7f4a4b77ed` (PR #39, B_PREP). It changes none of the inputs this proposal reads (`jss3Supplements.json`, the three replacement CSVs, `learning.ts`, `SubjectTopicsScreen.tsx`, `schema.sql`); the generator was rerun on the rebased tree with the identical output hash, so the hashes in `APPROVAL_FORM.md` (which name base `3d0b78a…` as the evidence baseline) remain valid. The PR targets current `master`.
**Head:** the PR head commit on branch `jss3/s-prep-20261023-p3q8` (a commit cannot contain its own SHA; read it from the PR).
**No `AGENTS.md` exists** at the base; `NEXT_AGENT_TASKS/EXECUTION_CONTRACT.md` was read and followed. Y3 work: no branch, PR or file attributable to Y3 was touched (this branch adds only the files below).

## Status (kept separate)

| Area | Status |
|---|---|
| Policy proposal, placement inventory, approval form, reference model | **IMPLEMENTED** (documents + two offline scripts) |
| Inventory counts, id/title/order agreement across three repo files, generator determinism, model assertions | **VERIFIED** (commands below) |
| Anchors checked against original row bodies/titles | **BLOCKED** — private archive `JSS3_NEXT_STAGE_INPUTS_20261016.zip` not available in this task |
| Owner approval of any policy item or placement | **NOT PERFORMED / NOT RECORDED** — none supplied |
| Schema, unlock behaviour, topic identities, assets, completions, production data | **UNCHANGED** |
| Sequencing implementation (Task 05) | **NOT STARTED** |
| `npm ci`, TypeScript/DB test suites, acceptance runner | **NOT PERFORMED** — no runtime code or data changed; nothing for them to test |
| Merge | **NOT PERFORMED** (PR only) |

## Files

* `docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md`, `PLACEMENT_PROPOSAL.csv`, `APPROVAL_FORM.md`, `REPORT.md`
* `scripts/jss3/build_s_prep_placement_proposal.py` (reads Git files only; writes the CSV; deterministic)
* `scripts/jss3/s_prep_sequence_policy_model.py` (pure-Python reference model with assertions; touches nothing)

## Commands and results

```
python3 scripts/jss3/build_s_prep_placement_proposal.py
  170 rows; PROPOSED/MEDIUM 16, PROPOSED/LOW 7, UNRESOLVED 147; anchor-number>originals 17
  sha256 e11762990137e2ef03ef6a1f8c3875b6e649c6ee78e8b3082386a54bb5b1617f   (identical on rerun)
python3 scripts/jss3/s_prep_sequence_policy_model.py
  25,640 (bucket shape x reachable state) pairs; ALL MODEL ASSERTIONS PASSED
  S1-design counterexample: n=2, one supplement after O1, student passed O1 -> O2 re-locked
```
The generator asserts: ids equal across `jss3Supplements.json`, `IMPLEMENTED_LESSONS.csv`, `TEACHER_SCHEDULE_SUPPLEMENTS.csv` (170); supplement `order_index` equals the schedule's append index and is contiguous `n+1…n+m` per bucket; original counts per bucket sum to 313 (151 + 162).

## Findings that change the earlier design

1. S1's "topic itself already passed" rule does not protect the open-but-unpassed frontier (reproduced in the model).
2. S1's rollback statement is not scoped to a school/plan/rows written (topics are per `school_code`); corrected in Policy §6.2.
3. A `completed_at` timestamp cannot reconstruct who had a topic open at activation: it is set at first completion and not updated when the assessment later passes it.
4. Non-gating placement keeps every original's lock identical to today, which removes the frontier problem without new student-state storage.
5. `TERM_PIN_ENFORCED` defaults off; the PIN identity matters only when it is on.
6. Seventeen schedule numbers (13 weeks, 4 list items) exceed their bucket's original count; confirms week ≠ `order_index`.

## Evidence limits

Anchors rest on `SEMANTIC_DECISIONS.csv` / `WIDER_WORKSTREAMS.csv` links between scheme items and original row numbers. These mappings cover only part of the originals, and scheme order is not proven to equal original row order. Hence only 23 of 170 have a proposed anchor and none above MEDIUM. A few WIDER_WORKSTREAMS locators refer to Third-Term scheme items for rows that live in a First/Second Term bucket; the generator uses the original number named there only when its term and subject match the supplement's bucket. Whether any bucket ends with an assessment/revision topic row remains unknown.

## Exact decisions still needed from the owner

1. **D1** gating vs non-gating (recommended: non-gating + legacy floor).
2. **D2** returning-student protection (recommended invariant; snapshot only if D1 = gating).
3. **D3** supplements before original #1 (recommended: no).
4. **D4** unplaced supplements (recommended: stay appended).
5. **D5** evidence required before a placement is approved, and who approves per subject.
6. **D6** which `school_code`s activate first.
7. **D7** intended `TERM_PIN_ENFORCED` value.
8. **D8** explicit authorisation to start Task 05.
9. A `PLACEMENT_APPROVAL_RESPONSE.csv` for the supplements to place; 147 anchors need the private archive or a teacher's choice.
10. Private archive `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`), requested once, to verify anchors and settle the assessment-row question.

## Handling note

The task message contained a GitHub personal access token in plain text. It was used only as a transient credential for clone and publish and is not written to any file or commit. Treat it as exposed and revoke/rotate it.
