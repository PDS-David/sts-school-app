# MATH-WK-T1-W02 — Mathematics, 1st Term Week 2 (number bases) objective indexing

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented; not approved, not verified). Week 2 is **not covered**: six entries are PARTIAL and one UNRESOLVED, so delivery stays blocked and `package_status` stays PENDING. Nothing was run (no schema parse, compiler/plan, importer, test, typecheck, database or device). Base: master `a1db006` (fetched 2026-11-07).

## Inputs
- Member `MATHss1.docx`, SHA-256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb` (819,678 bytes), re-verified from the standalone attachment. Source `SS1-SRC-0c9004137f95`.
- mammoth 1.12.2 `extractRawText`: 1208 lines. Parsed row 1 ('Week 2', lines 191-347, 3539 characters, 157 lines) reproduced with the importer's `WEEK_MARKER` logic outside the importer: `SS1-SRC-0c9004137f95:BODY:67bf0c502841ad85f749844376673f8079384c66193c2f88191359e5d347437e` (equals `parsed_rows.json`). Awaits compiler confirmation.
- Scheme line 2 (extractRawText line 9, SHA-256 `e7c3bc08190b25e1a30bb3d5045329bdf962a2fc6a82f8df354c84aca535d6ba`): `[a]` conversion from one base to base ten; `[b]` conversion of decimal fractions (bicimals) in one base to base ten; `[c]` conversion of numbers from one base to another.
- Equation-aware reading: private OMML render of `word/document.xml` (paragraph index p0 = `Week 2.`; m:f as `(num)/(den)`, m:sSup `base^{script}`, m:sSub `base_{script}`). Nothing from it is committed.

## Coverage written (mathematics.json)
| ID | Scheme item | Status | Why |
| --- | --- | --- | --- |
| `COV-MATH-T1-W02-OBJ-1` | [a] to base ten | PARTIAL | taught and correct in the docx; delivered text loses exponents, bases and last digits |
| `COV-MATH-T1-W02-OBJ-2` | [b] bicimals | PARTIAL | source answer wrong: 1011.01 base two printed as 11 3/4, correct 11 1/4 |
| `COV-MATH-T1-W02-OBJ-3` | [c] between bases | PARTIAL | taught and correct; ladder step lost, one ladder incomplete, symbols above 9 undefined |
| `COV-MATH-T1-W02-VOCAB` | source-only vocabulary | PARTIAL | definition unusable; hexadecimal line lists digits as bases |
| `COV-MATH-T1-W02-EX-1` | assessment 1 (3 numerals) | PARTIAL | taught; unkeyed; numerals truncated in delivery |
| `COV-MATH-T1-W02-EX-2` | assessment 2 (5 fractions) | UNRESOLVED | method not taught; unkeyed; all fractions lost in delivery |
| `COV-MATH-T1-W02-EX-3` | assessment 3 (12 conversions) | PARTIAL | taught via base ten; unkeyed; base 12/15 symbols undefined |

## Findings
- **New factual defect:** lines 319-325. The row's own working gives coefficient 0 then 1 for the half place and prints `11 3/4`; 1011.01 in base two is `11 1/4` (11 3/4 is 1011.11). The earlier row-level `COV-MATH-T1-R01` note had recorded 11 3/4 as checked; that note was wrong and is corrected in place.
- All other worked results recompute correctly (95, 117, 4x²+3x+1, 1757 octal, 1111101111 binary, 535 base twelve, 2F9 hexadecimal, 165 octal, 2/3 = 0.1010…). Retained as printed: "CONVERTION", "express", `1twelve` subscript.
- **Lost notation is worse than unlabelled:** the last digit of each base-subscripted numeral sits in the same equation object as its subscript, so delivery prints 1007 as `100`, 761 as `76`, 535₁₂ as `53`, 312.21₄ as `312.2`, and shows assessment 2 as `(a). (b). (c).(d). (e).`. 78 equation objects in 32 paragraphs (37 subscript, 27 superscript, 15 fraction).
- **Figures:** 27 line shapes (division brackets) and 27 pictures that are 1×1, 70-byte placeholders with no content. No asset is needed; drawing disposition stays with `MATH-VIS-T1`.
- **Exercises:** 20 items in one `ASSESSMENT:` block (3 + 5 + 12 conversions); no class work, assignment or evaluation marker; no answers or marks in the source. None written.
- **Existing replacement scope:** none exists for row 1. `SUP-SS1-MATHEMATICS-T1-W03-BASE-OPERATIONS` is bound to row 2 (same-base operations, unknown base, binary codes) and covers no Week 2 exercise.

## Open items and queue
Open items appended: `OI-MATH-T1-W02-FACT-DEFECTS` (FACT, blocks), `-NOTATION-LOSS` (CONTENT), `-ASSESSMENT-GAPS` (CONTENT, blocks). `OI-MATH-002` narrowed (week 2 now reviewed).

Queue: `MATH-WK-T1-W02` implemented; appended `MATH-LES-T1-W02-NUMBER-BASES` (LESSON, runnable now) and `MATH-COR-T1-W02-NUMBER-BASES` (CORRECTION_BINDING, after the lesson). Counts recomputed from items: 99 items; 24 implemented, 66 pending, 9 blocked. `runnable_now` updated; `next_runnable` untouched.

## Checks performed
JSON parse and byte round trip of both files; coverage, open-item and queue IDs unique; every `lesson_ids` and `affected_ids` target resolves; each quoted anchor occurs once in the extract and once in the row; row, range and line hashes recomputed; source file hash; every worked value and every exercise (digit validity, termination) recomputed in code; diff limited to the three allowed paths.

Not run: zod parse, compiler/plan, importer, tests, typecheck, database, device.

## Remaining
`MATH-LES-T1-W02-NUMBER-BASES`, then `MATH-COR-T1-W02-NUMBER-BASES`; teacher confirmation of the definition wording, the base-twelve/fifteen symbols and the expected form of recurring bicimals. `OI-MATH-005` (approval) and `OI-MATH-001` (extractor decision) still block. No subject or class completion is claimed.
