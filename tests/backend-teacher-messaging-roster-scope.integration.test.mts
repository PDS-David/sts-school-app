import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after, before } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import messagesRouter from '../backend/src/routes/messages.js';
import announcementsRouter from '../backend/src/routes/announcements.js';
import { signAccess } from '../backend/src/utils/jwt.js';

// Database-backed regression suite for PR #1063's teacher messaging and
// announcements. It exercises the real routes against a disposable PostgreSQL
// schema (see .github/workflows/backend-teacher-messaging-roster-scope.yml).

const A = 'Primary 4'; // the class students start in
const B = 'Primary 5'; // the class students are promoted into
const C = 'Primary 6'; // an unrelated class
const SEC = 'JSS 1';   // a secondary-school class
const tag = randomUUID().slice(0, 8);

type Role = 'admin' | 'teacher' | 'student' | 'parent';
interface Actor { id: string; token: string; username: string; schoolHeader?: string }
const created = { users: [] as string[], students: [] as string[], announcements: [] as string[], subjects: [] as number[] };

async function mkUser(label: string, role: Role, opts: {
  school?: string | null; assignedClass?: string | null; classNames?: string[]; global?: boolean;
} = {}): Promise<Actor> {
  const username = `rs-${tag}-${label}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,can_manage_all_schools,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,$6,$7,TRUE,FALSE) RETURNING id`,
    [username, role, `RS ${label}`, opts.school === undefined ? 'primary' : opts.school, opts.assignedClass ?? null, opts.classNames ?? [], opts.global ?? false],
  );
  const id = String(rows[0].id);
  created.users.push(id);
  return {
    id, username,
    // A global admin must select the school it is acting in (x-school-code); it then behaves as that school's admin.
    schoolHeader: opts.global ? 'primary' : undefined,
    token: signAccess({ id, username, role, school_code: opts.school ?? null, assigned_class: opts.assignedClass ?? null, assigned_subject_ids: [] }),
  };
}

/** A student login + record. `staleClass` is students.class_name; `rosterClass` is the ACTIVE physical roster (null = no active row). */
async function mkStudent(label: string, opts: { school?: string; staleClass: string; rosterClass: string | null; rosterStatus?: 'active' | 'removed' }) {
  const school = opts.school ?? 'primary';
  const login = await mkUser(`stu-${label}`, 'student', { school });
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id) VALUES($1,$2,$3,$4,$5) RETURNING id`,
    [`RS Student ${label}`, opts.staleClass, school, `RS-${tag}-${label}`, login.id],
  );
  const studentId = String(rows[0].id);
  created.students.push(studentId);
  if (opts.rosterClass) {
    const status = opts.rosterStatus ?? 'active';
    await query(
      `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status,removed_at)
       VALUES($1,$2,$2,$3,${status === 'removed' ? 'now()' : 'NULL'})`,
      [studentId, opts.rosterClass, status],
    );
  }
  return { login, studentId };
}

async function mkParent(label: string, studentId: string): Promise<Actor> {
  const parent = await mkUser(`par-${label}`, 'parent');
  await query('INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2)', [parent.id, studentId]);
  return parent;
}

let server: Server;
let base: string;
const api = (actor: Actor, path: string, init: { method?: string; body?: unknown } = {}) =>
  fetch(`${base}${path}`, {
    method: init.method ?? 'GET',
    headers: { Authorization: `Bearer ${actor.token}`, 'Content-Type': 'application/json', ...(actor.schoolHeader ? { 'x-school-code': actor.schoolHeader } : {}) },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
const contactIds = async (actor: Actor) => {
  const res = await api(actor, '/messages/contacts');
  assert.equal(res.status, 200);
  const { contacts } = await res.json() as { contacts: Array<{ id: string; username: string | null; role: string; unread_count: number }> };
  return contacts;
};
const send = (from: Actor, to: Actor, body = 'hello') => api(from, '/messages', { method: 'POST', body: { recipient_id: to.id, body } });
const ids = (...actors: Actor[]) => actors.map(a => a.id).sort();

// Actors, assigned in before().
let tA: Actor, tB: Actor, tMulti: Actor, tSubj: Actor, tUnrelated: Actor, tSecondary: Actor, tNoClass: Actor;
let adminP: Actor, adminS: Actor, adminGlobal: Actor, adminLegacy: Actor;
let promoted: Awaited<ReturnType<typeof mkStudent>>, current: Awaited<ReturnType<typeof mkStudent>>, removed: Awaited<ReturnType<typeof mkStudent>>;
let secondaryStu: Awaited<ReturnType<typeof mkStudent>>, unrelatedStu: Awaited<ReturnType<typeof mkStudent>>, noRoster: Awaited<ReturnType<typeof mkStudent>>;
let pPromoted: Actor, pCurrent: Actor, pRemoved: Actor, pSecondary: Actor, pUnrelated: Actor, pNoRoster: Actor;

before(async () => {
  const app = express();
  app.use(express.json());
  app.use('/messages', messagesRouter);
  app.use('/announcements', announcementsRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  tA = await mkUser('tA', 'teacher', { assignedClass: A });
  tB = await mkUser('tB', 'teacher', { assignedClass: B }); // newly assigned class teacher of the promoted-into class
  tMulti = await mkUser('tMulti', 'teacher', { assignedClass: A, classNames: [B] });
  tSubj = await mkUser('tSubj', 'teacher'); // subject-only: no assigned_class
  tUnrelated = await mkUser('tUnrelated', 'teacher', { assignedClass: C });
  tNoClass = await mkUser('tNoClass', 'teacher'); // no class, no subject grant
  tSecondary = await mkUser('tSecondary', 'teacher', { school: 'secondary', assignedClass: A }); // same class NAME, other school
  adminP = await mkUser('adminP', 'admin', { school: 'primary' });
  adminS = await mkUser('adminS', 'admin', { school: 'secondary' });
  adminGlobal = await mkUser('adminGlobal', 'admin', { school: null, global: true });
  adminLegacy = await mkUser('adminLegacy', 'admin', { school: null, global: false });

  // tSubj teaches one subject in class A only.
  const { rows: subj } = await query(`INSERT INTO subjects(school_code,name) VALUES('primary',$1) RETURNING id`, [`RS Subject ${tag}`]);
  created.subjects.push(Number(subj[0].id));
  await query(
    `INSERT INTO teacher_class_subjects(user_id,class_id,subject_id)
     SELECT $1, c.id, $2 FROM classes c WHERE c.school_code='primary' AND c.name=$3`,
    [tSubj.id, subj[0].id, A],
  );

  // Promoted A -> B: students.class_name is STALE ('Primary 4'), the active roster says B.
  promoted = await mkStudent('promoted', { staleClass: A, rosterClass: B });
  current = await mkStudent('current', { staleClass: A, rosterClass: A });
  // Removed from the roster but students.class_name still says A.
  removed = await mkStudent('removed', { staleClass: A, rosterClass: A, rosterStatus: 'removed' });
  secondaryStu = await mkStudent('secondary', { school: 'secondary', staleClass: SEC, rosterClass: SEC });
  unrelatedStu = await mkStudent('unrelated', { staleClass: C, rosterClass: C });
  noRoster = await mkStudent('noroster', { staleClass: A, rosterClass: null }); // online-only learner
  pPromoted = await mkParent('promoted', promoted.studentId);
  pCurrent = await mkParent('current', current.studentId);
  pRemoved = await mkParent('removed', removed.studentId);
  pSecondary = await mkParent('secondary', secondaryStu.studentId);
  pUnrelated = await mkParent('unrelated', unrelatedStu.studentId);
  pNoRoster = await mkParent('noroster', noRoster.studentId);
});

after(async () => {
  server?.close();
  try {
    if (created.announcements.length) await query('DELETE FROM announcements WHERE id = ANY($1::bigint[])', [created.announcements]);
    await query('DELETE FROM messages WHERE sender_id = ANY($1::uuid[]) OR recipient_id = ANY($1::uuid[])', [created.users]);
    await query('DELETE FROM report_roster_memberships WHERE student_id = ANY($1::uuid[])', [created.students]);
    await query('DELETE FROM parent_wards WHERE parent_id = ANY($1::uuid[])', [created.users]);
    await query('DELETE FROM students WHERE id = ANY($1::uuid[])', [created.students]);
    await query('DELETE FROM teacher_class_subjects WHERE user_id = ANY($1::uuid[])', [created.users]);
    if (created.subjects.length) await query('DELETE FROM subjects WHERE id = ANY($1::int[])', [created.subjects]);
    await query('DELETE FROM users WHERE id = ANY($1::uuid[])', [created.users]);
  } catch (error) {
    console.error('cleanup skipped (disposable database):', error instanceof Error ? error.message : error);
  }
  await pool.end();
});

// ── Contact lists ────────────────────────────────────────────────────────────

test('class teacher: reaches parents and students on the ACTIVE roster, not stale class_name or removed students', async () => {
  const mine = await contactIds(tA);
  const mineIds = mine.map(c => c.id).sort();
  // tA's active roster is class A: only `current` (and its parent).
  assert.ok(mineIds.includes(current.login.id) && mineIds.includes(pCurrent.id));
  // `promoted` has a stale class_name of A but is on B now: the old class teacher loses access.
  assert.ok(!mineIds.includes(pPromoted.id), 'former class teacher must lose the promoted student’s parent');
  assert.ok(!mineIds.includes(promoted.login.id));
  // Removed from the roster, class_name still A.
  assert.ok(!mineIds.includes(pRemoved.id) && !mineIds.includes(removed.login.id));
  // No active roster row at all (online-only).
  assert.ok(!mineIds.includes(pNoRoster.id) && !mineIds.includes(noRoster.login.id));
  // Other classes/schools and unrelated families.
  for (const other of [pUnrelated, unrelatedStu.login, pSecondary, secondaryStu.login]) assert.ok(!mineIds.includes(other.id));
});

test('newly assigned class teacher reaches the parents of students currently on the roster', async () => {
  const mineIds = (await contactIds(tB)).map(c => c.id);
  assert.ok(mineIds.includes(pPromoted.id), 'new class teacher can contact the promoted student’s parent');
  assert.ok(mineIds.includes(promoted.login.id));
  assert.ok(!mineIds.includes(pCurrent.id), 'but not families of the class they do not teach');
});

test('multi-class teacher reaches both rosters without mixing in other classes or schools', async () => {
  const mineIds = (await contactIds(tMulti)).map(c => c.id);
  for (const a of [pPromoted, pCurrent, promoted.login, current.login]) assert.ok(mineIds.includes(a.id));
  for (const a of [pUnrelated, pRemoved, pSecondary, pNoRoster, unrelatedStu.login]) assert.ok(!mineIds.includes(a.id));
});

test('subject-only teacher reaches students of the subject class but NEVER parents', async () => {
  const contacts = await contactIds(tSubj);
  const got = contacts.map(c => c.id);
  assert.ok(got.includes(current.login.id), 'students on the granted class roster are reachable');
  assert.ok(!got.includes(promoted.login.id), 'students of classes without a grant are not');
  assert.equal(contacts.filter(c => c.role === 'parent').length, 0, 'subject teachers never see parents');
  for (const t of [tA, tB, tUnrelated]) assert.ok(got.includes(t.id), 'teachers of the same school are reachable');
  assert.ok(!got.includes(tSecondary.id), 'teachers of another school are not');
  const noClass = await contactIds(tNoClass);
  assert.equal(noClass.filter(c => c.role === 'parent' || c.role === 'student').length, 0, 'a teacher with no class or grant reaches no family');
});

test('admin contacts are same-school or unscoped (never another school’s), and never expose login usernames', async () => {
  const contacts = await contactIds(tA);
  const admins = contacts.filter(c => c.role === 'admin');
  assert.deepEqual(admins.map(c => c.id).sort(), ids(adminP, adminGlobal, adminLegacy));
  for (const a of admins) assert.equal(a.username, null, 'admin username is not exposed to teachers');
  assert.ok(!admins.some(c => c.id === adminS.id), 'an admin bound to another school is never a contact');
  // Same rules for students and parents.
  for (const viewer of [current.login, pCurrent]) {
    const seen = (await contactIds(viewer)).filter(c => c.role === 'admin');
    assert.deepEqual(seen.map(c => c.id).sort(), ids(adminP, adminGlobal, adminLegacy));
    assert.ok(seen.every(c => c.username === null));
  }
  // A school-bound admin sees only their own school's teachers.
  const adminView = await contactIds(adminP);
  assert.ok(adminView.some(c => c.id === tA.id) && !adminView.some(c => c.id === tSecondary.id));
});

// ── Send / reply symmetry ────────────────────────────────────────────────────

test('every permitted pair can message in BOTH directions; unrelated pairs in neither', async () => {
  const allowed: Array<[Actor, Actor]> = [
    [pPromoted, tB], [pCurrent, tA], [pCurrent, tMulti], [pPromoted, tMulti],
    [current.login, tSubj], [current.login, tA], [promoted.login, tB],
    [tA, tSubj], [tA, adminP], [tA, adminLegacy], [current.login, adminGlobal], [pCurrent, adminP],
  ];
  for (const [x, y] of allowed) {
    assert.equal((await send(x, y)).status, 201, `${x.username} -> ${y.username}`);
    assert.equal((await send(y, x, 'reply')).status, 201, `reply ${y.username} -> ${x.username}`);
  }
  const forbidden: Array<[Actor, Actor]> = [
    [pPromoted, tA], [pRemoved, tA], [pUnrelated, tA], [pSecondary, tA], [pNoRoster, tA],
    [pCurrent, tSubj], [pCurrent, tUnrelated], [pCurrent, tNoClass],
    [unrelatedStu.login, tA], [secondaryStu.login, tA], [promoted.login, tA], [removed.login, tA],
    [tSubj, pCurrent], [tNoClass, pCurrent], [tUnrelated, pCurrent], [tSecondary, pCurrent],
    [tA, adminS], [pCurrent, adminS], [current.login, adminS],
  ];
  for (const [x, y] of forbidden) {
    assert.equal((await send(x, y)).status, 403, `${x.username} -> ${y.username} must be refused`);
    assert.equal((await send(y, x)).status, 403, `${y.username} -> ${x.username} must be refused`);
  }
});

test('contact lists are symmetric: x lists y exactly when y lists x', async () => {
  const everyone = [tA, tB, tMulti, tSubj, tUnrelated, tNoClass, tSecondary, adminP, adminS,
    current.login, promoted.login, removed.login, unrelatedStu.login, secondaryStu.login, noRoster.login,
    pCurrent, pPromoted, pRemoved, pUnrelated, pSecondary, pNoRoster];
  const lists = new Map<string, Set<string>>();
  for (const actor of everyone) lists.set(actor.id, new Set((await contactIds(actor)).map(c => c.id)));
  // Teacher-facing relations only. A global admin is left out on purpose: it is visible to every school's
  // teachers but lists only the school it has selected (x-school-code), so it replies once it selects theirs.
  const teachers = new Set([tA, tB, tMulti, tSubj, tUnrelated, tNoClass, tSecondary].map(t => t.id));
  for (const t of teachers) {
    for (const other of everyone) {
      if (other.id === t) continue;
      assert.equal(lists.get(t)!.has(other.id), lists.get(other.id)!.has(t),
        `teacher ${t} / ${other.username}: visibility must be symmetric`);
    }
  }
});

test('unread notifications: a message from a permitted parent shows on the receiving teacher’s chat list and clears when read', async () => {
  const before = (await contactIds(tB)).find(c => c.id === pPromoted.id)!;
  const prior = Number(before.unread_count);
  assert.equal((await send(pPromoted, tB, 'unread please')).status, 201);
  const after = (await contactIds(tB)).find(c => c.id === pPromoted.id)!;
  assert.equal(Number(after.unread_count), prior + 1);
  const convo = await api(tB, `/messages/conversation/${pPromoted.id}`);
  assert.equal(convo.status, 200);
  const cleared = (await contactIds(tB)).find(c => c.id === pPromoted.id)!;
  assert.equal(Number(cleared.unread_count), 0);
});

test('after promotion the old class teacher can no longer message the parent, and vice versa', async () => {
  const rolled = await mkStudent('rolled', { staleClass: A, rosterClass: A });
  const parent = await mkParent('rolled', rolled.studentId);
  assert.equal((await send(parent, tA)).status, 201, 'before promotion the class teacher is reachable');
  await query(`UPDATE report_roster_memberships SET class_name=$2, updated_at=now() WHERE student_id=$1`, [rolled.studentId, B]);
  assert.equal((await send(parent, tA)).status, 403, 'former class teacher is no longer reachable');
  assert.equal((await send(tA, parent)).status, 403);
  assert.equal((await send(parent, tB)).status, 201, 'new class teacher is reachable');
  await query(`UPDATE report_roster_memberships SET status='removed', removed_at=now() WHERE student_id=$1`, [rolled.studentId]);
  assert.equal((await send(parent, tB)).status, 403, 'removal from the roster ends access');
});

// ── Announcements ────────────────────────────────────────────────────────────

async function mkAnnouncement(o: { school?: string; title: string; body?: string; role?: string | null; cls?: string | null; ageMinutes?: number; expired?: boolean }) {
  const { rows } = await query(
    `INSERT INTO announcements(school_code,title,body,audience_role,class_name,created_at,expires_at)
     VALUES($1,$2,$3,$4,$5, now() - ($6 || ' minutes')::interval, $7) RETURNING id`,
    [o.school ?? 'primary', `${tag} ${o.title}`, o.body ?? 'x'.repeat(900), o.role ?? null, o.cls ?? null,
      String(o.ageMinutes ?? 0), o.expired ? new Date(Date.now() - 60_000).toISOString() : null],
  );
  const id = String(rows[0].id);
  created.announcements.push(id);
  return id;
}
const titles = async (actor: Actor, qs = '') => {
  const res = await api(actor, `/announcements${qs}`);
  assert.equal(res.status, 200);
  const data = await res.json() as { announcements: Array<{ id: string; title: string; body: string }>; next_cursor: string | null };
  return { ...data, titles: data.announcements.map(a => a.title.replace(`${tag} `, '')).filter(t => !t.startsWith('page')) };
};

test('announcement visibility for teachers: class-targeted notices of any audience, no cross-class or cross-school mixing', async () => {
  const longBody = 'full announcement body '.repeat(80);
  await mkAnnouncement({ title: 'school-wide-all', body: longBody });
  await mkAnnouncement({ title: 'school-wide-teachers', role: 'teacher' });
  await mkAnnouncement({ title: 'school-wide-students', role: 'student' });
  await mkAnnouncement({ title: 'A-students', role: 'student', cls: A });
  await mkAnnouncement({ title: 'A-parents', role: 'parent', cls: A });
  await mkAnnouncement({ title: 'B-parents', role: 'parent', cls: B });
  await mkAnnouncement({ title: 'C-all', cls: C });
  await mkAnnouncement({ title: 'A-expired', cls: A, expired: true });
  await mkAnnouncement({ school: 'secondary', title: 'secondary-wide' });
  await mkAnnouncement({ school: 'secondary', title: 'secondary-A-named', cls: SEC });

  const forA = new Set((await titles(tA)).titles);
  for (const t of ['school-wide-all', 'school-wide-teachers', 'A-students', 'A-parents']) assert.ok(forA.has(t), `class teacher sees ${t}`);
  for (const t of ['school-wide-students', 'B-parents', 'C-all', 'A-expired', 'secondary-wide', 'secondary-A-named']) assert.ok(!forA.has(t), `class teacher must not see ${t}`);

  const forMulti = new Set((await titles(tMulti)).titles);
  assert.ok(forMulti.has('A-parents') && forMulti.has('B-parents') && !forMulti.has('C-all'));

  const forSubject = new Set((await titles(tSubj)).titles);
  assert.ok(forSubject.has('A-students') && forSubject.has('school-wide-all'));
  assert.ok(!forSubject.has('B-parents'), 'subject teacher only sees the granted class');

  const forSecondary = new Set((await titles(tSecondary)).titles);
  assert.ok(!forSecondary.has('A-students') && !forSecondary.has('school-wide-all'), 'a teacher of another school never sees primary notices');
  assert.ok(forSecondary.has('secondary-wide'));
});

test('teachers can open the full announcement; invisible ones are 404; publishing stays admin-only', async () => {
  const body = 'complete text that must not be truncated '.repeat(60);
  const visible = await mkAnnouncement({ title: 'detail-visible', body, role: 'parent', cls: A });
  const hidden = await mkAnnouncement({ title: 'detail-hidden', cls: B });
  const ok = await api(tA, `/announcements/${visible}`);
  assert.equal(ok.status, 200);
  assert.equal(((await ok.json()) as { announcement: { body: string } }).announcement.body, body);
  assert.equal((await api(tA, `/announcements/${hidden}`)).status, 404);
  assert.equal((await api(tSecondary, `/announcements/${visible}`)).status, 404);
  assert.equal((await api(pUnrelated, `/announcements/${visible}`)).status, 404);
  const publish = await api(tA, '/announcements', { method: 'POST', body: { title: 'x', body: 'y' } });
  assert.equal(publish.status, 403, 'teacher publishing is not enabled by this change');
});

test('older relevant announcements are reachable by cursor pagination without gaps or duplicates', async () => {
  const expected: string[] = [];
  for (let i = 0; i < 7; i += 1) expected.push(await mkAnnouncement({ title: `page-${i}`, cls: B, ageMinutes: 10_000 + i }));
  const seen: string[] = [];
  let cursor: string | null = null;
  for (let guard = 0; guard < 30; guard += 1) {
    const qs: string = `?limit=3${cursor ? `&before=${encodeURIComponent(cursor)}` : ''}`;
    const page = await titles(tMulti, qs);
    assert.ok(page.announcements.length <= 3);
    seen.push(...page.announcements.map(a => String(a.id)));
    cursor = page.next_cursor;
    if (!cursor) break;
  }
  assert.equal(new Set(seen).size, seen.length, 'no duplicates across pages');
  for (const id of expected) assert.ok(seen.includes(id), `older announcement ${id} is reachable`);
  assert.equal((await api(tMulti, '/announcements?before=garbage')).status, 400);
});
