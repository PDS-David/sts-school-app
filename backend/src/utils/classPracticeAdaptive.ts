export type PracticeDifficulty = 'foundation' | 'standard' | 'challenge';

export type ConceptHistory = {
  concept: string;
  attempts: number;
  accuracy: number;
};

export type AdaptiveConceptTarget = {
  concept: string;
  attempts: number;
  accuracy: number;
  difficulty: PracticeDifficulty;
  focus: boolean;
};

export type GeneratedPracticeQuestion = {
  concept: string;
  difficulty: PracticeDifficulty;
  question: string;
  options: Array<{ key: string; text: string }>;
  correct_answer: string;
  explanation: string;
  marks: number;
};

export const cleanPracticeLabel = (value: unknown) =>
  String(value ?? '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');

/**
 * Weak concepts receive foundation-level questions. Concepts with a sustained
 * accuracy of at least 90% receive challenge questions; new or developing
 * concepts stay at the standard level rather than overreacting to one attempt.
 */
export function buildAdaptiveConceptTargets(
  allowedConcepts: string[],
  history: ConceptHistory[],
): AdaptiveConceptTarget[] {
  const historyByConcept = new Map(history.map(row => [cleanPracticeLabel(row.concept), row]));
  return allowedConcepts.map(concept => {
    const previous = historyByConcept.get(cleanPracticeLabel(concept));
    const attempts = Math.max(0, Math.floor(Number(previous?.attempts) || 0));
    const rawAccuracy = Number(previous?.accuracy);
    const accuracy = Number.isFinite(rawAccuracy) ? Math.min(1, Math.max(0, rawAccuracy)) : 0;
    const focus = attempts > 0 && accuracy < 0.7;
    const difficulty: PracticeDifficulty = focus
      ? 'foundation'
      : attempts >= 3 && accuracy >= 0.9
        ? 'challenge'
        : 'standard';
    return { concept, attempts, accuracy, difficulty, focus };
  });
}

export function validateGeneratedPracticeQuestions(
  value: unknown,
  targets: AdaptiveConceptTarget[],
): GeneratedPracticeQuestion[] {
  if (!Array.isArray(value) || value.length < 3 || value.length > 10) {
    throw new Error('The practice generator returned an invalid question count.');
  }
  const targetByConcept = new Map(targets.map(target => [cleanPracticeLabel(target.concept), target]));
  const questions = value.map((raw: any) => {
    const target = raw && typeof raw === 'object'
      ? targetByConcept.get(cleanPracticeLabel(raw.concept))
      : undefined;
    if (!raw || typeof raw !== 'object' || !target ||
        typeof raw.question !== 'string' || raw.question.trim().length < 10 ||
        !Array.isArray(raw.options) || raw.options.length !== 4 ||
        !raw.options.every((option: any) => option && typeof option.key === 'string' &&
          cleanPracticeLabel(option.key).length > 0 && typeof option.text === 'string' && option.text.trim().length > 0) ||
        new Set(raw.options.map((option: any) => cleanPracticeLabel(option.key))).size !== 4 ||
        typeof raw.correct_answer !== 'string' ||
        !raw.options.some((option: any) => cleanPracticeLabel(option.key) === cleanPracticeLabel(raw.correct_answer)) ||
        cleanPracticeLabel(raw.difficulty) !== target.difficulty ||
        typeof raw.explanation !== 'string' || raw.explanation.trim().length < 10 ||
        !Number.isFinite(Number(raw.marks)) || Number(raw.marks) <= 0 || Number(raw.marks) > 5) {
      throw new Error('The practice generator returned a malformed, out-of-lesson or incorrectly adapted question.');
    }
    return {
      concept: target.concept,
      difficulty: target.difficulty,
      question: raw.question.trim(),
      options: raw.options.map((option: any) => ({ key: option.key.trim(), text: option.text.trim() })),
      correct_answer: raw.correct_answer.trim(),
      explanation: raw.explanation.trim(),
      marks: Number(raw.marks),
    };
  });

  const weakConcepts = new Set(targets.filter(target => target.focus).map(target => cleanPracticeLabel(target.concept)));
  if (weakConcepts.size > 0) {
    const weakQuestionCount = questions.filter(question => weakConcepts.has(cleanPracticeLabel(question.concept))).length;
    const requiredWeakQuestionCount = Math.ceil(questions.length * 0.7);
    if (weakQuestionCount < requiredWeakQuestionCount) {
      throw new Error('The practice generator did not allocate at least 70% of questions to this student’s weak concepts.');
    }
  }
  return questions;
}
