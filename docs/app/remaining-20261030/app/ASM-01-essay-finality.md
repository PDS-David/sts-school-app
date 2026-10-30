# ASM-01 — Make essay marks tell the same truth everywhere

Status: READY, subject to owner decision D1 · Depends: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/learning.ts`, `docs/app/remaining-20261030/evidence/ASM-01.md`

## Why (verified at master `8ffcd12`)

The essay grading path accumulates `essayPointsTotal` from every AI-graded answer (`learning.ts:1142`), writes `submissions.total_score = auto_score + essayPointsTotal` (`1153-1157`), and returns that total from both `/assessments/:id/results` (`1197-1203`) and `/assessments/:id/submissions` (`1215-1226`).

The per-answer view disagrees. `GET /submissions/:id/answers` shapes each row (`1265-1276`): an answer is final only when `grading_status` is `auto` or `teacher_reviewed`; an `ai_graded` answer is returned with `awarded_points: null`, `ai_feedback: null` and `pending_review: true`. Admin bypasses the shaping (`1248`).

So a student (or the admin list) can see an aggregate that includes an AI mark the detail says is not final. `fully_graded` does not resolve it: it is `!anyUngraded`, and `anyUngraded` is only set when the AI call throws (`1144-1146`), not when the result is merely unreviewed. The manual records this exact inconsistency.

## Do

1. Adopt decision D1 (recommended): **unreviewed AI essay marks are not part of the final score**.
   - `total_score` = auto marks + marks from answers whose status is `teacher_reviewed` (plus `auto`, which has no essay role). Keep the AI suggestion in `submission_answers.ai_suggested_points` and `ai_feedback`; do not delete it.
   - `fully_graded` becomes true only when no answer is `ai_graded` or `ai_unavailable`.
2. `GET /assessments/:id/results` returns, per submission: `total_score` (final only), a `provisional_essay_points` sum for unreviewed answers, `pending_review_count` (both `ai_graded` and `ai_unavailable`), and keeps `fully_graded`.
3. The admin review route (`PUT /submissions/:id/answers/:answerId/review`, `1291-1331`) must, after updating the answer, recompute the submission's `total_score` and `fully_graded` from `submission_answers` in the same request, so a review is reflected immediately.
4. If D1 is instead "show AI marks but label them provisional", stop and report: that changes the response contract for students and needs an explicit UI decision. Do not silently pick it.
5. Record in the evidence note: old vs new total for one worked numeric example (2 MCQ at 5 + 1 essay at 10 graded 7), and that historic submissions with `ai_graded` rows hold an inflated `total_score` until the owner authorises a recompute (not performed here).

## Acceptance (static)

- For every submission, `total_score` equals the sum of final answer marks under the new rule; no reader sees a total that includes a mark the detail hides.
- A reviewed essay raises the total exactly once; re-review adjusts, never double-counts.
- Topic-generated assessments are unaffected (they are all-MCQ; the pass gate at `1167-1179` stays valid).
- No change to traditional `scores` rows.

## Do not

- Change the AI prompt, essay point clamping, or the review permission (admin-only).
- Alter `assessments.total_marks` or the 60 % pass threshold.
- Backfill existing rows; that is a separate owner-approved data operation.
