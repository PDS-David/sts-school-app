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
