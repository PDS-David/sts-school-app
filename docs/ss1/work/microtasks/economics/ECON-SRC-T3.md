# ECON-SRC-T3 — Economics, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `bbce98417df5824e0bd1d746d788afb212463c9a`. ECON-SRC-T1 and ECON-SRC-T2 were already implemented on master. The only open PR (#148, Data Processing) touches no Economics file; no open PR or branch touched ECON-SRC-T3.
- Source `SS1-SRC-6a6ff668d5a9`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 ECONOMICS.doc`.
- Container: the supplied "3rd Term SS1" zip (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`), member `3rd Term SS1 /3RD TERM S1 ECONOMICS.doc`. The composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied.
- Member SHA-256 `9e257c8b25ec5e7ae0ce8c6f9fa325f82ee3d5d327c587450811b877c5ea185d` **verified** from the extracted bytes (360,448 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted unchanged with `unzip` and hashed; a private working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer's legacy .doc call) in a scratch directory. Nothing from the source is committed.

## Findings
- Opening text: `THIRD TERM E-LEARNING NOTE`, then `SUBJECT:  ECONOMICS<7 tabs, 8 spaces, 2 tabs>CLASS:  SSS 1`, `SCHEME OF WORK`, a WEEK/TOPICS list (revision of second term unified examination, distributive trade, middlemen, money and its functions, and later topics), then `WEEK ONE` to `WEEK TEN` bodies.
- Subject confirmed from the document as Economics, not Commerce ("commerce" occurs only in a body-text classification, "General Commerce"); no handoff needed. The document's term line agrees with the manifest 3rd Term.
- The full subject line occurs once and is the header_text (`ECONOMICS` alone occurs once capitalised, 24 times ignoring case). It differs from "Economics" by label and class text, so a `source_alias` is declared. No week inventory recorded here.

## Edits
- `backend/src/db/ss1/subjects/economics.json`: added sources[2], `source_alias` rule `SS1-SRC-6a6ff668d5a9-R001` (approval_reference `PENDING-OWNER`; nothing invented) and open item `ECONOMICS-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Additions only; other sources, rules and items untouched. Package stays PENDING.
- `QUEUE.json`: ECON-SRC-T3 -> IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias decision. The source has no coverage until ECON-INV-T3.
- Runnable items edit the same package file; run them one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
