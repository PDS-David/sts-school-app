# Bookkeeping work queue — build note

- Reviewed master SHA: `b13a8c065c8ad0455563af5a0af7abc019eb68f7`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `bookkeeping.json`, tests, assets, Worker D (SS1-05) checkpoint/handoff or source notes for Bookkeeping. No origin/ss1/* branch holds unmerged SS1 bookkeeping work (matches outside JSS3 documents are only the Worker D prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- The 1st and 2nd Term files are 38275 and 38245 bytes. Similar size is not proof of duplication; only a content comparison can establish it.
- Bookkeeping stays separate from Financial Accounting (slug `financial-accounting`, three other documents, its own queue). A header naming another subject is a handoff open item, never a silent merge.
- Week counts, scheme/preamble content, ledgers, account formats, worked answers and any dated figures are unknown. Worker D requires debit/credit columns, ledgers, trial balances, account formats, currency and calculation steps to be preserved.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`BK-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`BK-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`BK-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`BK-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`BK-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/book keeping.docx`, member sha256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
