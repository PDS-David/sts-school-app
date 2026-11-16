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

async function createUser(label: string, schoolCode: string | null) {
  const username = `bsec27-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,'test-hash','admin',$2,$3,TRUE,FALSE) RETURNING id`,
    [username, `BSEC27 ${label}`, schoolCode],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role: 'admin',
      school_code: schoolCode,
      assigned_class: null,
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
  return { server, baseUrl: `http://127.0.0.1:${port}/academic` };
}

test('school-bound administrators cannot override academic school scope', async () => {
  const suffix = randomUUID().slice(0, 8);
  const globalAdmin = await createUser('global-admin', null);
  const primaryAdmin = await createUser('primary-admin', 'primary');
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
    const get = (token: string, path: string) => fetch(`${started.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const post = (token: string, path: string, body: Record<string, unknown>) => fetch(`${started.baseUrl}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const put = (token: string, path: string, body: Record<string, unknown>) => fetch(`${started.baseUrl}${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const del = (token: string, path: string) => fetch(`${started.baseUrl}${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const terms = await get(primaryAdmin.token, '/terms');
    assert.equal(terms.status, 200);
    const primaryTerms = (await terms.json() as { terms: Array<{ school_code: string }> }).terms;
    assert.ok(primaryTerms.length > 0);
    assert.ok(primaryTerms.every(row => row.school_code === 'primary'));

    const foreignTerms = await get(primaryAdmin.token, '/terms?school_code=secondary');
    assert.equal(foreignTerms.status, 403);

    const foreignCurrentTerm = await get(primaryAdmin.token, '/terms/current?school_code=secondary');
    assert.equal(foreignCurrentTerm.status, 403);

    const globalSecondaryTerms = await get(globalAdmin.token, '/terms?school_code=secondary');
    assert.equal(globalSecondaryTerms.status, 200);
    assert.ok((await globalSecondaryTerms.json() as { terms: Array<{ school_code: string }> }).terms
      .every(row => row.school_code === 'secondary'));

    const subjects = await get(primaryAdmin.token, '/subjects');
    assert.equal(subjects.status, 200);
    assert.ok((await subjects.json() as { subjects: Array<{ school_code: string }> }).subjects
      .every(row => row.school_code === 'primary'));

    const foreignSubjects = await get(primaryAdmin.token, '/subjects?school_code=secondary');
    assert.equal(foreignSubjects.status, 403);

    const classes = await get(primaryAdmin.token, '/classes');
    assert.equal(classes.status, 200);
    assert.ok((await classes.json() as { classes: Array<{ school_code: string }> }).classes
      .every(row => row.school_code === 'primary'));

    const foreignClasses = await get(primaryAdmin.token, '/classes?school_code=secondary');
    assert.equal(foreignClasses.status, 403);

    const deniedTermCreate = await post(primaryAdmin.token, '/terms', {
      name: 'Second Term', academic_year: `BSEC27-CREATE-${suffix}`, school_code: 'secondary',
    });
    assert.equal(deniedTermCreate.status, 403);

    const ownTermCreate = await post(primaryAdmin.token, '/terms', {
      name: 'Second Term', academic_year: `BSEC27-CREATE-${suffix}`, school_code: 'primary',
    });
    assert.equal(ownTermCreate.status, 201);
    const createdTerm = (await ownTermCreate.json() as { term: { id: number; school_code: string } }).term;
    termIds.push(Number(createdTerm.id));
    assert.equal(createdTerm.school_code, 'primary');

    const deniedTermUpdate = await put(primaryAdmin.token, `/terms/${secondaryTerm}`, { days_opened: 3 });
    assert.equal(deniedTermUpdate.status, 404);
    const ownTermUpdate = await put(primaryAdmin.token, `/terms/${primaryTerm}`, { days_opened: 3 });
    assert.equal(ownTermUpdate.status, 200);

    const deniedSubjectCreate = await post(primaryAdmin.token, '/subjects', {
      name: `BSEC27 Forbidden ${suffix}`, school_code: 'secondary',
    });
    assert.equal(deniedSubjectCreate.status, 403);

    const ownSubjectCreate = await post(primaryAdmin.token, '/subjects', {
      name: `BSEC27 Created ${suffix}`, code: `BSEC27-CREATED-${suffix}`,
    });
    assert.equal(ownSubjectCreate.status, 200);
    const createdSubject = (await ownSubjectCreate.json() as { subject: { id: number; school_code: string } }).subject;
    subjectIds.push(Number(createdSubject.id));
    assert.equal(createdSubject.school_code, 'primary');

    const deniedSubjectDelete = await del(primaryAdmin.token, `/subjects/${secondarySubject}`);
    assert.equal(deniedSubjectDelete.status, 404);
    const secondarySubjectStillExists = await query('SELECT id FROM subjects WHERE id=$1', [secondarySubject]);
    assert.equal(secondarySubjectStillExists.rows.length, 1);

    const ownSubjectDelete = await del(primaryAdmin.token, `/subjects/${primarySubject}`);
    assert.equal(ownSubjectDelete.status, 200);
    subjectIds.splice(subjectIds.indexOf(primarySubject), 1);
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (subjectIds.length) await query('DELETE FROM subjects WHERE id=ANY($1::int[])', [subjectIds]);
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[globalAdmin.id, primaryAdmin.id]]);
  }
});
