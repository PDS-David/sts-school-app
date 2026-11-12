import { fileURLToPath } from 'node:url';
import path from 'node:path';
import packageData from './researched/homeEconomicsTerm3Supplements.json' with { type: 'json' };
import sourceManifest from './sourceManifest.json' with { type: 'json' };

export function buildHomeEconomicsTerm3SupplementPlan() {
  const lessons = (packageData as any).lessons as any[];
  const existing = (sourceManifest as any).records.filter((row: any) =>
    row.subject === 'Home Economics' && row.term === '3rd Term');
  const existingTitles = new Set(existing.map((row: any) => String(row.title).trim().toLowerCase()));
  const maxOrder = Math.max(0, ...existing.map((row: any) => Number(row.order_index)));
  for (const lesson of lessons) {
    if (existingTitles.has(String(lesson.title).trim().toLowerCase())) {
      throw new Error(`Duplicate Home Economics third-term title: ${lesson.title}`);
    }
    if (Number(lesson.append_order_index) <= maxOrder) {
      throw new Error(`Supplement order collides with existing Primary 4 Home Economics third-term rows: ${lesson.id}`);
    }
  }
  const keys = lessons.map((lesson: any) => lesson.id);
  if (new Set(keys).size !== keys.length) throw new Error('Duplicate Home Economics third-term supplement IDs');
  return {
    plan_version: 'primary4-home-economics-term-3-insert-only-v1',
    write_mode: 'INSERT_ONLY_NO_UPDATE',
    requires_explicit_owner_approval: true,
    production_write_performed: false,
    class_name: 'Primary 4',
    subject_name: 'Home Economics',
    term_label: '3rd Term',
    existing_topic_rows: existing.length,
    existing_max_order_index: maxOrder,
    topic_count: lessons.length,
    provenance: (packageData as any).provenance,
    topics: lessons.map((lesson: any) => ({
      stable_key: lesson.id,
      class_name: 'Primary 4',
      subject_name: 'Home Economics',
      term_label: '3rd Term',
      order_index: lesson.append_order_index,
      title: lesson.title,
      source_reference: [
        `CURRICULUM_KEY: ${lesson.id}`,
      'PROVENANCE',
        'Material type: researched, newly authored supplement; not part of the supplied sewing source notes.',
        'Scheme basis: Lagos State Government Ministry of Education Unified Scheme of Work for Primary/Basic 4, transcribed by Syllabus.ng.',
        'Scheme reference: https://syllabus.ng/primary4-scheme-of-work/home-economics/',
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
  process.stdout.write(`${JSON.stringify(buildHomeEconomicsTerm3SupplementPlan(), null, 2)}\n`);
}
