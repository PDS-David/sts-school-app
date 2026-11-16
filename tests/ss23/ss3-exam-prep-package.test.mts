import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadSs23Packages } from '../../backend/src/db/ss23/loader.js';
import { checkUnitPackage, loadRegistry } from '../../backend/src/db/ss23/validateSubjectPackages.js';
import { createSs23StudentDelivery } from '../../backend/src/db/ss23/studentDelivery.js';

const packages = loadSs23Packages();
const registry = loadRegistry();
const ss3Agriculture = packages.find(pkg => pkg.class_name === 'SS 3' && pkg.subject_slug === 'agricultural-science');

test('SS3 Agricultural Science loads from the class-specific exam-preparation directory', () => {
  assert.ok(ss3Agriculture);
  assert.equal(ss3Agriculture.delivery_mode, 'EXAM_PREPARATION');
  assert.deepEqual(checkUnitPackage('agricultural-science.json', ss3Agriculture, registry, 'SS 3'), []);
});

test('SS3 Agricultural Science contains only source-mapped first and second term revision units', () => {
  assert.ok(ss3Agriculture);
  assert.equal(ss3Agriculture.units.length, 12);
  assert.equal(ss3Agriculture.units.reduce((count, unit) => count + unit.practice.length, 0), 24);
  assert.ok(ss3Agriculture.units.every(unit => unit.unit_type === 'REVISION_UNIT'));
  assert.ok(ss3Agriculture.units.every(unit => unit.delivery_mode === 'EXAM_PREPARATION'));
  assert.ok(ss3Agriculture.units.every(unit => unit.exam_targets.join(',') === 'WAEC,NECO,JAMB'));
  assert.ok(ss3Agriculture.units.every(unit => unit.term === '1st Term' || unit.term === '2nd Term'));
  assert.ok(!ss3Agriculture.units.some(unit => unit.term === '3rd Term'));
});

test('SS3 practical, revision and mock-exam scheme gaps remain explicit blockers', () => {
  assert.ok(ss3Agriculture);
  assert.equal(ss3Agriculture.package_status, 'PENDING');
  const ids = new Set(ss3Agriculture.open_items.map(item => item.id));
  assert.ok(ids.has('SS3AG-T2-PRACTICAL-REVISION-MOCK'));
  assert.ok(ids.has('SS3AG-T1-ANIMAL-IMPROVEMENT-SPAN'));
  assert.ok(ss3Agriculture.open_items.every(item => item.blocks_delivery));
});

test('SS3 exam-preparation drafts are not served to students while pending', () => {
  const delivery = createSs23StudentDelivery(packages);
  assert.deepEqual(delivery.listUnits('SS 3'), []);
});
