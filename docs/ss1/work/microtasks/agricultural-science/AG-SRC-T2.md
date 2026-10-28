# AG-SRC-T2 — Agricultural Science, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `49a7ea7acdb15c32fb986f63cbe106569e540174` (origin/master). AG-SRC-T1 was already implemented on master. No open PR or branch touched Agricultural Science.
- Source `SS1-SRC-956594d97094`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 AGRICULTRAL SCIENCE.docx`.
- Container supplied: the complete composite ZIP, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001__1_.zip`).
- Member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` **verified** from the extracted bytes (188,799 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted unchanged and hashed; a separate private working copy read from `word/document.xml` paragraph text and with `mammoth` 1.12.2 `extractRawText` (the importer's .docx call). Nothing from the source is committed.

## Findings
- First non-empty line: `SECOND TERM E-LEARNING NOTE` (occurs exactly once, in both the XML text and mammoth output).
- Next line: `SUBJECT: AGRICULTURAL SCIENCE` ... `CLASS: SS 1`. The scheme of work (revision, cultural practices, crop husbandry, agricultural ecology, rocks and soil formation, revision, examination) and the reference list (Agricultural Science textbooks) agree. Subject confirmed from the document, not the filename (which spells `AGRICULTRAL`); no handoff needed.
- The heading is the generic template title, as in the 1st Term, so a `source_alias` is declared.
- Teaching content was only skimmed to confirm the subject. No week inventory, objectives or visuals were recorded (see AG-INV-T2).

## Edits
- `backend/src/db/ss1/subjects/agricultural-science.json`: added sources[1], `source_alias` rule `SS1-SRC-956594d97094-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `AGRICULTURAL-SCIENCE-ALIAS-APPROVAL-T2` (OWNER_ACTION, blocks delivery). 38 lines added, none removed; the 1st Term entries are untouched.
- `QUEUE.json`: AG-SRC-T2 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for both terms. The source has no coverage until AG-INV-T2.
- Runnable next: `AG-SRC-T3`, `AG-INV-T1`, `AG-INV-T2` (all edit the same package or queue; run one at a time). `NEXT_TASK.md` was outside the allowed write paths and is unchanged.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
