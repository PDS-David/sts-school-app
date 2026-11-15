# CHEM-VIS-T1B-W07-TABLES — nomenclature table disposition

Status: **BLOCKED** (all table shapes and semantic groups indexed; source archive required for exact row content and per-table hashes).

## Source
- Member `SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx`, SHA-256 `0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a`.
- Week Seven range lines 1959-2712; SHA-256 `168837ded68a245e5e1a6ed422a7632164a4b72d2587de7e3d66d7977ff7d42b`.
- Twelve nested tables inside body block 598.

## Table register
| Order | Dimensions | Content group | Disposition |
|---:|---|---|---|
| 1 | 3×4 | Sample compound names | Preserve paired names/formulae. |
| 2 | 4×5 | Simple cations | Preserve ion-name/formula/charge pairings. |
| 3 | 3×5 | Variable-charge cations, naming style 1 | Preserve charge-to-name mapping. |
| 4 | 3×5 | Variable-charge cations, naming style 2 | Keep distinct from prior table. |
| 5 | 2×2 | H₃O⁺ and NH₄⁺ | Preserve ion formulas and names. |
| 6 | 5×4 | Anions | Preserve formula/name relationships. |
| 7 | 15×5 | Polyatomic ions, including “-1 ions HCO₃⁻ bicarbonate …” | Preserve each charge, formula and name as a row. |
| 8 | 3×2 | Binary covalent compound names | Preserve prefix/name/formula pairing. |
| 9 | 5×4 | Numerical prefixes mono- through deca- | Preserve number-to-prefix mapping. |
| 10 | 22×5 | NAMING ACIDS | Preserve acid formula/name and associated anion relationships. |
| 11 | 3×2 | Sodium hydrogen carbonate row | Retain as a distinct source table. |
| 12-13 | Two 1×1 example boxes | Worked examples: water molecule and sulfate (2−) ion | Preserve as example boxes, not multirow data tables. |

The source inventory records twelve naming tables plus two 1×1 example boxes (fourteen nested table objects in this area). The queue description calls them twelve tables and includes two worked boxes; this disposition explicitly separates the twelve content tables from the two example boxes.

## Flattening and unresolved reference
Cell-per-line flattening loses the pairing of name, formula, charge, oxidation state and prefix. The source cites “Table 2.1” at line 2443; which table this refers to is unresolved and must be checked against the original page layout. Charges such as “CH3CO2-” at line 2223 lose superscript formatting in raw text. No name or formula is corrected here.

## Required recovery
Reopen the expected composite archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`), hash each nested table, inspect all cell text, verify the exact table count and resolve the Table 2.1 reference. No table is approved or altered.
