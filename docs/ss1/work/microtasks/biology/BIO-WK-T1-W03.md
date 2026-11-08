# BIO-WK-T1-W03 — Biology, 1st Term, Week 3 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing and assignment-scope review only; not approved, not verified, and not a complete or delivered week. Testing, typechecks, importer/compiler, database and device checks remain deferred by the owner.

## Source identity and verification

- Composite archive: `SSS 1-20260507T072431Z-3-001 (1).zip`; SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; 35,828,550 bytes. The digest matches the repository's recorded archive digest.
- Assigned member: `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`; 957,703 bytes; SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`; equals `SOURCE_ASSIGNMENTS.csv` and the queue attachment.
- The other two assigned Biology members were also re-hashed from this archive: 2nd Term `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc` = `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`; 3rd Term `SSS 1/3rd Term SS1_/3RD TERM S1 BIOLOGY.docx` = `1e9a758cdd07bd13511059b6d8ef6db0f618f99b14cdf11d20d33c183cb1bca4`. Both equal the assignment manifest.
- Only the required 1st Term member was extracted to private scratch for this item. No source document, extract, conversion or rendering was committed.

## Locator rule and boundary

The source is a native DOCX. Block = direct child of `w:body` in `word/document.xml`, zero-based; block text = concatenation of its `w:t` runs (UTF-8, no normalisation; text-box text belongs to its containing block); range hash = SHA-256 of block texts first..last inclusive joined with a newline, including empty blocks.

Re-derived 1,106 direct body children. The exact Week 3 label at block 133 has hash `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51`; blocks 133-644 have the queue's exact range hash `0103345f39d4a3f64705635245f85b0bbbc69edfea60ec9d843c00cf6d88e227`. Scheme entry 3 is block 4, exact text `Week 3 -Classification of Living things`, hash `90846288953e56236069142972ddfd5b1db1e76a5d61e83007ecc1f7af34b813`. The scheme line and label locators agree with the inventory and queue.

## Scheme objective and teaching evidence

| Scheme objective | Locator | Status | Finding |
|---|---|---|---|
| Week 3 — Classification of Living things | Scheme block 4; label block 133; body blocks 133-447 (range `aea4100034fbbf3a0b7224c36265b0bc9d41179bd7bce147fa52bef2a1e00ea8`) | PARTIAL | The source teaches classification across taxonomy, kingdoms, plant groups and animal groups. The package has no lessons, so this source teaching is not yet deliverable. |

The scheme objective is evidenced in these source ranges:

| Topic in the source | Exact blocks and range hash | What the source teaches |
|---|---|---|
| Meaning of classification and taxonomic ranks | 135-136 (`aff7c5f5ded5c02c6e33c568433d5e8fc862c1b7d8a067a4e9409912b522ad85`); rank diagram 137-155 (`e04ec56a91a301393fc767f2e14780206239d6d75237930d6a15675be39927e9`) | Defines classification/taxonomy, refers to Carolus Linnaeus, and gives Kingdom, Phylum/Division, Class, Order, Family, Genus and Species. The diagram prints “Genius” for Genus; the source wording is preserved and visual disposition remains with `BIO-VIS-T1-CLASS-HIERARCHY`. |
| Five kingdoms | 156-187 (`4ae26237ab8b58d672c6972327a754d675c730bda928530e248cd9239167f314`) | Names Monera, Protoctista, Fungi, Plantae and Animalia and gives characteristics/examples for the early kingdoms and Plantae. |
| Botanical classification | 188-244 (`57754fb1ec68a46283f047acc1faf10b98f61c340039093b7fef012a551bd2a6`) | Covers Thallophyta, Bryophyta, Pteridophyta and Spermatophyta; Gymnospermatophyta and Angiospermatophyta; then monocotyledons and dicotyledons. |
| Agricultural plant classification | 248-260 (`185d27a29ebf4ff3cd03f05cfc3d057dd43b331988ef6e2ecc11d69f68cc7329`) | Groups plants by crop/product use, including cereals, legumes, root crops, vegetables, fruits, cash crops, oil plants, fibre crops, beverages/drugs, quinine and spices. |
| Plant life cycles | 261-264 (`c60226a5c1f630812011f9f380017a36c1d37e7fba0b19c0089ca1aac1cab3df`) | Defines annual, biennial and perennial plants and gives examples. |
| Animal classification | 268-447 (`4119a2d6174be6b4fb7246d3b940e57241a5479d956c821110a32fd295bdfafd`) | Gives Animalia characteristics; distinguishes invertebrates and vertebrates; describes body symmetry, body design and body cavity; lists invertebrate phyla; and describes Pisces, Amphibia, Reptilia, Aves and Mammalia. |

**Separate, unlisted teaching:** blocks 265-267 (range `d65058818f5615666c88631e669991c237a13e89aad11c12712f4a6ac145f766`) carry the heading “Relevance of Biology to Agriculture”, a definition of agriculture and four human needs. This heading is not named in the Week 3 scheme objective. A bounded task, `BIO-SEC-T1-RELEVANCE`, was appended to the queue to index it separately and determine its placement. It is not silently folded into the classification coverage.

**Other unlabelled sections in the Week 3 body:** blocks 448-549 (range `9b687134eb1369508738f144502584713f5c27da3cfd92abe30df000c7d29cc9`) are the agricultural-activities/ecological-system and farming-method sections; they remain with `BIO-SEC-T1-AGRI-ECOLOGY`. Blocks 550-629 (range `4b3d3a1ca273e08edbcb5ef984b35b8522406648f2c0a42c0674b00b3fde5cd3`) are pest and agricultural-disease sections; they remain with `BIO-SEC-T1-PESTS-DISEASES`. They are not misrepresented as part of the classification objective.

## Assignment review

The assignment is explicitly labelled `ASSIGNMENT` at block 631 and `WEEK THREE` at block 632. Questions are in blocks 634-642 (range `fb122edb7c09f528334ee873e83b2ac6f8719f3c81019268f4c553e86d1de363`).

| Question | Source check | Disposition |
|---|---|---|
| 1. Odd one out: bat, shark, rat, whale | Shark appears as a cartilaginous fish example at 391. The source does not identify bat, rat or whale as Mammalia examples. | Not fully supported by this source alone; do not invent an answer key. |
| 2. Angiosperms and gymnosperms belong to which class? | Blocks 216-232 place Gymnospermatophyta and Angiospermatophyta under Spermatophyta. The source calls them divisions, while the question says “class”. | Intended option is suggested by the source's hierarchy, but the class/division wording needs teacher confirmation. |
| 3. Distinguishing feature of mammals | Block 437 says mammals' bodies are covered with hairs or furs. | Supported by the source text. |
| 4. Insects and millipedes share features except… | Blocks 355-363 give arthropod segmentation, exoskeleton, jointed appendages and other characteristics. The source does not discuss compound eyes. | The source does not establish the requested exception. |
| 5. Make a labelled lateral-view drawing of a fish | Blocks 388-400 describe fish features, but the assignment range contains no fish illustration or labelled reference drawing. | The task is an instruction to draw; no drawing or labels are supplied by the source. |
| 6. Five structural differences between Pisces and Mammalia | Pisces characteristics are at 388-400; Mammalia characteristics are at 433-446. | Supported as a comparison task by the two source descriptions. |
| 7. Five differences between monocotyledons and “cotyledons plant” | Blocks 235-244 provide a Monocotyledoneae/Dicotyledoneae comparison. The assignment's second term is incomplete as printed. | The intended comparison is suggested by the preceding source table; confirm the wording. |

No answer key or marking guide for questions 1-7 was found in the reviewed source range. The assignment coverage is therefore UNRESOLVED. `BIOLOGY-T1-W03-ASSESSMENT` records the exact teacher action required; no answer or mark allocation has been invented.

## Experiments, practicals and visual structure

A text search over blocks 133-644 found no occurrence of “experiment”, “practical”, “apparatus”, “procedure”, “safety”, “exercise”, “evaluation” or “test”. No experiment quantities, procedures or safety instructions are present to transcribe or infer.

The classification range 133-447 contains eight native drawing elements with eight VML fallback shapes, including the six-rank hierarchy diagram and the two monocot/dicot header shapes; it has no Word tables or embedded media images. It also contains 282 tab elements, so some column relationships rely on layout. The separate crop-rotation table at block 514 belongs to the agricultural-activities section, not this classification objective. The assignment blocks 631-642 contain no drawing, table or embedded figure. The existing visual tasks `BIO-VIS-T1-CLASS-HIERARCHY` and `BIO-VIS-T1-MONOCOT-DICOT` own their respective visual dispositions; this indexing item does not replace them.

## Package and queue changes

- `biology.json`: added `COV-BIO-T1-W03-SCHEME-3` (PARTIAL) and `COV-BIO-T1-W03-ASSESSMENT` (UNRESOLVED), plus blocking open items `BIOLOGY-T1-W03-COVERAGE` and `BIOLOGY-T1-W03-ASSESSMENT`. Existing sources, rules, lessons, corrections and assets were not changed; package status remains PENDING.
- `QUEUE.json`: marked `BIO-WK-T1-W03` IMPLEMENTED_TESTING_DEFERRED; appended `BIO-SEC-T1-RELEVANCE`; recomputed kind counts, status counts and `next_runnable`. Queue totals now show 14 IMPLEMENTED_TESTING_DEFERRED, 67 PENDING and 4 BLOCKED.
- No source bytes, source wording, lesson, answer key, correction, source rule or asset were added.

## Authoring checks and verification boundary

Checks performed: composite archive SHA-256; all three assigned Biology member SHA-256 values and byte lengths; DOCX body-child count; Week 3 label, scheme-entry, range and cited block/range hashes; question-by-question source comparison; structural drawing/table/tab counts; searches for practical/experiment/safety terms; JSON parse and unique coverage/open-item/queue IDs; status counts and runnable dependencies recalculated.

No test suite, TypeScript check, importer/compiler run, database rehearsal, device check or production import was run, as required by the owner's testing deferral. No claim of approval, certification, delivery verification or week completeness is made.
