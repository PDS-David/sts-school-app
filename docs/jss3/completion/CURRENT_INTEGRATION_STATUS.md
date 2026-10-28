> **28 October P4 correction:** Retain existing ordering and progression; no placement activation is requested. D6/D7/placement responses are required for a future activation, not for unchanged-order source implementation. The committed plan is empty, but no live ranks or target configuration were inspected. The earlier mandatory-column failure is fixed by `SEQUENTIAL_CLOSEOUT_20261025/SEQUENCE_SCHEMA_COMPATIBILITY.md`; do not treat the historical R7 warning as a current defect. See `NO_RESPONSE_CLOSEOUT/P4_EXISTING_ORDER.md`. Release verification and approval remain separate.

# JSS3 — current integration status (24 Oct 2026, R6 integrator)

> **26 October current-state correction:** Master 2f2232f includes PR54/55 (reviewed supplement runtime delivery), PR56 (complete selected-story exercise), PR57 (Ọya still BLOCKED), PR58–60 (sequencing prepared/implemented but unactivated), PR61 (acceptance runner), PR62 (protected comparison still BLOCKED). PR64 fixes optional sequence_rank reads before migration; tested candidate 87f83cc passes CI including real-PG sequence10/10. Fresh private-source verification:391 pass/0 fail/9 DB-only skips; all313 original rows exact;484 total (235/249/0), Computer0; generated records unchanged. Full source+DB acceptance is INCOMPLETE. Remaining: eligible Ọya passage; D6/D7/approved placement activation; source-dependent DB suites; real certified baseline/release snapshot; staging/device/production approval and observed release. PR63 is a staging/release BLOCKED report, not implementation. No statement below overrides this current summary. See SEQUENTIAL_CLOSEOUT_20261025/SEQUENCE_SCHEMA_COMPATIBILITY.md. No production connection or deployment occurred in this verification.

> **24 October follow-up (branch implementation):** The private archive has now been recovered and its hash verified. A fresh real-source capture proves all 313 original row objects unchanged. The previously drafted iwì lesson is implemented as a source-verified modern equivalent, with attribution and regenerated records: 484 rows (235 First / 249 Second / 0 Third), Computer Studies 0. See `IWI_ACTIVATION_20261024/REPORT.md` and `SOURCE_CHECK.json`. The historical R6 tables below describe their own candidate, not this follow-up. Ọya, unresolved Y3 source meanings/books, approved sequencing, certified 2,179-row comparison, staging/device checks and release authorisation remain separate open items. Do not ask for the recovered archive again in this workspace or treat its recovery as a certified Primary/JSS1/JSS2 baseline.

Candidate: master `1adf443d33a864b130d519ca45182eb56625674b` (merge of PR #48). Earlier status files and worker reports are retained as history. **JSS3 is NOT declared complete**: teaching, permission, baseline, sequencing and device gates remain open (below). Nothing was deployed, imported or migrated; no real student data touched.

## PR ledger (GitHub API, 24 Oct 2026; no PR open after this table)
| PR | Nature | State | Merge commit | Evidence |
|---|---|---|---|---|
| #35 | Implementation: Ṣàngó text study in `SUP-YO-ORAL-GENRES` | merged | `8d46e83` | `YO_TEXT_IMPLEMENTATION/REPORT.md` |
| #36, #37 | Evidence only: Ọya (no passage), acquisition handoff | merged | `3bef89b`, `3d0b78a` | `Y1_OYA_TEXT`, `OYA_SOURCE_ACQUISITION` |
| #38 | Evidence + tests only: iwì | merged | `f505d02` | `YO_IWI_TEXT_20261023` |
| #39 | Preparation: B-PREP tooling | merged | `cf1b559` | `B_PREP/REPORT.md` |
| #40 | Proposal only: S-PREP placement/policy | merged | `ed1215e` | `S_PREP/` (approval form blank) |
| #41 | Docs: prior status | merged | `6a3c4ba` | superseded by this file |
| #42 | D_PREP staging guard | **closed unmerged by owner** | — | superseded by #48 (contains #42's commits) |
| #43 | Implementation: owner-accepted Yoruba marriage meanings | merged | `1de0bca` | `Y3_A6_MARRIAGE/` |
| #44 | R2: status report only (**not** sequencing implementation) | merged | `6ee913c` | `R2_SEQUENCING/REPORT.md` |
| #45 | R1: evidence only; iwì draft **not delivered**; no Ọya/iwì lesson | merged | `c1699b5` | `R1_YORUBA_TEXTS/REPORT.md` |
| #46 | R3: attribution record for `SUP-YO-LICENSED-STORY` + tests | merged | `eadc077` | `R3_DISTRIBUTION/REPORT.md` |
| #47 | R4: protected comparison BLOCKED on owner inputs | merged | `f036a63` | `R4_PROTECTED_COMPARISON/` |
| #48 | R5: staging API-target guard fixes + real-bundle tests; device check NOT performed | merged by R6 | `1adf443` | `R5_STAGING_DEVICE/REPORT.md`, `D_PREP/` |

R6 review of #48 before merge: CI `verify` success on head `957b25f`, mergeable clean, 10 files; ordinary (non-`STS_BUILD_TARGET`) builds are unchanged (`app.config.js` returns the app.json config untouched; `client.ts` changes one import and one call with the same `envUrl ?? configuredUrl ?? emulator` chain). It changes build configuration and mobile API-URL resolution only; no lesson, topic, asset or progression data.

## Status by claim
| Claim | Implemented | Verified | Merged | Notes |
|---|---|---|---|---|
| Ṣàngó text study; attribution bound to body hash | yes | static + real-DB attribution route pass here; full-source capture **not re-observed** | yes | |
| Third-party credit records for all three delivered third-party Yoruba lessons (ORAL-TEXTS, ORAL-GENRES, LICENSED-STORY) | yes | tests pass here (negative controls for missing credit, changed hash, wrong lesson) | yes | |
| Ọya and iwì text lessons | **no** | n/a | n/a | gates unchanged |
| Marriage contextual teaching | yes | CI; capture not re-observed | yes | |
| Sequencing / placement implementation (Task 05) | **no** | n/a | n/a | policy unapproved |
| Protected 2,179-row baseline comparison | **no** | n/a | n/a | R4 blocked |
| Staging safeguards (build-time + runtime URL guard) | yes | CI + 32/32 `*.cjs` here | yes | not an EAS build, not a device pass |
| Staging, phone/device acceptance | **no** | n/a | n/a | R5 Phase 2 not performed |

## Verification performed by R6 on `1adf443` (Node 24.19.0, `npm ci --ignore-scripts`, PostgreSQL 16 on loopback, DB `jss3_test_r6`)
| Check | Result |
|---|---|
| `tsc --noEmit` backend, mobile | exit 0 both |
| `node --test tests/*.cjs` | 32 pass, 0 fail |
| Static TS suites (`tests/*.test.mts`, excluding `.db.`) | 386 tests: 332 pass, 0 fail, **54 skipped** (private-archive/capture-dependent) |
| Python unittests (P1_BASELINE 18, acceptance runner 3, visual register 3, device1 10, staging attach plan 6, NOUN assets 4) | all OK |
| Real PostgreSQL: topic-assets 18/18; protected-export 1/1; v3-science-ci 5/5; yo-license 4/4; staging-admin 16/16 | pass, 0 skipped |
| Real PostgreSQL: batch2-assets, delivery-correction, v1-business, v2-math-assets, v3-science-assets | 1 test each, **skipped** (need capture/source archive) |

## NOT performed, and why
- `run_acceptance.py --archive …` full-source acceptance (eight DB suites + corpus): **not run**; the private `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (SHA256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`) was not available, and the archive hash could not be verified. The 54 static and 5 DB skips are consequences of this, not permitted skips; they must pass once the archive is supplied.
- Fresh capture, original-row equality (313), current counts, and regeneration of `IMPLEMENTED_LESSONS.csv` and the teacher schedule: **not performed**. No lesson body changed in PRs #44–#48 (R3 changed only the attribution register), so the committed records are not known to be stale, but PR #43's metadata-only regeneration limitation is **not yet replaced by a real-source check**. Last reported counts (313 originals; 483 rows: 234 First, 249 Second, 0 Third; Computer Studies 0) come from earlier worker reports and are not re-observed.
- Delivery-correction/cache DB checks: skipped as above.

## Remaining items, owner, next action
| Item | Owner | Next concrete action |
|---|---|---|
| Final-candidate verification | owner → integrator | supply the private ZIP; run `python3 scripts/jss3/run_acceptance.py --archive ZIP --output <fresh dir> --database-url-env JSS3_LOCAL_TEST_DATABASE_URL`; regenerate records with repository generators |
| Yoruba distribution choice (keep BY-SA excerpts vs pointers) for ORAL-TEXTS and ORAL-GENRES | owner | choose in `YO_LICENSE/OWNER_DECISION.md` / PR #46 description |
| Ọya passage (Elebuibon permission) and iwì byte-verified source | owner | actions in `R1_YORUBA_TEXTS/REPORT.md` |
| Sequencing policy D1–D8 and placement approval | owner / teacher | fill `S_PREP/APPROVAL_FORM.md`; then Task 05 |
| Protected baseline export/backup/snapshot | owner | inputs in `R4_PROTECTED_COMPARISON/` |
| Staging target, accounts, Expo/EAS, devices | owner | `D_PREP/TARGET_CHECKLIST.md` |
| Y3 remaining wording/book work | coordinating agent | not touched by R6 |
| Production release | separate task | prerequisites above unmet |

## Security
A GitHub personal access token was pasted in plain text in the session and used by R3/R6 for pushes, PR creation and merge. Revoke it.
