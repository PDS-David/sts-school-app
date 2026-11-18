import assert from 'node:assert/strict';
import test from 'node:test';
import { hasPerm } from '../backend/src/utils/rbac.js';
import { resolveStudentRosterScope } from '../backend/src/utils/studentRosterScope.js';

test('teacher role can maintain assigned physical-class reports but not online learning or administration', () => {
  for (const permission of [
    'students.read', 'students.write',
    'grades.read', 'grades.write',
    'attendance.read', 'attendance.write',
    'classRecord.read', 'classRecord.write',
  ]) {
    assert.equal(hasPerm('teacher', permission), true, `teacher must have ${permission}`);
  }
  for (const permission of [
    'grades.export',
    'materials.read', 'materials.write',
    'topics.read', 'topics.write',
    'weeklyEfforts.read', 'weeklyEfforts.write', 'weeklyEfforts.feedback',
    'messages.read', 'messages.write',
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
