import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.js';

const packagePath = new URL('../../backend/src/db/ss1/subjects/technical-drawing.json', import.meta.url);
const queuePath = new URL('../../docs/ss1/work/microtasks/technical-drawing/QUEUE.json', import.meta.url);
const manifestPath = new URL('../../docs/ss1/work/microtasks/technical-drawing/TD-SOURCE-ASSET-MANIFEST.json', import.meta.url);

test('all 104 Technical Drawing source figure tasks are materialized and integrity-checked', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const sourceAssets = subject.assets.filter(asset => asset.id.startsWith('TD-ASSET-'));
  assert.equal(sourceAssets.length, 104);
  assert.equal(new Set(sourceAssets.map(asset => asset.id)).size, 104);
  assert.equal(new Set(sourceAssets.map(asset => `${asset.lesson_id}:${asset.order}`)).size, 104);

  for (const asset of sourceAssets) {
    assert.ok(asset.path.startsWith('backend/src/db/ss1/assets/technical-drawing/source/'));
    assert.ok(subject.lessons.some(lesson => lesson.id === asset.lesson_id));
    const bytes = await readFile(resolve(process.cwd(), asset.path));
    assert.equal(bytes.byteLength, asset.bytes, `byte count mismatch: ${asset.id}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256, `SHA-256 mismatch: ${asset.id}`);
    assert.ok(['image/png', 'image/jpeg'].includes(asset.media_type));
    assert.equal(asset.state.implementation, 'IMPLEMENTED');
    assert.equal(asset.state.verification, 'DEFERRED');
    assert.equal(asset.state.content_approval, 'PENDING');
    assert.equal(asset.provenance.reuse_status, 'PENDING');
  }
});

test('source-figure queue and manifest account for all 104 tasks and the two approved reuse mappings', async () => {
  const queue = JSON.parse(await readFile(queuePath, 'utf8'));
  const tasks = queue.items.filter(item => item.id.startsWith('TD-ASSET-'));
  assert.equal(tasks.length, 104);
  assert.ok(tasks.every(task => task.status === 'IMPLEMENTED_TESTING_DEFERRED'));

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  assert.equal(manifest.source_figure_tasks, 104);
  assert.equal(manifest.registered_asset_bindings, 104);
  assert.equal(manifest.unique_output_files, 102);
  assert.equal(manifest.wmf_conversions, 16);
  assert.equal(manifest.cross_row_reuses, 2);
  assert.equal(manifest.assets.length, 104);

  const byId = new Map(manifest.assets.map(asset => [asset.task_id, asset]));
  for (const id of ['TD-ASSET-W06-W07-F12', 'TD-ASSET-W08-W09-F20']) {
    const reused = byId.get(id);
    const weekThree = byId.get('TD-ASSET-W03-F13');
    assert.ok(reused && weekThree, `missing reuse record: ${id}`);
    assert.equal(reused.path, weekThree.path);
    assert.equal(reused.sha256, weekThree.sha256);
  }
});

test('source manifest is a one-to-one audit of package assets and queue tasks', async () => {
  const subject = packageSchema.parse(JSON.parse(await readFile(packagePath, 'utf8')));
  const queue = JSON.parse(await readFile(queuePath, 'utf8'));
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const packageById = new Map(subject.assets.filter(asset => asset.id.startsWith('TD-ASSET-')).map(asset => [asset.id, asset]));
  const queueById = new Map(queue.items.filter(item => item.id.startsWith('TD-ASSET-')).map(item => [item.id, item]));
  assert.equal(manifest.assets.length, 104);
  assert.equal(packageById.size, 104);
  assert.equal(queueById.size, 104);
  for (const row of manifest.assets) {
    const asset = packageById.get(row.task_id);
    const task = queueById.get(row.task_id);
    assert.ok(asset, `package asset missing for ${row.task_id}`);
    assert.ok(task, `queue task missing for ${row.task_id}`);
    assert.equal(asset.lesson_id, row.lesson_id, `lesson binding mismatch: ${row.task_id}`);
    assert.equal(asset.path, row.path, `path mismatch: ${row.task_id}`);
    assert.equal(asset.sha256, row.sha256, `manifest SHA mismatch: ${row.task_id}`);
    assert.equal(asset.bytes, row.bytes, `manifest byte count mismatch: ${row.task_id}`);
    assert.equal(asset.media_type, row.media_type, `media type mismatch: ${row.task_id}`);
    assert.equal(task.status, 'IMPLEMENTED_TESTING_DEFERRED');
  }
  const supportedWeeks = subject.coverage.filter(entry => /^COV-TD-T2-SCH-W(0[1-9]|10)$/.test(entry.id));
  assert.equal(supportedWeeks.length, 10);
  assert.ok(supportedWeeks.every(entry => entry.status === 'SUPPORTED' && entry.lesson_ids.length > 0));
});
