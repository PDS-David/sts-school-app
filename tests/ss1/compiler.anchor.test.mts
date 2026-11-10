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

test('English second-term revision scheme row 10 includes its row number in whole-line matching', () => {
  const english = loadPackages().find(item => item.subject_slug === 'english');
  assert(english, 'English package is missing');
  const rule = english.source_rules.find(item => item.id === 'SS1-SRC-d8bd8f85fd73-R012');
  assert(rule && rule.op === 'classify_marker');
  assert.equal(rule.kind, 'SCHEME_ONLY');
  assert.equal(rule.match_mode, 'WHOLE_LINE');
  assert.ok(rule.anchor.startsWith('10 WEEK 10:'));
});
