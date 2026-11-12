# SS1 Yoruba — Week 8 EDE, ASA and LITIRESO lesson implementation

Status: **IMPLEMENTED_TESTING_DEFERRED**. Content approval remains PENDING; orthography review and runtime verification remain outstanding.

## Source evidence
- Source: `SS1-SRC-4cc6aae9ed7d`, `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`.
- Source member SHA-256: `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`.
- Week: `OSE KEJO`; scheme group 8 is the eighth unnumbered EDE/ASA/LIT triple in `YO-INV-T3.md`.
- EDE: DOCX paragraphs 940–970; paragraph-text SHA-256 `545c933a36bd3f2e3ac99c3ebb05364689846485505781c8dd31f679c1e4ac69`.
- ASA: DOCX paragraphs 978–1013; paragraph-text SHA-256 `a46daffc4bdbefe1d3f5039a968ec238dfa745f5c60a4f25a4328b5b31081553`.
- LITIRESO: DOCX paragraphs 1015–1047; paragraph-text SHA-256 `f23c0610909d29a04b5fdb27d45e6365360ffea99ea014bf40fddd927eac00af`.

## Implementation
Added three lessons to `backend/src/db/ss1/subjects/yoruba.json`:
- `SUP-SS1-YO-T3-W08-EDE`: argumentative essay definition, two positions, structure, linking expressions, worked outline and practice.
- `SUP-SS1-YO-T3-W08-ASA`: source-described funeral customs, careful cultural attribution, and respectful critical reading.
- `SUP-SS1-YO-T3-W08-LIT`: oral poetry, oku-pipe, iremoje and an analysis method.

Each lesson has two original practice questions, complete answers and marking criteria whose marks add exactly to the question totals. Each lesson has a body SHA-256, source locator, attribution and PENDING content approval / DEFERRED verification state.

Added three Week 8 strand coverage entries. They remain PARTIAL because the scheme contains material not adequately taught by the supplied body. Added explicit blockers:
- ASA: the scheme names child/adult burial, care of the dead and adult burial inside a house without adequate body teaching.
- LITIRESO: ijala, rara, olele and ege are not taught; igbala-sisin is listed but not explained.
- Orthography: the source is unmarked ASCII; tone marks, sub-dotted vowels and lexical choices in all three authored lessons require competent Yoruba-language review.

## Integrity and limits
- EDE body SHA-256: `6fd9554a6bfa112f52e4d06f6c1722a5784bec549e41f4f94c67db8a6d81e671`.
- ASA body SHA-256: `383eec001a9006d8bed80d81e2dbd46c0dac3a892f91ca2e8f71b654e4e055ad`.
- LITIRESO body SHA-256: `8ce9bfd2d74b87086502d7d585b47ce699f09ca2033eadeee9cabc356920ceb2`.
- JSON parsed after each update; lesson IDs checked for uniqueness; all six practice marking totals checked (4/4 and 6/6 per strand).
- No typecheck, test suite, importer, database, student API/UI or device test was run. Verification remains DEFERRED.
- This is one teaching slice only; other weeks and both earlier terms remain to be implemented and audited.
