// Teacher creation hashes the administrator-issued temporary PIN with the pepper.
process.env.PIN_PEPPER ??= 'test-pepper-0123456789-0123456789-0123456789-abcdef';
import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomInt } from 'node:crypto';
import type { Server } from 'node:http';
import express from 'express';
import test, { after, before } from 'node:test';
import adminRouter from '../backend/src/routes/admin.js';
import { pool, query } from '../backend/src/db/pool.js';
import { signAccess } from '../backend/src/utils/jwt.js';

const unique = () => randomInt(100_000_000, 999_999_999).toString();
let server: Server;
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
      assigned_class_names: ['Primary 1'],
      initial_password: '482913',
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
      initial_password: '482913',
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
      assigned_class_names: ['Primary 1'],
      initial_password: '482913',
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

test('subject-teacher assignments are stored and returned as exact class/subject pairs', async () => {
  const suffix = unique();
  const username = `bsec5-class-subject-${suffix}`;
  const classA = `BSEC5 Subject Class A ${suffix}`;
  const classB = `BSEC5 Subject Class B ${suffix}`;
  const subjectA = await createSubject(`BSEC5 Subject A ${suffix}`, 'primary');
  const subjectB = await createSubject(`BSEC5 Subject B ${suffix}`, 'primary');
  let teacherId = '';
  await query('INSERT INTO classes(school_code,name) VALUES($1,$2),($1,$3)', ['primary', classA, classB]);

  try {
    const created = await postUser({
      username,
      full_name: 'Class Scoped Subject Teacher',
      role: 'teacher',
      school_code: 'primary',
      assigned_class_names: [classA, classB],
      assigned_subject_ids: [subjectA, subjectB],
      assigned_class_subjects: [
        { class_name: classA, subject_id: subjectA },
        { class_name: classB, subject_id: subjectB },
      ],
      initial_password: '482913',
    });
    assert.equal(created.status, 201);
    const createdBody = await created.json() as { user: { id: string } };
    teacherId = createdBody.user.id;

    const readPairs = async () => {
      const { rows } = await query(
        `SELECT c.name AS class_name,tcs.subject_id
         FROM teacher_class_subjects tcs JOIN classes c ON c.id=tcs.class_id
         WHERE tcs.user_id=$1 ORDER BY c.name,tcs.subject_id`,
        [teacherId],
      );
      return rows.map((row: any) => ({ class_name: row.class_name, subject_id: Number(row.subject_id) }));
    };
    assert.deepEqual(await readPairs(), [
      { class_name: classA, subject_id: subjectA },
      { class_name: classB, subject_id: subjectB },
    ]);

    const listed = await fetch(`${baseUrl}/admin/users?role=teacher`, {
      headers: { authorization: `Bearer ${adminToken}` },
    });
    assert.equal(listed.status, 200);
    const listedBody = await listed.json() as { users: Array<{ id: string; assigned_class_subjects: Array<{ class_name: string; subject_id: number }> }> };
    const listedTeacher = listedBody.users.find(user => user.id === teacherId);
    assert.ok(listedTeacher);
    assert.deepEqual(
      listedTeacher!.assigned_class_subjects.map(grant => ({ class_name: grant.class_name, subject_id: Number(grant.subject_id) }))
        .sort((a, b) => a.class_name.localeCompare(b.class_name)),
      [
        { class_name: classA, subject_id: subjectA },
        { class_name: classB, subject_id: subjectB },
      ].sort((a, b) => a.class_name.localeCompare(b.class_name)),
    );

    const updated = await putUser(teacherId, {
      assigned_class_names: [classA, classB],
      assigned_subject_ids: [subjectA, subjectB],
      assigned_class_subjects: [
        { class_name: classA, subject_id: subjectB },
        { class_name: classB, subject_id: subjectA },
      ],
    });
    assert.equal(updated.status, 200);
    assert.deepEqual(await readPairs(), [
      { class_name: classA, subject_id: subjectB },
      { class_name: classB, subject_id: subjectA },
    ]);
  } finally {
    if (teacherId) await query('DELETE FROM users WHERE id=$1', [teacherId]);
    await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [[subjectA, subjectB]]);
    await query('DELETE FROM classes WHERE school_code=$1 AND name=ANY($2::text[])', ['primary', [classA, classB]]);
  }
});

test('one class teacher account can own multiple classes and overlapping class ownership is rejected', async () => {
  const suffix = unique();
  const classA = `BSEC5 Multi A ${suffix}`;
  const classB = `BSEC5 Multi B ${suffix}`;
  const classC = `BSEC5 Multi C ${suffix}`;
  let teacherId = '';
  await query('INSERT INTO classes(school_code,name) VALUES($1,$2),($1,$3),($1,$4)', ['primary', classA, classB, classC]);

  try {
    const created = await postUser({
      full_name: 'Multi Class Teacher',
      role: 'teacher',
      school_code: 'primary',
      assigned_class: classA,
      assigned_class_names: [classB],
      assigned_subject_ids: [],
      initial_password: '482913',
    });
    assert.equal(created.status, 201);
    const createdBody = await created.json() as { user: { id: string } };
    teacherId = createdBody.user.id;

    let { rows } = await query(
      'SELECT assigned_class, assigned_class_names FROM users WHERE id=$1',
      [teacherId],
    );
    assert.equal(rows[0].assigned_class, classA);
    assert.deepEqual(rows[0].assigned_class_names, [classB]);

    const updated = await putUser(teacherId, { assigned_class_names: [classB, classC] });
    assert.equal(updated.status, 200);
    ({ rows } = await query(
      'SELECT assigned_class, assigned_class_names FROM users WHERE id=$1',
      [teacherId],
    ));
    assert.equal(rows[0].assigned_class, classA);
    assert.deepEqual(rows[0].assigned_class_names, [classB, classC]);

    const conflict = await postUser({
      full_name: 'Duplicate Class Teacher',
      role: 'teacher',
      school_code: 'primary',
      assigned_class: classC,
      assigned_class_names: [],
      assigned_subject_ids: [],
      initial_password: '482913',
    });
    assert.equal(conflict.status, 400);
  } finally {
    if (teacherId) await query('DELETE FROM users WHERE id=$1', [teacherId]);
    await query('DELETE FROM classes WHERE school_code=$1 AND name=ANY($2::text[])', ['primary', [classA, classB, classC]]);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Teacher assignment clearing and class/subject conversion regressions.
//
// Contract under test for PUT /admin/users/:id on a teacher:
//   * an OMITTED assigned_class leaves the primary class alone;
//   * an explicit null or '' clears it;
//   * moving between class teacher and subject teacher never leaves the old
//     role's authority behind (primary class, extra owned classes in
//     assigned_class_names, teacher_subjects, teacher_class_subjects).
// ─────────────────────────────────────────────────────────────────────────────

type Pair = { class_name: string; subject_id: number };

interface AssignmentFixture {
  classA: string;
  classB: string;
  classC: string;
  subject1: number;
  subject2: number;
  teachers: string[];
}

async function withAssignmentFixture(run: (f: AssignmentFixture) => Promise<void>): Promise<void> {
  const suffix = unique();
  const f: AssignmentFixture = {
    classA: `BSEC5 Conv A ${suffix}`,
    classB: `BSEC5 Conv B ${suffix}`,
    classC: `BSEC5 Conv C ${suffix}`,
    subject1: await createSubject(`BSEC5 Conv Subject 1 ${suffix}`, 'primary'),
    subject2: await createSubject(`BSEC5 Conv Subject 2 ${suffix}`, 'primary'),
    teachers: [],
  };
  await query('INSERT INTO classes(school_code,name) VALUES($1,$2),($1,$3),($1,$4)', ['primary', f.classA, f.classB, f.classC]);
  try {
    await run(f);
  } finally {
    if (f.teachers.length) await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [f.teachers]);
    await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [[f.subject1, f.subject2]]);
    await query('DELETE FROM classes WHERE school_code=$1 AND name=ANY($2::text[])', ['primary', [f.classA, f.classB, f.classC]]);
  }
}

async function createClassTeacher(f: AssignmentFixture, assignedClass: string, extraClasses: string[] = []): Promise<string> {
  const response = await postUser({
    full_name: 'Conversion Class Teacher',
    role: 'teacher',
    school_code: 'primary',
    assigned_class: assignedClass,
    assigned_class_names: extraClasses,
    assigned_subject_ids: [],
    initial_password: '482913',
  });
  assert.equal(response.status, 201);
  const id = ((await response.json()) as { user: { id: string } }).user.id;
  f.teachers.push(id);
  return id;
}

async function createSubjectTeacher(f: AssignmentFixture, grants: Pair[]): Promise<string> {
  const response = await postUser({
    username: `bsec5-conv-subject-${unique()}`,
    full_name: 'Conversion Subject Teacher',
    role: 'teacher',
    school_code: 'primary',
    assigned_class_names: [...new Set(grants.map(g => g.class_name))],
    assigned_subject_ids: [...new Set(grants.map(g => g.subject_id))],
    assigned_class_subjects: grants,
    initial_password: '482913',
  });
  assert.equal(response.status, 201);
  const id = ((await response.json()) as { user: { id: string } }).user.id;
  f.teachers.push(id);
  return id;
}

async function readAssignment(teacherId: string) {
  const { rows: users } = await query(
    'SELECT assigned_class, assigned_class_names FROM users WHERE id=$1',
    [teacherId],
  );
  const { rows: subjects } = await query(
    'SELECT subject_id FROM teacher_subjects WHERE user_id=$1 ORDER BY subject_id',
    [teacherId],
  );
  const { rows: pairs } = await query(
    `SELECT c.name AS class_name,tcs.subject_id
     FROM teacher_class_subjects tcs JOIN classes c ON c.id=tcs.class_id
     WHERE tcs.user_id=$1 ORDER BY c.name,tcs.subject_id`,
    [teacherId],
  );
  return {
    assigned_class: users[0].assigned_class as string | null,
    assigned_class_names: [...(users[0].assigned_class_names ?? [])].sort() as string[],
    subject_ids: subjects.map((row: any) => Number(row.subject_id)),
    pairs: pairs.map((row: any) => ({ class_name: row.class_name, subject_id: Number(row.subject_id) })) as Pair[],
  };
}

test('an explicit null or empty primary class clears the assignment; omitting the field does not', async () => {
  for (const clearValue of [null, '']) {
    await withAssignmentFixture(async (f) => {
      const teacherId = await createClassTeacher(f, f.classA, [f.classB]);

      // Unrelated edit that omits assigned_class must leave the class in place.
      const unrelated = await putUser(teacherId, { phone: '08011112222' });
      assert.equal(unrelated.status, 200);
      let state = await readAssignment(teacherId);
      assert.equal(state.assigned_class, f.classA, 'omitted assigned_class must not clear the class');
      assert.deepEqual(state.assigned_class_names, [f.classB]);

      // Clearing the primary class converts the teacher to a subject teacher, so
      // the request must carry a valid subject-teacher allocation (audit D2).
      const cleared = await putUser(teacherId, {
        assigned_class: clearValue,
        assigned_class_names: [f.classB],
        assigned_subject_ids: [f.subject1],
        assigned_class_subjects: [{ class_name: f.classB, subject_id: f.subject1 }],
      });
      assert.equal(cleared.status, 200, `clearing with ${JSON.stringify(clearValue)} must succeed`);
      state = await readAssignment(teacherId);
      assert.equal(state.assigned_class, null, `assigned_class must be NULL after ${JSON.stringify(clearValue)}`);
      assert.deepEqual(state.assigned_class_names, [f.classB]);

      const listed = await fetch(`${baseUrl}/admin/users?role=teacher`, { headers: { authorization: `Bearer ${adminToken}` } });
      assert.equal(listed.status, 200);
      const listedTeacher = ((await listed.json()) as { users: Array<{ id: string; assigned_class: string | null }> })
        .users.find(user => user.id === teacherId);
      assert.ok(listedTeacher);
      assert.equal(listedTeacher!.assigned_class ?? null, null, 'the admin listing must show the cleared assignment');

      // The released class has no class teacher left (checked directly: class-teacher
      // usernames are derived from the class and stay with the original account).
      const { rows: owners } = await query(
        `SELECT id FROM users WHERE role='teacher' AND school_code='primary' AND assigned_class=$1`,
        [f.classA],
      );
      assert.equal(owners.length, 0, 'the cleared class must have no class teacher');
    });
  }
});

test('clearing the primary class without a valid subject allocation is rejected; with one it drops inherited class-teacher ownership', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createClassTeacher(f, f.classA, [f.classB]);

    // Bare clear would leave a subject teacher with nothing (audit D2): rejected, nothing changes.
    const bare = await putUser(teacherId, { assigned_class: null });
    assert.equal(bare.status, 400);
    assert.deepEqual(await readAssignment(teacherId), {
      assigned_class: f.classA,
      assigned_class_names: [f.classB],
      subject_ids: [],
      pairs: [],
    });

    // A valid allocation converts; the old extra class B is not inherited.
    const converted = await putUser(teacherId, {
      assigned_class: null,
      assigned_class_names: [f.classC],
      assigned_subject_ids: [f.subject2],
      assigned_class_subjects: [{ class_name: f.classC, subject_id: f.subject2 }],
    });
    assert.equal(converted.status, 200);
    assert.deepEqual(await readAssignment(teacherId), {
      assigned_class: null,
      assigned_class_names: [f.classC],
      subject_ids: [f.subject2],
      pairs: [{ class_name: f.classC, subject_id: f.subject2 }],
    }, 'extra owned classes would otherwise keep roster access with no assignment');
  });
});

test('class teacher converts to subject teacher without keeping class-teacher authority', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createClassTeacher(f, f.classA, [f.classB]);
    const response = await putUser(teacherId, {
      assigned_class: null,
      assigned_class_names: [f.classA],
      assigned_subject_ids: [f.subject1],
      assigned_class_subjects: [{ class_name: f.classA, subject_id: f.subject1 }],
    });
    assert.equal(response.status, 200, 'the mobile conversion payload must be accepted');
    assert.deepEqual(await readAssignment(teacherId), {
      assigned_class: null,
      assigned_class_names: [f.classA],
      subject_ids: [f.subject1],
      pairs: [{ class_name: f.classA, subject_id: f.subject1 }],
    }, 'the former extra class B must be gone and only the explicit grant must remain');

    const listed = await fetch(`${baseUrl}/admin/users?role=teacher`, { headers: { authorization: `Bearer ${adminToken}` } });
    const listedTeacher = ((await listed.json()) as { users: Array<{ id: string; assigned_class: string | null; assigned_class_subjects: Pair[] }> })
      .users.find(user => user.id === teacherId);
    assert.ok(listedTeacher);
    assert.equal(listedTeacher!.assigned_class ?? null, null);
    assert.deepEqual(
      listedTeacher!.assigned_class_subjects.map(g => ({ class_name: g.class_name, subject_id: Number(g.subject_id) })),
      [{ class_name: f.classA, subject_id: f.subject1 }],
    );
  });
});

test('subject teacher converts to class teacher without keeping subject-only grants', async () => {
  await withAssignmentFixture(async (f) => {
    const grants: Pair[] = [
      { class_name: f.classA, subject_id: f.subject1 },
      { class_name: f.classB, subject_id: f.subject2 },
    ];

    // Minimal payload: an older client sends only the new class.
    const minimalId = await createSubjectTeacher(f, grants);
    const minimal = await putUser(minimalId, { assigned_class: f.classC });
    assert.equal(minimal.status, 200);
    assert.deepEqual(await readAssignment(minimalId), {
      assigned_class: f.classC,
      assigned_class_names: [],
      subject_ids: [],
      pairs: [],
    }, 'obsolete subject grants and subject-teacher classes must not survive conversion');
  });

  await withAssignmentFixture(async (f) => {
    // Full payload: the mobile form sends the cleared collections explicitly.
    const explicitId = await createSubjectTeacher(f, [
      { class_name: f.classA, subject_id: f.subject1 },
      { class_name: f.classB, subject_id: f.subject2 },
    ]);
    const explicit = await putUser(explicitId, {
      assigned_class: f.classC,
      assigned_class_names: [],
      assigned_subject_ids: [],
      assigned_class_subjects: [],
    });
    assert.equal(explicit.status, 200);
    assert.deepEqual(await readAssignment(explicitId), {
      assigned_class: f.classC,
      assigned_class_names: [],
      subject_ids: [],
      pairs: [],
    });
  });
});

test('changing allocations replaces grants and leaves no obsolete permissions', async () => {
  await withAssignmentFixture(async (f) => {
    // Subject teacher: shrink and move the class/subject matrix.
    const subjectTeacherId = await createSubjectTeacher(f, [
      { class_name: f.classA, subject_id: f.subject1 },
      { class_name: f.classB, subject_id: f.subject2 },
    ]);
    const moved = await putUser(subjectTeacherId, {
      assigned_class_names: [f.classB, f.classC],
      assigned_subject_ids: [f.subject2],
      assigned_class_subjects: [
        { class_name: f.classB, subject_id: f.subject2 },
        { class_name: f.classC, subject_id: f.subject2 },
      ],
    });
    assert.equal(moved.status, 200);
    assert.deepEqual(await readAssignment(subjectTeacherId), {
      assigned_class: null,
      assigned_class_names: [f.classB, f.classC].sort(),
      subject_ids: [f.subject2],
      pairs: [
        { class_name: f.classB, subject_id: f.subject2 },
        { class_name: f.classC, subject_id: f.subject2 },
      ].sort((a, b) => a.class_name.localeCompare(b.class_name)),
    }, 'class A / subject 1 must be gone');

    // Class teacher: move to another primary class and release the old one.
    const classTeacherId = await createClassTeacher(f, f.classA);
    const changed = await putUser(classTeacherId, { assigned_class: f.classB, assigned_class_names: [] });
    assert.equal(changed.status, 200, 'a subject teacher teaching class B does not own it, so a class teacher may move there');
    const afterMove = await readAssignment(classTeacherId);
    assert.equal(afterMove.assigned_class, f.classB);
    assert.deepEqual(afterMove.assigned_class_names, []);

    // The old class is released: no teacher keeps it as a primary class.
    const { rows: stillOwned } = await query(
      `SELECT id FROM users WHERE role='teacher' AND school_code='primary' AND assigned_class=$1`,
      [f.classA],
    );
    assert.equal(stillOwned.length, 0, 'class A must have no class teacher after the move');
  });
});

test('school-bound administrators can clear and convert in their school but not across schools', async () => {
  await withAssignmentFixture(async (f) => {
    const scopedUsername = `bsec5-scoped-admin-${unique()}`;
    const { rows: scopedRows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','admin','BSEC5 Scoped Admin','primary',TRUE,FALSE) RETURNING id`,
      [scopedUsername],
    );
    const scopedId = String(scopedRows[0].id);
    const scopedToken = signAccess({
      id: scopedId, username: scopedUsername, role: 'admin', school_code: 'primary', assigned_class: null, assigned_subject_ids: [],
    });
    const scopedPut = (userId: string, body: Record<string, unknown>) => fetch(`${baseUrl}/admin/users/${userId}`, {
      method: 'PUT',
      headers: { authorization: `Bearer ${scopedToken}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const foreignClass = `BSEC5 Foreign Class ${unique()}`;
    await query('INSERT INTO classes(school_code,name) VALUES($1,$2)', ['secondary', foreignClass]);
    let foreignTeacherId = '';
    try {
      const foreign = await postUser({
        full_name: 'Secondary Class Teacher', role: 'teacher', school_code: 'secondary',
        assigned_class: foreignClass, assigned_class_names: [], assigned_subject_ids: [], initial_password: '482913',
      });
      assert.equal(foreign.status, 201);
      foreignTeacherId = ((await foreign.json()) as { user: { id: string } }).user.id;

      const crossSchool = await scopedPut(foreignTeacherId, { assigned_class: null });
      assert.equal(crossSchool.status, 404, 'a primary-school administrator must not see a secondary-school teacher');
      const { rows: foreignRows } = await query('SELECT assigned_class FROM users WHERE id=$1', [foreignTeacherId]);
      assert.equal(foreignRows[0].assigned_class, foreignClass, 'the cross-school clear attempt must change nothing');

      const ownId = await createClassTeacher(f, f.classA);
      const ownClear = await scopedPut(ownId, {
        assigned_class: null,
        assigned_class_names: [f.classA],
        assigned_subject_ids: [f.subject1],
        assigned_class_subjects: [{ class_name: f.classA, subject_id: f.subject1 }],
      });
      assert.equal(ownClear.status, 200);
      assert.equal((await readAssignment(ownId)).assigned_class, null);
    } finally {
      if (foreignTeacherId) await query('DELETE FROM users WHERE id=$1', [foreignTeacherId]);
      await query('DELETE FROM classes WHERE school_code=$1 AND name=$2', ['secondary', foreignClass]);
      await query('DELETE FROM users WHERE id=$1', [scopedId]);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Audit finding D2: PUT /admin/users/:id must enforce the same minimum
// allocation as POST for a subject teacher (at least one class and one
// subject, with at least one valid class/subject grant). Rejected requests
// must change nothing.
// ─────────────────────────────────────────────────────────────────────────────

async function readUserRow(userId: string) {
  const { rows } = await query('SELECT full_name,phone,role,is_active FROM users WHERE id=$1', [userId]);
  return rows[0] as { full_name: string; phone: string | null; role: string; is_active: boolean };
}

test('D2: PUT cannot leave a subject teacher with no classes', async () => {
  await withAssignmentFixture(async (f) => {
    const grants: Pair[] = [{ class_name: f.classA, subject_id: f.subject1 }];
    const teacherId = await createSubjectTeacher(f, grants);
    const before = await readAssignment(teacherId);

    const response = await putUser(teacherId, {
      full_name: 'Must Not Be Saved',
      assigned_class_names: [],
      assigned_subject_ids: [f.subject1],
      assigned_class_subjects: [],
    });
    assert.equal(response.status, 400);
    assert.match(((await response.json()) as { error: string }).error, /at least one assigned class and one assigned subject/);
    assert.deepEqual(await readAssignment(teacherId), before, 'a rejected update must leave assignments untouched');
    assert.notEqual((await readUserRow(teacherId)).full_name, 'Must Not Be Saved', 'a rejected update must not save profile fields');

    // Older clients that omit the grant matrix are held to the same rule.
    const legacyShape = await putUser(teacherId, { assigned_class_names: [] });
    assert.equal(legacyShape.status, 400);
    assert.deepEqual(await readAssignment(teacherId), before);
  });
});

test('D2: PUT cannot leave a subject teacher with no subjects', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createSubjectTeacher(f, [{ class_name: f.classA, subject_id: f.subject1 }]);
    const before = await readAssignment(teacherId);

    const explicit = await putUser(teacherId, {
      assigned_class_names: [f.classA],
      assigned_subject_ids: [],
      assigned_class_subjects: [],
    });
    assert.equal(explicit.status, 400);
    assert.deepEqual(await readAssignment(teacherId), before);

    const legacyShape = await putUser(teacherId, { assigned_subject_ids: [] });
    assert.equal(legacyShape.status, 400);
    assert.deepEqual(await readAssignment(teacherId), before);
  });
});

test('D2: PUT rejects an empty class/subject grant matrix even when classes and subjects are listed', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createSubjectTeacher(f, [{ class_name: f.classA, subject_id: f.subject1 }]);
    const before = await readAssignment(teacherId);

    const response = await putUser(teacherId, {
      assigned_class_names: [f.classA, f.classB],
      assigned_subject_ids: [f.subject1, f.subject2],
      assigned_class_subjects: [],
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await readAssignment(teacherId), before, 'the existing grants must not be wiped');
  });
});

test('D2: PUT rejects invalid or incomplete class/subject grants for a subject teacher', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createSubjectTeacher(f, [{ class_name: f.classA, subject_id: f.subject1 }]);
    const before = await readAssignment(teacherId);
    const base = { assigned_class_names: [f.classA], assigned_subject_ids: [f.subject1] };

    const badGrantSets: Array<[string, unknown]> = [
      ['grant for a class that is not selected', [{ class_name: f.classB, subject_id: f.subject1 }]],
      ['grant for a subject that is not selected', [{ class_name: f.classA, subject_id: f.subject2 }]],
      ['duplicate grants', [{ class_name: f.classA, subject_id: f.subject1 }, { class_name: f.classA, subject_id: f.subject1 }]],
      ['blank class name', [{ class_name: '  ', subject_id: f.subject1 }]],
      ['non-integer subject id', [{ class_name: f.classA, subject_id: 'x' }]],
      ['non-positive subject id', [{ class_name: f.classA, subject_id: 0 }]],
      ['null grant entry', [null]],
      ['grants that are not an array', { class_name: f.classA, subject_id: f.subject1 }],
    ];
    for (const [label, grants] of badGrantSets) {
      const response = await putUser(teacherId, { ...base, assigned_class_subjects: grants });
      assert.equal(response.status, 400, `${label} must be rejected`);
      assert.deepEqual(await readAssignment(teacherId), before, `${label} must change nothing`);
    }

    // A subject or class from another school is rejected before anything is written.
    const suffix = unique();
    const foreignSubject = await createSubject(`BSEC5 D2 Foreign ${suffix}`, 'secondary');
    try {
      const foreign = await putUser(teacherId, {
        assigned_class_names: [f.classA],
        assigned_subject_ids: [foreignSubject],
        assigned_class_subjects: [{ class_name: f.classA, subject_id: foreignSubject }],
      });
      assert.equal(foreign.status, 400);
      assert.deepEqual(await readAssignment(teacherId), before);
    } finally {
      await query('DELETE FROM subjects WHERE id=$1', [foreignSubject]);
    }
    const foreignClassResponse = await putUser(teacherId, {
      assigned_class_names: ['No Such Class'],
      assigned_subject_ids: [f.subject1],
      assigned_class_subjects: [{ class_name: 'No Such Class', subject_id: f.subject1 }],
    });
    assert.equal(foreignClassResponse.status, 400);
    assert.deepEqual(await readAssignment(teacherId), before);
  });
});

test('D2: converting a class teacher to a subject teacher requires a valid allocation', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createClassTeacher(f, f.classA, [f.classB]);
    const before = await readAssignment(teacherId);

    const payloads: Array<[string, Record<string, unknown>]> = [
      ['clear only', { assigned_class: null }],
      ['clear with empty collections', { assigned_class: null, assigned_class_names: [], assigned_subject_ids: [], assigned_class_subjects: [] }],
      ['clear with classes but no subjects', { assigned_class: null, assigned_class_names: [f.classA], assigned_subject_ids: [] }],
      ['clear with subjects but no classes', { assigned_class: '', assigned_class_names: [], assigned_subject_ids: [f.subject1] }],
      ['clear with an empty grant matrix', { assigned_class: null, assigned_class_names: [f.classA], assigned_subject_ids: [f.subject1], assigned_class_subjects: [] }],
    ];
    for (const [label, body] of payloads) {
      const response = await putUser(teacherId, body);
      assert.equal(response.status, 400, `${label} must be rejected`);
      assert.deepEqual(await readAssignment(teacherId), before, `${label} must leave the class teacher intact`);
    }

    // The deliberate, valid conversion still works.
    const converted = await putUser(teacherId, {
      assigned_class: null,
      assigned_class_names: [f.classA],
      assigned_subject_ids: [f.subject1],
      assigned_class_subjects: [{ class_name: f.classA, subject_id: f.subject1 }],
    });
    assert.equal(converted.status, 200);
    assert.deepEqual(await readAssignment(teacherId), {
      assigned_class: null,
      assigned_class_names: [f.classA],
      subject_ids: [f.subject1],
      pairs: [{ class_name: f.classA, subject_id: f.subject1 }],
    });
  });
});

test('D2: promoting a non-teacher to a subject teacher requires a valid allocation', async () => {
  await withAssignmentFixture(async (f) => {
    const { rows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active)
       VALUES($1,'test-hash','admin','BSEC5 D2 Promotee','primary',TRUE) RETURNING id`,
      [`bsec5-d2-promotee-${unique()}`],
    );
    const userId = String(rows[0].id);
    f.teachers.push(userId);

    const bare = await putUser(userId, { role: 'teacher' });
    assert.equal(bare.status, 400);
    assert.equal((await readUserRow(userId)).role, 'admin', 'the rejected promotion must not change the role');

    const valid = await putUser(userId, {
      role: 'teacher',
      assigned_class_names: [f.classA],
      assigned_subject_ids: [f.subject1],
      assigned_class_subjects: [{ class_name: f.classA, subject_id: f.subject1 }],
    });
    assert.equal(valid.status, 200);
    assert.equal((await readUserRow(userId)).role, 'teacher');
  });
});

test('D2: class teachers are not forced to have subject-teacher grants', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createClassTeacher(f, f.classA);

    const emptyAllocation = await putUser(teacherId, {
      assigned_class: f.classA,
      assigned_class_names: [],
      assigned_subject_ids: [],
      assigned_class_subjects: [],
    });
    assert.equal(emptyAllocation.status, 200, 'a class teacher needs no subject grants');

    const addClass = await putUser(teacherId, { assigned_class_names: [f.classB] });
    assert.equal(addClass.status, 200);
    assert.deepEqual(await readAssignment(teacherId), {
      assigned_class: f.classA,
      assigned_class_names: [f.classB],
      subject_ids: [],
      pairs: [],
    });

    const moved = await putUser(teacherId, { assigned_class: f.classC, assigned_class_names: [] });
    assert.equal(moved.status, 200);
    assert.equal((await readAssignment(teacherId)).assigned_class, f.classC);
  });
});

test('D2: a valid subject-teacher update is still saved and replaces grants', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createSubjectTeacher(f, [{ class_name: f.classA, subject_id: f.subject1 }]);
    const response = await putUser(teacherId, {
      assigned_class_names: [f.classB],
      assigned_subject_ids: [f.subject2],
      assigned_class_subjects: [{ class_name: f.classB, subject_id: f.subject2 }],
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await readAssignment(teacherId), {
      assigned_class: null,
      assigned_class_names: [f.classB],
      subject_ids: [f.subject2],
      pairs: [{ class_name: f.classB, subject_id: f.subject2 }],
    });

    // Legacy clients that send classes and subjects but no matrix keep the Cartesian behaviour.
    const legacy = await putUser(teacherId, {
      assigned_class_names: [f.classA, f.classB],
      assigned_subject_ids: [f.subject1],
    });
    assert.equal(legacy.status, 200);
    assert.deepEqual((await readAssignment(teacherId)).pairs, [
      { class_name: f.classA, subject_id: f.subject1 },
      { class_name: f.classB, subject_id: f.subject1 },
    ].sort((a, b) => a.class_name.localeCompare(b.class_name)));
  });
});

test('D2: edits that do not touch allocations still work on a legacy subject teacher with none', async () => {
  await withAssignmentFixture(async (f) => {
    // A pre-existing invalid account (created before this rule) can still be
    // renamed, contacted and deactivated; only allocation changes are validated.
    const { rows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active)
       VALUES($1,'test-hash','teacher','BSEC5 D2 Legacy','primary',TRUE) RETURNING id`,
      [`bsec5-d2-legacy-${unique()}`],
    );
    const userId = String(rows[0].id);
    f.teachers.push(userId);

    const profile = await putUser(userId, { full_name: 'BSEC5 D2 Legacy Renamed', phone: '08033334444' });
    assert.equal(profile.status, 200);
    const deactivated = await putUser(userId, { is_active: false });
    assert.equal(deactivated.status, 200);
    const row = await readUserRow(userId);
    assert.equal(row.full_name, 'BSEC5 D2 Legacy Renamed');
    assert.equal(row.is_active, false);
  });
});

test('D2: school-bound administrators are held to the allocation rule and keep their scope limits', async () => {
  await withAssignmentFixture(async (f) => {
    const scopedUsername = `bsec5-d2-scoped-${unique()}`;
    const { rows: scopedRows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','admin','BSEC5 D2 Scoped Admin','primary',TRUE,FALSE) RETURNING id`,
      [scopedUsername],
    );
    const scopedId = String(scopedRows[0].id);
    const scopedToken = signAccess({
      id: scopedId, username: scopedUsername, role: 'admin', school_code: 'primary', assigned_class: null, assigned_subject_ids: [],
    });
    const scopedPut = (userId: string, body: Record<string, unknown>) => fetch(`${baseUrl}/admin/users/${userId}`, {
      method: 'PUT',
      headers: { authorization: `Bearer ${scopedToken}`, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    try {
      const teacherId = await createSubjectTeacher(f, [{ class_name: f.classA, subject_id: f.subject1 }]);
      const before = await readAssignment(teacherId);

      const empty = await scopedPut(teacherId, { assigned_class_names: [], assigned_subject_ids: [], assigned_class_subjects: [] });
      assert.equal(empty.status, 400);
      assert.deepEqual(await readAssignment(teacherId), before);

      const moveSchool = await scopedPut(teacherId, {
        school_code: 'secondary',
        assigned_class_names: [f.classA],
        assigned_subject_ids: [f.subject1],
        assigned_class_subjects: [{ class_name: f.classA, subject_id: f.subject1 }],
      });
      assert.equal(moveSchool.status, 403, 'moving a teacher outside the administrator\'s school stays forbidden');
      assert.deepEqual(await readAssignment(teacherId), before);

      const valid = await scopedPut(teacherId, {
        assigned_class_names: [f.classB],
        assigned_subject_ids: [f.subject2],
        assigned_class_subjects: [{ class_name: f.classB, subject_id: f.subject2 }],
      });
      assert.equal(valid.status, 200);
    } finally {
      await query('DELETE FROM users WHERE id=$1', [scopedId]);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Audit finding D3: POST /admin/users/:id/approve must not clear
// pending_admin_review on a teacher whose allocation is missing or invalid.
//   * class teacher: needs a valid primary class in the teacher's school;
//   * subject teacher: needs >=1 valid class, >=1 subject and >=1 valid
//     class/subject grant (the same minimum as POST and, since #1069, PUT);
//   * a rejected approval is HTTP 400 and changes nothing;
//   * students, parents and finance administrators are not affected.
// ─────────────────────────────────────────────────────────────────────────────

async function approveUser(userId: string, token = adminToken) {
  return fetch(`${baseUrl}/admin/users/${userId}/approve`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: '{}',
  });
}

async function createPendingUser(
  f: AssignmentFixture,
  role: 'teacher' | 'student' | 'parent' | 'finance_admin',
  opts: { school?: string; assignedClass?: string | null; classNames?: string[] } = {},
): Promise<string> {
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,$6::text[],TRUE,TRUE) RETURNING id`,
    [`bsec5-d3-${role}-${unique()}`, role, `BSEC5 D3 ${role}`, opts.school ?? 'primary', opts.assignedClass ?? null, opts.classNames ?? []],
  );
  const id = String(rows[0].id);
  f.teachers.push(id);
  return id;
}

async function addSubjectRows(userId: string, subjectIds: number[]) {
  for (const sid of subjectIds) await query('INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,$2)', [userId, sid]);
}

async function addGrantRow(userId: string, schoolCode: string, className: string, subjectId: number) {
  await query(
    `INSERT INTO teacher_class_subjects(user_id,class_id,subject_id,created_by)
     SELECT $1,c.id,$3,$4 FROM classes c WHERE c.school_code=$2 AND c.name=$5`,
    [userId, schoolCode, subjectId, adminId, className],
  );
}

async function approvalSnapshot(userId: string) {
  const { rows } = await query(
    `SELECT role,is_active,school_code,assigned_class,assigned_class_names,can_manage_all_schools,
            pending_admin_review,access_expires_at,must_change_pw,must_set_pin
     FROM users WHERE id=$1`,
    [userId],
  );
  const { rows: audit } = await query(
    `SELECT count(*)::int AS n FROM audit_log WHERE action='approve_self_registered_user' AND entity_id=$1`,
    [userId],
  );
  return { user: rows[0], assignment: await readAssignment(userId), approvalAuditRows: audit[0].n as number };
}

async function expectRejectedAndUnchanged(userId: string, label: string, token = adminToken) {
  const before = await approvalSnapshot(userId);
  assert.equal(before.user.pending_admin_review, true, `${label}: fixture must start pending`);
  const response = await approveUser(userId, token);
  assert.equal(response.status, 400, `${label}: approval must be rejected with 400`);
  assert.ok(((await response.json()) as { error: string }).error, `${label}: a reason must be returned`);
  assert.deepEqual(await approvalSnapshot(userId), before, `${label}: a rejected approval must change nothing and stay pending`);
}

test('D3: a pending teacher with no allocation at all cannot be approved', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createPendingUser(f, 'teacher');
    await expectRejectedAndUnchanged(teacherId, 'no allocation');
  });
});

test('D3: a pending subject teacher missing classes, subjects or grants cannot be approved', async () => {
  await withAssignmentFixture(async (f) => {
    // Subjects but no classes.
    const noClasses = await createPendingUser(f, 'teacher');
    await addSubjectRows(noClasses, [f.subject1]);
    await expectRejectedAndUnchanged(noClasses, 'subjects but no classes');

    // Classes but no subjects.
    const noSubjects = await createPendingUser(f, 'teacher', { classNames: [f.classA] });
    await expectRejectedAndUnchanged(noSubjects, 'classes but no subjects');

    // Classes and subjects but no class/subject grant.
    const noGrants = await createPendingUser(f, 'teacher', { classNames: [f.classA] });
    await addSubjectRows(noGrants, [f.subject1]);
    await expectRejectedAndUnchanged(noGrants, 'classes and subjects but no grant');
  });
});

test('D3: a pending subject teacher with only invalid grants or references cannot be approved', async () => {
  await withAssignmentFixture(async (f) => {
    const suffix = unique();
    const foreignClass = `BSEC5 D3 Foreign Class ${suffix}`;
    const foreignSubject = await createSubject(`BSEC5 D3 Foreign Subject ${suffix}`, 'secondary');
    await query('INSERT INTO classes(school_code,name) VALUES($1,$2)', ['secondary', foreignClass]);
    try {
      // Grant for a class the teacher is not assigned to.
      const wrongClass = await createPendingUser(f, 'teacher', { classNames: [f.classA] });
      await addSubjectRows(wrongClass, [f.subject1]);
      await addGrantRow(wrongClass, 'primary', f.classB, f.subject1);
      await expectRejectedAndUnchanged(wrongClass, 'grant for an unassigned class');

      // Grant for a subject the teacher is not assigned to.
      const wrongSubject = await createPendingUser(f, 'teacher', { classNames: [f.classA] });
      await addSubjectRows(wrongSubject, [f.subject1]);
      await addGrantRow(wrongSubject, 'primary', f.classA, f.subject2);
      await expectRejectedAndUnchanged(wrongSubject, 'grant for an unassigned subject');

      // Assigned class that does not exist in the teacher's school.
      const missingClass = await createPendingUser(f, 'teacher', { classNames: ['No Such Class'] });
      await addSubjectRows(missingClass, [f.subject1]);
      await expectRejectedAndUnchanged(missingClass, 'assigned class not in the school');

      // Class belonging to another school.
      const otherSchoolClass = await createPendingUser(f, 'teacher', { classNames: [foreignClass] });
      await addSubjectRows(otherSchoolClass, [f.subject1]);
      await expectRejectedAndUnchanged(otherSchoolClass, 'class from another school');

      // Subject belonging to another school.
      const otherSchoolSubject = await createPendingUser(f, 'teacher', { classNames: [f.classA] });
      await addSubjectRows(otherSchoolSubject, [foreignSubject]);
      await expectRejectedAndUnchanged(otherSchoolSubject, 'subject from another school');
    } finally {
      await query('DELETE FROM users WHERE username LIKE $1', ['bsec5-d3-%']);
      await query('DELETE FROM subjects WHERE id=$1', [foreignSubject]);
      await query('DELETE FROM classes WHERE school_code=$1 AND name=$2', ['secondary', foreignClass]);
    }
  });
});

test('D3: a pending class teacher needs a valid primary class but no subject grants', async () => {
  await withAssignmentFixture(async (f) => {
    const missing = await createPendingUser(f, 'teacher', { assignedClass: 'No Such Class' });
    await expectRejectedAndUnchanged(missing, 'primary class not in the school');

    const valid = await createPendingUser(f, 'teacher', { assignedClass: f.classA });
    const before = await approvalSnapshot(valid);
    assert.equal(before.assignment.subject_ids.length, 0);
    const response = await approveUser(valid);
    assert.equal(response.status, 200, 'a class teacher must not be forced to have subject grants');
    const after = await approvalSnapshot(valid);
    assert.equal(after.user.pending_admin_review, false);
    assert.equal(after.user.assigned_class, f.classA);
    assert.deepEqual(after.assignment, before.assignment);
    assert.equal(after.approvalAuditRows, 1);
  });
});

test('D3: a properly allocated subject teacher is approved, and a rejected one can be approved once fixed', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createPendingUser(f, 'teacher');
    await expectRejectedAndUnchanged(teacherId, 'unallocated');

    // The administrator completes the allocation through the existing edit route.
    const edit = await putUser(teacherId, {
      assigned_class_names: [f.classA, f.classB],
      assigned_subject_ids: [f.subject1],
      assigned_class_subjects: [{ class_name: f.classA, subject_id: f.subject1 }],
    });
    assert.equal(edit.status, 200);
    assert.equal((await approvalSnapshot(teacherId)).user.pending_admin_review, true, 'editing allocations must not approve');
    const before = await approvalSnapshot(teacherId);

    const response = await approveUser(teacherId);
    assert.equal(response.status, 200);
    const after = await approvalSnapshot(teacherId);
    assert.equal(after.user.pending_admin_review, false);
    assert.deepEqual(after.assignment, before.assignment, 'approval must not alter allocations');
    assert.equal(after.approvalAuditRows, 1);
  });
});

test('D3: student, parent and finance administrator approvals are unchanged', async () => {
  await withAssignmentFixture(async (f) => {
    for (const role of ['student', 'parent'] as const) {
      const id = await createPendingUser(f, role);
      const response = await approveUser(id);
      assert.equal(response.status, 200, `${role} approval must not require teacher allocations`);
      assert.equal((await approvalSnapshot(id)).user.pending_admin_review, false);
    }

    const financeId = await createPendingUser(f, 'finance_admin');
    const before = await approvalSnapshot(financeId);
    const response = await approveUser(financeId);
    assert.equal(response.status, 200, 'finance administrator approval must not require teacher allocations');
    const after = await approvalSnapshot(financeId);
    assert.equal(after.user.pending_admin_review, false);
    assert.equal(after.user.role, 'finance_admin', 'approval must not change the role');
    assert.deepEqual({ ...after.user, pending_admin_review: null }, { ...before.user, pending_admin_review: null },
      'approval must not change any finance administrator permission field');
    assert.deepEqual(after.assignment, before.assignment);
  });
});

test('D3: a rejected teacher approval does not touch other pending accounts', async () => {
  await withAssignmentFixture(async (f) => {
    const teacherId = await createPendingUser(f, 'teacher');
    const financeId = await createPendingUser(f, 'finance_admin');
    const financeBefore = await approvalSnapshot(financeId);
    await expectRejectedAndUnchanged(teacherId, 'teacher beside finance admin');
    assert.deepEqual(await approvalSnapshot(financeId), financeBefore);
    assert.equal(financeBefore.user.pending_admin_review, true);
  });
});

test('D3: school-scope checks on approval are preserved', async () => {
  await withAssignmentFixture(async (f) => {
    const scopedUsername = `bsec5-d3-scoped-${unique()}`;
    const { rows: scopedRows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','admin','BSEC5 D3 Scoped Admin','primary',TRUE,FALSE) RETURNING id`,
      [scopedUsername],
    );
    const scopedId = String(scopedRows[0].id);
    const scopedToken = signAccess({
      id: scopedId, username: scopedUsername, role: 'admin', school_code: 'primary', assigned_class: null, assigned_subject_ids: [],
    });
    const suffix = unique();
    const foreignClass = `BSEC5 D3 Scope Class ${suffix}`;
    const foreignSubject = await createSubject(`BSEC5 D3 Scope Subject ${suffix}`, 'secondary');
    await query('INSERT INTO classes(school_code,name) VALUES($1,$2)', ['secondary', foreignClass]);
    try {
      // A fully allocated secondary-school teacher is invisible to a primary-school administrator.
      const foreignTeacher = await createPendingUser(f, 'teacher', { school: 'secondary', classNames: [foreignClass] });
      await addSubjectRows(foreignTeacher, [foreignSubject]);
      await addGrantRow(foreignTeacher, 'secondary', foreignClass, foreignSubject);
      const before = await approvalSnapshot(foreignTeacher);
      assert.equal((await approveUser(foreignTeacher, scopedToken)).status, 404);
      assert.deepEqual(await approvalSnapshot(foreignTeacher), before);

      // Within the administrator's own school the allocation rule applies.
      const ownInvalid = await createPendingUser(f, 'teacher');
      await expectRejectedAndUnchanged(ownInvalid, 'own-school unallocated teacher', scopedToken);
      const ownValid = await createPendingUser(f, 'teacher', { classNames: [f.classA] });
      await addSubjectRows(ownValid, [f.subject1]);
      await addGrantRow(ownValid, 'primary', f.classA, f.subject1);
      assert.equal((await approveUser(ownValid, scopedToken)).status, 200);

      // A global administrator can approve the secondary-school teacher.
      assert.equal((await approveUser(foreignTeacher)).status, 200);
    } finally {
      await query('DELETE FROM users WHERE id=$1', [scopedId]);
      await query('DELETE FROM users WHERE username LIKE $1', ['bsec5-d3-%']);
      await query('DELETE FROM subjects WHERE id=$1', [foreignSubject]);
      await query('DELETE FROM classes WHERE school_code=$1 AND name=$2', ['secondary', foreignClass]);
    }
  });
});
