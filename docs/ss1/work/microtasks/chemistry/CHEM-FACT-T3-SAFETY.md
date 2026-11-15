# CHEM-FACT-T3-SAFETY — Chemistry Third Term safety findings

Status: **IMPLEMENTED_TESTING_DEFERRED** (findings only; no practical approval or safety procedure).

## Source
- Member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`; SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`.
- Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`.
- Exact source locators are 1-based `getBody()` lines.

## Findings register
| Line(s) | Source safety statement | Finding |
|---|---|---|
| 93 | Strong acids are corrosive | Broadly correct; concentration and exposure route determine severity. Do not infer PPE or first aid not in source. |
| 317 | Concentrated NaOH/KOH are corrosive | Correct hazard category; concentrated alkalis can cause severe skin/eye burns. The source contains no handling or emergency procedure. |
| 826, 829 | CO preparation must be done in a fume cupboard; 1% CO in air may cause death | Carbon monoxide is acutely toxic and binds haemoglobin, impairing oxygen transport. A fume cupboard statement alone is not a complete procedure; do not teach CO preparation as a routine practical. |
| 844 | CO binds haemoglobin | Scientifically consistent; CO exposure is life-threatening and requires prevention, not a classroom exposure demonstration. |
| 856 | Phosgene described as a First World War poison | Phosgene is a highly toxic inhalation hazard historically used as a chemical warfare agent in World War I. It must not be generated or demonstrated in class. |
| 949-962 | Coke gasification / water gas / producer gas at high temperatures | These processes involve high temperatures, combustible gases and possible carbon monoxide. This is industrial process description, not a student practical procedure. |
| 1226-1227 | Lead tetraethyl as an anti-knock additive | Tetraethyl lead is highly toxic and has been phased out of road fuel in most jurisdictions; present only as historical context, not a current fuel additive. |
| 1317 | Pharmaceutical list includes “Potassium bromine”, “bismuth carbonate”, “mercury nitrate”, “mercury (1) chloride” | The list contains likely naming/formula errors and includes mercury compounds with serious toxicity concerns. Do not treat it as a current safe pharmaceutical list; exact intended compounds need authoritative review. |

## Evidence sources
- CDC/NIOSH, Carbon Monoxide: https://www.cdc.gov/niosh/npg/npgd0105.html
- ATSDR, Medical Management Guidelines for Carbon Monoxide: https://wwwn.cdc.gov/TSP/MMG/MMGDetails.aspx?mmgid=230&toxid=43
- CDC/NIOSH, Phosgene: https://www.cdc.gov/niosh/npg/npgd0504.html
- CDC/NIOSH, Lead tetraethyl: https://www.cdc.gov/niosh/npg/npgd0588.html
- NIOSH Pocket Guide, Sodium hydroxide: https://www.cdc.gov/niosh/npg/npgd0565.html
- NIOSH Pocket Guide, Sulfuric acid: https://www.cdc.gov/niosh/npg/npgd0577.html
- PubChem, Mercury compounds: https://pubchem.ncbi.nlm.nih.gov/compound/Mercury
- EPA, Leaded Gasoline: https://www.epa.gov/lead/learn-about-lead

## Scope
No procedure, quantities, first aid, emergency response, PPE list or practical activity is added. The inventory confirms the source contains no goggles/gloves/first-aid/emergency instructions. This is a factual safety finding record, not a risk assessment or approval.
