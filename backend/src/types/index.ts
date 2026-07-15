export type Role = 'student' | 'parent' | 'teacher' | 'admin';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
  school_code: string | null;
  assigned_class: string | null;
  assigned_subject_id: number | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
