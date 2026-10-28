# LIT-SRC-T3 — Literature, 3rd Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `49ea9f9` (origin/master, after PR #156). No open PR and no branch for this item was found; prerequisite LIT-SRC-T1 was IMPLEMENTED_TESTING_DEFERRED (not verified), and LIT-SRC-T2 was already on master.
- Source `SS1-SRC-2422e423a240`, manifest member `SSS 1/3rd Term SS1_/LITERATURE.docx`.
- Member SHA-256 `319a4898820bc98f19f48a592404baa0b54527b704fadddbd9484277fa91e9c3` **verified**; equals `SOURCE_ASSIGNMENTS.csv` and the task note (56,647 bytes).
- Supplied container: partial ZIP `3rd_Term_SS1_-20230730T172330Z-001.zip`, SHA-256 `411c596e24f3ae755326a095478db1d47d52ed3ddb7eff7e95d666d4de2aa445`, member path `3rd Term SS1 /LITERATURE.docx`. It was supplied twice; both copies are byte-identical. It is not the composite archive; the composite hash was **not** checked. `archive_member` stays as the manifest value.
- Method: member extracted unchanged and hashed; a separate private copy read with `mammoth` 1.12.2 `extractRawText` (the importer's .docx call). Nothing from the source is committed.

## Findings
- Opening lines: `THIRD TERM SCHEME OF WORK` (1), `CLASS: SS1` (3), `LITERATURE – IN – ENGLISH` (5, en dashes U+2013), then a scheme table (weeks 1–9: African drama, African poetry, non-African drama). There is no `SUBJECT:` label and no session year in the title.
- Teaching begins at `WEEK ONE`, `TOPIC: INTRODUCTION TO AFRICA DRAMA – HARVEST OF CORRUPTION`. The header names Literature-in-English, so no handoff is needed; it is not English Language.
- The subject line occurs once, so it is the unique `header_text` (trailing space excluded). It differs from the canonical `Literature-in-English` used by LIT-SRC-T1 by spaced en dashes, so a `source_alias` is declared.
- The relationship to the 2nd Term member stays with LIT-FACT-T2-T3-RELATIONSHIP; nothing is excluded. Observed only, not audited: nine `WEEK` labels (ONE to NINE).

## Edits
- `literature.json`: added the source entry, rule `SS1-SRC-2422e423a240-R001` (alias, `PENDING-OWNER`) and blocking open item `LITERATURE-T3-ALIAS-APPROVAL`. The 1st and 2nd Term entries are untouched. Package stays PENDING.
- `QUEUE.json`: LIT-SRC-T3 → IMPLEMENTED_TESTING_DEFERRED; status counts and `next_runnable` recomputed.

## Remaining
- Owner alias approval (none invented). No coverage until indexing (`SOURCE_WITHOUT_COVERAGE` remains).
- Runnable items edit the same package or queue; run one at a time.

Checks run: hashes, JSON syntax, reference consistency, diff inspection only. Testing deferred by owner.
