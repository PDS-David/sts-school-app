import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const inventory = JSON.parse(readFileSync(
  new URL('../docs/curriculum/primary1-6/PRIMARY1_6_SOURCE_INVENTORY.json', import.meta.url),
  'utf8',
));
const coverageCsv = readFileSync(
  new URL('../docs/curriculum/primary1-6/PRIMARY1_6_COVERAGE_BASELINE.csv', import.meta.url),
  'utf8',
);
const status = readFileSync(
  new URL('../docs/curriculum/primary1-6/PRIMARY1_6_COMPLETION_STATUS.md', import.meta.url),
  'utf8',
);

test('Primary 1-6 source inventory is complete and hash-backed', () => {
  assert.equal(inventory.sourceArchives.length, 6);
  assert.equal(inventory.documents.length, 267);
  assert.equal(inventory.nestedTermArchives.length, 18);
  assert.equal(inventory.archiveTotals.bytes, 604056105);
  assert.equal(inventory.archiveTotals.distinctWordDocumentHashes, 176);
  assert.ok(inventory.documents.every((doc: { sha256: string }) => /^[a-f0-9]{64}$/.test(doc.sha256)));
  assert.ok(inventory.sourceArchives.every((archive: { sha256: string }) => /^[a-f0-9]{64}$/.test(archive.sha256)));
});

test('coverage crosswalk contains all 198 class-subject-term cells', () => {
  const rows = coverageCsv.trim().split(/\r?\n/);
  assert.equal(rows.length - 1, 198);
  assert.equal(inventory.scope.subjectTermBuckets, 198);
  assert.deepEqual(inventory.scope.classes, [
    'Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6',
  ]);
  assert.ok(!rows.some(row => /STUDENT_DELIVERY_COMPLETE|CURRICULUM_COMPLETE/.test(row)));
});

test('unresolved cross-class duplicate groups remain blocked, not auto-approved', () => {
  const unresolved = inventory.crossClassDuplicateGroups.filter(
    (group: { status: string }) => group.status === 'OWNER_DECISION_REQUIRED',
  );
  assert.equal(unresolved.length, 2);
  assert.ok(unresolved.every((group: { files: Array<{ class: string; basename: string }> }) => group.files.length >= 2));
});

test('source-recovery and Primary 4 package evidence are represented', () => {
  assert.deepEqual(
    inventory.sourceRecovery.entries.map((entry: { recoveredWeekMarkerCount: number }) => entry.recoveredWeekMarkerCount),
    [10, 9, 5],
  );
  for (const entry of inventory.sourceRecovery.entries as Array<{ sourceBasename: string; sourceSha256: string; sourceArchiveSha256: string }>) {
    assert.ok(inventory.documents.some((doc: { basename: string; sha256: string }) => doc.basename === entry.sourceBasename && doc.sha256 === entry.sourceSha256));
    assert.ok(inventory.sourceArchives.some((archive: { sha256: string }) => archive.sha256 === entry.sourceArchiveSha256));
  }
  const p5Anonymous = inventory.documents.find((doc: { basename: string }) => doc.basename === 'ⁿ.docx');
  assert.equal(p5Anonymous?.excluded_after_patch, true);
  assert.equal(inventory.primary4CodeEvidence.manifestRows, 248);
  assert.equal(inventory.primary4CodeEvidence.researchedLessons, 38);
  assert.equal(inventory.primary4CodeEvidence.archiveLessonCorrections, 33);
  assert.match(status, /No Primary class is marked curriculum-complete or student-delivery-complete/);
});
