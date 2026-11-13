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

async function createUser(label: string, role: 'admin' | 'teacher', schoolCode: string | null) {
  const username = `bsec17-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,TRUE,FALSE) RETURNING id`,
    [username, role, `BSEC17 ${label}`, schoolCode],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role,
      school_code: schoolCode,
      assigned_class: role === 'teacher' ? 'Primary 4' : null,
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

test('term creation conflicts are deterministic and concurrent current-term switches remain atomic', async () => {
  const suffix = randomUUID();
  const academicYear = `BSEC17/${suffix}`;
  const admin = await createUser('admin', 'admin', null);
  const foreignTeacher = await createUser('foreign-teacher', 'teacher', 'secondary');
  const termIds: number[] = [];
  let server: Server | undefined;
  let triggerCreated = false;

  try {
    const { rows: first } = await query(
      `INSERT INTO terms(name,academic_year,school_code,is_current)
       VALUES('1st Term',$1,'primary',TRUE) RETURNING id`,
      [academicYear],
    );
    const { rows: second } = await query(
      `INSERT INTO terms(name,academic_year,school_code,is_current)
       VALUES('2nd Term',$1,'primary',FALSE) RETURNING id`,
      [academicYear],
    );
    termIds.push(Number(first[0].id), Number(second[0].id));

    const started = await startServer();
    server = started.server;
    const headers = (token: string) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const postTerm = (name: string) => fetch(`${started.baseUrl}/terms`, {
      method: 'POST',
      headers: headers(admin.token),
      body: JSON.stringify({ name, academic_year: academicYear, school_code: 'primary' }),
    });
    const putTerm = (id: number, body: unknown, token = admin.token) => fetch(
      `${started.baseUrl}/terms/${id}`,
      { method: 'PUT', headers: headers(token), body: JSON.stringify(body) },
    );

    const [duplicateA, duplicateB] = await Promise.all([
      postTerm('3rd Term'),
      postTerm('3rd Term'),
    ]);
    assert.deepEqual(
      [duplicateA.status, duplicateB.status].sort((a, b) => a - b),
      [201, 409],
      'one duplicate create must succeed and the concurrent duplicate must return a conflict',
    );
    const { rows: countAfterCreate } = await query(
      'SELECT COUNT(*)::int AS count FROM terms WHERE school_code=$1 AND academic_year=$2',
      ['primary', academicYear],
    );
    assert.equal(countAfterCreate[0].count, 3, 'session must never contain more than its three allowed terms');
    const { rows: allTerms } = await query(
      'SELECT id FROM terms WHERE school_code=$1 AND academic_year=$2 ORDER BY id',
      ['primary', academicYear],
    );
    termIds.splice(0, termIds.length, ...allTerms.map(row => Number(row.id)));

    const [switchSecond, switchThird] = await Promise.all([
      putTerm(termIds[1], { is_current: true }),
      putTerm(termIds[2], { is_current: true }),
    ]);
    assert.equal(switchSecond.status, 200);
    assert.equal(switchThird.status, 200);
    const { rows: currentRows } = await query(
      'SELECT id FROM terms WHERE school_code=$1 AND is_current=TRUE',
      ['primary'],
    );
    assert.equal(currentRows.length, 1, 'exactly one current term must remain after concurrent switches');
    const currentId = Number(currentRows[0].id);
    assert.ok([termIds[1], termIds[2]].includes(currentId));

    const foreignUpdate = await putTerm(termIds[1], { days_opened: 20 }, foreignTeacher.token);
    assert.equal(foreignUpdate.status, 404, 'teacher cannot update another school term');
    const invalidBoolean = await putTerm(termIds[1], { is_current: 'true' });
    assert.equal(invalidBoolean.status, 400, 'is_current must be a boolean');
    const missing = await putTerm(2_147_483_647, { is_current: true });
    assert.equal(missing.status, 404, 'nonexistent term updates must not return an empty success');

    // Force a failure after the old current flag has been cleared but before
    // the target row can be set. The transaction must restore the old current
    // term rather than leave the school with no current term.
    const targetId = currentId === termIds[1] ? termIds[2] : termIds[1];
    await query(`
      CREATE OR REPLACE FUNCTION bsec17_reject_current_update() RETURNS trigger
      LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.id = ${targetId} AND NEW.is_current = TRUE THEN
          RAISE EXCEPTION 'BSEC17 simulated current-term write failure';
        END IF;
        RETURN NEW;
      END;
      $$;
    `);
    await query(`
      CREATE TRIGGER bsec17_reject_current_update
      BEFORE UPDATE OF is_current ON terms
      FOR EACH ROW EXECUTE FUNCTION bsec17_reject_current_update()
    `);
    triggerCreated = true;

    const failedSwitch = await putTerm(targetId, { is_current: true });
    assert.equal(failedSwitch.status, 500);
    const { rows: afterFailure } = await query(
      'SELECT id FROM terms WHERE school_code=$1 AND is_current=TRUE',
      ['primary'],
    );
    assert.deepEqual(afterFailure.map(row => Number(row.id)), [currentId],
      'failed switch must roll back the previous current-term flag');

    await query('DROP TRIGGER bsec17_reject_current_update ON terms');
    await query('DROP FUNCTION bsec17_reject_current_update()');
    triggerCreated = false;
  } finally {
    if (triggerCreated) {
      await query('DROP TRIGGER IF EXISTS bsec17_reject_current_update ON terms').catch(() => undefined);
      await query('DROP FUNCTION IF EXISTS bsec17_reject_current_update()').catch(() => undefined);
    }
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (termIds.length) await query('DELETE FROM terms WHERE id=ANY($1::int[])', [termIds]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[admin.id, foreignTeacher.id]]);
  }
});
