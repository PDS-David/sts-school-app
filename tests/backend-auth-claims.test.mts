import test from 'node:test';
import assert from 'node:assert/strict';
import { hydrateAuthUser } from '../backend/src/utils/authClaims.ts';
import type { AuthUser } from '../backend/src/types/index.js';

const staleAdminToken: AuthUser = {
  id: 'user-1',
  username: 'former-admin',
  role: 'admin',
  school_code: null,
  assigned_class: null,
  assigned_subject_ids: [11, 12],
};

test('a demoted administrator immediately loses administrator authorization claims', () => {
  const current = hydrateAuthUser(staleAdminToken, {
    username: 'former-admin',
    role: 'teacher',
    school_code: 'primary',
    assigned_class: 'Grade 4',
    assigned_subject_ids: [21],
  });

  assert.equal(current.id, staleAdminToken.id);
  assert.equal(current.role, 'teacher');
  assert.equal(current.school_code, 'primary');
  assert.equal(current.assigned_class, 'Grade 4');
  assert.deepEqual(current.assigned_subject_ids, [21]);
});

test('school and class reassignment replace stale token scope', () => {
  const current = hydrateAuthUser({
    ...staleAdminToken,
    role: 'teacher',
    school_code: 'primary',
    assigned_class: 'Grade 4',
  }, {
    username: 'teacher-1',
    role: 'teacher',
    school_code: 'secondary',
    assigned_class: 'JSS 2',
    assigned_subject_ids: [],
  });

  assert.equal(current.school_code, 'secondary');
  assert.equal(current.assigned_class, 'JSS 2');
});

test('revoked teacher subject assignments cannot survive in a previously issued token', () => {
  const current = hydrateAuthUser({
    ...staleAdminToken,
    role: 'teacher',
    school_code: 'secondary',
    assigned_class: null,
    assigned_subject_ids: [4, 7, 9],
  }, {
    username: 'subject-teacher',
    role: 'teacher',
    school_code: 'secondary',
    assigned_class: null,
    assigned_subject_ids: [7],
  });

  assert.deepEqual(current.assigned_subject_ids, [7]);
});

test('current empty subject assignments replace stale token grants without aliasing arrays', () => {
  const currentAssignments: number[] = [];
  const current = hydrateAuthUser({
    ...staleAdminToken,
    role: 'teacher',
    assigned_subject_ids: [4, 7],
  }, {
    username: 'unassigned-teacher',
    role: 'teacher',
    school_code: 'primary',
    assigned_class: null,
    assigned_subject_ids: currentAssignments,
  });

  assert.deepEqual(current.assigned_subject_ids, []);
  assert.notEqual(current.assigned_subject_ids, currentAssignments);
});
