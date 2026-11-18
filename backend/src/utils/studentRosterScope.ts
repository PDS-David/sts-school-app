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
 * Global administrators (school_code NULL) may browse all schools or select
 * a campus. School-bound administrators are pinned to their own school.
 * Finance administrators may select either campus, but must select one explicitly.
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
    if (user.can_manage_all_schools === true && !requestedSchool && !user.school_code) return { status: 400, error: 'Select a school before loading student records.' };
    if (requestedSchool && !['primary', 'secondary'].includes(requestedSchool)) return { status: 400, error: 'Invalid school_code.' };
    const ownSchool = nonBlank(user.school_code);
    if (ownSchool) {
      if (requestedSchool && requestedSchool !== ownSchool) {
        return {
          status: 403,
          error: "You can't browse student records outside your school.",
        };
      }
      return { schoolCode: ownSchool, className: requestedClass };
    }
    // Only an admin with school_code NULL is global and may choose a school
    // filter or browse across both schools.
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
    const assignedClass = nonBlank(user.assigned_class);
    const assignedClasses = assignedClass ? [assignedClass] : (user.assigned_class_names ?? []);
    if (!schoolCode || !assignedClasses.length) {
      return {
        status: 403,
        error: 'Report access requires a teacher account assigned to a physical class. Contact the school administrator.',
      };
    }
    if (requestedClass && !assignedClasses.includes(requestedClass)) {
      return {
        status: 403,
        error: 'You can only browse students in your assigned physical class.',
      };
    }
    return { schoolCode, className: assignedClass ?? requestedClass ?? null };
  }

  return {
    status: 403,
    error: 'Your account is not authorized to browse student rosters.',
  };
}
