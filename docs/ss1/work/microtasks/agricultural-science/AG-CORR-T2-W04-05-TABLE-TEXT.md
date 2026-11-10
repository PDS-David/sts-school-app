# AG-CORR-T2-W04-05-TABLE-TEXT — Agricultural Science, Second Term Weeks Four and Five

Status: **BLOCKED — evidence review complete; delivery binding awaits an original lesson.**

## Source identity and exact table locators

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- The three original Word tables are each 17 rows × 3 columns, at direct-body blocks 286 (maize/rice), 298 (cowpea/groundnut) and 309 (yam/cassava).
- Recomputed table-block SHA-256:
  - Block 286: `e85f47c0bf2bab22cd9534ddf5368d4d76f9ccbcf75c9930c4ca8b5f47b4394e`
  - Block 298: `87186ec68d7711e5caba1564d1775c94d59235baff5757eda7bcae6d97cb0cf0`
  - Block 309: `b35aa8b43354f8934274af4ad2fadcafd68aceb8c9de6e6ce890f60e1de98575`

The archive/member and table hashes were independently recomputed from the Library copy and match the inventory. The Word tables' row/column structure and cell formatting were inspected directly; the concatenated plain-text representation is not used as a substitute for cell relationships.

## 1. Temperature notation: superscript zero is the degree marker

**Finding:** The source text strings `260C-300C` and `200c` are not temperatures of 260°C, 300°C or 200°C. Inspection of the original Word XML shows that the zero immediately after 26, 30 and 20 is a superscript character (`w:vertAlign="superscript"`). Other temperature cells in the same tables use a superscript letter “o” in the same position. The superscript zero is therefore the degree marker, and the intended display is 26°C–30°C and 20°C.

**Recommended display correction:** Normalize the degree marker to `°` while preserving every number: `26°C–30°C`, `20°C`. Apply the same display normalization to the other temperature cells that use superscript “o” (for example, 27°–35°C, 25°–30°C, 21°–35°C).

**Numeric-preservation rule:** No number is changed, rounded, converted or inferred. Rainfall values in centimetres, planting distances, dates, seed rates, maturity periods and the 2/3 fraction remain exactly as printed.

## 2. Rice processing: “per boiling” → “parboiling”

**Finding:** The rice-processing row contains “per boiling” between winnowing and hulling/polishing. The standard rice-processing term is **parboiling**: paddy is soaked and steamed/boiled before drying and milling. FAO's rice post-harvest processing material explicitly uses “parboiling” as a normal rice-processing operation, and the Nigerian National Agricultural Extension and Research Liaison Services (NAERLS) rice-processing bulletin lists threshing, winnowing and parboiling as post-harvest operations.

**Recommended display correction:** Replace “per boiling” with “parboiling.” This is a terminology/spelling correction; it does not change any numerical value.

## 3. Cassava propagation: “2/3 0f” → “2/3 of”

**Finding:** The cassava propagation cell reads “2/3 0f the stem cuttings are buried…”. The character `0` is a typographical substitution for the letter `o` in the ordinary phrase “2/3 of the stem cuttings.” The fraction is grammatically and agronomically coherent and is independently used in cassava propagation references.

**Recommended display correction:** Replace `0f` with `of`; preserve the fraction `2/3` verbatim. Do not change the fraction, angle, length or any other numeric figure.

## 4. Planting-spacing text: “30cmwithin row”

**Finding:** The maize spacing cell contains the joined string “30cmwithin row”. The surrounding table expresses planting distances in centimetres and uses a number followed by the unit and a within-row qualifier. The anomaly is a missing space between the unit and the words, not a different numerical value.

**Recommended display correction:** Insert the missing spaces only: “30 cm within row”. Preserve the number 30 and unit cm exactly; do not infer or add a new spacing value.

## 5. Joined and misspelled botanical names

The following spacing/spelling repairs are supported by Kew's Plants of the World Online (POWO) and the source's crop headings:

| Source cell text | Recommended display | Evidence/decision |
|---|---|---|
| `Zeamays` | *Zea mays* | Accepted maize binomial in Kew POWO |
| `Oryzasativa` | *Oryza sativa* | Accepted rice binomial in Kew POWO |
| `Vignaunguiculata` | *Vigna unguiculata* | Accepted cowpea binomial in Kew POWO |
| `Arachishypogea` | *Arachis hypogaea* | Kew POWO accepts *Arachis hypogaea*; source also needs the missing “a” in the specific epithet |
| `Dioscoreaspp` | *Dioscorea* spp. | Genus-level designation for multiple yam species; insert space and terminal period |
| `Manihotspp` | *Manihot* spp. | Genus-level designation for cassava; insert space and terminal period |
| `Dioscoreaalata` | *Dioscorea alata* | Accepted species |
| `Dioscoreacayenesis` | *Dioscorea cayenensis* | Accepted species; source has a misspelled specific epithet |
| `Dioscorearotundata` | *Dioscorea rotundata* | Established name in West African yam literature; Kew currently treats it as a synonym of *D. cayenensis* subsp. *rotundata*, while some floras accept it at species rank |
| `Dioscoreadomentorum` | *Dioscorea dumetorum* | Accepted bitter-yam name; source's epithet is misspelled |
| `Dioscoreabulbifera` | *Dioscorea bulbifera* | Accepted species; Kew lists “aerial yam” among its common names |
| `Manihotutilissima` | *Manihot utilissima* | Correct spacing; Kew treats this historical name as a synonym of *Manihot esculenta* |
| `Manihotpalmata` | *Manihot palmata* | Correct spacing only; do not change the name or its common-name assignment without subject approval |

The genus and species are italicized in standard botanical formatting; `spp.` remains roman. This formatting does not change the underlying source values.

## 6. Malformed yam-variety cell

**Verbatim source sequence (block 309):** Water yam (`Dioscoreaalata`); Yellow yam (`Dioscoreacayenesis`); White yam (`Dioscorearotundata`); Bitter yam (`Dioscoreadomentorum` Aerial yam (`Dioscoreabulbifera`).

The cell is malformed because binomials are joined, the bitter-yam epithet is misspelled, the closing parenthesis after the bitter-yam name is missing, and the aerial-yam item runs directly into it.

**Evidence-backed display reconstruction:**
- Water yam (*Dioscorea alata*)
- Yellow yam (*Dioscorea cayenensis*)
- White yam (*Dioscorea rotundata*)
- Bitter yam (*Dioscorea dumetorum*)
- Aerial yam (*Dioscorea bulbifera*)

Kew POWO accepts *D. alata*, *D. cayenensis*, *D. dumetorum* and *D. bulbifera*; Kew lists *D. rotundata* as a synonym of *D. cayenensis* subsp. *rotundata*, while other taxonomic treatments continue to use *D. rotundata* at species rank. The source's common-name associations for the five yam types are consistent with standard West African crop terminology. The repair restores spacing, punctuation and the supported species spellings; it does not change the order or add a new yam variety.

## 7. Cassava sweet/bitter name assignment: leave unresolved

The source cell reads “Sweet cassava (*Manihot utilissima*)” and “Bitter cassava (*Manihot palmata*)”. This common-name/species pairing conflicts with several Nigerian educational and botanical references:
- The National Open University of Nigeria AFS202 cassava module states “sweet cassava (*Manihot palmata*)” and “bitter cassava (*Manihot utilissima*)”.
- The University of Melbourne's Manihot name database gives *M. palmata* as sweet cassava and *M. utilissima* as bitter cassava.
- A Nigerian cassava-production paper also uses the same sweet/bitter mapping as the NOU module.

Modern taxonomy adds complexity: Kew POWO treats *Manihot utilissima* as a synonym of *M. esculenta*, while *M. palmata* is accepted as a separate name in its current backbone. Historical agricultural literature has used these names differently. This is therefore not a simple joined-word typo. The source's assignment appears reversed relative to the Nigerian educational parallels, but the taxonomic/common-name usage is not uniform enough to silently swap the two entries.

**Disposition:** Preserve the source's cassava common-name/botanical-name assignment verbatim pending a teacher-approved original or subject-expert decision. Do not swap “sweet” and “bitter” or substitute *Manihot esculenta* in a delivery correction under this task.

## 8. “Dried loamy soil”: unresolved; do not guess

The cassava soil cell reads “Dried loamy soil. It can also tolerate poor soil.” “Deep loamy soil” is a plausible agronomic phrase, but no verified parallel copy or direct source evidence was found that establishes that “Dried” was intended to be “Deep.” “Dry loamy soil” is another possible reading. Because the intended word cannot be recovered without guessing, preserve “Dried loamy soil” as source text and do not bind a correction.

## Consolidated correction candidates

| Locator | Source anomaly | Evidence-backed candidate | Status |
|---|---|---|---|
| 286 | `260C-300C` | `26°C–30°C` (superscript zero is degree marker) | Verified; numeric figures unchanged |
| 286 | `200c` | `20°C` (superscript zero is degree marker) | Verified; numeric figures unchanged |
| 286/298/309 | Superscript `o` in temperature notation | Normalize superscript degree marker to `°` | Verified; no numeric change |
| Rice processing cell | `per boiling` | `parboiling` | Verified by FAO and NAERLS |
| Cassava propagation cell | `2/3 0f` | `2/3 of` | Verified by direct grammar/context; fraction unchanged |
| Maize spacing cell | `30cmwithin row` | `30 cm within row` | Spacing-only correction; number unchanged |
| Crop binomials | Joined names and misspelled *Arachis hypogea* | Separate genus/species; *Arachis hypogaea* | Verified by Kew POWO |
| Yam varieties | Joined names, `cayenesis`, `domentorum`, missing parenthesis/separator | Reconstructed five-item list above | Verified by Kew POWO and crop terminology |
| Cassava varieties | Sweet/bitter name assignment conflicts with parallel sources | No correction | Unresolved pending teacher/expert decision |
| Cassava soil | `Dried loamy soil` | No correction | Unresolved; do not guess “deep” or “dry” |

## Why no delivery corrections are bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating correction records now would require fabricated identifiers.

Therefore:
- The formatting, spelling and terminology correction candidates listed above are evidence-backed.
- The cassava common-name assignment and “Dried loamy soil” remain unresolved and are not corrected.
- Every numeric figure, unit, range, date, planting distance, seed rate and maturity period remains unchanged.
- No `delivery_corrections` record is created until an original lesson and replacement lesson exist.
- Queue item `AG-CORR-T2-W04-05-TABLE-TEXT` remains **BLOCKED** only by the missing lesson-binding targets; the evidence review itself is complete.
- The existing package open item `AGRICULTURAL-SCIENCE-T2-W04-05-TABLE-ANOMALIES` is updated with these findings and the exact binding gate.

## Sources consulted

1. **FAO**, “Rice in Human Nutrition,” Chapter 5 “Rice post-harvest processing, parboiling and home preparation.” Defines parboiling as a rice-processing step involving soaking and boiling/steaming before drying and milling. https://www.fao.org/4/t0567e/T0567E0h.htm
2. **National Agricultural Extension and Research Liaison Services (NAERLS), Nigeria**, *Rice Production, Processing, Utilization and Marketing in Nigeria*. Lists threshing, winnowing and parboiling as rice post-harvest operations. https://naerls.gov.ng/wp-content/uploads/2022/11/Rice-Production-Processing-Utilization-and-Marketing-in-Nigeria.pdf
3. **Royal Botanic Gardens, Kew**, Plants of the World Online (POWO): *Zea mays*, *Oryza sativa*, *Vigna unguiculata*, *Arachis hypogaea*, *Dioscorea alata*, *Dioscorea cayenensis*, *Dioscorea dumetorum* and *Dioscorea bulbifera*. Confirms accepted scientific spellings and taxonomic status. https://powo.science.kew.org/
4. **Kew POWO**, *Dioscorea rotundata* Poir. Explains that Kew treats the name as a synonym of *Dioscorea cayenensis* subsp. *rotundata*, while its cited authorities include alternative treatments that accept *D. rotundata* at species rank. https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A318525-1
5. **Kew POWO**, *Manihot utilissima* Pohl. Treats the historical name as a synonym of *Manihot esculenta*. https://powo.science.kew.org/taxon/351963-1
6. **Kew POWO**, *Manihot palmata* Müll.Arg. Lists the name as accepted in its current taxonomic backbone. https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A351881-1
7. **National Open University of Nigeria**, AFS202 Module 3, cassava section. Uses the traditional Nigerian educational mapping “sweet cassava (*Manihot palmata*)” and “bitter cassava (*Manihot utilissima*)”, opposite to the source table. https://oer.nou.edu.ng/sites/default/files/OER_Files/AFS202_03.pdf
8. **University of Melbourne**, “Sorting Manihot names.” Records *M. palmata* as sweet cassava and *M. utilissima* as bitter cassava, while discussing uncertainty in the taxonomy/common-name mapping. https://www.plantnames.unimelb.edu.au/Sorting/Manihot.html

## Changes and remaining gate

- Added this table-text correction investigation record with source, member, table and block hashes.
- Verified degree-symbol rendering from the original Word XML superscript formatting; no numeric figures changed.
- Verified “per boiling” → “parboiling,” “2/3 0f” → “2/3 of,” spacing in “30cmwithin row,” and the botanical-name/yam-cell corrections listed above.
- Left “Dried loamy soil” and the sweet/bitter cassava name assignment unresolved; no guesswork or silent reversal.
- Updated the existing package table-anomalies open item with evidence and the exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T2-W04-05-TABLE-TEXT` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes and every numeric figure remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
