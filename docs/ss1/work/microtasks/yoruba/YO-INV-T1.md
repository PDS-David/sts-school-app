# YO-INV-T1 — Yoruba 1st Term document inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory complete; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `4159336c7068d2235209221f5f14adc4986acec5` (origin/master, fetched). Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. No open PR owns YO-INV-T1 (#188–#192 are Government, Literature, Mathematics, Physics and Technical Drawing).
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes. Member SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **verified this run**. The archive `SSS 1-20260507T072431Z-3-001 (1).zip` was hashed this run: 35,828,550 bytes, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, matching the prompt.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (26,329 characters, 1,781 lines, 749 non-blank, 882 body paragraphs); `word/document.xml` inspected for paragraphs, tables, shapes and run text. Importer, parser and compiler were not run. Line numbers are 1-based lines of `extractRawText().split('\n')`; block hashes are SHA-256 over those lines joined with `\n`, edge blank lines trimmed, UTF-8, no trailing newline. No extract or render is committed.

## Week and teaching-section inventory
Eight teaching sections, each introduced by a Yoruba ordinal heading. Every week is **one** teaching section: the `EKA ISE` components (EDE / ASA / LITIRESO) sit under the single week heading, not as separate sections. No week holds more than one teaching section.

| Week | Verbatim label | Label line | Section lines | Section SHA-256 | Components (heading lines) | Evaluation / assignment |
|---|---|---|---|---|---|---|
| 1 | `OSE KIN-IN-NI` | 61 | 61–310 | `953d3f997edbec82be8ffbe9ccfa54e09fd174edd15dd2779d0fd9362eacc940` | EDE 63/65, ASA 105/107, LITIRESO 237/239 | 281 / 295 |
| 2 | `OSE KEJI` | 311 | 311–482 | `8d9ce15f7d4ac50c2b45dd5da5c7c16d9c6bb30ea7156e62e94550dc95d3365c` | EDE 313/315, ASA 407/409, LITIRESO 445/447 | 465 / 477 |
| 3 | `OSE KETA` | 483 | 483–724 | `ddc960d351bbb3dc644d42b56fcf6c23e1a449df0bc65c11e65f3f6c7d8b0d13` | EDE 485/487, ASA 575/577, LITIRESO 683/685 | 701 / 713 |
| 4 | `OSE KERIN` | 725 | 725–1170 | `237de99a8e8fd2a31bd829d116d0b731d3c1200a53e632f90ca0979e4d0ec5b7` | EDE 727/729, ASA 1097/1099; **no LITIRESO heading** | 1149 / 1161 |
| 5 | `OSE KARUN-UN` | 1171 | 1171–1284 | `07f19f39fec135479547187c28daee6b79daea8e61ee0c5262f95fa99280cd0f` | EDE 1173/1175, ASA 1237/1239, LITIRESO 1259/1261 | 1265 / 1275 |
| 6 | `OSE KEFA` (stored as `\tOSE KEFA\t`) | 1285 | 1285–1502 | `fc386f54c1e65fe74b607f590407df56ef7dc6553b927b1429d16e571c29ad4b` | EDE 1287/1289, ASA 1437/1439; **no LITIRESO heading** | 1481 / 1493 |
| 7 | `OSE KEJE` | 1503 | 1503–1684 | `bfab796f499c382f7b0df35ae0cccafe235f26d7f6e845a93f43e763f54a7ef9` | EDE 1505/1507, ASA 1643/1645; **no LITIRESO heading** | 1669 / 1681 |
| 8 | `OSE KEJO` | 1685 | 1685–1781 | `1df0a9b8cccccb476253677de79e32156becb71cd3cb6622ed91d268672d28fd` | EDE 1687/1689, ASA 1725/1727, LITIRESO 1763/1765 | 1767 / 1779 (spelled `Ise aetilewa:`) |

- Labels are written as Yoruba ordinals; label-line SHA-256 values are recorded in each appended queue item. Week 6's label is the only one wrapped in tab characters (`\tOSE KEFA\t`).
- The document contains **no English `week`/`WEEK` string at all** (0 occurrences, case-insensitive) and no bare-number week labels, so the parser hint about a flattened table with numbers after the Yoruba word for week does **not** apply to this document.
- Weeks 4, 6 and 7 have no separate `EKA ISE: LITIRESO` heading. This records heading absence only; literature content folded inside other components was not assessed here.
- There is no examination or revision section after Week 8; the document ends at line 1781. The three `Atunyewo` lines (9, 11, 13) are revision **topics inside the opening scheme list**, not a revision teaching section.

## Opening / preamble section
- Title line 3 `ODUN IGBEKO YORUBA-SS 1` (`d8437b734b0870428d488cfd4d6d70ded08f6c26a2337419605f7c37998f09a9`).
- Heading line 5 `ISE OOJO-SAA KIN-IN-NI` (`fc6b29dc4fad10257b786ae43b32e23305fcfaf44e402aa1ad38022a617e42b5`).
- 22 topic paragraphs on lines 9–51 (`afccd54e46ad92e7b72d22f583a12872251a079401e20f00d4d9af7c5b4f6af6`); block lines 3–51 (`843e0cf1d5ae2076d0c8149392dd73f41064dddcbd66f27042cffe2fab741e32`).
- The list has no week numbers and no week markers, and the first teaching heading follows at line 61. It is treated as the opening scheme/topic section and deferred to `YO-PRE-T1-1`; none of its text was treated as a teaching body.

## Embedded objects
- **8 Word tables** (`w:tbl`, 56 rows, 244 cells), mapped to weeks: `IGBA / AKOKO` line 121 and `IDAHUN` line 177 (Week 1 ASA); `IBI ISENUPE` line 749, `ONA ISENUPE` line 815, `IRO KONSONANTI` line 871 and the large consonant grid line 889 (Week 4 EDE); `APA` line 1303 (Week 6 EDE); `SIPELI ATIJO` line 1513 (Week 7 EDE). `extractRawText` emits cell text as separate lines, so table structure is not represented in the text.
- **Two figure groups:** the `ATE FAWELI` vowel chart (heading line 551; labels 551–569, SHA-256 `2710e096a6c18874b9321936f332893863db6d11c496f2a3a53353dc58489cc0`) is 2 `w:drawing` + 2 `w:pict` objects with 17 `v:shape` elements; and five inline objects on the Week 6 syllable examples (lines 1415–1423, SHA-256 `1a0b94445d2c6821f698d589d1798d0e8a9047d814b07f15ae1f36e437305db2`), each a `w:drawing`/`w:pict` pair (6 `v:shape`).
- Totals: 7 `w:drawing`, 7 `w:pict`, 23 `v:shape`, 6 `v:stroke`, **0 OLE objects, 0 `oMath`, 0 raster media files**. Mammoth ignored `v:stroke`, so the shapes are not described by the extraction. Disposition deferred to `YO-VIS-T1-01`, `-02` and `-03`.

## Diacritics
- **No tone-marked or subdot characters exist in the source or the extraction**: 0 matches for the Yoruba Latin ranges (`U+1E00–U+1EFF`), combining marks (`U+0300–U+0304`) or Latin-1 accented letters in `word/document.xml` `w:t` text, and 0 in `extractRawText`. The only non-ASCII characters in the extraction are en dash (41), `£` (1) and curly quotes (46).
- Nothing was lost by extraction because the marks are absent from the document. The source writes phonetic notation with ASCII substitutes (`d3` for the affricate, `>` and `£` for vowel symbols, `e-`/`o-` for subdot vowels). This is a **content/notation risk**, not an extraction defect; no marks were added or normalized. Subject-expert review remains outstanding.

## Queue changes
- Appended 13 items, all `depends_on: ["YO-SRC-T1"]`, `status: PENDING`, with the same field set as the existing queue:
  - `YO-WK-T1-W01` … `YO-WK-T1-W08` — one `SOURCE_WEEK_INDEXING` item per week, carrying label, line range, section hash, component lines and evaluation/assignment locators.
  - `YO-PRE-T1-1` — `SOURCE_PREAMBLE_INDEXING` for the title and 22-topic opening list (lines 3–51).
  - `YO-VIS-T1-01` (vowel chart), `YO-VIS-T1-02` (five inline syllable objects), `YO-VIS-T1-03` (eight tables) — `VISUAL_DISPOSITION`.
  - `YO-FND-T1-01` — `FOUNDATION_REQUEST`: `ingestTopics.ts` matches English `week` and numerals only, and `compiler.ts` accepts numeric week labels only, so this document's `OSE …` headings produce no parsed rows and cannot be expressed through `source_rules`; the schema has no source-specific label-pattern field.
- Added all 13 IDs to `YO-SCOPE-OBJECTIVE-INDEXING.depends_on` (now 16 entries). `YO-INV-T1` → `IMPLEMENTED_TESTING_DEFERRED`.
- Counts: 21 items; 4 implemented / 17 pending; kinds 3 registration, 3 week inventory, 8 week indexing, 1 preamble indexing, 3 visual disposition, 1 foundation request, 1 scope decomposition, 1 test. `next_runnable` → `YO-INV-T2`.
- `yoruba.json` was **not** edited. No week was invented and no objective was indexed.

## Limits
- Inventory only: no objective-level coverage, no lesson, no asset, no approval. No parser/importer/compiler/test/typecheck/database/device run (testing deferred by owner).
- The inventory is based on the `.docx` extraction plus XML structure; rendering of the figures and tables was not viewed and is explicitly deferred to the appended visual items.

## Remaining
- Next: `YO-INV-T2` (2nd Term inventory; its queue item and `YO-SRC-T2` already exist). All 13 appended items are also eligible now; `YO-SCOPE-OBJECTIVE-INDEXING` stays pending until every one is complete.
- Owner: alias/content approval remains open in `yoruba.json` (`YORUBA-OBJECTIVE-INDEXING`); the missing diacritics and ASCII phonetic notation need subject-expert review in the week items.
