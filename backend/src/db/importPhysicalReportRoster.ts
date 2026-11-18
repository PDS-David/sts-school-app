import { existsSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pool } from './pool.js';
import { parsePhysicalRosterWorkbook } from './physicalRosterWorkbook.js';

function normalizeName(value: string): string {
  return value.normalize('NFKC').trim().replace(/\\s+/g, ' ').toLocaleLowerCase('en');
}

async function main() {
  const fileArgument = process.argv.slice(2).find(value => value.startsWith('--file='));
  const apply = process.argv.includes('--apply');
  if (!fileArgument) {
    throw new Error('Usage: npm run db:import-physical-roster -- --file=/path/to/Student_Roster_Reconciliation_with_Identities.xlsx [--apply]');
  }

  const filePath = resolve(fileArgument.slice('--file='.length));
  if (!existsSync(filePath)) throw new Error(`Roster workbook not found: ${filePath}`);
  const sourceFile = basename(filePath);
  const entries = parsePhysicalRosterWorkbook(readFileSync(filePath));

  const client = await pool.connect();
  let newStudents = 0;
  let newMemberships = 0;
  let reactivatedMemberships = 0;
  let unchangedMemberships = 0;

  try {
    await client.query('BEGIN');

    const { rows: classRows } = await client.query<{ school_code: string; name: string }>(
      'SELECT school_code,name FROM classes WHERE school_code IN (\'primary\',\'secondary\')',
    );
    const availableClasses = new Set(classRows.map(row => `${row.school_code}|${row.name}`));
    for (const entry of entries) {
      if (!availableClasses.has(`${entry.schoolCode}|${entry.className}`)) {
        throw new Error(`Required canonical class is missing: ${entry.schoolCode}/${entry.className}`);
      }
    }

    for (const entry of entries) {
      const { rows: existingRows } = await client.query<{
        id: string; school_code: string; full_name: string; class_name: string;
        user_id: string | null; deleted_at: Date | null;
      }>(
        `SELECT id,school_code,full_name,class_name,user_id,deleted_at
           FROM students WHERE id=$1 FOR UPDATE`,
        [entry.studentId],
      );
      const existingStudent = existingRows[0];

      if (existingStudent) {
        if (existingStudent.school_code !== entry.schoolCode
            || normalizeName(existingStudent.full_name) !== normalizeName(entry.fullName)) {
          throw new Error(`UUID identity conflict for roster identity ${entry.rosterIdentity}; no student row was changed`);
        }
        if (existingStudent.deleted_at) {
          throw new Error(`Roster identity ${entry.rosterIdentity} matches a soft-deleted student; resolve it administratively before import`);
        }
      } else {
        const { rows: possibleDuplicates } = await client.query(
          `SELECT id FROM students
            WHERE school_code=$1 AND class_name=$2
              AND lower(regexp_replace(trim(full_name),'\\s+',' ','g'))=$3
            LIMIT 2`,
          [entry.schoolCode, entry.className, normalizeName(entry.fullName)],
        );
        if (possibleDuplicates.length) {
          throw new Error(`Possible existing student-name match for roster identity ${entry.rosterIdentity}; reconcile the existing record rather than creating a duplicate`);
        }
        if (apply) {
          await client.query(
            `INSERT INTO students(id,school_code,full_name,class_name)
             VALUES($1,$2,$3,$4)`,
            [entry.studentId, entry.schoolCode, entry.fullName, entry.className],
          );
        }
        newStudents++;
      }

      const { rows: membershipRows } = await client.query<{
        class_name: string; source_class_name: string; status: 'active' | 'removed';
      }>(
        `SELECT class_name,source_class_name,status
           FROM report_roster_memberships WHERE student_id=$1 FOR UPDATE`,
        [entry.studentId],
      );
      const membership = membershipRows[0];

      if (!membership) {
        if (apply) {
          await client.query(
            `INSERT INTO report_roster_memberships
               (student_id,class_name,source_class_name,status,joined_at)
             VALUES($1,$2,$3,'active',now())`,
            [entry.studentId, entry.className, entry.sourceClassName],
          );
          await client.query(
            `INSERT INTO report_roster_membership_events
               (student_id,event_type,to_class_name,details)
             VALUES($1,'enrolled',$2,$3::jsonb)`,
            [entry.studentId, entry.className, JSON.stringify({
              source: 'importPhysicalReportRoster',
              source_file: sourceFile,
              roster_identity: entry.rosterIdentity,
              source_class_name: entry.sourceClassName,
            })],
          );
        }
        newMemberships++;
        continue;
      }

      if (membership.status === 'active') {
        if (membership.class_name !== entry.className
            || membership.source_class_name !== entry.sourceClassName) {
          throw new Error(`Active report-roster placement conflicts with workbook identity ${entry.rosterIdentity}; teacher decisions will not be overwritten`);
        }
        unchangedMemberships++;
        continue;
      }

      const { rows: latestEvents } = await client.query<{ source: string | null }>(
        `SELECT details->>'source' AS source
           FROM report_roster_membership_events
          WHERE student_id=$1 ORDER BY id DESC LIMIT 1`,
        [entry.studentId],
      );
      if (latestEvents[0]?.source !== '0006_explicit_report_roster_enrolment') {
        throw new Error(`Roster identity ${entry.rosterIdentity} was removed by a later decision; the import will not reinstate it`);
      }

      if (apply) {
        await client.query(
          `UPDATE report_roster_memberships
              SET class_name=$1,source_class_name=$2,status='active',
                  removed_at=NULL,changed_by=NULL,updated_at=now()
            WHERE student_id=$3 AND status='removed'`,
          [entry.className, entry.sourceClassName, entry.studentId],
        );
        await client.query(
          `INSERT INTO report_roster_membership_events
             (student_id,event_type,from_class_name,to_class_name,details)
           VALUES($1,'reinstated',$2,$3,$4::jsonb)`,
          [entry.studentId, membership.class_name, entry.className, JSON.stringify({
            source: 'importPhysicalReportRoster',
            source_file: sourceFile,
            roster_identity: entry.rosterIdentity,
            reason: 'explicit_historical_source_roster_reconciliation',
          })],
        );
      }
      reactivatedMemberships++;
    }

    if (apply) {
      await client.query('COMMIT');
      console.log('Physical report-roster import committed.');
    } else {
      await client.query('ROLLBACK');
      console.log('DRY RUN ONLY — no database rows were changed. Re-run with --apply only after reviewing this plan.');
    }

    console.log(JSON.stringify({
      source_file: sourceFile,
      source_rows: entries.length,
      new_student_rows: newStudents,
      new_report_roster_memberships: newMemberships,
      reactivated_provisional_memberships: reactivatedMemberships,
      already_active_and_unchanged: unchangedMemberships,
      apply,
      admission_numbers_created: 0,
      online_accounts_created: 0,
      online_student_rows_updated: 0,
    }, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
