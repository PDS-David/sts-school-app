/**
 * Single source of truth for who may print or export (PDF) a student report.
 *
 * Policy:
 *   - Operations Admin ('admin'):    may print and export.
 *   - Finance Admin ('finance_admin'): may print and export.
 *   - Parent:                         may print and export their wards' reports.
 *   - Teacher:                        may VIEW assigned-class reports, never print/export.
 *   - Student:                        may view own results, never print/export.
 *
 * This module is deliberately free of React Native imports so the policy can be
 * unit-tested under plain Node. Screens use it to decide whether to render the
 * Print/Export controls, their handlers re-check it, and utils/reportPdf.ts
 * refuses to print or export for any other role, so hiding a button is never
 * the only protection. Unknown, missing or future roles are denied.
 */
export const REPORT_PRINT_EXPORT_ROLES: readonly string[] = ['admin', 'finance_admin', 'parent'];

export function canPrintOrExportReports(role: string | null | undefined): boolean {
  return typeof role === 'string' && REPORT_PRINT_EXPORT_ROLES.includes(role);
}

export const REPORT_PRINT_EXPORT_DENIED_MESSAGE =
  'Your account is not permitted to print or export reports.';

export function assertCanPrintOrExportReports(role: string | null | undefined): void {
  if (!canPrintOrExportReports(role)) throw new Error(REPORT_PRINT_EXPORT_DENIED_MESSAGE);
}
