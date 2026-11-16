import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  checkUnitPackage,
  loadRegistry,
  readinessForUnitPackages,
} from '../../backend/src/db/ss23/validateSubjectPackages.js';
import { loadSs23Packages } from '../../backend/src/db/ss23/loader.js';

const registry = loadRegistry();
const packages = loadSs23Packages();
const biology = packages.find(pkg => pkg.class_name === 'SS 2' && pkg.subject_slug === 'biology');

test('SS2 Biology First-Term draft loads and matches the registered source identity', () => {
  assert.ok(biology);
  assert.deepEqual(checkUnitPackage('biology.json', biology, registry), []);
  assert.equal(biology.package_status, 'PENDING');
  assert.equal(biology.units.length, 25);
  assert.equal(biology.units.reduce((count, unit) => count + unit.practice.length, 0), 50);
});

test('SS2 Biology preserves the source combined Weeks 9-10 body section', () => {
  assert.ok(biology);
  assert.ok(biology.units.some(unit => unit.term === '1st Term' && unit.week_label === '9-10'));
  assert.equal(biology.units.filter(unit => unit.term === '1st Term' && unit.week_label === '10').length, 0);
  assert.ok(biology.units.some(unit => unit.term === '2nd Term' && unit.week_label === '1-2'));
  assert.ok(biology.units.some(unit => unit.term === '2nd Term' && unit.week_label === '4-5'));
  assert.ok(biology.units.some(unit => unit.term === '3rd Term' && unit.week_label === '3-4'));
  assert.ok(biology.units.some(unit => unit.term === '3rd Term' && unit.week_label === '9-10'));
});

test('original source assessment reconciliation and visual review remain explicit delivery blockers', () => {
  assert.ok(biology);
  const ids = new Set(biology.open_items.map(item => item.id));
  assert.ok(ids.has('BIO2-T1-SOURCE-ASSESSMENT-RECONCILIATION'));
  assert.ok(ids.has('BIO2-T1-SOURCE-VISUAL-REVIEW'));
  assert.ok(biology.open_items.every(item => item.blocks_delivery));
});

test('readiness reports Biology as in progress rather than student-ready', () => {
  assert.ok(biology);
  const row = readinessForUnitPackages(registry, packages).find(item =>
    item.class_name === 'SS 2' && item.subject === 'biology' && item.term === '1st Term',
  );
  assert.ok(row);
  assert.equal(row.lessons, 9);
  assert.equal(row.state, 'IN_PROGRESS');
});
