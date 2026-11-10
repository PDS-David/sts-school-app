import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRules } from '../../backend/src/db/ss1/compiler.js';
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
