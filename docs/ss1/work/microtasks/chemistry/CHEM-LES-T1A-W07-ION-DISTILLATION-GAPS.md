# CHEM-LES-T1A-W07-ION-DISTILLATION-GAPS — ions and distillation order

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification remains DEFERRED; PubChem reuse terms remain PENDING.

## Source gap

- Source: `SS1-SRC-58b4a44c3afa`, 1st Term Chemistry.
- Week Seven: `PARTICULATE NATURE OF MATTER`, mammoth lines 1336–1489; block SHA-256 `8afae8fe7429d6acf133b984dc4a283f6eb0c848477350e2c19cff942ebfb66d`.
- Evaluation question 1403 parts (i) and (iii), general evaluation question 1447 and theory question 1485 require the hydrogen cation in sulfuric acid, the iron cation in FeSO₄, ion formation and the order of distillation.
- The source gives iron as +2 or +3 at line 783 but does not select the charge for FeSO₄. The source's typed `H2S04` uses zero in place of the letter O.
- The source supplies none of the required explanations in its Week Seven teaching. No later-week content was used to fill the gap.

## Implementation

Added `SUP-SS1-CHEM-T1A-W07-ION-DISTILLATION-GAPS` to `backend/src/db/ss1/subjects/chemistry.json`.

The supplement teaches:
1. Sulfuric acid's correct formula H₂SO₄ and its first ionisation in water; H⁺ is common shorthand, while H₃O⁺ is the more accurate aqueous representation.
2. FeSO₄ contains Fe²⁺ because sulfate is SO₄²⁻ and the formula unit must be neutral.
3. Atoms become cations by losing electrons and anions by gaining electrons.
4. The lower-boiling, more volatile component is enriched in the early distillate; the first distillate is not necessarily pure.

Four original practice questions have complete answers and integer marking criteria (8 marks total). Coverage `COV-CHEM-T1A-W07-ION-GAPS` and `COV-CHEM-T1A-W07-DISTILLATION-ORDER-GAP` are now `IMPLEMENTED_EQUIVALENT` and bind to the supplement.

The lesson describes ideas in words only. It gives no laboratory procedure, heating, handling or disposal instructions.

## Provenance

- OpenStax, *Chemistry: Atoms First 2e*, section 14.5, “Polyprotic Acids”: https://openstax.org/books/chemistry-atoms-first-2e/pages/14-5-polyprotic-acids
- PubChem, Ferrous Sulfate (CID 24393): https://pubchem.ncbi.nlm.nih.gov/compound/24393
- OpenStax, *Chemistry: Atoms First 2e*, section 11.4, “Colligative Properties”: https://openstax.org/books/chemistry-atoms-first-2e/pages/11-4-colligative-properties

OpenStax content is CC BY 4.0 and attributed in the package. PubChem aggregates depositor data with differing underlying reuse terms, so reuse remains PENDING; no blanket permission is claimed.

## Integrity and release state

- Lesson body SHA-256: `b1417903774585080f9140a0523b42e802b9b4423810a61e7012860672b9507b`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Tests, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
