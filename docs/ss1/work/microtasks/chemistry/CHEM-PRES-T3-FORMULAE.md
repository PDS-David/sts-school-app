# CHEM-PRES-T3-FORMULAE — Chemistry Third Term notation preservation

Status: **IMPLEMENTED_TESTING_DEFERRED** (source notation inventory only; no correction).

## Source identity
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole getBody text SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`; 1,339 LF-split entries, last empty.
- Locator: word-extractor 1.0.4 `getBody()`, 1-based lines, no normalisation; U+001E retained.

## Source notation register
| Line(s) | Flattened source form | Preservation / review note |
|---|---|---|
| 66 | `H2SO4 2H+ + SO42-` | Formula, charge and arrow formatting flattened; preserve as source form. |
| 67 | `HNO3 H+ + NO3-` | Arrow and superscript charges not retained in plain text. |
| 72 | `H2CO3 2H+ + CO32-` | Preserve acid, ion and charge units. |
| 195-246 | `10-14`, `10-3` | Possible powers of ten with lost superscript; do not read as subtraction without original run inspection. |
| 220, 287 | U+001E non-breaking hyphen after OH / O2 / OH | Preserve U+001E exactly; do not normalize to ordinary hyphen. |
| 486-525 | `H2C204.2H20` | Hydrated oxalic-acid formula; O/zero and subscript ambiguity. |
| 680 | `35000C` | Could represent a temperature with flattened degree/subscript notation; do not assume 35,000°C or 3,500°C. |
| 770 | `-780C` | Dry-ice temperature; degree/superscript flattening likely, but original rendering required. |
| 1153 | `300atoms` | Could be a flattened unit/power or typographical error; preserve exactly pending source inspection. |
| 1275 | `HN4O3` | Formula/element-order anomaly; do not silently change to another nitrate formula. |
| 1277 | `CaC03` | O/zero ambiguity; formula is source text only, not corrected. |
| 1293-1294 | “calcium trioxocarbonate (iv) acid” / “Sodium trioxocarbonate(iv) acid” | Nomenclature anomaly; preserve source wording. |

## Structural evidence and limits
The source is a Word 97 binary; formulas, charges, powers and temperatures are flattened in `getBody()` text. The inventory has no per-character formatting/run map for the flattened formulae. No Word render or original character-property inspection is available in this record. Do not infer subscript/superscript positions from a guessed intended formula.

## Disposition
The exact flattened source forms and locators are recorded. Original source wording remains distinct from any future correction. A source-preserving visual rendering requires the original character-property evidence; no formula is normalised, balanced, rounded or approved here.
