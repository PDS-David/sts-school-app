# CIV-SRC-T2 — Civic Education, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `40e39fe95f9129be7df60bbe1a428386925d3fa7` (origin/master). CIV-SRC-T1 was already implemented on master. No open PR or branch touched Civic Education.
- Source `SS1-SRC-21ddf6abc2dc`, manifest member `SSS 1/2nd Term SS1_/CIVIC.docx`.
- Container: no separate attachment arrived with this task; the member was extracted from the complete composite ZIP already in the session (`SSS_1-20260507T072431Z-3-001__1_.zip`), SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Member SHA-256 `1e2505c4b9e197087a55e0532c3a6efc7c08765bf1d86697c6720d253d22cdef` **verified** from the extracted bytes (21,865 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member hashed unchanged; a private working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `TERM:<tab>2ND TERM`, `SUBJECT:<tab>CIVIC EDUCATION`, `SS 1`, `SCHEME OF WORK`, then a topic list (revision, voter education, elections, electoral bodies in Nigeria, free and fair elections, electoral malpractice) and `WEEK ONE` to `WEEK TEN`.
- Subject confirmed from the document as Civic Education, not Government (the header names Civic Education; "government" appears only in body text); no handoff needed. The document's own term line agrees with the manifest term.
- `SUBJECT:<tab>CIVIC EDUCATION` occurs once and is used as header_text. It differs from "Civic Education" by the `SUBJECT:` label, so a `source_alias` is declared. The bare phrase `CIVIC EDUCATION` also occurs once and would equal the canonical name with no alias; that alternative is left to the owner (stated in the open item).

## Edits
- `backend/src/db/ss1/subjects/civic-education.json`: added sources[1], `source_alias` rule `SS1-SRC-21ddf6abc2dc-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `CIVIC-EDUCATION-ALIAS-APPROVAL-T2` (OWNER_ACTION, blocks delivery). Additions only; the 1st Term entries are untouched.
- `QUEUE.json`: CIV-SRC-T2 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias decision for both terms. The source has no coverage until CIV-INV-T2.
- Runnable next: see `next_runnable` in the queue (same files; run one at a time). `NEXT_TASK.md` is outside the allowed write paths and unchanged.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
