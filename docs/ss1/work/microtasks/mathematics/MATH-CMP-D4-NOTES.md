# MATH-CMP-D4-NOTES

Compared the PR #71 versions of the SS1-03 checkpoint and handoff with the master's files at the same paths.

**Branch evidence**
- `CHECKPOINT.md`: commit `b5ced7ebb0efe22df2351baa140266fbf40cbf41`, blob `f2c37bd28e06d0fa3f1424b27fcdfbc1675ef96c`.
- `HANDOFF.json`: same commit, blob `f3ee7c4559931744ab679bc6f8975fd7091c0710`.
- The branch notes are based on `4182582d537712dbc73d6ce411b8b2feabd9c05b`; master SS1-03 notes are later and are not overwritten by this task.

## Mathematics facts found only on the branch

| Branch-only fact | Master comparison / route |
|---|---|
| Second- and third-term Mathematics had 16 authored equivalent lessons and two revision-marker rules. | This fact is now represented by `MATH-PORT-D2-T2-L001..L008`, `MATH-PORT-D2-T3-L009..L016`, `MATH-PORT-D2-COV-T2/T3` and `MATH-PORT-D2-RULES`. All 16 lessons and the two marker comparisons have been ported into this work branch; coverage remains partial where the lesson does not fully justify completion. |
| The branch described the first-term Mathematics source as unresolved because its supplied bytes differed from the manifest. | Stale/superseded in the current master package: the T1 source is registered, and T1 replacement lessons/corrections exist, including the Week 2 lesson and `CORR-MATHEMATICS-T1-W02-NUMBER-BASES`. `OI-MATH-001` remains for equation/notation extraction, not as a request to resupply the source. |
| The branch said teacher review had not been requested and used `content_approval NOT_REQUESTED`. | Stale. Current master package lessons use `content_approval=PENDING`; no approval is claimed. |
| The branch said no tests, typecheck, importer or DB checks had run. | Already recorded in the master checkpoint and owner testing deferral. No new task is required by this comparison. |

## Handoff-only Mathematics facts

- Branch handoff lists T2/T3 source IDs `SS1-SRC-b802686e83d2` and `SS1-SRC-ca00ca94afb9` as completed and T1 `SS1-SRC-0c9004137f95` as unresolved. The current master registry contains all three source records; the 16 T2/T3 lessons are routed through the port tasks above, and T1 has current replacement lessons. The source archive itself was not rehashed during this comparison.
- Branch handoff lists equation/superscript recovery as a foundation request. This is already represented by `OI-MATH-001`; it remains open for all unreplaced rows.
- Branch handoff's old base SHA, owned paths and worker status are historical metadata, not implementation facts to copy into master.

The branch checkpoint also contains Further Mathematics, Physics and Technical Drawing summaries; those are outside this Mathematics-only comparison task and were not changed here.

**Disposition:** No master checkpoint or handoff file was overwritten. Branch-only Mathematics facts were routed to existing port/coverage/rule tasks or recorded as stale/superseded. No tests were run.
