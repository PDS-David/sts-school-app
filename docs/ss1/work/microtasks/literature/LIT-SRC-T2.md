# LIT-SRC-T2 — Literature, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `5148a17` (origin/master). No open branch for this item was found; prerequisite LIT-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified).
- Source `SS1-SRC-1728961e97b5`, manifest member `SSS 1/2nd Term SS1_/LITERATURE.docx`.
- Member SHA-256 `a12244cb5312680610ab03f8d76aaaf285a0eebdf4fb618491d01e30584dd757` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (57,389 bytes).
- Supplied container: partial ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip`, SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, member path `2nd Term SS1 /LITERATURE.docx`. It is not the composite archive; the composite hash was **not** checked. `archive_member` stays as the manifest value.
- Method: member hashed unchanged; a separate private copy read with `mammoth` 1.12.2 `extractRawText` (the importer's .docx call). Nothing from the source is committed.

## Findings
- Opening lines: `SECOND TERM SCHEME OF WORK 2016/2017` (1), `CLASS: SS1` (3), `LITERATURE – IN – ENGLISH` (5, en dashes U+2013), then a scheme table (weeks 1–10: African drama, African poetry, further set texts). There is no `SUBJECT:` label.
- Teaching begins at `WEEK ONE`, `TOPIC: INTRODUCTION TO AFRICA DRAMA – HARVEST OF CORRUPTION`. The header names Literature-in-English, so no handoff is needed; it is not English Language.
- The subject line occurs once (`LITERATURE` alone occurs 4 times), so it is the unique `header_text` (trailing space excluded). It differs from the canonical `Literature-in-English` used by LIT-SRC-T1 by spaced en dashes, so a `source_alias` is declared. The title's `2016/2017` session year is noted and not used as evidence.
- The relationship to the 3rd Term member stays with LIT-FACT-T2-T3-RELATIONSHIP; nothing is excluded. Observed only, not audited: nine `WEEK` labels (ONE to NINE).

## Edits
- `literature.json`: added the source entry, rule `SS1-SRC-1728961e97b5-R001` (alias, `PENDING-OWNER`) and blocking open item `LITERATURE-T2-ALIAS-APPROVAL`. The 1st Term entries are untouched. Package stays PENDING.
- `QUEUE.json`: LIT-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (none invented). No coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- Runnable items edit the same package; run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
