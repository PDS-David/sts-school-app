# V2 Mathematics visual and equation fidelity: report

Base master `28c0b9262fd6aad8104af29d7dd67e22fadf85db`; branch `jss3/v2-mathematics-20261020`. Scope: the two Mathematics originals only
(`JSS 3 MATHEMATICS.docx`, `BASIC 9 MATHEMATICS E-NOTE.docx`). No other class, subject, release hold, importer text or shared record was changed.

## What was delivered
- **18 recovered figures** (9 First Term, 9 Second Term) as PNG assets in `curriculum-assets/jss3/v2-math/`, attached through the existing
  `topic_assets` manifests (`V2_MATH_1ST_MANIFEST.csv`, `V2_MATH_2ND_MANIFEST.csv`) to the **original lessons** where each figure sits:
  BINARY NUMBERS (3 figures), EVERYDAY STATISTICS (6), THE TRIGONOMETRIC RATIOS (2), APPLICATION OF TRIGONOMETRIC RATIOS (4), BEARINGS (3).
  Binary ladders, the binary arithmetic layouts, the tally table, the pictogram, four embedded charts (bar, dual bar, two pies), the labelled right triangle,
  the exercise triangles, ladder, tower, cliff, assignment triangle PQR, the eight-point compass and both bearing examples.
- **How figures were recovered.** The figures are renders of the original drawings: a scratch copy of each original is rendered with LibreOffice after two
  mechanical changes only: Office Math runs inside text boxes become ordinary runs with the *same characters* (a plain render drops labels such as "Opposite to B"),
  and page breaks are inserted before the compass and a bearing example so they are not split. Geometry, connectors, pictures and charts are untouched. Chart data was
  also read from the embedded chart XML and re-checked by the manifest builder. Nothing was redrawn, and no label, dimension or symbol was added.
- **Row identity, not row numbers.** `build_v2_math_manifests.py` resolves `order_index` from a current capture by exact (term, original title) and writes the row-body
  hash to `V2_MATH_ROW_GUARDS.csv`; `--expect-guards` fails on any later drift. Captions and alt text live in `scripts/jss3/v2/v2_math_figures.json`, so regeneration
  keeps them (tested byte for byte).
- **`VISUAL_REGISTER.csv`**: 30 reviewed occurrences with source locator, lesson identity, body hash, asset hash, classification and disposition.
- **Newly prepared teaching**, as a *declarative patch* (`V2_MATH_SUPPLEMENT_ADDITIONS.json`, base file sha256 and base master recorded), not applied, because
  `jss3Supplements.json` is shared: `SUP-MATH-V2-FIGURES-1` and `-2` (corrected readings, worked checks, answer keys, practice questions labelled as newly prepared
  equivalents; no textbook page is cited or imitated). The integration agent must append them and register gap id `WG-MATH-V2-FIGURES` in `jss3Supplements.ts`.

## Source findings (each shown by calculation or by the file itself)
| Figure | Finding | Classification |
|---|---|---|
| M1-F01 | Ladder (a) for 8 omits the row 2/2 = 1 R 0 (three remainders would read 100). | original source error |
| M1-F01 | Ladder (c) 107: remainders read upward give 1101011; the printed result 11010011 = 211. | original source error |
| M1-F03 | Add/subtract columns labelled the other way round; drawn long division 1001001 / 101 cannot give the stated 11101 (stated 10010001 / 101 = 29 is right). | original source errors |
| M1-F04 | Tally for 5 calls has 6 strokes; the raw data and the Frequency column give 7. | original source error |
| M1-F07 | Plotted girls 45, 55, 75, 90, 65 vs table 46, 55, 73, 92, 64. | **ambiguous, kept open** |
| M1-F08 | "x = 46.7 degrees" for a share should be per cent. | original source error |
| M2-F01/F02 | Reference angle is B ("to B" restored). Marked-angle symbol is U+2205 in the file; its intended reading is undecided. | ambiguous symbol, kept explicit |
| M2-F06 | Point S is not labelled; answers given only under the stated assumption that S is the foot of the perpendicular (35.0 degrees, 280.8 cm). | ambiguous, assumption labelled |
| M2-F08 | Caption "A from B is 090" does not match the drawing (A north, B east of an unlabelled corner). | inconsistent, not edited |
| M2-F09 | Arrow drawn at 225 degrees, labelled 210 degrees; not to scale, label kept. | note only |
| M2-F04 | File text box reads "TowerRRr" and the unit of "80m" is clipped in the render. | noted |

The original rows and bodies are unchanged (before/after capture identical); source errors are recorded and delivered as corrections in the new teaching and in captions,
not by editing the originals. No change was made to `jss3MathsSlipCorrections.ts`: changing recovered row text would change body hashes that the hash-keyed delivery corrections depend on.

## Tests and verification (what was actually run)
- `tests/jss3-v2-math-figures.test.mts`: 17 tests pass: ladder/binary/long-division arithmetic, tally recount from the 30 raw values, pictogram key, pie angles, dual-bar discrepancy,
  trigonometry (ladder, tower, cliff, exercise triangles, PQR assumption), bearings; asset sha256 + PNG + size + metadata; regeneration byte-for-byte and alt text survival;
  order_index follows a shifted capture; renamed row / missing asset / body drift / duplicate identity / wrong chart rejected; changed byte and missing file rejected.
- `tests/jss3-v2-math-assets.db.test.mts`: 5 tests pass against an **isolated local PostgreSQL 16** (port 55432, throw-away school code, zero residue asserted):
  guards match the captured original rows; 18 assets attach with title guards ON, byte-identical, with caption and alt text stored and lesson rows untouched;
  idempotence, metadata drift refused then applied only with `--update-metadata`, different bytes refused; shifted order / wrong title / wrong term rejected before any write;
  authenticated retrieval through `/learning/topics/:id/assets` and `/learning/assets/:id` (401 without a token, empty for a JSS 1 student, identical bytes for JSS 3).
- `scripts/jss3/verify_handoff.py` with the clean inputs: backend-types, mobile-types, static, jss3-full, asset-focused and capture all exit 0 (no `--tsx-no-ipc` needed).
- Capture before and after: 313 originals + 162 supplements = 475 (First 230, Second 245, Third 0, Computer Studies 0); `supplemented-rows.json` is byte-identical before and after.

## Not done / limitations / blockers
- **Not verified:** rendering in Microsoft Word or on a device. All figures are LibreOffice renders; a few shapes differ slightly from Word (for example white-filled
  text boxes hide part of line QR; the angle arc and symbol at B in M2-F01 exist in the file but did not render). The mobile app display of the new images was not run on a device.
- **Declarative patch not applied.** Until the integration agent appends the two supplement entries (and registers the gap id), the new teaching is not live; the figures
  themselves are live through the manifests.
- **Not inspected in this pass (kept open in the register):** the equation layouts at First Term paragraphs 704 and 708, and the connector lines in Second Term ELIMINATION METHOD
  (paragraphs 79, 80, 83, 111). The First Term tables on pages 16 and 17 were not re-rendered one by one.
- **Unresolved, need a teacher:** equilateral-triangle exercise (First Term, paragraphs 810 to 815; side labels give non-integer solutions); the T formula root (existing M1-T-FORMULA);
  which girls' admission figures are intended (chart vs table); the marked-angle symbol U+2205; point S in the assignment triangle; the wording of bearing example 1.
- **Still open from OB-14:** superscripts/subscripts typed as ordinary run formatting are still flattened in importer text; fixing that changes row hashes and needs the integration agent.
- **Still open from OB-21:** the other unfixed slips listed there (brackets example, consecutive numbers, and so on) were not re-audited here.
- **Textbook-only exercises** (for example "Exercise 22.1, no 1, 2, 3 page 226") are not in the sources; they remain unreplaced except for the clearly labelled newly prepared practice sets in the two new lessons. No textbook page was invented.
- **Publishing:** see the delivery note in the chat; GitHub write access was not available to this session unless the push line below says otherwise.
