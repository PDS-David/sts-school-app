# BIO-INV-T1 — Biology, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `eeeb8a0` (AG-INV-T1 PR #169 already merged; no open PR; no BIO-INV-T1 branch). `AGENTS.md` is absent.
- Prerequisite BIO-SRC-T1 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/biology.json` exists with source `SS1-SRC-422e0e6ddde9`, no lessons, no coverage; alias approval `BIOLOGY-ALIAS-APPROVAL` is an owner open item.
- Original: `BIOLOGY 1 alfa term - Copy.docx`, SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (957,703 bytes) — extracted from the supplied 1st Term archive (`8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`) and hashed before conversion; equals `SOURCE_ASSIGNMENTS.csv`. The composite archive (`02448712…9a3e`) was **not** checked.
- Method: `word/document.xml` read with lxml in a private scratch directory; all 11 embedded images viewed. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-1104; block 1105 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation; text-box text counts toward the block that holds the text box. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included.

## Week inventory (10 teaching weeks)
Each week has a heading label and, except Week 4, a second label at its assignment. Label forms are mixed (words, digits, trailing space).

| Week | Heading label (block) | Blocks | Assignment label (block) | Label sha256 | Range sha256 |
|---|---|---|---|---|---|
| 1 | 13 `"WEEK ONE"` | 13-41 | 123 `WEEK ONE AND TWO` (combined with Week 2) | `635789fb4e63974d…` | `b525781e0c5aa33f22f18a3896b527830e31892386fa39b05d1bad8cd0a2a450` |
| 2 | 42 `"WEEK TWO"` | 42-132 | (combined, see Week 1) | `88b3326818ebf357…` | `3f8bb1d8f9370ac595b47404008b1aab7e570100bb966d0d660e6683ec7cb5d9` |
| 3 | 133 `"WEEK THREE"` | 133-644 | 632 `WEEK THREE` | `9a970d2a5cd0bee9…` | `0103345f39d4a3f64705635245f85b0bbbc69edfea60ec9d843c00cf6d88e227` |
| 4 | 645 `"WEEK FOUR"` | 645-678 | none | `3c43507c7d617812…` | `25c2f1150d9175195b12b81080a2660f1dded05b377e67460248afc6d4cb14af` |
| 5 | 679 `"WEEK FIVE "` | 679-780 | 774 `WEEK FIVE` | `8ee47ba194827627…` | `4686f3b47c869d4b3359ada8483a6d7324db6f10dbf211eed9346ed7dd28b8f4` |
| 6 | 781 `"WEEK 6"` | 781-834 | 827 `WEEK 6` | `03792d537a25eed5…` | `e6df637e58ce695ff642859639fbd24c3206509327af1c1612c71ddcddec77d6` |
| 7 | 835 `"WEEK 7"` | 835-925 | 922 `WEEK SEVEN` | `5d222602d23f6b6f…` | `d447b3593efc132f6eed1264640b15969a8a5712d3111a4e0470d6c8adb553a6` |
| 8 | 926 `"WEEK EIGHT"` | 926-950 | 946 `WEEK EIGHT` | `af0f60bc43d333ec…` | `8e3ce87be34a1523b5aa2d9c478c9e817276070dad81a74fd1d46dfbe86b8d5a` |
| 9 | 951 `"WEEK NINE"` | 951-984 | 976 `WEEK NINE` | `e38b03944a5cbe25…` | `e0fd7a606c08dec6adab6b72e24bb790bf4e05a77905ea2ec9230f504917f7dd` |
| 10 | 985 `"WEEK TEN"` | 985-1104 | 1094 `WEEK TEN` (before ASSIGNMENT block 1095) | `3ee3bfdc68d8630b…` | `9c91bae8cde7ad21425a3c40ab314c04aa4c62c7b2cde3f7da40798633501bea` |

Scheme lines (blocks 2-11, plain paragraphs): `Week 1 -Recognizing Living things`; `Week 2 -Living things and non-living things`; `Week 3 -Classification of Living things`; `Week 4 -        Organization of life`; `Week 5 -Plant Nutrition`; `Week 6 - Nutrient cycling in Nature`; `Week 7 -Nutrition in Animals`; `Week 8 -Mode of Nutrition`; `Week 9 - Basic ecological concept`; `Week 10 -Growth, Irritability and Movement `. There is no revision, examination or reference-book text anywhere in the document.

## Other sections
- Blocks 0-12 (title `BIOLOGY`, `SCHEME OF WORK S S ONE`, scheme, blank): preamble item `BIO-PRE-T1`, range sha256 `5e35e4ce64e6bf70cf09fd56ca0a7d14e8a55fb4da727d8a4d3dfa187c95202c`.
- Unlabelled teaching inside the Week 3 body (not named by any scheme line): blocks 448-549 effects of agricultural activities and of farming systems on the ecosystem (range sha256 `9b687134eb1369508738f144502584713f5c27da3cfd92abe30df000c7d29cc9`) and blocks 550-629 pests and diseases of agricultural importance (range sha256 `4b3d3a1ca273e08edbcb5ef984b35b8522406648f2c0a42c0674b00b3fde5cd3`). Week 3 also covers crop classification by use and life cycle (248-264) and Relevance of Biology to Agriculture (265-267).
- Week 4 has no assignment heading; its `Questions to practice` (blocks 666-677) mix Week 3 items. Week 6's assignment (blocks 826-833) asks about carbohydrates, proteins, lipids and enzymes, taught in Week 7. Week 2's combined assignment question 1 (block 124) tests ranks taught in Week 3.
- No nitrogen-cycle text in Week 6 (blocks 781-834); only carbon and water cycles.

## Visual and table inventory
53 drawing objects (11 hand-drawn exercise-book images, 42 DrawingML shapes each with a VML fallback), 15 text boxes, 4 `w:tbl` tables, 0 equation objects, 0 OLE objects. Embedded images: image1 labelled microscope (block 109); image2-5 experiment figures (733, 746, 754, 765); image6 carbon cycle (795); image7 water cycle (821); image8-11 cell division (997, 1006, 1015, 1021). Full hashes are in the queue items. Disposition items: `BIO-VIS-T1-PLANT-ANIMAL-HDR`, `-MICROSCOPE`, `-CLASS-HIERARCHY`, `-MONOCOT-DICOT`, `-PEST-LIFECYCLES`, `-PHOTOSYNTHESIS-SCHEME`, `-EXPERIMENT-FIGURES`, `-NUTRIENT-CYCLES`, `-PROTEIN-BREAKDOWN`, `-MITOSIS`, `-HORMONE-TABLE`, `-MOVEMENT-TABLE`, `-TBL-CROP-ROTATION` (block 514, 6 x 6), `-TBL-MINERALS-VITAMINS` (881 and 888, 11 x 4 and 10 x 4), `-TBL-ENZYMES` (920, 8 x 5). Several comparison layouts (plants/animals, monocot/dicot, hormones, movement) are tab-aligned text, not tables.

## Structural rule findings (findings only; no rule written)
- `split_before`: the ten heading labels are line-start paragraphs, but each week (except 4) has a second label at the assignment, `WEEK ONE AND TWO` (block 123) is a range in words, labels mix words and digits, and block 679 has a trailing space. Scheme lines (blocks 2-11) also begin `Week <n>`. Whether the importer mis-splits on the duplicate or scheme labels is **unverified**; any future rule must use a numeric week label (contract), which the compiler inserts as `WEEK <n>` before the anchor.
- `attach_stranded_label`: no label is stranded without following text; the assignment labels follow an `ASSIGNMENT` heading (Week 10's precedes it, block 1094 then 1095). Whether these need pairing is unverified.
- `classify_marker`: no REVISION, EXAMINATION or SCHEME_ONLY body text exists; the scheme (blocks 2-11) is preamble material.

## Practical and chemical content
Experiments I-V (blocks 714-765) use boiling water (4-6 minutes), 90% alcohol (block 722), iodine solution, and caustic soda (sodium hydroxide) solution (blocks 743-744). No concentrations, quantities beyond the stated times, heating method for the alcohol, or safety or handling instructions are given. Later items must neither invent them nor present the source as supplying them. Agro-chemical descriptions (blocks 487-501) and disease-control lists (620-629) contain no doses.

## Statements to check before any lesson (source text not altered)
- Health/medical: quinine as an anti-malaria drug (block 259); animal diseases including Rinder pest (block 607), anthrax, brucellosis, tuberculosis (608), trypanosomiasis and red water (610); mineral and vitamin deficiency tables (blocks 881, 888); hormone names (1043-1049: Pituitrin, Parathormone, Progesterone for ovaries). Later correction needs authoritative primary sources and must keep the source's wording and any historical status distinct from current fact.
- Classification: 'modern classification' as five kingdoms (block 156) versus current schemes; Porifera described as unicellular with radial symmetry (blocks 297, 299); `dry fish` as a cartilaginous example (391); a word missing in `neither … nor brain` (370); biennial examples cassava and cocoyam (263).
- Equations as extracted from shapes: block 683 product side `C6H12O6+6CO2`; block 713 `2H2S + O2 … S + 2H2O`. Not rendered; verify against the shapes before any correction.
- Microscope: `smaller that 0.001mm` (block 90).

## Edits
- `QUEUE.json`: BIO-INV-T1 → `IMPLEMENTED_TESTING_DEFERRED`; 28 PENDING items appended (BIO-PRE-T1; BIO-WK-T1-W01..W10; BIO-SEC-T1-AGRI-ECOLOGY, BIO-SEC-T1-PESTS-DISEASES; 15 BIO-VIS-T1-* items), each depending on BIO-INV-T1 and BIO-SRC-T1; counts and `next_runnable` recomputed; one note appended. No other existing item changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.

## Remaining
2nd and 3rd Term inventories (BIO-INV-T2, BIO-INV-T3) unread. Alias approval and use of the term archive remain owner confirmations. Next eligible: `BIO-WK-T1-W06` (misplaced assignment and no nitrogen cycle), then the remaining BIO items; they share one package file and should run sequentially. This does not claim the subject or class complete.
