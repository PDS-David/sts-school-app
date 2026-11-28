// Pure helpers for the teacher Promote / Retain / Remove screen. Kept free of
// React Native imports so they can be unit-tested directly.

export interface PromotionClassUser {
  assigned_class?: string | null;
  assigned_class_names?: string[] | null;
}

export interface RosterStudent {
  id: string;
  class_name: string;
}

/** Physical classes a class teacher may process: the assigned_class anchor plus
 * any additional grants. Subject-only teachers (no assigned_class) get none. */
export function promotionClassOptions(user: PromotionClassUser | null | undefined): string[] {
  const anchor = user?.assigned_class?.trim();
  if (!anchor) return [];
  return [...new Set([anchor, ...(user?.assigned_class_names ?? [])]
    .filter((name): name is string => typeof name === 'string' && !!name.trim())
    .map(name => name.trim()))];
}

/** The class the screen is acting on. A single class is selected automatically;
 * with several, nothing is selected until the teacher chooses one. A selection
 * that is no longer one of the teacher's classes resolves to null. */
export function resolveSelectedClass(options: string[], selected: string | null): string | null {
  if (options.length === 1) return options[0];
  return selected && options.includes(selected) ? selected : null;
}

/** Defence in depth: keep only students that belong to the selected class. */
export function studentsInClass<T extends RosterStudent>(students: T[], className: string | null): T[] {
  return className ? students.filter(student => student.class_name === className) : [];
}

/** Decisions the server reports for the current academic year (GET /students → roster_decision). */
export interface DecisionState {
  roster_decision?: string | null;
  admin_only_promotion?: boolean;
}

export type TeacherRosterAction = 'retain' | 'promote' | 'remove';

/** Text for a student's standing decision this academic year, or null when undecided. */
export function decisionLabel(decision: string | null | undefined): string | null {
  switch (decision) {
    case 'retain': return 'Retained this academic year';
    case 'promote': return 'Promoted this academic year';
    case 'promoted_in': return 'Promoted into this class this academic year';
    case 'remove': return 'Removed this academic year';
    default: return null;
  }
}

/** The decision buttons to offer. A student who already has a decision this academic
 * year gets none (the server refuses a second one). Promotion into another school
 * (Primary 6 → JSS 1) is administrator-only, so it is never offered to the teacher. */
export function availableActions(student: DecisionState): TeacherRosterAction[] {
  if (decisionLabel(student.roster_decision)) return [];
  return student.admin_only_promotion ? ['retain', 'remove'] : ['retain', 'promote', 'remove'];
}

export const ADMIN_ONLY_PROMOTION_NOTE =
  'Promotion out of this class moves the student into another school, so an administrator does it. You can still retain or remove the student.';
