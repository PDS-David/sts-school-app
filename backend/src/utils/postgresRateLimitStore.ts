import { createHash } from 'node:crypto';
import type { Store, Options, ClientRateLimitInfo } from 'express-rate-limit';
import { pool } from '../db/pool.js';

export class RateLimitStoreUnavailableError extends Error {
  readonly code = 'RATE_LIMIT_STORE_UNAVAILABLE';
  readonly statusCode = 503;

  constructor(cause: unknown) {
    super('The shared rate-limit store is unavailable. Retry the request shortly.', { cause });
    this.name = 'RateLimitStoreUnavailableError';
  }
}

function configuredDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string | null {
  return env.DATABASE_URL?.trim() || null;
}

export async function assertRateLimitPostgresConfigured(env: NodeJS.ProcessEnv = process.env): Promise<void> {
  if (env.NODE_ENV === 'production' && !configuredDatabaseUrl(env)) {
    throw new Error('Production startup refused: DATABASE_URL is required for shared PostgreSQL-backed request limits.');
  }
  await verifyPostgresRateLimitStore();
}

export async function verifyPostgresRateLimitStore(): Promise<void> {
  try {
    await pool.query('SELECT 1 FROM public.rate_limit_counters LIMIT 0');
  } catch (error) {
    throw new Error(
      'Production startup refused: the PostgreSQL rate-limit store is not ready. Apply the approved 0003_rate_limit_counters migration before starting the API.',
      { cause: error },
    );
  }
}

function validateNamespace(namespace: string): void {
  if (!/^[a-z0-9:_-]{1,64}$/i.test(namespace)) {
    throw new Error('Rate-limit namespace must be 1–64 safe characters.');
  }
}

function digestKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

function toRateLimitInfo(row: { total_hits: number | string; reset_at: Date | string }): ClientRateLimitInfo {
  const totalHits = Number(row.total_hits);
  const resetTime = row.reset_at instanceof Date ? row.reset_at : new Date(row.reset_at);
  if (!Number.isSafeInteger(totalHits) || totalHits < 1 || Number.isNaN(resetTime.getTime())) {
    throw new Error('PostgreSQL returned an invalid rate-limit counter.');
  }
  return { totalHits, resetTime };
}

let cleanupCounter = 0;

function scheduleExpiredCounterCleanup(): void {
  cleanupCounter += 1;
  if (cleanupCounter % 100 !== 0) return;
  // Bounded, opportunistic cleanup avoids an unbounded counter table without
  // requiring pg_cron or a second hosted worker on the Free tier.
  void pool.query(
    `WITH expired AS (
       SELECT ctid FROM public.rate_limit_counters
       WHERE reset_at <= clock_timestamp()
       ORDER BY reset_at
       LIMIT 500
     )
     DELETE FROM public.rate_limit_counters AS counters
     USING expired WHERE counters.ctid = expired.ctid`,
  ).catch(error => console.warn('[rate-limit] expired counter cleanup failed', error));
}

async function incrementCounter(namespace: string, key: string, windowMs: number): Promise<ClientRateLimitInfo> {
  const result = await pool.query(
    `INSERT INTO public.rate_limit_counters(namespace, key_hash, total_hits, reset_at)
     VALUES ($1, $2, 1, clock_timestamp() + ($3::bigint * interval '1 millisecond'))
     ON CONFLICT (namespace, key_hash) DO UPDATE
       SET total_hits = CASE
             WHEN public.rate_limit_counters.reset_at <= clock_timestamp() THEN 1
             ELSE public.rate_limit_counters.total_hits + 1
           END,
           reset_at = CASE
             WHEN public.rate_limit_counters.reset_at <= clock_timestamp()
               THEN clock_timestamp() + ($3::bigint * interval '1 millisecond')
             ELSE public.rate_limit_counters.reset_at
           END,
           updated_at = clock_timestamp()
     RETURNING total_hits, reset_at`,
    [namespace, digestKey(key), windowMs],
  );
  if (!result.rows[0]) throw new Error('PostgreSQL did not return the updated rate-limit counter.');
  scheduleExpiredCounterCleanup();
  return toRateLimitInfo(result.rows[0]);
}

function asStoreError(error: unknown): RateLimitStoreUnavailableError {
  return error instanceof RateLimitStoreUnavailableError
    ? error
    : new RateLimitStoreUnavailableError(error);
}

/** Shared fixed-window express-rate-limit store backed by atomic PostgreSQL upserts. */
export function createPostgresRateLimitStore(namespace: string): Store {
  validateNamespace(namespace);
  let windowMs = 60_000;

  return {
    init(options: Options) {
      if (Number.isFinite(options.windowMs) && options.windowMs > 0) {
        windowMs = Math.ceil(options.windowMs);
      }
    },
    async increment(key: string): Promise<ClientRateLimitInfo> {
      try {
        return await incrementCounter(namespace, key, windowMs);
      } catch (error) {
        throw asStoreError(error);
      }
    },
    async decrement(key: string): Promise<void> {
      try {
        // Keep zero-hit rows until expiry. This avoids a delete-vs-increment
        // race when a successful login decrements concurrently with a new hit.
        await pool.query(
          `UPDATE public.rate_limit_counters
             SET total_hits = GREATEST(total_hits - 1, 0), updated_at = clock_timestamp()
           WHERE namespace = $1 AND key_hash = $2 AND reset_at > clock_timestamp()`,
          [namespace, digestKey(key)],
        );
      } catch (error) {
        throw asStoreError(error);
      }
    },
    async resetKey(key: string): Promise<void> {
      try {
        await pool.query(
          'DELETE FROM public.rate_limit_counters WHERE namespace = $1 AND key_hash = $2',
          [namespace, digestKey(key)],
        );
      } catch (error) {
        throw asStoreError(error);
      }
    },
    async resetAll(): Promise<void> {
      try {
        await pool.query('DELETE FROM public.rate_limit_counters WHERE namespace = $1', [namespace]);
      } catch (error) {
        throw asStoreError(error);
      }
    },
  };
}

/** Shared fixed-window quota for AI generation paths outside the HTTP router. */
export async function consumePostgresQuota(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (!Number.isSafeInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs < 1) {
    throw new Error('Invalid PostgreSQL quota configuration.');
  }
  try {
    const result = await incrementCounter('ai-generation', key, Math.ceil(windowMs));
    return result.totalHits <= limit;
  } catch (error) {
    throw asStoreError(error);
  }
}

export function disconnectPostgresRateLimitStore(): void {
  // PostgreSQL pool lifecycle is owned by db/pool.ts.
}
