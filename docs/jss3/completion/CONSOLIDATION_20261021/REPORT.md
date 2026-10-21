# Consolidation — 21 October 2026

Base master fe7b6a66bdd90228d2905387ceab33bf1a7829b2. Incorporates PR24 head c9875ff0a0131815f7c8370bd7d53b2248bdaf94, with additional fixes. Published SHA and CI outcome are in the integration PR.

## Repository assessment
PR23 is merged: seven-suite RELEASE-DB59/59 on a1db3dc; all15 committed checksums verify. PR25 is merged: staging preparation only, no environment/build/accounts. PR24 attribution implementation was open and conflicted in CI; this consolidation retains BOTH workers' checks. MATH3 and owner-interimTEACHER1 remain implemented. No evidence establishes protected2179 provenance or actual device acceptance. Other workers' unpublished changes cannot be inferred from task titles.

## Completed implementation
- Integrated attribution register, scoped API delivery, mobile credit display and tests from PR24.
- Found exact previously downloaded NOUN PDF, SHA25623cb6992e5024437a8bf0d52741a8b5fed324cc6ac5a4a21a4045a01b74af4d9. Rendered pages1/3 and visually identified cover xref7, logo xref30. Extracted exact embedded JPEG bytes (no redraw) using the worker's guarded extractor. Committed assets, source provenance and manifest for SUP-YO-ORAL-TEXTS. Original PDF stays private. Its cover's printed EHG105 typo is preserved.
- Manifest generated from this tree's actual capture, not a historical row guess. Combined asset plan17 manifests/103rows, zero problems. Assets are prepared, NOT attached to staging/production. Runtime reports displayed only when actual displayed DB assets exist.
- Replaced synthetic picture bytes in the Yoruba database route test with the committed actual image bytes and manifest. Added metadata/hash/file identity regression.
- Added the Yoruba suite/env to the acceptance runner (now eight DB suites). Historical seven-suite evidence is not relabelled as this runtime's acceptance.
- Reject malformed nested attribution metadata before mobile rendering, avoiding a credit-formatting crash.
- Staging planner now rejects empty manifests, absent title guards, nonpositive indexes and escaping asset paths; tests cover title/empty regressions. Updated runbook's asset counts as observed counts, not permanent pins.
- Replaced conflicting self-merge paragraphs in all14 worker task files with a canonical execution contract and explicit worker/integrator roles. Updated task routing, existing-authorisation treatment, and bounded staging-bootstrap implementation task. No blanket new-task permission inferred.

## Observed checks
Node24.19.0. Dependencies in a temporary Python virtualenv. Initial corpus attempt lacked CairoSVG; installed pinned requirements. Next attempt hit tsx IPC EPERM; reran in fresh output with documented --tsx-no-ipc. Final corpus327 tests:320pass,0fail,7explicitDBskips. Backend/mobiletypes, static, asset-focused, capture, comparer and runner checks exit0. Runner returns2 INCOMPLETE because PostgreSQL was deliberately omitted locally. Focused attribution/loading14/14; extractor4/4; stagingplanner6/6. CI is responsible for real PostgreSQL topic-assets, protected-export, science and attribution checks; inspect integration PR for its actual outcome.

Fresh capture:313originals+170supplements=483, First234/Second249/Third0, Computer0, originalobjects equal packaged baseline. Lesson source/body files are unchanged by this consolidation. Private corpus logs/captures are not committed; sanitised results and asset plan are included.

## Still external or separate
- Actual staging target designation/provisioning, first-admin setup execution, phone build/observation. New STAGING-BOOTSTRAP task implements the missing setup capability without requiring cloud designation first.
- Source licensing distribution choice remains as recorded in YO_LICENSE/OWNER_DECISION.md; image recovery is not legal clearance or owner acceptance.
- Protected baseline provenance; specific sequence policy approval; remaining school-specific choices and practical observations.
- EVIDENCE1 offline package was inspected earlier in this conversation, but its scratch upload is absent in this current workspace snapshot. It was NOT applied here. Do not claim its historical-search results as independently reproduced. Integrator needs exact files(20).zip or published branch; no repeat of the search is assigned.
- No production connection, import, migration, deployment or teacher/practical certification.
