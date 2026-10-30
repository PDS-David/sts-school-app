# ASM-02 — Allow a failed assessment to be retaken

Status: BLOCKED ON OWNER DECISION D4 · Depends: ASM-01, OPS-01 · Base: `origin/master` (record the SHA)
Writes: `backend/schema.sql`, the migration file defined by OPS-01, `backend/src/routes/learning.ts`, `mobile/src/screens/TakeAssessmentScreen.tsx` and `AssessmentResultsScreen.tsx` (only if the decision changes the student flow), `docs/app/remaining-20261030/evidence/ASM-02.md`

## Why (verified at master `8ffcd12`)

A submission is unique per assessment and student (`schema.sql:358`, `UNIQUE(assessment_id, student_id)`). `POST /assessments/:id/submit` inserts with `ON CONFLICT DO NOTHING` and returns 409 if a row already exists (`learning.ts:1081-1091`). There is no retake endpoint — no `/retake` route exists anywhere.

For a topic's generated standard assessment, the same request writes the pass state: `score_percent >= 60` into `topic_completions` (`1167-1179`), and `GET /topics` locks the next topic on `passed=true` (`178-187` by way of `resolveSequenceGroup`). A student who scores below 60 therefore has a permanent failing row, cannot resubmit, and the next topic stays locked. The manual records this as a progression-stalling limitation, not a uniform retake policy.

Note the second trap in the same upsert: `ON CONFLICT ... DO UPDATE SET passed=EXCLUDED.passed, score_percent=EXCLUDED.score_percent` overwrites a previous pass with a later fail. Any retake design must make progress monotonic.

## Do (only after D4 is answered)

Recommended default for D4: **3 attempts per assessment, best score kept, attempts visible to teacher/admin, no attempt after a pass.**

1. Schema: add `attempt_no INT NOT NULL DEFAULT 1` to `submissions`; replace the two-column unique constraint with `UNIQUE(assessment_id, student_id, attempt_no)`. Add the same change to the OPS-01 migration set. No data is migrated: existing rows are attempt 1.
2. `POST /assessments/:id/submit`: compute the next attempt number inside a transaction (lock the existing rows for that pair), insert with the new attempt number, and keep the 409 only for a duplicate *attempt* (concurrent double-tap), not for a legitimate retake. Reject when the student already passed or the attempt cap is reached, with a specific error code.
3. Add `GET /assessments/:id/attempts` (student own, teacher/admin scoped) returning attempt number, score, passed and submitted_at. Do not expose other students' attempts.
4. Results and topic completion: keep the **best** score and set `passed = passed OR (score >= 60)`, `score_percent = GREATEST(existing, new)` in the upsert so a retake can never relock an unlocked topic.
5. Mobile: show remaining attempts on the result screen and a Retake action only when eligible; do not pre-create a submission.
6. If D4 is anything other than the default, implement the chosen numbers but keep the monotonic progression rule — it is a correctness fix, not a policy choice.

## Acceptance (static)

- One row per (assessment, student, attempt); no duplicate-open submissions.
- Passing unlocks the next topic; failing all attempts leaves it locked; retaking after a pass is rejected.
- No limit can be bypassed by calling submit directly.
- Historic rows remain valid attempt 1.

## Do not

- Implement this before OPS-01 lands, or edit `schema.sql` without its migration.
- Delete or rewrite existing submissions.
- Add a general "unlimited retake" endpoint, which the manual explicitly says does not exist and this task does not authorise.
- Run any test or database command.
