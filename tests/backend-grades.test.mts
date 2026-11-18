import assert from 'node:assert/strict';
import test from 'node:test';
import { getGrade, getGradeRemark } from '../backend/src/utils/grades.js';

test('numeric report grades use deterministic inclusive boundaries', () => {
  const cases: Array<[number, string]> = [
    [100, 'A'],
    [70, 'A'],
    [69.99, 'B'],
    [60, 'B'],
    [59.99, 'C'],
    [50, 'C'],
    [49.99, 'D'],
    [45, 'D'],
    [44.99, 'E'],
    [40, 'E'],
    [39.99, 'F'],
    [0, 'F'],
  ];
  for (const [score, expected] of cases) {
    assert.equal(getGrade(score), expected, `score ${score} should be grade ${expected}`);
  }
});

test('grade remarks match the wording printed on the official report template', () => {
  assert.deepEqual(
    ['A', 'B', 'C', 'D', 'E', 'F'].map(getGradeRemark),
    ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor', 'Fail'],
  );
  assert.equal(getGradeRemark('unknown'), '');
});
