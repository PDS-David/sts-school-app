import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  classFolderConflict,
  inferClassNames,
} from '../backend/src/db/ingestTopics.ts';
import {
  isAcknowledgedCrossClassDuplicate,
  isPrimarySourceExcluded,
} from '../backend/src/db/primaryCurriculumResolutions.ts';

const cases: Array<[string, string]> = [
  ['Pre-Nursery', 'PRE-NURSERY 1st TERM.docx'],
  ['Reception', 'RECEPTION 1st TERM.docx'],
  ['Nursery 1', 'NURSERY 1 1st TERM.docx'],
  ['Nursery 2', 'NURSERY_2 1st TERM.docx'],
  ['KG 1', 'KG 1 1st TERM.docx'],
  ['KG 2', 'KG_2 1st TERM.docx'],
  ['Primary 1', 'PRY 1 MATHS 1st TERM.docx'],
  ['Primary 2', 'BASIC 2 ENGLISH 1st TERM.docx'],
  ['Primary 3', 'GRADE 3 ICT 1st TERM.docx'],
];

test('Early Years and Primary 1–3 aliases resolve to their exact canonical class', () => {
  for (const [expected, filename] of cases) {
    assert.deepEqual(inferClassNames(`curriculum/${filename}`), [expected], filename);
  }
});

test('Reception and Pre-Nursery resolve independently inside their shared folder', () => {
  const folder = 'PRE NURSERY AND RECEPTION';
  assert.deepEqual(inferClassNames(`${folder}/Reception.docx`), ['Reception']);
  assert.deepEqual(inferClassNames(`${folder}/Pre-Nursery.docx`), ['Pre-Nursery']);
  assert.equal(classFolderConflict(['Reception'], folder), undefined);
  assert.equal(classFolderConflict(['Pre-Nursery'], folder), undefined);
});

test('Primary filename/folder disagreement is reported, not silently reassigned', () => {
  const folder = 'BASIC THREE/3rd Term Basic 3';
  const classes = inferClassNames(`${folder}/PRY 2 ICT 3rd term.docx`);
  assert.deepEqual(classes, ['Primary 2']);
  assert.match(classFolderConflict(classes, folder) ?? '', /Primary 2.*Primary 3/);
});

test('known Primary misfiled/duplicate sources remain excluded', () => {
  assert.equal(isPrimarySourceExcluded('PRY 1 PHE 3RD TERM.doc'), true);
  assert.equal(isPrimarySourceExcluded('PRY 2 PHE 3RD TERM.docx'), true);
  assert.equal(isPrimarySourceExcluded('PRY 2 PHE 3RD TERM_1.docx'), true);
  assert.equal(isPrimarySourceExcluded('PRY 3 HOME ECONS 2ND TERM.docx'), true);
  assert.equal(isPrimarySourceExcluded('PRY 3 AGRIC SCIENCE 3RD TERM.docx'), false);
  assert.equal(isAcknowledgedCrossClassDuplicate(
    'PRY 3 AGRIC SCIENCE 3RD TERM.docx',
    'PRY 4 AGRIC 3RD TERM.docx',
  ), true);
});
