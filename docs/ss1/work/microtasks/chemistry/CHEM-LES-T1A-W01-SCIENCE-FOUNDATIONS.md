# CHEM-LES-T1A-W01-SCIENCE-FOUNDATIONS — original Week One supplement

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a separately authored supplement. The original source wording remains unchanged. Content approval is **PENDING** and verification is **DEFERRED**.

## Source evidence
- Source: `SS1-SRC-58b4a44c3afa`, `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member SHA-256: `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`.
- Source definition, branches and scientific-method statements are indexed in `CHEM-IDX-T1A-W01.md` at lines 103–149.
- The factual findings and authoritative references are recorded in `CHEM-FACT-T1A-W01-STATEMENTS.md`.
- Lesson body SHA-256: `6a03ec3b02553bf67822e57d8356df2afe3f963c3bcf4ad295dd7d843df09940`.

## Implementation
- Added `SUP-SS1-CHEM-T1A-W01-SCIENCE-FOUNDATIONS` to `backend/src/db/ss1/subjects/chemistry.json`.
- Teaches an iterative evidence-based inquiry cycle; observation, pattern, question, hypothesis and prediction; the difference between theories and laws; the three source-listed branches; and analytical chemistry and biochemistry as additional important areas.
- Includes original examples and seven practice questions with complete answers and criterion-level marking, totalling 26 marks.
- Updated `COV-CHEM-T1A-W01-DEFINITION`, `COV-CHEM-T1A-W01-BRANCHES` and `COV-CHEM-T1A-W01-METHOD` to `IMPLEMENTED_EQUIVALENT`, each linked to the new lesson with explicit evidence.
- Added blocking review item `CHEM-T1A-W01-SCIENCE-FOUNDATIONS-REVIEW`.
- Lesson state: content approval PENDING; implementation IMPLEMENTED; verification DEFERRED.

## Technical provenance
1. National Science Teaching Association, *Nature of Science*: https://www.nsta.org/nstas-official-positions/nature-science
2. National Research Council (2007), *Taking Science to School: Learning and Teaching Science in Grades K–8*, Chapter 5, pp. 132–133: https://www.nationalacademies.org/read/11625/chapter/7
3. University of Calgary, Chemistry Textbook, *The Scientific Method*: https://chem-textbook.ucalgary.ca/chapter-1-home/a1-scientific-method/
4. American Chemical Society, *Areas of Chemistry*: https://www.acs.org/careers/chemical-sciences/areas.html
5. Lehigh University Department of Chemistry, *Traditional Divisions*: https://chemistry.cas.lehigh.edu/research/traditional-divisions
6. IUPAC, *Compendium of Chemical Terminology (Gold Book)*, Version 5.0.0 (2025): https://goldbook.iupac.org/

All lesson wording, examples and questions are original. No third-party passage, figure or diagram is reproduced.

## Verification and next action
- Package and queue JSON syntax checked before commit.
- Seven question mark totals checked against their marking criteria (all match; 26 marks).
- Coverage links, lesson ID, provenance fields, and approval/verification states checked.
- No package test, TypeScript, registered-subject compiler/importer, database or device checks run; testing remains deferred.
- Next action: run Chemistry package validation and the registered-subject compiler workflow when the owner-authorised gate is available; fix actual errors without weakening validation. Then continue the remaining Chemistry queue items.
