import assert from 'node:assert/strict';
import test from 'node:test';
import { hasPerm } from '../backend/src/utils/rbac.js';
import { resolveStudentRosterScope } from '../backend/src/utils/studentRosterScope.js';

test('teacher permissions are limited to reading assigned-class report data and writing class-teacher remarks', () => {
  assert.equal(hasPerm('teacher', 'students.read'), true);
  assert.equal(hasPerm('teacher', 'grades.read'), true);
  assert.equal(hasPerm('teacher', 'attendance.read'), true);
  assert.equal(hasPerm('teacher', 'classRecord.read'), true);
  assert.equal(hasPerm('teacher', 'classRecord.write'), true);

  for (const permission of [
    'grades.write',
    'grades.export',
    'attendance.write',
    'materials.read',
    'materials.write',
    'topics.read',
    'topics.write',
    'weeklyEfforts.read',
    'weeklyEfforts.write',
    'weeklyEfforts.feedback',
    'messages.read',
    'messages.write',
    'aiResults.read',
    'aiGrading.override',
    'questions.write',
    'assessments.create',
  ]) {
    assert.equal(hasPerm('teacher', permission), false, `teacher must not have ${permission}`);
  }
});

test('teacher roster is fixed to the assigned physical class', () => {
  const user = {
    id: 'teacher-1',
    username: 'class-teacher',
    role: 'teacher' as const,
    school_code: 'primary',
    assigned_class: 'Primary 4',
    assigned_subject_ids: [],
  };

  assert.deepEqual(
    resolveStudentRosterScope(user, {}),
    { schoolCode: 'primary', className: 'Primary 4' },
  );
  assert.deepEqual(
    resolveStudentRosterScope(user, { class_name: 'Primary 4' }),
    { schoolCode: 'primary', className: 'Primary 4' },
  );
  assert.deepEqual(
    resolveStudentRosterScope(user, { class_name: 'Primary 5' }),
    { status: 403, error: 'You can only browse students in your assigned physical class.' },
  );
});

test('teacher without an assigned physical class cannot browse a school-wide or arbitrary class roster', () => {
  const user = {
    id: 'teacher-2',
    username: 'subject-teacher',
    role: 'teacher' as const,
    school_code: 'primary',
    assigned_class: null,
    assigned_subject_ids: [1],
  };

  assert.deepEqual(
    resolveStudentRosterScope(user, {}),
    {
      status: 403,
      error: 'Report access requires a teacher account assigned to a physical class. Contact the school administrator.',
    },
  );
  assert.deepEqual(
    resolveStudentRosterScope(user, { class_name: 'Primary 4' }),
    {
      status: 403,
      error: 'Report access requires a teacher account assigned to a physical class. Contact the school administrator.',
    },
  );
});
