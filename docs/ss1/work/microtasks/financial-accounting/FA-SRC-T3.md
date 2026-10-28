# FA-SRC-T3 — Financial Accounting, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `34639ef9a38476203f9885e31a024b586ddca29f` (origin/master). Prerequisite FA-SRC-T1 is implemented on master. GitHub API listed 0 open PRs; no `fa-src-t3` branch existed on origin.
- Source `SS1-SRC-8165a1af2444`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 FINANCIAL ACCOUNT.docx`.
- Member SHA-256 `943d381416381610e47215cdec5b06c63c819f34604edbab2034ff28e1ccf170` **verified**; equals the prompt, NEXT_TASK.md and `SOURCE_ASSIGNMENTS.csv` (165,532 bytes).
- Container supplied: a "3rd Term SS1" zip (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`), member path `3rd Term SS1 /3RD TERM S1 FINANCIAL ACCOUNT.docx`. The composite archive hash (`024487…c9a3e`) was **not** checked; no composite check is claimed.
- Method: member extracted unchanged with `unzip` and hashed; read with `mammoth.extractRawText({path})` in a scratch directory. Non-blocking warnings: unrecognised `w:permStart` / `w:permEnd`. Nothing from the source is committed.

## Findings
- Opening non-empty paragraphs: `THIRD TERM E-LEARNING NOTE`, `SUBJECT:<tab>FINANCIAL ACCOUNTING<6 tabs>CLASS: SS1`, `SCHEME OF WORK`, then a WEEK/TOPIC table (bank account and its operations; bank reconciliation statement; final accounts of a sole trader; balance sheet; opening entries and subsequent transactions).
- Subject confirmed from the header as Financial Accounting, not Bookkeeping. Topic overlap with the separate Bookkeeping package and the filename were not used as evidence. No handoff needed.
- The subject line occurs once (character offset 30; the only `SUBJECT`; upper-case `FINANCIAL ACCOUNTING` occurs only there), so the whole line is the unique header_text (trailing whitespace excluded). It differs from "Financial Accounting" by label and class text, so a `source_alias` is declared with `PENDING-OWNER` approval; no approval reference was invented.

## Edits
- `financial-accounting.json`: added `sources[2]`, rule `SS1-SRC-8165a1af2444-R001`, and blocking open item `FINANCIAL-ACCOUNTING-ALIAS-APPROVAL-3RD-TERM`. Other sources, rule and open item unchanged; package stays PENDING.
- `QUEUE.json`: FA-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for this source (and the 1st Term one). The source has no coverage until indexing (FA-INV-T3).
