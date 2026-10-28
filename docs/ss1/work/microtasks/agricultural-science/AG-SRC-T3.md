# AG-SRC-T3 — Agricultural Science, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `d255b6cadc2650433ddb0b7d5d3dbfc21dced5ed` (origin/master). AG-SRC-T1 and AG-SRC-T2 are implemented on master; no open PR or branch owns AG-SRC-T3.
- Source `SS1-SRC-458a07f7ea5a`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`.
- Member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` **verified** (5,406,306 bytes); equals `SOURCE_ASSIGNMENTS.csv`.
- Container supplied: ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip` (member path `3rd Term SS1 /3RD TERM S1 AGRICULTURAL SCIENCE.docx`). Its own SHA-256 was not compared with the composite archive hash, so **no composite hash check is claimed**; the member hash decides.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read from `word/document.xml` paragraph text and with `mammoth` 1.12.2 `extractRawText({path})`. Nothing from the source is committed.

## Findings
- First paragraph (line 1): `THIRD TERM E-LEARNING NOTE`, occurring exactly once in both the XML text and mammoth output; no image-only paragraph precedes it. Line 5: `SUBJECT: AGRICULTURAL SCIENCE` … `CLASS: SS1`.
- Subject confirmed from the document: scheme of work (simple farm tools, farm power, farm mechanization, animal anatomy/physiology, reproduction, environmental physiology, livestock management, revision, examination), a reference list of agricultural/animal-production books, and teaching headings `WEEK ONE` simple farm tools and `WEEK TWO` farm power. No handoff needed.
- The heading is the generic template title, as in the 1st and 2nd Terms, so a `source_alias` is declared with `PENDING-OWNER`.
- The 5.4 MB size comes from embedded media (25 files under `word/media`); not inventoried here (see the visual/inventory items). `header1.xml` and `footer1.xml` exist and were not inspected. Teaching content was only skimmed.

## Edits
- `agricultural-science.json`: added sources[2], rule `SS1-SRC-458a07f7ea5a-R001` and open item `AGRICULTURAL-SCIENCE-ALIAS-APPROVAL-T3` (OWNER_ACTION, blocks delivery). Existing 1st and 2nd Term entries untouched; package stays PENDING.
- `QUEUE.json`: AG-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval for all three terms. The source has no coverage until indexing.
- Run same-file items one at a time; see `next_runnable`.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
