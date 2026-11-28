import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import academicRouter from '../backend/src/routes/academic.js';
import attendanceRouter from '../backend/src/routes/attendance.js';
import { AttendanceTermLimitError, saveAttendanceBulk } from '../backend/src/utils/attendanceWrites.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => { await pool.end(); });

type Role = 'teacher' | 'admin';
interface Actor { id: string; token: string }

async function makeUser(
  role: Role, schoolCode: string | null, assignedClass: string | null, classNames: string[] = [],
): Promise<Actor> {
  const username = `ts-safety-${role}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,$6::text[],TRUE,FALSE) RETURNING id`,
    [username, role, `TS Safety ${role}`, schoolCode, assignedClass, classNames],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id, username, role, school_code: schoolCode, assigned_class: assignedClass,
      assigned_class_names: classNames, assigned_subject_ids: [],
    }),
  };
}

async function makeStudent(schoolCode: string, className: string, opts: { deleted?: boolean } = {}): Promise<string> {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number,deleted_at)
     VALUES('TS Safety Student',$1,$2,$3,$4) RETURNING id`,
    [className, schoolCode, `TSS-${randomUUID()}`, opts.deleted ? new Date() : null],
  );
  const id = String(rows[0].id);
  await query(
    `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
     VALUES($1,$2,$2,'active')`,
    [id, className],
  );
  return id;
}

const CLASS_A = 'TS Class A';
const CLASS_B = 'TS Class B';

interface Ctx {
  termId: number;
  otherSchoolTermId: number;
  teacherA: Actor;            // class teacher of CLASS_A only
  teacherAB: Actor;           // class teacher of CLASS_A (primary) + CLASS_B (additional)
  teacherB: Actor;            // class teacher of CLASS_B only
  subjectOnlyNoClass: Actor;  // subject-only: no assigned physical class at all
  subjectOnlyWithGrant: Actor;// subject-only: no assigned_class but class names present
  secondaryTeacher: Actor;    // teacher in the other school
  schoolAdmin: Actor;         // admin bound to primary
  otherSchoolAdmin: Actor;    // admin bound to secondary
  globalAdmin: Actor;
  studentA: string;
  studentB: string;
  deletedStudentB: string;
  put: (termId: number, actor: Actor, body: unknown) => Promise<Response>;
  bulk: (actor: Actor, body: unknown) => Promise<Response>;
  post: (actor: Actor, body: unknown) => Promise<Response>;
  term: (id?: number) => Promise<{ days_opened: number; next_term_begins: string | null; name: string; is_current: boolean }>;
  setAttendance: (studentId: string, days: number) => Promise<void>;
  lock: (className: string, termId?: number) => Promise<void>;
  baseUrl: string;
}

async function withFixture(
  opts: { daysOpened?: number; nextTerm?: string | null },
  run: (ctx: Ctx) => Promise<void>,
): Promise<void> {
  const suffix = randomUUID();
  const year = `TSS/${suffix.slice(0, 8)}`;
  const daysOpened = opts.daysOpened ?? 60;
  const nextTerm = opts.nextTerm === undefined ? 'Monday, 12th January' : opts.nextTerm;
  const actors: Actor[] = [];
  const students: string[] = [];
  const termIds: number[] = [];
  let server: Server | undefined;
  try {
    const { rows: pt } = await query(
      `INSERT INTO terms(name,academic_year,school_code,days_opened,next_term_begins)
       VALUES('1st Term',$1,'primary',$2,$3) RETURNING id`, [year, daysOpened, nextTerm]);
    const { rows: st } = await query(
      `INSERT INTO terms(name,academic_year,school_code,days_opened,next_term_begins)
       VALUES('1st Term',$1,'secondary',$2,'Secondary date') RETURNING id`, [year, daysOpened]);
    const termId = Number(pt[0].id);
    const otherSchoolTermId = Number(st[0].id);
    termIds.push(termId, otherSchoolTermId);

    const mk = async (...args: Parameters<typeof makeUser>) => { const a = await makeUser(...args); actors.push(a); return a; };
    const teacherA = await mk('teacher', 'primary', CLASS_A);
    const teacherAB = await mk('teacher', 'primary', CLASS_A, [CLASS_B]);
    const teacherB = await mk('teacher', 'primary', CLASS_B);
    const subjectOnlyNoClass = await mk('teacher', 'primary', null);
    const subjectOnlyWithGrant = await mk('teacher', 'primary', null, [CLASS_A]);
    const secondaryTeacher = await mk('teacher', 'secondary', 'Secondary Class');
    const schoolAdmin = await mk('admin', 'primary', null);
    const otherSchoolAdmin = await mk('admin', 'secondary', null);
    const globalAdmin = await mk('admin', null, null);

    const studentA = await makeStudent('primary', CLASS_A);
    const studentB = await makeStudent('primary', CLASS_B);
    const deletedStudentB = await makeStudent('primary', CLASS_B, { deleted: true });
    students.push(studentA, studentB, deletedStudentB);

    const app = express();
    app.use(express.json());
    app.use('/academic', academicRouter);
    app.use('/attendance', attendanceRouter);
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => { server!.once('listening', resolve); server!.once('error', reject); });
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    const send = (method: string, path: string, actor: Actor, body: unknown) => fetch(`${baseUrl}${path}`, {
      method, headers: { authorization: `Bearer ${actor.token}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
    });

    await run({
      termId, otherSchoolTermId, teacherA, teacherAB, teacherB, subjectOnlyNoClass, subjectOnlyWithGrant,
      secondaryTeacher, schoolAdmin, otherSchoolAdmin, globalAdmin, studentA, studentB, deletedStudentB, baseUrl,
      put: (id, actor, body) => send('PUT', `/academic/terms/${id}`, actor, body),
      bulk: (actor, body) => send('PUT', '/attendance/bulk', actor, body),
      post: (actor, body) => send('POST', '/academic/terms', actor, body),
      term: async (id = termId) => {
        const { rows } = await query('SELECT days_opened,next_term_begins,name,is_current FROM terms WHERE id=$1', [id]);
        return rows[0];
      },
      setAttendance: async (studentId, days) => {
        await query(
          `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
           ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3`, [studentId, termId, days]);
      },
      lock: async (className, id = termId) => {
        await query(
          `INSERT INTO class_locks(school_code,class_name,term_id,locked_by) VALUES('primary',$1,$2,$3)
           ON CONFLICT DO NOTHING`, [className, id, teacherA.id]);
      },
    });
  } finally {
    if (server) { server.closeAllConnections(); await new Promise<void>(resolve => server!.close(() => resolve())); }
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    if (students.length) {
      await query('DELETE FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])', [students]);
      await query('DELETE FROM students WHERE id=ANY($1::uuid[])', [students]);
    }
    if (actors.length) await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [actors.map(a => a.id)]);
  }
}

async function auditRows(termId: number) {
  const { rows } = await query(
    `SELECT action, entity, school_code, actor_role, detail, metadata, outcome
     FROM audit_log WHERE entity='term' AND entity_id=$1 ORDER BY id`, [String(termId)]);
  return rows;
}

// ── 1. Stale forms ────────────────────────────────────────────────────────────
test('an ordinary attendance save never overwrites newer term settings with stale form values', async () => {
  await withFixture({ daysOpened: 60, nextTerm: 'Original date' }, async c => {
    // Teacher A's screen loaded days_opened=60 / 'Original date'. Meanwhile an admin updated both.
    const adminUpdate = await c.put(c.termId, c.schoolAdmin, { days_opened: 70, next_term_begins: 'Newer date' });
    assert.equal(adminUpdate.status, 200);

    // The fixed client sends ONLY attendance. Even a stale client that still includes the old
    // term fields in the body must not be able to move term settings through the attendance route.
    const save = await c.bulk(c.teacherA, {
      term_id: c.termId, entries: [{ student_id: c.studentA, days_present: 55 }],
      days_opened: 60, next_term_begins: 'Original date',
    });
    assert.equal(save.status, 200);
    const after = await c.term();
    assert.equal(after.days_opened, 70, 'attendance save must not roll days_opened back to the stale value');
    assert.equal(after.next_term_begins, 'Newer date', 'attendance save must not restore the stale next-term date');
  });
});

test('a term update changes only the fields it sends (no stale sibling overwrite)', async () => {
  await withFixture({ daysOpened: 60, nextTerm: 'Keep me' }, async c => {
    const daysOnly = await c.put(c.termId, c.teacherA, { days_opened: 62 });
    assert.equal(daysOnly.status, 200);
    assert.deepEqual(
      { d: (await c.term()).days_opened, n: (await c.term()).next_term_begins }, { d: 62, n: 'Keep me' });

    const nextOnly = await c.put(c.termId, c.teacherA, { next_term_begins: 'Tuesday, 13th January' });
    assert.equal(nextOnly.status, 200);
    assert.deepEqual(
      { d: (await c.term()).days_opened, n: (await c.term()).next_term_begins }, { d: 62, n: 'Tuesday, 13th January' });

    const empty = await c.put(c.termId, c.teacherA, {});
    assert.equal(empty.status, 400, 'a teacher request with no settings is rejected, not treated as a no-op save');
  });
});

// ── 2. Class locks ────────────────────────────────────────────────────────────
test('class locks block teacher term-setting updates but not admins or unrelated classes', async () => {
  await withFixture({}, async c => {
    await c.lock(CLASS_A);
    const lockedOwn = await c.put(c.termId, c.teacherA, { days_opened: 61 });
    assert.equal(lockedOwn.status, 403);
    assert.match(((await lockedOwn.json()) as { error: string }).error, /locked/i);

    // Multi-class teacher: ANY assigned class locked blocks (the value is shared school-wide).
    const partialLock = await c.put(c.termId, c.teacherAB, { next_term_begins: 'Blocked by A lock' });
    assert.equal(partialLock.status, 403);

    // A lock on a class this teacher does not teach is irrelevant to them.
    const unrelated = await c.put(c.termId, c.teacherB, { days_opened: 61 });
    assert.equal(unrelated.status, 200);

    // Admins keep the ability to write past a class lock.
    const admin = await c.put(c.termId, c.schoolAdmin, { days_opened: 63 });
    assert.equal(admin.status, 200);
    const globalAdmin = await c.put(c.termId, c.globalAdmin, { days_opened: 64 });
    assert.equal(globalAdmin.status, 200);

    // A lock on the same class for a DIFFERENT term does not leak across terms.
    const { rows: other } = await query(
      `INSERT INTO terms(name,academic_year,school_code,days_opened) VALUES('2nd Term',(SELECT academic_year FROM terms WHERE id=$1),'primary',40) RETURNING id`,
      [c.termId]);
    const otherTermId = Number(other[0].id);
    try {
      const otherTerm = await c.put(otherTermId, c.teacherA, { days_opened: 41 });
      assert.equal(otherTerm.status, 200, 'lock is per (class, term)');
    } finally { await query('DELETE FROM terms WHERE id=$1', [otherTermId]); }

    assert.equal((await c.term()).days_opened, 64);
  });
});

// ── 3. Cross-school ───────────────────────────────────────────────────────────
test('term settings cannot be updated across schools', async () => {
  await withFixture({}, async c => {
    const before = await c.term(c.otherSchoolTermId);
    for (const actor of [c.teacherA, c.schoolAdmin]) {
      const res = await c.put(c.otherSchoolTermId, actor, { days_opened: 10 });
      assert.equal(res.status, 404, 'other-school terms look not-found, not forbidden');
    }
    const secondaryAgainstPrimary = await c.put(c.termId, c.secondaryTeacher, { days_opened: 10 });
    assert.equal(secondaryAgainstPrimary.status, 404);
    const otherAdminAgainstPrimary = await c.put(c.termId, c.otherSchoolAdmin, { days_opened: 10 });
    assert.equal(otherAdminAgainstPrimary.status, 404);
    assert.deepEqual(await c.term(c.otherSchoolTermId), before);
    assert.equal((await c.term()).days_opened, 60);
    // A global admin retains cross-school reach.
    const global = await c.put(c.otherSchoolTermId, c.globalAdmin, { days_opened: 11 });
    assert.equal(global.status, 200);
  });
});

// ── 4. Subject-only teachers ──────────────────────────────────────────────────
test('subject-only teachers cannot update term settings', async () => {
  await withFixture({}, async c => {
    for (const actor of [c.subjectOnlyNoClass, c.subjectOnlyWithGrant]) {
      const res = await c.put(c.termId, actor, { days_opened: 50 });
      assert.equal(res.status, 403);
      const clear = await c.put(c.termId, actor, { next_term_begins: null });
      assert.equal(clear.status, 403);
    }
    const after = await c.term();
    assert.deepEqual({ d: after.days_opened, n: after.next_term_begins }, { d: 60, n: 'Monday, 12th January' });
  });
});

test('teachers cannot change anything beyond days_opened and next_term_begins', async () => {
  await withFixture({}, async c => {
    for (const body of [{ is_current: true }, { name: '2nd Term' }, { academic_year: '2099/2100' }, { start_date: '2030-01-01' }, { days_opened: 61, end_date: '2030-02-02' }]) {
      const res = await c.put(c.termId, c.teacherA, body);
      assert.equal(res.status, 403, JSON.stringify(body));
    }
    assert.equal((await c.term()).days_opened, 60, 'a rejected mixed request must not apply its permitted half');
  });
});

// ── 5. days_opened floor ─────────────────────────────────────────────────────
test('days_opened cannot drop below attendance already recorded for ANY class in the term', async () => {
  await withFixture({ daysOpened: 60 }, async c => {
    await c.setAttendance(c.studentA, 30);          // teacher A's own class
    await c.setAttendance(c.studentB, 55);          // a DIFFERENT class in the same school/term
    const lowerBelowOtherClass = await c.put(c.termId, c.teacherA, { days_opened: 50 });
    assert.equal(lowerBelowOtherClass.status, 409, 'teacher A cannot lower below class B recorded attendance');
    const body = await lowerBelowOtherClass.json() as { error: string; highest_days_present: number };
    assert.equal(body.highest_days_present, 55);
    assert.equal((await c.term()).days_opened, 60);

    const adminLower = await c.put(c.termId, c.schoolAdmin, { days_opened: 40 });
    assert.equal(adminLower.status, 409, 'admins are held to the same floor, so reports never exceed 100%');
    assert.equal((await c.term()).days_opened, 60);

    const exactlyAtFloor = await c.put(c.termId, c.teacherA, { days_opened: 55 });
    assert.equal(exactlyAtFloor.status, 200);
    assert.equal((await c.term()).days_opened, 55);

    // Raising is always fine.
    assert.equal((await c.put(c.termId, c.teacherA, { days_opened: 58 })).status, 200);
  });
});

test('soft-deleted students still count toward the days_opened floor', async () => {
  await withFixture({ daysOpened: 60 }, async c => {
    await c.setAttendance(c.deletedStudentB, 58);   // restorable student; would exceed 100% if restored
    const res = await c.put(c.termId, c.schoolAdmin, { days_opened: 57 });
    assert.equal(res.status, 409);
  });
});

test('attendance saved after a days_opened change is validated against the new value', async () => {
  await withFixture({ daysOpened: 60 }, async c => {
    assert.equal((await c.put(c.termId, c.teacherA, { days_opened: 40 })).status, 200);
    const tooMany = await c.bulk(c.teacherA, { term_id: c.termId, entries: [{ student_id: c.studentA, days_present: 41 }] });
    assert.equal(tooMany.status, 400);
    const ok = await c.bulk(c.teacherA, { term_id: c.termId, entries: [{ student_id: c.studentA, days_present: 40 }] });
    assert.equal(ok.status, 200);
  });
});

test('the write path re-validates days_present under the term lock (route pre-check bypassed)', async () => {
  await withFixture({ daysOpened: 60 }, async c => {
    await query('UPDATE terms SET days_opened=40 WHERE id=$1', [c.termId]);
    await assert.rejects(
      saveAttendanceBulk([{ student_id: c.studentA, days_present: 50 }], c.termId),
      (error: unknown) => error instanceof AttendanceTermLimitError,
    );
    const { rows } = await query('SELECT 1 FROM attendance WHERE student_id=$1 AND term_id=$2', [c.studentA, c.termId]);
    assert.equal(rows.length, 0, 'a refused batch leaves no attendance behind');
  });
});

test('an in-flight attendance save and a days_opened reduction serialize instead of racing', async () => {
  await withFixture({ daysOpened: 60 }, async c => {
    const client = await pool.connect();
    let reduction: Promise<Response> | undefined;
    try {
      await client.query('BEGIN');
      // This is exactly what saveAttendanceBulk does: share-lock the term, then write.
      await client.query('SELECT days_opened FROM terms WHERE id=$1 FOR SHARE', [c.termId]);
      await client.query('INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,58)', [c.studentA, c.termId]);
      // The reduction must wait for the uncommitted save rather than measuring the table without it.
      reduction = c.put(c.termId, c.schoolAdmin, { days_opened: 50 });
      await new Promise(resolve => setTimeout(resolve, 400));
      await client.query('COMMIT');
    } finally { client.release(); }
    const res = await reduction!;
    assert.equal(res.status, 409, 'the reduction observes the just-committed attendance of 58');
    assert.equal((await c.term()).days_opened, 60);
  });
});

// ── 6. next_term_begins and days_opened validation ────────────────────────────
test('next_term_begins accepts existing free-text labels and rejects unsafe values', async () => {
  await withFixture({ nextTerm: null }, async c => {
    const valid = ['Monday, 12th January', '14th January 2025', '2026-01-12', '12/01/2026', 'January 2026 (date TBC)', 'Lundi 12 janvier', 'a'.repeat(120)];
    for (const value of valid) {
      const res = await c.put(c.termId, c.teacherA, { next_term_begins: `  ${value}  ` });
      assert.equal(res.status, 200, `should accept: ${value.slice(0, 30)}`);
      assert.equal((await c.term()).next_term_begins, value, 'value is stored trimmed, otherwise as typed (no reformatting)');
    }
    const invalid: unknown[] = [123, true, {}, ['x'], 'a'.repeat(121), 'Line one\nLine two', 'tab\there', '---', '   !!! ', '\u0000'];
    for (const value of invalid) {
      const before = (await c.term()).next_term_begins;
      const res = await c.put(c.termId, c.teacherA, { next_term_begins: value });
      assert.equal(res.status, 400, `should reject: ${JSON.stringify(value)?.slice(0, 30)}`);
      assert.equal((await c.term()).next_term_begins, before, 'a rejected value changes nothing');
    }
  });
});

test('next_term_begins can be deliberately cleared with null or blank text', async () => {
  await withFixture({ daysOpened: 60, nextTerm: 'Monday, 12th January' }, async c => {
    for (const clear of [null, '', '   ']) {
      await query(`UPDATE terms SET next_term_begins='Some date' WHERE id=$1`, [c.termId]);
      const res = await c.put(c.termId, c.teacherA, { next_term_begins: clear });
      assert.equal(res.status, 200, `clear with ${JSON.stringify(clear)}`);
      const term = await c.term();
      assert.equal(term.next_term_begins, null);
      assert.equal(term.days_opened, 60, 'clearing the date leaves days_opened alone');
    }
    await query(`UPDATE terms SET next_term_begins='Admin date' WHERE id=$1`, [c.termId]);
    assert.equal((await c.put(c.termId, c.schoolAdmin, { next_term_begins: null })).status, 200);
    assert.equal((await c.term()).next_term_begins, null);
  });
});

test('days_opened must be a whole, non-negative, in-range number and cannot be cleared', async () => {
  await withFixture({ daysOpened: 60 }, async c => {
    for (const value of [1.5, -1, '60', 2_147_483_648, Number.NaN, {}, [], null]) {
      const res = await c.put(c.termId, c.teacherA, { days_opened: value as never });
      assert.equal(res.status, 400, `reject ${JSON.stringify(value)}`);
    }
    assert.equal((await c.term()).days_opened, 60);
    assert.equal((await c.put(c.termId, c.teacherA, { days_opened: 0 })).status, 200);
  });
});

test('creating a term normalizes and validates next_term_begins the same way', async () => {
  await withFixture({}, async c => {
    const year = `TSP/${randomUUID().slice(0, 8)}`;
    const created: number[] = [];
    try {
      const bad = await c.post(c.schoolAdmin, { name: '1st Term', academic_year: year, school_code: 'primary', days_opened: 10, next_term_begins: '---' });
      assert.equal(bad.status, 400);
      const blank = await c.post(c.schoolAdmin, { name: '1st Term', academic_year: year, school_code: 'primary', days_opened: 10, next_term_begins: '   ' });
      assert.equal(blank.status, 201);
      const term = ((await blank.json()) as { term: { id: number; next_term_begins: string | null } }).term;
      created.push(term.id);
      assert.equal(term.next_term_begins, null, 'blank means no date, not an empty string');
    } finally { if (created.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [created]); }
  });
});

// ── 7. Admin permissions ──────────────────────────────────────────────────────
test('admins keep broader term-management permissions', async () => {
  await withFixture({}, async c => {
    const full = await c.put(c.termId, c.schoolAdmin, {
      name: '2nd Term', is_current: true, start_date: '2030-01-07', end_date: '2030-04-01', days_opened: 61, next_term_begins: 'April 2030',
    });
    assert.equal(full.status, 200);
    const term = await c.term();
    assert.deepEqual(
      { name: term.name, current: term.is_current, d: term.days_opened, n: term.next_term_begins },
      { name: '2nd Term', current: true, d: 61, n: 'April 2030' });
    assert.equal((await c.put(c.termId, c.globalAdmin, { days_opened: 62 })).status, 200);
    assert.equal((await c.put(c.termId, c.schoolAdmin, { name: 'Not a term' })).status, 400);
  });
});

// ── 8. Audit ──────────────────────────────────────────────────────────────────
test('meaningful term-setting changes are audited atomically; no-ops and denials are not recorded as changes', async () => {
  await withFixture({ daysOpened: 60, nextTerm: 'Old date' }, async c => {
    assert.equal((await auditRows(c.termId)).length, 0);

    const change = await c.put(c.termId, c.teacherA, { days_opened: 65, next_term_begins: 'New date' });
    assert.equal(change.status, 200);
    let rows = await auditRows(c.termId);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].action, 'update_term_settings');
    assert.equal(rows[0].school_code, 'primary');
    assert.equal(rows[0].actor_role, 'teacher');
    assert.equal(rows[0].outcome, 'success');
    const changes = (rows[0].metadata as { changes: Record<string, { from: unknown; to: unknown }> }).changes;
    assert.deepEqual(changes.days_opened, { from: 60, to: 65 });
    assert.deepEqual(changes.next_term_begins, { from: 'Old date', to: 'New date' });

    // Same values again: nothing changed, nothing audited.
    assert.equal((await c.put(c.termId, c.teacherA, { days_opened: 65, next_term_begins: 'New date' })).status, 200);
    assert.equal((await auditRows(c.termId)).length, 1);

    // Clearing the date is a meaningful change.
    assert.equal((await c.put(c.termId, c.teacherA, { next_term_begins: null })).status, 200);
    rows = await auditRows(c.termId);
    assert.equal(rows.length, 2);
    assert.deepEqual((rows[1].metadata as any).changes.next_term_begins, { from: 'New date', to: null });

    // Refused requests change nothing and add no change record.
    await c.lock(CLASS_A);
    assert.equal((await c.put(c.termId, c.teacherA, { days_opened: 10 })).status, 403);
    await c.setAttendance(c.studentB, 64);
    assert.equal((await c.put(c.termId, c.schoolAdmin, { days_opened: 10 })).status, 409);
    assert.equal((await auditRows(c.termId)).length, 2);

    // Admin changes are audited too, with the admin as actor.
    assert.equal((await c.put(c.termId, c.schoolAdmin, { days_opened: 66 })).status, 200);
    rows = await auditRows(c.termId);
    assert.equal(rows.length, 3);
    assert.equal(rows[2].actor_role, 'admin');
  });
});
