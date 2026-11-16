import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import academicRouter from '../backend/src/routes/academic.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(
  label: string,
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'finance_admin',
  schoolCode: string | null,
  assignedClass: string | null = null,
) {
  const username = `bsec25-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,$5,TRUE,FALSE) RETURNING id`,
    [username, role, `BSEC25 ${label}`, schoolCode, assignedClass],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role,
      school_code: schoolCode,
      assigned_class: assignedClass,
      assigned_subject_ids: [],
    }),
  };
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/academic', academicRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/academic/class-locks` };
}

test('class lock reads are restricted to class teachers and administrators', async () => {
  const suffix = randomUUID().slice(0, 8);
  const admin = await createUser('admin', 'admin', null);
  const primaryAdmin = await createUser('primary-admin', 'admin', 'primary');
  const primaryTeacher = await createUser('primary-teacher', 'teacher', 'primary', 'Primary 4');
  const secondaryTeacher = await createUser('secondary-teacher', 'teacher', 'secondary', 'Primary 4');
  const subjectOnlyTeacher = await createUser('subject-only-teacher', 'teacher', 'primary');
  const student = await createUser('student', 'student', 'primary', 'Primary 4');
  const parent = await createUser('parent', 'parent', null);
  const financeAdmin = await createUser('finance-admin', 'finance_admin', null);
  const termIds: number[] = [];
  const lockIds: number[] = [];
  let server: Server | undefined;

  try {
    for (const schoolCode of ['primary', 'secondary']) {
      const { rows } = await query(
        `INSERT INTO terms(name,academic_year,school_code,start_date,end_date,days_opened)
         VALUES('First Term',$1,$2,CURRENT_DATE,CURRENT_DATE + INTERVAL '90 days',0)
         RETURNING id`,
        [`BSEC25-${suffix}`, schoolCode],
      );
      termIds.push(Number(rows[0].id));
    }
    const [primaryTerm, secondaryTerm] = termIds;
    for (const [schoolCode, className, termId] of [
      ['primary', 'Primary 4', primaryTerm],
      ['primary', 'Primary 5', primaryTerm],
      ['secondary', 'Primary 4', secondaryTerm],
    ] as const) {
      const { rows } = await query(
        'INSERT INTO class_locks(school_code,class_name,term_id,locked_by) VALUES($1,$2,$3,$4) RETURNING id',
        [schoolCode, className, termId, admin.id],
      );
      lockIds.push(Number(rows[0].id));
    }

    const started = await startServer();
    server = started.server;
    const get = (token: string, queryString: string) => fetch(
      `${started.baseUrl}${queryString}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const put = (token: string, body: Record<string, unknown>) => fetch(
      started.baseUrl,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    const primaryQuery = `?class_name=Primary%204&term_id=${primaryTerm}`;

    const adminRead = await get(admin.token, `${primaryQuery}&school_code=primary`);
    assert.equal(adminRead.status, 200);
    assert.equal((await adminRead.json() as { lock: { school_code: string } }).lock.school_code, 'primary');

    const adminMissingSchool = await get(admin.token, primaryQuery);
    assert.equal(adminMissingSchool.status, 400, 'global admins must name the school explicitly');

    const schoolAdminRead = await get(primaryAdmin.token, primaryQuery);
    assert.equal(schoolAdminRead.status, 200, 'school-bound admins should use their assigned school without a query override');
    assert.equal((await schoolAdminRead.json() as { lock: { school_code: string } }).lock.school_code, 'primary');

    const schoolAdminSpoofedSchool = await get(primaryAdmin.token, `${primaryQuery}&school_code=secondary`);
    assert.equal(schoolAdminSpoofedSchool.status, 403, 'school-bound admins cannot inspect another school by forging school_code');

    const globalAdminMissingWriteSchool = await put(admin.token, {
      class_name: 'Primary 4', term_id: primaryTerm, locked: true,
    });
    assert.equal(globalAdminMissingWriteSchool.status, 400, 'global admins must name the school when changing class locks');

    const schoolAdminOwnWrite = await put(primaryAdmin.token, {
      class_name: 'Primary 4', term_id: primaryTerm, locked: true,
    });
    assert.equal(schoolAdminOwnWrite.status, 200);
    assert.equal((await schoolAdminOwnWrite.json() as { lock: { school_code: string } }).lock.school_code, 'primary');

    const schoolAdminSpoofedWrite = await put(primaryAdmin.token, {
      class_name: 'Primary 4', term_id: secondaryTerm, school_code: 'secondary', locked: false,
    });
    assert.equal(schoolAdminSpoofedWrite.status, 403, 'school-bound admins cannot unlock another school by forging school_code');

    const teacherSpoofedWrite = await put(primaryTeacher.token, {
      class_name: 'Primary 4', term_id: primaryTerm, school_code: 'secondary', locked: true,
    });
    assert.equal(teacherSpoofedWrite.status, 200, 'teacher-supplied school_code remains ignored in favour of authenticated school');
    assert.equal((await teacherSpoofedWrite.json() as { lock: { school_code: string } }).lock.school_code, 'primary');

    const globalAdminSecondaryWrite = await put(admin.token, {
      class_name: 'Primary 4', term_id: secondaryTerm, school_code: 'secondary', locked: true,
    });
    assert.equal(globalAdminSecondaryWrite.status, 200, 'global admins retain explicit cross-school management');

    const invalidWriteTerm = await put(admin.token, {
      class_name: 'Primary 4', term_id: 'not-a-number', school_code: 'primary', locked: true,
    });
    assert.equal(invalidWriteTerm.status, 400, 'invalid term IDs are rejected before SQL');

    const unknownWriteClass = await put(admin.token, {
      class_name: 'NotAClass', term_id: primaryTerm, school_code: 'primary', locked: true,
    });
    assert.equal(unknownWriteClass.status, 400, 'class locks cannot be created for unknown school classes');

    const secondaryLockStillExists = await query(
      'SELECT id FROM class_locks WHERE school_code=$1 AND class_name=$2 AND term_id=$3',
      ['secondary', 'Primary 4', secondaryTerm],
    );
    assert.equal(secondaryLockStillExists.rows.length, 1, 'denied school-bound admin write must not mutate the other school lock');

    const teacherOwnClass = await get(primaryTeacher.token, primaryQuery);
    assert.equal(teacherOwnClass.status, 200);
    assert.equal((await teacherOwnClass.json() as { lock: { school_code: string } }).lock.school_code, 'primary');

    const teacherOtherClass = await get(
      primaryTeacher.token,
      `?class_name=Primary%205&term_id=${primaryTerm}`,
    );
    assert.equal(teacherOtherClass.status, 403, 'class teachers cannot inspect another class lock');

    const teacherSpoofedSchool = await get(
      primaryTeacher.token,
      `${primaryQuery}&school_code=secondary`,
    );
    assert.equal(teacherSpoofedSchool.status, 200);
    assert.equal((await teacherSpoofedSchool.json() as { lock: { school_code: string } }).lock.school_code, 'primary',
      'teacher-supplied school_code must never override the authenticated school');

    const foreignTerm = await get(primaryTeacher.token, `?class_name=Primary%204&term_id=${secondaryTerm}`);
    assert.equal(foreignTerm.status, 400, 'teacher cannot inspect a lock for a term in another school');

    const noClassAssignment = await get(subjectOnlyTeacher.token, primaryQuery);
    assert.equal(noClassAssignment.status, 403, 'subject-only teachers cannot inspect class-wide lock state');

    for (const [label, token] of [
      ['student', student.token],
      ['parent', parent.token],
      ['finance admin', financeAdmin.token],
    ] as const) {
      const denied = await get(token, primaryQuery);
      assert.equal(denied.status, 403, `${label} must not read class lock administration state`);
    }

    const invalidTerm = await get(admin.token, '?class_name=Primary%204&term_id=not-a-number&school_code=primary');
    assert.equal(invalidTerm.status, 400);

    const unknownClass = await get(admin.token, `?class_name=NotAClass&term_id=${primaryTerm}&school_code=primary`);
    assert.equal(unknownClass.status, 400);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (lockIds.length) await query('DELETE FROM class_locks WHERE id=ANY($1::int[])', [lockIds]);
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])',
      [[admin.id, primaryAdmin.id, primaryTeacher.id, secondaryTeacher.id, subjectOnlyTeacher.id, student.id, parent.id, financeAdmin.id]]);
  }
});


test('school-bound administrators cannot override academic school scope', async () => {
  const suffix = randomUUID().slice(0, 8);
  const globalAdmin = await createUser('global-admin', 'admin', null);
  const primaryAdmin = await createUser('primary-admin', 'admin', 'primary');
  const termIds: number[] = [];
  const subjectIds: number[] = [];
  let server: Server | undefined;

  try {
    for (const schoolCode of ['primary', 'secondary']) {
      const { rows } = await query(
        `INSERT INTO terms(name,academic_year,school_code,start_date,end_date,days_opened)
         VALUES('First Term',$1,$2,CURRENT_DATE,CURRENT_DATE + INTERVAL '90 days',0)
         RETURNING id`,
        [`BSEC27-${suffix}`, schoolCode],
      );
      termIds.push(Number(rows[0].id));
      const subject = await query(
        'INSERT INTO subjects(name,code,school_code) VALUES($1,$2,$3) RETURNING id',
        [`BSEC27 Subject ${suffix}`, `BSEC27-${suffix}`, schoolCode],
      );
      subjectIds.push(Number(subject.rows[0].id));
    }
    const [primaryTerm, secondaryTerm] = termIds;
    const [primarySubject, secondarySubject] = subjectIds;

    const started = await startServer();
    server = started.server;
    const academicBase = started.baseUrl.slice(0, -'/class-locks'.length);
    const getAcademic = (token: string, path: string) => fetch(`${academicBase}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const postAcademic = (token: string, path: string, body: Record<string, unknown>) => fetch(`${academicBase}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const putAcademic = (token: string, path: string, body: Record<string, unknown>) => fetch(`${academicBase}${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const deleteAcademic = (token: string, path: string) => fetch(`${academicBase}${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const terms = await getAcademic(primaryAdmin.token, '/terms');
    assert.equal(terms.status, 200);
    const primaryTerms = (await terms.json() as { terms: Array<{ school_code: string }> }).terms;
    assert.ok(primaryTerms.length > 0);
    assert.ok(primaryTerms.every(row => row.school_code === 'primary'));

    assert.equal((await getAcademic(primaryAdmin.token, '/terms?school_code=secondary')).status, 403);
    assert.equal((await getAcademic(primaryAdmin.token, '/terms/current?school_code=secondary')).status, 403);

    const globalSecondaryTerms = await getAcademic(globalAdmin.token, '/terms?school_code=secondary');
    assert.equal(globalSecondaryTerms.status, 200);
    assert.ok((await globalSecondaryTerms.json() as { terms: Array<{ school_code: string }> }).terms
      .every(row => row.school_code === 'secondary'));

    const subjects = await getAcademic(primaryAdmin.token, '/subjects');
    assert.equal(subjects.status, 200);
    assert.ok((await subjects.json() as { subjects: Array<{ school_code: string }> }).subjects
      .every(row => row.school_code === 'primary'));
    assert.equal((await getAcademic(primaryAdmin.token, '/subjects?school_code=secondary')).status, 403);

    const classes = await getAcademic(primaryAdmin.token, '/classes');
    assert.equal(classes.status, 200);
    assert.ok((await classes.json() as { classes: Array<{ school_code: string }> }).classes
      .every(row => row.school_code === 'primary'));
    assert.equal((await getAcademic(primaryAdmin.token, '/classes?school_code=secondary')).status, 403);

    const deniedTermCreate = await postAcademic(primaryAdmin.token, '/terms', {
      name: 'Second Term', academic_year: `B27-${suffix}`, school_code: 'secondary',
    });
    assert.equal(deniedTermCreate.status, 403);

    const ownTermCreate = await postAcademic(primaryAdmin.token, '/terms', {
      name: 'Second Term', academic_year: `B27-${suffix}`, school_code: 'primary',
    });
    assert.equal(ownTermCreate.status, 201);
    const createdTerm = (await ownTermCreate.json() as { term: { id: number; school_code: string } }).term;
    termIds.push(Number(createdTerm.id));
    assert.equal(createdTerm.school_code, 'primary');

    assert.equal((await putAcademic(primaryAdmin.token, `/terms/${secondaryTerm}`, { days_opened: 3 })).status, 404);
    assert.equal((await putAcademic(primaryAdmin.token, `/terms/${primaryTerm}`, { days_opened: 3 })).status, 200);

    const deniedSubjectCreate = await postAcademic(primaryAdmin.token, '/subjects', {
      name: `BSEC27 Forbidden ${suffix}`, school_code: 'secondary',
    });
    assert.equal(deniedSubjectCreate.status, 403);

    const ownSubjectCreate = await postAcademic(primaryAdmin.token, '/subjects', {
      name: `BSEC27 Created ${suffix}`, code: `BSEC27-CREATED-${suffix}`,
    });
    assert.equal(ownSubjectCreate.status, 200);
    const createdSubject = (await ownSubjectCreate.json() as { subject: { id: number; school_code: string } }).subject;
    subjectIds.push(Number(createdSubject.id));
    assert.equal(createdSubject.school_code, 'primary');

    assert.equal((await deleteAcademic(primaryAdmin.token, `/subjects/${secondarySubject}`)).status, 404);
    const secondarySubjectStillExists = await query('SELECT id FROM subjects WHERE id=$1', [secondarySubject]);
    assert.equal(secondarySubjectStillExists.rows.length, 1);

    assert.equal((await deleteAcademic(primaryAdmin.token, `/subjects/${primarySubject}`)).status, 200);
    subjectIds.splice(subjectIds.indexOf(primarySubject), 1);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (subjectIds.length) await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [subjectIds]);
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])',
      [[globalAdmin.id, primaryAdmin.id]]);
  }
});
