import test from 'node:test';
import assert from 'node:assert/strict';
import { requirePerm } from '../backend/src/middleware/auth.js';
import { canMessage } from '../backend/src/utils/rbac.js';
import { getMessageableUsers } from '../backend/src/utils/scope.js';

function runPermission(role: string, permission: string) {
  const req = { user: { role } } as any;
  const res: any = {
    statusCode: 200,
    body: null,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
  let nextCalled = false;
  requirePerm(permission)(req, res, (() => { nextCalled = true; }) as any);
  return { statusCode: res.statusCode, body: res.body, nextCalled };
}

test('finance_admin cannot access message inbox, conversations or contacts', () => {
  for (const endpoint of ['messages.read']) {
    const result = runPermission('finance_admin', endpoint);
    assert.equal(result.statusCode, 403);
    assert.equal(result.nextCalled, false);
    assert.deepEqual(result.body, { error: `Permission denied: ${endpoint}` });
  }
  assert.equal(canMessage('teacher', 'teacher-id', 'student-id'), false);
  const contacts = await getMessageableUsers({ id: 'teacher-id', role: 'teacher', school_code: 'primary' } as any);
  assert.deepEqual(contacts, []);
});

test('roles with messages.read continue through the message read guard', () => {
  for (const role of ['student', 'parent', 'admin']) {
    const result = runPermission(role, 'messages.read');
    assert.equal(result.statusCode, 200);
    assert.equal(result.nextCalled, true);
  }
});

test('report-only teachers cannot access messaging', async () => {
  for (const endpoint of ['messages.read', 'messages.write']) {
    const result = runPermission('teacher', endpoint);
    assert.equal(result.statusCode, 403);
    assert.equal(result.nextCalled, false);
    assert.deepEqual(result.body, { error: `Permission denied: ${endpoint}` });
  }
});
