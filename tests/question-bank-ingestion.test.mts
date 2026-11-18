import test from 'node:test';
import assert from 'node:assert/strict';
import { ingestionQuestionSchema, rightsGate } from '../backend/src/utils/questionBankValidation.ts';

const base = {
  board: 'WAEC',
  exam_year: null,
  subject_code: 'MATHEMATICS',
  paper: 'Original practice — not a past paper',
  question_number: 'AI-GEN-TEST-001',
  question_type: 'mcq',
  stem: 'What is 2 + 2?',
  options: [{ key: 'A', text: '3' }, { key: 'B', text: '4' }],
  correct_answer: { key: 'B', value: '4' },
  explanation: 'Adding two and two gives four.',
  marks: 1,
  topic_slug: 'linear-equations',
  content_origin: 'ai_generated',
};

test('generated pilot item validates without a historical exam year', () => {
  assert.equal(ingestionQuestionSchema.safeParse(base).success, true);
});

test('question schema rejects generated content labelled as a historical paper', () => {
  const result = ingestionQuestionSchema.safeParse({ ...base, exam_year: 2024, paper: 'Paper 1' });
  assert.equal(result.success, false);
});

test('question schema rejects past questions without a year', () => {
  const result = ingestionQuestionSchema.safeParse({ ...base, content_origin: 'past_question' });
  assert.equal(result.success, false);
});

test('rights gate blocks copying from an official portal with reference-only rights', () => {
  const error = rightsGate({
    board: 'WAEC',
    rights_status: 'reference_only',
    rights_evidence: 'Official portal is for research only.',
    is_active: true,
  }, { ...base, content_origin: 'past_question', exam_year: 2022 });
  assert.match(error ?? '', /not licensed for reuse/i);
});

test('rights gate accepts a documented licensed source only for the same board', () => {
  const source = {
    board: 'WAEC',
    rights_status: 'licensed',
    rights_evidence: 'Signed licence dated 2026-11-18 permits reproduction.',
    is_active: true,
  };
  assert.equal(rightsGate(source, { ...base, content_origin: 'past_question', exam_year: 2022 }), null);
  assert.match(rightsGate(source, { ...base, board: 'NECO', content_origin: 'past_question', exam_year: 2022 }) ?? '', /does not match/i);
});

test('original questions cannot be imported through a past-question source', () => {
  const error = rightsGate({
    board: 'GENERAL',
    rights_status: 'reference_only',
    rights_evidence: 'Not licensed for copying.',
    is_active: true,
  }, base);
  assert.match(error ?? '', /original_generated/i);
});
