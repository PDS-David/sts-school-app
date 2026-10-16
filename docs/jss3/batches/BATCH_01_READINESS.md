# JSS3 Batch 1 — Baseline, Inputs and Handoff Readiness

Status: **Batch 1 complete (technical readiness established). Batch 2 awaits owner permission and has not started.**
Scope of this document: structural readiness only. It is not semantic closure and certifies no curriculum coverage.

## 1. Repository and baseline
- Repository: `PDS-David/sts-school-app`
- Default branch (verified with `git ls-remote --symref origin HEAD`): `master` (no `main` created)
- Baseline SHA: `e97477a006b0a7da142bf026a62a98819a38848d` (master HEAD, unchanged at time of check)
- Working branch: `jss3/batch1-baseline-20261016` (isolated git worktree; no other agents' changes touched)
- No `AGENTS.md` exists in the repository (searched recursively); the `docs/jss3` handoff documents were used instead.

## 2. Original-source package
- Package: `JSS3_NEXT_STAGE_INPUTS_20261016.zip` → `JSS3_NEXT_STAGE_INPUTS/`
- `SHA256SUMS`: 61 of 61 entries OK.
- `ALL/` holds the 39 original staged documents; `SOURCE_INVENTORY.csv` lists 39 documents plus the original Music RTF kept outside `ALL` (the importer uses the supplied Music DOCX). The RTF is not an importer source.
- The package is private. Source documents and full row bodies are **not** in this repository and must not be committed.

## 3. Baseline checks and observed results
Run with `python3 scripts/jss3/verify_handoff.py --inputs <package> --output <evidence>` after `npm ci --ignore-scripts`. All exit codes 0; `--tsx-no-ipc` was not needed.

| Check | Result |
|---|---|
| Backend type check (`tsc --noEmit -p backend/tsconfig.json`) | pass |
| Mobile type check (`tsc --noEmit -p mobile/tsconfig.json`) | pass |
| Static tests (student-launch, topic-assets) | pass |
| Full real-source JSS3 tests (10 files) | 151 tests, 151 pass, 0 fail, 0 skipped |
| Asset-focused tests (metadata, loading) | pass |
| Importer row capture (no `--yes`, no database connection) | pass |

Captured rows: 313 original + 41 attributed supplements = 354 (First Term 170, Second Term 184, Third Term 0). Computer Studies rows: 0. All 313 original row objects exactly equal the unmodified importer output. Importer SHA-256 `b54ad11a7ca44d570c48021251668c59e6bb15741a4e17644ced7e869d16d1ca`.

## 4. Missing semantic patch
`jss3-semantic-closure.patch` (reported local commit `756a8eb`, branch `jss3/semantic-completion-20261016-claude`) was not supplied and is not on the remote. It is recorded as **optional historical work not recovered**. It was not reconstructed from the summary spreadsheet. It is not required because the authoritative inputs and the repository review queue (section 5) are present. Its classifications, had they been available, were leads only.

## 5. Review queue supplied by the repository (structural check)
| File | Rows | Observed structure |
|---|---|---|
| `docs/jss3/LATEST_SOURCE_LINE_DISPOSITION.csv` | 585 | candidates `SL-001`…`SL-585`; `latest_disposition`: SEMANTIC_REVIEW_REQUIRED 328, TEXT_PRESENT_OBJECTIVE_NOT_CERTIFIED 102, DOCUMENT_STRUCTURE_OR_REFERENCE 113, OBJECTIVE_MAP_AVAILABLE 29, STRUCTURAL_WEEK_LABEL 6, PRIOR_EVIDENCE_RETAINED 6, ATTRIBUTED_REPLACEMENT 1 |
| `docs/jss3/SOURCE_LINE_RECONCILIATION.csv` | 585 | same 585 ids; UNRESOLVED 538, DISPROVED 47 |
| `docs/jss3/SEMANTIC_REVIEW_SUPPLEMENT_XREF.csv` | 328 | `SL-004`…`SL-585`, 328 unique ids; 1st Term 126, 2nd Term 111, 3rd Term 91 (third-term sources: instruction must be placed in First/Second); 6 supplement leads |
| `docs/jss3/replacements/CURRENT_COVERAGE.csv` | 63 | REPLACEMENT_IMPLEMENTED 54, OWNER_SOURCE_SELECTED 2, PROVENANCE_OR_MAPPING_OPEN 5, PARTIAL_REPLACEMENT 1, EXISTING_COVERAGE_VERIFIED 1 |
| `docs/jss3/replacements/YORUBA_OBJECTIVE_MAP.csv` | 24 | gaps YO-T1-W2, YO-T1-W8, YO-T2-W3…W9; coverage OWNER_AUTHORISED_REPLACEMENT 17, ORIGINAL_BODY 6, GENRE_RECOGNITION_PARTIAL 1 |

The 328 xref rows by subject: Agricultural Science 18, Basic Science 18, Basic Technology 23, Business Studies 17, Civic Education 44, Cultural and Creative Arts 4, English Language 58, Fine Art 8, French 18, Home Economics 24, Mathematics 31, Music 12, Physical & Health Education 16, Social Studies 6, Yoruba 31.

Open mapping identifiers in `CURRENT_COVERAGE.csv`: `EN2-03`, `YO-T1-MAP`, `YO-T2-MAP`, `YO-T3-MAP`, `YO-OWE` (PROVENANCE_OR_MAPPING_OPEN) and `YO-T1-W2` (PARTIAL_REPLACEMENT). Of the 231 xref rows needing an original row body, the bodies are not in Git: the private package and the captured rows are required.

Readiness verdict: the queue is internally consistent (585 = 585 ids; 328 xref ids all appear in the disposition file). This is a structural check only.

## 6. Files needed by the Batch 2 agent
- Repository: all files in section 5, plus `docs/jss3/NEXT_STAGE_EXECUTION_PROMPT.md`, `docs/jss3/CONTENT_GAPS_R9_UNCHANGED.csv`, `docs/jss3/replacements/YO_T1_W2_ORAL_PERFORMANCE_REVIEW.md`, `docs/jss3/replacements/TEACHING_SEQUENCE.md`, `docs/jss3/replacements/TEACHER_SCHEDULE_SUPPLEMENTS.csv`, `backend/src/db/data/jss3Supplements.json`, `backend/src/db/jss3Supplements.ts`, `backend/src/db/ingestTopics.ts`, `scripts/jss3/*`.
- Private (not in Git): the original-source package above and the Batch 1 evidence package (`JSS3_BATCH_01_BASELINE_AND_HANDOFF.zip`) with original and supplemented row captures.

## 7. Runtime limitation
Verified on Node 22.22.0 (Python with python-docx available). Node 24.19.0, the version named by the handoff, was **not tested** in this environment, and no claim of Node 24.19.0 verification is made.

## 8. Publication status
See the commit that carries this file and the Batch 1 package `STATE.json` for the exact remote status. The GitHub token in this environment is invalid and the GitHub account is not linked to the session; if the push did not reach `master`, the commit is exported as `BATCH_01_READINESS.patch`. Production import and deployment: not performed.

## 9. Next step
**Batch 2 awaits owner permission. It has not started.**
