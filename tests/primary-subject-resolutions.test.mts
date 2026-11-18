// Run:  cd backend && npx tsx --test ../tests/primary-subject-resolutions.test.mts
//
// Guards two verified Primary 4 source problems found by comparing each file's
// own heading with its filename (the database was already corrected by hand):
//  - "PRY 4 BST Ist term.docx" is headed Basic Science, a copy of the lessons
//    in "1st termBasicscience4.docx"; it must not be filed as Basic Technology.
//  - "BASIC SCIENCE THIRD TERM PRY 4.docx" is headed Basic Technology.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPrimarySourceTextResolution,
  isAcknowledgedCrossClassDuplicate,
  isPrimarySourceExcluded,
  resolvePrimarySubjectName,
} from '../backend/src/db/primaryCurriculumResolutions.ts';
import { PRIMARY_SOURCE_TEXT_OVERRIDES } from '../backend/src/db/primarySourceTextOverrides.ts';
import { parseTopics } from '../backend/src/db/ingestTopics.ts';

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


test('both Primary 3 Home Economics archive copies are excluded as misfiled Primary 4 content', () => {
  assert.equal(isPrimarySourceExcluded('PRY 3 HOME ECONS 2ND TERM.docx'), true);
  assert.equal(isPrimarySourceExcluded('PRY 3 HOME ECONS 2ND TERM_1.docx'), true);
});

test('both Primary 3 Agricultural Science archive copies are acknowledged against Primary 4', () => {
  assert.equal(isAcknowledgedCrossClassDuplicate('PRY 3 AGRIC SCIENCE 3RD TERM.docx', 'PRY 4 AGRIC 3RD TERM.docx'), true);
  assert.equal(isAcknowledgedCrossClassDuplicate('PRY 3 AGRIC SCIENCE 3RD TERM_1.docx', 'PRY 4 AGRIC 3RD TERM.docx'), true);
});

test('the anonymous Primary 5 first-term extraction artifact remains excluded by the nine-file allowlist', () => {
  assert.equal(isPrimarySourceExcluded('ⁿ.docx', 'BASIC FIVE/1st Term Basic 5/ⁿ.docx'), true);
  assert.equal(isPrimarySourceExcluded('PRY 5 CCA  Ist term.doc', 'BASIC FIVE/1st Term Basic 5/PRY 5 CCA  Ist term.doc'), false);
});

test('exact-hash Primary 1 source recoveries restore all explicit first-term lesson blocks', () => {
  const cases = [
    ['PRY 1 ENGLISH IST TERM(1).doc', 10],
    ['PRY 1 BASIC SCI IST TERM.doc', 9],
    ['PRY 1 CCA IST TERM.doc', 5],
  ] as const;

  for (const [basename, expectedCount] of cases) {
    const source = PRIMARY_SOURCE_TEXT_OVERRIDES.get(basename);
    assert.ok(source, `missing exact source override for ${basename}`);
    const recovered = applyPrimarySourceTextResolution(basename, 'lossy legacy extraction', source.sourceSha256);
    const topics = parseTopics(recovered);
    assert.equal(topics.length, expectedCount, basename);
    assert.ok(topics.every(topic => topic.title && topic.title !== '(untitled)'), basename);
  }
});

test('Primary 1 source recovery refuses a basename match with the wrong source hash', () => {
  const source = PRIMARY_SOURCE_TEXT_OVERRIDES.get('PRY 1 ENGLISH IST TERM(1).doc');
  assert.ok(source);
  assert.throws(
    () => applyPrimarySourceTextResolution('PRY 1 ENGLISH IST TERM(1).doc', 'untrusted text', '0'.repeat(64)),
    /hash mismatch/i,
  );
});

test('Primary 1 CCA slash-separated source week labels remain intact', () => {
  const source = PRIMARY_SOURCE_TEXT_OVERRIDES.get('PRY 1 CCA IST TERM.doc');
  assert.ok(source);
  const topics = parseTopics(source.text);
  const labels = topics.map(topic => topic.weekLabel);
  assert.ok(labels.some(label => label.includes('2/3')));
  assert.ok(labels.some(label => label.includes('4/5')));
  assert.ok(labels.some(label => label.includes('6/8')));
  assert.ok(labels.some(label => label.includes('9/10')));
});
