# Formal online examinations

This is a separate online-examination subsystem. It never writes physical teacher-report scores, attendance, report cards, report remarks, report-roster memberships or enrollment history. Active report-roster membership is read-only and is used solely to determine exam eligibility.

## Question preparation and rights

Question preparation reuses the existing rights-aware `question_bank_questions` corpus.

- Existing questions are eligible for an examination only when `review_status` is `approved` or `published`.
- A past question must have a documented `licensed` or `public_domain` source; the question and source rights statuses must match. A PostgreSQL trigger repeats the approval, board, subject, source-evidence and rights checks when exam question snapshots are inserted or updated.
- Original AI questions carry `original_generated` rights and enter the question bank's `reviewed` state, which is the pending subject-review queue. They are never available for an examination until an assigned subject reviewer approves or publishes them.
- The six pilot questions seeded by migration 0012 are only `reviewed`, not approved/published, and are therefore rejected by exam creation.
- Historical question year, paper, source locator, source name/URL, board and rights status are snapshotted into examination provenance.

### Generate original question drafts

Admin endpoints use existing lesson content and the existing Gemini `generateJSON` service:

- `POST /online-exams/admin/exams/generate-drafts`: canonical school topics for JSS3 and other supported canonical-topic classes. The topic must be completed by every active report-roster member with a valid same-school student account in the target class.
- `POST /online-exams/admin/exams/generate-package-drafts`: SS1–SS3 package lessons. Only implemented, student-deliverable package lessons with permitted source provenance are eligible. Every current active report-roster candidate with a valid same-school student account must have a matching package lesson completion record.

Both endpoints create three original MCQs per selected lesson in the question bank with:
- `paper = Original practice — not a past paper`
- `exam_year = NULL`
- `question_number = AI-GEN-...`
- `rights_status = original_generated`
- `review_status = reviewed` (pending subject-review queue)

A subject reviewer sees the generated questions in the existing More → Review Questions queue and must approve/publish them before they can be attached to an examination. The exam publish endpoint rechecks the generated lesson coverage against the current candidate list.

## Admin workflow

1. Select the target school in the admin school context.
2. Generate original question drafts from fully covered lesson topics/package lessons, or use existing approved rights-cleared question-bank questions.
3. Subject-review and approve/publish every generated draft.
4. Create a draft examination with board, subject, class (JSS3/SS1/SS2/SS3), examination type, optional year, instructions, duration, start/end times and ordered sections/questions.
5. Publish the examination. The candidate list is snapshotted only from active physical report-roster memberships in that school and class, linked to valid active student accounts in the same school. A class with no active candidates cannot be published.

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
        { "question_id": "11111111-1111-4111-8111-111111111111", "marks": 2, "covered_topic_id": 123 },
        {
          "question_id": "22222222-2222-4222-8222-222222222222",
          "marks": 5,
          "covered_topic_id": 124,
          "marking_rubric": [
            { "id": "definition", "description": "Defines the required concept accurately", "max_marks": 2 },
            { "id": "application", "description": "Applies the concept to the question", "max_marks": 2 },
            { "id": "clarity", "description": "Presents a clear, relevant explanation", "max_marks": 1 }
          ]
        }
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

Each question is mapped separately to a school/class/subject lesson that every eligible candidate has completed. The deadline is calculated on the server as the earlier of start time plus configured duration and the examination end time. Client clocks are display-only and only guide button presentation; the API rejects starts and saves outside the server's configured window. Refresh/reconnect recovery loads server-saved answers; the mobile screen also retains unsent answers locally and retries when connected. A server rejection after the deadline never clears an unsynced local answer: the submission keeps the local copy and the result screen warns the student to contact the school administrator.

MCQs are marked automatically and receive answer-specific explanations. Every short-answer/essay question must include an explicit criterion rubric whose maximum marks sum to the question marks. AI marking reuses the existing `generateJSON(..., 'essay-mark')` provider, but its output is accepted only when criterion scores reconcile to the total, each criterion is within its mark limit, feedback is present and confidence is at least 0.75. Confidence and criterion evidence are stored per response. Low-confidence, malformed or unavailable AI marking is sent to `pending_review`; it is not silently awarded zero. Examiners can then apply a manual mark.

## Data model

Migration `0014_formal_online_examinations.sql` adds:
- `online_exams`
- `online_exam_sections`
- `online_exam_questions` (question and provenance snapshots)
- `online_exam_candidates`
- `online_exam_attempts` (one unique attempt per exam/student)
- `online_exam_responses` (autosaved responses and marking state)
- `online_exam_audit_events`

Migration `0015_online_exam_marking_confidence.sql` adds validated AI confidence (0–1) and structured criterion-level marking evidence to each written response. Migration `0016_question_bank_subject_reviews.sql` records append-only subject-teacher approval/rejection decisions; teachers can review only question-bank subjects that match their assigned teaching subjects, and only approved/published questions can be attached to an examination.

The migration adds only online-assessment tables. The route reads `report_roster_memberships` for candidate eligibility but performs no writes to physical-reporting tables.

## Deployment and verification

- Migration order is 0012 (question bank), 0013 (adaptive class practice, merged from PR #1033), 0014 (formal examinations), 0015 (marking confidence/rubric evidence) and 0016 (subject-teacher question reviews). The 0013 file on this branch is byte-for-byte identical to the version now on master; it is part of the branch tree but is not a diff against master. Do not delete or renumber it. The migration-runner integration test creates a disposable PostgreSQL database, runs the actual `--fresh` and `--all` commands, and verifies the complete 0001–0016 ledger and resulting tables. The endpoint integration fixture also uses the production report-roster and SS1–SS3 curriculum-progress table structures.
- Deploy the backend API and mobile app together to expose the student flow.
- No destructive production operation or data backfill is required.
- CI workflow `.github/workflows/online-exams.yml` runs the backend build, focused contract tests, PostgreSQL 18 endpoint integration tests applying migrations 0012 → 0013 → 0014 → 0015 → 0016 in order, the full production migration-runner test against a disposable database, and mobile TypeScript check. A contract test also rejects any numbered migration gap.
- The PostgreSQL endpoint integration test requires a disposable `TEST_DATABASE_URL` and creates/drops a uniquely named schema. A separate migration-runner integration test creates/drops a uniquely named disposable database to exercise the actual production `--fresh` and `--all` commands.


Teacher subject review is exposed in the teacher app's More → Review Questions screen. It is a content-governance exception only; teachers still cannot create or administer online student assessments, and online assessment data remains separate from physical school reports.


Admin experience: the Admin app's Assessments → Formal Online Exams screen lists school-scoped examinations, creates drafts from approved objective and written-response questions, configures multiple ordered sections, per-question order and marks, optional examination year, and displays the calculated total score. It publishes only after server-side candidate lesson-coverage checks, lists candidate attempts, displays per-question AI confidence/rubric evidence, and permits manual marks for `pending_review` responses. School administrators can browse only approved question-bank content through the exam API; global question-bank ingestion remains restricted to global administrators. Written-response question creation requires a criterion rubric; the mobile draft creator requires an eligible completed-lesson mapping for each question, supports multiple ordered sections and question order, allows per-question mark values, displays the calculated total, captures an optional exam year, and accepts rubric criteria in `id|description|max_marks` lines whose marks must reconcile exactly to the configured question maximum.


Coverage enforcement: the school-admin authoring screen requires an explicit school/class/subject lesson topic for every question. The backend validates that topic belongs to the selected school, class and subject; publication then locks and rechecks active report-roster memberships, valid student accounts and each candidate's completion of every mapped topic immediately before publishing. Questions without a valid lesson mapping cannot be attached to a formal exam.
