# CUR-01 — Drain the SS1 queues, one task per PR

Status: READY · Depends: none · Owner decision: none · Base: `origin/master` (record the SHA)
Writes: only the paths named in the live prompt you were given for that task (normally `backend/src/db/ss1/subjects/<subject>.json`, `docs/ss1/work/microtasks/<subject>/QUEUE.json`, `docs/ss1/work/microtasks/<subject>/<TASK-ID>.md`)

## Why

SS1 is the largest remaining body of work: 21 queues totalling 1,225 items — 246 implemented-and-unverified, 909 pending, 70 blocked (counts at master `8ffcd12`, 2026-10-30). The curriculum is delivered by strict `ss1-subject-v1` packages compiled from owner-supplied documents; most subjects still have no coverage entries and none has a complete set of authored lessons. The manual states plainly that "package presence is not readiness" and that inventory completion is not curriculum completion.

Per-task detail already exists and is generated from the queues by `scripts/ss1/refresh_next_tasks.py`. This task is the runner: it turns those prompts into a controlled sequence of PRs.

## Do

1. Pick **one** subject from `docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md`. Open `docs/ss1/work/microtasks/<subject>/NEXT_TASK.md` and treat it as the authoritative task prompt: it names the reviewed base, the source document and hash, the permitted writes and the completion condition.
2. Execute exactly that one item. Follow its attachment requirement — the source document is supplied by the owner for that run; never commit it, never extract outside scratch.
3. Apply the SS1 house rules from the existing notes:
   - Cite 1-based line ranges and SHA-256 block hashes under the documented convention (lines joined with `\n`, edge blanks trimmed).
   - `lesson_ids: []` on coverage unless a real lesson object exists.
   - `MARKER` coverage lists the classifying marker rule in `lesson_ids` (`compiler.ts` requires a non-empty list).
   - Append-only edits: never rewrite or reorder another task's coverage, open items or queue notes.
   - Update `YORUBA-OBJECTIVE-INDEXING`-style umbrella items only as the prompt instructs.
4. Flip the queue item to `IMPLEMENTED_TESTING_DEFERRED`, recompute `counts`, `status_counts` and `next_runnable` (first PENDING item whose dependencies are all implemented), append one note, and stop.
5. Open a PR to `master`. Do not merge. Do not run `refresh_next_tasks.py` — the shared index is the integrator's file and is regenerated after merges.
6. Report the next eligible item without executing it.

## Sequencing

- One worker per subject. Different subjects may run in parallel only because their package and queue files are disjoint.
- Within a subject, the next task waits for the owner to merge the previous PR (the queue file is shared and append-only).
- Stop and report instead of proceeding when the next item is a `TEST` item (testing is deferred) or is `BLOCKED` on an owner decision, external evidence or another item.

## Acceptance (static)

- The diff contains only the three permitted files (or the prompt's stated set).
- JSON is CRLF, two-space indented, no BOM, canonical; the package still parses under `subjectPackageSchema`.
- Every new hash recomputes; every cited line range exists at the recorded source.
- No source document, extract, render, private data or token appears in the diff.
- The evidence note states `IMPLEMENTED_TESTING_DEFERRED`, lists what was and was not done, and names the next item.

## Do not

- Run tests, typechecks, the importer, plan/compiler runs, migrations, imports or deployments.
- Modify another subject's files, `docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md`, the compiler/schema, or shared SS1 infrastructure.
- Claim curriculum completion for a subject because its queue was drained; content approval and verification are separate states.
