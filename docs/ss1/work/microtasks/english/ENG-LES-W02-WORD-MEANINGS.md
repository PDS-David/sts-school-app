# ENG-LES-W02-WORD-MEANINGS — English, Week 2 word-meanings supplement

Status: **IMPLEMENTED_TESTING_DEFERRED** (lesson written; content approval PENDING, verification DEFERRED; nothing approved or verified). Testing deferred by owner. No tests, typechecks, importer/plan runs, database or device checks, migrations, imports or deployments were run.

## Inputs
- Base: `origin/master` `85af71f` (fetched again before publishing; work began on `a98983a`, and the owner merged PR #180 and PR #181 into master in between — both touch other subjects only, and no English file changed). No `AGENTS.md` on master. Branch `ss1/eng-les-w02-word-meanings-20261029` from `85af71f`.
- Prerequisite `ENG-WK-T1-W02` is `IMPLEMENTED_TESTING_DEFERRED`; it recorded coverage `ENGLISH-T1-W02-CM02` as UNRESOLVED and opened `ENGLISH-T1-W02-WORD-MEANINGS-SCOPE`.
- Source `SS1-SRC-a00657d42196`: member `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc`, 1,329,664 bytes, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` **verified again** in the supplied archive `SSS 1-20260507T072431Z-3-001 (1).zip`, whose SHA-256 **was checked** this run: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. `archive_member` kept verbatim.
- Private re-extraction with `word-extractor` 1.0.4 `getBody()`: 81,965 characters, 1,698 lines, SHA-256 `8c3faa979ab73ef5de1cbc97976405c20332d505d49233cc147bfef691034a4e`. Scratch copy only; nothing from the source is committed and no passage is reproduced.
- The original document was read only to re-confirm the gap. It was not used as lesson content.

## Gap re-confirmed
- `Word Meanings in Context` occurs **once** in the whole document, in the scheme row: line 24, `2	Comprehension, Reading Skills; Word Meanings in Context- Unit 3, pages 54-55`.
- The WEEK TWO row runs lines 331–443 and teaches: the comprehension/religion row (the Effective English passage is **not supplied**, only its page reference), phrasal verbs, adverbs/conjunctions/prepositions, and library vocabulary. The word `meaning` occurs there only for phrasal verbs (349, 359) and in the look-up assignment (368). Nothing teaches inferring meaning from context.
- The unsupplied Effective English Unit 3 passage is still tracked by `ENGLISH-T1-W02-EXTERNAL-MATERIALS`; no textbook text or exercise is copied.

## What was authored
New lesson `SUP-SS1-ENGLISH-MEANING-T1`, "Word meanings in context: clues, senses and figurative use", in `backend/src/db/ss1/subjects/english.json`:
- 13 original teaching paragraphs: why context decides the sense; a four-step routine; definition/restatement, example, contrast and cause-and-effect clues; word parts as hints (with `inflammable` and `casual/causal` warnings); choosing among senses of a familiar word; grammar as a clue; literal and figurative use (simile, metaphor, idiom); connotation and tone; the required answer form; and a worked example on an original passage.
- 3 objectives; **8 practice items; 32 marks**; every item's marking array sums to its declared marks (`Q1` 2, `Q2` 2, `Q3` 2, `Q4` 2, `Q5` 6, `Q6` 8, `Q7` 6, `Q8` 4). Answers are worked, not keys to an unseen text: `Q1`–`Q4` test the four clue types, `Q5` the senses of `light`, `Q6` literal/figurative, `Q7` an original market passage, `Q8` the answer form for `notorious`.
- `body` is the paragraphs joined by `\n`; `body_sha256` `c3655c8969428d3576a9ba5f1d320ddffd32ee3b1c75a4e1c8aad735c5ddbe40` recomputed from that string (7,606 characters). No other lesson has the same body or hash (checked against all 19 lessons).
- `state`: `content_approval` PENDING, `approval_reference` null, `implementation` IMPLEMENTED, `verification` DEFERRED, `verification_reference` null. No owner or teacher response is implied.

## Coverage and open items
- `ENGLISH-T1-W02-CM02`: UNRESOLVED → **IMPLEMENTED_EQUIVALENT**; `lesson_ids` is now `["SUP-SS1-ENGLISH-MEANING-T1"]`; a third evidence entry describes the supplement's paragraphs and items. The two original evidence entries (scheme text; "not taught by any source row") are retained unchanged.
- `ENGLISH-BODY-004` stays **PARTIAL** (its passage and exercise are still unsupplied). Its evidence now records that the word-meanings part is supplied by the supplement and that the passage gap remains.
- `ENGLISH-T1-W02-WORD-MEANINGS-SCOPE` **removed**: its required action was to author the missing teaching and bind it by exact coverage, which is complete. Nothing becomes deliverable as a result, because the lesson is not approved (`LESSON_NOT_APPROVED` still applies) and the row remains PARTIAL. All other open items and all `delivery_corrections` are untouched.

## Verification gaps for owner review (nothing claimed beyond the text)
Dictionary facts used in the lesson were **not re-fetched** in this run: web access was unavailable, so no URL is recorded in `provenance`. These points should be confirmed at content review:
- `brackish` = slightly salty and unpleasant to drink.
- `inflammable` = easily set on fire (not "not flammable").
- `childlike` usually approving, `childish` usually disapproving; `famous` vs `notorious`; `thrifty` vs `stingy`.
- The five senses of `sharp` used in paragraph 8.
- The `-er` ending in `strainer` naming a person or thing that performs an action.

The second `provenance` entry records exactly this limitation. Both provenance entries are `reuse_status` PERMITTED; no third-party wording is reproduced.

## Checks run
Archive, member and body hashes; JSON syntax of both edited files; body-hash recomputation; practice-ID uniqueness and mark sums; duplicate body/id checks; coverage target resolution and `IMPLEMENTED_EQUIVALENT` supplement requirement; open-item references; queue counts, status counts and eligibility; diff review (only `english.json` and `QUEUE.json` changed). Nothing was executed against the importer, database, tests or a device.

## Queue
- `ENG-LES-W02-WORD-MEANINGS` → `IMPLEMENTED_TESTING_DEFERRED` with the evidence above.
- `status_counts` recomputed (IMPLEMENTED_TESTING_DEFERRED 24, PENDING 72, BLOCKED 4); `counts` unchanged; one note appended.
- `next_runnable` set to the single next item, following this file's one-item convention: `ENG-LES-W02-PHRASAL-VERBS`.

## Not done
No approval, verification, tests, typecheck, importer run, database/device check, migration, import or deployment; no merge. The textbook passage and pages remain unsupplied. The subject and class are not claimed complete.
