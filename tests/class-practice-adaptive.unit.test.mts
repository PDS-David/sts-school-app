import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAdaptiveConceptTargets,
  validateGeneratedPracticeQuestions,
  type AdaptiveConceptTarget,
} from '../backend/src/utils/classPracticeAdaptive.ts';

test('difficulty adapts to concept-level accuracy without overreacting to sparse success history', () => {
  const targets = buildAdaptiveConceptTargets(
    ['Fractions', 'Percentages', 'Algebra', 'Geometry'],
    [
      { concept: 'Fractions', attempts: 3, accuracy: 0.33 },
      { concept: 'Percentages', attempts: 2, accuracy: 0.6 },
      { concept: 'Algebra', attempts: 2, accuracy: 0.95 },
      { concept: 'Geometry', attempts: 4, accuracy: 0.95 },
    ],
  );
  assert.deepEqual(targets.map(target => [target.concept, target.difficulty, target.focus]), [
    ['Fractions', 'foundation', true],
    ['Percentages', 'foundation', true],
    ['Algebra', 'standard', false],
    ['Geometry', 'challenge', false],
  ]);
});

test('concept history matches labels case-insensitively and accepts PostgreSQL numeric strings', () => {
  const targets = buildAdaptiveConceptTargets(
    ['Linear equations'],
    [{ concept: '  LINEAR   EQUATIONS ', attempts: '3', accuracy: '0.5000' }],
  );
  assert.deepEqual(targets, [{
    concept: 'Linear equations', attempts: 3, accuracy: 0.5, difficulty: 'foundation', focus: true,
  }]);
});

test('new concepts remain standard and stale history outside the completed lesson is ignored', () => {
  const targets = buildAdaptiveConceptTargets(
    ['Osmosis'],
    [{ concept: 'Photosynthesis', attempts: 9, accuracy: 0.1 }],
  );
  assert.deepEqual(targets, [{
    concept: 'Osmosis', attempts: 0, accuracy: 0, difficulty: 'standard', focus: false,
  }]);
});

function question(concept: string, difficulty: AdaptiveConceptTarget['difficulty'], index: number) {
  return {
    concept,
    difficulty,
    question: `Explain the lesson idea in example ${index}?`,
    options: [
      { key: 'A', text: 'First answer' },
      { key: 'B', text: 'Second answer' },
      { key: 'C', text: 'Third answer' },
      { key: 'D', text: 'Fourth answer' },
    ],
    correct_answer: 'A',
    explanation: 'The lesson content supports this answer.',
    marks: 1,
  };
}

test('generated questions preserve assigned difficulty and put at least 70% on weak concepts', () => {
  const targets = buildAdaptiveConceptTargets(
    ['Fractions', 'Geometry'],
    [{ concept: 'Fractions', attempts: 2, accuracy: 0.5 }],
  );
  const valid = [
    question('Fractions', 'foundation', 1),
    question('Fractions', 'foundation', 2),
    question('Fractions', 'foundation', 3),
    question('Fractions', 'foundation', 4),
    question('Geometry', 'standard', 5),
  ];
  const result = validateGeneratedPracticeQuestions(valid, targets);
  assert.equal(result.length, 5);
  assert.ok(result.every(item => item.difficulty === (item.concept === 'Fractions' ? 'foundation' : 'standard')));
});

test('generator rejects insufficient weak-concept targeting', () => {
  const targets = buildAdaptiveConceptTargets(
    ['Fractions', 'Geometry'],
    [{ concept: 'Fractions', attempts: 2, accuracy: 0.5 }],
  );
  const invalid = [
    question('Fractions', 'foundation', 1),
    question('Fractions', 'foundation', 2),
    question('Geometry', 'standard', 3),
    question('Geometry', 'standard', 4),
    question('Geometry', 'standard', 5),
  ];
  assert.throws(() => validateGeneratedPracticeQuestions(invalid, targets), /at least 70%/);
});

test('generator rejects a question whose difficulty does not match the student performance target', () => {
  const targets = buildAdaptiveConceptTargets(
    ['Fractions'],
    [{ concept: 'Fractions', attempts: 3, accuracy: 0.2 }],
  );
  assert.throws(
    () => validateGeneratedPracticeQuestions([
      question('Fractions', 'challenge', 1),
      question('Fractions', 'foundation', 2),
      question('Fractions', 'foundation', 3),
    ], targets),
    /incorrectly adapted/,
  );
});

test('generator rejects concepts outside the completed lesson target list', () => {
  const targets = buildAdaptiveConceptTargets(['Osmosis'], []);
  assert.throws(
    () => validateGeneratedPracticeQuestions([
      question('Photosynthesis', 'standard', 1),
      question('Osmosis', 'standard', 2),
      question('Osmosis', 'standard', 3),
    ], targets),
    /out-of-lesson/,
  );
});
