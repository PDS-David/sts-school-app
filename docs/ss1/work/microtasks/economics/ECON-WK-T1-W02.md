# ECON-WK-T1-W02 - Economics, 1st Term Week 2 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexed under the existing schema; not approved, not verified, nothing deliverable). Testing deferred by owner.

## Inputs
- Base: `origin/master` `aef6f62ffd07387f026c1491d77e8c5fe8c9fbed` (re-checked with `git fetch` before the edit). Both prerequisites are `IMPLEMENTED_TESTING_DEFERRED`: `ECON-SRC-T1` and `ECON-INV-T1`. The Week 1 indexing (`ECON-WK-T1-W01`) and the Week 1 why-study lesson are on master and were left untouched.
- Source `SS1-SRC-2ab0c50bcab6`, member `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc`, 1,264,128 bytes, SHA-256 `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc` **verified** on the single attached file (the uploaded name differs; the hash decides). The composite archive was not supplied, so its hash was not re-verified in this session.
- Read with `word-extractor` 1.0.4 `extract(path).getBody()` in a private scratch directory: 53,430 characters, 1,060 lines, text SHA-256 `026eeec9b2b8a68bba6bed3719a921e08030d56b2bb4cfdafd40352133e5037e`; Week Two lines 117-169 SHA-256 `9e6974c4a9cbd17d6cca9dcbb21d80306a04589f8c67a8e3f6860664bd70f5e8`; scheme table lines 24-36 `0f6909d39c1b1a1488935604f59ace2b45823507d9d95d0786428aa5f6d5a03f`; Week 1 definition line 54 `516018a5fb0870513529e212219b90c85b12baa8b8c97c70c67c91cfa9ff18e9`. All equal the values recorded by `ECON-INV-T1` and `ECON-WK-T1-W01`.
- Files read before editing: the schema, the contract, `compiler.ts`, the business worker note, `SOURCE_ASSIGNMENTS.csv`, `economics.json`, the Economics `QUEUE.json`, `ECON-INV-T1.md`, `ECON-SRC-T1.md` and the Week 1 record. No `AGENTS.md` was consulted beyond the prompt. Source documents and private extracts stay outside Git.

## Locator method (unchanged from ECON-INV-T1)
Line numbers are 1-based over `getBody()` text split on `\n`. A block runs from its heading to the last non-blank line before the next heading; the SHA-256 is over those lines joined with `\n`, UTF-8, edge blanks trimmed. A single-line locator hashes that line exactly as extracted, tabs and trailing spaces included. Line 122 (seven spaces) and line 171 (two tabs) are blank separators.

## Week 2 structure as indexed
| Block | Lines | SHA-256 |
|---|---|---|
| WEEK TWO marker and topic line | 117-118 | `5d3bd68b0e2d1b80980efb3211aa5dc445f14875f2676df525c210ccfc4fc37a` |
| CONTENT outline (two items) | 119-121 | `d3b7fe00e31f1a002683b20b2b89a7d2971d5b5e36a005517cea0ed56203f3e5` |
| ECONOMICS AS A SOCIAL SCIENCE (method 124, claim 125, five reasons 126-130, conclusion 131) | 123-131 | `a20124fe00656f514a9e42922ade76dfe6644abd363c387a6854184e4d868753` |
| EVALUATION (heading and 2 questions) | 133-135 | `f11432db267044717880501f413c23e6d78b7b9515b760a6ffb14fe23a4c0434` |
| CAREER PROSPECT FOR STUDYING ECONOMICS (intro 138, five items 139-143) | 137-143 | `1a87138fab54e0ea63a61059691393d4cb5f655aed46230be9c76b3b2a50d8d7` |
| EVALUATION (heading and 2 questions) | 145-147 | `a59ab3f1e981fc770f0316c0d487b5153d187ed7a2762863d81e95a6c15b2066` |
| READING ASSIGNMENT (one textbook page) | 149-150 | `b9b57d5d529d22d390869125f5e45ca747dddf0499f18274c473c6ba2f852a78` |
| GENERAL EVALUATION QUESTIONS (heading and 5 questions) | 152-157 | `2296d00125094242e950181a5ce512fe692415d905a9f5638539fc7d9eabcaa2` |
| WEEKEND ASSIGNMENT (heading and 5 multiple-choice items over 6 lines) | 159-165 | `c422685f7b2ecedf774c89d20f22e9140658bcb8122bd15dcc6dbd80ca7ea0fc` |
| SECTION B (heading and 2 questions) | 167-169 | `66a0fd4b749def28fbea5333785bd6743babd99831f25815affb662838ac9415` |
| Whole WEEK TWO body | 117-169 | `9e6974c4a9cbd17d6cca9dcbb21d80306a04589f8c67a8e3f6860664bd70f5e8` |

The marker `WEEK TWO` sits at line 117 and `WEEK THREE` at line 172. Blank separators: 122 (whitespace only), 132, 136, 144, 148, 151, 158, 166, 170.

## Coverage written in economics.json (12 entries: 5 PARTIAL / 7 UNRESOLVED / 0 SUPPORTED)
All entries have `source_id` `SS1-SRC-2ab0c50bcab6` and `lesson_ids: []`. No SUPPORTED entry exists because Week 2 has no original lesson id to reuse and no lesson authored for it.
- `COV-ECON-T1-W02-SCHEME-2` - PARTIAL - scheme row 2 (line 26); names only the classification, not career prospects.
- `COV-ECON-T1-W02-SCIENCE-METHOD` - PARTIAL - line 124: observation, classification, generalisation of law, application, ceteris paribus.
- `COV-ECON-T1-W02-SOCIAL-SCIENCE-REASONS` - PARTIAL - lines 125-130: the claim and five reasons.
- `COV-ECON-T1-W02-SCIENCE-CONCLUSION` - PARTIAL - line 131.
- `COV-ECON-T1-W02-CAREER-PROSPECT` - PARTIAL - lines 137-143: introduction and five items, undated and open-ended.
- `COV-ECON-T1-W02-ART-OPTION` - UNRESOLVED - the Art option is named and denied (line 125) but never taught.
- `COV-ECON-T1-W02-EVALUATION-1`, `-EVALUATION-2`, `-READING-ASSIGNMENT`, `-GENERAL-EVALUATION`, `-WEEKEND-ASSIGNMENT`, `-SECTION-B` - UNRESOLVED - no key, marks or rights position in the source.

No entry was upgraded on the strength of the scheme heading, the CONTENT outline or one matching objective.

## Question census (16 questions, one reading pointer; none answered)
Exact wording as extracted (a tab shown as a space); per-line digests identify the exact bytes.

| Line | Where | Wording | SHA-256 |
|---|---|---|---|
| 134 | EVALUATION 1, Q1 | 'Economics is a science, explain.' | `d9a85658188cc6a79597365db934d9fdcd0827dd4487a75a01f02bcb117e8f0d` |
| 135 | EVALUATION 1, Q2 | 'Give two reasons why economics is regarded as a social science' | `2656c2ebd3c7d626c45cc8a6c549ead572c5694752758ef4a7226977c0d43bac` |
| 146 | EVALUATION 2, Q1 | "How is the study of economics relevant to individual's career prospect?" | `9ae5c384cc3dda6078430ad6f2348332a2622f3e048de24d66a1fe91e88e32fd` |
| 147 | EVALUATION 2, Q2 | 'Itemize the career opportunities that are opened to an economist .' | `7350294bb40c3d14c7487816a53fa3b304c5f2caa6ec25d5ae7c95d1f91b130c` |
| 153 | GENERAL EVALUATION, Q1 | 'What is behavioral Science?' | `ab9aff7ce8098c69e6877805fe915639424a00f70611a0a4db71b2f8dde2a5ea` |
| 154 | GENERAL EVALUATION, Q2 | 'Define Economics according to Adams Smith.' | `35151a64b5b49d57567c15a409a42472e1a4dae3d64bfce24071bea9feedd026` |
| 155 | GENERAL EVALUATION, Q3 | 'List other subjects related to Economics.' | `ee0a42799e8388e434863c1aa772f7385ac07cdb474b8cd8ef52854ba03a2a7d` |
| 156 | GENERAL EVALUATION, Q4 | 'Define the term Economic rent.' | `04b6bbca2fad0f09d24c464d51a7333873025225db0c5f1bfcf32aca0bbc16d9` |
| 157 | GENERAL EVALUATION, Q5 | 'Who are the principle economic unit in any  system? ' | `f56e305c039f64d97e8438396b9a7b23968728e73e97a72e3ca7e26fc15f21c1` |
| 160 | WEEKEND item 1 | '1.  In order to reach a sound conclusion about human behaviour, economics relies on the findings of other........... (a) commercial subjects (b) arts subjects (c) pure science subjects (d) social science subjects' | `5e405371b75029b3bb839f87290bd06177f9e91786c4a4ae06d99ae324b2b6a1` |
| 161 | WEEKEND item 2 (stem) | '2.   Unlike pure science, the generalized law in economics is majorly based on .......... ' | `017149940a3f0203bf9d10f192e35d2baaa4d9cfcc2f0367446c14516c400bb3` |
| 162 | WEEKEND item 2 (options) | '(a) certainty (b) probability (c) precision (d) accuracy' | `5115066b4918d01a49fd61fce9522ceca1c84573a453b1690c378799887aeb7d` |
| 163 | WEEKEND item 3 | '3.   Career prospect in the study of economics means.............. (a) employment avenue (b) fraudulent avenue (c) job scarcity (d) wealth distribution' | `7d7ab2512888d400e54e418f3fcd82e76b0f6390d443867af68c2230c97d04f4` |
| 164 | WEEKEND item 4 | '4.   Economics is often described as a science because it   (a) adopts the use of laboratory experiments   (b) uses scientific method to explain observed phenomena (c) deals with observation and field work   (d) involves accurate prediction of human beings' | `2f2839aa67ef85d652e5aee47ee39044d6b5c2d08b3268bf660b06a5745c6e54` |
| 165 | WEEKEND item 5 | '5.  Economics as a field of study is a ........ (a) pure science (b) political science (c) social science (d) physical science' | `7c76ed17a575354065270346f4038e1a5270a70fec8997e3975ed534721fe7f6` |
| 168 | SECTION B, Q1 | 'Write short note on the career prospect for studying economics' | `37583283144b0ce680f9fcdeb0946e2d6522664a47c51ac576834d7a8d987941` |
| 169 | SECTION B, Q2 | 'Economics is a science, discuss in two paragraphs.' | `7838090cb43a55d7c560c72388425a4a80c6de36a820731d1476f11a3d8cd05b` |

- Reading pointer: line 150, SHA-256 `8a586ae88f8526ec487767d5e6de0e42ce06333e6d5b570cf1cf054353c85351`.
- No THEORY heading and no West Africa question occurs in lines 117-169 (the West Africa question is in Week Three at 231). A case-insensitive scan of 117-169 for answer, marking, marks, score, rubric and scheme of mark returns 0 hits, so no key, marks or marking wording exists. No option letter was marked correct.

## What the source does not teach (searched across the whole extract)
- Art: whole-word hits at lines 26, 118, 120, 125 and 160 only; no line defines or illustrates art as a classification.
- behavioral science: line 153 only; behaviour is used at lines 60, 65, 66, 69, 77, 84, 87, 130 and 160 but never defined as a science.
- economic rent: line 156 only; rent otherwise appears as the reward of land in Week Nine (lines 849, 888, 907, 978) with no definition.
- economic unit: line 157 only; lines 77 (individuals, household and firms) and 84 (the individual, firm and government) give two different sets.
- inductive and deductive: line 131 only; neither method is defined.
- Answerable from earlier text but not in Week 2: question at line 154 (Adam Smith, Week 1 line 54) and line 155 (related social sciences, Week 1 line 65).

## Open items written (9 new; 6 block delivery)
`ECONOMICS-T1-W02-COVERAGE`, `-ART-NOT-TAUGHT`, `-CLASSIFICATION-WORDING`, `-UNANSWERED-QUESTIONS`, `-ASSESSMENT-NO-KEY`, `-READING-RIGHTS` (blocking); `-CAREER-LIST-UNDATED` (FACT), `-OVERLAPPING-QUESTIONS`, `-SOURCE-DEFECTS` (non-blocking). The three alias `OWNER_ACTION` items and all Week 1 items are untouched, so `open_items[]` holds 22 entries.

## Queue edits
- `ECON-WK-T1-W02` set to `IMPLEMENTED_TESTING_DEFERRED` with an implementation reference; its other fields are unchanged.
- Appended `ECON-FACT-T1-W02-TEACHER-DECISIONS` (BLOCKED, seven numbered decisions) and the lesson tasks `ECON-LES-T1-W02-SCIENCE-SOCIAL-SCIENCE`, `ECON-LES-T1-W02-CAREER-PROSPECT`, `ECON-LES-T1-W02-UNTAUGHT-TERMS` and `ECON-LES-T1-W02-KEY-ASSESSMENT` (PENDING). `ECON-FACT-T1-DATED-EXAMPLES` already depends on this week and is unchanged.
- `counts`, `status_counts` and `next_runnable` recomputed from the items: 62 items, {IMPLEMENTED_TESTING_DEFERRED: 8, PENDING: 51, BLOCKED: 3}. The derivation rule (PENDING, not a TEST, every dependency IMPLEMENTED_TESTING_DEFERRED, in item order) reproduced the stored list except that the stored 38-entry list included the deferred `ECON-TEST-PACKAGE`; this task's rules exclude deferred TEST tasks, so the new list has 37 entries: `ECON-WK-T1-W02` and `ECON-TEST-PACKAGE` left, `ECON-LES-T1-W02-CAREER-PROSPECT` entered. One note appended.

## Checks performed
- Attachment SHA-256 recomputed; extraction re-run and equal to the recorded character count, line count and text digest; Week Two and scheme-table digests equal `ECON-INV-T1`.
- Every SHA-256 written into the package, queue and this record was re-derived by an independent verifier from the range printed beside it.
- JSON parses; the schema was mirrored by hand (strict keys, status and kind vocabularies, non-blank text, non-empty `affected_ids`); duplicate-id guard on coverage, open items and queue items; reference guard on every `affected_ids` value and every id quoted in the new queue items.
- Source-census guards recomputed from the extract: 16 questions, the 6 weekend lines, the hit lists for art, behavioural science, rent, economic unit, inductive and deductive, and the 0-hit key scan.
- `git status` shows exactly three changed paths.

## Not done / remaining gaps
- No lesson, coverage upgrade, correction, asset, rule or source edit; `lessons[]` is unchanged, `package_status` stays PENDING. Week 2 is indexed, not taught and not certified.
- Importer, plan build, schema parse, tests, typechecks, database and deployment were not run (deferred by owner).
- Owner actions needed: the seven `ECON-FACT-T1-W02-TEACHER-DECISIONS` decisions, the Longe edition and rights (with Week 1), and content approval before any lesson is deliverable.
