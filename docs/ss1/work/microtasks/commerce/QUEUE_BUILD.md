# Commerce work queue — build note

- Reviewed master SHA: `647f75e02be285a8cd6aeccbc6b910dc7a2cd947`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) and the Civic Education queue #83 (a different subject) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `commerce.json`, tests, assets, Worker D (SS1-05) checkpoint/handoff or source notes for Commerce. No origin/ss1/* branch holds unmerged SS1 commerce work (matches outside JSS3 documents are only the Worker D prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**. The 1st and 3rd Term files are legacy `.doc` and need DOC-aware extraction.
- Commerce stays separate from Economics, Financial Accounting and Bookkeeping (each its own slug and queue) until source headers and owner subject mapping justify an alias. A header naming another subject is a handoff open item, never a silent merge.
- Week counts, scheme content, calculations and any economic or commercial figures, institutions or laws are unknown. Worker D requires such facts to be dated, curriculum concepts to be distinguished from stale current-affairs figures, and authored updates to cite primary data.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`COM-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`COM-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`COM-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`COM-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`COM-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc`, member sha256 `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
