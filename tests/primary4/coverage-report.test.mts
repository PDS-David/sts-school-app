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
  assert.equal(find('Basic Technology','1st Term')?.status, 'NO_SEPARATE_TERM_ASSIGNMENT_FOUND');
  assert.equal(find('Basic Technology','2nd Term')?.status, 'NO_SEPARATE_TERM_ASSIGNMENT_FOUND');
});

test('coverage report explains why Basic Technology First and Second Terms are not fabricated', () => {
  const report = buildPrimary4CoverageReport();
  const decision = report.curriculum_decisions.find((item: any) => item.subject === 'Basic Technology');
  assert.equal(decision.status, 'NEEDS_SCHOOL_TERM_ALLOCATION');
  assert.ok(decision.nerdc_source.includes('nerdc.gov.ng'));
  assert.ok(decision.state_scheme_source.includes('2021-Edition.pdf'));
  assert.ok(decision.required_evidence.length > 20);
});
