/**
 * Seed script: run after migrate.ts to populate schools with
 * starting subjects, classes, and example users.
 *
 * Usage: npx tsx src/db/seed.ts
 */
import bcrypt from 'bcryptjs';
import { pool, query, withTransaction } from './pool.js';
import dotenv from 'dotenv';
dotenv.config();

const PRIMARY_SUBJECTS = [
  'English Language', 'Mathematics', 'Basic Science', 'Social Studies',
  'Yoruba', 'CRS/IRS', 'Civic Education', 'Physical & Health Education',
  'Cultural & Creative Arts', 'Computer Studies', 'Home Economics',
];

const SECONDARY_SUBJECTS = [
  'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Further Mathematics', 'Economics', 'Commerce', 'Government',
  'Literature-in-English', 'Yoruba', 'CRS/IRS', 'Computer Studies',
  'Agricultural Science', 'Technical Drawing', 'Physical & Health Education',
];

// Canonical primary names are Primary 1–6. Existing databases should use
// renameClassNaming.ts to migrate legacy Grade/PRY names before reseeding.
const PRIMARY_CLASSES = [
  'Pre-Nursery', 'Reception', 'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2',
  'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
];

const SECONDARY_CLASSES = [
  'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3',
];

async function seed() {
  // Guard added after a real, avoidable risk was found: this script's
  // ON CONFLICT upserts reset the admin/teacher1 accounts' passwords back
  // to the hardcoded demo defaults (see the two INSERT...ON CONFLICT blocks
  // below) — fine for a fresh dev/demo database, destructive against a real
  // school's production database if it were ever run there by habit or
  // copy-paste, since NODE_ENV=production is the exact same env var every
  // legitimate one-off production script in this repo also requires (it's
  // what triggers ssl:true in pool.ts — not a real "this is production,
  // be careful" flag on its own). Refuse unless explicitly overridden.
  if (process.env.NODE_ENV === 'production' && !process.argv.includes('--i-know-what-im-doing')) {
    console.error(
      "Refusing to run seed.ts with NODE_ENV=production set.\n" +
      "This script resets the admin/teacher1 demo accounts' passwords to\n" +
      "their hardcoded defaults on every run — safe for a fresh database,\n" +
      "destructive against a real school's live data.\n\n" +
      "If you're setting up a brand-new school's database for the first\n" +
      "time (nothing real in it yet), re-run with --i-know-what-im-doing.\n" +
      "If you meant to run a different one-off script against production\n" +
      "(e.g. addEarlyYearsClasses.ts), run that script instead.",
    );
    process.exit(1);
  }

  console.log('Seeding subjects…');
  for (const name of PRIMARY_SUBJECTS) {
    await query(
      `INSERT INTO subjects(school_code,name) VALUES('primary',$1) ON CONFLICT DO NOTHING`,
      [name],
    );
  }
  for (const name of SECONDARY_SUBJECTS) {
    await query(
      `INSERT INTO subjects(school_code,name) VALUES('secondary',$1) ON CONFLICT DO NOTHING`,
      [name],
    );
  }

  console.log('Seeding classes…');
  for (const name of PRIMARY_CLASSES) {
    await query(
      `INSERT INTO classes(school_code,name) VALUES('primary',$1) ON CONFLICT DO NOTHING`,
      [name],
    );
  }
  for (const name of SECONDARY_CLASSES) {
    await query(
      `INSERT INTO classes(school_code,name) VALUES('secondary',$1) ON CONFLICT DO NOTHING`,
      [name],
    );
  }

  console.log('Seeding 2026/2027 terms…');
  await withTransaction(async client => {
    for (const schoolCode of ['primary', 'secondary']) {
      // The database allows only one current term per school, across years.
      await client.query('UPDATE terms SET is_current=FALSE WHERE school_code=$1 AND is_current=TRUE', [schoolCode]);
      for (const name of ['1st Term', '2nd Term', '3rd Term']) {
        await client.query(
          `INSERT INTO terms(name,academic_year,school_code,is_current)
           VALUES($1,'2026/2027',$2,$3)
           ON CONFLICT(name,academic_year,school_code)
           DO UPDATE SET is_current=EXCLUDED.is_current`,
          [name, schoolCode, name === '1st Term'],
        );
      }
    }
  });

  console.log('Seeding admin user (admin / Admin@1234)…');
  const hash = await bcrypt.hash('Admin@1234', 10);
  await query(
    `INSERT INTO users(username,password_hash,role,full_name,must_change_pw)
     VALUES('admin',$1,'admin','System Administrator',TRUE)
     ON CONFLICT(username) DO UPDATE SET password_hash=$1,
       is_active=TRUE, revocation_reason=NULL, access_expires_at=NULL`,
    [hash],
  );

  console.log('Seeding demo teacher…');
  const teacherHash = await bcrypt.hash('Teacher@1234', 10);
  await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,must_change_pw)
     VALUES('teacher1',$1,'teacher','Demo Class Teacher','secondary','JSS 1',TRUE)
     ON CONFLICT(username) DO UPDATE SET password_hash=$1,
       is_active=TRUE, revocation_reason=NULL, access_expires_at=NULL`,
    [teacherHash],
  );

  console.log('\n✅ Seed complete!');
  console.log('   admin    → admin / Admin@1234    (must change password on first login)');
  console.log('   teacher  → teacher1 / Teacher@1234');
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
