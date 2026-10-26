# Deferred verification — do not run during SS1-01–08

No checks below were executed for the foundation task. Run only once whole SS1
implementation is ready and the owner starts SS1-09. Use Node24.19.0 and the
existing lockfile; record actual versions, exits, logs and skips.

From repository root:

```bash
npm ci --ignore-scripts
node --import tsx --test scripts/ss1/foundation.test.mts
python -m unittest discover -s scripts/ss1 -p 'test_*.py'
npx tsc --noEmit -p backend/tsconfig.json
python scripts/ss1/prepare_sources.py --archive '/private/SSS 1-20260507T072431Z-3-001.zip' --output /private/ss1-staged
python scripts/ss1/build_subject_packages.py --root /private/ss1-staged --output /private/ss1-plan.json
python scripts/ss1/capture_preservation.py --before /private/base-other-class-rows.json --after /private/candidate-other-class-rows.json
```

The two preservation inputs must come from the actual base and candidate importer
against identical authorized source sets. Existing `scripts/jss3/capture_rows.py`
remains unchanged and can generate the JSS3 portion. The certified 2,179 protected
row fixture is separate; do not substitute an empty or JSS3-only capture for it.
SS1-08 must add the full-source acceptance runner, runtime correction/cache/asset
checks, MIME sanitization and device checks before release. Database compatibility
requires a designated snapshot and transaction rehearsal, not a successful file
plan. Read-only review of code/diffs is not a passing test.

Required source-dependent negative controls after worker implementation: changed
source hash, repeated boundary anchor, invalid alias, false duplicate proof,
missing package, pending approval, incomplete coverage, wrong asset hash,
ambiguous correction, shifted stored row identity. Never mutate production files
or database to conduct these controls.
