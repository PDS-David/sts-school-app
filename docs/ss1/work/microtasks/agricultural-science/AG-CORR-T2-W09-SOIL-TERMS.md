# AG-CORR-T2-W09-SOIL-TERMS — Agricultural Science, Second Term Week Nine

Status: **BLOCKED — correction wording is strongly supported; delivery binding awaits an original lesson.**

## Source identity and exact locators

- Source ID: `SS1-SRC-956594d97094`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042`
- Exact direct-body locators:
  - Block 626: heading “TOPOGRAPHY”
  - Block 627: “Soil erosion is more pronounced on sloppy area than flat land…”
  - Block 633: heading “BIOTIC FACTORS [LIVING ORGANISMS]”
  - Block 634: “The action of microorganisms, plants and animals plays active part in rock formation.”
  - Block 635: “Termite and earthworms mix the minerals and organic matter together resulting in the formation of soil.”
  - Block 638: “Penetration of plant roots cause weathering of rocks.”
  - Block 639: “The decaying of falling leaves…result in the formation of humus…”
- Recomputed UTF-8 block SHA-256:
  - Block 626: `6deec2c8f30cab546bf18bc5b4cdda3ece9a442ecb3417aa08c29fd592f634dc`
  - Block 627: `3d91f52ce2449d5253343e08e4ceb31844f8236355b3e3bd9dad1e3e2f913e21`
  - Block 633: `cedf7b2df8acbddbf040ba14b195a7fbb84f2235bde011e377440c6fb885f56f`
  - Block 634: `6965631ca49413d3db774a21c7da54b4e3b57f6663cb4a91aade6a746d73cfa1`
  - Block 635: `b19f4efbbdf06ca65c659c9ce26f96d817bdf8738389e1ce3c2592edecc83083`
  - Block 638: `f26bed8b81421b96f8308b1b6e4a2a344ea5e073bb0a93df9b4a566257c49c96`
  - Block 639: `a1e5d8a8eccc167184a2e14dcef9a15b60ab0ea82a5608cba4615c4e1a4f13ee`

The archive/member and block hashes were independently recomputed from the Library copy and match the source inventory.

## 1. “Sloppy area” at block 627

**Finding:** The intended term is **sloping area** (or “sloping land”). The section is “Topography”; the same sentence compares the area with flat land and then refers to soil/rock particles being washed to “the bottom of the slope.” In soil science, slope/topographic position affects runoff and erosion; “sloppy area” is not the correct topographic term in this context.

**Recommended delivery correction:** Replace both occurrences of “sloppy area” in block 627 with “sloping area.”

**Evidence:** Direct context in block 627 (contrast with flat land and later reference to the bottom of the slope), the Week Nine topic “Factors of Soil Formation,” and authoritative soil-science sources describing greater runoff/erosion on sloping or steep land. Parallel copies found online reproduce the same “sloppy area” wording and therefore do not provide an independent correction; they are recorded as propagated copies, not as the correction authority.

## 2. “Rock formation” at block 634

**Finding:** The intended phrase is **soil formation**. Block 634 appears under the heading “Biotic Factors [Living Organisms]” in a lesson titled “Factors of Soil Formation.” The immediately following examples explain that termites and earthworms mix minerals and organic matter to form soil (block 635), plant roots weather rocks (block 638), and decaying leaves form humus (block 639). These are mechanisms by which organisms contribute to soil formation and development. “Rock formation” is inconsistent with the section and the examples; organisms contribute to biological weathering and soil formation, not the formation of the parent rock.

**Recommended delivery correction:** Replace “rock formation” with “soil formation” in block 634:

“The action of microorganisms, plants and animals plays an active part in soil formation.”

**Evidence:** Direct section heading and examples in blocks 633, 635, 638 and 639; FAO describes organisms as central to soil formation, from biological weathering of parent material through organic-matter turnover; National Open University of Nigeria soil-science materials describe organisms as an active factor in soil formation.

## Parallel-copy assessment

Ecolebooks and Lessonnotes.ng copies of the same Week Nine topic reproduce “sloppy area” and “rock formation.” They appear to propagate the same source wording and are not independent evidence for the intended corrections. No teacher-approved alternate copy was found. The proposed replacements are nevertheless supported by the original source's own context and authoritative soil-science references; no correction is made to the original source file.

## Recommended delivery corrections

1. Block 627: “sloppy area” → “sloping area” (both occurrences).
2. Block 634: “rock formation” → “soil formation”; the full sentence may be rendered as “The action of microorganisms, plants and animals plays an active part in soil formation.”

These are delivery-only wording corrections. The original DOCX and source transcript remain unchanged.

## Why no delivery corrections are bound yet

The subject package currently has:
- `lessons.length === 0`
- `delivery_corrections.length === 0`

The strict `correctionSchema` requires an exact `source_lesson_id`, `body_sha256` and `replacement_id`, in addition to the source ID/hash and evidence. The contract requires a correction to resolve an original lesson to one replacement supplement from the same subject and term. No original lesson row, lesson ID, lesson body hash or replacement lesson exists in the package. Creating delivery-correction records now would require fabricated identifiers.

Therefore:
- Both correction candidates are supported by the source context and soil-science references.
- No source bytes or source transcript are changed.
- No `delivery_corrections` records are created yet.
- The binding remains blocked until an original Week Nine lesson and its body hash exist and a valid replacement lesson is authored/identified.
- Existing package open item `AGRICULTURAL-SCIENCE-T2-W09-SOIL-TERMS` is updated with the verified candidate wording and this exact binding gate.

## Sources consulted

1. **Food and Agriculture Organization of the United Nations (FAO)**, “How is soil formed?” Explains that organisms play a central role in soil formation, from biological weathering of parent material to turnover and incorporation of organic material. https://www.fao.org/agriculture/crops/thematic-sitemap/theme/spi/soil-biodiversity/the-nature-of-soil/how-is-soil-formed/en/
2. **National Open University of Nigeria**, *Soil Morphology and Classification* (SLM 507). Describes organisms, plants, animals and microorganisms as active factors in soil formation and links topography/slope to soil development. https://nou.edu.ng/coursewarecontent/SLM%20507%20Soil%20Morphology%20and%20Classification.pdf
3. **University of Minnesota Extension**, “Five factors of soil formation.” Describes topography's effects on runoff and erosion and the role of soil organisms in soil formation. https://extension.umn.edu/natural-resources/conservation/agricultural-soil-and-water/five-factors-of-soil-formation
4. **OpenStax Biology 2e**, “The Soil.” Describes the effects of topography, biological factors, animals, microorganisms and plant roots on soil formation and structure. https://courses.lumenlearning.com/suny-osbiology2e/chapter/the-soil/
5. **Ecolebooks Nigeria**, “Week 9 – SS1 Second Term Agricultural Science Notes.” Parallel copy reproduces “sloppy area” and “rock formation”; used only to confirm that the source wording has propagated, not as authority for correction. https://ecolebooks.com/nigeria/posts/week-9-ss1-second-term-agricultural-science-notes/
6. **Lessonnotes.ng**, “Soil Formation and Profile Development.” Parallel copy reproduces the same two phrases; used only as a propagated copy, not as authority for correction. https://lessonnotes.ng/ss1/agricultural-science/soil-formation-and-profile-development/

## Changes and remaining gate

- Added this correction investigation record with exact source/member/block hashes.
- Verified “sloppy area” → “sloping area” from topography context and soil-erosion references.
- Verified “rock formation” → “soil formation” from the biotic-factor section, its examples and FAO/NOU/extension soil-science sources.
- Recorded that available parallel copies reproduce the same errors and are not independent correction authority.
- Updated the existing package soil-terms open item with both candidate corrections and the exact lesson-binding gate.
- Left `delivery_corrections` unchanged because no original lesson ID/body hash or replacement lesson exists.
- Marked `AG-CORR-T2-W09-SOIL-TERMS` `BLOCKED` until lesson authoring creates valid correction targets. Original source bytes remain unchanged.
- Tests, importer/compiler, TypeScript, database, learner rendering, device checks and CI remain deferred.
