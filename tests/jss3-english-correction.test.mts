import assert from 'node:assert/strict';
import test from 'node:test';
import { splitJss3EnglishLessons } from '../backend/src/db/jss3EnglishLessonSplit.js';

test('First-Term English preserves distinct strand bodies and original sequence', () => {
  const source = 'WEEK ONE (1)\nGrammar: Parts of speech\nOriginal A\nLiterature in English:\nTopic: Fiction\nOriginal B\nWeek Two:\nSpeech Work: Stress\nOriginal C\nComposition: Letter\nOriginal D\n';
  const result = splitJss3EnglishLessons(source, '1st Term');
  assert.match(result, /Original A[\s\S]*WEEK ONE \(1\)[\s\S]*Literature in English/);
  assert.match(result, /Original C[\s\S]*Week Two:[\s\S]*Composition/);
  for (const token of ['Original A', 'Original B', 'Original C', 'Original D']) assert.equal(result.split(token).length, 2);
});

test('Second-Term English restores pre-week-three lessons and splits topic blocks', () => {
  const source = 'SCHEME OF WORK\nWEEK 1 Revision\nTOPIC : CONSONANT CONTRAST /t/ and /s/\nOriginal A\nTOPIC: CONJUNCTION\nOriginal B\nWEEK THREE\nTOPIC: COMPOSITION (ARTICLE WRITING)\nOriginal C\nGRAMMAR: TOPIC PREFIXES AND SUFFIXES\nOriginal D\nTOPIC :  for article call for expository prose\nOriginal E\n';
  const result = splitJss3EnglishLessons(source, '2nd Term');
  assert.equal((result.match(/WEEK TWO/g) ?? []).length, 2);
  assert.equal((result.match(/WEEK THREE/g) ?? []).length, 2);
  for (const token of ['Original A', 'Original B', 'Original C', 'Original D', 'Original E']) assert.equal(result.split(token).length, 2);
  assert.doesNotMatch(result, /SCHEME OF WORK/);
});

test('Unrecognized or missing Second-Term English source anchors block import', () => {
  assert.throws(() => splitJss3EnglishLessons('WEEK THREE\nTOPIC: X', '2nd Term'), /missing original/);
});
