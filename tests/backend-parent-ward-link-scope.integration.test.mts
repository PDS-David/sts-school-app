import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import studentsRouter from '../backend/src/routes/students.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(
  label: string,
  role: 'admin' | 'teacher' | 'parent' | 'student',
  schoolCode: string | null,
  assignedClass: string | null = null,
  isActive = true,
) {
  const username = `bsec21-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,$6,FALSE) RETURNING id`,
    [username, role, `BSEC21 ${label}`, schoolCode, assignedClass, isActive],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role,
      school_code: schoolCode,
      assigned_class: assignedClass,
      assigned_subject_ids: [],
    }),
  };
}

async function createStudent(label: string, schoolCode: string, className: string, suffix: string) {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number)
     VALUES($1,$2,$3,$4) RETURNING id`,
    [`BSEC21 ${label}`, className, schoolCode, `BSEC21-${label}-${suffix}`],
  );
  return String(rows[0].id);
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/students', studentsRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/students` };
}

test('parent ward links enforce teacher school/class scope and mutate atomically', async () => {
  const suffix = randomUUID().slice(0, 8);
  const admin = await createUser('admin', 'admin', null);
  const classTeacher = await createUser('class-teacher', 'teacher', 'primary', 'Primary 4');
  const otherSchoolTeacher = await createUser('other-school-teacher', 'teacher', 'secondary', 'Primary 4');
  const parent = await createUser('parent', 'parent', null);
  const inactiveParent = await createUser('inactive-parent', 'parent', null, null, false);
  const nonParent = await createUser('student-user', 'student', 'primary');
  const primaryP4 = await createStudent('primary-p4', 'primary', 'Primary 4', suffix);
  const primaryP5 = await createStudent('primary-p5', 'primary', 'Primary 5', suffix);
  const secondaryP4 = await createStudent('secondary-p4', 'secondary', 'Primary 4', suffix);
  const deletedStudent = await createStudent('deleted', 'primary', 'Primary 4', suffix);
  const studentIds = [primaryP4, primaryP5, secondaryP4, deletedStudent];
  let server: Server | undefined;

  try {
    await query('UPDATE students SET deleted_at=now() WHERE id=$1', [deletedStudent]);
    const started = await startServer();
    server = started.server;

    const headers = (token: string) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const link = (studentId: string, parentId: string, token: string) => fetch(
      `${started.baseUrl}/${studentId}/link-parent`,
      { method: 'POST', headers: headers(token), body: JSON.stringify({ parent_id: parentId }) },
    );
    const unlink = (studentId: string, parentId: string, token: string) => fetch(
      `${started.baseUrl}/${studentId}/unlink-parent/${parentId}`,
      { method: 'DELETE', headers: headers(token) },
    );
    const isLinked = async (studentId: string, parentId: string) => {
      const { rows } = await query(
        'SELECT 1 FROM parent_wards WHERE student_id=$1 AND parent_id=$2',
        [studentId, parentId],
      );
      return rows.length > 0;
    };

    const allowed = await link(primaryP4, parent.id, classTeacher.token);
    assert.equal(allowed.status, 403, 'report-only teachers cannot manage parent links');
    assert.equal(await isLinked(primaryP4, parent.id), false);

    const duplicate = await link(primaryP4, parent.id, classTeacher.token);
    assert.equal(duplicate.status, 403, 'teachers cannot access parent-link administration');

    const adminPrimaryLink = await link(primaryP4, parent.id, admin.token);
    assert.equal(adminPrimaryLink.status, 200, 'administrators retain parent-link management');

    const wrongClass = await link(primaryP5, parent.id, classTeacher.token);
    assert.equal(wrongClass.status, 403, 'class teacher cannot link parents to another class');
    assert.equal(await isLinked(primaryP5, parent.id), false);

    const wrongSchool = await link(secondaryP4, parent.id, classTeacher.token);
    assert.equal(wrongSchool.status, 403, 'class teacher cannot link parents across schools');
    assert.equal(await isLinked(secondaryP4, parent.id), false);

    const otherTeacherDenied = await unlink(primaryP4, parent.id, otherSchoolTeacher.token);
    assert.equal(otherTeacherDenied.status, 403, 'teacher from another school cannot unlink the ward relationship');
    assert.equal(await isLinked(primaryP4, parent.id), true);

    const invalidParentRole = await link(primaryP4, nonParent.id, admin.token);
    assert.equal(invalidParentRole.status, 400, 'only active parent accounts may be linked');
    const inactiveParentDenied = await link(primaryP4, inactiveParent.id, admin.token);
    assert.equal(inactiveParentDenied.status, 400, 'inactive parent accounts cannot be linked');

    const invalidIds = await fetch(`${started.baseUrl}/not-a-uuid/link-parent`, {
      method: 'POST', headers: headers(admin.token), body: JSON.stringify({ parent_id: parent.id }),
    });
    assert.equal(invalidIds.status, 400);
    const invalidParentId = await link(primaryP4, 'not-a-uuid', admin.token);
    assert.equal(invalidParentId.status, 400);

    const deletedDenied = await link(deletedStudent, parent.id, admin.token);
    assert.equal(deletedDenied.status, 404, 'even administrators cannot attach wards to soft-deleted students');

    const adminCrossSchoolLink = await link(secondaryP4, parent.id, admin.token);
    assert.equal(adminCrossSchoolLink.status, 200, 'administrator may manage parent links across schools');
    assert.equal(await isLinked(secondaryP4, parent.id), true);

    const teacherUnlink = await unlink(primaryP4, parent.id, classTeacher.token);
    assert.equal(teacherUnlink.status, 403, 'teachers cannot unlink parent relationships');
    assert.equal(await isLinked(primaryP4, parent.id), true);

    const adminUnlink = await unlink(secondaryP4, parent.id, admin.token);
    assert.equal(adminUnlink.status, 200);
    assert.equal(await isLinked(secondaryP4, parent.id), false);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await query('DELETE FROM parent_wards WHERE student_id=ANY($1::uuid[]) OR parent_id=ANY($2::uuid[])',
      [studentIds, [parent.id, inactiveParent.id, nonParent.id]]);
    await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])',
      [[admin.id, classTeacher.id, otherSchoolTeacher.id, parent.id, inactiveParent.id, nonParent.id]]);
  }
});


test('school-bound administrators are confined to their student roster and mutations', async () => {
  const suffix = randomUUID().slice(0, 8);
  const primaryAdmin = await createUser('school-admin', 'admin', 'primary');
  const globalAdmin = await createUser('global-admin', 'admin', null);
  const parent = await createUser('school-parent', 'parent', 'primary');
  const primaryLogin = await createUser('primary-student-login', 'student', 'primary');
  const secondaryLogin = await createUser('secondary-student-login', 'student', 'secondary');
  const primaryActive = await createStudent('primary-active', 'primary', 'Primary 4', suffix);
  const secondaryActive = await createStudent('secondary-active', 'secondary', 'Primary 4', suffix);
  const primaryDeleted = await createStudent('primary-deleted', 'primary', 'Primary 4', suffix);
  const secondaryDeleted = await createStudent('secondary-deleted', 'secondary', 'Primary 4', suffix);
  const primaryLinkTarget = await createStudent('primary-link-target', 'primary', 'Primary 4', suffix);
  const secondaryLinkTarget = await createStudent('secondary-link-target', 'secondary', 'Primary 4', suffix);
  const studentIds = [
    primaryActive, secondaryActive, primaryDeleted, secondaryDeleted,
    primaryLinkTarget, secondaryLinkTarget,
  ];
  const userIds = [
    primaryAdmin.id, globalAdmin.id, parent.id, primaryLogin.id, secondaryLogin.id,
  ];
  let createdStudentId: string | undefined;
  let server: Server | undefined;

  try {
    await query('UPDATE students SET deleted_at=now(), deleted_by=$1 WHERE id=$2', [primaryAdmin.id, primaryDeleted]);
    await query('UPDATE students SET deleted_at=now(), deleted_by=$1 WHERE id=$2', [globalAdmin.id, secondaryDeleted]);

    const started = await startServer();
    server = started.server;
    const headers = (token: string) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const get = (token: string, path: string) => fetch(`${started.baseUrl}${path}`, {
      headers: headers(token),
    });
    const post = (token: string, path: string, body: Record<string, unknown>) => fetch(`${started.baseUrl}${path}`, {
      method: 'POST', headers: headers(token), body: JSON.stringify(body),
    });
    const put = (token: string, path: string, body: Record<string, unknown>) => fetch(`${started.baseUrl}${path}`, {
      method: 'PUT', headers: headers(token), body: JSON.stringify(body),
    });
    const del = (token: string, path: string) => fetch(`${started.baseUrl}${path}`, {
      method: 'DELETE', headers: headers(token),
    });

    const roster = await get(primaryAdmin.token, '/');
    assert.equal(roster.status, 200);
    assert.ok((await roster.json() as { students: Array<{ school_code: string }> }).students
      .every(row => row.school_code === 'primary'));
    assert.equal((await get(primaryAdmin.token, '/?school_code=secondary')).status, 403);

    const globalSecondaryRoster = await get(globalAdmin.token, '/?school_code=secondary');
    assert.equal(globalSecondaryRoster.status, 200);
    assert.ok((await globalSecondaryRoster.json() as { students: Array<{ school_code: string }> }).students
      .every(row => row.school_code === 'secondary'));

    assert.equal((await get(primaryAdmin.token, `/${secondaryActive}`)).status, 404);
    assert.equal((await get(primaryAdmin.token, `/${primaryActive}`)).status, 200);
    assert.equal((await get(primaryAdmin.token, '/deleted?school_code=secondary')).status, 403);

    const deletedRoster = await get(primaryAdmin.token, '/deleted');
    assert.equal(deletedRoster.status, 200);
    assert.ok((await deletedRoster.json() as { students: Array<{ school_code: string }> }).students
      .every(row => row.school_code === 'primary'));

    const globalSecondaryDeleted = await get(globalAdmin.token, '/deleted?school_code=secondary');
    assert.equal(globalSecondaryDeleted.status, 200);
    assert.ok((await globalSecondaryDeleted.json() as { students: Array<{ school_code: string }> }).students
      .every(row => row.school_code === 'secondary'));

    const crossSchoolCreate = await post(primaryAdmin.token, '/', {
      full_name: 'BSEC30 Forbidden Student', class_name: 'Primary 4', school_code: 'secondary',
    });
    assert.equal(crossSchoolCreate.status, 403);

    const ownCreate = await post(primaryAdmin.token, '/', {
      full_name: 'BSEC30 Own School Student', class_name: 'Primary 4', school_code: 'primary',
    });
    assert.equal(ownCreate.status, 201);
    createdStudentId = String((await ownCreate.json() as { student: { id: string } }).student.id);
    studentIds.push(createdStudentId);

    assert.equal((await put(primaryAdmin.token, `/${secondaryActive}`, { full_name: 'Cross School Edit' })).status, 404);
    assert.equal((await put(primaryAdmin.token, `/${primaryActive}`, { full_name: 'Primary Student Updated' })).status, 200);

    assert.equal((await del(primaryAdmin.token, `/${secondaryActive}`)).status, 404);
    assert.equal((await del(primaryAdmin.token, `/${primaryActive}`)).status, 200);
    assert.equal((await post(primaryAdmin.token, `/${secondaryDeleted}/restore`, {})).status, 404);
    assert.equal((await post(primaryAdmin.token, `/${primaryDeleted}/restore`, {})).status, 200);

    assert.equal((await post(primaryAdmin.token, `/${secondaryLinkTarget}/link-parent`, {
      parent_id: parent.id,
    })).status, 404);
    assert.equal((await post(primaryAdmin.token, `/${primaryLinkTarget}/link-parent`, {
      parent_id: parent.id,
    })).status, 200);
    assert.equal((await del(primaryAdmin.token, `/${secondaryLinkTarget}/unlink-parent/${parent.id}`)).status, 404);
    assert.equal((await del(primaryAdmin.token, `/${primaryLinkTarget}/unlink-parent/${parent.id}`)).status, 200);

    assert.equal((await post(primaryAdmin.token, `/${secondaryLinkTarget}/link-user`, {
      user_id: secondaryLogin.id,
    })).status, 404);
    assert.equal((await post(primaryAdmin.token, `/${primaryLinkTarget}/link-user`, {
      user_id: secondaryLogin.id,
    })).status, 400, 'student logins must belong to the same school as their student record');
    assert.equal((await post(primaryAdmin.token, `/${primaryLinkTarget}/link-user`, {
      user_id: primaryLogin.id,
    })).status, 200);
    assert.equal((await del(primaryAdmin.token, `/${secondaryLinkTarget}/unlink-user`)).status, 404);
    assert.equal((await del(primaryAdmin.token, `/${primaryLinkTarget}/unlink-user`)).status, 200);

    const secondaryAdmission = await query('SELECT admission_number FROM students WHERE id=$1', [secondaryActive]);
    const crossSchoolErasure = await post(primaryAdmin.token, `/${secondaryActive}/erasure`, {
      confirmation: secondaryAdmission.rows[0].admission_number,
      reason: 'BSEC30 cross-school authorization regression',
    });
    assert.equal(crossSchoolErasure.status, 403);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await query('DELETE FROM parent_wards WHERE student_id=ANY($1::uuid[]) OR parent_id=ANY($2::uuid[])',
      [studentIds, [parent.id]]);
    if (studentIds.length) await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]);
  }
});
