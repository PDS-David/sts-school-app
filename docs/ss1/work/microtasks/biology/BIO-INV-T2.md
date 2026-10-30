# BIO-INV-T2 — Biology, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `82e4620` (fetched). `AGENTS.md` is absent. Open PRs at start: #235 (Civic Education), #237 (Agricultural Science); none owns Biology.
- Prerequisite BIO-SRC-T2 is `IMPLEMENTED_TESTING_DEFERRED`; package `backend/src/db/ss1/subjects/biology.json` exists with its source registered and no lessons or coverage.
- Original: `2ND TERM S1 BIOLOGY.doc`, SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44` — taken from the supplied `2nd Term SS1` archive (`SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`); the file is a binary .doc. Hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was **not** supplied, so its hash was not checked.
- Method: the binary .doc was converted to .docx with LibreOffice 24.2.7.2 (`soffice --headless --convert-to docx`; converted copy sha256 `f35d9f7678ca17c745ec1a253823d5558d9cce4cd15119c3fbf7409b95314277`) in a private scratch directory and `word/document.xml` was read with lxml; all five embedded images were viewed. The importer's own .doc route was not run, so block numbers may differ under another converter. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml` of the converted copy (blocks 0-961; block 962 is `w:sectPr`), 0-based. Block text = concatenation of its `w:t` runs, UTF-8, no normalisation; text inside drawings counts toward the block that holds them. Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. A different converter or version can renumber blocks; re-derive from the verified .doc before relying on a locator.

## Week inventory (10 teaching weeks)
All ten labels are present, one per week, each a `WEEK <WORD>` run followed by wide spacing and `DATE …`. Each week has its own `TOPIC:` line directly after the label and `WEEKEND ASSIGNMENT` near its end.

| Weeks | Exact label (whitespace collapsed here) | Label block | Blocks | Label sha256 | Range sha256 | Table |
|---|---|---|---|---|---|---|
| 1 | `WEEK ONE DATE ……………………` | 29 | 29-91 | `c506e8a3b669da9ae7b0f2b13bdffcd32298dd63774feff3bed8091220f56804` | `a6b8c46dc5d521f9bbfb918a648c44d81ef5d3c3e634f8c8359c38582a2b8447` | - |
| 2 | `WEEK TWO DATE ……………………………` | 92 | 92-159 | `fdeecaa4bc5e4727501357833e68fa6e6193db9c231ff17723dde4b3f5756a38` | `10e481daa51fd5e6585f55855601248966ec640b9e7a832e20ff0979de7f98c6` | - |
| 3 | `WEEK THREE DATE ……………………` | 160 | 160-261 | `a4d3a01c43af20eaf1d20d929e3335f6d0f51b6e13a309b4284d1cc72fad0753` | `19c03eedbc3d598504bca486a0b59e87fa04af0dcf30da2f29af823fa02240c5` | - |
| 4 | `WEEK FOUR DATE……………………` | 262 | 262-325 | `51a39a7c2f829455c7b65f114ff747cb9660bf21e1579af6d295ae1c57d1cf32` | `60f45646c3a041996260c764fe46dd96cb39e48fc54da27bd1f517cdc221fcb5` | - |
| 5 | `WEEK FIVE DATE…………………` | 326 | 326-480 | `ef40f02a7290eb069023a5ba59fb18ef5456d93d8bbf52dcaf42c6ce07a7b358` | `b4b3a27765e6fbac3169fe274538cbdb262462295e886eed280471c310232d55` | block 399 |
| 6 | `WEEK SIX DATE………………………` | 481 | 481-572 | `f0edcbda6aafa4c18d5105756f809a9eb17f927397ee0853793fd82c04d4acc0` | `0bff8954b7b9936d96f11ffdab0bf739acba8ce6e074f4dfd9236fb2220b7d45` | - |
| 7 | `WEEK SEVEN DATE ………………………` | 573 | 573-682 | `9ef1976a2740902b4c16b8a4bea9380d82b9c37ec0f0131070e64422406b377a` | `4155e2974b956ebf6188034c0aed85b6fdf780872f806fe3479c737903de4fc5` | - |
| 8 | `WEEK EIGHT DATE ……………………` | 683 | 683-759 | `d51a5484f766c11525c6d8225707ab2a439343808cb869aa9ea045ea77875c39` | `57560f6e158b2a737e144712f71b9c981d4fa72c17e99ae88d7149735e009393` | block 728 |
| 9 | `WEEK NINE DATE: …………` | 760 | 760-886 | `8463ecbb13aae7cdf80da8d86383b5e1793633e42e7825b4d212dd6086e8d51b` | `964d88105674fb67420e6f884b9fb9a83d674397489b937de8457b6d8eca9ab8` | - |
| 10 | `WEEK TEN DATE: …………………` | 887 | 887-961 | `54eb325da2fb924623f047ae561f601ba62fc1061c2e2857d586cc8a4f9f2949` | `ecd6d1b683de45e47f55530180e8605b5f8057ccff672cc87ce7ac74fd5fb830` | - |

Topic lines: W1 block 30 (REPRODUCTION), W2 93, W3 161, W4 263, W5 327, W6 482, W7 574, W8 684, W9 761, W10 888. The scheme (blocks 6-17) has eleven rows: ten line up in order with the ten labels (week numbers are not in the extracted text, so they are inferred) and row 17 is `Revision and Examination`, which has no body. There is no WEEK ELEVEN/TWELVE label.

## Other sections and objects
- Blocks 0-28: `SECOND TERM E-LEARNING NOTE` (0), SUBJECT/CLASS line (2), scheme (4-17), REFERENCES (19-27: eight lines, the last `Biology practical text`), blank blocks. Range sha256 `c732dd190ea5a6df9c537d905ef0db3439c10ed2e725a0649225c0f6a538e2f7`.
- Tables: block 399 (vitamins: source, function, deficiency symptoms; 10 rows x 4 columns) and block 728 (ecological instruments and uses; 12 rows x 3 columns). Plain-text extraction concatenates cells with no separator.
- Figures (viewed directly): block 185 Paramecium conjugation cycle (`media/image1.jpeg`), 201 Spirogyra conjugation (`image2.jpeg`, captioned Figure 5.7), 221 cockroach life cycle (`image3.png`), 228 housefly life cycle (`image4.jpeg`), 818 forest food web (`image5.jpeg`; contains a spelling error in its own label). They carry no text in the block, so extraction drops them.
- Shape drawings: blocks 797-816 (food-chain arrows with chain text) and 827 (pyramid of numbers, 10 shapes and 18 text boxes, text extracted twice). No equations (`m:oMath` 0) and no OLE objects.
- Practical/observation content: no practical procedures. Practical-style items are questions or one-line methods: seedling placed horizontally (block 323), food-tests table (477, no source teaching in the week), sampling with a quadrat or transect (707) and the instruments table (728). `Biology practical text` is only a reference title.
- Chemical-handling and doses: none found. No reagents or quantities appear for food tests; later items must not invent them.
- Health, medical and regional statements to check against authoritative primary sources in later correction work (source wording not altered): block 426 (protein deficiency and kwashiorkor), vitamin table 399, mineral-deficiency questions 462 and 474, parasitism example 931 (tapeworm), Nigerian vegetation-zone statements in Week 7 (for example block 608) and the instruments table pairing in block 728. No history-of-science dates were found.

## Structural rule findings (findings only; no rule written)
- `split_before`: labels are all uppercase `WEEK <WORD>` followed by wide spacing and `DATE …`, one paragraph each, so no split looks needed on this evidence. Hazards for the unrun parser: `WEEKEND ASSIGNMENT` lines (blocks 81, 146, 248, 314, 468, 561, 669, 747, 877, 951) and the scheme header `WEEK  TOPIC` (block 6) also begin with `WEEK`; digits-only week patterns match nothing. Whether the importer mis-splits is **unverified**.
- `attach_stranded_label`: no stranded label observed; each label shares its paragraph with its DATE field.
- `classify_marker`: scheme row block 17 (`Revision and Examination`) is the only marker and has no body (SCHEME_ONLY candidate). In-body `GENERAL EVALUATION/REVISIONAL QUESTIONS` and `REVISIONAL QUESTIONS` headings must not be classified as revision markers.
- Extraction hazards (findings only): figure paragraphs (blocks 185, 201, 221, 228, 818) have empty text; block 827 returns its text twice.

## Edits
- `QUEUE.json`: BIO-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; 21 PENDING items appended (BIO-PRE-T2, BIO-MARK-T2-REVEXAM, BIO-WK-T2-W01, BIO-WK-T2-W02, BIO-WK-T2-W03, BIO-WK-T2-W04, BIO-WK-T2-W05, BIO-WK-T2-W06, BIO-WK-T2-W07, BIO-WK-T2-W08, BIO-WK-T2-W09, BIO-WK-T2-W10, BIO-VIS-T2-TBL-VITAMINS, BIO-VIS-T2-TBL-INSTRUMENTS, BIO-VIS-T2-FIG-PARAMECIUM, BIO-VIS-T2-FIG-SPIROGYRA, BIO-VIS-T2-FIG-COCKROACH, BIO-VIS-T2-FIG-HOUSEFLY, BIO-VIS-T2-FIG-FOODWEB, BIO-VIS-T2-SHP-FOODCHAINS, BIO-VIS-T2-SHP-PYRAMID), each depending on BIO-INV-T2 and BIO-SRC-T2; counts, status_counts and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
Alias approval (`BIOLOGY-ALIAS-APPROVAL`) is still an owner open item. The 3rd Term inventory (BIO-INV-T3) is unread. Next eligible: `BIO-WK-T2-W05` (heaviest health-statement and food-test scope risk), then the remaining BIO-WK, BIO-PRE, BIO-MARK and BIO-VIS items, which share one package file and should run sequentially. This does not claim the subject or class complete.
