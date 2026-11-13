import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
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
  let server: ReturnType<express.Express['listen']> | undefined;

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
    if (studentId) await query('DELETE FROM students WHERE id=$1', [studentId]);
    if (userId) await query('DELETE FROM users WHERE id=$1', [userId]);
    if (primaryTermId) await query('DELETE FROM terms WHERE id=$1', [primaryTermId]);
    if (secondaryTermId) await query('DELETE FROM terms WHERE id=$1', [secondaryTermId]);
  }
});
