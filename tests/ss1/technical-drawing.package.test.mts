import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.js';

const packagePath = new URL('../../backend/src/db/ss1/subjects/technical-drawing.json', import.meta.url);
const digest = value => createHash('sha256').update(value, 'utf8').digest('hex');

test('Week One source degree markers survive package delivery and the mobile lesson renderer unchanged', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W01-KEYED-CONSTRUCTIONS');
  assert.ok(lesson, 'Week One keyed-constructions lesson missing');

  // The source's seven superscript-zero angle markers must be normalized as
  // degree symbols before the lesson enters the student package.
  for (const value of ['67°', '105°', '55°', '60°']) {
    assert.ok(lesson.body.includes(value), `normalized degree value missing: ${value}`);
  }
  assert.equal((lesson.body.match(/°/g) ?? []).length >= 7, true);
  assert.doesNotMatch(lesson.body, /\b(?:670|1050|550|600)\b/, 'flattened superscript-zero values must not reach students');

  // The mobile lesson screen passes the package body directly to React Native
  // Text; there is no HTML conversion or lossy degree-glyph replacement step.
  const screen = await readFile(new URL('../../mobile/src/screens/Ss1PackageLessonScreen.tsx', import.meta.url), 'utf8');
  assert.match(screen, /<Text style=\{styles\.body\}>\{lesson\.body\}<\/Text>/);
});

test('Technical Drawing package conforms to the SS1 package schema', async () => {
  const raw = JSON.parse(await readFile(packagePath, 'utf8'));
  const subject = packageSchema.parse(raw);
  assert.equal(subject.subject_slug, 'technical-drawing');
  assert.equal(subject.package_status, 'PENDING');
  assert.ok(subject.lessons.length >= 9);
});

test('Technical Drawing lesson hashes and practice marking are internally consistent', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lessonIds = new Set(subject.lessons.map(lesson => lesson.id));
  assert.equal(lessonIds.size, subject.lessons.length, 'lesson IDs must be unique');

  for (const lesson of subject.lessons) {
    assert.equal(lesson.body_sha256, digest(lesson.body), `stale body hash: ${lesson.id}`);
    assert.ok(lesson.practice.length > 0, `practice missing: ${lesson.id}`);
    const practiceIds = lesson.practice.map(question => question.id);
    assert.equal(new Set(practiceIds).size, practiceIds.length, `duplicate practice IDs: ${lesson.id}`);
    for (const question of lesson.practice) {
      assert.equal(
        question.marks,
        question.marking.reduce((sum, criterion) => sum + criterion.marks, 0),
        `marking total mismatch: ${lesson.id}/${question.id}`
      );
    }
  }
});

test('Week 8–9 and Week 10 scheme objectives are bound to teaching supplements', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const required = [
    'COV-TD-T2-SCH-W07',
    'COV-TD-T2-W07-REDUCTION',
    'COV-TD-T2-SCH-W08',
    'COV-TD-T2-SCH-W09',
    'COV-TD-T2-SCH-W10',
    'COV-TD-T2-W10-TANGENCY',
    'COV-TD-T2-W08-EQUAL-AREA',
    'COV-TD-T2-W09-EQUAL-AREA',
  ];
  for (const id of required) {
    const coverage = subject.coverage.find(entry => entry.id === id);
    assert.ok(coverage, `coverage missing: ${id}`);
    assert.equal(coverage.status, 'SUPPORTED', `coverage not supported: ${id}`);
    assert.ok(coverage.lesson_ids.length > 0, `coverage has no lesson binding: ${id}`);
    for (const lessonId of coverage.lesson_ids) {
      assert.ok(
        lessonIdsHas(subject.lessons, lessonId) || subject.sources.some(source => lessonId.startsWith(`${source.source_id}:BODY:`)),
        `coverage target is not a lesson: ${id} -> ${lessonId}`
      );
    }
  }
});

function lessonIdsHas(lessons, id) {
  return lessons.some(lesson => lesson.id === id);
}

test('Technical Drawing supplemental SVG assets match registered paths, hashes and byte counts', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const assets = subject.assets.filter(asset => asset.id.startsWith('TD-SUP-W08-'));
  assert.equal(assets.length, 4);
  for (const asset of assets) {
    const bytes = await readFile(resolve(process.cwd(), asset.path));
    assert.equal(bytes.byteLength, asset.bytes, `asset byte count mismatch: ${asset.id}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `asset hash mismatch: ${asset.id}`);
    assert.equal(asset.media_type, 'image/svg+xml');
    assert.equal(asset.lesson_id, 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA');
  }
});

test('Technical Drawing Week Ten tangency SVG assets match their registered integrity metadata', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const assets = subject.assets.filter(asset => asset.id.startsWith('TD-SUP-W10-'));
  assert.equal(assets.length, 2);
  for (const asset of assets) {
    const bytes = await readFile(resolve(process.cwd(), asset.path));
    assert.equal(bytes.byteLength, asset.bytes, `asset byte count mismatch: ${asset.id}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `asset hash mismatch: ${asset.id}`);
    assert.equal(asset.media_type, 'image/svg+xml');
    assert.equal(asset.lesson_id, 'SUP-SS1-TECHNICAL-DRAWING-T2-W10-TANGENCY');
  }
});

test('Week Seven reduction supplement distinguishes linear and area ratios', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W07-REDUCTION');
  assert.ok(lesson, 'Week Seven reduction lesson missing');
  assert.match(lesson.body, /area scale factor is k²/);
  assert.match(lesson.body, /√\(3\/5\)/);
  assert.equal(lesson.practice.length, 8);
});

test('Week Seven reduction SVG asset matches registered integrity metadata', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const asset = subject.assets.find(item => item.id === 'TD-SUP-W07-F01');
  assert.ok(asset, 'Week Seven reduction ratio diagram missing');
  const bytes = await readFile(resolve(process.cwd(), asset.path));
  assert.equal(bytes.byteLength, asset.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
  assert.equal(asset.lesson_id, 'SUP-SS1-TECHNICAL-DRAWING-T2-W07-REDUCTION');
});

test('Week Eight–Nine triangle dividers follow the source construction sequences', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA');
  assert.ok(lesson, 'Week Eight–Nine equal-area lesson missing');
  assert.match(lesson.body, /construct a semicircle on the altitude AC and divide AC into n equal parts/);
  assert.match(lesson.body, /Construct a semicircle on DB/);
  assert.match(lesson.body, /Through F draw a line parallel to CD/);
  assert.match(lesson.body, /Bisect AB to locate its midpoint D/);
  assert.match(lesson.body, /Through D draw a line parallel to PC/);
});

test('Week Ten tangency lesson explicitly flags the source two-circle locus typo', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W10-TANGENCY');
  assert.ok(lesson, 'Week Ten tangency lesson missing');
  assert.match(lesson.body, /supplied source repeats R₁\+R for the second locus/);
  assert.match(lesson.body, /geometrically correct second locus is R₁\+r/);
});

test('Technical Drawing resolved source rows and figure inventories are not left as blockers', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const ids = new Set(subject.open_items.map(item => item.id));
  for (const resolved of [
    'TD-T2-FOOTER-TAGLINE',
    'TD-T2-W02-ANSWER-KEYS',
    'TD-T2-W05-ANSWER-KEYS',
    'TD-T2-W04-ANSWER-KEYS',
    'TD-T2-W03-FIGURES',
    'TD-T2-W03-NOTATION',
    'TD-T2-W04-FIGURES',
    'TD-T2-W05-FIGURES',
    'TD-T2-W06-W07-FIGURES',
    'TD-T2-W08-W09-FIGURES',
    'TD-T2-W10-FIGURES',
    'TD-T2-W08-W09-TEACHING-ROW-MAPPING',
    'TD-T2-W10-TEACHING-ROW-MAPPING',
    'TD-T2-W08-W09-EXAMPLE2-DIRECTION',
    'TD-T2-W01-GENERAL-Q2-DATA-IMPOSSIBLE',
    'TD-T2-W01-GENERAL-Q4-SSA-AMBIGUITY'
  ]) assert.equal(ids.has(resolved), false, `resolved item remains open: ${resolved}`);
  assert.equal(subject.open_items.length, 20);
  assert.ok(ids.has('TD-T2-W02-OBJECTIVE-Q2-MULTIPLE-RADII'), 'ambiguous radius MCQ must remain explicitly open');
  assert.ok(ids.has('TD-T2-W03-GENERAL-PENTAGON-DIAGONAL-UNDERDEFINED'), 'underdefined pentagon prompt must remain explicitly open');
});

test('source-backed Week Two to Five answer keys retain verified results and unresolved caveats', async () => {
  const root = new URL('../../docs/ss1/work/microtasks/technical-drawing/', import.meta.url);
  const [w02, w03, w04, w05] = await Promise.all([
    'TD-KEY-W02-ANSWERS.md', 'TD-KEY-W03-ANSWERS.md',
    'TD-KEY-W04-ANSWERS.md', 'TD-KEY-W05-ANSWERS.md'
  ].map(name => readFile(new URL(name, root), 'utf8')));
  assert.match(w02, /109\.96 mm/);
  assert.match(w02, /right-angled/);
  assert.match(w03, /43\.30 mm/);
  assert.match(w04, /60 mm/);
  assert.match(w05, /27° is not a multiple of 5°/);
});

test('Week Two answer key documents the two valid radius options and equal-circle construction', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W02-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /both B \(OB\) and C \(OQ\) are radii/);
  assert.match(key, /accept either B or C for full credit/);
  assert.match(key, /Weekend Q4:.*ambiguous single-answer MCQ/);
  assert.match(key, /15\(√3−1\)≈\*\*10\.98 mm\*\*/);
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  for (const id of ['TD-T2-W02-OBJECTIVE-Q2-MULTIPLE-RADII', 'TD-T2-W02-OBJECTIVE-Q4-MULTIPLE-ANSWERS']) {
    const item = subject.open_items.find(entry => entry.id === id);
    assert.ok(item, `source ambiguity must remain documented: ${id}`);
    assert.equal(item.blocks_delivery, false);
  }
});

test('Week Five source answer key includes the diagram-derived k-minus-n reading', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W05-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /k=3\.0 m/);
  assert.match(key, /n=1\.5 m/);
  assert.match(key, /k−n=1\.5 m/);
});

test('Week Three weekend polygon objective answers match the original source figures', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W03-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /Q1 \/ image31: \*\*D — length of sides\*\*/);
  assert.match(key, /Q2 \/ image32: \*\*B — distance across corners\*\*/);
  assert.match(key, /Q3 \/ image33: \*\*C — regular polygon\*\*/);
  assert.match(key, /Q4 \/ image34: \*\*C\*\*/);
  assert.match(key, /Q5 \/ image35: \*\*C — pentagon\*\*/);
});

test('Week Four answer key includes the source 1:2 drawing dimensions', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W04-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /Overall height 240→\*\*120 mm\*\*/);
  assert.match(key, /base width 180→\*\*90 mm\*\*/);
  assert.match(key, /chamfers 10×45°→\*\*5×45°\*\*/);
});

test('Week Six–Seven answer key covers revision constructions and refuses under-specified source geometry', async () => {
  const root = new URL('../../docs/ss1/work/microtasks/technical-drawing/', import.meta.url);
  const key = await readFile(new URL('TD-KEY-W06-W07-ANSWERS.md', root), 'utf8');
  assert.match(key, /Q1 — irregular pentagon, then area reduction 3:5/);
  assert.match(key, /√\(3\/5\)=0\.7745967/);
  assert.match(key, /Q3 — regular nonagon, chord AC=40 mm/);
  assert.match(key, /Q4 — irregular hexagon and area reduction 3:5/);
  assert.match(key, /one degree of freedom remains/);
  assert.match(key, /Q3 \/ image60: the three irregular hexagons/);
  assert.match(key, /Q1 and Q2 require a higher-fidelity source figure/);
});

test('Technical Drawing answer-key implementation is complete but source-owner decisions remain explicit', async () => {
  const root = new URL('../../docs/ss1/work/microtasks/technical-drawing/', import.meta.url);
  const queue = JSON.parse(await readFile(new URL('QUEUE.json', root), 'utf8'));
  for (const id of ['TD-KEY-W03-ANSWERS', 'TD-KEY-W06-W07-ANSWERS']) {
    const item = queue.items.find(entry => entry.id === id);
    assert.equal(item.status, 'IMPLEMENTED_TESTING_DEFERRED', `${id} must be implemented`);
  }
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  for (const id of [
    'TD-T2-W03-GENERAL-PENTAGON-DIAGONAL-UNDERDEFINED',
    'TD-T2-W06-W07-PENTAGON-FIGURE-UNDERDEFINED',
    'TD-T2-W06-W07-WEEKEND-Q1-Q2-FIGURE-AMBIGUITY'
  ]) assert.ok(subject.open_items.some(item => item.id === id), `source ambiguity not tracked: ${id}`);
});

test('Week Ten source assessment answer key covers figure-backed weekend answers and templates', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W10-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /Weekend Q1 — image100/);
  assert.match(key, /PO=105 mm; QO=102 mm/);
  assert.match(key, /Weekend Q5 — image103/);
  assert.match(key, /Weekend Q6 — image104/);
  assert.match(key, /Evaluation 2 \/ Theory 2 — spanner/);
  assert.match(key, /Ø102→Ø51/);
  assert.match(key, /The rubrics above are original proposed assessment criteria/);
});

test('Week Eight–Nine source pentagon keys do not import dimensions from another week', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W08-W09-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /image64 supplies no CD length/);
  assert.match(key, /image65 provides no numerical AD or BD/);
  assert.match(key, /must not be imported into this question/);
  assert.match(key, /do not report 43\.30 mm as this question's answer/);
});

test('Week Eight–Nine source answer key supplies marks and preserves image/text mismatches', async () => {
  const path = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-KEY-W08-W09-ANSWERS.md', import.meta.url);
  const key = await readFile(path, 'utf8');
  assert.match(key, /Evaluation Q3 — triangle to equal-area parallelogram/);
  assert.match(key, /1,288\.03 mm²/);
  assert.match(key, /Evaluation Q4 — square equal in area to 60 mm × 35 mm rectangle/);
  assert.match(key, /Evaluation Q5 — sum of three equilateral-triangle areas/);
  assert.match(key, /image72 shows a different set of labels/);
  assert.match(key, /image73 is labelled A–G/);
  assert.match(key, /Do not infer the correct multiple-choice option/);
});

test('Week Two missing-arc objective has a dimensioned original replacement', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W02-KEYED-CONSTRUCTIONS');
  assert.ok(lesson, 'Week Two lesson missing');
  const question = lesson.practice.find(item => item.id === 'TD-W02-KEY-Q06');
  assert.ok(question, 'original arc-length replacement exercise missing');
  assert.equal(question.marks, 5);
  assert.equal(question.marks, question.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  assert.match(lesson.body, /four equal 22\.5° sectors/);
  assert.match(lesson.body, /62\.83 mm/);
  const sourceGap = subject.open_items.find(item => item.id === 'TD-T2-W02-ARC-FIGURE-MISSING');
  assert.ok(sourceGap, 'missing original source figure must remain documented');
  assert.equal(sourceGap.blocks_delivery, false, 'original alternative covers the objective');
});

test('Week Five non-multiple chord angles have a precise fixed-radius alternative', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W05-DIAGONAL-CHORDAL-SCALES');
  assert.ok(lesson, 'Week Five scales lesson missing');
  const q = lesson.practice.find(item => item.id === 'TD-W05-KEY-Q06');
  assert.ok(q, 'fine-chord alternative practice missing');
  assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  assert.match(lesson.body, /R=100 mm/);
  assert.match(lesson.body, /41\.58 mm/);
  assert.match(lesson.body, /46\.69 mm/);
  assert.match(lesson.body, /63\.46 mm/);
  for (const id of ['TD-T2-W05-CHORD-ANGLE-GRANULARITY', 'TD-T2-W05-CHORD-CENTRE-LABEL']) {
    const item = subject.open_items.find(entry => entry.id === id);
    assert.ok(item, `source discrepancy missing: ${id}`);
    assert.equal(item.blocks_delivery, false);
  }
});

test('Week Ten unequal-circle internal tangent has a complete construction and keyed practice', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W10-TANGENCY');
  assert.ok(lesson, 'Week Ten tangency lesson missing');
  const q = lesson.practice.find(item => item.id === 'TD-W10-KEY-Q05');
  assert.ok(q, 'unequal-circle internal tangent practice missing');
  assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  assert.match(lesson.body, /auxiliary circle centred at A with radius r₁\+r₂/);
  assert.match(lesson.body, /parallel to BT at perpendicular distance r₂ from B/);
  const source = subject.open_items.find(item => item.id === 'TD-T2-W10-CONSTRUCTION-DETAILS');
  assert.ok(source, 'source construction discrepancy must remain recorded');
  assert.equal(source.blocks_delivery, false);
});

test('Week Eight–Nine has fully dimensioned original pentagon replacements', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA');
  assert.ok(lesson, 'Week Eight–Nine lesson missing');
  for (const id of ['TD-W08-W09-Q07', 'TD-W08-W09-Q08']) {
    const q = lesson.practice.find(item => item.id === id);
    assert.ok(q, `original pentagon replacement missing: ${id}`);
    assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  }
  assert.match(lesson.body, /coordinate-defined irregular pentagon/);
  assert.match(lesson.body, /area = \|13,000−2,000\|\/2 = 5,500 mm²/);
  assert.match(lesson.body, /AE=√\(70²−55²\)/);
});

test('Week Four millimetre unit mismatch has a clear decimetre-reading alternative', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W04-PLAIN-SCALES');
  assert.ok(lesson, 'Week Four plain-scales lesson missing');
  const q = lesson.practice.find(item => item.id === 'TD-W04-KEY-Q03');
  assert.ok(q, 'decimetre-reading replacement exercise missing');
  assert.match(q.question, /read up to 6 m in decimetres/);
  const item = subject.open_items.find(entry => entry.id === 'TD-T2-W04-Q6-UNIT-MISMATCH');
  assert.ok(item, 'original source unit mismatch must remain documented');
  assert.equal(item.blocks_delivery, false);
});

test('Week Four distorted gate source has a fully dimensioned original scale alternative', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W04-PLAIN-SCALES');
  assert.ok(lesson, 'Week Four lesson missing');
  const q = lesson.practice.find(item => item.id === 'TD-W04-KEY-Q09');
  assert.ok(q, 'original gate scale replacement missing');
  assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  assert.match(lesson.body, /overall width 105 mm/);
  assert.match(lesson.body, /13 mm/);
  const source = subject.open_items.find(item => item.id === 'TD-T2-W04-GATE-SCALE-RECONCILIATION');
  assert.ok(source, 'distorted source figure must remain documented');
  assert.equal(source.blocks_delivery, false);
});

test('Week Three under-specified pentagon has an explicit regular-pentagon alternative', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W03-POLYGON-CONSTRUCTIONS');
  assert.ok(lesson, 'Week Three polygon lesson missing');
  const q = lesson.practice.find(item => item.id === 'TD-W03-KEY-Q07');
  assert.ok(q, 'regular-pentagon alternative missing');
  assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  assert.match(lesson.body, /regular-pentagon alternative/);
  assert.match(lesson.body, /43\.26 mm/);
  assert.match(lesson.body, /36\.84 mm/);
  const item = subject.open_items.find(entry => entry.id === 'TD-T2-W03-GENERAL-PENTAGON-DIAGONAL-UNDERDEFINED');
  assert.ok(item, 'source wording ambiguity must remain documented');
  assert.equal(item.blocks_delivery, false);
});

test('Week Six–Seven ambiguous source figures have original replacement exercises', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W07-REDUCTION');
  assert.ok(lesson, 'Week Seven reduction lesson missing');
  for (const id of ['TD-W07-RED-Q06', 'TD-W07-RED-Q07', 'TD-W07-RED-Q08']) {
    const q = lesson.practice.find(item => item.id === id);
    assert.ok(q, `replacement exercise missing: ${id}`);
    assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  }
  assert.match(lesson.body, /Original alternatives for the under-specified Week Six–Seven assessment figures/);
  for (const id of ['TD-T2-W06-W07-PENTAGON-FIGURE-UNDERDEFINED', 'TD-T2-W06-W07-WEEKEND-Q1-Q2-FIGURE-AMBIGUITY']) {
    const item = subject.open_items.find(entry => entry.id === id);
    assert.ok(item, `source ambiguity must remain documented: ${id}`);
    assert.equal(item.blocks_delivery, false);
  }
});

test('Week Ten ambiguous R20 source task has a feasible original external-tangency alternative', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W10-TANGENCY');
  assert.ok(lesson, 'Week Ten tangency lesson missing');
  const q = lesson.practice.find(item => item.id === 'TD-W10-KEY-Q06');
  assert.ok(q, 'R20 alternative practice missing');
  assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
  assert.match(lesson.body, /centres 70 mm apart/);
  assert.match(lesson.body, /5<70<85/);
  const item = subject.open_items.find(entry => entry.id === 'TD-T2-W10-R20-TANGENCY-AMBIGUITY');
  assert.ok(item, 'source ambiguity must remain documented');
  assert.equal(item.blocks_delivery, false);
});


test('Week Eight–Nine mismatched weekend figures have five fully dimensioned original replacements', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA');
  assert.ok(lesson, 'Week Eight–Nine lesson missing');
  const ids = ['TD-W08-W09-Q09', 'TD-W08-W09-Q10', 'TD-W08-W09-Q11', 'TD-W08-W09-Q12', 'TD-W08-W09-Q13'];
  for (const id of ids) {
    const q = lesson.practice.find(item => item.id === id);
    assert.ok(q, `original weekend replacement missing: ${id}`);
    assert.match(q.question, /^Original replacement for an ambiguous weekend figure:/);
    assert.equal(q.marks, 5);
    assert.equal(q.marks, q.marking.reduce((sum, criterion) => sum + criterion.marks, 0));
    assert.ok(q.answer.length > 40, `worked answer missing: ${id}`);
  }
  assert.match(lesson.body, /Original fully dimensioned replacements for the five mismatched weekend assessment figures/);
  const sourceGap = subject.open_items.find(item => item.id === 'TD-T2-W08-W09-ANSWER-KEYS');
  assert.ok(sourceGap, 'source assessment discrepancy must remain recorded');
  assert.equal(sourceGap.blocks_delivery, false, 'original replacement set covers the affected student objectives');
  assert.match(sourceGap.required_action, /Teacher reviews and approves/);
});

test('Week Eight–Nine original replacement numerical keys are internally consistent', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA');
  const expected = new Map([
    ['TD-W08-W09-Q09', /60 mm/],
    ['TD-W08-W09-Q10', /30 mm/],
    ['TD-W08-W09-Q11', /30 mm/],
    ['TD-W08-W09-Q12', /56\.57 mm.*69\.28 mm/s],
    ['TD-W08-W09-Q13', /24 mm/]
  ]);
  for (const [id, pattern] of expected) {
    const q = lesson.practice.find(item => item.id === id);
    assert.ok(q, `replacement missing: ${id}`);
    assert.match(q.answer, pattern, `incorrect keyed result: ${id}`);
  }
});

test('Week Eight–Nine pentagon replacement construction resolves both mirror intersections', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const lesson = subject.lessons.find(item => item.id === 'SUP-SS1-TECHNICAL-DRAWING-T2-W08-W09-EQUAL-AREA');
  const q = lesson.practice.find(item => item.id === 'TD-W08-W09-Q08');
  assert.ok(q);
  assert.match(q.question, /side of BD opposite A/);
  assert.match(q.question, /side of AD opposite B/);
  assert.match(q.answer, /unique convex pentagon/);
  assert.match(lesson.body, /fully dimensioned convex pentagon/);
});


test('Technical Drawing subject alias approval is recorded without implying lesson approval', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const alias = subject.source_rules.find(rule => rule.id === 'SS1-SRC-af4868d2c026-R001');
  assert.ok(alias && alias.op === 'source_alias', 'source subject alias rule missing');
  assert.equal(alias.observed_subject, 'SUBJECT:TECHNICAL DRAWING');
  assert.equal(alias.canonical_subject, 'Technical Drawing');
  assert.match(alias.approval_reference, /^OWNER-APPROVAL-CHAT-2026-11-13:/);
  const openItem = subject.open_items.find(item => item.id === 'TECHNICAL-DRAWING-ALIAS-APPROVAL');
  assert.ok(openItem, 'alias approval provenance record missing');
  assert.equal(openItem.blocks_delivery, false);
  assert.match(openItem.detail, /subject alias\/normalization approval only/);
  assert.equal(subject.package_status, 'PENDING', 'alias approval must not certify the whole package');
  assert.ok(subject.lessons.every(lesson => lesson.state.content_approval === 'PENDING'), 'owner alias approval must not silently approve teaching content');
});
