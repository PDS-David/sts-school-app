# FM-PORT-D4-NOTES

Compared PR #71's Further Mathematics checkpoint/handoff and package records with the current master package and queue. No source audit was repeated.

**PR #71 note references:** checkpoint blob `f2c37bd28e06d0fa3f1424b27fcdfbc1675ef96c`; handoff blob `f3ee7c4559931744ab679bc6f8975fd7091c0710`; source package commit `b5ced7ebb0efe22df2351baa140266fbf40cbf41`.

## Branch-only findings and routing

| PR #71 finding | Master disposition / route |
|---|---|
| OI-FMATHS-001: Word equation, superscript, fraction and figure extraction loss | Covered by `OI-FM-001`; source-dependent visual items remain separately tracked. |
| OI-FMATHS-002: Third Term source has no scheme and only Weeks 2, 3, 4, 5, 6 and 8 | Covered by `OI-FM-002` and `OI-FM-003`; no missing week is invented. |
| OI-FMATHS-003: Second Term Weeks 11/12 have no body (revision/examination) | Master has `RULE-FM-T2-SCHEME-EXAM`, but no recorded teacher confirmation. Added `FM-FACT-T2-W11-W12-REVISION-PLAN` as a PENDING teacher-decision task. |
| OI-FMATHS-004: Third Term Week 6 repeats Week 5 | Covered by `OI-FM-003` and pending `FM-FACT-T3-W06-REPEATS-W05`; both source rows remain distinct because they are not byte-identical. |
| OI-FMATHS-005: Week 5 vector example has an incorrect 3p calculation | Corrected in master `SUP-SS1-FURTHER-MATHEMATICS-T3-W06-VECTOR-OPERATIONS-DIRECTION-COSINES`: for p=2i−3j, 3p=6i−9j and 3p−2q=−19j. Source text remains unchanged. |
| OI-FMATHS-007: prior branch lessons cite OpenStax URLs not opened line by line | Those old citations were not copied into the master replacements. Master T1-W01 cites the specific OpenStax Intermediate Algebra §8.3 page opened and checked; master T3-W08 uses the school source only. Approval remains PENDING. |
| OI-FMATHS-008: source figures not extracted | Covered by `OI-FM-001`, `OI-FM-003` and the existing `FM-VIS-*` tasks for Venn, mapping, graphs, flowcharts, vectors, straight-line figures and branding. |

No OI-FMATHS-006 entry exists in the PR #71 package; none was inferred.

## Lesson and rule reconciliation

- PR #71 reports 14 lessons and three source rules. Master currently has eight lessons and nine source rules.
- PR #71 T1 Week 1 and Week 2 candidate lessons are superseded by the current master replacements; their port tasks are already closed by reference.
- Remaining branch lesson comparisons are already queued: `FM-PORT-D3-L003..L009` for T1 Week 3 and T2 Weeks 1–5, 7–8; `FM-PORT-D3-L010..L014` compare the T3 candidates with current master lessons and permit only genuine gap ports.
- Branch marker rules `FMATHS-R01/R02` map to master `RULE-FM-T1-W06-REVISION` and `RULE-FM-T2-W06-REVISION`.
- Branch stranded-label rule `FMATHS-R03` is routed to `FM-FACT-T1-W04-STRANDED-LABEL`; do not add it without the source-row review.
- The branch's old 14-lesson approval wording is not carried forward. Master lessons remain `content_approval=PENDING`; `OI-FM-005` covers the six T3 supplements and flowchart asset.

No master checkpoint/handoff file was overwritten. No source audit, test, compiler or database command was run.
