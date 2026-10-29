# COM-INV-T1 — Commerce, 1st Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: `origin/master` `c09969a` (fetched at start; no open Commerce PR; `CIV-INV-T1` PR #178 is the only open PR and touches another subject). No `AGENTS.md` on master. `COM-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED` and the 1st Term source is registered in `backend/src/db/ss1/subjects/commerce.json` as `SS1-SRC-d96373071a7e`.
- Source: manifest member `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc`, 1,166,848 bytes, SHA-256 `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a` **verified** from the supplied composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, whose SHA-256 **was checked** this session: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (equal to the prompt and `SOURCE_ASSIGNMENTS.csv`). `archive_member` kept verbatim.
- Text read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy `.doc` call): 57,453 characters, 1,064 lines, 873 non-blank, SHA-256 `fa0ff13e0ee6cfd8d60b0f4674542c628c0f52c1720fc1e533123def69bfe035`. Private scratch copy only; no source bytes or extracts are committed.
- Structure on the same bytes: Word 97 FIB (nFib 193, not complex, not encrypted), `fcMin` 2,048, `fcMac` 59,601, `ccpText` 57,468; streams `\x01CompObj`, `\x05SummaryInformation`, `\x05DocumentSummaryInformation`, `1Table`, `Data`, `WordDocument`; **no `ObjectPool`** (no embedded OLE object). Character marks in the text piece: 478 tabs, 8 page breaks (`\x0c`), 2 BEL cell/row marks (`\x07`), 15 drawn-object anchors (`\x08`), 1 inline picture mark (`\x01`). `antiword -x db` renders **0** `<table>`, **0** `<mediaobject>` and **0** `<graphic>` elements.
- `Data` stream 870,821 bytes, SHA-256 `0c2a4614399e1e48b22f7f6455cec832557c555c6c937d6b6e1b8f2e1d1acbd1`: exactly **one** JPEG at offset 432 through end of stream, 3,306 × 2,515 px, SHA-256 `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a`; no PNG, GIF, EMF or WMF signature.
- Header and footer (not teaching content): `1ST TERM/COMMERCE/SS1\tPage <PAGE>` (`getHeaders()`/`getFooters()`). The single picture mark sits at CP 57,548 — beyond `ccpText`, i.e. in the footer text — and the footer holds the publisher's advertisement image (see "Embedded media").
- Source document properties (Word's own counters, not a verification): author `segun`, last saved by `tosyno`, created 2001-12-31 23:05, last saved 2019-08-28 13:57, last printed 2018-07-17 14:09, revision 15, title `AKINGBA`, company `rehoboth`, 4 pages reported, 8,577 words.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `getBody()` text split on `\n`. A range runs from the marker line to the last non-blank line before the next marker (document end for Week Ten); the SHA-256 is over those lines joined with `\n`, UTF-8. Labels and topic lines are quoted exactly; `\t` denotes a literal tab.

## Inventory
Unlabelled opening: lines 1–36, SHA-256 `d8658c5c643ff3336b8b240a9c89a6abbdd1a45ba35f2a423ff25ef45cdad092`. It holds blank lines (1–17), `FIRST TERM E-LEARNING NOTE` (18), the subject/class line `SUBJECT: COMMERCE \t\t… CLASS: SSS 1 ` (20), `SCHEME OF WORK ` (22) with header `WEEK  \tTOPIC ` (24), ten topic rows `1`–`10` (25–34), `11\t\tRevision` (35) and `12\t\tExamination` (36). There is no reference-book list.

| Week | Marker line (exact) | TOPIC line (exact) | Lines | SHA-256 |
|---|---|---|---|---|
| 1 | `WEEK ONE` | `TOPIC: MEANING, SCOPE AND FUNCTIONS OF COMMERCE` | 39-121 | `80762112630c0de4a9d919f58346945accdc800fa04a774d338059a0d74a78c1` |
| 2 | `WEEK TWO` | `TOPIC: OCCUPATION` | 124-183 | `85dc81676442434e28c7a8e1568f8e576741de98eaef0fc6b0be27d4bcc44b57` |
| 3 | `WEEK THREE` | `TOPIC: PRODUCTION` | 186-252 | `62d49f7f9ea3a4adb3446d139de78083d3e8d2fb81e83f7bf7e969a099e88979` |
| 4 | `WEEK FOUR` | `TOPIC:  DIVISION OF LABOUR, SPECIALIZATION AND EXCHANGE` | 254-325 | `7d32a714feb55e15a17e199436facf3d6d94dc9dc5ae35e35d4deb69b888218a` |
| 5 | `WEEK FIVE` | `TOPIC: RETAIL TRADE` | 328-458 | `c7d75a62829dfcd230f70c8454d2cc64c3e1ae48fbb12752c791a1801634831c` |
| 6 | `WEEK SIX` | `TOPIC: SMALL SCALE RETAILING` | 461-564 | `554747adf043eb5a9b3909c7ce4b31b50504a030d1d50f464b4eb19b681fed9a` |
| 7 | `WEEK SEVEN` | `TOPIC: LARGE SCALE RETAILING` | 567-701 | `3a8136f2ddb3fa6e24a7a3db7bddd4fc6d77e17a88160230303ec1307410b013` |
| 8 | `WEEK EIGHT` | `TOPIC: MODERN TRENDS IN RETAILING` | 704-852 | `90cf8f4102af707789f334283801d2475880cd6685a98d919b4f96f06a11f9ce` |
| 9 | `WEEK NINE` | `TOPIC: WHOLESALE TRADE` | 854-978 | `be60e44943862b668b8126b916ca5c7453d431df5c9235186ff7f59deef27bf0` |
| 10 | `WEEK TEN` | `TOPIC: WAREHOUSING` | 980-1063 | `218cdd2bd36992d55e869d405472f302f8e08117090c27234e62503a9c564a28` |

Week count: **ten** teaching weeks, each with a body. The file ends at line 1,064 (blank); the last content line is 1,063 under Week Ten's `GENERAL EVALUATION`.

## Scheme-to-body mapping
| Scheme row (line) | Body | Note |
|---|---|---|
| `1` Meaning, Scope and Functions of Commerce. (25) | Week One | body adds history/development and factors affecting Nigeria/West Africa |
| `2` Occupation (26) | Week Two | body adds factors influencing occupation |
| `3` Production (27) | Week Three | body includes a four-line contents list (189–192) |
| `4` Division of Labour, Specialization and Exchange (28) | Week Four | — |
| `5` Retail Trade (29) | Week Five | body teaches the `TRADE` chart (341–351) before `RETAIL TRADE` |
| `6` Small Scale Retailing (30) | Week Six | body repeats `OTHER TYPES OF SMALL SCALE RETAILING` at 505 and 516 |
| `7` Large Scale Retailing (31) | Week Seven | body has no `CONTENT` line |
| `8` Modern Trends in Retailing (32) | Week Eight | — |
| `9` Wholesale Trade (33) | Week Nine | body adds `CHANNEL OF DISTIBUTION` |
| `10` Warehousing (34) | Week Ten | body adds documents used in warehousing |
| `11\t\tRevision` (35) | none | no `WEEK ELEVEN` marker, no revision content |
| `12\t\tExamination` (36) | none | no `WEEK TWELVE` marker, no examination content |

No scheme row lacks a body; the only absent bodies are the revision and examination rows.

## Assessment blocks inside the weeks (all preserved, none answered)
- `EVALUATION` / `EVALUATION QUESTION(S)`: 64–66, 96–98, 145–151, 159–161, 205–207, 228–230, 276–278, 298–301, 394–397, 432–435, 511–514, 539–542, 622–625, 677–679, 764–767, 821–825, 898–902, 953–956, 1009–1011, 1037–1040.
- `READING ASSIGNMENT`: 100–102, 163–165, 232–234, 303–305, 437–439, 544–545, 681–682, 827–829, 958–960, 1042–1044. They cite Longe's *Essential Commerce for SSS* and *Comprehensive Commerce SSS* pages.
- `WEEKEND ASSIGNMENT` (also misspelled `WEEKEND ASSINGNMENT` 441, `WEEKEND ASSIGMENT` 547): 104–110, 167–172, 236–241, 307–314, 441–447, 547–552, 684–690, 831–841, 962–972, 1046–1056.
- `THEORY`: 112–114, 174–176, 243–245, 316–318, 449–451, 554–557, 692–694, 843–845. Week Nine and Week Ten have no `THEORY` block.
- `GENERAL EVALUATION` / `GENERAL EVALUATION QUESTIONS`: 116–121, 178–183, 247–252, 320–325, 453–458, 559–564, 696–701, 847–852, 973–978, 1058–1063.
- No answer key, marking scheme, mark allocation, score or rubric appears (searched `answer`, `marking`, `marks`, `score`, `rubric`, `scheme of mark`; the one `marks` hit is "trade marks" in branding). The six "draw a diagram" exercises (160, 180, 251, 323, 435, 624) have no model answer in the source.

## Tables
No Word table carries teaching: the text piece holds exactly two BEL (`\x07`) marks, both at CP 2–3 in an empty shell at the very start of the document (with two drawn-object anchors at CP 5 and 8), and `antiword` renders zero `<table>` elements. What looks tabular is tab-aligned text: the scheme (24–36, 478 tabs in the document), the Week Three contents list (189–192), the Week Five chart labels (341–351) and the Week Nine channel list (907–911).

## Embedded media
One picture, and it is **not teaching content**: the footer carries the publisher's advertisement/logo sheet (a 3,306 × 2,515 JPEG, hashes above) with the tutor's name, vision statement, phone number and e-mail. It sits in the footer at CP 57,548 (beyond `ccpText`), repeated on the pages via the footer. It contains personal contact details, so it must not be committed, rendered into lessons or treated as curriculum content. There is no teaching image, equation image, chart image or OLE object anywhere in the document.

## Diagram group
Week Five, lines 337–351: the `TRADE` classification chart (Trade → Home Trade / Foreign Trade; Home Trade → Retail Trade / Wholesaler Trade; Foreign Trade → Import / Export / Entrepot). It is built from 13 drawn objects (`\x08` anchors at CP 16,607–16,693) plus tab-positioned text, isolated by the page break at CP 16,599. `getBody()` recovers the eight labels but not the connector lines or placement, so plain-text import yields an unlabelled word pile. Disposition item: `COM-VIS-T1-W05-DIAGRAM`. No other week contains a drawn diagram.

## Findings for the importer's parser (findings only; no rules added)
- `split_before` candidate: exactly ten `WEEK <WORD>` lines (39, 124, 186, 254, 328, 461, 567, 704, 854, 980), upper case, single space, nothing before or after on the line. No tab-prefixed or numbered form occurs. Scheme rows `11\t\tRevision` / `12\t\tExamination` must not split and must not create weeks.
- `attach_stranded_label` candidate: every `TOPIC: …` line (40, 125, 187, 255, 329, 462, 568, 705, 855, 981) must attach to the preceding `WEEK` label. Week Seven has no `CONTENT` line, so `TYPES OF LARGE SCALE RETAILING` (569) follows the topic directly. Week Three's `CONTENT` list (189–192) repeats four headings verbatim that reappear later (196, 200, 209, 224) and is a contents list, not section starts. Week Six lines 505–510 are an orphaned fragment (`OTHER TYPES OF SMALL SCALE RETAILING` with items numbered 2–3) separated from the complete repeat at 516–520 by an `EVALUATION`; item order is 2, 3 before 1, 4. The heading at 410–411 wraps across two lines.
- `classify_marker` candidate: scheme rows 35–36 are the only revision/examination markers and have no bodies. Assessment headings are spelled inconsistently (`EVALUATION`, `EVALUATION QUESTION`, `EVALUATION QUESTIONS`; `GENERAL EVALUATION`, `GENERAL EVALUATION QUESTIONS`; `WEEKEND ASSIGNMENT`, `WEEKEND ASSINGNMENT`, `WEEKEND ASSIGMENT`; `NOTE`, `NOTES`), and must be matched case-insensitively rather than by exact string. No `WEEK ELEVEN`/`WEEK TWELVE` marker exists.
- Flattening: tabs (478), page breaks (8), the drawing anchors (15) and the two table marks are all dropped by `getBody()`; the chart survives only as tab-separated labels, and the empty start shell disappears entirely.

## Content issues recorded (not corrected here)
- Misspellings in headings and text: `Divine the term Division of Labour` (277), `AFTER SALES SEVICES` (769), `CHANNEL OF DISTIBUTION` (904), `EFFECTS OR REASON WHY LARGE NUMBR OF MIDDLEMEN…` (946), `USEFULNESS OF BONDED WAREHOSUE IN  FOREIGN TRADE` (1013, double space), `FACTORS TO BE CONSIDERED IN SITTING A WAREHOUSE` (1021), `WEEKEND ASSINGNMENT` (441), `WEEKEND ASSIGMENT` (547), `Auctioneerss` (894).
- Line 675 merges presumed list items 3–5 into one paragraph (`They deal in variety of goods  4. Stores are under one roof … 5. Centralized management …`); Week Nine's agent list (890–896) is lower-case, un-numbered and headed `Factors (or Mercantile Agents)`.
- Week Four's `CONTENT` says only `Definition of terms ` (257) although the body also teaches advantages, disadvantages, limitations and exchange.
- No textbook page, private extract or scan from the source is reproduced in this record.

## Factual and neutrality flags (later correction work; nothing corrected here)
- Week One (`STAGES IN THE HISTORY AND DEVELOPMENT OF COMMERCE`, 57; `FACTORS THAT DELAYED THE DEVELOPMENT OF COMMERCE IN NIGERIA/WEST AFRICA`, 68; growth factors, 79) is a dated historical narrative about Nigeria/West Africa. Corrections need dated primary or scholarly sources and must keep the source's wording distinct from the corrected statement; teaching must stay neutral on contested historical and political questions.
- Week Ten (`Bonded warehouse`, 1006; `State warehouse (Queen's warehousing or Government warehouse)`, 1007; `USEFULNESS OF BONDED WAREHOSUE IN FOREIGN TRADE`, 1013; `DOCUMENTS USED IN WAREHOUSING`, 1033) makes customs-law and regulatory claims (bond period, customs authority powers, auction of seized goods, dock warrant as document of title). These need current Nigerian customs/warehousing law with effective dates; the source's original wording must remain distinct.
- Week Seven line 671 asserts `No notable example can easily be found in Nigeria` for variety chain stores, and Weeks Six and Nine make Nigeria/West-Africa market claims (522, 939, 946): current-affairs claims that need dated primary data rather than being taught as settled fact.
- Week Two line 149 calls commercial occupation `secondary occupation`; the standard classification used elsewhere in the same week treats extractive as primary, manufacturing/constructive as secondary and commercial as tertiary. Recorded for a precise correction item, not silently changed.

## Edits made by this item
- Appended to `docs/ss1/work/microtasks/commerce/QUEUE.json`, with dependency `COM-INV-T1` + `COM-SRC-T1` and status `PENDING`: `COM-PRE-T1` (opening/scheme indexing), `COM-WK-T1-W01` … `COM-WK-T1-W10` (one per teaching week), `COM-MARK-T1-SCHEME-REVEXAM` (scheme rows 11–12), `COM-VIS-T1-W05-DIAGRAM` (chart), `COM-PRES-T1-LAYOUT` (tabs, drawing marks, page breaks, legacy format), `COM-PRES-T1-SOURCE-WORDING` (verbatim wording, defects, orphaned Week Six fragment), `COM-FACT-T1-HISTORY-NIGERIA`, `COM-FACT-T1-CUSTOMS-WAREHOUSING`, `COM-FACT-T1-NIGERIA-EXAMPLES`, `COM-FACT-T1-OCCUPATION-CLASSIFICATION`.
- Set `COM-INV-T1` to `IMPLEMENTED_TESTING_DEFERRED` with the evidence above; recomputed `counts`, `status_counts` and `next_runnable`; appended a queue note.
- No lesson, coverage entry, correction, asset or parser rule was written; no other subject, shared file, package or test file was touched.

## Not done
No tests, typechecks, importer/plan run, database/device check, migration, import or deployment (deferred by owner). No merge. Week count and labels above are what the document itself contains; nothing was inferred from the scheme alone.
