import test from 'node:test';
import assert from 'node:assert/strict';
import { denyTeacherAccess, denyTeacherWrites } from '../backend/src/middleware/auth.js';

function invoke(
  middleware: typeof denyTeacherAccess,
  role: string,
  method = 'GET',
) {
  let nextCalled = false;
  let statusCode = 200;
  let body: unknown;
  const req = { user: { role }, method };
  const res = {
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(payload: unknown) {
      body = payload;
      return this;
    },
  };
  middleware(req as never, res as never, (() => { nextCalled = true; }) as never);
  return { nextCalled, statusCode, body };
}

test('teacher write guard blocks every mutating HTTP method', () => {
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const result = invoke(denyTeacherWrites, 'teacher', method);
    assert.equal(result.nextCalled, false, method);
    assert.equal(result.statusCode, 403, method);
    assert.match(String((result.body as { error: string }).error), /report-only/i);
  }
});

test('teacher write guard preserves read-only report requests', () => {
  for (const method of ['GET', 'HEAD', 'OPTIONS']) {
    const result = invoke(denyTeacherWrites, 'teacher', method);
    assert.equal(result.nextCalled, true, method);
    assert.equal(result.statusCode, 200, method);
  }
});

test('teacher write guard does not restrict administrators', () => {
  const result = invoke(denyTeacherWrites, 'admin', 'POST');
  assert.equal(result.nextCalled, true);
  assert.equal(result.statusCode, 200);
});

test('teacher access guard blocks all non-report router methods', () => {
  for (const method of ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
    const result = invoke(denyTeacherAccess, 'teacher', method);
    assert.equal(result.nextCalled, false, method);
    assert.equal(result.statusCode, 403, method);
  }
});

test('teacher access guard preserves student, parent and admin access', () => {
  for (const role of ['student', 'parent', 'admin']) {
    const result = invoke(denyTeacherAccess, role, 'GET');
    assert.equal(result.nextCalled, true, role);
    assert.equal(result.statusCode, 200, role);
  }
});
