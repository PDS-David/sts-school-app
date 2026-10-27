// SS1 Physics package checks. WRITTEN, NOT EXECUTED (testing deferred by owner).
// Run later (repo root, Node 24.19.0): node --import tsx --test tests/ss1/physics.test.mts
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { lessonContentHash, loadSourceManifest, parseSubjectPackage, validatePackageStatic } from '../../backend/src/db/ss1/index.js';

const here = path.dirname(new URL(import.meta.url).pathname);
const raw = JSON.parse(readFileSync(path.join(here, '../../backend/src/db/ss1/subjects/physics.json'), 'utf8'));

test('physics package parses under the frozen contract', () => {
  const pkg = parseSubjectPackage(raw);
  assert.equal(pkg.subject_slug, 'physics');
  assert.equal(pkg.canonical_subject, 'Physics');
});
test('every lesson content_hash matches its content', () => {
  const pkg = parseSubjectPackage(raw);
  for (const l of pkg.lessons) assert.equal(l.content_hash, lessonContentHash(l), l.id);
});
test('Week Five and Six split rule is hash-scoped to the 1st Term source', () => {
  const r = raw.source_rules.find((x: { rule_id: string }) => x.rule_id === 'PHYS-R01');
  assert.equal(r.op, 'split_before_anchor');
  assert.equal(r.source_id, 'SS1-SRC-5c0149cda71d');
});
test('static package validation reports no errors', () => {
  const pkg = parseSubjectPackage(raw);
  const r = validatePackageStatic(pkg, loadSourceManifest());
  assert.deepEqual(r.errors ?? r, r.errors ? [] : r);
});
