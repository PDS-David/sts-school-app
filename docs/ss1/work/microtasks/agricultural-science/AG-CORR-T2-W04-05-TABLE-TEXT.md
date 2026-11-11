# AG-CORR-T2-W04-05-TABLE-TEXT — Agricultural Science, Second Term Weeks Four and Five

Status: **IMPLEMENTED — source-row binding and replacement lesson authored; approval and verification deferred.** Table ambiguities remain blocking pending subject-expert confirmation.

## Immutable source identity

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Actual parser/compiler row: `SS1-SRC-956594d97094:BODY:12d2bff62a3b676cec1218abdde9a8f57a09e2057bd5f6d880e50cb0dee77886`
- Original Word tables: 17 rows × 3 columns at direct-body blocks 286 (maize/rice), 298 (cowpea/groundnut) and 309 (yam/cassava).
- Recomputed table-block SHA-256:
  - Block 286: `e85f47c0bf2bab22cd9534ddf5368d4d76f9ccbcf75c9930c4ca8b5f47b4394e`
  - Block 298: `87186ec68d7711e5caba1564d1775c94d59235baff5757eda7bcae6d97cb0cf0`
  - Block 309: `b35aa8b43354f8934274af4ad2fadcafd68aceb8c9de6e6ce890f60e1de98575`

The exact row identity is reproduced in CI from the hash-pinned archive using Mammoth extraction, actual `parseTopics` and `compilePackages`. The regression test pins all 30 original teaching-row IDs.

## Learner-delivery correction

Added `CORR-AG-T2-W04-05-SELECTED-CROPS-REPLACEMENT`, binding the original row to `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W04-05-SELECTED-CROPS`.

The replacement is a complete authored lesson on maize, rice, cowpea, groundnut, yam and cassava. It includes all three 17-row source tables and preserves the source's numeric figures, units, dates, seed rates, spacing and maturity values. It adds crop-specific teaching on groundnut pegging, yam staking and vine training, mulching, cassava propagation and safe processing. It does not invent universal field rates.

## Evidence-backed text corrections in the replacement

1. **Temperature notation:** Word XML confirms that the superscript zero after 26, 30 and 20 is the degree marker. Intended display is 26°C–30°C and 20°C; numeric values are unchanged. The source table retains the printed notation and the lesson flags it for teacher confirmation.
2. **Rice processing:** “per boiling” is corrected to **parboiling**, with the source phrase retained in a note. FAO and NAERLS use “parboiling” for the rice-processing step before drying/milling.
3. **Cassava propagation:** “2/3 0f” is corrected to “2/3 of”; the fraction 2/3 is unchanged.
4. **Maize spacing:** “30cmwithin row” is corrected to “30 cm within row”; the number 30 and unit cm are unchanged.
5. **Botanical names:** Joined/misspelled names are separated and corrected where evidence supports the correction (for example, *Zea mays*, *Oryza sativa*, *Vigna unguiculata*, *Arachis hypogaea*, *Dioscorea* spp. and *Manihot* spp.).
6. **Yam-variety cell:** The malformed five-item cell is reconstructed with supported spellings and punctuation: water yam (*Dioscorea alata*), yellow yam (*D. cayenensis*), white yam (*D. rotundata*), bitter yam (*D. dumetorum*) and aerial yam (*D. bulbifera*). Kew's treatment of *D. rotundata* as a synonym is noted; the common educational species-rank usage is preserved for review.

## Unresolved table entries — still blocking

- **Cassava soil:** “Dried loamy soil” is preserved because no verified parallel establishes whether “deep” or “dry” was intended.
- **Cassava common-name/taxonomy:** The source's sweet/bitter assignment conflicts with NOU and University of Melbourne educational parallels; modern taxonomy adds complexity. The replacement preserves the source assignment and flags it; it does not silently swap the names.
- **Storage term:** “rhombus” is preserved pending confirmation of the intended local storage term.
- **Numeric/rate values:** All figures remain source-reported, not universal agronomic recommendations. Rice seed-rate/planting wording and other table entries require subject review before field application.
- The package's table-anomaly and table-structure open items remain blocking; coverage remains PARTIAL.

## Sources consulted

1. FAO, “Rice in Human Nutrition,” Chapter 5, rice post-harvest processing and parboiling: https://www.fao.org/4/t0567e/T0567E0h.htm
2. National Agricultural Extension and Research Liaison Services (NAERLS), *Rice Production, Processing, Utilization and Marketing in Nigeria*: https://naerls.gov.ng/wp-content/uploads/2022/11/Rice-Production-Processing-Utilization-and-Marketing-in-Nigeria.pdf
3. Royal Botanic Gardens, Kew, Plants of the World Online: https://powo.science.kew.org/
4. Kew POWO, *Dioscorea rotundata*: https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A318525-1
5. Kew POWO, *Manihot utilissima*: https://powo.science.kew.org/taxon/351963-1
6. Kew POWO, *Manihot palmata*: https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A351881-1
7. National Open University of Nigeria, AFS202 Module 3, cassava section: https://oer.nou.edu.ng/sites/default/files/OER_Files/AFS202_03.pdf
8. University of Melbourne, “Sorting Manihot names”: https://www.plantnames.unimelb.edu.au/Sorting/Manihot.html

## Release gate

The replacement lesson remains `content_approval: PENDING` and `verification: DEFERRED`. The learner route withholds the original source row until the package and replacement lesson pass genuine approval and verification. The unresolved table entries also remain blockers. Original source bytes and all numeric figures are unchanged. No production import, authenticated learner-route observation or field-practical verification is claimed.
