# CIV-SRC-T3 — Civic Education, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `c354940f97b3f03893c5ca0364d18ea9917e3384` (includes merged PRs #144 and #145). CIV-SRC-T1 and CIV-SRC-T2 were already implemented on master. No open PR or branch touched CIV-SRC-T3.
- Source `SS1-SRC-0dc1f445683f`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 CIVIC EDUCATION.docx`.
- Container: the supplied "3rd Term SS1" zip (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`), member `3rd Term SS1 /3RD TERM S1 CIVIC EDUCATION.docx`. An earlier attempt in this session stopped because only the 2nd Term zip had been attached. The composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied.
- Member SHA-256 `8790f478409619cb22a9a00d31a0069589c5277c27ecd81221ef76edf16d3ea1` **verified** from the extracted bytes (50,715 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted unchanged with `unzip` and hashed; a private working copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `THIRD  TERM  E- NOTES`, then `S.S.1.       CIVICS   EDUCATION`, then a scheme of work (WEEK 1 revision; WEEK 2-3 cultism; WEEK 4-5 law and order; WEEK 6 respect for constituted authority; WEEK 7 employment and unemployment; WEEK 8-9 capitalist democracy; WEEK 10 revision; WEEK 11 & 12 examination and closing), then the week bodies.
- Subject confirmed from the document as Civic Education, not Government (the header names "CIVICS EDUCATION"; "government" appears only in body text); no handoff needed. The document's term line agrees with the manifest 3rd Term.
- The heading `S.S.1.       CIVICS   EDUCATION` occurs once and is the header_text. It differs from "Civic Education" by the class label, the extra S in "CIVICS" and spacing, so a `source_alias` is declared. No week inventory recorded here. The document has no embedded media.

## Edits
- `backend/src/db/ss1/subjects/civic-education.json`: added sources[2], `source_alias` rule `SS1-SRC-0dc1f445683f-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `CIVIC-EDUCATION-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Additions only; other sources, rules and items untouched. Package stays PENDING.
- `QUEUE.json`: CIV-SRC-T3 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias decision. The source has no coverage until CIV-INV-T3.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
