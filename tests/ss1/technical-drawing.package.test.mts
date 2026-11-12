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
  assert.ok(subject.lessons.length >= 8);
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
    'COV-TD-T2-SCH-W08',
    'COV-TD-T2-SCH-W09',
    'COV-TD-T2-W08-EQUAL-AREA',
    'COV-TD-T2-W09-EQUAL-AREA',
    'COV-TD-T2-W10-TANGENCY-SUPPLEMENT'
  ];
  for (const id of required) {
    const coverage = subject.coverage.find(entry => entry.id === id);
    assert.ok(coverage, `coverage missing: ${id}`);
    assert.equal(coverage.status, 'SUPPORTED', `coverage not supported: ${id}`);
    assert.ok(coverage.lesson_ids.length > 0, `coverage has no lesson binding: ${id}`);
    for (const lessonId of coverage.lesson_ids) {
      assert.ok(
        lessonIdsHas(subject.lessons, lessonId),
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
