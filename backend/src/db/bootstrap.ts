/** Clean installation only. Never imports seed.ts or legacy/curriculum data. */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PoolClient } from 'pg';
import { pool } from './pool.js';

const CLASSES = {
  primary: [
    'Pre-Nursery', 'Reception', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2',
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  ],
  secondary: ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'],
};
const ACADEMIC_YEAR = '2026/2027';
const TERMS = ['1st Term', '2nd Term', '3rd Term'];
const VERSION = 1;

class BootstrapRefusal extends Error {}

// Exported for isolated database validation; importing this file does not run it.
export async function bootstrap(client: PoolClient): Promise<'created' | 'already-applied'> {
  const schema = readFileSync(new URL('../../schema.sql', import.meta.url), 'utf8');
  const checksum = createHash('sha256')
    .update(schema)
    .update(JSON.stringify({ VERSION, CLASSES, ACADEMIC_YEAR, TERMS }))
    .digest('hex');

  await client.query('BEGIN');
  try {
    // Serialize this command, including the initial empty-schema check.
    await client.query("SELECT pg_advisory_xact_lock(1937001, 2)");
    await client.query('SET LOCAL search_path TO public');
    const { rows: marker } = await client.query(
      "SELECT to_regclass('public.app_bootstrap') IS NOT NULL AS present",
    );
    if (marker[0].present) {
      const { rows } = await client.query('SELECT version, checksum FROM public.app_bootstrap');
      if (rows.length !== 1 || rows[0].version !== VERSION || rows[0].checksum !== checksum) {
        throw new BootstrapRefusal('Bootstrap marker differs from this source. Refusing; review the database and use a separately reviewed migration.');
      }
      // Never replay schema or reset current terms after an installation is in use.
      await client.query('COMMIT');
      return 'already-applied';
    }

    // Supabase-managed schemas and extension-owned public objects are allowed.
    // Untracked application objects (even empty tables) require manual review.
    const { rows: objects } = await client.query(`
      SELECT 1 FROM (
        SELECT 'pg_class'::regclass AS classid, c.oid AS objid
          FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
          WHERE n.nspname='public'
        UNION ALL
        SELECT 'pg_proc'::regclass, p.oid
          FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
          WHERE n.nspname='public'
        UNION ALL
        SELECT 'pg_type'::regclass, t.oid
          FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
          WHERE n.nspname='public' AND t.typrelid=0 AND t.typelem=0
      ) obj
      WHERE NOT EXISTS (
        SELECT 1 FROM pg_depend d
        WHERE d.classid=obj.classid AND d.objid=obj.objid AND d.deptype='e'
      ) LIMIT 1
    `);
    if (objects.length) {
      throw new BootstrapRefusal('Public schema contains untracked objects. Clean bootstrap requires an empty application schema; no changes were made.');
    }

    // Reuse the complete application schema, including its two school records.
    // Its teacher_subjects backfill selects from empty users and inserts nothing.
    await client.query(schema);
    for (const [schoolCode, names] of Object.entries(CLASSES)) {
      for (const name of names) {
        await client.query('INSERT INTO classes(school_code,name) VALUES($1,$2)', [schoolCode, name]);
      }
      for (const term of TERMS) {
        await client.query(
          'INSERT INTO terms(name,academic_year,school_code,is_current) VALUES($1,$2,$3,$4)',
          [term, ACADEMIC_YEAR, schoolCode, term === '1st Term'],
        );
      }
    }

    // Written atomically with the schema and foundation. Not an application user.
    await client.query(`CREATE TABLE public.app_bootstrap (
      version INTEGER PRIMARY KEY CHECK (version = 1),
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
    await client.query('INSERT INTO public.app_bootstrap(version,checksum) VALUES($1,$2)', [VERSION, checksum]);
    await client.query('COMMIT');
    return 'created';
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

async function main() {
  try {
    if (!process.env.DATABASE_URL?.trim()) {
      throw new BootstrapRefusal('DATABASE_URL must be supplied explicitly for clean bootstrap.');
    }
    const client = await pool.connect();
    try {
      const result = await bootstrap(client);
      console.log(result === 'created'
        ? 'Clean bootstrap complete: schema, 2 schools, 18 classes, 6 terms. No users or curriculum seeded.'
        : 'Bootstrap already applied; no schema or data changes made.');
    } finally {
      client.release();
    }
  } catch (error) {
    // Connection errors can contain connection details: never print raw errors.
    console.error(error instanceof BootstrapRefusal
      ? error.message
      : 'Bootstrap failed; transaction rolled back if started. Check connectivity, privileges, and schema compatibility. Connection details are not logged.');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}
