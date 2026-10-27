# FA-SRC-T1 — Financial Accounting, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `19e03674fa4966e68b0583b029cd3251f89ab1d1` (origin/master, after PR #107); no open PR or branch touched this item (GitHub API listed 0 open PRs).
- Source `SS1-SRC-cf77df509ac3`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`.
- Archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (received as `SSS_1-20260507T072431Z-3-001__1_.zip`; the hash decides).
- Member SHA-256 `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb` **verified**; equals `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json` (1,166,213 bytes).
- Method: member extracted unchanged with `unzip` and hashed; a working copy read with `mammoth` `extractRawText({path})` (the importer's own .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM E-LEARNING NOTE`, `SUBJECT: FINANCIAL ACCOUNTING … CLASS: SS1`, `SCHEME OF WORK` and a topic list (introduction to book-keeping and accounting through subsidiary books).
- Subject confirmed from the header as Financial Accounting, not Bookkeeping. Topic overlap with the separate Bookkeeping package was not treated as evidence; the filename was not treated as evidence. No handoff needed.
- The subject line occurs once (`FINANCIAL ACCOUNTING` alone occurs 9 times), at character offset 62 of the extracted text, so the whole line is the unique header_text (trailing whitespace excluded). It differs from "Financial Accounting" by label and class text, so a `source_alias` is declared. No week inventory is recorded here (FA-INV-T1).

## Edits
- Created `backend/src/db/ss1/subjects/financial-accounting.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `FINANCIAL-ACCOUNTING-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: FA-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. The source has no coverage until indexing.
- FA-SRC-T2, FA-SRC-T3 and FA-INV-T1 now edit the same package or read the same source; run them one at a time.
