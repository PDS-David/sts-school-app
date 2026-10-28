# CHEM-SRC-T1B — Chemistry, 1st Term source registration (second 1st Term file)

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `40e39fe95f9129be7df60bbe1a428386925d3fa7` (origin/master). CHEM-SRC-T1A was already implemented on master. No open PR or branch touched Chemistry.
- Source `SS1-SRC-84df18289b7a`, manifest member `SSS 1/1st Term SS1_/CHEMISTRY SS11STTERM.docx`.
- Container: no separate attachment arrived with this task; the member was extracted from the complete composite ZIP already in the session (`SSS_1-20260507T072431Z-3-001__1_.zip`), SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Member SHA-256 `0f7e40f7ca0b8e75192f69a03a2a49776dd0b90aa69ad877565674c9002b335a` **verified** from the extracted bytes (1,656,948 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member hashed unchanged; a private working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: two empty paragraphs, then `CHEMISTRY SS1`, then `SCHEME OF WORK FOR ALPHA TERM` and a topic list (introduction to chemistry, nature of matter, elements, molecules and atomicity, particulate nature, relative atomic masses, compounds, IUPAC nomenclature, mixtures, separation practicals), then `WEEK 1` onward.
- Subject confirmed from the document as Chemistry; no handoff needed. `CHEMISTRY SS1` occurs once (`CHEMISTRY` alone 9 times), so it is the unique header_text. It differs from "Chemistry" by the class text, so a `source_alias` is declared.
- `ALPHA TERM` is the document's term title for the manifest's `1st Term`; the term comes from the archive folder. Not treated as a conflict.
- This is one of two 1st Term Chemistry sources. No duplication or relationship to the other file was decided or checked (CHEM-CMP-T1 owns that).

## Edits
- `backend/src/db/ss1/subjects/chemistry.json`: added sources[1], `source_alias` rule `SS1-SRC-84df18289b7a-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `CHEMISTRY-ALIAS-APPROVAL-T1B` (OWNER_ACTION, blocks delivery). Additions only; the first source's entries are untouched.
- `QUEUE.json`: CHEM-SRC-T1B -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval. The source has no coverage until CHEM-INV-T1B.
- Runnable next: see `next_runnable` in the queue (same files; run one at a time). `NEXT_TASK.md` is outside the allowed write paths and unchanged.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
