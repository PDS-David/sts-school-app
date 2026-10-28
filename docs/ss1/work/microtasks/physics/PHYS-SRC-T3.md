# PHYS-SRC-T3 — Physics, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `35d2fce` (origin/master, after PR #158). No open PR and no branch for this item was found; prerequisite PHYS-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified), and PHYS-SRC-T2 was already on master.
- Source `SS1-SRC-bed91bb4ef0e`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`.
- Member SHA-256 `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688` **verified**; equals `SOURCE_ASSIGNMENTS.csv` and the task note (107,008 bytes).
- Supplied container: partial ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip`, SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`, member path `3rd Term SS1 /3RD TERM S1 PHYSICS.doc`. It is not the composite archive; the composite hash was **not** checked. `archive_member` stays as the manifest value.
- Method: member extracted unchanged and hashed; a private copy read with `word-extractor` 1.0.4 `extract().getBody()` (the importer's legacy .doc call), plus `getHeaders()`/`getFooters()` for the page header and footer. Nothing from the source is committed.

## Findings
- **The document body names no subject.** Line 1 is `THIRD TERM E-LEARNING NOTE` (32 leading, 2 trailing spaces), line 2 is `THIRD TERM SCHEME OF WORK`, then a numbered scheme (items 1–12: electric circuit to examination) and `WEEK 1` to `WEEK 10`. There is no `SUBJECT:` line and no `CLASS:` line, and upper-case `PHYSICS` never occurs. This confirms, by direct reading, the PR #71 claim that the task note called unverified.
- `physics` occurs 10 times case-insensitively, all in `Reading Assignment … New school physics (pg …)` lines.
- The page header and footer both read `WKLAS/SS1/3rd term/Physics` followed by `Page 14`. They name Physics, SS1 and the 3rd Term, but are not part of the body text the compiler searches, so they cannot be `header_text`. Used as corroboration only.
- Teaching topics (Weeks 1–10): electric circuit; resistors and cells in series and parallel; electrical energy and power; safety device, fuse; atomic structure and states of matter; crystal structure of matter; surface tension; capillarity; elasticity; energy stored in an elastic material. This is Physics, so no handoff to another subject.
- `header_text` is the opening heading `THIRD TERM E-LEARNING NOTE`; it occurs exactly once (the compiler's `once()` test). It does not equal "Physics", so a `source_alias` is declared.
- `canonical_subject` `Physics` rests on the page header/footer, the teaching content and the manifest assignment, **not on a body heading**. The filename was not used as evidence.
- No week inventory, lessons, coverage, corrections or assets were created; the week rows were not audited.

## Edits
- `physics.json`: added the source entry, rule `SS1-SRC-bed91bb4ef0e-R001` (alias, `PENDING-OWNER`) and blocking open item `PHYSICS-T3-ALIAS-APPROVAL`. The 1st and 2nd Term entries are untouched. Package stays PENDING.
- `QUEUE.json`: PHYS-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed. `runnable_now` and `PHYS-OWNER-ALIAS-T3` were not touched.

## Remaining
- **Owner action:** confirm the assignment of this document to Physics and record an approval reference for the alias (`PHYS-OWNER-ALIAS-T3`, now confirmed as needed). None invented.
- The source has no coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- Items editing `physics.json` should run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
