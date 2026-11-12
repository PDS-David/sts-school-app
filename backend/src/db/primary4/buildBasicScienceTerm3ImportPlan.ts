import { fileURLToPath } from 'node:url';
import path from 'node:path';
import packageData from './researched/basicScienceTerm3.json' with { type: 'json' };
import sourceManifest from './sourceManifest.json' with { type: 'json' };

export function buildBasicScienceTerm3ImportPlan() {
  const lessons = (packageData as any).lessons as any[];
  const existing = (sourceManifest as any).records.filter((row: any) =>
    row.subject === 'Basic Science' && row.term === '3rd Term');
  if (existing.length) throw new Error(`Import plan refused: export now contains ${existing.length} Basic Science third-term rows; reconcile before inserts.`);
  const ids = lessons.map((lesson: any) => lesson.id);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate Basic Science third-term lesson IDs');
  return {
    plan_version: 'primary4-basic-science-term-3-insert-only-v1',
    write_mode: 'INSERT_ONLY_NO_UPDATE',
    requires_explicit_owner_approval: true,
    production_write_performed: false,
    class_name: 'Primary 4',
    subject_name: 'Basic Science',
    term_label: '3rd Term',
    source_manifest_version: (sourceManifest as any).schema_version,
    existing_topic_rows: 0,
    topic_count: lessons.length,
    provenance: (packageData as any).provenance,
    topics: lessons.map((lesson: any) => ({
      stable_key: lesson.id,
      class_name: 'Primary 4',
      subject_name: 'Basic Science',
      term_label: '3rd Term',
      order_index: lesson.week,
      title: lesson.title,
      source_reference: [
        `CURRICULUM_KEY: ${lesson.id}`,
      'PROVENANCE',
        'Material type: researched, newly authored lesson based on the NERDC Primary 4 Basic Science curriculum.',
        'Curriculum reference: https://nerdc.gov.ng/content_manager/primary/pri4-6_basic_science_technology.pdf',
        'The NERDC document does not prescribe this term placement; Third Term is a proposed local allocation for topics not found in the supplied Primary 4 Basic Science export.',
        'Content approval: PENDING OWNER REVIEW. Pedagogical verification: NOT YET INDEPENDENTLY VERIFIED.',
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
      ].join('\\n'),
    })),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(buildBasicScienceTerm3ImportPlan(), null, 2)}\\n`);
}
