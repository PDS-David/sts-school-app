import type { AuthUser, Role } from '../types/index.js';

/**
 * Authorization claims that must be read from the current database row.
 *
 * Access tokens are intentionally short-lived, but an administrator can
 * change a user's role, school, class, or subject assignments before a token
 * expires. Those changes must take effect on the very next authenticated
 * request rather than waiting for the client to refresh its JWT.
 */
export interface CurrentAuthClaims {
  username: string;
  role: Role;
  school_code: string | null;
  assigned_class: string | null;
  assigned_subject_ids: number[];
}

/**
 * Preserve the verified token subject while replacing every mutable
 * authorization attribute with its current database value.
 */
export function hydrateAuthUser(
  verifiedTokenUser: AuthUser,
  current: CurrentAuthClaims,
): AuthUser {
  return {
    id: verifiedTokenUser.id,
    username: current.username,
    role: current.role,
    school_code: current.school_code,
    assigned_class: current.assigned_class,
    assigned_subject_ids: [...current.assigned_subject_ids],
  };
}
