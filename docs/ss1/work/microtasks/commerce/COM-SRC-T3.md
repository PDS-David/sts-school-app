# COM-SRC-T3 — Commerce, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `66cdc44900d816a03d5f8dc8501af90dc0d842d2`. COM-SRC-T1 and COM-SRC-T2 were already implemented on master. No open PR or branch touched COM-SRC-T3.
- Source `SS1-SRC-d436db5f412d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 COMMERCE.doc`.
- Container: the supplied "3rd Term SS1" zip (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`), member `3rd Term SS1 /3RD TERM S1 COMMERCE.doc`. The composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied.
- Member SHA-256 `a5d127fef6807a87a063f71c20c404036e476a46032037ffd74da12a72995589` **verified** from the extracted bytes (169,472 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted unchanged with `unzip` and hashed; a private working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `THIRD TERM E-LEARNING NOTE`, then `SUBJECT:  COMMERCE<7 tabs, 8 spaces>CLASS:  SS1`, `SCHEME OF WORK`, a WEEKS/TOPICS list (sole proprietorship, partnership, money, central bank, commercial bank, the cheque system, negotiable instruments, other financial institutions, revision), then `WEEK 1` to `WEEK 10` bodies.
- Subject confirmed from the document as Commerce, not Economics (the single "economics" is body text in an exercise on money); no handoff needed. The document's term line agrees with the manifest 3rd Term.
- The full subject line occurs once and is the header_text (`COMMERCE` alone occurs once capitalised and 23 times ignoring case). It differs from "Commerce" by label and class text, so a `source_alias` is declared. No week inventory recorded here.

## Edits
- `backend/src/db/ss1/subjects/commerce.json`: added sources[2], `source_alias` rule `SS1-SRC-d436db5f412d-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `COMMERCE-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Additions only; other sources, rules and items untouched. Package stays PENDING.
- `QUEUE.json`: COM-SRC-T3 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias decision. The source has no coverage until COM-INV-T3.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
