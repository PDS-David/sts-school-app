import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import WordExtractor from 'word-extractor';
import packageData from '../../backend/src/db/ss1/subjects/catering-craft.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { compilePackages } from '../../backend/src/db/ss1/compiler.ts';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';

const packageValue = packageSchema.parse(packageData);
const sourceFiles: Record<string, string | undefined> = {
  'SS1-SRC-f433169ca25c': process.env.SS1_CATERING_T2_FILE,
  'SS1-SRC-d068ede78d16': process.env.SS1_CATERING_T3_FILE,
};
const extractor = new WordExtractor();
const inputs = [];
for (const source of packageValue.sources) {
  const filePath = sourceFiles[source.source_id];
  if (!filePath) throw new Error('Missing extracted source file for ' + source.source_id);
  const bytes = await readFile(filePath);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  if (actualHash !== source.sha256) throw new Error('Extracted member hash mismatch: ' + source.source_id);
  const document = await extractor.extract(filePath);
  inputs.push({
    source_id: source.source_id,
    sha256: source.sha256,
    filePath: path.resolve(filePath),
    text: document.getBody(),
  });
}
const plan = compilePackages([packageValue], inputs, parseTopics);
const relevantBlockers = plan.blockers.filter(blocker => !blocker.startsWith('MISSING_PACKAGE:'));
if (relevantBlockers.length) throw new Error('Catering Craft source compilation blocked:\n' + relevantBlockers.join('\n'));

const originalRows = plan.identified_rows.filter(row => row.source_id !== null);
const supplementRows = plan.identified_rows.filter(row => row.source_id === null);
for (const correction of packageValue.delivery_corrections) {
  const original = originalRows.find(row => row.id === correction.source_lesson_id);
  if (!original || original.body_sha256 !== correction.body_sha256) {
    throw new Error('Correction does not bind to the exact parsed source row: ' + correction.id);
  }
  if (!supplementRows.some(row => row.id === correction.replacement_id)) {
    throw new Error('Correction replacement is absent from compiled supplements: ' + correction.id);
  }
}
const result = {
  subject: packageValue.canonical_subject,
  sourceMembersVerified: inputs.length,
  originalRowsParsed: originalRows.length,
  authoredSupplementsCompiled: supplementRows.length,
  coverageRecordsValidated: packageValue.coverage.length,
  deliveryCorrectionsBound: packageValue.delivery_corrections.length,
  packageStatus: packageValue.package_status,
  automatedVerification: 'PASS',
  teacherVerification: packageValue.lessons.every(lesson => lesson.state.verification === 'VERIFIED')
    ? 'VERIFIED'
    : 'REMAINS_SEPARATE_AND_PENDING',
  rawSourceTextUploaded: false,
};
console.log(JSON.stringify(result, null, 2));
