# CHEM-LES-T1A-W06-SOLUBILITY-GAPS — missing solubility teaching

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification and third-party data reuse checks remain DEFERRED/PENDING.

## Source gap

- Source: `SS1-SRC-58b4a44c3afa`, 1st Term Chemistry.
- Week Six: `STANDARD SEPARATION TECHNIQUES`, mammoth lines 1116–1335; block SHA-256 `e5e147ad7fb2954b63f69d8c7c37c4e3d507cbdef6108d0c82ffec3c87bab478`.
- Evaluation question 1193 and general evaluation question 1295 require the solubility comparison for lead(II) chloride and sodium chloride.
- The source supplies no such comparison. The original source wording remains unchanged.

## Implementation

Added `SUP-SS1-CHEM-T1A-W06-SOLUBILITY-GAPS` to `backend/src/db/ss1/subjects/chemistry.json`.

The supplementary lesson explains:
- PbCl₂ is sparingly soluble in cold water and substantially more soluble in hot water.
- NaCl is readily soluble, with a comparatively modest change in solubility as temperature rises.
- NH₄Cl dissolves in water and its solubility increases with temperature.
- For a two-salt PbCl₂/NaCl mixture, the large solubility difference supports a conceptual discussion of dissolution, filtration and recovery by crystallisation.
- When NH₄Cl is also present, the claim that all PbCl₂ remains undissolved is too absolute: PubChem's peer-reviewed data report that lead(II) chloride is readily soluble in ammonium chloride solution.

The lesson deliberately gives no practical protocol, lead-compound handling instructions or disposal instructions. It also explains that a complete three-salt separation requires further verified equilibrium information and teacher-approved risk assessment.

Three keyed practice questions have integer marking criteria (6 marks total). Coverage `COV-CHEM-T1A-W06-SOLUBILITY-GAPS` is now `IMPLEMENTED_EQUIVALENT` and binds to the supplementary lesson.

## Provenance

- PubChem, Lead chloride (CID 24459): https://pubchem.ncbi.nlm.nih.gov/compound/Lead-chloride
- SIST EN 973:2009, sodium chloride solubility curve/table: https://preview.sist.si/sist-preview/30408/00c86efe3d744cd285bf0c3d8f7dfda1/SIST-EN-973-2009.pdf
- Argonne National Laboratory, ammonium and potassium salt solubility data, Table 2: https://publications.anl.gov/anlpubs/2016/04/125740.pdf

The lesson paraphrases data; PubChem's underlying records and the standards/report have different reuse terms. Reuse permissions remain PENDING; no blanket permission is claimed.

## Integrity and release state

- Lesson body SHA-256: `6762870b32d51530b6e145f97751377622a0add0a80d0606363847acaae4549e`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Tests, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
