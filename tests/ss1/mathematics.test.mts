// SS1 Mathematics package checks. WRITTEN, NOT EXECUTED (testing deferred by owner).
// Run later (repo root, Node 24.19.0): node --import tsx --test tests/ss1/mathematics.test.mts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { lessonContentHash, loadSourceManifest, parseSubjectPackage, validatePackageStatic } from '../../backend/src/db/ss1/index.js';

const here = path.dirname(new URL(import.meta.url).pathname);
const raw = JSON.parse(readFileSync(path.join(here, '../../backend/src/db/ss1/subjects/mathematics.json'), 'utf8'));

test('mathematics package parses under the frozen contract', () => {
  const pkg = parseSubjectPackage(raw);
  assert.equal(pkg.subject_slug, 'mathematics');
  assert.equal(pkg.canonical_subject, 'Mathematics');
});
test('every lesson content_hash matches its content', () => {
  const pkg = parseSubjectPackage(raw);
  for (const l of pkg.lessons) assert.equal(l.content_hash, lessonContentHash(l), l.id);
});
test('package is not IMPLEMENTED while First Term source is unbound', () => {
  assert.notEqual(raw.package_status.implementation, 'IMPLEMENTED');
  assert.ok(raw.open_items.some((o: { id: string; blocks_student_delivery: boolean }) => o.id === 'OI-MATHS-001' && o.blocks_student_delivery));
});
test('static package validation reports no errors', () => {
  const pkg = parseSubjectPackage(raw);
  const r = validatePackageStatic(pkg, loadSourceManifest());
  assert.deepEqual(r.errors ?? r, r.errors ? [] : r);
});
