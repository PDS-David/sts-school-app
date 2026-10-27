# BK-SRC-T1 — Bookkeeping, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `4d92dd2058b827b02866ea6879069412fe88bea3` (origin/master); no open PR and no branch touched this item.
- Source `SS1-SRC-62b02f2adcb3`, manifest member `SSS 1/1st Term SS1_/book keeping.docx`.
- Member SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (38,275 bytes).
- **Composite archive not supplied, and no standalone original.** The member was read from the "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`, member path `1st Term SS1 /book keeping.docx`). The composite hash (`024487…65c9a3e`) was **not checked**, and the enclosing archive named in the task was not the one attached. The addendum authorises a standalone original; use of this term archive is a deviation for the owner to confirm. The `archive_member` in the package is the manifest value verbatim.
- Method: member extracted unchanged with `unzip`, hashed, then a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM`, `SCHEME OF WORKS`, then `SUBJECT: BOOK-KEEPING<4 tabs>CLASS: SS 1  TOPIC` and a 12-row scheme. Teaching content is cash book, contra entry and double entry.
- Subject confirmed from the header as Book-keeping, not Financial Accounting; no handoff needed.
- The subject line occurs once, so it is the unique header_text. It differs from "Bookkeeping" by label, hyphen and class text, so a `source_alias` is declared (same pattern as Biology/French). No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/bookkeeping.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `BOOKKEEPING-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: BK-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts recomputed; `next_runnable` → `BK-SRC-T2`, `BK-SRC-T3`, `BK-INV-T1`.

## Remaining
- Owner alias approval; confirm use of the term archive. Source has no coverage until indexing.
- These items edit the same package file, so run them one at a time.
