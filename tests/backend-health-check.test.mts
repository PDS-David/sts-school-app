import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import express from 'express';
import test from 'node:test';
import { createHealthRouter } from '../backend/src/routes/health.ts';

async function withHealthServer<T>(
  checkDatabase: () => Promise<unknown>,
  run: (origin: string) => Promise<T>,
): Promise<T> {
  const app = express();
  app.use('/health', createHealthRouter(checkDatabase));
  const server = createServer(app);

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not bind a TCP port');
  try {
    return await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close(error => error ? reject(error) : resolve());
    });
  }
}

test('liveness succeeds without consulting the database', async () => {
  let calls = 0;
  await withHealthServer(async () => { calls++; }, async origin => {
    const response = await fetch(`${origin}/health/live`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });
  assert.equal(calls, 0);
});

test('readiness reports database success', async () => {
  let calls = 0;
  await withHealthServer(async () => { calls++; }, async origin => {
    const response = await fetch(`${origin}/health/ready`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok', checks: { database: 'ok' } });
  });
  assert.equal(calls, 1);
});

test('readiness fails closed and does not disclose database errors', async () => {
  await withHealthServer(async () => { throw new Error('postgres://secret-user:secret-password@db/private'); }, async origin => {
    const response = await fetch(`${origin}/health/ready`);
    assert.equal(response.status, 503);
    const body = await response.text();
    assert.equal(body, JSON.stringify({ status: 'unavailable', checks: { database: 'unavailable' } }));
    assert.equal(body.includes('secret-password'), false);
  });
});
