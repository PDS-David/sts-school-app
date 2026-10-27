# Physics work queue — build note

- Reviewed master SHA: `77f31485e3e3dbcdb1cfa2a55913c27b4a25b8ad` (merge of PR #92). No Physics queue existed and no open PR owns this task; the only open PR is #71, which is not used as a foundation. No `AGENTS.md` exists in the repository.
- Built from repository evidence only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device). Testing deferred by owner.

## Existing work recognised
- **Finding: no Physics package exists on master.** `backend/src/db/ss1/subjects/` has no `physics.json` (the loader would report MISSING_PACKAGE), no Physics test exists, and the SS1-03 checkpoint lists Physics as NOT STARTED. So nothing is registered or implemented; nothing is marked complete.
- Three sources are assigned in `SOURCE_ASSIGNMENTS.csv` (all legacy `.doc`, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER): `SS1-SRC-5c0149cda71d` (1st Term), `SS1-SRC-2c924c964660` (2nd), `SS1-SRC-bed91bb4ef0e` (3rd). Each gets its own registration item.
- The SS1-03 checkpoint records defects found while reading 3rd Term Weeks 1-4 (fuse rating, "merger tester", `I = E / R + r`, unrelated Week 4 assignment items, scheme vs Week 5 mismatch). They are queued as `PHYS-FACT-T3-*` verification items, not treated as established.

## Unmerged work that must be preserved (not on master)
- PR #71 head `b5ced7ebb0efe22df2351baa140266fbf40cbf41` (branch `ss1/SS1-01-20261026-claude`), reconciliation item D-1. Path `backend/src/db/ss1/subjects/physics.json`, blob `5b4010a8db081ddcafafd5bf98bfcbd7b31c09f3` (same blob at `2985d57`, branch `ss1/SS1-03-20261027-B`): 5 lessons (2nd Term x2, 3rd Term x3), 1 rule (`PHYS-R01`, week split), 32 coverage entries, 5 open items, in #71's schema.
- Related D-4 files: `tests/ss1/physics.test.mts` blob `29f970835849cf756c585330b80f39866d35aa69`; the shared checkpoint/handoff blobs `f2c37bd…` and `f3ee7c4…`.
- Tracked as 13 `PHYS-PORT-D1-*` items (5 per-lesson ports, 3 coverage comparisons, 1 rule comparison, 4 defect checks) and 2 `PHYS-CMP-D4-*` items. Master has no Physics lessons, so nothing overlaps. The branch work is not counted as implemented. Do not merge #71 or copy its schema.

## Evidence limitations
- Week inventory comes from `docs/ss1/work/SS1-03/evidence/parsed_rows.json` (T1 9 rows, T2 10, T3 10); T1 "WEEK FIVE AND SIX" is one row. It proves parsed rows, not every scheme objective.
- Scheme weeks with no body (branch-reported: T1 Week 11, T3 Weeks 11-12 with the examination) are not rows; `PHYS-PRE-*` items and rule items cover them. Their existence is a branch claim until the documents are read.
- Header text, including the claim that the 3rd Term document has no subject heading, is branch-reported and unverified; registration items must read it from the originals.
- Equation/notation loss was not measured for Physics, and figure counts are unknown.
- Several items write the same package file; workers start from current master and change only their own entries.

## Queue totals (66 items)
- Status: 0 IMPLEMENTED_TESTING_DEFERRED, 59 PENDING, 7 BLOCKED, 0 IN_PROGRESS.
- Kinds: 3 SOURCE_REGISTRATION, 3 SOURCE_PREAMBLE_INDEXING, 29 SOURCE_WEEK_INDEXING (T1 9, T2 10, T3 10), 2 SOURCE_RULE, 4 FACTUAL_DEPENDENCY, 3 VISUAL_DISPOSITION, 2 OWNER_DECISION, 2 OWNER_APPROVAL, 13 BRANCH_PORT, 2 BRANCH_COMPARISON, 1 SCOPE_DECOMPOSITION, 2 TEST.
- No lesson-writing item exists: no specific uncovered objective is established on master. Indexing or fact items append one only when they name it.

## Next runnable task
**`PHYS-SRC-T1`** — no dependencies, PENDING. It may create the minimum package (explicit permission in its allowed paths and completion condition). Attach archive `SSS 1-20260507T072431Z-3-001 (1).zip` (sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a filename variant is fine if the hash matches) and member `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc` (sha256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`).
Also runnable now: `PHYS-CMP-D4-NOTES` (no attachment). `PHYS-SRC-T2` and `PHYS-SRC-T3` wait for `PHYS-SRC-T1` because it creates the package file.

## Checks done
JSON syntax, 66 unique IDs, all `depends_on` resolve, no cycles, totals match, source hashes and members equal the CSV rows.
