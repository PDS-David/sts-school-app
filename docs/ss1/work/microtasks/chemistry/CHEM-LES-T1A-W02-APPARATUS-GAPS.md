# CHEM-LES-T1A-W02-APPARATUS-GAPS — pipettes and reagent bottles

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification remains DEFERRED. Third-party reuse permissions remain PENDING.

## Source gap retained

The source week is 1st Term Week Two, `LABORATORY FAMILIARIZATION`, mammoth lines 246–415 (week block SHA-256 `3064d93fa4b6050c3522c4be0fa06690cb505b4666a7508d80bcf2cd862e5d05`).

- General Evaluation question 379(b) asks for the use of a pipette.
- Weekend question 5 asks about coloured reagent bottles.
- The source's apparatus list names a pipette and reagent bottle at line 269, but it does not provide a separate pipette entry or explain reagent-bottle colours.
- The closest existing entry is the dropping-bottle/dropping-pipette paragraph at line 301. It is not treated as a full explanation of a measuring pipette.
- Original source wording has not been altered.

## Implementation

Added `SUP-SS1-CHEM-T1A-W02-PIPETTE-REAGENT-BOTTLES` to `backend/src/db/ss1/subjects/chemistry.json`.

The supplementary lesson explains:
1. What a pipette does.
2. The distinction between volumetric and graduated pipettes.
3. The use of a pipette filler and the prohibition on mouth pipetting.
4. The storage role of reagent bottles.
5. Why amber glass may be used for light-sensitive contents, without implying that every chemical requires an amber bottle.
6. Why learners must identify chemicals from labels and storage instructions, not bottle colour alone.

Five original practice questions have answer keys and integer marking criteria (10 marks total). The coverage row `COV-CHEM-T1A-W02-APPARATUS-GAPS` is now `IMPLEMENTED_EQUIVALENT` and binds to the supplementary lesson.

## Provenance

- University of York, Chemistry Teaching Labs, “Types of Pipettes”: https://chemtl.york.ac.uk/techniques/quantification/volumetrics/pippettes
- American Chemical Society, “Lab & Safety Equipment”: https://www.acs.org/education/policies/middle-and-high-school-chemistry/classroom-and-lab-facilities/safety-equipment.html
- DWK Life Sciences DURAN, amber reagent bottle technical description (distributed by Sigma-Aldrich): https://www.sigmaaldrich.com/US/en/product/aldrich/dwk211887301

Only paraphrased instructional facts were added. Reuse terms were not established for these webpages, so each provenance record remains `reuse_status: PENDING`; no permission is invented.

## Integrity and release state

- Lesson body SHA-256: `2dad1103bb6c9530272b2680e601c12f2ec62e5ae92f56b2a18fab459e64206d`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Testing, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
