# GOV-WK-T1-W01 — Government, 1st Term, Week 1 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No full tests, type checks, importer, compiler, database or device checks were run.

## Inputs
- Base: origin/master `1ac689ecd7f7d3445954f022a7a65e02c1f28bb2` (7 November 2026), fresh clone, working tree clean at start. `AGENTS.md` is absent.
- Prerequisites GOV-INV-T1 and GOV-SRC-T1 are IMPLEMENTED_TESTING_DEFERRED on that master; the inventory, locators and block hashes were reused, not re-derived. No Government coverage, lesson, rule, correction or asset existed before this task.
- Source: standalone `1ST_TERM_S1_GOVERNMENT.doc`, 1163776 bytes, SHA-256 `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a`, hashed before conversion; equals the queue's member hash. The composite archive was not supplied, so its hash was not checked. Nothing from the document is committed.

## Locator rule
As in GOV-INV-T1: lines of `getBody()` from word-extractor 1.0.4 (the importer's legacy `.doc` call), 1-based; line hash = SHA-256 of the line text, UTF-8, no newline; range hash = SHA-256 of the lines joined with `\n`. Re-verified this run: 865 lines; lines 45-102 `cbce46f8555ccf042f113c0d5694daeb0e617e2cb7dfdb915fe1c7b939990e04`, equal to GOV-INV-T1 and the queue. Every coverage locator also carries an exact quoted anchor that was confirmed to occur once in the extracted text. Two cases needed care: the marker text `EVALUATION QUESTION` occurs 15 times and is never used as an anchor, and `Why do we study government?` (line 60) recurs at line 153 in Week 2, so a two-line anchor is used.

## Generic parsed row (reproduced, not importer-run)
The importer's `WEEK_MARKER` and its adjacent-marker filter from `backend/src/db/ingestTopics.ts` were copied into a private scratch script and run on the extracted text. It yields ten rows, WEEK ONE to WEEK TEN; the scheme header `WEEK<TAB>TOPIC` does not start a row. Week 1's row is lines 45-102 (3928 characters), title `THE MEANING AND SCOPE OF THE SUBJECT MATTER: GOVERNMENT`, and its trimmed body SHA-256 equals the inventory block hash. Original lesson id `SS1-SRC-40ce7dcaf672:BODY:cbce46f8555ccf042f113c0d5694daeb0e617e2cb7dfdb915fe1c7b939990e04`. To be confirmed against `identified_rows` of the first reviewed plan; open item `GOVERNMENT-T1-W01-COVERAGE` says so. (Observation for later week tasks: the parsed body hashes of weeks 3, 5, 7 and 9 differ from their inventory block hashes. For weeks 3 and 5 this was checked: the inventory block keeps trailing whitespace on its last line, which the parser trims. Weeks 7 and 9 were not checked. Week 1 is unaffected.)

## Source rules
None added. `WEEK ONE` (line 45) already begins a parsed row, so `split_before` and `attach_stranded_label` are not needed. `classify_marker` classifies the whole containing row, and line 78 (`GENERAL EVALUATION/REVISION QUESTIONS`) sits inside a teaching row, so a REVISION classification would misdescribe the week; GOV-MARK-T1 owns the marker vocabulary. Note for it: line 91 contains the word `THEORY` inside a question stem.

## Objectives
Scheme row 1 (lines 24-27): `The Meaning and the Scope of the Subject Matter: Government` with three sub-lines. The body's second heading reads `Government as a Process or Art of Governing` (lines 49, 62); the scheme says `Art`.

| Scheme row 1 item | Locator | Status |
|---|---|---|
| Government as an Institution of the State: meaning | heading 52; paragraph 56 | SUPPORTED (`COV-GOV-T1-W01-INSTITUTION-MEANING`) |
| Government as an Institution of the State: why government exists | paragraphs 53-54 | PARTIAL (`COV-GOV-T1-W01-INSTITUTION-NEED`) |
| Government as an Art of Governing | heading 62; paragraphs 63, 65, 67 | SUPPORTED (`COV-GOV-T1-W01-ART-OF-GOVERNING`) |
| Government as an Academic Field of Study | heading 69; paragraphs 70, 72 | SUPPORTED (`COV-GOV-T1-W01-ACADEMIC-FIELD`) |
| Reasons for studying government (asked, not in the scheme row) | lines 60, 89-90; scheme line 31 (Week 2) | PARTIAL (`COV-GOV-T1-W01-WHY-STUDY`) |
| Reading assignment | lines 84-86 | PARTIAL (`COV-GOV-T1-W01-READING`) |
| Answers and marking for all exercise items | lines 59-60, 75-76, 79-82, 89-98, 101-102 | UNRESOLVED (`COV-GOV-T1-W01-ASSESSMENT-KEYS`) |

## Exercise accounting (15 items)
| Line(s) | Item | Where answerable | Entry |
|---|---|---|---|
| 59 | Explain Government as an Academic Field of Study | 70-72 (asked before the section at 69) | ACADEMIC-FIELD |
| 60 | Why do we study government? | only in part in 70-72; also asked at 153 | WHY-STUDY |
| 75 | same as 59 (capital letter and `?` differ) | 70-72 | ACADEMIC-FIELD |
| 76 | Why is government referred to as an Academic Field of Study? | 70-72 | ACADEMIC-FIELD |
| 79 | How is government an art of governing? | 63-67 | ART-OF-GOVERNING |
| 80 | How would the world have been without governments? | 53-54 (needs correction) | INSTITUTION-NEED |
| 81 | Can only one organ of government run a state? | 65 | ART-OF-GOVERNING |
| 82 | How is government an academic field of study? | 70-72 | ACADEMIC-FIELD |
| 89-90 | Weekend Q1: study of government helps us to | not in span | WHY-STUDY, KEYS |
| 91-92 | Weekend Q2: theory of a primitive society (Hobbes option) | 53, with framing defect | INSTITUTION-NEED, KEYS |
| 93-94 | Weekend Q3: fourth organ of government | 65, 67 name three organs | KEYS |
| 95-96 | Weekend Q4: absence of government leads to | 54 | KEYS |
| 97-98 | Weekend Q5: one basic principle of government | not supported for any option | KEYS |
| 101 | Describe the functions of the organs of government | 67 | ART-OF-GOVERNING |
| 102 | Why is government necessary in a state? | 53-54, 56 (needs correction) | INSTITUTION-NEED |

An evaluation or revision heading is not counted as teaching anywhere above. No marks are stated for any item. Lines 47-50 are the week's own content list, 51, 55, 57, 61, 64, 66, 68, 71, 73, 77, 83, 87 and 99 are blank separators, and line 83 is a single space. No figure, table, equation or inline picture falls inside lines 45-102; the page break before the weekend assignment (line 88) is the only layout break (GOV-INV-T1).

## Primary-text verification (Hobbes)
Checked against Thomas Hobbes, *Leviathan* (1651), Part I, chapter XIII, through web copies (Fordham Internet History Sourcebook and other excerpts of the Project Gutenberg text), not a page-cited edition. The edition check is left to the lesson task.

- **Source wording (kept as printed, line 53):** `Thomas Hobbes referred to as a primitive society. This is a society where life is solitary, poor, wicked and short.`
- **Primary wording (verification evidence only):** the life of man in that condition is `solitary, poore, nasty, brutish, and short` (1651 spelling).
- `wicked` is not Hobbes's word and `nasty, brutish` are missing, so line 53 is not a faithful quotation.
- `primitive society` is not Hobbes's term. His chapter concerns the natural condition of mankind without a common power, described as a war of every man against every man; calling it his theory of a primitive society misdescribes the argument. His example of peoples of America is a seventeenth-century illustration to attribute, not a fact to teach.
- Line 54 states the surrender of natural rights to government as plain fact. That is a contested contract account to attribute, with alternatives presented neutrally.
- The source stays unchanged. The correction is a delivery replacement, not authored here.

## Owner question (raised in chat, not blocking the rest of this task)
Weekend Q1 (lines 89-90) and Q5 (lines 97-98) have no support in the span. (A) The owner or subject teacher confirms intended keys (recommended: Q1 `know our rights`; say whether Q5 intends `separation of power`) and Q2's stem is reworded in delivery; (B) leave Q1 and Q5 out of keyed practice until Week 2 is indexed; (C) replace them with original questions on taught text. Recorded as open item `GOVERNMENT-T1-W01-WEEKEND-KEY`; no Q1 or Q5 answer is stated in any package field.

## Appended task
- `GOV-LES-T1-W01-CORRECTED-WEEK` — LESSON, PENDING. One lesson only: the contract resolves a correction to the whole original row, so a replacement must teach all three Week 1 objectives. No lesson text, answer key or correction is authored here.

## Edits
- `government.json`: seven coverage rows appended (three SUPPORTED, three PARTIAL, one UNRESOLVED); four blocking open items appended (`GOVERNMENT-T1-W01-COVERAGE` CONTENT, `GOVERNMENT-T1-W01-HOBBES-CORRECTION` FACT, `GOVERNMENT-T1-W01-WEEKEND-KEY` OWNER_ACTION, `GOVERNMENT-T1-W01-FACT-CHECKS` FACT). Sources, source rules, lessons, delivery corrections, assets and the three alias open items untouched; `package_status` remains PENDING.
- `QUEUE.json`: GOV-WK-T1-W01 set to IMPLEMENTED_TESTING_DEFERRED with its implementation reference extended; one item appended; counts and status_counts recomputed from items (23 items: 5 implemented, 17 pending, 1 blocked); `next_runnable` recomputed from satisfied dependencies, excluding TEST (the previous list held only GOV-PRE-T1 although other tasks were already eligible); one note appended. No other existing ID changed.
- This file.

## Checks run (authoring only)
Source member SHA-256 and byte count; 865 lines extracted and the Week 1 block hash compared with the inventory and the queue; ten-row parse reproduced with the importer's own expression and Week 1's id derived; 83 line and range hashes cited in the coverage recomputed and matched; every quoted anchor confirmed to occur once; package parsed with the repository's zod schema (copied unchanged to scratch); JSON parse for both files; unique coverage, open-item and queue IDs; every PARTIAL/UNRESOLVED entry named by a blocking open item; every `affected_ids` and `depends_on` entry resolves; every coverage lesson id equals the reproduced id; counts, status counts and `next_runnable` recomputed from items; all pre-existing package and queue content other than GOV-WK-T1-W01 unchanged by comparison with HEAD. Nothing was run against the importer, compiler, database or test suites, and no type check was run.

## Remaining
Week 1's three source objectives are taught but one carries a factual defect needing a delivery replacement, one question is only partly taught in the span, the reading pointer is unverified and no exercise has a key. Nothing is deliverable beyond the generic parsed row, and the package stays PENDING. This does not claim the week, subject or class complete.
