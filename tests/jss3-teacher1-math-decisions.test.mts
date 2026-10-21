// TEACHER1: three open JSS 3 Mathematics source ambiguities (decision sheet D1) settled by OWNER-DIRECTED INTERIM decisions
// of 21 October 2026. They are NOT teacher answers and must never be recorded as such. The decisions:
//   1. girls' admissions follow the school TABLE (46, 55, 73, 92, 64), not the embedded chart;
//   2. point S in the assignment triangle PQR is the foot of the vertical from Q;
//   3. bearing example 1 follows the DRAWING (A due north, B due east of the corner O).
// Every changed number is recomputed here by a route different from the lesson text. CI-safe tests need no private
// corpus. The real-source test needs JSS3_ALL_ROOT (set by verify_handoff.py/run_acceptance.py): an explicit skip
// without it is NOT a pass of the source check.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import { createDeliveryResolver, deliveryHash, type DeliveryCorrection, type DeliveryLesson } from '../backend/src/utils/jss3DeliveryCorrection.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = (p: string) => readFileSync(path.join(ROOT, p), 'utf8');
const lessons: any[] = JSON.parse(read('backend/src/db/data/jss3Supplements.json'));
const corrections: any[] = JSON.parse(read('backend/src/db/data/jss3DeliveryCorrections.json'));
const figs: any[] = JSON.parse(read('scripts/jss3/v2/v2_math_figures.json')).figures;
const L1 = lessons.find(l => l.id === 'SUP-MATH-V2-FIGURES-1');
const L2 = lessons.find(l => l.id === 'SUP-MATH-V2-FIGURES-2');
const F = (id: string) => figs.find(f => f.id === id)!;
const deg = (r: number) => (r * 180) / Math.PI;
const close = (a: number, b: number, tol: number, msg = '') => assert.ok(Math.abs(a - b) <= tol, `${msg} ${a} vs ${b}`);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

// ---- item 1: girls' admissions follow the table ---------------------------------------------------------------
// Source table, paragraphs 512-516 of the First-Term note, typed here from the original (not read from the figures json).
const years = [1997, 1998, 1999, 2000, 2001], boys = [65, 50, 80, 70, 45], girlsTable = [46, 55, 73, 92, 64], girlsChart = [45, 55, 75, 90, 65];
test('item 1: the figures json holds the source table and the printed chart, which differ in exactly four years', () => {
  const d = F('M1-F07').data;
  assert.deepEqual(d.boys, boys); assert.deepEqual(d.girls_table, girlsTable); assert.deepEqual(d.girls_chart, girlsChart);
  assert.deepEqual(years.filter((_, i) => girlsTable[i] !== girlsChart[i]), [1997, 1999, 2000, 2001]);
});
test('item 1: the lesson answers every question in the note from the TABLE values (recomputed independently)', () => {
  const hi = years[girlsTable.indexOf(Math.max(...girlsTable))], lo = years[boys.indexOf(Math.min(...boys))];
  const d1999 = boys[2] - girlsTable[2]; const tot = (y: number, g: number[]) => boys[years.indexOf(y)] + g[years.indexOf(y)];
  const more = tot(2000, girlsTable) - tot(1998, girlsTable);
  assert.deepEqual([hi, lo, d1999, more], [2000, 2001, 7, 57]);
  const b: string = L1.body;
  assert.match(b, /the year girls had the highest admission is 2000 \(92\)/);
  assert.match(b, /the year boys had the least admission is 2001 \(45\)/);
  assert.match(b, /in 1999 boys had 80 - 73 = 7 more admissions than girls/);
  assert.match(b, /\(70 \+ 92\) - \(50 \+ 55\) = 162 - 105 = 57 more candidates than in 1998/);
  assert.equal(tot(2000, girlsTable), 162); assert.equal(tot(1998, girlsTable), 105);
  // The printed chart would give different answers for the last two; the lesson says so and does not use them.
  assert.equal(boys[2] - girlsChart[2], 5); assert.equal(tot(2000, girlsChart) - tot(1998, girlsChart), 55);
  assert.match(b, /Reading the printed chart instead would give 5 and 55 for the last two; those are not used/);
  assert.match(b, /the table is correct, so the solution here is drawn from the table values/);
  assert.match(b, /The chart in the notes is shown as printed and is not edited/);
});
test('item 1: the figure caption and alt text say the chart is as printed and the answers follow the table; no corrected chart was invented', () => {
  const f = F('M1-F07');
  assert.match(f.caption, /as printed/); assert.match(f.caption, /follow the table/);
  assert.match(f.alt_text, /45, 55, 75, 90, 65/); assert.match(f.alt_text, /46, 55, 73, 92, 64/);
  assert.match(f.notes, /No corrected chart image was drawn/);
});

// ---- item 2: S is the foot of the vertical ---------------------------------------------------------------------
test('item 2: angle QRS and PR recomputed by the sine rule (the lesson derives them with tangents)', () => {
  const d = F('M2-F06').data; assert.deepEqual([d.qs, d.sr, d.angle_pqs], [140, 200, 30]);
  const qr = Math.hypot(d.qs, d.sr);                       // right angle at S
  const R = deg(Math.asin(d.qs / qr)); close(R, 35.0, 0.05); close(R, deg(Math.acos(d.sr / qr)), 1e-9, 'sin and cos routes agree');
  const SQR = 90 - R, PQR = d.angle_pqs + SQR, P = 90 - d.angle_pqs;
  close(R + PQR + P, 180, 1e-9, 'angles of triangle PQR');
  close(qr, 244.1, 0.05); close(SQR, 55.0, 0.05); close(PQR, 85.0, 0.05);
  const pr = (qr * Math.sin((PQR * Math.PI) / 180)) / Math.sin((P * Math.PI) / 180); close(pr, 280.8, 0.05);
  const b: string = L2.body;
  for (const t of ['angle QRS = 35.0 degrees', 'PR = 80.8 + 200 = 280.8 cm', '244.1 cm', 'angle SQR = 90 - 35.0 = 55.0 degrees', 'angle PQR = 30 + 55.0 = 85.0 degrees', 'angle P = 90 - 30 = 60 degrees', 'PR = 244.1 x sin 85.0 / sin 60 = 280.8 cm']) assert.ok(b.includes(t), t);
  assert.ok(200 > 140, 'the 140 cm line cannot be the slant QR: SR = 200 cm would exceed the hypotenuse');
  assert.match(b, /the 140 cm line cannot be the slant side QR when SR is 200 cm/);
  assert.match(b, /S is the foot of the perpendicular from Q, where the right-angle mark is/);
  assert.match(b, /Assumption, stated plainly/); assert.match(b, /A different position for S would give different answers/);
});

// ---- item 3: bearing example 1 follows the drawing -------------------------------------------------------------
const bearing = (from: [number, number], to: [number, number]) => { const b = deg(Math.atan2(to[0] - from[0], to[1] - from[1])); return Math.round(((b % 360) + 360) % 360 * 1e6) / 1e6; };
test('item 3: bearings read from the drawing by coordinates; A from B is not a single number and is 315 only when OA = OB', () => {
  const O: [number, number] = [0, 0];
  for (const [oa, ob] of [[10, 10], [10, 20], [20, 10], [3, 7]] as const) {
    const A: [number, number] = [0, oa], B: [number, number] = [ob, 0];
    assert.equal(bearing(O, B), 90); assert.equal(bearing(O, A), 0); assert.equal(bearing(B, O), 270); assert.equal(bearing(A, O), 180);
    const ab = bearing(B, A); assert.ok(ab > 270 && ab < 360, `A from B is north-west: ${ab}`);
    assert.equal(ab === 315, oa === ob, 'exactly 315 only when OA = OB');
  }
  const b: string = L2.body;
  assert.match(b, /the bearing of B from O is 090 degrees and the bearing of A from O is 000 degrees/);
  assert.match(b, /O from B is 270 degrees and O from A is 180 degrees/);
  assert.match(b, /cannot be given as one number without the distances OA and OB/);
  assert.match(b, /exactly 315 degrees only when OA = OB/);
  assert.match(b, /does not match the drawing and is not used/);
  assert.match(b, /5\. 090, 000, 270 and 180 degrees/);
  assert.doesNotMatch(b, /A from B is 315|bearing of A from B is 315/, 'the exact-315 figure must not be inferred from the sketch');
  assert.match(b, /In example 2 the arrow to P is drawn at 225 degrees although the label says 210 degrees/, 'example 2 is a separate item and is unchanged');
});

// ---- provenance: owner-directed, never a teacher answer ---------------------------------------------------------------
test('provenance: lessons, figures and the decision sheet record OWNER-DIRECTED interim decisions, not teacher answers', () => {
  for (const l of [L1, L2]) { assert.match(l.origin, /^Newly prepared teaching/); assert.match(l.origin, /owner-directed interim decision/); assert.match(l.origin, /not teacher-certified/); assert.match(l.origin, /21 October 2026/); }
  for (const l of [L1, L2]) assert.match(l.body, /owner-directed interim decision by the app owner; not yet confirmed by the school's Mathematics teacher/);
  for (const id of ['M1-F07', 'M2-F06', 'M2-F08']) {
    const d = F(id).decision;
    assert.deepEqual([d.status, d.date, d.teacher_certified], ['owner_directed_interim', '2026-10-21', false], id);
    assert.match(d.decided_by, /not the school's Mathematics teacher/); assert.ok(['SUP-MATH-V2-FIGURES-1', 'SUP-MATH-V2-FIGURES-2'].includes(d.applied_in));
    assert.match(F(id).notes, /not teacher-certified/);
  }
  assert.equal(F('M1-F07').decision.applied_in, 'SUP-MATH-V2-FIGURES-1'); assert.equal(F('M2-F06').decision.applied_in, 'SUP-MATH-V2-FIGURES-2'); assert.equal(F('M2-F08').decision.applied_in, 'SUP-MATH-V2-FIGURES-2');
  const reg = read('docs/jss3/completion/V2_MATH/VISUAL_REGISTER.csv');
  assert.equal((reg.match(/OWNER-DIRECTED INTERIM DECISION 2026-10-21 \(not teacher-certified\); teacher confirmation outstanding/g) ?? []).length, 3);
  const sheet = read('docs/jss3/completion/D1_TEACHER_DECISIONS/DECISION_SHEET.md');
  assert.doesNotMatch(sheet, /\[[xX✓]\]/, 'no teacher box may be ticked by an agent');
  assert.equal((sheet.match(/Tick one: \[ \]/g) ?? []).length, 3, 'the three teacher tick lines stay blank');
  assert.match(sheet, /Owner-directed interim decisions/); assert.match(sheet, /no teacher answer is recorded/i);
});

// ---- assets and original rows are untouched ---------------------------------------------------------------------
test('assets: the three figure PNG bytes are unchanged (hashes pinned from the base commit) and still match the manifests', () => {
  const pinned: Record<string, string> = {
    'V2-MATH-M1-F07': 'f66ec76f2dd24a7eaec29e5e6b84d30685d4c3b7372add0e563c9f46284b02e8',
    'V2-MATH-M2-F06': '8b5228878a78a2118c7c5b9aa2d305d63a9f4455a1cf34639615a4f2f695e103',
    'V2-MATH-M2-F08': 'e6ead27b953c603e1f8eb54c4c737cf6fdbb34828b1047c345ee497ba675858f',
  };
  const rows = ['V2_MATH_1ST_MANIFEST.csv', 'V2_MATH_2ND_MANIFEST.csv'].flatMap(f => read(`curriculum-assets/jss3/v2-math/${f}`).trim().split('\n').slice(1));
  for (const [key, hash] of Object.entries(pinned)) {
    const row = rows.find(r => r.startsWith(key + ','))!; assert.ok(row, key); assert.ok(row.includes(',' + hash + ','), `${key} manifest hash`);
    const f = figs.find(x => 'V2-MATH-' + x.id === key)!; assert.equal(sha(readFileSync(path.join(ROOT, 'curriculum-assets/jss3/v2-math', f.file))), hash, `${key} bytes`);
  }
});

// ---- runtime delivery still serves the updated lessons ------------------------------------------------------------
test('delivery: the original-topic corrections for the three topics still include the updated lessons, and editing them retires cached assessments', () => {
  const want: Array<[string, string]> = [['EVERYDAY STATISTICS', 'SUP-MATH-V2-FIGURES-1'], ['APPLICATION OF TRIGONOMETRIC RATIOS', 'SUP-MATH-V2-FIGURES-2'], ['BEARINGS', 'SUP-MATH-V2-FIGURES-2']];
  const real = want.map(([title, id]) => { const c = corrections.filter(x => x.subject_name === 'Mathematics' && x.class_name === 'JSS 3' && x.source_title === title && x.replacement_lesson_ids.includes(id)); assert.equal(c.length, 1, title); return c[0]; });
  const standIn = 'stand-in for the audited original';
  const make = (ls: any[]) => createDeliveryResolver(real.map(c => ({ ...c, source_body_sha256: deliveryHash(`${standIn} ${c.id}`) })) as DeliveryCorrection[], ls as DeliveryLesson[]);
  const resolve = (r: ReturnType<typeof make>, c: any) => r({ school_code: c.school_code, class_name: c.class_name, subject_name: 'Mathematics', term_label: c.term_label, title: c.source_title, source_reference: `${standIn} ${c.id}` });
  const now = make(lessons);
  for (const c of real) {
    const out = resolve(now, c); assert.equal(out?.kind, 'corrected', c.source_title); if (out?.kind !== 'corrected') continue;
    const id = c.replacement_lesson_ids.find((x: string) => x.startsWith('SUP-MATH-V2-FIGURES'))!; const lesson = lessons.find(l => l.id === id);
    assert.ok(out.text.includes(lesson.body), `${c.source_title}: learner text must contain the whole current ${id} body`);
    const edited = make(lessons.map(l => (l.id === id ? { ...l, body: `${l.body} ` } : l))); const after = resolve(edited, c);
    assert.ok(after?.kind === 'corrected' && after.fingerprint !== out.fingerprint, `${c.source_title}: editing ${id} must change the fingerprint`);
  }
  assert.ok(resolve(now, real[0])!.kind === 'corrected' && (resolve(now, real[0]) as any).text.includes('2000 (92)'));
  assert.ok((resolve(now, real[2]) as any).text.includes('O from B is 270 degrees'));
});

// ---- real source -------------------------------------------------------------------------------------------------
const root = process.env.JSS3_ALL_ROOT;
test('REAL SOURCE: the original notes still show what the decisions rely on (table values, no definition of S, the printed bearing sentence)', { skip: root ? false : 'JSS3_ALL_ROOT not set: source check NOT run' }, () => {
  const script = `
import sys,json,zipfile,re
from lxml import etree
W='http://schemas.openxmlformats.org/wordprocessingml/2006/main'
def paras(path):
    return [''.join(t.text or '' for t in p.iter('{%s}t'%W)) for p in etree.fromstring(zipfile.ZipFile(path).read('word/document.xml')).iter('{%s}p'%W)]
a=paras(sys.argv[1]); b=paras(sys.argv[2])
i=next(k for k,t in enumerate(a) if t.startswith('The following table shows the number of candidates who gained admission'))
table=a[i+1:i+7]
q=next(k for k,t in enumerate(b) if t.strip()=='Calculate angle QRS')
s_label=[t for t in b[max(0,q-25):q+2] if re.search(r'(?<![A-Za-z])S(?![A-Za-z])',t)]
bear=[t for t in b if 'The bearing of point A from B is 090' in t]
print(json.dumps(dict(table=table,q_index=q,s_label=s_label,bear=len(bear),pr_next=b[q+1].strip())))`;
  const r = spawnSync('python3', ['-I', '-c', script, path.join(root!, 'JSS3 1ST TERM ', 'JSS 3 MATHEMATICS.docx'), path.join(root!, 'JSS3 2ND TERM ', 'BASIC 9 MATHEMATICS E-NOTE.docx')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr); const s = JSON.parse(r.stdout);
  assert.deepEqual(s.table, ['YearBoysGirls', '19976546', '19985055', '19998073', '20007092', '20014564'], 'source table: girls 46, 55, 73, 92, 64');
  assert.deepEqual(s.s_label, [], 'no paragraph near the assignment figure defines or labels a point S');
  assert.equal(s.pr_next, 'PR'); assert.equal(s.bear, 1, 'the printed bearing sentence is present exactly once');
});
