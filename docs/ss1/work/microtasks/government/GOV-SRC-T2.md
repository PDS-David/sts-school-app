# GOV-SRC-T2 — Government, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `8948914` (origin/master). No open branch for this item was found; prerequisite GOV-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified).
- Source `SS1-SRC-c76f430c7cf8`, manifest member `SSS 1/2nd Term SS1_/GOVT.docx`.
- Member SHA-256 `bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (591,018 bytes). Supplied as a standalone `GOVT.docx`; no enclosing container, so no composite hash was checked.
- A different `GOVT.docx` (SHA-256 `7034bc4f0089a578183be1ff07ef8599a6fc27ad6afa4b106edee8d1ecaaf35e`, 36,001 bytes) in the partial ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip` did not match and was not used.
- Method: member hashed unchanged; a separate private copy read with `mammoth` 1.12.2 `extractRawText` (the importer's .docx call) and from `word/document.xml` paragraph text. Nothing from the source is committed.

## Findings
- Opening lines: `TERM: 2ND TERM`, `SUBJECT: GOVERNMENT`, `CLASS: SS 1` (lines 1, 3, 5), then `SCHEME OF WORK` (colonial administration, nationalism, constitutional development, federalism, political parties).
- Teaching begins at `WEEK ONE`, `TOPIC: COLONIAL ADMINISTRATION (HISTORICAL BACKGROUND)`. The header names Government, so no handoff is needed; the filename variation GOVT is not used as an alias.
- The subject line occurs once (`GOVERNMENT` alone occurs 25 times), so it is the unique `header_text` (trailing space excluded). It differs from "Government" by the `SUBJECT:` label, so a `source_alias` is declared.
- Observed only, not audited (GOV-INV-T2): eleven `WEEK` labels, and one OMML equation object in `word/document.xml`.

## Edits
- `government.json`: added the source entry, rule `SS1-SRC-c76f430c7cf8-R001` (alias, `PENDING-OWNER`) and blocking open item `GOVERNMENT-T2-ALIAS-APPROVAL`. The 1st Term source is untouched. Package stays PENDING.
- `QUEUE.json`: GOV-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (none invented). No coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- GOV-SRC-T3, then GOV-INV-T1 to T3, edit the same package; run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
