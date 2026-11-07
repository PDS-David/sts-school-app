# TD-SCH-W06 — Technical Drawing, 2nd Term Week 6 scheme indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (scheme row hash-accounted and classified; teaching-row identity remains an explicit content follow-up). Not approved, not verified. Testing deferred by owner.

## Source evidence

- Source ID: `SS1-SRC-af4868d2c026`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`
- Scheme row: parsed row 5, extractRawText() line 21.
- Exact source text: `WEEK 6:        Enlargement and reduction of plain figures`
- Length: 57 characters.
- Row SHA-256: `b3be11f9bf4df24c1ee913290b0308eb630ef42993a154646f6ce3fcda784fa4` (matches the task queue's recorded row hash).
- Exact anchor occurs in the recorded source row and is classified by `SS1-SRC-af4868d2c026-R008` as `SCHEME_ONLY`.

## Objective and coverage

The scheme objective is recorded verbatim as **“Enlargement and reduction of plain figures”** in `COV-TD-T2-SCH-W06`. The scheme row is a scheme-only marker; it is retained and no text is discarded.

The source's teaching rows begin at line 59. The current repository assigns the combined Week 6–7 teaching-row review to `TD-WK-W06-W07`, but does not record that row's parsed body hash or stable lesson ID. I have not invented a lesson identity or claimed a confirmed mapping.

## Follow-up

Open item `TD-T2-W06-TEACHING-ROW-MAPPING` records the exact action: inspect the Week 6–7 teaching row, record its body hash and source lesson ID, and bind the objective only if the row actually teaches enlargement/reduction. Otherwise retain the unresolved objective and create a precise lesson follow-up.

## Files changed

- `backend/src/db/ss1/subjects/technical-drawing.json`
- `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
- `docs/ss1/work/microtasks/technical-drawing/TD-SCH-W06.md`

## Verification boundary

JSON edits were generated from the current package and queue structures; source row hash was matched against the recorded 57-character row. Full tests, TypeScript checks, importer/compiler, database and deployment were **not run** because the owner has deferred them. Content approval remains pending; verification remains deferred.
