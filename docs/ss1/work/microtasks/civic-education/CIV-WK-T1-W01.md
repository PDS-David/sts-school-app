# CIV-WK-T1-W01 - Civic Education, 1st Term, Week 1 (source-section index)

Status: **IMPLEMENTED_TESTING_DEFERRED** - evidence-only section index. This item is **not** a lesson, not coverage, not a rule, not a correction and not an approved teaching week. Nothing was written to `backend/src/db/ss1/subjects/civic-education.json`, whose `package_status` stays `PENDING` with 0 coverage rows. Testing deferred by owner.

## Inputs
- Branch `ss1/civ-wk-t1-w01`, cut from the current `origin/master` `ffef576` (the merge of PR #330, Commerce), with a clean working tree. Open PRs at the time of writing: #331 `ss1/econ-wk-t1-w01` (Economics) and #332 `ss1/dp-wk-t1-w01` (Data Processing) - each confined to its own subject package, queue and record, so neither owns either path this item may write, and no other branch or agent holds Civic Education work: comparing every remote branch with `origin/master` at their merge base introduces `microtasks/civic-education` files on none of them, and the six `civ` branches already in the remote history - `ss1/civ-src-t1`, `ss1/civ-src-t2-20261028`, `ss1/civ-src-t3-20261028-b`, `ss1/civ-inv-t1-20261029`, `ss1/civ-inv-t2-20261030`, `ss1/civic-education-queue` - are all merged. No `AGENTS.md` or `QODER.md` exists in the repository. Civic work already on master: `CIV-SRC-T1/T2/T3`, `CIV-INV-T1` and `CIV-INV-T2` are `IMPLEMENTED_TESTING_DEFERRED`; `CIV-WK-T1-W01` itself was `PENDING` with the reference "Not started.", so this is not a duplicate of completed work.
- Source `SS1-SRC-fe52495abec9`; member `SSS 1/1st Term SS1_/CIVIC SSS1.docx`, 24,152 bytes, SHA-256 `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a` - **recomputed from the supplied standalone attachment** and equal to the queue item and to `CIV-INV-T1`. The archive hash was taken from the queue attachment as recorded; the composite archive itself was not needed.
- Extraction: `mammoth` 1.12.2 `extractRawText` in a private scratch directory; text SHA-256 `5c13b2993572de127842693962da27c4f82085bd11dd1085d8c8015b53d0182d`, 20,117 characters, 511 lines - equal to the value `CIV-INV-T1` records, so the same text view is being indexed and no renumbering was required. Member, text and extracts stay outside Git.
- Read before editing: `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/subjects/civic-education.json`, `docs/ss1/work/microtasks/civic-education/CIV-INV-T1.md` and this subject `QUEUE.json`.

## Locator rule (CIV-INV-T1's, re-verified rather than re-used on trust)
Line numbers are 1-based over the `extractRawText` output split on `\n`. A week runs from its `WEEK ...` marker line to the line before the next marker, and the range digest is SHA-256 over those UTF-8 lines joined with `\n`, **untrimmed, no trailing newline** - that is the convention that produces the queue hash, and it was confirmed here: lines `121-172` = `ed1a4c1908619ef6e710bffb3e95bdf5c7b5f500d9dd97e3e80f2610846cd275`, byte-for-byte the value in `week_or_locator` and in the completion condition. Week 1 sits between markers `WEEK ONE` (121) and `WEEK TWO` (173); the eight markers are at 121, 173, 211, 245, 275, 371, 393 and 433, as `CIV-INV-T1` records.
Two properties of the untrimmed rule matter for this week and are recorded rather than smoothed out:
- Line 121 is `WEEK ONE ` **with a trailing space** - the only one of the eight markers that carries one, and the paragraph keeps it through `<w:t xml:space="preserve">`. Any digest or exact-match rule over markers must preserve it; trimming it changes the week hash.
- Each of the four section ranges below happens to be equal raw and trimmed because it starts on a heading and ends on prose, so section digests are unambiguous. They are given raw, and all four were checked against their trimmed form before being written here.

## Week 1 sections as indexed

| Block | Lines | SHA-256 |
|---|---|---|
| Marker + topic line | `121-123` | `e70f912107e9c57909d0caabcb243e8501bbd091938f5aeb3fa65571bb095cbd` |
| Definition (2 paragraphs, no heading) | `127-129` | `a434dabe129cbf80aa2de41347a726734655a6e00183634b882059b6c4be2669` |
| `NEEDS FOR CIVIC EDUCATION` (heading + 5 points) | `131-141` | `88f7096e5a42485a5a39015f169dd0b0f7821bb1c74291e5995ebf1943638726` |
| - the five points alone | `133-141` | `f2897ac8594f096ec033f4ff605960c80c71906a282a06eb108a25ed4b70b5cd` |
| `OBJECTIVES OF CIVIC EDUCATION IN SCHOOLS` (heading + intro + 6 points) | `143-157` | `f50d2eb11523d525a1d4686254e17192bdd3c95981c5eb611f8a8c997c778133` |
| - the six points alone | `147-157` | `955cb35a7ee8dcb4791d1b445b4b93c07b143f0c5fbf5da65e55a5b74cf83cbd` |
| `IMPORTANCE OF CIVIC EDUCATION TO NATION BUILDING` (heading + intro + lead + 4 points) | `159-171` | `4fab520f4471c1da4a62576dff055b2ffd97ef507f5e32b5551c1161a8c7d40b` |
| - the four points alone | `165-171` | `f9c53d02b030cd341446272af7dcdfef9a580046d4681acbcf3e7b6db7280e29` |

The 25 non-blank lines of the week are 121, 123 and 127-171 (odd lines only): 1 marker + 1 topic + 2 definition + 6 needs + 8 objectives + 7 importance = 25, so every line is assigned to exactly one block above and **no section of the week is discarded** - which is what the completion condition tests. The even lines 122-172 are the blank separators mammoth prints between paragraphs; line 172 is the blank before `WEEK TWO` and is inside the range precisely because the rule is untrimmed.

### Per-line digests (the exact locators a later authoring item must cite)

| Line | SHA-256 of the line as printed |
|---|---|
| 121 | `d6daf1e694c6b67d3872739f78e9ed66d657349d3adba8de1bdc261001e1fef8` |
| 123 | `908eaf4df9695852a1d91c9ba297d3924e5a4ca9887f118f85eeb01d2e2bdfe2` |
| 127 | `be69913d9569df8ecd2161e158a52e73b633f54639fcba896166c420902d2fbf` |
| 129 | `40f3b392559a1b3099bd50fb7129fd48cf473774d6410aacf13b06d093333ada` |
| 131 | `4e7108468aeedc6dc771b1b76eb96cd249d9aeb331a63fec5e67306dbfbfaebc` |
| 133 | `6f21fc480c830efbf4fc0a1d4f0afe4727f85752819e0826688e0939dd34cedc` |
| 135 | `0e0b42963ededb58ef4e895fd285f2efc3d4801543bb659759d5d3207c4d82f6` |
| 137 | `916fc703d43de3ec6b39ee55666457919d5be0dc4cb8572916669b2968f6d176` |
| 139 | `a3645f879e438ce2cfb972aaccaa2d2f3fbe7dfb0d5b1bf89dfa57f85ee3e188` |
| 141 | `b9b3b2c75289fe39dfc28eb13d72b440cdc7be865a048f50395b100d1a44c8c8` |
| 143 | `f4afe3bb4c8cac11c67c5be7ddd75d6a002776a4ff81787883b349ec4373a6bf` |
| 145 | `84d3f4de5a6401916de995cc6ac3c2db7338a7ea505b1e5f420d11c6a12b52b1` |
| 147 | `2fdf20d66cbeee6f2b639815381e48c22c474aa16d115672ea62acd0aa4df8aa` |
| 149 | `e9c074e859423874e1021ef2111eaa7c35e4a84dc61154cdd8ecd1d6d15fc316` |
| 151 | `7ee359c1a1afd0dc8f4a0039c42c1a85f56e073e2bcb58a341be6510d3ac3e7b` |
| 153 | `d61c822131a31693e488c221cb6398308252c783168d1f7a7ab378775306ee9b` |
| 155 | `5a003c5fbf805c794efec61b2986b886ea0b83bc3cb80a3c16f620f695744191` |
| 157 | `727fb8ba40ca21e2f4d4cf9895cd8e6a64a46f6bac340d364489e47522807f9f` |
| 159 | `eb0e513235619e1ff68b32ee61abc79de399c5d6e8bbfdf32314d1848922865c` |
| 161 | `112cabbd028116ca6ad1fdf2d354d64c80fa75a10abac0fa31c5f472212c477d` |
| 163 | `2b0fb9447c3484ab2edf6bef470d97ee802fc10fa32f40516f61391a10212373` |
| 165 | `37d7bb6efef5eeb3f3354c3e9fd85e4e251da20b6541598476b4c166491d336f` |
| 167 | `3d4514198ec7791af16d84e0cd61fda6e59d1a83643bd7f4081120ec18731bcb` |
| 169 | `8b1283ad4d929bac0107e7d07d99fce146bbdffeb7bd9afd0326e8a91a67907c` |
| 171 | `04ca677fa512247ce067566f536f82e41327fadf9d72e3321fb4902fec7982cd` |

## Objective candidates recorded per section

These are index entries - what the source could support as an objective - not lesson objectives, and none is claimed as covered. The four sections yield 7 candidates: two for the meaning block, one for needs, two each for objectives and importance.

1. **Meaning** (`127-129`): (a) state the source's definition of civic education - `127`, which opens "Civic education of citizenship education", calls it the subject "that teach Nigeria youths" their duties and right, and aims at making them "good followers" and "responsible future leaders"; (b) state the second, separate definition at `129`, which frames it as exposure to democratic values and "social – political development". The week offers two definitions and never reconciles them, so a lesson must choose, present both, or treat the second as an elaboration - an expert decision, not an indexing result.
2. **Needs** (`131-141`): state the five needs for civic education (`133-141`). The five points are not one kind of statement: `133` and `135` begin "It inculcates..." while `137`, `139` and `141` are infinitive purposes ("To assist...", "To re-orientates...", "To educate..."), so the heading's "needs" is carried by a mix of effect statements and purpose statements.
3. **Objectives in schools** (`143-157`): (a) explain the introductory claim about the school at `145`, which is itself a two-sentence paragraph and is the only place the week defines its setting; (b) state the six objectives (`147-157`).
4. **Importance to nation building** (`159-171`): (a) explain nation building as `161` defines it (unity, "national intergrity", consciousness, rights and duties); (b) state the four importance points (`165-171`). `161` is one unbroken run of three statements ending "violated by government or individual" with no full stop, so any lesson must decide where its sentences begin.

The neutral-teaching flag already carried by `CIV-INV-T1` applies to `169` ("democracy is the best form of government"), the week's only evaluative political claim, and to the "pillars of democracy" wording on the same line. It is indexed as source wording and stays gated by `CIV-FACT-CONTENT-APPROVAL` (BLOCKED); nothing here adopts it.

## How the scheme states this week, and where the body parts company with it

Scheme row 1 of the Word table (body child 2, row 2; `CIV-PRE-T1` owns the opening block, lines 1-120) is cited here only as the promise this week must meet:
- Week cell `9` = "1", digest `6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b`; label `11` = `INTRODUCTION TO CIVIC EDUCATION`, digest `3678a00dd505a83ce8f3e15136daa90b9c14d10d5230f767af8a560341852fd4`; row range `11-17` digest `4d9c2cb19216fcecd1160ae894df7e3cb57ca71fe9459bfce3753b17833763e8`.
- Content line `13` = `Meaning and needs for civic  education  ` (`73e072ba9384b8fc4f0a22c17d04763d25faa6b8c480bbee28969ff2f5f9a833`) - the source prints a double space and two trailing spaces; body splits it into the unlabelled definition block plus `NEEDS`.
- Content line `15` = `Objectives/reasons for civic education in schools` (`ea3cecbaf447ecbd07350350e5c7221b32b9b45be4d0ea7f8f3a79ac0077950d`); body heading at 143 drops "reasons", and the word "reason/reasons" occurs nowhere else in the document - a census returns only line 15. The "reasons" half of the promise has no source content.
- Content line `17` = `Importance of civic education ` (`f3c4cdb182c98d00355b5ac8406ba8fe2207787fd3fe636de951a8fd7ffdf42e`); the body heading at 159 narrows it to "...TO NATION BUILDING", so the body teaches a narrower thing than the scheme promised.
- The word "meaning" occurs only in scheme cells (13, 51, 93, 101) and never in a week body, so the first section has no heading at all - the definition is two bare paragraphs after the topic line.

## Assessment census: the inventory recorded none, and none is there

Confirmed by case-insensitive line census over 121-172 rather than by reading: EVALUATION, ASSIGN(ment), QUESTION, TEST, EXERCISE, WEEKEND, READING, THEORY, ANSWER, MARKING, SCORE, RUBRIC, PRACTICE, HOMEWORK and CLASS WORK return **zero lines in this week**. The document-wide picture is stronger: fourteen of those fifteen - EVALUATION, QUESTION, TEST, EXERCISE, WEEKEND, READING, THEORY, ANSWER, MARKING, SCORE, RUBRIC, PRACTICE, HOMEWORK and CLASS WORK - never occur anywhere in the file, and ASSIGNMENT occurs only at 205, 271, 363, 389 and 423 - Weeks 2, 4, 5, 6 and 7. So `CIV-WK-T1-W01` has no evaluation, no assignment, no weekend work, no reading and no theory to index, and consequently **no question, no mark allocation and no answer exists to invent**. The week's assessment gap belongs to the authoring step, not to this index; no question was written here and no answer key was implied.

## Presentation facts that the text view loses

Checked against `word/document.xml` and `word/numbering.xml` (200 body children; Week 1 is children 4-29, 26 children of which 25 hold text):
- The fifteen list points are **Word auto-numbered** `ListParagraph` items, three separate lists: needs = numId 2 formatted `decimal` (1.-5.), objectives = numId 3 formatted `lowerLetter` (a.-f.), importance = numId 4 formatted `decimal` (1.-4.). Their ordinals, and therefore their enumeration and restart, exist only in the numbering definitions; `extractRawText` prints the sentences unnumbered. Any lesson built from this text view must not silently renumber them, and two parallel "count" lists are presented in figures while the objectives list is presented in letters.
- Week 1 contains no table, picture, embedded object, ink, textbox, hyperlink, tab or break of any kind: the 11 element counts above are all zero and the package holds no `word/media` part, which agrees with `CIV-INV-T1` (the document's only table is the scheme). No asset work arises from this week, and `CIV-VIS-T1-TBL-SCHEME`, which owns the scheme table, is untouched by this item.
- `WEEK ONE ` keeps its trailing space in XML (`xml:space="preserve"`), which is why the raw range rule and the exact marker text must be used together.

## Defects observed and preserved (not corrected, not guessed)

1. `127` begins "Civic education of citizenship education", calls it a subject "that teach Nigeria youths" their "duties and right", and aims at making them "good followers" - "of" where the sense requires "or", no verb agreement, and the singular "right" beside the plural used at 161.
2. Two definitions stand in sequence (`127`, `129`) with no reconciliation; `129` itself reads "Civic education expose students".
3. Spaced en dashes inside compounds at `129` ("social – political") and `133` ("multi – dimensional") - 2 in the week - while `135` writes "social political institutions" with no hyphen or dash, and `165` "social economic activities".
4. `133` "the relevance of nationalism and patriotism" uses "relevance" where an effect is meant; the sense is arguable and was not settled.
5. `137` "will rise their standard of living" for "raise".
6. `139` has no terminal full stop; `141` begins with a leading space (the only line in the week that does) and its ordinal is Word numbering only.
7. `143` promises objectives while its own intro `145` announces "The following are the importance of ..." - the objectives list is introduced as importance, and the next section (159) is the real importance section. Two "the following are" leads exist in the week, at 145 and 163.
8. `147` "learn about emergency of issues" is garbled; `157` ends "when the government fails to perture their duties", where "perture" occurs once in the entire document. Neither was resolved.
9. `151` lists its relations as "between man/woman, man/man, woman/woman" and then the government and the society - a slashed formulation the source never explains.
10. `155` opens "To enable student realise" and continues about day-to-day societal living "at their critical age" - a singular noun carrying a plural possessive.
11. `161` is a run-on of three statements ending "violated by government or individual" with no full stop, and misspells "national intergrity" (the only occurrence of that spelling in the document; the correct form appears elsewhere only outside this week).
12. `163` announces "the importance of citizen education" - "citizen education" occurs once in the document, and the line carries no colon or full stop.
13. `165` "to be particular in politics" is garbled; the word "participate" never occurs anywhere in this document, so the intended sense cannot be read out of the source.
14. `167` "the decision moving process" for decision-making.
15. Prose lines without terminal punctuation: 139, 161 and 163 (a census over the twenty prose lines; `145` is the deliberate colon lead).

Every one of these is source wording that a later preservation decision must keep verbatim; the full sentences are deliberately not reproduced in this repository - each is pinned by its line digest above and lives only in the private extract.

## Boundary respected: what this item did NOT do

- No coverage row, source rule, lesson, delivery correction, asset or answer was written. `civic-education.json` is **not touched by this PR** - it is not even listed as changed, and its content hash, compared after normalising the line endings this repository's `core.autocrlf` applies at checkout, is identical to the one on `master`. The queue item does list it among its allowed paths, but the task brief withholds it and the item's own objective excludes coverage authoring, so the file was left alone. Its `package_status` remains `PENDING`, coverage remains 0 rows, and its 3 open items (the three term-alias approvals, all blocking `OWNER_ACTION`) are untouched.
- No new queue item was invented. This item's objective excludes coverage, rule and lesson authoring, and its completion condition is met without one, so the follow-on work is named below and in the item's `implementation_reference` instead of being created here - the owner's decision, recorded as pending rather than assumed.
- No source fact, approval, rights position, teacher decision or verification result was asserted. Nothing was imported, compiled, parsed by the real Zod schema, tested, type-checked, run against a database or a device.

## Edits
- `docs/ss1/work/microtasks/civic-education/QUEUE.json`: `CIV-WK-T1-W01` PENDING -> `IMPLEMENTED_TESTING_DEFERRED`; its `implementation_reference` replaced with the computed section reference; one note appended (11 -> 12); `status_counts` recomputed from the items (IMPLEMENTED_TESTING_DEFERRED 5 -> 6, PENDING 35 -> 34, BLOCKED 1) and `next_runnable` re-derived (35 -> 34 entries, this item removed). `counts` by kind is unchanged because no item was added or removed. The other 40 items, `review`, `generated_from`, `status_vocabulary`, the item's own `id`, `kind`, `source_id`, `term`, `week_or_locator`, `objective`, `required_files`, `required_attachments`, `allowed_write_paths`, `depends_on` and `completion_condition` are unchanged from `HEAD`, field for field.
- This file. No other path in the repository changed.

## Checks run (authoring only)
Member SHA-256 and byte length recomputed from the supplied attachment and equal to the queue; the raw text re-extracted with mammoth 1.12.2 and its digest, character count and line count equal to `CIV-INV-T1`; the week range digest recomputed and equal to the queue locator and completion condition; 42 digest values cited in this file were each re-derived from the extract and matched to the line or range printed beside them (the week range, 25 single lines, 4 section ranges, 3 point-only ranges, marker+topic, 6 scheme-row values, the member and the whole text); the raw-versus-trimmed question settled for the week and for all four sections; every census claim above re-run by script (assessment terms, the fourteen "never occurs anywhere" terms, the five single-occurrence spellings, the 25-line partition and its 1+1+2+6+8+7 arithmetic, marker trailing space, leading space at 141, punctuation gaps); the XML claims re-checked from the member itself (200 body children, Week 1 at children 4-29, the eleven element counts at zero, 0 media parts, 15 `ListParagraph` numbered items with numIds 2/3/4 formatted decimal/lowerLetter/decimal, the 13x2 scheme table and its 4-paragraph Week 1 TOPIC cell, the `xml:space="preserve"` trailing space); every quoted fragment asserted to be a literal substring of the line it cites; the queue diff checked against `git show HEAD:` so that only the two intended fields, one note and the recomputed summary moved, and the subject package and the other forty items compared unchanged against the same revision once the repository's `core.autocrlf` line endings are normalised; both JSON and Markdown round-trip through the project serialisation with CRLF. Document metadata (author name, revision handle, company) was read only to keep it out of Git and appears nowhere in this record or the queue.

## Next implementation action (identified, not performed)
The next action for Week 1 is a **Week 1 coverage/lesson authoring item** - a new queue item, of the kind other subjects use (`LESSON`), which this item is not permitted to create. It must (1) write the four sections above as coverage rows with the exact locators and digests recorded here, keeping `PARTIAL` for the four teachable sections and `UNRESOLVED` for the "reasons" half of scheme line 15 and for the missing assessment; (2) carry the two open questions this index cannot settle - which definition `127` or `129` is taught, and how the neutral-teaching gate treats `169`; (3) obtain the numbering disposition for the three auto-numbered lists before any list is taught as numbered; and (4) depend on `CIV-FACT-CONTENT-APPROVAL`, which is BLOCKED, so it is not runnable today either way. Until such an item exists and runs, Week 1 is indexed only: it has no lesson, no coverage row, no assessment and no deliverable, and this record does not claim otherwise for the week, the term or the subject.
