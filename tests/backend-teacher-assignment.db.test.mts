import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import express from 'express';
import test, { after, before } from 'node:test';
import adminRouter from '../backend/src/routes/admin.js';
import { pool, query } from '../backend/src/db/pool.js';
import { signAccess } from '../backend/src/utils/jwt.js';

const unique = () => randomInt(100_000_000, 999_999_999).toString();
let server: ReturnType<ReturnType<typeof express>['listen']>;
let baseUrl = '';
let adminId = '';
let adminToken = '';
const adminUsername = `bsec5-admin-${unique()}`;

before(async () => {
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,is_active)
     VALUES($1,'test-hash','admin','BSEC-005 Test Administrator',TRUE)
     RETURNING id`,
    [adminUsername],
  );
  adminId = rows[0].id;
  adminToken = signAccess({
    id: adminId,
    username: adminUsername,
    role: 'admin',
    school_code: null,
    assigned_class: null,
    assigned_subject_ids: [],
  });

  const app = express();
  app.use(express.json());
  app.use('/admin', adminRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(error);
    return res.status(500).json({ error: 'Internal server error' });
  });
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  if (adminId) await query('DELETE FROM users WHERE id=$1', [adminId]);
  await pool.end();
});

async function postUser(body: Record<string, unknown>) {
  return fetch(`${baseUrl}/admin/users`, {
    method: 'POST',
    headers: { authorization: `Bearer ${adminToken}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function putUser(userId: string, body: Record<string, unknown>) {
  return fetch(`${baseUrl}/admin/users/${userId}`, {
    method: 'PUT',
    headers: { authorization: `Bearer ${adminToken}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function createSubject(name: string, schoolCode: string): Promise<number> {
  const { rows } = await query(
    'INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id',
    [schoolCode, name],
  );
  return rows[0].id;
}

async function installSubjectInsertFailure(subjectId: number): Promise<void> {
  await query(`
    CREATE OR REPLACE FUNCTION bsec5_fail_subject_insert()
    RETURNS trigger LANGUAGE plpgsql AS $fn$
    BEGIN
      IF NEW.subject_id = ${subjectId} THEN
        RAISE EXCEPTION 'forced BSEC-005 transaction rollback test';
      END IF;
      RETURN NEW;
    END;
    $fn$
  `);
  await query(`
    CREATE TRIGGER bsec5_fail_subject_insert
    BEFORE INSERT ON teacher_subjects
    FOR EACH ROW EXECUTE FUNCTION bsec5_fail_subject_insert()
  `);
}

async function removeSubjectInsertFailure(): Promise<void> {
  await query('DROP TRIGGER IF EXISTS bsec5_fail_subject_insert ON teacher_subjects');
  await query('DROP FUNCTION IF EXISTS bsec5_fail_subject_insert()');
}

test('teacher creation rejects a subject from another school before creating the account', async () => {
  const suffix = unique();
  const username = `bsec5-cross-school-${suffix}`;
  const foreignSubjectId = await createSubject(`BSEC5 Foreign ${suffix}`, 'secondary');

  try {
    const response = await postUser({
      username,
      full_name: 'Cross School Teacher',
      role: 'teacher',
      school_code: 'primary',
      assigned_subject_ids: [foreignSubjectId],
      initial_password: 'Bsec5-Strong-Password!',
    });
    assert.equal(response.status, 400);
    const { rows } = await query('SELECT id FROM users WHERE username=$1', [username]);
    assert.equal(rows.length, 0);
  } finally {
    await query('DELETE FROM subjects WHERE id=$1', [foreignSubjectId]);
  }
});

test('teacher creation rejects a class from another school', async () => {
  const suffix = unique();
  const username = `bsec5-cross-class-${suffix}`;

  try {
    const response = await postUser({
      username,
      full_name: 'Cross School Class Teacher',
      role: 'teacher',
      school_code: 'primary',
      assigned_class: 'JSS 1',
      assigned_subject_ids: [],
      initial_password: 'Bsec5-Strong-Password!',
    });
    assert.equal(response.status, 400);
    const { rows } = await query('SELECT id FROM users WHERE username=$1', [username]);
    assert.equal(rows.length, 0);
  } finally {
    await query('DELETE FROM users WHERE username=$1', [username]);
  }
});

test('teacher creation rolls back the user if subject insertion fails after the user insert', async () => {
  const suffix = unique();
  const username = `bsec5-create-rollback-${suffix}`;
  const subjectId = await createSubject(`BSEC5 Trigger ${suffix}`, 'primary');

  try {
    await installSubjectInsertFailure(subjectId);
    const response = await postUser({
      username,
      full_name: 'Atomic Teacher Creation',
      role: 'teacher',
      school_code: 'primary',
      assigned_subject_ids: [subjectId],
      initial_password: 'Bsec5-Strong-Password!',
    });
    assert.equal(response.status, 500);

    const { rows } = await query('SELECT id FROM users WHERE username=$1', [username]);
    assert.equal(rows.length, 0, 'the user insert must roll back with the failed subject insert');
  } finally {
    await removeSubjectInsertFailure();
    await query('DELETE FROM users WHERE username=$1', [username]);
    await query('DELETE FROM subjects WHERE id=$1', [subjectId]);
  }
});

test('teacher update rolls back profile and assignment changes when a subject insert fails', async () => {
  const suffix = unique();
  const username = `bsec5-update-rollback-${suffix}`;
  const originalSubjectId = await createSubject(`BSEC5 Original ${suffix}`, 'primary');
  const failingSubjectId = await createSubject(`BSEC5 Failing ${suffix}`, 'primary');
  let teacherId = '';

  try {
    const { rows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active)
       VALUES($1,'test-hash','teacher','Original Teacher','primary','Primary 1',TRUE)
       RETURNING id`,
      [username],
    );
    teacherId = rows[0].id;
    await query(
      'INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,$2)',
      [teacherId, originalSubjectId],
    );

    await installSubjectInsertFailure(failingSubjectId);
    const response = await putUser(teacherId, {
      full_name: 'Updated Teacher Name',
      assigned_subject_ids: [failingSubjectId],
    });
    assert.equal(response.status, 500);

    const { rows: users } = await query(
      'SELECT full_name,role,school_code FROM users WHERE id=$1',
      [teacherId],
    );
    assert.equal(users[0].full_name, 'Original Teacher');
    assert.equal(users[0].role, 'teacher');
    assert.equal(users[0].school_code, 'primary');

    const { rows: assignments } = await query(
      'SELECT subject_id FROM teacher_subjects WHERE user_id=$1',
      [teacherId],
    );
    assert.deepEqual(assignments.map((row: any) => Number(row.subject_id)), [originalSubjectId]);
  } finally {
    await removeSubjectInsertFailure();
    if (teacherId) await query('DELETE FROM users WHERE id=$1', [teacherId]);
    await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [[originalSubjectId, failingSubjectId]]);
  }
});
