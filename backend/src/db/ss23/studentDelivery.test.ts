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
import { loadSs23Packages, registeredSs23Subjects, registeredSs23ExamSubjects } from './loader.js';

const loaded = loadSs23Packages();
const draft = loaded.find(pkg => pkg.class_name === 'SS 2' && pkg.subject_slug === 'agricultural-science')!;
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

test('loads only registered, schema-valid SS23 packages across both classes', () => {
  assert.equal(loaded.length, registeredSs23Subjects.length + registeredSs23ExamSubjects.length);
  const packages = loaded.map(pkg => `${pkg.class_name}/${pkg.subject_slug}`).sort();
  assert.deepEqual(packages, [
    ...registeredSs23Subjects.map(subject => `SS 2/${subject}`),
    ...registeredSs23ExamSubjects.map(subject => `SS 3/${subject}`),
  ].sort());
  for (const pkg of loaded.filter(item => item.class_name === 'SS 2')) {
    assert.equal(pkg.delivery_mode, 'INSTRUCTIONAL');
  }
  const ss3 = loaded.find(item => item.class_name === 'SS 3');
  assert.ok(ss3);
  assert.equal(ss3.delivery_mode, 'EXAM_PREPARATION');
});

test('loads SS2 Government First-Term drafts while explicitly holding later terms', () => {
  const pkg = loaded.find(item => item.class_name === 'SS 2' && item.subject_slug === 'government');
  assert.ok(pkg);
  assert.equal(pkg.delivery_mode, 'INSTRUCTIONAL');
  assert.equal(pkg.units.length, 30);
  assert.equal(pkg.units.reduce((count, unit) => count + unit.practice.length, 0), 60);
  assert.deepEqual(pkg.coverage.map(row => row.status), ['PARTIAL', 'SUPPORTED', 'PARTIAL', 'PARTIAL', 'SUPPORTED', 'SUPPORTED']);
  assert.ok(pkg.open_items.some(item => item.id === 'GOV-SS2-T2-ASSESSMENT-RECONCILIATION'));
  assert.ok(pkg.open_items.some(item => item.id === 'GOV-SS2-T3-ASSESSMENT-RECONCILIATION'));
  assert.ok(pkg.units.every(unit => unit.state.implementation === 'DRAFT' && unit.state.verification === 'DEFERRED'));
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

test('never serves the current pending Agriculture draft to SS2 or SS3 students', () => {
  assert.deepEqual(listStudentSs23Units('SS 2'), []);
  assert.deepEqual(listStudentSs23Units('SS 3'), []);
  assert.equal(getStudentSs23Unit(draft.units[0].id, 'SS 2'), null);
  assert.equal(getStudentSs23Unit(draft.units[0].id, 'SS 3'), null);
  assert.deepEqual(listStudentSs23Assets(draft.units[1].id, 'SS 2'), []);
});

test('blocks approved-looking content while package-level open items remain', () => {
  const pkg = approvedPackage();
  pkg.open_items = [{ id: 'BLOCK', kind: 'OWNER_ACTION', detail: 'Pending owner action', required_action: 'Resolve', affected_ids: [pkg.units[0].id], blocks_delivery: true }];
  const delivery = createSs23StudentDelivery([pkg]);
  assert.deepEqual(delivery.listUnits('SS 2'), []);
});

test('keeps all three SS2 terms reachable and SS3 delivery class-separated', () => {
  const delivery = createSs23StudentDelivery([approvedPackage()]);
  const ss2Units = delivery.listUnits('SS 2');
  assert.equal(ss2Units.length, draft.units.length);
  assert.ok(ss2Units.length > 0);
  for (const unit of ss2Units) {
    assert.equal(delivery.getUnit(unit.id, 'SS 2')?.id, unit.id, 'SS2 unit must be reachable: ' + unit.id);
    assert.equal(delivery.getUnit(unit.id, 'SS 3'), null, 'SS3 must not retrieve SS2 unit: ' + unit.id);
  }
  assert.deepEqual(delivery.listUnits('SS 3'), []);
});

test('student projection omits model answers, explanations, marking and provenance', () => {
  const delivery = createSs23StudentDelivery([approvedPackage()]);
  const unit = delivery.listUnits('SS 2')[0];
  const safe = delivery.safeStudentUnit(unit);
  assert.equal(typeof safe.body, 'string');
  assert.ok(safe.practice.length > 0);
  assert.equal('provenance' in safe, false);
  assert.equal('answer' in safe.practice[0], false);
  assert.equal('explanation' in safe.practice[0], false);
  assert.equal('marking' in safe.practice[0], false);
});

test('never lists unresolved source-extract assets even when erroneous approval metadata is present', () => {
  const pkg = approvedPackage();
  const sourceExtractAssets = pkg.assets.filter((asset: any) => asset.path.startsWith('source-extract://'));
  assert.equal(sourceExtractAssets.length, 42);

  // Exercise the defensive path gate, not only the ordinary PENDING state.
  // A future edit or import must not make a placeholder appear in the student UI
  // merely by advancing its approval/reuse metadata without storing its bytes.
  for (const asset of sourceExtractAssets) {
    asset.state = {
      content_approval: 'APPROVED',
      approval_reference: 'NEGATIVE-CONTROL-ONLY',
      implementation: 'IMPLEMENTED',
      verification: 'VERIFIED',
      verification_reference: 'NEGATIVE-CONTROL-ONLY',
    };
    asset.provenance.reuse_status = 'PERMITTED';
  }

  const delivery = createSs23StudentDelivery([pkg]);
  for (const asset of sourceExtractAssets) {
    assert.ok(delivery.getUnit(asset.unit_id, 'SS 2'), 'the approved test fixture should expose the containing lesson');
    assert.equal(
      delivery.listAssets(asset.unit_id, 'SS 2').some(item => item.id === asset.id),
      false,
      'source-extract placeholders must not appear in student asset listings: ' + asset.id,
    );
    assert.equal(
      delivery.readAsset(asset.id, 'SS 2'),
      null,
      'source-extract placeholders must not be readable by students: ' + asset.id,
    );
  }
});

test('serves only verified, permitted assets and verifies file bytes and SHA-256', () => {
  const delivery = createSs23StudentDelivery([approvedPackage()]);
  const unit = delivery.listUnits('SS 2').find(item => item.title.includes('Soil Formation'))!;
  const assets = delivery.listAssets(unit.id, 'SS 2');
  assert.equal(assets.length, 2);
  const expectedHashes = new Map([
    ['ASSET-AG2-T1-SOIL-SEDIMENTATION-JAR', 'f8bbbe5d682198aa5517c4d206186c8104935df6ae8d06aaf06634e68cca5406'],
    ['ASSET-AG2-T1-SOIL-PROFILE-SCHOOL-SCHEMATIC', 'fee369b144b1c16626d21ff8bef36b1e31c48cf68a8c4202f3a8174cb2d06fc5'],
  ]);
  assert.deepEqual(new Set(assets.map(asset => asset.id)), new Set(expectedHashes.keys()));
  for (const asset of assets) {
    const result = delivery.readAsset(asset.id, 'SS 2');
    assert.ok(result);
    assert.equal(result.bytes.length, result.asset.bytes);
    assert.equal(result.asset.sha256, expectedHashes.get(asset.id));
  }
});

test('verifies the stored bytes and SHA-256 for every authored SVG asset', () => {
  const pkg = approvedPackage();
  const delivery = createSs23StudentDelivery([pkg]);
  const svgAssets = pkg.assets.filter((asset: any) => asset.path.endsWith('.svg'));
  assert.equal(svgAssets.length, 10);
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
