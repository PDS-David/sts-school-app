# CHEM-FACT-T3-ACCURACY-DATA — Chemistry Third Term numeric/data findings

Status: **IMPLEMENTED_TESTING_DEFERRED** (findings only; no source correction).

## Source
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`.

## Findings register
| Line(s) | Source value/claim | Finding |
|---|---|---|
| 242 | Universal indicator range “3 and 11” | Universal indicator normally spans a broad pH range, commonly about pH 1-14 depending on product/formulation. The exact range must be tied to the indicator used; “3-11” is not a universal rule. |
| 680 | Carbon melting point “35000C” | Likely lost superscript/degree formatting or a typographical error. Carbon's high-temperature phase behaviour depends on pressure; do not interpret as 35,000°C. Preserve flattened form pending original-format inspection. |
| 743 | Atmospheric CO₂ “about 0.03%” | Dated/stale. Modern atmospheric CO₂ is above 0.04% and continues to vary; use a dated NOAA/official monitoring value if teaching current concentration. |
| 767 | CO₂ “about 1.5 times denser than air” | Approximate molecular-mass ratio at equal temperature and pressure: CO₂ (44.01) / dry air (~28.97) ≈ 1.52. Gas density comparison requires same conditions. |
| 770 | Dry ice “(-780C)” | Likely intended −78°C, but degree/superscript flattening prevents direct correction from text alone. At 1 atm dry ice sublimes near −78.5°C. |
| 834 | CO “neither lighter nor heavier than air” | Incorrect as a molecular-mass comparison: CO molar mass is about 28.01 g/mol; dry air averages about 28.97 g/mol, so CO is slightly less dense at equal conditions. |
| 954, 962, 965 | Gasification/catalyst temperatures “4500C”, “above 10000C”, “8000C” | Likely formatting loss of degree signs or superscripts; values must be checked against original formatting and a process-specific source. Do not assume they mean 4,500°C/10,000°C/8,000°C. |
| 1073 | BaCO₃ question treats barium carbonate as not decomposed | Barium carbonate thermally decomposes at sufficiently high temperature to BaO and CO₂. The exact question context/conditions must be read before marking the answer. |
| 1127-1154 | Series of flattened temperatures: 4000C/400C, 500C-2000C, 1700C-2500C, 3000C-3600C, 3500C-5000C, 6000C, 5000C | Values may contain lost degree signs, ranges or superscripts. Preserve exact source form and inspect original characters before judging. |
| 1153 | Thermal cracking pressure “about 300atoms” | “atoms” is not a pressure unit; likely a unit/formatting error. Do not infer an intended pressure or unit. |
| 1195-1203 | Octane table values, notably octane 144/-27 and nonane 128/-45 | Values are suspect and require original column reconstruction plus authoritative reference. Do not reflow or silently replace. |
| 1275 | `HN4O3` | Formula appears malformed; do not guess the intended salt. |
| 1277 | `CaC03` | O/zero ambiguity; preserve flattened source. |
| 1293-1294 | “calcium trioxocarbonate (iv) acid” / “Sodium trioxocarbonate(iv) acid” | Nomenclature appears inconsistent with common carbonate nomenclature; preserve and review separately. |

## Evidence sources
- NOAA Global Monitoring Laboratory, Trends in Atmospheric Carbon Dioxide: https://gml.noaa.gov/ccgg/trends/
- NIST Chemistry WebBook, carbon dioxide and carbon monoxide molecular data: https://webbook.nist.gov/chemistry/
- NIST Chemistry WebBook, carbon dioxide phase data: https://webbook.nist.gov/cgi/cbook.cgi?ID=C124389&Mask=4
- Royal Society of Chemistry, Periodic Table / Carbon: https://www.rsc.org/periodic-table/element/6/carbon
- PubChem, Barium carbonate: https://pubchem.ncbi.nlm.nih.gov/compound/Barium-carbonate
- IUPAC Gold Book, pH and chemical terminology: https://goldbook.iupac.org/

## Disposition
The exact source claims and locators are recorded. Flattened notation is not treated as a reliable numerical value. No source value is corrected, rounded or approved here.
