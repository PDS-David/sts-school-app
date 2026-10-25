# R2 report — supplement placement and sequencing

**Task:** R2. **Base:** `master` @ `1de0bcab5b04edaaa05dc11d046e2c6d86dc3609`. **Branch:** `jss3/r2-sequencing-20261024-k7m2`. Head SHA: read from the PR.
No `AGENTS.md` or `CLAUDE.md` exists at the base; `EXECUTION_CONTRACT.md` was read and followed.

## Status (kept separate)

| Area | Status |
|---|---|
| Phase 1 steps 2–4 (read each supplement against source objective and destination lesson bodies; record lesson identities; update proposal) | **BLOCKED** — private archive `JSS3_NEXT_STAGE_INPUTS_20261016.zip` not available in this session |
| Phase 1 step 1 (archive SHA-256 check) | **NOT PERFORMED** — no archive to hash |
| Phase 1 step 5 (approval form with proposal hash) | **VERIFIED** — hashes below still match the committed files |
| Phase 1 step 6 (owner answers already given?) | **CHECKED — none recorded** (see below) |
| Phase 2 (placement/access implementation, tests) | **NOT STARTED** — policy not recorded |
| Node 24.19.0, `npm ci`, PostgreSQL 16 route/DB tests, acceptance runner | **NOT PERFORMED** — sandbox has Node 22.23.4; no code changed, nothing to test |
| Merge, production migration/import | **NOT PERFORMED** (not authorised) |

This PR is **not** sequencing implementation. It changes no schema, route, mobile code, data or placement.

## Verified on current master

```
python3 scripts/jss3/build_s_prep_placement_proposal.py
  170 rows; PROPOSED/MEDIUM 16, PROPOSED/LOW 7, UNRESOLVED 147; anchor-number>originals 17
  sha256 e11762990137e2ef03ef6a1f8c3875b6e649c6ee78e8b3082386a54bb5b1617f  (CSV byte-identical to committed)
```

* Current counts equal the S-PREP counts (170 / 147 unresolved); recalculated, not assumed.
* `PLACEMENT_PROPOSAL.csv` sha256 `e117629…1617f`, `POLICY_PROPOSAL.md` sha256 `f13a829…b0ad`.
* Combined proposal hash for `APPROVAL_FORM.md`: **`5e53dbfcb6000352e192c000ea78f8631453c5248f83c57b661dc4bff0d645ed`** (recomputed with the form's formula using base `3d0b78a…`; matches).
* `verified_against_private_archive` is `NO` on all 170 rows; no approval columns are filled.
* No `PLACEMENT_APPROVAL_RESPONSE.csv`, filled approval form or `sequence_rank` code exists in the repo.

## Where the access logic is (for Phase 2)

* `GET /learning/topics` ordering and lock computation: `backend/src/routes/learning.ts` (~L152–215).
* Direct guard in `POST /learning/topics/:id/complete`: same file (~L418–445); it recomputes siblings by `order_index` independently of GET.
* PIN gate: `termPinEnforced` (`TERM_PIN_ENFORCED === 'true'`, default off), L12.
* Mobile consumer: `mobile/src/screens/SubjectTopicsScreen.tsx` L39–40 detects the PIN topic via minimum `order_index`.

## Students affected by the pending choices

D1 (gating), D2 (returning-student protection), D3 (supplement before original #1), D4 (unplaced items), D6 (schools) and D7 (PIN) change what students can open. D5 and D8 are process choices.

## Exact pending policy choice

Owner has recorded none of D1–D8. Recommended, per `POLICY_PROPOSAL.md`: D1 non-gating + legacy floor; D2 invariant; D3 no; D4 stay appended; D5 as stated; D6 named `school_code`s (needed); D7 owner states; D8 authorise. Then a `PLACEMENT_APPROVAL_RESPONSE.csv` for supplements to place.

## Remaining external inputs

1. `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`), requested once.
2. Completed `APPROVAL_FORM.md` decisions D1–D8 against the hash above.
3. Node 24.19.0 and PostgreSQL 16 for the DB route tests.

## Handling note

The task message contained a GitHub personal access token in plain text. It was not written to any file, remote URL or commit (repository access went through the session's git proxy). Treat it as exposed and revoke or rotate it.

## Update — 26 Oct 2026 (supersedes the status table above)

The private archive was supplied and its SHA-256 verified. Phase 1 steps 2–4 and the revised proposal are now done and reconciled to 171 supplements: see `TASK_05_REPORT.md`, `R2_APPROVAL_FORM.md` (v2, combined hash `a86989bf…1e15`), `PLACEMENT_PROPOSAL_R2.csv` and `R2_RELATION_DECISIONS.csv`. Owner answered D1–D5 and D8 in chat; D6, D7 and the placement response are still missing. **Phase 2 (implementation) is NOT STARTED** and nothing in this folder is an implementation.
