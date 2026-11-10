import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import WordExtractor from 'word-extractor';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';

const sourceId = 'SS1-SRC-f433169ca25c';
const sourceSha256 = 'fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59';
const file = process.env.SS1_CATERING_SOURCE_FILE;
const output = process.env.SS1_CATERING_IDENTITY_OUTPUT;
if (!file || !output) throw new Error('SS1_CATERING_SOURCE_FILE and SS1_CATERING_IDENTITY_OUTPUT are required');
const document = await new WordExtractor().extract(file);
const extractedText = document.getBody();
const topics = parseTopics(extractedText);
const number = (label: string) => {
  const value = label.match(/(?:week\s*[:.\-]*\s*)(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen)/i)?.[1]?.toLowerCase();
  const words: Record<string, string> = { one:'1', two:'2', three:'3', four:'4', five:'5', six:'6', seven:'7', eight:'8', nine:'9', ten:'10', eleven:'11', twelve:'12', thirteen:'13' };
  return value ? (words[value] ?? value) : null;
};
const matches = topics.filter(topic => number(topic.weekLabel) === '6');
if (matches.length !== 1) throw new Error('Expected exactly one parsed Week Six block; found ' + matches.length + '. Parsed labels: ' + topics.map(t => t.weekLabel).join(' | '));
const topic = matches[0];
const bodySha256 = createHash('sha256').update(topic.body, 'utf8').digest('hex');
const result = {
  source_id: sourceId,
  source_sha256: sourceSha256,
  week_label: topic.weekLabel,
  title: topic.title,
  body_sha256: bodySha256,
  source_lesson_id: sourceId + ':BODY:' + bodySha256,
  body_characters: topic.body.length,
  extracted_document_characters: extractedText.length,
  parsed_week_count: topics.length,
  parser: 'backend/src/db/ingestTopics.ts::parseTopics + word-extractor 1.0.4 getBody()',
  source_file: 'SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc'
};
writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
console.log(JSON.stringify(result));
