# YO-WK-T2-W12 — Yoruba, 2nd Term, Week 12 examination row

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 12 **has no body**: the scheme row is classified as an EXAMINATION marker with a unique anchor, one MARKER coverage entry is added, no open item is raised and no examination content is authored.

## Inputs
- Base: `e2044f6` (the `ss1/yo-wk-t2-w11` tip). Open PRs when work started: #224 (W11 into `ss1/yo-wk-t2-w10`) and #223 (W10 into `ss1/yo-wk-t2-w09`), both part of this stack, plus #225, an owner-opened PR from `ss1/yo-wk-t2-w04` to master that is not part of the stack and was not touched. `origin/master` is `331fa37` and still contains Weeks 1–2 only. This item's PR targets `ss1/yo-wk-t2-w11`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W11` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac`, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically, as noted below.

## Scheme mapping
- The 2nd Term scheme runs from its heading `ILANA ISE OSOOSE FUN SAA KEJI` at line 7 to line 141; the whole list is lines 7–141, SHA-256 `1239d3fde57b34ddf1e8a401d21bb709e3ede3f669daefe4f8e0845b52d95cc7`. Line 141 is the last row and the last non-empty line of the scheme.

| Week | Line | Line SHA-256 | Text | Body |
|---|---|---|---|---|
| 12 | 141 | `aa097f81f0441460a3fe8b00396ccc6ca1cd78fa38dcf732732079b423f43f3d` | `Ose kejila-  Idanwo saa keji.` followed by two spaces and two tab characters | **None** |

- Line 141 is 33 characters including the trailing whitespace (29 after trimming), starts at UTF-8 character offset 2,616 and contains **0 non-ASCII characters**.
- The exact line, whitespace included, occurs **exactly once** in the 2,433-line extraction; the whitespace-trimmed text `Ose kejila-  Idanwo saa keji.` also occurs exactly once. Rows 139–141 form one block, SHA-256 `4d367455936267cd3957e487abe25bdd6ac0177ecd60f90d197b74926e10cdd7`, holding the Week 11 revision row at 139 (disposed of by YO-WK-T2-W11) and this examination row at 141.
- `idanwo` occurs only at 141 and at 529. Line 529 is an illustration sentence inside the Week 1 grammar explanation (`oro ti o ba jeyo leyin yoo,maa,fi ati ti gbodo je oro-ise.Ap ‘Akekoo yoo se idanwo’ ...`) — the word appears inside an example, not in an examination item.
- `kejila` occurs as a standalone word only at 141; its only other occurrence is inside `Ikejila` in the Week 7 number table at 1727 (`Mejila (Mu-eji-le-ewa) 12 ... Ikejila (iko-eji-le-ewa)= 12th`).
- The row is the second of the two week rows with no strand prefix (the other is 139): it names `Idanwo saa keji`, the second-term examination, with no EDE, ASA or LITIRESO content.

## Absence of an examination body
- The teaching body runs from line 149 to the last non-blank line **2423** (SHA-256 `c3123aaff4325becd71368c53f47d732a762342e64faed52963eefc59e474683` for lines 149–2423). It consists of nine `OSE` sections: `OSE KINNI` 149, `OSE KEJI` 855, ` OSE KETA ` 1075, `OSE KERIN` 1303, `OSE  KARUN-UN` 1451, `OSE KEFA` 1611, `OSE  KEJE` 1683, `OSE KESAN-AN` 2017 and `OSE KEWAA` 2221. There is no `OSE` label after 2221 and no week-12 heading.
- The last section `OSE KEWAA` is lines 2221–2423, SHA-256 `4f053c8c065a7260053db902b189ad6ce0c0a1a6a8e165cecd2054fcd44e0bd5`, and closes with `APA KEJI` at 2417–2423. Line 2423, `2. Salaye ise ti oro-oruko n se ninu gbolohun,pelu apeere metameta fun ikookan.`, SHA-256 `ee1f9f2d7e364b6d0c7520b180aa26ff82d3e30de2f34fab1a954a25684ca2e1`, is the **last non-blank line of the document**. Lines 2424–2433 are ten whitespace-only lines (SHA-256 `6b8844255cea6f0490f5ff5bd0e0ffdf587d21cf4d80779f68a6b7c128425b79`).
- There is therefore **no examination heading, no examination paper, no question set, no mark allocation, no time allowance, no mark scheme and no examinations reference**. The only `idanwo` in the body is the example sentence at 529, which belongs to Week 1's auxiliary-verb explanation.
- The parser still yields **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically, not a parser run; the marker therefore cites line numbers and block hashes with `lesson_ids: []`.

## Classification decision
- **Decision: classify the row as a marker, not as an open item.** `backend/src/db/ss1/subjectPackageSchema.ts:15` provides `classify_marker` with `kind` in `REVISION`, `EXAMINATION` and `SCHEME_ONLY`; this row is the examination case, and its anchor occurs exactly once, so it satisfies the completion condition's first branch.
- A source rule is added: `SS1-SRC-ec4a5095420d-R003`, `op: classify_marker`, `kind: EXAMINATION`, anchor set to the exact line 141 including its two trailing spaces and two trailing tabs. The compiler matches rule anchors with a raw, line-boundary substring test (`compiler.ts` `once()`), so the anchor is kept byte-faithful rather than trimmed; trimming it would still match, but the untrimmed line is the unambiguous record of the row.
- Coverage entry `YO-T2-W12-SCHEME-EXAMINATION` (status `MARKER`, `lesson_ids: []`) records the row, the body's end and the classification with three evidence entries. A marker carries no delivery weight: it teaches nothing and no lesson is authored against it.
- No open item is raised: the row carries no teaching, no questions and no reference, so it creates no delivery defect and no content gap. The whole-scheme classification of the twelve rows remains with `YO-PRE-T2-1` (PENDING), and row identity remains with `YO-FND-T2-01` (PENDING).

## Examination cannot erase teaching
- An examination row is a scheme pointer, not a body. It **adds no objective, removes none, and cannot delete, replace or override the teaching already indexed** for Weeks 1–11, which stays bound to its own line ranges and block hashes under `YO-WK-T2-W01..W11`.
- It also cannot stand in for content that is still missing: Week 8's dialect and ajumolo objectives, the Week 9 and Week 10 literature objectives, and Week 10's `Oriki` and `ipolowo pelu ohun enu` remain recorded as absent or partial. An examination week is not evidence that any of them was taught, and no examination can be drawn from teaching that is not yet approved for delivery.
- No examination paper, question, mark scheme or answer key is authored here.

## Row defects and notation
- Line 141 has no non-ASCII character. Its defects are surface only and are recorded, not normalised: a double space between the label and `Idanwo` (`Ose kejila-  Idanwo`), no space after the hyphen, two trailing spaces and two trailing tab characters, and no strand prefix although every teaching row names `Ede`, `Asa` or `Litireso`.
- Because the row is a marker and no lesson is authored from it, no tone-marked or sub-dotted rewrite is needed; the exact line is retained so a later notation decision can correct it without re-extraction.

## Coverage entry added (1)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W12-SCHEME-EXAMINATION` | Scheme Week 12 examination row: `Idanwo saa keji` (second-term examination) | 141; 139–141 | `aa097f81…b423f43f3d`; `4d367455…10cdd7` | MARKER |

## Queue changes
- YO-WK-T2-W12 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed. No items appended.
- Counts: items stay 120; coverage 281 → 282; open items stay 112; source rules 5 → 6; lessons 0; assets 0; notes 35 → 36. Status 31 implemented / 70 pending / 19 blocked; `next_runnable` → `YO-PRE-T2-1`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–12 (14, 15, 18, 18, 16, 14, 17, 9, 17, 17, 1 and 1 coverage entry), states that Week 12 adds a MARKER and no objective, and leaves the 2nd Term preamble and foundation item, and the 3rd Term, outstanding.

## Limits
- Indexing and disposal only: no examination content, no lesson, no asset, no delivery or package-status change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add one source rule and one MARKER coverage entry and to update `YORUBA-OBJECTIVE-INDEXING`.
- Not approved and not verified. The row is retained verbatim, trailing whitespace included; its spelling is not corrected. Weeks 11–12 have no body, so no teaching or examination is claimed for them.
