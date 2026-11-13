// Automated Government package regression suite.
// Owner instruction updated 2026-11-13: run these checks as part of the SS1 completion and integration audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/government.json', import.meta.url), 'utf8'));
const assignmentCsv = readFileSync(new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url), 'utf8');

// The assigned archive paths contain no commas, but this parser also handles quoted CSV fields.
function parseCsvRow(line: string): string[] {
  const fields: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') {
      value += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      fields.push(value);
      value = '';
    } else {
      value += ch;
    }
  }
  fields.push(value);
  return fields;
}

const csvLines = assignmentCsv.trim().split(/\r?\n/);
const csvHeader = parseCsvRow(csvLines[0]);
const csvRows = csvLines.slice(1).map(parseCsvRow);
const governmentAssignments = csvRows
  .filter(row => row[csvHeader.indexOf('assigned_subject_slug')] === 'government')
  .map(row => Object.fromEntries(csvHeader.map((key, index) => [key, row[index]])));

test('Government package follows the frozen schema and registers one source per assigned document', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'government');
  assert.equal(p.canonical_subject, 'Government');
  assert.deepEqual(p.sources.map(s => s.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  assert.equal(p.sources.length, governmentAssignments.length);
  assert.equal(new Set(p.sources.map(s => s.source_id)).size, p.sources.length);

  const assignments = new Map(governmentAssignments.map(row => [row.source_id, row]));
  for (const source of p.sources) {
    const assigned = assignments.get(source.source_id);
    assert(assigned, `unassigned source registered: ${source.source_id}`);
    assert.equal(source.archive_member, assigned.archive_member, source.source_id);
    assert.equal(source.sha256, assigned.sha256, source.source_id);
    assert.equal(source.term, assigned.term_from_folder, source.source_id);
    assert.equal(source.class_name, 'SS 1');
    assert.equal(source.canonical_subject, 'Government');
  }
  for (const assigned of governmentAssignments) {
    assert(p.sources.some(source => source.source_id === assigned.source_id), `missing assigned source ${assigned.source_id}`);
  }
});

test('Government source identities and aliases do not fabricate owner or teacher approval', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  const aliases = p.source_rules.filter(rule => rule.op === 'source_alias');
  assert.equal(aliases.length, 3);
  for (const alias of aliases) {
    const source = p.sources.find(source => source.source_id === alias.source_id);
    assert(source, `alias has no registered source: ${alias.id}`);
    assert.equal(alias.source_sha256, source.sha256);
    assert.match(alias.approval_reference, /^PENDING-OWNER:/);
    // The reference may state that it is NOT teacher approval; it must not claim approval or verification.
    assert.doesNotMatch(alias.approval_reference.replace(/not teacher approval/gi, ''), /teacher approval|approved|verified/i);
  }
});

test('Every current Government rule is source-bound and rejects wrong hashes or ambiguous/missing anchors', () => {
  const p = packageSchema.parse(raw);
  const sourceById = new Map(p.sources.map(source => [source.source_id, source]));
  const ruleIds = new Set<string>();

  for (const rule of p.source_rules) {
    assert(!ruleIds.has(rule.id), `duplicate source rule ${rule.id}`);
    ruleIds.add(rule.id);
    const source = sourceById.get(rule.source_id);
    assert(source, `rule references unknown source ${rule.id}`);
    assert.equal(rule.source_sha256, source.sha256, rule.id);

    const input = {
      source_id: source.source_id,
      sha256: source.sha256,
      filePath: source.archive_member,
      text: rule.anchor,
    };
    assert.throws(
      () => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]),
      /source mismatch/,
      rule.id,
    );
    assert.throws(
      () => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]),
      /ambiguous/,
      rule.id,
    );
    assert.throws(
      () => applyRules({ ...input, text: 'anchor absent' }, [rule]),
      /missing/,
      rule.id,
    );
  }
});

test('Scheme-only revision/examination markers point to explicit SCHEME_ONLY rules', () => {
  const p = packageSchema.parse(raw);
  const markerRules = p.source_rules.filter(rule => rule.op === 'classify_marker');
  const markerCoverage = p.coverage.filter(entry => entry.status === 'MARKER');
  assert.equal(markerRules.length, 3);
  assert.equal(markerCoverage.length, 3);

  for (const marker of markerCoverage) {
    assert.equal(marker.lesson_ids.length, 1, marker.id);
    const rule = markerRules.find(candidate => candidate.id === marker.lesson_ids[0]);
    assert(rule, `marker target is not a registered rule: ${marker.id}`);
    assert.equal(rule.kind, 'SCHEME_ONLY', marker.id);
    assert.equal(rule.source_id, marker.source_id, marker.id);
  }
});

test('Government coverage references resolve to a source, rule, original-body identity or authored lesson', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const lessonIds = new Set(p.lessons.map(lesson => lesson.id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));

  for (const entry of p.coverage) {
    assert(sourceIds.has(entry.source_id), `unknown source in ${entry.id}`);
    assert(entry.evidence.length > 0, `missing evidence in ${entry.id}`);
    for (const id of entry.lesson_ids) {
      assert(
        lessonIds.has(id) || ruleIds.has(id) || [...sourceIds].some(sourceId => id.startsWith(sourceId + ':BODY:')),
        `unresolved coverage target ${entry.id} -> ${id}`,
      );
    }
    if (entry.status === 'MARKER') {
      assert(entry.lesson_ids.every(id => ruleIds.has(id)), `marker without source-rule target: ${entry.id}`);
    }
    if (entry.status === 'IMPLEMENTED_EQUIVALENT') {
      assert(entry.lesson_ids.some(id => lessonIds.has(id)), `equivalent without an authored lesson: ${entry.id}`);
    }
  }
});

// Lesson-body hashes, answer/mark totals, correction bindings and asset guards are
// added by the later lesson/correction/asset tasks as those records enter this package.
// Test execution remains deferred by the owner.


test('Every authored Government lesson has an exact body hash and complete criterion-level marking', () => {
  const p = packageSchema.parse(raw);
  const lessonIds = new Set<string>();
  for (const lesson of p.lessons) {
    assert(!lessonIds.has(lesson.id), `duplicate lesson id ${lesson.id}`);
    lessonIds.add(lesson.id);
    assert.equal(hash(lesson.body), lesson.body_sha256, lesson.id);
    assert.equal(lesson.subject, 'Government');
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0 && lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert(question.answer.trim().length > 0, question.id);
      assert.equal(question.marks, question.marking.reduce((sum, mark) => sum + mark.marks, 0), question.id);
      assert(question.marking.every(mark => mark.criterion.trim() && mark.marks > 0), question.id);
    }
    assert.equal(lesson.state.content_approval, 'PENDING', lesson.id);
    assert.equal(lesson.state.approval_reference, null, lesson.id);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED', lesson.id);
    assert.equal(lesson.state.verification, 'DEFERRED', lesson.id);
    assert.equal(lesson.state.verification_reference, null, lesson.id);
  }
});

test('Every delivery correction binds an original source/body identity to its same-term replacement', () => {
  const p = packageSchema.parse(raw);
  for (const correction of p.delivery_corrections) {
    const source = p.sources.find(candidate => candidate.source_id === correction.source_id);
    const lesson = p.lessons.find(candidate => candidate.id === correction.replacement_id);
    assert(source && lesson, correction.id);
    assert.equal(correction.source_sha256, source.sha256, correction.id);
    assert.equal(correction.source_lesson_id, `${correction.source_id}:BODY:${correction.body_sha256}`, correction.id);
    // correction.body_sha256 is the ORIGINAL row hash (compiler rule); the replacement has its own hash.
    assert.notEqual(lesson.body_sha256, correction.body_sha256, correction.id);
    assert.equal(lesson.term, source.term, correction.id);
  }
});

test('Any authored assets remain attached to an existing lesson and have deferred approval/verification', () => {
  const p = packageSchema.parse(raw);
  for (const asset of p.assets) {
    assert(p.lessons.some(lesson => lesson.id === asset.lesson_id), asset.id);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/, asset.id);
    assert(asset.bytes > 0, asset.id);
    assert.equal(asset.state.content_approval, 'PENDING', asset.id);
    assert.equal(asset.state.approval_reference, null, asset.id);
    assert.equal(asset.state.verification, 'DEFERRED', asset.id);
    assert.equal(asset.state.verification_reference, null, asset.id);
  }
});

test('delivery corrections record the original source row hash (the compiler rejects the replacement hash)', () => {
  for (const correction of raw.delivery_corrections) {
    const originalRowHash = String(correction.source_lesson_id).split(':BODY:')[1];
    assert.equal(correction.body_sha256, originalRowHash, `${correction.id}: body_sha256 must equal the original row hash in source_lesson_id`);
  }
});


test('Week Nine political socialization replacement accounts for all 11 source exercises and constitutional scope', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T1-W09-CORRECTED');
  assert(lesson, 'Week Nine replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 11);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 39);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 11);
  for (const agent of ['FAMILY', 'SCHOOL', 'PEER GROUPS', 'POLITICAL PARTIES', 'MASS MEDIA', 'RELIGIOUS GROUPS', 'PRESSURE GROUPS']) {
    assert(lesson.body.includes(agent), `missing political socialization agent: ${agent}`);
  }
  for (const section of ['Section 10', 'Section 14(2)(c)', 'Section 38', 'Section 40', 'Section 42']) {
    assert(lesson.body.includes(section), `missing constitutional protection: ${section}`);
  }
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
  assert.equal(p.package_status, 'PENDING');

  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T1-W09-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-40ce7dcaf672:BODY:7b1d7ed3a759c954f4e04651fa26320b0d3c0b1977027cd18a0317ef08d3d151');
  assert.equal(correction.body_sha256, '7b1d7ed3a759c954f4e04651fa26320b0d3c0b1977027cd18a0317ef08d3d151');
  assert.equal(correction.replacement_id, lesson.id);
  assert.equal(correction.evidence.objective_scope_audit.practice_item_count, 11);
  assert.equal(correction.evidence.objective_scope_audit.practice_total_marks, 39);

  for (const id of [
    'COV-GOV-T1-W09-POLITICAL-SOCIALIZATION',
    'COV-GOV-T1-W09-AGENTS',
    'COV-GOV-T1-W09-RELIGIOUS-GROUPS',
    'COV-GOV-T1-W09-ASSESSMENT-KEYS',
  ]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert.equal(coverage?.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage?.lesson_ids.includes(lesson.id), id);
  }
  const reading = p.coverage.find(entry => entry.id === 'COV-GOV-T1-W09-READING');
  assert.equal(reading?.status, 'PARTIAL');
  const readingOpenItem = p.open_items.find(entry => entry.id === 'GOVERNMENT-T1-W09-READING-VERIFICATION');
  assert(readingOpenItem);
  assert.equal(readingOpenItem.blocks_delivery, false);
});


test('Week Ten unitary/federal and Federal Character replacement covers all 15 source exercises', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T1-W10-CORRECTED');
  assert(lesson, 'Week Ten replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 15);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 59);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 15);
  for (const phrase of [
    'United Kingdom', 'France', 'Italy', 'Nigeria', 'United States', 'India', 'Russia',
    'Federal Character Principle', 'Federal Character Commission',
    'Second Schedule, Part II, Item L', 'Fourth Schedule',
    'Section 14(3)', 'Section 14(4)',
  ]) {
    assert(lesson.body.includes(phrase), `missing Week Ten coverage: ${phrase}`);
  }
  const ukQuestion = lesson.practice.find(question => question.id === 'T1W10-WEEKEND-02-854');
  assert(ukQuestion?.question.includes("United Kingdom"));
  assert(ukQuestion?.answer.includes("not a universal feature"));
  const allocationQuestion = lesson.practice.find(question => question.id === 'T1W10-WEEKEND-04-854');
  assert(allocationQuestion?.answer.includes('Second Schedule'));
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
  assert.equal(p.package_status, 'PENDING');

  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T1-W10-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-40ce7dcaf672:BODY:ee1e05d99499ee072b0f55cda5a1e30fce140fbf305e42be956fe61b468f14b1');
  assert.equal(correction.body_sha256, 'ee1e05d99499ee072b0f55cda5a1e30fce140fbf305e42be956fe61b468f14b1');
  assert.equal(correction.replacement_id, lesson.id);
  assert.equal(correction.evidence.objective_scope_audit.practice_item_count, 15);
  assert.equal(correction.evidence.objective_scope_audit.practice_total_marks, 59);

  for (const id of [
    'COV-GOV-T1-W10-UNITARY',
    'COV-GOV-T1-W10-UNITARY-EXAMPLES',
    'COV-GOV-T1-W10-UNITARY-FEATURES',
    'COV-GOV-T1-W10-FEDERAL',
    'COV-GOV-T1-W10-FEDERAL-EXAMPLES',
    'COV-GOV-T1-W10-FEDERAL-FEATURES',
    'COV-GOV-T1-W10-FEDERAL-CHARACTER',
    'COV-GOV-T1-W10-ASSESSMENT-KEYS',
  ]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert.equal(coverage?.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage?.lesson_ids.includes(lesson.id), id);
  }
  const reading = p.coverage.find(entry => entry.id === 'COV-GOV-T1-W10-READING');
  assert.equal(reading?.status, 'PARTIAL');
  const readingOpenItem = p.open_items.find(entry => entry.id === 'GOVERNMENT-T1-W10-READING-VERIFICATION');
  assert(readingOpenItem);
  assert.equal(readingOpenItem.blocks_delivery, false);
});


test('Week One colonial-administration replacement corrects history and binds the exact original row', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T2-W01-CORRECTED');
  assert(lesson, 'Week One replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 7);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 33);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 7);
  for (const phrase of [
    'Berlin Conference', '15 November 1884', '26 February 1885',
    'about 1760 to 1840', 'transatlantic slave trade', 'colonial forced-labour systems',
    'civilizing mission', 'Lugard’s High Commissionership',
    'Native Courts Proclamation (1900)', 'Native Authority (Enforcement) Proclamation (1907)',
    'decentralised political institutions',
  ]) {
    assert(lesson.body.includes(phrase), `missing Week One teaching: ${phrase}`);
  }
  assert(!lesson.body.includes('formalised between 1914 and 1917'));
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
  assert.equal(p.package_status, 'PENDING');

  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T2-W01-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-c76f430c7cf8:BODY:ec86c6581e3f2b192f07854c3d6eb84e1927a3bb8e967e7143b0ebf2219c7993');
  assert.equal(correction.body_sha256, 'ec86c6581e3f2b192f07854c3d6eb84e1927a3bb8e967e7143b0ebf2219c7993');
  assert.equal(correction.source_sha256, 'bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782');
  assert.equal(correction.replacement_id, lesson.id);
  assert.equal(correction.evidence.objective_scope_audit.practice_item_count, 7);
  assert.equal(correction.evidence.objective_scope_audit.practice_total_marks, 33);

  for (const id of [
    'COV-GOV-T2-W01-HISTORICAL-BACKGROUND',
    'COV-GOV-T2-W01-REASONS-COLONIALISM',
    'COV-GOV-T2-W01-INDIRECT-RULE-DEFINITION',
    'COV-GOV-T2-W01-INDIRECT-RULE-FEATURES',
    'COV-GOV-T2-W01-INDIRECT-RULE-REASONS',
    'COV-GOV-T2-W01-TRADITIONAL-RULERS-ROLES',
    'COV-GOV-T2-W01-NORTHERN-NIGERIA',
  ]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert.equal(coverage?.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage?.lesson_ids.includes(lesson.id), id);
  }
  const colonialImpacts = p.coverage.find(entry => entry.id === 'COV-GOV-T2-W01-COLONIAL-IMPACTS');
  assert.equal(colonialImpacts?.status, 'IMPLEMENTED_EQUIVALENT');
  assert(colonialImpacts?.lesson_ids.includes('SUP-SS1-GOVERNMENT-T2-W02-CORRECTED'));
  assert.equal(p.coverage.find(entry => entry.id === 'COV-GOV-T2-W01-READING')?.status, 'PARTIAL');
  assert.equal(p.open_items.find(entry => entry.id === 'GOVERNMENT-T2-W01-REGIONAL-SCOPE-DISCREPANCY')?.blocks_delivery, true);
  assert.equal(p.open_items.find(entry => entry.id === 'GOVERNMENT-T2-W01-EVALUATION-QUESTIONS-MISSING')?.blocks_delivery, false);
});


test('Week Two Western/Eastern indirect-rule replacement is sourced, marked and regionally qualified', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T2-W02-CORRECTED');
  assert(lesson, 'Week Two replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 8);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 46);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 8);
  for (const phrase of [
    'Oyo Mesi', 'warrant chiefs', "Women's War", 'Mary Slessor',
    'Clifford Constitution of 1922', 'first elections under this arrangement took place in 1923',
    'West African Currency Board', 'Tenerife', 'Ovonramwen',
    'English, French and Portuguese', 'industrial development was uneven',
  ]) {
    assert(lesson.body.includes(phrase), `missing Week Two teaching: ${phrase}`);
  }
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(p.package_status, 'PENDING');

  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T2-W02-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-c76f430c7cf8:BODY:8d08df9bf392097c3b9501f9e94abd0fd0301ddda3a6c0a44dc03309eb4b5292');
  assert.equal(correction.body_sha256, '8d08df9bf392097c3b9501f9e94abd0fd0301ddda3a6c0a44dc03309eb4b5292');
  assert.equal(correction.source_sha256, 'bce2ae4a8b26f1737631e99387fed3cba661e328da3df274f673b6850088d782');
  assert.equal(correction.replacement_id, lesson.id);
  assert.equal(correction.evidence.objective_scope_audit.practice_item_count, 8);
  assert.equal(correction.evidence.objective_scope_audit.practice_total_marks, 46);

  for (const id of [
    'COV-GOV-T2-W02-WESTERN-INDIRECT-RULE',
    'COV-GOV-T2-W02-EASTERN-INDIRECT-RULE',
    'COV-GOV-T2-W02-EASTERN-FAILURE-REASONS',
    'COV-GOV-T2-W02-MERITS-INDIRECT-RULE',
    'COV-GOV-T2-W02-DEMERITS-INDIRECT-RULE',
    'COV-GOV-T2-W02-POSITIVE-COLONIAL-IMPACTS',
    'COV-GOV-T2-W02-NEGATIVE-COLONIAL-IMPACTS',
    'COV-GOV-T2-W01-COLONIAL-IMPACTS',
    'COV-GOV-T2-SCHEME-W01-02-COLONIAL-IMPACTS',
  ]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert.equal(coverage?.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage?.lesson_ids.includes(lesson.id), id);
  }
  assert.equal(p.coverage.find(entry => entry.id === 'COV-GOV-T2-W02-EVALUATION-MARKER')?.status, 'PARTIAL');
  assert.equal(p.coverage.find(entry => entry.id === 'COV-GOV-T2-W02-PRACTICE-POINTER')?.status, 'PARTIAL');
  assert.equal(p.coverage.find(entry => entry.id === 'COV-GOV-T2-SCHEME-W01-02-INDIRECT-RULE-NIGERIA')?.status, 'PARTIAL');
  assert.equal(p.open_items.find(entry => entry.id === 'GOVERNMENT-T2-W02-REGIONAL-SCOPE-DISCREPANCY')?.blocks_delivery, true);
  assert.equal(p.open_items.find(entry => entry.id === 'GOVERNMENT-T2-W02-CURRENCY-BANKING-FACT')?.blocks_delivery, false);
  assert.equal(p.open_items.find(entry => entry.id === 'GOVERNMENT-T2-W02-EVALUATION-QUESTIONS-MISSING')?.blocks_delivery, false);
});


test('Week Three colonial impacts replacement teaches source objectives with dated evidence and original practice', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T2-W03-CORRECTED');
  assert(lesson, 'Week Three replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 8);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 45);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 8);
  for (const phrase of ['University College Ibadan', '1948', '1962', 'precolonial', 'assimilation', 'association', 'Nigeria (Legislative Council) Order in Council, 1922', 'Nigeria (Constitution) Order in Council, 1951', 'Section 86', 'Section 87']) {
    assert(lesson.body.includes(phrase), `Week Three lesson missing concept: ${phrase}`);
  }
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.implementation, 'IMPLEMENTED');
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T2-W03-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-c76f430c7cf8:BODY:0b52b381b32c022cd26a6b524ff0205321246eed8e81564f3597decceeeb5487');
  assert.equal(correction.body_sha256, '0b52b381b32c022cd26a6b524ff0205321246eed8e81564f3597decceeeb5487');
  assert.equal(correction.replacement_id, lesson.id);
  for (const id of ["COV-GOV-T2-SCHEME-W03-COLONIAL-RULE-MERITS","COV-GOV-T2-SCHEME-W03-BRITISH-FRENCH-COMPARISON","COV-GOV-T2-W03-POSITIVE-IMPACTS","COV-GOV-T2-W03-NEGATIVE-IMPACTS","COV-GOV-T2-W03-BRITISH-FRENCH-COMPARISON","COV-GOV-T2-W03-COMPARISON-TABLE","COV-GOV-T2-W03-COLONIAL-GOVERNOR-FUNCTIONS"]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert(coverage);
    assert.equal(coverage.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage.lesson_ids.includes(lesson.id), id);
  }
  for (const id of ["GOVERNMENT-T2-W03-COLONIAL-EDUCATION-FACT","GOVERNMENT-T2-W03-PRECOLONIAL-TRADE-FACT","GOVERNMENT-T2-W03-COLONIAL-IDEOLOGY-FACT","GOVERNMENT-T2-W03-RURAL-URBAN-FACT","GOVERNMENT-T2-W03-BRITISH-FRENCH-TABLE-FACT","GOVERNMENT-T2-W03-GOVERNOR-POWERS-FACT","GOVERNMENT-T2-W03-EVALUATION-QUESTIONS-MISSING","GOVERNMENT-T2-W03-PRACTICE-VERIFICATION"]) {
    const item = p.open_items.find(entry => entry.id === id);
    assert(item);
    assert.equal(item.blocks_delivery, false, id);
  }
  assert.equal(p.package_status, 'PENDING');
});


test('Week Four nationalism replacement corrects chronology and leader facts with original practice', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T2-W04-CORRECTED');
  assert(lesson, 'Week Four replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 8);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 42);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 8);
  for (const phrase of ['Nationalism is a feeling', '1914 to 1918', 'began in 1929', 'Nigerian National Democratic Party', 'West African Pilot', '16 November 1904', '1910', '1955', 'Nana Olomu', 'Pan-Africanist']) {
    assert(lesson.body.includes(phrase), `Week Four lesson missing concept: ${phrase}`);
  }
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.implementation, 'IMPLEMENTED');
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T2-W04-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-c76f430c7cf8:BODY:87a642e35cee4918dc791017d309de3ec88ad8fcdedb1e2ae3a2f67819ce7e8a');
  assert.equal(correction.body_sha256, '87a642e35cee4918dc791017d309de3ec88ad8fcdedb1e2ae3a2f67819ce7e8a');
  assert.equal(correction.replacement_id, lesson.id);
  for (const id of ["COV-GOV-T2-SCHEME-W04-NATIONALISM","COV-GOV-T2-SCHEME-W04-NATIONALIST-LEADERS","COV-GOV-T2-W04-NATIONALISM-DEFINITION","COV-GOV-T2-W04-FACTORS-NATIONALISM","COV-GOV-T2-W04-EFFECTS-NATIONALISM","COV-GOV-T2-W04-KEY-NATIONALIST-LEADERS"]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert(coverage);
    assert.equal(coverage.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage.lesson_ids.includes(lesson.id), id);
  }
  for (const id of ["GOVERNMENT-T2-W04-NATIONALISM-DEFINITION-FACT","GOVERNMENT-T2-W04-WORLD-DEPRESSION-FACT","GOVERNMENT-T2-W04-NATIONALIST-FIGURES-FACT","GOVERNMENT-T2-W04-NATIONALISM-EFFECTS-FACT","GOVERNMENT-T2-W04-PRESS-PARTIES-FACT","GOVERNMENT-T2-W04-MICHAEL-IMOUDU-FACT","GOVERNMENT-T2-W04-HERBERT-MACAULAY-FACT","GOVERNMENT-T2-W04-AZIKIWE-FACT","GOVERNMENT-T2-W04-AHMADU-BELLO-FACT","GOVERNMENT-T2-W04-AWOLOWO-FACT","GOVERNMENT-T2-W04-RESISTANCE-LEADERS-FACT","GOVERNMENT-T2-W04-EVALUATION-QUESTIONS-MISSING","GOVERNMENT-T2-W04-PRACTICE-VERIFICATION"]) {
    const item = p.open_items.find(entry => entry.id === id);
    assert(item);
    assert.equal(item.blocks_delivery, false, id);
  }
  assert.equal(p.package_status, 'PENDING');
});


test('Week Five constitutional replacement corrects composition, franchise and 1953 chronology', () => {
  const p = packageSchema.parse(raw);
  const lesson = p.lessons.find(entry => entry.id === 'SUP-SS1-GOVERNMENT-T2-W05-CORRECTED');
  assert(lesson, 'Week Five replacement lesson is missing');
  assert.equal(hash(lesson.body), lesson.body_sha256);
  assert.equal(lesson.practice.length, 8);
  assert.equal(lesson.practice.reduce((sum, question) => sum + question.marks, 0), 48);
  assert.equal(new Set(lesson.practice.map(question => question.id)).size, 8);
  for (const phrase of ['46 members', 'three for Lagos and one for Calabar', '£100', '£50', '1 January 1947', 'twelve members', '31 March 1953', 'Lyttleton Constitution of 1954', '1992']) {
    assert(lesson.body.includes(phrase), `Week Five lesson missing concept: ${phrase}`);
  }
  assert.equal(lesson.state.content_approval, 'PENDING');
  assert.equal(lesson.state.approval_reference, null);
  assert.equal(lesson.state.implementation, 'IMPLEMENTED');
  assert.equal(lesson.state.verification, 'DEFERRED');
  assert.equal(lesson.state.verification_reference, null);
  const correction = p.delivery_corrections.find(entry => entry.id === 'CORR-GOV-T2-W05-ROW-REPLACEMENT');
  assert(correction);
  assert.equal(correction.source_lesson_id, 'SS1-SRC-c76f430c7cf8:BODY:3cabc3b91d321966cb868fd857a8177b4c652a12022453938973851aa133af97');
  assert.equal(correction.body_sha256, '3cabc3b91d321966cb868fd857a8177b4c652a12022453938973851aa133af97');
  assert.equal(correction.replacement_id, lesson.id);
  for (const id of ["COV-GOV-T2-SCHEME-W05-CONSTITUTIONAL-DEVELOPMENT","COV-GOV-T2-SCHEME-W05-PRE-INDEPENDENCE-CONSTITUTIONS","COV-GOV-T2-SCHEME-W05-CLIFFORD-CONSTITUTION","COV-GOV-T2-SCHEME-W05-RICHARDS-CONSTITUTION","COV-GOV-T2-SCHEME-W05-MACPHERSON-CONSTITUTION","COV-GOV-T2-SCHEME-W05-CONSTITUTION-ATTRIBUTES","COV-GOV-T2-W05-CLIFFORD-CONSTITUTION","COV-GOV-T2-W05-RICHARDS-CONSTITUTION","COV-GOV-T2-W05-MACPHERSON-CONSTITUTION"]) {
    const coverage = p.coverage.find(entry => entry.id === id);
    assert(coverage);
    assert.equal(coverage.status, 'IMPLEMENTED_EQUIVALENT', id);
    assert(coverage.lesson_ids.includes(lesson.id), id);
  }
  const yearGate = p.open_items.find(entry => entry.id === 'GOVERNMENT-T2-W05-SCHEME-YEAR-DISCREPANCY');
  assert(yearGate);
  assert.equal(yearGate.blocks_delivery, true);
  assert(yearGate.required_action.includes('1992/1922'));
  for (const id of ["GOVERNMENT-T2-W05-CLIFFORD-COMPOSITION-FACT","GOVERNMENT-T2-W05-CLIFFORD-EXECUTIVE-COUNCIL-FACT","GOVERNMENT-T2-W05-CLIFFORD-PARTIES-PRESS-FACT","GOVERNMENT-T2-W05-RICHARDS-FACT","GOVERNMENT-T2-W05-MACPHERSON-FACT","GOVERNMENT-T2-W05-MACPHERSON-CRISIS-FACT","GOVERNMENT-T2-W05-CONSTITUTION-OBJECTIVES-MISSING","GOVERNMENT-T2-W05-EVALUATION-QUESTIONS-MISSING","GOVERNMENT-T2-W05-PRACTICE-VERIFICATION"]) {
    const item = p.open_items.find(entry => entry.id === id);
    assert(item);
    assert.equal(item.blocks_delivery, false, id);
  }
  assert.equal(p.package_status, 'PENDING');
});
