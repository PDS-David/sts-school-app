import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import scoresRouter from '../backend/src/routes/scores.js';
import attendanceRouter from '../backend/src/routes/attendance.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

test('individual student score and class-record reports reject a term from another school', async () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const username = `bsec12-student-${suffix}`;
  const admission = `BSEC12-${suffix}`;
  let studentId: string | undefined;
  let userId: string | undefined;
  let primaryTermId: number | undefined;
  let secondaryTermId: number | undefined;
  let server: Server | undefined;

  try {
    const { rows: users } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','student','BSEC12 Student','primary',TRUE,FALSE)
       RETURNING id`,
      [username],
    );
    userId = String(users[0].id);

    const { rows: students } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id)
       VALUES('BSEC12 Student','Primary 4','primary',$1,$2) RETURNING id`,
      [admission, userId],
    );
    studentId = String(students[0].id);
    await query(
      `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
       VALUES($1,'Primary 4','Primary 4','active')`,
      [studentId],
    );

    const year = `BSEC12/${suffix}`;
    const { rows: primaryTerms } = await query(
      `INSERT INTO terms(name,academic_year,school_code)
       VALUES('1st Term',$1,'primary') RETURNING id`,
      [year],
    );
    primaryTermId = primaryTerms[0].id;
    const { rows: secondaryTerms } = await query(
      `INSERT INTO terms(name,academic_year,school_code)
       VALUES('1st Term',$1,'secondary') RETURNING id`,
      [year],
    );
    secondaryTermId = secondaryTerms[0].id;

    const app = express();
    app.use(express.json());
    app.use('/scores', scoresRouter);
    app.use('/attendance', attendanceRouter);
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
      server!.once('listening', resolve);
      server!.once('error', reject);
    });
    const port = (server.address() as AddressInfo).port;
    const token = signAccess({
      id: userId,
      username,
      role: 'student',
      school_code: 'primary',
      assigned_class: null,
      assigned_subject_ids: [],
    });
    const headers = { Authorization: `Bearer ${token}` };

    const scoreMismatch = await fetch(
      `http://127.0.0.1:${port}/scores/report/${studentId}?term_id=${secondaryTermId}`,
      { headers },
    );
    assert.equal(scoreMismatch.status, 400);
    assert.match((await scoreMismatch.json() as { error: string }).error, /different school/);

    const scoreValid = await fetch(
      `http://127.0.0.1:${port}/scores/report/${studentId}?term_id=${primaryTermId}`,
      { headers },
    );
    assert.equal(scoreValid.status, 200);
    const emptyReport = await scoreValid.json() as {
      summary: { total_score: number | null; average: number | null; subject_count: number };
      attendance: { days_present: number | null; days_opened: number };
    };
    assert.equal(emptyReport.summary.total_score, null, 'no score rows must not be represented as a zero total');
    assert.equal(emptyReport.summary.average, null, 'no score rows must not be represented as a zero average');
    assert.equal(emptyReport.summary.subject_count, 0);
    assert.equal(emptyReport.attendance.days_present, null, 'missing attendance must remain distinguishable from zero days present');

    const recordMismatch = await fetch(
      `http://127.0.0.1:${port}/attendance/class-records/${studentId}/${secondaryTermId}`,
      { headers },
    );
    assert.equal(recordMismatch.status, 400);
    assert.match((await recordMismatch.json() as { error: string }).error, /different school/);

    const recordValid = await fetch(
      `http://127.0.0.1:${port}/attendance/class-records/${studentId}/${primaryTermId}`,
      { headers },
    );
    assert.equal(recordValid.status, 200);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentId) await query('DELETE FROM report_roster_memberships WHERE student_id=$1', [studentId]);
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    if (userId) await query('DELETE FROM users WHERE id=$1', [userId]);
    if (primaryTermId) await query('DELETE FROM terms WHERE id=$1', [primaryTermId]);
    if (secondaryTermId) await query('DELETE FROM terms WHERE id=$1', [secondaryTermId]);
  }
});


test('soft-deleted students are excluded from report averages and rankings', async () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const username = `report-rank-teacher-${suffix}`;
  const admission = (label: string) => `RANK-${label}-${suffix}`;
  const studentIds: string[] = [];
  let teacherId: string | undefined;
  let subjectId: number | undefined;
  let termId: number | undefined;
  let server: Server | undefined;

  try {
    const { rows: teachers } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,
                         is_active,pending_admin_review)
       VALUES($1,'test-hash','teacher','Report Ranking Teacher','primary','Primary 4',ARRAY['Primary 4']::text[],TRUE,FALSE)
       RETURNING id`,
      [username],
    );
    teacherId = String(teachers[0].id);
    const { rows: subjects } = await query(
      'INSERT INTO subjects(school_code,name,code) VALUES($1,$2,$3) RETURNING id',
      ['primary', `Report Ranking Subject ${suffix}`, `RANK-${suffix.slice(0, 8)}`],
    );
    subjectId = Number(subjects[0].id);
    const { rows: terms } = await query(
      `INSERT INTO terms(name,academic_year,school_code) VALUES('1st Term',$1,'primary') RETURNING id`,
      [`REPORT-RANK/${suffix}`],
    );
    termId = Number(terms[0].id);

    const makePupil = async (label: string, deleted: boolean) => {
      const { rows } = await query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number,deleted_at)
         VALUES($1,'Primary 4','primary',$2,CASE WHEN $3 THEN now() ELSE NULL END) RETURNING id`,
        [`Report Ranking ${label} ${suffix}`, admission(label), deleted],
      );
      const id = String(rows[0].id);
      studentIds.push(id);
      await query(
        `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
         VALUES($1,'Primary 4','Primary 4','active')`, [id],
      );
      return id;
    };
    const target = await makePupil('target', false);
    const activePeer = await makePupil('active-peer', false);
    const deletedPeer = await makePupil('deleted-peer', true);

    for (const [studentId, ca1, ca2, exam] of [
      [target, 10, 10, 50],
      [activePeer, 20, 10, 50],
      [deletedPeer, 20, 20, 60],
    ] as const) {
      await query(
        `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,entered_by,class_name)
         VALUES($1,$2,$3,$4,$5,$6,'A',$7,'Primary 4')`,
        [studentId, subjectId, termId, ca1, ca2, exam, teacherId],
      );
    }

    const app = express();
    app.use(express.json());
    app.use('/scores', scoresRouter);
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
      server!.once('listening', resolve);
      server!.once('error', reject);
    });
    const port = (server.address() as AddressInfo).port;
    const token = signAccess({
      id: teacherId,
      username,
      role: 'teacher',
      school_code: 'primary',
      assigned_class: 'Primary 4',
      assigned_class_names: ['Primary 4'],
      assigned_subject_ids: [],
    });
    const response = await fetch(
      `http://127.0.0.1:${port}/scores/report/${target}?term_id=${termId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    assert.equal(response.status, 200);
    const report = await response.json() as {
      scores: Array<{ class_average: number | string; class_highest: number | string; subject_position: number | string }>;
      summary: { overall_position: number; class_size: number };
    };
    assert.equal(Number(report.scores[0].class_average), 75,
      'class average must include the active target and active peer only');
    assert.equal(Number(report.scores[0].class_highest), 80,
      'class highest must ignore the deleted pupil\'s 100');
    assert.equal(Number(report.scores[0].subject_position), 2,
      'subject position must rank only active students');
    assert.equal(report.summary.overall_position, 2,
      'overall position must rank only active students');
    assert.equal(report.summary.class_size, 2,
      'class size and peer rankings must use the same active-student population');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentIds.length) {
      await query('DELETE FROM scores WHERE student_id=ANY($1::uuid[])', [studentIds]).catch(() => undefined);
      await query('DELETE FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])', [studentIds]).catch(() => undefined);
      await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]).catch(() => undefined);
    }
    if (teacherId) await query('DELETE FROM users WHERE id=$1', [teacherId]).catch(() => undefined);
    if (subjectId) await query('DELETE FROM subjects WHERE id=$1', [subjectId]).catch(() => undefined);
    if (termId) await query('DELETE FROM terms WHERE id=$1', [termId]).catch(() => undefined);
  }
});
