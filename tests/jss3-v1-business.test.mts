// V1 Business Studies visual recovery: accounting relationships, supplement text, manifests, asset bytes/metadata.
// DB-free and corpus-free unless JSS3_V1_CAPTURE + JSS3_ALL_ROOT are set (then builder identity checks also run).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { loadManifest, prepareAssets } from '../backend/src/db/attachTopicAssets.js';
import { JSS3_SUPPLEMENTS } from '../backend/src/db/jss3Supplements.js';

const dir = 'curriculum-assets/jss3/supplements';
const D = 'docs/jss3/completion/V1_BUSINESS';
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const spec: any[] = JSON.parse(readFileSync(`${D}/V1_ASSET_SPEC.json`, 'utf8'));
const lesson = (id: string) => { const l = JSS3_SUPPLEMENTS.find(x => x.id === id); assert.ok(l, id); return l!; };

// ---- independent accounting model (no reuse of figure/lesson numbers) -----------------------------------------
type Acc = Record<string, number>;
const sum = (o: Acc) => Object.values(o).reduce((a, b) => a + b, 0);

test('Madam Cash: cash book, ledgers and trial balance agree and balance', () => {
  const receipts = { capital: 950, sales1: 7000, sales2: 2000 }, payments = { van: 3200, salary: 400, wages: 200 };
  const cash = sum(receipts) - sum(payments);
  assert.equal(sum(receipts), 9950); assert.equal(cash, 6150); assert.equal(sum(payments) + cash, 9950);
  const dr = { van: 3200, salary: 400, wages: 200, cash }, cr = { capital: 950, sales: 7000 + 2000 };
  assert.equal(sum(dr), 9950); assert.equal(sum(cr), 9950);
});
test('Second-method trial balance: the original omits Building; corrected columns both total 11,000', () => {
  const dr = { building: 2000, equipment: 5000, stock: 1000, van: 3000 }, cr = { capital: 2000, creditor: 7000, accrued: 2000 };
  assert.equal(sum(cr), 11000); assert.equal(sum(dr), 11000);
  const { building, ...withoutBuilding } = dr; assert.equal(building, 2000); assert.equal(sum(withoutBuilding), 9000);
  assert.notEqual(sum(withoutBuilding), sum(cr));
});
test('Papaluwe exercise answer: cash balance and mirrored entries', () => {
  const dr = 15000 + 5000, cr = 3000 + 1000 + 500; assert.equal(dr - cr, 15500);
  assert.equal(cr + 15500, dr);
});
test('babasuwe trading and profit-and-loss answer and the new practice answer', () => {
  const tp = (s: number, os: number, p: number, ro: number, ri: number, cs: number, exp: number, dr: number) => {
    const net = s - ri, avail = os + p - ro, cogs = avail - cs, gp = net - cogs, income = gp + dr, np = income - exp;
    return { net, avail, cogs, gp, income, np };
  };
  assert.deepEqual(tp(10000, 2000, 2000, 100, 150, 1000, 500 + 600 + 300 + 200, 400), { net: 9850, avail: 3900, cogs: 2900, gp: 6950, income: 7350, np: 5750 });
  assert.deepEqual(tp(8000, 1000, 3000, 200, 300, 800, 400, 100), { net: 7700, avail: 3800, cogs: 3000, gp: 4700, income: 4800, np: 4400 });
  // trading account balances: cogs + gp = net sales; P&L: expenses + np = income
  assert.equal(2900 + 6950, 9850); assert.equal(1600 + 5750, 7350);
});
test('Tunde practice answer balances (new teaching)', () => {
  const cash = 10000 + 6000 - 3000 - 1000; assert.equal(cash, 12000);
  assert.equal(3000 + 1000 + cash, 10000 + 6000);
});

test('supplement bodies state the same numbers the figures show', () => {
  const led = lesson('SUP-BUS-LEDGER-ANSWERS').body, tb = lesson('SUP-BUS-TRIALBAL-PRACTICE').body, tp = lesson('SUP-BUS-TRADING-PL-ANSWER').body, ps = lesson('SUP-BUS-PAPER-SIZES').body;
  for (const n of ['15,500', '20,000', 'Felele']) assert.ok(led.includes(n), n);
  for (const n of ['9,950', '6,150', '11,000', 'Building', '16,000', '12,000']) assert.ok(tb.includes(n), n);
  for (const n of ['9,850', '3,900', '2,900', '6,950', '1,600', '7,350', '5,750', '4,400']) assert.ok(tp.includes(n), n);
  assert.match(ps, /219mm/); assert.match(ps, /210 x 297/);
  assert.match(led, /cannot be recovered/); assert.match(tb, /cannot be recovered/);
  for (const id of ['SUP-BUS-LEDGER-ANSWERS', 'SUP-BUS-TRIALBAL-PRACTICE', 'SUP-BUS-TRADING-PL-ANSWER', 'SUP-BUS-PAPER-SIZES'])
    assert.match(lesson(id).origin, /Newly prepared/);
});

// ---- manifests / assets ----------------------------------------------------------------------------------------
const manifests = ['V1_BUSINESS_1ST_MANIFEST.csv', 'V1_BUSINESS_2ND_MANIFEST.csv'];
test('V1 manifests: 19 assets, bytes match sha256, expected titles equal their lesson, metadata complete', () => {
  const prepared = manifests.flatMap(f => prepareAssets(loadManifest(`${dir}/${f}`), dir));
  assert.equal(prepared.length, 19); assert.equal(new Set(prepared.map(a => a.asset_key)).size, 19);
  assert.deepEqual(prepared.map(a => a.asset_key).sort(), spec.map(s => s.asset_key).sort());
  const pinnedTitles = new Map<string, string>();
  for (const s of spec) pinnedTitles.set(s.asset_key, s.target.kind === 'original' ? s.target.title : lesson(s.target.lesson_id).title);
  for (const a of prepared) {
    assert.equal(a.expected_title, pinnedTitles.get(a.asset_key), a.asset_key);
    assert.ok(['image/png', 'image/jpeg'].includes(a.mime), a.asset_key);
    assert.ok(a.caption && a.caption.length > 40, `${a.asset_key} caption`);
    assert.ok(a.alt_text && a.alt_text.length >= 60 && a.alt_text !== a.caption, `${a.asset_key} alt text is a real description`);
    assert.equal(a.displayed, true); assert.equal(sha(a.bytes), a.sha256);
  }
  assert.equal(prepared.filter(a => a.mime === 'image/jpeg').length, 2);
});
test('V1 assets: orders within a lesson are 1..n and supplement targets are the right term', () => {
  for (const f of manifests) {
    const rows = loadManifest(`${dir}/${f}`); const by = new Map<number, number[]>();
    for (const r of rows) by.set(r.order_index, [...(by.get(r.order_index) ?? []), r.sort_order]);
    for (const [, orders] of by) assert.deepEqual(orders, orders.map((_, i) => i + 1));
  }
  for (const s of spec.filter(s => s.target.kind === 'supplement')) assert.equal(lesson(s.target.lesson_id).termLabel, s.target.term);
});
test('V1 keys never clash with any other manifest key; earlier art is untouched', () => {
  const others = readdirSync(dir).filter(f => f.endsWith('_MANIFEST.csv') && !manifests.includes(f));
  const taken = new Set(others.flatMap(f => loadManifest(`${dir}/${f}`).map(r => `${f}|${r.asset_key}`).map(x => x.split('|')[1])));
  for (const s of spec) assert.ok(!taken.has(s.asset_key), s.asset_key);
});
test('tampered asset bytes are rejected before any database work', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'v1-'));
  const rows = loadManifest(`${dir}/${manifests[0]}`);
  for (const r of rows) copyFileSync(`${dir}/${r.file}`, path.join(tmp, r.file));
  const f = path.join(tmp, rows[0].file); writeFileSync(f, Buffer.concat([readFileSync(f), Buffer.from([0])]));
  assert.throws(() => prepareAssets(rows, tmp), /sha|hash|mismatch/i);
});
test('missing asset file is rejected', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'v1-'));
  assert.throws(() => prepareAssets(loadManifest(`${dir}/${manifests[1]}`), tmp));
});

test('shorthand chart preserved: same key, bytes, caption; alt text now present and descriptive', () => {
  const [a] = prepareAssets(loadManifest(`${dir}/BATCH2_BUSINESS_2ND_MANIFEST.csv`), dir);
  assert.equal(a.asset_key, 'SUP-BUS-SHORTHAND-shorthand-compounds');
  assert.equal(a.sha256, '94cb57599c0d9c43dd62e229c2bbfa862c6f789d6c1a77791f22725eecee1711');
  assert.match(a.caption!, /KW, GW, MP\/MB, LR, RR and WH/);
  const pinned = JSON.parse(readFileSync(`${D}/SHORTHAND_ALT_TEXT.json`, 'utf8'));
  assert.equal(a.alt_text, pinned.alt_text); assert.ok(a.alt_text!.length >= 120); assert.match(a.alt_text!, /KW.*GW.*MP\/MB.*LR.*RR.*WH/s);
});

test('alt text survives regeneration: the spec is the source of alt text and matches the manifests', () => {
  const byKey = new Map(manifests.flatMap(f => loadManifest(`${dir}/${f}`)).map(r => [r.asset_key, r]));
  for (const s of spec) { const r = byKey.get(s.asset_key)!; assert.equal(r.alt_text, s.alt_text); assert.equal(r.caption, s.caption); }
});

test('figure generator reproduces the committed PNG/SVG bytes (skipped without python cairosvg)', t => {
  const probe = spawnSync('python3', ['-c', 'import cairosvg'], { encoding: 'utf8' });
  if (probe.status !== 0) {
    if (process.env.JSS3_REQUIRE_VISUAL_DEPS === '1') assert.equal(probe.status, 0, probe.stderr);
    if (/No module named 'cairosvg'/.test(probe.stderr || '')) return t.skip('CairoSVG not installed');
    assert.equal(probe.status, 0, probe.stderr || probe.error?.message);
  }
  const tmp = mkdtempSync(path.join(tmpdir(), 'v1fig-'));
  const r = spawnSync('python3', [`${D}/assets/generate_v1_figures.py`, tmp], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr || r.error?.message);
  for (const f of readdirSync(tmp).filter(f => f.endsWith('.svg'))) assert.equal(readFileSync(path.join(tmp, f), 'utf8'), readFileSync(`${D}/assets/${f}`, 'utf8'), f);
});

// ---- identity resolution against the real capture (needs the private source corpus) ---------------------------
const CAP = process.env.JSS3_V1_CAPTURE, ALL = process.env.JSS3_ALL_ROOT;
if (!CAP || !ALL) test('V1 builder identity checks (skipped: set JSS3_V1_CAPTURE and JSS3_ALL_ROOT)', { skip: true }, () => {});
else {
  const build = (capture: string) => spawnSync('python3', [`${D}/build_v1_manifests.py`, '--capture', capture, '--all-root', ALL], { encoding: 'utf8' });
  test('builder resolves every asset to exactly one row and the bindings file matches the capture', () => {
    const cap: any[] = JSON.parse(readFileSync(CAP, 'utf8'));
    const lines = readFileSync(`${D}/V1_ASSET_BINDINGS.csv`, 'utf8').trim().split('\n').slice(1);
    assert.equal(lines.length, 19);
    for (const s of spec) {
      const t = s.target; const rows = cap.filter(r => r.subjectName === 'Business Studies' && r.termLabel === t.term &&
        (t.kind === 'original' ? !r.weekLabel.includes('SUPPLEMENT') && r.title === t.title && sha(Buffer.from(r.sourceReference)) === t.body_sha256 : r.weekLabel === 'SUPPLEMENT ' + t.lesson_id));
      assert.equal(rows.length, 1, s.asset_key);
      const m = manifests.flatMap(f => loadManifest(`${dir}/${f}`)).find(x => x.asset_key === s.asset_key)!;
      assert.equal(m.order_index, rows[0].orderIndex, s.asset_key);
    }
  });
  test('builder rejects a wrong body hash, a retitled lesson and a missing lesson', () => {
    const cap: any[] = JSON.parse(readFileSync(CAP, 'utf8')); const tmp = mkdtempSync(path.join(tmpdir(), 'v1cap-'));
    const run = (mut: (c: any[]) => any[]) => { const f = path.join(tmp, 'c.json'); writeFileSync(f, JSON.stringify(mut(structuredClone(cap)))); return build(f); };
    assert.notEqual(run(c => { c.find(r => r.title === 'TRIAL BALANCE').sourceReference += ' '; return c; }).status, 0);
    assert.notEqual(run(c => { c.find(r => r.title === 'DOUBLE ENTRY BOOK KEEPING').title = 'DOUBLE ENTRY'; return c; }).status, 0);
    assert.notEqual(run(c => c.filter(r => r.weekLabel !== 'SUPPLEMENT SUP-BUS-TRADING-PL-ANSWER')).status, 0);
    assert.equal(build(CAP).status, 0);
  });
}
