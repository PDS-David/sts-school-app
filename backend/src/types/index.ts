// 'finance_admin' is a deliberately separate path from 'admin' (Operations
// Admin): finance_admin can manage fee items/invoices and nothing else;
// admin can manage everything else (users, terms, subjects, scores oversight,
// audit log, AI-grading oversight) and nothing finance-related. Neither role
// inherits the other's access — see rbac.ts and routes/finance.ts.
export type Role = 'student' | 'parent' | 'teacher' | 'admin' | 'finance_admin';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
  school_code: string | null;
  assigned_class: string | null;
  assigned_subject_ids: number[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

