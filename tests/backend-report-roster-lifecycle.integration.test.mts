import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import studentsRouter from '../backend/src/routes/students.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

test('administrator placement decisions mutate only physical report membership and append history', async () => {
  const suffix = randomUUID();
  const schoolCode = `roster_${suffix.slice(0, 12)}`;
  await query('INSERT INTO schools(code,name) VALUES($1,$2)', [schoolCode, `Roster Lifecycle School ${suffix}`]);
  await query(
    `INSERT INTO classes(school_code,name) VALUES($1,'Primary 4'),($1,'Primary 5')`,
    [schoolCode],
  );
  const username = `roster-admin-${suffix}`;
  const { rows: users } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash','admin','Roster Lifecycle Administrator',$2,'Primary 4',TRUE,FALSE)
     RETURNING id`,
    [username, schoolCode],
  );
  const adminId = String(users[0].id);
  const token = signAccess({
    id: adminId,
    username,
    role: 'admin',
    school_code: schoolCode,
    assigned_class: 'Primary 4',
    assigned_subject_ids: [],
  });
  const studentIds: string[] = [];
  let server: Server | undefined;

  try {
    for (const [index, admission] of ['PROMOTE', 'RETAIN', 'REMOVE', 'REINSTATE', 'RACE', 'PROMOTE_RACE'].entries()) {
      const { rows } = await query(
        `INSERT INTO students(full_name,class_name,school_code,admission_number)
         VALUES($1,'Primary 4',$2,$3) RETURNING id`,
        [`Roster Lifecycle ${admission} ${suffix}`, schoolCode, `${admission}-${suffix}-${index}`],
      );
      const studentId = String(rows[0].id);
      studentIds.push(studentId);
      await query(
        `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
         VALUES($1,'Primary 4','Primary 4','active')`,
        [studentId],
      );
    }

    const app = express();
    app.use(express.json());
    app.use('/students', studentsRouter);
    app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
    });
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
      server!.once('listening', resolve);
      server!.once('error', reject);
    });
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/students`;
    const getRemoved = () => fetch(`${baseUrl}/report-roster/removed`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const decide = (studentId: string, action: string) => fetch(`${baseUrl}/${studentId}/promotion`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    const promoted = await decide(studentIds[0], 'promote');
    assert.equal(promoted.status, 200);
    const promotedBody = await promoted.json() as { from_class: string; to_class: string; online_account_unchanged: boolean };
    assert.equal(promotedBody.from_class, 'Primary 4');
    assert.equal(promotedBody.to_class, 'Primary 5');
    assert.equal(promotedBody.online_account_unchanged, true);

    const retained = await decide(studentIds[1], 'retain');
    assert.equal(retained.status, 200);
    const removed = await decide(studentIds[2], 'remove');
    assert.equal(removed.status, 200);
    const removedRoster = await getRemoved();
    assert.equal(removedRoster.status, 200);
    const removedPayload = await removedRoster.json() as { students: Array<{ id: string }> };
    assert.ok(removedPayload.students.some(student => student.id === studentIds[2]),
      'administrator can retrieve removed physical-roster entries');

    const teacherToken = signAccess({
      id: randomUUID(),
      username: 'report-only-teacher',
      role: 'teacher',
      school_code: schoolCode,
      assigned_class: 'Primary 4',
      assigned_subject_ids: [],
    });
    const teacherHeaders = { Authorization: `Bearer ${teacherToken}`, 'Content-Type': 'application/json' };
    const teacherDecision = await fetch(`${baseUrl}/${studentIds[0]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'remove' }),
    });
    assert.equal(teacherDecision.status, 403, 'teachers must not change physical report-roster membership');
    const teacherRemoved = await fetch(`${baseUrl}/report-roster/removed`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert.equal(teacherRemoved.status, 403, 'teachers must not manage the removed physical-roster list');

    const teacherRoster = await fetch(baseUrl, { headers: { Authorization: `Bearer ${teacherToken}` } });
    assert.equal(teacherRoster.status, 200);
    const teacherRosterBody = await teacherRoster.json() as { students: Array<{ id: string; class_name: string }> };
    assert.ok(teacherRosterBody.students.some(student => student.id === studentIds[1]));
    assert.ok(!teacherRosterBody.students.some(student => student.id === studentIds[0]),
      'teacher roster is limited to active membership in the assigned physical class');

    const teacherProfile = await fetch(`${baseUrl}/${studentIds[1]}`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert.equal(teacherProfile.status, 200);
    const teacherProfileBody = await teacherProfile.json() as { student: Record<string, unknown> };
    assert.deepEqual(Object.keys(teacherProfileBody.student).sort(),
      ['admission_number', 'class_name', 'created_at', 'full_name', 'id', 'school_code'].sort(),
      'teacher profile exposes only the identity fields required for report generation');
    const reinstated = await decide(studentIds[3], 'remove');
    assert.equal(reinstated.status, 200);
    const restore = await decide(studentIds[3], 'reinstate');
    assert.equal(restore.status, 200);
    const removedAfterRestore = await getRemoved();
    const removedAfterRestorePayload = await removedAfterRestore.json() as { students: Array<{ id: string }> };
    assert.ok(!removedAfterRestorePayload.students.some(student => student.id === studentIds[3]),
      'reinstated student no longer appears in the removed list');

    const concurrentRemovals = await Promise.all([
      decide(studentIds[4], 'remove'),
      decide(studentIds[4], 'remove'),
    ]);
    assert.deepEqual(
      concurrentRemovals.map(response => response.status).sort((a, b) => a - b),
      [200, 409],
      'only one concurrent removal may commit; the other must refresh after the state changes',
    );

    const concurrentPromotions = await Promise.all([
      decide(studentIds[5], 'promote'),
      decide(studentIds[5], 'promote'),
    ]);
    assert.deepEqual(
      concurrentPromotions.map(response => response.status).sort((a, b) => a - b),
      [200, 409],
      'only one concurrent promotion may commit from the same original class',
    );

    const { rows: students } = await query(
      'SELECT id,class_name,deleted_at FROM students WHERE id=ANY($1::uuid[]) ORDER BY id',
      [studentIds],
    );
    assert.equal(students.length, 6);
    assert.ok(students.every(row => row.class_name === 'Primary 4'),
      'online student class must remain unchanged by every report-roster decision');
    assert.ok(students.every(row => row.deleted_at === null),
      'report-roster removal must not soft-delete the online student record');

    const { rows: memberships } = await query(
      'SELECT student_id,class_name,status FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])',
      [studentIds],
    );
    const byStudent = new Map(memberships.map(row => [row.student_id, row]));
    assert.equal(byStudent.get(studentIds[0])?.class_name, 'Primary 5');
    assert.equal(byStudent.get(studentIds[0])?.status, 'active');
    assert.equal(byStudent.get(studentIds[1])?.class_name, 'Primary 4');
    assert.equal(byStudent.get(studentIds[1])?.status, 'active');
    assert.equal(byStudent.get(studentIds[2])?.status, 'removed');
    assert.equal(byStudent.get(studentIds[3])?.status, 'active');
    assert.equal(byStudent.get(studentIds[4])?.status, 'removed');
    assert.equal(byStudent.get(studentIds[5])?.class_name, 'Primary 5');
    assert.equal(byStudent.get(studentIds[5])?.status, 'active');

    const { rows: events } = await query(
      'SELECT student_id,event_type FROM report_roster_membership_events WHERE student_id=ANY($1::uuid[])',
      [studentIds],
    );
    const eventTypes = (studentId: string) => events.filter(row => row.student_id === studentId).map(row => row.event_type);
    assert.ok(eventTypes(studentIds[0]).includes('class_changed'));
    assert.ok(eventTypes(studentIds[1]).includes('retained'));
    assert.ok(eventTypes(studentIds[2]).includes('removed'));
    assert.ok(eventTypes(studentIds[3]).includes('removed'));
    assert.ok(eventTypes(studentIds[3]).includes('reinstated'));
    assert.equal(eventTypes(studentIds[4]).filter(type => type === 'removed').length, 1,
      'concurrent teacher decisions must append exactly one removal event');
    assert.equal(eventTypes(studentIds[5]).filter(type => type === 'class_changed').length, 1,
      'concurrent promotions must append exactly one class-change event');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    // The append-only event log intentionally retains the test history. The
    // dedicated synthetic school and its rows are isolated from real schools;
    // the disposable PostgreSQL service is discarded at workflow end.
    await query('DELETE FROM users WHERE id=$1', [adminId]);
  }
});
