# AG-FACT-T3-W02-DRYING-POWER — Agricultural Science, Third Term Week Two

Status: **IMPLEMENTED_TESTING_DEFERRED**. The defensible answer is **B. sun**. Regional evidence supports traditional sun drying as the most common grain-drying practice, while the question's phrase “source of farm power drying grains” should be clarified.

## Source integrity and exact wording
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact Third Term DOCX member `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`, SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Block 173 (solar energy) SHA-256: `1d8151c5de32641e14b6f25a801233b7189cf9df99a98438bf7041465bf5cf67`.
- Block 197 (wind energy) SHA-256: `93d98daf0e29d9e07a7cc9d88073d6e6405f16ff75e1163a1daa5e834556c7f5`.
- MCQ block 264 SHA-256: `dfb09e823677c0aaaecf3224b6a612fc9c3f8b708b00f36be825bb0435b21504`; option block 265 SHA-256: `dcb00014db2cac4569a4c7dddab211a7d634b323aa1d9f8da6896d7514ad9839`.
- Exact question across blocks 264–265: “The most common source of farm power drying grains in West Africa is A. heat engine B. sun C. water D. electricity”.
- The lesson itself says solar energy can dry crops (block 173), while wind energy can also be used in drying farm produce (block 197).

## Regional evidence and interpretation
- FAO's *Grain storage techniques* chapter on natural and solar drying states that sun drying remains the most common grain-drying method in tropical developing countries. It explains that the sun supplies the heat for moisture evaporation while wind/air movement helps carry away moisture. This supports **B. sun** as the best option among those printed.
  https://www.fao.org/4/t1838e/T1838E0v.htm
- A 2022 peer-reviewed study of maize farmers in five Ghanaian regions (Central, Eastern, Ashanti, Brong Ahafo and Northern) found open sun drying was the predominant method in every region. Table 6 reports: Central 73.3%, Eastern 93.3%, Ashanti 93.7%, Brong Ahafo 86.7%, Northern 100%. Solar drying was reported by only 6.3% in Ashanti; mechanical drying was 0% in all five regions. The paper's prose says “not less than 93%” in all regions, but this conflicts with its own table (Central 73.3%, Brong Ahafo 86.7%); the table values are used here, not the inconsistent prose.
  - Darfour, B.D. & Rosentrater, K.A. (2022), “Pre-harvest and post-harvest farmer experiences and practices in five maize growing regions in Ghana,” *Frontiers in Nutrition* 9, DOI: https://doi.org/10.3389/fnut.2022.725815
  - Relevant article sections: methods (75 farmers across five regions), “Post-harvest grain drying, sorting, and storage”, Table 6.
  https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2022.725815/full
- FAO's *African experience in improving the post-harvest handling of rice and maize* documents traditional sun drying of maize in the region, but also notes that in humid/rainy periods in parts of the Gulf of Guinea, supplemental heat (such as wood-fire drying structures) may be used. This is a seasonal/local exception, not evidence that heat engines, water or electricity are the most common general source.
  https://www.fao.org/4/w1544e/W1544E03.htm
- FAO's grain-drying guidance distinguishes natural drying (sun and ambient air) from artificial drying (forced air and/or added heat). Improved solar dryers are a controlled technology; they are distinct from open sun drying, even though both use solar energy.
  https://www.fao.org/4/s1250e/S1250E0v.htm

## Finding and recommended wording
- **Answer: B. sun.** Sunlight supplies the heat used in the common traditional open-sun drying method. Ambient airflow/wind contributes to moisture removal but is not one of the answer options.
- The options yield one defensible answer for the intended school-level meaning. “Heat engine”, water and electricity are not the common traditional source in the regional evidence reviewed.
- The stem is awkward and conflates “farm power” with an energy source. Recommended wording:
  > Which natural energy source is most commonly used for traditional grain drying in West Africa?
- Retain **B. sun** as the answer. The wording recommendation is editorial only; no source question or answer key was changed or approved.
- Add a short teaching clarification: “In open sun drying, solar radiation supplies heat to evaporate moisture from the grain, while ambient air movement helps remove the water vapour. Improved solar dryers are separate, enclosed devices that also use solar energy.”

## Changes and verification
- Added this evidence note and marked `AG-FACT-T3-W02-DRYING-POWER` `IMPLEMENTED_TESTING_DEFERRED`.
- Verified the composite archive and exact Third Term DOCX member hashes; inspected blocks 173, 197 and 264–265 directly in the DOCX XML and recomputed their hashes.
- Compared FAO regional drying guidance with a peer-reviewed Ghana farmer-practice survey; checked the survey's Table 6 against its prose and used the table where the two conflict.
- No source bytes, package content, lesson body, answer key, correction binding, asset, shared schema/compiler or other subject was changed.
- No tests, importer, TypeScript checks, DB, learner rendering or device checks were run; testing remains deferred.
