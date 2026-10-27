# DP-SRC-T1 — Data Processing, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `21a869fad7b1dc878b0cd47a58bfee2805b2851f` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-a92792eaa7ef`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx`.
- Member SHA-256 `a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (1,056,355 bytes).
- Read from the "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`, member path `1st Term SS1 /1ST TERM S1 DATA PROCESSING.docx`). The same member bytes were also confirmed in the composite archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, verified).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). One non-blocking mammoth warning (unrecognised element `v:stroke` ignored). Nothing from the source is committed.

## Findings
- The text begins with about 30 empty paragraphs, then `FIRST TERM E-LEARNING NOTE`, then `SUBJECT:  DATA PROCESSING<6 tabs>CLASS:  SSS1`, `SCHEME OF WORK` and the week list (data and information, history and classification of computers, digitalization of data, ICT applications).
- Subject confirmed from the header as Data Processing; no handoff needed. No mapping to Computer Studies or ICT is made.
- The subject line occurs once (`DATA PROCESSING` alone occurs 7 times), so it is the unique header_text. It differs from "Data Processing", so a `source_alias` is declared. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/data-processing.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `DATA-PROCESSING-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: DP-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. Source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.
