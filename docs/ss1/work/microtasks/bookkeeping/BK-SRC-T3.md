# BK-SRC-T3 — Bookkeeping, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `2bf31fa069123097d978170031f9abff5de0d33b` (origin/master). BK-SRC-T1 and BK-SRC-T2 are implemented on master; no open PR or branch owns BK-SRC-T3.
- Source `SS1-SRC-97f226215927`, manifest member `SSS 1/3rd Term SS1_/BOOK KEEPING_.docx`.
- Member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d` **verified** (92,755 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Container supplied: ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip` (member path `3rd Term SS1 /BOOK KEEPING_.docx`). Its own SHA-256 was not compared with the composite archive hash, so **no composite hash check is claimed**; the member hash decides.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read from `word/document.xml` paragraphs and with `mammoth` 1.12.2 `extractRawText({path})`. Nothing from the source is committed.

## Findings
- Opening: lines 1–4 blank; line 5 (indented) `SS 1 OMEGA TERM BOOK- KEEPING`; line 7 `SCHEME OF WORK`. The full heading occurs once. There is **no `SUBJECT:` line**, so the heading itself is the header_text (leading spaces excluded).
- Subject confirmed from the document: Book-keeping, not Financial Accounting (scheme: revision, petty cash book, trial balance and errors, suspense account, trading, profit and loss, balance sheet, revision, exam; body begins with the petty cash book and imprest system). Filename not used as evidence. No handoff needed.
- The term label is `OMEGA TERM`, not `3rd Term`; recorded, not treated as a conflict (the manifest term comes from the archive folder; the 2nd Term source says `SIGMA TERM`).
- Observation for the owner item `BOOKKEEPING-T2-TEXT-MATCHES-T1`: this 3rd Term text differs from the 2nd Term source (`Book keeping.docx`, supplied in the other ZIP); of 267 trimmed non-blank lines in the 2nd Term text only 1 appears in this one. No duplicate-coverage link was made.
- No media, header or footer parts. Teaching content was only skimmed.

## Edits
- `bookkeeping.json`: added sources[2], rule `SS1-SRC-97f226215927-R001` (heading ≠ canonical name, `PENDING-OWNER`) and open item `BOOKKEEPING-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Existing entries untouched; package stays PENDING.
- `QUEUE.json`: BK-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for all three terms; indexing items; the source has no coverage yet. Run same-file items one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
