import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
// This entrypoint imports studentDelivery.test.ts so the workflow covers package contracts and delivery security together.
import './studentDelivery.test.js';
import {
  packageSchema,
  sha256,
} from './subjectPackageSchema.js';
import { loadSs23Packages } from './loader.js';

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

test('loads the SS2 Agricultural Science package with source assessment coverage and blocked delivery', () => {
  const raw = readFileSync(new URL('./subjects/agricultural-science.json', import.meta.url), 'utf8');
  const pkg = packageSchema.parse(JSON.parse(raw));
  assert.equal(pkg.class_name, 'SS 2');
  assert.equal(pkg.package_status, 'PENDING');
  // First Term is the original, source-checked unit set and must not change; Terms 2 and 3 were added later.
  const firstTerm = pkg.units.filter(unit => unit.term === '1st Term');
  assert.equal(firstTerm.length, 8);
  assert.deepEqual(pkg.units.slice(0, 8).map(unit => unit.id), firstTerm.map(unit => unit.id));
  assert.equal(pkg.units.length, 19);
  assert.equal(pkg.units.filter(unit => unit.term === '2nd Term').length, 6);
  assert.equal(pkg.units.filter(unit => unit.term === '3rd Term').length, 5);
  assert.equal(pkg.units[0].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 14);
  assert.equal(pkg.units[1].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 13);
  assert.equal(pkg.units[2].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 17);
  assert.equal(pkg.units[3].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 14);
  assert.equal(pkg.units[4].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 17);
  assert.equal(pkg.units[5].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 16);
  assert.equal(pkg.units[6].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 18);
  assert.equal(pkg.units[7].practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 19);
  assert.equal(firstTerm.reduce((total, unit) => total + unit.practice.length, 0), 150);
  assert.equal(firstTerm.reduce((total, unit) => total + unit.practice.filter(question => question.question_origin === 'ORIGINAL_SOURCE').length, 0), 128);
  assert.equal(pkg.units.reduce((total, unit) => total + unit.practice.length, 0), 195);
  assert.ok(pkg.units.every(unit => unit.practice.every(question => question.answer_origin === 'AUTHORED_SUPPLEMENT')));
  assert.equal(pkg.sources[0].source_id, 'SS23-SRC-225f920d3751');
  assert.equal(pkg.assets.length, 52);
  const farmsteadReplacement = pkg.assets.find(asset => asset.id === 'ASSET-AG2-T1-W04-05-FARMSTEAD-SCHOOL-SCHEMATIC');
  assert.ok(farmsteadReplacement);
  assert.equal(farmsteadReplacement.path, 'backend/src/db/ss23/assets/agricultural-science/farmstead-layout-school.svg');
  assert.equal(farmsteadReplacement.sha256, 'fb208caa90d4f2745d48b9c8682ecb6ed731027b468e085546d675bc5138397b');
  assert.equal(farmsteadReplacement.state.content_approval, 'PENDING');
  assert.equal(farmsteadReplacement.state.verification, 'DEFERRED');
  const irrigationReplacement = pkg.assets.find(asset => asset.id === 'ASSET-AG2-T1-W06-IRRIGATION-SYSTEMS-SCHEMATIC');
  assert.ok(irrigationReplacement);
  assert.equal(irrigationReplacement.path, 'backend/src/db/ss23/assets/agricultural-science/irrigation-methods-school.svg');
  assert.equal(irrigationReplacement.sha256, '0162556a1893e33e9b418ea760f211236477dbcafa53a40edcffd847e1a1030a');
  assert.equal(irrigationReplacement.state.content_approval, 'PENDING');
  assert.equal(irrigationReplacement.state.verification, 'DEFERRED');
  const tractorPtoReplacement = pkg.assets.find(asset => asset.id === 'ASSET-AG2-T1-W03-TRACTOR-PTO-DRAWBAR-SCHEMATIC');
  assert.ok(tractorPtoReplacement);
  assert.equal(tractorPtoReplacement.path, 'backend/src/db/ss23/assets/agricultural-science/tractor-pto-drawbar-school.svg');
  assert.equal(tractorPtoReplacement.sha256, 'c60684e43b902d6096033ea71a097d4857781222805910326edfac20da249d81');
  assert.equal(tractorPtoReplacement.state.content_approval, 'PENDING');
  assert.equal(tractorPtoReplacement.state.verification, 'DEFERRED');
  const soilProfileReplacement = pkg.assets.find(asset => asset.id === 'ASSET-AG2-T1-SOIL-PROFILE-SCHOOL-SCHEMATIC');
  assert.ok(soilProfileReplacement);
  assert.equal(soilProfileReplacement.path, 'backend/src/db/ss23/assets/agricultural-science/soil-profile-school.svg');
  assert.equal(soilProfileReplacement.sha256, 'fee369b144b1c16626d21ff8bef36b1e31c48cf68a8c4202f3a8174cb2d06fc5');
  assert.equal(soilProfileReplacement.state.content_approval, 'PENDING');
  assert.equal(soilProfileReplacement.state.verification, 'DEFERRED');
  const authoredAssets = pkg.assets.filter(asset => asset.path.startsWith('backend/src/db/ss23/assets/agricultural-science/'));
  assert.equal(authoredAssets.length, 10);
  assert.ok(authoredAssets.every(asset =>
    asset.state.verification === 'DEFERRED' &&
    asset.state.content_approval === 'PENDING' &&
    asset.state.implementation === 'IMPLEMENTED'
  ));
  assert.equal(pkg.coverage.some(row => row.id === 'COV-SS2-AG-T1-FARMSTEAD-SCHOOL-SCHEMATIC' && row.status === 'SUPPORTED'), true);
  assert.equal(pkg.assets.filter(asset => asset.path.startsWith('source-extract://')).length, 42);
  assert.ok(pkg.assets.some(asset => asset.path === 'backend/src/db/ss23/assets/agricultural-science/soil-sedimentation-jar.svg' && asset.state.implementation === 'IMPLEMENTED'));
  assert.ok(pkg.open_items.length >= 5);
  assert.ok(pkg.open_items.some(item => item.blocks_delivery));
  assert.ok(pkg.open_items.some(item => !item.blocks_delivery));
  assert.equal(pkg.open_items.length, 47);
  assert.equal(pkg.open_items.filter(item => !item.blocks_delivery).length, 1);
  const soilPracticals = pkg.open_items.find(item => item.id === 'AG2-T1-SOIL-PRACTICALS');
  assert.ok(soilPracticals);
  assert.match(soilPracticals.detail, /draft procedures for moisture, porosity, capillarity, soil organisms and organic-matter observation now exist/);
  assert.match(soilPracticals.required_action, /mark-by-mark guides/);
  assert.equal(soilPracticals.blocks_delivery, true);
  assert.equal(pkg.external_sources.length, 48);
  assert.ok(pkg.external_sources.some(source => source.source_id === 'SS23-EXT-USDA-NRCS-SOIL-PROFILE'));
  assert.equal(soilProfileReplacement.provenance.source_id, 'SS23-EXT-USDA-NRCS-SOIL-PROFILE');
  assert.ok(pkg.coverage.some(row => row.id === 'COV-SS2-AG-T1-SOIL-PROFILE-SCHOOL-SCHEMATIC' && row.source_id === 'SS23-EXT-USDA-NRCS-SOIL-PROFILE'));
  assert.ok(pkg.external_sources.some(source => source.source_id === 'SS23-EXT-EPPO-CASSAVA-BLIGHT-NOMENCLATURE'));
  assert.ok(pkg.external_sources.some(source => source.source_id === 'SS23-EXT-APS-CASSAVA-BLIGHT-2024'));
  assert.ok(pkg.coverage.some(row => row.id === 'COV-SS2-AG-T2-EPPO-CASSAVA-NAME' && row.status === 'SUPPORTED'));
  assert.ok(pkg.coverage.some(row => row.id === 'COV-SS2-AG-T2-APS-CASSAVA-PATHOGEN' && row.status === 'SUPPORTED'));
  assert.ok(pkg.assets.some(asset => asset.path === 'backend/src/db/ss23/assets/agricultural-science/irrigation-systems.svg' && asset.state.implementation === 'IMPLEMENTED'));
  assert.ok(pkg.assets.some(asset => asset.path === 'backend/src/db/ss23/assets/agricultural-science/drainage-systems.svg' && asset.state.implementation === 'IMPLEMENTED'));
  const irrigationFigureReview = pkg.open_items.find(item => item.id === 'AG2-T1-W06-FIGURE-RIGHTS');
  assert.ok(irrigationFigureReview);
  assert.equal(irrigationFigureReview.blocks_delivery, true);
  assert.match(irrigationFigureReview.detail, /Three school-authored alternatives are now stored/);
  for (const id of ['ASSET-AG2-T1-W06-IRRIGATION-SYSTEMS-DIAGRAM', 'ASSET-AG2-T1-W06-DRAINAGE-SYSTEMS-DIAGRAM', 'ASSET-AG2-T1-W06-IRRIGATION-SYSTEMS-SCHEMATIC']) {
    assert.ok(irrigationFigureReview.affected_ids.includes(id), 'irrigation review must track ' + id);
  }
  const cycleFigureReview = pkg.open_items.find(item => item.id === 'AG2-T1-W08-09-FIGURE-RIGHTS');
  assert.ok(cycleFigureReview);
  assert.equal(cycleFigureReview.blocks_delivery, true);
  assert.match(cycleFigureReview.detail, /Three school-authored alternatives are now stored/);
  for (const id of ['ASSET-AG2-T1-W08-09-NITROGEN-CYCLE-AUTHORED', 'ASSET-AG2-T1-W08-09-CARBON-WATER-CYCLES-AUTHORED', 'ASSET-AG2-T1-W08-09-NUTRIENT-CYCLES-SCHOOL-SCHEMATIC']) {
    assert.ok(cycleFigureReview.affected_ids.includes(id), 'cycle review must track ' + id);
  }
  assert.ok(pkg.assets.some(asset => asset.path === 'backend/src/db/ss23/assets/agricultural-science/nitrogen-cycle.svg' && asset.state.implementation === 'IMPLEMENTED'));
  assert.ok(pkg.assets.some(asset => asset.path === 'backend/src/db/ss23/assets/agricultural-science/carbon-water-cycles.svg' && asset.state.implementation === 'IMPLEMENTED'));
  assert.ok(pkg.units.every(unit => unit.state.content_approval === 'PENDING'));
});


test('loads the source-mapped SS2 Chemistry package without overstating term coverage', () => {
  const raw = readFileSync(new URL('./subjects/chemistry.json', import.meta.url), 'utf8');
  const pkg = packageSchema.parse(JSON.parse(raw));
  assert.equal(pkg.class_name, 'SS 2');
  assert.equal(pkg.delivery_mode, 'INSTRUCTIONAL');
  assert.equal(pkg.package_status, 'PENDING');
  assert.equal(pkg.sources.length, 3);
  assert.equal(pkg.units.length, 28);
  assert.deepEqual(pkg.units.filter(unit => unit.term === '1st Term').map(unit => unit.week_label), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  assert.deepEqual(pkg.units.filter(unit => unit.term === '2nd Term').map(unit => unit.week_label), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  assert.deepEqual(pkg.units.filter(unit => unit.term === '3rd Term').map(unit => unit.week_label), ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  const weekCoverage = pkg.coverage.filter(coverage => /^SS2CHEM-COV-T[123]-W/.test(coverage.id));
  assert.equal(weekCoverage.length, 25);
  assert.ok(weekCoverage.every(coverage => coverage.status === 'PARTIAL' && coverage.unit_ids.length === 1));
  assert.ok(pkg.units.every(unit => unit.state.implementation === 'DRAFT' && unit.state.verification === 'DEFERRED'));
  assert.equal(pkg.coverage.find(row => row.id === 'SS2CHEM-COV-T1')?.status, 'PARTIAL');
  assert.equal(pkg.coverage.find(row => row.id === 'SS2CHEM-COV-T2')?.status, 'PARTIAL');
  assert.equal(pkg.coverage.find(row => row.id === 'SS2CHEM-COV-T3')?.status, 'PARTIAL');
  assert.ok(pkg.open_items.some(item => item.id === 'SS2CHEM-REMAINING-CURRICULUM' && item.blocks_delivery));
  assert.ok(pkg.units.every(unit => unit.state.implementation === 'DRAFT' && unit.state.verification === 'DEFERRED'));
});


test('loads source-mapped SS2 Physics First-Term drafts without overstating remaining terms', () => {
  const raw = readFileSync(new URL('./subjects/physics.json', import.meta.url), 'utf8');
  const pkg = packageSchema.parse(JSON.parse(raw));
  assert.equal(pkg.class_name, 'SS 2');
  assert.equal(pkg.delivery_mode, 'INSTRUCTIONAL');
  assert.equal(pkg.package_status, 'PENDING');
  assert.equal(pkg.sources.length, 3);
  assert.equal(pkg.units.length, 8);
  assert.deepEqual(pkg.units.map(unit => unit.week_label), ['1', '2', '3', '4', '5', '6&7', '8&9', '10&11']);
  assert.ok(pkg.units.every(unit => unit.state.implementation === 'DRAFT' && unit.state.verification === 'DEFERRED'));
  assert.equal(pkg.coverage.find(row => row.id === 'SS2PHY-COV-T1')?.status, 'PARTIAL');
  assert.equal(pkg.coverage.find(row => row.id === 'SS2PHY-COV-T2')?.status, 'UNRESOLVED');
  assert.equal(pkg.coverage.find(row => row.id === 'SS2PHY-COV-T3')?.status, 'UNRESOLVED');
  assert.ok(pkg.open_items.some(item => item.id === 'SS2PHY-CONTENT-REMAINING' && item.blocks_delivery));
});



test('SS3 Biology includes only source-backed prior-learning revision and preserves unresolved topics', () => {
  const raw = readFileSync(new URL('./subjects/ss3/biology.json', import.meta.url), 'utf8');
  const pkg = packageSchema.parse(JSON.parse(raw));
  assert.equal(pkg.class_name, 'SS 3');
  assert.equal(pkg.delivery_mode, 'EXAM_PREPARATION');
  assert.equal(pkg.units.length, 2);
  const skinRevision = pkg.units.find(unit => unit.id === 'PREP-SS3-BIOLOGY-T1-W2-EXCRETION');
  assert.ok(skinRevision);
  assert.equal(skinRevision.term, '1st Term');
  assert.ok(skinRevision.exam_targets.includes('WAEC'));
  assert.ok(skinRevision.body.includes('SS2 Biology Third Term, Week 2'));
  assert.equal(pkg.coverage.find(row => row.id === 'SS3BIO-COV-T1')?.status, 'PARTIAL');
  assert.equal(pkg.coverage.find(row => row.id === 'SS3BIO-COV-T2-W5')?.status, 'UNRESOLVED');
  assert.ok(pkg.open_items.some(item => item.id === 'SS3BIO-T1-W2-EXCLUDED-CONTENT' && item.blocks_delivery));
});

test('registered SS2/SS3 packages preserve class-specific delivery modes and SS3 has no third term', () => {
  const packages = loadSs23Packages();
  assert.ok(packages.some(pkg => pkg.class_name === 'SS 2' && pkg.subject_slug === 'chemistry'));
  for (const pkg of packages) {
    if (pkg.class_name === 'SS 2') {
      assert.equal(pkg.delivery_mode, 'INSTRUCTIONAL', pkg.subject_slug);
    } else {
      assert.equal(pkg.class_name, 'SS 3');
      assert.equal(pkg.delivery_mode, 'EXAM_PREPARATION', pkg.subject_slug);
      // Compared as strings: the SS 3 schema types already exclude '3rd Term'; this guards the runtime data.
      assert.ok(pkg.units.every(unit => String(unit.term) !== '3rd Term'), pkg.subject_slug);
      assert.ok(pkg.sources.every(source => String(source.term) !== '3rd Term'), pkg.subject_slug);
    }
  }
});
