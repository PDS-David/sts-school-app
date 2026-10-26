// DEFERRED BY OWNER. Run from repo root after whole SS1 implementation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compilePackages, applyRules, originalLessonId, registry, sha256, assertExistingCompatible } from '../../backend/src/db/ss1/compiler.ts';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
const source = registry[0];
const body = 'Agricultural Science\nWEEK 1\nSynthetic teaching example.\nA question and its explanation.';
const input = { source_id: source.source_id, sha256: source.sha256, filePath: source.archive_member, text: body };
const parse = (text: string) => [{ weekLabel: '1', title: 'Synthetic fixture', body: text }];
const pkg = () => ({ schema_version: 'ss1-subject-v1', subject_slug: source.assigned_subject_slug, canonical_subject: 'Agricultural Science', package_status: 'IMPLEMENTED', sources: [{ source_id: source.source_id, sha256: source.sha256, archive_member: source.archive_member, class_name: 'SS 1', term: source.term_from_folder, canonical_subject: 'Agricultural Science', header_text: 'Agricultural Science', header_evidence: { locator: 'Synthetic fixture only', explanation: 'Not actual source content' } }], source_rules: [], lessons: [], delivery_corrections: [], assets: [], coverage: [{ id: 'SYNTHETIC-OBJECTIVE', source_id: source.source_id, objective: 'Synthetic objective', objective_locator: 'fixture', status: 'SUPPORTED', lesson_ids: [originalLessonId(source.source_id, body)], evidence: [{ locator: 'fixture', explanation: 'Synthetic parser returns the exact body' }] }], open_items: [] });
test('schema refuses unknown keys and executable operations', () => {
  assert.throws(() => packageSchema.parse({ ...pkg(), execute: 'code' }));
  assert.throws(() => packageSchema.parse({ ...pkg(), source_rules: [{ op: 'javascript', code: 'x' }] }));
});
test('compiler preserves body and input objects, reports missing packages', () => {
  const p = pkg(), snapshot = JSON.stringify([p, input]); const plan = compilePackages([p], [input], parse);
  assert.equal(plan.rows[0].sourceReference, body); assert.equal(plan.rows[0].orderIndex, 1);
  assert.equal(JSON.stringify([p, input]), snapshot); assert.equal(plan.ready, false);
  assert.ok(plan.blockers.some(x => x.startsWith('MISSING_PACKAGE:')));
  assert.deepEqual(plan, compilePackages([p], [input], parse));
});
test('all SS1 terms allowed, SS3 rejected by source schema', () => {
  for (const term of ['1st Term', '2nd Term', '3rd Term']) { const p = pkg(); p.sources[0].term = term; assert.doesNotThrow(() => packageSchema.parse(p)); }
  const p = pkg(); p.sources[0].class_name = 'SS 3'; assert.throws(() => packageSchema.parse(p));
});
test('tampered source bytes/digest and unknown source rejected', () => {
  assert.throws(() => compilePackages([pkg()], [{ ...input, sha256: '0'.repeat(64) }], parse));
  assert.throws(() => compilePackages([pkg()], [{ ...input, source_id: 'UNKNOWN' }], parse));
});
test('boundary rules preserve all original characters and reject repeated anchors', () => {
  const rule = { id: 'SYNTHETIC-RULE', op: 'split_before' as const, source_id: source.source_id, source_sha256: source.sha256, anchor: 'A question', week_label: '2', evidence: { locator: 'fixture', explanation: 'synthetic' } };
  assert.equal(applyRules(input, [rule]).replace('WEEK 2\n', ''), body);
  assert.throws(() => applyRules({ ...input, text: body + '\nA question' }, [rule]));
  assert.throws(() => applyRules(input, [{ ...rule, source_sha256: 'f'.repeat(64) }]));
});
test('incorrect existing row or shifted order cannot be overwritten', () => {
  const rows = compilePackages([pkg()], [input], parse).rows;
  assert.doesNotThrow(() => assertExistingCompatible(rows, rows));
  assert.throws(() => assertExistingCompatible([{ ...rows[0], sourceReference: 'changed' }], rows));
  assert.throws(() => assertExistingCompatible([{ ...rows[0], orderIndex: 2 }], rows));
});
test('partial coverage blocks delivery and invented mapping is rejected', () => {
  const p = pkg(); p.coverage[0].status = 'PARTIAL';
  assert.ok(compilePackages([p], [input], parse).blockers.some(x => x.startsWith('INCOMPLETE_COVERAGE:')));
  p.coverage[0].lesson_ids = ['invented']; assert.throws(() => compilePackages([p], [input], parse));
});
test('same-title correction cannot substitute for exact source/body identity', () => {
  assert.throws(() => compilePackages([{ ...pkg(), delivery_corrections: [{ id: 'bad', source_id: source.source_id, source_sha256: source.sha256, source_lesson_id: 'Synthetic fixture', body_sha256: sha256(body), replacement_id: 'missing', reason: 'fixture', evidence: { locator: 'fixture', explanation: 'fixture' } }] }], [input], parse));
});
