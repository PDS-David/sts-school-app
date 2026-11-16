# SS3 Agricultural Science — exam-preparation checkpoint

Updated: 2026-11-16

## Implemented draft

- Separate SS3 package at `backend/src/db/ss23/subjects/ss3/agricultural-science.json`.
- Delivery mode: `EXAM_PREPARATION` only.
- Examination targets: WAEC, NECO and JAMB.
- 12 revision units across the source-mapped First and Second Terms.
- 24 original exam-style practice items with model answers, explanations and mark allocations.
- No Third-Term package, no ordinary instructional lessons and no invented practical or mock-examination unit.
- The package is `PENDING`; every unit remains a draft and student delivery remains disabled.

## Source mapping preserved

First Term: Animal Nutrition/Malnutrition (Week 1); Agricultural Extension (Week 2); Fish Farming (Weeks 3-4); Animal Improvement (Weeks 5-6); Artificial Insemination (Week 7); Agricultural Financing (Weeks 8-9); Agricultural Insurance (Week 10).

Second Term: Agricultural Marketing (Week 1); Routine Management Practices in Farm Animals (Week 2); Principles of Animal Health Management (Weeks 3-4); Selected Animal Diseases (Weeks 5-6); Livestock Parasites (Weeks 7-8).

Combined scheme ranges remain combined. The Animal Improvement Weeks 5-6 range remains open because the source map identifies only a Week Five body heading.

## Open delivery blockers

1. Reconcile all original source assessment prompts and stable WAEC/NECO/JAMB locators; authored practice is not represented as copied past questions.
2. Resolve the Animal Improvement Week 5-6 body span against the original pages.
3. The Second-Term source lists Weeks 9 practical classes, 10 general revision and 11-12 mock examination, but no corresponding body sections were found. These remain absent rather than invented.
4. Verify answers, calculations and marking with an Agricultural Science specialist.
5. Inspect source visuals and verify reuse permissions and accessibility.

## Architecture

SS2 instructional packages remain at `subjects/<slug>.json`. SS3 exam-preparation packages are loaded from `subjects/ss3/<slug>.json`. The loader keys packages by class plus subject slug, allowing the same canonical subject to have separate SS2 and SS3 modes without class leakage.
