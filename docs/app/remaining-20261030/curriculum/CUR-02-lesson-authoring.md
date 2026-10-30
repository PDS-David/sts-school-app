# CUR-02 — Author SS1 lessons from recorded coverage

Status: READY (per-lesson; source document required) · Depends: the subject's coverage entries · Owner decision: none beyond content approval
Writes: `backend/src/db/ss1/subjects/<subject>.json`, `docs/ss1/work/microtasks/<subject>/QUEUE.json`, `docs/ss1/work/microtasks/<subject>/<TASK-ID>.md`, and (only if the lesson needs a figure) `backend/src/db/ss1/assets/<subject>/<file>`

## Why

Across the 21 SS1 queues there are 55 `LESSON` items pending and 19 `FACTUAL_DEPENDENCY` items; only nine subjects have any coverage entries, and only English (19 lessons), French (28), Further Mathematics (7) and Mathematics (6) have authored lessons at all. Coverage can be `SUPPORTED` while zero lessons exist, because coverage records that the source teaches an objective — not that a deliverable lesson object was built.

The lesson contract is strict (`backend/src/db/ss1/subjectPackageSchema.ts:20`): `id` matching `SUP-SS1-<TOKEN>[-...]`, exactly `class_name: "SS 1"`, a term, objectives, body, `body_sha256`, at least one practice item with marks and marking criteria, at least one provenance record with rights and reuse status, and a three-axis state.

## Do

1. Take one `LESSON` queue item for the subject. Read the coverage entries it points at, then the original source at the cited locators. Do not author from memory or from a search result.
2. Compose the lesson:
   - `body` teaches exactly the objectives; no invented facts, dates, formulae or vocabulary. For a `PARTIAL`/`UNRESOLVED` coverage entry, teach only what the source supports and keep the gap recorded.
   - `practice` has at least one question with `marks`, `answer`, and `marking` criteria whose marks sum to the question marks (compiler checks this at `compiler.ts:101`).
   - `provenance` names the real source, locator, rights basis, `reuse_status` and attribution. If the reuse basis is unknown, `PENDING` — never invent a licence.
   - `body_sha256` is SHA-256 of the exact body bytes, recomputed after the final edit.
   - `state`: `content_approval: PENDING`, `approval_reference: null`, `implementation: IMPLEMENTED`, `verification: DEFERRED`. Only the owner moves approval to `APPROVED`.
3. Link the lesson from its coverage entries (`lesson_ids`) and change a `SUPPORTED`/`PARTIAL` status only where the lesson actually closes the objective; otherwise keep `PARTIAL` and explain the remainder.
4. Record the lesson's ID, body hash, practice marks and coverage IDs in the evidence note. Flip the queue item and append one note. Do not move `package_status` to `IMPLEMENTED`.
5. Open one PR per lesson (or per small cluster only if the queue item itself is a cluster). Do not merge.

## Acceptance (static)

- The package parses under `subjectPackageSchema`; IDs are unique; body hash recomputes; every practice item's marking sums to its marks.
- Coverage and lesson agree: no coverage entry claims `SUPPORTED` without a lesson ID that teaches it.
- No third-party text or image is reproduced beyond its rights basis; attribution is specific.
- The note records `IMPLEMENTED_TESTING_DEFERRED` and names what a reviewer must check (accuracy, age-appropriateness, notation, rights).

## Do not

- Author a lesson for an `UNRESOLVED` objective by inventing the missing content (e.g. a named text, a dialect form, a diagram) — leave it unresolved and escalate.
- Copy the JSS3 supplement lessons or another subject's lessons wholesale.
- Claim the subject is complete, approved or verified.
