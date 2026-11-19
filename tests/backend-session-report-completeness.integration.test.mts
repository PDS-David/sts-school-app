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

test('session report completeness includes subjects with no marks in any term', async () => {
  const suffix = randomUUID();
  const schoolCode = `session_${suffix.slice(0, 12)}`;
  const academicYear = `QA-${suffix.slice(0, 8)}`;
  const username = `session-teacher-${suffix}`;
  const admission = `SESSION-${suffix}`;
  let userId: string | undefined;
  let studentId: string | undefined;
  const termIds: number[] = [];
  const subjectIds: number[] = [];
  let server: Server | undefined;

  try {
    await query(
      'INSERT INTO schools(code,name) VALUES($1,$2)',
      [schoolCode, `Session Report Test School ${suffix}`],
    );
    await query(
      'INSERT INTO classes(school_code,name) VALUES($1,$2)',
      [schoolCode, 'Primary 1'],
    );
    const { rows: users } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
       VALUES($1,'test-hash','teacher','Session Report Teacher',$2,'Primary 1',TRUE,FALSE)
       RETURNING id`,
      [username, schoolCode],
    );
    userId = String(users[0].id);
    const token = signAccess({
      id: userId,
      username,
      role: 'teacher',
      school_code: schoolCode,
      assigned_class: 'Primary 1',
      assigned_subject_ids: [],
    });

    for (const name of ['1st Term', '2nd Term', '3rd Term']) {
      const { rows } = await query(
        `INSERT INTO terms(name,academic_year,school_code,days_opened)
         VALUES($1,$2,$3,20) RETURNING id`,
        [name, academicYear, schoolCode],
      );
      termIds.push(Number(rows[0].id));
    }
    for (const name of ['English Language', 'Mathematics']) {
      const { rows } = await query(
        'INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id',
        [schoolCode, name],
      );
      subjectIds.push(Number(rows[0].id));
    }
    const { rows: students } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,'Primary 1',$2,$3) RETURNING id`,
      [`Session Report Student ${suffix}`, schoolCode, admission],
    );
    studentId = String(students[0].id);
    await query(
      `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
       VALUES($1,'Primary 1','Primary 1','active')`,
      [studentId],
    );

    // English is fully marked, but Mathematics has no marks in any term.
    for (const termId of termIds) {
      await query(
        `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,entered_by)
         VALUES($1,$2,$3,10,10,50,'A',$4)`,
        [studentId, subjectIds[0], termId, userId],
      );
    }

    const app = express();
    app.use(express.json());
    app.use('/scores', scoresRouter);
    app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    });
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
      server!.once('listening', resolve);
      server!.once('error', reject);
    });
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/scores/session-report/${studentId}`;
    const getReport = () => fetch(`${baseUrl}?academic_year=${encodeURIComponent(academicYear)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const incompleteResponse = await getReport();
    assert.equal(incompleteResponse.status, 200);
    const incomplete = await incompleteResponse.json() as {
      terms_present: number;
      is_complete_session: boolean;
      subjects: Array<{ subject_name: string; terms_recorded: number; session_total: number | null }>;
      summary: { subject_count: number; expected_subject_count: number; grand_total: number | null; grand_average: number | null };\n      attendance: { days_present: number | null; terms_recorded: number; terms_expected: number };
    };
    assert.equal(incomplete.terms_present, 3);
    assert.equal(incomplete.is_complete_session, false,
      'a subject with no scores must prevent the session from being marked complete');
    assert.equal(incomplete.subjects.length, 2,
      'the session report must show every expected school subject, including unmarked subjects');
    const missingMath = incomplete.subjects.find(subject => subject.subject_name === 'Mathematics');
    assert.equal(missingMath?.terms_recorded, 0);
    assert.equal(missingMath?.session_total, null);
    assert.equal(incomplete.summary.subject_count, 1);
    assert.equal(incomplete.summary.expected_subject_count, 2);\n    assert.equal(incomplete.summary.grand_total, 180, 'session grand total reflects only the marked subject');\n    assert.equal(incomplete.summary.grand_average, 60);\n    assert.equal(incomplete.attendance.days_present, null, 'unentered attendance must not be reported as zero days present');\n    assert.equal(incomplete.attendance.terms_recorded, 0);\n    assert.equal(incomplete.attendance.terms_expected, 3);

    for (const termId of termIds) {
      await query(
        `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,entered_by)
         VALUES($1,$2,$3,10,10,50,'A',$4)`,
        [studentId, subjectIds[1], termId, userId],
      );
    }
    const completeResponse = await getReport();
    assert.equal(completeResponse.status, 200);
    const complete = await completeResponse.json() as { is_complete_session: boolean; summary: { subject_count: number; expected_subject_count: number } };
    assert.equal(complete.is_complete_session, true);
    assert.equal(complete.summary.subject_count, 2);
    assert.equal(complete.summary.expected_subject_count, 2);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (studentId) {
      await query('DELETE FROM scores WHERE student_id=$1', [studentId]);
      await query('DELETE FROM report_roster_membership_events WHERE student_id=$1', [studentId]);
      await query('DELETE FROM report_roster_memberships WHERE student_id=$1', [studentId]);
      await query('DELETE FROM students WHERE id=$1', [studentId]);
    }
    if (userId) await query('DELETE FROM users WHERE id=$1', [userId]);
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    if (subjectIds.length) await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [subjectIds]);
    await query('DELETE FROM classes WHERE school_code=$1', [schoolCode]);
    await query('DELETE FROM schools WHERE code=$1', [schoolCode]);
  }
});
