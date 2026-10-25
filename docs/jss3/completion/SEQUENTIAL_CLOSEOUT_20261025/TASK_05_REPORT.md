# Task 05 — sequencing

**TASK 05: PARTIAL (updated).** The implementation is now built and tested but **not activated**: it ships with an empty plan that names no school, so student progression is unchanged until the owner supplies D6, D7 and the placement response. The earlier BLOCKED text below describes the state before this addendum; its "nothing changed" statements no longer apply to code.

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


---

## Addendum — implementation (branch `jss3/task05-20261026-seq`, base master `9167424`)

Owner policy used (chat reply recorded in `R2_SEQUENCING/R2_APPROVAL_FORM.md` step 2, repeated in this session: "accept all the recommended answers"): D1 non-gating + legacy floor, D2 passed and already-open topics stay open, D3 nothing before original #1, D4 unplaced stay appended, D5 as recommended, D8 implementation authorised. **Not answered, not guessed:** D6 (school codes), D7 (`TERM_PIN_ENFORCED`), placement response (approver/date/basis). The code needs neither to exist; applying does.

### IMPLEMENTED
* `backend/src/utils/jss3Sequence.ts` — one resolver used by `GET /learning/topics` and the direct `POST /topics/:id/complete` guard. Order is `COALESCE(sequence_rank, order_index)`; originals and unplaced supplements form the pass-gated chain; a placed supplement opens when its anchor original is passed; legacy floor keeps anything open that today's `order_index` rule opens. With no ranks stored it is provably identical to the old behaviour (exhaustive test).
* `learning.ts`: both routes use the resolver; API adds `sequence_position` and `is_sequence_first` (existing fields kept); `termPinEnforced` is now read per request (same value in a running server) so PIN on/off can be tested in one process.
* `backend/schema.sql`: additive nullable `topics.sequence_rank NUMERIC(12,6)` and `topic_sequence_audit` table (no existing column, key, `order_index`, asset or completion touched).
* `backend/src/db/jss3SequencePlan.ts` + `data/jss3SequencePlan.json` — stable-ID plan, validated (unknown id, duplicate, anchor < 1, APPROVED without approver/date/basis/anchor title, pending with anchor). **Shipped plan: no placements, `school_codes: []`.**
* `backend/src/db/applyTopicSequence.ts` — dry-run by default; refuses a school not named in the plan; aborts before any write on missing/duplicate supplement row, title or body-hash drift, anchor not an original, anchor title mismatch, anchor out of range, existing different rank; one transaction; repeat apply is a no-op; rollback is scoped to one school + plan version, restores only ranks it wrote, skips and reports ranks edited since.
* `mobile/.../SubjectTopicsScreen.tsx`: PIN-shortcut uses `is_sequence_first`, falling back to the old comparison for servers that do not send it. No visual change.
* `tests/student-launch.static.test.cjs`: the two source-pattern assertions updated to the new per-request form (same intent: opt-in, default off, both routes gated). `tests/jss3-sequence.test.mts`, `tests/jss3-sequence.db.test.mts` added; both are in `.github/workflows/jss3-assets.yml`.

### VERIFIED (observed here; Node 24.19.0, `npm ci --ignore-scripts`, PostgreSQL 16 on loopback, DB `jss3_test_r6`)
| Check | Result |
|---|---|
| `tsc --noEmit` backend, mobile | exit 0, exit 0 |
| `tests/jss3-sequence.test.mts` (property over 9 bucket shapes × all pass-subsets × PIN on/off, 8,660 cases; validator) | 5/5 |
| `tests/jss3-sequence.db.test.mts` (real router + DB + real apply/rollback tool) | 9/9, 0 skipped, residue 0 |
| Mutation controls | removing the legacy floor → 1 failure; making supplements gate originals → 2 failures |
| Existing: static TS 405 tests / 351 pass / 0 fail / 54 skipped; `*.cjs` 32/32; DB suites topic-assets 18/18, protected-export 1/1, v3-science-ci 5/5, yo-license 4/4, supplement-revision 6/6, staging-admin 16/16 | no regression |

DB test coverage: fresh student (PIN enforced + redeemed / missing / off); returning A (passed O1,O2, frontier O3 stays open); failed predecessor; passing a placed supplement does not affect later originals; unreachable-state legacy floor; manual (NULL `order_index`) topic last and unlocked; wrong class and wrong school → 403; GET lock state equals direct POST for every locked topic in every state; dry-run writes nothing; invalid plans abort before any write (wrong school, empty school list, absent supplement row, wrong anchor title, anchor is a supplement, anchor out of range, changed title, changed body); apply changes only `sequence_rank` (order_index/title/body/ids byte-identical); repeat apply no-op; PENDING never written; scoped rollback (other school untouched, edited rank kept, other plan version untouched); post-rollback list equals pre-apply; completions untouched.

### NOT PERFORMED
* `run_acceptance.py` with the private archive: archive not available to this worker. Original-row equality (313) against a fresh capture and the 54 + 5 archive-dependent skips are unverified here. No lesson body changed, so lesson/schedule regeneration does not apply.
* Mobile device/phone behaviour; staging observation on a test account; the first-topic banner was only type-checked.
* Applying any placement anywhere, including a dry run against a real school (nothing to apply: plan empty).

### Remaining inputs (to activate)
1. **D6** — name the school code(s) → `school_codes` in the plan.
2. **D7** — state whether `TERM_PIN_ENFORCED` is on in the target environment (code supports both).
3. **Placement response** — approver, date, basis, anchor title per approved supplement (template: `R2_SEQUENCING/PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv`), converted to `APPROVED` rows in `jss3SequencePlan.json`.
4. A full-source run on a machine with the archive, then a **dry-run** of the apply tool on staging before anything else.

### Release note (master may auto-deploy)
Merging runs `schema.sql` on deploy: one nullable column and one empty table, no behaviour change while no rank exists. The route change is behaviour-identical for current data (all ranks NULL). The integrator should still confirm release configuration; this report does not authorise a production apply.

Status: IMPLEMENTED yes · VERIFIED as above · PUBLISHED see PR · MERGED no · DEPLOYED no · **ACTIVATED no** (needs D6, D7, response).
