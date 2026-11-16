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
    assert.ok((await parentLogins.json() as { users: Array<{ school_code: string }> }).users
      .every(user => user.school_code === 'primary'));

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


test('school-bound administrators cannot access operational records outside their school', async () => {
  const suffix = randomUUID().slice(0, 8);
  const globalAdmin = await createUser('global-ops-admin', 'admin', null, 'test-hash');
  const primaryAdmin = await createUser('primary-ops-admin', 'admin', 'primary', 'test-hash');
  const studentIds: string[] = [];
  const classIds: number[] = [];
  const auditIds: number[] = [];
  let server: Server | undefined;
  const className = `BSEC29-${suffix}`;

  try {
    for (const schoolCode of ['primary', 'secondary']) {
      const classRow = await query(
        'INSERT INTO classes(school_code,name) VALUES($1,$2) RETURNING id',
        [schoolCode, className],
      );
      classIds.push(Number(classRow.rows[0].id));
      const studentRow = await query(
        `INSERT INTO students(school_code,admission_number,full_name,class_name)
         VALUES($1,$2,$3,$4) RETURNING id`,
        [schoolCode, `BSEC29-${suffix}-${schoolCode}`, `BSEC29 ${schoolCode}`, className],
      );
      studentIds.push(String(studentRow.rows[0].id));
      const actorId = schoolCode === 'primary' ? primaryAdmin.id : globalAdmin.id;
      const auditRow = await query(
        `INSERT INTO audit_log(actor_id,actor_name,action,entity,entity_id,school_code,detail)
         VALUES($1,$2,'BSEC29_TEST','security_test',$3,$4,$5) RETURNING id`,
        [actorId, `BSEC29 ${schoolCode}`, suffix, schoolCode, `BSEC29 ${schoolCode} audit`],
      );
      auditIds.push(Number(auditRow.rows[0].id));
    }
    const [primaryStudentId, secondaryStudentId] = studentIds;

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

    const deniedClassCode = await post(primaryAdmin.token, '/class-codes', {
      school_code: 'secondary', class_name: className,
    });
    assert.equal(deniedClassCode.status, 403);
    const ownClassCode = await post(primaryAdmin.token, '/class-codes', { class_name: className });
    assert.equal(ownClassCode.status, 201);
    assert.equal((await ownClassCode.json() as { class_code: { school_code: string } }).class_code.school_code, 'primary');
    const globalSecondaryClassCode = await post(globalAdmin.token, '/class-codes', {
      school_code: 'secondary', class_name: className,
    });
    assert.equal(globalSecondaryClassCode.status, 201);

    const classCodes = await get(primaryAdmin.token, '/class-codes');
    assert.equal(classCodes.status, 200);
    assert.ok((await classCodes.json() as { class_codes: Array<{ school_code: string }> }).class_codes
      .every(row => row.school_code === 'primary'));
    assert.equal((await get(primaryAdmin.token, '/class-codes?school_code=secondary')).status, 403);
    const globalClassCodes = await get(globalAdmin.token, '/class-codes');
    assert.equal(globalClassCodes.status, 200);
    const globalCodes = (await globalClassCodes.json() as { class_codes: Array<{ school_code: string; class_name: string }> }).class_codes;
    assert.ok(globalCodes.some(row => row.school_code === 'primary' && row.class_name === className));
    assert.ok(globalCodes.some(row => row.school_code === 'secondary' && row.class_name === className));

    assert.equal((await post(primaryAdmin.token, '/term-pins', {
      student_id: secondaryStudentId, term_label: 'First Term',
    })).status, 404);
    assert.equal((await post(primaryAdmin.token, '/term-pins', {
      student_id: primaryStudentId, term_label: 'First Term',
    })).status, 201);
    assert.equal((await post(globalAdmin.token, '/term-pins', {
      student_id: secondaryStudentId, term_label: 'First Term',
    })).status, 201);

    const termPins = await get(primaryAdmin.token, '/term-pins');
    assert.equal(termPins.status, 200);
    assert.ok((await termPins.json() as { term_pins: Array<{ school_code?: string; student_id: string }> }).term_pins
      .every(row => row.student_id === primaryStudentId));
    assert.equal((await get(primaryAdmin.token, '/term-pins?school_code=secondary')).status, 403);
    const globalPins = await get(globalAdmin.token, '/term-pins');
    assert.equal(globalPins.status, 200);
    const allPins = (await globalPins.json() as { term_pins: Array<{ student_id: string }> }).term_pins;
    assert.ok(allPins.some(row => row.student_id === primaryStudentId));
    assert.ok(allPins.some(row => row.student_id === secondaryStudentId));

    const auditLog = await get(primaryAdmin.token, '/audit-log');
    assert.equal(auditLog.status, 200);
    const primaryAudit = (await auditLog.json() as { audit_log: Array<{ detail: string }> }).audit_log;
    assert.ok(primaryAudit.some(row => row.detail === `BSEC29 primary audit`));
    assert.ok(!primaryAudit.some(row => row.detail === `BSEC29 secondary audit`));
    assert.equal((await get(primaryAdmin.token, '/audit-log?school_code=secondary')).status, 403);
    const globalAudit = await get(globalAdmin.token, '/audit-log');
    assert.ok((await globalAudit.json() as { audit_log: Array<{ detail: string }> }).audit_log
      .some(row => row.detail === `BSEC29 secondary audit`));

    assert.equal((await get(primaryAdmin.token, '/export/excel?school_code=secondary')).status, 403);
    assert.equal((await get(primaryAdmin.token, '/backups/status')).status, 403);
    assert.equal((await post(primaryAdmin.token, '/backups/run', {})).status, 403);
    assert.equal((await post(primaryAdmin.token, '/log-email', {})).status, 403);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentIds.length) {
      await query('DELETE FROM term_access_pins WHERE student_id=ANY($1::uuid[])', [studentIds]);
      await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]);
    }
    if (classIds.length) await query('DELETE FROM class_access_codes WHERE school_code IN (\'primary\',\'secondary\') AND class_name=$1', [className]);
    if (auditIds.length) await query('DELETE FROM audit_log WHERE id=ANY($1::bigint[])', [auditIds]);
    if (classIds.length) await query('DELETE FROM classes WHERE id=ANY($1::int[])', [classIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[globalAdmin.id, primaryAdmin.id]]);
  }
});
