# MATH-WK-T1-W01 — Mathematics, 1st Term Week 01 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 1 is **not fully covered**: `COV-MATH-T1-W01-OBJ-4` and `COV-MATH-T1-W01-OBJ-8` are PARTIAL and block delivery, so `package_status` stays **PENDING**. "Indexed" is not "certified" and not "taught".

## Inputs
- Starting SHA: `cc6cf68` (origin/master, re-fetched this session; it already contains the merged FM-WK-T1-W02 work, PR #326). Work done on branch `ss1/math-wk-t1-w01`. The open-PR list was queried through the GitHub API (`repos/PDS-David/sts-school-app/pulls?state=open`) and returned an empty array, so no open PR or branch touches the three allowed paths. No `AGENTS.md` or `QODER.md` exists in the repository. Prerequisites `MATH-SRC-T1` and `MATH-FACT-HEADER-T1` are IMPLEMENTED_TESTING_DEFERRED on master, not verified.
- Original member `SSS 1/1st Term SS1_/MATHss1.docx`, 819,678 bytes, extracted to a private directory outside Git from the supplied archive. **Both hashes verified**: member SHA-256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb` and archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` equal the QUEUE item's values. Source `SS1-SRC-0c9004137f95`; `archive_member` in the package is unchanged.
- Method, all private and outside Git: (1) mammoth 1.12.2 `extractRawText()` — the importer's own call — for the text and the 1-based line numbers (1,209 lines; whole-file SHA-256 `474b6e9f324c112dc5e6341945724fbefa59bbbb843aed947f9d7a908b7e9b1c`, reproduced twice this session from the verified member); (2) a private OOXML render (`scratch/tools/docxrender.cjs`, jszip + `@xmldom/xmldom`) that walks `word/document.xml`, keeps every `m:oMath` object, maps `m:f` → `(num)/(den)`, `m:sSup` → `base^{script}`, `m:sSub` → `base_{script}`, `m:rad` → `√(…)`, flags every `w:vertAlign` run and every `w:drawing`; (3) a drawing inventory (`scratch/tools/docxfigs.cjs`) that resolves each `a:blip r:embed` through `word/_rels/document.xml.rels` and reports `a:prstGeom`, the EMU extents and any `w:txbxContent` text. Line mapping for this file: mammoth line `L` ↔ document paragraph `(L+1)/2`, because mammoth emits one blank line between paragraphs (1,209 = 2 × 605 − 1); established once and used only to address paragraphs, never to renumber rows.
- Row identity re-derived: mammoth lines 41–190 joined by `\n` and trimmed = 2,872 characters, SHA-256 `333ee632535e7bd44c86711adbb43750bfa3e66cd9b1d9880a1f0792ee768fb5` — equal to parsed row 0 in `docs/ss1/work/SS1-03/evidence/parsed_rows.json`, so the existing numbering was reproduced and not changed.
- The importer, compiler, parser, schema parse, tests and type checks were **not** run.

## Scheme row and row classification
- Scheme row 1 (mammoth line 7, SHA-256 `7983ef7f2c914c795c00044aabb2dcb4365b3f8ac9837c16935aa8d7074954fd`): `Revision of Jss3 work and basic operations of integers; addition, subtraction, multiplication and division.` — one row, **no sub-objectives listed**. The week's objectives therefore come from the row's own teaching blocks, and eight were identified. The pre-existing inventory convention `1st-term scheme line N` is kept unchanged (in this file scheme row N sits at mammoth line 2N + 5).
- Parsed row 0 (`Week 1`, `REVISION AND BASIC OPERATIONS OF INTEGER`, lines 41–190) is an ordinary **teaching row**. Its title says REVISION but its body carries new material (the divisibility-test list, three worked examples, class work, column arithmetic, signed numbers, end-of-week assessment), so **no `classify_marker` rule was added** — classifying it as REVISION would discard teaching. Its `Week 1` label (line 41) is not stranded, so no `attach_stranded_label`; no `split_before`. No source rule and no asset was authored by this item.

## Coverage entries added (8, all `source_id` = SS1-SRC-0c9004137f95)
| Id | Objective | mammoth lines | Status |
|---|---|---|---|
| `COV-MATH-T1-W01-OBJ-1` | the ten divisibility tests 2–11 and what a divisibility test is | 45–69 (rules 47–67, definition 69) | IMPLEMENTED_EQUIVALENT |
| `COV-MATH-T1-W01-OBJ-2` | applying the tests in the three worked examples: 7168, 35120, 24739 | 71–95 (blocks 71–77, 79–87, 89–95) | IMPLEMENTED_EQUIVALENT |
| `COV-MATH-T1-W01-OBJ-3` | CLASS WORK over 3591, 2408, 7700, 18054, 2032, 1827, 23624, 468 | 97–101 | IMPLEMENTED_EQUIVALENT |
| `COV-MATH-T1-W01-OBJ-4` | revise the meaning of integer, simplify, evaluate | 103–107 | **PARTIAL** → `MATH-LES-T1-W01-VOCABULARY` |
| `COV-MATH-T1-W01-OBJ-5` | column addition and subtraction with carry/borrow: 961+86+422, 4312+504+614+24, 306−287 | 111–133 (111–123, 125–133) | IMPLEMENTED_EQUIVALENT |
| `COV-MATH-T1-W01-OBJ-6` | multiplication by partial products: 452 × 219 | 135–147 | IMPLEMENTED_EQUIVALENT |
| `COV-MATH-T1-W01-OBJ-7` | signed-integer evaluation incl. the fraction-bar division ((-8)×(-12))/(-10) | 149–161 | IMPLEMENTED_EQUIVALENT |
| `COV-MATH-T1-W01-OBJ-8` | ASSESSMENT: the twelve end-of-week items in four blocks | 163–181 | **PARTIAL** → `MATH-LES-T1-W01-ASSESSMENT-PRACTICE` |

Every entry carries per-block and per-line SHA-256 locators and states, at objective level, what the bound supplement teaches — not word overlap. The six equivalent entries each bind both `SUP-SS1-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS` and the row id `SS1-SRC-0c9004137f95:BODY:333ee632…` (the source row a learner would otherwise read); the two PARTIAL entries bind the row id only, because the supplement does not reach the whole objective.

**Scope of the existing replacement, confirmed against every exercise in the row** (what the task asked for): the supplement teaches 6 of the 8 objectives; of the row's 20 practice items (8 class-work + 12 assessment) it carries **12**, as `M1W1-Q1` (all eight class-work numbers, 8 marks over 8 criteria) and `M1W1-Q3(a)/(b)/(c)` + `M1W1-Q2(a)–(d)`. It carries **none** of the vocabulary definitions at lines 105/107 and **eight** assessment items nowhere. Every number in the supplement was recomputed and agrees, and each marking array sums to its declared marks (8/8, 6/6, 4/4), so the six equivalence claims rest on the supplement's own content, not on its existence.

`COV-MATH-T1-R00` (created by an earlier item) keeps its row-level status and gained **one bounding evidence entry only**: it now says in the package which six objectives are equivalent, which two are PARTIAL, and that the bound supplement therefore does not cover every objective. Its status was not flipped by this item.

## Work recalculated (reviewer values, for the accuracy check only — not an answer key)
| Line | Item | Row says | Recomputed |
|---|---|---|---|
| 77 | 7168 by 2,3,4,5,6,8,9,10,11 | 2, 4, 8 only | digit sum 22 → not 3/6/9; 68 = 4×17 → 4; 168 = 8×21 → 8; ends 8 → 2; not 0/5 → not 5/10; 8−6+1−7 = −4 → not 11 — **correct** (7 is not asked at line 73, yet 7168 = 7 × 1024) |
| 85, 87 | 35120 | 2, 4, 5, 8, 10 | digit sum 11 → not 3/6/9; 20 → 4; 120 = 8×15 → 8; ends 0 → 2, 5, 10; 0−2+1−5+3 = −3 → not 11 — **answer correct, wording defective** |
| 95 | 24739 by 11 | 18 − 7 = 11 → yes | 2+7+9 = 18, 4+3 = 7, 18−7 = 11 — **correct**; supplement adds 24739 = 11 × 2249, which checks |
| 101 | eight class-work numbers | no answers in the row | 3591 → 3, 9; 2408 → 2, 4, 8; 7700 → 2, 4, 5, 10, 11; 18054 → 2, 3, 6, 9; 2032 → 2, 4, 8; 1827 → 3, 9; 23624 → 2, 4, 8; 468 → 2, 3, 4, 6, 9 — the supplement's key agrees on all eight |
| 123 | 961 + 86 + 422 | 1469 | 1469 — **correct** |
| 113/123 | 4312, 504, 614 and 24 | column shows 5430 | printed column totals 5430; the four addends asked sum to **5454** — the row is internally inconsistent |
| 133 | 306 − 287 | 0 1 9 | 19 — **correct** |
| 141–147 | 452 × 219 | 4068, 452, 904 → 98988 | 452×9 = 4068, 452×10 = 4520, 452×200 = 90400, total **98988** — **correct** (partial products printed without place-value zeros) |
| 157 | 8 − (+7) | +1 | 1 — **correct** |
| 159 | −5 − (−9) | +4 | 4 — **correct** |
| 161 | ((−8)×(−12))/(−10) | delivered text: `9.6` | (+96)/(−10) = **−9.6** — the delivered line prints the wrong sign because the fraction and its minus are OMML |
| 179–181 | two signed fractions | invisible in delivered text | ((−18)×(−5)×3)/(9×(−2)) = 270/(−18) = **−15**; (12×(−15)×(−9))/((5−2)×(−3)×(−4)) = 1620/36 = **45** |
| 167, 171, 175 | the eight uncarried assessment items | no answers anywhere | 2184×11 = 24024; 217×405 = 87885; 36−23 = 13; 104−94 = 10; 336÷4 = 84; 1848÷12 = 154; (−18)÷(−3) = 6; −25÷4 = **−6.25** (the only non-terminating signed division in the set) |

## Factual and wording defects (open item `OI-MATH-T1-W01-FACT-DEFECTS`, blocks delivery)
| # | Line | Defect | Handled by |
|---|---|---|---|
| 1 | 59 | `7: no rule to it yet.` — false; the row's own first example is 7 × 1024 | supplement (7-test: 716 − 2×8 = 700 = 7 × 100) |
| 2 | 63 | the 9-test stated as "divisible by 9 **and 3**" — an unnecessary second condition that invites the 3-test in its place | supplement |
| 3 | 81 | "Which number is divisible by 35120?" — the inverse of the question the solution answers | supplement |
| 4 | 87 | the 8-test justified by "the last digit 120", where the rule at line 61 needs the last **three** digits | supplement (and the reason restated) |
| 5 | 113 / 123 | four addends asked, three printed, total 5430 against 5454 | supplement teaches 5454; **which side was meant is a teacher decision that does not exist** |
| 6 | 161 | delivered working prints `9.6` for −9.6 — a sign error caused by notation loss, so the row teaches the wrong answer | supplement |
| 7 | 99 | CLASS WORK asks 2, 4, 5, 6, 8, 9 only, narrowing the ten tests taught at lines 49–67 | supplement asks the full set |

Recorded so a later reviewer does **not** raise a false defect: line 67 counts odd/even positions from the left and the supplement counts from the right; for 24739 both give a difference of 11, and the two conventions differ at most in sign, which the "multiple of 11" clause absorbs. No correction is needed there. Everything else in the row recomputes correctly, as the table above shows.

## Lost notation (open item `OI-MATH-T1-W01-NOTATION-LOSS`, does **not** block delivery)
Row-0 census from the private render: **15 `m:oMath` objects across 6 lines** (103, 151, 157, 159, 161, 181) carrying **33 `m:t` runs**; **0 superscript and 1 subscript `w:vertAlign` run** in the row (the document holds 1,784 baseline and 1 subscript run in total, so this corpus's powers are OMML, not Word formatting); **0 tables and 0 text boxes in the row** (37 text-box paragraphs exist elsewhere in the document and reach no extraction); **0 OLE / embedded equation objects** (unlike the 3rd-term source, `OI-MATH-004`); **14 drawing references** = 7 `straightConnector1` rules (lines 121, 123, 141, 145, 147) + 7 `rect` shapes reported with zero EMU width, i.e. degenerate. mammoth emits no text for `m:oMath` or `w:drawing`, so the row loses every fraction and every rule: line 179 arrives as the empty string (digest `e3b0c442…`), line 181 as `       b.  `, line 103 as `not 1.5,,5.` where the document reads `not 1.5, 3 3/5, 5 1/2`, line 151 as `8(+7).  b. 5  (9).  (C )`, and line 161 as `  =  =9.6`.

`SS1-03` author evidence gives `eqExtra` = **127** extra characters for this row under an equation-aware extractor; this session's independent render recovers **15 fragments totalling 148 characters** (including the spaces and the `x` and `/` operators it inserts) in exactly those 6 lines — the same finding by a different method, so neither figure is presented as a correction of the other.

**The row contains no diagram.** Every drawing in it is an arithmetic rule or a degenerate shape, and the text boxes and pictures of the document sit in other rows. So no visual asset is missing from Week 1 and none is claimed; this is a finding for `MATH-VIS-T1` (the 1st-term visual census), which this item does not close. Doc-wide, for context only (not claimed as row-level): 165 paragraphs contain OMML, 89 carry a superscript group and 60 carry a drawing reference.

The extractor decision itself stays with `OI-MATH-001`, which deliberately lists only the unreplaced 1st-term rows — row 0 is absent from its `affected_ids` because a supplement is bound. `OI-MATH-001`'s doc-wide 333 count was reproduced exactly by this render; no measurement was invented for Week 1.

## Assessment gaps (open item `OI-MATH-T1-W01-ASSESSMENT-GAPS`, blocks delivery)
The row poses 20 practice items and supplies **no answer, no working and no marks for any of them**. The supplement covers 12 (the eight class-work numbers and four assessment items); **8 assessment items are taught nowhere**: 2184×11, 217×405 (line 167); 23 from 36, 94 from 104 (line 171); 336÷4, 1848÷12, (−18)÷(−3), −25÷4 (line 175, the division sign survives extraction). Two of the twelve assessment items are additionally invisible in the delivered text (line 179 and the first half of line 181), so a learner reading the delivered row sees the heading "find the values of the following:" with nothing under it. The reviewer values above are recorded to size the gap, **not** copied into the package as an answer key, and no marks are recorded as teacher-approved — none exist (`OI-MATH-005`).

## Queue changes
- `MATH-WK-T1-W01` → **IMPLEMENTED_TESTING_DEFERRED**, with the findings above; its queue-creation reference is preserved verbatim inside the new one. Completion condition is marked met **for indexing only**.
- Added two PENDING bounded items, as the completion condition requires for uncovered objectives: `MATH-LES-T1-W01-VOCABULARY` (the two command-word definitions at lines 105/107 plus the restored counter-examples at line 103) and `MATH-LES-T1-W01-ASSESSMENT-PRACTICE` (the eight uncarried assessment items, each with answer and marking criteria). The second depends on the first because both edit the same lesson body; both depend on `MATH-LES-T1-W01-DIVISIBILITY-INTEGERS` and on this item.
- `counts` LESSON 8 → 10, `total` 95 → 97, `status_counts` recomputed as IMPLEMENTED_TESTING_DEFERRED 22, PENDING 66, BLOCKED 9 — **all recomputed from `items` by script and equal to the summary fields**.
- `runnable_now`: removed `MATH-WK-T1-W01`, added `MATH-LES-T1-W01-VOCABULARY` in item order; the array now equals the recomputed dependency-satisfied PENDING list exactly. `next_runnable` is **unchanged** at `MATH-PRE-T3` — it is still PENDING and still dependency-satisfied, and repointing it would re-plan work another worker left there.
- `MATH-SCOPE-AUTHORING-FINISH.depends_on` was **not** extended: its children are the `MATH-WK-*`, `MATH-PRE-*` and `MATH-VIS-*` items only (no lesson item is a child on master, including the existing Week 1 lesson), and the Week 1 gaps are already gated by the two PARTIAL entries plus `OI-MATH-T1-W01-FACT-DEFECTS` and `OI-MATH-T1-W01-ASSESSMENT-GAPS`.
- No package lesson, correction, asset or source rule was authored or edited by this item beyond `coverage` and `open_items`.

## Checks actually performed
- `mathematics.json` parsed and validated against a line-by-line reimplementation of `backend/src/db/ss1/subjectPackageSchema.ts` (strict key sets, enums, non-blank text, 64-hex digests, the `SUP-SS1-…` lesson id regex, `state` unions): **no errors**. Result: coverage 46 (was 38), open_items 10 (was 7), lessons 6, delivery_corrections 6, source_rules 12, assets 0, `package_status` PENDING. A real Zod parse could not be run — `node_modules` is not installed here and installing/running it is part of the deferred testing.
- Compiler-style cross-checks: unique coverage and open-item ids; every `lesson_ids` value resolves to a lesson, a marker disposition or a `SS1-SRC-…:BODY:<sha256>` row id; every non-PARTIAL/UNRESOLVED entry has `lesson_ids` + evidence; every IMPLEMENTED_EQUIVALENT entry binds a lesson that exists in `lessons`; `affected_ids` all resolve. The two PARTIAL entries and the two blocking open items keep the package at `ready:false`, as intended.
- **62 distinct 64-hex digests cited by the new entries were each reproduced from the verified member's mammoth text** (single lines, cited ranges, and all 11 parsed-row blocks — row 0 reproduces `333ee632…`): 0 unverified.
- Existing lesson `body_sha256` recomputed and marking arrays summed against declared marks for the bound lesson (M1W1-Q1 8/8, Q2 6/6, Q3 4/4).
- Queue JSON parsed; duplicate item ids (0), all 13 required keys present on every item, every `depends_on` target exists, counts/status_counts/runnable recomputation as above.
- Open-PR query returned an empty array, so no overlapping owner of `mathematics.json` or the mathematics queue; `git status` was clean before editing and the diff touches only the three allowed paths.

## Not done / remaining gaps
- No lesson, correction, asset or source rule authored; no source row text altered; no approval, verification, teacher decision, rights or source fact invented. `SUP-SS1-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS` and `CORR-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS` stay content_approval **PENDING** (approval_reference null) and verification **DEFERRED**.
- `MATH-LES-T1-W01-VOCABULARY` and `MATH-LES-T1-W01-ASSESSMENT-PRACTICE` stay PENDING; until they land, OBJ-4 and OBJ-8 keep blocking delivery.
- Nothing executed: schema parse, compiler plan, row-ID alignment with the live parser, asset hashes and all `tests/ss1/mathematics.*` remain deferred (`OI-MATH-007`), as do `OI-MATH-005` (approval) and `OI-MATH-001` (extractor decision).
- The intent of the four-addend sum at line 113 needs a teacher/owner decision before the row can be called equivalent for that worked example.
- Week 1 is indexed. It is not certified, not fully taught and not deliverable.
