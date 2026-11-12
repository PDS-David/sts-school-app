// Run:  cd backend && npx tsx --test ../tests/ingest-cross-class-duplicate.test.mts
//
// Guards the importer against byte-identical documents in different classes
// (real cases: Primary 3 Home Economics = Primary 4's file; Agricultural Science
// 3rd Term identical in Primary 3 and Primary 4, owner chose to keep both).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crossClassByteDuplicate, type SourceByteOwner } from '../backend/src/db/ingestTopics.ts';
import { isPrimarySourceExcluded, isAcknowledgedCrossClassDuplicate } from '../backend/src/db/primaryCurriculumResolutions.ts';

const fresh = () => new Map<string, SourceByteOwner>();

test('same bytes in different classes is reported, naming both files', () => {
  const owners = fresh();
  assert.equal(crossClassByteDuplicate(owners, 'h1', 'Basic 3/2nd Term/a.docx', 'a.docx', ['Primary 3']), undefined);
  const msg = crossClassByteDuplicate(owners, 'h1', 'Basic 4/3rd Term/b.docx', 'b.docx', ['Primary 4']);
  assert.ok(msg);
  assert.match(msg!, /Basic 4\/3rd Term\/b\.docx/);
  assert.match(msg!, /Basic 3\/2nd Term\/a\.docx/);
});

test('same bytes in the same class is left to the existing exact-copy suppression', () => {
  const owners = fresh();
  assert.equal(crossClassByteDuplicate(owners, 'h1', 'x/a.docx', 'a.docx', ['Primary 3']), undefined);
  assert.equal(crossClassByteDuplicate(owners, 'h1', 'x/a_1.docx', 'a_1.docx', ['Primary 3']), undefined);
});

test('different bytes never conflict', () => {
  const owners = fresh();
  assert.equal(crossClassByteDuplicate(owners, 'h1', 'a', 'a.docx', ['Primary 3']), undefined);
  assert.equal(crossClassByteDuplicate(owners, 'h2', 'b', 'b.docx', ['Primary 4']), undefined);
});

test('the owner-approved Agricultural Science pair is allowed in either order', () => {
  for (const [first, second] of [
    [['PRY 3 AGRIC SCIENCE 3RD TERM.docx', 'Primary 3'], ['PRY 4 AGRIC 3RD TERM.docx', 'Primary 4']],
    [['PRY 4 AGRIC 3RD TERM.docx', 'Primary 4'], ['PRY 3 AGRIC SCIENCE 3RD TERM.docx', 'Primary 3']],
  ] as const) {
    const owners = fresh();
    assert.equal(crossClassByteDuplicate(owners, 'h', first[0], first[0], [first[1]]), undefined);
    assert.equal(crossClassByteDuplicate(owners, 'h', second[0], second[0], [second[1]]), undefined);
  }
  assert.equal(isAcknowledgedCrossClassDuplicate('PRY 3 AGRIC SCIENCE 3RD TERM.docx', 'PRY 4 ENGLISH 3RD TERM.docx'), false);
});

test('the Primary 3 copy of the Primary 4 Home Economics file is excluded', () => {
  assert.equal(isPrimarySourceExcluded('PRY 3 HOME ECONS 2ND TERM.docx'), true);
  assert.equal(isPrimarySourceExcluded('PRY 4 HOME ECONS RD TERM.docx'), false);
});
