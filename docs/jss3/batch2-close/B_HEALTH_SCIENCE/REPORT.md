# Worker B (Basic Science, PHE, Home Economics) — REPORT

Base: master `86a1a6195f47370ebbdecbc806e06d4661fbef58` (clean clone, 18 Oct 2026). Branch: `jss3/b2-close-b-20261018-alonie`.
Environment: Node **22.22.2** (24.19.0 unavailable; rerun required), `npm ci --ignore-scripts`, importer capture via `scripts/jss3/capture_rows.py` (313 originals exactly preserved; 411 rows with composed supplements: 196 First, 215 Second, 0 Third; Computer Studies 0).

## Status legend
Prepared = files in this folder. Staged-tested = run in a disposable copy. Integrated-on-master = **not done by this worker** (F integrates).

## Changed IDs
Eight new supplements (all `add`, no replace): SUP-HOME-CHILD-SAFETY, SUP-BS-OZONE-CLIMATE, SUP-BS-MAGNET-POLES, SUP-BS-ELECTRIC-CIRCUITS, SUP-PHE-HIV-STI-FACTS, SUP-PHE-PUBERTY-TEEN-PREG, SUP-BS-PREGNANCY-FACTS, SUP-PHE-MEDICINES-DRUGS.
Seven delivery corrections (original rows preserved; delivery overridden): child care [contd] (SHA-256 5892e2bd051ebec2ebeee4d65eaf632ec9be5f6de4888ad7be504eb04c660c20, hash confirmed against importer capture), ozone, magnetism, electrical energy, STD/HIV, puberty, family life [i].
40 decisions in DECISIONS.csv (all 40 mandatory candidates; anchors verified literally against original/supplement bodies). Automatic matches corrected: SL-377 (continuation row), SL-466 (row [ii]), SL-549 (CHILD CARE [CONTD]).
Semantic overlaps: SUP-HOME-CHILD-SAFETY overlaps SUP-HE-BABY-CARE (cleaning; reconciled, no unsafe claim found in BABY-CARE, MOTHERHOOD, FOOD-REVISION, PROJECT); SUP-PHE-HIV-STI-FACTS overlaps nothing existing.

## Defects confirmed in originals
Unsafe homemade ORT proportions; sugar/glucose/honey and juice for infant constipation; smallpox vaccine table; ozone/greenhouse conflation (CO2 "depletes ozone"); reversed magnet poles; voltmeter/parallel-resistance/bill-unit errors; "do not be pregnant" for HIV; pregnancy "more than a year" listed as fact; garbled puberty items.

## Code (code.patch, applies cleanly to base)
Shared files: `backend/src/db/jss3Supplements.ts` (adds Basic Science, 8 gap IDs), `backend/src/routes/learning.ts`, new `backend/src/utils/jss3TeachingCorrections.ts`, new `backend/src/db/data/jss3DeliveryCorrections.json`, new test. Delivery: GET /topics and POST /topics/:id/complete use corrected text for source_reference, cached summary, fallback and AI grounding; match is by hash OR class/school/term/title (fails closed if source changes); stale cached summary replaced and the previously generated assessment closed and unlinked in one atomic SQL statement; 503 if retirement fails. topic_completions are untouched.
F must also: apply SUPPLEMENT_UPSERTS.json to jss3Supplements.json, update hard-coded counts (existing tests `jss3-batch2-content` #30 and `jss3-supplements`/records #39 fail only on 90 vs 98 counts), rebuild closure/IMPLEMENTED_LESSONS with scripts, apply DECISIONS.csv.

## Tests actually run
`JSS3_CAPTURE_DIR=... node --import tsx --test tests/jss3-b-health-delivery.test.mts`: 9/9 pass (schema, hashes vs capture, unsafe text absent, no dose/recipe, fail-closed title match, stale-cache retirement, negative controls for primary/JSS1/JSS2). `npx tsc --noEmit` clean. Existing supplement tests: 49/52 pass on composed copy; the 2 failures are count expectations (see above). Not run: full combined verification, Node 24.19.0, any DB test.

## Remaining
See BLOCKERS.csv: unfinished SL-266/275 and SL-554 equivalents, production preflight for old generated assessments/questions (release blocker), teacher certification, practical holds, project guidelines. Medical-delivery risk in production is NOT closed until B-03 is done.
