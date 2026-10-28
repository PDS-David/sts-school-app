# BIO-SRC-T3 — Biology, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `ac267bd3df82d0b98c069bd33f8a0d6168915a26` (origin/master). BIO-SRC-T1 and BIO-SRC-T2 are implemented on master; no open PR or branch owns BIO-SRC-T3.
- Source `SS1-SRC-78059230037f`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 BIOLOGY.docx`.
- Member SHA-256 `1e9a758cdd07bd13511059b6d8ef6db0f618f99b14cdf11d20d33c183cb1bca4` **verified** (416,847 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Container supplied: ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip` (member path `3rd Term SS1 /3RD TERM S1 BIOLOGY.docx`). Its own SHA-256 was not compared with the composite archive hash, so **no composite hash check is claimed**; the member hash decides.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read from `word/document.xml` paragraph text and with `mammoth` 1.12.2 `extractRawText({path})`. Nothing from the source is committed.

## Findings
- First paragraph (line 1): `THIRD TERM E-LEARNING NOTE`, occurring exactly once (also case-insensitively) in both the XML text and mammoth output. Line 3: `SUBJECT:  BIOLOGY` … `CLASS:  S. S. ONE`.
- Subject confirmed from the document, not the filename: scheme of work (micro-organisms and culturing, micro-organisms in action, STIs, health, biology and agriculture, pests and diseases of plants and animals, food storage and production) and a Biology reference list. No handoff needed.
- The heading is the generic template title, as in the 2nd Term, so a `source_alias` is declared with `PENDING-OWNER`.
- The source is a .docx here (the 2nd Term member is .doc). It holds 4 media files; not inventoried. Teaching content was only skimmed; week labels in the body are irregular (for example `WEEK SIX& SEVEN`, a second `WEEK THREE`), which belongs to the indexing items, not this one.

## Edits
- `biology.json`: added sources[2], rule `SS1-SRC-78059230037f-R001` and open item `BIOLOGY-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Existing entries untouched; package stays PENDING.
- `QUEUE.json`: BIO-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for all three terms. The source has no coverage until indexing.
- Run same-file items one at a time; see `next_runnable`.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
