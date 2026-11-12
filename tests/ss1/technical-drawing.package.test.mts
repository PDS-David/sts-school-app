import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.js';

const packagePath = new URL('../../backend/src/db/ss1/subjects/technical-drawing.json', import.meta.url);
const digest = value => createHash('sha256').update(value, 'utf8').digest('hex');

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
  assert.equal(lesson.practice.length, 5);
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
  assert.equal(subject.open_items.length, 19);
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
