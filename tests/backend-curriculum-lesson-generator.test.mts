import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCurriculumLesson } from '../backend/src/services/curriculumLessonGenerator.ts';

const validLesson = {
  title: 'Fractions',
  introduction: 'Fractions describe equal parts of a whole and help us represent quantities that are smaller than, or between, whole numbers.',
  sections: [
    { heading: 'Meaning of a fraction', content: 'A fraction has a numerator and denominator. The denominator tells us how many equal parts make the whole, while the numerator tells us how many of those parts are being considered.' },
    { heading: 'Equivalent fractions', content: 'Equivalent fractions represent the same value even though their numerators and denominators differ. Multiplying or dividing both terms by the same non-zero number preserves the value.' },
  ],
  summary: 'A fraction represents equal parts of a whole. Its numerator counts selected parts and its denominator states the total number of equal parts.',
  practice_questions: Array.from({ length: 5 }, (_, index) => ({
    stem: `Which fraction is equivalent to one half? Question ${index + 1}`,
    options: [
      { key: 'A', text: '2/4' }, { key: 'B', text: '1/3' },
      { key: 'C', text: '3/4' }, { key: 'D', text: '2/3' },
    ],
    correct_keys: ['A'],
    explanation: 'Two quarters simplify to one half when numerator and denominator are divided by two.',
  })),
};

test('accepts a complete lesson with validated practice answer keys', () => {
  assert.equal(validateCurriculumLesson(validLesson), true);
});

test('rejects lesson output with too few teaching sections', () => {
  assert.equal(validateCurriculumLesson({ ...validLesson, sections: [validLesson.sections[0]] }), false);
});

test('rejects malformed options and answer keys', () => {
  const malformed = structuredClone(validLesson);
  malformed.practice_questions[0].options[3].key = 'C';
  assert.equal(validateCurriculumLesson(malformed), false);
});

test('rejects practice questions without explanations', () => {
  const malformed = structuredClone(validLesson);
  delete malformed.practice_questions[0].explanation;
  assert.equal(validateCurriculumLesson(malformed), false);
});
