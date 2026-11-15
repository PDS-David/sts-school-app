# CHEM-PRES-T3-TABLES — Chemistry Third Term table preservation

Status: **IMPLEMENTED_TESTING_DEFERRED** (all 15 table-like groups indexed; no reflow or correction).

## Source identity
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`.
- Locator: 1-based `getBody()` lines, word-extractor 1.0.4.

## Table-like groups
| # | Lines | Topic / structure | Disposition |
|---:|---:|---|---|
| 1 | 7-17 | Scheme of work | Tab text, not a Word table. Preserve NBSP and tabs. |
| 2 | 39-45 | Organic acids | Preserve row/column relationships. |
| 3 | 55-58 | Inorganic acids | Preserve row/column relationships. |
| 4 | 79-83 | Basicity | Preserve heading, values and units. |
| 5 | 138-151 | Uses of acids | Tabular prose; preserve the original row order. |
| 6 | 293-300 | Nature of hydroxides | Preserve comparison structure. |
| 7 | 328-338 | Uses of alkalis | Preserve row/column pairing. |
| 8 | 434-447 | Solubility rules | Preserve ion/solubility relationships. |
| 9 | 486-493 | Hydrated salts | Preserve formula, mass and calculation columns. |
| 10 | 543-548 | Drying agents | Preserve substance and use pairing. |
| 11 | 659-664 | Diamond/graphite comparison | Preserve comparison columns. |
| 12 | 933-936 | Coal distillates | Preserve product/fraction and use relationships. |
| 13 | 1026-1033 | Carbonate thermal decomposition | Preserve formula and temperature columns. |
| 14 | 1133-1147 | Petroleum fractions | Visibly misaligned: row 2 text “2. Petrol 40 - 200 4 - 12 Fuel in aeroplanes and motor vehicles” spans lines 1138-1139. Do not silently reflow. |
| 15 | 1194-1201 | Octane numbers | Blank-separated columns; values including octane 144/-27 and nonane 128/-45 require accuracy review. Preserve source order. |

Twelve groups are emitted as `<informaltable>` in antiword 0.37 DocBook output. The scheme (7-17), petroleum-fraction table (1133-1147) and octane-number table (1194-1201) are tab text, not native Word tables. This distinction is preserved.

## Integrity and limitations
The inventory gives source line locators and structural extraction results, but not per-table object hashes or a rendered page image. No missing cell is reconstructed and no misaligned row is repaired. A future rendering must preserve each row's complete data relationship and cite any separately corrected values.

No table is changed, approved or verified here.
