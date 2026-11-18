import { z } from 'zod';

export const questionBankBoardSchema = z.enum(['WAEC', 'NECO', 'JAMB']);
export const questionBankSourceBoardSchema = z.enum(['WAEC', 'NECO', 'JAMB', 'GENERAL']);
export const questionBankRightsSchema = z.enum([
  'licensed', 'public_domain', 'original_generated',
  'reference_only', 'permission_pending', 'restricted', 'unknown',
]);

const optionSchema = z.object({
  key: z.string().trim().min(1).max(8),
  text: z.string().trim().min(1).max(2000),
});

export const ingestionQuestionSchema = z.object({
  board: questionBankBoardSchema,
  exam_year: z.number().int().min(1950).max(2100).nullable().optional(),
  subject_code: z.string().trim().min(2).max(40).regex(/^[A-Z0-9_-]+$/),
  paper: z.string().trim().min(1).max(160),
  question_number: z.string().trim().min(1).max(40),
  question_type: z.enum(['mcq', 'short_answer', 'essay']),
  stem: z.string().trim().min(5).max(12000),
  options: z.array(optionSchema).min(2).max(10).optional(),
  correct_answer: z.record(z.string(), z.unknown()),
  explanation: z.string().trim().min(5).max(12000),
  marks: z.number().positive().max(100),
  topic_slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/),
  source_locator: z.string().trim().max(1000).optional(),
  content_origin: z.enum(['past_question', 'ai_generated', 'original_authored']),
}).superRefine((question, ctx) => {
  if (question.question_type === 'mcq' && (!question.options || question.options.length < 2)) {
    ctx.addIssue({ code: 'custom', path: ['options'], message: 'MCQ questions require at least two options.' });
  }
  if (question.question_type !== 'mcq' && question.options !== undefined) {
    ctx.addIssue({ code: 'custom', path: ['options'], message: 'Only MCQ questions may include options.' });
  }
  if (question.content_origin === 'past_question' && !question.exam_year) {
    ctx.addIssue({ code: 'custom', path: ['exam_year'], message: 'Past questions require the actual examination year.' });
  }
  if (question.content_origin !== 'past_question' &&
      (question.exam_year != null || !question.question_number.startsWith('AI-GEN-') ||
       question.paper !== 'Original practice — not a past paper')) {
    ctx.addIssue({
      code: 'custom',
      path: ['content_origin'],
      message: 'Generated/original questions must have no exam year, use an AI-GEN question number, and be labelled as original practice.',
    });
  }
});

export const ingestionBatchSchema = z.object({
  batch_key: z.string().trim().min(3).max(120).regex(/^[A-Za-z0-9._:-]+$/),
  source_id: z.string().uuid(),
  questions: z.array(ingestionQuestionSchema).min(1).max(250),
});

export function rightsGate(
  source: { board: string; rights_status: string; rights_evidence: string | null; is_active: boolean },
  question: z.infer<typeof ingestionQuestionSchema>,
): string | null {
  if (!source.is_active) return 'The registered source is inactive.';
  if (source.board !== 'GENERAL' && source.board !== question.board) {
    return 'Question board does not match the registered source board.';
  }
  if (question.content_origin === 'past_question') {
    if (!['licensed', 'public_domain'].includes(source.rights_status)) {
      return 'Past-question text cannot be ingested: the source is not licensed for reuse or verified public domain.';
    }
    if (!source.rights_evidence || source.rights_evidence.trim().length < 12) {
      return 'Past-question ingestion requires documented rights evidence.';
    }
  } else if (source.rights_status !== 'original_generated') {
    return 'Original practice content must use a source registered as original_generated.';
  }
  return null;
}
