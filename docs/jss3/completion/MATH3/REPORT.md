# MATH3 — binary-number notation (First-Term Mathematics: BINARY NUMBERS, APLLICATION OF BINARY NUMBERS)

Scope: only these two rows. M1 graph tables and M2 substitution strokes were not reopened. No other topic or class is certified.

## Result

| Item | Status |
|---|---|
| Base master SHA | `84d3a632fcf92e5d91155c5fb94a01176d4e625d` |
| Implementation commit | `1c729a2` (branch `jss3/math3-20261021-binfmt`); merge SHA recorded in the PR |
| IMPLEMENTED | `SUP-MATH-BINARY` body now teaches the notation (below); `IMPLEMENTED_LESSONS.csv` hash regenerated; regression test; CI list updated |
| VERIFIED | Corpus acceptance 308 tests, 302 pass, 0 fail, 6 skipped (all PostgreSQL); types and static pass; new test fails 7/7 on the old body, passes 7/7 on the new; original rows byte-identical |
| BLOCKED / NOT PERFORMED | PostgreSQL acceptance suites (no local PostgreSQL; CI service runs them on the PR); phone/device; teacher answers; protected-baseline comparison; production deployment, import, migration |

## Findings

- Source: 43 paragraphs in BINARY NUMBERS carry superscript/subscript runs (powers 2^-4…2^4; base labels 2, 10, `two`, `ten`). APLLICATION OF BINARY NUMBERS has none. Full list: `NOTATION_INVENTORY.csv` (paragraph index, run rendering, independent check, disposition, where the learner gets it).
- The executable original text flattens them: `8510 = 1010101two`, `1x22 + 0x21 + 1x20`, `2 -1`. Equation recovery (`jss3EquationRecovery.ts`) handles Office Math only, not ordinary-run formatting.
- Learners do not receive that text. Delivery correction `A-MATHEMATICS-1-02` and `-03` serve `SUP-MATH-BINARY` plus `SUP-MATH-V2-FIGURES-1`; the correction fingerprint covers the full lesson objects, so editing the body retires cached assessments.
- **Delivery formatting loss (confirmed gap):** the replacement used "(base 2)" wording but never taught powers-of-two notation or the expansions the note teaches.
- **Source errors (already delivered correctly):** 111 base 2 = 7 not 9 (importer slip `M1-BIN-111`); 10101 base 2 = 21 not 27 (original text still says 27; replacement corrects); P = 10000 not 1000 (`M1-BIN-P16`); ladder (c) 1101011 not 11010011, drawn dividend 1001001 vs 10010001, swapped add/subtract labels (`SUP-MATH-V2-FIGURES-1`; labels listed as open slip `M1-BIN-LABELS`, not edited).
- All other ladder results, conversions, and add/subtract/multiply/divide results were recomputed independently and agree with the note.

## Change

`backend/src/db/data/jss3Supplements.json`, `SUP-MATH-BINARY` only:
1. Notation paragraph (labelled newly prepared): lowered number = base, raised number = power; 2^0…2^4 and 2^(-1)…2^(-4); expansions of 101, 111, 10101 and 10.1001 base 2 = 5, 7, 21, 2 9/16; `1x22` means 1×2², not 1×22; 2^(-1) is 1/2, not 2 − 1.
2. Practice (9): expand 1101 and 0.11 base 2; answers 13 and 3/4.
3. Practice (8) reworded so the bare numeral 102 cannot be read as 10 base 2.

Original audit bodies untouched: `original-rows.json` before/after SHA-256 `0bde9c58…3780` (313 rows, same order and hashes). Only the `SUP-MATH-BINARY` supplemented row differs. Counts 313 + 170 = 483 (234 First, 249 Second, 0 Third); Computer Studies 0. Teacher schedule regenerated, unchanged.

## Files

- `backend/src/db/data/jss3Supplements.json`, `docs/jss3/replacements/IMPLEMENTED_LESSONS.csv`
- `tests/jss3-math3-binary-notation.test.mts`, `.github/workflows/jss3-assets.yml`
- `scripts/jss3/math3_binary_inventory.py`, `docs/jss3/completion/MATH3/NOTATION_INVENTORY.csv`, this report

## Commands

```
npm ci --ignore-scripts
python3 -m pip install --break-system-packages -r scripts/jss3/acceptance-requirements.txt
python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$OUT" --without-db   # before and after; exit 2 INCOMPLETE expected
python3 scripts/jss3/capture_rows.py --root "$OUT/inputs/ALL" --output "$CAP"
python3 scripts/jss3/build_implemented_lessons.py backend/src/db/data/jss3Supplements.json "$CAP/supplemented-rows.json" docs/jss3/replacements/IMPLEMENTED_LESSONS.csv
python3 scripts/jss3/build_teacher_schedule.py
python3 scripts/jss3/math3_binary_inventory.py "<…/JSS 3 MATHEMATICS.docx>" docs/jss3/completion/MATH3/NOTATION_INVENTORY.csv
```

## Environment

Node 24.19.0 (npm `node` package, not the host's 22.22.0), Python 3.13.16, CairoSVG 2.9.1, lxml 6.1.1. Input ZIP `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (source docx SHA-256 `861fa300…88be9`). No LibreOffice, no PostgreSQL.

## Remaining inputs (school questions only)

- Exercise "(a) 72 (b) 3/4 (c) 0.875 (d) 32 — Convert the following binary numbers": direction of conversion is not stated; not guessed, not re-delivered.
- Exercise (4) `1010111 ÷ 111` is not exact (12 remainder 3); the note gives no answer; not invented.
- Source text has no answers for assignment items; the replacement's practice is new equivalent teaching, not the school's items.
