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
  username: string;
  role: RestorableUserRole;
  school_code: string | null;
}

export function isRestorableUser(value: unknown): value is RestorableUser {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string'
    && candidate.id.trim().length > 0
    && typeof candidate.username === 'string'
    && candidate.username.trim().length > 0
    && (candidate.school_code === null || typeof candidate.school_code === 'string')
    && RESTORABLE_USER_ROLES.includes(candidate.role as RestorableUserRole)
    && (candidate.assigned_class === undefined || candidate.assigned_class === null || typeof candidate.assigned_class === 'string')
    && (candidate.pending_admin_review === undefined || typeof candidate.pending_admin_review === 'boolean');
}
