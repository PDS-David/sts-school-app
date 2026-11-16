// School-management route integration tests against a disposable local PostgreSQL database.
// Set SCHOOL_MANAGEMENT_TEST_DATABASE_URL to a loopback PostgreSQL server URL with CREATEDB privileges.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import test, { after } from 'node:test';
import pg from 'pg';

const SERVER_URL = process.env.SCHOOL_MANAGEMENT_TEST_DATABASE_URL;
if (!SERVER_URL) {
  test('school-management route integration (skipped: SCHOOL_MANAGEMENT_TEST_DATABASE_URL not set)', { skip: true }, () => {});
} else {
  const serverUrl = new URL(SERVER_URL);
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(serverUrl.hostname), 'refusing non-loopback database host');

  const suffix = randomBytes(4).toString('hex');
  const databaseName = 'jss3_test_school_mgmt_' + suffix;
  const databaseUrl = new URL(SERVER_URL);
  databaseUrl.pathname = '/' + databaseName;
  const adminClient = new pg.Client({ connectionString: SERVER_URL });
  await adminClient.connect();
  await adminClient.query('CREATE DATABASE "' + databaseName + '"');

  process.env.DATABASE_URL = databaseUrl.toString();
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'school-management-test-secret-only';
  process.env.JWT_REFRESH_SECRET = 'school-management-refresh-secret-only';
  process.env.TERM_PIN_ENFORCED = 'false';

  const { pool, query } = await import('../backend/src/db/pool.js');
  const { bootstrap } = await import('../backend/src/db/bootstrap.js');
  const bootstrapClient = await pool.connect();
  try { assert.equal(await bootstrap(bootstrapClient), 'created'); }
  finally { bootstrapClient.release(); }

  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: eventsRouter } = await import('../backend/src/routes/schoolEvents.js');
  const { default: announcementsRouter } = await import('../backend/src/routes/announcements.js');
  const { default: learningRouter } = await import('../backend/src/routes/learning.js');
  const { default: scoresRouter } = await import('../backend/src/routes/scores.js');
  const { signAccess } = await import('../backend/src/utils/jwt.js');

  const app = express();
  app.use(express.json());
  app.use('/school-events', eventsRouter);
  app.use('/announcements', announcementsRouter);
  app.use('/learning', learningRouter);
  app.use('/scores', scoresRouter);
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = 'http://127.0.0.1:' + (server.address() as AddressInfo).port;

  type Role = 'admin' | 'teacher' | 'student' | 'parent';
  type TestUser = { id: string; username: string; role: Role; school_code: string | null; assigned_class: string | null; assigned_subject_ids: number[]; token: string };
  async function createUser(role: Role, school: string | null, assignedClass: string | null = null): Promise<TestUser> {
    const username = 'smm-' + role + '-' + randomBytes(5).toString('hex');
    const result = await query(
      'INSERT INTO users(username,password_hash,role,school_code,assigned_class,is_active) VALUES($1,$2,$3,$4,$5,TRUE) RETURNING id',
      [username, 'not-a-login-hash', role, school, assignedClass],
    );
    const user = { id: result.rows[0].id as string, username, role, school_code: school, assigned_class: assignedClass, assigned_subject_ids: [] as number[] };
    return { ...user, token: signAccess(user) };
  }
  async function request(path: string, user: TestUser, method = 'GET', body?: unknown) {
    const response = await fetch(baseUrl + path, {
      method,
      headers: { authorization: 'Bearer ' + user.token, ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const raw = await response.text();
    let payload: any;
    try { payload = JSON.parse(raw); }
    catch { payload = { non_json_response: raw.slice(0, 500) }; }
    return { status: response.status, payload };
  }

  const schoolAdmin = await createUser('admin', 'primary');
  const globalAdmin = await createUser('admin', null);
  const secondaryAdmin = await createUser('admin', 'secondary');
  const classTeacher = await createUser('teacher', 'primary', 'Primary 4');
  const subjectTeacher = await createUser('teacher', 'primary');
  const studentUser = await createUser('student', 'primary');
  const otherStudentUser = await createUser('student', 'primary');
  const outsideStudentUser = await createUser('student', 'primary');
  const parentUser = await createUser('parent', 'primary');
  const unrelatedParent = await createUser('parent', 'primary');

  const studentInsert = await query(
    'INSERT INTO students(school_code,full_name,class_name,user_id,admission_number) VALUES($1,$2,$3,$4,$5),($1,$6,$3,$7,$8),($1,$9,$10,$11,$12) RETURNING id,user_id',
    ['primary', 'SMM Student', 'Primary 4', studentUser.id, 'SMM-' + suffix, 'Second Primary 4 Student', otherStudentUser.id, 'SMM-SECOND-' + suffix, 'Other Class Student', 'Primary 5', outsideStudentUser.id, 'SMM-OTHER-' + suffix],
  );
  const studentId = studentInsert.rows.find((r: any) => r.user_id === studentUser.id).id as string;
  const otherStudentId = studentInsert.rows.find((r: any) => r.user_id === otherStudentUser.id).id as string;
  await query('INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2)', [parentUser.id, studentId]);

  const subjectInsert = await query(
    "INSERT INTO subjects(school_code,name,code) VALUES('primary','SMM Mathematics','SMM-MATH'),('primary','SMM English','SMM-ENG'),('secondary','SMM Science','SMM-SCI') RETURNING id,school_code,name",
  );
  const mathId = Number(subjectInsert.rows.find((r: any) => r.name === 'SMM Mathematics').id);
  const englishId = Number(subjectInsert.rows.find((r: any) => r.name === 'SMM English').id);
  await query('INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,$2)', [subjectTeacher.id, mathId]);
  const termResult = await query("SELECT id FROM terms WHERE school_code='primary' AND is_current=TRUE LIMIT 1");
  const termId = Number(termResult.rows[0].id);

  const future = (days: number) => new Date(Date.now() + days * 86400000).toISOString();
  const eventDate = future(8);
  const eventEnd = future(8).replace(/T.*$/, 'T23:59:00.000Z');
  const assessmentOne = await query(
    "INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,total_marks,start_at,end_at,status,created_by) VALUES('primary',$1,'Primary 4',$2,'Ward Test',100,$3,$4,'open',$5) RETURNING id",
    [mathId, termId, future(3), future(4), schoolAdmin.id],
  );
  await query(
    "INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,total_marks,start_at,end_at,status,created_by) VALUES('primary',$1,'Primary 5',$2,'Other Class Test',100,$3,$4,'open',$5)",
    [englishId, termId, future(5), future(6), schoolAdmin.id],
  );
  const assessmentId = assessmentOne.rows[0].id as string;
  const perfectAssessment = await query(
    "INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,total_marks,start_at,end_at,status,created_by) VALUES('primary',$1,'Primary 4',$2,'Perfect Test',100,$3,$4,'open',$5) RETURNING id",
    [mathId, termId, future(7), future(8), schoolAdmin.id],
  );
  await query(
    'INSERT INTO submissions(assessment_id,student_id,total_score,submitted_at,fully_graded) VALUES($1,$2,85,now(),TRUE),($3,$2,100,now(),TRUE)',
    [assessmentId, studentId, perfectAssessment.rows[0].id],
  );

  const topicInsert = await query(
    "INSERT INTO topics(school_code,subject_id,class_name,title,created_by) SELECT 'primary',$1,'Primary 4','SMM Topic ' || n,$2 FROM generate_series(1,10) n RETURNING id",
    [mathId, schoolAdmin.id],
  );
  for (const row of topicInsert.rows) {
    await query('INSERT INTO topic_completions(topic_id,student_id,passed,completed_at) VALUES($1,$2,TRUE,now())', [row.id, studentId]);
  }

  await query(
    'INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,entered_by) VALUES($1,$2,$3,10,10,60,$4),($5,$6,$3,10,10,60,$4)',
    [studentId, mathId, termId, classTeacher.id, otherStudentId, englishId],
  );

  after(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await pool.end();
    await adminClient.query('DROP DATABASE IF EXISTS "' + databaseName + '" WITH (FORCE)');
    const left = await adminClient.query('SELECT datname FROM pg_database WHERE datname=$1', [databaseName]);
    await adminClient.end();
    assert.equal(left.rowCount, 0, 'disposable school-management database removed');
  });

  test('school events enforce school, class and audience visibility and admin write boundaries', async () => {
    const parentEvent = await request('/school-events', schoolAdmin, 'POST', {
      title: 'Parent meeting', event_type: 'meeting', audience_role: 'parent', class_name: 'Primary 4',
      start_at: eventDate, end_at: eventEnd, school_code: 'primary',
    });
    assert.equal(parentEvent.status, 201, JSON.stringify(parentEvent.payload));
    const studentEvent = await request('/school-events', schoolAdmin, 'POST', {
      title: 'Student revision', event_type: 'event', audience_role: 'student', class_name: 'Primary 4',
      start_at: future(9), school_code: 'primary',
    });
    assert.equal(studentEvent.status, 201, JSON.stringify(studentEvent.payload));
    const teacherEvent = await request('/school-events', schoolAdmin, 'POST', {
      title: 'Staff briefing', audience_role: 'teacher', class_name: 'Primary 4',
      start_at: future(10), school_code: 'primary',
    });
    assert.equal(teacherEvent.status, 201, JSON.stringify(teacherEvent.payload));

    const parentFeed = await request('/school-events', parentUser);
    assert.deepEqual(parentFeed.payload.events.map((e: any) => e.title), ['Parent meeting']);
    const unrelatedFeed = await request('/school-events', unrelatedParent);
    assert.deepEqual(unrelatedFeed.payload.events, []);
    const studentFeed = await request('/school-events', studentUser);
    assert.deepEqual(studentFeed.payload.events.map((e: any) => e.title), ['Student revision']);
    const teacherFeed = await request('/school-events', classTeacher);
    assert.deepEqual(teacherFeed.payload.events.map((e: any) => e.title), ['Staff briefing']);
    const schoolAdminFeed = await request('/school-events', schoolAdmin);
    assert.equal(schoolAdminFeed.payload.events.length, 3);

    const crossSchoolWrite = await request('/school-events', schoolAdmin, 'POST', {
      title: 'Cross-school event', start_at: future(11), school_code: 'secondary',
    });
    assert.equal(crossSchoolWrite.status, 403);
    const invalidRange = await request('/school-events', schoolAdmin, 'POST', {
      title: 'Invalid range', start_at: future(12), end_at: future(11), school_code: 'primary',
    });
    assert.equal(invalidRange.status, 400);

    const foreignEvent = await request('/school-events', secondaryAdmin, 'POST', {
      title: 'Secondary event', start_at: future(12), school_code: 'secondary',
    });
    assert.equal(foreignEvent.status, 201);
    const forbiddenDelete = await request('/school-events/' + foreignEvent.payload.event.id, schoolAdmin, 'DELETE');
    assert.equal(forbiddenDelete.status, 404);
    const globalDelete = await request('/school-events/' + foreignEvent.payload.event.id, globalAdmin, 'DELETE');
    assert.equal(globalDelete.status, 200);
  });

  test('announcements enforce ward/class/audience visibility and admin school isolation', async () => {
    const parentNotice = await request('/announcements', schoolAdmin, 'POST', {
      title: 'Parent notice', body: 'For the linked Primary 4 family.', audience_role: 'parent',
      class_name: 'Primary 4', expires_at: future(14), school_code: 'primary',
    });
    assert.equal(parentNotice.status, 201, JSON.stringify(parentNotice.payload));
    const studentNotice = await request('/announcements', schoolAdmin, 'POST', {
      title: 'Student notice', body: 'For Primary 4 students.', audience_role: 'student',
      class_name: 'Primary 4', school_code: 'primary',
    });
    assert.equal(studentNotice.status, 201, JSON.stringify(studentNotice.payload));
    const parentFeed = await request('/announcements', parentUser);
    assert.deepEqual(parentFeed.payload.announcements.map((a: any) => a.title), ['Parent notice']);
    const unrelatedFeed = await request('/announcements', unrelatedParent);
    assert.deepEqual(unrelatedFeed.payload.announcements, []);
    const studentFeed = await request('/announcements', studentUser);
    assert.deepEqual(studentFeed.payload.announcements.map((a: any) => a.title), ['Student notice']);
    const crossSchool = await request('/announcements', schoolAdmin, 'POST', {
      title: 'Wrong school', body: 'Should be refused', school_code: 'secondary',
    });
    assert.equal(crossSchool.status, 403);
    const globalNotice = await request('/announcements', globalAdmin, 'POST', {
      title: 'Secondary announcement', body: 'Global admin may target a named school.', school_code: 'secondary',
    });
    assert.equal(globalNotice.status, 201, JSON.stringify(globalNotice.payload));
  });

  test('parent upcoming tests are limited to active linked wards and achievements are derived from verified results', async () => {
    const parentTests = await request('/learning/parent/upcoming-assessments', parentUser);
    assert.equal(parentTests.status, 200, JSON.stringify(parentTests.payload));
    assert.deepEqual(parentTests.payload.assessments.map((a: any) => a.title), ['Ward Test', 'Perfect Test']);
    const achievements = await request('/learning/achievements/me', studentUser);
    assert.equal(achievements.status, 200, JSON.stringify(achievements.payload));
    assert.equal(achievements.payload.summary.topics_passed, 10);
    assert.equal(achievements.payload.summary.assessments_submitted, 2);
    assert.equal(achievements.payload.badges.find((b: any) => b.id === 'topic-explorer').earned, true);
    assert.equal(achievements.payload.badges.find((b: any) => b.id === 'topic-scholar').earned, false);
    assert.equal(achievements.payload.badges.find((b: any) => b.id === 'assessment-ace').earned, true);
    assert.equal(achievements.payload.badges.find((b: any) => b.id === 'perfect-score').earned, true);
    const denied = await request('/learning/achievements/me', classTeacher);
    assert.equal(denied.status, 403);
  });

  test('teacher marking overview counts missing marks and respects class and subject assignments', async () => {
    const classOverview = await request('/scores/teacher/overview', classTeacher);
    assert.equal(classOverview.status, 200, JSON.stringify(classOverview.payload));
    assert.equal(Number(classOverview.payload.summary.student_count), 2);
    assert.equal(Number(classOverview.payload.summary.expected_score_entries), 4);
    assert.equal(Number(classOverview.payload.summary.marked_score_entries), 2);
    assert.equal(Number(classOverview.payload.summary.pending_score_entries), 2);
    assert.equal(classOverview.payload.subjects.length, 2);

    const subjectOnlyOverview = await request('/scores/teacher/overview', subjectTeacher);
    assert.equal(subjectOnlyOverview.status, 200, JSON.stringify(subjectOnlyOverview.payload));
    assert.equal(Number(subjectOnlyOverview.payload.summary.student_count), 2);
    assert.equal(Number(subjectOnlyOverview.payload.summary.expected_score_entries), 2);
    assert.equal(Number(subjectOnlyOverview.payload.summary.marked_score_entries), 1);
    assert.equal(Number(subjectOnlyOverview.payload.summary.pending_score_entries), 1);
    assert.equal(subjectOnlyOverview.payload.summary.attendance_rate, null);
    assert.equal(subjectOnlyOverview.payload.summary.attendance_records, 0);
    assert.equal(subjectOnlyOverview.payload.summary.weekly_effort_entries, 0);
  });
}
