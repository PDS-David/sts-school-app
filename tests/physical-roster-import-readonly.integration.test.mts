import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import test, { after, before } from 'node:test';
import * as XLSX from 'xlsx';

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
assert.ok(databaseUrl, 'DATABASE_URL must point to the disposable sts_school_db_2 test database');
const pool = new Pool({ connectionString: databaseUrl, ssl: false });
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const backendRoot = join(repoRoot, 'backend');
const tempDir = mkdtempSync(join(tmpdir(), 'physical-roster-import-readonly-'));
const workbookPath = join(tempDir, 'Student_Roster_Initial_Launch_Approved.xlsx');

const sourceClasses = [
  { source: 'Grade 1', section: 'Primary', school: 'primary', target: 'Primary 1', count: 8 },
  { source: 'Grade 2', section: 'Primary', school: 'primary', target: 'Primary 2', count: 15 },
  { source: 'Grade 3', section: 'Primary', school: 'primary', target: 'Primary 3', count: 9 },
  { source: 'Grade 4', section: 'Primary', school: 'primary', target: 'Primary 4', count: 16 },
  { source: 'Grade 5', section: 'Primary', school: 'primary', target: 'Primary 5', count: 9 },
  { source: 'JSS1', section: 'Secondary', school: 'secondary', target: 'JSS 1', count: 8 },
  { source: 'JSS2', section: 'Secondary', school: 'secondary', target: 'JSS 2', count: 14 },
  { source: 'JSS3', section: 'Secondary', school: 'secondary', target: 'JSS 3', count: 5 },
  { source: 'SS1', section: 'Secondary', school: 'secondary', target: 'SS 1', count: 13 },
  { source: 'SS2', section: 'Secondary', school: 'secondary', target: 'SS 2', count: 7 },
];

const headers = [
  'Student Name',
  'Last-Term Class',
  'School Section',
  'Roster Identity (not admission no.)',
  'Internal Student UUID',
  'Current Enrolment Status',
  'Current Class (verified)',
  'Verified By',
  'Verification Date',
  'Evidence / Notes',
  'Matched Production Student ID',
];

function uuidV5(name: string): string {
  const namespace = Buffer.from('6ba7b8109dad11d180b400c04fd430c8', 'hex');
  const digest = createHash('sha1').update(namespace).update(name, 'utf8').digest();
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = digest.subarray(0, 16).toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function createWorkbook(): Buffer {
  const rows: Record<string, string>[] = [];
  for (const group of sourceClasses) {
    for (let index = 1; index <= group.count; index++) {
      const identity = `${group.source}-${index}`;
      rows.push({
        'Student Name': `Dry Run ${group.source} Student ${String(index).padStart(2, '0')}`,
        'Last-Term Class': group.source,
        'School Section': group.section,
        'Roster Identity (not admission no.)': `TEST-${group.source.toUpperCase()}-${String(index).padStart(3, '0')}`,
        'Internal Student UUID': uuidV5(identity),
        'Current Enrolment Status': 'Still enrolled - same class',
        'Current Class (verified)': group.target,
        'Verified By': 'Automated importer integration test',
        'Verification Date': '2026-11-18',
        'Evidence / Notes': 'Synthetic disposable test fixture; no real student data',
        'Matched Production Student ID': '',
      });
    }
  }
  const sheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Teacher Verification');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
}

function runImporter(apply: boolean) {
  const args = [
    '--import', 'tsx',
    'src/db/importPhysicalReportRoster.ts',
    `--file=${workbookPath}`,
    '--confirm-database=sts_school_db_2',
  ];
  if (apply) args.push('--apply', '--owner-approved-initial-roster');

  const result = spawnSync(process.execPath, args, {
    cwd: backendRoot,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      DATABASE_SSL: 'false',
      NODE_ENV: 'test',
    },
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
  });
  assert.equal(result.status, 0, `Importer failed. stdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  const output = result.stdout ?? '';
  const jsonStart = output.lastIndexOf('{');
  assert.notEqual(jsonStart, -1, `Importer summary missing. stdout:\n${output}`);
  return JSON.parse(output.slice(jsonStart));
}

before(async () => {
  writeFileSync(workbookPath, createWorkbook());
  await pool.query(`
    CREATE TABLE classes (
      school_code TEXT NOT NULL,
      name TEXT NOT NULL,
      PRIMARY KEY (school_code, name)
    );
    CREATE TABLE students (
      id UUID PRIMARY KEY,
      school_code TEXT NOT NULL,
      full_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      user_id UUID,
      deleted_at TIMESTAMPTZ,
      admission_number TEXT
    );
    CREATE TABLE report_roster_memberships (
      student_id UUID PRIMARY KEY,
      class_name TEXT NOT NULL,
      source_class_name TEXT NOT NULL,
      status TEXT NOT NULL,
      joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      removed_at TIMESTAMPTZ,
      changed_by UUID,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE report_roster_membership_events (
      id BIGSERIAL PRIMARY KEY,
      student_id UUID NOT NULL,
      event_type TEXT NOT NULL,
      to_class_name TEXT,
      details JSONB NOT NULL DEFAULT '{}'::jsonb
    );
  `);

  for (const group of sourceClasses) {
    await pool.query(
      'INSERT INTO classes(school_code,name) VALUES($1,$2) ON CONFLICT DO NOTHING',
      [group.school, group.target],
    );
  }
});

after(async () => {
  await pool.end();
  rmSync(tempDir, { recursive: true, force: true });
});

test('production importer dry-run is read-only, then apply is atomic and idempotent', async () => {
  const dryRun = runImporter(false);
  assert.equal(dryRun.database_name, 'sts_school_db_2');
  assert.equal(dryRun.source_rows, 104);
  assert.equal(dryRun.verified_active_rows_considered, 104);
  assert.equal(dryRun.new_student_rows, 104);
  assert.equal(dryRun.new_report_roster_memberships, 104);
  assert.equal(dryRun.reactivated_provisional_memberships, 0);
  assert.equal(dryRun.already_active_and_unchanged, 0);
  assert.equal(dryRun.apply, false);
  assert.equal(dryRun.admission_numbers_created, 0);
  assert.equal(dryRun.online_accounts_created, 0);
  assert.equal(dryRun.online_student_rows_updated, 0);

  const afterDryRun = await pool.query(`
    SELECT
      (SELECT count(*)::int FROM students) AS students,
      (SELECT count(*)::int FROM report_roster_memberships) AS memberships,
      (SELECT count(*)::int FROM report_roster_membership_events) AS events
  `);
  assert.deepEqual(afterDryRun.rows[0], { students: 0, memberships: 0, events: 0 },
    'dry-run must not write any production-style rows');

  const applied = runImporter(true);
  assert.equal(applied.database_name, 'sts_school_db_2');
  assert.equal(applied.source_rows, 104);
  assert.equal(applied.new_student_rows, 104);
  assert.equal(applied.new_report_roster_memberships, 104);
  assert.equal(applied.apply, true);
  assert.equal(applied.admission_numbers_created, 0);
  assert.equal(applied.online_accounts_created, 0);
  assert.equal(applied.online_student_rows_updated, 0);

  const afterApply = await pool.query(`
    SELECT
      (SELECT count(*)::int FROM students) AS students,
      (SELECT count(*)::int FROM students WHERE user_id IS NOT NULL) AS linked_online_accounts,
      (SELECT count(*)::int FROM students WHERE admission_number IS NOT NULL) AS admission_numbers,
      (SELECT count(*)::int FROM report_roster_memberships WHERE status='active') AS active_memberships,
      (SELECT count(*)::int FROM report_roster_membership_events WHERE event_type='enrolled') AS enrolment_events
  `);
  assert.deepEqual(afterApply.rows[0], {
    students: 104,
    linked_online_accounts: 0,
    admission_numbers: 0,
    active_memberships: 104,
    enrolment_events: 104,
  });

  const repeatedDryRun = runImporter(false);
  assert.equal(repeatedDryRun.new_student_rows, 0);
  assert.equal(repeatedDryRun.new_report_roster_memberships, 0);
  assert.equal(repeatedDryRun.already_active_and_unchanged, 104);
  assert.equal(repeatedDryRun.apply, false);
});
