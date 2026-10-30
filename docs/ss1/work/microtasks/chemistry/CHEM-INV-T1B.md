# CHEM-INV-T1B — Chemistry, 1st Term (second original) week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `6862d45` (PR #230). Open PRs at start: #231 (Bookkeeping BK-INV-T2) and #232 (Catering Craft CC-IDX-T2-W01); neither touches Chemistry. No `AGENTS.md` in the repository.
- Prerequisite **CHEM-SRC-T1B** is `IMPLEMENTED_TESTING_DEFERRED`; source `SS1-SRC-84df18289b7a` is registered in `chemistry.json`. This item adds no package change.
- Original: member `SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx`, **1,656,948 bytes**, SHA-256 `0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a` — hashed before conversion; matches the task and `SOURCE_ASSIGNMENTS.csv`.
- Container: the per-term `1st Term SS1` ZIP supplied by the owner (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`). The composite archive hash was **not** checked.
- Method: mammoth 1.12.2 `extractRawText` for line locators; `word/document.xml`, rels and media read with the Python standard library and Pillow in a private scratch directory; the importer's `WEEK_MARKER`, adjacent-collapse and title rules replicated by hand, not run. Nothing from the document is committed.

## Locator rule (reproducible)
mammoth raw text split on `\n`, 1-based lines, range ends before the next marker, SHA-256 over the UTF-8 lines joined with `\n`. Whole raw text: 118,241 characters, 3,303 lines, SHA-256 `05f0cdbe8ac5f71a677ad7adc38851d922b0ef51822b5afde7979508c055c862`; 4 mammoth warnings (an image/x-wmf part, `w:control`, `o:lock`, `anchorlock` ignored). Body-block indexes below are 0-based direct children of `w:body` (725 children; 715 `p`, 9 `tbl`, 1 `sectPr`).

## Week inventory
| Label (exact) | Label line | Lines | Range sha256 | Source title |
|---|---|---|---|---|
| `WEEK 1` | 43 | 43-728 | `f5fb2013de4658198475c1106b421e5e28adde12b6892f4b88d6159e4f2083f4` | Chemistry as a Subject and as a Central Science |
| `WEEK  2` | 729 | 729-1346 | `7bf6ab74ead834c12c50830bc00f89df57cfa5e5d1610f1feaac029ac33f3d3c` | PARTICULATE NATURE OF MATTER |
| `WEEK 3.` | 1347 | 1347-1454 | `3e805204787d90c9f63f5343c184769145fcc1722b64b86e7594bf0bdcfd1997` | ELEMENTS |
| `WEEK 4.` | 1455 | 1455-1536 | `0d8cda131a403ef1c0ab83348c391736a7ec8fdd960bc974c1d1609ae4616d9b` | MOLECULES AND ATOMICITY |
| `WEEK 5` | 1537 | 1537-1886 | `ed4b66a2a51738ea52c58342a257d4724e7adbdc8e9dd214898de93901d4bc69` | PARTICULATE NATURE OF MATTER (atomic structure) |
| `WEEK 6.` | 1887 | 1887-1894 | `5f68297d81a518c9f102c8d8c3c962bcd41865ffc6539b8b85086ecbcb6dffe5` | THE RELATIVE ATOMIC MASSES OF ELEMENTS. |
| `Week 6b` + tab | 1895 | 1895-1958 | `198588d902014ae9544f78e500e0268fb387d425de45530fb27fe5bdb0ae2620` | ATOMIC WEIGHTS AND ISOTOPIC ABUNDANCE |
| `WEEK 7` | 1959 | 1959-2712 | `168837ded68a245e5e1a6ed422a7632164a4b72d2587de7e3d66d7977ff7d42b` | COMPOUND |
| `WEEK 8 ` (trailing space) | 2713 | 2713-2760 | `a0523847b11597ae30b15f9c760b0224a63b6440ed3a87ca914f13f6a72ffcc5` | OXIDATION NUMBERS |
| ` WEEK 9` (leading non-breaking space) | 2761 | 2761-3298 | `dd3252366c47dc5d10726d1e07defa2f466937aa2046f42e98a4aeb08690cb89` | MIXTURES AND SEPERATION TECHNIQUES |
| `WEEK  10 ` | 3299 | 3299-3303 | `0ddbb2aaf8efaa7d760ee99d111e9445b33530253945f8054284fcfdd5170a69` | PRACTICALS ON SEPERATION TECHNIQUES (title only) |

Weeks 1-2 are body paragraphs (blocks 21 and 333, and block 722 for week 10). **Weeks 3-9 labels all sit inside one layout table, body block 598 (1 row x 2 columns, 54,770 characters, 17 nested tables)**; its text starts with a stray `W` before `WEEK 3.`.

## Opening / scheme (lines 1-42, sha256 `3f04d417eb61e69a8495462a8d480e22fd8e224c65d5f9eadb7dde1f1298ea4d`)
`CHEMISTRY SS1` (3), `SCHEME OF WORK FOR ALPHA TERM` (5), header `WEEKS TOPICS` (7), ten topic rows (9-27): Introduction to Chemistry; Nature of Matter; Elements; Molecules and Atomicity; Particulate Nature of Matter; The Relative Atomic Masses of Elements; Compounds; IUPAC Nomenclature of Chemical Compounds; Mixtures; Practicals on Seperation of Mixtures. The WEEKS column has no numbers. **No REVISION or EXAMINATION row exists, and no revision note, paper or marking scheme exists anywhere.** Observed mapping (not source text): rows 7 and 8 both fall to WEEK 7; WEEK 8 (oxidation numbers) has no row; rows 2 and 5 are carried by two bodies with the same heading; WEEK 10 has a row but no body.

## Structural rule findings (findings only; no rule written)
- `split_before`: **needed for WEEK 9.** The importer's `WEEK_MARKER` allows only `[ \t]*` before `week`, so ` WEEK 9` is not matched; replicated over the raw text it yields 10 matches (WEEK 1-8, `Week 6b`, WEEK 10) and the parsed WEEK 8 row runs 2713-3298 (21,827 characters, SHA-256 `c0c2ba357ba05bd40f76e857ebb7b368ca61ddb929b07085ba3a9191b135c78f`; mammoth range sha256 `035979ed922492f1d3450fefc485d9c25596134c3e390fab8c0effe9c79bf7c1`). `compiler.ts` allows a numeric `week_label` ("9") so a rule is expressible; the anchor must start at a line boundary and be unique (`once`). Not written here.
- Duplicate week 6: `WEEK 6.` and `Week 6b` are not collapsed (the importer collapses only equivalent adjacent markers with no intervening content, and there are lines between them), so two parsed rows both labelled 6 (345 and 2,117 characters, SHA-256 `74d29aad72d0a0c1f2964878b20fbb5a2afe0b8ed5b12876bfedbb2368ce44b1` and `66b0fa2f3aaadede16398e7057e7754f36408cc43e0b3dc0e4ab0ced43641977`). Whether to merge is an owner decision; `split_before` cannot merge.
- `attach_stranded_label`: no stranded label; every title follows its label within two lines.
- `classify_marker`: no REVISION/EXAMINATION marker exists. WEEK 10 is a title-only body (46 characters in the importer view, SHA-256 `52e8ccda7ef391f0ab8a8bb4d3cc6931df57170d66e5807d8680b804aed6cd94`); it needs a disposition decision (CHEM-MARK-T1B-SCHEME), not a rule yet.
- Titles: no `TOPIC` line is used; the importer's first-credible-line rule gives the titles in the table above (WEEK 2 and WEEK 5 both parse as "PARTICULATE NATURE OF MATTER").
- Importer-view body hashes (SHA-256 of the trimmed block): W1 `f4afd8770866b2355948dd1ca8eb092cd9de7645611e1a460ab4440c9bd854de`, W2 `1b7df20c542af71b86dd225a652cb8bf0295c8396088665d625cb5a5ad8a4cc3`, W3 `8fe976069a05f519bd7f37536256589fa77b62798a15c9e34e17dafe29f786a5`, W4 `0d4576746507c7784a938ac07aa89eb92773fab3b5395571c717e5e9a38b937a`, W5 `d68b08af23b1273729b043d845f716c7919106034fcdc710e3fb04e611087630`, W7 `6794d1f8d5f56181eab82a4626cbc8e8a527b2c2d5e79b1e31be21bad0a68ff9`. These are replicated, not importer output.

## Objects
- **Media: 78 parts** in `word/media`, all distinct: 76 raster images, `image52.wmf` and the 1x1 spacer `image51.gif` (used three times, in WEEK 2, 4 and 9). 82 `w:drawing` occurrences; 5 `w:pict`; 1 embedded `w:object`; one ActiveX control (`activeX1.xml`, classid `{5512D11C-5CC6-11CF-8D67-00AA00BDCE1D}`, `activeX1.bin`); two empty 32x32 "Rectangle" drawings. No equations (`m:oMath` 0), no footnote references, no `sdt`, no header/footer part.
- By week: W1 50 images (image1.png careers wheel; 32 thumbnails image2-33 in the 8x4 table at block 148; 17 captioned photos image34-50); W2 spacer only; W3 and W5 share `image53.jpeg` (atom structure); W5 image54 (filling order), image55-58 (nitrogen, oxygen, aluminum, iridium boxes), image59-60 (orbital strips), image61-69 (nine formula pictures, two mis-set: `NH4+`, `NO3-`); W7 `image70.gif` (arrow); W9 image71-78 (sweets; Amrita olabs chromatography, centrifuge, simple and fractional distillation; labelled evaporation and filtration; banner). I viewed these images; the drawings are not described by image count.
- **Tables: 26 `w:tbl`** (9 top-level, 17 nested). Top-level: block 146 (1x1), 148 (8x4, 32 photos), 469 (1x2), 473 (1x1), 475 (2x2), 492 (7x3 change of state), 527 (2x2, empty), 598 (the layout table), 619 (15x3 techniques, 2,316 characters). Nested in 598: two empty layout tables in W4, W5 "Table 1: Exceptions to Electron Configuration Trends" 16x2, twelve naming tables in W7 (3x4, 4x5, 3x5, 3x5, 2x2, 5x4, 15x5, 3x2, 5x4, 22x5, 3x2, plus 1x1 example boxes), W9 mixture/compound 6x3.
- **Sub/superscript runs: 367** (W2 11, W3 5, W4 13, W5 132, W7 164, W8 39, W9 3), so the raw text flattens formulas and charges.
- **Web provenance:** 115 hyperlink relationships (113 external) — en.wikipedia.org 25, chemistry.about.com 22, antoine.frostburg.edu 18, chemwiki.ucdavis.edu 16, www.livescience.com 15, www.bbc.co.uk 5, whatis.techtarget.com 4, searchcio-midmarket.techtarget.com 4, www.ibchem.com 2, one each www.inel.gov, www.chemistry-assignment.com, users.rcn.com; image descriptions carry smc.edu, chemistry-assignment.com, chemwiki, ibchem, frostburg and amrita.olabs.co.in addresses. Rights are unresolved; citation is not reuse permission.
- `docProps`: creator "oladoyin faasoranti", created and modified 2017-09-14, revision 2; 81 pages, 19,210 words.

## Observed content issues (for later items; source text not altered)
- Safety/handling wording to verify: goggles/gloves/apron (421-425), never heat a capped flask or test tube (459, 471, 485), Bunsen "utmost safety" (643), concentrated ammonia opened in a room (791-797), KMnO4 activities (773-825), distillation and mash-heating (2943, 3269), "universal antidote for poisoning" (3105), hot concentrated phosphoric acid (3179). No first-aid or emergency procedure appears; none was added.
- Dated/stale candidates: 66% of chemists statistic (153), atomic weights and abundance (1897-1943), element list (1355), conventions in WEEK 7; created 2017.
- Accuracy candidates: the iridium box diagram stops at 3p; `NH4+` and `NO3-` pictures mis-set; `CrO7-2` in the WEEK 8 evaluation (2759); "Table 2.1" cited at 2443 needs resolving; Week 2 text after "Activity 4.x" gives observations as source statements, not observations made here.
- Non-teaching artifacts: `Bottom of Form` (3281), the 1x1 spacer, empty rectangles and the ActiveX control.
- All EVALUATION questions (lines 185, 659, 1231, 1415, 1517, 1873, 1945, 2703, 2749, 3285) have no answers; the three `SOLUTION` blocks in WEEK 5 are the only worked answers apart from examples inside the naming and oxidation-number text.

## Edits
- `QUEUE.json`: CHEM-INV-T1B → `IMPLEMENTED_TESTING_DEFERRED`; **28 PENDING items appended**: `CHEM-IDX-T1B-W01`…`W10`, `CHEM-IDX-T1B-OPEN`, `CHEM-MARK-T1B-SCHEME`, ten `CHEM-VIS-T1B-*` items, `CHEM-PRES-T1B-FORMULAE`/`-ACTIVITIES`/`-WORKED`, `CHEM-FACT-T1B-SAFETY`/`-DATED`/`-PROVENANCE`; counts, `status_counts` and `next_runnable` recomputed (CHEM-CMP-T1 added as now eligible); one note appended. Dependencies and IDs verified to resolve with a JSON parse and a script check (authoring checks, not tests). No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler, `NEXT_TASK.md` or other-subject file touched.

## Remaining
Alias approval open items (`CHEMISTRY-ALIAS-APPROVAL*`) remain owner actions; `CHEM-INV-T2` and `CHEM-INV-T3` are unread. Next eligible: `CHEM-INV-T2`, then `CHEM-INV-T3`, `CHEM-CMP-T1`, `CHEM-TEST-PACKAGE`. Shared `chemistry.json` items should run sequentially. This does not claim the subject or class complete.
