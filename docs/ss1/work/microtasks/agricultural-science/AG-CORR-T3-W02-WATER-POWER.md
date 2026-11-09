# AG-CORR-T3-W02-WATER-POWER — Agricultural Science, Third Term Week Two

Status: **BLOCKED — classification findings are verified; delivery binding awaits an original lesson.**

## Source identity and exact locators

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Exact direct-body locators:
  - Block 210: definition of water power as energy derived from flowing water, used to drive turbines in hydroelectric stations.
  - Block 215: heading “ADVANTAGES OF WATER POWER”.
  - Block 216: flowing water turns turbines/water wheels to generate electrical energy.
  - Blocks 217–220: transportation of farm goods; processing farm produce; seed germination and normal crop growth; photosynthesis.
  - Blocks 222–227: disadvantages of water power.
- Recomputed UTF-8 block SHA-256:
  - Block 210: `bc0b3a4f75f1ea335842fd1136a761fa1eadb89f6cbde6e943c17831b7001d53`
  - Block 215: `c534645e178b10b5d39a2a086bde4d31e61547088f073e7109347729211472de`
  - Block 216: `a9636ba676632ee2214db71281ef7640902fb7b65746b8a4b4dda9c0030e6dd4`
  - Block 217: `79d838dcd1280648f23c822852f38a9416875c21bd6a8130500d735b6dafe738`
  - Block 218: `2a8d421a528bc483078a11c9438ac34a761ce328efa782436d5048030ab6a46b`
  - Block 219: `b455245adadf8f72ba6dd5015d3e2452e70685b263919eee420011f2177b23b8`
  - Block 220: `1181e494f656ccc4fe3b053f246a334bce596b0026491b764acd85ab711e79b8`

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Finding: the heading conflates hydropower with water as a resource

The source's definition at block 210 is about **hydropower**: energy from moving water used to drive turbines in hydroelectric stations. Block 216 is a correct example of a hydropower use/advantage: flowing water turns a turbine or water wheel to generate electrical energy.

Blocks 217–220 do not describe hydropower. They describe other roles of water:

| Block | Source wording | Correct classification |
|---|---|---|
| 217 | “It is used in transportation of farm goods.” | Waterways as a transport route/medium; not hydropower unless the source specifically says water-generated electricity powers the transport. |
| 218 | “It can be used to process farm produce.” | Water as a processing/hygiene resource; not water power. |
| 219 | “It is needed in seeds germination and normal growth of crops” | Water as a biological/agricultural resource needed for germination and crop growth. |
| 220 | “It is needed in the process of photosynthesis by plants.” | Water as a reactant/resource in plant photosynthesis; not a source of power. |

The U.S. Energy Information Administration and U.S. Department of Energy define hydropower as harnessing the energy of moving water, normally through turbines connected to generators. This directly supports the source's block 210 and block 216, but not the four statements at 217–220.

FAO's crop-water guidance describes water as necessary for crop growth and transpiration; WHO's food-production/processing guidance describes water as a major input throughout primary production and processing. These are water-resource uses, not energy-generation uses. The statement about photosynthesis is likewise about water's biological role, not hydropower.

## Recommended delivery reclassification

Retain the original wording of blocks 217–220 but move them out of “Advantages of Water Power” into a separate subsection such as **“Other uses/importance of water in agriculture”**:

- Waterways can be used to transport farm goods.
- Water is used in processing farm produce.
- Water is needed for seed germination and normal crop growth.
- Water is required in photosynthesis.

Keep block 216 under “Advantages/uses of hydropower.” Keep blocks 223–227 under “Disadvantages of hydropower” unless a later subject review finds a specific wording issue.

Do not rewrite blocks 217–220 as hydropower uses or imply that water transport, produce processing, germination or photosynthesis are powered by hydroelectricity. This is a classification/restructuring recommendation, not a claim that the original sentences themselves are false.

## Why no delivery correction is bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating a delivery-correction record now would require fabricated identifiers.

Therefore:
- The distinction between hydropower and water-resource uses is verified.
- Original wording at blocks 217–220 is preserved; only its delivery classification should change.
- No `delivery_corrections` record is created yet.
- The binding/reclassification remains blocked until an original Week Two lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T3-W02-WATER-POWER` is updated with the precise classification and this exact binding gate.

## Sources consulted

1. **U.S. Energy Information Administration**, “Hydropower explained.” Defines hydropower as energy in moving water and explains that flowing water turns turbine blades to power a generator. https://www.eia.gov/energyexplained/hydropower/
2. **U.S. Department of Energy**, “How Hydropower Works.” Defines hydropower as energy from the kinetic energy of flowing water, converted to electricity through turbines and generators. https://www.energy.gov/cmei/water/how-hydropower-works
3. **U.S. Department of Energy**, “Glossary of Hydropower Terms.” Defines hydropower as harnessing flowing water to create energy captured via a turbine to generate electricity. https://www.energy.gov/cmei/water/glossary-hydropower-terms
4. **FAO**, “Chapter 2: Crop Water Needs.” Explains the role of water in plant growth, transpiration and crop water needs. https://www.fao.org/4/s2022e/s2022e02.htm
5. **World Health Organization**, *Safety and quality of water used in food production and processing* (2019). Describes water as a major input in food production and processing and its role in hygiene/sanitation throughout the food chain. https://www.who.int/publications/i/item/9789241516402
6. **Original source document**, Third Term Week Two, blocks 210, 215–220 and 222–227. Provides the direct context and shows that only block 216 explicitly describes water-driven turbines/wheels generating electrical energy.

## Changes and remaining gate

- Added this classification investigation record with exact source/member/block hashes.
- Verified block 210 and 216 as hydropower; classified 217–220 as water-resource uses (transport, processing, crop growth/germination and photosynthesis).
- Recommended retaining the source sentences but moving blocks 217–220 to a separate “Other uses/importance of water in agriculture” subsection.
- Updated the existing package water-power open item with the precise distinction and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T3-W02-WATER-POWER` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
