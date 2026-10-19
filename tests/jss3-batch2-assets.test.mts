// Batch 2 figures: manifest integrity that needs no private corpus (CI-safe). Order-index resolution against the real
// importer output is proven by jss3-batch2-assets.db.test.mts (needs the private source corpus).
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.js';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';

const dir = 'curriculum-assets/jss3/supplements';
test('Batch 2 manifests: bytes match sha256, PNG, title equals the target lesson, 1 + 10 figures, no key clash with earlier art', () => {
  const files = readdirSync(dir).filter(f => f.startsWith('BATCH2_') && f.endsWith('_MANIFEST.csv'));
  assert.deepEqual(files.sort(), ['BATCH2_BUSINESS_2ND_MANIFEST.csv', 'BATCH2_MUSIC_1ST_MANIFEST.csv', 'BATCH2_MUSIC_2ND_MANIFEST.csv']);
  const keys: string[] = [];
  for (const f of files) {
    for (const a of prepareAssets(loadManifest(`${dir}/${f}`), dir)) {
      assert.equal(a.mime, 'image/png'); assert.equal(a.displayed, true); assert.ok(a.caption && a.caption.length > 20, a.asset_key);
      const lesson = JSS3_SUPPLEMENTS.filter(s => a.asset_key.startsWith(s.id + '-')).sort((x, y) => y.id.length - x.id.length)[0];
      assert.ok(lesson, a.asset_key); assert.equal(a.expected_title, lesson.title, a.asset_key); keys.push(a.asset_key);
    }
  }
  assert.equal(keys.length, 11); assert.equal(new Set(keys).size, 11);
  assert.equal(keys.filter(k => k.startsWith('SUP-BUS-SHORTHAND')).length, 1);
  assert.ok(!keys.some(k => ['SUP-BUSINESS', 'SUP-BASIC_TECH', 'SUP-MUSIC-TIME'].includes(k)));
});

test('Music figures carry alt text that is a real description, not a repeat of the caption', () => {
  const files = ['BATCH2_MUSIC_1ST_MANIFEST.csv', 'BATCH2_MUSIC_2ND_MANIFEST.csv'];
  let n = 0;
  for (const f of files) {
    for (const a of prepareAssets(loadManifest(`${dir}/${f}`), dir)) {
      n++;
      assert.ok(a.alt_text, `${a.asset_key} has alt_text`);
      assert.notEqual(a.alt_text, a.caption, a.asset_key);
      assert.ok(a.alt_text!.length >= 60, `${a.asset_key} alt_text is descriptive`);
      assert.match(a.alt_text!, /staff|staves|clef|major|minor|sol-fa|key/i, `${a.asset_key} alt_text describes the notation`);
    }
  }
  assert.equal(n, 10);
});
