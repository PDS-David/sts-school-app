# CHEM-LES-T1A-W04-SYMBOLS-VALENCY-GAPS — missing symbols and valencies

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification remains DEFERRED; IUPAC webpage reuse terms remain PENDING.

## Source gaps

- Source: `SS1-SRC-58b4a44c3afa`, 1st Term Chemistry.
- Week Four: `ELEMENTS, SYMBOLS & VALENCY`, mammoth lines 608–867; block SHA-256 `4aea3a2b6e25c43d020c89763df5216007c01031981f9040d4373a57b580dd9c`.
- Evaluation question 703 asks for silicon's symbol; silicon appears only in the metalloid sentence at line 715, without a symbol.
- Theory question 1(b), lines 857–859, asks for manganese, caesium and cobalt symbols; none appears in the source symbol tables.
- General evaluation question 825(a)(b), line 825, and weekend question 837 ask for oxygen and potassium valencies; neither has a row in the source valency table.
- The original source text has not been edited.

## Implementation

Added `SUP-SS1-CHEM-T1A-W04-SYMBOLS-VALENCY-GAPS` to `backend/src/db/ss1/subjects/chemistry.json`.

The supplementary lesson teaches:
- Silicon: Si
- Manganese: Mn
- Caesium: Cs
- Cobalt: Co
- Oxygen: common valency 2; common oxide ion O²⁻
- Potassium: common valency 1; common ion K⁺
- Charge balance in potassium oxide: K₂O

The lesson explicitly distinguishes a positive-number valency from an ion's signed charge. It does not assign one universal valency to transition metals. Three keyed practice questions have integer marking criteria (8 marks total).

Both `COV-CHEM-T1A-W04-SYMBOLS-GAPS` and `COV-CHEM-T1A-W04-VALENCY-GAPS` are now `IMPLEMENTED_EQUIVALENT` and bind to the supplementary lesson.

## Provenance

- IUPAC, Periodic Table of Elements: https://iupac.org/what-we-do/periodic-table-of-elements/
- OpenStax, *Chemistry 2e*, section 2.6, “Ionic and Molecular Compounds”: https://openstax.org/books/chemistry-2e/pages/2-6-ionic-and-molecular-compounds

The OpenStax material is CC BY 4.0 and is attributed in the package. IUPAC symbol facts are paraphrased; webpage reuse terms were not established and remain PENDING.

## Integrity and release state

- Lesson body SHA-256: `a3ffc5a4637e422deea4ba66fe91c751f498135f40e16c5d51185b461807dfb0`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Tests, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
