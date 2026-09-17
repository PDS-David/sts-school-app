// ── Schools table diagnostic ─────────────────────────────────────────────────
// Read-only. Checks the actual live `code`/`name` pairing in production,
// independent of what schema.sql's seed data currently says — schema.sql's
// INSERT uses ON CONFLICT DO NOTHING, so if these two rows were ever created
// earlier with a different pairing (a manual edit, an older seed version),
// re-running migrate.ts would never have corrected them; this is the only
// way to see what's actually live.
//
// USAGE (same pattern as checkDrift.ts):
//   cd backend
//   $env:NODE_ENV="production"
//   $env:DATABASE_URL="<the EXTERNAL Render Postgres URL>"
//   npx tsx src/db/checkSchools.ts

import { pool } from './pool.js';

async function main() {
  try {
    const { rows } = await pool.query(
      'SELECT code, name, ca1_max, ca2_max, exam_max, admission_prefix FROM schools ORDER BY code',
    );
    console.log('Live schools table content:\n');
    rows.forEach((r: any) => {
      console.log(`code: ${r.code}`);
      console.log(`  name: ${r.name}`);
      console.log(`  ca1_max/ca2_max/exam_max: ${r.ca1_max}/${r.ca2_max}/${r.exam_max}`);
      console.log(`  admission_prefix: ${r.admission_prefix}\n`);
    });
  } catch (e) {
    console.error('Failed to read schools table:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
