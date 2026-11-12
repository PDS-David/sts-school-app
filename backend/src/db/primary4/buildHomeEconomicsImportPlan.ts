import { fileURLToPath } from 'node:url';
import path from 'node:path';
import packageData from './researched/homeEconomicsTerms1And2.json' with { type: 'json' };
import sourceManifest from './sourceManifest.json' with { type: 'json' };

type Lesson = {
  id: string;
  term: '1st Term' | '2nd Term';
  week: number;
  title: string;
  objectives: string[];
  lesson: string;
  examples: string[];
  activity: string;
  evaluation: string[];
};

export function buildHomeEconomicsImportPlan() {
  const lessons = (packageData as { lessons: Lesson[] }).lessons;
  const existing = (sourceManifest as { records: Array<{ subject: string; term: string }> }).records
    .filter(row => row.subject === 'Home Economics' && ['1st Term', '2nd Term'].includes(row.term));
  if (existing.length) {
    throw new Error(`Import plan refused: export now contains ${existing.length} Home Economics first/second-term rows; reconcile before planning inserts.`);
  }
  const ids = lessons.map(lesson => lesson.id);
  const termWeeks = lessons.map(lesson => `${lesson.term}:${lesson.week}`);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate Home Economics lesson IDs');
  if (new Set(termWeeks).size !== termWeeks.length) throw new Error('Duplicate Home Economics term/week positions');
  const topics = lessons.map(lesson => ({
    stable_key: lesson.id,
    class_name: 'Primary 4',
    subject_name: 'Home Economics',
    term_label: lesson.term,
    order_index: lesson.week,
    title: lesson.title,
    source_reference: [
      `CURRICULUM_KEY: ${lesson.id}`,
      'PROVENANCE',
      'Material type: researched scheme sequence with newly authored teaching content.',
      'Scheme basis: Lagos State Government Ministry of Education Unified Scheme of Work for Primary/Basic 4, transcribed by Syllabus.ng.',
      'Scheme reference: https://syllabus.ng/primary4-scheme-of-work/home-economics/',
      'The original archive supplied for this assignment did not contain a Home Economics first- or second-term source document.',
      `Content approval: ${(packageData as any).provenance.content_approval}. Pedagogical verification: ${(packageData as any).provenance.pedagogical_verification}.`,
      '',
      'LEARNING OBJECTIVES',
      ...lesson.objectives.map((item, index) => `${index + 1}. ${item}`),
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
      ...lesson.evaluation.map((item, index) => `${index + 1}. ${item}`),
    ].join('\\n'),
  }));
  return {
    plan_version: 'primary4-home-economics-insert-only-v1',
    write_mode: 'INSERT_ONLY_NO_UPDATE',
    requires_explicit_owner_approval: true,
    production_write_performed: false,
    class_name: 'Primary 4',
    subject_name: 'Home Economics',
    source_manifest_version: (sourceManifest as { schema_version: string }).schema_version,
    provenance: (packageData as any).provenance,
    expected_existing_records: 0,
    topic_count: topics.length,
    topics,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(buildHomeEconomicsImportPlan(), null, 2)}\\n`);
}
