# GEO-SRC-T1 — Geography, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `3011ee4868a5922004e219120440922c4683e2d5` (origin/master); no open PR or branch touched this item and no Geography package existed.
- Source `SS1-SRC-1c1c1bdcecb4`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the hash decides, not the filename).
- Member SHA-256 `4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (1,163,776 bytes). Its hash differs from the 1st Term Government `.doc`, which has the same byte size, so the two were not confused.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call), in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `FIRST TERM E-LEARNING NOTE`, `SUBJECT: GEOGRAPHY … CLASS: SS1` (line 19), `SCHEME OF WORK`, an 11-week topic list (introduction to geography through major land forms, revision) and the reference `Essential Geography for Senior Secondary Schools by O.A. Iwena.`
- Teaching begins at `WEEK ONE` (meaning, scope and value of geography) and continues with the solar system, confirming the subject from the document, not the filename. No handoff needed.
- The subject line occurs once; `GEOGRAPHY` alone occurs 5 times, so the full line is the unique header_text (trailing whitespace excluded). It differs from "Geography" by the `SUBJECT:`/`CLASS:` labels, so a `source_alias` is declared.
- No week inventory, lessons, coverage, corrections or assets were created.

## Edits
- Created `backend/src/db/ss1/subjects/geography.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `GEOGRAPHY-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: GEO-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (no reference was invented). The source has no coverage until indexing (`SOURCE_WITHOUT_COVERAGE` blocker remains).
- GEO-SRC-T2, GEO-SRC-T3 and GEO-INV-T1 edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
