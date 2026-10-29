# CC-INV-T3 — Catering Craft, 3rd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: `origin/master` `4c140d9` (fetched; no open PRs at start; no other worker owns this item). No `AGENTS.md` on master. `CC-SRC-T3` is `IMPLEMENTED_TESTING_DEFERRED` and the 3rd Term source is registered in `backend/src/db/ss1/subjects/catering-craft.json`.
- Source `SS1-SRC-d068ede78d16`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 CATERING CRAFT PRACTICES.doc`, 537,088 bytes.
- Input was the supplied composite archive (display name `SSS 1-20260507T072431Z-3-001 (1).zip`). Its SHA-256 **was checked** this session: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, equal to the prompt and Worker F. Member SHA-256 `a2de209dab8d7b6a88c4e44ad3746c349db5b953d805c47457fa9185ab6e7d3e` **verified**, equal to the prompt and `SOURCE_ASSIGNMENTS.csv`; `archive_member` kept verbatim.
- Text read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy `.doc` call): 56,838 characters, 940 lines, SHA-256 `b3499393aa9c5958398d008115ef024d58f039f85978d7d4460e03449fdac666`. Private scratch copy only; nothing from the source is committed.
- Structural checks on the same bytes: Word 97 FIB (nFib 193), single piece, `1Table` stream, 57,039 CPs; **0** BEL (`\x07`) cell marks, so no Word tables; **1** inline picture mark (`\x01`) and 1 PAGE field; 0 drawn objects, 0 page breaks, 1 line break. `antiword -x db` DocBook render contains 0 table and 0 mediaobject elements. OLE streams: `\x01CompObj`, `\x05SummaryInformation`, `\x05DocumentSummaryInformation`, `1Table`, `Data`, `WordDocument` — no `ObjectPool`, so no embedded OLE object.
- `Data` stream 379,993 bytes, SHA-256 `7a64c327035440c83ebc4161eeb45986692650cc3247a002ab17b171b71da991`: exactly one JPEG at offset 261, 1,102 x 748 px, SHA-256 `d48e6dcd9d9ba066355b9f0fc8d16f75f29d284a02a7cfabbb720acae67ea728`; no PNG/GIF/EMF/WMF signature. (One `BM` byte pair inside the JPEG payload is not a bitmap.)
- Source document properties (Word's own counters, not a verification): author `SOLADOYE`, last saved by `IKHINE PATRICK`, created 2017-09-04 13:37, last saved 2019-08-06 20:21, last printed 2017-09-13 08:53, 22 pages, 8,483 words, 48,356 characters, revision 178.
- Header/footer (not teaching content): a `Name:`/`Date:` blank line and the tutor footer `GSS/3rd TERM/catering craft practices/sS 1  Page <PAGE>`.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `getBody()` text split on `\n`. A range runs from the marker line to the last non-blank line before the next marker; the SHA-256 is over those lines joined with `\n`, UTF-8. Labels are quoted exactly; `\t` below denotes a literal tab character.

## Inventory
Opening block (unlabelled): lines 1-22, SHA-256 `39432ed91f7f93160118b27cb2585d2ee7ff6491af650b49e878c7b9a5f7aaed`. It holds `THIRD TERM E-LEARNING NOTE` (1), the subject/class line (3), `SCHEME OF WORK` (5) with a `WEEK\tTOPIC` header (7), ten topic rows (8-17), `11-12.\tRevision and Examination` (18) and `REFERENCE BOOK` with two named books (20-22).

| Label | Second line (exact) | Lines | SHA-256 |
|---|---|---|---|
| WEEK ONE | `TOPIC: PERSONNEL IN FOOD AND BEVERAGE AREA` | 25-146 | `d66002d402925448427be9a924a04d073df1939ec500b6ee02c02505235a2e7c` |
| `WEEK\t TWO` | `TOPIC: FOODS AND BEVERAGE PERSONNEL AND THEIR FUNCTIONS` | 149-246 | `c6c96f7cc9a5dcf3c9f6e3308791a710252100f7b4ce281e7b5c55978c351598` |
| WEEK THREE | `TOPIC\t: KITCHEN STAFF` | 249-329 | `4b774484b08469a53248b935f47c87d54b1dcfbc5f5ff1d4488fac72eded1d84` |
| WEEK FOUR | `TOPIC: HOUSE-KEEPING PERSONNEL AND RECEPTIONISTS` | 332-485 | `b67f351733eca73cbf6af668955f9d9c9db13157dbe70210ed5910d0e615dc53` |
| `WEEK\t FIVE` | `TOPIC\t: FOOD SERVICE` | 490-597 | `a85514eb698443ed4b46f508182a83ced819ee23df6eb8e9f6057d5cd10ab231` |
| `WEEK\t SIX` | `TOPIC\t: TYPES OF FOOD SERVICE` | 600-690 | `2af938625792ef9708c0380c04d14557edad1519b8639b5e0378ef49381c09cc` |
| WEEK SEVEN | `TOPIC: TYPES OF SERVICE` | 691-740 | `4f9043032b815a1adbc901a9319cc7e1d899a0af30a987e3074983d0af386da1` |
| WEEK EIGHT | `TOPIC: TABLE LAYING AND TABLE SETTING` | 743-852 | `8db76942a11d5ea72146a80298ad5d1c8e1fd89a83a4f8cf60ed461e404b9752` |
| WEEK NINE | `TOPIC: TABLE (SERVICE) COVER` | 855-931 | `9cfab96fa04d46aaec33e7ef22fb94abe60e6bc16f4b576a24a6c1d734c6c0c6` |
| WEEK TEN | `TOPIC\t: PRACTICAL DEMONSTRATION OF TABLE LAYING AND SETTING` | 934-935 | `c39c2a8effc69d7649351d6531ae8b6ff58fef4825516b7b0b99b35f3dc2c344` |
| `WEEK\t ELEVEN AND TWELVE` | `REVISION AND EXAMINATION` | 938-939 | `a769b7e88df5e469591f3eb3b20c9a25f583dccffc6af97ead2eea2830d7e280` |

Week count: ten teaching-week labels plus one combined marker. **Week Ten has no body**: only the label (934) and TOPIC line (935), two blank lines, then the marker at 938. The combined marker has two lines and no revision or examination content. The file ends at line 939.

## Assessment blocks inside the weeks (all preserved, none answered)
- EVALUATION: 80-82, 105-107, 186-188, 212-214, 277-279, 297-306, 355-358, 412-415, 441-444, 540-543, 571-576, 628-631, 647-652, 708-711, 775-777, 788-791, 806-809, 879-882, 896-899. Week Seven has one EVALUATION (708-711); its banquet section (712-718) has none.
- GENERAL EVALUATION QUESTIONS: 123-129, 225-231, 307-313, 463-469, 577-583, 671-677, 719-725, 830-836, 912-918.
- Each teaching week also carries READING ASSIGNMENT, WEEKEND ASSIGNMENT and THEORY blocks (e.g. 130/134/144 in Week One; 919/922/929 in Week Nine). Week Ten has none.
- No answer key, marking scheme, mark allocation, score, practical rubric or teacher guidance appears (searched `answer`, `marking`, `marks`, `score`, `rubric`).

## Scheme-to-body differences (recorded, not corrected)
- Scheme rows 1-10 carry no number in the extracted text; `antiword` renders them as an automatically numbered list 1-10, so the numbers are list numbering, not body characters.
- Row 2 `Personnel in Food and Beverage area and their functions- Bar` → body `FOODS AND BEVERAGE PERSONNEL AND THEIR FUNCTIONS` (bar personnel plus banquets).
- Row 5 `Types of food service- Table service` → body `FOOD SERVICE`.
- Row 6 `Types of food service- Self service` → body `TYPES OF FOOD SERVICE`.
- Row 7 `Types of food service- Specialized service` → body `TYPES OF SERVICE`.
- Row 9 `Types of table cover` → body `TABLE (SERVICE) COVER`.
- Row 10 `Demonstration of table laying and setting` → TOPIC line only, no body.
- Week Four additionally teaches BED LINEN (416-431) and BED MAKING (432-444), which no scheme row names.

## Tables
None. The document contains **no Word tables**: the piece-table text holds zero BEL (`\x07`) cell marks, and an `antiword -x db` render emits zero `<table>` elements. What looks tabular is tab-aligned text: the scheme header and rows (7-18), the a-d list (34-37), three dash-prefixed points (509-511) and stray tabs inside otherwise plain paragraphs (54, 109, 142, 590, 736, 740, 925). Absence is recorded with those checks; it is not a claim that the author never intended a table.

## Embedded media
One picture: a four-panel scanned photograph, lettered a-d, showing a waiter laying a white tablecloth on a table, inline in Week Eight after the paragraph at line 772 and before EVALUATION at 775. It is a 1,102 x 748 JPEG (Data stream offset 261-379,993, hashes above); the scan carries faint book/watermark text and a cut-off caption line at its bottom edge. No other picture, drawing, OLE object, audio or video part exists. Disposition item: `CC-VIS-T3-W08-IMG1`.

## Findings for the importer's parser (findings only; no rules added)
- `split_before`: twelve marker lines must split (25, 149, 249, 332, 490, 600, 691, 743, 855, 934, 938). Four use a literal tab between `WEEK` and the ordinal (`WEEK\t TWO`, `WEEK\t FIVE`, `WEEK\t SIX`, `WEEK\t ELEVEN AND TWELVE`). The compiler's `split_before`/`attach_stranded_label` require a numeric `week_label` and insert `WEEK <n>\n` (`backend/src/db/ss1/compiler.ts:23,30`), so no rule can encode these word labels; the generic `WEEK_MARKER` regex allows `\s*` after `week` and should match them, but that was **not** run.
- The scheme header `WEEK\tTOPIC` (7) and the ten `WEEKEND ASSIGNMENT` lines (134, 236, 318, 474, 588, 681, 729, 841, 922) must not split. Whether the unrun parser rejects them is unchecked.
- `attach_stranded_label`: not needed; every label is its own paragraph and the TOPIC line follows on its own line.
- `classify_marker`: only `WEEK\t ELEVEN AND TWELVE` / `REVISION AND EXAMINATION` is a marker. The in-week `EVALUATION` and `GENERAL EVALUATION QUESTIONS` headings sit inside teaching bodies and must not be classified as revision markers. The preamble row `11-12.\tRevision and Examination` is scheme text, not a parsed row.

## Observed content issues (for the indexing items; source text not altered)
- Week Ten promises a practical demonstration with no teaching text, no equipment list and no assessment; it must not be treated as delivered content.
- Week Two's topic line says `FOODS AND BEVERAGE`; Week Three and Week Five title lines use `TOPIC\t:`.
- The sentence `There is comparatively less wastage since the unused food goes back to the kitchen.` appears twice in Week Five (552 as silver-service feature (vi), 555 as advantage 1); de-duplicate when authoring, do not delete from provenance.
- Original spellings to preserve, not correct: `confortable` (341), `oven on all sides` (766, apparently meaning "even"), `lying of the covers` (90, 142), `Disadvantages if silver service` (558), `mis-en place` (513).
- The document is a 2017-2019 senior-secondary handout; no edition or page numbers of the two references are given.

## Possibly unsafe or outdated statements (flagged for later correction, not corrected)
- Hot plates/food warmers on the gueridon (520), "always push the gueridon, never pull" to avoid accidents (529), hot serving plates and transfer of foods/liquids (533-536).
- Hygiene/sanitation and temperature wording: "right temperature" with no figure (210), kitchen hygiene oversight (267), housekeeping hygiene and safety duties (341, 353, 374, 381), all table-laying materials to be cleaned (827), the napkin/cover "all precautions" sentence (863).
- Service measurements: cutlery at least an inch from the edge (871) and "A cover is normally about 60cm long" (877).
- No numeric holding temperature, allergen statement, cleaning-chemical name or concentration, dose, fire statement or first-aid advice appears in the document; none may be inferred. Later work needs authoritative primary sources and must keep the source's original wording separate from corrected fact. No treatment or dose is prescribed; no classroom practical observation is recorded.

## Edits
- `QUEUE.json`: CC-INV-T3 set to `IMPLEMENTED_TESTING_DEFERRED` with an evidence summary; 18 PENDING items appended (10 SOURCE_WEEK_INDEXING `CC-IDX-T3-W01..W10`, 1 SOURCE_SECTION_INDEXING `CC-IDX-T3-OPEN`, 1 SOURCE_MARKER_DISPOSITION `CC-MARK-T3-REVEXAM`, 1 VISUAL_DISPOSITION `CC-VIS-T3-W08-IMG1`, 2 SOURCE_PRESERVATION, 3 FACTUAL_DEPENDENCY), each depending on CC-INV-T3 and CC-SRC-T3 (preservation/fact items also on the relevant week items); `counts`, `status_counts` and `next_runnable` recomputed; one note appended. No existing ID or item otherwise changed.
- No package, lesson, coverage entry, rule, correction or asset written. Catering Craft not merged into Food and Nutrition.

## Remaining
- Week Ten has no body: a precise lesson/demonstration task is required after the missing content is recorded; the taught Week Eight steps are supporting material, not a substitute.
- Alias approval (`CATERING-CRAFT-ALIAS-APPROVAL`) is still an owner action; `CC-FACT-CONTENT-APPROVAL` stays `BLOCKED`.
- The 20 items that were already eligible (2nd Term indexing/visual items and `CC-TEST-PACKAGE`) are untouched by this task; it added the 3rd Term index items. Next eligible for this subject: `CC-IDX-T3-W01`, then the remaining `CC-IDX-T3-*`, `CC-MARK-T3-REVEXAM` and `CC-VIS-T3-W08-IMG1`, which share one package file and should run sequentially. This does not claim the subject or class complete.
