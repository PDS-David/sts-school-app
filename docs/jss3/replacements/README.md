# JSS3 source replacements — 15 October 2026

## Owner instruction implemented in this record

The owner directed use of the supplied `JSS 3 CIVIC (E NOTE).docx` in First Term and authorised internet equivalents for other missing items. This changes the previous source-only restriction for replacement material; it does not authorise falsely attributing replacements to the original documents or inventing textbook page numbers.

The Civic attachment SHA-256 is `1c8d20825bee7b2e1e80822d6633c5f90310c794bc11f6cfc0af4b236e6f014a`. It is byte-identical to the existing First-Term source. Its OMEGA heading stays in provenance. Its current First-Term placement is owner-selected and no duplicate is added. CV-01's destination decision is resolved. CV-02 is superseded as a demand for a different Alpha-labelled document by the owner's source selection; this is not a finding that such a document has been discovered.

## Internet equivalents supplied

`INTERNET_EQUIVALENTS.csv` maps all 63 historical IDs. `INTERNET_EQUIVALENTS.json` also contains 36 source records, URLs, inspected/search-only status and access limits. These are a resource-selection package, **not implemented replacement lessons or a certificate**. The original R9 CSV remains an immutable historical record. No original hold has been released; no new topic has been imported.

The five incomplete textbook references have distinct substitutes:

| Gap | Substitute |
| --- | --- |
| EN2-07 | British Council, Sport at school, with its linked exercises |
| EN2-08 | British Council, Reflexive pronouns + Relative pronouns |
| EN2-09 | British Council, Robot teachers, B1 worksheet and answers |
| EN2-10 | British Council, The Martian: a book review, B1 worksheet and answers |
| EN2-11 | British Council, The history of graffiti, B2 reading; search verified but direct fetch failed |

These are replacements, not identifications of the Oxford pages. Original pointers remain historical evidence. A general university course, a search result or a paid preview is not counted as a completed teaching body.

Other selections cover explanatory/descriptive/story writing, critical reading, grammar, literature, Business Studies, scale/blueprint reading, averages, hockey, Taekwondo and Yoruba. The proposed English prose/drama are explicitly named substitute works, not claimed to be the school/BECE prescribed texts. The remaining source selections require adaptation and assessment mapping before app integration. In particular, exact Yoruba lineage examples and a complete poem selection still require content-level work; paid or truncated pages must not be used as complete replacements.

## Protected-source comparison

The eight archives contain 349 file entries in total; 24 nested term archives were also extracted. All three JSS1 terms are present after that extraction. The earlier top-level-only comparison (1,942 rows) is superseded. `INPUT_INVENTORY.json` records archive hashes and file counts.

Using the same extracted roots and dependencies, the baseline `29f135b2` and current implementation `40049bb6` produce exactly equal row objects (including body, title, term, provenance, order and source path):

| School | Baseline | Current | Exact equality |
| --- | ---: | ---: | --- |
| Primary | 1492 | 1492 | Yes |
| Secondary (JSS1/JSS2) | 741 | 741 | Yes |
| Total | 2233 | 2233 | Yes |

All four audits exit 1 on the supplied raw roots, which include mixed school types and other source-audit blockers. The capture is before audit acceptance: these are generated candidate rows, not an import-approved or certified set. No gate was disabled and no database connection was used. The comparison demonstrates unchanged output for these inputs; it does **not** prove identity of all 2,179 certified database rows. No inference is made that the numerical difference from 2,179 equals a particular missing/extra lesson set.

Reproduce after extracting each archive into a separate labelled folder, retaining its internal paths:

```
python docs/jss3/replacements/compare_protected.py --repo /path/to/sts-school-app --sources /path/to/protected_sources --output /path/to/audit_output
```

The script reads the baseline importer from Git and the current working tree, creates a temporary instrumented importer, captures the exact `normalRows` after ordering, runs dry audits and removes the temporary file. It does not edit the original importer. Outputs include row dumps, logs, and `PROTECTED_SOURCE_COMPARISON.json`. Run without production database environment variables; the script also removes them from its subprocess environment.

## Work still required

1. Turn selected references into complete, attributed JSS3 lesson bodies and assessments. Use permitted text, independent explanations and original practice; do not bulk-copy copyrighted websites. Resolve fetch failures and incomplete candidates before accepting them.
2. Map each replacement to the original objective and First/Second-Term destination. Original heading holds stay as provenance; only complete approved replacement bodies become executable curriculum.
3. Reconcile remaining source-line/coverage issues and update the current register without overwriting historical evidence.
4. Verify device display and the full certified protected-row export, then prepare a reviewed migration/import plan. No production import is authorised by this document.

LESSON_DRAFTS.md supplies nine newly authored lesson drafts covering ten IDs (EN2-08, EN2-15, EN2-17, PE-01 through PE-07). Drawing/proof-mark dependencies are explicit. These drafts are not imported and do not release original holds.

No missing item is closed merely because a URL has been found.
