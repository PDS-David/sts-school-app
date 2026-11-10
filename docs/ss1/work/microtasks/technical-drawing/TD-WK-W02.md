# TD-WK-W02 — Technical Drawing, 2nd Term Week Two teaching-row indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (four objective-level construction entries recorded; visual and answer-key follow-ups remain). Not approved, not verified. Testing deferred by owner.

## Source identity

- Source ID: `SS1-SRC-af4868d2c026`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`
- Parsed row: 12, `WEEK TWO`, title “Escribed circles”.
- Original body ID: `SS1-SRC-af4868d2c026:BODY:04066d5e7502b3a90b291d9c0053dfc81a77f9a8579dcbe516add089052f4ffd`
- Body SHA-256: `04066d5e7502b3a90b291d9c0053dfc81a77f9a8579dcbe516add089052f4ffd`
- Body length recorded in queue: 4,668 characters.

## Objective-level coverage added

1. Escribed circle on a triangle — lines 349–377; method extends two sides, bisects exterior angles and drops a perpendicular to locate the centre.
2. Escribed circles for a polygon — lines 383–429; join opposite corners, bisect external angles, drop a perpendicular to a side and repeat per side.
3. Circle through a given point touching a line at that point — lines 447–521.
4. Circle through two given points touching a given line — lines 447–521.

The source evaluation questions specify a triangle with side dimensions 55, 60 and 50 mm, and a 50 mm hexagon. The reading assignment cites “Technical Drawing by JN Green, pages 21, 73–75”; those pages were not inspected and are not reproduced.

## Defects and bounded follow-ups

- **Figures:** 11 w:drawing and 13 w:pict anchors occur in the row. The text refers to figures “as shown above/below” at lines 423, 557, 583 and 603. They are absent from the text extraction. Existing task `TD-VIS-W02` owns visual disposition; open item `TD-T2-W02-FIGURES` blocks delivery until faithful assets or justified exclusions are recorded.
- **Answers and marking:** source evaluation questions and weekend assignment are indexed, but complete answer keys/marking criteria are not established in current evidence. New task `TD-KEY-W02-ANSWERS` creates the bounded follow-up.
- **Notation:** no superscript run was identified in this row, so no flattened degree-sign defect is recorded here.

## Files changed

- `backend/src/db/ss1/subjects/technical-drawing.json`
- `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
- `docs/ss1/work/microtasks/technical-drawing/TD-WK-W02.md`

## Verification boundary

This indexing uses the existing TD source-extraction evidence in the repository. The original archive/member was not re-extracted in this session. No tests, typechecks, importer/compiler, database or deployment were run because testing is deferred by the owner. Approval remains pending; verification remains deferred.
