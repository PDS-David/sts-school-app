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

test('Primary 4 Basic Science First Term drops the outline and normalizes detailed week headings', () => {
  const source = [
    'PRY 4 BASIC SCIENCE FIRST TERM LESSON NOTES',
    'WEEK 1: CHANGES IN NATURE',
    'WEEK 2: CHANGES IN PLANT',
    'WEEK 13: EXAMINATION',
    '',
    'WEEK: WEEK 1',
    'CLASS: PRIMARY 4',
    'TOPIC: CHANGES IN NATURE',
    'LESSON CONTENT',
    'Change is when something passes from one state to another.',
    '',
    'WEEK: WEEK 2',
    'CLASS: PRIMARY 4',
    'TOPIC: CHANGES IN PLANT',
    'LESSON CONTENT',
    'Plants grow from seeds into mature plants.',
    '',
    'WEEK: 5',
    'TOPIC: OUR WEATHER',
    'LESSON CONTENT',
    'Weather is the condition of the atmosphere.',
  ].join('\\n');

  const resolved = applyPrimarySourceTextResolution('1st termBasicscience4.docx', source);

  assert.ok(resolved.startsWith('WEEK 1'));
  assert.ok(resolved.includes('WEEK 2'));
  assert.ok(resolved.includes('WEEK 5'));
  assert.ok(resolved.includes('LESSON CONTENT'));
  assert.ok(!resolved.includes('WEEK 13: EXAMINATION'));
  assert.ok(!resolved.includes('WEEK: WEEK'));
});
