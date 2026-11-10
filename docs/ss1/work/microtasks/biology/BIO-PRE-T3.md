# BIO-PRE-T3 — Biology, 3rd Term preamble and scheme (blocks 0-24)

Status: **IMPLEMENTED_TESTING_DEFERRED** (record only; not approved, not verified). Nothing was run: no importer, compiler, zod parse, test, typecheck, database or device. No package, rule, coverage, lesson, correction or asset was written.

## Inputs
- Base: origin/master `efb270d` (fetched 2026-11-08). Agent A2. Claim held on `biology`.
- Archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; member `SSS 1/3rd Term SS1_/3RD TERM S1 BIOLOGY.docx` SHA-256 `1e9a758cdd07bd13511059b6d8ef6db0f618f99b14cdf11d20d33c183cb1bca4`: both verified equal to the queue. Native .docx, no conversion.
- Locator rule as BIO-INV-T3: `word/document.xml`, block = direct child of `w:body`, 0-based (803 blocks; block 802 is `w:sectPr`), text = concatenation of `w:t` runs, UTF-8, no normalisation, range hash = block texts joined with `\n`, empty blocks included.
- Reproduced: range 0-24 = `2a9906ba5a26582ec0545cd973ba0d2179e209b6abb61a4759099223a122b874` (equals the queue value); block 25 `WEEK ONE …` = `95035b774fa79cba584a3293bfc6dcb0df22dc8e14bf9b934f8172bff079eb35`.

## Block map
Empty blocks (3, 13, 23, 24) all hash to `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

| Block | Text (verbatim) | Block SHA-256 | Classification | Handled by |
| --- | --- | --- | --- | --- |
| 0 | `THIRD TERM E-LEARNING NOTE` | `a07317fdf912a48479c8172cb13215f9f4925998892205ee9fee355087947b73` | generic template title = registered `header_text` | `biology.json` source `SS1-SRC-78059230037f`; owner item `BIOLOGY-ALIAS-APPROVAL-T3` |
| 1 | `SUBJECT:  BIOLOGY     CLASS:  S. S. ONE` (two spaces after each colon, five before `CLASS`) | `8a682c23e83976b908de3222bd2a1347effbd9f8a195974145d1a9f403140342` | subject and class line; confirms subject | the source's header evidence |
| 2 | `SCHEME OF WORK` | `8104f5ba0f84b6d0bd6c7197460d87d05b526578cebae1ae784ad29a8b48f15e` | scheme heading | none |
| 3 | blank | empty hash | separator | none |
| 4 | `WEEKS                  TOPIC` (eighteen spaces) | `45ef2ba526ceb5a5b66ff9c668ff2f301f5d9fcd9ebb67dfdf918c02bf790880` | scheme column header; begins with `WEEKS` | none (parser hazard below) |
| 5 | `Micro-Organisms Around Us and the Concept of Culturing.` | `1e0d87c4e8c5008ccb562625a0e0971e0b545ec3d92eae1046d864aee2d163dc` | scheme row 1 | BIO-WK-T3-W01 |
| 6 | `Micro-Organisms in Action.` | `c443acc55e2b88f11fd2619c3a3d47b786a92248a738d2821963d87cc1161b8f` | scheme row 2 | BIO-WK-T3-W02 |
| 7 | `Sexually Transmitted Infections (STI)` | `10e01aa343faa11e44b0c6c20aa23bc7364bdd246bb459e2d0ebb0aaa9132281` | scheme row 3 | BIO-WK-T3-W03 |
| 8 | `Towards BetterHealth` | `7fc6fef95890e7690f698c340f8adaf06160a7c7f1ae6f13582f26b5ce2e5853` | scheme row 4 | BIO-WK-T3-W04 |
| 9 | `Relevance of Biology to Agriculture` | `0afb026404878ff02b84d3567d7fefafefba034270dd9e1c396dae30055cd8fe` | scheme row 5 | BIO-WK-T3-W05 |
| 10 | `Pests and Diseases of Plants.` | `6e3677235c993e5ac6b32df4092c8db921878a36aeeed6a0daed11e8dea8ff80` | scheme row 6 | BIO-WK-T3-W06-W07 |
| 11 | `Pests and Diseases of Animals.` | `03577da758bfcb0f1fed69337fb45e9d8fc722c82ab41fdf6d23669a51e4f5f3` | scheme row 7 | BIO-WK-T3-W06-W07 |
| 12 | `Food Storage and Production.` | `565e008445ee4fbbdce2477c73a037e23cbc46f18504e6ce5956a6537ff9edef` | scheme row 8 | BIO-WK-T3-W08 |
| 13 | blank | empty hash | separator | none |
| 14 | `REFERENCES` | `704d8a18e343aa05fdc15cdefa27e6ac40335fe3486cfe27252249244e02956e` | references heading | none; citations only |
| 15 | `Modern Biology for Senior Secondary Schools by S.T. Ramlingam` | `eb2c37ce3659bbf9452ac694b738cad64a62441f1e66d34f70752fa5e614dac0` | reference 1 | none |
| 16 | `Essential Biology by M.C Michael ` (trailing space) | `09642b6eebc863bc3cfc67e55cc0ecda1236d2fbadcf07655b5e0d460c3a5bc2` | reference 2 | none |
| 17 | `New Biology by H. Stone and Cozen` | `839d2bfc08cdb584689ab5434af9d340b95f3b860ae12379db46c21627d7b20e` | reference 3 | none |
| 18 | `SSCE, past questions and answers` | `eec5ca8d2e82a17b96abf0213ca278025b5c42f6762e10685e9444b393f30e08` | reference 4 | none |
| 19 | `New System Biology by Lam and Kwan ` (trailing space) | `af3d59d0ecc26e4834cb5b2de2d711c4516ad3fe4d3387a72bca2e2c5406ee09` | reference 5 | none |
| 20 | `College Biology by IdodoUmeh` | `e01f48c981bab055456f40aec0f1f44ac4fe8a03630cf925713348eea9e69470` | reference 6 | none |
| 21 | `UTME, SSCE and CAMBRIDGE past questions and answers ` (trailing space) | `387bfb5d2bfe87480c8fc47aa8e84faed3715b155d80a3cbe3c68767c6fb0a61` | reference 7 | none |
| 22 | `Biology practical text` | `23c96ff3dde1a895d9d9dd7c63dd9e81fd3da5956f39e64daa9ee9161193e8af` | reference 8 | none |
| 23, 24 | blank | empty hash | separators before `WEEK ONE` (block 25) | none |

Sub-range hashes: blocks 0-2 `daf3bce80a7b5ca2b3529aee7ea0b1c73ea686bca1122c46c54f9794a3083749`; scheme rows 5-12 `a25ab08ab88e65e0e2310d28486f03ca84ff19d2387380b03df64f9bc6a02d06`; references 14-22 (heading plus eight lines) `ff4cf55a3b7a2541806f7cb6be74ef9f3cbb1313bdf92bdeac83412a9a3c3073`.

Every block 0-24 is accounted for. No drawing, shape, table, hyperlink, text box, equation or OLE object lies in the range, and no tracked changes, comments, footnotes or endnotes exist in the document.

## Week numbers and pairing
- Scheme rows 5-12 are one auto-numbered list (`numId` 26, decimal `%1.`, start 1, no override), so they display as 1-8; the extracted text carries no numbers. References 15-22 are a separate list (`numId` 76) at level 1, a bullet, so they are unnumbered.
- Rows 1-5 and 8 pair with the section topic lines in the body: block 27 `MICRO-ORGANISMS AROUND US`, 112 `MICRO-ORGANISMS IN ACTION`, 177 `SEXUALLY TRANSMITTED INFECTIONS`, 218 `TOWARDS BETTER HEALTH`, 328 `RELEVANCE OF BIOLOGY TO AGRICULTURE`, 672 `               FOOD PRODUCTION AND STORAGE` (leading spaces). Rows 6 and 7 (blocks 10-11) share the one topic line at block 475, `PEST AND DISEASES OF CROPS AND LIVESTOCK`.
- Against the section labels (BIO-INV-T3) the list numbers disagree twice: row 3 (STI) sits in the section labelled `WEEK SEVEN` (block 175) and row 8 (food production and storage) in the section labelled `WEEK THREE` (block 669). The label `WEEK SIX& SEVEN` (block 474) does agree with rows 6 and 7. Recorded as written; no label is corrected here.
- The list numbering comes from the document's own `numbering.xml`; whether the importer's extractor shows it was not tested.

## Findings (not adjudicated)
- Scheme wording differs from the topic lines: row 1 adds `and the Concept of Culturing` and rows 6-7 split what the body topic line `PEST AND DISEASES OF CROPS AND LIVESTOCK` joins; the body splits crops and livestock again at block 591 (`PestsandParasitesofLivestockandtheirEffects`).
- Source typography kept as written: `BetterHealth` (block 8, no space), terminal full stops on rows 1, 2, 6, 7, 8 but not on 3, 4, 5, and `IdodoUmeh` (block 20, no space; the 2nd Term list has `Idodo Umeh`). The 3rd Term list has no trailing space on block 22, unlike the 2nd Term.
- The scheme has no revision or examination row, and no `Revision and Examination` text exists in the preamble.
- Block 4 `WEEKS … TOPIC` begins with `WEEK`, as do the seven `WEEKEND ASSIGNMENT` lines (BIO-INV-T3); whether the unrun importer splits on them is **unverified**.
- Page furniture, not teaching: `footer1.xml` reads `MR OSHO`; the header part holds only a tutor-letterhead picture with a personal phone number and email address (BIO-VIS-T3-HDR-BRANDING owns that disposition). Neither enters any lesson.
- References are citations, not reuse permission; blocks 18 and 21 are generic past-question collections and block 22 is the practical-text title; none of these works is supplied.
- Block 0 is the same generic template title as the 2nd Term's apart from the term word; the subject is confirmed only by block 1.

## Edits
- `QUEUE.json`: BIO-PRE-T3 -> `IMPLEMENTED_TESTING_DEFERRED`; status_counts, next_runnable and one note updated; no other item changed.
- This file. `biology.json` not touched.
- Authoring checks only: JSON parse and round trip, unique IDs, dependency resolution, recount, diff limited to the allowed paths, hash recomputation.

## Remaining
`BIOLOGY-ALIAS-APPROVAL-T3` is still an owner action. The scheme rows are for BIO-WK-T3-W01..W05, W06-W07 and W08. No subject or class completion is claimed.
