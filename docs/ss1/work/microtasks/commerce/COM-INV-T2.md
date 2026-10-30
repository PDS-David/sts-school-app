# COM-INV-T2 — Commerce, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `c45ea6e` (fetched). `AGENTS.md` is absent. Open PR at start: #238 (Biology) only; none owns Commerce.
- Prerequisite COM-SRC-T2 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/commerce.json` exists with its source registered and no lessons or coverage.
- Original: `commerce.docx`, SHA-256 `c18e26659058445f2341ca9365be0eaa71cceea88e388731fc98da531a2add86` — taken from the supplied `2nd Term SS1` archive (`SSS 1/2nd Term SS1_/commerce.docx`). Hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was **not** supplied, so its hash was not checked.
- Method: `word/document.xml` read with lxml in a private scratch directory; the document has no embedded media. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-358; block 359 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation (equation text in `m:t` is not counted). Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included.

## Week inventory (9 teaching weeks; scheme lists 10 plus revision/examination)
Nine labels, one per week, plain `WEEK <WORD>` paragraphs (three carry a trailing space). Week 10 and Weeks 11-12 exist only in the scheme table.

| Weeks | Exact label (whitespace collapsed here) | Label block | Blocks | Label sha256 | Range sha256 | Table |
|---|---|---|---|---|---|---|
| 1 | `WEEK ONE` | 17 | 17-111 | `d6daf1e694c6b67d3872739f78e9ed66d657349d3adba8de1bdc261001e1fef8` | `e73c38b1320e3b03e07ea7a45841ee4ac2d32eaef665bb3c2c6aa29a01d2927a` | - |
| 2 | `WEEK TWO` | 112 | 112-161 | `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6` | `8ef08a297c6408b13b5bc475302cdbdbfa0c2ed7a02b6e7620a8a89feb736dae` | - |
| 3 | `WEEK THREE` | 162 | 162-185 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | `b08a3404019b49664fe1598665140c17a8f5417cb66c1b493b87fb1b702ee49d` | - |
| 4 | `WEEK FOUR` | 186 | 186-236 | `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2` | `35bd00c7d0e1e1a215a104ad8fcf25e10c9a65aa8632e32c2fb65f78ef831ae3` | - |
| 5 | `WEEK FIVE` | 237 | 237-254 | `8ee47ba1948276278acd4756c10e25cf6739d5687371d857fd9be652bde6a506` | `04858324491d45c93c690133d57f566b86e65ebb0529b3dd1aeae938e828bfe4` | - |
| 6 | `WEEK SIX` | 255 | 255-271 | `8c07e3bd938cea9a3897d0d69eb6c600bf1fbace15d21b346bf0372fa095c038` | `2b8fa310ee0a82c24a980a5c7fb73bbaecb82621e503e0b10a33ee5e9307436e` | - |
| 7 | `WEEK SEVEN` | 272 | 272-295 | `c4cb3335062b77e8bb479794362d37bdf626d4c49ade1925626e6066ebab2cfe` | `b78b4d6ebdf1263347a2d54d3a61e091ea7c4139f16396356d3ab46ec67214c8` | - |
| 8 | `WEEK EIGHT` | 296 | 296-319 | `af0f60bc43d333ec85dbc163a1cccce62b4089fe90a5f15dbbbc0dac060b870e` | `16ed2f0016218442f5e71ab828fc0c0f2a79658cdcae697985021fe48703e14e` | - |
| 9 | `WEEK NINE` | 320 | 320-358 | `e38b03944a5cbe25a9e8b633065edd7490e9360c352bcb33ba8e6926594b756f` | `fba13460a8ab4b6e6ae36a7958042bb5236b92d7095cd9694d0e8b594963bb73` | - |

Topic lines: W1 block 18, W2 113, W3 163, W5 238, W6 256, W7 273, W8 297, W9 321; Week 4 has no `TOPIC:` line (block 187 is the heading `DOCUMENTS USED IN FOREIGN TRADE`). The scheme table (block 3) has literal week numbers 1-10 and a final row `11 – 12 | REVISION / EXAMINATION`. Weeks 1, 2, 4-9 match the body topics; scheme Week 3 says `Export procedure involved in foreign trade` but the body is `CONCEPTS OF INTERNATIONAL TRADE`; scheme Week 10 `Documents involved in transportation` has no body.

## Other sections and objects
- Blocks 0-16: title lines (1-2), scheme table (3) and blank blocks 4-16. Range sha256 `220f78abbf21e1063f61234ec0ae67b36525813cd9d25f9b3aec9f8acc252baa`. No references list.
- Tables: block 3 (scheme, 12 rows x 2 columns) and block 138 (domestic vs foreign trade, 4 rows x 2 columns). Plain-text extraction concatenates cells with no separator.
- Equation: block 165, one OMML fraction (terms of trade: price index of export / price index of imports x 100); empty in extracted text. No other equations, images, drawings or OLE objects; the document has no `media` folder.
- Evaluations, reading assignments, theory questions and revision headings: none in any week.
- Calculations and currency: only the terms-of-trade formula; no worked steps, amounts or currency symbols. Block 250 mentions the naira and block 127 exchange-rate differences, as concepts.
- Document formats (Week 4): eighteen trade documents are listed and defined in prose from block 209; no specimen layouts or filled examples are present, so later items must not invent them.
- Possibly stale facts, institutions or laws (source wording not altered; later correction work must date each fact, separate curriculum concepts from current affairs and cite primary data): Customs and Excise Authority and its functions (Week 5), Nigerian Export Promotion Council (Week 6), Nigeria Port Authority and its seaport list (Week 7, block 276), Nigeria Airport Authority (Week 8), Nigeria railway corporation monopoly (block 354), devaluation and IMF/World Bank statements (blocks 179, 185) and the statement of Nigeria's exports (blocks 124, 257).
- Safe-handling or dose content: none (not applicable).

## Structural rule findings (findings only; no rule written)
- `split_before`: labels are plain `WEEK <WORD>` paragraphs (blocks 17, 112, 162, 186, 237, 255, 272, 296, 320; three have a trailing space), so no split looks needed. Hazard for the unrun parser: scheme table block 3 has extracted text beginning `WEEKSTOPICS1Trading…`, which starts with `WEEK`. Week 4 has no `TOPIC:` line, so a parser that expects one after each label may attach the first heading wrongly. Whether the importer mis-splits is **unverified**.
- `attach_stranded_label`: no stranded label observed; each label is a paragraph on its own followed by a `TOPIC:` line, except Week 4.
- `classify_marker`: only the scheme table's last row (`11 – 12 REVISION / EXAMINATION`) and the scheme-only Week 10 row are markers; there are no in-body revision headings.
- Extraction hazards (findings only): the equation in block 165 is invisible to `w:t` extraction; table cells concatenate with no separator.

## Edits
- `QUEUE.json`: COM-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; 14 PENDING items appended (COM-PRE-T2, COM-MARK-T2-W10, COM-MARK-T2-REVEXAM, COM-WK-T2-W01, COM-WK-T2-W02, COM-WK-T2-W03, COM-WK-T2-W04, COM-WK-T2-W05, COM-WK-T2-W06, COM-WK-T2-W07, COM-WK-T2-W08, COM-WK-T2-W09, COM-VIS-T2-EQ-TOT, COM-VIS-T2-TBL-DOMFOR), each depending on COM-INV-T2 and COM-SRC-T2; counts, status_counts and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
The 3rd Term inventory (COM-INV-T3) is unread. Next eligible: `COM-WK-T2-W04` (largest week, document-format definitions), then the remaining COM-WK, COM-PRE, COM-MARK and COM-VIS items, which share one package file and should run sequentially. This does not claim the subject or class complete.
