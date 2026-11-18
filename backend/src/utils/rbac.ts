import type { Role } from '../types/index.js';

// ── Permissions ───────────────────────────────────────────────────────────────
export const permissions: Record<Role, string[]> = {
  student: [
    'materials.read',
    'topics.read',
    'topics.complete',    // marking a topic done, and getting Brainee's summary/practice/assessment for it
    'assessments.take',
    'assessments.read',
    'results.read',
    'messages.read',
    'messages.write',     // student can message their teacher
    'weeklyEfforts.read',
  ],
  parent: [
    'materials.read',
    'topics.read',
    'results.read',
    'messages.read',
    'messages.write',
    'weeklyEfforts.read',
    'weeklyEfforts.feedback',
    'finance.read',
  ],
  // Teachers maintain academic records and reports for their assigned physical class.
  // They do not administer the independent student-learning/AI assessment system,
  // manage school-wide terms/classes or message users. They DO make start/end-of-session
  // placement decisions (promote/retain/remove/reinstate) for their own assigned class,
  // enforced in routes/students.ts POST /:id/promotion (role + class scope, not a permission).
  teacher: [
    'students.read', 'students.write',
    'grades.read', 'grades.write',
    'attendance.read', 'attendance.write',
    'classRecord.read', 'classRecord.write',
  ],
  admin: ['*'],   // full access — including questions.*, assessments.*,
                  // aiResults.read, and aiGrading.override, none of which
                  // are granted to any other role.
                  // Deliberately does NOT extend to finance: routes/finance.ts
                  // checks `req.user.role === 'admin'` explicitly and blocks
                  // it, rather than relying on requirePerm('finance.*') here,
                  // because the '*' wildcard above would otherwise satisfy
                  // any finance permission check too. See finance.ts for why.

  // A separate, non-overlapping path from 'admin' — manages fee items and
  // invoices and nothing else. Cannot read or write users, terms, subjects,
  // scores, attendance, materials, messages, or anything AI-related; 'admin'
  // (Operations Admin) in turn cannot read or write finance data. Needs
  // 'students.read' to look a student up when creating an invoice.
  finance_admin: ['finance.read', 'finance.write', 'students.read'],
};

export function hasPerm(role: Role, perm: string): boolean {
  const perms = permissions[role] ?? [];
  return perms.includes('*') || perms.includes(perm);
}

// ── Messaging rules ───────────────────────────────────────────────────────────
// NOTE: this is a simplified reference version. The authoritative check (which
// needs DB lookups for subject teachers/admins/parents) lives in
// routes/messages.ts → studentAllowedRecipients().
//
// Students may message their class/subject teachers, admins, parents and
// classmates within the documented scope. Parents and admins retain their
// existing messaging path. Teachers are report-only and cannot send messages.
export function canMessage(
  senderRole: Role,
  senderUserId: string,
  recipientId: string,
  senderAllowedRecipientIds?: string[]   // for students: precomputed allowed recipient ids
): boolean {
  if (senderRole === 'student') {
    return !!senderAllowedRecipientIds && senderAllowedRecipientIds.includes(recipientId);
  }
  // Teachers maintain physical-class records but do not send messages.
  if (senderRole === 'teacher') return false;
  return senderRole === 'parent' || senderRole === 'admin';
}
