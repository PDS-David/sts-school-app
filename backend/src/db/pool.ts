import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

/**
 * TLS settings for the database connection.
 *
 * - TLS is on when NODE_ENV === 'production' or DATABASE_SSL === 'true';
 *   otherwise it is off (local development, unchanged).
 * - When on, the server certificate IS validated (rejectUnauthorized: true).
 * - DATABASE_SSL_CA: PEM text of a private CA, passed to pg as `ca`. A literal
 *   "\n" sequence is accepted as a newline so the PEM fits on one env line.
 *   Anything that does not contain a PEM certificate block is a startup error.
 * - DATABASE_SSL_REJECT_UNAUTHORIZED: only the exact string 'false' turns
 *   validation off. It logs one startup warning. Any other value is ignored.
 */
export function resolveSsl(env: NodeJS.ProcessEnv): pg.ConnectionConfig['ssl'] {
  const tlsOn = env.NODE_ENV === 'production' || env.DATABASE_SSL === 'true';
  if (!tlsOn) return false;

  const ssl: { rejectUnauthorized: boolean; ca?: string } = { rejectUnauthorized: true };

  const rawCa = env.DATABASE_SSL_CA?.trim();
  if (rawCa) {
    const pem = rawCa.replace(/\\n/g, '\n');
    if (!/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/.test(pem)) {
      throw new Error(
        'DATABASE_SSL_CA is set but does not contain a PEM certificate ' +
        '(-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----). Fix or unset it.',
      );
    }
    ssl.ca = pem;
  }

  if (env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'false') {
    ssl.rejectUnauthorized = false;
    console.warn(
      'WARNING: DATABASE_SSL_REJECT_UNAUTHORIZED=false — the database server certificate ' +
      'is NOT being validated. The connection is encrypted but can be impersonated. ' +
      'Supply DATABASE_SSL_CA instead where possible.',
    );
  }

  return ssl;
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: resolveSsl(process.env),
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error', err);
});

/** Run a single query */
export const query = (text: string, params?: unknown[]) => pool.query(text, params);

/** Run queries in a transaction */
export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
