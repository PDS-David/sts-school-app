import { fileURLToPath } from 'node:url';
import path from 'node:path';
import packageData from './researched/basicTechnologyTerms1And2.json' with { type: 'json' };
import sourceManifest from './sourceManifest.json' with { type: 'json' };

export function buildBasicTechnologyTerms1And2ImportPlan() {
  const lessons = (packageData as any).lessons as any[];
  const existing = (sourceManifest as any).records.filter((row: any) =>
    row.subject === 'Basic Technology' && ['1st Term', '2nd Term'].includes(row.term));
  if (existing.length) {
    throw new Error(`Import plan refused: export now contains ${existing.length} Basic Technology first/second-term rows; reconcile before inserts.`);
  }
  const ids = lessons.map((lesson: any) => lesson.id);
  const termWeeks = lessons.map((lesson: any) => `${lesson.term}:${lesson.week}`);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate Basic Technology lesson IDs');
  if (new Set(termWeeks).size !== termWeeks.length) throw new Error('Duplicate Basic Technology term/week positions');
  return {
    plan_version: 'primary4-basic-technology-terms-1-2-insert-only-v1',
    write_mode: 'INSERT_ONLY_NO_UPDATE',
    requires_explicit_owner_approval: true,
    production_write_performed: false,
    class_name: 'Primary 4',
    subject_name: 'Basic Technology',
    source_manifest_version: (sourceManifest as any).schema_version,
    term_allocation: 'PROPOSED_LOCAL_SEQUENCE_NOT_STATED_BY_NERDC',
    provenance: (packageData as any).provenance,
    expected_existing_records: 0,
    topic_count: lessons.length,
    topics: lessons.map((lesson: any) => ({
      stable_key: lesson.id,
      class_name: 'Primary 4',
      subject_name: 'Basic Technology',
      term_label: lesson.term,
      order_index: lesson.week,
      title: lesson.title,
      source_reference: [
        `CURRICULUM_KEY: ${lesson.id}`,
        'PROVENANCE',
        'Material type: newly authored lessons based on NERDC Primary 4 Basic Technology topics.',
        'Curriculum reference: https://nerdc.gov.ng/content_manager/primary/pri4-6_basic_science_technology.pdf',
        'NERDC does not prescribe First-Term or Second-Term placement. This is a proposed local sequence for owner review.',
        `Content approval: ${(packageData as any).provenance.content_approval}. Pedagogical verification: ${(packageData as any).provenance.pedagogical_verification}.`,
        '',
        'LEARNING OBJECTIVES',
        ...lesson.objectives.map((item: string, i: number) => `${i + 1}. ${item}`),
        '',
        'LESSON NOTES',
        lesson.lesson,
        '',
        'EXAMPLES',
        ...lesson.examples.map((item: string) => `- ${item}`),
        '',
        'CLASS ACTIVITY',
        lesson.activity,
        '',
        'EVALUATION',
        ...lesson.evaluation.map((item: string, i: number) => `${i + 1}. ${item}`),
      ].join('\n'),
    })),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(buildBasicTechnologyTerms1And2ImportPlan(), null, 2)}\n`);
}
