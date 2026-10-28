# BK-SRC-T2 — Bookkeeping, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `11520550c79e4bd982c362ef642b6dcb24e5b7a9` (origin/master). BK-SRC-T1 was already implemented on master. No open PR or branch touched Bookkeeping.
- Source `SS1-SRC-97c1db5b1eb0`, manifest member `SSS 1/2nd Term SS1_/Book keeping.docx`.
- Container: no separate attachment arrived with this task; the member was extracted from the complete composite ZIP already in the session (`SSS_1-20260507T072431Z-3-001__1_.zip`), SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Member SHA-256 `c8c75f55e327d7d3e6ece6b3caca2ea841d3d3a45d324ceb221843c265157af3` **verified** from the extracted bytes (38,245 bytes); equals `SOURCE_ASSIGNMENTS.csv`. The 1st Term member was extracted the same way and its hash also matched, for the comparison below only.
- Method: members hashed unchanged; private working copies read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening paragraphs: `SIGMA TERM`, `SCHEME OF WORKS`, `SUBJECT: BOOK-KEEPING<4 tabs>CLASS: SS 1`, then ` TOPIC` as its own paragraph and the scheme (revision, single and double column cash book, contra entry...).
- Subject confirmed from the document as Book-keeping, not Financial Accounting; no handoff needed. The subject line occurs once, so it is the header_text; it stops at `SS 1` because, unlike the 1st Term file, `TOPIC` is on its own paragraph. It differs from "Bookkeeping" by label, hyphen and class text, so a `source_alias` is declared.
- The term title `SIGMA TERM` is not the manifest's `2nd Term`; the term comes from the archive folder. Recorded, not treated as a conflict.
- **Possible duplicate of the 1st Term file.** Whitespace-trimmed raw text differs from the 1st Term source only in the first line (`SIGMA TERM` vs `FIRST TERM`) and the line break around `TOPIC`; the scheme and body text are otherwise identical. This is not proven to be a copy (text-level comparison only; images and layout were not compared), and no duplicate coverage is linked. It is recorded as open item `BOOKKEEPING-T2-TEXT-MATCHES-T1` for the owner.

## Edits
- `backend/src/db/ss1/subjects/bookkeeping.json`: added sources[1], `source_alias` rule `SS1-SRC-97c1db5b1eb0-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open items `BOOKKEEPING-ALIAS-APPROVAL-T2` and `BOOKKEEPING-T2-TEXT-MATCHES-T1` (OWNER_ACTION, both block delivery). Additions only; the 1st Term entries are untouched.
- `QUEUE.json`: BK-SRC-T2 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner: alias approval for both terms, and confirm whether this file is the real 2nd Term document. BK-INV-T2 indexing should wait for that answer. The source has no coverage yet.
- Runnable next: `BK-SRC-T3`, `BK-INV-T1`, `BK-INV-T2` (same files; run one at a time). `NEXT_TASK.md` is outside the allowed write paths and unchanged.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
