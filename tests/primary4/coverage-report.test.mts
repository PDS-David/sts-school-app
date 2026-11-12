import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPrimary4CoverageReport } from '../../backend/src/db/primary4/buildPrimary4CoverageReport.ts';

test('Primary 4 coverage report accounts for all 33 subject-term combinations', () => {
  const report = buildPrimary4CoverageReport();
  assert.equal(report.subject_count, 11);
  assert.equal(report.term_count, 3);
  assert.equal(report.combination_count, 33);
  assert.equal(report.export_record_count, 248);
  assert.equal(report.matrix.length, 33);
});

test('coverage report distinguishes researched packages from missing term allocation', () => {
  const report = buildPrimary4CoverageReport();
  const find = (subject: string, term: string) => report.matrix.find((row: any) => row.subject === subject && row.term === term);
  assert.equal(find('Home Economics','1st Term')?.researched_lessons_prepared, 9);
  assert.equal(find('Home Economics','2nd Term')?.researched_lessons_prepared, 9);
  assert.equal(find('Home Economics','3rd Term')?.researched_lessons_prepared, 7);
  assert.equal(find('Basic Science','3rd Term')?.status, 'RESEARCHED_PROPOSED_TERM_ALLOCATION');
  assert.equal(find('Basic Technology','1st Term')?.status, 'PROPOSED_LOCAL_ALLOCATION_PENDING_APPROVAL');
  assert.equal(find('Basic Technology','2nd Term')?.status, 'PROPOSED_LOCAL_ALLOCATION_PENDING_APPROVAL');
  assert.equal(find('Basic Technology','1st Term')?.researched_lessons_prepared, 4);
  assert.equal(find('Basic Technology','2nd Term')?.researched_lessons_prepared, 4);
});

test('coverage report explains the proposed Basic Technology term allocation and its approval gate', () => {
  const report = buildPrimary4CoverageReport();
  const decision = report.curriculum_decisions.find((item: any) => item.subject === 'Basic Technology');
  assert.equal(decision.status, 'PROPOSED_LOCAL_ALLOCATION_PENDING_APPROVAL');
  assert.equal(decision.proposed_lesson_count, 8);
  assert.ok(decision.nerdc_source.includes('nerdc.gov.ng'));
  assert.ok(decision.state_scheme_source.includes('2021-Edition.pdf'));
  assert.ok(decision.required_evidence.length > 20);
});

test('only the two Basic Technology term allocations remain unresolved', () => {
  const report = buildPrimary4CoverageReport();
  assert.equal(report.unresolved.length, 2);
  assert.deepEqual(report.unresolved.map((row: any) => [row.subject, row.term]), [
    ['Basic Technology', '1st Term'],
    ['Basic Technology', '2nd Term'],
  ]);
});
