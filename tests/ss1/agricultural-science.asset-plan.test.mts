import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { buildAssetPlan } from '../../scripts/ss1/build_asset_plan.mjs';

const validSvg = Buffer.from('<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50"><path d="M0 0 L100 50" stroke="#000"/></svg>');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function fixture(approval = 'APPROVED') {
  const root = mkdtempSync(path.join(tmpdir(), 'ss1-asset-plan-'));
  const rel = 'backend/src/db/ss1/assets/agricultural-science/figure.svg';
  mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  writeFileSync(path.join(root, rel), validSvg);
  const state = { content_approval: approval, approval_reference: approval === 'APPROVED' ? 'review://lesson-1' : null, implementation: 'IMPLEMENTED', verification: 'VERIFIED', verification_reference: 'verification://lesson-1' };
  const lesson = { id: 'SUP-SS1-AG-LESSON-1', class_name: 'SS 1', term: '3rd Term', title: 'Tool Reference', state };
  const asset = { id: 'AG-ASSET-1', lesson_id: lesson.id, path: rel, sha256: hash(validSvg), bytes: validSvg.length, media_type: 'image/svg+xml', alt: 'Agricultural hand tool', order: 1, provenance: { reuse_status: 'PERMITTED' }, state: { ...state } };
  const compilerPlan = { assets: [{ id: asset.id }], identified_rows: [{ id: lesson.id, row: { className: 'SS 1', subjectName: 'Agricultural Science', termLabel: '3rd Term', orderIndex: 12, title: lesson.title } }] };
  const subjectPackage = { subject_slug: 'agricultural-science', canonical_subject: 'Agricultural Science', package_status: 'IMPLEMENTED', lessons: [lesson], assets: [asset] };
  return { root, compilerPlan, subjectPackage, rel };
}

test('approved and verified SVGs map to the exact compiler row and produce attachTopicAssets manifest fields', () => {
  const f = fixture();
  try {
    const result = buildAssetPlan({ compilerPlan: f.compilerPlan, subjectPackage: f.subjectPackage, repoRoot: f.root });
    assert.equal(result.ready, true);
    assert.equal(result.records.length, 1);
    assert.equal(result.records[0].order_index, 12);
    assert.equal(result.records[0].expected_title, 'Tool Reference');
    assert.equal(result.records[0].file, f.rel);
    assert.equal(result.groups.length, 1);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test('pending content approval blocks attachment manifest generation', () => {
  const f = fixture('PENDING');
  try {
    const result = buildAssetPlan({ compilerPlan: f.compilerPlan, subjectPackage: f.subjectPackage, repoRoot: f.root });
    assert.equal(result.ready, false);
    assert.ok(result.blockers.includes('LESSON_CONTENT_NOT_APPROVED:AG-ASSET-1'));
    assert.ok(result.blockers.includes('ASSET_CONTENT_NOT_APPROVED:AG-ASSET-1'));
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test('asset topic mismatch and untrusted SVG bytes block manifest generation', () => {
  const f = fixture();
  try {
    f.compilerPlan.identified_rows[0].row.orderIndex = 0;
    let result = buildAssetPlan({ compilerPlan: f.compilerPlan, subjectPackage: f.subjectPackage, repoRoot: f.root });
    assert.ok(result.blockers.includes('ASSET_TOPIC_IDENTITY_MISMATCH:AG-ASSET-1'));
    f.compilerPlan.identified_rows[0].row.orderIndex = 12;
    const unsafe = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><script>alert(1)</script></svg>');
    writeFileSync(path.join(f.root, f.rel), unsafe);
    f.subjectPackage.assets[0].sha256 = hash(unsafe);
    f.subjectPackage.assets[0].bytes = unsafe.length;
    result = buildAssetPlan({ compilerPlan: f.compilerPlan, subjectPackage: f.subjectPackage, repoRoot: f.root });
    assert.ok(result.blockers.includes('ASSET_MIME_OR_SAFETY_MISMATCH:AG-ASSET-1'));
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});
