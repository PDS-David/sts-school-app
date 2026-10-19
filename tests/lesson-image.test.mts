// Lesson picture helpers + wiring. No device needed (the screen itself still needs a phone session: RG-08).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { lessonImageLabel, enlargedWidth } from '../mobile/src/api/lessonImage.js';

test('screen-reader label prefers alt_text, then caption, then a generic label', () => {
  assert.equal(lessonImageLabel({ caption: 'Cap', alt_text: 'Long description' }), 'Long description');
  assert.equal(lessonImageLabel({ caption: 'Cap', alt_text: '   ' }), 'Cap');
  assert.equal(lessonImageLabel({ caption: null, alt_text: null }), 'Lesson illustration');
  assert.equal(lessonImageLabel({}), 'Lesson illustration');
});

test('enlarged width: never narrower than inline, at most 3x inline, capped by native pixels', () => {
  assert.equal(enlargedWidth(2200, 328), 984);   // widest Music figure: 3x
  assert.equal(enlargedWidth(900, 328), 900);    // narrower native image is not stretched past its pixels
  assert.equal(enlargedWidth(200, 328), 328);    // small image: no shrink below inline
  assert.equal(enlargedWidth(0, 328), 656);      // size not known yet
  assert.equal(enlargedWidth(2200, 0), 0);
});

test('lesson screen uses the helper label, is tappable, and has a scrollable enlarged view', () => {
  const s = readFileSync('mobile/src/screens/TopicDetailScreen.tsx', 'utf8');
  assert.match(s, /lessonImageLabel\(asset\)/);
  assert.doesNotMatch(s, /accessibilityLabel=\{asset\.caption/);
  assert.match(s, /accessibilityRole="imagebutton"/);
  assert.match(s, /<Modal[\s\S]*<ScrollView[\s\S]*<ScrollView horizontal/);
  assert.match(s, /resizeMode="contain"/); // pictures still shown whole, never cropped
});
