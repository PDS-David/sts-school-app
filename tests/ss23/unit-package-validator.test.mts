import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  checkUnitPackage,
  loadRegistry,
  readinessForUnitPackages,
} from '../../backend/src/db/ss23/validateSubjectPackages.js';
import { loadSs23Packages } from '../../backend/src/db/ss23/loader.js';

const registry = loadRegistry();
const packages = loadSs23Packages();
const agriculture = packages.find(pkg => pkg.class_name === 'SS 2' && pkg.subject_slug === 'agricultural-science');

test('validator reads the current root-level unit package and matches its source inventory', () => {
  assert.ok(agriculture, 'the registered Agricultural Science package should load');
  assert.deepEqual(checkUnitPackage('agricultural-science.json', agriculture, registry), []);
});

test('readiness includes the current package instead of reporting every term as missing', () => {
  assert.ok(agriculture);
  const row = readinessForUnitPackages(registry, packages).find(item =>
    item.class_name === 'SS 2' && item.subject === 'agricultural-science' && item.term === '1st Term',
  );
  assert.ok(row);
  assert.equal(row.package, true);
  assert.equal(row.lessons, agriculture.units.filter(unit => unit.term === '1st Term').length);
  assert.equal(row.state, 'IN_PROGRESS', 'a PENDING package must never be reported ready');
});

test('detects a source SHA mismatch against the inventory registry', () => {
  assert.ok(agriculture);
  const sourceId = agriculture.sources[0].source_id;
  const alteredRegistry = registry.map(row =>
    row.source_id === sourceId ? { ...row, sha256: 'a'.repeat(64) } : row,
  );
  const errors = checkUnitPackage('agricultural-science.json', agriculture, alteredRegistry);
  assert.ok(errors.some(error => error.includes('SOURCE_HASH_MISMATCH')));
});

test('detects a source byte-count mismatch against the inventory registry', () => {
  assert.ok(agriculture);
  const sourceId = agriculture.sources[0].source_id;
  const alteredRegistry = registry.map(row =>
    row.source_id === sourceId ? { ...row, bytes: row.bytes + 1 } : row,
  );
  const errors = checkUnitPackage('agricultural-science.json', agriculture, alteredRegistry);
  assert.ok(errors.some(error => error.includes('SOURCE_BYTES_MISMATCH')));
});

test('does not require unapproved source-extract references to exist as stored assets', () => {
  assert.ok(agriculture);
  assert.deepEqual(checkUnitPackage('agricultural-science.json', agriculture, registry), []);
});

test('an approved, implemented, verified asset cannot point to a missing file', () => {
  assert.ok(agriculture);
  const pkg: any = structuredClone(agriculture);
  const asset = pkg.assets[0];
  asset.path = 'docs/ss23/__missing-approved-asset__/figure.svg';
  asset.state = {
    content_approval: 'APPROVED',
    approval_reference: 'TEST-APPROVAL',
    implementation: 'IMPLEMENTED',
    verification: 'VERIFIED',
    verification_reference: 'TEST-VERIFICATION',
  };
  asset.provenance.reuse_status = 'PERMITTED';
  const errors = checkUnitPackage('agricultural-science.json', pkg, registry);
  assert.ok(errors.some(error => error.includes('APPROVED_ASSET_FILE_MISSING')));
});

test('asset paths escaping the repository are rejected even while approval is pending', () => {
  assert.ok(agriculture);
  const pkg: any = structuredClone(agriculture);
  pkg.assets[0].path = '../../../../etc/passwd';
  const errors = checkUnitPackage('agricultural-science.json', pkg, registry);
  assert.ok(errors.some(error => error.includes('ASSET_PATH_ESCAPES_REPO')));
});

test('the package schema accepts source-member path variants when SHA and byte identity match', () => {
  assert.ok(agriculture);
  const pkg: any = structuredClone(agriculture);
  pkg.sources[0].archive_member = 're-supplied-archive/renamed-folder/original-member.doc';
  assert.deepEqual(checkUnitPackage('agricultural-science.json', pkg, registry), []);
});

test('readiness remains explicit when a package is filtered to a different class', () => {
  assert.ok(agriculture);
  const matrix = readinessForUnitPackages(registry, packages);
  const ss3 = matrix.find(item =>
    item.class_name === 'SS 3' && item.subject === 'agricultural-science' && item.term === '1st Term',
  );
  assert.ok(ss3);
  assert.equal(ss3.package, false);
  assert.equal(ss3.state, 'MISSING_PACKAGE');
});

test('the readiness function can be evaluated against an isolated package set', () => {
  assert.ok(agriculture);
  const isolated = mkdtempSync(path.join(os.tmpdir(), 'ss23-readiness-'));
  try {
    const matrix = readinessForUnitPackages(registry, [agriculture]);
    assert.ok(matrix.some(item => item.class_name === 'SS 2' && item.subject === 'agricultural-science' && item.package));
  } finally {
    rmSync(isolated, { recursive: true, force: true });
  }
});
