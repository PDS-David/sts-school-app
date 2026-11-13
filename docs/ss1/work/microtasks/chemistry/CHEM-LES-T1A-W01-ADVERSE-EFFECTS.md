# CHEM-LES-T1A-W01-ADVERSE-EFFECTS — original Week One supplement

Status: **IMPLEMENTED_TESTING_DEFERRED**. The original source gap is supplied by a separate, newly authored lesson. Content approval remains **PENDING** and verification remains **DEFERRED**. No owner or teacher approval is claimed.

## Task and source evidence
- Task: `CHEM-LES-T1A-W01-ADVERSE-EFFECTS`.
- Source: `SS1-SRC-58b4a44c3afa`, `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified against the owner-supplied ZIP).
- Source member SHA-256: `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` (verified).
- Week One body: mammoth 1.12.2 locator in `CHEM-IDX-T1A-W01.md`, lines 90–245, SHA-256 `8b348aa6be31cc15d603c4054646f4a0cdd0874c7c0cd38fd14c12fb3d3519f3`.
- The source asks “Mention five adverse effects of chemicals and how they can be controlled” at evaluation line 203 and weekend question line 227. The indexed Week One body contains no teaching section on adverse effects or controls. The original questions remain unchanged; this supplement is clearly labelled as newly authored material.

## Implementation
- Added `SUP-SS1-CHEM-T1A-W01-ADVERSE-EFFECTS` to `backend/src/db/ss1/subjects/chemistry.json`.
- Lesson body SHA-256: `210e76e83f7ec84f102dbef2348eb77abb4fbd009c245b8ae37706224c0b71c1`.
- Teaching covers hazard versus risk, four exposure routes, irritation, corrosive injury, acute poisoning/organ effects, sensitisation, chronic harm, environmental effects, the five-level hierarchy of controls and school-learner safety boundaries.
- Added six original keyed practice questions with marking criteria totalling 26 marks.
- Updated `COV-CHEM-T1A-W01-ADVERSE-EFFECTS` to `IMPLEMENTED_EQUIVALENT` and linked the lesson; evidence explicitly says the source itself has no teaching text.
- Added blocking owner/teacher review item `CHEM-T1A-W01-ADVERSE-EFFECTS-REVIEW`. The lesson state is content approval PENDING, implementation IMPLEMENTED, verification DEFERRED.

## Technical provenance
1. National Research Council (US) Committee on Prudent Practices in the Laboratory, *Prudent Practices in the Laboratory: Handling and Management of Chemical Hazards* (National Academies Press, 2011), Chapter 4, especially sections 4.B and 4.C. This supports hazard classification, exposure routes, acute/chronic effects, corrosives, irritants, sensitizers, asphyxiants and systemic effects. https://www.ncbi.nlm.nih.gov/books/NBK55880/
2. CDC/NIOSH, *Hierarchy of Controls*, 10 April 2024, overview and the five control levels. https://www.cdc.gov/niosh/hierarchy-of-controls/about/index.html
3. World Health Organization, *Chemical safety*, overview and public-health concern. https://www.who.int/health-topics/chemical-safety

All lesson wording, examples and questions are newly authored. No third-party passage, diagram or image is reproduced. No treatment, dose, improvised first aid, spill-cleanup procedure or unsupervised laboratory method is prescribed.

## Verification and remaining work
- Verified the composite archive hash and all four Chemistry source-member hashes against the registered values.
- Checked the lesson body SHA-256 and the marking totals while authoring.
- JSON syntax is checked before committing.
- **Not run:** Chemistry package test, TypeScript, registered-subject compiler/importer, database or device checks. The task and queue retain testing-deferred status.
- Next action: run the repository's Chemistry package and registered-subject compiler workflow when the owner-authorised testing gate is available; resolve any actual errors. Then continue the next Chemistry queue task. Do not mark content approved or classroom verified without evidence.
