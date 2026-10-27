# TD-SRC-T2 — Technical Drawing, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `3750d01319b183f7271d64b2fd7ffd83566a335b` (origin/master); no open PR or branch touched this item and no Technical Drawing package existed.
- Source `SS1-SRC-af4868d2c026`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the hash decides).
- Member SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (2,865,886 bytes).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `SECOND TERM E-LEARNING NOTE`, `SUBJECT:TECHNICAL DRAWING` (line 3), `CLASS:SS1` (line 5), `TITLE:SECOND TERM SCHEME OF WORK` (line 7), an 11-week scheme (revision and inscribed/circumscribed circles through tangency, revision and examination) and reference materials. Teaching starts at `WEEK ONE`.
- Subject confirmed from the header as Technical Drawing; no handoff needed. Subject and class are on separate lines, so the subject line alone is the unique header_text (occurs once; the phrase occurs 12 times case-insensitively elsewhere). It differs from "Technical Drawing" by the `SUBJECT:` label, so a `source_alias` is declared. No week inventory, drawing or OLE/WMF handling recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/technical-drawing.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `TECHNICAL-DRAWING-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: TD-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed from satisfied dependencies.

## Remaining
- Owner alias approval (none invented). The source has no coverage until indexing. 1st and 3rd Term sources are not supplied (see TD-MISSING-T1/T3).
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
