# Task 02 — reviewed supplement delivery

Base master: 94982cbc5e9e2b2d61aa77ff4d2173135b17cca8. Implementation checkpoint; verification status below is explicit.

The public delivery resolver now recognises four reviewed Yoruba supplement identities (IBEERE, IRANLOWO-PRACTICE, LIT-METHOD, MARRIAGE). Current exact importer references or historical reference hashes recorded from reachable Git history deliver the current lesson. Unknown bytes under the same identity are withheld. Other scopes are untouched. Existing original-correction resolver runs first and its fingerprint calculation is unchanged.

The importer and revision resolver share one reference formatter. This refactor is intended to preserve exact bytes. No lesson body, source row, completion, order, schema or asset changes are made in Task 02. Existing atomic cache/assessment retirement and route status guards are reused. The historical test fixture is repository-authored supplement text, not a private original document.

Reproduce registry:
`python3 scripts/jss3/build_yoruba_revision_register.py --history-ref 94982cbc5e9e2b2d61aa77ff4d2173135b17cca8`
There are 4/4/1/6 unique historical versions respectively. The generator matches current subject/term/title and only the named ancestors; it records exact hashes and commit references, never arbitrary observed database text.

Observed locally on Node24.19.0:
- `node --import tsx --test tests/jss3-supplement-revision.test.mts tests/jss3-delivery-correction.test.mts tests/jss3-batch2-content.test.mts`: 65 tests, 63 pass, 0 fail, 2 source-dependent skips before staging the corpus. New revision unit tests: 4/4 pass.
- Backend TypeScript: exit0.
- Local PostgreSQL not available: package installation fails on container setgroups/setuid restrictions. No local DB pass claimed.

New real-PostgreSQL tests exercise the actual Express router for list, direct stale read/submission, completion/AI grounding, unknown-text withholding, preserved source/completions/submissions, cache idempotency and transaction rollback. CI uses PostgreSQL16, database jss3_test_ci. The full acceptance runner now includes nine DB suites (new suite uses JSS3_YO_TEST_DATABASE_URL).

CI and final corpus verification: pending at this checkpoint. Production deployment/import/migration: not performed. Branch publication is not deployment. Task 02 is not yet claimed COMPLETE until real-DB tests pass. Later task reports must cite their own tested tree.
