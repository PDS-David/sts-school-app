// M2: substitution-method cancellation strokes (V2 paragraphs 79, 80, 83, 111 of BASIC 9 MATHEMATICS E-NOTE.docx).
// CI-safe tests need no private corpus or database. The real-source test runs only when JSS3_M2_SOURCE_DOCX points at the original.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'curriculum-assets/jss3/m2-simultaneous');
const MANIFEST = path.join(ASSETS, 'M2_SIMULTANEOUS_2ND_MANIFEST.csv');
const BUILD = path.join(ROOT, 'scripts/jss3/m2/build_m2_manifest.py');
const figs: any[] = JSON.parse(readFileSync(path.join(ROOT, 'scripts/jss3/m2/m2_figures.json'), 'utf8')).figures;
const SOLVING = 'SOLVING OF SIMULTANEOUS LINEAR EQUATIONS';
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

// ---- exact rational arithmetic: signs and operations checked against the source equations --------------------
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
type Q = [number, number];
const q = (n: number, d = 1): Q => { const g = gcd(n, d) || 1; const s = d < 0 ? -1 : 1; return [(s * n) / g, (s * d) / g]; };
const sub = (a: Q, b: Q) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const eq = (a: Q, b: Q) => a[0] === b[0] && a[1] === b[1];

test('Example 1: 2x+3(4-3x)=5 expands to 12-7x=5; 12-5=7x gives 7/7 = 7x/7, so x=1, y=1; both equations hold', () => {
  const x = q(1), y = sub(q(4), mul(q(3), x));
  assert.ok(eq(add(mul(q(2), x), mul(q(3), y)), q(5)) && eq(add(mul(q(3), x), y), q(4)));
  assert.ok(eq(sub(q(12), mul(q(7), x)), q(5)), '12 - 7x = 5 at x = 1');
  assert.ok(eq(sub(q(12), q(5)), q(7)), '12 - 5 = 7');
  assert.ok(eq(q(7, 7), q(1)) && eq(q(7, 7), x), 'cancelling the 7s: 7/7 = 1 = x');
  // the printed line "12 - 5 - 7x = 10" is a slip: it is false at the solution
  assert.notEqual(12 - 5 - 7 * 1, 10);
  assert.equal(12 - 5 - 7 * 1, 0);
  assert.match(figs[0].notes, /slip/); assert.match(figs[0].notes, /not edited/);
});
test('Example 2: 4(3-2n)-3n=0 gives 12-11n=0, n=12/11=1 1/11, m=3-24/11=9/11; both equations hold; printed 3/11-24/1 is a slip', () => {
  assert.ok(eq(q(-12, -11), q(12, 11))); assert.ok(eq(q(12, 11), add(q(1), q(1, 11))));
  const n = q(12, 11), m = sub(q(3), mul(q(2), n));
  assert.deepEqual(m, [9, 11]);
  assert.ok(eq(sub(mul(q(4), m), mul(q(3), n)), q(0)), '4m - 3n = 0');
  assert.ok(eq(add(m, mul(q(2), n)), q(3)), 'm + 2n = 3');
  assert.ok(eq(sub(q(33, 11), q(24, 11)), q(9, 11)), 'correct form 33/11 - 24/11');
  assert.ok(!eq(sub(q(3, 11), q(24, 1)), q(9, 11)), 'as printed (3/11 - 24/1) the line is false');
  assert.deepEqual(figs[1].data.n, [12, 11]); assert.deepEqual(figs[1].data.m, [9, 11]);
});

// ---- assets and bindings --------------------------------------------------------------------------------------------
test('assets: bytes, PNG, real alt text; bound to the SOLVING row identity, never the ELIMINATION row', () => {
  const rows = prepareAssets(loadManifest(MANIFEST), ASSETS); assert.equal(rows.length, 2);
  for (const a of rows) {
    const f = figs.find(x => 'V2-MATH-' + x.id === a.asset_key)!; assert.ok(f, a.asset_key);
    assert.equal(a.mime, 'image/png'); assert.equal(a.expected_title, SOLVING); assert.notEqual(a.expected_title, 'ELIMINATION METHOD');
    assert.equal(a.caption, f.caption); assert.equal(a.alt_text, f.alt_text); assert.ok(a.alt_text!.length >= 200 && a.alt_text !== a.caption); assert.equal(a.displayed, true);
    const png = readFileSync(path.join(ASSETS, f.file)); assert.equal(sha(png), a.sha256); assert.ok(png.readUInt32BE(16) >= 300 && png.readUInt32BE(20) >= 300);
  }
  const others = new Set<string>();
  for (const f of ['V2_MATH_1ST_MANIFEST.csv', 'V2_MATH_2ND_MANIFEST.csv']) for (const r of loadManifest(path.join(ROOT, 'curriculum-assets/jss3/v2-math', f))) others.add(r.asset_key);
  for (const r of rows) assert.ok(!others.has(r.asset_key), r.asset_key);
});
test('source preservation: the guarded row body is exactly the body the existing delivery correction A-MATHEMATICS-2-01 guards; the elimination correction is untouched', () => {
  const guard = readFileSync(path.join(ASSETS, 'M2_ROW_GUARDS.csv'), 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
  assert.deepEqual(guard.map(g => [g[0], g[1]]), [['2nd Term', SOLVING]]);
  const corr: any[] = JSON.parse(readFileSync(path.join(ROOT, 'backend/src/db/data/jss3DeliveryCorrections.json'), 'utf8'));
  const c1 = corr.find(c => c.id === 'A-MATHEMATICS-2-01')!; assert.equal(c1.source_title, SOLVING); assert.equal(c1.source_body_sha256, guard[0][3]);
  const c2 = corr.find(c => c.id === 'A-MATHEMATICS-2-02')!; assert.equal(c2.source_title, 'ELIMINATION METHOD');
  assert.ok(!guard.some(g => g[1] === 'ELIMINATION METHOD'));
});

const havePy = spawnSync('python3', ['--version']).status === 0;
function capture(dir: string, mutate?: (r: any) => void) {
  const g = readFileSync(path.join(ASSETS, 'M2_ROW_GUARDS.csv'), 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
  const rows: any[] = g.map(([term, title, order]) => ({ subjectName: 'Mathematics', className: 'JSS 3', termLabel: term, title, orderIndex: order, weekLabel: 'WEEK 2', sourceReference: `body of ${title}`, filePath: 'x' }));
  rows.push({ subjectName: 'Mathematics', className: 'JSS 3', termLabel: '2nd Term', title: SOLVING, orderIndex: '99', weekLabel: 'SUPPLEMENT SUP-X', sourceReference: 's', filePath: 'x' });
  if (mutate) rows.forEach(mutate);
  const p = path.join(dir, 'cap.json'); writeFileSync(p, JSON.stringify(rows)); return p;
}
const run = (args: string[]) => spawnSync('python3', [BUILD, ...args], { encoding: 'utf8' });
test('regeneration reproduces the committed manifest byte for byte; order_index follows the capture', { skip: !havePy }, () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'm2-')); try {
    assert.equal(run(['--capture', capture(tmp), '--assets', ASSETS, '--out', tmp]).status, 0);
    assert.equal(readFileSync(path.join(tmp, 'M2_SIMULTANEOUS_2ND_MANIFEST.csv'), 'utf8'), readFileSync(MANIFEST, 'utf8'));
    const t2 = path.join(tmp, 'shift'); const cap = capture(tmp, r => { if (r.weekLabel === 'WEEK 2') r.orderIndex = '8'; });
    assert.equal(run(['--capture', cap, '--assets', ASSETS, '--out', t2]).status, 0);
    assert.match(readFileSync(path.join(t2, 'M2_SIMULTANEOUS_2ND_MANIFEST.csv'), 'utf8'), /V2-MATH-M2-F10,[^,]+,[0-9a-f]{64},8,SOLVING OF/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test('rejection: renamed row, missing asset, body drift, duplicate identity, changed byte', { skip: !havePy }, () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'm2-')); try {
    assert.notEqual(run(['--capture', capture(tmp, r => { if (r.title === SOLVING) r.title = 'ELIMINATION METHOD '; }), '--assets', ASSETS, '--out', tmp]).status, 0);
    const part = path.join(tmp, 'a'); cpSync(ASSETS, part, { recursive: true }); rmSync(path.join(part, figs[1].file));
    const miss = run(['--capture', capture(tmp), '--assets', part, '--out', tmp]); assert.notEqual(miss.status, 0); assert.match(miss.stdout, /missing asset/);
    const drift = run(['--capture', capture(tmp, r => { r.sourceReference += ' x'; }), '--assets', ASSETS, '--out', path.join(tmp, 'o'), '--expect-guards', path.join(ASSETS, 'M2_ROW_GUARDS.csv')]);
    assert.notEqual(drift.status, 0);
    const dup = capture(tmp); const arr = JSON.parse(readFileSync(dup, 'utf8')); arr.push({ ...arr[0], orderIndex: '55' }); writeFileSync(dup, JSON.stringify(arr));
    assert.notEqual(run(['--capture', dup, '--assets', ASSETS, '--out', tmp]).status, 0);
    const b = path.join(tmp, 'b'); cpSync(ASSETS, b, { recursive: true }); const p = path.join(b, figs[0].file); const buf = readFileSync(p); buf[buf.length - 20] ^= 0xff; writeFileSync(p, buf);
    assert.throws(() => prepareAssets(loadManifest(path.join(b, 'M2_SIMULTANEOUS_2ND_MANIFEST.csv')), b), /sha256 mismatch/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});

// ---- register ----------------------------------------------------------------------------------------------------------
test('register: M2-O02 is corrected to the real lesson, points at the two assets, and keeps the unresolved strokes open; other V2 items untouched', () => {
  const reg = readFileSync(path.join(ROOT, 'docs/jss3/completion/V2_MATH/VISUAL_REGISTER.csv'), 'utf8');
  const line = reg.split('\n').filter(l => l.startsWith('M2-O02,'));
  assert.equal(line.length, 1); assert.match(line[0], new RegExp(SOLVING)); assert.doesNotMatch(line[0], /\|ELIMINATION METHOD/);
  assert.match(line[0], /V2-MATH-M2-F10/); assert.match(line[0], /V2-MATH-M2-F11/); assert.match(line[0], /OPEN|UNRESOLVED/);
  assert.equal(reg.trim().split('\n').length, 31, 'header + 30 occurrences, unchanged count');
  assert.ok(reg.includes('M1-O04,'), 'M1 rows belong to the M1 task and are not asserted here');
});

// ---- the real source, when supplied -----------------------------------------------------------------------------------
const SRC = process.env.JSS3_M2_SOURCE_DOCX;
test('real source: connector shapes sit in paragraphs 79, 80, 83, 111 (0-based over all w:p) inside the substitution working, before the ELIMINATION METHOD heading', { skip: !SRC || !havePy }, () => {
  const code = `
import sys,zipfile,json
from lxml import etree
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','wp':'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing','a':'http://schemas.openxmlformats.org/drawingml/2006/main','m':'http://schemas.openxmlformats.org/officeDocument/2006/math'}
root=etree.fromstring(zipfile.ZipFile(sys.argv[1]).read('word/document.xml'))
ps=root.xpath('//w:p',namespaces=ns); out={'conn':{}, 'text':{}}
t=lambda p:''.join(p.xpath('.//w:t/text()|.//m:t/text()',namespaces=ns)).strip()
for i,p in enumerate(ps):
    n=len([a for a in p.xpath('.//wp:anchor',namespaces=ns) if a.xpath('.//a:prstGeom[@prst="straightConnector1"]',namespaces=ns)])
    if n and i<200: out['conn'][i]=n
    out['text'][i]=t(p)[:40]
out['elim']=[i for i,p in enumerate(ps) if t(p)=='ELIMINATION METHOD']
print(json.dumps(out))`;
  const r = spawnSync('python3', ['-I', '-c', code, SRC!], { encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr);
  const o = JSON.parse(r.stdout);
  assert.deepEqual(o.conn, { 23: 2, 79: 2, 80: 2, 83: 1, 111: 1 }, 'connectors in the first 200 paragraphs (23 = scheme-of-work mark, M2-O01)');
  assert.equal(o.text['79'], '12 – 5 – 7x = 10'); assert.equal(o.text['111'], '12 – 11n = 0'); assert.equal(o.text['83'], 'Step 5');
  assert.equal(o.elim.length, 1); for (const i of [79, 80, 83, 111]) assert.ok(i < o.elim[0], `${i} precedes the ELIMINATION METHOD heading at ${o.elim[0]}`);
  assert.ok(o.elim[0] > 111);
});
