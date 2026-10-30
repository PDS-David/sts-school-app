# ASM-04 — Count unreviewed AI essays in the marking backlog

Status: READY · Depends: ASM-01 (same finality definition) · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/learning.ts`, `mobile/src/screens/EssayAnswerReviewScreen.tsx` (label only, if needed), `docs/app/remaining-20261030/evidence/ASM-04.md`

## Why (verified at master `8ffcd12`)

The repository does have a graded/ungraded flag and a marking inbox — the earlier note that "there was no graded/ungraded flag at all" is stale. What is inaccurate is the definition:

- `fully_graded` is written as `!anyUngraded` (`learning.ts:1144-1146`), and `anyUngraded` is set only in the `catch` when the AI call throws (`1147-1152`, status `ai_unavailable`).
- An answer the AI **did** grade is stored as `ai_graded` (`1132-1139`) and leaves `fully_graded = true`, even though `GET /submissions/:id/answers` refuses to show its mark until `teacher_reviewed` (`1265-1276`) and the review route is admin-only (`1291-1331`).
- `GET /assessments/:id/results` counts only `ai_unavailable` as pending (`1202-1203`), so the admin list understates the review backlog.
- `GET /assessments/:id/submissions` orders by `fully_graded ASC` (`1216-1226`), so AI-graded-but-unreviewed work sorts as done.

Consequence: admin review queues can be emptied while essays still have no confirmed mark, which interacts directly with ASM-01's finality rule.

## Do

1. Define one helper (in `learning.ts`, not a new module) that computes, for a submission: `pending_review_count = count(status IN ('ai_graded','ai_unavailable'))` and `fully_graded = pending_review_count = 0`. Use it in submit and in the review route.
2. `GET /assessments/:id/results`: replace the `ai_unavailable`-only subquery with both statuses (alias `pending_review_count`), and keep the old field name only if a mobile screen reads it — grep first; if it does, keep both for one release with a comment.
3. `GET /assessments/:id/submissions`: select the pending count per submission and order by `pending_review_count DESC, st.full_name`, so unreviewed essays surface first regardless of `fully_graded`.
4. After an admin review, recompute and persist `fully_graded` from the helper (ASM-01 already requires the total recompute; do not duplicate that logic).
5. Mobile: if `EssayAnswerReviewScreen` labels `fully_graded` as "complete", change the label to reflect "no review outstanding"; do not add new screens.
6. Evidence note: before/after backlog count for one assessment with 3 submissions (1 auto-only, 1 AI-graded, 1 AI-unavailable), computed by hand from the query.

## Acceptance (static)

- An `ai_graded` answer keeps its submission out of the "fully graded" set until `teacher_reviewed`.
- The inbox count equals the number of submissions with at least one unreviewed essay.
- No permission change: teachers still cannot review (`aiGrading.override` stays admin-only).
- No schema change, no index, no query on a table that does not exist.

## Do not

- Grant teachers `aiResults.read` or review rights.
- Change AI grading prompts or retry behaviour.
- Claim the admin screen was rendered or tested.
