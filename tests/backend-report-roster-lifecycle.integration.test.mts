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

test('administrators and assigned teachers execute scoped physical report-roster decisions and append history', async () => {
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
  let teacherId: string | null = null;
  let crossSectionTeacherId: string | null = null;

  try {
    for (const [index, admission] of ['PROMOTE', 'RETAIN', 'REMOVE', 'REINSTATE', 'RACE', 'PROMOTE_RACE', 'TEACHER_PROMOTE', 'TEACHER_REMOVE'].entries()) {
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

    const { rows: onlineOnlyRows } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number)
       VALUES($1,'Primary 4',$2,$3) RETURNING id`,
      [`Online Only Learner ${suffix}`, schoolCode, `ONLINE-${suffix}`],
    );
    const onlineOnlyStudentId = String(onlineOnlyRows[0].id);

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
    const adminRosterResponse = await fetch(baseUrl, { headers: { Authorization: `Bearer ${token}` } });
    assert.equal(adminRosterResponse.status, 200);
    const adminRosterBody = await adminRosterResponse.json() as { students: Array<{ id: string }> };
    assert.ok(!adminRosterBody.students.some(student => student.id === onlineOnlyStudentId),
      'administrator physical report list excludes student profiles without report-roster membership');
    const onlineOnlyDetail = await fetch(`${baseUrl}/${onlineOnlyStudentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(onlineOnlyDetail.status, 404, 'physical report detail endpoint does not expose online-only profiles');
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

    const teacherUsername = `report-only-teacher-${suffix}`;
    const { rows: teacherUsers } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
       VALUES($1,'test-hash','teacher','Report Only Teacher',$2,'Primary 4',TRUE,FALSE)
       RETURNING id`,
      [teacherUsername, schoolCode],
    );
    const teacherAccountId = String(teacherUsers[0].id);
    teacherId = teacherAccountId;
    const teacherToken = signAccess({
      id: teacherAccountId,
      username: teacherUsername,
      role: 'teacher',
      school_code: schoolCode,
      assigned_class: 'Primary 4',
      assigned_subject_ids: [],
    });
    const teacherHeaders = { Authorization: `Bearer ${teacherToken}`, 'Content-Type': 'application/json' };
    const teacherRetain = await fetch(`${baseUrl}/${studentIds[1]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'retain' }),
    });
    assert.equal(teacherRetain.status, 200, 'assigned teacher can retain a student in their class');
    const teacherPromote = await fetch(`${baseUrl}/${studentIds[6]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'promote' }),
    });
    assert.equal(teacherPromote.status, 200, 'assigned teacher can promote a student to the next class');
    const teacherRemove = await fetch(`${baseUrl}/${studentIds[7]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'remove' }),
    });
    assert.equal(teacherRemove.status, 200, 'assigned teacher can remove a student from the physical report roster');
    const teacherDemote = await fetch(`${baseUrl}/${studentIds[1]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'demote' }),
    });
    assert.equal(teacherDemote.status, 403, 'teachers cannot demote students');
    const teacherReinstate = await fetch(`${baseUrl}/${studentIds[3]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'reinstate' }),
    });
    assert.equal(teacherReinstate.status, 403, 'teachers cannot reinstate removed students');
    const teacherWrongClass = await fetch(`${baseUrl}/${studentIds[0]}/promotion`, {
      method: 'POST', headers: teacherHeaders, body: JSON.stringify({ action: 'remove' }),
    });
    assert.equal(teacherWrongClass.status, 404, 'teachers cannot act on students outside their assigned class');
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
    assert.ok(!teacherRosterBody.students.some(student => student.id === onlineOnlyStudentId),
      'teacher roster never includes an online-only student profile');

    const teacherProfile = await fetch(`${baseUrl}/${studentIds[1]}`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert.equal(teacherProfile.status, 200);
    const teacherProfileBody = await teacherProfile.json() as { student: Record<string, unknown> };
    assert.deepEqual(Object.keys(teacherProfileBody.student).sort(),
      ['admission_number', 'class_name', 'created_at', 'date_of_birth', 'full_name', 'gender', 'id', 'school_code'].sort(),
      'teacher profile exposes report particulars teachers need to maintain, without online account or parent data');
    const updateTeacherProfile = await fetch(`${baseUrl}/${studentIds[1]}`, {
      method: 'PUT',
      headers: teacherHeaders,
      body: JSON.stringify({
        full_name: 'Updated Physical Report Student',
        gender: 'F',
        date_of_birth: '2012-04-05',
        admission_number: 'UPDATED-ROSTER-001',
        class_name: 'Primary 5',
      }),
    });
    assert.equal(updateTeacherProfile.status, 200, 'assigned teacher can edit report student particulars');
    const { rows: updatedStudent } = await query(
      'SELECT full_name,gender,date_of_birth,admission_number,class_name FROM students WHERE id=$1',
      [studentIds[1]],
    );
    assert.equal(updatedStudent[0]?.full_name, 'Updated Physical Report Student');
    assert.equal(updatedStudent[0]?.gender, 'F');
    const updatedDob = updatedStudent[0]?.date_of_birth;
    assert.equal(updatedDob instanceof Date ? updatedDob.toISOString().slice(0, 10) : String(updatedDob).slice(0, 10), '2012-04-05');
    assert.equal(updatedStudent[0]?.admission_number, 'UPDATED-ROSTER-001');
    assert.equal(updatedStudent[0]?.class_name, 'Primary 4', 'teacher profile editing cannot change the student class field');
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
    assert.equal(students.length, 8);
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
    assert.equal(byStudent.get(studentIds[6])?.class_name, 'Primary 5');
    assert.equal(byStudent.get(studentIds[6])?.status, 'active');
    assert.equal(byStudent.get(studentIds[7])?.class_name, 'Primary 4');
    assert.equal(byStudent.get(studentIds[7])?.status, 'removed');

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
      'concurrent administrator decisions must append exactly one removal event');
    assert.equal(eventTypes(studentIds[5]).filter(type => type === 'class_changed').length, 1,
      'concurrent administrator promotions must append exactly one class-change event');
    assert.ok(eventTypes(studentIds[6]).includes('class_changed'), 'teacher promotion is recorded in roster history');
    assert.ok(eventTypes(studentIds[7]).includes('removed'), 'teacher removal is recorded in roster history');

    // Primary 6 -> Secondary JSS 1 creates a new report-only identity while
    // leaving the original primary student and online account untouched.
    await query("INSERT INTO schools(code,name) VALUES('primary','Primary Test School') ON CONFLICT(code) DO NOTHING");
    await query("INSERT INTO schools(code,name) VALUES('secondary','Secondary Test School') ON CONFLICT(code) DO NOTHING");
    await query("INSERT INTO classes(school_code,name) VALUES('primary','Primary 6') ON CONFLICT(school_code,name) DO NOTHING");
    await query("INSERT INTO classes(school_code,name) VALUES('secondary','JSS 1') ON CONFLICT(school_code,name) DO NOTHING");
    const crossTeacherUsername = `roster-cross-section-teacher-${suffix}`;
    const { rows: crossTeacherRows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
       VALUES($1,'test-hash','teacher','Primary 6 Teacher','primary','Primary 6',TRUE,FALSE)
       RETURNING id`,
      [crossTeacherUsername],
    );
    crossSectionTeacherId = String(crossTeacherRows[0].id);
    const crossTeacherToken = signAccess({
      id: crossSectionTeacherId,
      username: crossTeacherUsername,
      role: 'teacher',
      school_code: 'primary',
      assigned_class: 'Primary 6',
      assigned_subject_ids: [],
    });
    const { rows: crossStudentRows } = await query(
      `INSERT INTO students(full_name,class_name,school_code)
       VALUES($1,'Primary 6','primary') RETURNING id`,
      [`Cross Section Promotion ${suffix}`],
    );
    const primaryStudentId = String(crossStudentRows[0].id);
    await query(
      `INSERT INTO report_roster_memberships(student_id,class_name,source_class_name,status)
       VALUES($1,'Primary 6','Primary 6','active')`,
      [primaryStudentId],
    );
    const crossPromotion = await fetch(`${baseUrl}/${primaryStudentId}/promotion`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${crossTeacherToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'promote' }),
    });
    assert.equal(crossPromotion.status, 200, 'Primary 6 teacher can promote into Secondary JSS 1');
    const crossPromotionBody = await crossPromotion.json() as {
      from_class: string; to_class: string; cross_section: boolean;
      destination_student_id: string; online_account_unchanged: boolean;
    };
    assert.equal(crossPromotionBody.from_class, 'Primary 6');
    assert.equal(crossPromotionBody.to_class, 'JSS 1');
    assert.equal(crossPromotionBody.cross_section, true);
    assert.equal(crossPromotionBody.online_account_unchanged, true);
    const { rows: preservedPrimary } = await query(
      'SELECT school_code,class_name,user_id FROM students WHERE id=$1',
      [primaryStudentId],
    );
    assert.equal(preservedPrimary[0]?.school_code, 'primary');
    assert.equal(preservedPrimary[0]?.class_name, 'Primary 6');
    assert.equal(preservedPrimary[0]?.user_id, null);
    const { rows: promotedSecondary } = await query(
      'SELECT school_code,class_name,user_id,admission_number FROM students WHERE id=$1',
      [crossPromotionBody.destination_student_id],
    );
    assert.equal(promotedSecondary[0]?.school_code, 'secondary');
    assert.equal(promotedSecondary[0]?.class_name, 'JSS 1');
    assert.equal(promotedSecondary[0]?.user_id, null);
    assert.equal(promotedSecondary[0]?.admission_number, null);
    const { rows: crossMemberships } = await query(
      'SELECT student_id,class_name,status FROM report_roster_memberships WHERE student_id=ANY($1::uuid[])',
      [[primaryStudentId, crossPromotionBody.destination_student_id]],
    );
    assert.equal(crossMemberships.find(row => row.student_id === primaryStudentId)?.status, 'removed');
    assert.equal(crossMemberships.find(row => row.student_id === crossPromotionBody.destination_student_id)?.class_name, 'JSS 1');
    assert.equal(crossMemberships.find(row => row.student_id === crossPromotionBody.destination_student_id)?.status, 'active');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    // The append-only event log intentionally retains the test history. The
    // dedicated synthetic school and its rows are isolated from real schools;
    // the disposable PostgreSQL service is discarded at workflow end.
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[adminId, ...(teacherId ? [teacherId] : []), ...(crossSectionTeacherId ? [crossSectionTeacherId] : [])]]);
  }
});
