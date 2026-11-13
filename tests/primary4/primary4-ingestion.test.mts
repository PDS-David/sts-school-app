import test from 'node:test';
import assert from 'node:assert/strict';
import sourceManifest from '../../backend/src/db/primary4/sourceManifest.json' with { type: 'json' };
import {
  buildPrimary4SupplementRows,
  primary4SupplementApprovalIssues,
  refreshPrimary4PackageRows,
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
  assert.equal(rows.length, 38);
  assert.ok(rows.every(row => row.className === 'Primary 4' && row.preserveOrderIndex === true));
  assert.ok(rows.every(row => row.filePath.includes('__primary4_researched__')));
  assert.equal(rows.filter(row => row.subjectName === 'Home Economics' && row.termLabel === '3rd Term').length, 7);
  const sequence = (subject: string, term: string) => rows.filter(row => row.subjectName === subject && row.termLabel === term).map(row => row.orderIndex);
  assert.deepEqual(sequence('Home Economics', '1st Term'), [1,2,3,4,5,6,7,8,9]);
  assert.deepEqual(sequence('Home Economics', '2nd Term'), [1,2,3,4,5,6,7,8,9]);
  assert.deepEqual(sequence('Basic Science', '3rd Term'), [1,2,3,4,5]);
  assert.deepEqual(sequence('Basic Technology', '1st Term'), [1,2,3,4]);
  assert.deepEqual(sequence('Basic Technology', '2nd Term'), [1,2,3,4]);
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

test('all Primary 4 researched packages pass the owner approval and verification gate', () => {
  const issues = primary4SupplementApprovalIssues();
  assert.deepEqual(issues, []);
});

test('approved Primary 4 package refresh updates only exact researched rows and retires their stale assessments', async () => {
  let captured: { sql: string; params?: unknown[] } | null = null;
  const query = async (sql: string, params?: unknown[]) => {
    captured = { sql, params };
    return { rows: [{ refreshed_count: '2', closed_assessment_count: '1' }] };
  };
  const planned = [{
    subject_id: 44,
    class_name: 'Primary 4',
    term_label: '1st Term',
    title: 'Vehicles: Meaning, Types and Uses',
    source_reference: 'approved refreshed lesson source',
    order_index: 1,
    source_file: 'P4-RESEARCHED-p4-bt-t1-w02.json',
  }];
  const result = await refreshPrimary4PackageRows(query, 'primary', planned);
  assert.deepEqual(result, { refreshedCount: 2, closedAssessmentCount: 1 });
  assert.ok(captured);
  assert.match(captured!.sql, /t\.source_file LIKE 'P4-RESEARCHED-%'/);
  assert.match(captured!.sql, /content_fingerprint='__PRIMARY4_WITHDRAWN__:'/);
  assert.match(captured!.sql, /summary=NULL/);
  assert.match(captured!.sql, /generated_assessment_id=NULL/);
  assert.deepEqual(JSON.parse(String(captured!.params?.[1])), planned);
  await assert.rejects(() => refreshPrimary4PackageRows(query, 'secondary', planned), /only valid for the primary school/);
});
