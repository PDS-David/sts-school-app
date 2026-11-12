import path from 'node:path';
import sourceManifest from './sourceManifest.json' with { type: 'json' };
import homeEconomics12 from './researched/homeEconomicsTerms1And2.json' with { type: 'json' };
import homeEconomics3 from './researched/homeEconomicsTerm3Supplements.json' with { type: 'json' };
import basicScience3 from './researched/basicScienceTerm3.json' with { type: 'json' };
import basicTechnology12 from './researched/basicTechnologyTerms1And2.json' with { type: 'json' };

type PackageLesson = {
  id: string;
  term?: string;
  term_label?: string;
  week?: number;
  scheme_week?: number;
  title: string;
  objectives: string[];
  lesson: string;
  examples: string[];
  activity: string;
  evaluation: string[];
};
type LessonPackage = {
  package_id: string;
  class_name: string;
  subject_name: string;
  term_label?: string;
  provenance: Record<string, string>;
  lessons: PackageLesson[];
};
export type Primary4SupplementRecord = {
  stable_key: string;
  class_name: 'Primary 4';
  subject_name: string;
  term_label: string;
  order_index: number;
  title: string;
  source_reference: string;
  source_file: string;
  week_label: string;
};
export type Primary4IngestionRow = {
  filePath: string;
  className: string;
  termLabel: string;
  subjectName: string;
  weekLabel: string;
  orderIndex: number;
  title: string;
  sourceReference: string;
  preserveOrderIndex: true;
};

const packages = [
  homeEconomics12 as LessonPackage,
  homeEconomics3 as LessonPackage,
  basicScience3 as LessonPackage,
  basicTechnology12 as LessonPackage,
];
const manifestRecords = (sourceManifest as any).records as Array<{
  subject: string; class: string; term: string; order_index: number; title: string; source_reference: string;
}>;
const normalize = (value: unknown) => String(value ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en');
const bucketKey = (subject: string, term: string) => JSON.stringify(['Primary 4', subject, term]);

function sourceReference(pkg: LessonPackage, lesson: PackageLesson): string {
  const term = lesson.term ?? lesson.term_label ?? pkg.term_label ?? '';
  const sourceUrl = pkg.provenance.scheme_url ?? pkg.provenance.source_url ?? '';
  const termAllocation = pkg.provenance.term_allocation ?? 'AS_PUBLISHED_IN_LAGOS_STATE_SCHEME';
  return [
    `CURRICULUM_KEY: ${lesson.id}`,
    'PROVENANCE',
    `Package: ${pkg.package_id}`,
    `Material type: ${pkg.provenance.material_type}`,
    `Curriculum basis: ${pkg.provenance.scheme_basis ?? pkg.provenance.curriculum_basis ?? ''}`,
    `Curriculum source: ${sourceUrl}`,
    `Term allocation: ${termAllocation}`,
    pkg.provenance.source_note ?? pkg.provenance.database_export_finding ?? pkg.provenance.authoring_note ?? '',
    `Content approval: ${pkg.provenance.content_approval}. Pedagogical verification: ${pkg.provenance.pedagogical_verification}.`,
    '',
    `LESSON TITLE: ${lesson.title}`,
    `CLASS: Primary 4 | SUBJECT: ${pkg.subject_name} | TERM: ${term}`,
    '',
    'LEARNING OBJECTIVES',
    ...lesson.objectives.map((item, i) => `${i + 1}. ${item}`),
    '',
    'LESSON NOTES',
    lesson.lesson,
    '',
    'EXAMPLES',
    ...lesson.examples.map(item => `- ${item}`),
    '',
    'CLASS ACTIVITY',
    lesson.activity,
    '',
    'EVALUATION',
    ...lesson.evaluation.map((item, i) => `${i + 1}. ${item}`),
  ].join('\n');
}

export function assertPrimary4SupplementCorpus(): void {
  const stableKeys: string[] = [];
  for (const pkg of packages) {
    if (pkg.class_name !== 'Primary 4' || !pkg.subject_name || !pkg.provenance?.content_approval || !pkg.provenance?.pedagogical_verification) {
      throw new Error(`Invalid Primary 4 curriculum package metadata: ${pkg.package_id}`);
    }
    for (const lesson of pkg.lessons) {
      stableKeys.push(lesson.id);
      if (!lesson.title || lesson.objectives?.length < 2 || lesson.lesson?.length < 100 ||
          lesson.examples?.length < 2 || lesson.activity?.length < 20 || lesson.evaluation?.length < 3) {
        throw new Error(`Incomplete Primary 4 lesson package: ${lesson.id}`);
      }
      if (!lesson.term && !lesson.term_label && !pkg.term_label) {
        throw new Error(`Missing term label in Primary 4 lesson package: ${lesson.id}`);
      }
    }
  }
  if (new Set(stableKeys).size !== stableKeys.length) throw new Error('Duplicate stable key across Primary 4 researched lesson packages');
}

export function getPrimary4SupplementRecords(): Primary4SupplementRecord[] {
  assertPrimary4SupplementCorpus();
  const baseCounts = new Map<string, number>();
  for (const row of manifestRecords) {
    const key = bucketKey(row.subject, row.term);
    baseCounts.set(key, (baseCounts.get(key) ?? 0) + 1);
  }
  const packageOffsets = new Map<string, number>();
  const records: Primary4SupplementRecord[] = [];
  for (const pkg of packages) {
    for (const lesson of pkg.lessons) {
      const term = lesson.term ?? lesson.term_label ?? pkg.term_label!;
      const key = bucketKey(pkg.subject_name, term);
      const offset = (packageOffsets.get(key) ?? 0) + 1;
      packageOffsets.set(key, offset);
      const sourceFile = `P4-RESEARCHED-${lesson.id}.json`;
      records.push({
        stable_key: lesson.id,
        class_name: 'Primary 4',
        subject_name: pkg.subject_name,
        term_label: term,
        order_index: (baseCounts.get(key) ?? 0) + offset,
        title: lesson.title,
        source_reference: sourceReference(pkg, lesson),
        source_file: sourceFile,
        week_label: `WEEK ${lesson.week ?? lesson.scheme_week ?? offset}`,
      });
    }
  }
  return records;
}

export function primary4SupplementApprovalIssues(): string[] {
  return packages.flatMap(pkg => {
    const issues: string[] = [];
    if (pkg.provenance.content_approval !== 'APPROVED') issues.push(`${pkg.package_id}: content approval is ${pkg.provenance.content_approval}`);
    if (pkg.provenance.pedagogical_verification !== 'VERIFIED') issues.push(`${pkg.package_id}: pedagogical verification is ${pkg.provenance.pedagogical_verification}`);
    return issues;
  });
}

/** Add researched packages to the existing ingestTopics.ts audit/import plan.
 * The parsed source archive must still reproduce the exported rows exactly in
 * every affected bucket. New rows are appended, never used to renumber originals.
 */
export function buildPrimary4SupplementRows(
  existingRows: Array<{ className: string; subjectName: string; termLabel: string; title: string; sourceReference: string }>,
  root: string,
  schoolCode: string,
): Primary4IngestionRow[] {
  if (schoolCode !== 'primary') throw new Error('--primary4-reviewed is only valid with --school-code primary');
  const records = getPrimary4SupplementRecords();
  const affected = new Map<string, { subject: string; term: string }>();
  for (const record of records) affected.set(bucketKey(record.subject_name, record.term_label), { subject: record.subject_name, term: record.term_label });

  for (const { subject, term } of affected.values()) {
    const expected = manifestRecords.filter(row => row.subject === subject && row.term === term).length;
    const actual = existingRows.filter(row => row.className === 'Primary 4' && row.subjectName === subject && row.termLabel === term).length;
    if (actual !== expected) {
      throw new Error(`Primary 4 source archive mismatch for ${subject} / ${term}: parser found ${actual} rows; the exported database manifest has ${expected}. Reconcile the source archive before adding researched lessons.`);
    }
  }

  const rowsByBucket = new Map<string, typeof existingRows>();
  for (const row of existingRows) {
    const key = bucketKey(row.subjectName, row.termLabel);
    (rowsByBucket.get(key) ?? rowsByBucket.set(key, []).get(key)!).push(row);
  }
  for (const record of records) {
    const existing = rowsByBucket.get(bucketKey(record.subject_name, record.term_label)) ?? [];
    if (existing.some(row => normalize(row.title) === normalize(record.title))) {
      throw new Error(`Primary 4 researched lesson title collides with an existing source row: ${record.subject_name} / ${record.term_label} / ${record.title}`);
    }
    const bodyHash = normalize(record.source_reference);
    if (existing.some(row => normalize(row.sourceReference) === bodyHash)) {
      throw new Error(`Primary 4 researched lesson duplicates an existing source body: ${record.stable_key}`);
    }
  }

  return records.map(record => ({
    filePath: path.join(root, '__primary4_researched__', record.source_file),
    className: record.class_name,
    termLabel: record.term_label,
    subjectName: record.subject_name,
    weekLabel: record.week_label,
    orderIndex: record.order_index,
    title: record.title,
    sourceReference: record.source_reference,
    preserveOrderIndex: true,
  }));
}
