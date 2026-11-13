import type { PoolClient } from 'pg';

export class TeacherAssignmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeacherAssignmentValidationError';
  }
}

export function normalizeTeacherSubjectIds(value: unknown): number[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) {
    throw new TeacherAssignmentValidationError('assigned_subject_ids must be an array of subject IDs.');
  }
  if (value.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
    throw new TeacherAssignmentValidationError('Every assigned_subject_id must be a positive integer.');
  }
  return [...new Set(value as number[])];
}

/**
 * Validate teacher assignments against the selected school using the same
 * transaction client that writes the user and teacher_subjects rows.
 */
export async function validateTeacherAssignments(
  client: PoolClient,
  schoolCode: string | null | undefined,
  assignedClass: string | null | undefined,
  subjectIds: number[],
): Promise<void> {
  if (typeof schoolCode !== 'string' || !schoolCode.trim()) {
    throw new TeacherAssignmentValidationError('A teacher must be assigned to a school.');
  }
  if (schoolCode !== schoolCode.trim()) {
    throw new TeacherAssignmentValidationError('The teacher school code must not contain surrounding whitespace.');
  }
  if (assignedClass !== null && assignedClass !== undefined && typeof assignedClass !== 'string') {
    throw new TeacherAssignmentValidationError('The assigned class must be text.');
  }
  if (typeof assignedClass === 'string' && assignedClass !== assignedClass.trim()) {
    throw new TeacherAssignmentValidationError('The assigned class must not contain surrounding whitespace.');
  }

  const { rows: schools } = await client.query(
    'SELECT 1 FROM schools WHERE code=$1',
    [schoolCode],
  );
  if (!schools.length) {
    throw new TeacherAssignmentValidationError('The selected teacher school does not exist.');
  }

  if (assignedClass?.trim()) {
    const { rows: classes } = await client.query(
      'SELECT 1 FROM classes WHERE school_code=$1 AND name=$2',
      [schoolCode, assignedClass],
    );
    if (!classes.length) {
      throw new TeacherAssignmentValidationError('The assigned class does not belong to the selected school.');
    }
  }

  if (subjectIds.length) {
    const { rows: subjects } = await client.query(
      'SELECT id FROM subjects WHERE school_code=$1 AND id=ANY($2::int[])',
      [schoolCode, subjectIds],
    );
    if (subjects.length !== subjectIds.length) {
      throw new TeacherAssignmentValidationError('Every assigned subject must belong to the selected school.');
    }
  }
}
