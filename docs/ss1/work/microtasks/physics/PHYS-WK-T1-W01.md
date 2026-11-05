# PHYS-WK-T1-W01 — Physics, 1st Term, Week 1 (objective index)

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective index only; not approved, not verified). Testing deferred by owner. No tests, typechecks, importer, database or device checks were run. Week 1 is **not** a complete, certified or taught week, and no objective is marked SUPPORTED.

## Inputs
- Branch `ss1/phys-wk-t1-w01`, cut from `origin/master` `a665934c6cf89ea9ea0cbacb5d9e77abc9809e5e` (the merge of PR #328, BIO-WK-T1-W01). Working tree clean at start. The open-pull-request list for `PDS-David/sts-school-app` was read through the GitHub API and is empty, so no other branch owns `backend/src/db/ss1/subjects/physics.json`, this queue or this record. Physics work already IMPLEMENTED_TESTING_DEFERRED on master: PHYS-SRC-T1/T2/T3, PHYS-PRE-T1, PHYS-PRE-T2. No `AGENTS.md` or `QODER.md` exists in the repository.
- Source: the standalone member `1ST TERM S1 PHYSICS.doc`, 8,479,232 bytes, SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206` — exactly the `member_sha256` recorded by the queue item, so the member alone was sufficient and the composite archive was not re-opened. Source `SS1-SRC-5c0149cda71d`. The member, its extract and every scratch script were kept outside Git; no source document, no credential and no personal name from the document is committed.
- Prerequisites PHYS-SRC-T1 and PHYS-PRE-T1 are IMPLEMENTED_TESTING_DEFERRED; the registration, the source rules and the locator method were reused, not re-derived, and no week numbering was changed.

## Locator rule (re-verified this run, numbering unchanged)
Line = 1-based line of the text that `word-extractor` 1.0.4 `getBody()` returns for the verified member, which is what the importer stores (`backend/src/db/ingestTopics.ts:299-302`: legacy `.doc` is `new WordExtractor()` … `await extract(path)` then `getBody()`). Block digest = SHA-256 of the stated lines joined with `\n`, UTF-8, leading and trailing blank lines of the block trimmed, no trailing newline, interior tabs and trailing spaces kept. Re-verified: 1,288 lines, 69,817 characters, whole text SHA-256 `23a1a9aed418ac382bcfa0c4302eaf70c8a348bba82dbe6c2893c10b9bd86908`; the nine parsed week rows of this source reproduce `docs/ss1/work/SS1-03/evidence/parsed_rows.json` exactly. WEEK ONE is parsed row 0: label line 41, title line 42, body lines 41-191 with the trailing blank lines 192-193 removed by the importer's `trim()`, 8,760 characters, SHA-256 `e343ec3389f73a5ba8ff6c475e11ed5128d6b7276d0089c7a4a6aa9b741d4ffc` — equal to the row identity `SS1-SRC-5c0149cda71d:BODY:e343ec33…`, which is the `lesson_ids` target of every PARTIAL entry below.

## Objective index
The scheme row for Week 1 (line 24, SHA-256 per the package) has two clauses, `Introduction to Physics` and `Familiarization of Physics Laboratory`. The week's own `CONTENT` outline (lines 43-46) declares three headings. Both were indexed instead of folding the outline into the single scheme clause.

| Coverage id | Objective | Lines | Status |
|---|---|---|---|
| `COV-PHYS-T1-W01-OBJ-1` | Meaning of Physics and its branches (scheme clause 1) | 48-59 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-2` | Familiarization of Physics Laboratory (scheme clause 2) | none | UNRESOLVED |
| `COV-PHYS-T1-W01-OBJ-3` | Fundamental quantities and units; the seven SI quantities | 65-91 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-4` | Derived quantities and units; the six tabulated examples | 93-105 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-5` | Fundamental-vs-derived, units and quantities (two tables) | 107-121 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-6` | Dimension of a physical quantity; M, L, T | 123-129 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-7` | Dimensional analysis of density, velocity, acceleration | 131-141 | UNRESOLVED |
| `COV-PHYS-T1-W01-OBJ-8` | Dimensional analysis of force to `MLT-2` | 143-147 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-9` | Table 2.3 units and dimensions of six quantities | 149-158 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-10` | EVALUATION 1: define Physics; steps of the scientific method | 61-63 | UNRESOLVED |
| `COV-PHYS-T1-W01-OBJ-11` | EVALUATION 2: three dimensions; classify 15 quantities | 160-163 | UNRESOLVED |
| `COV-PHYS-T1-W01-OBJ-12` | Reading assignment (Anyakoha, Pg1-2) | 165-166 | PARTIAL |
| `COV-PHYS-T1-W01-OBJ-13` | WEEKEND ASSIGNMENT: 7 objective questions | 168-182 | UNRESOLVED |
| `COV-PHYS-T1-W01-OBJ-14` | THEORY: 4 dimensional-analysis questions | 184-191 | UNRESOLVED |

Every PARTIAL row is PARTIAL for the same recorded reason: `physics.json` has `lessons[]` length 0, no supplement exists for this row and the importer has not been run. Taught in the source is not deliverable. No SUPPORTED row is possible this run, and `PHYSICS-T1-W01-COVERAGE` keeps the week blocking.

## Unmapped scheme clause
`Familiarization of Physics Laboratory` is the second clause of line 24 and the string `laborator` occurs nowhere else in the 1,288 extracted lines; `familiar` likewise occurs only at line 24. `apparatus` occurs once in the whole 1st Term document, at line 1234 inside WEEK TEN (a viscosity procedure). The WEEK ONE body has no laboratory, instrument, safety or workshop teaching. `COV-PHYS-T1-W01-OBJ-2` is UNRESOLVED, `PHYSICS-T1-W01-LABORATORY` is open and blocking, and `PHYS-LES-T1-W01-LABORATORY` is appended as the bounded lesson. Nothing was invented to fill it. The unmerged PR #71 branch (blob `5b4010a8db081ddcafafd5bf98bfcbd7b31c09f3`) records the same week as `PHYS-1-001` with objective text `Introduction to physics; fundamental quantities, units and dimensions`, i.e. it drops this clause too; reported for `PHYS-PORT-D1-COV-T1`, not copied.

## Why the formulas and figures are missing (binary evidence)
Lines 133 (`The dimensional equation of density =  `), 134 (54 spaces then `=`), 137 (`Velocity =   = `) and 141 (`Acceleration =    = `) reach the extract as empty operands. Byte scan of the verified member: **0 equation objects** — no `Equation.3`, `Equation.DS4.0` or `Equation` class name and no MTEF payload in single-byte or UTF-16 form, 0 `EQ` field instructions, 0 equation-editor CLSID bytes (canonical `{00020000-…}` order) — while the same file holds **76 complete embedded PNG images** (76 signatures, 76 matching `IEND` chunks) and 4 JPEG streams. So the working was either blank as authored or carried inside a picture; `getBody()` emits neither, and the importer has no legacy `.doc` image path at all (equation recovery at `ingestTopics.ts:289-295` is `.docx` + JSS3 Mathematics only). Which of the two is true is not decidable from the body text, so `COV-PHYS-T1-W01-OBJ-7` is UNRESOLVED rather than asserted, the figure inventory stays with `PHYS-VIS-T1` and the rendering decision with `PHYS-OWNER-EXTRACTION-STRATEGY`.

Non-body streams of the same member, hashed this run because they were asserted unavailable in PHYS-PRE-T1 and that is not correct: headers, 39 characters, SHA-256 `864b418e8c4c73e66ebf52de86ebce2ddde7e2a91d50b96b9a69121453c78f6d` — page furniture naming an individual tutor, the class and term and a page number; the name is deliberately **not** transcribed into Git. Footers, 38 characters, `460438d1c6bdcf1e9e7798798f44c592fe3f0be6c3632c1971862f0b4b3e51b1`. Text boxes, 482 characters, `833455d3cd0fab9f56afa131825c27440b6226116db389bf8b0a983234ecf623` — diagram labels including `V(m/s)`, `t(s)`, `20m/s`, a gradient note and a compass rose. Footnotes, endnotes and annotations: 0 characters each. None of this reaches the database.

## Assessment scope
| Block | Items | Answered from Week 1? |
|---|---|---|
| EVALUATION 61-63 | Q1 define Physics; Q2 `State the step involved in scientific method?` | Q1 from 48-59; Q2 from nowhere — `scientific method` occurs once in the whole extract, in the question itself |
| EVALUATION 160-163 | Q1 dimensions of acceleration, pressure, density; Q2 classify 15 quantities | Q1 from Table 2.3 (153-158); Q2: 8 of the 15 are taught (mass, length, temperature, electric current at 75/77-81/85-91; velocity, volume, density, acceleration at 98-103) and 7 are not — weight, torque, speed, power, energy, heat capacity, relative density |
| WEEKEND 168-182 | 7 four-option questions | items 2 and 6 are answerable from Tables 2.0/2.3 and line 66; items 1, 3, 4, 5 and 7 turn on names Week 1 never teaches: `thrust` (170, 181; taught from 1039), `work`/`energy` (173; a WEEK 9 topic at 1096), `ohm` (175; the only occurrence in the whole document), `tension`/`impulse`/`upthrust` (177; WEEK THREE 389 and WEEK 8 987) |
| THEORY 184-191 | 4 questions | items 1 and 4 quote their own formulae (186-187) or hint (`191`, `Nm-2`); item 2 needs impulse, potential energy (1128, WEEK 9) and Young's modulus — and `strain`, which occurs **nowhere** in 1,288 lines; item 3 asks the exponents of `MaLbTc` for impulse |

No block has an answer key, a worked answer or a mark allocation: searches for `mark`, `answer`, `allocation`, `score` and `solution` across lines 41-191 return nothing. `COV-PHYS-T1-W01-OBJ-10`, `-OBJ-11`, `-OBJ-13` and `-OBJ-14` are UNRESOLVED, `PHYSICS-T1-W01-ASSESSMENT-NO-KEY` blocks delivery, and `PHYS-LES-T1-W01-KEY-ASSESSMENT` is appended. No option is marked correct and no dimension is supplied here.

## Observed defects (retained, uncorrected)
1. Table 2.0 (85-91) abbreviates metre, second, kilogram and candela as `M`, `S`, `Kg`, `Cd` — four non-SI symbols.
2. Line 75 names three most important basic quantities; Table 2.0 lists seven. Both quoted as found.
3. Table 2.1 leaves the Derivation cell empty for Density, Velocity and Acceleration (100-102).
4. Line 99 reads `Length × breath × height` after line 98 `Length × breadth`.
5. Table 2.2 leaves the Unit cell of Time empty (129).
6. Table 2.3 tabulates Momentum (156), a quantity the week never defines.
7. The four tables are numbered 2.0-2.3 inside a 1st Term document.
8. Exponents are flattened by the legacy extraction: `m2`, `m3`, `kg/m3`, `Kg.m-3`, `m.s-1`, `m.s-2`, `ms-1`, `ms-2`, `Nm-2`, `kgm-3`, `LT-1`, `LT-2`, `MLT-1`, `MLT-2`, `ML-3`, `ML-1 T-2`, `MaLbTc`, `MxLyTz`.
9. Two encodings of the minus in one week: ASCII hyphen throughout the tables and the force working (145-158) versus U+2212 in weekend item 2 (171). `×` (U+00D7) is used at 98, 99, 103, 145, 146 while the letter `x` is used as a multiplication sign at 105, 144, 186, 187.
10. Wording kept: heading `FUNDAMENTAL QUANTITIES AND UNIT` (65) against the outline `… UNITS` (45); `systeme international d'units` (66); mixed quotation marks at 62 and 105; `N(ma)` (155); `ML-1 T-2` with an interior space (158); `M.W.Anyakoha, Prof.` (166); numbering drift — 172, 188, 190 use runs of spaces, 174, 176 and 163 a bare tab, against the `n.` form at 169, 178, 180, 185, 191.
11. Ambiguous anchors: line 44 and line 48 are the identical string `MEANING OF PHYSICS`, and line 46 and line 123 the identical string `DIMENSIONS OF PHYSICAL QUANTITIES`. A `classify_marker` rule must not bind either heading alone; reported to `PHYS-RULE-T1-REVISION-SCHEME`.
Defects 1-7 are the FACT item `PHYSICS-T1-W01-FACT-DEFECTS` (kind FACT, blocking); 8-10 are `PHYSICS-T1-W01-NOTATION-LOSS` and `PHYSICS-T1-W01-SOURCE-DEFECTS` (non-blocking). No source byte was edited and no correction was authored, because a factual correction is a delivery replacement and the rendering question belongs to `PHYS-OWNER-EXTRACTION-STRATEGY`.

## Checks performed
Member SHA-256 re-computed from the supplied file before parsing; extraction re-run and compared byte-exactly to the stored text; all nine parsed row digests reproduced against `SS1-03/evidence/parsed_rows.json`; 121 positional block digests re-derived from the extract and compared to what was written to `physics.json` (0 mismatches; the one `lines 1-7` digest in the file predates this task and belongs to the existing source-rule evidence); the 12 line-range digests cited in the new queue records re-derived from the extract (0 mismatches) and the file-level hashes they name — member, whole extract, header, footer and text-box streams — re-computed from the verified member; package and queue JSON re-serialised byte-exactly and re-validated against a field-for-field mirror of `subjectPackageSchema.ts` (strict keys, status vocabulary, digest pattern, lesson-id pattern, non-empty `affected_ids`); duplicate-id and reference checks across coverage and open items; `counts`, `status_counts`, `total`, `runnable_now` and `next_runnable` recomputed from `items` (the runnable rule reproduces the previous 44-item list exactly, so the summary fields were derived, not hand-edited); no credential, source document or extract committed.

## Deferred and remaining
Full tests, typechecks, importer runs, compiler plans, database and device checks remain deferred by owner instruction; CI was left enabled and untouched. `package_status` stays PENDING and `lessons[]` stays empty: nothing is deliverable and the week keeps blocking. `PHYS-FACT-T1-W01-SCOPE` (BLOCKED) holds the seven expert questions; three bounded lessons (`PHYS-LES-T1-W01-LABORATORY`, `-DIMENSIONAL-ANALYSIS`, `-KEY-ASSESSMENT`) are appended as PENDING; `PHYS-VIS-T1` still owns the 76 figures; `PHYS-OWNER-EXTRACTION-STRATEGY` still owns exponent rendering; `PHYS-PORT-D1-COV-T1` still owns PR #71 reconciliation; `PHYS-RULE-T1-REVISION-SCHEME` now also owns the duplicate-heading constraint. `NEXT_TASK.md`, `QUEUE_BUILD.md`, `PHYS-PRE-T1.md` and every other subject's files were not written: they are outside this task's three allowed paths.
