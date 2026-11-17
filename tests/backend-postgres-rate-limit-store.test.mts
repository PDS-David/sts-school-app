import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { pool } from '../backend/src/db/pool.js';
import {
  consumePostgresQuota,
  createPostgresRateLimitStore,
  RateLimitStoreUnavailableError,
} from '../backend/src/utils/postgresRateLimitStore.js';

let poolClosed = false;
after(async () => {
  if (!poolClosed) await pool.end();
});

test('PostgreSQL rate limits are shared, atomic, isolated, expiring and fail closed', async () => {
  const namespace = `test-${process.pid}`;
  const first = createPostgresRateLimitStore(namespace);
  const second = createPostgresRateLimitStore(namespace);
  first.init({ windowMs: 60_000 });
  second.init({ windowMs: 60_000 });

  try {
    await first.resetAll();

    // Independent store instances share the same atomic counter.
    const concurrent = await Promise.all(
      Array.from({ length: 24 }, (_, index) =>
        (index % 2 ? first : second).increment('shared-client'),
      ),
    );
    assert.equal(Math.max(...concurrent.map(item => item.totalHits)), 24);
    assert.equal(Math.min(...concurrent.map(item => item.totalHits)), 1);
    assert.equal((await second.increment('shared-client')).totalHits, 25);

    // Keys and namespaces remain isolated.
    assert.equal((await first.increment('different-client')).totalHits, 1);
    const isolated = createPostgresRateLimitStore(`${namespace}-other`);
    isolated.init({ windowMs: 60_000 });
    assert.equal((await isolated.increment('shared-client')).totalHits, 1);
    await isolated.resetAll();

    // skipSuccessfulRequests can decrement without deleting a row that may
    // concurrently receive another increment.
    await first.decrement('shared-client');
    assert.equal((await second.increment('shared-client')).totalHits, 25);
    await first.resetKey('shared-client');
    assert.equal((await second.increment('shared-client')).totalHits, 1);

    // The fixed window resets atomically after expiry.
    const shortWindow = createPostgresRateLimitStore(`${namespace}-expiry`);
    shortWindow.init({ windowMs: 30 });
    assert.equal((await shortWindow.increment('expiring-client')).totalHits, 1);
    await delay(60);
    assert.equal((await shortWindow.increment('expiring-client')).totalHits, 1);
    await shortWindow.resetAll();

    // Non-HTTP AI generation shares a separate PostgreSQL quota namespace.
    const quotaKey = `ai-user-${process.pid}`;
    assert.equal(await consumePostgresQuota(quotaKey, 2, 60_000), true);
    assert.equal(await consumePostgresQuota(quotaKey, 2, 60_000), true);
    assert.equal(await consumePostgresQuota(quotaKey, 2, 60_000), false);
    await pool.query(
      'DELETE FROM public.rate_limit_counters WHERE namespace = $1 AND key_hash = encode(digest($2, \'sha256\'), \'hex\')',
      ['ai-generation', quotaKey],
    );
  } finally {
    await first.resetAll();
  }

  // A failed shared store must reject rather than silently use process memory.
  await pool.end();
  poolClosed = true;
  await assert.rejects(
    () => first.increment('store-unavailable'),
    error => error instanceof RateLimitStoreUnavailableError && error.statusCode === 503,
  );
});
