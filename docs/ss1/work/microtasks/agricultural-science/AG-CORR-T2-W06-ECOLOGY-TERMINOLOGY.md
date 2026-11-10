# AG-CORR-T2-W06-ECOLOGY-TERMINOLOGY — Agricultural Science, Second Term Week Six

Status: **BLOCKED — terminology findings are verified, but delivery binding awaits an original lesson.**

## Source identity and exact locators

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Exact direct-body locators:
  - Block 366: “biotic components can be grouped into two classes which are; Autotrophism and Heterotrophism.”
  - Block 368: heading “Autotrophism”; definition begins “This is a group of organisms…”
  - Block 370: heading “Heterotrophism”; definition begins “This is a group of organisms…”
- Recomputed UTF-8 block SHA-256:
  - Block 366: `a3df9be988ad1f9219daddccaa057acff69739d033323b3f3b1cc1563dae63f3`
  - Block 368: `569b77efdc680a8ef604bacf699fae0da797cc83593aebda0ac7b55279bf03c8`
  - Block 370: `09b29fe0eda9de5f2a8e864b6dd10d418cd3ad0797bbf64f1ba5ff444ca6dfe8`

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## Findings

### 1. Organisms versus nutritional modes

**Finding:** The source uses “Autotrophism” and “Heterotrophism” as labels for groups of organisms. The following definitions explicitly say “This is a group of organisms” and then describe the organisms that make their own food or depend on other organisms. The standard terms for the organisms are **autotrophs** and **heterotrophs**. The standard terms for the nutritional modes/processes are **autotrophy** and **heterotrophy**. “Autotrophism” and “heterotrophism” are sometimes used in educational writing to describe the modes, but they are not the correct labels for the organism groups described in these paragraphs.

OpenStax Biology and the USDA National Agricultural Library Thesaurus define autotrophs as organisms capable of producing organic matter from inorganic materials and distinguish them from heterotrophs. NLM Medical Subject Headings describes autotrophic and heterotrophic processes as modes of nutrient acquisition, not as names for the organisms themselves.

**Recommended delivery corrections:**
- Block 366: “The biotic components can be grouped into two nutritional groups: autotrophs and heterotrophs.”
- Block 368 heading: “(i) Autotrophs”
- Block 370 heading: “(ii) Heterotrophs”

If the lesson intends to name the modes rather than the organisms, use “autotrophy” and “heterotrophy” and rewrite the definitions to describe the modes. In the current source, however, the definitions clearly describe organism groups, so “autotrophs” and “heterotrophs” are the precise heading corrections.

### 2. Photosynthesis versus chemosynthesis (related clarification in block 368)

The source says autotrophs use “sunlight or chemicals” to manufacture food “during the process of photosynthesis.” This conflates two different energy pathways:
- Photoautotrophs use light energy to fix inorganic carbon through photosynthesis.
- Chemoautotrophs use energy from chemical reactions to fix inorganic carbon through chemosynthesis; they do not use photosynthesis for that energy pathway.

OpenStax Biology and Georgia Tech's Organismal Biology teaching resource distinguish the energy source (light or chemical compounds) from the carbon source (inorganic carbon for autotrophs). This clarification is directly relevant to the source's wording.

**Recommended delivery wording:** “Autotrophs make organic food from inorganic materials. Photoautotrophs use light energy in photosynthesis, while chemoautotrophs use energy from chemical reactions in chemosynthesis.”

This preserves the source's intended distinction between organisms that make their own food and organisms that obtain food from other organisms, while avoiding the claim that chemical-energy autotrophs perform photosynthesis.

### 3. Heterotrophs (block 370)

The source's description that heterotrophs cannot make their own food and depend on plants directly or indirectly is suitable as a simplified agricultural-science explanation for farm animals. It should not be interpreted as saying that only farm animals are heterotrophs: fungi and many bacteria are heterotrophic too. The heading correction to “Heterotrophs” is sufficient for the task; any broader examples should be added only if the lesson scope requires them.

## Correction decisions

| Locator | Source term/claim | Evidence-backed delivery wording | Decision |
|---|---|---|---|
| 366 | “Autotrophism and Heterotrophism” as classes of biotic components | “autotrophs and heterotrophs” | Correct |
| 368 | Heading “Autotrophism” followed by group-of-organisms definition | “Autotrophs” | Correct |
| 370 | Heading “Heterotrophism” followed by group-of-organisms definition | “Heterotrophs” | Correct |
| 368 | “sunlight or chemicals… during photosynthesis” | Distinguish photosynthesis (light energy) from chemosynthesis (chemical energy) | Correct/clarify |

## Why no delivery corrections are bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating correction records now would require fabricated identifiers.

Therefore:
- The terminology findings and recommended wording are verified.
- No source bytes or source transcript are changed.
- No `delivery_corrections` record is created yet.
- The binding remains blocked until an original Week Six lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T2-W06-TERMINOLOGY` is updated to record the evidence-backed terminology decisions and this exact binding gate.

## Sources consulted

1. **OpenStax**, *Biology 2e*, “Overview of Photosynthesis.” Defines photoautotrophs and heterotrophs as organisms and explains why heterotrophs depend on organic compounds produced by autotrophs. https://openstax.org/books/biology/pages/8-1-overview-of-photosynthesis
2. **Georgia Institute of Technology, Organismal Biology**, “Nutritional Needs and Principles of Nutrient Transport.” Distinguishes autotrophs/heterotrophs by carbon source and phototrophs/chemotrophs by energy source; explains photoautotrophs and chemoautotrophs. https://organismalbio.biosci.gatech.edu/nutrition-transport-and-homeostasis/nutrition-needs-and-adaptations/
3. **USDA National Agricultural Library, NALT Core**, “Autotrophs.” Defines autotrophs as organisms capable of producing organic matter from inorganic materials and contrasts them with heterotrophs. https://lod.nal.usda.gov/nalt/14050
4. **US National Library of Medicine, Medical Subject Headings (MeSH)**, “Autotrophic Processes.” Defines autotrophic and heterotrophic processes as modes of nutrient acquisition, distinguishing the processes from the organisms. https://meshb.nlm.nih.gov/record/ui?ui=D052818
5. **Secondary Biology 2 Student Textbook**, section “The facts.” Explicitly distinguishes the organism groups (autotrophs/heterotrophs) from the modes of nutrition (autotrophism/heterotrophism). Used as a pedagogical cross-check, not as the primary authority. https://www.cdc.gov.ss/uploads/subjects/Secondary%20Biology%202%20Student%20Textbook.pdf

## Changes and remaining gate

- Added this terminology investigation record with source/member/block hashes.
- Verified that the source headings describe organisms, so the correct group labels are “autotrophs” and “heterotrophs”; “autotrophy” and “heterotrophy” name the nutritional modes.
- Identified and documented the related photosynthesis/chemosynthesis distinction in block 368.
- Updated the existing package terminology open item with the verified wording and exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T2-W06-ECOLOGY-TERMINOLOGY` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
