import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

/**
 * Resolve PostgreSQL TLS settings.
 *
 * Behaviour:
 * - DATABASE_SSL=false explicitly disables TLS, including in production.
 *   Use this only for Render's private Internal Database URL when the
 *   database connection is intentionally configured without TLS.
 * - DATABASE_SSL=true explicitly enables TLS.
 * - If DATABASE_SSL is unset, TLS is enabled in production and disabled
 *   outside production.
 * - When TLS is enabled, certificate validation is always enabled.
 * - DATABASE_SSL_CA may contain a PEM CA certificate. Literal "\n"
 *   sequences are converted to real newlines.
 *
 * Do not set DATABASE_SSL_REJECT_UNAUTHORIZED=false. Disabling certificate
 * validation makes the connection vulnerable to server impersonation.
 *
 * Important: if DATABASE_URL contains an sslmode query parameter, remove it
 * when using DATABASE_SSL=false. Connection-string SSL parameters can
 * override the SSL options supplied to node-postgres.
 */
export function resolveSsl(
  env: NodeJS.ProcessEnv,
): pg.ConnectionConfig['ssl'] {
  const sslSetting = env.DATABASE_SSL?.trim().toLowerCase();

  if (sslSetting && sslSetting !== 'true' && sslSetting !== 'false') {
    throw new Error(
      `Invalid DATABASE_SSL value "${env.DATABASE_SSL}". ` +
      'Use exactly "true" or "false", or leave it unset.',
    );
  }

  if (env.DATABASE_SSL_REJECT_UNAUTHORIZED?.trim().toLowerCase() === 'false') {
    throw new Error(
      'DATABASE_SSL_REJECT_UNAUTHORIZED=false is not supported. ' +
      'Certificate validation must remain enabled. Configure DATABASE_SSL_CA ' +
      'with the trusted CA certificate, or use the appropriate private ' +
      'connection configuration.',
    );
  }

  // An explicit false takes precedence over the production default.
  // This supports Render private/internal database connections that do not
  // require TLS. Do not use this for an external database connection.
  const tlsOn =
    sslSetting === 'true' ||
    (sslSetting !== 'false' && env.NODE_ENV === 'production');

  if (!tlsOn) {
    return false;
  }

  const ssl: { rejectUnauthorized: boolean; ca?: string } = {
    rejectUnauthorized: true,
  };

  const rawCa = env.DATABASE_SSL_CA?.trim();

  if (rawCa) {
    const pem = rawCa.replace(/\\n/g, '\n');

    if (
      !/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/.test(
        pem,
      )
    ) {
      throw new Error(
        'DATABASE_SSL_CA is set but does not contain a PEM certificate ' +
        '(-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----). ' +
        'Fix or unset DATABASE_SSL_CA.',
      );
    }

    ssl.ca = pem;
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
export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);

/** Run queries in a transaction */
export async function withTransaction<T>(
  fn: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
