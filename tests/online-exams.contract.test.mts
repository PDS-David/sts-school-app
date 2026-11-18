import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const route = await readFile(new URL('../backend/src/routes/onlineExams.ts', import.meta.url), 'utf8');
const migration = await readFile(new URL('../backend/migrations/0014_formal_online_examinations.sql', import.meta.url), 'utf8');
const mobileList = await readFile(new URL('../mobile/src/screens/OnlineExamsScreen.tsx', import.meta.url), 'utf8');
const mobileAttempt = await readFile(new URL('../mobile/src/screens/OnlineExamAttemptScreen.tsx', import.meta.url), 'utf8');

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
  assert.match(route, /deadline_at/);
  assert.match(route, /LEAST\(now\+/);
  assert.match(route, /online_exam_responses/);
  assert.match(route, /ON CONFLICT\(attempt_id,exam_question_id\) DO UPDATE/);
  assert.match(route, /already_submitted/);
  assert.match(route, /submission_started_at/);
});

test('AI essay marking reuses the existing essay-mark contract', () => {
  assert.match(route, /generateJSON\(prompt,'essay-mark'/);
  assert.match(route, /pending_review/);
});

test('exam schema and APIs remain isolated from physical teacher-report data', () => {
  assert.doesNotMatch(migration, /\b(scores|attendance|report_cards|report_remarks|class_records|report_roster_memberships)\b/i);
  assert.doesNotMatch(route, /\b(scores|attendance|report_cards|report_remarks|class_records|report_roster_memberships)\b/i);
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
  assert.match(mobileList, /\/online-exams\/exams/);
});
