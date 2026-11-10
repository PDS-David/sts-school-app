# AG-MARK-T2-EXAM — Agricultural Science, Second Term

Status: **IMPLEMENTED_TESTING_DEFERRED**. Examination marker disposition only; no exam content is invented.

## Integrity and exact locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme block 15: exact text `11-12.      Examination`; text SHA-256 `bac0b093473a05db7f10edf4b01389a4286ccdc654f300f89ea7ec1501d2631a`.
- The last week label is Week Ten at block 675; block 676 contains only `REVISION`; the document ends with section properties at block 677.

## Disposition
| Locator | Classification | Finding |
|---|---|---|
| Scheme block 15 | `SCHEME_ONLY` examination marker | The scheme labels weeks 11–12 as Examination. It is not a teaching lesson. |

There is no Week Eleven or Week Twelve instructional body, examination paper, question set or marking scheme in this source. The terminal Week Ten revision marker at blocks 675–676 does not supply examination content.

## Package changes
- Added source rule `SS1-SRC-956594d97094-R004`, `classify_marker` / `SCHEME_ONLY`, anchored to the exact scheme text.
- Added MARKER coverage `COV-AG-T2-EXAMINATION-SCHEME`, referencing the rule ID.
- Marked `AG-MARK-T2-EXAM` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique rule/coverage/task IDs and marker references. Importer/compiler/tests not run; testing remains deferred.
- No source bytes, lesson bodies, other marker classifications, corrections, assets, schema or compiler changed.
