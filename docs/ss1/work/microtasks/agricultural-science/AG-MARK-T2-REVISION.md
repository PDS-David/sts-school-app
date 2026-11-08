# AG-MARK-T2-REVISION — Agricultural Science, Second Term

Status: **IMPLEMENTED_TESTING_DEFERRED**. Marker disposition only; no revision content is invented.

## Integrity and exact locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme block 14: exact text `Revision.`; SHA-256 `067123e0afb74e0255aa210d2d56577c04613c68ae2b1d2cd4c3bf2845cf6103`.
- Week Ten label block 675: `WEEK TENDATE: ……………`; SHA-256 `31939d9c0dafc228d9c0b276ea88670bd77d9b9b536acd3a1b7c3ff5df797a92`.
- Block 676: exact text `REVISION`; terminal range 675–676 SHA-256 `6d1209926076460d476c866e9e81b211418f8a1df5bd3238b5f7d132fc598717`.

## Disposition
| Locator | Classification | Finding |
|---|---|---|
| Scheme block 14 | `SCHEME_ONLY` revision marker | Scheme entry only; no matching revision lesson or worksheet is supplied. |
| Blocks 675–676 | `SCHEME_ONLY` terminal revision marker | Final week label is followed only by `REVISION`; block 677 is section properties. No Week Ten teaching body, revision worksheet or marking scheme exists. |

The in-body `GENERAL EVALUATION/REVISION QUESTIONS` heading at block 232 is inside the combined Weeks Two–Three teaching body. It is not a term-level revision marker and is not reclassified.

## Package changes
- Added source rules `SS1-SRC-956594d97094-R002` and `R003`, both `classify_marker` / `SCHEME_ONLY`, anchored to the exact source text.
- Added MARKER coverage entries `COV-AG-T2-REVISION-SCHEME` and `COV-AG-T2-REVISION-W10`, each referencing its source-rule ID.
- Marked `AG-MARK-T2-REVISION` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique rule/coverage/task IDs and marker references. Importer/compiler/tests not run; testing remains deferred.
- No source bytes, lesson bodies, other marker classifications, corrections, assets, schema or compiler changed.
