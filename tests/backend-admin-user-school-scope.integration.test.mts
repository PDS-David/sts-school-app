import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import adminRouter from '../backend/src/routes/admin.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(label: string, role: 'admin' | 'student' | 'parent', schoolCode: string | null, passwordHash: string | null = null) {
  const username = `bsec28-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,$2,$3,$4,$5,TRUE,FALSE) RETURNING id`,
    [username, passwordHash, role, `BSEC28 ${label}`, schoolCode],
  );
  const id = String(rows[0].id);
  return {
    id,
    username,
    token: signAccess({
      id,
      username,
      role,
      school_code: schoolCode,
      assigned_class: null,
      assigned_subject_ids: [],
    }),
  };
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/admin', adminRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/admin` };
}

test('school-bound administrators cannot manage accounts outside their school', async () => {
  const globalAdmin = await createUser('global-admin', 'admin', null, 'test-hash');
  const primaryAdmin = await createUser('primary-admin', 'admin', 'primary', 'test-hash');
  const primaryStudent = await createUser('primary-student', 'student', 'primary');
  const secondaryStudent = await createUser('secondary-student', 'student', 'secondary');
  const primaryParent = await createUser('primary-parent', 'parent', 'primary');
  const secondaryParent = await createUser('secondary-parent', 'parent', 'secondary');
  const primaryDeleteTarget = await createUser('primary-delete', 'student', 'primary');
  const secondaryDeleteTarget = await createUser('secondary-delete', 'student', 'secondary');
  const studentIds: string[] = [];
  const userIds = [
    globalAdmin.id, primaryAdmin.id, primaryStudent.id, secondaryStudent.id,
    primaryParent.id, secondaryParent.id, primaryDeleteTarget.id, secondaryDeleteTarget.id,
  ];
  let createdUserId: string | undefined;
  let server: Server | undefined;

  try {
    for (const [schoolCode, suffix] of [['primary', 'P'], ['secondary', 'S']] as const) {
      const { rows } = await query(
        `INSERT INTO students(school_code,admission_number,full_name,class_name)
         VALUES($1,$2,$3,'Primary 4') RETURNING id`,
        [schoolCode, `BSEC28-${suffix}-${randomUUID()}`, `BSEC28 ${schoolCode} student`],
      );
      studentIds.push(String(rows[0].id));
    }

    const started = await startServer();
    server = started.server;
    const get = (token: string, path: string) => fetch(`${started.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const post = (token: string, path: string, body: Record<string, unknown>) => fetch(`${started.baseUrl}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const put = (token: string, path: string, body: Record<string, unknown>) => fetch(`${started.baseUrl}${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const del = (token: string, path: string) => fetch(`${started.baseUrl}${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const users = await get(primaryAdmin.token, '/users');
    assert.equal(users.status, 200);
    const primaryUsers = (await users.json() as { users: Array<{ school_code: string }> }).users;
    assert.ok(primaryUsers.length > 0);
    assert.ok(primaryUsers.every(user => user.school_code === 'primary'));

    assert.equal((await get(primaryAdmin.token, '/users?school_code=secondary')).status, 403);
    assert.equal((await get(primaryAdmin.token, '/students-without-login?school_code=secondary')).status, 403);
    assert.equal((await get(primaryAdmin.token, '/student-logins-without-link?school_code=secondary')).status, 403);
    assert.equal((await get(primaryAdmin.token, '/parent-logins?school_code=secondary')).status, 403);

    const unlinkedStudents = await get(primaryAdmin.token, '/students-without-login');
    assert.equal(unlinkedStudents.status, 200);
    assert.ok((await unlinkedStudents.json() as { students: Array<{ school_code: string }> }).students
      .every(student => student.school_code === 'primary'));

    const unlinkedStudentLogins = await get(primaryAdmin.token, '/student-logins-without-link');
    assert.equal(unlinkedStudentLogins.status, 200);
    assert.ok((await unlinkedStudentLogins.json() as { users: Array<{ school_code: string }> }).users
      .every(user => user.school_code === 'primary'));

    const parentLogins = await get(primaryAdmin.token, '/parent-logins');
    assert.equal(parentLogins.status, 200);
    const scopedParents = (await parentLogins.json() as { users: Array<{ username: string }> }).users;
    assert.ok(scopedParents.some(user => user.username === primaryParent.username));
    assert.ok(!scopedParents.some(user => user.username === secondaryParent.username));

    const globalUsers = await get(globalAdmin.token, '/users');
    assert.equal(globalUsers.status, 200);
    const globalRows = (await globalUsers.json() as { users: Array<{ school_code: string | null }> }).users;
    assert.ok(globalRows.some(user => user.school_code === 'primary'));
    assert.ok(globalRows.some(user => user.school_code === 'secondary'));

    const crossSchoolCreate = await post(primaryAdmin.token, '/users', {
      username: `bsec28-cross-${randomUUID()}`, full_name: 'Cross School Student',
      role: 'student', school_code: 'secondary',
    });
    assert.equal(crossSchoolCreate.status, 403);

    const globalRoleCreate = await post(primaryAdmin.token, '/users', {
      username: `bsec28-finance-${randomUUID()}`, full_name: 'Forbidden Finance Admin',
      role: 'finance_admin', school_code: 'primary',
    });
    assert.equal(globalRoleCreate.status, 403, 'school-bound admins cannot create global finance administrators');

    const ownCreate = await post(primaryAdmin.token, '/users', {
      username: `bsec28-own-${randomUUID()}`, full_name: 'Own School Student', role: 'student',
    });
    assert.equal(ownCreate.status, 201);
    const created = (await ownCreate.json() as { user: { id: string; school_code: string } }).user;
    createdUserId = created.id;
    userIds.push(created.id);
    assert.equal(created.school_code, 'primary', 'omitted school_code is pinned to the admin school');

    assert.equal((await post(primaryAdmin.token, `/users/${secondaryStudent.id}/reissue-activation-code`, {})).status, 404);
    assert.equal((await post(primaryAdmin.token, `/users/${primaryStudent.id}/reissue-activation-code`, {})).status, 200);

    assert.equal((await put(primaryAdmin.token, `/users/${secondaryStudent.id}`, { full_name: 'Changed' })).status, 404);
    assert.equal((await put(primaryAdmin.token, `/users/${primaryStudent.id}`, { school_code: 'secondary' })).status, 403);
    assert.equal((await put(primaryAdmin.token, `/users/${primaryStudent.id}`, { role: 'finance_admin' })).status, 403);
    assert.equal((await put(primaryAdmin.token, `/users/${primaryStudent.id}`, { full_name: 'Updated Primary Student' })).status, 200);

    assert.equal((await post(primaryAdmin.token, `/users/${secondaryStudent.id}/reset-password`, {})).status, 404);
    assert.equal((await post(primaryAdmin.token, `/users/${primaryStudent.id}/reset-password`, {})).status, 200);

    assert.equal((await post(primaryAdmin.token, `/users/${secondaryStudent.id}/approve`, {})).status, 404);
    assert.equal((await post(primaryAdmin.token, `/users/${primaryStudent.id}/approve`, {})).status, 200);

    assert.equal((await del(primaryAdmin.token, `/users/${secondaryDeleteTarget.id}`)).status, 404);
    assert.equal((await del(primaryAdmin.token, `/users/${primaryDeleteTarget.id}`)).status, 200);
    userIds.splice(userIds.indexOf(primaryDeleteTarget.id), 1);

    const stillExists = await query('SELECT id FROM users WHERE id=$1', [secondaryDeleteTarget.id]);
    assert.equal(stillExists.rows.length, 1);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentIds.length) await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]);
    if (userIds.length) await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]);
    if (createdUserId) await query('DELETE FROM users WHERE id=$1', [createdUserId]);
  }
});
