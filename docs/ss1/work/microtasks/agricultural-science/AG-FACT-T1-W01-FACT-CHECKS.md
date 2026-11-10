# AG-FACT-T1-W01-FACT-CHECKS — Agricultural Science, First Term Week One

Status: **IMPLEMENTED — TESTING DEFERRED**. Evidence review completed for the identified etymology, recreation/tourism and agro-industry terminology questions. This note does not alter source bytes, approve a teacher's preferred wording or bind a delivery correction.

## Source integrity and exact locators

- Archive: `SSS 1-20260507T072431Z-3-001.zip`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- First Term member: `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx`
- Member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`
- Direct-body block locators use the AG-INV-T1 rule: zero-based direct children of `w:body`; text is concatenated from `w:t` runs without normalisation.
- Block 58 hash: `713541d8a45b12dae8dd9b1da8bd5527808d098db70043406f179948b994f7f5`.
- Block 107 hash: `6e403cff994d451d7f589daf32957325d2591f59146f1018b9f978112ebc93cb`.
- Block 127 hash: `db2262c12f4da099773d63b83343be0229141c551f9917caeee0d1575ec4d451`.
- Block 103 hash: `8e6b870aa140dd730571018148d3d19dc1be6c5437cd4e1111c7e75c4fc2491f`.
- Block 105 hash: `37a53a4b4462db97b34090b67570d553e6c09421f7d37da4f620de32dfdb51ae`.

The archive and assigned First Term member hashes were rechecked directly before inspecting the cited blocks.

## 1. Agriculture etymology — resolved factual discrepancy

- Block 58 says: “Culture” means cultivation.
- Block 127 uses the component “Cultura”.
- The Latin noun is **cultura** (“cultivation”); **ager** means “field” (genitive **agri**). The Latin compound is **agricultura**, literally cultivation of a field/land.
- Therefore the component pair for the source's question is **ager = field** and **cultura = cultivation**. “Culture” is the English cognate/word, not the Latin form required in the etymology.
- Recommendation for a future delivery layer: use “cultura” consistently and explain the compound as *ager/agri* + *cultura*. Preserve block 58 unchanged in source evidence.

Sources:
- Etymonline, “agriculture”: https://www.etymonline.com/word/agriculture
- American Heritage Dictionary, “agriculture”: https://www.ahdictionary.com/word/search.html?q=AGRICULTURE
- Missouri Botanical Garden, A Grammatical Dictionary of Botanical Latin, “ager”: https://www.mobot.org/mobot/latindict/keyDetail.aspx?keyWord=ager

## 2. Recreation and tourism claim — recommend qualification

Block 107 says: “Agriculture leads to the establishment of game reserves. It also provides horse for horse racing and polo.”

The two examples should not be taught as if they were ordinary direct outputs of crop and livestock production:

- **Game reserves:** their primary purpose is wildlife and habitat conservation. Nigeria's National Park Service identifies wildlife conservation, protection of habitats, preservation of natural/cultural resources, recreation, public visitation and ecotourism among national-park objectives. FAO describes protected areas as spaces managed for long-term nature conservation and associated ecosystem services/cultural values. A reserve may contribute to rural tourism and local livelihoods, but its establishment is principally a conservation/protected-area function, not simply a direct result of agriculture.
- **Horses for racing and polo:** breeding, feeding and caring for horses are forms of animal husbandry. Horse racing and polo are sporting/recreational uses of horses. The agricultural link is therefore through livestock breeding and management; the sports themselves are not agricultural production activities.

Recommended qualified wording for a future delivery layer:
“Animal husbandry can include breeding and caring for horses used in sport. Wildlife reserves are protected areas established mainly for conservation and may also support recreation, tourism, education and local livelihoods. These are wider links between land-based activities, animal management and recreation, rather than direct crop-production outputs.”

This is a factual recommendation, not a teacher-approved rewrite. The original source wording remains unchanged.

Sources:
- Nigeria National Park Service, “Objectives of National Parks”: https://nigeriaparkservice.gov.ng/camping-activities/
- FAO, “Wildlife and Protected Area Management — Background”: https://www.fao.org/wildlife-protected-areas/background/en
- FAO, “Wildlife management”: https://www.fao.org/sustainable-forest-management-toolbox/modules/wildlife-management/

## 3. Agro-based versus agro-allied — learner clarification already implemented

The original source uses:
- block 103: agro-based industries as industries depending on agriculture for raw materials;
- block 105: agro-allied industries as suppliers of farm inputs/equipment and support facilities;
- Week 6 block 482: the terms are run together as if interchangeable.

The distinction is already explained in `SUP-SS1-AGRICULTURAL-SCIENCE-T1-W02-AGRO-INDUSTRIES`:
- **Agro-based industries** process raw agricultural, forestry or fishery materials into partly or fully processed products.
- **Agro-allied industries**, as used in the Week 1 source, supply inputs, equipment or services that support agricultural production.

The lesson records that wider sources sometimes use “agro-industry” broadly to include both upstream input supply and downstream processing. It does not silently rewrite Week 6 block 482. This factual issue has an authored learner clarification; its content approval and original-row delivery mapping remain separate release gates.

## 4. Crop pathology versus animal pathology — already resolved in the Week 1 supplement

The source's Weekend Assignment at blocks 131–132 asks about diseases of crops and animals but gives “Pathology” as the answer. The Week 1 supplement `SUP-SS1-AGRICULTURAL-SCIENCE-T1-W01-CROP-ASPECTS` correctly teaches crop pathology/plant pathology as the study of diseases affecting crops and other plants, and veterinary pathology as the specialist field concerned with animal diseases. The original source wording is preserved; no correction binding is claimed.

## 5. Reading-page references — not verified

The Week 1 reading assignment gives page ranges for Iwena and Okafor books (blocks 124–125). Exact editions/copies were not available in the reviewed source archive or the accessible project files. The page references therefore remain unverified; do not claim those pages were checked or invent substitute page numbers.

## Remaining decisions and delivery gates

1. A qualified Agricultural Science reviewer should approve or amend the proposed treatment of game reserves and horse sports in item 2.
2. The original Week 1 parsed row and body hash must be confirmed by the authorised importer before any etymology/recreation delivery correction is bound.
3. Existing agro-industry and crop-pathology supplements remain `content_approval: PENDING`; their factual clarification does not equal formal approval.
4. The listed textbook page references remain unverified until the exact cited editions/copies are available.
5. No source bytes, lesson body, answer key, source rule or shared importer/schema/compiler was changed by this fact review.
6. Testing, importer/compiler, database, authenticated student retrieval and device rendering remain deferred.
