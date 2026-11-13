import { Router } from 'express';
import { pool } from '../db/pool.js';

export type DatabaseProbe = () => Promise<unknown>;

async function probeDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SET LOCAL statement_timeout = '5s'");
    await client.query('SELECT 1');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health endpoints suitable for an external process manager.
 * The readiness response deliberately exposes no host, query, credentials,
 * exception message or database metadata.
 */
export function createHealthRouter(
  checkDatabase: DatabaseProbe = probeDatabase,
) {
  const router = Router();

  router.get('/live', (_req, res) => {
    // Liveness is process-only. It must not fail because PostgreSQL is down.
    return res.status(200).json({ status: 'ok' });
  });

  router.get('/ready', async (_req, res) => {
    try {
      await checkDatabase();
      return res.status(200).json({ status: 'ok', checks: { database: 'ok' } });
    } catch {
      // Keep operational details in server-side logs/monitoring, not a public
      // unauthenticated endpoint.
      return res.status(503).json({ status: 'unavailable', checks: { database: 'unavailable' } });
    }
  });

  return router;
}

export default createHealthRouter();
