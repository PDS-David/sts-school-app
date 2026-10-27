# Food and Nutrition work queue — build note

- Reviewed master SHA: `4f7aa8a964a6b22a749a0777ae07e00728c68b02`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `food-and-nutrition.json`, tests, assets, Worker F (SS1-07) checkpoint/handoff or source notes for Food and Nutrition. No origin/ss1/* branch holds unmerged SS1 food-and-nutrition work (matches outside JSS3 documents are only the Worker F prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- Filenames vary: `F _ N.docx` (1st and 2nd Term) and `FOOD _ NUTRITION.docx` (3rd Term). Worker F treats such variations as candidates for source-backed aliasing, not reasons to discard files. Each registration item records what its header shows; an alias needs an approval_reference, recorded as an open item and never invented.
- Food and Nutrition stays separate from Catering Craft (slug `catering-craft`, two other documents, its own queue). A header naming another subject is a handoff open item, never a silent merge.
- Week counts, scheme content, nutrition tables, equipment illustrations, practical rubrics and any food hygiene, allergy, burns/fire or chemical statements are unknown. No classroom practical observation exists or may be fabricated, and no treatment or doses may be prescribed.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`FN-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`FN-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`FN-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`FN-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`FN-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/F _ N.docx`, member sha256 `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
