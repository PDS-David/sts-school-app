# LIT-SRC-T1 — Literature, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `bee34b2fe9058ccddca0a22f3a680560e3ed1c9c` (origin/master); no open PR or branch touched this item and no Literature package existed.
- Source `SS1-SRC-470d43e54e5b`, manifest member `SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the hash decides).
- Member SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (31,804 bytes).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: title `LIT-IN-ENGLISH`, then `SCHEME OF WORK FOR LITERATURE-IN-ENGLISH, SS1 CLASS` (line 3), a 10-week scheme (introduction to literature, genres, fiction/non-fiction, elements of prose, prose, poetry, drama, oral literature) and `WEEK 1` teaching "Introduction to the study of Literature-In-English".
- Subject confirmed from the document as Literature-in-English, not English Language; no handoff needed. The document has no "SUBJECT:" line, so the scheme heading (line 3, trailing space excluded; occurs once) is the header_text. The canonical spelling "Literature-in-English" is taken from that heading, not from the SS1-02 draft script label.
- The heading differs from the canonical name by prefix and class label, so a `source_alias` is declared. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/literature.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `LITERATURE-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: LIT-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner approval of the alias and canonical name (none invented). The source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
