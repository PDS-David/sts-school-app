import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';
import packageData from '../../backend/src/db/ss1/subjects/french.json' with { type: 'json' };
import { packageSchema } from '../../backend/src/db/ss1/subjectPackageSchema.ts';
import { compilePackages } from '../../backend/src/db/ss1/compiler.ts';
import { createSs1FrenchDeliveryResolver } from '../../backend/src/utils/ss1FrenchDeliveryCorrection.ts';
import { parseTopics } from '../../backend/src/db/ingestTopics.ts';

const subject = packageSchema.parse(packageData);
const sourcePaths: Record<string, string | undefined> = {
  'SS1-SRC-945dfb24eaf6': process.env.SS1_FRENCH_T1_FILE,
  'SS1-SRC-b6245ffb69e5': process.env.SS1_FRENCH_T2_FILE,
  'SS1-SRC-8a2ec1fe30e3': process.env.SS1_FRENCH_T3_FILE,
};
const inputs = [];
for (const source of subject.sources) {
  const filePath = sourcePaths[source.source_id];
  if (!filePath) throw new Error('Missing extracted French source: ' + source.source_id);
  const bytes = await readFile(filePath);
  const extracted = await mammoth.extractRawText({ path: filePath });
  if (!extracted.value.trim()) throw new Error('Source extraction returned no text: ' + source.source_id);
  inputs.push({
    source_id: source.source_id,
    sha256: source.sha256,
    filePath: path.resolve(filePath),
    text: extracted.value,
    byteLength: bytes.byteLength,
  });
}
const plan = compilePackages([subject], inputs, parseTopics);
const originalRows = plan.identified_rows.filter(row => row.source_id !== null);
const supplements = plan.identified_rows.filter(row => row.source_id === null);
const byId = new Map(plan.identified_rows.map(row => [row.id, row]));
for (const correction of subject.delivery_corrections) {
  const original = byId.get(correction.source_lesson_id);
  const replacement = byId.get(correction.replacement_id);
  if (!original || original.source_id !== correction.source_id || original.body_sha256 !== correction.body_sha256) {
    throw new Error('Correction source identity does not match parsed source: ' + correction.id);
  }
  if (!replacement || replacement.source_id !== null) {
    throw new Error('Correction replacement does not match a compiled supplement: ' + correction.id);
  }
  if (original.row.termLabel !== replacement.row.termLabel) {
    throw new Error('Correction crosses term boundaries: ' + correction.id);
  }
}

const resolveFrench = createSs1FrenchDeliveryResolver(subject);
for (const correction of subject.delivery_corrections) {
  const original = byId.get(correction.source_lesson_id)!;
  const delivered = resolveFrench({
    school_code: 'secondary',
    class_name: 'SS 1',
    subject_name: 'French',
    term_label: original.row.termLabel,
    title: original.row.title,
    source_file: path.basename(original.row.filePath),
    source_reference: original.row.sourceReference,
  });
  if (!delivered || delivered.correctionId !== correction.id || delivered.replacementLessonIds[0] !== correction.replacement_id) {
    throw new Error('French student delivery adapter did not resolve exact source row: ' + correction.id);
  }
}
const missingSources = subject.sources.filter(source => !inputs.some(input => input.source_id === source.source_id));
if (missingSources.length) throw new Error('Unverified source inputs: ' + missingSources.map(s => s.source_id).join(', '));
const summary = {
  subject: subject.canonical_subject,
  sources: inputs.map(input => ({ source_id: input.source_id, extractedBytes: input.byteLength, parsedRows: plan.identified_rows.filter(row => row.source_id === input.source_id).length })),
  originalRowsParsed: originalRows.length,
  authoredSupplementsCompiled: supplements.length,
  correctionsBoundToExactSourceRows: subject.delivery_corrections.length,
  correctionsServedByStudentDeliveryAdapter: subject.delivery_corrections.length,
  coverageRecords: subject.coverage.length,
  packageStatus: subject.package_status,
  compilerBlockers: plan.blockers,
  compilerReady: plan.ready,
};
console.log(JSON.stringify(summary, null, 2));
if (originalRows.length === 0 || supplements.length !== subject.lessons.length) {
  throw new Error('French full-source compilation produced incomplete rows.');
}
