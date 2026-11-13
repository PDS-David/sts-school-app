# Chemistry SS1 First Term — lesson identity prefix correction checkpoint

## Task and status
- Task ID: `CHEM-LES-T1A-W01-ADVERSE-EFFECTS` and `CHEM-LES-T1A-W01-SCIENCE-FOUNDATIONS`
- Status: `IN_PROGRESS` pending PR integration and a successful registered-subject compiler rerun.
- Parent work: PR #713, branch `agent/ss1-chemistry-continuation-20261113`.
- This is a child correction branch; the parent branch and its source content were not overwritten.

## Finding
- The registered-subject compiler run 43452421984 failed on `SUP-SS1-CHEM-T1A-W01-ADVERSE-EFFECTS`.
- The compiler's `isSubjectLessonId` predicate for subject slug `chemistry` accepts canonical prefixes `SUP-SS1-CHEMISTRY-` or `SUP-SS1-C-`.
- Both new lessons used `SUP-SS1-CHEM-`, which matches neither accepted prefix. The combined error label says identity/hash; the prefix mismatch is a concrete identity failure. Body content and body hashes were not changed.

## Implemented correction
- `SUP-SS1-CHEM-T1A-W01-ADVERSE-EFFECTS` → `SUP-SS1-CHEMISTRY-T1A-W01-ADVERSE-EFFECTS`.
- `SUP-SS1-CHEM-T1A-W01-SCIENCE-FOUNDATIONS` → `SUP-SS1-CHEMISTRY-T1A-W01-SCIENCE-FOUNDATIONS`.
- Updated all package coverage `lesson_ids`, affected-ID references and queue implementation references.
- Updated both lesson checkpoint notes to use the canonical IDs.
- No source content, body text, body hash, owner approval or verification state was changed.

## Changed files
1. `backend/src/db/ss1/subjects/chemistry.json`
2. `docs/ss1/work/microtasks/chemistry/QUEUE.json`
3. `docs/ss1/work/microtasks/chemistry/CHEM-LES-T1A-W01-ADVERSE-EFFECTS.md`
4. `docs/ss1/work/microtasks/chemistry/CHEM-LES-T1A-W01-SCIENCE-FOUNDATIONS.md`
5. `docs/ss1/work/microtasks/chemistry/CHEM-LESSON-ID-PREFIX-FIX.md`

## Commits
- Package ID correction: `b2a19196059da964dec08c62140a0b766c5d0c77`.
- Queue reference correction: `3f8f8abb69b81a915d7c8bddca925cb11e59d8d7`.
- Adverse-effects checkpoint update: `40a2e29e0361dc6d6f867c90b91c372574661029`.
- Science-foundations checkpoint update: `75fa879e3db20335f1742151d5c015438a930cc2`.
- This checkpoint is committed next.

## Verification
- Package and queue JSON parsed successfully.
- Both lesson IDs now use the compiler-accepted canonical prefix.
- All package coverage lesson references and queue implementation references were updated.
- Body text and stored body hashes were left unchanged.
- No CI rerun has passed yet. Do not mark either lesson verified until the parent PR's registered-subject compiler workflow succeeds.

## Exact next action
Open a child PR against `agent/ss1-chemistry-continuation-20261113`, merge the prefix correction into that parent branch, then rerun PR #713's package integrity and registered-subject compiler checks.