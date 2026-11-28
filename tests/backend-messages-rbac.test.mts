import test from 'node:test';
import assert from 'node:assert/strict';
import { requirePerm } from '../backend/src/middleware/auth.js';
import { canMessage } from '../backend/src/utils/rbac.js';

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
});

test('roles with messages.read continue through the message read guard', () => {
  for (const role of ['student', 'parent', 'teacher', 'admin']) {
    const result = runPermission(role, 'messages.read');
    assert.equal(result.statusCode, 200);
    assert.equal(result.nextCalled, true);
  }
});

test('teachers receive message permissions and the scoped messaging route is no longer globally blocked', async () => {
  for (const endpoint of ['messages.read', 'messages.write']) {
    const result = runPermission('teacher', endpoint);
    assert.equal(result.statusCode, 200);
    assert.equal(result.nextCalled, true);
  }
  assert.equal(canMessage('teacher', 'teacher-id', 'parent-id', ['parent-id']), true);
  assert.equal(canMessage('teacher', 'teacher-id', 'unrelated-id', ['parent-id']), false);
  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const route = readFileSync(resolve(process.cwd(), 'backend/src/routes/messages.ts'), 'utf8');
  assert.doesNotMatch(route, /denyTeacherAccess/);
  const scope = readFileSync(resolve(process.cwd(), 'backend/src/utils/scope.ts'), 'utf8');
  assert.match(scope, /if \(user\.role === 'teacher'\)/);
  assert.match(scope, /st\.class_name = ANY\(\$3::text\[\]\)/);
});


test('teachers can read school-wide and assigned-class announcements', async () => {
  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');
  const route = readFileSync(resolve(process.cwd(), 'backend/src/routes/announcements.ts'), 'utf8');
  assert.doesNotMatch(route, /Teacher accounts are limited/);
  assert.match(route, /user\.role === 'teacher'/);
  assert.match(route, /assigned_class_names/);
  assert.match(route, /requireRole\('admin'\)/, 'announcement publishing remains admin-only');
});
