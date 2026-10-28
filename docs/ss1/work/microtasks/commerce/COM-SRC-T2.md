# COM-SRC-T2 — Commerce, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `30379807e80022ed04138dd69a0c36b4f9352dab` (origin/master). COM-SRC-T1 was already implemented on master. No open PR or branch touched Commerce.
- Source `SS1-SRC-0ccdf9dd3768`, manifest member `SSS 1/2nd Term SS1_/commerce.docx`.
- Container: no separate attachment arrived with this task; the member was extracted from the complete composite ZIP already in the session (`SSS_1-20260507T072431Z-3-001__1_.zip`), SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Member SHA-256 `c18e26659058445f2341ca9365be0eaa71cceea88e388731fc98da531a2add86` **verified** from the extracted bytes (33,727 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member hashed unchanged; a private working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: two empty paragraphs, `SIGMA TERM SCHEME OF WORK FOR SS1`, `COMMERCE`, then a `WEEKS` / `TOPICS` table (retail trade, foreign trade, export procedure and documents, customs and excise, export promotion, port and airport authorities, transportation) and `WEEK ONE` to `WEEK NINE`.
- Subject confirmed from the document as Commerce, not Economics ("economics" does not occur in the text); no handoff needed. `SIGMA TERM` is the document's name for the term; the manifest term comes from the archive folder.
- The compiler's anchor check is an exact substring match, so capitalised `COMMERCE` occurs once; ignoring case it occurs three times (two are body text). The two-paragraph heading, unique either way, is used as in the Biology and Civic Education packages, and needs a `source_alias`.

## Edits
- `backend/src/db/ss1/subjects/commerce.json`: added sources[1], `source_alias` rule `SS1-SRC-0ccdf9dd3768-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `COMMERCE-ALIAS-APPROVAL-T2` (OWNER_ACTION, blocks delivery). Additions only; the 1st Term entries are untouched.
- `QUEUE.json`: COM-SRC-T2 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for both terms. The source has no coverage until COM-INV-T2.
- Runnable next: see `next_runnable` in the queue (same files; run one at a time). `NEXT_TASK.md` is outside the allowed write paths and unchanged.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
