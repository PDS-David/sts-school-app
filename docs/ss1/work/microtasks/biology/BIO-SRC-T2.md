# BIO-SRC-T2 — Biology, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `19bbec832d0c9ffd4162349d16a5f0fa42202e0a` (origin/master). BIO-SRC-T1 was already implemented on master. No open PR or branch touched Biology.
- Source `SS1-SRC-eb6e9665f42c`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`.
- Container: no separate attachment arrived with this task; the member was extracted from the complete composite ZIP already in the session (`SSS_1-20260507T072431Z-3-001__1_.zip`), SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**. The owner has asked for the 2nd Term material for this task; the member, not the container, is the evidence.
- Member SHA-256 `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44` **verified** from the extracted bytes (473,088 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member hashed unchanged; a private working copy read with `word-extractor` 1.0.4 `getBody()` (the importer's call for legacy `.doc`) in a scratch directory. Nothing from the source is committed.

## Findings
- First non-empty line: `SECOND TERM E-LEARNING NOTE` (occurs exactly once, case-insensitively too).
- Next line: `SUBJECT: BIOLOGY` ... `CLASS: SS 1`. The scheme of work (reproduction, irritability and movement, nutrition in animals, ecology, revision and examination) and the Biology reference list agree. Subject confirmed from the document, not the filename; no handoff needed.
- The heading is the generic template title, so a `source_alias` is declared.
- The extracted text shows `WEEK ONE` to `WEEK TEN` teaching sections after the scheme. No week inventory, objectives or visuals were recorded (see BIO-INV-T2).

## Edits
- `backend/src/db/ss1/subjects/biology.json`: added sources[1], `source_alias` rule `SS1-SRC-eb6e9665f42c-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `BIOLOGY-ALIAS-APPROVAL-T2` (OWNER_ACTION, blocks delivery). Additions only; the 1st Term entries are untouched.
- `QUEUE.json`: BIO-SRC-T2 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for both terms. The source has no coverage until BIO-INV-T2.
- Runnable next: `BIO-SRC-T3`, `BIO-INV-T1`, `BIO-INV-T2` (same files; run one at a time). `NEXT_TASK.md` is outside the allowed write paths and unchanged.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
