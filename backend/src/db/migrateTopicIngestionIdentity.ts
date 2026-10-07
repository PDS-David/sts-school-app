/** One-time reviewed migration: align topic ingestion identity with curriculum order. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

class MigrationRefusal extends Error {}

export async function migrateTopicIngestionIdentity(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new MigrationRefusal('DATABASE_URL must be supplied explicitly.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(1937001, 17)');
    await client.query('LOCK TABLE topics IN SHARE ROW EXCLUSIVE MODE');

    const { rows: constraintRows } = await client.query(
      `SELECT pg_get_constraintdef(oid) AS definition
       FROM pg_constraint
       WHERE conrelid='public.topics'::regclass AND conname='topics_ingestion_dedupe'`,
    );
    if (constraintRows.length !== 1) {
      throw new MigrationRefusal('Expected topics_ingestion_dedupe constraint was not found exactly once; no changes made.');
    }

    const definition = String(constraintRows[0].definition).replace(/\s+/g, ' ').trim();
    const oldDefinition = 'UNIQUE (subject_id, class_name, term_label, title, source_file)';
    const newDefinition = 'UNIQUE (school_code, subject_id, class_name, term_label, order_index)';
    if (definition === newDefinition) {
      await client.query('COMMIT');
      console.log('Topic ingestion identity already migrated; no changes made.');
      return;
    }
    if (definition !== oldDefinition) {
      throw new MigrationRefusal(`Unexpected topics_ingestion_dedupe definition: ${definition}. Review manually; no changes made.`);
    }

    const { rows: duplicatePositions } = await client.query(`
      SELECT school_code, subject_id, class_name, term_label, order_index, COUNT(*)::int AS row_count
      FROM topics
      WHERE order_index IS NOT NULL
      GROUP BY school_code, subject_id, class_name, term_label, order_index
      HAVING COUNT(*) > 1
      LIMIT 1
    `);
    if (duplicatePositions.length) {
      throw new MigrationRefusal('Duplicate positional topic identities already exist; review them before migration. No changes made.');
    }

    await client.query('ALTER TABLE topics DROP CONSTRAINT topics_ingestion_dedupe');
    await client.query(`
      ALTER TABLE topics ADD CONSTRAINT topics_ingestion_dedupe
      UNIQUE (school_code, subject_id, class_name, term_label, order_index)
    `);
    await client.query('COMMIT');
    console.log('Topic ingestion identity migrated to school/class/subject/term/order position.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await migrateTopicIngestionIdentity();
  } catch (error) {
    console.error(error instanceof MigrationRefusal
      ? error.message
      : 'Topic ingestion identity migration failed; transaction rolled back. Review database compatibility.');
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}
