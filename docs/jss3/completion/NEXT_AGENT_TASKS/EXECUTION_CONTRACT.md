# Current execution contract — replaces conflicting worker-publication instructions

Repository: https://github.com/PDS-David/sts-school-app ; branch: master.
Read this file first, then ONLY your assigned task specification. Historical reports are evidence, not new assignments. The owner starts each task; do not start another after yours.

## Authority and ownership
- The owner authorised implementation, tests and repository publication; clearly labelled source-backed equivalent teaching is allowed. Do not ask again for ordinary implementation choices already covered.
- Workers publish a tested isolated branch and PR targeting master. **Workers never merge.** The owner-designated integration agent alone merges, serially, after reconciling shared files and passing CI. The coordinating agent performing the consolidation is the current integrator; a later agent becomes integrator only when the owner explicitly assigns that role.
- A worker must not wait for other workers to finish before delivering a coherent PR. State shared-file overlap and exact dependency. The integrator owns regeneration and combined verification after merges.
- Production deployment, production import/migrations, real-student cleanup and unapproved sequencing policy are not authorised. No speculative UI redesign.
- Preserve the 313 source row objects and all other classes. First/Second Terms teach; Third Term prepares for BECE; no JSS3 Computer Studies. Never label equivalents as source originals or school-prescribed texts. Do not invent source facts, performance observations or historical certification.

## Start, inputs, implementation
1. Fetch master, record full SHA, read applicable AGENTS.md. Use a separate branch/worktree. Inspect current effective delivery and existing tests before editing. If the exact task is already implemented, verify that result and identify only the actual residual; do not repeat the audit.
2. For source-backed tasks use `JSS3_NEXT_STAGE_INPUTS_20261016.zip` or its (1)/(2) copy (SHA256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`). Verify inventory; do not reject a filename suffix. This is private input, not in Git. Its historical supplement count is not a current expected total. If unavailable, finish independent code/tests and request exactly this archive once.
3. Node24.19.0; `npm ci --ignore-scripts`. Python virtualenv with `pip install -r scripts/jss3/acceptance-requirements.txt`. Discover actual generator options using --help; no guessed arguments.
4. Deliver working code/content and its learner/API binding, meaningful regression tests, and regenerated records. A report/proposal alone cannot complete an implementation task. For changed lessons regenerate IMPLEMENTED_LESSONS.csv and the teacher schedule using repository generators and a fresh capture. Keep source rows byte-identical.
5. Use `python3 scripts/jss3/run_acceptance.py --archive "$INPUT_ZIP" --output "$PWD/evidence-unique" --without-db` for corpus checks. A fresh output directory is required. Exit2 is INCOMPLETE only when corpus passed and DB was deliberately omitted; inspect ACCEPTANCE.json. Missing-source/failed checks are not permitted skips. --tsx-no-ipc is only a documented environment workaround.
6. Database changes use disposable loopback PostgreSQL16, database `jss3_test_*`, with JSS3_LOCAL_TEST_DATABASE_URL. Run acceptance without --without-db. **The runner now includes eight suites**, adding Yoruba attribution. Historical seven-suite results remain valid for their own earlier commits, not this changed runtime. CI has separate real-PostgreSQL route tests; no mocks substituted for DB acceptance.
7. Missing external inputs block only affected items. Finish independent supported implementation. Practical observation is separate from teaching/rubrics. A school-specific book decision is separate from a labelled equivalent. Unproved historical certification stays unproved.

## Delivery and publication
- Save progress in commits on your branch before long checks. Do not commit source documents, full captures, credentials or student records.
- Handoff: task, base/head SHA, changed behaviour/files, exact commands/results/skips, generated artifacts, PR URL, overlap/dependencies, and remaining external input. Keep implementation/testing/publication/integration/deployment statuses separate.
- Fetch master again before submitting; reconcile overlapping changes and rerun affected tests. Submit PR, do not merge. No write access: export binary-capable patch, git bundle and APPLY.md with base/head/branch and exact commands. An unpublished SHA is not remotely fetchable.
- Integrator: inspect changes, merge one PR at a time after required CI, verify remote SHA, refresh shared records and candidate evidence. Do not close a worker's PR as integrated until its changes are actually present.
- Never use unavailable historical logs or an unobserved device as fabricated PASS evidence. Do not rerun already completed full audits without a specific remaining verification need.
