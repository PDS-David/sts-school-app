# PHYS-SRC-T2 — Physics, 2nd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `6046412` (origin/master). No open branch for this item was found; prerequisite PHYS-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified).
- Source `SS1-SRC-2c924c964660`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 PHYSICS.doc`.
- Member SHA-256 `3941deccd3f4c68065a496ede3752784d2535e3c03608450a12b2a7c4a0b9fa7` **verified**; equals `SOURCE_ASSIGNMENTS.csv` (466,432 bytes).
- Supplied container: partial ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip`, SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`, member path `2nd Term SS1 /2ND TERM S1 PHYSICS.doc`. Not the composite archive; the composite hash was **not** checked.
- Method: member hashed unchanged; private copy read with `word-extractor` 1.0.4 `extract().getBody()` (the importer's legacy .doc call). Nothing from the source is committed.

## Findings
- Opening text: `SECOND TERM E-LEARNING NOTE` (line 1), `SUBJECT:  PHYSICS … CLASS: SS 1` (line 3, two spaces after the colon), `SCHEME OF WORK` (10 weeks: heat energy, thermometers, expansion, heat transfer, electric charges, electroscope, fields, electric field, continuous electric current) and reference books (Anyakoha, Okeke).
- Teaching begins at `WEEK ONE`, `TOPIC: Heat Energy, Concept of Heat and Temperature and Effects of Heat`. The header names Physics, so no handoff is needed.
- The subject line occurs once (`PHYSICS` alone occurs 15 times), so it is the unique `header_text` (trailing whitespace excluded). It differs from "Physics" by labels, so a `source_alias` is declared. The PR #71 claim of header text on "line 2" was not used.
- No week inventory, lessons, coverage, corrections or assets were created; week rows were not audited.

## Edits
- `physics.json`: added the source entry, rule `SS1-SRC-2c924c964660-R001` (alias, `PENDING-OWNER`) and blocking open item `PHYSICS-T2-ALIAS-APPROVAL`. The 1st Term entries are untouched. Package stays PENDING.
- `QUEUE.json`: PHYS-SRC-T2 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (none invented). No coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- Items editing `physics.json` should run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
