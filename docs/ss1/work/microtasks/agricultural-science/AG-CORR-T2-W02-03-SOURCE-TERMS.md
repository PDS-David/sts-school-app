# AG-CORR-T2-W02-03-SOURCE-TERMS — Agricultural Science, Second Term Weeks Two and Three

Status: **BLOCKED — three corrections are verified, but no delivery binding can be made until an original lesson exists.**

## Source identity and exact locators

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Direct-body locators in `word/document.xml` (zero-based):
  - Block 39: `post-posting operations`; block 135: heading `POST -PLANTING OPERATIONS`.
  - Block 180: inorganic fertilizer description.
  - Block 254: MCQ option `plating space`; block 255: `Planting space` in the immediately following MCQ.
- Recomputed UTF-8 block SHA-256:
  - Block 39: `c5309b3fd481bbed308bc62b30194078783fe4fa18b96cb75bb6829518bbdc98`
  - Block 180: `e2adf9c1bb9560701f9850324e18755cdc4271e4aaf068d7029a9085dcc30983`
  - Block 254: `a18f28553ddea84238affe7f3e7d78edcda5b25da97e43750c04146fc45695ba`
  - Block 135: `a9bf905d1a60432c16024a5ffcfb46600da1712f58c23aadf4ce1868a61bf975`
  - Block 255: `f810910012f99800692b11c3fa194f4b9f243cda7f31deb4a5c7f8fc335f7896`

The archive, member and block hashes were independently recomputed from the Library copy and match the source inventory.

## 1. “Post-posting operations” at block 39

**Finding:** This is a transcription/typing error for **post-planting operations**. The same source defines the three classes of cultural practices at block 38 as pre-planting, planting and post-planting. The later heading at block 135 is “POST -PLANTING OPERATIONS,” and the activities listed in block 39—thinning, supplying, irrigation, manuring, mulching and weeding—are post-planting operations in the source's own classification.

**Recommended delivery correction:** Replace “post-posting operations” with “post-planting operations.”

**Evidence:** Exact same-document heading and classification at blocks 38 and 135. No external inference is needed.

## 2. “Plating space” at MCQ block 254

**Finding:** This is a spelling error for **planting space**. The immediately following question at block 255 uses “Planting space” as an answer option and asks for the distance between two sown seeds/plants. The source's planting section also covers spacing as a planting consideration.

**Recommended delivery correction:** Replace “plating space” with “planting space.”

**Evidence:** Direct internal parallel at block 255 and planting content in the same source. No alternate interpretation is plausible in this context.

## 3. Inorganic fertilizers “usually prepared in the farm” at block 180

**Verbatim source claim:** “These are chemical substances which are usually prepared in the farm…”

**Finding:** This is factually inaccurate as a general description of inorganic/chemical fertilizers. Inorganic or mineral fertilizers are manufactured from inorganic materials through industrial processes. The Fertilizer Producers & Suppliers Association of Nigeria (FEPSAN) explicitly defines industrially manufactured fertilizers as mineral fertilizers and describes their inorganic salts as obtained by extraction and/or physical or chemical industrial processes. The Federal University of Agriculture, Abeokuta (FUNAAB) lecture notes define inorganic/chemical fertilizer as simple chemical compounds made in a factory and separately describe fertilizer manufacture. FAO's World Programme for the Census of Agriculture defines mineral fertilizers as prepared from inorganic materials manufactured through an industrial process.

Some commercial fertilizers can be physically blended, granulated or formulated; that does not make inorganic fertilizer manufacture a routine on-farm preparation activity. The source appears to confuse manufactured inorganic fertilizer with organic manures/compost that can be prepared from farm residues and animal wastes.

**Recommended delivery correction:** Replace the opening description with: “Inorganic (chemical or mineral) fertilizers are manufactured industrially from inorganic materials. They may be supplied in liquid or solid forms such as powders, granules, pellets or crystals.”

This preserves the source's point about physical forms while correcting the unsupported claim that they are usually prepared on the farm. No fertilizer rates, mixing, application or handling instructions are added.

**Evidence:**
- FEPSAN, “About Fertilizer,” defines industrially manufactured fertilizers as mineral fertilizers and describes inorganic salts produced by extraction and industrial processes.
- FUNAAB, *Soil Fertility and Plant Nutrition*, defines inorganic/chemical fertilizer as simple chemical compounds made in a factory and includes a separate section on fertilizer manufacture.
- FAO, *World Programme for the Census of Agriculture 2020*, paragraph 8.04.40, defines mineral/inorganic fertilizers as prepared from inorganic materials manufactured through an industrial process.

## Why no delivery corrections are bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires the correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating a delivery-correction record now would require fabricated identifiers, which is prohibited.

Therefore:
- All three correction candidates are **verified** and their intended wording is not unresolved.
- The source bytes and source transcript remain unchanged.
- No `delivery_corrections` record is created yet.
- The correction-binding task is **BLOCKED** until an original Week Two/Three lesson and its body hash exist and a valid replacement lesson is authored/identified.
- The existing package open item `AGRICULTURAL-SCIENCE-T2-W02-03-SOURCE-TERMS` is updated to record the three verified corrections and this exact binding gate.

## Sources consulted

1. **Fertilizer Producers & Suppliers Association of Nigeria (FEPSAN)**, “About Fertilizer.” Defines industrially manufactured fertilizers as mineral fertilizers; inorganic salts are obtained by extraction and/or physical/chemical industrial processes. https://fepsan.org/about-fertilizer/
2. **Federal University of Agriculture, Abeokuta (FUNAAB)**, *Soil Fertility and Plant Nutrition*, SOS 511 lecture notes, section “Fertilizers.” Defines inorganic/chemical fertilizer as simple chemical compounds made in a factory; distinguishes organic fertilizers and describes fertilizer manufacture. https://unaab.edu.ng/wp-content/uploads/2012/05/Soil%20Fertility%20and%20Plant%20Nutrition.pdf
3. **Food and Agriculture Organization of the United Nations (FAO)**, *World Programme for the Census of Agriculture 2020: Programme, Definitions and Concepts*, paragraph 8.04.40. Defines mineral/inorganic fertilizers as products made from inorganic materials through industrial processes. https://www.fao.org/fileadmin/templates/ess/ess_test_folder/World_Census_Agriculture/WCA_2020/WCA_2020_final_draft/WCA_2020_full_04022015.pdf
4. **Fertilizer Producers & Suppliers Association of Nigeria (FEPSAN)**, “About Fertilizer,” paragraph on NPK blends. Explains that multinutrient fertilizers can be produced by physical blending or chemical reaction, supporting the distinction between industrial production/blending and routine on-farm preparation. https://fepsan.org/about-fertilizer/

## Changes and remaining gate

- Added this correction investigation record with exact source/block hashes and evidence.
- Verified “post-posting” → “post-planting” using same-source blocks 38 and 135.
- Verified “plating space” → “planting space” using same-source block 255 and planting-section context.
- Verified that inorganic fertilizers are industrially manufactured, not usually prepared on-farm, using Nigerian fertilizer-industry, FUNAAB and FAO sources.
- Updated the existing package open item with the verified replacement wording and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T2-W02-03-SOURCE-TERMS` `BLOCKED` until lesson authoring creates valid correction targets. No source bytes were changed.
- No fertilizer rates, mixing, application or handling instructions were added.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
