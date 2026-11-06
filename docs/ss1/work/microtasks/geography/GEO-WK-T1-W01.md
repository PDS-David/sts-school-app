# GEO-WK-T1-W01 — Geography, 1st Term, Week 1 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No full tests, type checks, importer, compiler, database or device checks were run.

## Inputs
- Base: origin/master `e20d8388ef708a62171dfceb1287f88da89c6146` (7 November 2026), fresh clone, working tree clean at start. `AGENTS.md` is absent.
- Prerequisites GEO-INV-T1 and GEO-SRC-T1 are IMPLEMENTED_TESTING_DEFERRED on that master; the inventory, locators and block hashes were reused, not re-derived.
- Source: standalone `1ST_TERM_S1_GEOGRAPHY.doc`, 1163776 bytes, SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c`, hashed before conversion; equals the queue's member hash. The composite archive was not supplied, so its hash was not checked. Nothing from the document is committed.

## Locator rule
As in GEO-INV-T1: lines of `getBody()` from word-extractor 1.0.4 (the importer's legacy `.doc` call), 1-based; line hash = SHA-256 of the line text, UTF-8, no newline; range hash = SHA-256 of the lines joined with `\n`. Re-verified this run: 708 lines, whole body `13e8d0c013ef89c6b8965b8cc6d4a5308c5ee450a7df3588d2462db68c86ee3e`; lines 43-89 `52f0cbe7b5b1c8c618b747159993961a1d1c96e2c2f6560a88ac156192e11aa5`. Both equal GEO-INV-T1 and the queue. No control character other than tab occurs inside lines 43-89.

## Generic parsed row (reproduced, not importer-run)
The importer's `WEEK_MARKER` and the week-marker branch of `parseTopics` were copied verbatim from `backend/src/db/ingestTopics.ts` into a private scratch script and run on the extracted text. It yields ten rows, WEEK ONE to WEEK TEN; the scheme header `WEEK      TOPIC` does not start a row. Week 1's row is lines 43-89 (trailing blanks trimmed, 3765 characters), title `INTRODUCTION TO GEOGRAPHY:  MEANING, SCOPE AND VALUE`, and its body SHA-256 equals the inventory block hash. Original lesson id `SS1-SRC-1c1c1bdcecb4:BODY:52f0cbe7b5b1c8c618b747159993961a1d1c96e2c2f6560a88ac156192e11aa5`. The id is to be confirmed against `identified_rows` of the first reviewed plan; open item `GEOGRAPHY-T1-W01-COVERAGE` says so.

## Objectives
Scheme row 1 (line 24): `Introduction to Geography: Meaning, Nature, Scope and Value of Geography.` The Week 1 subtitle (line 44) names meaning, scope and value only.

| Scheme row 1 item | Locator | Status |
|---|---|---|
| Meaning | heading 45; paragraphs 46, 48 | SUPPORTED (`COV-GEO-T1-W01-MEANING`) |
| Nature | scheme line 24 only; word `nature` occurs nowhere else | PARTIAL (`COV-GEO-T1-W01-NATURE`) |
| Scope | heading 49; paragraph 50 | SUPPORTED (`COV-GEO-T1-W01-SCOPE`) |
| Value | heading 57; lead-in 58; seven paragraphs 59-65 | SUPPORTED (`COV-GEO-T1-W01-VALUE`) |
| State-capital recall (not in the scheme row) | lines 75, 88 | UNRESOLVED (`COV-GEO-T1-W01-STATE-CAPITALS`) |
| Reading assignment | lines 77-78 | PARTIAL (`COV-GEO-T1-W01-READING`) |
| Answers and marking for the other questions | lines 52-55, 67-68, 70-74, 80-85, 87, 89 | UNRESOLVED (`COV-GEO-T1-W01-ASSESSMENT-KEYS`) |

## Line disposition (lines 43-89)
| Lines | Content | Disposition |
|---|---|---|
| 43-44 | `WEEK ONE` label, subtitle | anchors for every locator; subtitle omits Nature |
| 45-48 | MEANING OF GEOGRAPHY, two paragraphs | taught; MEANING |
| 49-50 | SCOPE OF GEOGRAPHY, one paragraph | taught; SCOPE |
| 52-55 | EVALUATION QUESTIONS: three questions | 53, 54 answerable from 46; 55 from 50; no key |
| 57-65 | VALUE OF GEOGRAPHY, lead-in and seven values | taught; VALUE |
| 67-68 | EVALUATION QUESTION: values of geography | answerable from 59-65; no key |
| 70-75 | GENERAL EVALUATION: five questions | 71 repeats 53, 72 repeats 55, 73 rewords 68, 74 rewords 54; 75 asks a state capital, taught nowhere |
| 77-78 | READING ASSIGNMENT: Iwena, pages 1-2 | pointer only, unverified |
| 80-85 | WEEKEND ASSIGNMENT: five multiple-choice questions | no key; derivations noted, question 4 by inference |
| 87-89 | THEORY: three capitals; two importance of geography | 88 taught nowhere; 89 from 59-65, any two of seven |

An evaluation or revision heading is not counted as teaching anywhere in this table. Lines 47, 51, 56, 66, 69, 76, 79 and 86 are blank separators. No figure, table, equation, page break or inline picture falls inside lines 43-89 (GEO-INV-T1 places the page breaks at paragraphs 4, 158, 209, 244 and 611, none in this span).

## Observed defects and open points (retained uncorrected)
1. Scheme row names Nature; subtitle and body do not teach it.
2. Questions on state capitals (lines 75 and 88) rest on no teaching anywhere in the 1st Term document; none of the four capitals appears in it.
3. Weekend question 4 (line 84) asks which field geography does not cut across; line 50 gives an open-ended list ending in `etc`, so Music is excluded only by inference.
4. Printed wording: `etc In` (line 48), `ways of  lives` (line 61), `e.t.c.` (lines 63, 64), `Agriculture(c)` (line 81).
5. Reading pages 1-2 not checked; the book was not supplied.
6. No marks are stated for any item and no answer or marking guide exists anywhere in the document.

## Owner question (raised in chat, not blocking the rest of this task)
State capitals at lines 75 and 88: (A) author one small original supplement teaching exactly the four capitals asked (recommended); (B) keep the questions as source assessment but leave them out of keyed and delivered practice; (C) author a fuller state-capitals supplement. Recorded as open item `GEOGRAPHY-T1-W01-STATE-CAPITALS-SCOPE`; no capital is stated as an answer anywhere in this change.

## Appended tasks
- `GEO-LES-T1-W01-NATURE` — LESSON, PENDING.
- `GEO-LES-T1-W01-KEYED-PRACTICE` — LESSON, PENDING.
- `GEO-LES-T1-W01-STATE-CAPITALS` — LESSON, BLOCKED on the owner decision above.
- No lesson text, definition, capital, answer key or correction is authored here.

## Edits
- `geography.json`: seven coverage rows appended (three SUPPORTED, two PARTIAL, two UNRESOLVED); three blocking open items appended (`GEOGRAPHY-T1-W01-COVERAGE` CONTENT, `GEOGRAPHY-T1-W01-STATE-CAPITALS-SCOPE` OWNER_ACTION, `GEOGRAPHY-T1-W01-FACT-CHECKS` FACT). Sources, source rules, lessons, delivery corrections and assets untouched; `package_status` remains PENDING.
- `QUEUE.json`: GEO-WK-T1-W01 set to IMPLEMENTED_TESTING_DEFERRED with its implementation reference extended; three items appended; counts and status_counts recomputed from items (35 items: 6 implemented, 27 pending, 2 blocked); `next_runnable` recomputed from satisfied dependencies, excluding TEST, which also corrects the previous list that omitted tasks whose dependencies were already met; one note appended. No existing ID otherwise changed.
- This file.

## Checks run (authoring only)
Source member SHA-256 and byte count; 708 lines extracted and whole-body hash compared; Week 1 block hash compared with the inventory and the queue; line and range hashes recomputed for every cited locator; term-wide string searches (nature, capital, answer, marking, key, physical/human geography, branches, Iwena, the four capitals); ten-row parse reproduced with the importer's own expression; JSON parse and round trip for both files; package parsed with the repository's zod schema; unique coverage, open-item and queue IDs; every coverage lesson id equals the reproduced id; every PARTIAL/UNRESOLVED row named by a blocking open item; every new dependency resolves; every `next_runnable` entry is PENDING with implemented dependencies. Nothing was run against the importer, compiler, database or test suites, and no type check was run.

## Remaining
Week 1 has one missing-teaching gap (nature), one assessed-but-untaught gap awaiting an owner decision (state capitals), an unverified reading pointer and no answer key; nothing is deliverable beyond the generic parsed row. This does not claim the week, subject or class complete.
