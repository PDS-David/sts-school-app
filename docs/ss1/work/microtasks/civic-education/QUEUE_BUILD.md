# Civic Education work queue — build note

- Reviewed master SHA: `647f75e02be285a8cd6aeccbc6b910dc7a2cd947`. No `AGENTS.md` exists. No open PR other than the alternate foundation #71 (not used) touches this subject.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `civic-education.json`, tests, assets, Worker E (SS1-06) checkpoint/handoff or source notes for Civic Education. No origin/ss1/* branch holds unmerged SS1 civic work (matches outside JSS3 documents are only the Worker E prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and the registry). Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- Civic Education stays separate from Government (slug `government`, its own documents and queue). A header naming another subject is a handoff open item, never a silent merge.
- Week counts, scheme content, and every statement about institutions, constitutional powers, laws, officeholders and dates are unknown. Worker E requires legislation in force to be distinguished from proposals and historical arrangements, neutral teaching, and primary authoritative texts with effective/reference dates for any replacement.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`CIV-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`CIV-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`CIV-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`CIV-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`CIV-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/CIVIC SSS1.docx`, member sha256 `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, source hashes vs CSV and registry.
