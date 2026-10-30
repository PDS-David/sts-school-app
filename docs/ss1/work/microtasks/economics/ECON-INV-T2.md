# ECON-INV-T2 — Economics, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `986cedd` (fetched). `AGENTS.md` is absent. Open PRs at fetch: none (#238 BIO-INV-T2, #239 COM-INV-T2 and #240 DP-INV-T2 had just been merged by the owner); none owns Economics.
- Prerequisite ECON-SRC-T2 is `IMPLEMENTED_TESTING_DEFERRED`; source `SS1-SRC-03d0cac39679` is registered in `backend/src/db/ss1/subjects/economics.json`.
- Original: `ECONOMICS.docx` taken from the supplied `2nd Term SS1` archive, SHA-256 `7f353ce448daaeb3de68f9f40fc1deb0694e9a0c998d8ad5759eb0b87927020e` — hashed before conversion; equals the task's Member SHA-256. The composite archive (`02448712…9a3e`) was not supplied, so its hash was **not checked**.
- Method: `word/document.xml` read with lxml in a private scratch directory. Nothing from the document is committed. The importer was not run.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based (blocks 0-815 are paragraphs; block 816 is `w:sectPr`). Block text = concatenation of its `w:t` runs, UTF-8, no normalisation (text-box text inside drawings is included). Range hash = SHA-256 of the block texts first..last inclusive joined with `\n`, empty blocks included. A week range runs from its label block to the block before the next label (the last to block 815).

## Week inventory (11 labelled bodies; scheme lists 12 lines)
| Week | Exact label | Label block | Blocks | Label sha256 | Range sha256 |
|---|---|---|---|---|---|
| 1 | `WEEK ONE` | 63 | 63-101 | `02d023b19be8af138a9384a85f999ef47567ccf1302b9ebab417bc092420e26c` | `f4d5ed9649e02f6c299865a90b5c7b3df764749165a9e5b01c935604ed2becf3` |
| 2 | `WEEK 2DIVISION OF LABOUR` | 102 | 102-139 | `2edbfedc2d0804b4091414959cf3a0bc393bb82a8e6dd385e71f449bf870af35` | `a2140890a7df0b135a99880e933d9e9fa47b61f262af6b246eee93afb103d63d` |
| 3 | `WEEK 3: SCALE OF PRODUCTION` | 140 | 140-188 | `783f4181394be489112ba0d12650f9b897f7ba711999b7744848cc289b1c186b` | `856dc08e675aacc9e06d857c8be69ec6e43c82039b8c4c4ac5e40c7bf62069dc` |
| 4 | `WEEK 4: DEFINITION OF FIRM, PLANT AND INDUSTRY FIRM.` | 189 | 189-281 | `825075ff3236c7f4f2ec0b9f36505e546b3a66580749a6a28390e17686285c74` | `5c5d805637b2f96d5115239dcf3bdb6856b3d473c9baec6eac6e6220b8b0344d` |
| 5 | `WEEK 5 BUSINESS ORAGNISATION` | 282 | 282-374 | `44b4d1e0000962625450a55f3915d8ed992231a1b4699515366ecab9cdbaeb17` | `459c058cc1d2b97a6b0c77c45d3ef91b3080570cb2772b24883eda171c795acb` |
| 6 | `WEEK 6` | 375 | 375-436 | `58eb0cc319df5c86533ef8e746535b35bae59b8c6ff1c655fff69236f814a9d2` | `229468c32722114915f7b3656f326c73a26fe78cee99e30cb4709f3e678de6e7` |
| 7 | `WEEK 7:CO-OPERATIVE SOCIETIES` | 437 | 437-517 | `df35dd1660e6cf27746f4c6ee1dfe2bfdb87623d1670432fd45ea5d5668eb8d5` | `7a6f7710b4c6c9ac549289bce77c9f07b19442beef82ca5ee867f2adff7b5557` |
| 8 | `WEEK 8: POPULATION` | 518 | 518-613 | `517692bb4a260c455a67255aac4580050869e0e8e9686f7212f0ec05df642d82` | `1a451646ec315c65e8f18c4054cf8f5fee6da34c53c6a4a12b48afa2ce53bbfb` |
| 9 | ` WEEK 9:                            POPULATION CENSUS` | 614 | 614-646 | `4ea84c337121772c31491a95e1857b6476c86878951572771c18124d86137270` | `3c4dcd06a35f356a1918a753b8dedca3bf08676177c35437b13aba78c366af76` |
| 10 | `WEEK 10:                   THEORIES OF POPULATION` | 647 | 647-770 | `ddb6d05cdee72ede079a1b9cec37dc1c182772625316f3d9c15185e6ff03b90c` | `0fae9e7585763adbe763de6e62c7664acb9903b0accffe3ca23f39b4ce98c31e` |
| 11 | `WEEK 11: LABOUR MARKET` | 771 | 771-815 | `2329345ea3dbe9c603b679e03e76f72fdaf2581ea5365dfedf419a9f0d64c660` | `dd87241629d2f58debbeaf41af14bc498ea182d03fe90439bfd384b9a6ef7c12` |

Label text is shown exactly, including leading spaces on weeks 1, 6 and 9 (`WEEK ONE` is the only word-numbered label; weeks 2-11 use digits; week 6 is a bare `WEEK 6` with its topic in block 376). Sub-topic blocks per week are recorded in each ECON-WK-T2 item.

## Other sections and objects
- Blocks 0-62 (range sha256 `7c5cb5a2df5d15275b77e3cdc8eed6eca6c9b16b075d06d9f1d00218001c5667`): `SSS ONE ECONOMICS` (0), `SCHEMES OF WORK` (1) and the scheme (2-62). The scheme has 13 `WEEK` lines: weeks 1-6, **two lines labelled WEEK 7** (27 co-operation society, 33 public enterprises), weeks 8-10, `WEEK: 11` (56, topic in 57) and `WEEK: 12 REVISIONS AND EXAMINATION` (62). Block 54 and 55 repeat `How to control population growth`; the topic at 48-49 is split mid-word. No reference-book list, subject/class line, header or footer exists.
- Scheme versus body: Public Enterprises (scheme Week 7) sit inside the Week 7 body with no label of their own. `Population structure or distribution` is listed under scheme Week 9 but taught at blocks 728-765 inside Week 10. Scheme `Contributions to the economy` (20, 25) and `origin` of division of labour (4) have no matching heading in the bodies. Recorded, not corrected.
- Scheme week 12 has no body: the last text block is 812 (Week 11 question), 813-815 are empty.
- Assessment: `Questions` / `QUESTIONS` blocks 92, 135, 181, 262, 371, 432, 512, 595, 642, 766, 809. No answer key, marking scheme or mark allocation appears; all questions are unanswered.
- Tables and media: no `w:tbl`, no `word/media`, no header or footer part, no equation or OLE object. Visuals are DrawingML shape groups (`wgp`/`wsp`) in Week 4 only: blocks 208, 216, 222, 232 (TP, AP, MP curves), 249-250 (TP/AP/MP table headings), 265 (fertiliser table headings); their rows are plain paragraphs (251-258, 266-275) with ellipsis cells. The Week 8 population data (597-604) is plain paragraphs, titled `Pollution statistics ...`. Nothing was rendered, so shape geometry is uninterpreted.
- Practical, safety and doses: none. No practical observation, chemical handling or dose appears.
- Factual flags: Nigerian law and examples (blocks 191, 285, 287, 334, 377, 474, 633, 649, 765) and the 1980/1996 figures (599-604) need dated authoritative checks later; none was checked here.

## Structural rule findings (findings only; no rule written)
- `split_before`: scheme lines (2-62) also begin with `WEEK`, so a rule keyed on `WEEK` would split the scheme into 13 stubs. Body labels are mixed (`WEEK ONE`, `WEEK 2DIVISION OF LABOUR` glued to its topic, `WEEK 3: ...`, bare `WEEK 6`, labels with leading spaces). Whether the importer mis-splits is **unverified**.
- `attach_stranded_label`: `WEEK ONE` (63, topic `TOPIC: CAPITAL` at 64), `WEEK 6` (375, topic 376) and the scheme `WEEK: 11` (56, topic 57) are stranded from their topic lines.
- `classify_marker`: scheme block 62 is a marker with no body. `QUESTIONS` headings are inside lesson bodies and must not be classified as markers. Week 7's Public Enterprises heading (473) is teaching under no week label.

## Edits
- `QUEUE.json`: ECON-INV-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; 18 PENDING items appended (ECON-WK-T2-W01, ECON-WK-T2-W02, ECON-WK-T2-W03, ECON-WK-T2-W04, ECON-WK-T2-W05, ECON-WK-T2-W06, ECON-WK-T2-W07, ECON-WK-T2-W08, ECON-WK-T2-W09, ECON-WK-T2-W10, ECON-WK-T2-W11, ECON-PRE-T2, ECON-MARK-T2-REVEXAM, ECON-VIS-T2-W04-CURVES, ECON-VIS-T2-W04-TP-AP-MP-TABLE, ECON-VIS-T2-W08-POPULATION-DATA, ECON-PRES-T2-SOURCE-WORDING, ECON-FACT-T2-LAW-AND-DATA), each depending on ECON-INV-T2 and ECON-SRC-T2; counts, status_counts and `next_runnable` recomputed; one note appended. No existing ID otherwise changed.
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler or other-subject file touched.
- Authoring checks only (JSON parse, unique IDs, dependency resolution, git diff); no tests, importer, typecheck or database.

## Remaining
The 3rd Term inventory (ECON-INV-T3) is unread. Next eligible: `ECON-WK-T2-W04` (largest drawn-shape content). This does not claim the subject or class complete.
