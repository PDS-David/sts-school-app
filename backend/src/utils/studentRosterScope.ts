import type { AuthUser } from '../types/index.js';

/** Class-teacher accounts keep assigned_class as their username anchor and may
 * carry additional class grants in assigned_class_names. Subject teachers
 * continue to use assigned_class_names only, with assigned_class null. */
export function assignedTeacherClasses(user: Pick<AuthUser, 'assigned_class' | 'assigned_class_names'>): string[] {
  return [...new Set([user.assigned_class, ...(user.assigned_class_names ?? [])]
    .filter((name): name is string => typeof name === 'string' && !!name.trim())
    .map(name => name.trim()))];
}

export interface CrossSchoolPromotion {
  fromSchool: string;
  fromClass: string;
  toSchool: string;
  toClass: string;
}

/**
 * Every promotion that moves a student into a DIFFERENT school code. This is
 * the single declaration of the application's school boundaries: the seeded
 * schools are `primary` (Pre-Nursery ... Primary 6) and `secondary`
 * (JSS 1 ... SS 3), so Primary 6 -> JSS 1 is the only crossing. Any promotion
 * not listed here stays inside the student's own school (the route looks the
 * next class up in the student's own school's class list). Crossing a school
 * boundary is administrator-only; adding an entry here extends that rule and
 * the tests that iterate this table automatically.
 */
export const CROSS_SCHOOL_PROMOTIONS: readonly CrossSchoolPromotion[] = [
  { fromSchool: 'primary', fromClass: 'Primary 6', toSchool: 'secondary', toClass: 'JSS 1' },
];

/** The declared cross-school promotion out of this placement, or null when promoting stays in the same school. */
export function crossSchoolPromotionFrom(schoolCode: string, className: string): CrossSchoolPromotion | null {
  return CROSS_SCHOOL_PROMOTIONS.find(p =>
    p.fromSchool === schoolCode && p.fromClass === className && p.toSchool !== p.fromSchool) ?? null;
}

export type StudentRosterScope =
  | { schoolCode: string | null; className: string | null }
  | { error: string; status: 400 | 403 };

function nonBlank(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

/** Resolve the school/class filters for GET /students. */
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
      if (requestedSchool && requestedSchool !== ownSchool) return { status: 403, error: "You can't browse student records outside your school." };
      return { schoolCode: ownSchool, className: requestedClass };
    }
    return { schoolCode: requestedSchool, className: requestedClass };
  }

  if (user.role === 'finance_admin') {
    const schoolCode = requestedSchool ?? nonBlank(user.school_code);
    if (!schoolCode) return { status: 400, error: 'school_code is required when a finance administrator searches student records.' };
    return { schoolCode, className: requestedClass };
  }

  if (user.role === 'teacher') {
    const schoolCode = nonBlank(user.school_code);
    const assignedClasses = assignedTeacherClasses(user);
    if (!schoolCode || !assignedClasses.length) {
      return { status: 403, error: 'Report access requires a teacher account assigned to a physical class. Contact the school administrator.' };
    }
    if (requestedClass && !assignedClasses.includes(requestedClass)) {
      return { status: 403, error: 'You can only browse students in your assigned physical classes.' };
    }
    // A multi-class teacher with no selected class receives the combined
    // assigned roster; the UI can then show both class names.
    const className = requestedClass ?? (assignedClasses.length === 1 ? assignedClasses[0] : null);
    return { schoolCode, className };
  }

  return { status: 403, error: 'Your account is not authorized to browse student rosters.' };
}


/** Return only the subjects explicitly granted to a subject teacher in one class. */
export function assignedTeacherSubjectsForClass(
  user: Pick<AuthUser, 'assigned_class_subjects' | 'school_code'>,
  className: string,
): number[] {
  return [...new Set((user.assigned_class_subjects ?? [])
    .filter(grant => grant.class_name === className && grant.school_code === user.school_code)
    .map(grant => Number(grant.subject_id))
    .filter(id => Number.isSafeInteger(id) && id > 0))];
}
