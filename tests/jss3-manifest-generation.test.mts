import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadManifest } from '../backend/src/db/attachTopicAssets.ts';

test('regenerating Batch 2 manifests preserves every supplied descriptive label and lesson identity', () => {
  const root = mkdtempSync(join(tmpdir(), 'jss3-manifest-'));
  try {
    const lessons = JSON.parse(readFileSync('backend/src/db/data/jss3Supplements.json', 'utf8'));
    const definitions: any[] = [];
    for (const pkg of ['A_MATH_TECH_BUSINESS', 'E_MUSIC_CCA']) {
      const base = `docs/jss3/batch2-close/${pkg}`;
      cpSync(base, join(root, base), { recursive: true });
      definitions.push(...JSON.parse(readFileSync(`${base}/ASSETS.json`, 'utf8')).filter((a: any) => a.mime === 'image/png'));
    }
    mkdirSync(join(root, 'backend/src/db/data'), { recursive: true });
    cpSync('backend/src/db/data/jss3Supplements.json', join(root, 'backend/src/db/data/jss3Supplements.json'));
    mkdirSync(join(root, 'curriculum-assets/jss3/supplements'), { recursive: true });
    const ids = [...new Set(definitions.map(a => a.target_lesson_id))];
    const rows = ids.map((id, i) => {
      const s = lessons.find((x: any) => x.id === id); assert.ok(s, id);
      return { filePath: '__jss3_supplements__', weekLabel: `SUPPLEMENT ${id}`, className: 'JSS 3', subjectName: s.subjectName, termLabel: s.termLabel, title: s.title, orderIndex: i + 1 };
    });
    writeFileSync(join(root, 'capture.json'), JSON.stringify(rows));
    execFileSync('python3', [resolve('scripts/jss3/build_batch2_asset_manifests.py'), join(root, 'capture.json')], { cwd: root });
    const output = ['BATCH2_BUSINESS_2ND_MANIFEST.csv', 'BATCH2_MUSIC_1ST_MANIFEST.csv', 'BATCH2_MUSIC_2ND_MANIFEST.csv'].flatMap(f => loadManifest(join(root, 'curriculum-assets/jss3/supplements', f)));
    assert.equal(output.length, definitions.length);
    for (const a of definitions) {
      const m = output.find(x => x.file === a.file.split('/').at(-1)); assert.ok(m, a.file);
      assert.equal(m.alt_text, a.alt_text || null, a.file);
      assert.equal(m.order_index, rows.find(x => x.weekLabel === `SUPPLEMENT ${a.target_lesson_id}`)!.orderIndex);
      assert.equal(m.sha256, a.sha256);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});
