import assert from 'node:assert/strict';
import test from 'node:test';
import { hasPerm } from '../backend/src/utils/rbac.js';
import { resolveStudentRosterScope } from '../backend/src/utils/studentRosterScope.js';

test('teacher role has only the permission needed to select their assigned report roster', () => {
  assert.equal(hasPerm('teacher', 'students.read'), true);
  for (const permission of [
    'grades.read', 'grades.write', 'grades.export',
    'attendance.read', 'attendance.write',
    'classRecord.read',
    'classRecord.write',
    'materials.read', 'materials.write',
    'topics.read', 'topics.write',
    'weeklyEfforts.read', 'weeklyEfforts.write', 'weeklyEfforts.feedback',
    'messages.read', 'messages.write',
    'questions.write', 'assessments.create',
    'aiResults.read', 'aiGrading.override',
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
    error: 'You can only browse students in your assigned physical class.',
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
