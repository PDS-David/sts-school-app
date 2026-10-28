# DP-SRC-T3 — Data Processing, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `bbce98417df5824e0bd1d746d788afb212463c9a`. DP-SRC-T1 and DP-SRC-T2 were already implemented on master. No open PR or branch touched DP-SRC-T3.
- Source `SS1-SRC-6763fdc397c3`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 DATA PROCESSING.docx`.
- Container: the supplied "3rd Term SS1" zip (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`), member `3rd Term SS1 /3RD TERM S1 DATA PROCESSING.docx`. The composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied.
- Member SHA-256 `09e34afd68c595dc5da1e8d067d4f299f7114990aab0f71883488d2853167804` **verified** from the extracted bytes (1,493,833 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted unchanged with `unzip` and hashed; a private working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `THIRD TERM E-LEARNING NOTE`, then `SUBJECT: DATA PROCESSING<6 tabs>CLASS: SS1`, `SCHEME OF WORK`, a WEEK/TOPIC list (revision; word processing I-III; spreadsheet I-III; database management I-III; revision; examination), `REFERENCES`, then `WEEK ONE` to `WEEK NINE` bodies.
- Subject confirmed from the document as Data Processing, not Computer Studies, ICT or another subject; "Computer Studies" occurs only inside textbook titles. No handoff needed and no Computer Studies/ICT mapping was made. The document's term line agrees with the manifest 3rd Term.
- The full subject line occurs once and is the header_text (`DATA PROCESSING` alone occurs once capitalised, 5 times ignoring case). It differs from "Data Processing" by label and class text, so a `source_alias` is declared. No week inventory recorded here. The document contains embedded media; not inventoried here.

## Edits
- `backend/src/db/ss1/subjects/data-processing.json`: added sources[2], `source_alias` rule `SS1-SRC-6763fdc397c3-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `DATA-PROCESSING-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Additions only; other sources, rules and items untouched. Package stays PENDING.
- `QUEUE.json`: DP-SRC-T3 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias decision. The source has no coverage until DP-INV-T3.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
