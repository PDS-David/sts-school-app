# CHEM-SRC-T1A — Chemistry, 1st Term source registration (first 1st Term file)

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `312cf66ef2f4f390ec7c076820e44da5c0929bcd` (origin/master); no open PR or branch touched this item.
- Source `SS1-SRC-58b4a44c3afa`, member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**. Member SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a` **verified** (2,187,976 bytes), equal to `SOURCE_ASSIGNMENTS.csv`.
- An earlier attempt was blocked because only the 1st Term term-archive was attached; its `1ST TERM S1 CHEMISTRY.doc` (SHA-256 `baa136…c67`) is a different file and was not used.
- Method: member extracted unchanged with `unzip` and hashed; a separate working copy read with `mammoth.extractRawText({path})` (mammoth 1.12.2, scratch directory). Nothing from the source is committed.

## Findings
- The text begins with about 30 empty paragraphs, then `FIRST TERM E-LEARNING NOTE`, then `SUBJECT:  CHEMISTRY<7 tabs>CLASS: SS1`, `SCHEME OF WORK` and the week list (introduction to chemistry through structure of the atom, revision, examination).
- Subject confirmed from the header as Chemistry; no handoff needed.
- The subject line occurs once (`CHEMISTRY` alone occurs 9 times), so it is the unique header_text. It differs from "Chemistry" by label and class text, so a `source_alias` is declared. No week inventory recorded here. No relationship to the other 1st Term file is claimed (CHEM-CMP-T1 compares them).

## Edits
- Created `backend/src/db/ss1/subjects/chemistry.json` (PENDING; one source; alias rule with `PENDING-OWNER`; blocking open item `CHEMISTRY-ALIAS-APPROVAL`; other arrays empty).
- `QUEUE.json`: CHEM-SRC-T1A → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. Source has no coverage until indexing.
- Runnable items edit the same package file; run them one at a time.
