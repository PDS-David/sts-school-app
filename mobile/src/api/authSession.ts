export const RESTORABLE_USER_ROLES = [
  'student',
  'parent',
  'teacher',
  'admin',
  'finance_admin',
] as const;

export type RestorableUserRole = (typeof RESTORABLE_USER_ROLES)[number];

export interface RestorableUser {
  id: string;
  role: RestorableUserRole;
}

export function isRestorableUser(value: unknown): value is RestorableUser {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string'
    && candidate.id.trim().length > 0
    && RESTORABLE_USER_ROLES.includes(candidate.role as RestorableUserRole);
}
