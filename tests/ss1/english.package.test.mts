// Executed by the SS1 English package verification workflow.
// node --import tsx --test tests/ss1/english.package.test.mts
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { applyRules } from '../../backend/src/db/ss1/compiler.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/english.json', import.meta.url), 'utf8'));
const hash = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');

test('English package follows the frozen schema and retains all three instructional SS1 terms', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.subject_slug, 'english');
  assert.equal(p.canonical_subject, 'English Language');
  assert.deepEqual([...new Set(p.sources.map(s => s.term))].sort(), ['1st Term', '2nd Term', '3rd Term']);
  for (const source of p.sources) {
    assert.equal(source.class_name, 'SS 1');
    assert.equal(source.canonical_subject, 'English Language');
  }
});

test('Authored lessons have exact UTF-8 body hashes, unique identities and complete marking totals', () => {
  const p = packageSchema.parse(raw);
  const ids = new Set<string>();
  for (const lesson of p.lessons) {
    assert(!ids.has(lesson.id), 'duplicate lesson id: ' + lesson.id);
    ids.add(lesson.id);
    assert.equal(hash(lesson.body), lesson.body_sha256, 'body hash: ' + lesson.id);
    assert.equal(lesson.subject, 'English Language');
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0, 'missing objectives: ' + lesson.id);
    assert(lesson.practice.length > 0, 'missing practice: ' + lesson.id);
    assert(lesson.provenance.length > 0, 'missing provenance: ' + lesson.id);
    const practiceIds = new Set<string>();
    for (const question of lesson.practice) {
      assert(!practiceIds.has(question.id), 'duplicate practice id: ' + lesson.id + '/' + question.id);
      practiceIds.add(question.id);
      assert(question.question.trim().length > 0);
      assert(question.answer.trim().length > 0, 'missing answer: ' + lesson.id + '/' + question.id);
      assert(question.marking.length > 0, 'missing marking guide: ' + lesson.id + '/' + question.id);
      assert(question.marking.every(m => m.criterion.trim().length > 0 && Number.isInteger(m.marks) && m.marks > 0));
      assert.equal(question.marks, question.marking.reduce((total, criterion) => total + criterion.marks, 0));
    }
  }
});

test('All 24 correction records preserve exact source/body identity and bind a same-term replacement', () => {
  // This checks binding identity only; inactive correction scope and owner approval remain separate.
  const p = packageSchema.parse(raw);
  assert.equal(p.delivery_corrections.length, 24);
  const correctionIds = new Set<string>();
  const originalTargets = new Set<string>();
  for (const correction of p.delivery_corrections) {
    assert(!correctionIds.has(correction.id), 'duplicate correction id: ' + correction.id);
    correctionIds.add(correction.id);
    assert(!originalTargets.has(correction.source_lesson_id), 'duplicate correction target: ' + correction.source_lesson_id);
    originalTargets.add(correction.source_lesson_id);
    const source = p.sources.find(s => s.source_id === correction.source_id);
    const replacement = p.lessons.find(l => l.id === correction.replacement_id);
    assert(source, 'missing source: ' + correction.id);
    assert(replacement, 'missing replacement: ' + correction.id);
    assert.equal(correction.source_sha256, source.sha256);
    assert.equal(correction.source_lesson_id, correction.source_id + ':BODY:' + correction.body_sha256);
    assert.equal(replacement.term, source.term, 'cross-term replacement: ' + correction.id);
    assert.equal(replacement.subject, p.canonical_subject);
    assert.equal(replacement.class_name, 'SS 1');
  }
});

test('No lesson or package record fabricates content approval or completed verification', () => {
  const p = packageSchema.parse(raw);
  assert.equal(p.package_status, 'PENDING');
  for (const lesson of p.lessons) {
    assert.equal(lesson.state.content_approval, 'PENDING', lesson.id);
    assert.equal(lesson.state.approval_reference, null, lesson.id);
    assert.equal(lesson.state.implementation, 'IMPLEMENTED', lesson.id);
    assert.equal(lesson.state.verification, 'DEFERRED', lesson.id);
    assert.equal(lesson.state.verification_reference, null, lesson.id);
  }
  for (const asset of p.assets) {
    assert.notEqual(asset.state.content_approval, 'APPROVED', asset.id);
    assert.equal(asset.state.approval_reference, null, asset.id);
    assert.equal(asset.state.verification, 'DEFERRED', asset.id);
    assert.equal(asset.state.verification_reference, null, asset.id);
  }
});

test('English source rules reject wrong hashes, missing/ambiguous anchors and preserve original characters', () => {
  const p = packageSchema.parse(raw);
  for (const rule of p.source_rules) {
    const following = rule.op === 'attach_stranded_label' ? '\n' + rule.following_anchor : '';
    const sourceText = 'prefix\n' + rule.anchor + following + '\nsuffix';
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-rule-guard-probe.docx',
      text: sourceText,
    };
    assert.throws(
      () => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]),
      /source mismatch/,
      'wrong source hash must fail: ' + rule.id,
    );
    assert.throws(
      () => applyRules({ ...input, text: 'anchor deliberately absent' }, [rule]),
      /anchor missing or ambiguous/,
      'missing anchor must fail: ' + rule.id,
    );
    assert.throws(
      () => applyRules({ ...input, text: rule.anchor + '\n' + rule.anchor }, [rule]),
      /anchor missing or ambiguous/,
      'repeated anchor must fail: ' + rule.id,
    );
    const transformed = applyRules(input, [rule]);
    const expected = rule.op === 'split_before' || rule.op === 'attach_stranded_label'
      ? 'prefix\nWEEK ' + rule.week_label + '\n' + rule.anchor + following + '\nsuffix'
      : sourceText;
    assert.equal(transformed, expected, 'rule must insert only its declared structural label: ' + rule.id);
  }
});

test('Regression examples retain the corrected English sound, rhyme and stress distinctions', () => {
  const p = packageSchema.parse(raw);
  const lessons = new Map(p.lessons.map(lesson => [lesson.id, lesson]));
  const phoneticsT1 = lessons.get('SUP-SS1-ENGLISH-PHONETICS-T1')?.body;
  const phoneticsT3 = lessons.get('SUP-SS1-ENGLISH-PHONETICS-T3')?.body;
  const consonants = lessons.get('SUP-SS1-ENGLISH-CONSONANTS-W07-T1')?.body;
  const stress = lessons.get('SUP-SS1-ENGLISH-STRESS-T3')?.body;
  assert(phoneticsT1 && phoneticsT3 && consonants && stress, 'required regression lessons must exist');
  assert(phoneticsT1.includes('/dʒ/ in judge'));
  assert(!phoneticsT1.includes('/dz/'));
  assert(phoneticsT3.includes('chief /tʃiːf/ and thief /θiːf/ contain /iː/'));
  assert(phoneticsT3.includes('Ride/site do not rhyme because /d/ and /t/ differ'));
  assert(consonants.split('\n').some(line => line.startsWith('| /ʃ/ |') && line.includes('| voiceless |')));
  assert(consonants.split('\n').some(line => line.startsWith('| /ʒ/ |') && line.includes('| voiced |')));
  assert(stress.includes('not a rule for every two-syllable word'));
  assert(stress.includes('Consent does not automatically shift'));
});


test('English source registration matches the exact three assigned archive members', () => {
  const p = packageSchema.parse(raw);
  const assigned = readFileSync(
    new URL('../../docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv', import.meta.url),
    'utf8',
  ).split(/\r?\n/)
    .filter(line => line.length > 0)
    .slice(1)
    .map(line => line.split(','))
    .filter(columns => columns[5] === 'english')
    .map(columns => ({
      source_id: columns[0],
      archive_member: columns[1],
      sha256: columns[2],
      term: columns[4],
    }))
    .sort((a, b) => a.source_id.localeCompare(b.source_id));
  const actual = p.sources.map(source => ({
    source_id: source.source_id,
    archive_member: source.archive_member,
    sha256: source.sha256,
    term: source.term,
  })).sort((a, b) => a.source_id.localeCompare(b.source_id));
  assert.equal(assigned.length, 3);
  assert.deepEqual(actual, assigned);
});

test('Every coverage entry resolves to a real source and target; equivalent coverage has an authored lesson', () => {
  const p = packageSchema.parse(raw);
  const sourceIds = new Set(p.sources.map(source => source.source_id));
  const lessonIds = new Set(p.lessons.map(lesson => lesson.id));
  const ruleIds = new Set(p.source_rules.map(rule => rule.id));
  const correctionIds = new Set(p.delivery_corrections.map(correction => correction.id));
  for (const coverage of p.coverage) {
    assert(sourceIds.has(coverage.source_id), 'unknown source: ' + coverage.id);
    assert(coverage.evidence.length > 0, 'missing evidence: ' + coverage.id);
    for (const target of coverage.lesson_ids) {
      const sourceBody = target.startsWith(coverage.source_id + ':BODY:');
      const marker = coverage.status === 'MARKER' && ruleIds.has(target);
      assert(
        lessonIds.has(target) || sourceBody || correctionIds.has(target) || marker,
        'unresolved target: ' + coverage.id + '/' + target,
      );
    }
    if (coverage.status === 'IMPLEMENTED_EQUIVALENT') {
      assert(
        coverage.lesson_ids.some(target => lessonIds.has(target)),
        'implemented-equivalent coverage lacks an authored lesson: ' + coverage.id,
      );
    }
    if (coverage.status === 'PARTIAL' || coverage.status === 'UNRESOLVED') {
      assert(
        p.open_items.some(item => item.affected_ids.includes(coverage.id)),
        'incomplete coverage lacks an explicit open item: ' + coverage.id,
      );
    }
    if (coverage.status === 'MARKER') {
      assert(
        coverage.lesson_ids.every(target => p.source_rules.some(rule =>
          rule.id === target && rule.source_id === coverage.source_id &&
          rule.op === 'classify_marker' && rule.kind === 'SCHEME_ONLY')),
        'marker coverage must target a same-source SCHEME_ONLY rule: ' + coverage.id,
      );
    }
  }
});

test('Previously incomplete composite topics now bind their complete same-term supplements', () => {
  const p = packageSchema.parse(raw);
  const adverbs = p.coverage.find(coverage => coverage.id === 'ENGLISH-T2-W07-TP01');
  const story = p.coverage.find(coverage => coverage.id === 'ENGLISH-T3-W06-SO03');
  assert(adverbs && story);
  assert.equal(adverbs.status, 'IMPLEMENTED_EQUIVALENT');
  assert(adverbs.lesson_ids.includes('SUP-SS1-ENGLISH-PRESENT-TENSE-T2-W07'));
  assert(adverbs.lesson_ids.includes('SUP-SS1-ENGLISH-ADVERBS-FEATURES-T2-W07'));
  assert.equal(story.status, 'IMPLEMENTED_EQUIVALENT');
  assert(story.lesson_ids.includes('SUP-SS1-ENGLISH-STORY-WRITING-T3-W06'));
});
