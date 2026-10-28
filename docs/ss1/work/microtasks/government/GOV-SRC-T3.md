# GOV-SRC-T3 — Government, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `6cd17f9` (origin/master, after PR #155). No open PR and no branch for this item was found; prerequisite GOV-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified), and GOV-SRC-T2 was already on master.
- Source `SS1-SRC-5f34b9f4efc4`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 GOVERNMENT.doc`.
- Member SHA-256 `04171c3632d3f6bcac893a2900e3c05dc3bd7fa089369e3ef575239701db368e` **verified**; equals `SOURCE_ASSIGNMENTS.csv` and the task note (228,352 bytes).
- Supplied inputs: a standalone `3RD_TERM_S1_GOVERNMENT.doc` and the partial ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip` (SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`, member path `3rd Term SS1 /3RD TERM S1 GOVERNMENT.doc`). The two files are byte-identical. The ZIP is not the composite archive; the composite hash was **not** checked. `archive_member` stays as the manifest value.
- Method: file hashed unchanged; a separate private copy read with `word-extractor` 1.0.4 `extract().getBody()` (the importer's legacy .doc call). Nothing from the source is committed.

## Findings
- Opening text: `THIRD TERM E-LEARNING NOTE`, `SUBJECT: GOVERNMENT … CLASS: SS 1` (line 3), `SCHEME OF WORK`, `REFERENCE: Essential Government by C.C. Dibie; Comprehensive Government by J.U. Anyaele`.
- Teaching begins at `WEEK TWO`, `TOPIC: FUNDAMENTAL HUMAN RIGHTS`; the scheme covers human rights, citizenship, constitutionalism, public opinion, pressure groups, political parties, party system, franchise and suffrage, electoral system and constituencies, with revision and examination in weeks 12/13. The header names Government, so the filename-based assignment is confirmed and no handoff is needed.
- The full subject line occurs once and is the unique `header_text` (it ends at `SS 1`, no trailing whitespace). Upper-case `GOVERNMENT` occurs only in that line (109 times case-insensitively). It differs from "Government" by labels, so a `source_alias` is declared.
- No week inventory, lessons, coverage, corrections or assets were created; the scheme rows were not audited (GOV-INV-T3).

## Edits
- `government.json`: added the source entry, rule `SS1-SRC-5f34b9f4efc4-R001` (alias, `PENDING-OWNER`) and blocking open item `GOVERNMENT-T3-ALIAS-APPROVAL`. The 1st and 2nd Term sources and their entries are untouched. Package stays PENDING.
- `QUEUE.json`: GOV-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (no reference invented). The source has no coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- GOV-INV-T1 to T3 edit the queue and later the package; run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
