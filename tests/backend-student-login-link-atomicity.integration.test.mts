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

async function createUser(label: string, role: 'admin' | 'student' | 'parent', isActive = true) {
  const username = `bsec23-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,NULL,$4,FALSE) RETURNING id`,
    [username, role, `BSEC23 ${label}`, isActive],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role,
      school_code: null,
      assigned_class: null,
      assigned_subject_ids: [],
    }),
  };
}

async function createStudent(label: string, suffix: string) {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number)
     VALUES($1,'Primary 4','primary',$2) RETURNING id`,
    [`BSEC23 ${label}`, `BSEC23-${label}-${suffix}`],
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

test('student login linking is one-to-one, atomic, and idempotent', async () => {
  const suffix = randomUUID().slice(0, 8);
  const admin = await createUser('admin', 'admin');
  const userA = await createUser('student-a', 'student');
  const userB = await createUser('student-b', 'student');
  const userC = await createUser('student-c', 'student');
  const userD = await createUser('student-d', 'student');
  const inactiveStudent = await createUser('inactive-student', 'student', false);
  const parent = await createUser('parent', 'parent');
  const studentIds = await Promise.all([
    createStudent('target-a', suffix),
    createStudent('target-b', suffix),
    createStudent('race-a', suffix),
    createStudent('race-b', suffix),
    createStudent('race-target', suffix),
    createStudent('deleted', suffix),
  ]);
  const [targetA, targetB, raceA, raceB, raceTarget, deletedStudent] = studentIds;
  let server: Server | undefined;

  try {
    await query('UPDATE students SET deleted_at=now() WHERE id=$1', [deletedStudent]);
    const started = await startServer();
    server = started.server;

    const headers = (token: string) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const link = (studentId: string, userId: string, token = admin.token) => fetch(
      `${started.baseUrl}/${studentId}/link-user`,
      { method: 'POST', headers: headers(token), body: JSON.stringify({ user_id: userId }) },
    );
    const unlink = (studentId: string) => fetch(
      `${started.baseUrl}/${studentId}/unlink-user`,
      { method: 'DELETE', headers: headers(admin.token) },
    );

    const first = await link(targetA, userA.id);
    assert.equal(first.status, 200);
    assert.deepEqual(await first.json(), {
      ok: true,
      student: { id: targetA, user_id: userA.id },
      linked: true,
    });

    const duplicate = await link(targetA, userA.id);
    assert.equal(duplicate.status, 200, 'repeating the same link must be idempotent');
    assert.deepEqual((await duplicate.json() as { linked: boolean }).linked, false);

    const overwrite = await link(targetA, userB.id);
    assert.equal(overwrite.status, 409, 'an existing student login must not be silently replaced');
    const duplicateAccount = await link(targetB, userA.id);
    assert.equal(duplicateAccount.status, 409, 'one student login cannot be attached to two student records');

    const wrongRole = await link(targetB, parent.id);
    assert.equal(wrongRole.status, 400);
    const inactiveAccount = await link(targetB, inactiveStudent.id);
    assert.equal(inactiveAccount.status, 400);

    const invalidStudentId = await link('not-a-uuid', userB.id);
    assert.equal(invalidStudentId.status, 400);
    const invalidUserId = await link(targetB, 'not-a-uuid');
    assert.equal(invalidUserId.status, 400);
    const deletedTarget = await link(deletedStudent, userB.id);
    assert.equal(deletedTarget.status, 404);

    const nonAdmin = await link(targetB, userB.id, userC.token);
    assert.equal(nonAdmin.status, 403, 'student users cannot mutate login relationships');

    const sameUserRace = await Promise.all([
      link(raceA, userC.id),
      link(raceB, userC.id),
    ]);
    assert.deepEqual(sameUserRace.map(response => response.status).sort(), [200, 409],
      'concurrent attempts to attach one login to two students must serialize');
    const { rows: sameUserLinks } = await query(
      'SELECT id FROM students WHERE user_id=$1',
      [userC.id],
    );
    assert.equal(sameUserLinks.length, 1);

    const sameStudentRace = await Promise.all([
      link(raceTarget, userB.id),
      link(raceTarget, userD.id),
    ]);
    assert.deepEqual(sameStudentRace.map(response => response.status).sort(), [200, 409],
      'concurrent attempts to replace a student login must serialize');
    const { rows: targetLink } = await query(
      'SELECT user_id FROM students WHERE id=$1',
      [raceTarget],
    );
    assert.ok([userB.id, userD.id].includes(String(targetLink[0].user_id)));

    const removed = await unlink(targetA);
    assert.equal(removed.status, 200);
    assert.deepEqual(await removed.json(), { ok: true, unlinked: true });
    const repeatedUnlink = await unlink(targetA);
    assert.equal(repeatedUnlink.status, 200);
    assert.deepEqual(await repeatedUnlink.json(), { ok: true, unlinked: false });
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])',
      [[admin.id, userA.id, userB.id, userC.id, userD.id, inactiveStudent.id, parent.id]]);
  }
});
