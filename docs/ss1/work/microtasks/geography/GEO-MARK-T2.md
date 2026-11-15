# GEO-MARK-T2 — Geography Second Term marker and irregular-section disposition

Status: **IMPLEMENTED_TESTING_DEFERRED**. Every marker occurrence and irregular block is accounted for by line locator and disposition. No non-unique rule anchor is fabricated.

## Source and method
- Source `SS1-SRC-ba9dee61c27c`; member SHA-256 `fa120c0e9f2f7a47df2c775afdfe049b41ab2acb1972c1457b31c85e70b3a2e5`.
- Inventory: `GEO-INV-T2.md`; getBody line locators are 1-based.
- The marker inventory contains 46 occurrences: 16 Evaluation Questions variants, 8 General Evaluation, 6 Reading Assignment, 8 Weekend Assignment and 8 Theory.

## Exact occurrence register

| Week/source span | Marker occurrences (getBody line) | Disposition |
|---|---|---|
| Week 1, 23-96 | Evaluation Questions 35, 44, 71; General Evaluation 75; Reading Assignment 82; Weekend Assignment 85; Theory 94 | Assessment boundaries only; no teaching coverage inferred. The scheme says REVISION / MOUNTAINS, but no First Term revision body exists. |
| Week 2, 99-155 | Evaluation Questions 112, 132; General Evaluation 136; Reading Assignment 143; Weekend Assignment 146; Theory 153 | Assessment boundaries only; the Week Two supplement supplies its own keyed practice. |
| Weeks 3-4, 158-217 | Misspelt “Evaluaton Questions:” 169, 194; General Evaluation 198; Reading Assignment 205; Weekend Assignment 208; Theory 215 | Retain misspelling as source text; markers are not teaching. |
| Week 5, 218-292 | “EVALUATION:” 230; “EVALUATION” 256; General Evaluation 271; Weekend Assignment 278; Theory 290 | Two evaluation spellings are retained. No Reading Assignment occurs in this span. |
| Weeks 6-7, 295-448 | Evaluation Questions 314, 332, 421; General Evaluation 427; Reading Assignment 434; Weekend Assignment 437; Theory 446 | Assessment boundaries only. The unlabelled “KEEPING WEATHER RECORDS AND INSTRUMENTS” block at 336-420 is teaching content and is covered by `SUP-SS1-GEOGRAPHY-T2-W06-07-WEATHER-CLIMATE`, not classified as a marker. |
| Week 8, 451-490 | General Evaluation 475; Weekend Assignment 482; Theory 488 | No Evaluation Questions and no Reading Assignment occur in this span; absence is recorded, not silently filled. |
| Week 9, 493-580 | Misspelt “Evaluaton Questions:” 519; singular misspelt “Evaluaton Question” 555; General Evaluation 560; Reading Assignment 567; Weekend Assignment 570; Theory 579 | Retain both misspelling and singular/plural distinction; assessment boundaries only. |
| Week 10, 583-659 | Evaluation Questions 600, 634; General Evaluation 638; Reading Assignment 645; Weekend Assignment 648; Theory 657 | Assessment boundaries only. Direction procedure at 621-624 begins at step (ii), so step (i) remains a separate open source gap. |

## Rule-anchor decision
The contract requires each `classify_marker` anchor to occur exactly once in the unmodified extracted text. This inventory gives line numbers and category labels but not the complete exact source line text. Generic labels recur (for example, “Evaluation Questions”), so adding a generic rule would fail uniqueness and could classify the wrong occurrence. No rule is added on guesswork.

Blocking open item `GEOGRAPHY-T2-MARKER-EXACT-ANCHORS` requires the original source text to capture and validate exact unique anchors for all 46 occurrences. If any anchor cannot be made unique, keep a precise per-occurrence open item rather than weakening the compiler contract.

## Irregular sections and missing marker groups
- Week 1: scheme-only “REVISION / MOUNTAINS” row has no revision body; open item `GEOGRAPHY-T2-W01-SOURCE-ASSESSMENT-AND-REVISION`.
- Week 5: no Reading Assignment marker; absence retained.
- Weeks 6-7: unlabelled weather-recording/instruments section lines 336-420 is mapped to lesson coverage and is not an assessment marker.
- Week 8: no Evaluation Questions and no Reading Assignment; source assessment text remains open in `GEOGRAPHY-T2-W08-SOURCE-ASSESSMENT-TEXT`.
- Week 10: direction procedure lines 621-624 starts at (ii), missing (i); open item `GEOGRAPHY-T2-W10-SOURCE-ASSESSMENT-AND-DIRECTION-STEP`.

No marker is used as evidence that teaching has been covered. No lesson is authored by this marker-disposition item.
