# GEO-SRC-T3 — Geography, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `7afd675` (origin/master, after PR #154). No open PR and no branch for this item was found; prerequisite GEO-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified), and GEO-SRC-T2 was already on master.
- Source `SS1-SRC-74a10d374306`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 GEOGRAPHY.doc`.
- Member SHA-256 `54931bac00bfde6b2ff5d32e2b645872af74dc32d8e0f69d0585f40e443726c6` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (200,192 bytes).
- Supplied container: partial ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip`, SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`, member path `3rd Term SS1 /3RD TERM S1 GEOGRAPHY.doc`. It is not the composite archive; the composite hash was **not** checked. `archive_member` stays as the manifest value.
- Method: member extracted unchanged and hashed; a separate private copy read with `word-extractor` 1.0.4 `extract().getBody()` (the importer's legacy .doc call). Nothing from the source is committed.

## Findings
- Opening text: `THIRD TERM E-LEARNING NOTE`, `SUBJECT:  GEOGRAPHY … CLASS:  SS1` (line 3), `SCHEME OF WORK` (weeks 1–10), `REFERENCE: Essential Geography for Senior Secondary Schools by O.A. Iwena`.
- Teaching begins at `WEEK ONE AND TWO`, `NIGERIA: LOCATION, POSITION AND SIZE`; the scheme covers Nigeria's location, relief and drainage, climate, vegetation and soils, transportation and industries, population, agriculture, mineral resources and power resources. The header names Geography, so no handoff is needed.
- The full subject line occurs once and is the unique `header_text` (it ends at `SS1`, no trailing whitespace). Upper-case `GEOGRAPHY` occurs only in that line (11 times case-insensitively). It differs from "Geography" by labels, so a `source_alias` is declared. The class label has no space (`SS1`), like the 1st Term line.
- No week inventory, lessons, coverage, corrections or assets were created; the week rows were not audited (GEO-INV-T3).

## Edits
- `geography.json`: added the source entry, rule `SS1-SRC-74a10d374306-R001` (alias, `PENDING-OWNER`) and blocking open item `GEOGRAPHY-T3-ALIAS-APPROVAL`. The 1st and 2nd Term sources and their entries are untouched. Package stays PENDING.
- `QUEUE.json`: GEO-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (no reference invented). The source has no coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- GEO-INV-T1 to T3 edit the queue and later the package; run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
