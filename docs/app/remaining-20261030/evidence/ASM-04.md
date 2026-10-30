# ASM-04 evidence — count unreviewed AI essays in the marking backlog

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `55a0c3d`. The prompt's line numbers were written against `8ffcd12`; `learning.ts` has moved since, so all citations below are at `55a0c3d`.
Dependency note: the prompt lists ASM-01 (finality rule, gated on owner decision D1). ASM-01 has **not** landed. ASM-04 defines its own pending set (`ai_graded` + `ai_unavailable`) and does not touch total-score recompute or student visibility, so it is self-consistent, but it should be reviewed together with ASM-01.

## Old behaviour (base `55a0c3d`, `backend/src/routes/learning.ts`)

- Submit: `anyUngraded` is set only in the `catch` for a failed AI call (`1143-1144`); `fully_graded` is written as `!anyUngraded` (`1154-1157`). An AI-graded answer is inserted as `ai_graded` (`1137-1140`) and leaves `fully_graded = true`.
- `GET /submissions/:id/answers` hides an answer's mark from non-admins unless status is `auto` or `teacher_reviewed` (`1265-1276`), and review is admin-only via `aiGrading.override` (`1291`).
- `GET /assessments/:id/results` counted only `ai_unavailable` as `pending_essay_count` (`1200`).
- `GET /assessments/:id/submissions` ordered by `sub.fully_graded ASC, st.full_name` (`1225`), so AI-graded-but-unreviewed work sorted as done.
- Review route recomputed `fully_graded` as "no `ai_unavailable` row" (`1324`).

## New behaviour

- One helper block in `learning.ts` (no new module): `PENDING_REVIEW_STATUSES`, a matching SQL constant `PENDING_REVIEW_SQL`, and `reviewBacklog(statuses)` returning `{ pending_review_count, fully_graded }` where `fully_graded = pending_review_count === 0`.
- Submit builds `essayStatuses` (`auto` for a blank essay, `ai_graded`, `ai_unavailable`) and writes `fully_graded` from `reviewBacklog`. `anyUngraded` is removed.
- Review route derives `fully_graded` from `reviewBacklog` over every answer row. The existing total recompute is unchanged (ASM-01 owns it).
- `GET /assessments/:id/results`: subquery now counts both statuses as `pending_review_count`. `pending_essay_count` is kept as an alias of the same value for one release, because `mobile/src/screens/AssessmentResultsScreen.tsx:57` reads it (grep: that is the only reader). Comment marks it for removal.
- `GET /assessments/:id/submissions`: selects `pending_review_count`; order is `pending_review_count DESC, st.full_name`.

## Hand computation (3 submissions, one essay each; names Amaka, Bayo, Chidi)

| Submission | Essay status | Before: pending / fully_graded | After: pending / fully_graded |
|---|---|---|---|
| Amaka (auto-only) | `auto` | 0 / true | 0 / true |
| Bayo | `ai_graded` | 0 / true | 1 / false |
| Chidi | `ai_unavailable` | 1 / false | 1 / false |

- Backlog (submissions needing review): before **1** (Chidi), after **2** (Bayo, Chidi).
- Inbox order: before Chidi, Amaka, Bayo; after Bayo, Chidi, Amaka.

## Consequences to know about

- **Student-facing text.** `mobile/src/screens/TakeAssessmentScreen.tsx:116,164` shows "Brainee is still checking one or more of your written answers…" when `fully_graded === false`. Students with `ai_graded` essays will now see this note. That matches the server hiding those marks, but the wording says "Brainee" when the wait is for admin review. Not changed: out of this task's Writes.
- **Stored flag for existing rows.** `submissions.fully_graded` is persisted. Rows submitted before this change keep the old value until an admin reviews one of their answers. The inbox order and the count use live `submission_answers` data, so they are correct regardless; only the returned `fully_graded` field is stale for old rows. A one-off backfill is possible (not written into any file, not run, owner decision):
  `UPDATE submissions s SET fully_graded = NOT EXISTS (SELECT 1 FROM submission_answers sa WHERE sa.submission_id = s.id AND sa.grading_status IN ('ai_graded','ai_unavailable'));`
- `EssayAnswerReviewScreen.tsx` does not read or label `fully_graded` (grep), so no label change was needed there.
- `AssessmentResultsScreen` badge text "N needs grading" now reflects reviews outstanding; wording refinement would need an edit to that screen, outside this task's Writes.
- `total_score` still includes AI essay points before review (`learning.ts` submit, `essayPointsTotal`). That is ASM-01's scope.

## Deliberately not changed

Permissions (`aiResults.read`, `aiGrading.override` stay admin-only), AI prompts and retry behaviour, schema, indexes, `GET /submissions/:id/answers`, total-score recompute.

## Not done / not verified

No tests, typechecks, DB, migrations, device or deploy were run (testing deferred by owner). The SQL (`IN (...)` subquery, `ORDER BY` on the subquery alias) has not been executed. The admin screens were not rendered.
