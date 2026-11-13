import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';

const raw = JSON.parse(readFileSync(new URL('../../backend/src/db/ss1/subjects/yoruba.json', import.meta.url), 'utf8'));
const p = packageSchema.parse(raw);
const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');

test('Yoruba package retains its three registered SS1 source terms and remains honestly pending', () => {
  assert.equal(p.subject_slug, 'yoruba');
  assert.equal(p.sources.length, 3);
  assert.deepEqual(p.sources.map(s => s.term).sort(), ['1st Term', '2nd Term', '3rd Term']);
  for (const source of p.sources) assert.equal(source.class_name, 'SS 1');
  assert.equal(p.package_status, 'PENDING');
  assert.ok(p.open_items.some(item => item.blocks_delivery));
});

test('Every Yoruba lesson has a unique ID, exact UTF-8 body hash and complete marking totals', () => {
  const ids = new Set<string>();
  for (const lesson of p.lessons) {
    assert(!ids.has(lesson.id), `duplicate lesson ID: ${lesson.id}`);
    ids.add(lesson.id);
    assert.equal(hash(lesson.body), lesson.body_sha256, lesson.id);
    assert.equal(lesson.subject, 'Yoruba');
    assert.equal(lesson.class_name, 'SS 1');
    assert(lesson.objectives.length > 0);
    assert(lesson.practice.length > 0);
    for (const question of lesson.practice) {
      assert(question.answer.trim().length > 0, question.id);
      assert.equal(question.marks, question.marking.reduce((sum, mark) => sum + mark.marks, 0), question.id);
      assert(question.marking.every(mark => mark.criterion.trim() && mark.marks > 0), question.id);
    }
  }
});

test('First-Term Weeks One to Five have EDE, ASA and LITIRESO drafts linked from coverage', () => {
  for (const week of ['W01', 'W02', 'W03', 'W04', 'W05']) {
    for (const strand of ['EDE', 'ASA', 'LIT']) {
      const lessonId = `SUP-SS1-YORUBA-T1-${week}-${strand}`;
      const lesson = p.lessons.find(item => item.id === lessonId);
      assert(lesson, `missing ${lessonId}`);
      assert(p.coverage.some(item => item.lesson_ids.includes(lessonId)), `no coverage link for ${lessonId}`);
    }
  }
  for (const strand of ['EDE', 'ASA']) {
    const lessonId = `SUP-SS1-YORUBA-T1-W06-${strand}`;
    assert(p.lessons.some(item => item.id === lessonId), `missing ${lessonId}`);
    assert(p.coverage.some(item => item.lesson_ids.includes(lessonId)), `no coverage link for ${lessonId}`);
  }
  const firstTermDrafts = p.lessons.filter(lesson => lesson.term === '1st Term');
  assert.equal(firstTermDrafts.length, 17);
});

test('Yoruba drafts preserve under-dotted letters, tone marks and the taught sound inventories', () => {
  const ede = p.lessons.find(lesson => lesson.id === 'SUP-SS1-YORUBA-T1-W02-EDE')!;
  for (const grapheme of ['ẹ', 'ọ', 'ṣ', 'ẹ̀', 'ọ́', 'á', 'à']) assert(ede.body.includes(grapheme), grapheme);
  for (const item of ['b, d, f, g, gb, h, j, k, l, m, n, p, r, s, ṣ, t, w, y', 'a, e, ẹ, i, o, ọ, u', 'an', 'ẹn', 'in', 'ọn', 'un']) {
    assert(ede.body.includes(item), item);
  }
  assert.match(ede.body, /IPA/);
});

test('Uncertain source wording is tracked instead of being silently repaired', () => {
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W02-ASA-LEXICAL-REVIEW' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W01-GREETING-LEXICON-REVIEW' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W03-ASA-PROVERB-REVIEW' && item.blocks_delivery));
  const asa = p.lessons.find(lesson => lesson.id === 'SUP-SS1-YORUBA-T1-W03-ASA')!;
  assert.match(asa.body, /àpẹẹrẹ tuntun tí a dá fún ẹ̀kọ́ yìí/);
  assert.match(asa.body, /kì í ṣe àsọyé pé wọ́n jẹ́ òwe àtijọ́/);
});

test('New lesson drafts are not misrepresented as approved or verified', () => {
  const drafts = p.lessons.filter(lesson => lesson.id.startsWith('SUP-SS1-YORUBA-T1-W'));
  assert.equal(drafts.length, 17);
  for (const lesson of drafts) {
    assert.equal(lesson.state.content_approval, 'PENDING', lesson.id);
    assert.equal(lesson.state.implementation, 'DRAFT', lesson.id);
    assert.equal(lesson.state.verification, 'DEFERRED', lesson.id);
    assert.equal(lesson.state.approval_reference, null);
    assert.equal(lesson.state.verification_reference, null);
    assert(lesson.provenance.every(source => source.reuse_status === 'PERMITTED'));
  }
});

test('Week Three vowel chart asset has a registered lesson, correct hash and exact byte count', () => {
  const asset = p.assets.find(item => item.id === 'YO-T1-W03-EDE-VOWEL-CHART-1');
  assert(asset);
  assert.equal(asset.lesson_id, 'SUP-SS1-YORUBA-T1-W03-EDE');
  assert.equal(asset.media_type, 'image/svg+xml');
  const bytes = readFileSync(new URL('../../backend/src/db/ss1/assets/yoruba/yoruba-t1-w03-vowel-chart.svg', import.meta.url));
  assert.equal(bytes.byteLength, asset.bytes);
  assert.equal(hash(bytes), asset.sha256);
  const svg = bytes.toString('utf8');
  assert.match(svg, /<title/);
  assert.match(svg, /<desc/);
  assert.match(svg, /ẹ/);
  assert.match(svg, /ọ/);
  assert.match(svg, /ẹn/);
  assert.match(svg, /ọn/);
});

test('Yoruba package retains explicit source-expert, visual and classroom verification gates', () => {
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W03-VOWEL-CHART-DELIVERY' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W04-CONSONANT-CHART' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W04-ASA-RECIPE-DETAIL' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W05-TONE-EXAMPLES' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W05-LIT-SET-TEXT' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W06-EDE-SYLLABIC-NASAL' && item.blocks_delivery));
  assert(p.open_items.some(item => item.id === 'YORUBA-T1-W06-ASA-PROVERB-REVIEW' && item.blocks_delivery));
});
