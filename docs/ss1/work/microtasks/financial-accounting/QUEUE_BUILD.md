# Financial Accounting work queue — build note

- Reviewed master SHA: `ea2eeec28c83c39724af2c9d969b01cafe717c45`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `financial-accounting.json`, tests, assets, Worker D (SS1-05) checkpoint/handoff or source notes for Financial Accounting. No origin/ss1/* branch holds unmerged SS1 financial-accounting work (matches outside JSS3 documents are only the Worker D prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- The 2nd Term file is named `Account.docx`, which does not name Financial Accounting. Its subject (versus Bookkeeping) is established only from its header, never from the filename.
- Financial Accounting stays separate from Bookkeeping (slug `bookkeeping`, its own documents and queue) and from Commerce and Economics, until source headers and owner subject mapping justify an alias. A header naming another subject is a handoff open item, never a silent merge.
- Week counts, scheme content, ledgers, account formats, worked answers and any dated figures are unknown. Worker D requires debit/credit columns, ledgers, trial balances, account formats, currency and calculation steps to be preserved, and worked answers to be checked by reading and arithmetic.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`FA-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`FA-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`FA-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`FA-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`FA-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`, member sha256 `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
