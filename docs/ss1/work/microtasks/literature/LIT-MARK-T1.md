# LIT-MARK-T1 — Literature 1st Term marker disposition

Status: **IMPLEMENTED_TESTING_DEFERRED** (not approved, not verified). Testing deferred by owner.

## Inputs
- Archive `docs/ss1/sources/SSS1-original.zip` SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` verified.
- `SS1-SRC-470d43e54e5b`, `SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx`, SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea` verified.
- Method (private scratch, not committed): `mammoth` 1.12.2 `extractRawText`, 609 lines, 1-based. Markers found by whole-line match; week by the last `WEEK n` heading before the line (headings at 37, 107, 187, 249, 289, 377, 437, 471, 575). Neither word occurs mid-sentence; no `EVALUATION`, `GENERAL EVALUATION`, `READING ASSIGNMENT`, `THEORY` or `WEEKEND` marker exists.

## Disposition of the 13 markers
Exact wording as in the source (trailing spaces kept). "Exercise lines" = non-blank lines after the marker up to the next marker or week heading.

| # | Line | Marker (exact) | Kind | Week | Exercise lines | Count |
|---|---|---|---|---|---|---|
| 1 | 95 | `Class Work` | class work | W1 | 97–99 | 2 |
| 2 | 173 | `Class Work` | class work | W2 | 175–181 | 4 |
| 3 | 239 | `Class Work     ` (5 trailing spaces) | class work | W3 | 241–243 | 2 |
| 4 | 275 | `Class Work` | class work | W4 | 277–283 | 4 |
| 5 | 353 | `CLASS – WORK ` (en dash U+2013, trailing space) | class work | W5–6 | 355–361 | 4 |
| 6 | 365 | `ASSIGNMENT: ` (trailing space) | assignment | W5–6 | 367–369 | 2 |
| 7 | 411 | `CLASS-WORK ` (hyphen, trailing space) | class work | W7 | 413–423 | 6 |
| 8 | 427 | `ASSIGNMENT: ` (trailing space) | assignment | W7 | 429 | 1 |
| 9 | 463 | `Class Work` | class work | W8 | 465 | 1 |
| 10 | 547 | `Class Work` | class work | W9 | 549–555 | 4 |
| 11 | 559 | `Assignment` | assignment | W9 | 561–569 | 5 |
| 12 | 589 | `Class Work` | class work | W10 | 591–595 | 3 |
| 13 | 599 | `Assignment ` (trailing space) | assignment | W10 | 601–603 | 2 |

Totals: 9 class work, 4 assignment, 40 exercise lines. Weeks 5–6, 7, 9 and 10 carry both kinds, so the kinds stay distinct. W1 line 95 is the marker for `COV-LIT-T1-W01-CLASSWORK-Q1/Q2`.

Disposition for every marker: **kept as exercise heading inside its week body, wording unchanged; no rule; no line dropped; not promoted to a teaching heading.** Exercise-level coverage belongs to `LIT-WK-T1-W02`…`W10` (Week 1 already indexed).

## Why no `classify_marker` rule
`backend/src/db/ss1/subjectPackageSchema.ts` allows only `REVISION`, `EXAMINATION`, `SCHEME_ONLY`. None describes a class-work or assignment marker. `SCHEME_ONLY` would record a teaching row as scheme-only, which is false here. Per the contract the schema is not edited; the gap is recorded as:
- package open item `LITERATURE-T1-MARKER-VOCABULARY` (OWNER_ACTION, `blocks_delivery: false` because bodies are delivered unchanged; this is a judgement the owner may overrule);
- queue item `LIT-FACT-MARKER-VOCABULARY` (BLOCKED, owner/foundation decision). It also covers the seven assignment markers each in the 2nd and 3rd Term sources.

## Changes
- `backend/src/db/ss1/subjects/literature.json`: one open item appended; nothing else changed (compared with base; formatting round-trips exactly).
- `QUEUE.json`: `LIT-MARK-T1` → IMPLEMENTED_TESTING_DEFERRED; `LIT-FACT-MARKER-VOCABULARY` appended (BLOCKED); counts, status counts and `next_runnable` recomputed; no other item changed. Also in this branch: `LIT-FACT-T2-T3-RELATIONSHIP` (see its note).

## Remaining
Next eligible: `LIT-WK-T1-W02`. Not executed.
