import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const route = await readFile(new URL('../backend/src/routes/onlineExams.ts', import.meta.url), 'utf8');
const migration = await readFile(new URL('../backend/migrations/0014_formal_online_examinations.sql', import.meta.url), 'utf8');
const markingMigration = await readFile(new URL('../backend/migrations/0015_online_exam_marking_confidence.sql', import.meta.url), 'utf8');
const reviewMigration = await readFile(new URL('../backend/migrations/0016_question_bank_subject_reviews.sql', import.meta.url), 'utf8');
const questionBankRoute = await readFile(new URL('../backend/src/routes/questionBank.ts', import.meta.url), 'utf8');
const teacherReviewScreen = await readFile(new URL('../mobile/src/screens/teacher/TeacherQuestionReviewScreen.tsx', import.meta.url), 'utf8');
const teacherMore = await readFile(new URL('../mobile/src/screens/teacher/TeacherMoreScreen.tsx', import.meta.url), 'utf8');
const teacherTabs = await readFile(new URL('../mobile/src/navigation/TeacherTabs.tsx', import.meta.url), 'utf8');
const adminExamScreen = await readFile(new URL('../mobile/src/screens/admin/AdminOnlineExamsScreen.tsx', import.meta.url), 'utf8');
const adminTabs = await readFile(new URL('../mobile/src/navigation/AdminTabs.tsx', import.meta.url), 'utf8');
const adminAssessments = await readFile(new URL('../mobile/src/screens/AssessmentsScreen.tsx', import.meta.url), 'utf8');
const mobileList = await readFile(new URL('../mobile/src/screens/OnlineExamsScreen.tsx', import.meta.url), 'utf8');
const mobileHome = await readFile(new URL('../mobile/src/screens/student/StudentAssessmentsHomeScreen.tsx', import.meta.url), 'utf8');
const mobileAttempt = await readFile(new URL('../mobile/src/screens/OnlineExamAttemptScreen.tsx', import.meta.url), 'utf8');
const mobileResult = await readFile(new URL('../mobile/src/screens/OnlineExamResultScreen.tsx', import.meta.url), 'utf8');


test('numbered database migrations remain contiguous for the production migration runner', async () => {
  const directory = new URL('../backend/migrations/', import.meta.url);
  const files = (await readdir(directory)).filter(name => name.endsWith('.sql')).sort();
  assert.ok(files.length > 0, 'migration directory must not be empty');
  files.forEach((name, index) => {
    assert.match(name, /^\d{4}_[a-z0-9_-]+\.sql$/);
    assert.equal(name.slice(0, 4), String(index + 1).padStart(4, '0'),
      `migration sequence gap at ${name}; expected ${String(index + 1).padStart(4, '0')}`);
  });
});

test('formal online exam APIs enforce candidate ownership and class eligibility', () => {
  assert.match(route, /requireRole\('student'\)/);
  assert.match(route, /online_exam_candidates c ON c\.exam_id=e\.id AND c\.student_id=\$2/);
  assert.match(route, /WHERE a\.id=\$1 AND a\.student_id=\$2/);
  assert.match(route, /WHERE id=\$1 AND student_id=\$2 FOR UPDATE/);
  assert.match(route, /e\.school_code=\$2 AND e\.class_name=\$3/);
});

test('formal exams only use approved rights-cleared question-bank items', () => {
  assert.match(route, /q\.review_status IN \('approved','published'\)/);
  assert.match(route, /q\.rights_status!==q\.source_rights/);
  assert.match(route, /content_origin==='past_question'/);
  assert.match(route, /'licensed','public_domain','original_generated'/);
  assert.match(route, /Unapproved pilot questions cannot be used/);
});

test('server deadlines, autosave, one-attempt constraint and idempotent submission are present', () => {
  assert.match(migration, /UNIQUE\(exam_id,student_id\)/);
  assert.match(migration, /online_exam_question_rights_guard/);
  assert.match(route, /deadline_at/);
  assert.match(route, /LEAST\(now\(\)\+/);
  assert.match(route, /online_exam_responses/);
  assert.match(route, /ON CONFLICT\(attempt_id,exam_question_id\) DO UPDATE/);
  assert.match(route, /already_submitted/);
  assert.match(route, /submission_started_at/);
});

test('AI essay marking reuses the existing essay-mark contract', () => {
  assert.match(route, /generateJSON\(prompt,'essay-mark'/);
  assert.match(route, /pending_review/);
  assert.match(route, /generate-package-drafts/);
  assert.ok(route.includes("router.get('/admin/exams/:examId/attempts'"));
  assert.match(route, /manual_response_marked/);
  assert.match(route, /manual_marked/);
  assert.match(route, /listStudentSs1Lessons/);
  assert.match(route, /listStudentSs23Units/);
  assert.match(route, /student_curriculum_lesson_progress/);
});

test('exam schema and APIs remain isolated from physical teacher-report data', () => {
  assert.doesNotMatch(migration, /\b(scores|attendance|report_cards|report_remarks|class_records|report_roster_memberships)\b/i);
  assert.doesNotMatch(route, /\b(?:INSERT\s+INTO|UPDATE|DELETE\s+FROM|TRUNCATE(?:\s+TABLE)?|ALTER\s+TABLE|DROP\s+TABLE)\s+(?:public\.)?(?:scores|attendance|report_cards|report_remarks|class_records|report_roster_memberships)\b/i);
  assert.match(route, /JOIN report_roster_memberships rrm[^\n]*status='active'/);
  for (const table of ['online_exams','online_exam_sections','online_exam_questions','online_exam_candidates','online_exam_attempts','online_exam_responses','online_exam_audit_events']) {
    assert.match(migration, new RegExp('CREATE TABLE IF NOT EXISTS '+table));
  }
});

test('student flow caches unsent answers and derives the timer from the server deadline', () => {
  assert.match(mobileAttempt, /AsyncStorage/);
  assert.match(mobileAttempt, /NetInfo/);
  assert.match(mobileAttempt, /deadline_at/);
  assert.match(mobileAttempt, /server_time/);
  assert.match(mobileAttempt, /navigation\.replace\('OnlineExams'\)/);
  assert.match(mobileAttempt, /locally retained answers/);
  const submitIndex=mobileAttempt.indexOf("api.post('/online-exams/attempts/'+attemptId+'/submit'");
  const clearIndex=mobileAttempt.indexOf("AsyncStorage.setItem(storageKey,JSON.stringify({}));",submitIndex);
  assert.ok(submitIndex>=0&&clearIndex>submitIndex,'local answers must only be cleared after the server confirms submission');
  assert.match(mobileResult, /online-exam-attempt:/);
  assert.match(mobileResult, /local copy has been retained/);
  assert.match(mobileList, /\/online-exams\/exams/);
});

test('written responses require a complete criterion rubric and confidence-validated AI marks', () => {
  assert.match(route, /validateMarkingRubric\(item\.marking_rubric,itemMarks\)/);
  assert.match(route, /marking_rubric:item\.marking_rubric/);
  assert.match(route, /validateAiRubricMark\(raw,rubric,Number\(q\.marks\)\)/);
  assert.match(route, /marked\.confidence<0\.75/);
  assert.match(route, /marking='pending_review'/);
  assert.match(route, /marking_confidence=\$6/);
  assert.match(route, /marking_details=\$7::jsonb/);
  assert.match(markingMigration, /online_exam_responses_marking_confidence_range/);
  assert.match(markingMigration, /online_exam_responses_marking_details_object/);
});

test('student assessment home exposes the dedicated formal-exam flow and completed-lesson practice route', () => {
  assert.match(mobileHome, /label: 'Adaptive Practice'/);
  assert.match(mobileHome, /screen: 'LearningTab'/);
  assert.match(mobileHome, /label: 'Exams'/);
  assert.match(mobileHome, /screen: 'OnlineExams'/);
});

test('assigned subject teachers can approve or reject reviewed questions with append-only audit records', () => {
  assert.match(questionBankRoute, /router\.get\('\/review-queue', requireAuth, requireRole\('teacher'\)/);
  assert.match(questionBankRoute, /router\.post\('\/questions\/:id\/review', requireAuth, requireRole\('teacher'\)/);
  assert.match(questionBankRoute, /lower\(trim\(assigned\.name\)\)=lower\(trim\(s\.name\)\)/);
  assert.match(questionBankRoute, /question_bank_question_reviews\(question_id,subject_id,reviewer_user_id,decision,notes\)/);
  assert.match(questionBankRoute, /review_status='approved'/);
  assert.match(reviewMigration, /question_bank_question_reviews/);
  assert.match(reviewMigration, /reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now\(\)/);
  assert.doesNotMatch(reviewMigration, /UNIQUE\s*\(question_id,reviewer_user_id\)/i);
});

test('teacher UI exposes question review only through the teacher navigation and records review notes', () => {
  assert.match(teacherReviewScreen, /api\.get\('\/question-bank\/review-queue'/);
  assert.match(teacherReviewScreen, /api\.post\('\/question-bank\/questions\/'\+question\.id\+'\/review'/);
  assert.match(teacherReviewScreen, /note\.length<10/);
  assert.match(teacherMore, /label: 'Review Questions'/);
  assert.match(teacherTabs, /TeacherQuestionReviewScreen/);
});

test('admin app can create, publish, list and manually review formal examinations', () => {
  assert.match(adminExamScreen, /api\.get\('\/online-exams\/admin\/exams'/);
  assert.match(adminExamScreen, /api\.post\('\/online-exams\/admin\/exams'/);
  assert.match(adminExamScreen, /api\.post\('\/online-exams\/admin\/exams\/'\+exam\.id\+'\/publish'/);
  assert.match(adminExamScreen, /api\.get\('\/online-exams\/admin\/exams\/'\+exam\.id\+'\/attempts'/);
  assert.match(adminExamScreen, /api\.put\('\/online-exams\/admin\/attempts\/'\+selectedAttempt\.attempt_id/);
  assert.match(adminTabs, /name="FormalOnlineExams" component=\{AdminOnlineExamsScreen\}/);
  assert.match(adminAssessments, /navigate\('FormalOnlineExams'\)/);
  assert.match(adminExamScreen, /sectionsPayload/);
  assert.match(adminExamScreen, /moveSection/);
  assert.match(adminExamScreen, /moveQuestion/);
  assert.match(adminExamScreen, /marksInputs/);
  assert.match(adminExamScreen, /selectedTotalMarks/);
  assert.match(adminExamScreen, /exam_year:yearValue/);
});

test('school admins browse only approved question-bank items through the exam API', () => {
  assert.match(route, /router\.get\('\/admin\/question-bank\/subjects',requireRole\('admin'\)/);
  assert.match(route, /router\.get\('\/admin\/question-bank\/questions',requireRole\('admin'\)/);
  assert.match(route, /q\.review_status IN \('approved','published'\)/);
  assert.match(adminExamScreen, /api\.get\('\/online-exams\/admin\/question-bank\/subjects'/);
  assert.match(adminExamScreen, /api\.get\('\/online-exams\/admin\/question-bank\/questions'/);
});

test('formal exam authoring requires a valid school lesson topic mapping for every question', () => {
  assert.match(route, /router\.get\('\/admin\/lesson-topics',requireRole\('admin'\)/);
  assert.match(route, /Every formal-exam question must be mapped to a school lesson topic completed by the candidates/);
  assert.match(route, /covered_topic_id:Number\(item\.covered_topic_id\)/);
  assert.match(adminExamScreen, /api\.get\('\/online-exams\/admin\/lesson-topics'/);
  assert.match(adminExamScreen, /covered_topic_id:Number\(topic\.id\)/);
  assert.match(adminExamScreen, /topicByQuestion\[question\.id\]/);
});

test('admin exam creator captures structured rubric criteria for written responses', () => {
  assert.match(adminExamScreen, /function parseRubric/);
  assert.match(adminExamScreen, /item\.marking_rubric=rubric/);
  assert.match(adminExamScreen, /id\|description\|max_marks/);
  assert.match(adminExamScreen, /covered_topic_id:Number\(topic\.id\)/);
});
