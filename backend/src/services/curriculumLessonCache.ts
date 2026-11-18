import { createHash } from 'node:crypto';
import { query } from '../db/pool.js';
import {
  generateCurriculumLesson,
  validateCurriculumLesson,
  type CurriculumLesson,
  type CurriculumLessonInput,
} from './curriculumLessonGenerator.js';

export const CURRICULUM_LESSON_GENERATOR_VERSION = 'curriculum-lesson-v1';

export function curriculumLessonContextHash(input: CurriculumLessonInput): string {
  return createHash('sha256')
    .update(JSON.stringify({ version: CURRICULUM_LESSON_GENERATOR_VERSION, input }))
    .digest('hex');
}

function isMissingCacheTable(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === '42P01');
}

export async function getOrGenerateCurriculumLesson(args: {
  cacheKey: string;
  topicId?: number | null;
  input: CurriculumLessonInput;
  identity: { userId: string; role: string };
}): Promise<{ lesson: CurriculumLesson; cached: boolean; contextHash: string }> {
  if (!args.cacheKey.trim() || args.cacheKey.length > 240) {
    throw new Error('Invalid curriculum lesson cache key.');
  }

  const contextHash = curriculumLessonContextHash(args.input);
  let cacheAvailable = true;

  try {
    const { rows } = await query(
      'SELECT context_sha256, lesson_json FROM curriculum_generated_lessons WHERE cache_key=$1',
      [args.cacheKey],
    );
    const row = rows[0];
    if (row?.context_sha256 === contextHash && validateCurriculumLesson(row.lesson_json)) {
      return { lesson: row.lesson_json, cached: true, contextHash };
    }
  } catch (error) {
    if (!isMissingCacheTable(error)) throw error;
    // Keep learning available before the separately approved production migration is applied.
    cacheAvailable = false;
  }

  const lesson = await generateCurriculumLesson(args.input, args.identity);
  if (cacheAvailable) {
    await query(
      `INSERT INTO curriculum_generated_lessons
         (cache_key, topic_id, class_name, subject_name, term_label, topic_title,
          context_sha256, lesson_json, generator_version, generated_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,now(),now())
       ON CONFLICT (cache_key) DO UPDATE SET
         topic_id=EXCLUDED.topic_id,
         class_name=EXCLUDED.class_name,
         subject_name=EXCLUDED.subject_name,
         term_label=EXCLUDED.term_label,
         topic_title=EXCLUDED.topic_title,
         context_sha256=EXCLUDED.context_sha256,
         lesson_json=EXCLUDED.lesson_json,
         generator_version=EXCLUDED.generator_version,
         generated_at=now(),
         updated_at=now()`,
      [
        args.cacheKey,
        args.topicId ?? null,
        args.input.className,
        args.input.subject,
        args.input.term,
        args.input.topic,
        contextHash,
        JSON.stringify(lesson),
        CURRICULUM_LESSON_GENERATOR_VERSION,
      ],
    );
  }

  return { lesson, cached: false, contextHash };
}
