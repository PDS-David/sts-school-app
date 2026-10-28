# GEO-SRC-T2 — Geography, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `8948914` (origin/master, after PR #131). No open branch for this item was found; prerequisite GEO-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified).
- Source `SS1-SRC-ba9dee61c27c`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 GEOGRAPHY.doc`.
- Member SHA-256 `fa120c0e9f2f7a47df2c775afdfe049b41ab2acb1972c1457b31c85e70b3a2e5` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (239,616 bytes).
- Supplied container: partial ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip`, SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, member path `2nd Term SS1 /2ND TERM S1 GEOGRAPHY.doc`. It is not the composite archive; the composite hash was **not** checked. `archive_member` stays as the manifest value.
- Method: member extracted unchanged and hashed; a separate private copy read with `word-extractor` 1.0.4 `extract().getBody()` (the importer's legacy .doc call). Nothing from the source is committed.

## Findings
- Opening text: `SECOND TERM E-LEARNING NOTE`, `SUBJECT: GEOGRAPHY … CLASS: SS 1` (line 3), `SCHEME OF WORK` (weeks 1–11), `REFERENCE MATERIAL: Essential Geography for Senior Secondary Schools, O.A. Iwena.`
- Teaching begins at `WEEK ONE`, `TOPIC: MOUNTAINS`; the scheme covers mountains, plateaux, lowlands, the environment, weather and climate, GIS, map reading and map distances. The header names Geography, so no handoff is needed.
- The subject line occurs once; `GEOGRAPHY` alone occurs 11 times, so the full line is the unique `header_text` (it ends at `SS 1`, no trailing whitespace). It differs from "Geography" by labels, so a `source_alias` is declared. Unlike the 1st Term line, the class label has a space (`SS 1`).
- No week inventory, lessons, coverage, corrections or assets were created; the week rows were not audited (GEO-INV-T2).

## Edits
- `geography.json`: added the source entry, rule `SS1-SRC-ba9dee61c27c-R001` (alias, `PENDING-OWNER`) and blocking open item `GEOGRAPHY-T2-ALIAS-APPROVAL`. The 1st Term source and its entries are untouched. Package stays PENDING.
- `QUEUE.json`: GEO-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (no reference invented). The source has no coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- GEO-SRC-T3, then GEO-INV-T1 to T3, edit the same package; run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
