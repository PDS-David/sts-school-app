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

## Verification update — 25 Oct 2026 (second pass; the text above is kept as the first checkpoint)

Base master `ebd42c0ee79ed8727d9c86de1bec0d9d95128c3c`. Code checkpoint / tested tree `8ebae7a440ca452e9b14135e672f5cf9d891c069` (this report is a docs-only commit on top). Master was re-fetched before publication and had not moved; no conflicts.

**What was already on master:** the four-lesson revision resolver, shared importer/revision formatter, registry (4/4/1/6 versions), unit tests, the real-DB suite and CI wiring. First-checkpoint caveat "no local DB pass" is now closed.

**Residual defects found and fixed**
1. `PUT /learning/topics/:id` returned the raw `RETURNING *` row, so a teacher/admin with `topics.write` received the stale stored `summary`, the stale `generated_assessment_id`, and for unreviewed bytes the stored text, bypassing the delivery guard used by list/detail/completion/assessment routes. It now returns the row through `safeJss3Topic` (response only; stored row and cache untouched; response shape unchanged, `subject_name` stripped). Proven red-then-green by a new real-DB test (stale supplement and unknown-bytes cases).
2. The registry was not proven reproducible. The generator gained `--output`; a unit test regenerates the registry from the pinned history ref `94982cbc…`, requires a byte-identical file, a byte-identical second run, and every accepted commit to be an ancestor of that ref. It skips explicitly when the ref is absent; CI checkout now uses `fetch-depth: 0` so it runs there.

**Route audit** (every `FROM topics` / `resolveDelivery` / `safeJss3Topic` / `assessmentDeliverable` use in `backend/src`): list (`learning.ts:159`), completion (`:450`), direct assessment read (`:979`) and submit (`:1039`) were guarded; `PUT /topics/:id` was the only unguarded read of delivered text and is now fixed. `/topics/:id/assets` selects metadata only; DELETE/POST do not return text.

**Original-correction fingerprints unchanged:** digest of (id, kind, fingerprint, correctionId) over all 65 original corrections is `6a84f1b07d59bf53709b7a697c297beca6c3754e3e38447fa37ea30d5adf5d89` on `94982cb` (pre-task) and on this branch. Evidence by comparison, not a pinned constant, so Task 03's body change will not break a test.

**Observed locally** (Node 24.19.0, `npm ci --ignore-scripts`; PostgreSQL 16.15 installed from Ubuntu packages, loopback, database `jss3_test_local`):
- `tsc --noEmit` backend: exit 0; mobile: exit 0.
- `node --import tsx --test tests/jss3*.test.mts`: 387 tests, 325 pass, 0 fail, 62 skipped (DB/corpus-dependent).
- `jss3-supplement-revision.db`: 5/5 pass (was 4 + the new PUT test; baseline 4/4 before changes). `jss3-yo-license.db` 4/4, `jss3-v3-science-ci.db` 5/5, `topic-assets.db` 17 pass / 1 existing skip.
- Negative controls: PUT test failed before the fix (`STALE SUMMARY` returned); changing one registry hash fails 4 of 5 revision unit tests.
- CI on master `ebd42c0`: job `verify` success, including the step that runs both `jss3-yo-license.db` and `jss3-supplement-revision.db` against PostgreSQL 16 (`jss3_test_ci`). CI for this branch: see PR.

**Not verified / transferred to Task 06:** `run_acceptance.py` (private corpus `JSS3_NEXT_STAGE_INPUTS_20261016.zip` is not available here), the 313-original-row / source-byte check, and `jss3-delivery-correction.db` (needs `JSS3_CAPTURE_DIR`). No lesson body, original row, order, completion or asset was changed, so no regeneration of `IMPLEMENTED_LESSONS.csv` / teacher schedule was needed.

**Status:** IMPLEMENTED yes · VERIFIED (unit + real PostgreSQL 16, local and CI on the base) except corpus items above · PUBLISHED see PR · MERGED no · DEPLOYED no. Master may auto-deploy: not merged here; the integrator must check release configuration first.
