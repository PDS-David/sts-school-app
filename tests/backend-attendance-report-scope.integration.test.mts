import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import attendanceRouter from '../backend/src/routes/attendance.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(label: string, schoolCode: string | null, assignedClass: string | null) {
  const username = `bsec18-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash','teacher',$2,$3,$4,TRUE,FALSE) RETURNING id`,
    [username, `BSEC18 ${label}`, schoolCode, assignedClass],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role: 'teacher',
      school_code: schoolCode,
      assigned_class: assignedClass,
      assigned_subject_ids: [],
    }),
  };
}

async function createAdmin() {
  const username = `bsec18-admin-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,'test-hash','admin','BSEC18 Admin',NULL,TRUE,FALSE) RETURNING id`,
    [username],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role: 'admin',
      school_code: null,
      assigned_class: null,
      assigned_subject_ids: [],
    }),
  };
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/attendance', attendanceRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/attendance` };
}

test('whole-class attendance and class-record reads enforce school and term ownership', async () => {
  const suffix = randomUUID();
  const year = `BSEC18/${suffix}`;
  const classTeacher = await createUser('class-teacher', 'primary', 'Shared Class');
  const subjectTeacher = await createUser('subject-teacher', 'primary', null);
  const unassignedTeacher = await createUser('unassigned-teacher', null, null);
  const admin = await createAdmin();
  let primaryTermId: number | undefined;
  let secondaryTermId: number | undefined;
  const studentIds: string[] = [];
  let server: Server | undefined;

  try {
    const { rows: primaryTerms } = await query(
      `INSERT INTO terms(name,academic_year,school_code)
       VALUES('1st Term',$1,'primary') RETURNING id`,
      [year],
    );
    primaryTermId = Number(primaryTerms[0].id);
    const { rows: secondaryTerms } = await query(
      `INSERT INTO terms(name,academic_year,school_code)
       VALUES('1st Term',$1,'secondary') RETURNING id`,
      [year],
    );
    secondaryTermId = Number(secondaryTerms[0].id);

    const { rows: primaryStudents } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES('BSEC18 Primary','Shared Class','primary',$1) RETURNING id`,
      [`BSEC18-P-${suffix}`],
    );
    const { rows: secondaryStudents } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES('BSEC18 Secondary','Shared Class','secondary',$1) RETURNING id`,
      [`BSEC18-S-${suffix}`],
    );
    const { rows: deletedStudents } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number,deleted_at)
       VALUES('BSEC18 Deleted','Shared Class','primary',$1,now()) RETURNING id`,
      [`BSEC18-D-${suffix}`],
    );
    studentIds.push(String(primaryStudents[0].id), String(secondaryStudents[0].id), String(deletedStudents[0].id));

    await query(
      'INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,12),($3,$4,8),($5,$2,3)',
      [studentIds[0], primaryTermId, studentIds[1], secondaryTermId, studentIds[2]],
    );
    await query(
      `INSERT INTO class_records(student_id,term_id,class_teacher_remark)
       VALUES($1,$2,'Primary record'),($3,$4,'Secondary record'),($5,$2,'Deleted record')`,
      [studentIds[0], primaryTermId, studentIds[1], secondaryTermId, studentIds[2]],
    );

    const started = await startServer();
    server = started.server;
    const get = (path: string, token: string) => fetch(`${started.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const primaryAttendance = await get(
      `?class_name=Shared%20Class&term_id=${primaryTermId}`,
      classTeacher.token,
    );
    assert.equal(primaryAttendance.status, 200);
    const primaryAttendanceRows = await primaryAttendance.json() as { attendance: Array<{ student_id: string }> };
    assert.deepEqual(primaryAttendanceRows.attendance.map(row => row.student_id), [studentIds[0]],
      'teacher attendance read must be restricted to active students in their own school');

    const primaryRecords = await get(
      `/class-records?class_name=Shared%20Class&term_id=${primaryTermId}`,
      classTeacher.token,
    );
    assert.equal(primaryRecords.status, 200);
    const primaryRecordRows = await primaryRecords.json() as { class_records: Array<{ student_id: string }> };
    assert.deepEqual(primaryRecordRows.class_records.map(row => row.student_id), [studentIds[0]],
      'class-record read must be restricted to active students in their own school');

    const foreignAttendanceTerm = await get(
      `?class_name=Shared%20Class&term_id=${secondaryTermId}`,
      classTeacher.token,
    );
    assert.equal(foreignAttendanceTerm.status, 400);
    const foreignClassRecordTerm = await get(
      `/class-records?class_name=Shared%20Class&term_id=${secondaryTermId}`,
      classTeacher.token,
    );
    assert.equal(foreignClassRecordTerm.status, 400);

    const subjectAttendance = await get(
      `?class_name=Shared%20Class&term_id=${primaryTermId}`,
      subjectTeacher.token,
    );
    assert.equal(subjectAttendance.status, 200, 'subject-only teacher may explicitly select a class in their own school');
    assert.equal((await get(`?term_id=${primaryTermId}`, subjectTeacher.token)).status, 400,
      'subject-only teacher must supply a class');
    assert.equal((await get(`?class_name=Shared%20Class&term_id=${primaryTermId}`, unassignedTeacher.token)).status, 403,
      'teacher without a school must fail closed');
    assert.equal((await get(`/class-records?class_name=Shared%20Class&term_id=${primaryTermId}`, unassignedTeacher.token)).status, 403);

    const adminSecondaryRecords = await get(
      `/class-records?class_name=Shared%20Class&term_id=${secondaryTermId}`,
      admin.token,
    );
    assert.equal(adminSecondaryRecords.status, 200);
    const adminRows = await adminSecondaryRecords.json() as { class_records: Array<{ student_id: string }> };
    assert.deepEqual(adminRows.class_records.map(row => row.student_id), [studentIds[1]],
      'global administrator retains cross-school read access');
    const adminPrimaryRecords = await get(
      `/class-records?class_name=Shared%20Class&term_id=${primaryTermId}`,
      admin.token,
    );
    const adminPrimaryRows = await adminPrimaryRecords.json() as { class_records: Array<{ student_id: string }> };
    assert.deepEqual(new Set(adminPrimaryRows.class_records.map(row => row.student_id)), new Set([studentIds[0], studentIds[2]]),
      'administrator retains access to archived student history');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentIds.length) {
      await query('DELETE FROM attendance WHERE student_id=ANY($1::uuid[])', [studentIds]);
      await query('DELETE FROM class_records WHERE student_id=ANY($1::uuid[])', [studentIds]);
      await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]);
    }
    if (primaryTermId) await query('DELETE FROM terms WHERE id=$1', [primaryTermId]);
    if (secondaryTermId) await query('DELETE FROM terms WHERE id=$1', [secondaryTermId]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[classTeacher.id, subjectTeacher.id, unassignedTeacher.id, admin.id]]);
  }
});
