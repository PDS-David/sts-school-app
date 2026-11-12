import test from 'node:test';
import assert from 'node:assert/strict';
import sourceManifest from '../../backend/src/db/primary4/sourceManifest.json' with { type: 'json' };
import {
  buildPrimary4SupplementRows,
  primary4SupplementApprovalIssues,
} from '../../backend/src/db/primary4/primary4Supplements.ts';

const existingRows = (sourceManifest as any).records.map((row: any) => ({
  className: 'Primary 4',
  subjectName: row.subject,
  termLabel: row.term,
  title: row.title,
  sourceReference: `existing source ${row.id}`,
}));

test('Primary 4 supplements append to the existing ingestion plan with stable order and source files', () => {
  const rows = buildPrimary4SupplementRows(existingRows, 'C:/curriculum/primary4', 'primary');
  assert.equal(rows.length, 36);
  assert.ok(rows.every(row => row.className === 'Primary 4' && row.preserveOrderIndex === true));
  assert.ok(rows.every(row => row.filePath.includes('__primary4_researched__')));
  assert.equal(rows.filter(row => row.subjectName === 'Home Economics' && row.termLabel === '3rd Term').length, 7);
  assert.deepEqual(
    rows.filter(row => row.subjectName === 'Home Economics' && row.termLabel === '3rd Term').map(row => row.orderIndex),
    [22,23,24,25,26,27,28],
  );
});

test('Primary 4 ingestion refuses secondary school and archive/export count mismatches', () => {
  assert.throws(() => buildPrimary4SupplementRows(existingRows, 'C:/curriculum', 'secondary'), /only valid with --school-code primary/);
  const missingHomeEconomicsRow = existingRows.filter((row, index) => !(row.subjectName === 'Home Economics' && row.termLabel === '3rd Term' && index === existingRows.findIndex(x => x.subjectName === 'Home Economics' && x.termLabel === '3rd Term')));
  assert.throws(() => buildPrimary4SupplementRows(missingHomeEconomicsRow, 'C:/curriculum', 'primary'), /source archive mismatch/);
});

test('Primary 4 packages cannot be written until owner approval and verification', () => {
  const issues = primary4SupplementApprovalIssues();
  assert.equal(issues.length, 8);
  assert.ok(issues.some(issue => issue.includes('PENDING_OWNER_REVIEW')));
  assert.ok(issues.some(issue => issue.includes('NOT_YET_INDEPENDENTLY_VERIFIED')));
});
