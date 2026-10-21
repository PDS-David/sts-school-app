# TEACHER1 — three JSS 3 Mathematics decisions (owner-directed interim)

**Read this first.** No dated answer from the school's authorised Mathematics teacher exists. The inputs ZIP does not settle any item. The three decisions below were directed by the **app owner** on 21 October 2026 as fallbacks. They are recorded as `owner_directed_interim`, are **not teacher-certified**, and the three teacher "Tick one" lines in `D1_TEACHER_DECISIONS/DECISION_SHEET.md` are deliberately still blank. A teacher answer, when it comes, replaces the interim decision for its own item only.

## Status

| Item | Status |
|---|---|
| IMPLEMENTED | Lessons `SUP-MATH-V2-FIGURES-1` and `-2`, figure captions/alt text/notes (`v2_math_figures.json`), regenerated V2 manifests and register rows, `IMPLEMENTED_LESSONS.csv` hashes, decision-sheet section, focused tests, CI list |
| VERIFIED | Corpus acceptance 317 tests, 311 pass, 0 fail, 6 skipped (PostgreSQL). Full acceptance with a disposable local PostgreSQL 16.15: runner status PASS, 7 DB suites exit 0, `# skipped 0` each. Originals byte-identical. New tests fail 6/8 on base content, pass 8/8 now; real-source test ran and passed |
| BLOCKED_EXTERNAL_INPUT | Teacher confirmation of all three items (interim decisions stand until then) |
| NOT PERFORMED | Corrected chart image for item 1; phone/device observation; protected-baseline comparison; production deployment, import or migration; Word-rendering check |

## Per-item result

| Item | Decision / who / date | Computed answers (independent check) | Lesson / asset IDs |
|---|---|---|---|
| 1. Girls' admissions (M1-F07) | Follow the school table (46, 55, 73, 92, 64). App owner, 2026-10-21, not teacher | Highest girls 2000 (92); fewest boys 2001 (45); 1999: 80 − 73 = 7; 2000 vs 1998: 162 − 105 = 57. Printed chart would give 5 and 55; not used. Chart and table differ in 1997, 1999, 2000, 2001 | `SUP-MATH-V2-FIGURES-1`; asset `V2-MATH-M1-F07` (PNG unchanged) |
| 2. Point S (M2-F06) | S is the foot of the vertical from Q. App owner, 2026-10-21, not teacher | Angle QRS = 35.0°; PR = 280.8 cm. Cross-check by sine rule: QR = 244.1 cm, angle PQR = 85.0°, angle P = 60°, PR = 280.8 cm. The 140 cm line cannot be QR because SR = 200 cm | `SUP-MATH-V2-FIGURES-2`; asset `V2-MATH-M2-F06` |
| 3. Bearing example 1 (M2-F08) | Follow the drawing; corner called O. App owner, 2026-10-21, not teacher | B from O 090; A from O 000; O from B 270; O from A 180 (coordinate check, four distance pairs). A from B is in (270, 360) and equals 315 only if OA = OB, so 315 is not inferred. Example 2 untouched | `SUP-MATH-V2-FIGURES-2` (new practice item 5); asset `V2-MATH-M2-F08` |

## Source check (private originals, hashes verified)
`JSS 3 MATHEMATICS.docx` 861fa300…88be9 and `BASIC 9 MATHEMATICS E-NOTE.docx` 1292fe87…f5db match `SOURCE_INVENTORY.csv`. Table rows (paragraphs 512–516): girls 46, 55, 73, 92, 64; the note's questions are at 517–521. No paragraph near the assignment figure labels or defines S; the questions are "Calculate angle QRS" then "PR". "The bearing of point A from B is 090o" appears once. The REAL SOURCE test re-checks these whenever `JSS3_ALL_ROOT` is set.

## Changed files
- `backend/src/db/data/jss3Supplements.json` (the two lessons and their `origin` provenance)
- `docs/jss3/completion/V2_MATH/V2_MATH_SUPPLEMENT_ADDITIONS.json` (kept equal to the live lessons; historical base hash retained)
- `scripts/jss3/v2/v2_math_figures.json` (caption, alt text, notes, `decision` object on three figures)
- `curriculum-assets/jss3/v2-math/V2_MATH_1ST_MANIFEST.csv`, `V2_MATH_2ND_MANIFEST.csv` (caption and alt_text only; sha256, file, order_index, title identical for all 18 rows; row-guards file unchanged)
- `docs/jss3/completion/V2_MATH/VISUAL_REGISTER.csv` (three figure rows only; other rows kept as committed because the builder's static rows are older than M1's hand updates), `scripts/jss3/v2/build_visual_register.py` (decision-aware open item)
- `docs/jss3/replacements/IMPLEMENTED_LESSONS.csv` (two body hashes). `TEACHER_SCHEDULE_SUPPLEMENTS.csv` regenerated: no change
- `docs/jss3/completion/D1_TEACHER_DECISIONS/DECISION_SHEET.md` (status line and owner-decision section; teacher boxes unticked)
- `tests/jss3-teacher1-math-decisions.test.mts` (new), `.github/workflows/jss3-assets.yml` (test added to list), this report

## Preserved
313 original rows identical before/after (same order, bodies and hashes; capture compared directly); 313 + 170 = 483 rows (234 First, 249 Second, 0 Third); Computer Studies 0; only the two intended supplement rows differ; no other supplement id, practical hold, class or asset changed. Runtime delivery corrections for EVERYDAY STATISTICS, APPLICATION OF TRIGONOMETRIC RATIOS and BEARINGS still include the updated lessons; editing a lesson changes the fingerprint so cached assessments retire (tested).

## Commands
```
npm ci --ignore-scripts
python3 -m pip install --break-system-packages -r scripts/jss3/acceptance-requirements.txt
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$OUT_BEFORE" --without-db   # exit 2 INCOMPLETE expected
python3 scripts/jss3/v2/build_v2_math_manifests.py --capture "$CAP/supplemented-rows.json" --assets curriculum-assets/jss3/v2-math --out curriculum-assets/jss3/v2-math --m1 "<JSS 3 MATHEMATICS.docx>" --expect-guards curriculum-assets/jss3/v2-math/V2_MATH_ROW_GUARDS.csv
python3 scripts/jss3/v2/build_visual_register.py --guards curriculum-assets/jss3/v2-math/V2_MATH_ROW_GUARDS.csv --extra-guards <M1+M2 guards merged> --manifests curriculum-assets/jss3/v2-math --out <tmp>   # only the 3 figure rows taken
python3 scripts/jss3/capture_rows.py --root "$OUT/inputs/ALL" --output "$CAP"
python3 scripts/jss3/build_implemented_lessons.py backend/src/db/data/jss3Supplements.json "$CAP/supplemented-rows.json" docs/jss3/replacements/IMPLEMENTED_LESSONS.csv
python3 scripts/jss3/build_teacher_schedule.py
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$OUT_AFTER" --without-db
JSS3_LOCAL_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/jss3_test_teacher1 python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$OUT_FULL"   # PASS
```

## Environment
Node 24.19.0 (npm `node` package; host has 22.22.2), Python 3.12.3, CairoSVG 2.9.1, lxml 6.1.1, python-docx 1.2.0, Pillow 12.3.0, PostgreSQL 16.15 (throwaway local cluster, loopback, database `jss3_test_teacher1`). No LibreOffice. Input ZIP `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (SHA256SUMS verified). Base master `38fe4bead4b39bddd627a8b3768372753354be2e`. Final SHA: recorded in the PR.

## Remaining inputs
1. The authorised Mathematics teacher's dated answer for each of the three items (name/role and date only). If an answer differs from the interim decision, tick the sheet and have that item re-implemented.
2. If a corrected, separately labelled bar chart for item 1 is wanted, say so; it would be a new asset and was not made.
3. Open items this task does not close: equilateral-triangle exercise, T formula, U+2205 symbol, superscripts, example 2 of the bearings (arrow drawn at 225, labelled 210).
