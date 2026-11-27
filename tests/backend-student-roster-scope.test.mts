import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { assignedTeacherClasses, resolveStudentRosterScope } from '../backend/src/utils/studentRosterScope.ts';
import type { AuthUser } from '../backend/src/types/index.js';

const financeAdmin: AuthUser = {
  id: 'finance-1',
  username: 'finance',
  role: 'finance_admin',
  school_code: null,
  assigned_class: null,
  assigned_subject_ids: [],
};

test('finance administrator without an explicit school is rejected instead of receiving an unfiltered roster', () => {
  const result = resolveStudentRosterScope(financeAdmin, {});
  assert.deepEqual(result, {
    status: 400,
    error: 'school_code is required when a finance administrator searches student records.',
  });
});

test('finance administrator is restricted to the explicitly selected school', () => {
  assert.deepEqual(
    resolveStudentRosterScope(financeAdmin, { school_code: 'primary' }),
    { schoolCode: 'primary', className: null },
  );
});

test('finance administrator cannot use a blank school value to bypass the required selection', () => {
  const result = resolveStudentRosterScope(financeAdmin, { school_code: '   ' });
  assert.equal('error' in result, true);
  if ('error' in result) assert.equal(result.status, 400);
});

test('operations administrator retains intentional all-school access and optional school filtering', () => {
  const admin: AuthUser = { ...financeAdmin, role: 'admin', username: 'ops-admin' };
  assert.deepEqual(resolveStudentRosterScope(admin, {}), { schoolCode: null, className: null });
  assert.deepEqual(
    resolveStudentRosterScope(admin, { school_code: 'secondary', class_name: 'JSS 1' }),
    { schoolCode: 'secondary', className: 'JSS 1' },
  );
});

test('teacher-supplied school filters cannot widen the teacher current school or assigned class', () => {
  const teacher: AuthUser = {
    ...financeAdmin,
    id: 'teacher-1',
    username: 'teacher',
    role: 'teacher',
    school_code: 'primary',
    assigned_class: 'Primary 4',
  };
  assert.deepEqual(
    resolveStudentRosterScope(teacher, { school_code: 'secondary' }),
    { schoolCode: 'primary', className: 'Primary 4' },
  );
  assert.deepEqual(
    resolveStudentRosterScope(teacher, { school_code: 'secondary', class_name: 'JSS 1' }),
    { status: 403, error: 'You can only browse students in your assigned physical classes.' },
  );
});

test('teachers without an assigned physical class cannot browse arbitrary school classes', () => {
  const teacher: AuthUser = {
    ...financeAdmin,
    id: 'teacher-2',
    username: 'subject-teacher',
    role: 'teacher',
    school_code: 'secondary',
    assigned_class: null,
  };
  const expected = {
    status: 403,
    error: 'Report access requires a teacher account assigned to a physical class. Contact the school administrator.',
  };
  assert.deepEqual(resolveStudentRosterScope(teacher, {}), expected);
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'SS 2' }), expected);
});

test('teacher without a school assignment is denied rather than allowed to query all schools', () => {
  const teacher: AuthUser = {
    ...financeAdmin,
    id: 'teacher-3',
    username: 'unassigned-teacher',
    role: 'teacher',
    school_code: null,
  };
  const result = resolveStudentRosterScope(teacher, { class_name: 'Primary 1' });
  assert.equal('error' in result, true);
  if ('error' in result) assert.equal(result.status, 403);
});

test('class teacher can be assigned and scoped to more than one physical class', () => {
  const teacher: AuthUser = {
    ...financeAdmin,
    id: 'multi-class-teacher',
    username: 'pry4',
    role: 'teacher',
    school_code: 'primary',
    assigned_class: 'Primary 4',
    assigned_class_names: ['Primary 5'],
  };
  assert.deepEqual(assignedTeacherClasses(teacher), ['Primary 4', 'Primary 5']);
  assert.deepEqual(resolveStudentRosterScope(teacher, {}), { schoolCode: 'primary', className: null });
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary 4' }), { schoolCode: 'primary', className: 'Primary 4' });
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary 5' }), { schoolCode: 'primary', className: 'Primary 5' });
  assert.deepEqual(resolveStudentRosterScope(teacher, { class_name: 'Primary 6' }), {
    status: 403,
    error: 'You can only browse students in your assigned physical classes.',
  });
});

test('multi-class roster SQL binds assigned class arrays as a PostgreSQL text array', () => {
  const source = readFileSync(resolve(process.cwd(), 'backend/src/routes/students.ts'), 'utf8');
  assert.ok(source.includes('rrm.class_name=ANY(${params.length}::text[])'));
});
