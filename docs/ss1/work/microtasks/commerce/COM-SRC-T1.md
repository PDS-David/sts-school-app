# COM-SRC-T1 — Commerce, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `cd48a05981978c0a75cf805d7ebc9407bd095881` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-d96373071a7e`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc`.
- Member SHA-256 `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (1,166,848 bytes).
- Read from the "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`, member path `1st Term SS1 /1ST TERM S1 COMMERCE.doc`). The same member bytes were also confirmed in the composite archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, verified).
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM E-LEARNING NOTE`, `SUBJECT: COMMERCE … CLASS: SSS 1`, `SCHEME OF WORK` and a 12-row week table (meaning and functions of commerce through wholesale trade and warehousing).
- Subject confirmed from the header as Commerce, not Economics; no handoff needed.
- The subject line occurs once (`COMMERCE` alone occurs 8 times), so it is the unique header_text (trailing whitespace excluded). It differs from "Commerce", so a `source_alias` is declared. No week inventory recorded here.

## Edits
- Created `backend/src/db/ss1/subjects/commerce.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `COMMERCE-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: COM-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. Source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.
