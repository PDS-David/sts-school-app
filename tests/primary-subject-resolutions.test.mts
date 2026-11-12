// Run:  cd backend && npx tsx --test ../tests/primary-subject-resolutions.test.mts
//
// Guards two verified Primary 4 source problems found by comparing each file's
// own heading with its filename (the database was already corrected by hand):
//  - "PRY 4 BST Ist term.docx" is headed Basic Science, a copy of the lessons
//    in "1st termBasicscience4.docx"; it must not be filed as Basic Technology.
//  - "BASIC SCIENCE THIRD TERM PRY 4.docx" is headed Basic Technology.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPrimarySourceExcluded, resolvePrimarySubjectName } from '../backend/src/db/primaryCurriculumResolutions.ts';

const sci = { name: 'Basic Science', fallback: false };

test('mis-named Primary 4 BST 1st-term file is excluded', () => {
  assert.equal(isPrimarySourceExcluded('PRY 4 BST Ist term.docx'), true);
});

test('the retained Basic Science 1st-term source is not excluded', () => {
  assert.equal(isPrimarySourceExcluded('1st termBasicscience4.docx'), false);
});

test('Primary 4 "Basic Science" 3rd-term file is reassigned to Basic Technology', () => {
  const out = resolvePrimarySubjectName('BASIC SCIENCE THIRD TERM PRY 4.docx', '3rd Term', sci);
  assert.equal(out.name, 'Basic Technology');
  assert.equal(out.fallback, false);
});

test('the rule is exact: other files and other terms keep their subject', () => {
  assert.equal(resolvePrimarySubjectName('PRY 4 Basic Science 2nd term 2.docx', '2nd Term', sci), sci);
  assert.equal(resolvePrimarySubjectName('BASIC SCIENCE THIRD TERM PRY 4.docx', '2nd Term', sci), sci);
  assert.equal(resolvePrimarySubjectName('PRY 3 BASIC SCI 3RD TERM.doc', '3rd Term', sci), sci);
});
