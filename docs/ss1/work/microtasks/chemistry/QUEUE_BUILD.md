# Chemistry work queue — build note

- Reviewed master SHA: `f9e9e9e0263b6823508fd74f5049e84979164ecf`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) and the Catering Craft queue #81 (a different subject) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `chemistry.json`, tests, assets, Worker C (SS1-04) checkpoint/handoff or source notes for Chemistry. No origin/ss1/* branch holds unmerged SS1 chemistry work (matches outside JSS3 documents are only the Worker C prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Chemistry is not a D-item in the foundation reconciliation. Nothing is recorded as implemented.

## Evidence limitations
- Four assigned sources: **two** 1st Term files (`SS1-SRC-58b4a44c3afa`, 2187976 bytes; `SS1-SRC-84df18289b7a`, 1656948 bytes), one 2nd Term and one 3rd Term. Hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**. The 3rd Term file is a legacy `.doc` needing DOC-aware extraction.
- The two 1st Term files have different hashes and sizes, but their content and roles are unknown. Worker C requires comparing them before treating either as a duplicate; `CHEM-CMP-T1` does this and neither file is discarded.
- Week counts, scheme content, formulas, valencies, equations, apparatus drawings, experiments and any safety statements are unknown. The size of the .docx files suggests embedded media, but that is unverified; image counts are never a substitute for recovered diagrams.

## Queue totals (11 items: 10 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 4 (`CHEM-SRC-T1A`, `T1B`, `T2`, `T3`; T1A may create the minimum package, the others depend on it) |
| SOURCE_WEEK_INVENTORY | 4 (`CHEM-INV-T1A`, `T1B`, `T2`, `T3`; week counts unknown, not guessed) |
| SOURCE_COMPARISON | 1 (`CHEM-CMP-T1`, the two 1st Term files, after both are registered and inventoried) |
| TEST | 1 (`CHEM-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`CHEM-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`CHEM-SRC-T1A`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx`, member sha256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
