# TD-WK-W01 — Technical Drawing, 2nd Term Week One teaching-row indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (objective-level source indexing complete; three bounded follow-ups remain). Not approved, not verified. Testing deferred by owner.

## Source identity

- Source ID: `SS1-SRC-af4868d2c026`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`
- Parsed row: 11, `WEEK ONE`, title “Revision of last term work. Inscribed and circumscribed circles”.
- Original lesson ID: `SS1-SRC-af4868d2c026:BODY:a4e3d54d3b4f61aaea4abaf5c2ed3b4d3644563bbe904d5db1c57c69cf4082b6`
- Body SHA-256: `a4e3d54d3b4f61aaea4abaf5c2ed3b4d3644563bbe904d5db1c57c69cf4082b6`
- Body length recorded in task queue: 4,889 characters.

## Objective-level coverage added

**SUPPORTED source constructions**
1. Inscribed circle in a given triangle — lines 75–195.
2. Three equal circles in an equilateral triangle — lines 75–195.
3. Inscribed circle in a sector — lines 75–195.
4. Inscribed circle in a regular polygon, rhombus or deltoid/kite — lines 75–195.
5. Circumscribed circle on a triangle (equivalently, inscribing a triangle in a circle) — lines 201–239.

**PARTIAL revision constructions**
1. Triangle from perimeter and base angle.
2. Triangle from base, height and vertical angle.
3. Triangle from perimeter and ratio.
4. Similar triangle of a given perimeter.
5. Octagon in a square.

The five revision tasks occur in the General evaluation/revisional questions at lines 243–261. Their scope remains PARTIAL because the 1st Term Technical Drawing source is not supplied, so it cannot be confirmed that these revise the actual preceding term. Existing open item `TD-T2-W01-REVISION-SCOPE` remains in place.

## Defects and bounded follow-ups

- **Figures:** the source references drawings (“figure shown above” at lines 283, 301 and 315) which are absent from the text extraction. Existing task `TD-VIS-W01` owns the figure-by-figure disposition; no AI-invented drawing is substituted.
- **Degree notation:** superscript degree signs flattened in extraction: `670` (line 193), `1050` (lines 237 and 335), `550` (line 251), and `600` (lines 257 and 331). New task `TD-FACT-W01-DEGREE-NOTATION` requires original DOCX inspection before values are restored.
- **Answers and marking:** source contains evaluation and revision questions, but the current extraction evidence does not establish complete answer keys/marking criteria. New task `TD-KEY-W01-ANSWERS` requires original figures and degree values first, then an original keyed supplement.
- **Dimensions and labels:** no missing dimensions or diagram labels have been guessed. They remain subject to the figure inspection task.

## Files changed

- `backend/src/db/ss1/subjects/technical-drawing.json`
- `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
- `docs/ss1/work/microtasks/technical-drawing/TD-WK-W01.md`

## Verification boundary

This indexing uses existing source-extraction evidence recorded in the repository. The original archive/member was not re-extracted in this session. No tests, typechecks, importer/compiler, database or deployment were run because testing is deferred by the owner. Approval remains pending; verification remains deferred.
