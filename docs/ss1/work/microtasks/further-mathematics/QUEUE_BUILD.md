# Further Mathematics work queue — build note

- Reviewed master SHA: `8fb376f413cf70403d161439800738677bbc396a` (no Further Mathematics queue existed on master). No `AGENTS.md` exists in the repository. The only open PR is #71 (alternate foundation, `DO NOT MERGE`); it was not used as a base and no open PR owns this subject's queue.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device). Testing is deferred by the owner.

## Existing work recognised (recorded, not verified)
- 3 sources registered in `further-mathematics.json`; hashes, members and terms equal `SOURCE_ASSIGNMENTS.csv` (checked) → `FM-SRC-T1..T3` IMPLEMENTED_TESTING_DEFERRED. Header texts in the package were recorded by the SS1-03 worker; they are registered metadata, not re-verified here. The 3rd Term has no subject heading (alias rests on a cited textbook title). All three alias rules carry `PENDING-OWNER` approval.
- 6 authored 3rd Term lessons (Weeks 2, 3, 4, 5, 6, 8), 6 hash-bound delivery corrections, 1 SVG asset (hash and size match the package): implemented code, content approval PENDING, verification DEFERRED. Their replacement-scope review is **not** done and is tracked in the `FM-WK-T3-*` items.
- 30 coverage entries: 1st/2nd Term rows PARTIAL (no replacement lessons, rows unreviewed), markers for revision/examination, 3rd Term rows IMPLEMENTED_EQUIVALENT at row level only, `COV-FM-T3-SCHEME` UNRESOLVED. Row-level coverage is not proof of objective-level checking.
- `tests/ss1/further-mathematics.package.test.mts` (11 tests) written, not run → `FM-TEST-PACKAGE-EXISTING`.
- Open items OI-FM-001..006 are unchanged in the package; they map to `FM-FACT-EQUATION-*`, `FM-SCOPE-OI-FM-002/003`, `FM-FACT-T3-MISSING-MATERIAL`, `FM-VIS-*-BRANDING`, `FM-FACT-VENDOR-PERMISSION`, `FM-FACT-CONTENT-APPROVAL`, `FM-TEST-*`.

## Evidence limitations
- Week inventory comes from SS1-03 `parsed_rows.json` and the coverage locators, not from reading the documents: 1st Term ten week labels (WEEK FIVE carries two parsed rows), 2nd Term ten, 3rd Term six (Weeks 2, 3, 4, 5, 6, 8). Scheme-table text and week-to-topic lists are not recorded in the repository (`FM-PRE-T1/T2`). That the 3rd Term has no scheme and lacks Weeks 1, 7, 9-12 is the earlier worker's claim, to be confirmed by `FM-INV-T3`.
- Figures (Venn, mapping, graphs, vector, straight-line) are known only from PR71's general statement and OI-FM-003; no locations are recorded.
- No lesson-writing item exists: no specific uncovered objective is established. OI-FM-002 is decomposed into `FM-SCOPE-OI-FM-002`.

## Queue totals (81 items: 17 IMPLEMENTED_TESTING_DEFERRED, 58 PENDING, 6 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 |
| SOURCE_PREAMBLE_INDEXING | 2 (`FM-PRE-T1/T2`: header, scheme table, reference list) |
| SOURCE_WEEK_INVENTORY | 1 (`FM-INV-T3`) |
| SOURCE_WEEK_INDEXING | 26 (T1 W01-W10, T2 W01-W10, T3 W02-W06 and W08) |
| LESSON / CORRECTION_BINDING / ASSET | 6 / 6 / 1 (existing, 3rd Term) |
| VISUAL_DISPOSITION | 7 (5 figure groups, 2 vendor-branding) |
| FACTUAL_DEPENDENCY | 9 (3 PENDING inspections; owner stages BLOCKED) |
| SCOPE_DECOMPOSITION | 2 |
| BRANCH_PORT_COMPARISON | 16 (new kind; all PENDING) |
| TEST | 2 (1 existing deferred; 1 BLOCKED, deferred by owner) |

BLOCKED: `FM-FACT-EQUATION-EXTRACTOR-DECISION`, `FM-FACT-T3-MISSING-MATERIAL`, `FM-FACT-VENDOR-PERMISSION`, `FM-FACT-ALIAS-APPROVAL`, `FM-FACT-CONTENT-APPROVAL`, `FM-TEST-FULL-SOURCE-REGRESSION`.

## Next runnable task
**`FM-PRE-T1`** (dependency `FM-SRC-T1` complete; it supplies the scheme topics the 1st Term week items need). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc`, member sha256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`.

Also runnable in parallel (prerequisites satisfied): `FM-PRE-T2`, `FM-INV-T3`, `FM-WK-T3-W02..W06/W08`, the five `FM-VIS-*` figure items and two `FM-VIS-*-BRANDING` items, `FM-FACT-T3-W06-REPEATS-W05`, `FM-PORT-D4-NOTES`, `FM-PORT-D4-TEST-COMPARE`. The 1st/2nd Term `FM-WK-*` items wait for their `FM-PRE-*` item.

## Unmerged work to preserve
PR #71, branch `ss1/SS1-01-20261026-claude`, head `b5ced7ebb0efe22df2351baa140266fbf40cbf41` (D-3/D-4 in `FOUNDATION_RECONCILIATION.md`): `backend/src/db/ss1/subjects/further-mathematics.json` (blob `2a5849ac9566caebd8051af526e492d983f3a3ee`; 14 lessons: 3 for 1st Term, 6 for 2nd Term, 5 for 3rd Term; 3 rules; 0 corrections; 7 open items; PR71 schema), `docs/ss1/work/SS1-03/CHECKPOINT.md` (`f2c37bd2…`), `docs/ss1/work/SS1-03/HANDOFF.json` (`f3ee7c45…`), `tests/ss1/further-mathematics.test.mts` (`b88d3d64…`). Tracked as `FM-PORT-D3-L001..L014` and `FM-PORT-D4-*`; none counts as implemented on master. Do not merge #71 or copy its schema.

## Checks done
JSON syntax, 81 unique IDs, all `depends_on` resolve, no cycles, kind and status totals, required attachments vs `SOURCE_ASSIGNMENTS.csv`, asset hash/size vs package, required-file paths exist on master, diff limited to the two allowed files.
