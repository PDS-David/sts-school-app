# CHEM-FACT-T2-ACCURACY-DATED — Chemistry Second Term accuracy and dated-claim register

Status: **IMPLEMENTED_TESTING_DEFERRED** (findings and calculations only; source text not corrected).

## Source
- Member `SSS 1/2nd Term SS1_/CHEMISTRY.docx`; SHA-256 `236b1bdb2e752f652dd22e8f2df831279237e669ceeec356825cecc4ef8911e7`.
- Whole body blocks 0-2220; SHA-256 `60db0c49b150ebdab160d6d3ee7cb86629788cd1a73c58ace7f1cef831f74c72`.

## Accuracy findings
| Block | Source claim / issue | Finding |
|---:|---|---|
| 1472, 1475 | Absolute zero “0C or 273K”; “00C =273K, -2730C =0K” | Absolute zero is 0 K, equivalent to −273.15 °C. 0 °C is 273.15 K (approximately 273 K), not 0 K. Source uses flattened degree signs and inconsistent signs/values. |
| 2150-2153 | Limewater milkiness attributed to soluble Ca(HCO₃)₂ and CaCO₃ | Milkiness in the usual limewater test is caused by insoluble calcium carbonate precipitate. Calcium hydrogencarbonate is soluble in water. The source explanation at 2153 conflicts with its preceding attribution; preserve and flag. |
| 2158-2159 | Hydrate equations | Exact hydrate formulae, coefficients and states require the original run formatting and a reliable reaction reference. Do not reconstruct from flattened text alone. |
| 1741, 1743 | “2CO + O₂ → 2CO₂” followed by “2CO₂ (g) + O₂ (g)2CO₂ (g)” | The second expression is malformed and does not balance as written. It appears to duplicate the product and omit an arrow/reactant; do not silently repair. |
| 1058 | “2H₂O + O₂ → 2H₂O” | As written, the equation is not balanced and does not describe a valid net reaction. It may be a transcription/formatting error; original source text remains unchanged. |
| 2149 | Carbon(IV) oxide remains constant at 0.03% by volume | This is a dated atmospheric-composition claim. Modern atmospheric CO₂ concentration is substantially above 0.03% and varies over time; a current source and date are required. |
| 963 | Zinc Oxide samples: Sample 1, 20.0 g/16.22 g; Sample 2, 26.4 g/21.7 g | Calculated oxygen fractions: (20.0−16.22)/20.0 = 18.9%; (26.4−21.7)/26.4 = 17.8%. The source's ratios as recorded in the task metadata (16.22/20.0 = 81.1%; 21.7/26.4 = 82.2%) are the zinc fractions, not oxygen fractions. The sample ratios differ by about 1.1 percentage points for zinc and should be examined for measurement/rounding/experimental error before asserting a perfect constant composition. |
| 542-544 | Empirical-formula sample: 0.46 g in a 3.2 g sample stated as 12.8% | 0.46 ÷ 3.2 × 100 = 14.375%, approximately 14.4%, not 12.8%. The source arithmetic is inconsistent. |
| 1803-1815 | Graham/vapour-density equation fragments and “Type equation here.” | The OMML objects are degraded and contain missing symbols/placeholders. Preserve the fragments and defer any reconstruction to a separately reviewed equation item. |
| 1574 | “Charles Law - V alpha Ti” | Raw text has lost mathematical symbols/superscripts. Charles's law at constant pressure relates volume to absolute temperature; use a reviewed equation rendering rather than the flattened string. |
| 1775 | “Avogadro2mols 1molecules 2molecules” | Formatting/word-spacing loss makes the statement ambiguous. Preserve and recover from the original layout before teaching. |
| 2212 | Bunsen-burner strike-back described as “too much oxygen” and green flame | The explanation is oversimplified and needs a reliable laboratory text; burner flashback can involve gas/air flow and flame-port conditions, not simply “too much oxygen”. |
| 977 | Lewis history date 1916; 975 World War I chlorine; 916 Priestley date 1774 | Historical dates/attributions are dated claims. Check against primary scientific-history sources before teaching. |

## Dated source metadata
The source document metadata records creation/modification on 2018-01-15, revision 3. This is document age, not proof that every statement is stale.

## Evidence sources
- BIPM, SI Brochure, Kelvin and Celsius scales: https://www.bipm.org/en/publications/si-brochure
- NOAA Global Monitoring Laboratory, Trends in Atmospheric Carbon Dioxide: https://gml.noaa.gov/ccgg/trends/
- OpenStax Chemistry 2e, chemical equations and stoichiometry: https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations
- OpenStax Chemistry 2e, stoichiometry and percent composition: https://openstax.org/books/chemistry-2e/pages/3-2-determining-empirical-and-molecular-formulas
- PubChem / NIST chemistry data: https://pubchem.ncbi.nlm.nih.gov/ and https://webbook.nist.gov/chemistry/
- IUPAC Gold Book, gas laws terminology: https://goldbook.iupac.org/

## Disposition
This is a findings register, not a correction layer. Source wording, figures and equation objects remain unchanged. Each correction requires a separately authored item with primary evidence and review. Nothing is marked approved or verified.
