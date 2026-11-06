# ECON-LES-T1-W01-WHY-STUDY — Economics, 1st Term Week 1 "why we study Economics" lesson

Status: **IMPLEMENTED_TESTING_DEFERRED** (authored and bound; content approval PENDING, verification DEFERRED; not approved, not tested). Testing deferred by owner. Week 1 is **not** complete: 4 teaching sections stay PARTIAL and 7 assessment or reading blocks stay UNRESOLVED, and `ECONOMICS-T1-W01-COVERAGE` still blocks delivery.

## Inputs
- Starting SHA: `903db84cd4ad481a6b7ef00cb952ef3a60297320` (origin/master fetched 2026-11-06; `gh pr list --state open` returned 0 open PRs — #338 for FM-PORT-D3-L002 was merged at 04:47:09Z, so nothing overlapped the two Economics write paths). Prerequisites `ECON-WK-T1-W01` and `ECON-SRC-T1` are both IMPLEMENTED_TESTING_DEFERRED.
- No `AGENTS.md` is tracked in the repository (`git ls-files` returns 0); `docs/ss1/contracts/CONTRACT.md` (coverage vocabulary and the rule that PARTIAL and UNRESOLVED block delivery) and `backend/src/db/ss1/subjectPackageSchema.ts` were read for the field order, enums and the marking-arithmetic rule.
- Required files read in this run: `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`, `backend/src/db/ss1/subjects/economics.json`, `docs/ss1/work/microtasks/economics/QUEUE.json`. The Week 1 index `docs/ss1/work/microtasks/economics/ECON-WK-T1-W01.md` was used as evidence; the source document was **not** re-audited — only lines 83–95 were read from the already-verified extract.
- Required attachment verified against the QUEUE item: archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e) — the **standalone member** `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc` was used and re-hashed in this run to `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc` at 1,264,128 bytes. The member copy, the extract and every private working file stayed outside Git.

## Changes
- `backend/src/db/ss1/subjects/economics.json`: first lesson in the package — `SUP-SS1-ECONOMICS-T1-W01-WHY-STUDY` (33 body lines / 6753 characters, body SHA-256 `57d1e48f9976c6b8b52e330a25dc90f887b146879f8ebee38122672bf7cf6254`), 3 objectives, 4 answered practice items `E1W1-Q1`, `E1W1-Q2`, `E1W1-Q3`, `E1W1-Q4` worth 12 + 7 + 2 + 6 = 27 marks, 2 provenance entries (url null, reuse_status PERMITTED), state PENDING / IMPLEMENTED / DEFERRED with both references null.
- Coverage `COV-ECON-T1-W01-WHY-STUDY`: PARTIAL → **SUPPORTED**; `objective`, `objective_locator` and the two original evidence entries are byte-identical and two entries are appended — one binding the lesson body digest and the seven reason locators, one stating that the model answer and its marks are proposals and that the unemitted parsed-row identity is deliberately not bound. `lesson_ids` now `[SUP-SS1-ECONOMICS-T1-W01-WHY-STUDY]`. Package coverage rows now read 1 SUPPORTED / 4 PARTIAL / 7 UNRESOLVED.
- Open item `ECONOMICS-T1-W01-COVERAGE`: `detail` rewritten so the 2026-11-05 "no lesson at all" statement is dated past and the current counts are stated; `required_action` keeps the no-upgrade-before-a-real-lesson rule and applies it to the remaining entries; `affected_ids` already named this row and is unchanged in content. It **stays blocking** (`blocks_delivery: true`).
- Open item `ECONOMICS-T1-W01-PARSED-ROW-MISSING`: `detail` unchanged (it still records that the compiler never emitted `SS1-SRC-2ab0c50bcab6:BODY:4506372278dd…`); `required_action` no longer asks every entry to keep `lesson_ids` empty — it now says no entry binds the unemitted row identity, and this entry binds only its own lesson id. `affected_ids` gains `COV-ECON-T1-W01-WHY-STUDY`. Stays non-blocking.
- The other 11 open items, the other 11 coverage entries, the 3 sources, the 3 `source_alias` rules, `assets` (0) and `delivery_corrections` (0) are untouched, as is `package_status` (PENDING). No blocker was closed and no source row was edited.
- `docs/ss1/work/microtasks/economics/QUEUE.json`: item → IMPLEMENTED_TESTING_DEFERRED, only its `status` and `implementation_reference` changed; `status_counts` recomputed to {"IMPLEMENTED_TESTING_DEFERRED":7,"PENDING":48,"BLOCKED":2} (sums to 57 items); `next_runnable` recomputed by the rule that reproduces master exactly (PENDING items whose `depends_on` are all complete) — 38 ids, master's ECON-LES-T1-W01-WHY-STUDY dropped and nothing added; one note appended and the previous 13 kept verbatim; `counts`, `review`, `generated_from`, `queue_version`, `subject`, `slug` and `status_vocabulary` unchanged.

## What the lesson teaches
- The framing line (line 84): Economics as a social science, studying the behaviour of the individual, the firm and the government in the ordinary business of life.
- All seven reasons, each with the line that states it — line 85, line 86, line 87, line 88, line 89, line 90, line 91 — restated in newly written wording. The source prints them as one un-numbered list; no numbers, examples, figures, occupations or career promises were added, because Week 1 supplies none for this topic.
- A reason-to-reader grouping (student: 85, 86, 89; government: 88; economy as a whole: 87, 90, 91) that the body labels inside the lesson as a study aid written for this lesson, not the source arrangement.
- The two-paragraph model answer for the EVALUATION demand at line 94, how it is built, and a criterion-based marking guide; the lesson states in the body and in provenance that Week 1 prints no answer, no mark allocation and no key, so the model and the marks are proposals awaiting the teacher.
- What is deliberately **not** answered: the line 95 attribution question (held open by `ECONOMICS-T1-W01-DEFINITION-ATTRIBUTIONS`), the WEEKEND ASSIGNMENT options and SECTION B (no key exists — `ECONOMICS-T1-W01-ASSESSMENT-NO-KEY`), and how to work the topic in class.

## Claim-to-evidence map
| Claim in the lesson | Where the evidence sits |
|---|---|
| Seven reasons at lines 85–91, printed un-numbered, one per line | Extract lines re-hashed this run: block `80c18eddb4c9dd99a34532880bc036a5a1e471876759443c07f7f4553fc96c74`, per-line digests recorded verbatim in the coverage evidence and provenance entry 2 |
| The framing sentence names three agents | Line 84 of the verified extract, quoted nowhere in the lesson; recorded in the lesson body with its locator |
| Line 94 asks for the reasons in two paragraphs | Line 94 SHA-256 `e896b86c3f66f3f700efd7b8a1748f20415ba726506770393ce5d5bd0eb63c10`, the locator the queue item cites |
| Week 1 prints no answer, mark allocation or key | `ECONOMICS-T1-W01-ASSESSMENT-NO-KEY` records the search of lines 44–116; re-checked in this run with a word-boundary scan for marking/marks/score/rubric/key — no hit ("market" at line 77 and "allocation" at line 91 are the only substring collisions) |
| No reason is materially inaccurate | Each restatement was compared with its line; the causal phrasing at line 88 and the "positions" claim at line 85 are taught as the source's own stated reasons, attributed and located, not as verified facts |
| Model answer, marks, criteria and the four exercises | Newly authored for this project (provenance entries 1 and 2); no printed exercise is copied as a key |

## Decisions deliberately left to the owner
- Approval of the model answer and of the 27-mark allocation, and whether line 94 is marked from these criteria at all (`content_approval` stays PENDING; drafting a lesson is not teacher certification).
- The answer key for the eighteen unanswered Week 1 questions — `ECON-LES-T1-W01-KEY-ASSESSMENT`, untouched here.
- Whether the four remaining Week 1 section lessons are authored in the queue order already recorded, and the seven teacher decisions listed in `ECON-FACT-T1-W01-TEACHER-DECISIONS`.
- The alias approvals (`ECONOMICS-ALIAS-APPROVAL`, `-T2`, `-T3`) and the Longe reading-assignment rights position, all still blocking.

## Checks (authoring checks, not tests)
- Both edited JSON files parse; serialisation stays pure CRLF with a single trailing newline; the package re-reads identically after parse and re-serialise.
- The schema-shape mirror of `backend/src/db/ss1/subjectPackageSchema.ts` reports no errors on the edited package (lessons 1, coverage 12, open_items 13); the lesson id matches `^SUP-SS1-[A-Z0-9]+(?:-[A-Z0-9]+)*$`, field order matches the schema, marks are positive integers and every criterion list sums to its item.
- `body_sha256` recomputed from the exact UTF-8 body: `57d1e48f9976c6b8b52e330a25dc90f887b146879f8ebee38122672bf7cf6254`.
- Generator guards refused to write unless each claim re-derived: the seven per-line digests, the block and exercise digests, the member digest, all seven `(line NN)` locators present, the 27 = 12 + 7 + 2 + 6 arithmetic, no country/currency/occupation/career-promise wording in the body, the two-paragraph model shape, the coverage vocabulary, and the immutability of sources, rules, assets, corrections and every other record.
- Originality: a sliding-window scan of normalised text found **no 30-character run** of the source row anywhere in the body, practice, answers, objectives or title, matching the convention measured on master's own lessons.
- Leak scan over the added text only: no credential, no absolute local path, no temp-directory or scratch reference, no source sentence reproduced. The private extract is not in the repository and no attachment byte was committed.
- Independent verifier re-derived the four source digests from the extract, re-checked the diff scope against `origin/master`, the coverage/queue arithmetic and the record figures.
- No typecheck, test suite, importer, database, device or deployment run; automatic CI not disabled.

## Remaining
- Content approval PENDING, verification DEFERRED, release gates unchanged; nothing about Week 1 is certified and the package is not deliverable.
- The importer has never been run for this source, so the parsed-row identity and its `body_sha256` remain unverified (`ECONOMICS-T1-W01-PARSED-ROW-MISSING`).
- 4 teaching sections (definitions, scope, branches, scheme row) and 7 assessment or reading blocks are unchanged; this task closes only the reasons-for-studying gap.
- The model answer is written for the two-paragraph demand at line 94 only; if the teacher wants a different paragraph split (for example all seven reasons in one paragraph and the framing sentence in the other), the marking criteria must be rewritten with it.
- Nine of the thirteen open items still block delivery, including three alias approvals and the reading-assignment rights position.
