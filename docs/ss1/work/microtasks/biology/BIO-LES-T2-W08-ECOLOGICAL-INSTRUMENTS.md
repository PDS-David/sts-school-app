# BIO-LES-T2-W08-ECOLOGICAL-INSTRUMENTS — implementation audit

Status: **IMPLEMENTED — TESTING DEFERRED; CONTENT APPROVAL PENDING.**

## Source identity
- Source: `SS1-SRC-eb6e9665f42c`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`
- Week 8 label block 683; topic block 684; instrument heading block 726; native source table block 728.
- Archive/member integrity was verified in the current work session. The original archive and DOC remain unchanged and are not committed.

## Registered lesson
- Lesson ID: `SUP-SS1-BIOLOGY-T2-W08-ECOLOGICAL-INSTRUMENTS`
- Lesson title: Supplementary Lesson: Measuring Ecological Factors
- Lesson body SHA-256: `c882d2990a744277e9330d3a5a04065c190cbc4f6225926a2ffb129cb5e4eb00`
- Six objectives explain ecological measurement, source instruments, common measurement functions, the hydrometer error, pH/colorimeter/Secchi distinctions and the sweep-net limitation.
- Ten keyed practice questions with criterion-level marking; total **14 marks**.
- No image asset is required. The native 12×3 source table is restated as a semantic three-column table (letter, instrument, source-stated use).

## Source preservation and fact-check distinctions
- All eleven source rows are preserved in order, including the source pairing “Hydrometer — Light intensity in water”.
- The source spelling `Rainguage` is preserved in the source table.
- A separate fact-check note records that a hydrometer measures liquid relative density/specific gravity, not light.
- The lesson distinguishes a pH meter/indicator from a colorimeter, and describes a Secchi disc as estimating water transparency.
- A sweep insect net collects insects for sampling; it does not by itself calculate population size.
- No practical field procedures, sample quantities, chemical handling steps or safety instructions were added.
- Teacher approval of the corrected supplemental wording remains pending.

## Package and queue changes
- Added the supplement to `backend/src/db/ss1/subjects/biology.json`.
- Mapped `COV-BIO-T2-W08-ECOLOGICAL-INSTRUMENTS` to the new lesson as IMPLEMENTED_EQUIVALENT.
- Updated `BIOLOGY-T2-W08-COVERAGE` to clarify that population characteristics/studies remain without a lesson; the instruments lesson does not claim to complete all Week 8 teaching.
- Preserved the teacher approval gate for the hydrometer correction, the missing overpopulation teaching and the unresolved wider Week 8 assessment.
- Updated `BIO-LES-T2-W08-ECOLOGICAL-INSTRUMENTS` to IMPLEMENTED_TESTING_DEFERRED.
- Queue counts: 128 IMPLEMENTED_TESTING_DEFERRED, 17 BLOCKED, 23 PENDING.

## Verification boundary
Source identity, table locators, package JSON, lesson body hash, 10-question/14-mark practice, coverage and queue reconciliation were inspected. Zod/package schema execution, importer/compiler, TypeScript checks, database rehearsal, production import and device testing were not run; owner-deferred verification remains in force. Content approval is PENDING and verification is DEFERRED.
