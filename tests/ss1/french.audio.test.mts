import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  FRENCH_DIALOGUE,
  FRENCH_LISTENING_QUESTIONS,
  gradeFrenchListeningAnswers,
} from '../../mobile/src/data/frenchListening.ts';

test('French listening dialogue has a complete translated exchange with two speakers', () => {
  assert.equal(FRENCH_DIALOGUE.length, 8);
  assert.deepEqual([...new Set(FRENCH_DIALOGUE.map(line => line.speaker))].sort(), ['Ada', 'Le bibliothécaire'].sort());
  for (const line of FRENCH_DIALOGUE) {
    assert.ok(line.text.trim().length > 0);
    assert.ok(line.translation.trim().length > 0);
  }
});

test('French listening comprehension has ten answerable three-option questions', () => {
  assert.equal(FRENCH_LISTENING_QUESTIONS.length, 10);
  for (const question of FRENCH_LISTENING_QUESTIONS) {
    assert.equal(question.options.length, 3);
    assert.equal(new Set(question.options).size, 3, question.q);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 3, question.q);
    assert.ok(question.q.trim().length > 0);
  }
});

test('French listening grading handles perfect, zero, partial and invalid submissions', () => {
  const perfect = Object.fromEntries(FRENCH_LISTENING_QUESTIONS.map((question, index) => [index, question.answer]));
  assert.deepEqual(gradeFrenchListeningAnswers(perfect), { answered: 10, total: 10, score: 10, complete: true });

  const wrong = Object.fromEntries(FRENCH_LISTENING_QUESTIONS.map((question, index) => [index, (question.answer + 1) % 3]));
  const zeroOrPartial = gradeFrenchListeningAnswers(wrong);
  assert.equal(zeroOrPartial.answered, 10);
  assert.equal(zeroOrPartial.complete, true);
  assert.equal(zeroOrPartial.score, 0);

  assert.deepEqual(gradeFrenchListeningAnswers({ 0: FRENCH_LISTENING_QUESTIONS[0].answer }), {
    answered: 1, total: 10, score: 1, complete: false,
  });
  assert.deepEqual(gradeFrenchListeningAnswers({ 0: 99 }), {
    answered: 0, total: 10, score: 0, complete: false,
  });
});

test('Bundled standard and slow French recordings are real, distinct MP3 assets', () => {
  const files = [
    new URL('../../mobile/assets/french/SS1_French_Dialogue_standard.mp3', import.meta.url),
    new URL('../../mobile/assets/french/SS1_French_Dialogue_slow.mp3', import.meta.url),
  ];
  const recordings = files.map(file => {
    const bytes = readFileSync(file);
    assert.ok(bytes.length > 10_000);
    assert.equal(bytes.toString('ascii', 0, 3), 'ID3', 'recording must contain an ID3 metadata header');
    const tagSize = ((bytes[6] & 0x7f) << 21) | ((bytes[7] & 0x7f) << 14) | ((bytes[8] & 0x7f) << 7) | (bytes[9] & 0x7f);
    const audioStart = 10 + tagSize;
    assert.ok(audioStart < bytes.length, 'ID3 tag must not consume the entire recording');
    let validFrameHeaders = 0;
    for (let i = audioStart; i < bytes.length - 3; i++) {
      if (bytes[i] !== 0xff || (bytes[i + 1] & 0xe0) !== 0xe0) continue;
      const version = (bytes[i + 1] >> 3) & 0x03;
      const layer = (bytes[i + 1] >> 1) & 0x03;
      const bitrate = (bytes[i + 2] >> 4) & 0x0f;
      const sampleRate = (bytes[i + 2] >> 2) & 0x03;
      if (version !== 1 && layer !== 0 && bitrate !== 0 && bitrate !== 15 && sampleRate !== 3) validFrameHeaders++;
    }
    assert.ok(validFrameHeaders > 100, 'recording must contain sustained MPEG audio frame data');
    return { bytes, hash: createHash('sha256').update(bytes).digest('hex') };
  });
  assert.notEqual(recordings[0].hash, recordings[1].hash, 'standard and slow recordings must not be duplicate files');
  assert.notEqual(recordings[0].bytes.length, recordings[1].bytes.length, 'standard and slow recordings should be separately encoded');
});
