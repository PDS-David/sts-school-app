# DP-WK-T1-W01 — Data Processing, 1st Term, Week 1 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, compiler, database or device checks were run. Week 1 is **not** a complete, certified or taught week.

## Inputs
- Branch `ss1/dp-wk-t1-w01`, cut from origin/master `b29de19` (the merge of PR #329, PHYS-WK-T1-W01) and rebased onto `ffef576` (the merge of PR #330, COM-WK-T1-W01) before delivery, because master moved while this task ran; the Commerce commit touches only Commerce files. Working tree clean at start. Open PRs read through the GitHub API before editing: #330 `ss1/com-wk-t1-w01` (Commerce) and #331 `ss1/econ-wk-t1-w01` (Economics); at delivery only #331 remains open. Neither touches `data-processing.json`, this subject's `QUEUE.json` or this file, and no other branch or agent owns Data Processing work. Data Processing work on master: DP-SRC-T1/T2/T3 and DP-INV-T1/T2 are IMPLEMENTED_TESTING_DEFERRED; no week had been indexed. No `AGENTS.md` or `QODER.md` exists in the repository.
- Source: composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, 35,828,550 bytes. Member `SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx`, SHA-256 `a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b`, 1,056,355 bytes — **recomputed from the member this run and equal to the queue attachment**, so the standalone member was sufficient and the archive hash was checked without relying on a display filename. Source `SS1-SRC-a92792eaa7ef`.
- Extraction: `mammoth` 1.12.2 `extractRawText`, produced raw text SHA-256 `2f3f7c4c1165bff1d58a62d7cf2cf2ad793ceffbdf16d71fa0e85f74d8b5d375`, 39,578 characters, 1,773 lines, 699 non-blank. The archive, the member and the extract are kept outside Git in `scratch/` and nothing from the document is committed.
- Prerequisites DP-INV-T1 and DP-SRC-T1 are IMPLEMENTED_TESTING_DEFERRED; the week table, the assessment-block census and the locator method were reused, not renumbered.

## Locator rule (as recorded by DP-INV-T1, re-verified this run)
Locator = **1-based line of the `extractRawText` output, split on `\n`**. A block digest is SHA-256 over the block's lines joined with `\n`, **after leading and trailing blank lines are trimmed**; a single line is hashed as printed. Week body: lines 87-281 = `836f73d0570e28df4dca685d5e34818d0de10e41ee72d8226e422ace997b6567`, equal to the queue and to DP-INV-T1.

**Deviation to be aware of, not a renumbering.** DP-INV-T1 prints its assessment ranges *inclusive of the trailing blank lines* the extractor emits between blocks (EVALUATION 179-186, GENERAL EVALUATION 233-246, READING ASSIGNMENT 247-252, WEEKEND ASSIGNMENT 253-276, PROPERTIES 129-147). The package locators use the same **first** line and the same content, but stop at the last non-blank line (179-183, 233-243, 247-249, 253-273, 129-145). No line number, week label or block identity moved; only the blank tail is outside the hashed span, which is what makes each digest re-derivable from the trimmed rule above. Both forms appear in this file so the two documents can be reconciled.

**One documented untrimmed exception, not authored here.** The opening block DP-PRE-T1 owns is recorded in DP-INV-T1 as `lines 1-81 raw` = `07f34cdccb656a70155d2a989ffc5a737c39292a710d37021c16e7e6307c1d54`; the trimmed digest of the same span is `6f2e540c…`, so that digest is only reproducible with the blank tail included. The package cites it verbatim and unchanged (inside `COV-DP-T1-W01-SCHEME-1`) because the numbering and the recorded digest belong to DP-PRE-T1; every digest this task wrote is a trimmed-range or single-line digest.

Structural re-verification: `word/document.xml` has **809 direct children of `w:body`** (self-closing children counted; the last is `w:sectPr`). On that 0-based numbering the two diagram label paragraphs are children **51** and **83**, exactly as DP-INV-T1 records them.

## Coverage written (18 entries, all `source_id: SS1-SRC-a92792eaa7ef`, all `lesson_ids: []`)

| Coverage id | What the week actually prints | Lines | Status |
|---|---|---|---|
| `SCHEME-1` | Scheme row 1 label, no week number printed | 49 (table 49-71, 12 rows) | PARTIAL |
| `OUTCOMES` | The single outcome sentence under the topic line (manual vs electronic) | 91 | UNRESOLVED |
| `DATA` | Definition of data, the processing-system sentence, the information paragraph | 95-101 | PARTIAL |
| `CYCLE-DIAGRAM` | The input-processing-output flow drawn twice with VML arrows | 105 (and 169) | UNRESOLVED |
| `WHAT-IS-DP` | Definition of data processing and its four prose paragraphs | 111-125 | PARTIAL |
| `PROPERTIES` | Eight bare property labels, no explanation | 129-145 | PARTIAL |
| `CYCLE` | Framing sentence and six stage labels | 149-163 | PARTIAL |
| `ELEMENTS` | The two element paragraphs, under the element sentence at 167 | 173-175 | PARTIAL |
| `ACTIVITIES` | Three summary activity lines | 187-195 | PARTIAL |
| `INPUT-ACTIVITY` | Collection, verification/validation, coding | 197-203 | PARTIAL |
| `PROCESSING-ACTIVITY` | Five lettered items a) to e) | 207-217 | PARTIAL |
| `OUTPUT-ACTIVITY` | One sentence (retrieving, printing, communication) | 221-223 | PARTIAL |
| `IMPORTANCE` | One paragraph | 227-229 | PARTIAL |
| `EVALUATION` | Two written questions, no key | 179-183 | UNRESOLVED |
| `GENERAL-EVALUATION` | Five written questions, no key | 233-243 | UNRESOLVED |
| `WEEKEND-ASSIGNMENT` | Five objective items, no key | 253-273 | UNRESOLVED |
| `THEORY` | Two written questions, no key | 277-281 | UNRESOLVED |
| `READING-ASSIGNMENT` | One external reading, no pages, edition or year | 247-249 | UNRESOLVED |

`id` above stands for `COV-DP-T1-W01-*`. 11 PARTIAL, 7 UNRESOLVED, **0 SUPPORTED** — no entry claims a delivered lesson, and every row is indexed against its own lines with its own digest (73 SHA-256 citations in the package, 64 of them distinct, all re-derived).

Every PARTIAL row is PARTIAL for the same recorded reason: `data-processing.json` has `lessons[]` length 0, there is no parsed row for this source in `docs/ss1/work/SS1-03/evidence/parsed_rows.json` and the importer has not been run (`DATA-PROCESSING-T1-W01-PARSED-ROW-MISSING`). Taught in the source is not deliverable.

## Assessment census (14 questions, no answer anywhere)
2 at EVALUATION (181, 183) + 5 at GENERAL EVALUATION (235, 237, 239, 241, 243) + 5 at WEEKEND ASSIGNMENT (255, 259, 263, 267, 271) + 2 at THEORY (279, 281) = **14**. A case-insensitive scan of all 1,773 lines finds `answer`, `marking`, `score` and `rubric` on **no line at all**, and `marks` only at 1131 and 1135, inside Week Seven, where the sentence is about physical marks on a wall. No option letter is marked and no mark allocation is printed, so every question is indexed, not answered (`DATA-PROCESSING-T1-W01-ASSESSMENT-NO-KEY`, blocking).

| Observation | Evidence | Recorded as |
|---|---|---|
| THEORY 1 is byte-identical to GENERAL EVALUATION 1 | 279 and 235 share digest `7f85c8021684c5a9…` | `DUPLICATE-QUESTIONS` (non-blocking) |
| THEORY 2 repeats GENERAL EVALUATION 2 with two words added | 281 vs 237 (`Describe` → `Describe and explain`) | same item |
| EVALUATION 2 asks for the same definition in a third wording | 183 vs 111-127 and 191 | same item |
| Weekend item 4 has two defensible options | 267 prints collection and verification, 269 prints retrieving and all of the above; collection and verification are taught as input steps at 191, 199, 201 and retrieving is taught as output at 195 and 223 | `WEEKEND-ITEM4-TWO-CORRECT-OPTIONS` (blocking) |
| GENERAL EVALUATION 4 asks about content the week never teaches | `better tool` occurs on 241 alone; `advantage`/`disadvantage` occur only at 1139, 1193, 1591, all outside Week 1 | `GENERAL-EVALUATION-4-UNTAUGHT` (blocking) + `DP-LES-T1-W01-COMPUTER-TOOL` |
| Weekend items 3 and 4 split their options across two printed lines | 263 keeps A and B, 265 keeps C and D; same at 267/269 | indexed as printed |

## Content the week promises but does not carry
- **Manual vs electronic.** `manual` occurs on 3 lines document-wide (91, 321, 1723) and `electronic data processing` on 91 only. The contrast itself is printed at 1721 and 1723 under the Week Ten heading at 1719 as Electronic methods / Non-Electronic methods. Week 1's outcome line is therefore a promise with no teaching behind it — `MANUAL-VS-ELECTRONIC` (blocking), owned by `DP-FACT-T1-W01-TEACHER-DECISIONS` before `DP-LES-T1-W01-MANUAL-ELECTRONIC` may import anything.
- **The eight properties.** Lines 131-145 alternate label, blank, label: `Collected/Captured` … `Assigned`, all bare. Nothing in the week explains, exemplifies or orders them, yet weekend item 5 (271-273) tests the list.
- **Gathering and collation.** `collation` occurs on **1 line** in the whole extract (155) and `gather` on 3 (153, 199, 201) — the last two sit inside the input activity, so gathering is treated as part of input rather than as a stage, and collation is never explained although GENERAL EVALUATION 3 (239) asks what each stage involves.
- **Storage appears twice.** Named as a cycle stage at 161 and again as processing activity e) at 217, where the media are disk, tape or CD-ROM. `CD-ROM` occurs on 2 lines (217, 981); it is kept as the source wording and routed to `DATED-STORAGE-MEDIA` and `DP-FACT-T1-HARDWARE-MODELS`, not corrected here.
- **The summary and the expansion disagree.** Line 193 names five processing operations and 209-217 teach five lettered items, so the counts agree, but 193 says converting where the list has no converting entry and the d) SUMMARISE item at 215 has no matching word on 193; likewise 195 says converting for output where 223 says printing. Recorded as printed, not harmonised.
- **Reading.** 8 of the 10 READING ASSIGNMENT blocks in this document (247, 405, 547, 701, 803, 925, 1169, 1431, 1583, 1741) print a page range; the Week 1 line at 249 and the Week 4 line at 703 do not, so this week's reading cannot be located in an edition — `READING-RIGHTS` (blocking, kind PERMISSION). No copy of the named textbook is held and nothing was imported from it.

## Diagram disposition (labels are not a delivered diagram)
The flow appears twice: line 105 (tab-separated `INPUT`, `PROCESSING`, `OUTPUT`) and line 169 (the same three words separated by spaces, with PROCESSING and OUTPUT run together in extraction). Each label paragraph is one `w:p` holding **two `w:pict` VML straight connectors** of shape type `#_x0000_t32` — body children 51 and 83 — and the children after 51 are an empty paragraph and a page break. `extractRawText` keeps the three labels and loses the connectors, so the direction of the flow survives only through the surrounding prose; there is no picture to recover. This task extracted, redrew and committed **no asset**: `assets[]` stays empty and the disposition belongs to `DP-VIS-T1-W01-CYCLE`. Two supporting structural facts: the Week 1 body span (children 42-141) contains 4 `w:pict` and **no** `a:blip`, `w:drawing` or `v:imagedata` element anywhere in the week, while the only two raster images in this document sit at children 4 and 16, in the unlabelled opening block DP-PRE-T1 owns and outside Week 1; and the property, cycle-stage and scheme-row paragraphs are Word list-numbered (`w:numPr`) so their extracted text carries no numbers, whereas the processing items at 209-217 keep literal `a)` to `e)` letters with no list numbering (`LIST-NUMBERING-LOST`, owned by `DP-PRES-T1-NUMBERING`).

## Observed defects (retained uncorrected)
1. Line 105 and line 169 duplicate one another; the second loses the space between PROCESSING and OUTPUT.
2. Line 167 `Element of data processing;` ends with a semicolon and is not an upper-case heading like its neighbours.
3. Lines 131-145 print eight properties as labels with no explanation and no ordering statement.
4. Line 155 names a stage (collation) that no line in the document explains.
5. Line 191 states that the input activity has three steps, and 199/201 then teach them inside the input activity rather than as cycle stages.
6. Lines 193 and 215 disagree about summarising; lines 195 and 223 disagree about converting versus printing.
7. Line 217 gives dated storage media with no date or currency claim.
8. Lines 235/279 and 237/281 are repeated questions with no instruction about marks.
9. Line 241 tests content never taught in the week.
10. Lines 267-269 offer two defensible options and an `all of the above` that cannot be right.
11. Line 249 sets a reading with no pages, edition or year; the same title is printed three different ways in this document (249, 77 and the reading blocks of later weeks).
12. Scheme row 3 prints `HISTORY OF COMPUTERI.` while the Week Three body topic reads GENERATIONS OF COMPUTERS, so the row-to-week pairing is nominal (already flagged by DP-INV-T1; not re-scoped here).

## Appended tasks
- `DP-LES-T1-W01-MANUAL-ELECTRONIC` — LESSON, PENDING.
- `DP-LES-T1-W01-PROPERTIES-CYCLE` — LESSON, PENDING; explains the eight properties and the six stages, including gathering and collation.
- `DP-LES-T1-W01-KEY-ASSESSMENT` — LESSON, PENDING; additionally depends on `DP-LES-T1-W01-PROPERTIES-CYCLE`, because four of the 14 questions cannot be keyed before that content exists.
- `DP-LES-T1-W01-COMPUTER-TOOL` — LESSON, PENDING.
- `DP-FACT-T1-W01-TEACHER-DECISIONS` — FACTUAL_DEPENDENCY, BLOCKED; eight numbered decisions, and it names `DP-VIS-T1-W01-CYCLE`, `DP-PRES-T1-NUMBERING` and `DP-FACT-T1-HARDWARE-MODELS` as the owners of the three questions this task must not decide.
- Every lesson depends on the decision item, so none of the four is runnable today; no lesson text, answer key, diagram or correction is authored here.

## Edits
- `backend/src/db/ss1/subjects/data-processing.json`: 18 coverage entries appended (11 PARTIAL, 7 UNRESOLVED), 12 open items appended `DATA-PROCESSING-T1-W01-*` — 8 blocking (7 CONTENT, 1 PERMISSION) and 4 non-blocking (1 CONTENT, 1 FACT, 2 VERIFICATION) — so coverage 0 → 18 and open_items 2 → 14. Sources, source rules, lessons, delivery corrections and assets untouched; the subject keeps the canonical name **Data Processing** and `package_status` remains PENDING; the pre-existing `DATA-PROCESSING-ALIAS-APPROVAL` and `-T3` owner-action items are unchanged.
- `docs/ss1/work/microtasks/data-processing/QUEUE.json`: `DP-WK-T1-W01` set to IMPLEMENTED_TESTING_DEFERRED with a computed reference; its objective, completion_condition, locators, attachments, dependencies and allowed paths are byte-identical to master; five items appended (4 LESSON PENDING, 1 FACTUAL_DEPENDENCY BLOCKED); `counts` and `status_counts` recomputed (50 items: LESSON 4, FACTUAL_DEPENDENCY 5; 6 IMPLEMENTED_TESTING_DEFERRED, 42 PENDING, 2 BLOCKED); `next_runnable` recomputed 36 → 35; one note appended. No other item, note or field changed.
- This file.

## Checks run (authoring only)
Member and archive SHA-256 recomputed from the supplied attachment and equal to the queue; the raw text re-extracted and byte-compared with the working copy (1,773 lines, 699 non-blank, digest `2f3f…`); the week digest recomputed and equal to the queue. **Every SHA-256 cited in the package and in this file was re-derived from the re-extracted lines and matched to the range printed beside it** (73 citations in the package and 64 distinct digests; the only range that requires the raw, untrimmed form is the DP-PRE-T1 opening block, asserted as such). Word-frequency claims were produced by census over the extract, not by reading: manual, electronic data processing, collation, gather, updat, enter, retriev, better tool, advantage/disadvantage, misuse, CD-ROM, marks, answer/marking/score/rubric, business, the 12 scheme rows, the 10 reading blocks, the 8 property labels, the 6 stage labels and the 5 weekend item groups. Structural claims were checked against `word/document.xml`: body-child count, children 51/83, `#_x0000_t32` counts, tabs versus spaces in the two labels, `w:numPr` on properties/stages/scheme rows and its absence on the lettered items, and the image census of children 42-141. Both files were re-parsed, checked against a line-by-line mirror of `subjectPackageSchema.ts` (strict key sets and order, enums, non-blank text, 64-hex digests), checked for duplicate ids, for dangling `affected_ids` and for the plan arithmetic a compiler run would emit (2 sources without coverage + 18 incomplete coverage + 10 blocking open items = 30), and round-tripped byte-exactly through the project serialisation with CRLF. `git diff` was reviewed hunk by hunk; the pre-existing package arrays, both alias items, every unrelated queue item and both attachments are unchanged from `HEAD`. A real Zod parse, the importer, the compiler, tests, type checks, the database and devices were **not** run — deferred by owner.

## Remaining
Week 1 has no deliverable lesson: the 11 PARTIAL rows need the import/parse step and the subject-expert content the source omits, the 7 UNRESOLVED rows need the eight decisions in `DP-FACT-T1-W01-TEACHER-DECISIONS` and a key before anything can be authored, the flow at 105/169 still needs its disposition by `DP-VIS-T1-W01-CYCLE`, and the subject alias still needs the owner approval recorded in the two pre-existing items. Nothing here is an approval, a rights position, a verified fact or a taught lesson, and the week is indexed rather than certified. Next eligible Data Processing items are unchanged in kind: DP-INV-T3, DP-TEST-PACKAGE, DP-PRE-T1 and the other nine week-index items.
