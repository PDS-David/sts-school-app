# VER-02 — Give the unrun tests a manual CI job

Status: READY (workflow edit only) · Depends: VER-01 for script names · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: `.github/workflows/jss3-assets.yml` (additive job), `docs/app/remaining-20261030/evidence/VER-02.md`

## Why

The only workflow (`.github/workflows/jss3-assets.yml`) runs typechecks, the Python unittest suites, `node --test tests/*.cjs` (which covers the three `.cjs` files), and one hand-maintained list of `.mts` files plus seven DB suites. Seventeen `.mts` suites appear in neither the explicit list nor a glob, including substantial ones:

`jss3-third-term.test.mts`, `jss3-second-term.test.mts`, `jss3-first-term.test.mts`, `jss3-basic-tech-1f-r2.test.mts`, `jss3-english-1f-r1.test.mts`, `jss3-english-symbols-task3.test.mts`, `jss3-pending-entries-1f-r3.test.mts`, `jss3-phe-marker-1f-r5.test.mts`, `jss3-text-study.test.mts`, plus four `.db` suites (`jss3-batch2-assets`, `jss3-delivery-correction`, `jss3-v1-business`, `jss3-v2-math-assets`, `jss3-v3-science-assets` — five in total) and two smaller static suites. Derive the exact list mechanically in step 2; the count is 17 at `8ffcd12`.

A merged PR therefore says "CI passed" while a quarter of the suite has never run. The reference manual warns that "CI success is not ... a full private-source curriculum acceptance result"; this task narrows the gap without pretending CI becomes acceptance.

## Do

1. Add a **separate job** to the workflow, gated to `workflow_dispatch` only (`if: github.event_name == 'workflow_dispatch'`), that runs every root test not in the current push job. Keep the existing push/PR job byte-for-byte unchanged so deferred testing is not silently enabled on every push.
2. Derive the missing list mechanically: enumerate `tests/*.test.mts` and `tests/*.test.cjs`, subtract the files named in the workflow, and check the difference into the new job as an explicit list (no glob that would silently pick up future DB suites).
3. DB suites go into the same manual job using the existing Postgres 16 service and the env vars each file declares. Do not invent a shared variable.
4. Do not change Node (`24.19.0`) or Postgres versions, permissions, concurrency or triggers.
5. Evidence note: the derived list with a one-line justification per file, and the exact reason each was previously missing (not in list vs needs a service vs needs capture dir).

## Acceptance (static)

- The new job cannot run on `push` or `pull_request`.
- Every file listed exists.
- The existing job's steps are unchanged.
- The workflow remains valid YAML by inspection (indentation, `needs`, service block placement).

## Do not

- Trigger the workflow or push a test commit to watch it.
- Add a deployment step, secret, or self-hosted runner.
- Claim the new job passes.
