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
  subjectName: z.enum(['English Language', 'Business Studies', 'Basic Technology', 'Basic Science', 'Mathematics', 'Home Economics', 'Physical & Health Education', 'Yoruba', 'Music', 'Agricultural Science', 'Civic Education', 'Cultural & Creative Arts', 'French', 'Social Studies']),
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
      if (gap.startsWith('WG-') && !['WG-AGRIC-EXCURSION', 'WG-MUSIC-W4-EXAMPLE', 'WG-AGRIC-PRICING', 'WG-CIVIC-ELECTIONS', 'WG-BUS-SL045', 'WG-BUS-SL046', 'WG-BUS-SL047', 'WG-BUS-SL048', 'WG-BUS-SL049', 'WG-BUS-SL050', 'WG-BUS-SL051', 'WG-BUS-SL052', 'WG-BUS-SL053', 'WG-BUS-SL054', 'WG-MATH-SL256', 'WG-MATH-SL260', 'WG-MATH-SL261', 'WG-ENG-SL198', 'WG-MATH-SL145', 'WG-MATH-SL150', 'WG-MATH-SL153', 'WG-MATH-SL244', 'WG-MATH-SL245', 'WG-MATH-SL252', 'WG-MATH-SL257', 'WG-MATH-SL247', 'WG-MATH-SL249', 'WG-MATH-SL250', 'WG-HE-SL536', 'WG-HE-SL541', 'WG-HE-SL542', 'WG-HE-SL547', 'WG-HE-SL551', 'WG-HE-SL556', 'WG-BT-SL359', 'WG-BT-SL360', 'WG-BT-SL444', 'WG-BT-SL447', 'WG-BT-SL448', 'WG-BT-SL454', 'WG-BT-SL457', 'WG-CCA-SL293', 'WG-CCA-SL295', 'WG-FR-SL282', 'WG-FR-SL285', 'WG-SS-SL433', 'WG-SS-SL434', 'WG-SS-SL435', 'WG-MUSIC-SL566', 'WG-MUSIC-SL567', 'WG-BT-SL356', 'WG-BT-SL357', 'WG-BT-SL445', 'WG-BUS-SL366', 'WG-MATH-SL146', 'WG-MATH-SL148', 'WG-MATH-SL149', 'WG-MATH-SL152', 'WG-MATH-SL154', 'WG-MATH-SL241', 'WG-MATH-SL243', 'WG-HE-SL549', 'WG-BS-SL024', 'WG-BS-SL278', 'WG-BS-SL279', 'WG-BS-SL465', 'WG-PHE-SL313', 'WG-PHE-SL583', 'WG-PHE-SL584', 'WG-AGRIC-SL005', 'WG-AGRIC-SL006', 'WG-AGRIC-SL008', 'WG-AGRIC-SL011', 'WG-AGRIC-SL229', 'WG-AGRIC-SL230', 'WG-AGRIC-SL234', 'WG-CIVIC-SL123', 'WG-CIVIC-SL127', 'WG-CIVIC-SL128', 'WG-CIVIC-SL386', 'WG-CIVIC-SL395', 'WG-CIVIC-SL404', 'WG-CIVIC-SL477', 'WG-CIVIC-SL486', 'WG-FR-SL066', 'WG-FR-SL067', 'WG-FR-SL069', 'WG-FR-SL070', 'WG-FR-SL071', 'WG-FR-SL072', 'WG-FR-SL073', 'WG-FR-SL074', 'WG-FR-SL075', 'WG-FR-SL281', 'WG-FR-SL283', 'WG-FR-SL284', 'WG-FR-SL286', 'WG-SS-SL081', 'WG-SS-SL432', 'WG-MUSIC-SL423', 'WG-MUSIC-SL424', 'WG-MUSIC-SL425', 'WG-MUSIC-SL427', 'WG-MUSIC-SL559', 'WG-MUSIC-SL561', 'WG-MUSIC-SL562', 'WG-CCA-SL294', 'WG-CCA-SL521', 'WG-CCA-SL523', 'WG-CCA-SL062', 'WG-CCA-SL063', 'WG-BS-SL266', 'WG-BS-SL275', 'WG-HE-SL554', 'WG-BS-SL020', 'WG-BS-SL022', 'WG-PHE-SL309', 'WG-PHE-SL311'].includes(gap)) {
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
