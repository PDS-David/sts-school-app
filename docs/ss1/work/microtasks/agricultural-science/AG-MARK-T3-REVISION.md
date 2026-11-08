# AG-MARK-T3-REVISION — Agricultural Science, Third Term

Status: **IMPLEMENTED_TESTING_DEFERRED**. Revision marker disposition only; no revision content is invented.

## Integrity and exact locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Scheme block 14: exact text `11Revision `; SHA-256 `b2b9524e250fc89af5cb83bc7c361e11726e54e0feef9d280456b08b105ec0a1`.

## Disposition
| Locator | Classification | Finding |
|---|---|---|
| Scheme block 14 | `SCHEME_ONLY` revision marker | Scheme item 11 is a marker, not a teaching week or lesson. |

The document contains ten teaching-week bodies, labelled Week One through Week Ten. It contains no Week Eleven body, revision worksheet or revision marking scheme. Per-week evaluation/revision questions remain inside their teaching-week bodies and are not term-level revision markers.

## Package changes
- Added source rule `SS1-SRC-458a07f7ea5a-R002`, `classify_marker` / `SCHEME_ONLY`, anchored to the exact scheme text.
- Added MARKER coverage `COV-AG-T3-REVISION-SCHEME`, referencing the rule ID.
- Marked `AG-MARK-T3-REVISION` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique rule/coverage/task IDs and marker references. Importer/compiler/tests not run; testing remains deferred.
- No source bytes, lesson bodies, other marker classifications, corrections, assets, schema or compiler changed.
