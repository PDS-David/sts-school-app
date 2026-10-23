# JSS3 — current integration status (23 Oct 2026)

Integrator: I-CURRENT. Basis: master `ed1215eaaf7344fcc02d9780201bfe4773a87515` (merge of PR #40). This file is added by a later commit; it describes that basis. **The whole curriculum is NOT declared complete.** Y3 is reserved for its returning agent: no branch, PR or file for it exists; none was touched.

## PR ledger (verified against the GitHub API, 23 Oct 2026)

| PR | Nature | State | Merge commit | Evidence |
|---|---|---|---|---|
| #35 | Implementation: Ṣàngó text study inside existing `SUP-YO-ORAL-GENRES` | merged | `8d46e83` | `YO_TEXT_IMPLEMENTATION/REPORT.md`, `VALIDATION.json` |
| #36 | Evidence only: Ọya, no supportable passage; no lesson | merged | `3bef89b` | `Y1_OYA_TEXT/REPORT.md` |
| #37 | Evidence only: Ọya acquisition handoff | merged | `3d0b78a` | `OYA_SOURCE_ACQUISITION/REPORT.md` |
| #38 | Evidence + tests only: iwì; **no iwì lesson** (`SUP-YO-IWI-TEXT` not created) | merged | `f505d02` | `YO_IWI_TEXT_20261023/REPORT.md` |
| #39 | Preparation: B-PREP acquisition tooling and SQL filter fix | merged | `cf1b559` | `B_PREP/REPORT.md` |
| #40 | Proposal only: S-PREP policy, placement CSV, approval form | merged this session | `ed1215e` | `S_PREP/REPORT.md` |

No other PR is open. Nothing already merged was reopened. Merging #40 records a proposal; it is **not** policy approval (`S_PREP/APPROVAL_FORM.md` is blank).

## Status table (one row per claim)

| Claim | Implemented | Verified | Merged | Evidence / commit |
|---|---|---|---|---|
| Ṣàngó short text study, attribution bound to body hash | yes | CI green at `8d46e83`; private-ZIP capture reported by PR #35 worker, **not re-observed here** | yes | `8d46e83` |
| Ọya text lesson | **no** | n/a | n/a | `3bef89b`, `3d0b78a` (absence recorded) |
| iwì text lesson | **no** | n/a | n/a | `f505d02` (absence recorded) |
| B-PREP tooling (export filter, `--exclude`, validator, 9+5 tests) | yes | worker: 18 + 9 tests, DB run 0 skipped; CI green at `cf1b559` | yes | `cf1b559` |
| B-PREP protected comparison / 2,179-row certification | **not performed** | n/a | n/a | `B_PREP/REPORT.md` (OB-06 open) |
| S-PREP proposal and reference model | yes | re-run here on PR head `8ee7d04`: CSV sha256 `e117629…1617f` identical; combined hash `5e53dbf…645ed` recomputed equal; model assertions pass; CI green on PR head | yes | `ed1215e` |
| S-PREP placement quality | n/a | 16 MEDIUM, 7 LOW, 147 UNRESOLVED; **none checked against the private archive** | yes | `S_PREP/PLACEMENT_PROPOSAL.csv` |
| L-PREP result | **not found** | no PR, branch or file on master | no | searched PR list, branches, `docs`, `scripts` |
| D-PREP result | **not found** | no PR, branch or file on master | no | same |
| Sequencing implementation (Task 05) | **not performed** | n/a | n/a | needs D1–D8 |
| Staging, phone/device acceptance | **not performed** | n/a | n/a | `STAGE1_DEVICE1_EXEC_20261023/REPORT.md` (BLOCKED) |

## Observed on master (this session)

- `IMPLEMENTED_LESSONS.csv`: 170 rows; `jss3Supplements.json`: 170 entries (current observed).
- 313 originals / 483-row capture (234 First, 249 Second, 0 Third), Computer Studies 0: **reported** in `YO_TEXT_IMPLEMENTATION/VALIDATION.json` for `8d46e83`; **not re-observed here** (no private ZIP). Later merges changed no lesson, runtime or data file.
- CI (`JSS3 implementation and asset checks`): success at `8d46e83`, `3bef89b`, `f505d02`, `3d0b78a`, `cf1b559`, `ed1215e` (run 39928035396).
- No lesson, runtime or data change was merged this session, so no regeneration was required or run.

## Not run here, and why

| Check | Reason |
|---|---|
| Full-source acceptance (`run_acceptance.py --archive …`) | private `JSS3_NEXT_STAGE_INPUTS_20261016.zip` absent |
| Eight-suite DB acceptance | no source ZIP; local Node is 22.22.0, contract requires 24.19.0; PostgreSQL 16 binaries present but not exercised |
| `npm ci` / TypeScript suites | no runtime change merged; CI covered the merged commits |
| Device / phone | no staging target, build or phone |

## Remaining dependencies and owners

| Dependency | Owner |
|---|---|
| Private source ZIP, SHA256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c` (final combined verification, S-PREP anchor check) | owner |
| Certified 2,179-row export/backup + release snapshot (B-PREP I1, I2; I6–I8 decisions) | owner |
| S-PREP decisions D1–D8 and `PLACEMENT_APPROVAL_RESPONSE.csv` | owner / designated teacher |
| Yoruba distribution choice A/B/C (`YO_LICENSE/OWNER_DECISION.md`) | owner |
| Ọya and iwì passages with reuse basis and byte-level source | owner (permission/acquisition); no one contacted |
| Staging target, accounts, build profile, devices | owner → DEVICE1 worker |
| Y3 results and merge | returning Y3 agent (reserved) |
| L-PREP and D-PREP deliverables | owner to confirm whether they exist (not on GitHub) |

## Production plan

Not prepared. Prerequisites are unmet (no private-ZIP acceptance, no DB acceptance on a final candidate, no device pass, no distribution decision, no baseline). Nothing was deployed, imported or migrated.

## Security note

PR #40's report says its task message contained a GitHub token in plain text. Rotate it.
