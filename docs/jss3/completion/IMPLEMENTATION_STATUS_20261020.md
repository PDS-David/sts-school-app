# Current implementation and remaining work — 20 October 2026 follow-up

Reviewed master `deef527` and its actual runtime/data/tests, not only worker reports. M1, M2, A2, D1 and S1 had been merged since `02e596e`; P1 was only on its worker branch. This follow-up integrates P1 with fail-closed fixes and adds implementation/verification improvements below. Exact full-source results: `ACCEPTANCE_FOLLOWUP/RESULTS.json`.

| Task | Actual implementation | Remaining condition |
|---|---|---|
| V1/V2/V3 | Assets, lessons, guarded delivery and manifests integrated | Phone observation; real-source DB acceptance |
| M1 | Two graph-table figures, guards and regression tests merged | Teacher still decides ambiguous printed pair; do not rerun M1 |
| M2 | Substitution figures and tests merged; this follow-up adds exact worked steps to actual runtime replacement | Two unlocated source strokes remain ambiguous, not assessed; broader formatting is separate |
| A1 / DB1 | New V3 DB suite and one-command real-source acceptance runner implemented; existing delivery DB suite now includes both V3 corrections | Full private-corpus local DB run still required; CI fixture test is explicitly a different evidence scope |
| A2 | Setup checklist and NOT PERFORMED report merged | Staging build, phone/session and actual observations absent |
| D1 | Three-question teacher sheet merged; corrected four-year caption and unsupported exact-315 inference | No dated teacher answers supplied |
| P1 | Comparator branch integrated and hardened; 13 synthetic tests | Certified full-content export and release snapshot absent |
| S1 | Design merged, no sequence code/schema applied | Explicit Batch 3/policy/placement approval required |

## Completed in this follow-up

- Runtime substitution replacement now includes the recovered examples: x=1,y=1 and m=9/11,n=12/11, checked substitutions, cancellation explanation, practice and answers. Clarifies mixed-number 1+1/11 instead of concatenated 11/11. Existing correction fingerprinting covers the edited lesson. No original body was changed.
- Corrected the M2 report: raw Mammoth extraction omitted equations, but the executable importer already runs equation recovery. This prevents another agent repeating a nonexistent wholesale fraction-loss fix.
- P1 now distinguishes null, empty, missing, numeric/text and newline differences; preserves multiline CSV; rejects empty/duplicate field lists, blank identities, malformed CSV and missing columns. Records input hashes and diagnostic scope. No real 2179-row claim.
- Science DB tests exercise actual attachment SQL and authenticated asset routes, hidden-source exclusion, exact bytes, dry-run, idempotence, metadata consent, wrong identities and class isolation. They support both CI synthetic identities and real importer captures; the report must say which ran.
- `scripts/jss3/run_acceptance.py` stages/verifies the single source ZIP, uses its existing audited baseline capture, sets all source variables, runs corpus and serial DB suites, and refuses a full PASS if DB tests are omitted/skipped. No additional historical-capture attachment is needed.
- Fixed V1 test behaviour: a figure-generator error can no longer masquerade as a missing-CairoSVG skip. Strict acceptance requires visual dependencies.
- Replaced broad prompts with six self-contained implementation files in NEXT_AGENT_TASKS. Each has exact inputs, commands, scope, completion gates, publication and blocked-state handling.

## Verification and limits

Node24.19.0 corpus rerun: 300 tests, 295 pass, zero fail, five DB suites skipped. Types, static and asset checks pass. Thirteen comparer unit tests and three runner safety tests pass. The runner correctly reports INCOMPLETE for --without-db. Counts remain 313 originals plus170 supplements =483 (234 First,249 Second,0 Third); Computer Studies0. Original objects are equal before/after after normalising only the staging-root prefix. Only the intended supplement body changed and shared hashes were regenerated.

Local PostgreSQL package installation was attempted but the execution host rejected setgroups/setegid/seteuid operations. No access-control workaround was used. The repository CI has an isolated PostgreSQL service; its fixture-mode V3 result is recorded separately when available. That result must not be represented as a full private-source DB run. No staging/phone or certified protected-row evidence was supplied.

No production import, migration or cleanup was invoked. Production deployment state was not inspected. School-text/verse permissions, set texts, practical performance, project guidelines and remaining source ambiguities in OPEN_BLOCKERS.csv are not waived. Repo implementation is not curriculum certification.

Next: give ONE complete file from NEXT_AGENT_TASKS to each agent. DB1 and MATH3 can work independently; publish sequentially against fresh master. DEVICE1, TEACHER1, BASELINE1 and SEQUENCE2 require their named external inputs/approval. Do not commission them as if those inputs already exist.
