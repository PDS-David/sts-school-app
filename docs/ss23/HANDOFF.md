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

The owner re-attached the two combined archives on 2026-11-16. They remain private and are not committed to the repository. Direct inspection confirms:

| Archive | SHA-256 | Members | Term folders |
|---|---|---:|---|
| `SSS 2-20260507T072840Z-3-001.zip` | `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153` | 61 | T1 19; T2 22; T3 20 |
| `SSS 3-20260507T072839Z-3-001.zip` | `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741` | 39 | T1 19; T2 20; T3 0 |

Both ZIP integrity checks pass. These exact outer hashes and member counts match the combined-archive receipt in `sources/RECEIPT_20261113.md`. Its multiset comparison reports 96 exact member matches against the 100-row `SOURCE_ASSIGNMENTS.csv`; four received documents are alternate content versions and must remain separately identified pending owner choice:

- SS2 T2 `ECONOMICS (1).docx`
- SS2 T3 `3RD TERM S2 FURTHER MATHEMATICS.docx`
- SS3 T1 `MATHS.docx`
- SS3 T1 `1ST TERM S3 ECONOMICS.docx`

Do not silently overwrite the old register or choose between these versions. The exact old/new hashes and byte counts are in `RECEIPT_20261113.md` and `RECEIPT_DIFFS_20261113.csv`.

Direct duplicate-content checks on the re-attached archives confirm:
1. SS3 Literature in English T1 and T2 are byte-identical; this does not establish a distinct T2 source.
2. SS2 `F _ N (1) (1).docx` in the T2 folder is byte-identical to T1 `F _ N (1).docx`; the other SS2 T2 Food & Nutrition file is a distinct version.
3. Historical register notes also identify repeated Book-keeping bodies across T1/T2; verify actual body/header distinctions before treating them as separate instructional coverage.

The received SS3 archive contains no Third-Term source. SS3 scope is exam preparation ONLY (WAEC, NECO and JAMB): revision, verified past-question practice, mocks, marking, feedback and reassessment. Do not create or import new SS3 instructional-topic lessons. This is a fixed owner instruction, not an open policy decision.

Source filenames are not sufficient to certify subject/class/term. Continue document-header and body verification, including tables, embedded visuals, equations and week/topic labels. Do not infer missing content or invent replacements.

## 5. Work queue

| ID | Task | Status / next action |
|---|---|---|
| SS23-00 | Baseline and package-contract infrastructure | Implemented and merged; see PR history in `CHECKPOINT.md`. |
| SS23-S0 | Archive hash and member inventory | Combined archives re-received and outer hashes/member counts verified; 96/100 member identities match, with four alternate versions explicitly held. Continue source-header verification. |
| SS23-S1 | Verify each member's document-header subject/class/term against its assignment | In progress from re-attached combined archives; 96 member matches are pinned, four alternate versions are held, and document-header/body mapping remains to be verified. Update `mapping_status` only with direct evidence. |
| SS23-Q | Student-delivery safeguards | Implemented and merged; pending SS2/SS3 lessons remain fail-closed. Re-run integration checks after package changes. |
| SS23-02 | SS2 Agricultural Science | Draft package implemented and merged; technical, source, assessment and teacher-approval blockers remain. Continue closing these from original pages and documented subject-lead decisions. |
| SS23-03 | SS2 Biology | Next subject after the Agriculture gate and source archive availability. Do not create a package from filenames or inferred topics. |
| SS23-04+ | Remaining SS2 subjects | Continue alphabetically, one subject per focused PR, only after source files are available and assigned. |
| SS23-SS3 | SS3 exam preparation | Build exam-preparation packages only, with declared WAEC/NECO/JAMB targets and verified past-question sources. No normal SS3 instructional lessons. |

## 6. Exact resume procedure

1. Check current master, open PRs, and active branches before touching files. Avoid overlapping another agent's work.
2. Use the two re-attached combined archives. Their outer hashes are pinned in `sources/RECEIPT_20261113.md`; preserve the four alternate member versions without silent substitution.
3. Continue member/header verification from the re-attached archives; preserve source files privately and inspect DOC/DOCX tables, PPTX slides, images, equations, and page references directly.
4. Continue the Agricultural Science open blockers first. Do not advance the subject sequence until its source, assessment, and teacher-approval gates are satisfied.
5. Then proceed to SS2 Biology and subsequent subjects alphabetically. Keep each task small, tested, and in a dedicated branch/PR.
6. For SS3, build only the approved exam-preparation scope. Keep pending packages inaccessible to students.

## 7. Useful commands

- Rebuild source inventory: `python3 -I scripts/ss23/build_source_inventory.py <dir-of-zips> docs/ss23/sources/SOURCE_ASSIGNMENTS.csv`
- SS23 validation: `npm run validate:ss23`
- SS23 tests: `npm run test:ss23`
- SS23 hash check: `npm run ss23:refresh-hashes -- --check`
- SS1 regression gate: `npm run validate:ss1`
- Backend typecheck (as CI runs it): `./node_modules/.bin/tsc --noEmit -p backend/tsconfig.json` (the root `npm run typecheck` also checks mobile; the backend package has no `typecheck` script)

Record commands actually run and their outcomes; never report a check as passed if it was not run.
