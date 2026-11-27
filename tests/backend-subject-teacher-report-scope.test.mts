import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const source = readFileSync(resolve(process.cwd(), 'backend/src/routes/scores.ts'), 'utf8');

test('subject teachers can access only active report-roster students in assigned classes', () => {
  assert.match(source, /const allowedClasses = assignedTeacherClasses\(user\)/);
  assert.match(source, /rrm\.class_name=ANY\(\$2::text\[\]\) AND s\.school_code=\$3 AND s\.deleted_at IS NULL/);
  assert.match(source, /isSubjectTeacher && !user\.assigned_subject_ids\?\.length/);
});

test('term and session reports restrict subject teachers to assigned subjects', () => {
  assert.match(source, /\(\$5::int\[\] IS NULL OR sc\.subject_id=ANY\(\$5::int\[\]\)\)/);
  assert.match(source, /\(\$4::int\[\] IS NULL OR sc\.subject_id=ANY\(\$4::int\[\]\)\)/);
});

test('subject-teacher reports do not disclose attendance or class-record remarks', () => {
  assert.match(source, /const isSubjectTeacher = user\.role === 'teacher' && !user\.assigned_class/);
  assert.match(source, /isSubjectTeacher \? \{ rows: \[\] as Array<\{ days_present: number \| null \}> \}/);
  assert.match(source, /user\.role === 'teacher' && !user\.assigned_class \? \{ rows: \[\] as Array<\{ days_present: number \| null \}> \}/);
});
