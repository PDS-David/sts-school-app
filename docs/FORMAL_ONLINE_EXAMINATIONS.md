# Formal online examinations

This is a separate online-examination subsystem. It does not use or write physical teacher-report scores, attendance, report cards, report remarks, report-roster memberships or enrollment history.

## Question preparation and rights

Question preparation reuses the existing rights-aware `question_bank_questions` corpus.

- Existing questions are eligible for an examination only when `review_status` is `approved` or `published`.
- A past question must have a documented `licensed` or `public_domain` source; the question and source rights statuses must match. A PostgreSQL trigger repeats the approval, board, subject, source-evidence and rights checks when exam question snapshots are inserted or updated.
- Original AI questions are stored as `draft` with `original_generated` rights and are never available for an examination until a subject reviewer approves or publishes them.
- The six pilot questions seeded by migration 0012 are only `reviewed`, not approved/published, and are therefore rejected by exam creation.
- Historical question year, paper, source locator, source name/URL, board and rights status are snapshotted into examination provenance.

### Generate original question drafts

Admin endpoints use existing lesson content and the existing Gemini `generateJSON` service:

- `POST /online-exams/admin/exams/generate-drafts`: canonical school topics for JSS3 and other supported canonical-topic classes. The topic must be completed by every active student currently enrolled in the target class.
- `POST /online-exams/admin/exams/generate-package-drafts`: SS1–SS3 package lessons. Only implemented, student-deliverable package lessons with permitted source provenance are eligible. Every current candidate must have a matching package lesson completion record.

Both endpoints create three original MCQs per selected lesson in the question bank with:
- `paper = Original practice — not a past paper`
- `exam_year = NULL`
- `question_number = AI-GEN-...`
- `rights_status = original_generated`
- `review_status = draft`

A subject reviewer must approve/publish the drafts in the existing question-bank review workflow before they can be attached to an examination. The exam publish endpoint rechecks the generated lesson coverage against the current candidate list.

## Admin workflow

1. Select the target school in the admin school context.
2. Generate original question drafts from fully covered lesson topics/package lessons, or use existing approved rights-cleared question-bank questions.
3. Subject-review and approve/publish every generated draft.
4. Create a draft examination with board, subject, class (JSS3/SS1/SS2/SS3), examination type, optional year, instructions, duration, start/end times and ordered sections/questions.
5. Publish the examination. The candidate list is snapshotted from active student records in that school and class. A class with no active candidates cannot be published.

Example request shape:

```json
{
  "board": "WAEC",
  "subject_name": "Mathematics",
  "class_name": "SS 3",
  "examination_type": "Mock Examination",
  "exam_year": 2026,
  "title": "SS3 Mathematics Mock",
  "instructions": "Answer all questions. Check the time remaining before submission.",
  "duration_minutes": 90,
  "starts_at": "2026-11-25T09:00:00+01:00",
  "ends_at": "2026-11-25T11:00:00+01:00",
  "sections": [
    {
      "title": "Section A",
      "instructions": "Answer all questions.",
      "questions": [
        { "question_id": "question-bank-uuid", "marks": 2 }
      ]
    }
  ]
}
```

## Student workflow

- `GET /online-exams/exams` lists only published exams with a matching candidate record and the student's current school/class.
- `POST /online-exams/exams/:examId/start` creates the one allowed attempt or recovers an existing in-progress attempt.
- `GET /online-exams/attempts/:attemptId` recovers the student's own attempt and saved responses.
- `PUT /online-exams/attempts/:attemptId/responses/:questionId` autosaves a response. The server checks ownership, question membership and the deadline.
- `POST /online-exams/attempts/:attemptId/submit` finalises the attempt. It is safe to retry after an already-completed submission.
- `GET /online-exams/attempts/:attemptId/results` returns only that student's own result and response feedback.
- Admin review: `GET /online-exams/admin/exams/:examId/attempts`, `GET /online-exams/admin/attempts/:attemptId/responses`, and `PUT /online-exams/admin/attempts/:attemptId/responses/:questionId/mark` provide school-scoped manual marking for answers left `pending_review`.
- School-scoped examiner endpoints list candidate attempts and responses, and permit manual marks only for responses left `pending_review` by unavailable AI marking.

The deadline is calculated on the server as the earlier of start time plus configured duration and the examination end time. Client clocks are display-only. Refresh/reconnect recovery loads server-saved answers; the mobile screen also retains unsent answers locally and retries when connected.

MCQs are marked automatically. Written responses reuse the existing `generateJSON(..., 'essay-mark')` AI-marking contract. If AI marking is unavailable, the attempt is placed in `under_review` and the affected answer is marked `pending_review`; it is not silently awarded zero.

## Data model

Migration `0014_formal_online_examinations.sql` adds:
- `online_exams`
- `online_exam_sections`
- `online_exam_questions` (question and provenance snapshots)
- `online_exam_candidates`
- `online_exam_attempts` (one unique attempt per exam/student)
- `online_exam_responses` (autosaved responses and marking state)
- `online_exam_audit_events`

No physical-reporting tables are referenced by the migration or route.

## Deployment and verification

- Migration 0014 is additive, but the current master branch has migration 0012 and no 0013. PR #1033 owns migration 0013; the existing migration runner rejects gaps and requires sequential history. Do not merge or deploy this PR until the migration-number collision/order is explicitly coordinated and 0013 is present before 0014.
- Deploy the backend API and mobile app together to expose the student flow.
- No destructive production operation or data backfill is required.
- CI workflow `.github/workflows/online-exams.yml` runs the backend build, focused contract tests, PostgreSQL 18 question-bank + exam migration/API/constraint/isolation test and mobile TypeScript check. The workflow applies migrations 0012 and 0014 directly in an isolated test schema; it does not validate the repository's full sequential migration ledger while 0013 is absent.
- The PostgreSQL integration test requires a disposable `TEST_DATABASE_URL`; it creates and drops only a uniquely named test schema.
