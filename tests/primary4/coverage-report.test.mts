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

test('coverage report separates pending approval from missing combinations', () => {
  const report = buildPrimary4CoverageReport();
  assert.equal(report.unresolved.length, 0);
  assert.equal(report.pending_approval.length, 6);
  assert.deepEqual(report.pending_approval.map((row: any) => [row.subject, row.term]).sort(), [
    ['Basic Science', '3rd Term'],
    ['Basic Technology', '1st Term'],
    ['Basic Technology', '2nd Term'],
    ['Home Economics', '1st Term'],
    ['Home Economics', '2nd Term'],
    ['Home Economics', '3rd Term'],
  ].sort());
});

test('coverage report surfaces source-review triage without calling it a lesson-quality verdict', () => {
  const report = buildPrimary4CoverageReport();
  assert.equal(report.source_review_flagged_record_count, 45);
  assert.equal(report.high_short_source_record_count, 22);
  assert.equal(report.short_source_review_record_count, 23);
  assert.ok(report.source_review_note.includes('triage indicators only'));
});
