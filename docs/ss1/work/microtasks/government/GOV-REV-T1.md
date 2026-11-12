# GOV-REV-T1 — Government, 1st Term revision/examination marker

**Status:** IMPLEMENTED — TESTING DEFERRED. This is a marker disposition, not a revision lesson, examination paper or teaching-week record.

## Source identity and exact marker

- Source ID: SS1-SRC-40ce7dcaf672.
- Source SHA-256: 50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a.
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e.
- Archive member: `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`.
- Locator: `word-extractor` 1.0.4 `getBody()`, scheme line 42.
- Scheme block: lines 21–42, SHA-256 `7282181eb168ae114a2311b961108afe4a7111d2211eabe8e0139a97d38bb0a8`.
- Exact row text: `11.<TAB><TAB>Revision/examination`, represented in the source rule anchor as `11.\t\tRevision/examination`.
- The exact anchor occurs once in the full document and nowhere in the teaching body.

## Disposition

The source body has ten teaching weeks and ends at Week Ten (body line 864). There is no WEEK ELEVEN label, no revision content and no examination paper. The scheme row is therefore classified as **SCHEME_ONLY**; it does not create an eleventh teaching week and does not erase or replace Week Ten.

## Package changes

- Added rule `SS1-SRC-40ce7dcaf672-R002`:
  - `op`: `classify_marker`
  - `kind`: `SCHEME_ONLY`
  - `match_mode`: `WHOLE_LINE`
  - `anchor`: exact source line `11.\t\tRevision/examination`
- Added coverage `COV-GOV-T1-REVISION-EXAMINATION` with status `MARKER`, targeting the rule ID above. No lesson ID is invented.
- No lesson, revision content, examination paper, Week Eleven coverage or answer key was created.
- Existing package status, alias rules, lessons and unrelated coverage remain unchanged.

## Checks and limits

- Reused the archive/member identity and scheme hash verified by GOV-INV-T1.
- Confirmed the marker's single occurrence and absence from the teaching body using the inventory evidence.
- Confirmed the rule and coverage IDs are unique and the MARKER coverage target resolves to the new SCHEME_ONLY rule.
- No tests, typechecks, importer/compiler run, database write, app/device check or teacher review was performed. Testing remains deferred by owner.
