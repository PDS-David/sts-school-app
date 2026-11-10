# TD-WK-W03 — Technical Drawing, 2nd Term Week Three teaching-row indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective-level coverage indexed; figure, notation and answer-key follow-ups remain). Not approved, not verified. Testing deferred by owner.

## Source identity

- Source ID: `SS1-SRC-af4868d2c026`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`
- Parsed row: 13, `WEEK THREE`, title “Polygons and irregular figures”.
- Original body ID: `SS1-SRC-af4868d2c026:BODY:032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf`
- Body SHA-256: `032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf`
- Body length recorded in queue: 11,124 characters.

## Objective-level coverage added

**SUPPORTED**
1. Meaning/definition of a polygon — lines 721–759.
2. Types of polygon, named by number of sides — lines 721–759.

**PARTIAL pending figure inspection**
3. Regular pentagon construction — lines 771–1113.
4. Regular hexagon construction — lines 771–1113.
5. Regular octagon construction — lines 771–1113.
6. General methods of constructing polygons — lines 1115–1249.
7. Two-triangle method on a given base — lines 1115–1249.

The source includes a first evaluation at lines 761–769, a second evaluation at lines 1251–1293, general revision questions at lines 1295–1307, a reading assignment citing “Technical drawing by JN Green. Pages 28–33, 38, 63” at lines 1309–1313, and a weekend assignment with objective questions and two theory questions at lines 1315–1472. The cited textbook pages were not inspected or reproduced.

## Defects and bounded follow-ups

- **Figures:** 38 w:drawing and 21 w:pict anchors occur in the row; diagrams are load-bearing and absent from text extraction. Existing task `TD-VIS-W03` owns visual disposition. Open item `TD-T2-W03-FIGURES` blocks delivery.
- **Notation:** 27 superscript runs occur; degree values are flattened (e.g. `3600` at line 807 and `450` at line 963); line 959 contains an omitted equation object. New task `TD-FACT-W03-NOTATION` requires original DOCX/Equation Native inspection. No values were guessed.
- **Answers and marking:** the source has evaluation, revision and weekend questions, but complete answer keys/marking criteria are not established. New task `TD-KEY-W03-ANSWERS` creates the bounded follow-up.
- **Dimensions and labels:** no missing dimensions, labels or geometry were invented; the figure task must inspect them.

## Files changed

- `backend/src/db/ss1/subjects/technical-drawing.json`
- `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
- `docs/ss1/work/microtasks/technical-drawing/TD-WK-W03.md`

## Verification boundary

This indexing uses existing TD source-extraction evidence in the repository. The original archive/member was not re-extracted in this session. No tests, typechecks, importer/compiler, database or deployment were run because testing is deferred by the owner. Approval remains pending; verification remains deferred.
