# Catering Craft work queue — build note

- Reviewed master SHA: `f9e9e9e0263b6823508fd74f5049e84979164ecf`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `catering-craft.json`, tests, assets, Worker F (SS1-07) checkpoint/handoff or source notes for Catering Craft. No origin/ss1/* branch holds unmerged SS1 catering work (matches outside JSS3 documents are only the Worker F prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- **Two** assigned sources only: 2nd Term and 3rd Term. No 1st Term Catering Craft document is assigned; Worker F forbids inventing a First-Term scheme, so the queue has no 1st Term item. This supplied-term gap is reported, not filled.
- Hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. Both are filename-based assignments; **no header is verified**. Both are legacy `.doc` files and need DOC-aware extraction.
- Catering Craft stays separate from Food and Nutrition (slug `food-and-nutrition`, three other documents, its own queue). A header naming another subject is a handoff open item, never a silent merge.
- Week counts, scheme content, tables, equipment illustrations, practical rubrics and any food hygiene, allergy, burns/fire or chemical statements are unknown. No classroom practical observation exists or may be fabricated.

## Queue totals (6 items: 5 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 2 (`CC-SRC-T2`, `CC-SRC-T3`; T2 may create the minimum package, T3 depends on it) |
| SOURCE_WEEK_INVENTORY | 2 (`CC-INV-T2`, `CC-INV-T3`; week counts unknown, not guessed) |
| TEST | 1 (`CC-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`CC-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`CC-SRC-T2`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`, member sha256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
