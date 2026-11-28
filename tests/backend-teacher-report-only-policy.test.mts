import assert from 'node:assert/strict';
import test from 'node:test';
import { hasPerm } from '../backend/src/utils/rbac.js';
import { resolveStudentRosterScope } from '../backend/src/utils/studentRosterScope.js';

test('teacher role can maintain assigned physical-class reports and execute approved student outcomes, but not online learning or administration', () => {
  for (const permission of [
    'students.read', 'students.write',
    'grades.read', 'grades.write',
    'attendance.read', 'attendance.write',
    'classRecord.read', 'classRecord.write',
    'messages.read', 'messages.write',
  ]) {
    assert.equal(hasPerm('teacher', permission), true, `teacher must have ${permission}`);
  }
  for (const permission of [
    'grades.export',
    'materials.read', 'materials.write',
    'topics.read', 'topics.write',
    'weeklyEfforts.read', 'weeklyEfforts.write', 'weeklyEfforts.feedback',
    'questions.write', 'assessments.create',
    'aiResults.read', 'aiGrading.override',
    'terms.write', 'classLocks.write',
  ]) {
    assert.equal(hasPerm('teacher', permission), false, `teacher must not have ${permission}`);
  }
});

test('teacher roster is fixed to the assigned physical class', () => {
  const teacher = {
    id: 'teacher-1',
    username: 'class-teacher',
    role: 'teacher' as const,
    school_code: 'primary',
    assigned_class: 'Primary4',
    assigned_subject_ids: [],
  };
  assert.deepEqual(resolveStudentRosterScope(teacher, {}), {
    schoolCode: 'primary',
    className: 'Primary4',
  });
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary4' }), {
    schoolCode: 'primary',
    className: 'Primary4',
  });
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary5' }), {
    status: 403,
    error: 'You can only browse students in your assigned physical classes.',
  });
});

test('teacher without assigned physical class cannot browse a school-wide roster', () => {
  const teacher = {
    id: 'teacher-2',
    username: 'subject-teacher',
    role: 'teacher' as const,
    school_code: 'primary',
    assigned_class: null,
    assigned_subject_ids: [1],
  };
  const expected = {
    status: 403,
    error: 'Report access requires a teacher account assigned to a physical class. Contact the school administrator.',
  };
  assert.deepEqual(resolveStudentRosterScope(teacher, {}), expected);
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary4' }), expected);
});


test('report ranking uses physical roster placement for legacy score rows and counts the whole class', async () => {
  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const source = readFileSync(resolve(process.cwd(), 'backend/src/routes/scores.ts'), 'utf8');

  assert.equal((source.match(/LEFT JOIN report_roster_memberships rrm2/g) ?? []).length, 3,
    'class average, highest score and subject position must use the physical roster');
  assert.match(source, /COALESCE\(s2\.class_name, rrm2\.class_name, st2\.class_name\)/);
  assert.match(source, /COALESCE\(s3\.class_name, rrm3\.class_name, st3\.class_name\)/);
  assert.match(source, /COUNT\(\*\)::int AS class_size/);
  assert.match(source, /COALESCE\(rrm\.class_name,s\.class_name\) AS class_name/);
  assert.match(source, /ORDER BY COALESCE\(rrm\.class_name,s\.class_name\), s\.full_name, sub\.name/);
});

test('class teacher can browse the combined roster for two assigned classes and select either one', () => {
  const teacher = {
    id: 'teacher-multi',
    username: 'class-teacher-multi',
    role: 'teacher' as const,
    school_code: 'primary',
    assigned_class: 'Primary4',
    assigned_class_names: ['Primary5'],
    assigned_subject_ids: [],
  };
  assert.deepEqual(resolveStudentRosterScope(teacher, {}), { schoolCode: 'primary', className: null });
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary5' }), { schoolCode: 'primary', className: 'Primary5' });
});
