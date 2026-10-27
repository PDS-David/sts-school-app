# Mathematics work queue — build note

- Reviewed master SHA: `b49a1a5a2f72037ca4cf1fa2abbe217246b12a38` (merge of PR #91). No Mathematics queue existed and no open PR owns this task. The only open PR is #71, which is not used as a foundation. No `AGENTS.md` exists in the repository.
- Built from repository evidence only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device). Testing deferred by owner.

## Existing work recognised (recorded, not verified)
- 3 sources registered in `mathematics.json`; hashes, members and terms equal `SOURCE_ASSIGNMENTS.csv` → `MATH-SRC-T1..T3` IMPLEMENTED_TESTING_DEFERRED. This is registered metadata only: the recorded header text is not shown to have been checked against the documents, so `MATH-FACT-HEADER-T1..T3` are separate. The three alias rules carry `approval_reference` "PENDING-OWNER".
- 6 authored T1 lessons (Weeks 1, 3, 4, 5, 6, 10) and 6 delivery-correction bindings: implemented code, content approval PENDING, verification DEFERRED. Their whole-row scope review is **not** done and is tracked by the week items.
- 34 coverage entries: 22 PARTIAL, 6 IMPLEMENTED_EQUIVALENT, 5 MARKER, 1 UNRESOLVED (row-level only, not proof of objective-level coverage). 8 source rules, 7 open items (`OI-MATH-001..007`), no assets.
- `tests/ss1/mathematics.package.test.mts` (11 tests) written, not run → `MATH-TEST-PACKAGE-EXISTING`.

## Unmerged work that must be preserved (not on master)
- PR #71 head `b5ced7ebb0efe22df2351baa140266fbf40cbf41` (branch `ss1/SS1-01-20261026-claude`), reconciliation item D-2. Path `backend/src/db/ss1/subjects/mathematics.json`, blob `1ebbdcf076b5a6e35f855e6b5593a523e27561c8` (same blob at `2985d57`, branch `ss1/SS1-03-20261027-B`): 16 lessons for 2nd/3rd Term, 2 rules, 22 coverage entries, 7 open items, authored in #71's schema.
- Related D-4 files: `docs/ss1/work/SS1-03/CHECKPOINT.md` blob `f2c37bd28e06d0fa3f1424b27fcdfbc1675ef96c`, `HANDOFF.json` blob `f3ee7c4559931744ab679bc6f8975fd7091c0710`, `tests/ss1/mathematics.test.mts` blob `b22b9a654595f704cad77bd011bcb57886de6425`.
- Tracked as 22 `MATH-PORT-D2-*` items (16 per-lesson ports, 2 coverage comparisons, 1 rules comparison, 3 fact ports) and 2 `MATH-CMP-D4-*` items. Master has no 2nd/3rd Term lessons, so there is no lesson-level overlap with its six T1 lessons. The branch work is not counted as implemented. Do not merge #71 or copy its schema.

## Evidence limitations
- Week inventory comes from `docs/ss1/work/SS1-03/evidence/parsed_rows.json` (T1 11 rows, T2 10, T3 11), consistent with the 32 row-level coverage locators. It proves the parsed rows, not every scheme objective inside them.
- Preamble/scheme-table, reference-book and visual content of the documents is not recorded in the repository; `MATH-PRE-*` and `MATH-VIS-*` items exist for that, with no assumed content.
- The tutor-advertising concern for Mathematics 2nd/3rd Term rests on one sentence in the SS1-03 checkpoint; `MATH-FACT-ADVERT-*` verify it.
- #71 reported that the T1 file its worker received had different bytes from the manifest; workers must check the member SHA-256 before reading.
- Several items write the same package file; workers start from current master and change only their own entries.

## Queue totals (95 items)
- Status: 16 IMPLEMENTED_TESTING_DEFERRED, 70 PENDING, 9 BLOCKED, 0 IN_PROGRESS.
- Kinds: 3 SOURCE_REGISTRATION, 6 FACTUAL_DEPENDENCY, 3 SOURCE_PREAMBLE_INDEXING, 32 SOURCE_WEEK_INDEXING (T1 11, T2 10, T3 11), 8 LESSON (6 existing, 2 blocked T1 logarithm lessons), 6 CORRECTION_BINDING, 3 OWNER_DECISION, 2 OWNER_APPROVAL, 3 VISUAL_DISPOSITION, 1 ASSET, 1 SOURCE_RULE, 1 SCOPE_DECOMPOSITION, 22 BRANCH_PORT, 2 BRANCH_COMPARISON, 2 TEST.
- No lesson-writing item exists for an unproven gap. Only T1 Weeks 8 and 9 (logarithms; PARTIAL, no replacement, blocked by `OI-MATH-003`) are named.
- Audio is not applicable to this subject.

## Next runnable task
**`MATH-FACT-HEADER-T1`** — first PENDING item whose dependency (`MATH-SRC-T1`) is complete. Attach archive `SSS 1-20260507T072431Z-3-001 (1).zip` (sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a filename variant is fine if the hash matches) and member `SSS 1/1st Term SS1_/MATHss1.docx` (sha256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb`).
Also runnable now (listed in `runnable_now`): `MATH-FACT-HEADER-T2`, `MATH-FACT-HEADER-T3`, `MATH-PORT-D2-RULES`, `MATH-CMP-D4-NOTES`. T1 week indexing starts after `MATH-FACT-HEADER-T1`.

## Checks done
JSON syntax, 95 unique IDs, all `depends_on` resolve, no cycles, totals match, source hashes and members equal the CSV rows.
