# SS1 test report, 2026-11-08 (run 1, tester T1)

Tested SHA: `999c95a` (master at the start of the run, which includes the tester claim). Master had moved to `697ee2f` by the end, so re-run before acting on any finding.
Environment: Node v22.23.4, npm 10.9.9, `npm ci --ignore-scripts`. CI uses Node 24.19.0 and was not checked.
Scope: tests and checks only; no package, queue or source file was changed. Importer, DB tests and deployment were not run (deferred).

## Commands and results

| Command | Result |
|---|---|
| `cd backend && npx tsc --noEmit` | pass (0 errors) |
| `node --import tsx --test tests/ss1/*.test.mts` (6 existing files, 38 tests) | 15 pass, 21 fail, 2 skipped |
| per file | catering-craft 6/6 pass; further-mathematics 9 pass, 2 skipped; english 0/6; french 0/6; literature 0/8; mathematics 0/1 (fail at load) |
| new `tests/ss1/_invariants.test.mts` (12 generic tests over all 21 packages and queues) | 8 pass, 4 fail (see D1 to D4) |
| every registered source vs `docs/ss1/sources/SSS1-original.zip` (SHA256 `024487129a86...c9a3e`, verified) | 61 of 61 sources match: member present, SHA256 equal |

The per-file failures are all consequences of D1 (the schema rejects the package, so every test in that file fails when it parses it), not separate defects.

## Defects

| # | Severity | Subject and exact IDs | Assertion | Expected / actual | Suggested owner task |
|---|---|---|---|---|---|
| D1 | High (blocks every test on 6 packages) | english: `delivery_corrections` COR-012, 013, 014, 015 have an unrecognised key `evidence.objective_scope_audit`; 112 `coverage` entries (first `ENGLISH-T1-W08-AJ01`, `-AJ02`, `-AJ03`, `-AJ05`, `-AJ06`, `-ES01..04`, `-RV01`, `-WA01`) have `evidence[1].evidence`, an unrecognised nested key | schema parse | strict schema: valid / 116 issues | English agent: move the audit text into `explanation` or extend the schema deliberately |
| | | french: lesson `SUP-SS1-FRENCH-ORAL-ACCENTS-T1` provenance[0].`url` missing; open item `FRENCH-T1-W05-PUNCTUATION-DRAWING-DISPOSITION` has an invalid `kind` | schema parse | `url` required; `kind` in CONTENT/FACT/PERMISSION/OWNER_ACTION/VERIFICATION | French agent |
| | | literature: lesson `SUP-SS1-LITERATURE-T1-W02-PROSE` provenance[0].`url` missing; open item `LIT-ASSIGNMENT-MARKER-SCHEMA-GAP` has no `kind` | schema parse | as above | Literature agent |
| | | mathematics: open items `OI-MATH-T3-W03-ANGLE-57-5` and `OI-MATH-T2-T3-REFERENCE-URLS` have no `kind` | schema parse | `kind` required | Mathematics agent |
| | | physics: lesson `SUP-SS1-PHYSICS-T2-W02-THERMOMETERS-EVAPORATION` provenance[0].`url` missing | schema parse | `url` required (may be null) | Physics agent |
| | | technical-drawing: source rule `SS1-SRC-af4868d2c026-R007` has no `kind` | schema parse | `kind` required | Technical Drawing agent |
| D2 | High | mathematics lessons `SUP-SS1-MATHEMATICS-T1-W03-BASE-OPERATIONS`, `-T1-W05-STANDARD-FORM`, `-T1-W06-INDICES` | `body_sha256` equals SHA-256 of UTF-8 body | BASE-OPERATIONS and INDICES: the stored hash equals the hash of the body plus a trailing newline, so the stored body lost or gained a newline. STANDARD-FORM: matches no simple variant (body changed after hashing). Last touched by `bf4f62b` | Mathematics agent: recompute hashes after the final edit |
| D3 | Medium | english, 15 entries with no open item, although source indexing is complete: `ENGLISH-BODY-008`, `-010`, `-011`, `-059`, `-061`, `-062`, `-063`, `-064`, `-065`, `-066`, `-067`, `-070`, `-074` (all PARTIAL) and non-umbrella `ENGLISH-T2-W07-TP01`, `ENGLISH-T3-W06-SO03` (PARTIAL) | every PARTIAL/UNRESOLVED coverage entry is referenced by an open item | the indexing done-condition says none may lack an OPEN item | English agent: add open items, or re-rate the entries |
| | | technical-drawing: 20 entries, same rule (source indexing complete there) | same | same | Technical Drawing agent (run the test to list IDs) |
| D4 | Low to medium | 16 queues have a stale `next_runnable` (all `status_counts` are correct). Missing eligible items: each of 14 subjects is missing one item (typically `*-TEST-PACKAGE`; this may be intended, confirm), catering-craft 3, physics 3, chemistry 2, yoruba 5. Lists items that are not eligible: chemistry 21 (e.g. `CHEM-VIS-T1B-W01-CAREERS`), yoruba 8 (e.g. `YO-LES-T3-W04-EDE`), bookkeeping 6 (e.g. `BK-LES-T1-W02-DIFF`) | recomputed `next_runnable` equals stored | an agent that trusts the stored list could start an item whose dependency is open; the protocol helper `claim.sh next` recomputes and is not affected | Each subject's agent on its next queue update |

Information only (not failures): subjects still being indexed hold PARTIAL/UNRESOLVED coverage entries with no open item: bookkeeping 5, catering-craft 2, chemistry 8, french 2, further-mathematics 20, mathematics 6, physics 5, yoruba 155. These are pre-indexing placeholders until their indexing items finish; re-check when each subject's `SOURCE_*` items are complete. Also 20 lessons across packages cite a reference as PERMITTED while the locator says the page was not opened (English `SUP-SS1-ENGLISH-PHRASAL-VERBS-T1` is one); this matches the open provenance verification work.

## Checks that passed on all 21 packages

Unique IDs in every collection and queue; every lesson body hash matches except D2; marking totals and non-empty answers; every coverage and open-item reference resolves (to package IDs, source locators or queue items); no lesson records approval, verification or approval references (all PENDING / DEFERRED / null); `package_status` PENDING everywhere; delivery corrections bind a same-term replacement and preserve source hash identity, with no two corrections sharing a target; every lesson has provenance with a rights basis; no extracted originals or renderings are tracked.

## Not tested

Importer, DB, deployment, CI results, mobile/UI, the content correctness of lesson text (only structure, hashes and references), the existing per-subject test files that were not written for the other 15 subjects (none exist yet), and Node 24.19.0 behaviour. The six English `ENG-TEST-*` items are already done on master; their assertions pass or fail only through D1.

## Next run

`git fetch && git pull --rebase origin master && npm ci --ignore-scripts && node --import tsx --test tests/ss1/_invariants.test.mts`. Compare with this report: list new, fixed and recurring defects. First thing to check: whether D1 and D2 are fixed, since they block four existing test files.
