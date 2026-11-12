/** Writes an encrypted backup to disk: npm run db:backup-export -- [--out <file>]  (needs DATABASE_URL, BACKUP_PASSPHRASE). */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { pool } from './pool.js';
import { buildEncryptedBackup } from '../utils/backup.js';

async function main() {
  try {
    const { values } = parseArgs({ options: { out: { type: 'string' } } });
    const b = await buildEncryptedBackup();
    const out = values.out ?? b.filename;
    writeFileSync(out, b.file, { mode: 0o600 });
    console.log(`Wrote ${out}: ${b.tables} tables, ${b.rows} rows, ${(b.file.length / 1048576).toFixed(1)} MB (encrypted).`);
  } catch (e: any) {
    console.error('Export failed:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) void main();
