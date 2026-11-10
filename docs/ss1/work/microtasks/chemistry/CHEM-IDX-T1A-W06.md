# CHEM-IDX-T1A-W06 — Chemistry, 1st Term WEEK SIX indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `f2ab88c66196a7d24d0ce6a5a388c9c1048d5602`. `docs/ss1/work/AGENT_PROTOCOL.md` was followed. CHEM-INV-T1A and CHEM-SRC-T1A are `IMPLEMENTED_TESTING_DEFERRED`. CHEM-IDX-T1A-W06 was `PENDING`; `git log origin/master --grep=CHEM-IDX-T1A-W06` returned nothing; no `origin/agent/*` branch had touched chemistry in the last three hours.
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — **verified**. Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, 2,187,976 bytes, SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — **verified**. Extracted only that member, to private scratch outside the repository. Nothing from the source is committed, including the pictures.
- Text read with `mammoth` 1.12.2 `extractRawText`: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` — equals the task.
- Locator re-check: lines 1116-1335 joined with `\n` hash to `e5e147ad7fb2954b63f69d8c7c37c4e3d507cbdef6108d0c82ffec3c87bab478`, equal to the locator. `WEEK SIX` is line 1117; `WEEK SEVEN` is line 1337.
- DOCX XML scan of the body children from `WEEK SIX` (child 558) to `WEEK SEVEN` (child 668): 5 `a:blip` / 5 inline `w:drawing`, all real raster pictures (none a 1x1 spacer); 2 `w:tbl` (each 1 row, 1 column, one paragraph, no drawing); no `w:txbxContent`, `w:pict`, `m:oMath`, `w:object`, hyperlink or field; `w:vertAlign` runs: 205 baseline, 6 subscript, 1 superscript; 26 paragraphs carry automatic numbering or bullets.
- Nothing run: no tests, typechecks, importer, database, device or deployment. The pictures were not opened or rendered; their content is for CHEM-VIS-T1A-W06-MEDIA.

## Locator method
Line numbers are 1-based over `extractRawText` text split on `\n`; a section runs from its first to its last non-blank line (whitespace-only lines inside a section, which carry pictures, stay in its range); SHA-256 over the UTF-8 lines joined with `\n`. The item's own ranges include trailing blank lines (for example 1133-1137); the ranges below stop at the last non-blank line.

## Section index (lines 1116-1335)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK SIX label | 1117-1117 | `8c07e3bd938cea9a3897d0d69eb6c600bf1fbace15d21b346bf0372fa095c038` | marker line |
| TOPIC: STANDARD SEPARATION TECHNIQUES | 1119-1119 | `5ae9853f3b093e7a7ebc7450a4787585c27d373d6b8cb6c95de6d1c42f60168f` | topic line; omits `FOR MIXTURES` from scheme row 6 |
| CONTENT | 1121-1123 | `415291c7f3aa127c8484f737c0f146ac4ca14322d9c242f7f7c719db057ffad9` | one entry: `STANDARD SEPARATION TECHNIQUES` (1123) |
| STANDARD SEPARATION TECHNIQUES (introduction) | 1127-1129 | `374dec5239ca77623fa0301937e230cae32625b32beeb0c6086eec1639a7cc96` | heading repeated (1127); one paragraph naming the techniques (1129), including `fractional precipitation` |
| FILTRATION | 1133-1135 | `91a91049efe67ae21dd1d05655890f61e8a3ce8c0f966290e490813ae2990774` | heading; one paragraph (1135) |
| CENTRIFUGATION | 1139-1145 | `f5594c86eaf29904ad31e0ee56b00a57fe8b0677333cc7ba1e60e871a5cf57b0` | heading; caption `A CENTRIFUGE MACHINE` with leading spaces (1141); whitespace-only line 1143 (44 spaces) carries a picture (image27.png); one paragraph (1145, trailing whitespace) |
| DECANTATION | 1149-1151 | `fb9fbd019d45f00228b0dac376201aa95a15724bea46af53ba04f6201f6128f5` | heading; one paragraph (1151) |
| EVAPORATION | 1155-1165 | `446e6b0d32a11077b6e43e135e1de1f0c24efc800f4fe6efab303f6d17e6e9f9` | heading; definition (1157); caption `A Salt Evaporation Pond` (1159); whitespace-only line 1161 (33 spaces) carries a picture (image44.png); line 1163 is a 1x1 Word table cell holding one paragraph; 1165 uses an en dash |
| CRYSTALLIZATION | 1169-1177 | `1d45ce7d1e9f3ef9914dc616a18a7876d013d601e5d8f6e39d8f13d6c7874415` | heading; method (1171); two inducement lines (1173, 1175, automatically numbered or bulleted); uses (1177) |
| FRACTIONAL CRYSTALLIZATION | 1181-1183 | `9f1cc187868965bad4a9f29ab4f3f22516932878e95d6cc5c13cce28611795f4` | heading; one paragraph (1183) |
| EVALUATION 1 | 1187-1193 | `890c4a8dbf40bfcbf792aaf7f085dbba4d2b303f2072edfafe806e3872fa2b61` | 3 questions (1189 with tabs, 1191, 1193) |
| PRECIPITATION | 1197-1199 | `e052a535327dde628ffa7cdca4661eb27bdfe96d5e286ef859fcd60f2446340e` | heading with trailing whitespace (1197); one paragraph (1199) |
| SUBLIMATION | 1203-1205 | `b80a87a80478cbc04b5d472d90e3075ed557994ddc803dd574358bfee624e7cf` | heading; one paragraph (1205); a picture (image26.png) sits in an image-only paragraph that the extracted text shows as blank line 1207 |
| DISTILLATION | 1211-1215 | `739b4d7a3a5e3a0a64c1c067c6b8a9606adfc2c4f60ad18ebe84917029b12370` | heading; whitespace-only line 1213 (13 spaces) carries a picture (image58.png); one paragraph (1215) |
| FRACTIONAL DISTILLATION | 1219-1221 | `7ef9660fcd3ad666a6a8c0b66fbc84bb77ed5a6ae76401e6ddb4aaa1dec77372` | heading; one paragraph (1221, trailing whitespace) with an unclosed parenthesis after `less than 100oC` |
| EVALUATION 2 | 1225-1233 | `930a08d740815e130a1717491e4fd0e42bc58ed0682723a14806e396df40a2b4` | questions 1 (1227) and 2 (1229) typed with numbers; two techniques listed (1231, 1233) |
| SEPARATING FUNNEL | 1237-1239 | `57563b14de3ddd95c427605f331a8915d2b05b10c7a36e96fb4c4f48002896fa` | heading; one paragraph (1239) |
| SIEVING | 1243-1245 | `1f01d8ead6d0b02757ef3d01b52dbe363531d25f58debc8cc6a59cb078ac8807` | heading; one paragraph (1245) |
| MAGNETIC SEPARATION | 1249-1251 | `118b2847a4be42925f2cdc07f23ee3a6ab6076cdfd7e39104f3f23d8bef107ed` | heading; one paragraph (1251) |
| CHROMATOGRAPHY | 1255-1279 | `5c82b945cb9e1aa837e86460901e71651af3370ce30b0471cb837544a1c6ded4` | heading; one paragraph (1257); whitespace-only line 1259 (17 spaces) carries a picture (image53.png); line 1261 is a 1x1 Word table cell holding one paragraph; `Types` (1265) with four types (1267-1273); paper chromatography method (1275); uses (1279) |
| CRITERIA FOR PURITY | 1283-1287 | `f82ccb239ddfd238197b8f794563339375204d784db54efbf71792e0653b3227` | heading; two statements (1285, 1287) |
| GENERAL EVALUATION | 1291-1299 | `377adfb16c108e36495e651b95447805b07eab1d5c35fa88e7ec24b0e2f12a08` | 4 questions (1293, 1295, 1297 with trailing whitespace, 1299) |
| READING ASSIGNMENT | 1303-1305 | `192b3c922d04fd1dad1548c3d3c65279e5fef9d5c8f4f5458dfd068f859d3c02` | one textbook reference with pages (1305); not supplied, not copied |
| WEEKEND ASSIGNMENT | 1309-1323 | `605d74ef6a4d492bbf14af93384d6f33cbeb2552c22a74fc010d5c0513ac77fb` | 5 objective questions with options (1311-1313, 1315, 1317, 1319-1321, 1323); options of questions 1 and 5 run onto a second line; no answer key; plain paragraphs, no table |
| THEORY | 1327-1331 | `491f8232dd85e2a417ed47d7113ca9024ddb3825c0f60570e9dca6c6438eb682` | 1329 three techniques; 1331 two criteria for purity (the same wording as 1299) |

Every non-blank line from 1117 to 1331 belongs to a section above (checked by script); lines 1332-1336 are blank. Nothing is discarded.

## Pictures and tables (layout facts only; dispositions belong to CHEM-VIS-T1A-W06-MEDIA)
| Body child | Anchor line | Part | Bytes | Pixels | SHA-256 |
|---|---|---|---|---|---|
| 571 | 1143 (whitespace-only, after caption 1141) | `media/image27.png` | 175,209 | 260x340 | `74425d67bf9315ebd350585e5495fd9a03767703c0238c5306088ad7ad752bf1` |
| 580 | 1161 (whitespace-only, after caption 1159) | `media/image44.png` | 285,420 | 556x414 | `e8a47bc580d540fa47e5813520b1bbdcb1b9aba3502200c2b1aea2a9a60bd8cb` |
| 603 | 1207 (image-only paragraph, shown blank, after the sublimation paragraph) | `media/image26.png` | 24,823 | 556x390 | `94f12e2fbe43ae8e3294b4def20f1384d5d5f9a9372a74875567f6b564ec560d` |
| 606 | 1213 (whitespace-only, after the DISTILLATION heading) | `media/image58.png` | 351,341 | 484x336 | `52c6eee8da878c875227eaf4b9e6ae269579c4ed3648f22e8ccd0100e63662af` |
| 629 | 1259 (whitespace-only, after the chromatography principle) | `media/image53.png` | 292,135 | 500x336 | `1cda1811a200c6a9a162fce7c61ea5f0823a16d853e02a01d5d81a618a1bd1d4` |

The picture at body child 603 carries a `docPr` name that is a Windows temporary-internet-files `.bmp` path rather than a file name; the others are named after their parts. The item text says "five real photographs and the state-change diagram"; the XML shows five pictures in total. The two 1x1 Word tables are body child 581 (line 1163) and body child 630 (line 1261), one narrative paragraph each.

## Exercises (indexed, not answered)
- **EVALUATION 1 (1187-1193):** 1189 `Explain briefly the following methods of separation of mixtures: (a) Filtration (b) Decantation (c) Centrifugation`; 1191 how to obtain a pure sample of copper(II) tetraoxosulphate(VI) crystals from solution; 1193 `How would you separate a mixture of PbCl2 and NaCl`.
- **EVALUATION 2 (1225-1233):** 1227 `1. State the major difference between distillation and fractional distillation in terms of (a) Features of the apparatus (b) Mixtures to be separated`; 1229 `2. Explain the following separation techniques` with 1231 `Precipitation` and 1233 `Sublimation`.
- **GENERAL EVALUATION (1291-1299):** 1293 magnetic separation, paper chromatography and sieving; 1295 how to separate NaCl, PbCl2 and NH4Cl; 1297 the method for iron filings and sulphur; 1299 two criteria for purity.
- **READING ASSIGNMENT (1303-1305):** 1305 `New School Chemistry for SSS by O.Y Ababio.Pg 16 to 20`; not supplied and not copied.
- **WEEKEND ASSIGNMENT (1309-1323):** five objective questions (1311-1313 separating oil and water; 1315 what fractional distillation separates; 1317 separating iodine and sodium chloride; 1319-1321 which is not a type of chromatography; 1323 a quick but inaccurate way of separating a mixture). None has an answer key or mark.
- **THEORY (1327-1331):** 1329 `Explain briefly the following separation techniques (a) evaporation (b) filtration (c) fractional distillation`; 1331 `Mention two criteria for purity of a substance.`
- No answer, marking guide or mark allocation exists anywhere in the week. None is authored here.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Why mixtures are separated; filtration, centrifugation, decantation (1127-1151).
2. Evaporation, crystallization, fractional crystallization (1155-1183).
3. Precipitation and sublimation (1197-1205).
4. Distillation and fractional distillation (1211-1221).
5. Separating funnel, sieving, magnetic separation (1237-1251).
6. Chromatography (1255-1279).
7. Criteria for purity (1283-1287).
8. Solubility facts for PbCl2 and NaCl (1193, 1295) — **no supporting text**.

## Scheme mapping and coverage
- Scheme row 6 (line 57, `STANDARD SEPARATION TECHNIQUES FOR MIXTURES`, SHA-256 `10acd10633df313f9e98a7ca57630d7709d4abdfbc6217b1937db53da9dd7ff2`) maps to the week by position and shared title; the body topic line omits `FOR MIXTURES`. The scheme has no sub-items.
- Package change: **nine** coverage entries in `chemistry.json`, none with lesson ids: `COV-CHEM-T1A-W06-SCHEME-6`, `-SOLID-LIQUID`, `-EVAPORATION-CRYSTALLIZATION`, `-PRECIPITATION-SUBLIMATION`, `-DISTILLATION`, `-FUNNEL-SIEVING-MAGNETIC`, `-CHROMATOGRAPHY`, `-PURITY` (PARTIAL) and `-SOLUBILITY-GAPS` (UNRESOLVED). All still block delivery. The package stays `PENDING`; no coverage beyond indexing is claimed.
- Open item for the UNRESOLVED entry: `CHEM-LES-T1A-W06-SOLUBILITY-GAPS` (new). Statement-level verification stays with `CHEM-FACT-T1A-W06-STATEMENTS` (new); pictures with `CHEM-VIS-T1A-W06-MEDIA` (existing); method text with `CHEM-PRES-T1A-EXPERIMENTS` (existing).

## Findings (source wording retained; nothing corrected)
- **Correction to the item objective.** It says the weekend block is wrapped in a 1x1 Word table at body child 630. In the XML the weekend paragraphs are plain paragraphs (body children 654-655 onward). Body child 630 is a 1x1 table holding the chromatography paragraph (line 1261), and body child 581 holds line 1163. This repeats the line-number/child-number mix-up recorded in CHEM-IDX-T1A-W03.md.
- The introduction (1129) lists `fractional precipitation` while the body heading is `PRECIPITATION` (1197); it does not name fractional crystallization (1181); it ends with a full stop only after `chromatography`.
- Lines 1163 and 1261 sit in table cells and read in a different voice from their neighbours; their source and rights status are not established and nothing was checked. Recorded as unknown, not as copied or original.
- Notation: the extracted text shows `FeS04` (1199, three times) with the digit zero where the letter O belongs and the 4 as a subscript; `PbCl2` (1193, 1295) and `NH4Cl` (1295) carry subscripts that the text flattens; line 1221 reads `100oC` with a superscript `o` and an unclosed bracket. Recorded as written; preservation is CHEM-PRES-T1A-FORMULAE's.
- Spellings and forms as written: `seedling` (1173), `vapourising` (1215), `salt –making` with an en dash (1165), `?(a)` with no space (1319), `Pg 16 to 20` (1305).
- Weekend question 1 and question 5 options run onto a second line (1313, 1321).
- Whitespace-only picture-anchor lines 1143 (44 spaces), 1161 (33), 1213 (13) and 1259 (17); trailing whitespace on 1145, 1197, 1221, 1297, 1311, 1313 and 1319; leading spaces on 1141. Preserved.
- One bounded follow-up for the gap: `CHEM-LES-T1A-W06-SOLUBILITY-GAPS`. One bounded follow-up for later verification: `CHEM-FACT-T1A-W06-STATEMENTS`.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: `coverage` goes from thirty-six to forty-five entries. No other field changed.
- `QUEUE.json`: CHEM-IDX-T1A-W06 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CHEM-LES-T1A-W06-SOLUBILITY-GAPS` (LESSON) and `CHEM-FACT-T1A-W06-STATEMENTS` (FACTUAL_DEPENDENCY) inserted after `CHEM-FACT-T1A-W05-STATEMENTS` (PENDING, depend on CHEM-INV-T1A, CHEM-SRC-T1A, CHEM-IDX-T1A-W06); `counts`, `status_counts` (14 implemented / 102 pending / 1 blocked; 117 items) and `next_runnable` recomputed from the items; one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched; no picture committed.

## Authoring checks (not tests)
JSON parse with byte-stable re-serialisation; SHA-256 of the archive, member, whole text, week range, scheme row, every section and each picture part; script check that every non-blank line 1117-1331 is in a section; DOCX XML scan for drawings, text boxes, tables, equations, scripts, picture dimensions and anchors, sub/superscript runs and list numbering; unique ID and reference checks; kind and status counts and `next_runnable` recomputed from items; diff inspection.

## Remaining
Weeks Seven to Ten, the opening block and the revision/examination markers still need their own indexing; the Week Six picture disposition, the solubility lesson and the Week Six statement verification are open. Alias approval items stay owner actions. Not executed here. This does not claim the subject or class complete.
