import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import financeRouter from '../backend/src/routes/finance.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

interface Fixture {
  adminId: string;
  studentId: string;
  termId: number;
  feeItemIds: number[];
  token: string;
}

async function createFixture(label: string): Promise<Fixture> {
  const suffix = randomUUID();
  const username = `bsec15-${label}-${suffix}`;
  const { rows: users } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,'test-hash','finance_admin','BSEC15 Finance Admin',NULL,TRUE,FALSE)
     RETURNING id`,
    [username],
  );
  const adminId = String(users[0].id);

  const { rows: students } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number)
     VALUES($1,'Primary 4','primary',$2) RETURNING id`,
    ['BSEC15 Invoice Student', `BSEC15-${suffix}`],
  );
  const studentId = String(students[0].id);

  const { rows: terms } = await query(
    `INSERT INTO terms(name,academic_year,school_code)
     VALUES('1st Term',$1,'primary') RETURNING id`,
    [`BSEC15/${suffix}`],
  );
  const termId = Number(terms[0].id);

  const feeItemIds: number[] = [];
  for (const item of [
    { name: 'Class fee', amount: 125.5, school: 'primary', className: 'Primary 4' },
    { name: 'School-wide fee', amount: 75, school: 'primary', className: null },
    { name: 'Other-class fee', amount: 40, school: 'primary', className: 'Primary 5' },
    { name: 'Other-school fee', amount: 60, school: 'secondary', className: null },
  ]) {
    const { rows } = await query(
      `INSERT INTO fee_items(school_code,name,amount,class_name)
       VALUES($1,$2,$3,$4) RETURNING id`,
      [item.school, `${item.name} ${suffix}`, item.amount, item.className],
    );
    feeItemIds.push(Number(rows[0].id));
  }

  return {
    adminId,
    studentId,
    termId,
    feeItemIds,
    token: signAccess({
      id: adminId,
      username,
      role: 'finance_admin',
      school_code: null,
      assigned_class: null,
      assigned_subject_ids: [],
    }),
  };
}

async function cleanupFixture(fixture: Fixture): Promise<void> {
  await query('DELETE FROM invoices WHERE student_id=$1', [fixture.studentId]);
  await query('DELETE FROM fee_items WHERE id=ANY($1::int[])', [fixture.feeItemIds]);
  await query('DELETE FROM students WHERE id=$1', [fixture.studentId]);
  await query('DELETE FROM terms WHERE id=$1', [fixture.termId]);
  await query('DELETE FROM users WHERE id=$1', [fixture.adminId]);
}

async function startFinanceServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json());
  app.use('/finance', financeRouter);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/finance` };
}

async function waitForFeeItemLock(): Promise<boolean> {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    const { rows } = await query(
      `SELECT COUNT(*)::int AS count
         FROM pg_stat_activity
        WHERE datname=current_database()
          AND wait_event_type='Lock'
          AND query ILIKE '%FROM fee_items WHERE id = ANY%'`,
    );
    if (rows[0]?.count > 0) return true;
    await new Promise(resolve => setTimeout(resolve, 25));
  }
  return false;
}

test('invoice creation rejects invalid class/school references and validates IDs before writes', async () => {
  const fixture = await createFixture('validation');
  let server: Server | undefined;

  try {
    const started = await startFinanceServer();
    server = started.server;
    const send = (body: unknown) => fetch(`${started.baseUrl}/invoices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fixture.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const malformed = await send({
      student_id: fixture.studentId,
      term_id: fixture.termId,
      fee_item_ids: [fixture.feeItemIds[0], fixture.feeItemIds[0]],
    });
    assert.equal(malformed.status, 400, 'duplicate fee-item IDs must be rejected');

    const badId = await send({
      student_id: 'not-a-uuid',
      term_id: fixture.termId,
      fee_item_ids: [fixture.feeItemIds[0]],
    });
    assert.equal(badId.status, 400, 'malformed student IDs must not reach PostgreSQL');

    const wrongClass = await send({
      student_id: fixture.studentId,
      term_id: fixture.termId,
      fee_item_ids: [fixture.feeItemIds[2]],
    });
    assert.equal(wrongClass.status, 400);
    assert.match((await wrongClass.json() as { error: string }).error, /does not apply to class/);

    const wrongSchool = await send({
      student_id: fixture.studentId,
      term_id: fixture.termId,
      fee_item_ids: [fixture.feeItemIds[3]],
    });
    assert.equal(wrongSchool.status, 400);
    assert.match((await wrongSchool.json() as { error: string }).error, /different school/);

    const missingItem = await send({
      student_id: fixture.studentId,
      term_id: fixture.termId,
      fee_item_ids: [2_147_483_647],
    });
    assert.equal(missingItem.status, 400);

    const valid = await send({
      student_id: fixture.studentId,
      term_id: fixture.termId,
      fee_item_ids: [fixture.feeItemIds[0], fixture.feeItemIds[1]],
    });
    assert.equal(valid.status, 201);
    const payload = await valid.json() as { invoice: { id: string; total: string | number } };
    assert.equal(Number(payload.invoice.total), 200.5);

    const { rows: lineItems } = await query(
      'SELECT fee_item_id, amount FROM invoice_items WHERE invoice_id=$1 ORDER BY fee_item_id',
      [payload.invoice.id],
    );
    assert.equal(lineItems.length, 2);
    assert.equal(Number(lineItems.reduce((sum, item) => sum + Number(item.amount), 0)), 200.5);

    const { rows: invoiceCount } = await query(
      'SELECT COUNT(*)::int AS count FROM invoices WHERE student_id=$1',
      [fixture.studentId],
    );
    assert.equal(invoiceCount[0].count, 1, 'rejected requests must not leave partial invoice records');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await cleanupFixture(fixture);
  }
});

test('invoice creation rechecks fee-item class ownership after a concurrent update', async () => {
  const fixture = await createFixture('locking');
  let server: Server | undefined;
  const lockClient = await pool.connect();

  try {
    const started = await startFinanceServer();
    server = started.server;
    const sendInvoice = fetch(`${started.baseUrl}/invoices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fixture.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: fixture.studentId,
        term_id: fixture.termId,
        fee_item_ids: [fixture.feeItemIds[0]],
      }),
    });

    await lockClient.query('BEGIN');
    await lockClient.query('SELECT id FROM fee_items WHERE id=$1 FOR UPDATE', [fixture.feeItemIds[0]]);

    // Start the API call only after acquiring the conflicting row lock. Its
    // SELECT ... FOR SHARE must wait; it must not validate stale class data.
    const pendingResponse = fetch(`${started.baseUrl}/invoices`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fixture.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: fixture.studentId,
        term_id: fixture.termId,
        fee_item_ids: [fixture.feeItemIds[0]],
      }),
    });

    assert.equal(await waitForFeeItemLock(), true, 'invoice validation should wait for the locked fee item');
    await lockClient.query(
      "UPDATE fee_items SET class_name='Primary 5' WHERE id=$1",
      [fixture.feeItemIds[0]],
    );
    await lockClient.query('COMMIT');

    const response = await pendingResponse;
    assert.equal(response.status, 400, 'the changed class applicability must be revalidated after the lock is released');
    assert.match((await response.json() as { error: string }).error, /does not apply to class/);

    const { rows } = await query('SELECT COUNT(*)::int AS count FROM invoices WHERE student_id=$1', [fixture.studentId]);
    assert.equal(rows[0].count, 0, 'a concurrently invalidated fee item must not create an invoice');
  } finally {
    await lockClient.query('ROLLBACK').catch(() => undefined);
    lockClient.release();
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await cleanupFixture(fixture);
  }
});
