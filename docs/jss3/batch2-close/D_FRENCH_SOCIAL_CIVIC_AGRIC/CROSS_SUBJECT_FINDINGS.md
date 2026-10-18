# Cross-subject and shared-record findings (not edited by worker D)

1. Shared count/hash records: after the upserts, `tests/jss3-batch2-content.test.mts` fails two assertions that hard-code 90 supplements (the Mathematics-order test and the all-supplement records test). `IMPLEMENTED_LESSONS.csv` holds the old body hash for SUP-SS-NATURE-ECONOMY; it changed with the GDP update. F must regenerate IMPLEMENTED_LESSONS.csv, CURRENT_COVERAGE.csv, SEMANTIC_CLOSURE.csv (build_semantic_closure.py) and the order/hash assertions after combining all workers.
2. Existing decision SL-067 (family links) says the original is covered. Its original wording has errors (see DC-FR-1T-W2); its limitation should mention SUP-FR-DECRIRE-PERSONNE once F integrates.
3. Existing SUP-FR-DATES (SL-282) kept the original list of dates unchanged and says public-holiday dates can change; the democracy-day date (12 June) is corrected in SUP-FR-JOURNEE-DUREE and DC-FR-2T-W2. Worker C/F should not duplicate it.
4. The blank canonical subject for the Third-Term Omega Civic lines is inferred by the closure builder; decisions here map them to Civic Education and to the owner-selected First-Term rows. No Third-Term teaching was added.
5. Health/Home Economics: no findings. Optional drafts SUP-FR-RECENT, SUP-FR-AGREEMENT and SUP-FR-PAST-REPORT were used only as starting material and are not applied.
