import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  createSs23StudentDelivery,
  listStudentSs23Units,
  getStudentSs23Unit,
  listStudentSs23Assets,
} from './studentDelivery.js';
import { loadSs23Packages } from './loader.js';

const loaded = loadSs23Packages();
const draft = loaded[0];
const approvedPackage = () => {
  const pkg: any = structuredClone(draft);
  pkg.package_status = 'IMPLEMENTED';
  pkg.open_items = [];
  pkg.sources.forEach((source: any) => { source.reuse_status = 'PERMITTED'; });
  pkg.units.forEach((unit: any) => {
    unit.state = {
      content_approval: 'APPROVED',
      approval_reference: 'SUBJECT-APPROVAL-TEST',
      implementation: 'IMPLEMENTED',
      verification: 'VERIFIED',
      verification_reference: 'INTEGRATION-VERIFICATION-TEST',
    };
    unit.provenance.forEach((ref: any) => { ref.reuse_status = 'PERMITTED'; });
    unit.practice.forEach((question: any) => question.provenance.forEach((ref: any) => { ref.reuse_status = 'PERMITTED'; }));
  });
  const diagram = pkg.assets.find((asset: any) => asset.id === 'ASSET-AG2-T1-SOIL-SEDIMENTATION-JAR');
  diagram.state = {
    content_approval: 'APPROVED',
    approval_reference: 'SUBJECT-APPROVAL-TEST',
    implementation: 'IMPLEMENTED',
    verification: 'VERIFIED',
    verification_reference: 'ASSET-VERIFICATION-TEST',
  };
  diagram.provenance.reuse_status = 'PERMITTED';
  pkg.assets.filter((asset: any) => asset.path.endsWith('.svg')).forEach((asset: any) => {
    asset.state = {
      content_approval: 'APPROVED',
      approval_reference: 'SUBJECT-APPROVAL-TEST',
      implementation: 'IMPLEMENTED',
      verification: 'VERIFIED',
      verification_reference: 'ASSET-VERIFICATION-TEST',
    };
    asset.provenance.reuse_status = 'PERMITTED';
  });
  return pkg;
};

test('loads only registered, schema-valid SS23 packages', () => {
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].subject_slug, 'agricultural-science');
  assert.equal(loaded[0].class_name, 'SS 2');
  assert.equal(loaded[0].delivery_mode, 'INSTRUCTIONAL');
});

test('rejects unregistered package files', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'ss23-loader-'));
  try {
    writeFileSync(path.join(directory, 'unregistered.json'), '{}');
    assert.throws(() => loadSs23Packages(directory), /unregistered package file/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('rejects package filename and subject slug mismatches', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'ss23-loader-'));
  try {
    const invalid: any = structuredClone(draft);
    invalid.subject_slug = 'different-subject';
    writeFileSync(path.join(directory, 'agricultural-science.json'), JSON.stringify(invalid));
    assert.throws(() => loadSs23Packages(directory), /unregistered package file|filename\/slug mismatch/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('never serves any current pending Agriculture unit to SS2 or SS3 students', () => {
  assert.deepEqual(listStudentSs23Units('SS 2'), []);
  assert.deepEqual(listStudentSs23Units('SS 3'), []);
  for (const unit of draft.units) {
    assert.equal(getStudentSs23Unit(unit.id, 'SS 2'), null, 'pending unit must not leak to SS2');
    assert.equal(getStudentSs23Unit(unit.id, 'SS 3'), null, 'SS2 unit must not leak to SS3');
    assert.deepEqual(listStudentSs23Assets(unit.id, 'SS 2'), []);
    assert.deepEqual(listStudentSs23Assets(unit.id, 'SS 3'), []);
  }
});

test('blocks approved-looking content while package-level open items remain', () => {
  const pkg = approvedPackage();
  pkg.open_items = [{ id: 'BLOCK', kind: 'OWNER_ACTION', detail: 'Pending owner action', required_action: 'Resolve', affected_ids: [pkg.units[0].id], blocks_delivery: true }];
  const delivery = createSs23StudentDelivery([pkg]);
  assert.deepEqual(delivery.listUnits('SS 2'), []);
});

test('every approved SS2 unit is reachable by id and cannot be retrieved as SS3', () => {
  const delivery = createSs23StudentDelivery([approvedPackage()]);
  const ss2Units = delivery.listUnits('SS 2');
  assert.equal(ss2Units.length, 8);
  assert.deepEqual(delivery.listUnits('SS 3'), []);
  assert.equal(new Set(ss2Units.map(unit => unit.id)).size, ss2Units.length);
  for (const listed of ss2Units) {
    const reachable = delivery.getUnit(listed.id, 'SS 2');
    assert.ok(reachable, 'listed unit must be retrievable: ' + listed.id);
    assert.equal(reachable.id, listed.id);
    assert.equal(delivery.getUnit(listed.id, 'SS 3'), null, 'cross-class retrieval must fail: ' + listed.id);
  }
});

test('student projection omits answers, explanations, marking and provenance for every unit and question', () => {
  const delivery = createSs23StudentDelivery([approvedPackage()]);
  const units = delivery.listUnits('SS 2');
  assert.equal(units.length, 8);
  for (const unit of units) {
    const safe = delivery.safeStudentUnit(unit);
    assert.equal(typeof safe.body, 'string');
    assert.ok(safe.practice.length > 0);
    assert.equal('provenance' in safe, false);
    for (const question of safe.practice) {
      assert.equal('answer' in question, false);
      assert.equal('explanation' in question, false);
      assert.equal('marking' in question, false);
      assert.equal('provenance' in question, false);
    }
  }
});

test('serves only verified, permitted assets and verifies file bytes and SHA-256', () => {
  const delivery = createSs23StudentDelivery([approvedPackage()]);
  const unit = delivery.listUnits('SS 2').find(item => item.title.includes('Soil Formation'))!;
  const assets = delivery.listAssets(unit.id, 'SS 2');
  assert.equal(assets.length, 1);
  const result = delivery.readAsset(assets[0].id, 'SS 2');
  assert.ok(result);
  assert.equal(result.bytes.length, result.asset.bytes);
  assert.equal(result.asset.sha256, 'f8bbbe5d682198aa5517c4d206186c8104935df6ae8d06aaf06634e68cca5406');
});

test('verifies the stored bytes and SHA-256 for every authored SVG asset', () => {
  const pkg = approvedPackage();
  const delivery = createSs23StudentDelivery([pkg]);
  const svgAssets = pkg.assets.filter((asset: any) => asset.path.endsWith('.svg'));
  assert.equal(svgAssets.length, 5);
  for (const asset of svgAssets) {
    const result = delivery.readAsset(asset.id, 'SS 2');
    assert.ok(result);
    assert.equal(result.bytes.length, asset.bytes);
    assert.equal(result.asset.sha256, asset.sha256);
  }
});

test('rejects asset path traversal even after approval flags are set', () => {
  const pkg = approvedPackage();
  const asset = pkg.assets.find((item: any) => item.id === 'ASSET-AG2-T1-SOIL-SEDIMENTATION-JAR');
  asset.path = '../../../../etc/passwd';
  const delivery = createSs23StudentDelivery([pkg]);
  const unit = delivery.listUnits('SS 2').find(item => item.title.includes('Soil Formation'))!;
  assert.throws(() => delivery.readAsset(asset.id, 'SS 2'), /missing or escapes repository|unsafe/);
});

test('rejects stale asset hashes after approval flags are set', () => {
  const pkg = approvedPackage();
  const asset = pkg.assets.find((item: any) => item.id === 'ASSET-AG2-T1-SOIL-SEDIMENTATION-JAR');
  asset.sha256 = 'a'.repeat(64);
  const delivery = createSs23StudentDelivery([pkg]);
  assert.throws(() => delivery.readAsset(asset.id, 'SS 2'), /integrity mismatch/);
});

test('blocks lessons whose question-level source reuse is still pending', () => {
  const pkg = approvedPackage();
  const blockedUnitId = pkg.units[0].id;
  const unaffectedUnitId = pkg.units[1].id;
  pkg.units[0].practice[0].provenance[0].reuse_status = 'PENDING';
  const delivery = createSs23StudentDelivery([pkg]);
  assert.equal(delivery.getUnit(blockedUnitId, 'SS 2'), null);
  assert.ok(delivery.getUnit(unaffectedUnitId, 'SS 2'));
});
