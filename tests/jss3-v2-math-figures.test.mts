// V2 Mathematics figures: CI-safe tests (no private corpus, no database).
// Numerical/geometry checks recompute every figure's numbers; asset tests prove identity, metadata and regeneration.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const ASSETS = path.join(ROOT, 'curriculum-assets/jss3/v2-math');
const FIG = path.join(ROOT, 'scripts/jss3/v2/v2_math_figures.json');
const BUILD = path.join(ROOT, 'scripts/jss3/v2/build_v2_math_manifests.py');
const figs: any[] = JSON.parse(readFileSync(FIG, 'utf8')).figures;
const F = (id: string) => figs.find(f => f.id === id)!;
const deg = (r: number) => (r * 180) / Math.PI, rad = (d: number) => (d * Math.PI) / 180;
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const close = (a: number, b: number, tol: number, msg?: string) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ''} ${a} vs ${b}`);

// ---- binary ladders -------------------------------------------------------------------------------------------
const readUp = (rows: number[][]) => rows.map(r => r[1]).reverse().join('');
const ladderRows = (n: number) => { const rows: number[][] = []; let q = n; while (q > 0) { rows.push([Math.floor(q / 2), q % 2]); q = Math.floor(q / 2); } return rows; };
test('ladders: complete ladders recompute; (b),(d),(e),(f) are right as printed', () => {
  const L = { ...F('M1-F01').data.ladders, ...F('M1-F02').data.ladders };
  for (const k of ['b', 'd', 'e3', 'e8', 'f121']) {
    const l = L[k]; assert.deepEqual(l.rows, ladderRows(l.n), k); assert.equal(readUp(l.rows), l.printed, k); assert.equal(parseInt(l.printed, 2), l.n, k);
  }
});
test('ladder (a) 8 omits a step; ladder (c) 107 is right but its printed result is a slip', () => {
  const a = F('M1-F01').data.ladders.a;
  assert.notDeepEqual(a.rows, ladderRows(8)); assert.equal(a.rows.length, 3); assert.equal(ladderRows(8).length, 4);
  assert.equal(parseInt(readUp(a.rows), 2), 4, 'as drawn the remainders read 100 = 4');
  assert.equal(readUp(ladderRows(8)), '1000');
  const c = F('M1-F01').data.ladders.c;
  assert.deepEqual(c.rows, ladderRows(107)); assert.equal(readUp(c.rows), '1101011'); assert.equal(parseInt('1101011', 2), 107);
  assert.equal(c.printed, '11010011'); assert.equal(parseInt(c.printed, 2), 211); assert.notEqual(parseInt(c.printed, 2), 107);
  assert.equal(readUp(ladderRows(15)) , '1111'); // 15.125 = 121/8 -> 1111.001
  assert.equal(parseInt('1111001', 2) / parseInt('1000', 2), 15.125);
  assert.equal(parseInt('11', 2) / parseInt('1000', 2), 0.375);
});
test('binary arithmetic: labels swapped in the note; drawn long division is inconsistent with the stated example', () => {
  const d = F('M1-F03').data;
  assert.equal(d.add[0] + d.add[1], d.add[2]); assert.equal(d.sub[0] - d.sub[1], d.sub[2]);
  assert.equal(d.add[2].toString(2), '1000010'); assert.equal(d.sub[2].toString(2), '11100');
  assert.equal(d.mul[0] * d.mul[1], d.mul[2]); assert.equal(d.mul[2].toString(2), '1011011');
  assert.equal(0b1101 + (0b1101 << 1) + (0b1101 << 2), 0b1011011, "shifted partial products");
  assert.equal(d.div[0] / d.div[1], d.div[2]); assert.equal(d.div[2].toString(2), '11101'); assert.equal(d.div[2], 29);
  const drawn = parseInt(d.drawn_dividend, 2); assert.equal(drawn, 73); assert.notEqual(drawn % d.div[1], 0); assert.notEqual(Math.floor(drawn / d.div[1]), 0b111);
});

// ---- statistics --------------------------------------------------------------------------------------------------
test('tally: frequencies recompute from the 30 raw values; only the drawn strokes for 5 calls are wrong', () => {
  const t = F('M1-F04').data; assert.equal(t.raw.length, 30);
  const f: Record<string, number> = {}; for (let k = 4; k <= 10; k++) f[k] = t.raw.filter((v: number) => v === k).length;
  assert.deepEqual(f, t.frequency); assert.equal(Object.values(f).reduce((a, b) => a + b, 0), 30);
  const off = Object.keys(f).filter(k => f[k] !== t.strokes_drawn[k]); assert.deepEqual(off, ['5']);
  assert.equal(t.strokes_drawn['5'], 6); assert.equal(f['5'], 7);
  const mode = Object.entries(f).sort((a, b) => b[1] - a[1])[0][0]; assert.equal(mode, '7');
  close((5 / 30) * 100, 16.667, 0.001); assert.notEqual(Math.round((5 / 30) * 1000) / 10, 16);
});
test('pictogram: key 2 and 1 reproduces the frequency table; chart1 equals it', () => {
  const p = F('M1-F05').data;
  for (const [c, [big, small]] of Object.entries(p.rows) as any) assert.equal(big * p.key.large + small * p.key.small, p.frequency[c], c);
  assert.deepEqual(Object.values(p.frequency), F('M1-F06').data.series.Colour); assert.equal(Object.values(p.frequency).reduce((a: any, b: any) => a + b, 0), 60);
});
test('dual bar chart: plotted girls differ from the school table in four years, boys agree; kept unresolved', () => {
  const d = F('M1-F07').data; assert.deepEqual(d.boys.length, 5);
  const diff = d.categories.filter((_: string, i: number) => d.girls_chart[i] !== d.girls_table[i]); assert.deepEqual(diff, ['1997', '1999', '2000', '2001']);
  assert.match(F('M1-F07').source_status, /ambiguous/); assert.ok(/not corrected|cannot be decided/.test(F('M1-F07').notes));
  assert.equal(d.boys[2] - d.girls_table[2], 7); assert.equal(d.girls_table.indexOf(Math.max(...d.girls_table)), 3);
});
test('pie charts: angles = 360 x share; percentage 46.7 is per cent not degrees; second pie totals 100', () => {
  const e = F('M1-F08').data; const total = Object.values(e.expenditure).reduce((a: any, b: any) => a + b, 0) as number; assert.equal(total, 150);
  const exp = e.expenditure; const byCat: Record<string, number> = { 'building project': exp['Building projects'], maintainance: exp.Maintenance, Miscellaneous: exp.Miscellaneous, 'equipment ': exp.Equipment, 'salaries and wages': exp['Salaries and wages'] };
  e.categories.forEach((c: string, i: number) => assert.equal((byCat[c] / total) * 360, e.values[i], c)); assert.equal(e.values.reduce((a: number, b: number) => a + b, 0), 360);
  close((70 / 150) * 100, 46.667, 0.01); close((70 / 150) * 360, 168, 1e-9);
  const p = F('M1-F09').data; assert.equal(p.values.reduce((a: number, b: number) => a + b, 0), 100); assert.deepEqual(p.values.map((v: number) => v * 3.6), [144, 108, 36, 72]);
});

// ---- trigonometry, elevation/depression, bearings --------------------------------------------------------------
test('trig figures: ladder, tower, cliff, exercise triangles', () => {
  const l = F('M2-F03').data; close(l.hyp * Math.sin(rad(l.angle)), 5, 1e-9);
  const t = F('M2-F04').data; assert.equal(t.opp / t.adj, 0.625); close(deg(Math.atan(0.625)), 32.0, 0.01);
  const c = F('M2-F05').data; close(c.height / Math.tan(rad(c.angle)), 412, 0.2);
  close(55 * Math.tan(rad(35)), 38.5, 0.05);
  const x = F('M2-F02').data; assert.ok(x.a.hyp > x.a.opp && x.b.hyp > x.b.adj, 'hypotenuse is the longest side');
  close(deg(Math.asin(x.a.opp / x.a.hyp)), 24.6, 0.05); close(deg(Math.acos(x.b.adj / x.b.hyp)), 62.2, 0.05);
  assert.equal(F('M2-F01').data.reference_angle, 'B');
});
test('assignment triangle PQR under the stated assumption that S is the foot of the perpendicular', () => {
  const d = F('M2-F06').data; close(deg(Math.atan(d.qs / d.sr)), 35.0, 0.05); const ps = d.qs * Math.tan(rad(d.angle_pqs)); close(ps, 80.8, 0.05); close(ps + d.sr, 280.8, 0.05);
  assert.match(F('M2-F06').notes, /assumption/);
});
test('bearings: compass points, example 2 drawn at 225 not 210, exercise answers', () => {
  assert.deepEqual(F('M2-F07').data.points, ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']);
  close(180 + deg(Math.atan(20 / 30)), 213.7, 0.05); close(18 * Math.tan(rad(65)), 38.6, 0.05);
  assert.match(F('M2-F09').notes, /225/); assert.match(F('M2-F08').source_status, /inconsistent|ambiguous/);
  close(deg(Math.atan(20 / 50)), 21.8, 0.05); close(40 * Math.tan(rad(30)), 23.1, 0.05); close(8 * Math.sin(rad(60)), 6.93, 0.005);
});

// ---- manifests, assets, metadata, regeneration -------------------------------------------------------------------
const manifests = { '1st Term': path.join(ASSETS, 'V2_MATH_1ST_MANIFEST.csv'), '2nd Term': path.join(ASSETS, 'V2_MATH_2ND_MANIFEST.csv') };
test('assets: bytes match sha256, PNG, alt text real, every figure has exactly one manifest row on the right original row title', () => {
  const keys = new Set<string>();
  for (const [term, file] of Object.entries(manifests)) {
    const rows = prepareAssets(loadManifest(file), ASSETS);
    assert.equal(rows.length, 9);
    for (const a of rows) {
      const f = figs.find(x => 'V2-MATH-' + x.id === a.asset_key)!; assert.ok(f, a.asset_key); assert.equal(f.term, term);
      assert.equal(a.mime, 'image/png'); assert.equal(a.expected_title, f.row_title); assert.equal(a.caption, f.caption); assert.equal(a.alt_text, f.alt_text);
      assert.ok(a.alt_text!.length >= 120 && a.alt_text !== a.caption, a.asset_key); assert.equal(a.displayed, true); keys.add(a.asset_key);
      assert.equal(sha(readFileSync(path.join(ASSETS, f.file))), a.sha256);
      const png = readFileSync(path.join(ASSETS, f.file)); const w = png.readUInt32BE(16), h = png.readUInt32BE(20); assert.ok(w >= 150 && h >= 100, `${f.file} ${w}x${h}`);
    }
  }
  assert.equal(keys.size, 18);
  const allOtherKeys = new Set<string>(); // no clash with other committed manifests
  for (const m of ['MUSIC_ASSET_MANIFEST.csv', 'TASK2_BT_ASSET_MANIFEST.csv']) for (const r of loadManifest(path.join(ROOT, 'curriculum-assets/jss3', m))) allOtherKeys.add(r.asset_key);
  for (const k of keys) assert.ok(!allOtherKeys.has(k), k);
});

const py = spawnSync('python3', ['--version']); const havePy = py.status === 0;
function syntheticCapture(dir: string, mutate?: (r: any) => void) {
  const g = readFileSync(path.join(ASSETS, 'V2_MATH_ROW_GUARDS.csv'), 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
  const rows = g.map(([term, title, order]) => ({ subjectName: 'Mathematics', className: 'JSS 3', termLabel: term, title, orderIndex: order, weekLabel: 'WEEK X', sourceReference: `body of ${title}`, filePath: 'x' }));
  rows.push({ subjectName: 'Mathematics', className: 'JSS 3', termLabel: '1st Term', title: 'BINARY NUMBERS', orderIndex: '99', weekLabel: 'SUPPLEMENT SUP-X', sourceReference: 'sup', filePath: 'x' }); // supplements must be ignored
  if (mutate) rows.forEach(mutate);
  const p = path.join(dir, 'cap.json'); writeFileSync(p, JSON.stringify(rows)); return p;
}
const run = (args: string[]) => spawnSync('python3', [BUILD, ...args], { encoding: 'utf8' });
test('regeneration: manifests rebuilt from figures json reproduce the committed CSVs byte for byte (alt text survives)', { skip: !havePy }, () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'v2m-')); try {
    const r = run(['--capture', syntheticCapture(tmp), '--assets', ASSETS, '--out', tmp]); assert.equal(r.status, 0, r.stdout + r.stderr);
    for (const f of ['V2_MATH_1ST_MANIFEST.csv', 'V2_MATH_2ND_MANIFEST.csv']) assert.equal(readFileSync(path.join(tmp, f), 'utf8'), readFileSync(path.join(ASSETS, f), 'utf8'), f);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test('regeneration: order_index is resolved from the capture, never hard-coded (a shifted capture moves the rows)', { skip: !havePy }, () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'v2m-')); try {
    const cap = syntheticCapture(tmp, r => { if (r.weekLabel === 'WEEK X') r.orderIndex = String(Number(r.orderIndex) + 5); });
    assert.equal(run(['--capture', cap, '--assets', ASSETS, '--out', tmp]).status, 0);
    assert.match(readFileSync(path.join(tmp, "V2_MATH_1ST_MANIFEST.csv"), "utf8"), /V2-MATH-M1-F01,v2-m1-binary-ladders-a-c\.png,[0-9a-f]{64},7,BINARY NUMBERS/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test('rejection: a renamed/missing original row, a missing asset, drifted bodies and a wrong chart fail the build', { skip: !havePy }, () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'v2m-')); try {
    const renamed = syntheticCapture(tmp, r => { if (r.title === 'BEARINGS') r.title = 'BEARING'; });
    assert.notEqual(run(['--capture', renamed, '--assets', ASSETS, '--out', tmp]).status, 0);
    const good = syntheticCapture(tmp);
    const partial = path.join(tmp, 'assets'); cpSync(ASSETS, partial, { recursive: true }); rmSync(path.join(partial, 'v2-m2-compass-eight-points.png'));
    const miss = run(['--capture', good, '--assets', partial, '--out', tmp]); assert.notEqual(miss.status, 0); assert.match(miss.stdout, /missing asset/);
    assert.equal(run(['--capture', good, '--assets', ASSETS, '--out', tmp]).status, 0);
    const guards = path.join(tmp, 'V2_MATH_ROW_GUARDS.csv');
    const drift = syntheticCapture(tmp, r => { r.sourceReference += ' edited'; });
    const d = run(['--capture', drift, '--assets', ASSETS, '--out', path.join(tmp, 'o2'), '--expect-guards', guards]); assert.notEqual(d.status, 0); assert.match(d.stdout, /drift/);
    // duplicate original identity is ambiguous
    const dup = syntheticCapture(tmp); const arr = JSON.parse(readFileSync(dup, 'utf8')); arr.push({ ...arr[0], orderIndex: '55' }); writeFileSync(dup, JSON.stringify(arr));
    assert.notEqual(run(['--capture', dup, '--assets', ASSETS, '--out', tmp]).status, 0);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test('rejection (asset bytes): a changed byte fails prepareAssets with a sha256 mismatch', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'v2m-')); try {
    cpSync(ASSETS, tmp, { recursive: true });
    const p = path.join(tmp, 'v2-m1-pictogram-car-colours.png'); const b = readFileSync(p); b[b.length - 20] ^= 0xff; writeFileSync(p, b);
    assert.throws(() => prepareAssets(loadManifest(path.join(tmp, 'V2_MATH_1ST_MANIFEST.csv')), tmp), /sha256 mismatch/);
    rmSync(p); assert.throws(() => prepareAssets(loadManifest(path.join(tmp, 'V2_MATH_1ST_MANIFEST.csv')), tmp), /file not found/);
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
test('register: every figure has a disposition; open items stay explicit', () => {
  const reg = readFileSync(path.join(ROOT, 'docs/jss3/completion/V2_MATH/VISUAL_REGISTER.csv'), 'utf8'); assert.ok(reg.length > 1000);
  for (const f of figs) assert.ok(reg.includes(f.id), f.id);
  assert.match(reg, /UNRESOLVED/); assert.match(reg, /DECORATION/);
});

// ---- newly prepared teaching (declarative additions) ------------------------------------------------------------
test('supplement additions: labelled as new teaching, schema-shaped, numbers match the figures, base hash recorded', () => {
  const p = JSON.parse(readFileSync(path.join(ROOT, 'docs/jss3/completion/V2_MATH/V2_MATH_SUPPLEMENT_ADDITIONS.json'), 'utf8'));
  assert.equal(p.expected_base_sha256, sha(readFileSync(path.join(ROOT, 'backend/src/db/data/jss3Supplements.json'))), 'base file unchanged by this branch');
  const live = JSON.parse(readFileSync(path.join(ROOT, 'backend/src/db/data/jss3Supplements.json'), 'utf8')); for (const e of p.entries) assert.ok(!live.some((x: any) => x.id === e.id), 'not applied here');
  for (const e of p.entries) {
    assert.match(e.id, /^SUP-[A-Z0-9-]+$/); assert.ok(e.body.length >= 500); assert.match(e.body, /practice/i); assert.match(e.body, /answers/i); assert.match(e.origin, /Newly prepared teaching/);
    assert.ok(e.sources.every((s: any) => s.url.startsWith('https://')));
  }
  const [a, b] = p.entries; assert.match(a.body, /1101011/); assert.match(a.body, /11101/); assert.match(a.body, /46\.7 per cent/); assert.match(b.body, /24\.6/); assert.match(b.body, /62\.2/); assert.match(b.body, /280\.8/); assert.match(b.body, /213\.7/);
  assert.match(b.body, /Assumption/);
});
