# M2 — connector strokes at V2 paragraphs 79, 80, 83, 111: report

Scope: only these four paragraphs of `JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx`. M1 and the rest of Mathematics were not touched.

## Before / after
| | Before | After |
|---|---|---|
| Register item M2-O02 | "lines in elimination working", NOT VISUALLY RESOLVED, no asset | Located correctly, partly recovered, two assets bound, two strokes explicitly left open |
| Lesson showing the working | fractions and strokes absent (importer text reads `" = "`, `"n = 1"`, `"m =   "`) | two figures attached to the lesson row |
| Original rows | 313 | 313, all exactly equal; 170 supplements; 483 total (234 / 249 / 0) |

## Findings
1. **Locator convention confirmed.** V2 numbers are 0-based over all `w:p` elements in `word/document.xml`. Paragraphs 79, 80, 83, 111 hold 2, 2, 1, 1 connector anchors (`straightConnector1`, 0.75 pt, 11.5 x 10.4 pt) and read `12 – 5 – 7x = 10`, `7/7 = 7x/7`, `Step 5`, `12 – 11n = 0`.
2. **They are not in the elimination lesson.** All four sit in the Substitution-method Examples 1 and 2 of the row **SOLVING OF SIMULTANEOUS LINEAR EQUATIONS** (2nd Term, order 1), before the `ELIMINATION METHOD` heading. The ELIMINATION METHOD row contains no connector. The V2 register label was wrong; the assets are therefore bound to the SOLVING row (identity: term + original title, body sha256 `9456eb32…0d0b`, the same body guarded by correction A-MATHEMATICS-2-01). Binding them to ELIMINATION METHOD would have attached them to a lesson that does not contain the working.
3. **They are not fraction bars.** They are short diagonal cancellation strokes. Paragraphs 79 and 80 together draw four strokes through the 7 above and the 7 below in each fraction of `7/7 = 7x/7` (cancelling gives 1 = x, matching x = 1). The fractions themselves are Office Math that the importer drops, so the delivered lesson lost the whole step.
4. **Paragraph 83**: one stroke over the words "Step 5", beside no equation. No operation supported; not reproduced.
5. **Paragraph 111**: one stroke anchored 152.7 pt below its own line, so it lands on a different line in different renderers (over the word "Substitute" in LibreOffice) and on no term. Target ambiguous; **no operator guessed**; omitted from the scratch render only, and left open.

## Signs and operations checked (exact fractions, `tests/jss3-m2-connectors.test.mts`)
- Example 1: 2x + 3(4 − 3x) = 5 → 12 − 7x = 5 → 12 − 5 = 7x → 7/7 = 7x/7 → x = 1, y = 1; both equations hold.
- Example 2: 4(3 − 2n) − 3n = 0 → 12 − 11n = 0 → −11n/−11 = −12/−11 → n = 12/11 = 1 1/11; m = 3 − 24/11 = 9/11; 4m − 3n = 0 and m + 2n = 3 hold.
- **Two source slips found and kept, not edited:** printed `12 – 5 – 7x = 10` is false at the solution (gives 0 = 10; `12 – 5 = 7x` was probably meant); printed `3/11 – 24/1 = 9/11` has its denominators misplaced (the result 9/11 is right). Both are stated in the figure notes and alt text.

## Delivered
- `curriculum-assets/jss3/m2-simultaneous/`: `m2-simult-substitution-example1-step4.png` (M2-F10), `m2-simult-substitution-example2-steps4-5.png` (M2-F11), `M2_SIMULTANEOUS_2ND_MANIFEST.csv` (keys `V2-MATH-M2-F10/F11`, title guard `SOLVING OF SIMULTANEOUS LINEAR EQUATIONS`, captions, alt text), `M2_ROW_GUARDS.csv`.
- `scripts/jss3/m2/`: `render_m2.py`, `build_m2_manifest.py`, `m2_figures.json` (captions, alt text, notes).
- `VISUAL_REGISTER.csv`: only row M2-O02 changed (`build_visual_register.py` updated the same way and regenerates the file with only that line different; gains optional `--extra-guards`).
- `tests/jss3-m2-connectors.test.mts` (8 tests, also added to `.github/workflows/jss3-assets.yml`), including a real-source check (set `JSS3_M2_SOURCE_DOCX`) that the connector paragraphs are 79/80/83/111, with the right text, before the ELIMINATION METHOD heading.
- No new supplement lesson: the figures carry the recovered working, and adding one would change shared supplement/correction counts for a bounded task.

## How the figures were made
Scratch copy of the original rendered with LibreOffice 24.2 **with `libreoffice-math` installed** (without it fractions render blank). Only two changes: page breaks before paragraphs 75 and 108, and the drawing run of paragraph 111 removed. No text, equation or kept stroke was altered. Rendering and tests used Node 22.22 (repository asks for 24.19).

## Verification actually run
- `jss3-m2-connectors.test.mts`: 8 pass, 0 skip (with the real source). `jss3-v2-math-figures.test.mts`: 17 pass. Related asset/supplement/correction/V1/V3 suites: 55 pass, 7 skipped.
- `verify_handoff.py` with the 39 verified inputs: backend-types, mobile-types, static, jss3-full (290 tests: 278 pass, 0 fail, 12 skipped), asset-focused, capture all exit 0. Skips were not examined individually; earlier integration recorded 4 local-DB skips, so 12 here is a difference to be checked, not a pass.
- **Not run:** database suites (no local PostgreSQL), phone display, Word rendering. Stroke positions are as drawn by LibreOffice; Word placement was not viewed. Not deployed; no import or migration.

## Still open
Strokes at paragraphs 83 and 111 (need Word view or the teacher). Elimination-row fraction steps lost by the importer (not connectors; outside M2).
