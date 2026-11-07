# TD-WK-W06-W07 — Technical Drawing, 2nd Term combined Weeks Six and Seven indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (reduction candidate recorded; enlargement discrepancy explicitly unresolved). Not approved, not verified. Testing deferred by owner.

## Source identity

- Source ID: `SS1-SRC-af4868d2c026`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`
- Parsed row: 16, label `WEEK SIX AND SEVEN`, title “Reduction of plain figures”.
- Parsed body length: 7,297 characters.
- Body SHA-256: `97461c6ebcdd67d8af003002e111d7a1ffe244724f382b3c35c79d88585dbc05`
- Stable original body ID: `SS1-SRC-af4868d2c026:BODY:97461c6ebcdd67d8af003002e111d7a1ffe244724f382b3c35c79d88585dbc05`

## Scheme-to-teaching discrepancy

Both Week 6 and Week 7 scheme rows state **“Enlargement and reduction of plain figures”**. The single combined teaching row is titled **“Reduction of plain figures”**.

Coverage added:
- Week 6 reduction — PARTIAL, associated with the combined row.
- Week 7 reduction — PARTIAL, associated with the combined row.
- Week 6 enlargement — UNRESOLVED; no teaching-row binding asserted.
- Week 7 enlargement — UNRESOLVED; no teaching-row binding asserted.

The source row was not split. Its combined label is retained, and no new lesson identity or enlargement content is invented.

## Defects and bounded follow-ups

- `TD-FACT-ENLARGEMENT-SCOPE` is now the next runnable task. It must inspect the combined row and determine whether enlargement is actually taught. If not, the scheme objective requires a separate bounded lesson.
- `TD-T2-W06-W07-REDUCTION-DETAILS` requires exact construction steps, dimensions, labels, exercises and marking evidence from the original row.
- `TD-VIS-W06-W07` owns the figure-by-figure visual disposition.
- `TD-KEY-W06-W07-ANSWERS` requires keyed answers and marking criteria after the constructions and figures are verified.

## Files changed

- `backend/src/db/ss1/subjects/technical-drawing.json`
- `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
- `docs/ss1/work/microtasks/technical-drawing/TD-WK-W06-W07.md`

## Verification boundary

The exact body ID/hash and title are taken from the existing queue evidence. The original archive/member was not re-extracted in this session. No tests, typechecks, importer/compiler, database or deployment were run because testing is deferred by the owner. Approval remains pending; verification remains deferred.
