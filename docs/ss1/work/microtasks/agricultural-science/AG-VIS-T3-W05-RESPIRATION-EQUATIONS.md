# AG-VIS-T3-W05-RESPIRATION-EQUATIONS — Agricultural Science, Third Term Week Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. The equations are source text with Word run formatting, not separate images or Office Math objects. No equation or source formatting was changed.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and exact Third Term DOCX member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Direct-body blocks 532, 537 and 540 contain the equation strings; blocks 533, 538 and 541 contain their word-label lines.
- The original task locator (530, 535, 538) is incorrect: 530 is the respiratory-system heading, 535 is aerobic-respiration prose, and 538 is the aerobic word-label line. Updated this task's own locator and appended `AG-CORR-T3-W05-RESPIRATION-EQUATION-LOCATORS` to correct the inventory (outside this task's allowed write paths).

## Equation structure and formatting
| Equation | Source block | Associated label block | Source structure |
|---|---:|---:|---|
| General respiration | 532 | 533 | Plain text paragraph; formula numerals are run-level subscripts; tab stops align product names |
| Aerobic respiration | 537 | 538 | Plain text paragraph; formula numerals are run-level subscripts; spacing differs from block 532 |
| Anaerobic respiration | 540 | 541 | Plain text paragraph; formula numerals are run-level subscripts; coefficient numerals remain baseline |

- No `m:oMath` Office Math objects occur in these six paragraphs. The equations are represented as ordinary Word runs with tab characters and `w:vertAlign` formatting.
- The chemical formula digits are subscripted in the formula lines. The associated word-label lines (Glucose, Oxygen, Carbon dioxide, Water, ATP / Alcohol) are marked superscript across all runs in the source.
- The source formula strings do **not** contain reaction arrows. In blocks 532 and 537, the oxygen and carbon-dioxide terms run together without an explicit reaction arrow or separator; in block 540, the glucose and ethanol terms likewise lack an explicit arrow/separator. No missing arrow, plus sign or coefficient is supplied here.
- Preserve the original formula strings, run-level subscript formatting, tab alignment, and label-line structure in any faithful delivery representation. Do not silently add reaction arrows, normalize coefficients or convert to a different equation based on inference.
- The existing open item `AGRICULTURAL-SCIENCE-T3-W05-RESPIRATION-ACCURACY` already routes the ambiguous/missing arrows and coefficient formatting for authoritative verification, including the distinction between animal anaerobic respiration and alcoholic fermentation.
- No separate image asset or rights disposition applies; these are textual formula paragraphs within the source document.

## Changes and validation
- Marked `AG-VIS-T3-W05-RESPIRATION-EQUATIONS` `IMPLEMENTED_TESTING_DEFERRED`; corrected its own locator; appended the bounded inventory-locator correction task; recomputed queue counts, status counts and `next_runnable`.
- Verified archive/member hashes; inspected direct-body blocks 524–541; confirmed equation and label strings, subscript/superscript run formatting, tab characters and absence of Office Math objects.
- Parsed package/queue JSON; checked unique IDs and confirmed every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, learner rendering and app/device display **not run**; testing remains deferred.
- No source bytes, media, lessons, shared schema/compiler, other subject or delivery assets changed.
