# FR-LES-T1-W04-DEVOIR — French, 1st Term Week 4 DEVOIR free-composition task

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; not approved or verified). Testing deferred by owner.

## Inputs
- Base: origin/master `4f0384540c7b07d54d68846542fa17ba049ece6e` (fetched 2026-11-05).
- Checked before editing: no `AGENTS.md`; no open PR listed by the GitHub API; the task was PENDING and `FRENCH-T1-W04-DEVOIR-SCOPE` was open, so nothing was duplicated.
- No attachment required. The original document was not opened; the four stems come from the existing OBJ-5 coverage (children 227-230 of `SS1-SRC-945dfb24eaf6`). No source sentence is used and no source fact is added.

## Changes
- `french.json`: new lesson `SUP-SS1-FRENCH-AVOIR-DEVOIR-T1` (label line plus 5 body paragraphs, 3 objectives, 4 practice items, 16 marks, 1 provenance entry); body SHA-256 recorded in the queue item and recomputed from the UTF-8 body.
- The lesson reuses the avoir forms of `SUP-SS1-FRENCH-AUXILIARIES-T1` (not edited) and adds no new grammar. Each of the four stems (`Il a`, `Elle a`, `Nous avons`, `j’ai`) has one writing prompt, a model answer, acceptable alternatives and not-acceptable patterns. Each sentence is marked out of 4 (form of avoir; complete sentence that makes sense; agreement, age or beaucoup de used correctly; spelling, accents, capital letter and full stop), so 4 × 4 = 16.
- Coverage `FRENCH-T1-W04-OBJ-5` → IMPLEMENTED_EQUIVALENT; lesson added after `SUP-SS1-FRENCH-AUXILIARIES-T1`; earlier evidence kept and the new entry states that it supersedes the "no counterpart" statement.
- Open item `FRENCH-T1-W04-DEVOIR-SCOPE` resolved (removed). Not touched: `FRENCH-T1-W04-ETRE-SENTENCE-SCOPE`, `FRENCH-T1-W04-AVOIR-SENTENCE-SCOPE`, OBJ-1 to OBJ-4, the Week 2 nationality and South Africa/Kenya source checks, corrections, sources and assets.
- `QUEUE.json`: `FR-LES-T1-W04-DEVOIR` → IMPLEMENTED_TESTING_DEFERRED with implementation reference; `status_counts` recomputed (65 / 46 / 4); `next_runnable` untouched.

## Checks (authoring checks, not tests)
- JSON parses; no duplicate lesson, coverage, open-item or queue IDs; coverage `lesson_ids` and open-item `affected_ids` resolve; queue counts match items.
- Body hash recomputed; every marking list sums to its item (4, 4, 4, 4 = 16).
- No typecheck, suite, importer, database or device run.

## Remaining
- Owner content approval and verification. No external reference was fetched; the owner should confirm the examples and acceptable-answer criteria.
- The original source rows stay delivered unchanged; the stems' trailing spaces and lowercase `j’ai` are source properties and are not edited.
- `FR-LES-T1-W04-ETRE-SENTENCES` and `FR-LES-T1-W04-AVOIR-SENTENCES` remain PENDING.
