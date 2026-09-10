// Read-only diagnostic — no --yes mode, this never writes anything.
// Written specifically because Da doesn't have psql available locally, to
// answer one question directly: did importStudentRoster.ts's "108 already
// existed" really mean 108 rows are sitting in students right now, and are
// they actually claimable (user_id IS NULL, admission_number set)? This
// sidesteps the mobile app entirely — including its offline GET-cache,
// which is the leading suspect for why the Students screen only showed
// "Test Student One" right after a hard-refresh (a browser hard-refresh
// clears the JS bundle, not the app's own cached API responses sitting in
// browser local storage).
//
// Usage:
//   cd backend
//   npx tsx src/db/checkStudentCount.ts

import { pool } from './pool.js';

async function main() {
  const { rows: totalRows } = await pool.query('SELECT COUNT(*)::int AS c FROM students WHERE deleted_at IS NULL');
  console.log(`Total students (not deleted): ${totalRows[0].c}`);

  const { rows: bySchool } = await pool.query(
    `SELECT school_code, COUNT(*)::int AS c FROM students WHERE deleted_at IS NULL GROUP BY school_code ORDER BY school_code`,
  );
  console.log('\nBy school:');
  for (const r of bySchool) console.log(`  ${r.school_code}: ${r.c}`);

  const { rows: claimable } = await pool.query(
    `SELECT COUNT(*)::int AS c FROM students WHERE deleted_at IS NULL AND user_id IS NULL AND admission_number IS NOT NULL`,
  );
  console.log(`\nClaimable (no login yet, has an admission number): ${claimable[0].c}`);

  const { rows: sample } = await pool.query(
    `SELECT full_name, class_name, admission_number, school_code
     FROM students
     WHERE deleted_at IS NULL AND user_id IS NULL AND admission_number IS NOT NULL
     ORDER BY school_code, class_name, full_name
     LIMIT 5`,
  );
  if (sample.length) {
    console.log('\nSample of 5 you could use to test the self-claim flow:');
    for (const s of sample) console.log(`  [${s.school_code}] ${s.full_name} — ${s.class_name} — Adm# ${s.admission_number}`);
  } else {
    console.log('\nNo claimable students found — see the totals above to figure out why (0 total students at all? all already have a login linked? admission numbers missing?).');
  }

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
