import type { Role } from '../types/index.js';

// ── Permissions ───────────────────────────────────────────────────────────────
export const permissions: Record<Role, string[]> = {
  student: [
    'materials.read',
    'assessments.take',
    'assessments.read',
    'results.read',
    'messages.read',
    'messages.write',     // student can message their teacher
    'weeklyEfforts.read',
  ],
  parent: [
    'materials.read',
    'results.read',
    'messages.read',
    'messages.write',
    'weeklyEfforts.read',
    'weeklyEfforts.feedback',
    'finance.read',
  ],
  // A teacher's role on this platform is strictly: CRUD their own students
  // (via grades.write below — see students.ts), enter CA1/CA2/Exam scores
  // for their own subject/class, log Weekly Effort notes, post Materials
  // links, and generate report cards from that data.
  // Deliberately EXCLUDED, on purpose, not by omission: 'questions.*' and
  // 'assessments.*' (no teacher builds a test/quiz/essay prompt — that is
  // exclusively an admin or Brainee/AI responsibility), and the AI-results
  // permissions 'aiResults.read' / 'aiGrading.override' used in
  // routes/learning.ts — a teacher must never view or touch a grade Brainee
  // gave a student. Do not add any of these back for 'teacher'.
  teacher: [
    'materials.read',    'materials.write',
    'grades.read',       'grades.write',        'grades.export',
    'students.read',
    'weeklyEfforts.read','weeklyEfforts.write','weeklyEfforts.feedback',
    'messages.read',     'messages.write',
    'attendance.write',  'attendance.read',
    'classRecord.write', 'classRecord.read',
  ],
  admin: ['*'],   // full access — including questions.*, assessments.*,
                  // aiResults.read, and aiGrading.override, none of which
                  // are granted to any other role.
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
