# AG-INV-T3 — Agricultural Science, 3rd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (source inventory only; not approved, not verified). Testing and importer/rendering remain deferred by the owner.

## Inputs and provenance

- Base: `origin/master` `a087dc8` (fetched). The assigned prerequisite `AG-SRC-T3` is `IMPLEMENTED_TESTING_DEFERRED`; the package registers `SS1-SRC-458a07f7ea5a` as 3rd Term Agricultural Science.
- Supplied original: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`, 5,406,306 bytes. SHA-256 calculated directly from the attached DOCX: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`; it exactly matches the `SOURCE_ASSIGNMENTS.csv` member hash.
- The composite ZIP SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` was not reverified in this task; the supplied file is the exact source member, not the composite archive.
- Method: opened the DOCX directly; inspected `word/document.xml` direct body children, paragraph/table structure, relationship targets, and embedded image content. Original bytes and extracted media remain outside the repository. The importer/compiler and learner rendering were not run.

## Locator rule

Block = direct child of `w:body` in `word/document.xml`, 0-based. The document has 1,256 direct body children: blocks 0–1254 are paragraphs/tables and block 1255 is `w:sectPr`. Block text = concatenation of its `w:t` runs, UTF-8, without normalization. Range hash = SHA-256 of block texts first..last inclusive joined with `\n`, empty blocks included. Week label hash = SHA-256 of that label block's text. Table hashes below are SHA-256 of the concatenated cell text in the table block.

## Week inventory (10 teaching-week bodies)

| Week | Exact label | Topic heading | Blocks | Label SHA-256 | Range SHA-256 |
|---|---|---|---|---|---|
| 1 | `WEEK ONE` (26) | Simple farm tools | 26–75 | `635789fb4e63974d59acfd3667c0b0fb9a4b935d51684c017ac9879e598deb6b` | `fd12c22ae7e30ab3b7903457502daa6125da806655322eab6090e7f4e0e819d7` |
| 2 | `WEEK TWO` (76) | Farm power | 76–279 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` | `a580fafc641cfb780fe608ca29b6bd943fe335d12df02e1d98147ee8d33fe4ba` |
| 3 | `WEEK THREE` (280) | Farm mechanization (TRACTORIZATION) | 280–369 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | `d27df15557ac65f36ae3eb3ab8e83d532800d46b3798a4efd262818061e55db2` |
| 4 | `WEEK FOUR` (370) | Anatomy and physiology of farm animals | 370–523 | `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2` | `53f4e7e4e5be6ec369a81e8b68b0098b12f85395e248ff0f13035f01c88d1499` |
| 5 | `WEEK FIVE` (524) | Respiratory system | 524–606 | `700c30e110b71fbdb4d6aaa0ea0a922cb9d63b799643acd01e32055226c62598` | `df93004697a28727f740591bb0256c07afbeab82aa6a032d14098df02ac63cde` |
| 6 | `WEEK SIX` (607) | Reproduction in farm animals | 607–787 | `8c07e3bd938cea9a3897d0d69eb6c600bf1fbace15d21b346bf0372fa095c038` | `984ba7e0f5936a9a5dfb7680e93fc00ab7c64faa8bc8cbab696cbeda6b6159c7` |
| 7 | `WEEK SEVEN` (788) | Reproduction in farm animals II | 788–854 | `4a723109953b31906cbe40ce93fd8a4f440295167adea8b71e78dda0d7f59808` | `7e69c5c03f6c38dd97d0bd0e33c58f1772d980a4853bc595d28894e331b6abbc` |
| 8 | `WEEK EIGHT` (855) | Environmental physiology | 855–981 | `af0f60bc43d333ec85dbc163a1cccce62b4089fe90a5f15dbbbc0dac060b870e` | `106414bcb63f69eb63b0840d79249be625382f1fa47fa83ef14e0203109a4ba7` |
| 9 | `WEEK NINE` (982) | Livestock management (pigs) | 982–1123 | `e38b03944a5cbe25a9e8b633065edd7490e9360c352bcb33ba8e6926594b756f` | `5a6918c499185465ecb30f240112f9c39c3697e7ba6fed967255d8154efdc0e4` |
| 10 | `WEEK TEN` (1124) | Livestock management II (cattle) | 1124–1254 | `3ee3bfdc68d8630b1fb02fe862672c802a6d5e762236767928f0d739d3291e10` | `9b3f1eb753bab7cfec4511faab33fb3eee2bacdad2b167fdd0a74e4222d4661c` |

Scheme mapping: item 1 = Week 1; 2 = Week 2; 3 = Week 3; item 4–5 = Weeks 4–5; item 6–7 = Weeks 6–7; item 8 = Week 8; item 9–10 = Weeks 9–10. The scheme's Week 11 `Revision` and Week 12 `Examination` are not instructional week bodies.

## Opening material and markers

- Blocks 0–25 (range SHA-256 `3f38a1bf54c05301d2a842b6fce4450dc0594cbdcf6394c34061879232353cda`) contain the generic heading `THIRD TERM E-LEARNING NOTE` (block 0), `SUBJECT: AGRICULTURAL SCIENCE / CLASS: SS1` (block 2; whitespace collapsed here), `SCHEME OF WORK` (block 4), scheme heading `WEEKTOPIC` (block 6), scheme rows (blocks 7–15), and `REFERENCES` (block 17; six entries at blocks 18–23). The subject is explicitly confirmed by the SUBJECT line, not inferred from the filename.
- Scheme row texts as extracted from the DOCX runs: block 7 `1Simple farm tools`; 8 `2Farm power`; 9 `3Farm mechanization`; 10 `4 – 5Anatomy and physiology of farm animals`; 11 `6 – 7Reproduction in farm animals`; 12 `8Environmental physiology`; 13 `9 – 10Livestock management (pig and cattle) `; 14 `11Revision `; 15 `12Examination`. Number and label are adjacent in the underlying runs; the source wording is preserved.
- The references list Essential Agricultural Science for Senior Secondary Schools (O. A. Iwena), Agricultural Science WAEC PQ, Practical approach to animal production and health (Akinlade J. A. et al.), General outlook to livestock production (Akinlade J. A. et al.), Essential biology for Senior Secondary Schools (M. C. Michael), and Wikipedia. These references were inventoried, not independently consulted.
- Revision marker: block 14, exact text `11Revision `, SHA-256 `b2b9524e250fc89af5cb83bc7c361e11726e54e0feef9d280456b08b105ec0a1`. No Week 11 label/body, revision worksheet or marking scheme.
- Examination marker: block 15, exact text `12Examination`, SHA-256 `71922f45b5afa7b8dc4121bcf450a62b7961da3f379568aaaa0d1c2de8720e7a`. No Week 12 label/body, examination paper or marking scheme.
- Week 1 includes a practical/project instruction (block 37): draw all 30 highlighted farm tools in a drawing book, write a short note describing them, and state their maintenance and uses. The source includes a 30-tool table (block 36), but no 30 corresponding embedded drawings were found. No structured observation/recording sheet is present elsewhere in the document.

## Visual and structured-content inventory

The DOCX has four body tables, 18 body image groups containing 23 linked raster media files, two alternate WDP image-effect layers associated with two separate Week Four image groups (blocks 487 and 494), three text-based respiration equations, and one inline Office Math object. The two WDP files are alternate/effect layers in the Week Four drawing groups at blocks 487 and 494, respectively; they are not independent teaching figures. Visuals were viewed in a private contact sheet; no source media was committed.

| Week | Locator | Structure / content |
|---|---|---|
| 1 | table block 36 | 6 x 10 farm-tool list (30 named tools); SHA-256 `0e24371a1169758b82a4429bdd59167fc63282d90887b024caae7757ed6b105e` |
| 2 | image block 108 | Draught animals / animal traction (`image1.png`) |
| 2 | image block 128 | Tractor / mechanical power (`image2.png`) |
| 2 | image block 167 | Solar panels (`image3.png`) |
| 2 | image block 194 | Windmill (`image4.png`) |
| 2 | image block 211 | Two-image group: electricity generation and hydroelectric dam (`image5.png`, `image6.png`); no WDP effect layer is attached to this block |
| 4 | image block 395 | Ruminant/cattle digestive tract (`image7.png`) |
| 4 | image block 417 | Pig digestive system (`image8.jpeg`) |
| 4 | image block 425 | Poultry digestive system (`image9.jpeg`) |
| 4 | table block 431 | 7 x 3 monogastric/polygastric comparison; SHA-256 `0ca145261c566e4b6fdfaa02c15d7b741be36a751106f10076b43b37d4bf9fd2` |
| 4 | image block 487 | Two-image male reproductive-system group (`image10.jpeg`, `image11.jpeg`; alternate/effect layer `hdphoto1.wdp`) |
| 4 | image block 493 | Female reproductive-system diagram (`image12.jpeg`) |
| 4 | image block 494 | Second female reproductive-system image / photographed page (`image13.jpeg`; alternate/effect layer `hdphoto2.wdp`) |
| 5 | image block 547 | Respiratory tract/lungs diagram (`image14.jpeg`) |
| 5 | image block 554 | Two fish-gill diagrams (`image15.jpeg`, `image16.jpeg`) |
| 5 | blocks 530, 535, 538 | Three text-based respiration equations (general, aerobic and anaerobic); not image assets or Office Math objects |
| 6 | table block 724 | 6 x 3 species/female-name/gestation-period table; SHA-256 `2a4920ab1813f229acf23091705f2ae7378471933fbf2d7e93c5a86e062d1925` |
| 7 | image block 803 | Bird embryo and poultry internal-organs image pair (`image17.jpeg`, `image18.jpeg`) |
| 7 | image block 804 | Photographed reproductive-system page and female reproductive tract (`image19.jpeg`, `image20.jpeg`) |
| 7 | image block 819 | Male/female reproductive-system diagram (`image21.jpeg`) |
| 7 | table block 828 | 8 x 4 reproductive-hormone table; SHA-256 `dc4ce1cf72d8b6490cf5260a040f348e35fad1b3ab6e6b80b884f0326fe1a3e` |
| 9 | image block 1006 | Pig external anatomy/body-parts diagram (`image22.jpeg`) |
| 10 | image block 1155 | Cattle external anatomy/body-parts diagram (`image23.jpeg`) |
| 10 | inline Office Math block 1165 | Inline mathematical object embedded in the cattle gestation-characteristics sentence; preserve its exact numeric statement and determine whether it is semantic math or formatted text during visual disposition |

**WDP image-effect-layer mapping (reverified from original DOCX XML):**
- `word/document.xml` direct-body block 211 — C14N XML SHA-256 `eb7fa7f9efaa71470249fb6c5e4b8f6f95517db2a656f26f0bfdc277bf3e8027`; `rId11 → media/image5.png`, `rId12 → media/image6.png`; no `a14:imgLayer` is present.
- Block 487 — C14N XML SHA-256 `83769c0683fdbafe2907881e8038e6317812f2d873a017da30b66f6459749081`; `rId16 → media/image10.jpeg`, `rId22 → media/image11.jpeg`, `a14:imgLayer rId21 → media/hdphoto1.wdp`.
- Block 494 — C14N XML SHA-256 `bc1c82e7330ecd257d1353d95e0d7f3654ba4aa4e9a61ce3c77a6cf42c403790`; `rId24 → media/image13.jpeg`, `a14:imgLayer rId25 → media/hdphoto2.wdp`.
- The WDP relationships are alternate/effect layers inside their respective Week Four drawing groups, not independent teaching figures. No separate WDP visual records are created.

The image relationship map shows 23 linked raster media files in the body; image groups may contain more than one image. The two WDP media files are referenced as alternate image-effect layers at Week Four blocks 487 (`hdphoto1.wdp`) and 494 (`hdphoto2.wdp`), not at Week Two block 211. The body also contains 42 DrawingML drawing elements and 16 VML pict elements; the separate visual items above are anchored to the 18 image-bearing body paragraphs and the four actual tables. No OLE object was found.

## Practical work and chemical / dosage cautions for later indexing

- Practical/recording: Week 1's drawing-book project is the only explicit practical/project instruction found. It requires drawing 30 tools and writing descriptions, maintenance and uses. It does not supply the drawings or a student observation/recording template.
- Week 9 pig management: external parasites are controlled by spraying pesticide or dipping in insecticide solution (no product-specific application rate or PPE/handling instructions stated). African swine fever section says to disinfect pig houses with 10% caustic soda and leave the pen empty for about two months. Swine erysipelas mentions penicillin; piglet hypoglycaemia mentions glucose injection. These are source statements, not validated veterinary directions.
- Week 10 cattle management: mange section names diazuntol, malathione, benzyl benzoate and benzene hexachloride, and mentions ivermectin/ivomec injection. Tuberculosis section states isonicotinic hydrazide at 10 mg/kg body weight for eight weeks. Dehorning also mentions applying caustic soda to the horn bud. The source provides no safe-handling/PPE instructions for these chemicals and no supporting veterinary references within the document. Later work must not invent doses, endorse these directions, or omit the source's presence of dose/chemical statements; flag them for source-fact and safety review before delivery.

## Structural parser-rule findings (findings only; no rule written)

- The importer’s `WEEK_MARKER` expression accepts spelled-out week numbers one through thirteen as well as numeric labels. The ten source labels `WEEK ONE` through `WEEK TEN` match this shape; no `split_before` insertion appears necessary from the observed text.
- The scheme heading `WEEKTOPIC` and `WEEKEND ASSIGNMENT` do not supply a following numeric/word week token and are not week labels under the importer pattern. No false marker was identified in the inspected source text.
- No stranded week label was found: each week label is a standalone paragraph, followed by its topic heading/content. No `attach_stranded_label` finding.
- The source-alias rule `SS1-SRC-458a07f7ea5a-R001` is already registered for the generic opening heading; this inventory adds no source rule.
- Scheme rows 11 and 12 have no matching instructional body and are to be treated as `SCHEME_ONLY` marker dispositions by the separate marker tasks. Per-week evaluation, general evaluation, weekend assignment and theory sections remain within their respective teaching-week body and must not be mistaken for term-level revision/examination markers.
- Importer/compiler uniqueness and final parsed row IDs remain unverified because the importer was not run.

## Edits

- `QUEUE.json`: `AG-INV-T3` -> `IMPLEMENTED_TESTING_DEFERRED`; 37 PENDING follow-up items appended: one preamble index, ten week-indexing items, two scheme-marker dispositions and 24 visual dispositions. Counts, status counts and `next_runnable` recomputed. No existing item ID or unrelated subject was changed.
- This inventory report. No package lesson, coverage entry, source rule, correction or asset was written.
- Authoring checks: member SHA-256 matched manifest; week labels and range hashes computed from original DOCX XML; queue JSON parsed; IDs checked unique; counts and runnable dependencies recomputed. No tests, importer, compiler, typecheck, database or learner-rendering checks were run.

## Remaining

The 3rd Term source is now inventoried, but the ten week bodies have not been indexed at objective level. Next eligible Agricultural Science work follows the queue's kind order: `AG-PRE-T3`, then the `AG-WK-T3-*` items, followed by marker dispositions and visual dispositions. The existing T3 alias approval open item remains pending. This inventory does not claim term completeness or delivery readiness.
