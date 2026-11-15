# CHEM-LES-T1A-W05-FORMULA-GAPS — missing formula and valency teaching

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Content approval remains PENDING; verification remains DEFERRED; PubChem data reuse terms remain PENDING.

## Source gaps

- Source: `SS1-SRC-58b4a44c3afa`, 1st Term Chemistry.
- Week Five: `COMPOUNDS AND MIXTURES`, mammoth lines 868–1115; block SHA-256 `0928fd18ab69956502440832da5e87685c9c54ffc584ef53a8763eb6dccfb31d`.
- Questions at lines 991 and 1107 require the valency of hydrogen for tetraoxosulphate(VI) acid.
- Question at line 1111 requires the tetraoxophosphate ion and its valency for sodium tetraoxophosphate.
- Weekend question at line 1091 requires the formula of sand and the valency of silicon.
- The source supplies none of these missing teaching statements. Its original wording remains unchanged.

## Implementation

Added `SUP-SS1-CHEM-T1A-W05-FORMULA-GAPS` to `backend/src/db/ss1/subjects/chemistry.json`.

The supplementary lesson teaches:
- Hydrogen has common valency 1; sulfuric acid is H₂SO₄.
- The tetraoxophosphate(V) ion is PO₄³⁻, with valency 3.
- Sodium is Na⁺; three sodium ions balance one phosphate ion, giving Na₃PO₄.
- Silica (silicon dioxide/quartz) has formula SiO₂; in the introductory formula exercise silicon is assigned valency 4 and oxygen 2.
- Natural sand is not necessarily pure silica; SiO₂ is the intended answer when the question means silica/quartz.

Four keyed practice questions have integer marking criteria (8 marks total). Coverage `COV-CHEM-T1A-W05-FORMULA-GAPS` is now `IMPLEMENTED_EQUIVALENT` and binds to the new lesson.

## Provenance

- PubChem, Sulfuric Acid (CID 1118): https://pubchem.ncbi.nlm.nih.gov/compound/Sulphuric-acid
- PubChem, Phosphate (CID 1061): https://pubchem.ncbi.nlm.nih.gov/compound/Phosphate
- PubChem, Trisodium Phosphate (CID 24243): https://pubchem.ncbi.nlm.nih.gov/compound/24243
- PubChem, Silica (CID 24261): https://pubchem.ncbi.nlm.nih.gov/compound/Silicon-Dioxide

The lesson paraphrases chemical identifiers and formulas from these records. PubChem aggregates depositor data with differing underlying reuse terms, so reuse remains PENDING; no blanket permission is claimed.

## Integrity and release state

- Lesson body SHA-256: `90f1cc79d1e07d0d3bf34b7a69495296d84364864ff25b801ce9aae081a8e2ea`
- Implementation: `IMPLEMENTED`
- Content approval: `PENDING`
- Verification: `DEFERRED`
- Tests, importer, database and device runs: not performed, in accordance with the instruction to defer testing until implementation is complete.
