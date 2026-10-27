# Data Processing work queue — build note

- Reviewed master SHA: `f32ff234baa6333d1b568724ce6950014c6fc040`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `data-processing.json`, tests, assets, Worker E (SS1-06) checkpoint/handoff or source notes for Data Processing. No origin/ss1/* branch holds unmerged SS1 data-processing work (matches outside JSS3 documents are only the Worker E prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- Policy: Data Processing is present in all three SS1 terms and is not excluded under JSS3 policy. It must not be silently translated into Computer Studies or ICT in the database; an alias needs an approval_reference and is recorded as an open item, never invented.
- Week counts, scheme content, diagrams, practical steps and any statements about software, security or credentials are unknown. The 1st and 3rd Term files are large (about 1.1 MB and 1.5 MB), which may mean embedded media, but that is unverified. Worker E requires accessible practical steps that do not expose passwords or require unsafe execution.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`DP-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`DP-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`DP-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`DP-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`DP-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx`, member sha256 `a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
