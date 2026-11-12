import test from 'node:test';
import assert from 'node:assert/strict';
import { applyPrimarySourceTextResolution } from '../../backend/src/db/primaryCurriculumResolutions.ts';

test('Primary 4 CCA First Term keeps detailed lesson notes instead of the opening scheme outline', () => {
  const source = [
    'PRY 4 CCA First term E-note',
    'WEEK 1 TOPIC: MEANING AND DEFINITION OF ARTS',
    'Units: Uses and branches of art',
    'WEEK 2 TOPIC: ELEMENTS AND PRINCIPLES OF ARTS',
    'WEEK 14: REVISION AND EXAMINATION',
    '',
    'WEEK: 1',
    'CLASS: PRIMARY 4',
    'TOPIC: Meaning and Definition of Arts',
    'Learning Objectives',
    'Pupils should be able to state the meaning of arts.',
    'CONTENT',
    'Arts is the use of creative skills to make and communicate ideas.',
    '',
    'WEEK: 2',
    'TOPIC: Elements and Principles of Arts and Design',
    'CONTENT',
    'Elements of art include line, shape, colour, texture and form.',
  ].join('\\n');

  const resolved = applyPrimarySourceTextResolution('PRY 4 CCA First term E.docx', source);

  assert.ok(resolved.startsWith('WEEK: 1'));
  assert.ok(resolved.includes('Learning Objectives'));
  assert.ok(resolved.includes('CONTENT'));
  assert.ok(resolved.includes('WEEK: 2'));
  assert.ok(!resolved.includes('WEEK 14: REVISION AND EXAMINATION'));
  assert.ok(!resolved.includes('Units: Uses and branches of art'));
});
