# CHEM-PRES-T2-EQUATIONS — Chemistry Second Term equation and shape preservation

Status: **IMPLEMENTED_TESTING_DEFERRED** (all degraded OMML blocks and shape-drawn equation structures inventoried; no reconstruction).

## Source identity
- Member `SSS 1/2nd Term SS1_/CHEMISTRY.docx`; SHA-256 `236b1bdb2e752f652dd22e8f2df831279237e669ceeec356825cecc4ef8911e7`.
- Whole body blocks 0-2220; SHA-256 `60db0c49b150ebdab160d6d3ee7cb86629788cd1a73c58ace7f1cef831f74c72`.
- Locator: 0-based direct child blocks of `w:body` in `word/document.xml`.

## OMML register
| Block | Extracted OMML text / evidence | Disposition |
|---:|---|---|
| 1472 | Degree sign only | Mathematical expression is degraded; no formula inferred. |
| 1715 | Degree sign only | Mathematical expression is degraded; no formula inferred. |
| 1803 | `1/√∂` | Corrupted placeholder-like expression; preserve exactly. |
| 1805 | `∂` | Corrupted fragment; preserve exactly. |
| 1806 | `Type equation here.` | Explicit authoring placeholder, not a mathematical equation. |
| 1808 (equation 1) | `1/√∂` | Corrupted fragment; preserve exactly. |
| 1808 (equation 2) | `1/√∂` | Second equation at same block; preserve as separate object. |
| 1811 | `√∂₁` | Corrupted fragment; preserve exactly. |
| 1812 | `√∂₂` | Corrupted fragment; preserve exactly. |
| 1814 | `√` | Bare radical; missing operand. |
| 1815 | `√` | Bare radical; missing operand. |

## Shape-drawn equation layout
The document contains 114 `w:drawing` objects: 42 raster-backed, 69 AutoShape straight connectors/arrowheads, and 3 text boxes. The 69 connectors draw fraction bars and arrows, concentrated in Week Nine (28 drawings). All 72 `w:pict` elements are VML fallbacks of those same shapes, not 72 extra figures. Week Nine Graham-law and vapour-density fractions are split across blocks and drawn with connector shapes. The inventory identifies fragments “R1 =”, “R2 =” and “2 x V.D = …”; their intended values/rearrangement are not reconstructed here.

## Preservation decision
Retain every OMML object, its block position and the connector/textbox drawing layer. Plain text extraction is not a faithful rendering of the equations. Do not invent missing symbols, coefficients, values or rearrangements, and do not silently correct the physics. Any future reconstruction must be a separate reviewed teaching item with authoritative evidence and a link back to the original block.

The inventory does not supply individual OMML XML hashes or drawing-shape hashes; no per-object hash is invented. No equation is approved, corrected or verified.
