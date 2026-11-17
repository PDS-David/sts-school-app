# CHEM-PRES-T3-WORKED — Chemistry Third Term worked-example preservation

Status: **IMPLEMENTED_TESTING_DEFERRED** (source sequence and values inventoried; no arithmetic correction).

## Source identity
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`.
- Locator: 1-based `getBody()` lines, word-extractor 1.0.4.

## Worked-example register
| Lines | Worked content | Source value / disposition |
|---|---|---|
| 199-239 | Two pH/pOH worked examples | Preserve the exact sequence, including `pH = 14 - 11.4 = 2.6` and `Antilog(-2.6) = 0.0025`; do not alter rounding or the source's exponent notation. |
| 500-525 | Hydrated oxalic-acid/water-of-crystallisation calculation | Preserve the ratio layout, flattened `H2C204.2H20`, `x = 2.007` and `28.57%`; no arithmetic correction is applied here. |
| 555-560 | General-evaluation calculations | Source prompts/calculations are indexed; the full source line sequence is required before any missing working can be reproduced. |

## Preservation rule
The source is a Word 97 binary and its formula powers/subscripts are flattened by `getBody()`. Preserve the exact visible line order and values; do not infer a superscript or silently replace a decimal. Any arithmetic or chemistry correction must be a separate item with explicit source and working.

No worked example is rewritten, approved or verified here.
