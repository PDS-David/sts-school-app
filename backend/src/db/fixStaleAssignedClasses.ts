// Narrow follow-up to cleanupStaleClasses.ts: that script's dry run found
// exactly one reference blocking a stale `classes` row from being deleted
// -- a real teacher account with users.assigned_class='JSS1' (old, no
// content) instead of 'JSS 1' (current, hundreds of topics). This script
// fixes that at the database level rather than through the app's own
// Admin > Users edit screen, since (per the project owner) the app isn't
// in a state where that UI can be used right now.
//
// Scoped to users.assigned_class specifically, using the exact same
// MAPPING as renameClassNaming.ts, checked generally (not hardcoded to
// just 'JSS1') in case any other teacher account has a similarly stale
// value that didn't happen to get caught by this particular investigation.
//
// Usage:
//   cd backend
//   npx tsx src/db/fixStaleAssignedClasses.ts            # dry run — prints affected users only
//   npx tsx src/db/fixStaleAssignedClasses.ts --yes       # actually updates them

import { pool } from './pool.js';

const MAPPING: Record<string, string> = {
  JSS1: 'JSS 1', JSS2: 'JSS 2', JSS3: 'JSS 3',
  SS1: 'SS 1', SS2: 'SS 2', SS3: 'SS 3',
  'Grade 1': 'PRY 1', 'Grade 2': 'PRY 2', 'Grade 3': 'PRY 3',
  'Grade 4': 'PRY 4', 'Grade 5': 'PRY 5', 'Grade 6': 'PRY 6',
};

async function main() {
  const yes = process.argv.includes('--yes');

  const { rows } = await pool.query(
    `SELECT id, username, full_name, assigned_class FROM users WHERE assigned_class = ANY($1) ORDER BY username`,
    [Object.keys(MAPPING)],
  );

  if (rows.length === 0) {
    console.log('No users have a stale assigned_class value — nothing to do.');
    await pool.end();
    return;
  }

  console.log(`Found ${rows.length} user(s) with a stale assigned_class:\n`);
  for (const r of rows) {
    console.log(`  id=${r.id} username=${r.username} (${r.full_name}): '${r.assigned_class}' -> '${MAPPING[r.assigned_class]}'`);
  }

  if (!yes) {
    console.log('\nDry run only — pass --yes to actually update the rows above.');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const r of rows) {
      await client.query('UPDATE users SET assigned_class=$1 WHERE id=$2', [MAPPING[r.assigned_class], r.id]);
    }
    await client.query('COMMIT');
    console.log(`\n✓ Updated ${rows.length} user(s). Committed.`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('\n✗ Rolled back — no changes were kept.');
    throw e;
  } finally {
    client.release();
  }

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
