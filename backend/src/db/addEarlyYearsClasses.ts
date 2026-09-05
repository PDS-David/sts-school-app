// Admin utility: add 'Pre-Nursery' and 'Reception' to the classes table for
// an already-seeded database. seed.ts's PRIMARY_CLASSES now includes both
// (see ingestTopics.ts/seed.ts commit adding them), but re-running seed.ts
// against a live database is NOT safe — it resets the admin account's
// password back to the default (Admin@1234), clears revocation_reason, and
// re-forces must_change_pw, via its `ON CONFLICT(username) DO UPDATE...`
// on the admin insert. This script does only the one thing actually needed
// here: add the two missing class rows, idempotently, nothing else touched.
//
// Run by hand, same convention as renameClassNaming.ts / resetAcademicData.ts:
//   cd backend
//   npx tsx src/db/addEarlyYearsClasses.ts                    # dry run — prints what would be added
//   npx tsx src/db/addEarlyYearsClasses.ts --school-code primary --yes   # actually inserts
//
// Without --yes, prints which of the two rows already exist vs. would be
// added, and exits without touching anything.

import { pool, query } from './pool.js';

const NEW_CLASSES = ['Pre-Nursery', 'Reception'];

async function main() {
  const args = process.argv.slice(2);
  const yes = args.includes('--yes');
  const schoolIdx = args.indexOf('--school-code');
  const schoolCode = schoolIdx >= 0 ? args[schoolIdx + 1] : 'primary';

  if (!schoolCode) {
    console.error('Usage: npx tsx src/db/addEarlyYearsClasses.ts --school-code <code> [--yes]');
    process.exit(1);
  }

  console.log(`Checking classes for school_code='${schoolCode}'…\n`);
  for (const name of NEW_CLASSES) {
    const { rows } = await query('SELECT id FROM classes WHERE school_code=$1 AND name=$2', [schoolCode, name]);
    console.log(rows.length > 0 ? `  '${name}' — already exists (id=${rows[0].id}), will be skipped` : `  '${name}' — will be added`);
  }

  if (!yes) {
    console.log('\nDry run only — pass --yes to actually insert.');
    await pool.end();
    return;
  }

  console.log('\nInserting…');
  for (const name of NEW_CLASSES) {
    const { rows } = await query(
      `INSERT INTO classes(school_code, name) VALUES($1, $2)
       ON CONFLICT (school_code, name) DO NOTHING
       RETURNING id`,
      [schoolCode, name],
    );
    console.log(rows.length > 0 ? `  ✓ added '${name}' (id=${rows[0].id})` : `  – '${name}' already existed, skipped`);
  }
  console.log('\n✓ Done. Nothing else was touched (no user, term, or subject rows affected).');
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
