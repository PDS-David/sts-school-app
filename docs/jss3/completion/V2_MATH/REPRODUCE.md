# V2 Mathematics: reproducible commands

Base: master `28c0b9262fd6aad8104af29d7dd67e22fadf85db`. Node 24.19.0, repository lockfile (`npm ci --ignore-scripts`).
Inputs: `JSS3_NEXT_STAGE_INPUTS_20261016.zip` unpacked to `$IN`; the 39 documents of `SOURCE_INVENTORY.csv` verified against their sha256 (0 mismatches) in `$IN/ALL`.

```
# 1. rows before/after (identical: 313 originals + 162 supplements = 475; 230 First, 245 Second, 0 Third)
python3 scripts/jss3/capture_rows.py --root "$IN/ALL" --output /tmp/cap
# 2. re-render the figures from a SCRATCH copy of the two originals (the originals are only read)
python3 scripts/jss3/v2/render_figures.py --m1 "$IN/ALL/JSS3 1ST TERM /JSS 3 MATHEMATICS.docx" \
  --m2 "$IN/ALL/JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx" --spec scripts/jss3/v2/figures_spec.json --out /tmp/v2fig
# 3. manifests (order_index resolved from the capture; chart data re-checked against the original)
python3 scripts/jss3/v2/build_v2_math_manifests.py --capture /tmp/cap/supplemented-rows.json \
  --assets curriculum-assets/jss3/v2-math --out curriculum-assets/jss3/v2-math --m1 "$IN/ALL/JSS3 1ST TERM /JSS 3 MATHEMATICS.docx" \
  --expect-guards curriculum-assets/jss3/v2-math/V2_MATH_ROW_GUARDS.csv     # exit 1 on any row/body drift
python3 scripts/jss3/v2/build_visual_register.py --guards curriculum-assets/jss3/v2-math/V2_MATH_ROW_GUARDS.csv \
  --manifests curriculum-assets/jss3/v2-math --out docs/jss3/completion/V2_MATH/VISUAL_REGISTER.csv
# 4. tests
node --import tsx --test tests/jss3-v2-math-figures.test.mts
JSS3_V2_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55432/v2_test JSS3_CAPTURE_DIR=/tmp/cap \
  node --import tsx --test tests/jss3-v2-math-assets.db.test.mts          # LOCAL Postgres only
python3 scripts/jss3/verify_handoff.py --inputs "$IN" --output /tmp/handoff
# 5. attach (dry run is the default; never against production from this task)
cd backend && node --import tsx src/db/attachTopicAssets.ts --manifest ../curriculum-assets/jss3/v2-math/V2_MATH_1ST_MANIFEST.csv \
  --assets ../curriculum-assets/jss3/v2-math --subject Mathematics --class-name "JSS 3" --term-label "1st Term" --dry-run
```
Note: on the build used here (LibreOffice 24.x, Ubuntu 24.04) a second full render reproduced every PNG byte for byte except the one crop deliberately changed; other LibreOffice builds may differ, so the committed PNG hashes are the reference.
