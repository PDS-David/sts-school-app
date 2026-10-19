// G4: the ten E (Music) figures: right lesson, caption, descriptive text, bytes, and phone legibility.
//   node --import tsx --test tests/jss3-g4-figures.test.mts
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import lessons from '../backend/src/db/data/jss3Supplements.json' with { type: 'json' };
import { loadManifest } from '../backend/src/db/attachTopicAssets.js';

const dir = 'curriculum-assets/jss3/supplements';
const E: any[] = JSON.parse(readFileSync('docs/jss3/batch2-close/E_MUSIC_CCA/ASSETS.json', 'utf8'));
const L = lessons as any[];
const manifest = ['BATCH2_MUSIC_1ST_MANIFEST.csv', 'BATCH2_MUSIC_2ND_MANIFEST.csv'].flatMap(f => loadManifest(`${dir}/${f}`));
const pngSize = (b: Buffer) => ({ w: b.readUInt32BE(16), h: b.readUInt32BE(20) });
const STAFF_SPACE_PX = 26;        // measured on every figure (engraver setting), see G4 report
const MIN_STAFF_SPACE_PT = 4;     // below this noteheads and sol-fa letters are not reliably legible on a phone
const PHONE_PT = 360;
const WIDE_PICTURE_PX = 1500, WIDE_PICTURE_SCALE = 0.45; // must equal the constants in TopicDetailScreen.tsx

test('ten figures: each is in a manifest with the same bytes, caption and the right lesson title', () => {
  assert.equal(E.length, 10); assert.equal(manifest.length, 10);
  for (const a of E) {
    const file = a.file.replace('assets/', ''); const bytes = readFileSync(`${dir}/${file}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), a.sha256, file);
    const m = manifest.find(r => r.file === file); assert.ok(m, file);
    assert.equal(m!.sha256, a.sha256, file); assert.equal(m!.caption, a.caption, file); assert.equal(m!.displayed, true);
    const lesson = L.find(l => l.id === a.target_lesson_id); assert.ok(lesson, a.target_lesson_id);
    assert.equal(m!.expected_title, lesson.title, file);
    assert.ok(m!.asset_key.startsWith(`${lesson.id}-`), file);
    assert.match(lesson.body, /[Ff]igure/, `${lesson.id} refers to its figure`);
    const { w, h } = pngSize(bytes); assert.equal(w, a.width); assert.equal(h, a.height);
  }
});

test('descriptive text exists for every figure and names the notes/chords drawn', () => {
  for (const a of E) {
    assert.ok(a.alt_text.length > 60, a.file);
    assert.equal(a.source_recovered_graphic, false, 'composed notation, not presented as a recovered original');
    assert.match(a.provenance, /No AI image generation/);
  }
  const alt = (f: string) => E.find(a => a.file.endsWith(f)).alt_text as string;
  assert.match(alt('harmonic-minor-d-e-g.png'), /D E F G A Bb C# D/);
  assert.match(alt('cadences-c-major.png'), /V to vi is G-B-D then A-C-E/);
  assert.match(alt('key-signatures-flats.png'), /Ab major or F minor \(Bb Eb Ab Db\)/);
  assert.match(alt('transposition-f-to-c.png'), /perfect 4th lower/);
});

test('legibility on a 360 pt phone: narrow figures at full width, wide figures in a sideways scroll', () => {
  for (const a of E) {
    const wide = a.width >= WIDE_PICTURE_PX;
    const shownWidth = wide ? Math.max(PHONE_PT, Math.round(a.width * WIDE_PICTURE_SCALE)) : PHONE_PT;
    const staffPt = STAFF_SPACE_PX * shownWidth / a.width;
    assert.ok(staffPt >= MIN_STAFF_SPACE_PT, `${a.file}: staff space ${staffPt.toFixed(1)} pt`);
    if (wide) assert.ok(staffPt >= 8, `${a.file}: wide figure scrolls at a readable size`);
  }
  // Without the scroll these two would be below 5 pt and their instruction lines near 3 pt.
  for (const f of ['staff-to-solfa-example.png', 'practical-model-melody.png']) {
    const a = E.find(x => x.file.endsWith(f)); assert.ok(a.width >= WIDE_PICTURE_PX); assert.ok(STAFF_SPACE_PX * PHONE_PT / a.width < 5);
  }
});

test('app presentation: wide pictures scroll sideways and earlier recovered Music art is unaffected', () => {
  const src = readFileSync('mobile/src/screens/TopicDetailScreen.tsx', 'utf8');
  assert.match(src, /WIDE_PICTURE_PX = 1500/); assert.match(src, /WIDE_PICTURE_SCALE = 0\.45/);
  assert.match(src, /<ScrollView horizontal/); assert.match(src, /resizeMode="contain"/);
  assert.match(src, /accessibilityLabel=\{asset\.caption/);
  for (const f of ['W2-1', 'W3-3', 'W7-1', 'W7-2']) { const b = readFileSync(`curriculum-assets/jss3/music/${f}.png`); assert.ok(pngSize(b).w < WIDE_PICTURE_PX, f); }
});
