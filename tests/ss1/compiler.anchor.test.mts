import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRules, isSubjectLessonId } from '../../backend/src/db/ss1/compiler.js';
import { loadPackages } from '../../backend/src/db/ss1/loader.js';

const agriculture = loadPackages().find(item => item.subject_slug === 'agricultural-science');
if (!agriculture) throw new Error('Agricultural Science package is missing');
const marker = agriculture.source_rules.find(item => item.id === 'SS1-SRC-956594d97094-R003');
if (!marker || marker.op !== 'classify_marker') {
  throw new Error('Expected terminal Agricultural Science revision marker rule is missing');
}

test('source anchors tolerate DOCX extraction whitespace differences without changing content', () => {
  const extractedText = marker.anchor.replace(/\s+/gu, ' ');
  const input = {
    source_id: marker.source_id,
    sha256: marker.source_sha256,
    filePath: 'SSS 1/1st Term SS1_/Agricultural Science.docx',
    text: extractedText,
  };
  assert.equal(applyRules(input, [marker]), extractedText);
});

test('source anchors still reject missing and ambiguous matches', () => {
  const base = {
    source_id: marker.source_id,
    sha256: marker.source_sha256,
    filePath: 'SSS 1/1st Term SS1_/Agricultural Science.docx',
  };
  assert.throws(
    () => applyRules({ ...base, text: 'unrelated source text' }, [marker]),
    /anchor missing or ambiguous/,
  );
  assert.throws(
    () => applyRules({ ...base, text: marker.anchor + '\n' + marker.anchor }, [marker]),
    /anchor missing or ambiguous/,
  );
});

test('subject lesson IDs accept only the full slug or deterministic subject initials', () => {
  assert.equal(isSubjectLessonId('SUP-SS1-CC-T3-W10-TABLE-LAYING', 'catering-craft'), true);
  assert.equal(isSubjectLessonId('SUP-SS1-CATERING-CRAFT-T3-W10-TABLE-LAYING', 'catering-craft'), true);
  assert.equal(isSubjectLessonId('SUP-SS1-C-T3-W10-TABLE-LAYING', 'catering-craft'), false);
  assert.equal(isSubjectLessonId('SUP-SS1-FOOD-T1-W01-INTRO', 'food-and-nutrition'), false);
});

test('Chemistry terminal revision and examination entries are scheme-only markers', () => {
  const chemistry = loadPackages().find(item => item.subject_slug === 'chemistry');
  assert(chemistry, 'Chemistry package is missing');
  const markers = chemistry.source_rules.filter(item =>
    item.id === 'SS1-SRC-58b4a44c3afa-R002' || item.id === 'SS1-SRC-58b4a44c3afa-R003'
  );
  assert.equal(markers.length, 2);
  assert(markers.every(item => item.op === 'classify_marker' && item.kind === 'SCHEME_ONLY'));
});

test('Chemistry and Literature terminal scheme markers use whole-line matching', () => {
  const chemistry = loadPackages().find(item => item.subject_slug === 'chemistry');
  const literature = loadPackages().find(item => item.subject_slug === 'literature');
  assert(chemistry && literature);
  const chemistryMarkers = chemistry.source_rules.filter(item =>
    item.id === 'SS1-SRC-58b4a44c3afa-R002' || item.id === 'SS1-SRC-58b4a44c3afa-R003'
  );
  const literatureMarkers = literature.source_rules.filter(item =>
    item.op === 'classify_marker' && ['REVISION', 'EXAMINATION'].includes(item.anchor.trim().toUpperCase())
  );
  assert.equal(chemistryMarkers.length, 2);
  assert.equal(literatureMarkers.length, 4);
  assert([...chemistryMarkers, ...literatureMarkers].every(item =>
    item.op === 'classify_marker' && item.kind === 'SCHEME_ONLY' && item.match_mode === 'WHOLE_LINE'
  ));
});

test('English first-term revision scheme marker includes its row number in whole-line matching', () => {
  const english = loadPackages().find(item => item.subject_slug === 'english');
  assert(english, 'English package is missing');
  const rule = english.source_rules.find(item => item.id === 'SS1-SRC-a00657d42196-R028');
  assert(rule && rule.op === 'classify_marker');
  assert.equal(rule.match_mode, 'WHOLE_LINE');
  assert.match(rule.anchor, /^1 General Revision of Last Term's Examination;/);
  for (const [id, row] of [
    ['SS1-SRC-a00657d42196-R029', 2],
    ['SS1-SRC-a00657d42196-R030', 3],
    ['SS1-SRC-a00657d42196-R031', 4],
    ['SS1-SRC-a00657d42196-R032', 5],
    ['SS1-SRC-a00657d42196-R033', 6],
  ] as const) {
    const marker = english.source_rules.find(item => item.id === id);
    assert(marker && marker.op === 'classify_marker');
    assert.equal(marker.match_mode, 'WHOLE_LINE');
    assert.ok(marker.anchor.startsWith(`${row} `));
  }
});

test('English first-term scheme row 7 includes its row number in whole-line matching', () => {
  const english = loadPackages().find(item => item.subject_slug === 'english');
  assert(english, 'English package is missing');
  const rule = english.source_rules.find(item => item.id === 'SS1-SRC-a00657d42196-R034');
  assert(rule && rule.op === 'classify_marker');
  assert.equal(rule.kind, 'SCHEME_ONLY');
  assert.equal(rule.match_mode, 'WHOLE_LINE');
  assert.ok(rule.anchor.startsWith('7 Structures: Learning about Noun Clause;'));
});

test('English second-term scheme-only revision marker is disambiguated from its body heading by scheme context', () => {
  const english = loadPackages().find(item => item.subject_slug === 'english');
  assert(english, 'English package is missing');
  const rule = english.source_rules.find(item => item.id === 'SS1-SRC-d8bd8f85fd73-R012');
  assert(rule && rule.op === 'classify_marker');
  assert.equal(rule.kind, 'SCHEME_ONLY');
  assert.equal(rule.match_mode, undefined);
  assert.ok(rule.anchor.startsWith('WEEK 9:  COMPOSITION'));
  assert.ok(rule.anchor.includes('\nWEEK 10:  GENERAL REVISION CLASS [GRC]'));
  const input = {
    source_id: rule.source_id,
    sha256: rule.source_sha256,
    filePath: 'SSS 1/2nd Term SS1_/ENGLISH.docx',
    text: rule.anchor + '\n\nWEEK 1 SS1\nTOPIC: AFFIX\nWEEK 10: GENERAL REVISION CLASS [GRC]',
  };
  assert.equal(applyRules(input, [rule]), input.text);
});

test('English third-term Week 6 essay split includes its distinctive story-writing prompt', () => {
  const english = loadPackages().find(item => item.subject_slug === 'english');
  assert(english, 'English package is missing');
  const rule = english.source_rules.find(item => item.id === 'SS1-SRC-50fa9b1eb2fd-R011');
  assert(rule && rule.op === 'split_before');
  assert.equal(rule.week_label, '6');
  assert.ok(rule.anchor.includes("A story which illustrates the saying - \"It is a man's World\""));
  const input = {
    source_id: rule.source_id,
    sha256: rule.source_sha256,
    filePath: 'SSS 1/3rd Term SS1_/3RD TERM S1 ENGLISH LANGUAGE.doc',
    text: rule.anchor + '\n\nC. Essay Writing : Argumentative \nContent: Explanation',
  };
  assert.match(applyRules(input, [rule]), /^WEEK 6\n/);
});

test('English third-term multi-strand scheme markers use substring matching, not whole-line matching', () => {
  const english = loadPackages().find(item => item.subject_slug === 'english');
  assert(english, 'English package is missing');
  const cases = [
    ['SS1-SRC-50fa9b1eb2fd-R030', ' Vocabulary Development: Words associated with journalism and advertising.'],
    ['SS1-SRC-50fa9b1eb2fd-R031', ' Speech work: contrasting /i/ and /i:/.'],
    ['SS1-SRC-50fa9b1eb2fd-R032', ' Vocabulary Development: Words associated with Building.'],
  ] as const;
  for (const [id, suffix] of cases) {
    const rule = english.source_rules.find(item => item.id === id);
    assert(rule && rule.op === 'classify_marker');
    assert.equal(rule.kind, 'SCHEME_ONLY');
    assert.equal(rule.match_mode, undefined);
    const input = {
      source_id: rule.source_id,
      sha256: rule.source_sha256,
      text: rule.anchor + suffix,
    };
    assert.equal(applyRules(input, [rule]), input.text);
  }
});

test('Literature term-two and term-three scheme anchors bind the separate week and topic cells', () => {
  const literature = loadPackages().find(item => item.subject_slug === 'literature');
  assert(literature, 'Literature package is missing');
  const expected = [
    '1\n\n AFRICAN DRAMA : INRODUCTION TO HARVEST OF CORRUPTION',
    '2\n\nTHE BLOOD OF A STRANGER',
    '3\n\nAFRICAN POETRY : PIANO AND DRUMS',
    '4\n\nTHE DINING TABLE',
    '5\n\nTHE ANVIL AND THE HAMMER',
    '6\n\nNON AFRICAN DRAMA : OTHELLO',
    '7\n\nSHE STOOPS TO CONQUER BY OLIVER GOLDSMITH',
    '8\n\nNON AFRICAN POETRY : PULLEY',
    '9.\n\nTHE SCHOOL BOY BY WILLIAM BLAKE',
  ];
  for (const source of ['SS1-SRC-1728961e97b5', 'SS1-SRC-2422e423a240']) {
    for (let index = 0; index < expected.length; index++) {
      const id = source + '-R' + String(index + 3).padStart(3, '0');
      const rule = literature.source_rules.find(item => item.id === id);
      assert(rule && rule.op === 'classify_marker');
      assert.equal(rule.kind, 'SCHEME_ONLY');
      assert.equal(rule.anchor, expected[index]);
      assert.equal(rule.match_mode, undefined);
      const input = { source_id: rule.source_id, sha256: rule.source_sha256, text: rule.anchor };
      assert.equal(applyRules(input, [rule]), input.text);
    }
  }
});

test('Yoruba second-term Week 11 revision scheme row is classified as scheme-only', () => {
  const yoruba = loadPackages().find(item => item.subject_slug === 'yoruba');
  assert(yoruba, 'Yoruba package is missing');
  const rule = yoruba.source_rules.find(item => item.id === 'SS1-SRC-ec4a5095420d-R002');
  assert(rule && rule.op === 'classify_marker');
  assert.equal(rule.kind, 'SCHEME_ONLY');
});
