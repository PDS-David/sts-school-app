/**
 * Seed script: run after migrate.ts to populate schools with
 * starting subjects, classes, and example users.
 *
 * Usage: npx tsx src/db/seed.ts
 */
import bcrypt from 'bcryptjs';
import { pool, query } from './pool.js';
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

const PRIMARY_CLASSES = [
  'Nursery 1', 'Nursery 2', 'KG 1', 'KG 2',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
];

const SECONDARY_CLASSES = [
  'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3',
];

async function seed() {
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

  console.log('Seeding default term (2024/2025 1st Term)…');
  await query(
    `INSERT INTO terms(name,academic_year,school_code,is_current,days_opened,next_term_begins)
     VALUES('1st Term','2024/2025','primary',TRUE,60,'14th January 2025')
     ON CONFLICT(name,academic_year,school_code) DO NOTHING`,
    [],
  );
  await query(
    `INSERT INTO terms(name,academic_year,school_code,is_current,days_opened,next_term_begins)
     VALUES('1st Term','2024/2025','secondary',TRUE,60,'14th January 2025')
     ON CONFLICT(name,academic_year,school_code) DO NOTHING`,
    [],
  );

  console.log('Seeding admin user (admin / Admin@1234)…');
  const hash = await bcrypt.hash('Admin@1234', 10);
  await query(
    `INSERT INTO users(username,password_hash,role,full_name,must_change_pw)
     VALUES('admin',$1,'admin','System Administrator',TRUE)
     ON CONFLICT(username) DO UPDATE SET password_hash=$1`,
    [hash],
  );

  console.log('Seeding demo teacher…');
  const teacherHash = await bcrypt.hash('Teacher@1234', 10);
  await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,must_change_pw)
     VALUES('teacher1',$1,'teacher','Demo Class Teacher','secondary','JSS1',TRUE)
     ON CONFLICT(username) DO UPDATE SET password_hash=$1`,
    [teacherHash],
  );

  console.log('\n✅ Seed complete!');
  console.log('   admin    → admin / Admin@1234    (must change password on first login)');
  console.log('   teacher  → teacher1 / Teacher@1234');
  await pool.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
