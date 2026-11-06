# FR-LES-T1-W03-SELF-ESSAY — French, 1st Term Week 3 written self-presentation supplement

Status: **IMPLEMENTED_TESTING_DEFERRED** (authored and bound; content approval PENDING, verification DEFERRED; not approved, not tested). Testing deferred by owner. Week 3 is **not** complete: `FRENCH-T1-W03-OBJ-1` stays PARTIAL and its scope item stays open.

## Inputs
- Starting SHA: `b3f8923775f32ef9f51ea4d77bd1890d9a4b13f8` (origin/master fetched 2026-11-06). Prerequisite FR-WK-T1-W03 is IMPLEMENTED_TESTING_DEFERRED.
- Checked before editing: no `AGENTS.md` in the repository; `gh pr list --state open` for this repository returned nothing after the owner merged #334; the only unmerged branch, `ss1/eng-les-w06-adverbial-clause` (PR #335), touches English paths only, so no file ownership overlapped. The item was PENDING, so nothing was duplicated.
- Required attachments: the item lists none. The eight prompts come from the source this queue already indexes: `SS1-SRC-945dfb24eaf6`, member `FRENCH Ss1.docx`, re-hashed in this run to `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864` (97,321 bytes — equals the digest the package records for the source) and children 136–145 re-hashed to `c74af09a026b7942a1d32958bf9f97150d8db521a2ff023107dccf556aca8630`. The whole document was **not** re-audited; only the ten children the week index already recorded were read.
- All web references were read 2026-11-06. Private member copy and extract stayed outside Git.

## Changes
- `french.json`: new lesson `SUP-SS1-FRENCH-SELF-ESSAY-T1` (label line plus 8 teaching paragraphs, 5 objectives, 3 practice items, 34 marks, 5 provenance entries); body SHA-256 `5eff5383f0b41df42f4eba81980c1851a6bb7024c7499ebc0fc0ae873d040090`.
- Coverage `FRENCH-T1-W03-OBJ-2`: PARTIAL → **IMPLEMENTED_EQUIVALENT**; `lesson_ids` now `[SUP-SS1-FRENCH-GREETINGS-T1, SUP-SS1-FRENCH-SELF-ESSAY-T1]`; the two original evidence entries are kept byte-identical and a third is appended, saying explicitly that it supersedes the earlier "no counterpart" statement; objective text and objective locator are unchanged. The binding is additive: no `delivery_correction` was added, amended or displaced.
- Open item `FRENCH-T1-W03-ESSAY-SCOPE` removed, because its `required_action` is now complete and no other open item names OBJ-2. New **non-blocking** OWNER_ACTION item `FRENCH-T1-W03-ETAT-READING` added, affecting OBJ-2 and the new lesson. `FRENCH-T1-W03-GREETING-SCOPE` stays open and blocking; open items remain 13, coverage rows 46, lessons 30 → 31.
- `QUEUE.json`: item → IMPLEMENTED_TESTING_DEFERRED; `status_counts` recomputed (66 IMPLEMENTED_TESTING_DEFERRED / 45 PENDING / 4 BLOCKED); `counts`, `next_runnable`, `review` and `generated_from` untouched; one note appended and the previous 7 kept verbatim.
- Not touched: the 3 sources, the 3 `source_alias` rules, the 28 delivery corrections, assets (0), the other 45 coverage rows, the other 30 lessons including `SUP-SS1-FRENCH-GREETINGS-T1`, and `package_status` (still PENDING).

## What the supplement teaches
- One sentence pattern for each of the eight prompted fields, in the order the source prompts them: `le nom`, `l’âge`, `la nationalité`, `l’état`, `la langue`, `l’adresse ou le domicile`, `la profession`, `le plat ou la couleur préféré`, each with the question form and the common error.
- The state field under **both** readings — the state of origin (`Je suis originaire de l’État de Kwara`) and `l’état civil` (`Je suis célibataire`) — with neither chosen for the course.
- The domicile field answered with a town or a general locality, and explicit guidance that a street name, a house number or a family’s private address is never required, because the essay is read aloud in class.
- The possessive rule that puts `mon` before a vowel-initial feminine noun (`mon adresse`, `mon amie`) and keeps `ma` before a consonant (`ma couleur préférée`), stated with its limits.
- `nigérian / nigériane` for Nigeria against `nigérien / nigérienne` for Niger, so the two neighbours are not conflated.
- A fictional model paragraph holding all eight fields, a 6-mark keyed form-choice exercise with a reason for every answer, an 8-mark guided exercise about an invented pupil, and a 20-mark writing task with a 7-criterion rubric that sums to 20 and states that the model is not the only correct answer.
- Nothing from `SUP-SS1-FRENCH-GREETINGS-T1` is re-taught except as a reminder, and that lesson is byte-identical.

## Claim-to-evidence map
| Claim in the lesson | Where the evidence sits |
|---|---|
| The task is a written self-presentation of eight fields | Source children 136–145: heading 136, task line 137 `Ecrivez sur une redaction moi-meme`, eight prompts 138–145; child-text hash recorded in the row locator and re-derived in this run |
| `Votre etat` is ambiguous and unexplained | FR-WK-T1-W03 index, which flags 141 as unexplained; the source gives no gloss. Recorded as `FRENCH-T1-W03-ETAT-READING`, not decided here |
| `mon` replaces `ma/ta/sa` before a vowel or mute h | Kwiziq French Grammar, page named in provenance entry 2, read 2026-11-06 |
| Nationality adjectives agree and take no capital | Kwiziq French Grammar, provenance entry 3, read 2026-11-06 |
| After `parler`, both `je parle français` and `je parle le français` are correct | Kwiziq French Grammar, provenance entry 4, read 2026-11-06 — so Q1 item 6 and Q2 item 5 do not mark either form wrong |
| `favori` has the feminine `favorite` | Kwiziq French Grammar, provenance entry 5, read 2026-11-06 — the source’s own word, taught beside `préféré / préférée` |
| Model paragraph, exercises, answers, rubric and mark totals | Newly authored for this project (provenance entry 1); no mark allocation exists in the source |

## Decisions deliberately left to the owner
- Which reading of `Votre etat` the course teaches, and whether the capitalised `État` for a political entity is taught as a rule or only as usual usage (`FRENCH-T1-W03-ETAT-READING`).
- Whether the "no private home address" rule is a course-wide rule or only the wording of this supplement; the lesson states it as guidance and asks for a town.
- Whether a Nigerian textbook reference, rather than the four online grammar pages cited, is required before certification. Drafting a lesson is not teacher certification.

## Checks (authoring checks, not tests)
- Both edited JSON files parse; serialisation stays pure CRLF; the package re-reads identically after parse and re-serialise.
- A schema-shape mirror of `backend/src/db/ss1/subjectPackageSchema.ts` (strict objects, digests, enums, positive integer marks, non-blank text, resolvable coverage and correction targets) reports **no errors** on the edited package, and reported no errors on the same file at origin/master.
- Generator guards refused to write unless each claim re-derived: the member digest and the children 136–145 digest, the verbatim eight prompts, body SHA-256 recomputed from the UTF-8 body, every marking list summing to its item, the mark totals 6 + 8 + 20 = 34, all eight field labels present, both state readings present, no private-address request in any exercise, no unaccented source prompt presented as French.
- Immutability: the 30 existing lessons byte-identical, `SUP-SS1-FRENCH-GREETINGS-T1` byte-identical, coverage id order unchanged with exactly one row changed, 12 open items byte-identical after the one removal, sources/rules/corrections/assets byte-identical, `package_status` PENDING.
- Queue: 115 items, exactly one item changed and only its `status` and `implementation_reference`; `status_counts` recomputed from the items and summing to 115; `counts`, `next_runnable`, `review`, `generated_from`, `queue_version`, `subject`, `slug` and `status_vocabulary` unchanged; every `depends_on` target complete.
- Independent verifier re-derived the two source hashes from the Git blobs at origin/master and the diff before commit, checked the anti-plagiarism window against the private source text and scoped leak checks to the added text only.
- No typecheck, test suite, importer, database, device or deployment run; automatic CI not disabled.

## Remaining
- Content approval PENDING, verification DEFERRED, release gates unchanged; nothing about Week 3 is certified.
- Visual and app rendering of the source for Week 3 was not re-checked; the deferred visual dispositions in the French queue remain open items of their own.
- `FRENCH-T1-W03-OBJ-1` (the 49-row greeting list, three rows of which have no confident reading) and `FRENCH-T1-W03-GREETING-SCOPE` are untouched: this task closes only the essay gap, not the week.
- The four cited grammar pages are commercial reference summaries; if the owner requires a named curriculum textbook, the `mon/ma`, nationality-agreement, article-with-languages and `favorite` wording must be re-sourced before approval.
- Owner decision on the state-field reading, as recorded in `FRENCH-T1-W03-ETAT-READING`.
