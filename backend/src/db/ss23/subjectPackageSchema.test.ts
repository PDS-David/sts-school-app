import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  packageSchema,
  sha256,
} from './subjectPackageSchema.js';

const longBody = ('Soil is a natural resource that supports plant growth. It contains mineral particles, organic matter, water, air and living organisms. Farmers study soil properties to choose suitable crops and manage water and nutrients. ').repeat(5);
const sourceHash = 'a'.repeat(64);
const ss2Source = {
  source_id: `SS23-SRC-${sourceHash.slice(0, 12)}`,
  sha256: sourceHash,
  bytes: 1200,
  archive_member: 'SSS 2/1st Term SS2_/AGRICULTURAL SCIENCE.doc',
  class_name: 'SS 2',
  term: '1st Term',
  canonical_subject: 'Agricultural Science',
  header_text: 'AGRICULTURAL SCIENCE / SS 2 / FIRST TERM',
  header_evidence: { locator: 'Document header, page 1', explanation: 'The source explicitly identifies the subject, class and term.' },
  rights: 'Owner-supplied school curriculum source; reuse subject to owner approval.',
  attribution: 'Original Sow the Seed School source document.',
  reuse_status: 'PENDING',
};
const ss3Hash = 'b'.repeat(64);
const ss3Source = {
  ...ss2Source,
  source_id: `SS23-SRC-${ss3Hash.slice(0, 12)}`,
  sha256: ss3Hash,
  archive_member: 'SSS 3/1st Term SS3_/AGRICULTURAL SCIENCE.doc',
  class_name: 'SS 3',
  term: '1st Term',
  header_text: 'AGRICULTURAL SCIENCE / SS 3 / FIRST TERM',
};
const practice = (source: any) => ({
  id: 'Q1',
  question_origin: 'AUTHORED_SUPPLEMENT',
  question_locator: 'Authored schema-test question.',
  question: 'Explain one reason soil texture matters to crop growth.',
  answer_origin: 'AUTHORED_SUPPLEMENT',
  answer_locator: 'Authored schema-test model answer and marking guide.',
  answer: 'Soil texture influences how soil holds and transmits water and air.',
  explanation: 'Particle size affects pore spaces. Sandy soils generally drain quickly, while finer-textured soils retain more water.',
  marks: 2,
  marking: [
    { criterion: 'Identifies water retention or drainage as an effect of texture.', marks: 1 },
    { criterion: 'Explains the relationship between particle size and water movement.', marks: 1 },
  ],
  provenance: [{ source_id: source.source_id, source_sha256: source.sha256, role: 'ORIGINAL_SOURCE', locator: 'Source document, soil texture section', rights: source.rights, attribution: source.attribution, reuse_status: 'PENDING' }],
});
const state = {
  content_approval: 'PENDING',
  approval_reference: null,
  implementation: 'DRAFT',
  verification: 'DEFERRED',
  verification_reference: null,
};
const ss2Unit = {
  id: 'SUP-SS2-AGRICULTURAL-SCIENCE-T1-W01-02-SOIL',
  class_name: 'SS 2',
  delivery_mode: 'INSTRUCTIONAL',
  unit_type: 'LESSON',
  term: '1st Term',
  subject: 'Agricultural Science',
  title: 'Soil: Meaning, Types, Composition and Properties',
  week_label: '1-2',
  objectives: ['Define soil in relation to plant growth.', 'Compare sandy, clayey and loamy soils using their properties.'],
  body: longBody,
  body_sha256: sha256(longBody),
  practice: [practice(ss2Source), { ...practice(ss2Source), id: 'Q2', question: 'State two properties of clayey soil.' }],
  provenance: [{
    source_id: ss2Source.source_id,
    source_sha256: ss2Source.sha256,
    role: 'ORIGINAL_SOURCE',
    locator: 'Week One, Topic: Soil, pages 1-2',
    rights: ss2Source.rights,
    attribution: ss2Source.attribution,
    reuse_status: 'PENDING',
  }],
  state,
};
const basePackage = {
  schema_version: 'ss23-subject-v1',
  subject_slug: 'agricultural-science',
  canonical_subject: 'Agricultural Science',
  package_status: 'PENDING',
  external_sources: [],
  source_rules: [],
  assets: [],
  coverage: [{
    id: 'COV-SS2-AG-T1-SOIL',
    source_id: ss2Source.source_id,
    objective: 'Meaning, types, composition and properties of soil',
    objective_locator: 'First Term scheme, Weeks 1-2',
    status: 'SUPPORTED',
    unit_ids: [ss2Unit.id],
    evidence: [{ locator: 'Scheme of work, Weeks 1-2', explanation: 'The scheme names the soil unit and its scope.' }],
  }],
  open_items: [],
};
const ss2Package: any = {
  ...basePackage,
  class_name: 'SS 2',
  delivery_mode: 'INSTRUCTIONAL',
  sources: [ss2Source],
  units: [ss2Unit],
};

const ss3Unit = {
  id: 'PREP-SS3-AGRICULTURAL-SCIENCE-T1-W01-ANIMAL-NUTRITION',
  class_name: 'SS 3',
  delivery_mode: 'EXAM_PREPARATION',
  unit_type: 'PAST_QUESTION_SET',
  term: '1st Term',
  exam_targets: ['WAEC', 'NECO'],
  subject: 'Agricultural Science',
  title: 'Animal Nutrition: Examination Revision and Questions',
  week_label: '1',
  objectives: ['Recall the meaning of animal nutrition.', 'Answer examination-style questions on malnutrition.'],
  body: longBody,
  body_sha256: sha256(longBody),
  practice: [practice(ss3Source), { ...practice(ss3Source), id: 'Q2', question: 'State two effects of malnutrition in farm animals.' }],
  provenance: [{
    source_id: ss3Source.source_id,
    source_sha256: ss3Source.sha256,
    role: 'ORIGINAL_SOURCE',
    locator: 'First Term, Week One',
    rights: ss3Source.rights,
    attribution: ss3Source.attribution,
    reuse_status: 'PENDING',
  }],
  state,
};
const ss3Package = {
  ...basePackage,
  class_name: 'SS 3',
  delivery_mode: 'EXAM_PREPARATION',
  sources: [ss3Source],
  units: [ss3Unit],
  coverage: [{
    ...basePackage.coverage[0],
    id: 'COV-SS3-AG-T1-ANIMAL-NUTRITION',
    source_id: ss3Source.source_id,
    unit_ids: [ss3Unit.id],
  }],
};

test('accepts a source-bound SS2 instructional package', () => {
  assert.equal(packageSchema.parse(ss2Package).class_name, 'SS 2');
});

test('accepts an SS3 exam-preparation package with named examination targets', () => {
  assert.equal(packageSchema.parse(ss3Package).delivery_mode, 'EXAM_PREPARATION');
});

test('rejects SS3 third-term source material', () => {
  const invalid: any = structuredClone(ss3Package);
  invalid.sources[0].term = '3rd Term';
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects normal instructional mode for SS3', () => {
  const invalid: any = structuredClone(ss3Package);
  invalid.delivery_mode = 'INSTRUCTIONAL';
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects stale lesson body hashes', () => {
  const invalid = structuredClone(ss2Package);
  invalid.units[0].body_sha256 = 'c'.repeat(64);
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects answer keys without mark-by-mark totals', () => {
  const invalid = structuredClone(ss2Package);
  invalid.units[0].practice[0].marking[0].marks = 2;
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects missing answer explanations', () => {
  const invalid = structuredClone(ss2Package);
  invalid.units[0].practice[0].explanation = 'Too short';
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects mismatched original-source provenance', () => {
  const invalid = structuredClone(ss2Package);
  invalid.units[0].provenance[0].source_sha256 = 'd'.repeat(64);
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects superficial lesson bodies', () => {
  const invalid = structuredClone(ss2Package);
  invalid.units[0].body = 'Too short';
  invalid.units[0].body_sha256 = sha256(invalid.units[0].body);
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects approval or verification claims without evidence references', () => {
  const invalid: any = structuredClone(ss2Package);
  invalid.units[0].state = {
    content_approval: 'APPROVED',
    approval_reference: null,
    implementation: 'IMPLEMENTED',
    verification: 'VERIFIED',
    verification_reference: null,
  };
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('loads the SS2 Agricultural Science soil draft and keeps delivery blocked', () => {
  const raw = readFileSync(new URL('./subjects/agricultural-science.json', import.meta.url), 'utf8');
  const pkg = packageSchema.parse(JSON.parse(raw));
  assert.equal(pkg.class_name, 'SS 2');
  assert.equal(pkg.package_status, 'PENDING');
  assert.equal(pkg.units.length, 2);
  assert.equal(pkg.units[0].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 14);
  assert.equal(pkg.units[1].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 13);
  assert.ok(pkg.units.every(unit => unit.practice.every(question => question.answer_origin === 'AUTHORED_SUPPLEMENT')));
  assert.equal(pkg.assets.length, 6);
  assert.equal(pkg.assets.filter(asset => asset.path.startsWith('source-extract://')).length, 5);
  assert.ok(pkg.assets.every(asset => asset.state.verification === 'DEFERRED'));
  assert.ok(pkg.assets.some(asset => asset.path === 'backend/src/db/ss23/assets/agricultural-science/soil-sedimentation-jar.svg' && asset.state.implementation === 'IMPLEMENTED'));
  assert.equal(pkg.sources[0].source_id, 'SS23-SRC-225f920d3751');
  assert.ok(pkg.open_items.length >= 5);
  assert.ok(pkg.open_items.every(item => item.blocks_delivery));
  assert.ok(pkg.units.every(unit => unit.state.content_approval === 'PENDING'));
});

test('requires original-source provenance for source-derived questions', () => {
  const invalid: any = structuredClone(ss2Package);
  invalid.units[0].practice[0].question_origin = 'ORIGINAL_SOURCE';
  invalid.units[0].practice[0].provenance = invalid.units[0].practice[0].provenance.filter((ref: any) => ref.role !== 'ORIGINAL_SOURCE');
  assert.equal(packageSchema.safeParse(invalid).success, false);
});

test('rejects question-level provenance with a mismatched source hash', () => {
  const invalid: any = structuredClone(ss2Package);
  invalid.units[0].practice[0].provenance[0].source_sha256 = 'd'.repeat(64);
  assert.equal(packageSchema.safeParse(invalid).success, false);
});
