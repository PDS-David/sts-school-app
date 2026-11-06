# CHEM-IDX-T1A-W01 — Chemistry, 1st Term WEEK ONE indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexing only; not approved, not verified). Testing deferred by owner.

## Inputs and checks performed
- Base: origin/master `bf66c92`. `AGENTS.md` is absent. CHEM-INV-T1A and CHEM-SRC-T1A are `IMPLEMENTED_TESTING_DEFERRED`. CHEM-IDX-T1A-W01 was `PENDING`.
- Source `SS1-SRC-58b4a44c3afa`, member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, 2,187,976 bytes, SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` — **verified** from the directly supplied member. The composite archive was not supplied and its hash was not checked. Nothing from the source is committed.
- Text read with `mammoth` 1.12.2 `extractRawText`: 55,382 characters, 2,129 lines, SHA-256 `f88594cb2127d95a5bec7f17fd785efcda3c02ee1ccde5564eaa21774748e702` — equals the task.
- Locator re-check: lines 90-245 joined with `\n` hash to `8b348aa6be31cc15d603c4054646f4a0cdd0874c7c0cd38fd14c12fb3d3519f3`, equal to the locator. The `WEEK ONE` marker is line 91 and `WEEK TWO` is line 247; lines 90 and 246 are blank, and the locator range ends at the last line before the next marker's preceding blanks as recorded by CHEM-INV-T1A.
- Visual check in the DOCX XML for the body children from `WEEK ONE` to `WEEK TWO`: no `a:blip`, no `w:pict`, no text box, no table and no equation. The 146 `w:vertAlign` runs are all `baseline`. No visual item is raised for Week One.
- Nothing run: no tests, typechecks, importer, database, device or deployment.

## Locator method
Line numbers are 1-based over `extractRawText` text split on `\n`; a section runs from its first to its last non-blank line; SHA-256 over the UTF-8 lines joined with `\n`. Whitespace-only lines 167 and 197 count as blank separators.

## Section index (lines 90-245)
| Section | Lines | SHA-256 | Notes |
|---|---|---|---|
| WEEK ONE label | 91-91 | `635789fb4e63974d59acfd3667c0b0fb9a4b935d51684c017ac9879e598deb6b` | marker line |
| TOPIC: INTRODUCTION TO CHEMISTRY | 93-93 | `2465148ce4705dab3f847870b8ade46e0771ff521db9b5e8a7c419ce0533cbae` | topic line |
| CONTENT | 95-101 | `7b4f98a7f1e07ea8bbb95ebcebd07af6d44e7864ef7b5ba58960c1f1529909ac` | three headings; line 101 promises apparatus and uses, which this week never teaches; line 99 has trailing whitespace |
| CHEMISTRY AS A SCIENCE SUBJECT | 103-105 | `ba96937eef00b92cba4e758b9cba6632ae207be9e4fc1fb20ed6fb41389edd8e` | heading and one definition paragraph (105) |
| BRANCHES OF CHEMISTRY | 109-125 | `ac4881b2203ab72a9d7a92f183bf3f7a8ea8e3f417417fab78b35d1aee511898` | intro 111; three names 113-117; one sentence each 121-125 |
| SCIENTIFIC METHODS OF DISCOVERIES | 129-149 | `53abf8b03437989796e1009b2bef5366ffc9f8c09578b6b81cd44107f95aa22c` | intro 131; seven stages 133-145; hypothesis, theory and law paragraph 149 |
| EVALUATION 1 | 153-159 | `67f31804f44bf2eb2825bdb2d1754b1139807b850ab89cb9348b744cc2206b0f` | 3 questions (155, 157, 159) |
| APPLICATIONS OF CHEMISTRY | 163-165 | `2cd660ffa87f3229d105db5dc1a34244d40279f3bab01d0c037bf33e795535d4` | one paragraph |
| CAREER PROSPECTS IN CHEMISTRY | 169-195 | `623ef66e2b08207b6b328e334208ee820b12669c244230fc81e50d8622335140` | lead-in 171; twelve fields 173-195; line 195 has trailing whitespace |
| EVALUATION 2 | 199-203 | `54f7846bc2eae3f26be7dc98123a2845934ec0bf721e723605f8ae3b89b1a149` | 2 questions (201, 203) |
| GENERAL EVALUATION | 207-211 | `e5fd8d08726f9e9d00e42ddfa0f80f7dd6145567477b527f1ff5dfa5899eaae7` | 2 questions (209, 211) |
| READING ASSIGNMENT | 215-219 | `16ba245937f9a480f9a8848455847342a49ee9018cd259b08135d8aab28826c0` | two textbook references with pages (217, 219); not supplied, not copied |
| WEEKEND ASSIGNMENT | 223-233 | `fa3eeeb22d584a008ba1734e04ed2b4ee6ea1e91b40b98daf1eb57136b48e892` | 5 objective questions with options (a)-(d) (225, 227, 229, 231, 233); no answer key |
| THEORY | 237-241 | `4825ef4653a39e51d6464c0225d73a2c0d6fa130e34bca27f3bb2ab00f07776f` | 2 questions (239, 241) |

Every non-blank line from 91 to 241 belongs to a section above; lines 242-245 are blank. Nothing is discarded.

## Exercises (indexed, not answered)
- **EVALUATION 1 (153-159):** 155 `Define chemistry`; 157 `State the stages or steps involved in scientific discoveries`; 159 `When does a theory become a scientific law?`
- **EVALUATION 2 (199-203):** 201 `State five applications of chemistry in our daily life.`; 203 `Mention five adverse effects of chemicals and how they can be controlled.`
- **GENERAL EVALUATION (207-211):** 209 `Mention ten (10) career opportunities in chemistry.`; 211 `List the branches of chemistry.`
- **READING ASSIGNMENT (215-219):** two textbook references with page ranges; not supplied and not copied.
- **WEEKEND ASSIGNMENT (223-233):** five objective questions (225 branch; 227 adverse effect; 229 scientific-method stage; 231 theory to law; 233 career prospects). None has an answer key or mark.
- **THEORY (237-241):** 239 `State five applications of chemistry in our daily life`; 241 `Mention five laboratory apparatus and their uses`.
- No answer, marking guide or mark allocation exists anywhere in the week. None is authored here. Preservation of these blocks belongs to later items.

## Objective candidates (from the source's own headings and linked questions; none is a coverage claim)
1. Chemistry as a science subject (103-105; question 155).
2. The three branches of chemistry (109-125; questions 211, 225).
3. Scientific method: stages and theory-to-law (129-149; questions 157, 159, 229, 231).
4. Applications of chemistry (163-165; questions 201, 239).
5. Adverse effects of chemicals and their control (questions 203, 227) — **no teaching text**.
6. Career prospects (169-195; questions 209, 233).
7. Laboratory apparatuses and their uses (CONTENT line 101, theory 241) — **no teaching text in Week One**; CHEM-INV-T1A places apparatus and uses in Week Two (lines 265-327).

## Scheme mapping and coverage
- Scheme row 1 (line 47, `INTRODUCTION TO CHEMISTRY`, SHA-256 `de25f4dcc88343a6b5d5848b9a015f75bda18e571c9afdc8bb90dc52fcc9a2cd`) equals the week's topic line 93 and maps to this week by title and order. The scheme has no sub-items.
- Package change: **eight** coverage entries in `chemistry.json`, none with lesson ids (no parsed-row id is confirmed because the importer was not run): `COV-CHEM-T1A-W01-SCHEME-1`, `-DEFINITION`, `-BRANCHES`, `-METHOD`, `-APPLICATIONS`, `-CAREERS` (PARTIAL) and `-ADVERSE-EFFECTS`, `-APPARATUS` (UNRESOLVED). Each is PARTIAL or UNRESOLVED because no deliverable lesson exists, the questions have no answers and the factual passages are unverified. All still block delivery. The package stays `PENDING`; no coverage beyond indexing is claimed.

## Findings (source wording retained; nothing corrected)
- The CONTENT list promises an apparatus topic (101) that Week One does not teach; theory question 241 asks for it. It is recorded as UNRESOLVED for this week and not moved to Week Two.
- Questions 203 and 227 ask about adverse effects of chemicals and their control; no sentence in the week supplies either. One bounded follow-up was appended: `CHEM-LES-T1A-W01-ADVERSE-EFFECTS`.
- The scientific-method stage list reads `Observation, Pattern, Problem, Hypothesis, Experiments, Theory, Law` (133-145); only hypothesis, theory and law are explained (149). The reading assignment credits `O.Y Ababio` (217) while the reference list at line 77 credits `Osei Yaw A.` for the title; line 219 reads `Collegs`. Branch and definition wording is retained. One bounded follow-up was appended for later factual verification: `CHEM-FACT-T1A-W01-STATEMENTS`.
- Weekend question 1 (225) offers `Analytical chemistry` as an option; the week names only three branches. Recorded as written.

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: `coverage` goes from `[]` to eight entries. No other field changed.
- `QUEUE.json`: CHEM-IDX-T1A-W01 → `IMPLEMENTED_TESTING_DEFERRED` with its evidence reference; `CHEM-LES-T1A-W01-ADVERSE-EFFECTS` (LESSON) and `CHEM-FACT-T1A-W01-STATEMENTS` (FACTUAL_DEPENDENCY) inserted after `CHEM-FACT-T1A-SAFETY` (PENDING, depend on CHEM-INV-T1A, CHEM-SRC-T1A, CHEM-IDX-T1A-W01); counts, `status_counts` (9 implemented / 97 pending / 1 blocked; 107 items) and `next_runnable` recomputed; one note appended. No other item changed.
- This file. No lesson, rule, correction, asset, answer, shared schema/compiler or other-subject file touched.

## Authoring checks (not tests)
JSON parse with byte-stable re-serialisation; SHA-256 of the whole text, the week range, the scheme row and every section; DOCX XML scan for drawings, text boxes, tables and equations; unique ID and reference checks; kind and status counts recomputed from items; diff inspection.

## Remaining
Weeks Two to Ten, the opening block and the revision/examination markers still need their own indexing; Week Two's apparatus section is the place where the promised apparatus teaching lives. Alias approval items stay owner actions. Next eligible per the queue: `CHEM-CMP-T1`, then `CHEM-IDX-T1A-W02`. Not executed here. This does not claim the subject or class complete.
