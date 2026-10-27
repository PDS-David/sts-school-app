# Government work queue — build note

- Reviewed master SHA: `8fb376f413cf70403d161439800738677bbc396a`. No `AGENTS.md` exists. Open PRs are #71 (alternate foundation, not used) and #89 (Further Mathematics queue, a different subject); none touches Government.
- Documentation only. No curriculum document was opened; nothing was run (tests, typechecks, importer, database, device).

## Existing work recognised
None. Master has no `government.json`, tests, assets, Worker E (SS1-06) checkpoint/handoff or source notes for Government. No `origin/ss1/*` branch holds Government work (matches are only the Worker E prompt, `WORKER_START.json`, `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`). Government is not a `FOUNDATION_RECONCILIATION.md` D-item, so there is no unmerged work to preserve and no branch-port item. Nothing is recorded as implemented.

## Evidence limitations
- Three assigned sources (1st, 2nd, 3rd Term); hashes equal `SOURCE_ASSIGNMENTS.csv` and `sourceRegistry.json`. All are filename-based assignments; **no header is verified**.
- Reasons to verify headers: the 2nd Term member is named `GOVT.docx`, and the 1st Term member has the same byte size (1163776) as the 1st Term Geography member although the SHA-256 values differ. These are not findings of duplication or misfiling.
- Government stays separate from Civic Education (own documents and queue). A header naming another subject becomes a handoff open item, never a silent merge.
- Week counts, scheme content and every statement about institutions, constitutional powers, laws, officeholders and dates are unknown. Worker E requires legislation in force to be distinguished from proposals and historical arrangements, neutral teaching, and primary authoritative texts with effective/reference dates for any replacement.

## Queue totals (8 items: 7 PENDING, 1 BLOCKED)
| Kind | Count |
|---|---|
| SOURCE_REGISTRATION | 3 (`GOV-SRC-T1..T3`; T1 may create the minimum package, T2/T3 depend on it) |
| SOURCE_WEEK_INVENTORY | 3 (`GOV-INV-T1..T3`; week counts unknown, not guessed) |
| TEST | 1 (`GOV-TEST-PACKAGE`, write-only, deferred) |
| FACTUAL_DEPENDENCY | 1 (`GOV-FACT-CONTENT-APPROVAL`, BLOCKED) |

Each inventory worker appends the per-week, visual and correction-source items it finds. No week, lesson, correction or asset item is invented.

## Next runnable task
**`GOV-SRC-T1`** (no dependencies). Attachment: archive sha256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (any filename), member `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`, member sha256 `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a`.

## Unmerged work to preserve
None found.

## Checks done
JSON syntax, unique IDs, dependency references, no cycles, status totals, attachments vs `SOURCE_ASSIGNMENTS.csv`, required-file paths exist, diff limited to the two allowed files.
