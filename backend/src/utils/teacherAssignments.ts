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

/**
 * Approval gate (audit D3): a pending teacher may only be approved when the
 * role-appropriate allocation is present and valid, so approval never makes an
 * incompletely configured teacher operational. Must run on the same
 * transaction client that locks the user row and clears the pending flag.
 *
 *  - class teacher (has a primary class): the class must exist in the
 *    teacher's school; no subject grants are required;
 *  - subject teacher (no primary class): at least one class, one subject and
 *    one valid class/subject grant, the same minimum POST and PUT enforce.
 */
export async function assertTeacherReadyForApproval(
  client: PoolClient,
  userId: string,
  schoolCode: string | null | undefined,
  assignedClass: string | null | undefined,
  assignedClassNames: string[] | null | undefined,
): Promise<void> {
  if (assignedClass?.trim()) {
    await validateTeacherAssignments(client, schoolCode, assignedClass, []);
    return;
  }

  const classNames = [...new Set((assignedClassNames ?? []).map((name) => name))];
  const { rows: subjectRows } = await client.query(
    'SELECT subject_id FROM teacher_subjects WHERE user_id=$1',
    [userId],
  );
  const subjectIds = subjectRows.map((row) => Number(row.subject_id));
  if (!classNames.length || !subjectIds.length) {
    throw new TeacherAssignmentValidationError(
      'A subject teacher must have at least one assigned class and one assigned subject before approval.',
    );
  }

  await validateTeacherAssignments(client, schoolCode, null, subjectIds);
  const { rows: classRows } = await client.query(
    'SELECT name FROM classes WHERE school_code=$1 AND name=ANY($2::text[])',
    [schoolCode, classNames],
  );
  if (classRows.length !== classNames.length) {
    throw new TeacherAssignmentValidationError('Every assigned class must belong to the teacher\'s school before approval.');
  }

  const { rows: grants } = await client.query(
    `SELECT count(*)::int AS n
     FROM teacher_class_subjects tcs
     JOIN classes c ON c.id=tcs.class_id
     JOIN teacher_subjects ts ON ts.user_id=tcs.user_id AND ts.subject_id=tcs.subject_id
     WHERE tcs.user_id=$1 AND c.school_code=$2 AND c.name=ANY($3::text[])`,
    [userId, schoolCode, classNames],
  );
  if (!grants[0]?.n) {
    throw new TeacherAssignmentValidationError(
      'A subject teacher must have at least one valid class/subject assignment before approval.',
    );
  }
}
