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
    `Rights status: ${pkg.provenance.rights_status ?? 'NOT_SPECIFIED'}`,
    `Curriculum basis: ${pkg.provenance.scheme_basis ?? pkg.provenance.curriculum_basis ?? ''}`,
    `Curriculum source: ${sourceUrl}`,
    ...(pkg.provenance.state_scheme_source ? [`State scheme source: ${pkg.provenance.state_scheme_source}`] : []),
    `Term allocation: ${termAllocation}`,
    pkg.provenance.source_note ?? pkg.provenance.database_export_finding ?? pkg.provenance.authoring_note ?? '',
    `Content approval: ${pkg.provenance.content_approval}. Pedagogical verification: ${pkg.provenance.pedagogical_verification}. Assessment rebuild: ${pkg.provenance.assessment_rebuild_status ?? 'PENDING'}.`,
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
    if (pkg.class_name !== 'Primary 4' || !pkg.subject_name || !pkg.provenance?.content_approval ||
        !pkg.provenance?.pedagogical_verification || !Array.isArray(pkg.lessons)) {
      throw new Error(`Invalid Primary 4 curriculum package metadata: ${pkg.package_id}`);
    }
    for (const lesson of pkg.lessons) {
      stableKeys.push(lesson.id);
      if (!lesson.id || !lesson.title || !Array.isArray(lesson.objectives) || lesson.objectives.length < 2 ||
          typeof lesson.lesson !== 'string' || lesson.lesson.length < 100 ||
          !Array.isArray(lesson.examples) || lesson.examples.length < 2 ||
          typeof lesson.activity !== 'string' || lesson.activity.length < 20 ||
          !Array.isArray(lesson.evaluation) || lesson.evaluation.length < 3) {
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

export async function refreshPrimary4PackageRows(
  query: (sql: string, params?: unknown[]) => Promise<{ rows: any[] }>,
  schoolCode: string,
  plannedRows: Array<{
    subject_id: number; class_name: string; term_label: string; title: string;
    source_reference: string; order_index: number; source_file: string;
  }>,
) {
  if (schoolCode !== 'primary') throw new Error('Primary 4 package refresh is only valid for the primary school.');
  if (!plannedRows.length) return { refreshedCount: 0, closedAssessmentCount: 0 };
  const { rows } = await query(
    `WITH planned AS (
       SELECT *
       FROM jsonb_to_recordset($2::jsonb) AS p(
         subject_id integer,
         class_name text,
         term_label text,
         title text,
         source_reference text,
         order_index integer,
         source_file text
       )
     ),
     stale AS MATERIALIZED (
       SELECT t.id, t.generated_assessment_id
       FROM topics t
       JOIN planned p
         ON p.subject_id=t.subject_id
        AND p.class_name=t.class_name
        AND p.term_label=t.term_label
        AND p.order_index=t.order_index
        AND p.title=t.title
        AND p.source_file=t.source_file
       WHERE t.school_code=$1
         AND t.class_name='Primary 4'
         AND t.source_file LIKE 'P4-RESEARCHED-%'
         AND t.source_reference IS DISTINCT FROM p.source_reference
     ),
     closed AS (
       UPDATE assessments a
       SET status='closed',
           content_fingerprint='__PRIMARY4_WITHDRAWN__:' || stale.id::text
       FROM stale
       WHERE a.id=stale.generated_assessment_id
         AND a.school_code=$1
         AND a.class_name='Primary 4'
       RETURNING a.id
     ),
     refreshed AS (
       UPDATE topics t
       SET source_reference=p.source_reference,
           summary=NULL,
           generated_assessment_id=NULL
       FROM planned p
       WHERE t.school_code=$1
         AND t.class_name='Primary 4'
         AND t.subject_id=p.subject_id
         AND t.term_label=p.term_label
         AND t.order_index=p.order_index
         AND t.title=p.title
         AND t.source_file=p.source_file
         AND t.source_file LIKE 'P4-RESEARCHED-%'
         AND t.source_reference IS DISTINCT FROM p.source_reference
       RETURNING t.id
     )
     SELECT (SELECT count(*) FROM refreshed) AS refreshed_count,
            (SELECT count(*) FROM closed) AS closed_assessment_count`,
    [schoolCode, JSON.stringify(plannedRows)],
  );
  return {
    refreshedCount: Number(rows[0]?.refreshed_count ?? 0),
    closedAssessmentCount: Number(rows[0]?.closed_assessment_count ?? 0),
  };
}

export function primary4SupplementApprovalIssues(): string[] {
  return packages.flatMap(pkg => {
    const issues: string[] = [];
    if (pkg.provenance.content_approval !== 'APPROVED') issues.push(`${pkg.package_id}: content approval is ${pkg.provenance.content_approval}`);
    if (pkg.provenance.pedagogical_verification !== 'VERIFIED') issues.push(`${pkg.package_id}: pedagogical verification is ${pkg.provenance.pedagogical_verification}`);
    if (pkg.provenance.assessment_rebuild_status !== 'VERIFIED') issues.push(`${pkg.package_id}: assessment rebuild is ${pkg.provenance.assessment_rebuild_status ?? 'PENDING'}`);
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
  if (schoolCode !== 'primary') throw new Error('--primary4-supplements is only valid with --school-code primary');
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
