# Primary 1–6 curriculum source audit and completion status

**Audit date:** 18 November 2026  
**Repository:** `PDS-David/sts-school-app`  
**Base:** `master` at `d3f7618f0cfaaf5e2463ad03751a6c4e2d8a7a1d`  
**Working branch:** `curriculum/primary1-6-source-audit-20261118`  
**Scope:** Primary 1, Primary 2, Primary 3, Primary 4, Primary 5 and Primary 6; all three terms.

## Executive result

The six original Primary archives were found in the user's Library and hashed. They contain **267 Word-document entries** across six outer ZIP archives totalling **604,056,105 bytes (576.1 MiB)**, plus 18 nested term ZIPs. A 198-cell subject/term comparison baseline has been generated (11 seeded subjects × 3 terms × 6 classes). This is a source crosswalk, not a declaration that every seeded subject is approved for every class.

**No Primary class is marked curriculum-complete or student-delivery-complete.** The repository does not yet contain Primary source assets or a live Primary assessment-delivery proof. The historical importer snapshot is not a fresh six-class dry run.

## Source archive identity

The exact archive SHA-256 values, byte sizes, nested term archive hashes and all 267 document-member hashes are recorded in `PRIMARY1_6_SOURCE_INVENTORY.json`. The 6 archives are:

| Class | Supplied archive | SHA-256 |
|---|---|---|
| Primary 1 | `BASIC ONE-20260507T065845Z-3-001(1).zip` | `ef1f88a36002a621357191f7a8d6a3e839c5ac4db021604bcb59f3237ce637b0` |
| Primary 2 | `BASIC TWO-20260507T065903Z-3-001(1).zip` | `cbb5aacb7b4477d2b2eb126ade0a2639f1ad26a92a935bd4658322a56e848b9f` |
| Primary 3 | `BASIC THREE-20260507T065900Z-3-001(1).zip` | `cdc7c24e669cc464b8a8d37389c4f4f997df5446b0162a33f9fefbe8c22b61f3` |
| Primary 4 | `BASIC FOUR-20260507T065839Z-3-001(2).zip` | `69731806a1c59185a4d5f8f408cb87fb0897778265d654676e134615b88d4da5` |
| Primary 5 | `BASIC FIVE-20260506T172525Z-3-001(1).zip` | `1cb76583aaa8ecf145e1cd394a3c72be06c34432f625b45c61f6d3af4fe8e4b4` |
| Primary 6 | `BASIC SIX-20260507T065850Z-3-001(1).zip` | `59d6cbebc0542f5d6edded151c18499658c101a208fc6c362bec2a2645d2a466` |

The Primary 4 archive hash matches the archive hash recorded in the existing Primary 4 reconciliation report. Original archives were not modified or copied into the repository; hashes and member inventory are committed as provenance.

## Subject/term coverage baseline

The CSV contains all 198 class/subject/term cells, source filenames, retained source-stream counts, historical imported-row counts and issue flags.

| Class | Source-present cells* | Unresolved cross-class duplicate cells | No retained source cells | Approved researched-package cells |
|---|---:|---:|---:|---:|
| Primary 1 | 28 | 1 | 5 | 0 |
| Primary 2 | 29 | 2 | 4 | 0 |
| Primary 3 | 26 | 0 | 7 | 0 |
| Primary 4 | 28 | 0 | 0 | 5 |
| Primary 5 | 27 | 0 | 6 | 0 |
| Primary 6 | 27 | 1 | 6 | 0 |

\*Source-present includes cells currently blocked by unresolved duplicate identity; it does not mean the lesson content, answers, assets or student delivery are complete. The Primary 4 five source gaps are covered by the approved researched package, but remain pending a live import and learner-delivery verification.

Across the six classes, the 198-cell baseline has 165 source-present cells, 28 cells with no retained source, and 5 Primary 4 researched-package cells. Four cells are blocked by two unresolved cross-class duplicate groups. All cells remain audit-pending.

### Source gaps and subject-scope decisions

The 11-subject list is the existing global Primary seed list, not proof of each class's approved subject offering. In particular:

- Primary 1–3 require a school curriculum-version/term crosswalk against the 2025 revised NERDC Primary 1–3 curriculum. The existing audit documents the difference between the revised subject groups and the legacy school subject seed. Do not delete or rename legacy subjects or invent term allocations.
- Primary 5–6 class-specific subject offerings have not been independently approved in the repository. A missing source file may mean a source gap or a subject not offered; it must not be silently filled.
- The 28 no-retained-source cells are itemized in the CSV. They are not populated with invented topics.

## Verified source-extraction repairs

The historical Primary importer used `word-extractor` for legacy `.doc` files. For three Primary 1 First-Term files, that projection lost detailed lesson blocks. LibreOffice PDF export followed by Poppler text extraction recovered the source's explicit week blocks:

| Primary 1 source | Historical rows | Recovered explicit blocks |
|---|---:|---:|
| English Language, First Term | 2 | 10 |
| Basic Science, First Term | 2 | 9 (Week 4&5 is one combined source block) |
| Cultural & Creative Arts, First Term | 1 | 5 |

This branch adds exact-hash-bound source-text recovery for those three documents. It does not rewrite the original archives or create new curriculum topics. The source member SHA-256, outer archive SHA-256, extraction tool versions and recovered-text hash are stored with the override data. The parser is also extended to preserve explicit slash week labels such as `2/3` and `6/8`.

The recovery is not counted as passed until the focused CI test proves the parser returns 10, 9 and 5 blocks respectively.

## Source-identity decisions and fixes

The archive contains five cross-class byte-identical groups:

1. Primary 1 PHE Second Term / Primary 2 PHE Third Term — existing exact exclusions retain the correctly assigned Primary 1 source.
2. Primary 1 Mathematics Second Term / Primary 2 Mathematics Third Term — **unresolved owner decision**; both class/term cells remain blocked.
3. Primary 2 Social Studies Third Term / Primary 6 Social Studies Third Term — **unresolved owner decision**; both class/term cells remain blocked.
4. Primary 3 Home Economics Second Term / Primary 4 Home Economics Third Term — Primary 3 is a misfiled Primary 4 source. This branch adds the missing `_1` duplicate filename to the exact exclusion, so both P3 copies are excluded.
5. Primary 3 Agricultural Science Third Term / Primary 4 Agricultural Science Third Term — the owner-approved decision to keep both classes is already recorded. This branch acknowledges the P3 `_1` duplicate copy as well as the canonical filename so the importer does not block on the second archive copy.

The two unresolved duplicate groups are intentionally not auto-approved.

The Primary 5 First-Term folder is governed by the existing nine-file allowlist. An anonymous extra `.docx` in that folder has a damaged embedded-media CRC and non-curriculum personal material; it is excluded by the allowlist. No personal text is reproduced in the inventory or report.

## Primary 4 status already in master

The merged Primary 4 package contains a 248-row source manifest covering 28 of 33 seeded subject/term cells, 38 researched lessons for the five missing cells, 33 archive lesson-note corrections, and 16 superseded rows hidden from delivery. Its focused GitHub Actions run **43336010714** completed successfully (focused tests, coverage audit and backend build).

This is **repository/code-level completion only**. The Primary 4 reconciliation report explicitly does not perform a production import. The five approved researched cells are still not proven to be live or opened by a learner.

## Student delivery, answers, assessments and assets

The repository and latest project completion register show these delivery limitations:

- `curriculum-assets/` contains only `jss3`; there is no Primary 1–6 asset directory or Primary asset manifest. Source-document images have not been mapped to Primary lessons and verified through the student UI.
- The existing student Learning screen obtains a school-wide subject list rather than a class-specific approved subject list. This is already documented in the Primary 1–3 delivery audit.
- The 18 November production snapshot records Primary 1–5 roster counts (8, 15, 9, 16 and 9 respectively) and no Primary 6 roster entry. It records no teacher users, teacher-subject assignments or parent-ward links.
- The question-bank pilot contains six AI-generated questions, but they are not approved for student publication. The live snapshot still records zero assessments, zero assessment-question rows and zero submissions. A pilot question count is not an assessment or a completed student attempt.
- No Primary learner account, teacher account, parent account, live API session, emulator or physical-device journey was available for this audit. Actual lesson opening, answer submission, assessment scoring, image loading and progress persistence are therefore **NOT VERIFIED**.

No production database write, import, deployment or merge was performed.

## Historical importer baseline (not current completion evidence)

The Library file `primary-curriculum-audit-commit15.txt` records a historical 7 October 2026 run: 267 candidate files, 174 parsed files, 1,487 topic rows, 74 very-short source-text rows, 85 duplicate files ignored and 8 verified exclusions. Its result was `AUDIT BLOCKED`. It predates the current Primary 4 package and the source-resolution changes in this branch. The independent archive inventory groups 172 retained class/term/subject source streams after the exact rules; the two-file-count difference from the historical parser must be reconciled by a fresh run.

## Files changed on this branch

- `backend/src/db/primarySourceTextOverrides.ts` — exact-hash-bound recovery text for the three Primary 1 First-Term legacy `.doc` sources.
- `backend/src/db/primaryCurriculumResolutions.ts` — exclude the second byte-identical P3 Home Economics misfile and acknowledge the P3 Agricultural Science `_1` copy against the existing owner decision.
- `backend/src/db/ingestTopics.ts` — pass original source SHA-256 to the recovery resolver and accept explicit slash-separated week labels.
- `tests/primary-subject-resolutions.test.mts` — source-resolution, duplicate and recovered parser-block regression tests.
- `tests/primary1-6-source-inventory.test.mts` — structural integrity checks for the 6-class inventory and 198-cell coverage matrix.
- `.github/workflows/primary1-6-source-audit.yml` — focused CI for the source-resolution and inventory tests.
- `docs/curriculum/primary1-6/PRIMARY1_6_SOURCE_INVENTORY.json` — archive/member hashes, source dispositions, duplicate groups and evidence.
- `docs/curriculum/primary1-6/PRIMARY1_6_COVERAGE_BASELINE.csv` — 198-cell subject/term crosswalk.
- `docs/curriculum/primary1-6/PRIMARY1_6_COMPLETION_STATUS.md` — this report.

## Required before any class can be marked complete

1. Run a fresh six-class importer dry run against the exact archives and current branch; reconcile the 172-vs-174 source-stream discrepancy and every warning.
2. Obtain owner decisions for the Primary 1/Primary 2 Mathematics and Primary 2/Primary 6 Social Studies duplicate pairs.
3. Confirm the approved class-specific subject offerings and curriculum versions, especially Primary 1–3 and Primary 5–6.
4. Resolve the 28 source gaps with supplied authoritative material or an explicit not-applicable decision; do not invent content.
5. Review every retained lesson body, answer key, assessment and source asset. The historical 74 short-text rows need an item-level disposition.
6. Create/verify Primary source asset mappings and class-specific student subject navigation.
7. Obtain a read-only live export, import only after audit passes and approval, then verify student lesson opening, assessment attempt, answer scoring, asset loading and progress persistence with real test accounts. Primary 6 requires a roster/test learner before learner delivery can be verified.

**Current completion verdict: INCOMPLETE for Primary 1–6 as a whole. Primary 4 has the strongest completed repository package; no class has a verified live student-delivery sign-off.**