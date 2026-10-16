/** Owner-authorised internet-equivalent teaching, separate from the original notes.
 * Explicit opt-in preserves reproducibility of the original-source audit.
 * Append-only within buckets preserves all existing topic and asset identities.
 */
import { createHash } from 'node:crypto';
import path from 'node:path';
import { z } from 'zod';
import { JSS3_FIRST_TERM_REVIEWED_SOURCES } from './jss3CurriculumResolutions.js';
import { JSS3_SECOND_TERM_REVIEWED_SOURCES } from './jss3SecondTermResolutions.js';
import { JSS3_THIRD_TERM_REVIEWED_SOURCES } from './jss3ThirdTermRedistribution.js';
import data from './data/jss3Supplements.json' with { type: 'json' };

const lessonSchema = z.object({
  id: z.string().regex(/^SUP-[A-Z0-9-]+$/),
  gapIds: z.array(z.string().regex(/^(EN[12]|PE|AK|TK|YO|WG)-[A-Z0-9-]+$/)).min(1),
  subjectName: z.enum(['English Language', 'Business Studies', 'Basic Technology', 'Mathematics', 'Physical & Health Education', 'Yoruba', 'Music', 'Agricultural Science']),
  termLabel: z.enum(['1st Term', '2nd Term']),
  title: z.string().min(5),
  body: z.string().min(500),
  sources: z.array(z.object({ title: z.string().min(3), url: z.string().url().startsWith('https://') }).strict()).min(1),
  origin: z.string().min(30),
}).strict();
export type Jss3Supplement = z.infer<typeof lessonSchema>;
export function validateJss3Supplements(input: unknown): Jss3Supplement[] {
  const lessons = z.array(lessonSchema).min(1).parse(input);
  const ids = new Set<string>();
  for (const lesson of lessons) {
    for (const gap of lesson.gapIds) {
      if (gap.startsWith('WG-') && !['WG-AGRIC-EXCURSION', 'WG-MUSIC-W4-EXAMPLE'].includes(gap)) {
        throw new Error(`Unregistered wider-workstream gap: ${gap}`);
      }
    }
    if (ids.has(lesson.id)) throw new Error(`Duplicate JSS3 supplement: ${lesson.id}`);
    ids.add(lesson.id);
    if (!/(?:practice|questions|assessment|ìbéèrè)/i.test(lesson.body)) throw new Error(`Missing learner task: ${lesson.id}`);
    if (!/(?:answers|marking|assessment|feedback|ìdáhùn)/i.test(lesson.body)) throw new Error(`Missing answer/assessment guide: ${lesson.id}`);
  }
  return lessons;
}
export const JSS3_SUPPLEMENTS = validateJss3Supplements(data);
export interface CurriculumRow {
  filePath: string; className: string; termLabel: string; subjectName: string;
  weekLabel: string; orderIndex: number; title: string; sourceReference: string;
}
export function buildJss3SupplementRows(original: readonly CurriculumRow[], root: string, schoolCode: string,
  input: unknown = JSS3_SUPPLEMENTS): CurriculumRow[] {
  if (schoolCode !== 'secondary') throw new Error('JSS3 supplements require --school-code secondary');
  const lessons = validateJss3Supplements(input);
  if (original.some(r => r.filePath.split(/[\\/]/).includes('__jss3_supplements__'))) {
    throw new Error('JSS3 supplements have already been added');
  }
  // Never silently add JSS3 to another class's source batch or an absent subject.
  for (const lesson of lessons) {
    if (!original.some(r => r.className === 'JSS 3' && r.subjectName === lesson.subjectName && r.termLabel === lesson.termLabel)) {
      throw new Error(`Supplement destination absent from original-source plan: ${lesson.id} / ${lesson.subjectName} / ${lesson.termLabel}`);
    }
  }
  return lessons.map(lesson => ({
    filePath: path.join(root, '__jss3_supplements__', `${lesson.id}.json`),
    className: 'JSS 3', termLabel: lesson.termLabel, subjectName: lesson.subjectName,
    weekLabel: `SUPPLEMENT ${lesson.id}`, orderIndex: 0, title: lesson.title,
    sourceReference: `${lesson.title}\n\n${lesson.origin}\nCoverage: ${lesson.gapIds.join(', ')}\n\n${lesson.body}\n\nReference resources (not the original school textbook):\n${lesson.sources.map(s => `${s.title}: ${s.url}`).join('\n')}`,
  }));
}
export const supplementBodyHash = (body: string) => createHash('sha256').update(body).digest('hex');

export function assertJss3SupplementCorpus(seen: readonly {termLabel: string; basename: string}[]): void {
  const actual = new Set(seen.map(s => JSON.stringify([s.termLabel, s.basename])));
  for (const [term, files] of [['1st Term', JSS3_FIRST_TERM_REVIEWED_SOURCES], ['2nd Term', JSS3_SECOND_TERM_REVIEWED_SOURCES], ['3rd Term', JSS3_THIRD_TERM_REVIEWED_SOURCES]] as const) {
    for (const file of files) {
      if (!actual.has(JSON.stringify([term, file]))) throw new Error(`Combined JSS3 source required for supplements: ${term} / ${file}`);
    }
  }
}
