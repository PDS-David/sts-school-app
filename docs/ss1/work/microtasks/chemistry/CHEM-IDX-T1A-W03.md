# CHEM-IDX-T1A-W03 — Chemistry, 1st Term WEEK THREE indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `9971e5646c21f20eef898ff8fd88eb71946ca8a3` (claim commit `e250601` on top). `docs/ss1/work/AGENT_PROTOCOL.md` was followed. CHEM-INV-T1A and CHEM-SRC-T1A are `IMPLEMENTED_TESTING_DEFERRED`. CHEM-IDX-T1A-W03 was `PENDING`; `git log origin/master --grep=CHEM-IDX-T1A-W03` returned nothing; no `origin/agent/*` branch had touched chemistry in the last three hours.
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — **verified**. Member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, 2,187,976 bytes, SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — **verified**. Extracted only that member, to private scratch outside the repository. Nothing from the source is committed.
- Text read with `mammoth` 1.12.2 `extractRawText`: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` — equals the task.
- Locator re-check: lines 416-607 joined with `\n` hash to `7dac5adad12109abcc1f79c7f76006f9f6195bcc548ce4bf4c72e4ea1e57ebc2`, equal to the locator. `WEEK THREE` is line 417; `WEEK FOUR` is line 609.
- DOCX XML scan of the body children from `WEEK THREE` (child 208) to `WEEK FOUR` (child 304): 11 `a:blip`, all 70-byte 1x1 PNG spacers (decoded); 22 `w:drawing`; no `w:txbxContent`, `w:pict`, `w:tbl`, `m:oMath`, `w:object`, hyperlink, field or content control; all 178 `w:vertAlign` runs are `baseline`; 31 paragraphs carry automatic numbering or bullets (CONTENT bullets 3, evaluation questions, 4 physical and 6 chemical examples, 4 revision questions, 1 reading, 5 weekend, 2 theory).
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `extractRawText` text split on `\n`; a section runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`. The item's own ranges include trailing blank lines (for example 439-445); the ranges below stop at the last non-blank line. No line in 416-607 is whitespace-only.

## Section index (lines 416-607)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK THREE label | 417-417 | `9a970d2a5cd0bee91213221e6275188baf1dd13c1f90530302e9dbc234cf3b51` | marker line |
| TOPIC: NATURE OF MATTER | 419-419 | `460582d5e27250d70bd239159e0bddc8f7c9eec65284c1356ae3ed04c7056809` | topic line |
| CONTENT | 421-427 | `5474e5709b0d1e24608507943386b16625b369093a979ee9aabc7dbebdb43d40` | three bullets: `NATURE OF MATTER` (423), `COMPARISON BETWEEN SOLID, LIQUID AND GAS` (425), `TYPES OF CHANGE` (427, singular; the later heading at 497 is `TYPES OF CHANGES`) |
| NATURE OF MATTER | 431-435 | `a7bc6bee22293ae3dfb963c4424237817b25b932d612765257e03a749d2a6020` | heading; definition and three states (433); basis of the states (435) |
| SOLID STATE | 439-443 | `c9dd8238929cae413e16d543645ca55012ba11ccd4af0e4bebb570400de38c74` | heading; 441 and 443 |
| LIQUID STATE | 447-449 | `d4f9efa8e4d1bbb898e258bb16283f20861f53de4cbccb67dfb56ee6b25bfe8c` | heading; one paragraph (449) |
| GASEOUS STATE | 453-455 | `586a1f7961d3634bb08c7c634c906157c8b80b9275b13610181096abcc785745` | heading; one paragraph (455) |
| EVALUATION 1 | 459-463 | `89b138364694717c3d5a19c2beee3dd20b03ebdc04ff1697f519d44b309c99e6` | 2 questions (461, 463) |
| COMPARISON BETWEEN SOLID, LIQUID AND GAS | 467-485 | `330e564a2a9bef8973728d1b9fdcd557b7917c8985a494b23f6f6fd96d11cebc` | heading; tab-separated header row (469); six typed points (471-485, point 6 wraps over 481-485); text, not a Word table |
| EVALUATION 2 | 489-493 | `e9129153f27d916ec954bbe0ce50aac739f931b08f19371dfd69e62bb2134c62` | 2 questions (491, 493); line 489 has trailing whitespace |
| TYPES OF CHANGES | 497-499 | `78d669471f642b982decc07296ed43b6ee2f411d7e1f60a461c150106e3761f2` | heading with trailing tab (497); one paragraph (499) |
| PHYSICAL CHANGE | 503-513 | `4d8e251af4d78c3ecc650f1938817ef7ecca8e8ceb72b45dc00fd39ad3af3118` | heading; definition (505); four examples (507-513) |
| EVALUATION 3 | 517-521 | `e0fd01b2cd3e1f325088ff50f7295f61932109ef342e3dca93b81ea92dd54c29` | 2 questions (519, 521) |
| CHEMICAL CHANGE | 525-541 | `67737e5f7247117a9ea0e78f2c6301124fd4b490b4f9755bef4de30fd1339f59` | heading; definition (527); lead-in (529); six examples (531-541) |
| COMPARISON BETWEEN PHYSICAL AND CHEMICAL CHANGES | 545-561 | `7095733ce51553f9d321edc64b60465049ce082948cf33f70c80f9fc63db008e` | heading; tab-separated header row (547); four typed points (549-561, points 2-4 wrap); text, not a Word table; trailing whitespace on 551, 555, 559 |
| GENERAL EVALUATION/REVISION | 565-573 | `f03c5ad6bec4ccf1cf87ab557c3c031e0068f088e5d238b859fa21ede3ed9910` | 4 questions (567, 569, 571, 573) |
| READING ASSIGNMENT | 577-579 | `bf0b035d94c3bd789914e46a4c89265041e00aaddd41e9ea3c34f2ac4913cd8a` | one textbook reference with pages (579); not supplied, not copied |
| WEEKEND ASSIGNMENT | 581-595 | `4e19d391303df632152b225b141de426ddb162bff01b48f5bab2e9bda2616417` | 5 objective questions with options (583, 585, 587-589, 591, 593-595); continuation lines 589 and 595 begin with spaces; no answer key; plain paragraphs, no table |
| THEORY | 599-603 | `7a234c9a7dd3f777bfb1b75e2e831de59cc11f1b8abb3627bc20d24a1bd05ad0` | 2 questions (601, 603) |

Every non-blank line from 417 to 603 belongs to a section above (checked by script); lines 604-608 are blank. Nothing is discarded.

## Exercises (indexed, not answered)
- **EVALUATION 1 (459-463):** 461 `What is matter?`; 463 `List and explain the three states of matter.`
- **EVALUATION 2 (489-493):** 491 `Define matter`; 493 `Compare the three states of matter in terms of (a) density (b) compressibility`.
- **EVALUATION 3 (517-521):** 519 `What is a physical change?`; 521 `Give two examples of a physical change.`
- **GENERAL EVALUATION/REVISION (565-573):** 567 `What is a chemical change?`; 569 `Give two examples of a chemical change.`; 571 `State three differences between physical and chemical changes.`; 573 `State the function of the following laboratory apparatuses: a) Fume cupboard b) Burette (c) Bunsen burner`.
- **READING ASSIGNMENT (577-579):** 579 `New School Chemistry for SSS by O.Y. Ababio.Pg 8 -9`; not supplied and not copied.
- **WEEKEND ASSIGNMENT (581-595):** five objective questions (583 which change is chemical; 585 which substance occupies a wider space; 587-589 a solid changing directly to gas; 591 which change produces a new substance; 593-595 which has a fixed shape and volume). None has an answer key or mark.
- **THEORY (599-603):** 601 `Give two differences between physical and chemical changes.`; 603 `Give three processes, which involve a physical change`.
- No answer, marking guide or mark allocation exists anywhere in the week. None is authored here.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Matter and its three states (431-455; questions 461, 463, 491, 585).
2. Comparison of solid, liquid and gas (467-485; questions 493, 585, 593).
3. Types of change and physical change (497-513; questions 519, 521, 603, 583, 587).
4. Chemical change (525-541; questions 567, 569, 583, 591).
5. Comparison of physical and chemical changes (545-561; questions 571, 601).
6. Function of the Bunsen burner (question 573(c)) — **no teaching text in either week**.

## Scheme mapping and coverage
- Scheme row 3 (line 51, `NATURE OF MATTER`, SHA-256 `d4cf8d8b4456294e61bf6f9ac21405f7855f92c767710e4e595b11cc25bba12c`) equals the week's topic line 419 after the `TOPIC: ` prefix and maps to this week by title and order. The scheme has no sub-items.
- Package change: **seven** coverage entries in `chemistry.json`, none with lesson ids: `COV-CHEM-T1A-W03-SCHEME-3`, `-STATES`, `-COMPARISON-STATES`, `-PHYSICAL-CHANGE`, `-CHEMICAL-CHANGE`, `-COMPARISON-CHANGES` (PARTIAL) and `-REVISION-APPARATUS` (UNRESOLVED). All still block delivery. The package stays `PENDING`; no coverage beyond indexing is claimed.
- Open item for the UNRESOLVED entry: `CHEM-LES-T1A-W03-BUNSEN-BURNER` (new). Statement-level verification stays with `CHEM-FACT-T1A-W03-STATEMENTS` (new).

## Findings (source wording retained; nothing corrected)
- **Correction to the item objective and CHEM-INV-T1A.md line 73.** Both say the Week Three weekend assignment is wrapped in a 1x1 Word table at body child 581. In the DOCX XML the Week Three weekend paragraphs are plain paragraphs (body children 290-291 onward) and the week holds no `w:tbl`. Body child 581 is a 1x1 table inside WEEK SIX (mammoth line 1163, text beginning `Salt is produced in the San Francisco area`), and body child 630 is another in WEEK SIX (mammoth line 1261). The mammoth line number 581 was mistaken for a body child number. Not changed here (CHEM-INV-T1A.md is outside this item's write paths); reported in the handover. Items for Week Six should rely on the XML, not on this inventory line.
- Both comparisons (467-485, 545-561) are tab-separated paragraph text with typed point numbers, not Word tables; they are preserved as text in order.
- The gas column of the states comparison reads `No volume` (477) while the gas paragraph reads `no definite shape and volume` (455); the liquid column reads `Shapeless` (475) while the liquid paragraph reads `not definite shape` (449). Recorded as written; one bounded follow-up was appended: `CHEM-FACT-T1A-W03-STATEMENTS`.
- `TYPES OF CHANGE` (427, CONTENT) against `TYPES OF CHANGES` (497, heading); `carbon (iv) oxide` (585); `Ababio.Pg 8 -9` (579). Recorded as written.
- Revision question 573 asks for the function of a fume cupboard, a burette and a Bunsen burner. Week Two has entries for the first two (293, 305) but none for the Bunsen burner (named only at Week Two line 269). One bounded follow-up was appended: `CHEM-LES-T1A-W03-BUNSEN-BURNER`.
- Weekend continuation lines 589 and 595 begin with spaces; trailing whitespace on 489, 497 (a tab), 551, 555, 559, 587 and 593; double spaces on 469, 559 and 595. Preserved.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: `coverage` goes from fourteen to twenty-one entries. No other field changed.
- `QUEUE.json`: CHEM-IDX-T1A-W03 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CHEM-LES-T1A-W03-BUNSEN-BURNER` (LESSON) and `CHEM-FACT-T1A-W03-STATEMENTS` (FACTUAL_DEPENDENCY) inserted after `CHEM-FACT-T1A-W02-STATEMENTS` (PENDING, dependencies as listed in the items); `counts`, `status_counts` (11 implemented / 99 pending / 1 blocked; 111 items) and `next_runnable` recomputed from the items; one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse with byte-stable re-serialisation; SHA-256 of the archive, member, whole text, week range, scheme row and every section; script check that every non-blank line 417-603 is in a section; DOCX XML scan for drawings, text boxes, tables, equations, scripts, spacer dimensions and list numbering; unique ID and reference checks; kind and status counts and `next_runnable` recomputed from items; diff inspection.

## Remaining
Weeks Four to Ten, the opening block and the revision/examination markers still need their own indexing; the Bunsen burner lesson and the Week Three statement verification are open. Alias approval items stay owner actions. Not executed here. This does not claim the subject or class complete.
