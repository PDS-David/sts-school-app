# CHEM-IDX-T1A-W08 — Chemistry, First Term, Week Eight indexing

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Indexing only. The package remains `PENDING`; no lesson, answer key, marks, correction, source rule, owner approval, reuse permission or classroom verification is created by this item.

## Input and integrity

- Source ID: `SS1-SRC-58b4a44c3afa`
- Archive member: `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified from the attached archive.
- Member size: 2,187,976 bytes.
- Member SHA-256: `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — verified directly from the attached ZIP bytes; matches `SOURCE_ASSIGNMENTS.csv`.
- The member was inspected in place/private scratch only. No original bytes or extracted assets are committed.
- Mammoth 1.12.2 raw-text locators below are retained from the already-reviewed `CHEM-INV-T1A.md`; they were not re-generated in this pass. That inventory records 55,382 characters, 2,129 lines and whole-text SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702`.

## Week locator and scheme mapping

- Scheme row 8: line 61, `IUPAC NOMENCLATURE OF CHEMICAL COMPOUNDS`.
- Body marker: line 1490, `WEEK EIGHT`.
- Body title: line 1493, `IUPAC NOMENCLATURE OF CHEMICAL COMPOUNDS` (no `TOPIC:` prefix).
- Full body range: lines 1490-1667; SHA-256 `94be1f5931d2fc33a57fba5f16e7ee4eefd989cce64622163e00e82283c45038`.
- Mapping is supported by the eighth scheme row, the eighth body marker and the matching topic title. The source's title is retained exactly; the missing `TOPIC:` prefix is noted as a stranded-label/parser concern, not silently inserted here.

## Section and assessment index

| Source block | Mammoth line locator | Indexed contents |
|---|---:|---|
| WEEK EIGHT marker and title | 1490-1493 | Marker and topic title |
| CONTENT | 1495-1507 | Four candidates: binary compounds; radicals/variable oxidation numbers; tertiary/quaternary compounds; compounds with cations partially replaced by hydrogen |
| NAMING OF BINARY COMPOUNDS | 1509-1529 | Meaning of nomenclature/IUPAC; cation-first order; anion `-ide` ending; examples MgO, H2S, NH4Cl, NaH; exception/examples for two non-metal elements |
| First evaluation and radicals/variable oxidation block | 1531-1571 | Name NaCl, CaO and H2O2; definition of radicals; ammonium and hydroxyl examples; acid-radical names with Roman numerals; NO2, NO3- and CO3 2- examples; FeO, Cu2O and MgCO3 naming examples |
| Second EVALUATION heading | 1573-1579 | Name Fe2O3 and CuO; state the oxidation numbers of Fe and Cu |
| NAMING TERTIARY COMPOUNDS AND QUARTENARY COMPOUNDS | 1581-1605 | Compounds with more than two elements; oxo-acids, normal salts and examples HNO3, H2SO4, H3PO4, KNO3, NaSO4 and CuCO3 |
| Hydrogen-replaced cation naming and evaluation | 1607-1623 | Naming compounds whose cations are partially replaced by hydrogen ions; NaHSO4 and KHSO3 examples; determine oxidation numbers and name compounds |
| GENERAL EVALUATION/REVISION | 1625-1633 | Oxidation-number calculations, formula writing and laboratory-apparatus-use questions |
| READING ASSIGNMENT | 1635-1639 | Practical Chemistry for Senior Secondary Schools, Godwin O. Ojokuku, pages 20-28; book not supplied |
| WEEKEND ASSIGNMENT | 1641-1657 | Five MCQs: Na2S name, sulphur(IV) oxide formula, ammonium chloride formula, NaHSO4 name, and variable-oxidation-state distractors |
| THEORY | 1659-1667 | Name Fe2O3, KMnO4 and KClO3; calculate oxidation numbers of S in H2SO4 and C in CuCO3 |

No section or assessment block is discarded. No source answer, mark allocation or marking guide is present.

## Original DOCX structure and notation

Inspected the original DOCX body range corresponding to Week Eight (body children 745-833):

- 89 body paragraphs; no embedded pictures/drawings, Word tables, text boxes, equations, OLE objects or hyperlinks in this week.
- 52 subscript runs and 4 superscript runs. Formula and charge formatting must not be reconstructed from flattened text alone.
- 15 numbered paragraphs; numbered assessment and example content remains in its original order.
- The tab-aligned formula/name examples are paragraph text, not actual Word tables.
- No visual disposition is needed for this week; this does not imply that all formula formatting is safely represented in plain text.

## Objective candidates and coverage boundary

The package receives six `PARTIAL` entries, all without lesson IDs:

1. Binary compound nomenclature and the stated non-metal exception.
2. Radicals, acid radicals and compounds with variable oxidation numbers.
3. Ternary/quaternary compounds, oxo-acids and normal salts.
4. Hydrogen salts whose cations are partially replaced by hydrogen.
5. The scheme-level Week Eight objective.
6. The revision, reading, weekend and theory assessment links.

One objective is `UNRESOLVED`: a reproducible method for calculating oxidation numbers. The source gives Roman-numeral naming examples but no general calculation rules or worked derivation, while asking students to calculate oxidation numbers for Fe, Cu, C, Mn and S. A separate original lesson is queued; no calculation method is invented here.

## Source issues preserved for later factual review

The source wording/formulae remain unchanged. A separate factual-review task is queued for, among other items:

- `Dioxonitratei(iii)` spelling in the acid-radical example.
- KNO3 paired with the source's oxidation numeral `(iv)`.
- NaSO4 paired with sodium tetraoxosulphate(VI).
- Weekend distractors `FeO3` and `KU`.

These are review flags, not corrections or claims of a verified answer. The original assessment and example text must remain distinguishable from any future corrected teaching.

The general evaluation also asks about a condenser, Kipp's apparatus and tripod stand; these are cross-week retrieval items, not evidence that Week Eight teaches laboratory apparatus. The reading assignment is a reference only; its cited book is not part of the supplied archive.

## Edits

- `backend/src/db/ss1/subjects/chemistry.json`: added six `PARTIAL` coverage entries, one `UNRESOLVED` coverage entry, and two blocking open items. No lesson, source rule, correction or approval was added. `package_status` remains `PENDING`.
- `docs/ss1/work/microtasks/chemistry/QUEUE.json`: marked `CHEM-IDX-T1A-W08` as `IMPLEMENTED_TESTING_DEFERRED`; added `CHEM-LES-T1A-W08-OXIDATION-NUMBER-CALCULATION` and `CHEM-FACT-T1A-W08-NOMENCLATURE-EXAMPLES`; recomputed kind counts and status counts.
- This evidence note.

## Verification boundary

**No tests, typechecks, importer runs, database checks or device checks were run**, as directed by the owner. JSON parsing/serialization and ID uniqueness were checked while preparing the edits; that is not a test-suite result. Content approval, factual approval, source reuse permissions and classroom verification remain open.
