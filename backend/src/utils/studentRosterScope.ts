import type { AuthUser } from '../types/index.js';

export type StudentRosterScope =
  | { schoolCode: string | null; className: string | null }
  | { error: string; status: 400 | 403 };

function nonBlank(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

/**
 * Resolve the school/class filters for GET /students.
 *
 * Operations administrators may intentionally browse all schools. Finance
 * administrators may select either campus, but must select one explicitly.
 * Teachers are always pinned to their own school and, when assigned, class.
 * Missing teacher school assignment is a configuration error, never a reason
 * to fall back to an unfiltered cross-school roster.
 */
export function resolveStudentRosterScope(
  user: AuthUser,
  requested: { school_code?: string; class_name?: string },
): StudentRosterScope {
  const requestedSchool = nonBlank(requested.school_code);
  const requestedClass = nonBlank(requested.class_name);

  if (user.role === 'admin') {
    return { schoolCode: requestedSchool, className: requestedClass };
  }

  if (user.role === 'finance_admin') {
    const schoolCode = requestedSchool ?? nonBlank(user.school_code);
    if (!schoolCode) {
      return {
        status: 400,
        error: 'school_code is required when a finance administrator searches student records.',
      };
    }
    return { schoolCode, className: requestedClass };
  }

  if (user.role === 'teacher') {
    const schoolCode = nonBlank(user.school_code);
    if (!schoolCode) {
      return {
        status: 403,
        error: 'Your teacher account is not assigned to a school. Contact the school administrator.',
      };
    }
    return {
      schoolCode,
      className: nonBlank(user.assigned_class) ?? requestedClass,
    };
  }

  return {
    status: 403,
    error: 'Your account is not authorized to browse student rosters.',
  };
}
