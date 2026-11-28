import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after, before } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import studentsRouter from '../backend/src/routes/students.js';
import { signAccess } from '../backend/src/utils/jwt.js';

// Teacher promote / retain / remove workflow for one, several and no assigned
// physical classes. Only report_roster_memberships and its append-only history
// may change; the student record, online account and scores must not.

let server: Server;
let baseUrl: string;
const userIds: string[] = [];

type Role = 'admin' | 'teacher';
interface Actor { id: string; headers: Record<string, string> }

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/students', studentsRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/students`;
});

after(async () => {
  server.closeAllConnections();
  await new Promise<void>(resolve => server.close(() => resolve()));
  // The append-only history intentionally keeps the synthetic test rows; they
  // live under unique synthetic school codes in a disposable database.
  if (userIds.length) await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]);
  await pool.end();
});

async function makeSchool(suffix: string, label: string) {
  const code = `tp_${label}_${suffix.slice(0, 10)}`;
  await query('INSERT INTO schools(code,name) VALUES($1,$2)', [code, `Teacher Promotion ${label} ${suffix}`]);
  await query(
    `INSERT INTO classes(school_code,name) VALUES($1,'Primary 2'),($1,'Primary 3'),($1,'Primary 4'),($1,'Primary 5')`,
    [code],
  );
  return code;
}

async function makeActor(opts: {
  role: Role; school: string; label: string; suffix: string;
  assignedClass: string | null; classNames?: string[];
}): Promise<Actor> {
  const username = `tp-${opts.label}-${opts.suffix}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,$6::text[],TRUE,FALSE) RETURNING id`,
    [username, opts.role, `Test ${opts.label}`, opts.school, opts.assignedClass, opts.classNames ?? []],
  );
  const id = String(rows[0].id);
  userIds.push(id);
  const token = signAccess({
    id, username, role: opts.role, school_code: opts.school,
    assigned_class: opts.assignedClass, assigned_subject_ids: [],
  });
  return { id, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
}

async function makeStudent(school: string, className: string, name: string) {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code) VALUES($1,$2,$3) RETURNING id`,
    [name, className, school],
  );
  const id = String(rows[0].id);
  await query(
    `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status) VALUES($1,$2,$2,'active')`,
    [id, className],
  );
  return id;
}

const decide = (actor: Actor, studentId: string, body: Record<string, unknown>) => fetch(`${baseUrl}/${studentId}/promotion`, {
  method: 'POST', headers: actor.headers, body: JSON.stringify(body),
});

const roster = async (actor: Actor, className?: string) => {
  const response = await fetch(className ? `${baseUrl}?class_name=${encodeURIComponent(className)}` : baseUrl, { headers: actor.headers });
  const body = await response.json() as { students?: Array<{ id: string; class_name: string }>; error?: string };
  return { status: response.status, students: body.students ?? [], error: body.error };
};

const membership = async (studentId: string) => (await query(
  'SELECT class_name,status FROM report_roster_memberships WHERE student_id=$1', [studentId],
)).rows[0] as { class_name: string; status: string };

const eventTypes = async (studentId: string) => (await query(
  'SELECT event_type,details FROM report_roster_membership_events WHERE student_id=$1 ORDER BY id', [studentId],
)).rows as Array<{ event_type: string; details: { actor_role?: string } }>;

/** Everything that must NOT change when only roster placement changes. */
async function protectedSnapshot(studentId: string) {
  const student = (await query('SELECT * FROM students WHERE id=$1', [studentId])).rows[0];
  const scores = (await query('SELECT * FROM scores WHERE student_id=$1 ORDER BY id', [studentId])).rows;
  return JSON.stringify({ student, scores });
}

async function withHistory(school: string, studentId: string, suffix: string, linkAccount: boolean) {
  const { rows: subjects } = await query('INSERT INTO subjects(name) VALUES($1) RETURNING id', [`TP Subject ${suffix}-${studentId.slice(0, 6)}`]);
  const { rows: terms } = await query(
    `INSERT INTO terms(name,academic_year,school_code,days_opened) VALUES('1st Term',$1,$2,20) RETURNING id`,
    [`TP-${suffix.slice(0, 8)}`, school],
  );
  const { rows: current } = await query('SELECT class_name FROM students WHERE id=$1', [studentId]);
  await query(
    `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,class_name) VALUES($1,$2,$3,10,10,50,$4)`,
    [studentId, subjects[0].id, terms[0].id, current[0].class_name],
  );
  if (linkAccount) {
    const { rows: account } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','student','Online Learner',$2,TRUE,FALSE) RETURNING id`,
      [`tp-online-${suffix}-${studentId.slice(0, 6)}`, school],
    );
    userIds.push(String(account[0].id));
    await query('UPDATE students SET user_id=$1 WHERE id=$2', [account[0].id, studentId]);
  }
}

test('single-class teacher: sees only that class and can promote, retain and remove', async () => {
  const suffix = randomUUID();
  const school = await makeSchool(suffix, 'single');
  const teacher = await makeActor({ role: 'teacher', school, label: 'single', suffix, assignedClass: 'Primary 2' });
  const [promoteId, retainId, removeId] = [
    await makeStudent(school, 'Primary 2', `Single Promote ${suffix}`),
    await makeStudent(school, 'Primary 2', `Single Retain ${suffix}`),
    await makeStudent(school, 'Primary 2', `Single Remove ${suffix}`),
  ];
  const otherClassId = await makeStudent(school, 'Primary 4', `Single Other Class ${suffix}`);
  await withHistory(school, promoteId, suffix, true);
  const before = await protectedSnapshot(promoteId);

  const listed = await roster(teacher);
  assert.equal(listed.status, 200);
  assert.deepEqual(listed.students.map(s => s.id).sort(), [promoteId, retainId, removeId].sort(),
    'a one-class teacher sees exactly their own class without choosing one');
  assert.ok(listed.students.every(s => s.class_name === 'Primary 2'));

  const promoted = await decide(teacher, promoteId, { action: 'promote', expected_class_name: 'Primary 2' });
  assert.equal(promoted.status, 200);
  const promotedBody = await promoted.json() as { from_class: string; to_class: string; online_account_unchanged: boolean };
  assert.deepEqual([promotedBody.from_class, promotedBody.to_class, promotedBody.online_account_unchanged], ['Primary 2', 'Primary 3', true]);
  assert.equal((await decide(teacher, retainId, { action: 'retain' })).status, 200);
  assert.equal((await decide(teacher, removeId, { action: 'remove' })).status, 200);

  assert.deepEqual(await membership(promoteId), { class_name: 'Primary 3', status: 'active' });
  assert.deepEqual(await membership(retainId), { class_name: 'Primary 2', status: 'active' });
  assert.deepEqual(await membership(removeId), { class_name: 'Primary 2', status: 'removed' });
  assert.deepEqual(await membership(otherClassId), { class_name: 'Primary 4', status: 'active' }, 'a student outside the class is untouched');

  assert.equal(await protectedSnapshot(promoteId), before,
    'student record, online-account link and historical scores must not change');
  const removedStudent = (await query('SELECT class_name,deleted_at FROM students WHERE id=$1', [removeId])).rows[0];
  assert.equal(removedStudent.class_name, 'Primary 2');
  assert.equal(removedStudent.deleted_at, null, 'removal leaves the roster only; the student is not soft-deleted');

  assert.deepEqual((await eventTypes(promoteId)).map(e => [e.event_type, e.details.actor_role]), [['class_changed', 'teacher']]);
  assert.deepEqual((await eventTypes(retainId)).map(e => [e.event_type, e.details.actor_role]), [['retained', 'teacher']]);
  assert.deepEqual((await eventTypes(removeId)).map(e => [e.event_type, e.details.actor_role]), [['removed', 'teacher']]);
  const { rows: audit } = await query(
    `SELECT action,actor_role FROM audit_log WHERE entity='student' AND entity_id=ANY($1::text[]) ORDER BY id`,
    [[promoteId, retainId, removeId]],
  );
  assert.deepEqual(audit.map(a => [a.action, a.actor_role]), [
    ['promote_report_roster_student', 'teacher'],
    ['retain_report_roster_student', 'teacher'],
    ['remove_report_roster_membership', 'teacher'],
  ]);
});

test('multi-class teacher: each class can be selected independently and only its students are processed', async () => {
  const suffix = randomUUID();
  const school = await makeSchool(suffix, 'multi');
  const teacher = await makeActor({
    role: 'teacher', school, label: 'multi', suffix,
    assignedClass: 'Primary 2', classNames: ['Primary 2', 'Primary 4'],
  });
  const p2 = [await makeStudent(school, 'Primary 2', `Multi P2 A ${suffix}`), await makeStudent(school, 'Primary 2', `Multi P2 B ${suffix}`)];
  const p4 = [await makeStudent(school, 'Primary 4', `Multi P4 A ${suffix}`), await makeStudent(school, 'Primary 4', `Multi P4 B ${suffix}`)];
  const unassigned = await makeStudent(school, 'Primary 3', `Multi P3 unassigned ${suffix}`);

  const forP2 = await roster(teacher, 'Primary 2');
  assert.equal(forP2.status, 200);
  assert.deepEqual(forP2.students.map(s => s.id).sort(), [...p2].sort(), 'selecting Primary 2 lists only Primary 2');
  const forP4 = await roster(teacher, 'Primary 4');
  assert.deepEqual(forP4.students.map(s => s.id).sort(), [...p4].sort(), 'selecting Primary 4 lists only Primary 4');
  const combined = await roster(teacher);
  assert.deepEqual(combined.students.map(s => s.id).sort(), [...p2, ...p4].sort(),
    'without a selection the API returns the combined assigned roster, never an unassigned class');
  assert.ok(!combined.students.some(s => s.id === unassigned));

  // Primary 2 work does not touch Primary 4 and vice versa.
  assert.equal((await decide(teacher, p2[0], { action: 'promote', expected_class_name: 'Primary 2' })).status, 200);
  assert.equal((await decide(teacher, p2[1], { action: 'retain', expected_class_name: 'Primary 2' })).status, 200);
  assert.deepEqual(await membership(p4[0]), { class_name: 'Primary 4', status: 'active' });
  assert.deepEqual(await membership(p4[1]), { class_name: 'Primary 4', status: 'active' });

  const p4Promote = await decide(teacher, p4[0], { action: 'promote', expected_class_name: 'Primary 4' });
  assert.equal(p4Promote.status, 200);
  assert.equal(((await p4Promote.json()) as { to_class: string }).to_class, 'Primary 5');
  assert.equal((await decide(teacher, p4[1], { action: 'remove', expected_class_name: 'Primary 4' })).status, 200);

  assert.deepEqual(await membership(p2[0]), { class_name: 'Primary 3', status: 'active' });
  assert.deepEqual(await membership(p2[1]), { class_name: 'Primary 2', status: 'active' });
  assert.deepEqual(await membership(p4[0]), { class_name: 'Primary 5', status: 'active' });
  assert.deepEqual(await membership(p4[1]), { class_name: 'Primary 4', status: 'removed' });
  assert.deepEqual(await membership(unassigned), { class_name: 'Primary 3', status: 'active' });

  // The screen names the class it is showing; a stale or wrong class is refused.
  const wrongClass = await decide(teacher, p2[1], { action: 'promote', expected_class_name: 'Primary 4' });
  assert.equal(wrongClass.status, 409, 'a decision naming a different class than the student is in must be refused');
  assert.deepEqual(await membership(p2[1]), { class_name: 'Primary 2', status: 'active' });
  assert.equal((await decide(teacher, p2[1], { action: 'promote', expected_class_name: '' })).status, 400);
  assert.equal((await decide(teacher, p2[1], { action: 'promote', expected_class_name: 7 })).status, 400);
});

test('teacher cannot browse or act on an unassigned class, even in their own school', async () => {
  const suffix = randomUUID();
  const school = await makeSchool(suffix, 'unassigned');
  const teacher = await makeActor({
    role: 'teacher', school, label: 'unassigned', suffix,
    assignedClass: 'Primary 2', classNames: ['Primary 2', 'Primary 4'],
  });
  const outsider = await makeStudent(school, 'Primary 3', `Unassigned Class Student ${suffix}`);
  await withHistory(school, outsider, suffix, false);
  const before = await protectedSnapshot(outsider);

  const browse = await roster(teacher, 'Primary 3');
  assert.equal(browse.status, 403, 'requesting an unassigned class is rejected');
  assert.equal(browse.students.length, 0);

  for (const action of ['promote', 'retain', 'remove']) {
    const response = await decide(teacher, outsider, { action, expected_class_name: 'Primary 3' });
    assert.equal(response.status, 404, `${action} on an unassigned class must be rejected`);
  }
  assert.deepEqual(await membership(outsider), { class_name: 'Primary 3', status: 'active' });
  assert.equal(await protectedSnapshot(outsider), before);
  assert.deepEqual(await eventTypes(outsider), [], 'rejected requests append no history');
});

test('teacher cannot act across schools even when the class name matches', async () => {
  const suffix = randomUUID();
  const schoolA = await makeSchool(suffix, 'xa');
  const schoolB = await makeSchool(suffix, 'xb');
  const teacherA = await makeActor({ role: 'teacher', school: schoolA, label: 'xa', suffix, assignedClass: 'Primary 4' });
  const teacherB = await makeActor({ role: 'teacher', school: schoolB, label: 'xb', suffix, assignedClass: 'Primary 4' });
  const studentA = await makeStudent(schoolA, 'Primary 4', `School A Student ${suffix}`);
  const studentB = await makeStudent(schoolB, 'Primary 4', `School B Student ${suffix}`);

  for (const action of ['promote', 'retain', 'remove']) {
    assert.equal((await decide(teacherA, studentB, { action })).status, 404, `school A teacher cannot ${action} a school B student`);
    assert.equal((await decide(teacherB, studentA, { action })).status, 404, `school B teacher cannot ${action} a school A student`);
  }
  assert.deepEqual(await membership(studentA), { class_name: 'Primary 4', status: 'active' });
  assert.deepEqual(await membership(studentB), { class_name: 'Primary 4', status: 'active' });
  assert.deepEqual(await eventTypes(studentA), []);
  assert.deepEqual(await eventTypes(studentB), []);
  assert.ok(!(await roster(teacherA)).students.some(s => s.id === studentB), 'rosters never cross schools');
});

test('subject-only and unassigned teachers cannot make roster decisions', async () => {
  const suffix = randomUUID();
  const school = await makeSchool(suffix, 'subject');
  const subjectOnly = await makeActor({
    role: 'teacher', school, label: 'subjectonly', suffix, assignedClass: null, classNames: ['Primary 2'],
  });
  const nothing = await makeActor({ role: 'teacher', school, label: 'nothing', suffix, assignedClass: null, classNames: [] });
  const studentId = await makeStudent(school, 'Primary 2', `Subject Teacher Target ${suffix}`);

  for (const [name, actor] of [['subject-only', subjectOnly], ['no assignment', nothing]] as const) {
    for (const action of ['promote', 'retain', 'remove', 'demote', 'reinstate']) {
      const response = await decide(actor, studentId, { action });
      assert.equal(response.status, 403, `${name} teacher must not ${action}`);
    }
  }
  assert.deepEqual(await membership(studentId), { class_name: 'Primary 2', status: 'active' });
  assert.deepEqual(await eventTypes(studentId), []);
});

test('demotion and reinstatement stay administrator-only and history is preserved', async () => {
  const suffix = randomUUID();
  const school = await makeSchool(suffix, 'adminonly');
  const teacher = await makeActor({ role: 'teacher', school, label: 'adminonly', suffix, assignedClass: 'Primary 4' });
  const admin = await makeActor({ role: 'admin', school, label: 'adminonly-admin', suffix, assignedClass: null });
  const demoteTarget = await makeStudent(school, 'Primary 4', `Admin Demote ${suffix}`);
  const removeThenRestore = await makeStudent(school, 'Primary 4', `Admin Restore ${suffix}`);

  assert.equal((await decide(teacher, demoteTarget, { action: 'demote' })).status, 403, 'teacher cannot demote in their own class');
  assert.deepEqual(await membership(demoteTarget), { class_name: 'Primary 4', status: 'active' });

  assert.equal((await decide(teacher, removeThenRestore, { action: 'remove' })).status, 200);
  assert.equal((await decide(teacher, removeThenRestore, { action: 'reinstate' })).status, 403, 'teacher cannot reinstate');
  assert.equal((await decide(teacher, removeThenRestore, { action: 'promote' })).status, 409, 'a removed student cannot be promoted');
  const removedList = await fetch(`${baseUrl}/report-roster/removed`, { headers: teacher.headers });
  assert.equal(removedList.status, 403, 'teachers cannot list removed students');
  assert.deepEqual(await membership(removeThenRestore), { class_name: 'Primary 4', status: 'removed' });

  assert.equal((await decide(admin, demoteTarget, { action: 'demote' })).status, 200, 'administrator can still demote');
  assert.deepEqual(await membership(demoteTarget), { class_name: 'Primary 3', status: 'active' });
  assert.equal((await decide(admin, removeThenRestore, { action: 'reinstate' })).status, 200, 'administrator can still reinstate');
  assert.deepEqual(await membership(removeThenRestore), { class_name: 'Primary 4', status: 'active' });

  assert.deepEqual((await eventTypes(removeThenRestore)).map(e => [e.event_type, e.details.actor_role]), [
    ['removed', 'teacher'],
    ['reinstated', 'admin'],
  ], 'the teacher removal stays in history alongside the later administrator reinstatement');
});

/** Completed report data and the online account link: none of it may change. */
async function completedReportSnapshot(studentId: string) {
  const student = (await query('SELECT * FROM students WHERE id=$1', [studentId])).rows[0];
  const scores = (await query('SELECT * FROM scores WHERE student_id=$1 ORDER BY id', [studentId])).rows;
  const attendance = (await query('SELECT * FROM attendance WHERE student_id=$1 ORDER BY id', [studentId])).rows;
  const classRecords = (await query('SELECT * FROM class_records WHERE student_id=$1 ORDER BY id', [studentId])).rows;
  const account = student?.user_id
    ? (await query('SELECT id,username,role,school_code,is_active FROM users WHERE id=$1', [student.user_id])).rows[0]
    : null;
  return JSON.stringify({ student, scores, attendance, classRecords, account });
}

/** Every student, roster, history and audit row carrying this (unique) name. */
async function recordFootprint(fullName: string) {
  const count = async (sql: string) => (await query(sql, [fullName])).rows[0].n as number;
  const sameName = `lower(trim(s.full_name))=lower(trim($1))`;
  return {
    students: await count(`SELECT count(*)::int AS n FROM students s WHERE ${sameName}`),
    memberships: await count(`SELECT count(*)::int AS n FROM report_roster_memberships m JOIN students s ON s.id=m.student_id WHERE ${sameName}`),
    events: await count(`SELECT count(*)::int AS n FROM report_roster_membership_events e JOIN students s ON s.id=e.student_id WHERE ${sameName}`),
    audit: await count(`SELECT count(*)::int AS n FROM audit_log a JOIN students s ON s.id::text=a.entity_id WHERE a.entity='student' AND ${sameName}`),
  };
}

test('every cross-school promotion is administrator-only and rejected requests create no records', async () => {
  const suffix = randomUUID();
  // The cross-school path is keyed on the real school codes.
  await query("INSERT INTO schools(code,name) VALUES('primary','Primary Test School') ON CONFLICT(code) DO NOTHING");
  await query("INSERT INTO schools(code,name) VALUES('secondary','Secondary Test School') ON CONFLICT(code) DO NOTHING");
  await query("INSERT INTO classes(school_code,name) VALUES('primary','Primary 6') ON CONFLICT(school_code,name) DO NOTHING");
  await query("INSERT INTO classes(school_code,name) VALUES('secondary','JSS 1') ON CONFLICT(school_code,name) DO NOTHING");

  const classTeacher = await makeActor({ role: 'teacher', school: 'primary', label: 'xs-class', suffix, assignedClass: 'Primary 6' });
  const multiClassTeacher = await makeActor({
    role: 'teacher', school: 'primary', label: 'xs-multi', suffix,
    assignedClass: 'Primary 5', classNames: ['Primary 5', 'Primary 6'],
  });
  const otherSchoolAdmin = await makeActor({ role: 'admin', school: 'secondary', label: 'xs-other-admin', suffix, assignedClass: null });
  const admin = await makeActor({ role: 'admin', school: 'primary', label: 'xs-admin', suffix, assignedClass: null });

  const fullName = `Cross School Guard ${suffix}`;
  const sourceId = await makeStudent('primary', 'Primary 6', fullName);
  await withHistory('primary', sourceId, suffix, true);
  const { rows: scoreRows } = await query('SELECT term_id FROM scores WHERE student_id=$1', [sourceId]);
  await query('INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,18)', [sourceId, scoreRows[0].term_id]);
  await query(
    `INSERT INTO class_records(student_id,term_id,class_teacher_remark,admin_remark) VALUES($1,$2,'Completed remark','Completed admin remark')`,
    [sourceId, scoreRows[0].term_id],
  );

  const reportBefore = await completedReportSnapshot(sourceId);
  const footprintBefore = await recordFootprint(fullName);
  assert.deepEqual({ students: footprintBefore.students, memberships: footprintBefore.memberships, events: footprintBefore.events },
    { students: 1, memberships: 1, events: 0 });

  const rejected: Array<[string, Actor, Record<string, unknown>]> = [
    ['class teacher of Primary 6', classTeacher, { action: 'promote', expected_class_name: 'Primary 6' }],
    ['class teacher without an expected class', classTeacher, { action: 'promote' }],
    ['multi-class teacher holding Primary 6 only by class grant', multiClassTeacher, { action: 'promote', expected_class_name: 'Primary 6' }],
    ['administrator bound to another school', otherSchoolAdmin, { action: 'promote' }],
  ];
  for (const [who, actor, body] of rejected) {
    const response = await decide(actor, sourceId, body);
    assert.equal(response.status, 403, `${who} must not promote across the primary/secondary school boundary`);
    assert.deepEqual(await recordFootprint(fullName), footprintBefore, `${who}: a rejected request creates no student, roster, history or audit record`);
    assert.equal(await completedReportSnapshot(sourceId), reportBefore, `${who}: a rejected request changes no student, score, attendance, remark or account data`);
    assert.deepEqual(await membership(sourceId), { class_name: 'Primary 6', status: 'active' }, `${who}: roster placement is unchanged`);
    assert.deepEqual(await eventTypes(sourceId), [], `${who}: no history is appended`);
  }

  // Teachers keep their other decisions in the same class; only the school
  // boundary is closed to them. Retain is non-destructive, so it is safe to prove here.
  assert.equal((await decide(classTeacher, sourceId, { action: 'retain', expected_class_name: 'Primary 6' })).status, 200,
    'the Primary 6 class teacher can still retain in their own class');
  assert.deepEqual((await eventTypes(sourceId)).map(e => e.event_type), ['retained']);

  // The administrator of the student's own school can cross the boundary.
  const response = await decide(admin, sourceId, { action: 'promote', expected_class_name: 'Primary 6' });
  assert.equal(response.status, 200, 'the primary school administrator can promote into JSS 1');
  const promoted = await response.json() as { cross_section: boolean; to_class: string; destination_student_id: string; online_account_unchanged: boolean };
  assert.equal(promoted.cross_section, true);
  assert.equal(promoted.to_class, 'JSS 1');
  assert.equal(promoted.online_account_unchanged, true);

  const footprintAfter = await recordFootprint(fullName);
  assert.equal(footprintAfter.students, 2, 'exactly one new secondary report identity');
  assert.equal(footprintAfter.memberships, 2);
  assert.ok(footprintAfter.audit > footprintBefore.audit, 'the accepted promotion is audited');
  assert.equal(await completedReportSnapshot(sourceId), reportBefore,
    'promotion preserves the original student, scores, attendance, remarks and online account');
  assert.deepEqual(await membership(sourceId), { class_name: 'Primary 6', status: 'removed' }, 'old placement is kept as history, not deleted');
  assert.deepEqual(await membership(promoted.destination_student_id), { class_name: 'JSS 1', status: 'active' });
  const destination = (await query('SELECT school_code,user_id FROM students WHERE id=$1', [promoted.destination_student_id])).rows[0];
  assert.deepEqual(destination, { school_code: 'secondary', user_id: null }, 'the new identity is report-only, with no online account');
  assert.equal((await query('SELECT count(*)::int AS n FROM scores WHERE student_id=$1', [promoted.destination_student_id])).rows[0].n, 0,
    'no scores are copied or moved to the new identity');
  assert.deepEqual((await eventTypes(sourceId)).map(e => [e.event_type, e.details.actor_role]),
    [['retained', 'teacher'], ['removed', 'admin']], 'teacher retention and administrator promotion both stay in history');
});
