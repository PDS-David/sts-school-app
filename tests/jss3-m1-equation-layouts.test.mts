// M1: the two First-Term Mathematics graph-table layouts (source paragraphs 704-705 and 708-709).
// CI-safe tests recompute the tables and check asset identity. The real-source test needs JSS3_ALL_ROOT (set by verify_handoff.py)
// and is reported as an explicit skip without it: a skip is NOT a pass of the source check.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'curriculum-assets/jss3/m1-equations');
const figs: any[] = JSON.parse(readFileSync(path.join(ROOT, 'scripts/jss3/m1/m1_equation_layouts.json'), 'utf8')).figures;
const F = (id: string) => figs.find(f => f.id === id)!;
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

test('every table value lies on the line it is drawn for', () => {
  for (const f of figs) for (const t of f.data.tables) {
    assert.equal(t.x.length, 3); assert.equal(t.y.length, 3);
    t.x.forEach((x: number, i: number) => assert.equal(t.line[0] * x + t.line[1], t.y[i], `${f.id} x=${x}`));
  }
});
test('(a) crosses at (2, -1) and both lesson equations hold there; the second printed label is typed x, not y', () => {
  const d = F('EQ-A').data; const [x, y] = d.crossing;
  assert.deepEqual([x, y], [2, -1]); assert.equal(x - 2 * y, 4); assert.equal(2 * x - y, 5);
  for (const t of d.tables) assert.equal(t.line[0] * x + t.line[1], y);
  assert.deepEqual(d.omml_labels.slice(-1), ['x']); assert.equal(d.printed_labels[1], 'x = -1'); assert.notEqual(d.printed_labels[1].startsWith('y'), true);
});
test('(b): the tables fit 2x+y=10 and 4x-2y=4, which cross at (3, 4) outside the drawn range; the printed labels repeat (a) and fit neither reading', () => {
  const d = F('EQ-B').data; const [x, y] = d.crossing;
  assert.deepEqual([x, y], [3, 4]); assert.equal(2 * x + y, 10); assert.equal(4 * x - 2 * y, 4);
  for (const t of d.tables) { assert.equal(t.line[0] * x + t.line[1], y); assert.ok(Math.max(...t.x) < x, 'crossing is beyond the last tabulated x'); }
  assert.deepEqual(d.printed_labels, F('EQ-A').data.printed_labels, 'labels copied from (a)');
  assert.notDeepEqual([2, -1], [x, y]);
  assert.equal(2 * 2 + -1 === 10, false);               // (2,-1) is not on 2x+y=10
  // as printed in the original (2x-y=10 with 4x-2y=4) the lines are parallel
  assert.equal(2 / 4, -1 / -2); assert.notEqual(10 / 4, 4 / 4);
});
test('flat text cannot tell the tables apart: x values of BOTH tables share one paragraph (structure the figure restores)', () => {
  for (const f of figs) {
    assert.equal(f.data.paragraphs.length, 2); const [t1, t2] = f.data.tables;
    assert.equal(t1.x.length + t2.x.length, 6); assert.notDeepEqual(t1, t2);
  }
});
test('assets: manifest rows are bound to the original lesson identity, bytes match, captions and alt text carry every value', () => {
  const rows = prepareAssets(loadManifest(path.join(ASSETS, 'M1_EQUATIONS_MANIFEST.csv')), ASSETS);
  assert.equal(rows.length, 2);
  for (const a of rows) {
    const f = figs.find(x => 'M1-' + x.id === a.asset_key)!; assert.ok(f);
    assert.equal(a.expected_title, 'SIMPLE EQUATIONS INVOLVING FRACTIONS'); assert.equal(f.term, '1st Term'); assert.equal(a.mime, 'image/png');
    assert.equal(a.caption, f.caption); assert.equal(a.alt_text, f.alt_text); assert.equal(a.displayed, true);
    assert.equal(sha(readFileSync(path.join(ASSETS, f.file))), a.sha256);
    const png = readFileSync(path.join(ASSETS, f.file)); assert.ok(png.readUInt32BE(16) >= 600 && png.readUInt32BE(20) >= 100);
    const alt = a.alt_text!.replace(/−/g, '-');
    for (const t of f.data.tables) for (const v of [...t.x, ...t.y]) assert.ok(alt.includes(String(v)), `${a.asset_key} alt lacks ${v}`);
    assert.ok(a.caption!.includes('(' + f.data.crossing[0] + ', ' + String(f.data.crossing[1]).replace('-', '−') + ')'), 'caption states the crossing point');
  }
  const ords = new Set(rows.map(r => r.order_index)); assert.equal(ords.size, 1);
  const guard = readFileSync(path.join(ASSETS, 'M1_ROW_GUARDS.csv'), 'utf8').trim().split('\n').slice(1)[0].split(',');
  assert.deepEqual(guard.slice(0, 3), ['1st Term', 'SIMPLE EQUATIONS INVOLVING FRACTIONS', String([...ords][0])]);
  // sort orders do not collide with anything else bound to this lesson, and keys do not clash with other manifests
  const other = new Set<string>();
  for (const m of ['MUSIC_ASSET_MANIFEST.csv', 'TASK2_BT_ASSET_MANIFEST.csv', 'v2-math/V2_MATH_1ST_MANIFEST.csv', 'v2-math/V2_MATH_2ND_MANIFEST.csv'])
    for (const r of loadManifest(path.join(ROOT, 'curriculum-assets/jss3', m))) other.add(r.asset_key);
  for (const r of rows) assert.ok(!other.has(r.asset_key));
});
test('negative: a changed byte or a missing file is rejected', () => {
  const rows = loadManifest(path.join(ASSETS, 'M1_EQUATIONS_MANIFEST.csv'));
  assert.throws(() => prepareAssets([{ ...rows[0], sha256: '0'.repeat(64) }], ASSETS), /sha256 mismatch/);
  assert.throws(() => prepareAssets([{ ...rows[0], file: 'nope.png' }], ASSETS), /not found/);
});

const root = process.env.JSS3_ALL_ROOT;
test('REAL SOURCE: paragraphs 704/705/708/709 hold exactly these values, labels and drawn connectors', { skip: root ? false : 'JSS3_ALL_ROOT not set: source check NOT run' }, () => {
  const docx = path.join(root!, 'JSS3 1ST TERM ', 'JSS 3 MATHEMATICS.docx');
  const script = `
import sys,json,zipfile
from lxml import etree
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main';M='http://schemas.openxmlformats.org/officeDocument/2006/math'
ps=list(etree.fromstring(zipfile.ZipFile(sys.argv[1]).read('word/document.xml')).iter('{%s}p'%W))
out={}
for n in (704,705,708,709):
    t=[];m=[];c=0
    for e in ps[n].iter():
        if e.tag=='{%s}t'%W: t.append(e.text)
        elif e.tag=='{%s}oMath'%M: m.append(''.join(x.text or '' for x in e.iter('{%s}t'%M)))
        elif e.tag.endswith('}prstGeom') and e.get('prst')=='straightConnector1': c+=1
    out[n]=dict(t=t,m=m,c=c,n=len(ps))
print(json.dumps(out))`;
  const r = spawnSync('python3', ['-I', '-c', script, docx], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr);
  const s = JSON.parse(r.stdout); const nums = (a: string[]) => a.map(v => v.trim()).filter(v => /^-?\d+$/.test(v)).map(Number);
  assert.equal(s['704'].n, 828);
  for (const f of figs) {
    const [px, py] = f.data.paragraphs; const [t1, t2] = f.data.tables;
    assert.deepEqual(nums(s[px].t), [...t1.x, ...t2.x], f.id + ' x rows'); assert.deepEqual(nums(s[py].t), [...t1.y, ...t2.y], f.id + ' y rows');
    assert.deepEqual([...s[px].m, ...s[py].m].sort(), [...f.data.omml_labels].sort(), f.id + ' math labels');
    assert.equal(s[px].c, 8, f.id + ' drawn connectors');
    assert.equal(s[px].t.at(-1).trim(), '= 2'); assert.equal(s[py].t.at(-1).trim(), '= -1');
  }
});
