import 'express-async-errors';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import messagesRouter from '../backend/src/routes/messages.js';
import { signAccess } from '../backend/src/utils/jwt.js';

after(async () => {
  await pool.end();
});

async function createUser(label: string, role: 'admin' | 'student') {
  const username = `bsec24-${label}-${randomUUID()}`;
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review)
     VALUES($1,'test-hash',$2,$3,$4,TRUE,FALSE) RETURNING id`,
    [username, role, `BSEC24 ${label}`, role === 'student' ? 'primary' : null],
  );
  const id = String(rows[0].id);
  return {
    id,
    token: signAccess({
      id,
      username,
      role,
      school_code: role === 'student' ? 'primary' : null,
      assigned_class: null,
      assigned_subject_ids: [],
    }),
  };
}

async function startServer(): Promise<{ server: Server; baseUrl: string }> {
  const app = express();
  app.use(express.json({ limit: '5mb' }));
  app.use('/messages', messagesRouter);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const port = (server.address() as AddressInfo).port;
  return { server, baseUrl: `http://127.0.0.1:${port}/messages` };
}

test('message writes validate payloads, reject malformed conversation IDs and rate-limit per sender', async () => {
  const admin = await createUser('admin', 'admin');
  const student = await createUser('student', 'student');
  const suffix = randomUUID();
  let server: Server | undefined;
  let studentRecordId: string | undefined;

  try {
    const { rows } = await query(
      `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id)
       VALUES('BSEC24 Student','Primary 4','primary',$1,$2) RETURNING id`,
      [`BSEC24-${suffix}`, student.id],
    );
    studentRecordId = String(rows[0].id);

    const started = await startServer();
    server = started.server;
    const headers = {
      Authorization: `Bearer ${student.token}`,
      'Content-Type': 'application/json',
    };
    const send = (body: unknown) => fetch(started.baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const invalidRecipient = await send({ recipient_id: 'not-a-uuid', body: 'hello' });
    assert.equal(invalidRecipient.status, 400, 'malformed recipient ids must be rejected before SQL');

    const emptyBody = await send({ recipient_id: admin.id, body: '   ' });
    assert.equal(emptyBody.status, 400, 'empty messages must be rejected');

    const oversizedBody = await send({ recipient_id: admin.id, body: 'x'.repeat(10_001) });
    assert.equal(oversizedBody.status, 400, 'messages beyond the documented maximum must be rejected');

    const malformedConversation = await fetch(`${started.baseUrl}/conversation/not-a-uuid`, {
      headers: { Authorization: `Bearer ${student.token}` },
    });
    assert.equal(malformedConversation.status, 400,
      'malformed conversation IDs must not reach PostgreSQL or become HTTP 500');

    const first = await send({
      recipient_id: admin.id,
      body: '  valid first message  ',
      context_type: 'general',
      context_id: 123,
    });
    assert.equal(first.status, 201);
    const firstPayload = await first.json() as { message: { body: string; context_id: string } };
    assert.equal(firstPayload.message.body, 'valid first message');
    assert.equal(firstPayload.message.context_id, '123');

    for (let i = 0; i < 26; i++) {
      const response = await send({ recipient_id: admin.id, body: `message ${i}` });
      assert.equal(response.status, 201, `message ${i} should be accepted within the per-user limit`);
    }

    const rateLimited = await send({ recipient_id: admin.id, body: 'one message too many' });
    assert.equal(rateLimited.status, 429, 'the 31st request in the window must be rate-limited');
    assert.match((await rateLimited.json() as { error: string }).error, /Too many messages/);

    const { rows: saved } = await query(
      'SELECT COUNT(*)::int AS count FROM messages WHERE sender_id=$1 AND recipient_id=$2',
      [student.id, admin.id],
    );
    assert.equal(saved[0].count, 27, 'invalid and rate-limited requests must not persist messages');
  } finally {
    if (server) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    await query('DELETE FROM messages WHERE sender_id=ANY($1::uuid[]) OR recipient_id=ANY($1::uuid[])',
      [[admin.id, student.id]]);
    if (studentRecordId) await query('DELETE FROM students WHERE id=$1', [studentRecordId]);
    await query('DELETE FROM users WHERE id=ANY($1::uuid[])', [[admin.id, student.id]]);
  }
});
