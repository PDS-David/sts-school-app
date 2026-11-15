# CHEM-PRES-T3-EQUATIONS — Chemistry Third Term equation preservation

Status: **IMPLEMENTED_TESTING_DEFERRED** (equation fragments and defects inventoried; no balancing or correction).

## Source identity
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`.
- Locator: 1-based `getBody()` lines, word-extractor 1.0.4; no normalisation.

## Equation register
| Line(s) | Exact flattened source form / family | Disposition |
|---|---|---|
| 66-75 | Acid ionisation: `H2SO4 2H+ + SO42-`; `HNO3 H+ + NO3-`; `H2CO3 2H+ + CO32-` | Arrow/charge formatting lost; preserve fragments and do not supply missing arrows. |
| 98-107 | Acid/base preparation and reactions | Preserve as source block; no corrected equation inserted. |
| 345-358 | Neutralisation set includes `H3OCl` and `(H3O)2SO4` | Suspect formulae; preserve exact source strings and flag for correction. |
| 412-414 | Hydrolysis: `Na2CO3 + H2O -> NaOH + H2CO3`; `AlCl3 + H2O -> Al(OH)3 + HCl`; `Na2S + H2O -> NaOH + H2S` | Atom balance and reaction products require review; no coefficients or states are supplied by this preservation record. |
| 690-714 | Carbon reactions | Source equations retained as a group; verify line-by-line before reuse. |
| 775-808 | Carbon dioxide / limewater sequence | Limewater product at 796 appears as `Ca(HCO3)(aq)`; preserve and flag. |
| 845-856 | Formate decomposition and carbon monoxide reactions | Fragment at 849 is `2HCOONa(aq) + H2(g) 4000C COONa`; missing arrows/terms and temperature formatting. Preserve exactly. |
| 1030 | Silver-carbonate decomposition | Requires atom/charge check against original source. |
| 1055 | Sodium hydrogen carbonate / sulfuric acid | Requires atom/charge check; preserve exact original equation. |
| 1157-1158 | Cracking examples | Preserve the original formula and arrow layout; separate correction item must check stoichiometry. |
| 1210 | Hydrocarbon reaction text | Retain exact source order and line break. |
| 1224 | Pyrolysis fragment `C10H22 H2 + C C5H12 + CH3-CH=CH-CH3` | Missing operators and fragments; do not reconstruct. |

## Preservation rule
Every source equation remains in the original Word 97 document. The plain-text inventory records only the visible flattened form. No arrow, state symbol, coefficient, subscript, superscript or missing reactant is guessed. Corrections belong in a separate evidence-backed teaching layer, never in this source record.

Nothing is balanced, completed, corrected, approved or verified here.
