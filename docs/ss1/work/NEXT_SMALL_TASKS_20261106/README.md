# SS1: 24 bounded next tasks — 6 November 2026

Dispatch baseline: `8fb8415a0d326409c5720cc856c8f3f0eb1bb6a9`, plus the English attachment integration and two teaching-wording corrections in this commit. Always use current master.

Nine of the previous ten prompts are already on master. The tenth, ENG-LES-W06-DIPHTHONGS, is integrated in this commit from the supplied patch, with corrections. The attached Commerce Markdown is superseded by master’s completed disposition; it was not reapplied. Source disposition is complete, but the Commerce paired comparison is NOT yet implemented as student teaching.

## Publication and scheduling

No new PR is required per task if a normal push to master is permitted. Never force push or bypass branch rules. Different subjects can run concurrently. Use **one agent per subject**; same-subject tasks below must be sequential. Multiple free sessions can be used, but each gets one complete linked prompt, not the entire pack. Each prompt includes all required repo files and exact attachment member hashes. No source ZIP is needed if the listed member is attached.

Wave A: prompts 01–21, at most one per subject. Wave B: 22 after 02, 23 after 01, and 24 after 04 are published. They need not wait for unrelated subjects. Owners should run only as many simultaneous agents as they can supply with the required standalone documents.

Full manual testing and release remain deferred. Automatic CI is not disabled. A successful workflow does not certify curriculum coverage or prove deployment.

## How much remains

After this integration: **302 implemented/testing-deferred queue items, 968 pending and 96 blocked**. Remaining tracked tasks: **1064**. There are **86 authored supplements**. All 21 subject packages still declare PENDING.

These are work-item counts, not missing-lesson counts or a percentage of curriculum completion. Source indexing may reveal new objectives, so the queue can grow even while real work is completed. Original lessons are separate from authored supplements; zero supplements does not mean a subject has no original content.

Coverage declarations: IMPLEMENTED_EQUIVALENT 175, MARKER 35, PARTIAL 552, SUPPORTED 16, UNRESOLVED 144. PARTIAL plus UNRESOLVED = 696 records; these may overlap body-level and objective-level mappings and are not unique gaps.

| Subject | Implemented/deferred | Pending | Blocked | Supplements |
|---|---:|---:|---:|---:|
| agricultural-science | 6 | 33 | 2 | 0 |
| biology | 7 | 53 | 3 | 0 |
| bookkeeping | 10 | 29 | 6 | 0 |
| catering-craft | 6 | 46 | 1 | 0 |
| chemistry | 8 | 96 | 1 | 0 |
| civic-education | 7 | 34 | 1 | 1 |
| commerce | 7 | 37 | 2 | 0 |
| data-processing | 7 | 41 | 2 | 1 |
| economics | 7 | 48 | 2 | 1 |
| english | 46 | 76 | 4 | 37 |
| financial-accounting | 5 | 40 | 1 | 0 |
| food-and-nutrition | 5 | 39 | 1 | 0 |
| french | 67 | 44 | 4 | 32 |
| further-mathematics | 25 | 57 | 7 | 8 |
| geography | 5 | 26 | 1 | 0 |
| government | 4 | 17 | 1 | 0 |
| literature | 6 | 24 | 1 | 0 |
| mathematics | 23 | 65 | 9 | 6 |
| physics | 6 | 56 | 8 | 0 |
| technical-drawing | 5 | 29 | 5 | 0 |
| yoruba | 40 | 78 | 34 | 0 |

Remaining task kinds: ASSET 7, BRANCH_COMPARISON 4, BRANCH_PORT 35, BRANCH_PORT_COMPARISON 14, CORRECTION_BINDING 27, FACTUAL_DEPENDENCY 147, FOUNDATION_REQUEST 1, LESSON 111, MISSING_MATERIAL 2, OWNER_APPROVAL 4, OWNER_DECISION 6, SCOPE_DECOMPOSITION 7, SOURCE_COMPARISON 1, SOURCE_MARKER_DISPOSITION 34, SOURCE_PREAMBLE_INDEXING 28, SOURCE_PRESERVATION 46, SOURCE_RULE 3, SOURCE_SECTION_INDEXING 9, SOURCE_WEEK_INDEXING 398, SOURCE_WEEK_INVENTORY 13, TEST 27, VISUAL_DISPOSITION 140.

Completion still requires source/objective coverage and missing teaching; figures/equations/assessment keys and exact correction bindings; genuine owner/reuse/content decisions; package readiness and runtime integration; then owner-authorised verification and release. These 24 tasks are the next bounded batch, not a claim to finish SS1.

## Dispatch table

| No. | Subject | Copy the complete prompt | Attach |
|---|---|---|---|
| 01 | english | [ENG-LES-W06-REVISION-KEYS](01_ENG-LES-W06-REVISION-KEYS.md) | 1ST TERM S1 ENGLISH LANGUAGE.doc |
| 02 | french | [FR-LES-T1-W04-AVOIR-SENTENCES](02_FR-LES-T1-W04-AVOIR-SENTENCES.md) | None |
| 03 | further-mathematics | [FM-LES-T1-W02-EQUATIONS](03_FM-LES-T1-W02-EQUATIONS.md) | None |
| 04 | commerce | [COM-FACT-T2-TBL-DOMFOR-CLAIMS](04_COM-FACT-T2-TBL-DOMFOR-CLAIMS.md) | None |
| 05 | agricultural-science | [AG-WK-T1-W01](05_AG-WK-T1-W01.md) | 1ST TERM S1 AGRICULTURAL SCIENCE.docx |
| 06 | biology | [BIO-WK-T1-W02](06_BIO-WK-T1-W02.md) | BIOLOGY 1 alfa term - Copy.docx |
| 07 | bookkeeping | [BK-VIS-T1-BRACE-W04](07_BK-VIS-T1-BRACE-W04.md) | book keeping.docx |
| 08 | catering-craft | [CC-IDX-T2-W02](08_CC-IDX-T2-W02.md) | 2ND TERM S1 CATERING CRAFT PRACTICES.doc |
| 09 | chemistry | [CHEM-IDX-T1A-W01](09_CHEM-IDX-T1A-W01.md) | 1ST TERM S1 CHEMISTRY.docx |
| 10 | civic-education | [CIV-WK-T1-W02](10_CIV-WK-T1-W02.md) | CIVIC SSS1.docx |
| 11 | data-processing | [DP-WK-T1-W02](11_DP-WK-T1-W02.md) | 1ST TERM S1 DATA PROCESSING.docx |
| 12 | economics | [ECON-WK-T1-W02](12_ECON-WK-T1-W02.md) | 1ST TERM S1 ECONOMICS (1) (1).doc |
| 13 | financial-accounting | [FA-WK-T1-W01](13_FA-WK-T1-W01.md) | 1ST TERM S1 FINANCIAL ACCOUNT.docx |
| 14 | food-and-nutrition | [FN-WK-T1-W01](14_FN-WK-T1-W01.md) | F _ N.docx |
| 15 | geography | [GEO-WK-T1-W01](15_GEO-WK-T1-W01.md) | 1ST TERM S1 GEOGRAPHY.doc |
| 16 | government | [GOV-WK-T1-W01](16_GOV-WK-T1-W01.md) | 1ST TERM S1 GOVERNMENT.doc |
| 17 | literature | [LIT-WK-T1-W01](17_LIT-WK-T1-W01.md) | LIT. IN ENGLISH.docx |
| 18 | mathematics | [MATH-WK-T1-W02](18_MATH-WK-T1-W02.md) | MATHss1.docx |
| 19 | physics | [PHYS-WK-T1-W02](19_PHYS-WK-T1-W02.md) | 1ST TERM S1 PHYSICS.doc |
| 20 | technical-drawing | [TD-SCH-W04](20_TD-SCH-W04.md) | 2ND TERM S1 TECHNICAL DRAWING.docx |
| 21 | yoruba | [YO-WK-T3-W11](21_YO-WK-T3-W11.md) | 3RD TERM S1 YORUBA.docx |
| 22 | french | [FR-LES-T1-W03-GREETING-SET](22_FR-LES-T1-W03-GREETING-SET.md) | None |
| 23 | english | [ENG-WK-T1-W07](23_ENG-WK-T1-W07.md) | 1ST TERM S1 ENGLISH LANGUAGE.doc |
| 24 | commerce | [COM-WK-T2-W02](24_COM-WK-T2-W02.md) | commerce.docx |

## Corrections made during integration

- English patch applies cleanly to dispatch baseline. Corrected the overgeneralisation that US equivalents always use vowel-plus-r (idea does not); avoided counting y as an ordinary vowel letter; the tour answer accepts its documented alternative instead of rejecting it. Original phonetics supplement unchanged. New lesson approval stays PENDING and verification DEFERRED.
- Further Mathematics Week 2 had both a correct biconditional and a contradictory “one way only” sentence. Clarified that the equal-base implication works in both directions for the same admissible base, and that equal values across different bases are a different claim. Updated the authored-body hash and live references. Source text and source hashes untouched. Historical port notes are superseded on this point.
- JSON/ID/hash/mark checks performed on changed packages only. No full tests, type checks, importer, database or device verification run.
