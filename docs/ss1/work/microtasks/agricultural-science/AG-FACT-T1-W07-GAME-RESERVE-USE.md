# AG-FACT-T1-W07-GAME-RESERVE-USE — Agricultural Science, First Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. Under the standard FAO/UN definition of agricultural land, a game reserve is a conservation/protected-area use, not agricultural land. The likely answer to Q4 is A (game reserve), but the source's own classification list needs clarification.

## Source integrity and exact item
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- Exact First Term DOCX member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`; SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Block 558 lists “Wildlife Conservation” among the examples under agricultural uses of land.
- Block 561 says: “Land not suitable for farming may be used for game reserves.”
- Weekend Assignment Q4, block 608, asks: “Agricultural lands should not be used for establishment of A. game reserve B. pastures C. horticultural crops D. arable crops.”
- The source therefore has a classification tension: wildlife conservation is listed under agricultural uses, while game reserves are also described as a use for land unsuitable for farming.

## Authoritative land-use definitions

### FAO
- FAO's agricultural census glossary defines **agricultural land** as the total of:
  1. arable land;
  2. permanent crops; and
  3. permanent meadows and pastures.
- Arable land is land used in most years for growing temporary crops.
- This definition includes pasture and crop-growing land. It does not include nature reserves/game reserves as agricultural land.
- Source: [FAO — A System of Integrated Agricultural Censuses and Surveys, Volume 1, Glossary](https://www.fao.org/4/a0135e/A0135E11.htm), lines 12–22.

### United Nations Statistics Division
- UNdata's Environment Glossary uses the same definition: agricultural land includes arable land, permanent crops and permanent meadows/pastures.
- UNSD ISIC Rev. 5 places operation of nature reserves, wildlife preservation and safari parks under **Class 9142 — Nature reserve activities**, separate from agricultural-land protection/restoration activities.
- Sources:
  - [UNdata — Agricultural land](https://data.un.org/Glossary.aspx?q=Agricultural+land), lines 284–288.
  - [UNSD ISIC Rev. 5 — Code 9142, Nature reserve activities](https://unstats.un.org/unsd/classifications/Econ/Structure/Detail/EN/2095/9142), lines 12–35.

### Nigerian protected-area context
- The Nigeria National Park Service describes national parks as protected areas where ecosystems are protected from exploitation/occupation and identifies wildlife conservation, protection of endangered species and habitat conservation as core objectives.
- This supports treating a game reserve as a conservation/protected-area use, not as an agricultural crop/pasture use.
- Source: [Nigeria National Park Service — Introduction and objectives of national parks](https://nigeriaparkservice.gov.ng/camping-activities/), lines 27–46.

## Option-by-option assessment
- **A. Game reserve:** a wildlife-conservation/protected-area use. It is not one of the three components in the standard agricultural-land definition. It is the likely intended exception.
- **B. Pastures:** explicitly included as permanent meadows and pastures in the FAO/UN definition of agricultural land.
- **C. Horticultural crops:** land under market/kitchen gardens and permanent horticultural crops (e.g. fruit trees, flowering shrubs and nurseries other than forest-tree nurseries) falls within arable/permanent-crop agricultural land.
- **D. Arable crops:** directly within the FAO definition of arable land and therefore agricultural land.

## Finding
Under the formal FAO/UN statistical definition, **A. game reserve** is the defensible answer; pastures, horticultural crops and arable crops are agricultural land uses.

However, “land use” is broader than “agricultural land”. Wildlife conservation is a valid land use, but a game reserve is a conservation/protected-area use rather than agricultural land. The source's block 558 appears to use “agricultural uses” too broadly when it places wildlife conservation in that list. Block 561's statement that land unsuitable for farming may be used for game reserves is consistent with the FAO/UN distinction.

The phrase “should not be used for establishment of” is also normative and can imply a policy prohibition. The evidence establishes a classification distinction, not a blanket rule that a former agricultural parcel can never be converted into a game reserve.

## Recommendation — no teacher decision presumed
**Retain the item with a wording correction and clarify the lesson classification.**

Suggested stem:

> Under the standard classification of agricultural land, which of the following is a conservation/protected-area use rather than an agricultural land use?
> A. Game reserve
> B. Pastures
> C. Horticultural crops
> D. Arable crops

The answer is **A. Game reserve**.

In the Week Seven teaching notes, move “wildlife conservation/game reserves” out of the examples of agricultural land uses and identify them separately as conservation/protected-area uses. Pasture should remain under agricultural land. No answer key has been changed and no teacher/owner decision is presumed.

## Repository disposition and verification
- Marked `AG-FACT-T1-W07-GAME-RESERVE-USE` `IMPLEMENTED_TESTING_DEFERRED` and appended the sourced finding/recommendation to the Agricultural Science queue.
- The task's `allowed_write_paths` permit only the queue and this evidence note. The package open item remains unchanged pending owner action.
- Verified archive and exact First Term DOCX member hashes; inspected source blocks 558, 561 and 608.
- Reviewed FAO and UN agricultural-land definitions, UNSD nature-reserve classification and Nigeria National Park Service protected-area objectives.
- Importer, TypeScript checks, database, learner rendering and tests were not run; testing remains deferred.
- No source bytes, lesson content, package data, schema/compiler or other subject files were changed.
