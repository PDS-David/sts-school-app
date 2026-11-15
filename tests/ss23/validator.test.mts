import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkPackage, loadRegistry, readiness, sha256 } from '../../backend/src/db/ss23/validateSubjectPackages.ts';
import { ss23PackageSchema } from '../../backend/src/db/ss23/subjectPackageSchema.ts';

const registry = loadRegistry();
const src = registry.find(r => r.class_name === 'SS 2' && r.assigned_subject_slug === 'agricultural-science' && r.term === '1st Term')!;
const body = 'Soil is the upper layer of the earth in which plants grow.';

function fixture(): any {
  return {
    schema_version: 'ss23-subject-v1', class_name: 'SS 2', subject_slug: 'agricultural-science', canonical_subject: 'Agricultural Science',
    package_status: 'PENDING',
    sources: [{ source_id: src.source_id, sha256: src.sha256, archive_member: src.archive_member, class_name: 'SS 2', term: '1st Term', canonical_subject: 'Agricultural Science', header_text: 'FIRST TERM E-LEARNING NOTE SUBJECT: AGRICULTURAL SCIENCE', header_evidence: { locator: 'line 1', explanation: 'header names subject and class' } }],
    external_sources: [], source_rules: [], delivery_corrections: [], assets: [], open_items: [],
    lessons: [{
      id: 'SUP-SS2-AS-W1-001', class_name: 'SS 2', term: '1st Term', subject: 'Agricultural Science', title: 'Soil', objectives: ['Define soil'],
      body, body_sha256: sha256(body),
      practice: [{ id: 'Q1', question: 'What is soil?', options: ['The upper layer of the earth in which plants grow', 'A mineral'], answer: 'The upper layer of the earth in which plants grow', marks: 2, marking: [{ criterion: 'upper layer', marks: 1 }, { criterion: 'plants grow', marks: 1 }] }],
      provenance: [{ title: 'Authored supplement', locator: 'Week 1', rights: 'Authored for the school', reuse_status: 'PERMITTED', attribution: 'School' }],
      state: { content_approval: 'PENDING', approval_reference: null, implementation: 'DRAFT', verification: 'DEFERRED', verification_reference: null },
    }],
    coverage: [{ id: 'C1', source_id: src.source_id, objective: 'Define soil', objective_locator: 'Week 1', status: 'IMPLEMENTED_EQUIVALENT', lesson_ids: ['SUP-SS2-AS-W1-001'], evidence: [{ locator: 'Week 1', explanation: 'supplement covers it' }] }],
  };
}
const run = (mutate: (p: any) => void, cls = 'SS 2') => { const p = fixture(); mutate(p); return checkPackage('ss2/agricultural-science.json', p, registry, cls); };
const has = (errs: string[], code: string) => assert.ok(errs.some(e => e.includes(code)), `expected ${code} in ${JSON.stringify(errs)}`);

test('valid fixture passes', () => assert.deepEqual(run(() => {}), []));

// ---- negative controls: each defect class from the audit brief must be caught ----
test('invalid source hash', () => has(run(p => { p.sources[0].sha256 = 'a'.repeat(64); }), 'SOURCE_HASH_MISMATCH'));
test('broken source reference', () => has(run(p => { p.sources[0].source_id = 'SS23-SRC-000000000000'; }), 'BROKEN_SOURCE_REFERENCE'));
test('source belongs to another subject', () => { const o = registry.find(r => r.class_name === 'SS 2' && r.assigned_subject_slug === 'biology' && r.term === '1st Term')!; has(run(p => { Object.assign(p.sources[0], { source_id: o.source_id, sha256: o.sha256, archive_member: o.archive_member }); }), 'SOURCE_SUBJECT_MISMATCH'); });
test('source term does not match registry', () => has(run(p => { p.sources[0].term = '2nd Term'; }), 'SOURCE_TERM_MISMATCH'));
test('invalid lesson body hash', () => has(run(p => { p.lessons[0].body += ' edited'; }), 'BODY_HASH_MISMATCH'));
test('missing assessment answer is a schema error', () => has(run(p => { p.lessons[0].practice[0].answer = ''; }), 'SCHEMA'));
test('missing marking guidance is a schema error', () => has(run(p => { p.lessons[0].practice[0].marking = []; }), 'SCHEMA'));
test('marking does not add up', () => has(run(p => { p.lessons[0].practice[0].marks = 3; }), 'MARKING_TOTAL_MISMATCH'));
test('answer not among options', () => has(run(p => { p.lessons[0].practice[0].answer = 'Rock'; }), 'ANSWER_NOT_AN_OPTION'));
test('SS1-style lesson id rejected', () => has(run(p => { p.lessons[0].id = 'SUP-SS1-AS-W1-001'; p.coverage[0].lesson_ids = [p.lessons[0].id]; }), 'SCHEMA'));
test('lesson id for the wrong class', () => has(run(p => { p.lessons[0].id = 'SUP-SS3-AS-W1-001'; p.coverage[0].lesson_ids = [p.lessons[0].id]; }), 'LESSON_ID_NOT_BOUND_TO_CLASS_SUBJECT'));
test('lesson id for the wrong subject', () => has(run(p => { p.lessons[0].id = 'SUP-SS2-BI-W1-001'; p.coverage[0].lesson_ids = [p.lessons[0].id]; }), 'LESSON_ID_NOT_BOUND_TO_CLASS_SUBJECT'));
test('package class differs from directory', () => has(run(() => {}, 'SS 3'), 'CLASS_MISMATCH'));
test('coverage points at a lesson that does not exist', () => has(run(p => { p.coverage[0].lesson_ids = ['SUP-SS2-AS-W9-999']; }), 'UNRESOLVED_COVERAGE_TARGET'));
test('equivalent coverage without a supplement', () => has(run(p => { p.coverage[0].lesson_ids = [`${src.source_id}:BODY:${'b'.repeat(64)}`]; }), 'EQUIVALENT_WITHOUT_SUPPLEMENT'));
test('IMPLEMENTED package cannot hide unresolved coverage', () => has(run(p => { p.package_status = 'IMPLEMENTED'; p.coverage.push({ id: 'C2', source_id: src.source_id, objective: 'x', objective_locator: 'Week 2', status: 'UNRESOLVED', lesson_ids: [], evidence: [] }); }), 'IMPLEMENTED_WITH_1_UNRESOLVED'));
test('IMPLEMENTED package cannot hide blocking open items', () => has(run(p => { p.package_status = 'IMPLEMENTED'; p.open_items.push({ id: 'O1', detail: 'd', required_action: 'a', affected_ids: ['C1'], blocks_delivery: true }); }), 'IMPLEMENTED_WITH_1_BLOCKING'));
test('asset with a missing file', () => has(run(p => { p.assets.push({ id: 'A1', lesson_id: 'SUP-SS2-AS-W1-001', path: 'docs/ss23/nope.png', sha256: 'c'.repeat(64), bytes: 10, media_type: 'image/png', alt: 'x', order: 0, source_locator: 'w1', provenance: p.lessons[0].provenance[0], state: p.lessons[0].state }); }), 'ASSET_FILE_MISSING'));
test('unknown extra fields are rejected (strict schema)', () => assert.equal(ss23PackageSchema.safeParse({ ...fixture(), surprise: 1 }).success, false));

// ---- registry + readiness ----
test('registry: 100 rows, unique ids, twins reference each other', () => {
  assert.equal(registry.length, 100);
  assert.equal(new Set(registry.map(r => r.source_id)).size, 100);
  const ids = new Set(registry.map(r => r.source_id));
  for (const r of registry) for (const t of r.identical_to) { assert.ok(ids.has(t)); assert.ok(registry.find(x => x.source_id === t)!.identical_to.includes(r.source_id)); }
  assert.equal(registry.filter(r => r.identical_to.length).length, 4);
});
test('readiness never reports absence as complete', () => {
  const m = readiness(registry, []);
  assert.equal(m.length, 126);
  assert.ok(m.filter(r => r.class_name === 'SS 3' && r.term === '3rd Term').every(r => r.state === 'SOURCE_MISSING' && r.sources === 0));
  for (const [c, s, t] of [['SS 2', 'technical-drawing', '1st Term'], ['SS 3', 'technical-drawing', '1st Term'], ['SS 2', 'catering-craft', '1st Term'], ['SS 2', 'catering-craft', '3rd Term'], ['SS 3', 'catering-craft', '1st Term'], ['SS 3', 'food-and-nutrition', '2nd Term']]) {
    assert.equal(m.find(r => r.class_name === c && r.subject === s && r.term === t)!.state, 'SOURCE_MISSING', `${c} ${s} ${t}`);
  }
  assert.equal(m.filter(r => r.state === 'SOURCE_MISSING').length, 27);
  assert.equal(m.filter(r => r.state === 'MISSING_PACKAGE').length, 99);
  assert.ok(!m.some(r => r.state === 'READY_FOR_REVIEW'));
});
test('a package moves its terms to IN_PROGRESS, not ready', () => {
  const p = ss23PackageSchema.parse(fixture());
  const row = readiness(registry, [p]).find(r => r.class_name === 'SS 2' && r.subject === 'agricultural-science' && r.term === '1st Term')!;
  assert.equal(row.state, 'IN_PROGRESS'); assert.equal(row.lessons, 1);
});
