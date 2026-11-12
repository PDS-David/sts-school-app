# SS1 Yoruba — Week 8 EDE lesson implementation

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; orthography review and runtime verification remain outstanding.

## Source evidence
- Source: `SS1-SRC-4cc6aae9ed7d`, `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`.
- Source member SHA-256: `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`.
- Week: `OSE KEJO`; EDE body DOCX paragraphs 940–970; Mammoth raw-text lines 1879–1977.
- Reproducible paragraph-text SHA-256: `545c933a36bd3f2e3ac99c3ebb05364689846485505781c8dd31f679c1e4ac69`.
- Scheme mapping is positional (eighth EDE/ASA/LIT triple) and recorded in `YO-INV-T3.md`; the source itself has no numbered week label in the scheme.

## Implementation
- Added `SUP-SS1-YO-T3-W08-EDE` to `backend/src/db/ss1/subjects/yoruba.json`.
- Authored original teaching notes on argumentative essays: definition, two opposing positions, essay structure, linking expressions, a worked outline and practice prompts.
- Added two original answered practice questions (4 and 6 marks); each marking scheme totals exactly the question marks.
- Added coverage record `YO-T3-W08-SCHEME-EDE`, linked to the lesson. Status remains PARTIAL because the lesson package is a first authored delivery slice, not proof that every scheme sub-objective and every source exercise has been exhaustively reconciled.
- Added `YORUBA-T3-W08-ORTHOGRAPHY-REVIEW`. The source has no tone marks or under-dotted vowels; the authored marked Yoruba must be reviewed by a competent Yoruba-language reviewer before approval.

## Integrity and limits
- Lesson body SHA-256: `6fd9554a6bfa112f52e4d06f6c1722a5784bec549e41f4f94c67db8a6d81e671`.
- JSON was parsed after construction; lesson ID checked for uniqueness; practice mark totals checked (4/4 and 6/6).
- No typecheck, test suite, importer, database, student API/UI or device test was run. Verification remains DEFERRED.
- ASA and LITIRESO Week 8 are not implemented in this change. Their source gaps and missing teaching require separate authored lessons and evidence.
