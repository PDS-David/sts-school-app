import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import learningRouter from '../backend/src/routes/learning.js';
import { loadSs23Packages } from '../backend/src/db/ss23/loader.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createStudent(label: string, className: 'SS 2' | 'SS 3') {
  const suffix = randomUUID();
  const username = 's23-' + label + '-' + suffix;
  const { rows } = await query(
    'INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,is_active,pending_admin_review) ' +
    'VALUES($1,$2,$3,$4,$5,$6,TRUE,FALSE) RETURNING id',
    [username, 'test-hash', 'student', 'SS23 Route ' + label, 'secondary', className],
  );
  const id = String(rows[0].id);
  await query(
    'INSERT INTO students(full_name,class_name,school_code,admission_number,user_id) ' +
    'VALUES($1,$2,$3,$4,$5)',
    ['SS23 Route ' + label, className, 'secondary', 'S23-' + suffix, id],
  );
  return {
    id,
    token: signAccess({
      id,
      username,
      role: 'student',
      school_code: 'secondary',
      assigned_class: className,
      assigned_subject_ids: [],
    }),
  };
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/learning', learningRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: 'http://127.0.0.1:' + port + '/learning' };
}

test('SS2 and SS3 HTTP routes fail closed for every unapproved SS23 unit and asset', async () => {
  const users: Array<{ id: string; token: string }> = [];
  let server: Server | undefined;
  try {
    users.push(await createStudent('ss2', 'SS 2'));
    users.push(await createStudent('ss3', 'SS 3'));
    const [ss2, ss3] = users;
    const packages = loadSs23Packages();
    const draft = packages.find(pkg => pkg.class_name === 'SS 2' && pkg.subject_slug === 'agricultural-science');
    assert.ok(draft, 'the current Agricultural Science package must be loaded');
    assert.equal(draft.package_status, 'PENDING');

    const started = await startServer();
    server = started.server;
    const get = (route: string, token: string) => fetch(started.baseUrl + route, {
      headers: { Authorization: 'Bearer ' + token },
    });

    const ss2Lessons = await get('/ss23/lessons', ss2.token);
    assert.equal(ss2Lessons.status, 200);
    assert.deepEqual((await ss2Lessons.json() as { units: unknown[] }).units, []);

    const ss3Preparation = await get('/ss23/preparation', ss3.token);
    assert.equal(ss3Preparation.status, 200);
    assert.deepEqual((await ss3Preparation.json() as { units: unknown[] }).units, []);

    // A student cannot switch delivery modes by requesting the other class endpoint.
    const wrongModeForSs2 = await get('/ss23/preparation', ss2.token);
    assert.equal(wrongModeForSs2.status, 200);
    assert.deepEqual((await wrongModeForSs2.json() as { units: unknown[] }).units, []);
    const wrongModeForSs3 = await get('/ss23/lessons', ss3.token);
    assert.equal(wrongModeForSs3.status, 200);
    assert.deepEqual((await wrongModeForSs3.json() as { units: unknown[] }).units, []);

    // Every current draft unit must remain inaccessible by direct URL to both classes.
    for (const unit of draft.units) {
      for (const student of users) {
        const response = await get('/ss23/units/' + encodeURIComponent(unit.id), student.token);
        assert.equal(response.status, 404, 'unapproved unit leaked: ' + unit.id + ' to ' + student.id);
      }
    }

    // The first asset is pending and must not be served through the HTTP asset route.
    const pendingAsset = draft.assets[0];
    for (const student of users) {
      const response = await get('/ss23/assets/' + encodeURIComponent(pendingAsset.id), student.token);
      assert.equal(response.status, 404, 'unapproved asset leaked: ' + pendingAsset.id);
    }
  } finally {
    if (server) await new Promise<void>(resolve => server.close(() => resolve()));
    for (const student of users) {
      await query('DELETE FROM students WHERE user_id=$1', [student.id]);
      await query('DELETE FROM users WHERE id=$1', [student.id]);
    }
  }
});
