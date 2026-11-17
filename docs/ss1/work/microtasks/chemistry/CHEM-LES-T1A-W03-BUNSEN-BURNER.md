# CHEM-LES-T1A-W03-BUNSEN-BURNER — missing function of the Bunsen burner

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification remains DEFERRED; third-party reuse terms remain PENDING except for the cited public-domain government safety guide.

## Source gap

- Source: `SS1-SRC-58b4a44c3afa`, 1st Term Chemistry.
- Week Three: `NATURE OF MATTER`, mammoth lines 416–607; block SHA-256 `7dac5adad12109abcc1f79c7f76006f9f6195bcc548ce4bf4c72e4ea1e57ebc2`.
- General evaluation/revision question 573(c) asks for the function of a Bunsen burner.
- Week Three does not teach the function. Week Two names the burner in the apparatus list at line 269 but provides no Bunsen-burner entry in lines 273–325.
- The source wording has not been edited.

## Implementation

Added `SUP-SS1-CHEM-T1A-W03-BUNSEN-BURNER-FUNCTION` to `backend/src/db/ss1/subjects/chemistry.json`.

The original supplementary lesson:
- identifies the Bunsen burner as a heating apparatus;
- explains that it provides a flame as a heat source;
- distinguishes it from measuring and supporting apparatus;
- gives basic safety boundaries without providing a lighting procedure or authorising independent student practical work;
- includes three keyed practice questions with integer marking criteria (6 marks total).

Coverage `COV-CHEM-T1A-W03-REVISION-APPARATUS` is now `IMPLEMENTED_EQUIVALENT` and binds to the new lesson.

## Provenance

- American Chemical Society, “Lab & Safety Equipment”: https://www.acs.org/education/policies/middle-and-high-school-chemistry/classroom-and-lab-facilities/safety-equipment.html
- U.S. Consumer Product Safety Commission and National Institute for Occupational Safety and Health, *School Chemistry Laboratory Safety Guide*, DHHS (NIOSH) Publication No. 2007–107, student general work procedure, PDF page 6: https://www.cdc.gov/niosh/docs/2007-107/pdfs/2007-107.pdf

Only paraphrased instructional facts were added. The NIOSH publication states it is public domain; the ACS webpage reuse terms are not established and remain PENDING.

## Integrity and release state

- Lesson body SHA-256: `3486931c1d44c96d92ff38e158c51306d1a23667bb1b48ff491032897137ace3`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Tests, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
