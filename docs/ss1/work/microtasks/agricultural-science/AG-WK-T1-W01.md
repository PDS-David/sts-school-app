# AG-WK-T1-W01 — Agricultural Science, 1st Term, Week 1 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, compiler, database or device checks were run.

## Inputs
- Base: origin/master `83fb6f802f27d8a50b25deb23eabdcb1273470cf` (6 November 2026), fresh clone, working tree clean at start. `AGENTS.md` is absent.
- Prerequisites AG-INV-T1 and AG-SRC-T1 are IMPLEMENTED_TESTING_DEFERRED; the inventory, block locators and locator rule were reused, not re-derived.
- Source: standalone `1ST_TERM_S1_AGRICULTURAL_SCIENCE.docx`, 1076843 bytes, SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`, hashed before parsing; equals the queue's member hash. The composite archive was not supplied, so its hash was not checked. Nothing from the document is committed.

## Locator rule
As in AG-INV-T1: block = direct child of `w:body` in `word/document.xml`, 0-based; block text = concatenation of its `w:t` runs, UTF-8, no normalisation; range hash = SHA-256 of the block texts first..last inclusive joined with `\n`. Re-verified this run: 933 blocks; label block 45 `5eb6b6b00efdf9aae73f1cd5aa450709df1388889b447b0946caafccf24d0182`; blocks 45-142 `2c35bf392e022db022285268ace50e651d3ba15cff8c9a462194bb41bca4ac00`. Both equal the queue.

## Generic parsed row (reproduced, not importer-run)
The original was read with mammoth 1.12.2 (the lockfile version, installed alone in a private scratch directory) and the importer's `WEEK_MARKER`/`parseTopics` expression copied verbatim into a scratch script. It yields ten rows, WEEK 1 to WEEK 10. The WEEKEND ASSIGNMENT lines and the scheme header `WEEK  TOPIC` do not start a row, and block 143 (`WEEK 2DATE…`) does, so the hazards left unverified in AG-INV-T1 do not split Week 1 under this parse. Week 1's row runs from block 45 to block 140 (the two trailing empty blocks are trimmed) and includes the weekend MCQ and theory. Body SHA-256 `eb23c6d757163ec4e7bfce9f79ede198e00e4437be3317ac9781b3e9dec6c2b9`; original lesson id `SS1-SRC-7aa642b0085b:BODY:eb23c6d757163ec4e7bfce9f79ede198e00e4437be3317ac9781b3e9dec6c2b9`. The id is to be confirmed against `identified_rows` of the first reviewed plan; open item `AGRICULTURAL-SCIENCE-T1-W01-COVERAGE` says so.

## Objectives
| Scheme entry 1 content item | Locator | Status |
|---|---|---|
| Meaning of Agriculture | scheme block 12; content block 49; blocks 53-59 | SUPPORTED (`COV-AG-T1-W01-MEANING`) |
| Branches of Agriculture | content block 50; blocks 65-90 (eleven branches) | SUPPORTED (`COV-AG-T1-W01-BRANCHES`) |
| Importance of Agriculture | content block 51; blocks 97-107 (ten importances) | SUPPORTED (`COV-AG-T1-W01-IMPORTANCE`) |
| Definitions of agronomy, crop pathology, entomology | block 77; asked at 93, 122, 129-132 | UNRESOLVED (`COV-AG-T1-W01-CROP-SCIENCE-ASPECTS`) |
| Answers and marking for Week 1 questions | blocks 60-63, 91-95, 110-113, 115-122, 126-140 | UNRESOLVED (`COV-AG-T1-W01-ASSESSMENT-KEYS`) |

The scheme (blocks 12-23) holds one Week 1 line, block 12; the last two scheme lines (REVISION, EXAMINATION) have no body and belong to AG-MARK-T1-REVISION and AG-MARK-T1-EXAM.

## Assessment scope (blocks 45-142)
| Item group | Blocks | Disposition |
|---|---|---|
| Evaluation (meaning) | 60-63 | Answerable from 54 and 57-58 |
| Evaluation Q1 (define agronomy, crop pathology, entomology) | 92-93 | **Not taught anywhere**: block 77 only names them |
| Evaluation Q2 (three functions of veterinary medicine and extension) | 94 | Answerable from 69-71 and 82-83 |
| Evaluation Q3 (agro-based industries) | 95 | Parenthesis in block 103; fuller in Week 6 block 482 |
| Evaluation (importance) | 110-113 | Q1 (111) and Q3 (113) answerable from 98-107 and 103; Q2 (112) needs five examples, block 103 names four industries, fuller list in Week 6 block 486 |
| General Evaluation | 115-122 | Q1 (116) from 54; Q2 (117) from 65-90; Q3 (118) Week 6 teaching; Q4 (119) from 103; Q5 (120) from 98-107; Q6 (121-122) repeats the undefined crop-science terms |
| Reading | 123-125 | Correct chapter (introduction); page numbers not checked against the books |
| Weekend MCQ | 126-136 | Q1 from 57-58; Q2 and Q3 (129-132) test the undefined terms; Q4 (133) asks for a ranking no block states; Q5 (135) needs soap and paper from Week 6 block 486 |
| Theory | 137-140 | Theory 1 from 54 and 98-107; Theory 2 from 65-90 |

Blocks 117 and 140 ask for eight and ten branches while eleven are taught. That is asking for fewer than are taught, not a scope defect; the query left open in AG-INV-T1 is closed. No answers, marking or key appear anywhere in the document.

## Observed defects (retained uncorrected)
1. Block 58 `Culture` versus block 127 `Cultura`; the Latin noun is cultura.
2. Blocks 93 and 122 print `Enthomology`; block 129 prints `Entomology`.
3. Run-together words at block 59 (`withanimal`), block 66 (`Agricultureinclude`), block 69 (`providesa`), block 82 (`anddissemination`), block 99 (`providesfibre`) and block 107 (`FOF`).
4. Block 107 attributes game reserves and horses for racing and polo to agriculture, a loose claim.
5. Block 103 defines agro-based industries, block 105 uses agro-allied for input suppliers, and Week 6 block 482 treats the two terms as one.
6. Blocks 131-132 give pathology as the study of diseases of crops and animals, while block 77 lists crop pathology as an aspect of crop production.
7. Evaluation questions at blocks 95 and 112 come before the teaching they rest on (blocks 103 and 105).

## Cross-week placements
Agro-based and agro-allied industries (blocks 95, 112, 118, 135) are taught in Week 6 (blocks 481-486; table at 486). They are recorded as a dependency for AG-WK-T1-W06, not re-labelled as Week 1 objectives. No doses, rates, mixing or protective-equipment text occurs in blocks 45-142; agro-chemicals appear only as items at block 105.

## Appended tasks
- `AG-LES-T1-W01-CROP-ASPECTS` — LESSON, PENDING; depends on AG-SRC-T1 and AG-WK-T1-W01.
- `AG-LES-T1-W01-KEYED-PRACTICE` — LESSON, PENDING; depends on AG-SRC-T1, AG-WK-T1-W01 and AG-LES-T1-W01-CROP-ASPECTS.
- No lesson text, definition, answer key or correction is authored here.

## Edits
- `agricultural-science.json`: five coverage rows appended (three SUPPORTED, two UNRESOLVED); two blocking open items appended (`AGRICULTURAL-SCIENCE-T1-W01-COVERAGE` CONTENT, `AGRICULTURAL-SCIENCE-T1-W01-FACT-CHECKS` FACT). Sources, source rules, lessons, delivery corrections and assets untouched; `package_status` remains PENDING.
- `QUEUE.json`: AG-WK-T1-W01 set to IMPLEMENTED_TESTING_DEFERRED with its implementation reference extended; two items appended; counts and status_counts recomputed (43 items: 7 implemented, 34 pending, 2 blocked); `next_runnable` recomputed from satisfied dependencies excluding TEST, which removed AG-WK-T1-W01 and AG-TEST-PACKAGE and added AG-LES-T1-W01-CROP-ASPECTS; one note appended. No existing ID otherwise changed.
- This file.

## Checks run (authoring only)
Source member SHA-256 and byte count; 933 blocks parsed; Week 1 label and range hashes equal the queue; block and range hashes computed for every cited locator; term-wide string searches (agronom, entomolog/enthomolog, patholog, agro-allied, agro-based, cultura, answer/marking/key); ten-row parse reproduced with mammoth 1.12.2; JSON parse and byte-exact round trip for both files; strict key sets against the package schema; unique coverage, open-item and queue IDs; every coverage lesson id equals the reproduced id; every PARTIAL/UNRESOLVED row named by a blocking open item; every new dependency resolves; every `next_runnable` entry PENDING with implemented dependencies. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 1 has two missing-teaching gaps and no deliverable lesson beyond the generic parsed row. Next eligible Agricultural Science items include AG-LES-T1-W01-CROP-ASPECTS, AG-INV-T3, AG-PRE-T1 and the other AG-WK items. This does not claim the week, subject or class complete.
