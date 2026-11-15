# CHEM-LES-T1A-W08-OXIDATION-NUMBER-CALCULATION — calculation method

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification remains DEFERRED; ACS PDF reuse terms remain PENDING.

## Source gap

- Source: `SS1-SRC-58b4a44c3afa`, 1st Term Chemistry.
- Week Eight oxidation-number question blocks: mammoth lines 1490–1667; block SHA-256 `94be1f5931d2fc33a57fba5f16e7ee4eefd989cce64622163e00e82283c45038`.
- The source asks learners to calculate oxidation numbers for Fe/Cu, C, Mn and S examples but does not teach a general calculation method.
- This supplement is original teaching. It does not claim that the source taught the method or change the original source wording.

## Implementation

Added `SUP-SS1-CHEM-T1A-W08-OXIDATION-NUMBER-CALCULATION` to `backend/src/db/ss1/subjects/chemistry.json`.

The lesson explains:
- the meaning of oxidation number and how it differs from ionic charge;
- rules for free elements, monatomic ions, Group 1/2 metals, hydrogen, oxygen and fluorine;
- the sum rule for neutral compounds and charged polyatomic ions;
- a repeatable six-step calculation method;
- worked examples for Fe₂O₃, CuO, CO₂, KMnO₄ and H₂SO₄;
- the peroxide exception using H₂O₂.

Six original practice questions have complete worked answers and criterion-level marking (12 marks total). Coverage `COV-CHEM-T1A-W08-OXIDATION-NUMBER-METHOD` is now `IMPLEMENTED_EQUIVALENT` and binds to the lesson.

## Provenance

- OpenStax, *Chemistry 2e*, section 4.2, “Classifying Chemical Reactions”: https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions
- American Chemical Society, USNCO Coaching, “Oxidation Numbers”: https://www.acs.org/content/dam/acsorg/education/students/highschool/olympiad/2022coaching/2022-usnco-coaching-localprep-oxydation-and-reduction.pdf

OpenStax content is CC BY 4.0 and attributed in the package. The ACS PDF's reuse terms were not established; it is paraphrased and remains PENDING.

## Integrity and release state

- Lesson body SHA-256: `4909fde4f419f6fe9d0651dd93b4bebdd63483154ed08fd30e7064d41e3a14af`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Tests, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
