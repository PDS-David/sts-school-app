# SS2 / SS3 curriculum — agent handoff

Updated: 2026-11-16. Repository: `PDS-David/sts-school-app`; primary branch: `master`. Read this file, `CHECKPOINT.md`, and `sources/README.md` before resuming. The historical 2026-11-13 instructions below are superseded where marked.

## 1. Assignment

Complete SS2 instructional curriculum and SS3 exam-preparation curriculum, subject by subject, in small independently verifiable tasks. Find and resolve missing terms/weeks, shallow lessons, incorrect topic associations, incomplete assessment answers/explanations/marking guidance, broken source references, invalid hashes, and inaccessible lessons.

Preserve original-source provenance and distinguish authored supplements. Never fabricate source text or claim completion from tests alone. Implementation, source verification, assessment reconciliation, teacher approval, owner acceptance, and student release are separate gates.

## 2. Standing rules

- One scoped PR per subject or independent infrastructure task. Do not merge PRs or deploy/import without explicit owner authorization.
- Never weaken validation or tests to make a package pass.
- Do not commit extracted source archives or private conversions; retain them in private scratch.
- Do not invent curriculum content, source page references, answers, or teacher decisions. If evidence is absent, record the blocker.
- Keep all new units in draft/pending states until the source, assessment, approval, and release gates pass.
- Owner prefers sequential small steps, concise prompts and reports, and a clear account of completed work versus remaining work.

## 3. Current verified repository state

- Current master at this handoff: `5e0df2da9e322a31ded7641cef3081207574edf8`.
- SS23 package contract, validator, integrity workflow, and fail-closed student-delivery integration are merged. The delivery service has service and HTTP regression coverage. Pending SS2/SS3 content is not served to students.
- SS2 Agricultural Science is the only subject package currently implemented. PR #857 merged on 2026-11-16 (merge commit `5e0df2da9e322a31ded7641cef3081207574edf8`). It contains 19 draft units across T1/T2/T3 (8/6/5), with assessment/practice content and explicit open blockers. Package status remains `PENDING`; units remain `DRAFT`. Passing CI does not certify the curriculum or authorize delivery.
- The SS23 integrity, package-contract, source-map, SS1 integrity, and backend typecheck workflows passed for the latest Agricultural Science changes. See `CHECKPOINT.md` for run IDs and detailed blocker counts.
- No other SS2 subject package and no SS3 exam-preparation package is currently recorded as implemented.
- SS3 scope is exam preparation (WAEC/NECO/JAMB), not normal instructional progression. Substantive teaching ends by SS2. This is an owner-supplied project decision already reflected in the package contract; do not reopen it as an unresolved choice.
- The evidence-register documentation PR #858 is separate and must be reviewed before merge; it does not close any curriculum blocker.

## 4. Source archive status and limitations

The six original SS2/SS3 archives were supplied in an earlier session but are not committed to the repository and are not currently available in this working session. Their archive hashes and 100 per-member records are preserved in `sources/README.md` and `sources/SOURCE_ASSIGNMENTS.csv`. Re-attach the original archives before attempting source-page extraction or source-header re-verification. Verify each archive SHA-256 against the receipt before extraction.

Historical archive-audit findings that must be rechecked against the actual files before they are used to make curriculum decisions:

1. The SS3 Third-Term archive appeared empty apart from a folder entry.
2. No source member was found for Technical Drawing SS2 T1 and SS3 T1; Catering Craft SS2 T1, SS2 T3 and SS3 T1; and Food & Nutrition SS3 T2.
3. SS3 Literature T1 and T2 appeared byte-identical. The SS2 Food & Nutrition file named `F _ N (1) (1).docx` in the T2 folder appeared to be the T1 file; `F _ N (1).docx` appeared to be the actual T2 file.
4. Book-keeping T1 and T2 appeared identical after the title line for SS2 and SS3.
5. Some source files use term labels such as Alpha/Sigma, and SS2 T1 Data Processing is a PowerPoint. Verify document headers and contents rather than trusting filenames.
6. The previous week-marker heuristic was unreliable because schemes are stored in tables. Read tables and inspect original pages/figures; do not reuse that heuristic.

Do not treat these historical findings as newly verified facts until the archives are reattached and checked.

## 5. Work queue

| ID | Task | Status / next action |
|---|---|---|
| SS23-00 | Baseline and package-contract infrastructure | Implemented and merged; see PR history in `CHECKPOINT.md`. |
| SS23-S0 | Archive hash and member inventory | Historical inventory recorded; reverify archive hashes when the owner reattaches the six zips. |
| SS23-S1 | Verify each member's document-header subject/class/term against its assignment | Pending re-verification from the original archives. Update `mapping_status` only with direct evidence. |
| SS23-Q | Student-delivery safeguards | Implemented and merged; pending SS2/SS3 lessons remain fail-closed. Re-run integration checks after package changes. |
| SS23-02 | SS2 Agricultural Science | Draft package implemented and merged; technical, source, assessment and teacher-approval blockers remain. Continue closing these from original pages and documented subject-lead decisions. |
| SS23-03 | SS2 Biology | Next subject after the Agriculture gate and source archive availability. Do not create a package from filenames or inferred topics. |
| SS23-04+ | Remaining SS2 subjects | Continue alphabetically, one subject per focused PR, only after source files are available and assigned. |
| SS23-SS3 | SS3 exam preparation | Build exam-preparation packages only, with declared WAEC/NECO/JAMB targets and verified past-question sources. No normal SS3 instructional lessons. |

## 6. Exact resume procedure

1. Check current master, open PRs, and active branches before touching files. Avoid overlapping another agent's work.
2. Obtain the six original source archives in the current session. Verify archive hashes against `sources/README.md` before extracting.
3. Re-run the source-member inventory/header verification; preserve source files privately and inspect DOCX tables, PPTX slides, images, equations, and page references directly.
4. Continue the Agricultural Science open blockers first. Do not advance the subject sequence until its source, assessment, and teacher-approval gates are satisfied.
5. Then proceed to SS2 Biology and subsequent subjects alphabetically. Keep each task small, tested, and in a dedicated branch/PR.
6. For SS3, build only the approved exam-preparation scope. Keep pending packages inaccessible to students.

## 7. Useful commands

- Rebuild source inventory: `python3 -I scripts/ss23/build_source_inventory.py <dir-of-zips> docs/ss23/sources/SOURCE_ASSIGNMENTS.csv`
- SS23 validation: `npm run validate:ss23`
- SS23 tests: `npm run test:ss23`
- SS23 hash check: `npm run ss23:refresh-hashes -- --check`
- SS1 regression gate: `npm run validate:ss1`
- Backend typecheck: `npm run typecheck --workspace backend`

Record commands actually run and their outcomes; never report a check as passed if it was not run.
