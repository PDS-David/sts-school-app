# Task 05 — sequencing

**TASK 05: BLOCKED.** Sequencing is **unmet**. No progression, schema, route, mobile or data change was made. Preparation the task allows without approval is done and published.

Base master at publication `93e9422` (includes PR #44, #56, #57 and #58; #58 merged the earlier 170-row version of the R2 files, which this branch updates to 171). Proposal evidence baseline `d1c5f6ac802ff490330f052806a08ca0d57532a5`: no supplement, schedule or lesson file changed between the two. Branch `jss3/r2-placement-proposal-20261026-b1`; head = this report on top (read it from the PR). No `AGENTS.md` exists.

## Why blocked (exact unmet inputs)
1. **D6** — no `school_code` named.
2. **D7** — `TERM_PIN_ENFORCED` value not stated.
3. **Placement response** — no committed `PLACEMENT_APPROVAL_RESPONSE.csv`; no approver, date or basis for any placement.

Answered, recorded in `R2_SEQUENCING/R2_APPROVAL_FORM.md` step 2 (owner chat reply 24 Oct 2026, "Okay. Go by your recommendations"): D1 non-gating with legacy floor, D2 passed and open topics stay open, D3 no supplement before original #1, D4 unplaced stay appended, D5 as recommended, D8 authorised. This is a chat answer, not a committed signature; the sign-off block is blank.

## Done (preparation)
* Reconciled against current master: **171** supplements (was 170; `SUP-YO-IWI-TEXT` added by the iwì work). Task 03 changed one lesson body, no ids; Task 04 added none.
* Every supplement read against the 313-row capture from the private archive (SHA-256 `0a5b0d92…4ea3c8`, verified). Result: 98 HIGH, 22 MEDIUM, 7 LOW anchored; **44 unresolved** (was 147). 13 v1 anchors unchanged, 10 moved, 104 new, none dropped.
* `scripts/jss3/build_r2_placement_proposal.py`: deterministic; takes bucket facts from the current teacher schedule, not the stale S-PREP CSV; `--check` validates committed files without the archive.
* Revised approval form v2 with combined hash `a86989bf0c3711b25f84a24ecd26d625f23e5b0924d811506266310820f11e15`, and a response template whose decision and approver columns are empty (recommended: 90 approve, 37 pending teacher, 44 keep at end).
* Week numbers were never used as `order_index`.

## Verification (observed)
* Builder run twice with the archive: identical `PLACEMENT_PROPOSAL_R2.csv` (`d6ea6959…f522b`) and template (`050f0144…d5346`). `--check`: `R2 CHECK OK`.
* `python3 scripts/jss3/s_prep_sequence_policy_model.py`: ALL MODEL ASSERTIONS PASSED (a reference model, **not** a substitute for the route/database tests, which were not run).
* Defects found and fixed: the builder hard-coded 170 supplements and failed on 171; `--check` repeated it.
* Incident: running the old S-PREP generator overwrote the committed `S_PREP/PLACEMENT_PROPOSAL.csv` in my worktree. I reverted it before committing and confirmed its SHA-256 is again `e1176299…1617f`. That generator now emits a 171-row file, so the historical v1 CSV is intentionally left as the 170-row record its form binds to.

## Not run / unmet gates
Real PostgreSQL route tests, apply/rollback tools, shared GET/POST resolver, mobile `is_sequence_first`, migration, types, `run_acceptance.py`. All wait on the inputs above; none was substituted by a model. No device behaviour tested.

## Unblock
Owner supplies D6, D7, and the committed placement response (90 owner approvals, 37 teacher decisions). Then the implementation described in `S_PREP/POLICY_PROPOSAL.md` can proceed. The implementation code itself does not need D6/D7 to be written and tested; only activation does. Whether to build it ahead of those answers is the owner's call.

## Status
IMPLEMENTED: preparation only. VERIFIED: as listed. PUBLISHED: see PR. MERGED: no. DEPLOYED: no. Master may auto-deploy; nothing here is merged, and the integrator must check release configuration first.
