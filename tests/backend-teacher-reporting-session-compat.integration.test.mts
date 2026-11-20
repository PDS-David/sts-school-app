// Prompt 2B increment D, step 4: teacher reporting compatibility with the PIN /
// session authentication changes. Drives the REAL /auth/login flow (so every
// token carries a server-side session id) with sessions REQUIRED, as in
// production, against the real scores and students routers.
process.env.PIN_PEPPER = 'test-pepper-0123456789-0123456789-0123456789-abcdef';
process.env.JWT_SECRET ||= 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET ||= 'test-jwt-refresh-secret';
process.env.AUTH_REQUIRE_SESSION_ID = 'true';

import 'express-async-errors';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { randomBytes, randomInt, randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import authRouter from '../backend/src/routes/auth.js';
import scoresRouter from '../backend/src/routes/scores.js';
import studentsRouter from '../backend/src/routes/students.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => { await pool.end(); });

const PIN = '730518';
const device = () => randomBytes(12).toString('hex');

async function startServer(): Promise<{ server: Server; base: string }> {
  await query(`DELETE FROM public.rate_limit_counters WHERE namespace = 'auth-login-ip'`);
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/scores', scoresRouter);
  app.use('/students', studentsRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((r, j) => { server.once('listening', r); server.once('error', j); });
  return { server, base: `http://127.0.0.1:${(server.address() as AddressInfo).port}` };
}

async function call(base: string, method: string, path: string, token?: string, body?: unknown, dev?: string) {
  const r = await fetch(`${base}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(dev ? { 'x-device-id': dev } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json: any = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
}

interface TeacherOpts {
  school?: string; assignedClass?: string | null; classNames?: string[]; subjectIds?: number[];
  pending?: boolean; mustSetPin?: boolean;
}
async function makeTeacher(label: string, o: TeacherOpts = {}) {
  const username = `tcompat-${label}-${randomInt(100_000_000, 999_999_999)}`;
  const hash = await bcrypt.hash(PIN, 4);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,
                       is_active,pending_admin_review,must_set_pin,must_change_pw)
     VALUES($1,$2,'teacher',$3,$4,$5,$6::text[],TRUE,$7,$8,FALSE) RETURNING id`,
    [username, hash, `TCOMPAT ${label}`, o.school ?? 'primary', o.assignedClass ?? null,
      o.classNames ?? [], o.pending ?? false, o.mustSetPin ?? false],
  );
  const id = String(rows[0].id);
  for (const sid of o.subjectIds ?? []) {
    await query('INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,$2)', [id, sid]);
  }
  return { id, username };
}

async function loginAs(base: string, username: string) {
  const r = await call(base, 'POST', '/auth/login', undefined, { username, pin: PIN }, device());
  assert.equal(r.status, 200, `login should succeed for ${username}: ${JSON.stringify(r.json)}`);
  assert.ok(r.json.access_token && r.json.refresh_token, 'login returns an access token and a refresh token');
  return r.json as { access_token: string; refresh_token: string; pending_admin_review?: boolean };
}

const rosterIds = (json: any): string[] => {
  const list = Array.isArray(json) ? json : (json?.students ?? json?.data ?? []);
  return list.map((s: any) => String(s.id));
};

test('teacher reporting works end to end with real PIN sessions (sessions required)', async () => {
  const suffix = randomUUID();
  const year = `TCOMPAT/${suffix.slice(0, 8)}`;
  const subjectIds: number[] = [];
  const termIds: number[] = [];
  const studentIds: string[] = [];
  const userIds: string[] = [];
  let server: Server | undefined;

  try {
    for (const [school, label] of [['primary', 'A'], ['primary', 'B'], ['secondary', 'X']] as const) {
      const { rows } = await query(
        'INSERT INTO subjects(school_code,name,code) VALUES($1,$2,$3) RETURNING id',
        [school, `TCOMPAT Subject ${label} ${suffix}`, `TC-${label}-${suffix.slice(0, 6)}`],
      );
      subjectIds.push(Number(rows[0].id));
    }
    for (const school of ['primary', 'secondary']) {
      const { rows } = await query(
        `INSERT INTO terms(name,academic_year,school_code) VALUES('1st Term',$1,$2) RETURNING id`, [year, school]);
      termIds.push(Number(rows[0].id));
    }
    const mkStudent = async (name: string, cls: string, school: string) => {
      const { rows } = await query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number) VALUES($1,$2,$3,$4) RETURNING id`,
        [name, cls, school, `TC-${randomUUID()}`]);
      const id = String(rows[0].id);
      await query(
        `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
         VALUES($1,$2,$2,'active')`, [id, cls]);
      return id;
    };
    const p4 = await mkStudent('TCOMPAT P4 pupil', 'Primary 4', 'primary');
    const p5 = await mkStudent('TCOMPAT P5 pupil', 'Primary 5', 'primary');
    const s4 = await mkStudent('TCOMPAT Secondary pupil', 'Primary 4', 'secondary');
    studentIds.push(p4, p5, s4);

    const classTeacher = await makeTeacher('class', { assignedClass: 'Primary 4', classNames: ['Primary 4'] });
    const subjTeacher = await makeTeacher('subject', { classNames: ['Primary 4'], subjectIds: [subjectIds[0]] });
    // Subject teacher whose DB row also holds a grant on a SECONDARY-school subject
    // (inserted directly, bypassing admin validation): visibility of an
    // assignment must never widen record access across schools.
    const crossTeacher = await makeTeacher('cross', { classNames: ['Primary 4'], subjectIds: [subjectIds[0], subjectIds[2]] });
    const pendingTeacher = await makeTeacher('pending', { assignedClass: 'Primary 4', classNames: ['Primary 4'], pending: true });
    const pinGated = await makeTeacher('pingated', { assignedClass: 'Primary 4', classNames: ['Primary 4'], mustSetPin: true });
    userIds.push(classTeacher.id, subjTeacher.id, crossTeacher.id, pendingTeacher.id, pinGated.id);

    const started = await startServer();
    server = started.server;
    const base = started.base;
    const score = (studentId: string, subjectId: number, termId: number, ca1 = 10) =>
      ({ student_id: studentId, subject_id: subjectId, term_id: termId, ca1, ca2: 10, exam: 30 });

    // ── Approved class teacher ────────────────────────────────────────────────
    const ct = await loginAs(base, classTeacher.username);
    const ctRoster = await call(base, 'GET', '/students', ct.access_token);
    assert.equal(ctRoster.status, 200, 'class teacher can load the roster through the session middleware');
    const ctIds = rosterIds(ctRoster.json);
    assert.ok(ctIds.includes(p4), 'class teacher sees students in the assigned class');
    assert.ok(!ctIds.includes(p5), 'class teacher does not see other classes');
    assert.ok(!ctIds.includes(s4), 'class teacher does not see other schools');
    assert.equal((await call(base, 'GET', `/students/${p4}`, ct.access_token)).status, 200);
    assert.ok([403, 404].includes((await call(base, 'GET', `/students/${p5}`, ct.access_token)).status), 'other-class student detail denied');

    for (const subjectId of [subjectIds[0], subjectIds[1]]) {
      const w = await call(base, 'POST', '/scores', ct.access_token, score(p4, subjectId, termIds[0]));
      assert.equal(w.status, 200, 'class teacher enters marks for every subject in the class');
    }
    const bulk = await call(base, 'POST', '/scores/bulk', ct.access_token, { scores: [score(p4, subjectIds[1], termIds[0], 12)] });
    assert.equal(bulk.status, 200, 'class teacher saves a batch');
    const saved = await query('SELECT ca1,ca2,exam,total FROM scores WHERE student_id=$1 AND subject_id=$2 AND term_id=$3',
      [p4, subjectIds[1], termIds[0]]);
    assert.equal(Number(saved.rows[0].total), 52, 'marks are persisted with the database-computed total');
    assert.equal((await call(base, 'GET', `/scores/report/${p4}?term_id=${termIds[0]}`, ct.access_token)).status, 200, 'class teacher reads the report');
    assert.equal((await call(base, 'POST', '/scores', ct.access_token, score(p5, subjectIds[0], termIds[0]))).status, 403, 'class teacher cannot mark another class');

    // ── Approved subject teacher ──────────────────────────────────────────────
    const st = await loginAs(base, subjTeacher.username);
    assert.equal((await call(base, 'POST', '/scores', st.access_token, score(p4, subjectIds[0], termIds[0], 11))).status, 403,
      'subject teacher cannot overwrite a class-teacher mark');
    await query('DELETE FROM scores WHERE student_id=$1 AND subject_id=$2 AND term_id=$3', [p4, subjectIds[0], termIds[0]]);
    assert.equal((await call(base, 'POST', '/scores', st.access_token, score(p4, subjectIds[0], termIds[0], 11))).status, 200,
      'subject teacher enters marks for the assigned subject in an assigned class');
    assert.equal((await call(base, 'POST', '/scores', st.access_token, score(p4, subjectIds[1], termIds[0]))).status, 403,
      'subject teacher cannot enter an unassigned subject');
    assert.equal((await call(base, 'POST', '/scores', st.access_token, score(p5, subjectIds[0], termIds[0]))).status, 403,
      'subject teacher cannot mark a student in an unassigned class');
    assert.equal((await call(base, 'GET', `/scores/report/${p4}?term_id=${termIds[0]}`, st.access_token)).status, 200,
      'subject teacher reads the report for an assigned class');
    assert.ok([403, 404].includes((await call(base, 'GET', `/students/${p5}`, st.access_token)).status), 'subject teacher denied other-class student');

    // ── Cross-school grant does not widen access ─────────────────────────────
    const xt = await loginAs(base, crossTeacher.username);
    const xw = await call(base, 'POST', '/scores', xt.access_token, score(s4, subjectIds[2], termIds[1]));
    assert.notEqual(xw.status, 200, 'a secondary-school grant cannot be used to write secondary-school records');
    const none = await query('SELECT 1 FROM scores WHERE student_id=$1', [s4]);
    assert.equal(none.rows.length, 0, 'no cross-school score row was written');
    const xr = await call(base, 'GET', `/scores/report/${s4}?term_id=${termIds[1]}`, xt.access_token);
    assert.ok([400, 403, 404].includes(xr.status), 'cross-school report read denied');
    const xRoster = rosterIds((await call(base, 'GET', '/students', xt.access_token)).json);
    assert.ok(!xRoster.includes(s4), 'cross-school student never appears in the roster');

    // ── Pending teacher ───────────────────────────────────────────────────────
    const pt = await loginAs(base, pendingTeacher.username);
    assert.equal((await call(base, 'GET', '/auth/me', pt.access_token)).status, 200, 'pending teacher may check status');
    for (const [m, p, b] of [
      ['GET', '/students', undefined],
      ['GET', `/students/${p4}`, undefined],
      ['GET', '/scores', undefined],
      ['GET', '/scores/teacher/overview', undefined],
      ['GET', `/scores/report/${p4}?term_id=${termIds[0]}`, undefined],
      ['POST', '/scores', score(p4, subjectIds[0], termIds[0])],
      ['POST', '/scores/bulk', { scores: [score(p4, subjectIds[0], termIds[0])] }],
    ] as const) {
      const r = await call(base, m, p, pt.access_token, b);
      assert.equal(r.status, 403, `pending teacher blocked on ${m} ${p}`);
      assert.equal(r.json?.code, 'PENDING_APPROVAL');
    }
    const beforeApproval = await query('SELECT 1 FROM scores WHERE student_id=$1 AND ca1=10 AND subject_id=$2 AND entered_by=$3', [p4, subjectIds[0], pendingTeacher.id]);
    assert.equal(beforeApproval.rows.length, 0, 'pending teacher wrote nothing');
    await query('UPDATE users SET pending_admin_review=FALSE WHERE id=$1', [pendingTeacher.id]);
    assert.equal((await call(base, 'GET', '/students', pt.access_token)).status, 200, 'approval takes effect on the next request');

    // ── Teacher still owing a PIN (administrator-issued credential) ──────────
    const pg = await loginAs(base, pinGated.username);
    const gated = await call(base, 'GET', '/students', pg.access_token);
    assert.equal(gated.status, 403);
    assert.equal(gated.json?.code, 'PIN_SETUP_REQUIRED');
    assert.equal((await call(base, 'POST', '/scores', pg.access_token, score(p4, subjectIds[0], termIds[0]))).status, 403);

    // ── Session lifecycle does not break legitimate reporting requests ───────
    const refreshed = await call(base, 'POST', '/auth/refresh', undefined, { refresh_token: ct.refresh_token }, device());
    assert.equal(refreshed.status, 200, 'refresh succeeds');
    const newToken = refreshed.json.access_token as string;
    assert.equal((await call(base, 'GET', '/students', newToken)).status, 200, 'refreshed token works on reporting routes');
    assert.equal((await call(base, 'POST', '/scores', newToken, score(p4, subjectIds[0], termIds[0], 14))).status, 200);

    // Assignment change takes effect on the very next request (no re-login).
    await query(`UPDATE users SET assigned_class='Primary 5', assigned_class_names=ARRAY['Primary 5']::text[] WHERE id=$1`, [classTeacher.id]);
    assert.equal((await call(base, 'POST', '/scores', newToken, score(p4, subjectIds[0], termIds[0]))).status, 403, 'reassigned teacher loses the old class immediately');
    assert.equal((await call(base, 'POST', '/scores', newToken, score(p5, subjectIds[0], termIds[0]))).status, 200, 'and gains the new class immediately');

    // Logout revokes the session at once.
    assert.equal((await call(base, 'POST', '/auth/logout', newToken)).status, 200);
    const ended = await call(base, 'GET', '/students', newToken);
    assert.equal(ended.status, 401);
    assert.equal(ended.json?.code, 'SESSION_ENDED');

    // Pre-session tokens are refused when sessions are required (production behaviour).
    const legacy = signAccess({ id: classTeacher.id, username: classTeacher.username, role: 'teacher', school_code: 'primary', assigned_class: 'Primary 5', assigned_subject_ids: [] });
    assert.equal((await call(base, 'GET', '/students', legacy)).status, 401, 'sid-less token refused; clients refresh into a session');
  } finally {
    if (server) { server.closeAllConnections(); await new Promise<void>(r => server!.close(() => r())); }
    await query('DELETE FROM scores WHERE student_id=ANY($1::uuid[])', [studentIds]).catch(() => undefined);
    await query('DELETE FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])', [studentIds]).catch(() => undefined);
    await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [studentIds]).catch(() => undefined);
    await query('DELETE FROM teacher_subjects WHERE user_id=ANY($1::uuid[])', [userIds]).catch(() => undefined);
    await query('DELETE FROM auth_sessions WHERE user_id=ANY($1::uuid[])', [userIds]).catch(() => undefined);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]).catch(() => undefined);
    await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [subjectIds]).catch(() => undefined);
    await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]).catch(() => undefined);
  }
});
