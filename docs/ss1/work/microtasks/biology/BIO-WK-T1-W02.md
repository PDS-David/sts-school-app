# BIO-WK-T1-W02 — Biology, 1st Term, Week 2 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, compiler, database or device checks were run. Week 2 is **not** a complete, certified or delivered week.

## Inputs
- Base: origin/master `698addbf4796c2faf6718a6b4391b8ecc9858ccc` (6 November 2026), fresh clone, working tree clean at start. `AGENTS.md` is absent.
- Prerequisites BIO-INV-T1 and BIO-SRC-T1 are IMPLEMENTED_TESTING_DEFERRED; the inventory, locators and locator rule were reused.
- Source: standalone `BIOLOGY_1_alfa_term_-_Copy.docx`, 957703 bytes, SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`, hashed before parsing; equals the queue's member hash. The composite archive was not supplied, so its hash was not checked. Source id `SS1-SRC-422e0e6ddde9`. Nothing from the document is committed.

## Locator rule
As in BIO-INV-T1: block = direct child of `w:body`, 0-based; block text = concatenation of `w:t` runs, UTF-8, no normalisation, text-box text counted in the block holding the box; range hash = SHA-256 of block texts first..last joined with `\n`. Re-verified: 1,106 blocks; label block 42 `88b3326818ebf3577b66bea2ea4fa2f670e9335dbeaf07bbe3729906fa939df6`; blocks 42-132 `3f8bb1d8f9370ac595b47404008b1aab7e570100bb966d0d660e6683ec7cb5d9`; scheme block 3 `046f1ca8950cb6ab6a05ba314bcc5a5b61ffd35f81caa7eef9f8529e2d8258be`. All equal the queue.

## Generic parsed rows (reproduced, not importer-run)
The original was read with mammoth 1.12.2 (lockfile version, installed alone in a private scratch directory) and the importer's `WEEK_MARKER`/`parseTopics` expression copied verbatim into a scratch script. It yields **28 rows**, not ten:
- ten rows hold only the scheme lines (blocks 2-11, each begins `Week <n>`);
- ten hold the week bodies;
- eight come from second labels at the assignments, including `WEEK ONE AND TWO` (block 123), which matches the importer's week marker because the number words are accepted.

So Week 2's row is blocks 42-122 and ends with the stranded `ASSIGNMENT` heading; the combined assignment (blocks 123-132) is a separate row. Week 2 body SHA-256 `6f2bd20850d12e8d95dde39942900335096dd5ff5510b2bb3e90023e2ef2d982`, id `SS1-SRC-422e0e6ddde9:BODY:6f2bd20850d12e8d95dde39942900335096dd5ff5510b2bb3e90023e2ef2d982`; combined assignment row `…:BODY:f427e44113cec4bc2da3efb128aaf1efc8f376a13515e339150b9b9df3ea49b8`. This settles the split-hazard question BIO-INV-T1 left unverified for these labels; the two ids are to be confirmed against `identified_rows` of the first reviewed plan (open item `BIOLOGY-T1-W02-PARSE-ROWS`). No source rule was written. How the ten scheme-line rows are classified belongs to BIO-PRE-T1. Earlier Biology records (W01, W06) cite no ids, so none is contradicted.

## Objectives
| Scheme / body item | Locator | Status |
|---|---|---|
| Scheme entry 2, living and non-living things | scheme block 3; blocks 45-67 | SUPPORTED (`COV-BIO-T1-W02-SCHEME-2`) |
| Plant/animal differences (not named in the scheme) | blocks 68-87 | SUPPORTED (`COV-BIO-T1-W02-PLANT-ANIMAL`) |
| Microscope parts and diagram (not named in the scheme) | blocks 89-121; image at 109 | PARTIAL (`COV-BIO-T1-W02-MICROSCOPE`) |
| Combined Weeks 1-2 assignment | blocks 122-132 | UNRESOLVED (`COV-BIO-T1-W02-ASSESSMENT`) |

Definitions at 45-46, ten characteristics at 49-67 (movement, nutrition, respiration, excretion, growth, irritability, reproduction, adaptation, competition, death), ten plant/animal pairs at 71-87, ten microscope parts at 92-106 with objectives x4, x10 and x40. The scheme names no microscope for any week, so it is unlisted teaching in Week 2, not a mis-scoped objective.

## Assessment scope (blocks 42-132)
| Item | Blocks | Disposition |
|---|---|---|
| Q1 which group embraces the rest | 124-125 | Ranks taught only in Week 3 (134-143); question precedes its teaching |
| Q2 characteristic not possessed by most plants | 126-127 | Rests on an unstated fact: block 49 teaches movement for all living things; only block 73 mentions slow plant response |
| Q3 carbohydrate stored in animal cells | 128-129 | Answerable from 75 |
| Q4 all living organisms … | 130 | Answerable from 57, but option (c) move is also supported by block 49; stem incomplete |
| Essay: five differences between plant and animal | 131-132 | Answerable from 71-87 |

No experiments, practical work, quantities or safety text occur in blocks 42-132. No answer key exists anywhere in the document. Q1-Q4 are the combined Weeks 1-2 block already owned by `BIO-LES-T1-W01-ASSESSMENT`, which depended on this task; its own row `COV-BIO-T1-W01-ASSESSMENT` is unchanged, so the block is dispositioned once and no duplicate task is created.

## Observed defects (retained uncorrected)
1. Block 55 `halophytic` for autotrophic nutrition (the usual term is holophytic).
2. Block 56 `strictly used by animals` for heterotrophic nutrition, while block 75 mentions fungi under plants.
3. Block 71 `definite and interacting` for animal growth.
4. Block 90 `smaller that 0.001mm` as the size a microscope views.
5. Block 49 versus Q2 and Q4 on movement (above).
6. Run-ons and slips: block 82 `rigid cellulose all wall`, block 85 `autotrophic ally`, block 86 `processes` and `excretorysystem`, block 130 incomplete stem.
7. Non-living things are only defined (block 46): no examples, no contrast beyond the definition.
8. Block 109 (the image) and twelve empty blocks (110-121) follow the diagram heading; the figure is an image, not text.

## Appended tasks
- `BIO-FACT-T1-W02-WORDING` — FACTUAL_DEPENDENCY, BLOCKED; depends on BIO-SRC-T1 and BIO-WK-T1-W02. Needs one recorded expert decision per numbered wording item.
- Existing `BIO-VIS-T1-MICROSCOPE`, `BIO-VIS-T1-PLANT-ANIMAL-HDR` and `BIO-LES-T1-W01-ASSESSMENT` cover the figure, the header shapes and the keyed assessment; none is closed or duplicated here. In the parsed body the plant/animal columns stay on one tab-separated line, which is evidence for BIO-VIS-T1-PLANT-ANIMAL-HDR, not its decision.
- No lesson text, key, correction or asset is authored here.

## Edits
- `biology.json`: four coverage rows appended (two SUPPORTED, one PARTIAL, one UNRESOLVED); three blocking open items appended (`BIOLOGY-T1-W02-COVERAGE` CONTENT, `BIOLOGY-T1-W02-SOURCE-DEFECTS` FACT, `BIOLOGY-T1-W02-PARSE-ROWS` VERIFICATION). Sources, rules, lessons, corrections and assets untouched; `package_status` remains PENDING.
- `QUEUE.json`: BIO-WK-T1-W02 set to IMPLEMENTED_TESTING_DEFERRED with its implementation reference extended; one item appended; counts recomputed (64 items: 8 implemented, 52 pending, 4 blocked); `next_runnable` recomputed from satisfied dependencies excluding TEST, which removes BIO-WK-T1-W02 and BIO-TEST-PACKAGE; one note appended. No existing ID otherwise changed.
- This file.

## Checks run (authoring only)
Source SHA-256 and byte count; 1,106 blocks parsed; Week 2 label, range and scheme hashes equal the queue; block and range hashes for every cited locator; search of blocks 42-132 for experiment, quantity and safety words; 28-row parse reproduced with mammoth 1.12.2; JSON parse and byte-exact round trip for both files; strict key sets against the package schema; unique coverage, open-item and queue IDs; every coverage lesson id equals a reproduced id; every PARTIAL/UNRESOLVED row named by a blocking open item; dependencies resolve; every `next_runnable` entry PENDING with implemented dependencies. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 2 has a taught body but an undelivered microscope figure, an unkeyed assignment whose questions need expert decisions, and unconfirmed row ids. This does not claim the week, subject or class complete.
