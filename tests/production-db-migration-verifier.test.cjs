const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const workflow = readFileSync(join(__dirname, '../.github/workflows/production-db-migrations.yml'), 'utf8');
const importer = readFileSync(join(__dirname, '../backend/src/routes/adminRosterImport.ts'), 'utf8');

test('production migration verifier rejects provisional 0005 rows, not explicit physical-roster imports', () => {
  assert.match(workflow, /LEFT JOIN LATERAL\s*\([\s\S]*?FROM public\.report_roster_membership_events e[\s\S]*?ORDER BY e\.occurred_at DESC, e\.id DESC[\s\S]*?LIMIT 1[\s\S]*?\) latest ON TRUE/);
  assert.match(workflow, /m\.status = 'active'/);
  assert.match(workflow, /latest\.event_type IS NULL/);
  assert.match(workflow, /latest\.event_type NOT IN \('enrolled','reinstated','retained','class_changed'\)/);
  assert.match(workflow, /latest\.event_type = 'enrolled'[\s\S]*?latest\.details->>'source' NOT IN \([\s\S]*?'student_class_list_bulk_import'[\s\S]*?'physical_reporting_student_create'[\s\S]*?'cross_section_promotion'[\s\S]*?'importPhysicalReportRoster'[\s\S]*?\)/);
  assert.doesNotMatch(workflow, /IF EXISTS \(SELECT 1 FROM public\.report_roster_memberships WHERE status='active'\)/);
  assert.match(workflow, /Provisional 0005 backfill or unaudited enrolments must not be active/);
});

test('the 104-student physical class-list importer records a distinct auditable source and provenance', () => {
  assert.match(importer, /source: 'student_class_list_bulk_import'/);
  assert.match(importer, /source_file_sha256: sha256/);
  assert.match(importer, /source_row: entry\.rowNumber/);
  assert.match(importer, /source_class: entry\.sourceClass/);
  assert.match(importer, /school_code: entry\.schoolCode/);
});
