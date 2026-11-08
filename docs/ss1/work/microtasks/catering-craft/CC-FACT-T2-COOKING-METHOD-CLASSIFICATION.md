# CC-FACT-T2-COOKING-METHOD-CLASSIFICATION — factual dependency review

Status: **IMPLEMENTED_TESTING_DEFERRED**. This records factual findings only. The original source has not been changed and no replacement lesson or correction is authored here.

## Exact source claim

- Source: `SS1-SRC-f433169ca25c`; 2nd Term Catering Craft .doc.
- Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`.
- Extractor: `word-extractor` 1.0.4; full getBody() SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.
- WEEK SIX, `METHODS OF COOKING`: lines 893–904.
- Exact claim: line 895 labels the first category `Moist-heat method- cooking with liquid`; lines 896–899 list boiling, poaching, steaming and stewing; line 900 adds `Frying` under that same moist-heat heading. Lines 901–904 introduce dry heat and list baking, roasting and grilling.

## Findings

**The classification of frying at line 900 is incorrect.** Frying uses hot fat or oil as the cooking medium. Culinary training sources classify it as dry heat using fat or as a separate medium-of-fat category—not as moist heat.

- India's CBSE Academic vocational Food Production XI study material distinguishes moist heat (water/steam) from a separate medium-of-fat category and explicitly lists shallow and deep frying under the latter: https://cbseacademic.nic.in/web_material/Curriculum/Vocational/2018/FOOD_PRODUCTION_XI_809.pdf
- The U.S. Army Culinary Arts student coursebook defines dry-heat cooking as using hot air, hot metal, flame or hot fat, and lists pan-frying and deep-frying there; moist heat uses liquid or steam: https://quartermaster.army.mil/jccoe/Special_Programs_Directorate/Culinary_Arts/2013_Competition/Student_Coursebook_Feb_13.pdf
- Workforce LibreTexts, a culinary foundations resource authored by the Chef John Folse Culinary Institute at Nicholls State University, places pan/shallow frying and deep-fat frying under dry heat using fat: https://workforce.libretexts.org/Bookshelves/Food_Production_Service_and_Culinary_Arts/Culinary_Foundations_%28Cheramie_and_Thibodeaux%29/11%3A_Appendices/11.03%3A_Basic_Cooking_Methods

The references agree on the relevant point: frying is not a moist-heat method. Taxonomies differ on whether it is grouped under dry heat using fat or presented as a third medium-of-fat method; either way, the source's placement under moist heat is wrong. This review does not independently adjudicate every other item in the source's list.

## Disposition

- Source claim is preserved exactly at lines 895–900.
- The factual finding is complete; no original-source wording is altered.
- Package open item `CC-T2-FRYING-METHOD-CLASSIFICATION` blocks delivery of the affected teaching until a later authored lesson/correction teaches the correct classification.
- No lesson, answer, marking scheme or delivery correction is written in this task.
- No tests, importer, database or device runs were performed.
