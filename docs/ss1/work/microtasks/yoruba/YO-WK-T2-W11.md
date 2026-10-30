# YO-WK-T2-W11 — Yoruba, 2nd Term, Week 11 revision row

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 11 **has no body**: the scheme row is classified as a REVISION marker with a unique anchor, one MARKER coverage entry is added, no open item is raised and no revision content is authored.

## Inputs
- Base: `c3fcf5c` (the `ss1/yo-wk-t2-w10` tip). PR #223 is open against `ss1/yo-wk-t2-w09` and is the only open PR. The owner has merged #222 (W09 into W08), #220 (W08 into W07), #218, #216, #215, #213, #212, #211 and #219, and merged #221 into master at `331fa37`; `origin/master` still contains only Weeks 1–2, so Weeks 3–10 exist only in the stacked branches. This item's PR targets `ss1/yo-wk-t2-w10`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W10` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac`, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically, as noted below.

## Scheme mapping
- The 2nd Term scheme is headed `ILANA ISE OSOOSE FUN SAA KEJI` at line 7 (SHA-256 `a0b97e0f1529e5e76c45a2bbc346c526b4fdb1334ad63c0abf65d04660f10130`) and runs to line 141; the whole list is lines 7–141, SHA-256 `1239d3fde57b34ddf1e8a401d21bb709e3ede3f669daefe4f8e0845b52d95cc7`. It holds twelve week rows, of which the last two are the disposal targets of this task and YO-WK-T2-W12.

| Week | Line | Line SHA-256 | Text | Body |
|---|---|---|---|---|
| 11 | 139 | `c8639358723f993c5605c822e3392ca3a6f4a772825dfa509886c158d9f31027` | `Ose kokanla- Agbeyewo ise saa keji lapapo..` | **None** |
| 12 | 141 | `aa097f81f0441460a3fe8b00396ccc6ca1cd78fa38dcf732732079b423f43f3d` | `Ose kejila-  Idanwo saa keji.` (trailing tabs) | **None**; belongs to YO-WK-T2-W12 |

- Rows 139–141 form one block, SHA-256 `4d367455936267cd3957e487abe25bdd6ac0177ecd60f90d197b74926e10cdd7`. Line 139 is 43 characters, starts at UTF-8 character offset 2,571, contains **0 non-ASCII characters** and has no trailing whitespace.
- The row is the only week row with no strand prefix: the other eleven name `Ede`, `Asa` or `Litireso`, whereas 139 names `Agbeyewo ise saa keji lapapo` — revision of the whole second term's work, all strands at once.
- The exact string occurs **exactly once** in the 2,433-line extraction, and exactly once case-insensitively as well. `agbeyewo` and `lapapo` occur only at 139. `kokanla` occurs as a standalone word only at 139; its only other occurrence is inside `Ikokanla` in the Week 7 number table at 1725 (`Mokanla (mu okan-le-ewa) 11 ... Ikokanla (Iko-okan-le-ewa) 11th`). `saa keji` occurs at 7, 139 and 141 only.

## Absence of a revision body
- The teaching body runs from line 149 to the last non-blank line **2423** (SHA-256 `c3123aaff4325becd71368c53f47d732a762342e64faed52963eefc59e474683` for lines 149–2423). It consists of nine `OSE` sections: `OSE KINNI` 149, `OSE KEJI` 855, ` OSE KETA ` 1075, `OSE KERIN` 1303, `OSE  KARUN-UN` 1451, `OSE KEFA` 1611, `OSE  KEJE` 1683, `OSE KESAN-AN` 2017 and `OSE KEWAA` 2221. There is no `OSE` label after 2221 and no week-11 heading.
- The last section `OSE KEWAA` is lines 2221–2423, SHA-256 `4f053c8c065a7260053db902b189ad6ce0c0a1a6a8e165cecd2054fcd44e0bd5`, and closes with `APA KEJI` at 2417–2423. Line 2423, `2. Salaye ise ti oro-oruko n se ninu gbolohun,pelu apeere metameta fun ikookan.`, SHA-256 `ee1f9f2d7e364b6d0c7520b180aa26ff82d3e30de2f34fab1a954a25684ca2e1`, is the **last non-blank line of the document**. Lines 2424–2433 are ten whitespace-only lines (SHA-256 `6b8844255cea6f0490f5ff5bd0e0ffdf587d21cf4d80779f68a6b7c128425b79`).
- There is therefore **no revision heading, no revision exercise set, no revision answer key and no revision reference**. The only reference in the last section is the Week 10 textbook at 2393.
- `atunyewo` occurs only at 9 (week 1 scheme row, `Ede-Atunyewo awon isori oro`), 93 (week 8 scheme row, `Atunyewo eko lori eka ede Yoruba; Ijesa, Ekiti,Oyo.abbl.`) and 151 (the Week 1 body heading `ORI-ORO-;ATUNYEWO AWON ISORI ORO`). All three are revision of earlier work inside a specific week; none is a term-wide revision and none sits near week 11 or 12.

## Classification decision
- **Decision: classify the row as a marker, not as an open item.** The package schema already provides the exact construct: `backend/src/db/ss1/subjectPackageSchema.ts:15` defines `classify_marker` with `kind` in `REVISION`, `EXAMINATION` and `SCHEME_ONLY`. The row is a week-11 revision pointer whose anchor occurs exactly once, so it satisfies the completion condition's first branch.
- A source rule is added: `SS1-SRC-ec4a5095420d-R002`, `op: classify_marker`, `kind: REVISION`, `anchor: "Ose kokanla- Agbeyewo ise saa keji lapapo.."`, `source_sha256` the member digest. This is data under the existing schema, following the 1st Term precedent `SS1-SRC-48b641249e3b-R002`; it adds no new schema, compiler or parser feature.
- Coverage entry `YO-T2-W11-SCHEME-REVISION` (status `MARKER`, `lesson_ids: []`) records the row, the body's end and the classification with three evidence entries. A marker carries no delivery weight: it teaches nothing and no lesson is authored against it.
- No open item is raised. The row carries no teaching, no exercise and no reference, so it creates no delivery defect and no content gap; its surface defects are recorded below rather than converted into a blocking item. The scheme-wide classification of all twelve rows remains with `YO-PRE-T2-1` (PENDING), and row identity remains with `YO-FND-T2-01` (PENDING).
- The parser still yields **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically, not a parser run. The marker therefore cites line numbers and block hashes, with `lesson_ids: []`.

## Revision cannot erase teaching
- A revision row is a scheme pointer, not a body. It **adds no objective, removes none, and cannot delete, replace or override the teaching already indexed** for Weeks 1–10, which stays bound to its own line ranges and block hashes under `YO-WK-T2-W01..W10`.
- It also cannot stand in for content that is still missing: Week 8's dialect and ajumolo objectives, the Week 9 and Week 10 literature objectives, and Week 10's `Oriki` and `ipolowo pelu ohun enu` stay recorded as absent or partial. "Revision week" is not evidence that any of them was taught.
- No revision lesson, exercise, answer key or summary is authored here. Revision teaches nothing new and would have to be built from the Weeks 1–10 body, which is indexed but not yet approved for delivery.

## Row defects and notation
- Line 139 has no non-ASCII character. Its defects are surface only and are recorded, not normalised: a space before the hyphen and none after (`kokanla- Agbeyewo`), `kokanla` with no tone mark and no hyphen although the Week 7 table writes the ordinal as `Ikokanla`/`okan-le-ewa`, a double full stop (`lapapo..`), and `Agbeyewo` where the scheme's own revision rows at 9 and 93 use `Atunyewo`.
- Because the row is a marker and no lesson is authored from it, no tone-marked or sub-dotted rewrite is needed here; the spelling is retained verbatim so a later notation decision can correct it without re-extraction.

## Coverage entry added (1)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W11-SCHEME-REVISION` | Scheme Week 11 revision row: `Agbeyewo ise saa keji lapapo` (revision of the whole 2nd Term) | 139; 139–141 | `c8639358…d9f31027`; `4d367455…10cdd7` | MARKER |

## Queue changes
- YO-WK-T2-W11 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed. No items appended.
- Counts: items stay 120; coverage 280 → 281; open items stay 112; source rules 4 → 5; lessons 0; assets 0; notes 34 → 35. Status 30 implemented / 71 pending / 19 blocked; `next_runnable` → `YO-WK-T2-W12`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–11 (14, 15, 18, 18, 16, 14, 17, 9, 17, 17 and 1 coverage entry), states that Week 11 adds a MARKER and no objective, and leaves Week 12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing and disposal only: no revision content, no lesson, no asset, no delivery or package-status change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add one source rule and one MARKER coverage entry and to update `YORUBA-OBJECTIVE-INDEXING`.
- Not approved and not verified. The row is retained verbatim; its spelling is not corrected. Weeks 11–12 have no body, so no teaching is claimed for them, and the Week 12 examination row is left untouched for `YO-WK-T2-W12`.
