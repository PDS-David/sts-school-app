import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  const schemaPath = path.resolve(__dirname, '../../schema.sql');
  const sql = readFileSync(schemaPath, 'utf-8');
  console.log('Running migrations…');
  await pool.query(sql);
  console.log('Migrations complete.');
  await pool.end();
}

// Allow direct execution: tsx src/db/migrate.ts
runMigrations().catch(e => { console.error(e); process.exit(1); });
