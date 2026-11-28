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
  if (userIds.length) {
    await query('DELETE FROM class_locks WHERE locked_by=ANY($1::uuid[])', [userIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]);
  }
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
const getJson = async (actor: Actor, path: string) => {
  const response = await fetch(`${baseUrl}${path}`, { headers: actor.headers });
  return { status: response.status, body: await response.json() as any };
};
const listClass = async (actor: Actor, className: string) =>
  (await getJson(actor, `?class_name=${encodeURIComponent(className)}`)).body.students as Array<{ id: string; class_name: string; roster_decision: string | null; admin_only_promotion: boolean }>;
const membership = async (studentId: string) => (await query(
  'SELECT class_name,status FROM report_roster_memberships WHERE student_id=$1', [studentId])).rows[0] as { class_name: string; status: string };
const events = async (studentId: string) => (await query(
  'SELECT event_type,details,actor_id FROM report_roster_membership_events WHERE student_id=$1 ORDER BY id', [studentId])).rows as Array<{ event_type: string; details: any; actor_id: string }>;
const auditActions = async (studentId: string) => (await query(
  `SELECT action FROM audit_log WHERE entity='student' AND entity_id=$1 ORDER BY id`, [studentId])).rows.map((r: any) => String(r.action));

/** A school with a current term, so decisions are keyed to a real academic year. */
async function makeCurrentTerm(school: string, year: string) {
  await query('UPDATE terms SET is_current=FALSE WHERE school_code=$1', [school]);
  const { rows } = await query(
    `INSERT INTO terms(name,academic_year,school_code,is_current,days_opened) VALUES('1st Term',$1,$2,TRUE,60) RETURNING id`, [year, school]);
  return Number(rows[0].id);
}
const lockClass = (school: string, className: string, termId: number, by: Actor) => query(
  'INSERT INTO class_locks(school_code,class_name,term_id,locked_by) VALUES($1,$2,$3,$4)', [school, className, termId, by.id]);

async function fixture(label: string) {
  const suffix = randomUUID();
  const school = await makeSchool(suffix, label);
  const year = `AY-${suffix.slice(0, 8)}`;
  const termId = await makeCurrentTerm(school, year);
  const admin = await makeActor({ role: 'admin', school, label: `${label}-admin`, suffix, assignedClass: null });
  const multi = await makeActor({ role: 'teacher', school, label: `${label}-multi`, suffix, assignedClass: 'Primary 3', classNames: ['Primary 3', 'Primary 4'] });
  const p4Teacher = await makeActor({ role: 'teacher', school, label: `${label}-p4`, suffix, assignedClass: 'Primary 4' });
  const p3Colleague = await makeActor({ role: 'teacher', school, label: `${label}-p3b`, suffix, assignedClass: 'Primary 3' });
  const subjectOnly = await makeActor({ role: 'teacher', school, label: `${label}-subj`, suffix, assignedClass: null, classNames: ['Primary 3'] });
  return { suffix, school, year, termId, admin, multi, p4Teacher, p3Colleague, subjectOnly };
}

// ── 1. Duplicate decisions ────────────────────────────────────────────────────
test('a student promoted through adjacent classes or two class lists cannot be promoted again in the same academic year', async () => {
  const f = await fixture('dup');
  const s = await makeStudent(f.school, 'Primary 3', `Dup Adjacent ${f.suffix}`);
  const first = await decide(f.multi, s, { action: 'promote', expected_class_name: 'Primary 3' });
  assert.equal(first.status, 200);
  assert.equal((await membership(s)).class_name, 'Primary 4');

  // The same multi-class teacher, now looking at the Primary 4 list (with or without the stale-screen guard).
  assert.equal((await decide(f.multi, s, { action: 'promote', expected_class_name: 'Primary 4' })).status, 409);
  assert.equal((await decide(f.multi, s, { action: 'promote' })).status, 409, 'no expected_class_name must not bypass the rule');
  // The Primary 4 teacher, who now sees the student arrive in their own list.
  assert.equal((await decide(f.p4Teacher, s, { action: 'promote' })).status, 409);
  // Any other decision in the same year is equally refused.
  assert.equal((await decide(f.p4Teacher, s, { action: 'retain' })).status, 409);
  assert.equal((await decide(f.p4Teacher, s, { action: 'remove' })).status, 409);
  assert.equal((await decide(f.admin, s, { action: 'promote' })).status, 409, 'administrators are held to one decision per year too');

  assert.equal((await membership(s)).class_name, 'Primary 4', 'still exactly one class forward');
  assert.deepEqual((await events(s)).map(e => e.event_type), ['class_changed'], 'exactly one history event');
  const arrived = (await listClass(f.p4Teacher, 'Primary 4')).find(r => r.id === s);
  assert.equal(arrived?.roster_decision, 'promote', 'the Primary 4 list shows the student as already decided');
});

test('concurrent identical decisions record exactly one', async () => {
  const f = await fixture('race');
  for (const action of ['promote', 'retain', 'remove'] as const) {
    const s = await makeStudent(f.school, 'Primary 3', `Race ${action} ${f.suffix}`);
    const results = await Promise.all([decide(f.multi, s, { action }), decide(f.p3Colleague, s, { action }), decide(f.admin, s, { action })]);
    const statuses = results.map(r => r.status);
    assert.equal(statuses.filter(code => code === 200).length, 1, `${action}: exactly one request wins (${statuses})`);
    // The losers are refused: 409 (already decided) or 404 (the winner already moved the student out of that teacher's class).
    assert.ok(statuses.filter(code => code !== 200).every(code => code === 409 || code === 404), `${action}: ${statuses}`);
    assert.equal((await events(s)).length, 1, `${action}: one history event`);
  }
});

test('conflicting decisions are refused; administrators can supersede a retain and correct the others with their inverse', async () => {
  const f = await fixture('conflict');
  const retained = await makeStudent(f.school, 'Primary 3', `Retained ${f.suffix}`);
  assert.equal((await decide(f.multi, retained, { action: 'retain' })).status, 200);
  assert.equal((await decide(f.multi, retained, { action: 'promote' })).status, 409, 'teacher: retain then promote');
  assert.equal((await decide(f.multi, retained, { action: 'remove' })).status, 409, 'teacher: retain then remove');
  assert.equal((await decide(f.admin, retained, { action: 'retain' })).status, 409, 'a repeated retain is a duplicate');
  assert.equal((await decide(f.admin, retained, { action: 'promote' })).status, 200, 'administrator supersedes a retain (it has no inverse)');
  assert.equal((await membership(retained)).class_name, 'Primary 4');

  // Promote -> admin demote voids the decision and the cycle can be done again.
  const promoted = await makeStudent(f.school, 'Primary 3', `Promoted ${f.suffix}`);
  assert.equal((await decide(f.admin, promoted, { action: 'promote' })).status, 200);
  assert.equal((await decide(f.admin, promoted, { action: 'promote' })).status, 409);
  assert.equal((await decide(f.admin, promoted, { action: 'demote' })).status, 200);
  const demoteEvent = (await events(promoted)).at(-1)!;
  assert.deepEqual({ y: demoteEvent.details.academic_year, d: demoteEvent.details.decision }, { y: f.year, d: null });
  assert.equal((await decide(f.multi, promoted, { action: 'retain' })).status, 200, 'decided afresh after the correction');

  // Remove -> admin reinstate voids it too.
  const removed = await makeStudent(f.school, 'Primary 3', `Removed ${f.suffix}`);
  assert.equal((await decide(f.multi, removed, { action: 'remove' })).status, 200);
  assert.equal((await decide(f.admin, removed, { action: 'reinstate' })).status, 200);
  assert.equal((await decide(f.multi, removed, { action: 'retain' })).status, 200);
});

test('a decision belongs to its academic year: the next year starts clean', async () => {
  const f = await fixture('year');
  const s = await makeStudent(f.school, 'Primary 3', `Year ${f.suffix}`);
  assert.equal((await decide(f.multi, s, { action: 'retain' })).status, 200);
  assert.equal((await decide(f.multi, s, { action: 'retain' })).status, 409);
  await makeCurrentTerm(f.school, `${f.year}-next`);
  assert.equal((await listClass(f.multi, 'Primary 3')).find(r => r.id === s)?.roster_decision ?? null, null);
  assert.equal((await decide(f.multi, s, { action: 'promote' })).status, 200, 'a new academic year allows a new decision');
});

// ── 2. Class locks ────────────────────────────────────────────────────────────
test('teachers are refused promote, retain and remove in a class locked for the current term; administrators are not', async () => {
  const f = await fixture('lock');
  await lockClass(f.school, 'Primary 3', f.termId, f.multi);
  const ids = { promote: await makeStudent(f.school, 'Primary 3', `Lock promote ${f.suffix}`), retain: await makeStudent(f.school, 'Primary 3', `Lock retain ${f.suffix}`), remove: await makeStudent(f.school, 'Primary 3', `Lock remove ${f.suffix}`) };
  for (const [action, id] of Object.entries(ids)) {
    const res = await decide(f.multi, id, { action });
    assert.equal(res.status, 403, `teacher ${action}`);
    assert.match(((await res.json()) as { error: string }).error, /locked/i);
    assert.deepEqual(await membership(id), { class_name: 'Primary 3', status: 'active' });
    assert.equal((await events(id)).length, 0, `${action}: nothing recorded`);
  }
  // The lock is per class: the same teacher's other class is unaffected.
  const other = await makeStudent(f.school, 'Primary 4', `Lock other ${f.suffix}`);
  assert.equal((await decide(f.multi, other, { action: 'retain' })).status, 200);
  // Moving a student INTO a locked class is refused as well.
  const into = await makeStudent(f.school, 'Primary 2', `Lock into ${f.suffix}`);
  const p2Teacher = await makeActor({ role: 'teacher', school: f.school, label: 'lock-p2', suffix: f.suffix, assignedClass: 'Primary 2' });
  assert.equal((await decide(p2Teacher, into, { action: 'promote' })).status, 403, 'destination class is locked');
  assert.equal((await membership(into)).class_name, 'Primary 2');
  // Administrators write past a lock, as everywhere else.
  assert.equal((await decide(f.admin, ids.retain, { action: 'retain' })).status, 200);
  assert.equal((await decide(f.admin, ids.promote, { action: 'promote' })).status, 200);
  // A lock on some other term does not block the current term.
  await query('DELETE FROM class_locks WHERE school_code=$1', [f.school]);
  const oldTerm = Number((await query(`INSERT INTO terms(name,academic_year,school_code,is_current) VALUES('3rd Term','OLD-${f.suffix.slice(0, 6)}',$1,FALSE) RETURNING id`, [f.school])).rows[0].id);
  await lockClass(f.school, 'Primary 3', oldTerm, f.admin);
  assert.equal((await decide(f.multi, ids.remove, { action: 'remove' })).status, 200);
});

// ── 3. Durable retention ──────────────────────────────────────────────────────
test('retention is a durable decision that later class lists show', async () => {
  const f = await fixture('retain');
  const s = await makeStudent(f.school, 'Primary 3', `Retention ${f.suffix}`);
  const res = await decide(f.multi, s, { action: 'retain', expected_class_name: 'Primary 3' });
  assert.equal(res.status, 200);
  assert.deepEqual(await membership(s), { class_name: 'Primary 3', status: 'active' }, 'retained students stay in their class');
  const [event] = await events(s);
  assert.deepEqual({ type: event.event_type, y: event.details.academic_year, d: event.details.decision, who: event.actor_id },
    { type: 'retained', y: f.year, d: 'retain', who: f.multi.id });
  assert.deepEqual(await auditActions(s), ['retain_report_roster_student']);
  // Reflected in every later list, for the teacher, a colleague and the administrator.
  for (const viewer of [f.multi, f.p3Colleague, f.admin]) {
    assert.equal((await listClass(viewer, 'Primary 3')).find(r => r.id === s)?.roster_decision, 'retain');
  }
  assert.equal((await listClass(f.multi, 'Primary 3')).find(r => r.id !== s) ?? null, null);
  // Undecided classmates carry no decision.
  const fresh = await makeStudent(f.school, 'Primary 3', `Undecided ${f.suffix}`);
  assert.equal((await listClass(f.multi, 'Primary 3')).find(r => r.id === fresh)?.roster_decision ?? null, null);
});

// ── 4. Primary 6 -> JSS 1 ─────────────────────────────────────────────────────
test('Primary 6 promotion 403 is the administrator-only school boundary; everything else in Primary 6 works for the class teacher', async () => {
  const suffix = randomUUID();
  // This test must use the real, shared 'primary' and 'secondary' schools (the school
  // boundary is keyed on those codes), so it removes every student it creates from the
  // active rosters afterwards. Other files count students in those schools.
  try {
    const p6Teacher = await makeActor({ role: 'teacher', school: 'primary', label: 'p6-teacher', suffix, assignedClass: 'Primary 6' });
    const p6Admin = await makeActor({ role: 'admin', school: 'primary', label: 'p6-admin', suffix, assignedClass: null });
    const secondaryAdmin = await makeActor({ role: 'admin', school: 'secondary', label: 'p6-sec-admin', suffix, assignedClass: null });
    const jss1Teacher = await makeActor({ role: 'teacher', school: 'secondary', label: 'p6-jss1', suffix, assignedClass: 'JSS 1' });

    const crossing = await makeStudent('primary', 'Primary 6', `P6 Cross ${suffix}`);
    const denied = await decide(p6Teacher, crossing, { action: 'promote', expected_class_name: 'Primary 6' });
    assert.equal(denied.status, 403);
    assert.match(((await denied.json()) as { error: string }).error, /administrator-only/i);
    assert.deepEqual(await membership(crossing), { class_name: 'Primary 6', status: 'active' });
    assert.equal((await events(crossing)).length, 0);

    // The list tells the screen which promotions are administrator-only (server-driven).
    const p6Rows = await listClass(p6Teacher, 'Primary 6');
    assert.equal(p6Rows.find(r => r.id === crossing)?.admin_only_promotion, true);
    const p5 = await makeStudent('primary', 'Primary 5', `P5 Flag ${suffix}`);
    const p5Teacher = await makeActor({ role: 'teacher', school: 'primary', label: 'p5-teacher', suffix, assignedClass: 'Primary 5' });
    assert.equal((await listClass(p5Teacher, 'Primary 5')).find(r => r.id === p5)?.admin_only_promotion, false);

    // The Primary 6 teacher's other decisions are not blocked.
    const retained = await makeStudent('primary', 'Primary 6', `P6 Retain ${suffix}`);
    const removed = await makeStudent('primary', 'Primary 6', `P6 Remove ${suffix}`);
    assert.equal((await decide(p6Teacher, retained, { action: 'retain' })).status, 200);
    assert.equal((await decide(p6Teacher, removed, { action: 'remove' })).status, 200);

    // A school-bound administrator of the wrong school is refused; the right one crosses.
    assert.equal((await decide(secondaryAdmin, crossing, { action: 'promote' })).status, 403);
    const ok = await decide(p6Admin, crossing, { action: 'promote' });
    assert.equal(ok.status, 200);
    const { destination_student_id: dest } = await ok.json() as { destination_student_id: string };

    // The report identity created in JSS 1 counts as decided for the year: the JSS 1
    // teacher cannot promote it on again, and the source cannot be undone by a teacher.
    assert.equal((await decide(jss1Teacher, dest, { action: 'promote' })).status, 409);
    assert.equal((await listClass(jss1Teacher, 'JSS 1')).find(r => r.id === dest)?.roster_decision, 'promoted_in');
    assert.equal((await decide(p6Teacher, crossing, { action: 'undo_remove' })).status, 403, 'a cross-school promotion is not an undoable removal');
    assert.equal((await decide(p6Admin, crossing, { action: 'promote' })).status, 409);
  } finally {
    const { rows } = await query(`SELECT id FROM students WHERE full_name LIKE $1`, [`%${suffix}`]);
    const ids = rows.map((r: any) => String(r.id));
    await query(`UPDATE report_roster_memberships SET status='removed', removed_at=COALESCE(removed_at, now()) WHERE student_id=ANY($1::uuid[])`, [ids]);
    await query(`UPDATE students SET deleted_at=now() WHERE id=ANY($1::uuid[])`, [ids]);
  }
});

// ── 5. Correcting an accidental removal ───────────────────────────────────────
test('a teacher can undo their own removal, and nothing wider', async () => {
  const f = await fixture('undo');
  const s = await makeStudent(f.school, 'Primary 3', `Undo ${f.suffix}`);
  assert.equal((await decide(f.multi, s, { action: 'remove' })).status, 200);
  assert.equal((await listClass(f.multi, 'Primary 3')).some(r => r.id === s), false);

  const mine = await getJson(f.multi, '/report-roster/my-removals');
  assert.deepEqual(mine.body.students.map((r: any) => r.id), [s]);
  assert.deepEqual((await getJson(f.p3Colleague, '/report-roster/my-removals')).body.students, [], "a colleague does not see someone else's removal");
  assert.equal((await getJson(f.multi, '/report-roster/my-removals?class_name=Primary%205')).status, 403);
  assert.equal((await getJson(f.subjectOnly, '/report-roster/my-removals')).status, 403);
  assert.equal((await getJson(f.multi, '/report-roster/removed')).status, 403, 'the administrator reconciliation list stays administrator-only');

  // Not the remover, not an assigned class, not a class teacher, not an administrator action.
  assert.equal((await decide(f.p3Colleague, s, { action: 'undo_remove' })).status, 403, 'another teacher of the class cannot undo it');
  assert.equal((await decide(f.p4Teacher, s, { action: 'undo_remove' })).status, 404, 'a teacher outside the class cannot see it');
  assert.equal((await decide(f.subjectOnly, s, { action: 'undo_remove' })).status, 403);
  assert.equal((await decide(f.admin, s, { action: 'undo_remove' })).status, 400);
  assert.equal((await decide(f.multi, s, { action: 'reinstate' })).status, 403, 'reinstatement stays administrator-only');
  assert.equal((await decide(f.multi, s, { action: 'demote' })).status, 403, 'demotion stays administrator-only');
  assert.deepEqual(await membership(s), { class_name: 'Primary 3', status: 'removed' });

  // The remover can; it restores to the same class, records a correction and frees the year.
  assert.equal((await decide(f.multi, s, { action: 'undo_remove' })).status, 200);
  assert.deepEqual(await membership(s), { class_name: 'Primary 3', status: 'active' });
  const last = (await events(s)).at(-1)!;
  assert.deepEqual({ t: last.event_type, d: last.details.decision, r: last.details.reason, who: last.actor_id }, { t: 'reinstated', d: null, r: 'teacher_correction', who: f.multi.id });
  assert.ok((await auditActions(s)).includes('undo_remove_report_roster_membership'));
  assert.equal((await decide(f.multi, s, { action: 'undo_remove' })).status, 409, 'nothing left to undo');
  assert.equal((await decide(f.multi, s, { action: 'retain' })).status, 200, 'the student can be decided again');
});

test('a teacher cannot undo an administrator removal, an old-year removal or a removal in a locked class', async () => {
  const f = await fixture('undo2');
  const byAdmin = await makeStudent(f.school, 'Primary 3', `Admin removed ${f.suffix}`);
  assert.equal((await decide(f.admin, byAdmin, { action: 'remove' })).status, 200);
  assert.equal((await decide(f.multi, byAdmin, { action: 'undo_remove' })).status, 403);
  assert.deepEqual((await getJson(f.multi, '/report-roster/my-removals')).body.students, []);
  assert.equal((await membership(byAdmin)).status, 'removed');

  const locked = await makeStudent(f.school, 'Primary 3', `Locked removal ${f.suffix}`);
  assert.equal((await decide(f.multi, locked, { action: 'remove' })).status, 200);
  await lockClass(f.school, 'Primary 3', f.termId, f.admin);
  assert.equal((await decide(f.multi, locked, { action: 'undo_remove' })).status, 403);
  assert.equal((await membership(locked)).status, 'removed');
  assert.equal((await decide(f.admin, locked, { action: 'reinstate' })).status, 200, 'the administrator can still restore it');
  await query('DELETE FROM class_locks WHERE school_code=$1', [f.school]);

  const old = await makeStudent(f.school, 'Primary 3', `Old removal ${f.suffix}`);
  assert.equal((await decide(f.multi, old, { action: 'remove' })).status, 200);
  await makeCurrentTerm(f.school, `${f.year}-next`);
  assert.equal((await decide(f.multi, old, { action: 'undo_remove' })).status, 403, 'only this academic year');
  assert.deepEqual((await getJson(f.multi, '/report-roster/my-removals')).body.students, []);
  assert.equal((await membership(old)).status, 'removed');
});

// ── 6. Multi-class authorization ──────────────────────────────────────────────
test('a multi-class teacher acts only within their assigned physical classes', async () => {
  const f = await fixture('scope');
  const p3 = await makeStudent(f.school, 'Primary 3', `Scope P3 ${f.suffix}`);
  const p4 = await makeStudent(f.school, 'Primary 4', `Scope P4 ${f.suffix}`);
  const p5 = await makeStudent(f.school, 'Primary 5', `Scope P5 ${f.suffix}`);
  assert.equal((await decide(f.multi, p3, { action: 'retain', expected_class_name: 'Primary 3' })).status, 200);
  assert.equal((await decide(f.multi, p4, { action: 'retain', expected_class_name: 'Primary 4' })).status, 200);
  for (const body of [{ action: 'retain' }, { action: 'promote' }, { action: 'remove' }, { action: 'undo_remove' },
    { action: 'retain', expected_class_name: 'Primary 5' }, { action: 'retain', expected_class_name: 'Primary 3', class_name: 'Primary 3', school_code: f.school }]) {
    assert.equal((await decide(f.multi, p5, body)).status, 404, JSON.stringify(body));
  }
  assert.deepEqual(await membership(p5), { class_name: 'Primary 5', status: 'active' });
  assert.equal((await events(p5)).length, 0);
  assert.equal((await getJson(f.multi, '?class_name=Primary%205')).status, 403);
  // Wrong stale-screen class on an assigned student is refused, not obeyed.
  const p3b = await makeStudent(f.school, 'Primary 3', `Scope P3b ${f.suffix}`);
  assert.equal((await decide(f.multi, p3b, { action: 'retain', expected_class_name: 'Primary 4' })).status, 409);
  // A teacher of another school with the same class names reaches nothing.
  const otherSchool = await makeSchool(f.suffix, 'scope-other');
  const outsider = await makeActor({ role: 'teacher', school: otherSchool, label: 'scope-outsider', suffix: f.suffix, assignedClass: 'Primary 3', classNames: ['Primary 3', 'Primary 4'] });
  for (const id of [p3, p4, p3b]) assert.equal((await decide(outsider, id, { action: 'retain' })).status, 404);
  // Subject-only grants confer no roster authority.
  assert.equal((await decide(f.subjectOnly, p3b, { action: 'retain' })).status, 403);
});
