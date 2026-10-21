# JSS3 current implementation and handoff — 21 October 2026

Reviewed master **7e4aa90692893f9c1f674c34b11a66cefbf79030** (use exact base SHA in FOLLOWUP_20261021/RESULTS.json), including PR17–21. This supersedes the task routing in the20October summary, not the underlying historical evidence. No claim of full curriculum certification or production release is made.

| Workstream | What is actually implemented / verified | Remaining |
|---|---|---|
| RELEASE-DB | R2 summary records59/59 across7 DB suites; its RESULTS.json checksum verifies. TEACHER1 reports a later full7-suite pass | R2 runner.log is not committed although its checksum is listed. Recover exact historical log, or record unavailability; refresh final candidate only after further runtime changes |
| MATH3 | Explicit bases/powers/expansions in SUP-MATH-BINARY; regression tests and current runtime correction binding | Already done; not another assignment. Other Mathematics source items remain separate |
| TEACHER1 | Three owner-directed interim decisions implemented in two delivered lessons, captions/alt text and tests | Teacher confirmation remains separate. Do not undo the owner's interim choices or pretend they are teacher answers |
| DEVICE1 | API preflight and10 mock-backed tests implemented | No authorised staging or phone observation. Setup and observation are separate prompts |
| BASELINE1 | Comparer exists,13 synthetic tests pass. Latest worker added only a blocked report | Agent must recover provenance and generate BOTH exports; no certified2179 subset established. Existing2233 raw-source diagnostic is not that subset |
| V2 visual register | This follow-up fixes regeneration that would overwrite M1 recovered layouts with stale unresolved records | Source ambiguities remain explicitly open; no geometry/content was invented |
| SEQUENCE2 | S1 design only | Requires explicit Batch3/student-state/placement approval before implementation |
| School-specific content | Equivalent lessons and many corrections implemented | Yoruba text permissions/genres, English books/sounds/papers, projects and actual practical observations remain in school register |
| Production | No operation performed in this follow-up | Separate concrete dry-run/backup/rollback plan and explicit owner authorisation |

## Fixes made in this follow-up

1. `scripts/jss3/v2/build_visual_register.py` now reads reviewed non-figure occurrence data from `v2_math_reviewed_occurrences.json`. It preserves M1 recovery/assets, accepts repeated extra-guard inputs, and rejects conflicting/hash/order guard changes before writing. Three regression tests cover reproducibility, recovered metadata and conflict rejection. No hand-splicing regenerated rows is needed.
2. Register dispositions now reflect MATH3's delivered binary/mixed-number teaching and the existing Office Math recovery. Original source ambiguities and owner-interim labels remain. Lesson bodies, original rows, PNG bytes and manifests are unchanged.
3. Added `scripts/jss3/export_protected_curriculum.sql`: read-only repeatable-read export for an authorised LOCAL historical restore or release-test database, preserving full source_reference/description, raw identities and provenance. It excludes caches and student records and does not choose2179 arbitrary rows or certify anything. Inspect schema/class/school scope before use. CI test uses synthetic PostgreSQL rows with quotes, newlines, Unicode and nulls; actual protected exports remain absent.
4. Refreshed the earlier BLOCKED report checksum after its R2 supersession note changed the file. The original R2 expected runner.log hash is retained; no log fabricated. All11 A1 checksum entries verify. R2 has one verified file and one missing file.
5. Rewrote BASELINE2 to require the worker to acquire/reconstruct the historical export and generate the release snapshot, with exact source filenames, distinction from2233 candidates and warning that compare_protected.py mixes an old entry point with current helper modules. That helper is not proof of an exact historical build.
6. Added individual staging, evidence, remaining Maths, Yoruba attribution, Yoruba texts, English choices, practicals and final-plan prompts; updated earlier tasks to recognise completed work. Each new prompt embeds inputs, authorisation, setup, scope, implementation, acceptance and publication rules. No pending gate is waived by a prompt.

## Verification in this session

Node24.19.0. Source-backed M1/M2/MATH3/TEACHER1 tests **32/32**, zero skipped. Visual-register Python regressions3/3, DEVICE1 Python tests10/10, P1 synthetic tests13/13. No runtime lesson change; no need to repeat the entire corpus to verify document/generator changes. New PostgreSQL export test is explicitly skipped locally because no DB is available; PR CI runs it on disposable PostgreSQL, and its actual result is in the PR workflow. CI must pass before merge. Private originals/full captures remain outside Git.

A source archive or code package cannot prove the original certified2179 identities. The owner does not need to invent a file; the agent should locate the record or reconstruct with an explicit provenance limitation. A protected preservation PASS and curriculum certification are different claims.

## Assignments

Use [NEXT_AGENT_TASKS/README.md](NEXT_AGENT_TASKS/README.md). No worker needs another worker's uncommitted tree. One worktree/branch per task, current master recorded, shared records regenerated after concurrent changes and one merge at a time. The owner's permission to start each batch remains in force. Source and practical gaps cannot be closed by relabelling a BLOCKED report.
