# SS1-03 deferred commands (NOT run). Run only in SS1-09.
From repo root, Node 24.19.0, locked deps:
```bash
python scripts/ss1/prepare_sources.py --archive '/private/SSS 1-20260507T072431Z-3-001.zip' --output /private/ss1-staged
python scripts/ss1/build_subject_packages.py --root /private/ss1-staged --output /private/ss1-plan.json
SS1_PLAN=/private/ss1-plan.json node --import tsx --test tests/ss1/mathematics.package.test.mts tests/ss1/further-mathematics.package.test.mts
```
Expected before approvals: plan `ready:false` with only declared blockers (PARTIAL coverage, open items, pending lessons/assets). Without SS1_PLAN the
source-dependent tests report an explicit skip; a skip is not a pass. Authoring self-checks performed instead (not tests): body sha256, mark sums,
asset sha/bytes, anchor uniqueness and row containment against the importer's parser, arithmetic recomputed in Python/sympy.
