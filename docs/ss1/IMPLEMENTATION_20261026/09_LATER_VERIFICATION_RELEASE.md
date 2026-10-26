# SS1-09 — LATER verification and release; do not execute during implementation

## Access these prompts before their PR is merged

These instructions are published on `ss1/implementation-prompts-20261026` (PR65). If `docs/ss1/IMPLEMENTATION_20261026/` is not on master yet, create your isolated task branch from current master, then fetch and copy ONLY this documentation directory:

```bash
git fetch origin refs/heads/ss1/implementation-prompts-20261026:refs/remotes/origin/ss1/implementation-prompts-20261026
git restore --source=origin/ss1/implementation-prompts-20261026 -- docs/ss1/IMPLEMENTATION_20261026
```

This supplies the README, manifest and prompts; it does not supply the later foundation or subject implementation. Read those dependencies at their own published SHAs. If the directory already exists, read its current version instead of overwriting newer prompts. Do not wait for a merge merely to read an available prompt.

This prompt is parked until SS1-08's whole source-code implementation is finished AND the owner explicitly starts testing. It does not override the current testing deferral.

Repository: https://github.com/PDS-David/sts-school-app, master. Read AGENTS.md, `docs/ss1/IMPLEMENTATION_HANDOFF.md`, `DEFERRED_VERIFICATION.md`, the final integration PR and all open_items. Pin the final implementation SHA; do not assemble a different candidate silently. Use the exact implemented commands in that handoff; if absent, require SS1-08 to finish them before calling this ready.

Inputs: `SSS 1-20260507T072431Z-3-001.zip`, SHA256024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e; current preserved-class reference/source snapshots specified by the integrator; Node24.19.0, Python requirements and actual disposable PostgreSQL16 (same host as runner, loopback, jss3_test_* or separately implemented SS1-safe prefix); designated staging/build/device access for the later phone step. No production secrets in chat/Git. JSS3's private archive is needed only for the scheduled JSS3 regression portion, not for SS1 source preparation. A certified historical baseline cannot be replaced by a current reconstruction.

1. Run the full implemented SS1 source/type/static/unit/API/real-DB/asset suites, original-row/other-class comparisons and targeted JSS3 regressions once at the pinned candidate. Zero unexplained skips; derive counts rather than repin failures. Exercise negative controls, stale summaries/assessments, old-schema compatibility, subject/elective isolation, term/PIN/access, source intent and all required assets/credits. Fix concrete failures, rerun affected checks, then final aggregate acceptance. Keep private raw captures outside Git.
2. Review every unresolved curriculum item and owner decision. Confirm source/header subjects, supplied/missing term coverage, book/exam-year identity, rights and any practical limits. Do not certify actual practical competence from software tests. Open content objectives remain visible; no green-count waiver.
3. On an owner-designated non-production target, rehearse backup restore, schema changes, code deployment, dry-run/import, asset attachment and any separately approved placement. Use synthetic accounts for app tests. Observe real phone readability/diacritics/equations/figures/animation/credits and actual assessment/progress behaviour, recording device/build/tester. No API-only or rendered-DOCX pass substitutes for phone observation.
4. Prepare exact-SHA release plan with production designation, original/current snapshots, required migrations, row/asset deltas, backup/restore proof, rollback order, maintenance window and smoke account. Confirm master auto-deployment before merging. Obtain concrete owner authority for production deployment/import/asset writes; no authorization inferred from a coding assignment. Execute only those operations, verify all-class before/after deltas and preserved progress, and publish final factual status.

Report IMPLEMENTED / VERIFIED / MERGED / DEPLOYED separately. SS1 is complete only for the explicitly evidenced curriculum and release scope; untouched SS2/SS3 are not certified. Do not restart the source audit wholesale: use immutable source hashes, worker coverage and exact changed-file investigation unless a concrete discrepancy requires deeper review.
