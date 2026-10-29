# GEO-INV-T1 — Geography, 1st Term inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `75dbb9f`; the reviewed base in the prompt is `0ee6033`. Open PRs at start: #186 (FM-PRE-T2) only, no Geography branch or PR. Master then advanced to `451369d` (merge of #186, three Further Mathematics files) before publishing; no Geography file overlaps, and this branch is based on `451369d`.
- Source `SS1-SRC-1c1c1bdcecb4`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`; composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**; member SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c` **verified**, 1,163,776 bytes.
- Method (all private, outside Git): (1) `word-extractor` 1.0.4 `getBody()` — the importer's legacy `.doc` call — giving 708 lines / 41,163 characters; (2) a direct OLE decode of `WordDocument` + `1Table` (one piece) giving the 41,889-character text stream, so control characters are counted rather than dropped; (3) `antiword -x db` as an independent structure check; (4) a signature scan of the `Data` and `WordDocument` streams plus Pillow dimensions for embedded images; (5) `olefile` metadata and section structure. The importer, compiler, schema and tests were not run.
- Block convention: the SHA-256 of the 1-based `getBody()` lines stated, joined with `\n`, UTF-8, no trailing newline. Whole body 1–708: `13e8d0c013ef89c6b8965b8cc6d4a5308c5ee450a7df3588d2462db68c86ee3e` (41,265 bytes).

## Scheme of work (`SCHEME OF WORK`, getBody 21–40; rows 23–37 SHA-256 `bf7374729b4b8a317a0cd991497ec32d8f29e5233ab41301707033e1ac135611`)
| Wk | Scheme wording (verbatim, line wrap removed) | Lines | Numeral | Bound body label |
|---|---|---|---|---|
| 1 | Introduction to Geography: Meaning, Nature, Scope and Value of Geography. | 24 | **absent** | `WEEK ONE` 43 |
| 2 | The Solar System: The Universe, The Planets, The Earth. | 25 | **absent** | `WEEK TWO` 92 |
| 3 | The Earth as a Planet; Shape and Size of the Earth, Proof of the Earth’s Sphericity. The Movement of the Earth: Rotation & Revolution. | 26–27 | **absent** | `WEEK THREE` 183 |
| 4 | Latitude and Longitude: Definition, Uses, Similarities & Differences, Great and Small Circles. | 28–29 | 4 | `WEEK FOUR` 271 |
| 5 | Latitude and Longitude: Standard Time Zone, Calculation of Distances, Local Time, International Date Line (IDL). | 30–31 | 5 | `WEEK FIVE` 352 |
| 6 | The Structure of the Earth: The Outer Zone. | 32 | 6 | `WEEK SIX` 416 |
| 7 | The Structure of the Earth: The Interior Zone. | 33 | 7 | `WEEK SEVEN` 495 |
| 8 | Rocks of the Earth: Types and Characteristics. | 34 | 8 | `WEEK EIGHT` 540 |
| 9 | Basic Concept of Geographic Information System (GIS). | 35 | 9 | `WEEK NINE` 607 |
| 10 | Major Land Form Features: Types of Land Forms, Mountain. | 36 | 10 | `WEEK TEN` 639 |
| 11 | Revision. | 37 | 11 | **no body row** |

The scheme is plain paragraphs, not a Word table (`antiword` finds none here). Rows 1–3 carry no week numerals, so binding relies on order and the body labels. Week 3, 4 and 5 topics wrap onto a second line; weeks 4 and 10 start after leading spaces. There is no week 12 and no examination row. Reference list: line 39 `REFERENCE`, line 40 `Essential Geography for Senior Secondary Schools by O.A. Iwena.` (SHA-256 `af634813ec13a3bece122248b9baf7c6ef8bea0f597f6ba596c323de4a9cb16a`).

## Week inventory (getBody; hash = block SHA-256, trailing blank lines trimmed)
| Label | Subtitle (line) | Span | Block SHA-256 | Markers (lines) |
|---|---|---|---|---|
| `WEEK ONE` 43 | INTRODUCTION TO GEOGRAPHY: MEANING, SCOPE AND VALUE 44 | 43–89 | `52f0cbe7b5b1c8c618b747159993961a1d1c96e2c2f6560a88ac156192e11aa5` | EVALUATION QUESTIONS 52; EVALUATION QUESTION 67; GENERAL EVALUATION 70; READING ASSIGNMENT 77; WEEKEND ASSIGNMENT 80; THEORY 87 |
| `WEEK TWO` 92 | THE SOLAR SYSTEM 93 | 92–180 | `2a30150d4cb0d3991540598cfe3ee7437dbd35a2f7692b041e10cb4911e98603` | EVALUATION QUESTIONS 111, 157; GENERAL EVALUATION QUESTIONS 161; READING ASSIGNMENT 168; WEEKEND ASSIGNMENT 171 (page break); THEORY 178 |
| `WEEK THREE` 183 | EARTH AS A PLANET 184 | 183–268 | `5bbc2357e24a5ef6139bc99bc1351c119dc4f7188345e35c5f12bf001a452d25` | EVALUATION QUESTIONS 193, 206, 223; GENERAL EVALUATION QUESTIONS 249; READING ASSIGNMENT 256; WEEKEND ASSIGNMENT 259 (page break); THEORY 266 |
| `WEEK FOUR` 271 | LATITUDE & LONGITUDE 272 | 271–349 | `f4dcfa072ca8e066e081d015463d1f147bd5f61fdd7c54d311c5284e0d44ea64` | EVALUATION QUESTIONS 301, 327; GENERAL EVALUATION 331; READING ASSIGNMENT 337; WEEKEND ASSIGNMENT 340; THEORY 347 |
| `WEEK FIVE` 352 | CALCULATION OF DISTANCES AND LOCAL TIME 353 | 352–413 | `aaf418295fc5be4a720a35f23d1a45efb9bed91b3319ee1a2ae3e56141dbde17` | EVALUATION QUESTIONS 374; EVALUATION QUESTION 394; GENERAL EVALUATION 397; READING ASSIGNMENT 402 (label glued to the end of the line); WEEKEND ASSIGNMENT 405; THEORY 412 |
| `WEEK SIX` 416 | STRUCTURE OF THE EARTH 417 | 416–492 | `3463c9b15cac38935748f50afe5be4eb28595f45901afa1bb3f0dea9a997ca70` | EVALUATION QUESTIONS 444, 464; GENERAL EVALUATION 468; READING ASSIGNMENT 475; WEEKEND ASSIGNMENT 478; THEORY 490 |
| `WEEK SEVEN` 495 | INTERNAL STRUCTURE OF THE EARTH 496 | 495–537 | `b35a7a8bd9a2bd1c71d08933e7cba684d9865e12c69fa52a985ddc14e395aee7` | EVALUATION QUESTIONS 504, 513; GENERAL EVALUATION 517; READING ASSIGNMENT 524; WEEKEND ASSIGNMENT 527; THEORY 535 |
| `WEEK EIGHT` 540 | ROCKS OF THE EARTH 541 | 540–604 | `d09e611390ae4688a763220f81b050507e313dc45735a92e9e39c53ef5df7e8f` | EVALUATION QUESTIONS 562, 581; GENERAL EVALUATION 585; READING ASSIGNMENT 592; WEEKEND ASSIGNMENT 595; THEORY 602 |
| `WEEK NINE` 607 | GEOGRAPHIC INFORMATION SYSTEM (GIS) 608 | 607–636 | `ede7fe0e59c1fb969cb80844d5c87954546007346d762f4812110f37ff678b3e` | **no EVALUATION QUESTIONS**; GENERAL EVALUATION QUESTIONS 620; **no READING ASSIGNMENT**; WEEKEND ASSIGNMENT 627 (page break); THEORY 634 |
| `WEEK TEN` 639 | MAJOR LANDFORMS OF THE WORLD 640; MOUNTAINS 641 | 639–707 | `5b6c935769ac6e9fee6360e672ac636c6d18beeaefaf0e38a27b5655e7724080` | EVALUATION QUESTIONS 658; GENERAL EVALUATION QUESTIONS 686; READING ASSIGNMENT 693; WEEKEND ASSIGNMENT 696; THEORY 705 |

Totals in the body: `EVALUATION QUESTIONS` 16, `EVALUATION QUESTION` (singular) 2, `GENERAL EVALUATION*` 9, `READING ASSIGNMENT` 9, `WEEKEND ASSIGNMENT` 10, `THEORY` 10. Every week heading label occurs exactly once.

## Non-week blocks (hash-accounted)
- 1–17: empty paragraphs ahead of the title (page 1, cover). 18 `FIRST TERM E-LEARNING NOTE`; 19 `SUBJECT:  GEOGRAPHY<TAB>…<TAB>       CLASS:  SS1` — line 19 equals the registered `header_text` exactly and occurs once; line 18 occurs once; block 18–19 SHA-256 `b4bda78d8bcc62f32bf49f1faf55a1b47a57fd530b8401d064053c266ec74372`.
- 21 `SCHEME OF WORK`, 22 blank, 23 `WEEK      TOPIC`, 24–37 rows, 38 blank (block 21–37 `3cee63d55e00222de2a7520b1e078e8f0b51ea4ab0d6e159f7313ea246c0d032`).
- 39–40 reference list (above). 41–42 blank.
- Page breaks (0x0C in the text stream) occur at full-text paragraphs 4, 158, 209, 244, 611: before the title (page 1 cover), before Week 2 `WEEKEND ASSIGNMENT` (line 171), before Week 3 `EVALUATION QUESTIONS` (206), before Week 3 `WEEKEND ASSIGNMENT` (259), before Week 9 `WEEKEND ASSIGNMENT` (627).
- Page header/footer: one section (PlcfSed), and the only running text is `MR OSHO/1ST TERM/GEOGRAPHY/SS1<TAB>Page ` followed by a `PAGE \* MERGEFORMAT` field, once in the trailing story region (text offset 41,807). Vendor contact details are deliberately not reproduced here. An inline picture character (0x01) sits at text offset 41,887 in the same trailing region.
- Metadata: title `SS 1 `, author `MAMA DANIEL`, last saved by `tosyno`, created 2009-09-09, last saved 2019-08-28, code page 1252, cached page count 4 and word count 6,238 (stale caches, not a render).

## Substantive unlabelled / irregular sections
- Week 3 `B:       EARTH REVOLUTION` (line 228; block 228–231 SHA-256 `813d79df4a89907c6245f96859e5c508d278d1755ec761b657c32b1fe89279b5`) carries a lettered label although the rotation section (213) has none; `Dawn and Twilight` (242–243; SHA-256 `242581bea1150363ffc379eb08d432e205998dcbc812814d60b8f7eb3c429d12`) trails the revolution effects with no evaluation of its own.
- Week 5 has two unnumbered subsections (354 `Calculation of distance using lines of latitude`, 378 `Calculation of Local Time using the lines of longitude`); its `READING ASSIGNMENT` label (402) is appended after a long run of spaces on the last general-evaluation line.
- Week 9 omits both `EVALUATION QUESTIONS` and `READING ASSIGNMENT`; its only evaluation block is `GENERAL EVALUATION QUESTIONS` (620).
- Week 10 splits into `(a)`/`(b)`/`(c)`/`(d)` at 645/653/663/668; its importance and disadvantage lists (673–684; SHA-256 `2148053981d4aedda7a6662e69b5f1a5f1b9c39eee5371d06bc3e7532b298d20`) are tab-aligned two-column text, not a Word table.
- Content observations recorded, not adjudicated here: Week 1's `GENERAL EVALUATION` (70–75) includes a state-capital recall question (75) that may sit outside the week's stated objectives; Week 2 presents "nine planets" including Pluto. The week items own those questions.

## Visual groups (for `GEO-VIS-T1`)
1. **Page-1 cover.** One JPEG, 3306×2515 px, 870,389 bytes, at `Data` stream offset 2,396 (runs to the stream end), SHA-256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a`. Two drawn-object anchors (0x08) sit at the document opening (full-text paragraphs 4–5) before the page-1 break. Layout not inspected.
2. **Page header letterhead.** One JPEG, 949×359 px, 106,941 bytes, at `WordDocument` stream offset 109,649, SHA-256 `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14` — byte-identical to the Further Mathematics 2nd Term header image recorded in FM-PRE-T2, i.e. the same vendor letterhead. Whether it prints on every page or the first page only needs a render.
3. **Solar-system table.** getBody 99–109 (SHA-256 `d5c26043c58b2df0e1559fd10237d0853f6fee3259d9f3015e087acfaac96d13`): a real Word table with 50 cell marks (5 cells × 10 rows) in one text paragraph, while `antiword` reports 4 columns and 10 rows. The empty fifth cell and the header row need a visual decision.
4. **Latitude/longitude differences block.** getBody 305–319 (SHA-256 `cc7bb557f406a397dd896bc1df0da59159b014316503c23807b577aa7dcb87e6`): tab-aligned text, not a Word table, with two drawn-object anchors (0x08) at the start of its first row (line 307). Whether it is drawn or framed is unresolved.
5. **Requested-but-absent diagrams.** Week 6 `THEORY` (491), Week 7 `THEORY` (536) and Week 10 `THEORY` (705–706) ask for drawings; the file embeds no diagram, map or figure. The only image bytes are the two branding JPEGs above (no PNG, WMF, EMF or GIF signatures in either stream).
- Both images carry vendor branding and personal contact details. They must not be committed or redistributed; `GEO-VIS-T1` records the permission open item before any asset binding.

## Queue items appended (13, all PENDING, each depends on `GEO-INV-T1` + `GEO-SRC-T1`)
- `GEO-PRE-T1` (SOURCE_PREAMBLE_INDEXING): lines 1–42 — title, subject header, scheme table 1–11, reference list.
- `GEO-MARK-T1` (SOURCE_MARKER_DISPOSITION): recurring markers and the irregular sections listed above.
- `GEO-WK-T1-W01` … `GEO-WK-T1-W10` (SOURCE_WEEK_INDEXING): one item per week span in the table above.
- `GEO-VIS-T1` (VISUAL_DISPOSITION): the five visual groups above.

## Edits
- `docs/ss1/work/microtasks/geography/QUEUE.json`: GEO-INV-T1 → IMPLEMENTED_TESTING_DEFERRED with this evidence; 13 items appended; counts, status counts, review and `next_runnable` recomputed (`GEO-PRE-T1`).
- No package file, coverage entry, rule, lesson or asset was written. `backend/src/db/ss1/subjects/geography.json` is unchanged.

## Remaining
- `GEO-PRE-T1`, `GEO-MARK-T1`, the ten week items and `GEO-VIS-T1` are now eligible; `GEO-INV-T2`/`T3` (2nd/3rd Term inventories) stay eligible in queue order.
- The package remains PENDING with empty lessons/coverage; the alias approvals (`GEOGRAPHY-ALIAS-APPROVAL`, `GEOGRAPHY-T2-ALIAS-APPROVAL`, `GEOGRAPHY-T3-ALIAS-APPROVAL`) are untouched.
