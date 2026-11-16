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
    assert.equal(allowed.status, 200, 'class teacher may link a parent for a student in their assigned class');
    assert.deepEqual(await allowed.json(), { ok: true, linked: true });
    assert.equal(await isLinked(primaryP4, parent.id), true);

    const duplicate = await link(primaryP4, parent.id, classTeacher.token);
    assert.equal(duplicate.status, 200, 'linking an existing ward relationship is idempotent');
    assert.deepEqual(await duplicate.json(), { ok: true, linked: false });

    const wrongClass = await link(primaryP5, parent.id, classTeacher.token);
    assert.equal(wrongClass.status, 403, 'class teacher cannot link parents to another class');
    assert.equal(await isLinked(primaryP5, parent.id), false);

    const wrongSchool = await link(secondaryP4, parent.id, classTeacher.token);
    assert.equal(wrongSchool.status, 403, 'class teacher cannot link parents across schools');
    assert.equal(await isLinked(secondaryP4, parent.id), false);

    const otherTeacherDenied = await unlink(primaryP4, parent.id, otherSchoolTeacher.token);
    assert.equal(otherTeacherDenied.status, 403, 'teacher from another school cannot unlink the ward relationship');
    assert.equal(await isLinked(primaryP4, parent.id), true);

    const invalidParentRole = await link(primaryP4, nonParent.id, classTeacher.token);
    assert.equal(invalidParentRole.status, 400, 'only active parent accounts may be linked');
    const inactiveParentDenied = await link(primaryP4, inactiveParent.id, classTeacher.token);
    assert.equal(inactiveParentDenied.status, 400, 'inactive parent accounts cannot be linked');

    const invalidIds = await fetch(`${started.baseUrl}/not-a-uuid/link-parent`, {
      method: 'POST', headers: headers(classTeacher.token), body: JSON.stringify({ parent_id: parent.id }),
    });
    assert.equal(invalidIds.status, 400);
    const invalidParentId = await link(primaryP4, 'not-a-uuid', classTeacher.token);
    assert.equal(invalidParentId.status, 400);

    const deletedDenied = await link(deletedStudent, parent.id, admin.token);
    assert.equal(deletedDenied.status, 404, 'even administrators cannot attach wards to soft-deleted students');

    const adminCrossSchoolLink = await link(secondaryP4, parent.id, admin.token);
    assert.equal(adminCrossSchoolLink.status, 200, 'administrator may manage parent links across schools');
    assert.equal(await isLinked(secondaryP4, parent.id), true);

    const teacherUnlink = await unlink(primaryP4, parent.id, classTeacher.token);
    assert.equal(teacherUnlink.status, 200);
    assert.deepEqual(await teacherUnlink.json(), { ok: true, unlinked: true });
    assert.equal(await isLinked(primaryP4, parent.id), false);

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
