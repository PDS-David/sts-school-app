import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import aiRouter from '../backend/src/routes/ai.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

test('AI endpoints enforce a per-account limit without Redis and isolate users sharing an IP', async () => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const usernames = [`bsec13-a-${suffix}`, `bsec13-b-${suffix}`, `bsec13-admin-${suffix}`];
  let userIds: string[] = [];
  let server: Server | undefined;

  try {
    const first = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','student','BSEC13 Student A','primary',TRUE,FALSE) RETURNING id`,
      [usernames[0]],
    );
    const second = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','student','BSEC13 Student B','primary',TRUE,FALSE) RETURNING id`,
      [usernames[1]],
    );
    const admin = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
       VALUES($1,'test-hash','admin','BSEC13 Admin',NULL,TRUE,FALSE) RETURNING id`,
      [usernames[2]],
    );
    userIds = [String(first.rows[0].id), String(second.rows[0].id), String(admin.rows[0].id)];

    const app = express();
    app.use(express.json());
    app.use('/ai', aiRouter);
    server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve, reject) => {
      server!.once('listening', resolve);
      server!.once('error', reject);
    });
    const port = (server.address() as AddressInfo).port;
    const tokenA = signAccess({
      id: userIds[0], username: usernames[0], role: 'student',
      school_code: 'primary', assigned_class: null, assigned_subject_ids: [],
    });
    const tokenB = signAccess({
      id: userIds[1], username: usernames[1], role: 'student',
      school_code: 'primary', assigned_class: null, assigned_subject_ids: [],
    });

    const sendInvalidChat = (token: string) => fetch(
      `http://127.0.0.1:${port}/ai/chat`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: '{}',
      },
    );

    for (let i = 0; i < 20; i++) {
      const response = await sendInvalidChat(tokenA);
      assert.equal(response.status, 400, `request ${i + 1} should reach route validation`);
    }
    const limited = await sendInvalidChat(tokenA);
    assert.equal(limited.status, 429);
    assert.match((await limited.json() as { error: string }).error, /AI request limit exceeded/);

    const otherUser = await sendInvalidChat(tokenB);
    assert.equal(otherUser.status, 400, 'a second account behind the same IP must have its own quota');

    const tokenAdmin = signAccess({
      id: userIds[2], username: usernames[2], role: 'admin',
      school_code: null, assigned_class: null, assigned_subject_ids: [],
    });
    for (let i = 0; i < 21; i++) {
      const adminResponse = await sendInvalidChat(tokenAdmin);
      assert.equal(adminResponse.status, 400, 'the existing administrator bypass must be preserved');
    }
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    if (userIds.length) await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [userIds]);
  }
});
