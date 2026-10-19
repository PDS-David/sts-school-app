// Lesson picture label + wiring. No device needed (the screen itself still needs a phone session: RG-08 / RG-36).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { lessonImageLabel } from '../mobile/src/api/lessonImage.js';

test('screen-reader label prefers alt_text, then caption, then a generic label', () => {
  assert.equal(lessonImageLabel({ caption: 'Cap', alt_text: 'Long description' }), 'Long description');
  assert.equal(lessonImageLabel({ caption: 'Cap', alt_text: '   ' }), 'Cap');
  assert.equal(lessonImageLabel({ caption: null, alt_text: null }), 'Lesson illustration');
  assert.equal(lessonImageLabel({}), 'Lesson illustration');
});

test('lesson screen labels pictures with the helper and keeps the wide-picture sideways scroll', () => {
  const s = readFileSync('mobile/src/screens/TopicDetailScreen.tsx', 'utf8');
  assert.match(s, /accessibilityLabel=\{lessonImageLabel\(asset\)\}/);
  assert.doesNotMatch(s, /accessibilityLabel=\{asset\.caption/);
  assert.match(s, /WIDE_PICTURE_PX/);
  assert.match(s, /resizeMode="contain"/);
});
