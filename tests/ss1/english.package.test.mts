// Drafted for the owner-authorised verification stage. DO NOT RUN in this implementation checkpoint.
// Run only when authorised:
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
    assert(!ids.has(lesson.id), `duplicate lesson id: ${lesson.id}`);
    ids.add(lesson.id);
    assert.equal(hash(lesson.body), lesson.body_sha256, `body hash: ${lesson.id}`);
    assert.equal(lesson.subject, 'English Language');
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0, `missing objectives: ${lesson.id}`);
    assert(lesson.practice.length > 0, `missing practice: ${lesson.id}`);
    assert(lesson.provenance.length > 0, `missing provenance: ${lesson.id}`);
    const practiceIds = new Set<string>();
    for (const question of lesson.practice) {
      assert(!practiceIds.has(question.id), `duplicate practice id: ${lesson.id}/${question.id}`);
      practiceIds.add(question.id);
      assert(question.question.trim().length > 0);
      assert(question.answer.trim().length > 0, `missing answer: ${lesson.id}/${question.id}`);
      assert(question.marking.length > 0, `missing marking guide: ${lesson.id}/${question.id}`);
      assert(question.marking.every(m => m.criterion.trim().length > 0 && Number.isInteger(m.marks) && m.marks > 0));
      assert.equal(question.marks, question.marking.reduce((total, criterion) => total + criterion.marks, 0));
    }
  }
});

test('All 24 correction records preserve exact source/body identity and bind a same-term replacement', () => {
  // This assertion is drafted, but its queue task remains PENDING until ENG-COR-001–008
  // and ENG-COR-018–020 are completed and their dependencies are reconciled.
  const p = packageSchema.parse(raw);
  assert.equal(p.delivery_corrections.length, 24);
  const correctionIds = new Set<string>();
  const originalTargets = new Set<string>();
  for (const correction of p.delivery_corrections) {
    assert(!correctionIds.has(correction.id), `duplicate correction id: ${correction.id}`);
    correctionIds.add(correction.id);
    assert(!originalTargets.has(correction.source_lesson_id), `duplicate correction target: ${correction.source_lesson_id}`);
    originalTargets.add(correction.source_lesson_id);
    const source = p.sources.find(s => s.source_id === correction.source_id);
    const replacement = p.lessons.find(l => l.id === correction.replacement_id);
    assert(source, `missing source: ${correction.id}`);
    assert(replacement, `missing replacement: ${correction.id}`);
    assert.equal(correction.source_sha256, source.sha256);
    assert.equal(correction.source_lesson_id, `${correction.source_id}:BODY:${correction.body_sha256}`);
    assert.equal(replacement.term, source.term, `cross-term replacement: ${correction.id}`);
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
    const following = rule.op === 'attach_stranded_label' ? `\\n${rule.following_anchor}` : '';
    const sourceText = `prefix\\n${rule.anchor}${following}\\nsuffix`;
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      filePath: 'synthetic-rule-guard-probe.docx',
      text: sourceText,
    };
    assert.throws(
      () => applyRules({ ...input, sha256: '0'.repeat(64) }, [rule]),
      /source mismatch/,
      `wrong source hash must fail: ${rule.id}`,
    );
    assert.throws(
      () => applyRules({ ...input, text: 'anchor deliberately absent' }, [rule]),
      /anchor missing or ambiguous/,
      `missing anchor must fail: ${rule.id}`,
    );
    assert.throws(
      () => applyRules({ ...input, text: `${rule.anchor}\\n${rule.anchor}` }, [rule]),
      /anchor missing or ambiguous/,
      `repeated anchor must fail: ${rule.id}`,
    );
    const transformed = applyRules(input, [rule]);
    const expected = rule.op === 'split_before' || rule.op === 'attach_stranded_label'
      ? `prefix\\nWEEK ${rule.week_label}\\n${rule.anchor}${following}\\nsuffix`
      : sourceText;
    assert.equal(transformed, expected, `rule must insert only its declared structural label: ${rule.id}`);
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
  assert.match(phoneticsT1, /\\/dʒ\\/ in judge/);
  assert.doesNotMatch(phoneticsT1, /\\/dz\\//);
  assert.match(phoneticsT3, /chief \\/tʃiːf\\/ and thief \\/θiːf\\/ contain \\/iː\\//);
  assert.match(phoneticsT3, /Ride\\/site do not rhyme because \\/d\\/ and \\/t\\/ differ/);
  assert.match(consonants, /\\| \\/ʃ\\/ \\|[^\\n]*\\| voiceless \\|/);
  assert.match(consonants, /\\| \\/ʒ\\/ \\|[^\\n]*\\| voiced \\|/);
  assert.match(stress, /not a rule for every two-syllable word/);
  assert.match(stress, /Consent does not automatically shift/);
});
