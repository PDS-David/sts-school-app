# BIO-PRE-T2 — Biology, 2nd Term preamble and scheme (blocks 0-28)

Status: **IMPLEMENTED_TESTING_DEFERRED** (record only; not approved, not verified). Nothing was run: no importer, compiler, zod parse, test, typecheck, database or device. No package, rule, coverage, lesson, correction or asset was written.

## Inputs
- Base: origin/master `403c101` (fetched 2026-11-08). Agent A2. Claim held on `biology`.
- Archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc` SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`: both verified equal to the queue before conversion.
- Method (as BIO-INV-T2): `soffice --headless --convert-to docx` (LibreOffice 24.2.7.2) of the verified .doc in private scratch; `word/document.xml` read with lxml. The converted file's own SHA-256 differs from the one BIO-INV-T2 recorded (`f35d9f76…`), so conversion output is not byte-stable. Text locators are unaffected: 963 blocks (block 962 is `w:sectPr`), range 0-28 and the block 29 label hash reproduce exactly. The importer's own .doc route (word-extractor) was not run.
- Locator rule unchanged: block = direct child of `w:body`, 0-based; text = concatenation of `w:t` runs, UTF-8, no normalisation; range hash = block texts joined with `\n`, empty blocks included.
- Reproduced: range 0-28 = `c732dd190ea5a6df9c537d905ef0db3439c10ed2e725a0649225c0f6a538e2f7` (equals the queue value); block 29 `WEEK ONE …` = `c506e8a3b669da9ae7b0f2b13bdffcd32298dd63774feff3bed8091220f56804`.

## Block map
Empty blocks (1, 3, 5, 18, 28) all hash to `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

| Block | Text (verbatim) | Block SHA-256 | Classification | Handled by |
| --- | --- | --- | --- | --- |
| 0 | `SECOND TERM E-LEARNING NOTE` | `c3a8dc39c250fd530499bc2d27d4d50ed829835a1e586e85165d2d16dad0edd9` | generic template title = registered `header_text` | `biology.json` source `SS1-SRC-eb6e9665f42c`; owner item `BIOLOGY-ALIAS-APPROVAL-T2` |
| 1, 3, 5 | blank | empty hash | separators | none |
| 2 | `SUBJECT: BIOLOGY          CLASS: SS 1` (ten spaces) | `9d472e2490257f82f39853a18996763b06d2fe89ad12e47c6ac1704748f572ea` | subject and class line; confirms subject | the source's `header_evidence` |
| 4 | `SCHEME OF WORK` | `8104f5ba0f84b6d0bd6c7197460d87d05b526578cebae1ae784ad29a8b48f15e` | scheme heading | none |
| 6 | `WEEK  TOPIC` (two spaces) | `8b374bfde4a04f38b8f32285e25c50f445a9533c92027239e5de7a9742f2fa32` | scheme column header; begins with `WEEK` | none (parser hazard below) |
| 7 | `Reproduction (Meaning, Types and Form of Asexual Reproduction)` | `e9bf035735b23461cca014ea098bd51bec8bb2f004c91907322d42d58291ccdf` | scheme row 1 | BIO-WK-T2-W01 |
| 8 | `Sexual Reproduction (Conjugation, Meiosis) and Excretory Organelles in Living Cells` | `fa8257ee8564e29a540ff34a3d7dd83188da93b9a753ce51a9799df9843c8ea0` | scheme row 2 | BIO-WK-T2-W02 |
| 9 | `Reproduction in Unicellular Organisms and Invertebrates` | `78ed1882c0bb2ae320f084f6e77661990b97ffdb59635091d229f8b892350969` | scheme row 3 | BIO-WK-T2-W03 |
| 10 | `Irritability and Movement` | `2c07bbe62f17f90f546516e0264e1267cda019b05219662778c5e55e3080847f` | scheme row 4 | BIO-WK-T2-W04 |
| 11 | `Nutrition in Animals (Food Substances and Digestive Enzymes)` | `96d19bfae7cc585def4a67f50ac88c6979628dd22b9f460ac95cd27f7eb9b88b` | scheme row 5 | BIO-WK-T2-W05 |
| 12 | `Basic Ecological Concepts` | `a7f2e2b0f519195afdeabfdfaa6b8b68ae43f03a60b4fb9a7d9909a536e0eab7` | scheme row 6 | BIO-WK-T2-W06 |
| 13 | `Biomes` | `923b13b59420a08eb268290b93a1c70d296a8b817ce8947adb6a49f366ef5ace` | scheme row 7 | BIO-WK-T2-W07 |
| 14 | `Population Studies` | `61ebccc55be0f4a5b1958ee1a38c8510c7a9d8589a0833820b07d403a8cf6fce` | scheme row 8 | BIO-WK-T2-W08 |
| 15 | `Functioning Ecosystem` | `323bbe3709b9989ec3460cec848f22f8dbb58c947ac65e18cd098bccf874ad1c` | scheme row 9 | BIO-WK-T2-W09 |
| 16 | `Ecological Management ` (trailing space) | `daef1cd7fa4a17bb647c5ef6a86fc091e9ec240a06e46ed3e74f5b4c69dc4bd8` | scheme row 10 | BIO-WK-T2-W10 |
| 17 | `Revision and Examination` | `4ebd2846ac1f994f8e722e904995bf68b68234dfa0674e1cd0b4efed9163c964` | scheme row 11; no body | BIO-MARK-T2-REVEXAM |
| 19 | `REFERENCES` | `704d8a18e343aa05fdc15cdefa27e6ac40335fe3486cfe27252249244e02956e` | references heading | none; citations only |
| 20 | `Modern Biology for Senior Secondary Schools by S.T. Ramlingam` | `eb2c37ce3659bbf9452ac694b738cad64a62441f1e66d34f70752fa5e614dac0` | reference 1 | none |
| 21 | `Essential Biology by M.C Michael ` (trailing space) | `09642b6eebc863bc3cfc67e55cc0ecda1236d2fbadcf07655b5e0d460c3a5bc2` | reference 2 | none |
| 22 | `New Biology by H. Stone and Cozen` | `839d2bfc08cdb584689ab5434af9d340b95f3b860ae12379db46c21627d7b20e` | reference 3 | none |
| 23 | `SSCE, past questions and answers` | `eec5ca8d2e82a17b96abf0213ca278025b5c42f6762e10685e9444b393f30e08` | reference 4 | none |
| 24 | `New System Biology by Lam and Kwan ` (trailing space) | `af3d59d0ecc26e4834cb5b2de2d711c4516ad3fe4d3387a72bca2e2c5406ee09` | reference 5 | none |
| 25 | `College Biology by Idodo Umeh` | `b3dc13afec4fb0d5b91d49c6e150d0be72832197e880f4347e7b2df0e1b57f0b` | reference 6 | none |
| 26 | `UTME, SSCE and CAMBRIDGE past questions and answers ` (trailing space) | `387bfb5d2bfe87480c8fc47aa8e84faed3715b155d80a3cbe3c68767c6fb0a61` | reference 7 | none |
| 27 | `Biology practical text ` (trailing space) | `36433d20ca2d415fca9c8631f31aa6f14cf515405e37546c7f4ee07ba1094821` | reference 8 | none |
| 28 | blank | empty hash | last separator before `WEEK ONE` (block 29) | none |

Sub-range hashes: blocks 0-2 `a69121443210ba22a98650578ea898e57edb1d51022cd175723d7da6695482a2`; scheme rows 7-17 `496857908bd456971543e7c5e506b8649fdbae38357c574e82633b4e2f5dc37e`; references 20-27 `b406e0cf2e947b09eb18b65e652c0dd6050e3354d11eb64afcc4f1ec2627c468`.

Every block 0-28 is accounted for. No drawing, shape, table, hyperlink, text box, equation or OLE object lies in the range.

## Week numbers: firmer than BIO-INV-T2 stated
- Scheme rows 7-17 are one auto-numbered list (`numId` 18, decimal `%1.`, start 1, no overrides), so in the converted copy they display as 1-11; row 11 is `Revision and Examination`. The numbers are list numbering, not text, so plain-text extraction omits them (the extracted text is unnumbered).
- Each of rows 1-10 pairs with the `TOPIC:` line of the same-numbered week: 30 `REPRODUCTION`, 93 `SEXUAL REPRODUCTION`, 161 `REPRODUCTION IN UNICELLULAR ORGANISMS AND INVERTEBRATES`, 263 `IRRITABILITY / CELL REACTIONS TO ITS ENVIRONMENT`, 327 `NUTRITION IN ANIMALS`, 482 `BASIC ECOLOGICAL CONCEPTS`, 574 `BIOMES`, 684 `POPULATION`, 761 `FUNCTIONING ECOSYSTEM`, 888 `ECOLOGICAL MANAGEMENT`. So the week numbers are confirmed from list numbering plus topic agreement, not only from order. The numbering comes from the LibreOffice conversion of the .doc; whether the importer's extractor shows it was not tested.
- References 20-27 are the same kind of list (`numId` 28) at level 1, a bullet; they carry no numbers.

## Findings (not adjudicated)
- Scheme row 2 (block 8) includes `Excretory Organelles in Living Cells`, but the Week 2 topic line (block 93) names only `SEXUAL REPRODUCTION`; whether the body teaches excretory organelles is for BIO-WK-T2-W02. Row 4 reads `Irritability and Movement` against the longer topic `IRRITABILITY / CELL REACTIONS TO ITS ENVIRONMENT`; row 8 `Population Studies` against `POPULATION`; row 5's parenthesis (`Food Substances and Digestive Enzymes`) is not in its topic line.
- Row 11 `Revision and Examination` has no body and no week label (BIO-MARK-T2-REVEXAM).
- Block 6 `WEEK  TOPIC` begins with `WEEK` and the ten `WEEKEND ASSIGNMENT` lines (blocks 81, 146, 248, 314, 468, 561, 669, 747, 877, 951; BIO-INV-T2) do too; whether the unrun importer splits on them is **unverified**.
- Page furniture, not teaching: `header1.xml` reads `Name: ____ Class: ____` (a student answer line) and `footer1.xml` reads `GSS/2ND TERM/BIOLOGY/SS1` plus a page-number field whose cached value is `33` in the conversion; neither enters any lesson. No comments, tracked changes, footnotes or endnotes.
- References are citations, not reuse permission; two are generic past-question collections (blocks 23, 26) and one is the practical-text title (27); none of these works is supplied.

## Edits
- `QUEUE.json`: BIO-PRE-T2 -> `IMPLEMENTED_TESTING_DEFERRED`; status_counts, next_runnable and one note updated; no other item changed.
- This file. `biology.json` not touched.
- Authoring checks only: JSON parse and round trip, unique IDs, dependency resolution, recount, diff limited to the allowed paths, hash recomputation.

## Remaining
`BIOLOGY-ALIAS-APPROVAL-T2` is still an owner action. The scheme rows are for BIO-WK-T2-W01..W10; the revision row is for BIO-MARK-T2-REVEXAM. No subject or class completion is claimed.
