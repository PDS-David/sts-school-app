import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import weeklyEffortsRouter from '../backend/src/routes/weeklyEfforts.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

interface TestUser {
  id: string;
  token: string;
}

interface Fixture {
  userIds: string[];
  studentIds: string[];
  effortIds: number[];
  termId: number;
  users: {
    classTeacher: TestUser;
    subjectTeacher: TestUser;
    otherTeacher: TestUser;
    parent: TestUser;
    deletedWardParent: TestUser;
    student: TestUser;
    admin: TestUser;
  };
  efforts: {
    classFourByOtherTeacher: number;
    classFiveBySubjectTeacher: number;
    classFourBySubjectTeacher: number;
    secondaryBySubjectTeacher: number;
    deletedWard: number;
  };
}

async function createUser(
  label: string,
  role: 'teacher' | 'parent' | 'student' | 'admin',
  schoolCode: string | null,
  assignedClass: string | null = null,
): Promise<TestUser> {
  const username = `bsec16-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,TRUE,FALSE) RETURNING id`,
    [username, role, `BSEC16 ${label}`, schoolCode, assignedClass],
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

async function createFixture(): Promise<Fixture> {
  const suffix = randomUUID();
  const users = {
    classTeacher: await createUser('class-teacher', 'teacher', 'primary', 'Primary 4'),
    subjectTeacher: await createUser('subject-teacher', 'teacher', 'primary'),
    otherTeacher: await createUser('other-teacher', 'teacher', 'primary', 'Primary 5'),
    parent: await createUser('parent', 'parent', 'primary'),
    deletedWardParent: await createUser('deleted-ward-parent', 'parent', 'primary'),
    student: await createUser('student', 'student', 'primary'),
    admin: await createUser('admin', 'admin', null),
  };

  const term = await query(
    `INSERT INTO terms(name,academic_year,school_code)
     VALUES('1st Term',$1,'primary') RETURNING id`,
    [`BSEC16/${suffix}`],
  );
  const termId = Number(term.rows[0].id);

  const studentRows = await Promise.all([
    query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES('BSEC16 Class Four','Primary 4','primary',$1) RETURNING id`,
      [`BSEC16-4-${suffix}`],
    ),
    query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES('BSEC16 Class Five','Primary 5','primary',$1) RETURNING id`,
      [`BSEC16-5-${suffix}`],
    ),
    query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES('BSEC16 Secondary','JSS 1','secondary',$1) RETURNING id`,
      [`BSEC16-S-${suffix}`],
    ),
    query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number,deleted_at)
       VALUES('BSEC16 Deleted Ward','Primary 4','primary',$1,now()) RETURNING id`,
      [`BSEC16-D-${suffix}`],
    ),
  ]);
  const studentIds = studentRows.map(result => String(result.rows[0].id));

  await query('UPDATE students SET user_id=$1 WHERE id=$2', [users.student.id, studentIds[0]]);
  await query('INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2)', [users.parent.id, studentIds[0]]);
  await query('INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2)', [users.deletedWardParent.id, studentIds[3]]);

  const effortRows = await Promise.all([
    query(
      `INSERT INTO weekly_efforts(student_id,term_id,week,teacher_id,teacher_comment)
       VALUES($1,$2,1,$3,'class-four other teacher') RETURNING id`,
      [studentIds[0], termId, users.otherTeacher.id],
    ),
    query(
      `INSERT INTO weekly_efforts(student_id,term_id,week,teacher_id,teacher_comment)
       VALUES($1,$2,1,$3,'class-five subject teacher') RETURNING id`,
      [studentIds[1], termId, users.subjectTeacher.id],
    ),
    query(
      `INSERT INTO weekly_efforts(student_id,term_id,week,teacher_id,teacher_comment)
       VALUES($1,$2,1,$3,'class-four subject teacher') RETURNING id`,
      [studentIds[0], termId, users.subjectTeacher.id],
    ),
    query(
      `INSERT INTO weekly_efforts(student_id,term_id,week,teacher_id,teacher_comment)
       VALUES($1,$2,1,$3,'secondary subject teacher') RETURNING id`,
      [studentIds[2], termId, users.subjectTeacher.id],
    ),
    query(
      `INSERT INTO weekly_efforts(student_id,term_id,week,teacher_id,teacher_comment)
       VALUES($1,$2,1,$3,'deleted ward record') RETURNING id`,
      [studentIds[3], termId, users.otherTeacher.id],
    ),
  ]);
  const effortIds = effortRows.map(result => Number(result.rows[0].id));
  for (const id of effortIds) {
    await query(
      'INSERT INTO weekly_feedback(weekly_effort_id,sender_id,body) VALUES($1,$2,$3)',
      [id, users.parent.id, 'Existing feedback'],
    );
  }

  return {
    userIds: Object.values(users).map(user => user.id),
    studentIds,
    effortIds,
    termId,
    users,
    efforts: {
      classFourByOtherTeacher: effortIds[0],
      classFiveBySubjectTeacher: effortIds[1],
      classFourBySubjectTeacher: effortIds[2],
      secondaryBySubjectTeacher: effortIds[3],
      deletedWard: effortIds[4],
    },
  };
}

async function cleanupFixture(fixture: Fixture): Promise<void> {
  await query('DELETE FROM weekly_feedback WHERE weekly_effort_id=ANY($1::int[])', [fixture.effortIds]);
  await query('DELETE FROM weekly_efforts WHERE id=ANY($1::int[])', [fixture.effortIds]);
  await query('DELETE FROM parent_wards WHERE parent_id=ANY($1::uuid[])', [fixture.userIds]);
  await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [fixture.studentIds]);
  await query('DELETE FROM terms WHERE id=$1', [fixture.termId]);
  await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [fixture.userIds]);
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/weekly-efforts', weeklyEffortsRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/weekly-efforts` };
}

test('weekly-effort feedback enforces class, teacher ownership, active ward and role boundaries', async () => {
  const fixture = await createFixture();
  let server: Server | undefined;

  try {
    const started = await startServer();
    server = started.server;
    const getFeedback = (effortId: number, token: string) => fetch(
      `${started.baseUrl}/${effortId}/feedback`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const postFeedback = (effortId: number, token: string) => fetch(
      `${started.baseUrl}/${effortId}/feedback`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: 'Scope regression feedback' }),
      },
    );

    assert.equal((await getFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.classTeacher.token)).status, 200,
      'class teacher may read any weekly effort for their assigned class');
    assert.equal((await getFeedback(fixture.efforts.classFiveBySubjectTeacher, fixture.users.classTeacher.token)).status, 403,
      'class teacher may not read another class');
    assert.equal((await getFeedback(fixture.efforts.secondaryBySubjectTeacher, fixture.users.classTeacher.token)).status, 403,
      'class teacher may not read another school');

    assert.equal((await getFeedback(fixture.efforts.classFiveBySubjectTeacher, fixture.users.subjectTeacher.token)).status, 200,
      'subject-only teacher may read their own logged entry');
    assert.equal((await getFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.subjectTeacher.token)).status, 403,
      'subject-only teacher may not read another teacher entry');
    assert.equal((await getFeedback(fixture.efforts.secondaryBySubjectTeacher, fixture.users.subjectTeacher.token)).status, 403,
      'subject-only teacher remains school-bound');

    assert.equal((await getFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.parent.token)).status, 200,
      'parent may read an active linked ward thread');
    assert.equal((await getFeedback(fixture.efforts.deletedWard, fixture.users.deletedWardParent.token)).status, 404,
      'soft-deleted wards must not retain feedback access');

    assert.equal((await getFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.student.token)).status, 200,
      'student may read their own thread');
    assert.equal((await getFeedback(fixture.efforts.classFiveBySubjectTeacher, fixture.users.student.token)).status, 403,
      'student may not read another student thread');
    assert.equal((await getFeedback(fixture.efforts.secondaryBySubjectTeacher, fixture.users.admin.token)).status, 200,
      'admin retains global feedback access');

    assert.equal((await postFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.classTeacher.token)).status, 201,
      'class teacher may reply within their assigned class');
    assert.equal((await postFeedback(fixture.efforts.classFiveBySubjectTeacher, fixture.users.classTeacher.token)).status, 403,
      'class teacher may not reply to another class');
    assert.equal((await postFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.subjectTeacher.token)).status, 403,
      'subject-only teacher may not reply to another teacher entry');
    assert.equal((await postFeedback(fixture.efforts.classFourByOtherTeacher, fixture.users.parent.token)).status, 201,
      'parent may reply for an active linked ward');
    assert.equal((await postFeedback(fixture.efforts.deletedWard, fixture.users.deletedWardParent.token)).status, 404,
      'parent may not reply for a soft-deleted ward');

    const parentFeed = await fetch(started.baseUrl, {
      headers: { Authorization: `Bearer ${fixture.users.parent.token}` },
    });
    const parentPayload = await parentFeed.json() as { weekly_efforts: Array<{ student_id: string }> };
    assert.ok(parentPayload.weekly_efforts.every(row => row.student_id === fixture.studentIds[0]),
      'parent feed must exclude soft-deleted ward records');

    const subjectTeacherFeed = await fetch(started.baseUrl, {
      headers: { Authorization: `Bearer ${fixture.users.subjectTeacher.token}` },
    });
    const teacherPayload = await subjectTeacherFeed.json() as { weekly_efforts: Array<{ id: number }> };
    assert.ok(teacherPayload.weekly_efforts.every(row =>
      [fixture.efforts.classFiveBySubjectTeacher, fixture.efforts.classFourBySubjectTeacher, fixture.efforts.secondaryBySubjectTeacher]
        .includes(row.id),
    ), 'subject-only teacher feed must include only their own active entries');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await cleanupFixture(fixture);
  }
});
