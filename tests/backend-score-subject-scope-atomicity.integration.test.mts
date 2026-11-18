import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import scoresRouter from '../backend/src/routes/scores.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(
  label: string,
  role: 'admin' | 'teacher' | 'student',
  schoolCode: string | null,
  assignedClass: string | null = null,
) {
  const username = `bsec20-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,TRUE,FALSE) RETURNING id`,
    [username, role, `BSEC20 ${label}`, schoolCode, assignedClass],
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

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/scores', scoresRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/scores` };
}

test('score writes enforce subject ownership and bulk upserts roll back atomically', async () => {
  const suffix = randomUUID();
  const year = `BSEC20/${suffix.slice(0, 8)}`;
  const subjectTeacher = await createUser('subject-teacher', 'teacher', 'primary');
  const classTeacher = await createUser('class-teacher', 'teacher', 'primary', 'Primary 4');
  const admin = await createUser('admin', 'admin', null);
  const studentUser = await createUser('student', 'student', 'primary');
  const subjectIds: number[] = [];
  const termIds: number[] = [];
  const studentIds: string[] = [];
  const rollbackIds: string[] = [];
  let server: Server | undefined;
  let triggerCreated = false;

  try {
    for (const [school, label] of [['primary', 'Subject A'], ['primary', 'Subject B'], ['secondary', 'Subject C']] as const) {
      const { rows } = await query(
        'INSERT INTO subjects(school_code,name,code) VALUES($1,$2,$3) RETURNING id',
        [school, `BSEC20 ${label} ${suffix}`, `B20-${label.replaceAll(' ', '')}-${suffix.slice(0, 6)}`],
      );
      subjectIds.push(Number(rows[0].id));
    }
    for (const school of ['primary', 'secondary']) {
      const { rows } = await query(
        `INSERT INTO terms(name,academic_year,school_code) VALUES('1st Term',$1,$2) RETURNING id`,
        [year, school],
      );
      termIds.push(Number(rows[0].id));
    }

    await query('INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,$2)', [subjectTeacher.id, subjectIds[0]]);

    const studentRows = await Promise.all([
      query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id)
         VALUES('BSEC20 Primary Four','Primary 4','primary',$1,$2) RETURNING id`,
        [`BSEC20-P4-${suffix}`, studentUser.id],
      ),
      query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number)
         VALUES('BSEC20 Primary Five','Primary 5','primary',$1) RETURNING id`,
        [`BSEC20-P5-${suffix}`],
      ),
      query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number)
         VALUES('BSEC20 Secondary Four','Primary 4','secondary',$1) RETURNING id`,
        [`BSEC20-S4-${suffix}`],
      ),
      query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number)
         VALUES('BSEC20 Rollback One','Primary 5','primary',$1) RETURNING id`,
        [`BSEC20-R1-${suffix}`],
      ),
      query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number)
         VALUES('BSEC20 Rollback Two','Primary 5','primary',$1) RETURNING id`,
        [`BSEC20-R2-${suffix}`],
      ),
    ]);
    studentIds.push(...studentRows.slice(0, 3).map(result => String(result.rows[0].id)));
    rollbackIds.push(...studentRows.slice(3).map(result => String(result.rows[0].id)));

    for (const [index, className] of ['Primary 4', 'Primary 5', 'Primary 4'].entries()) {
      await query(
        `INSERT INTO report_roster_memberships
           (student_id,class_name,source_class_name,status)
         VALUES($1,$2,$2,'active')`,
        [studentIds[index], className],
      );
    }

    const { rows: onlineOnlyRows } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES('BSEC20 Online Only Learner','Primary 4','primary',$1) RETURNING id`,
      [`BSEC20-ONLINE-${suffix}`],
    );
    const onlineOnlyStudentId = String(onlineOnlyRows[0].id);

    const started = await startServer();
    server = started.server;
    const headers = (token: string) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const post = (path: string, body: unknown, token: string) => fetch(
      `${started.baseUrl}${path}`,
      { method: 'POST', headers: headers(token), body: JSON.stringify(body) },
    );
    const score = (studentId: string, subjectId: number, termId: number) => ({
      student_id: studentId, subject_id: subjectId, term_id: termId, ca1: 10, ca2: 10, exam: 30,
    });

    const allowedSubject = await post('/', score(studentIds[0], subjectIds[0], termIds[0]), subjectTeacher.token);
    assert.equal(allowedSubject.status, 403, 'subject-only teachers without an assigned physical class cannot enter report scores');

    const deniedSubject = await post('/', score(studentIds[0], subjectIds[1], termIds[0]), subjectTeacher.token);
    assert.equal(deniedSubject.status, 403, 'subject-only teachers without an assigned physical class cannot enter report scores');

    const foreignSubject = await post('/', score(studentIds[0], subjectIds[2], termIds[0]), subjectTeacher.token);
    assert.equal(foreignSubject.status, 400, 'student, subject and term must belong to the same school');

    const foreignTerm = await post('/', score(studentIds[0], subjectIds[0], termIds[1]), subjectTeacher.token);
    assert.equal(foreignTerm.status, 400, 'teacher score entry rejects a term owned by another school');

    const classTeacherSubject = await post('/', score(studentIds[0], subjectIds[1], termIds[0]), classTeacher.token);
    assert.equal(classTeacherSubject.status, 200, 'class teachers can enter marks for any report subject in their assigned class');
    const { rows: calculatedScore } = await query(
      'SELECT total,grade,class_name FROM scores WHERE student_id=$1 AND subject_id=$2 AND term_id=$3',
      [studentIds[0], subjectIds[1], termIds[0]],
    );
    assert.equal(Number(calculatedScore[0]?.total), 50, 'database calculates total from CA1 + CA2 + exam');
    assert.ok(calculatedScore[0]?.grade, 'server calculates and stores the grade');
    assert.equal(calculatedScore[0]?.class_name, 'Primary 4', 'score snapshot uses the physical report-roster class');

    const teacherBulk = await post('/bulk', {
      scores: [score(studentIds[0], subjectIds[0], termIds[0])],
    }, classTeacher.token);
    assert.equal(teacherBulk.status, 200, 'class teachers can save a whole-class score batch');

    const classTeacherWrongClass = await post('/', score(studentIds[1], subjectIds[0], termIds[0]), classTeacher.token);
    assert.equal(classTeacherWrongClass.status, 403, 'teachers cannot enter marks outside their assigned physical class');

    const adminForeignSubject = await post('/', score(studentIds[0], subjectIds[2], termIds[0]), admin.token);
    assert.equal(adminForeignSubject.status, 400, 'administrator writes must preserve student/subject school integrity');

    const onlineOnlyScore = await post('/', score(onlineOnlyStudentId, subjectIds[0], termIds[0]), admin.token);
    assert.equal(onlineOnlyScore.status, 404, 'administrators cannot create physical report scores for online-only profiles');
    const onlineOnlyReport = await fetch(
      `${started.baseUrl}/report/${onlineOnlyStudentId}?term_id=${termIds[0]}`,
      { headers: headers(admin.token) },
    );
    assert.equal(onlineOnlyReport.status, 404, 'online-only profiles cannot retrieve physical report cards');

    const { rows: scoresBeforeDeniedBatch } = await query(
      'SELECT id,student_id,subject_id,total FROM scores WHERE student_id=ANY($1::uuid[]) AND term_id=$2 ORDER BY id',
      [[studentIds[0], studentIds[1]], termIds[0]],
    );
    const invalidBatch = await post('/bulk', {
      scores: [
        score(studentIds[0], subjectIds[0], termIds[0]),
        score(studentIds[1], subjectIds[1], termIds[0]),
      ],
    }, subjectTeacher.token);
    assert.equal(invalidBatch.status, 403, 'subject-only teachers without a physical class cannot enter scores in bulk');
    const { rows: scoresAfterDeniedBatch } = await query(
      'SELECT id,student_id,subject_id,total FROM scores WHERE student_id=ANY($1::uuid[]) AND term_id=$2 ORDER BY id',
      [[studentIds[0], studentIds[1]], termIds[0]],
    );
    assert.deepEqual(scoresAfterDeniedBatch, scoresBeforeDeniedBatch,
      'denied teacher writes must not create or change any score');

    const validBatch = await post('/bulk', {
      scores: [
        score(studentIds[0], subjectIds[0], termIds[0]),
        score(studentIds[1], subjectIds[0], termIds[0]),
      ],
    }, admin.token);
    assert.equal(validBatch.status, 200, 'administrator may commit a valid batch');
    assert.deepEqual(await validBatch.json(), { saved: 2 });
    const { rows: validBatchRows } = await query(
      'SELECT id FROM scores WHERE student_id=ANY($1::uuid[]) AND subject_id=$2 AND term_id=$3',
      [[studentIds[0], studentIds[1]], subjectIds[0], termIds[0]],
    );
    assert.equal(validBatchRows.length, 2, 'every row in a valid batch must be committed');

    // Force a database failure on the second insert after the first row has
    // already been written inside the batch transaction.
    const targetId = rollbackIds[1];
    await query(`
      CREATE OR REPLACE FUNCTION bsec20_reject_second_score() RETURNS trigger
      LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.student_id = '${targetId}'::uuid THEN
          RAISE EXCEPTION 'BSEC20 simulated score write failure';
        END IF;
        RETURN NEW;
      END;
      $$;
    `);
    await query(`
      CREATE TRIGGER bsec20_reject_second_score
      BEFORE INSERT OR UPDATE ON scores
      FOR EACH ROW EXECUTE FUNCTION bsec20_reject_second_score()
    `);
    triggerCreated = true;

    const failedBatch = await post('/bulk', {
      scores: [
        score(rollbackIds[0], subjectIds[0], termIds[0]),
        score(rollbackIds[1], subjectIds[0], termIds[0]),
      ],
    }, admin.token);
    assert.equal(failedBatch.status, 500);
    const { rows: rollbackRows } = await query(
      'SELECT id FROM scores WHERE student_id=ANY($1::uuid[]) AND subject_id=$2 AND term_id=$3',
      [rollbackIds, subjectIds[0], termIds[0]],
    );
    assert.equal(rollbackRows.length, 0, 'a database error must roll back every row in the bulk batch');

    await query('DROP TRIGGER bsec20_reject_second_score ON scores');
    await query('DROP FUNCTION bsec20_reject_second_score()');
    triggerCreated = false;

    // A legacy cross-school score must not contaminate same-class report
    // averages, positions, class size or the raw teacher score list.
    await query(
      `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,entered_by,class_name)
       VALUES($1,$2,$3,20,20,60,'A',$4,'Primary 4')`,
      [studentIds[2], subjectIds[0], termIds[0], admin.id],
    );

    const report = await fetch(
      `${started.baseUrl}/report/${studentIds[0]}?term_id=${termIds[0]}`,
      { headers: { Authorization: `Bearer ${studentUser.token}` } },
    );
    assert.equal(report.status, 200);
    const reportPayload = await report.json() as {
      summary: { class_size: number };
      scores: Array<{
        subject_id: number;
        class_average: number;
        class_highest: number;
        subject_position: number;
      }>;
    };
    assert.equal(reportPayload.summary.class_size, 1,
      'class size must exclude another school with the same class label');
    const primarySubjectReport = reportPayload.scores.find(row => row.subject_id === subjectIds[0]);
    assert.ok(primarySubjectReport, 'the report must contain the same-school subject score');
    assert.equal(Number(primarySubjectReport.class_average), 50);
    assert.equal(Number(primarySubjectReport.class_highest), 50);
    assert.equal(Number(primarySubjectReport.subject_position), 1);

    const rawScores = await fetch(
      `${started.baseUrl}?term_id=${termIds[0]}&class_name=Primary%204&subject_id=${subjectIds[0]}`,
      { headers: { Authorization: `Bearer ${classTeacher.token}` } },
    );
    assert.equal(rawScores.status, 200, 'teachers can read only score rows for their assigned active physical roster');
    const rawScorePayload = await rawScores.json() as { scores: Array<{ student_id: string }> };
    assert.ok(rawScorePayload.scores.every(row => row.student_id === studentIds[0]));

    const teacherReport = await fetch(
      `${started.baseUrl}/report/${studentIds[0]}?term_id=${termIds[0]}`,
      { headers: { Authorization: `Bearer ${classTeacher.token}` } },
    );
    assert.equal(teacherReport.status, 200, 'teacher can generate a report for an active student in the assigned physical class');
    const outOfClassReport = await fetch(
      `${started.baseUrl}/report/${studentIds[1]}?term_id=${termIds[0]}`,
      { headers: { Authorization: `Bearer ${classTeacher.token}` } },
    );
    assert.equal(outOfClassReport.status, 404, 'teacher cannot generate a report for a student outside the assigned physical class');
  } finally {
    if (triggerCreated) {
      await query('DROP TRIGGER IF EXISTS bsec20_reject_second_score ON scores').catch(() => undefined);
      await query('DROP FUNCTION IF EXISTS bsec20_reject_second_score()').catch(() => undefined);
    }
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    const allStudentIds = [...studentIds, ...rollbackIds];
    if (allStudentIds.length) {
      await query('DELETE FROM scores WHERE student_id=ANY($1::uuid[])', [allStudentIds]);
      await query('DELETE FROM report_roster_membership_events WHERE student_id=ANY($1::uuid[])', [allStudentIds]);
      await query('DELETE FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])', [allStudentIds]);
      await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [allStudentIds]);
    }
    await query('DELETE FROM teacher_subjects WHERE user_id=ANY($1::uuid[])', [[subjectTeacher.id, classTeacher.id]]);
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    if (subjectIds.length) await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [subjectIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[subjectTeacher.id, classTeacher.id, admin.id, studentUser.id]]);
  }
});
