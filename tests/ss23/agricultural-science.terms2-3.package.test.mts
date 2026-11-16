import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { packageSchema } from '../../backend/src/db/ss23/subjectPackageSchema.js';

const packagePath = new URL('../../backend/src/db/ss23/subjects/agricultural-science.json', import.meta.url);
const sourceMapPath = new URL('../../docs/ss23/subjects/agricultural-science/SOURCE_MAP.json', import.meta.url);
const pkg = packageSchema.parse(JSON.parse(readFileSync(packagePath, 'utf8')));
const sourceMap = JSON.parse(readFileSync(sourceMapPath, 'utf8'));

test('SS2 Agricultural Science includes all mapped Second- and Third-Term instructional topics', () => {
  const second = pkg.units.filter(unit => unit.term === '2nd Term');
  const third = pkg.units.filter(unit => unit.term === '3rd Term');
  assert.equal(second.length, 6);
  assert.deepEqual(second.map(unit => unit.week_label), ['1-2', '3', '4', '5-6', '7-8', '9']);
  assert.equal(third.length, 5);
  assert.deepEqual(third.map(unit => unit.week_label), ['1-2', '3-4', '5-6', '7-8', '9-10']);
  const economics = third.find(unit => unit.id.endsWith('T3-W05-06-ECONOMIC-PRINCIPLES'));
  assert.ok(economics);
  assert.equal(economics.practice.length, 3);
  assert.match(economics.practice[2].answer, /8 kg per bag/);
  assert.match(economics.practice[2].answer, /6\.67 kg per bag/);
});

test('new terms are bound to the exact registered original source files', () => {
  const sources = new Map(pkg.sources.map(source => [source.source_id, source]));
  const second = sources.get('SS23-SRC-cd612ad10f40');
  const third = sources.get('SS23-SRC-6abb32818845');
  assert.ok(second);
  assert.ok(third);
  assert.equal(second.sha256, 'cd612ad10f404af75ceb55b288d606e49ab534388dda2151239b9114180f82b5');
  assert.equal(second.bytes, 344064);
  assert.equal(second.class_name, 'SS 2');
  assert.equal(second.term, '2nd Term');
  assert.equal(third.sha256, '6abb32818845fa3739f287d2cc3e274149313bfb381074a623a2bce8c02b2811');
  assert.equal(third.bytes, 408064);
  assert.equal(third.class_name, 'SS 2');
  assert.equal(third.term, '3rd Term');
  for (const unit of pkg.units.filter(unit => unit.term !== '1st Term')) {
    assert.ok(unit.provenance.some(ref =>
      ref.role === 'ORIGINAL_SOURCE' &&
      ref.source_id === (unit.term === '2nd Term' ? second.source_id : third.source_id),
    ));
  }
});

test('new lessons have substantive bodies, authored answer guidance and no false approvals', () => {
  const added = pkg.units.filter(unit => unit.term !== '1st Term');
  assert.equal(added.length, 11);
  for (const unit of added) {
    assert.ok(unit.body.trim().length >= 500, unit.id + ' has a thin body');
    assert.equal(unit.state.content_approval, 'PENDING');
    assert.equal(unit.state.implementation, 'DRAFT');
    assert.equal(unit.state.verification, 'DEFERRED');
    assert.ok(unit.practice.length >= 2);
    for (const question of unit.practice) {
      assert.equal(question.answer_origin, 'AUTHORED_SUPPLEMENT');
      assert.ok(question.explanation.trim().length >= 30);
      assert.equal(question.marking.reduce((sum, item) => sum + item.marks, 0), question.marks);
    }
  }
  assert.equal(pkg.package_status, 'PENDING');
});


test('external factual corrections are source-bound and covered', () => {
  const external = new Map(pkg.external_sources.map(source => [source.source_id, source]));
  const expected = [
    'SS23-EXT-FAO-SILVICULTURE',
    'SS23-EXT-WHO-PESTICIDE-FORMULATION',
    'SS23-EXT-NAFDAC-PESTICIDE-REGS',
    'SS23-EXT-UMN-PHYTOPHTHORA',
    'SS23-EXT-PENNSTATE-PLANT-DISEASE-SIGNS',
    'SS23-EXT-OPENSTAX-GENETICS',
    'SS23-EXT-USDA-NRCS-FEED',
    'SS23-EXT-UMD-ANIMAL-MINERALS',
    'SS23-EXT-WHO-ANTIMICROBIALS',
  ];
  for (const id of expected) {
    assert.ok(external.has(id), 'missing external reference ' + id);
    assert.ok(pkg.coverage.some(row => row.source_id === id && row.status === 'SUPPORTED' && row.unit_ids.length === 1));
  }
  for (const unit of pkg.units.filter(unit => unit.term !== '1st Term')) {
    for (const ref of unit.provenance.filter(ref => ref.source_id.startsWith('SS23-EXT-'))) {
      assert.equal(external.get(ref.source_id)?.sha256, ref.source_sha256);
    }
  }
});

test('revision and examination remain assessment markers, not invented lessons', () => {
  const markerCoverage = pkg.coverage.filter(row =>
    row.id.includes('T2-W10') || row.id.includes('T2-W11-12') ||
    row.id.includes('T3-W11') || row.id.includes('T3-W12'),
  );
  assert.equal(markerCoverage.length, 4);
  assert.ok(markerCoverage.every(row => row.status === 'MARKER' && row.unit_ids.length === 0));
  const added = pkg.units.filter(unit => unit.term !== '1st Term');
  assert.ok(!added.some(unit => unit.title.toLowerCase().includes('revision')));
  assert.ok(!added.some(unit => unit.title.toLowerCase().includes('examination')));
});

test('known technical and assessment blockers remain explicit', () => {
  const ids = new Set(pkg.open_items.map(item => item.id));
  for (const id of [
    'AG2-T2-DISEASE-TAXONOMY',
    'AG2-T2-ASSESSMENT-KEYS',
    'AG2-T3-ACCOUNTING-EXAMPLE',
    'AG2-T3-FEED-THRESHOLD-ANTIBIOTICS',
    'AG2-T3-ASSESSMENT-KEYS',
  ]) assert.ok(ids.has(id), 'missing blocker ' + id);
  const farm = sourceMap.sources.find(source => source.source_id === 'SS23-SRC-6abb32818845');
  const week78 = farm.body_mapping.find(row => row.topic === 'Farm Records and Farm Accounts');
  assert.equal(week78.status, 'SOURCE_BODY_MAPPED');
  assert.ok(week78.anchors.includes('WEEK SEVEN AND EIGHT'));
});
