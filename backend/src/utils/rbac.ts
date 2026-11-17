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
  // Teachers use the app for physical-class report generation. They can
  // browse their assigned class roster and write only the class-teacher
  // remark that appears on the report. They do not enter scores/attendance,
  // manage learning content, send messages, or maintain student records.
  // The separate /students/:id/promotion and soft-delete routes preserve the
  // teacher's explicit runtime promote/demote/retain/remove decisions.
  teacher: [
    'students.read',
    'classRecord.write',
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
// Students may message: their class teacher, any subject teacher, any admin,
// their own parent(s), and their classmates (same class, same school) —
// NOT students in other classes/schools, and not unrelated staff.
export function canMessage(
  senderRole: Role,
  senderUserId: string,
  recipientId: string,
  senderAllowedRecipientIds?: string[]   // for students: precomputed allowed recipient ids
): boolean {
  if (senderRole === 'student') {
    return !!senderAllowedRecipientIds && senderAllowedRecipientIds.includes(recipientId);
  }
  // Parents, teachers, admin: can message anyone
  return true;
}
