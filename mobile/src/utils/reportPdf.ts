import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import type { SchoolBrand } from '../schoolBranding';

// Print/Export is deliberately restricted to admin and parent — see the
// buttons in MyResultsScreen.tsx / SessionReportScreen.tsx, gated on
// `user?.role === 'admin' || user?.role === 'parent'`. This module itself
// has no role check; the two screens are the only call sites and they
// already gate who ever reaches this code, same as every other role
// restriction in this app (UI-level gating on top of data the backend
// already scopes correctly — a teacher/student simply never sees the button).

async function logoDataUri(brand: SchoolBrand | null): Promise<string> {
  if (!brand) return '';
  try {
    const asset = Asset.fromModule(brand.logo);
    await asset.downloadAsync();
    // Native: localUri is a file:// path the print WebView can load directly.
    // Web: require() already resolves to a static URL, so uri works as-is.
    return asset.localUri ?? asset.uri ?? '';
  } catch {
    return ''; // Missing/undownloadable logo shouldn't block the report — just omit it.
  }
}

function escapeHtml(v: unknown): string {
  return String(v ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ));
}

function shortTermLabel(name: string): string {
  const m = name.match(/^(\d)/);
  return m ? `T${m[1]}` : name;
}

const baseStyles = `
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1a1a1a; padding: 24px; }
  .letterhead { text-align: center; margin-bottom: 16px; }
  .letterhead img { width: 72px; height: 72px; border-radius: 36px; }
  .school-name { font-size: 18px; font-weight: 800; color: #1565C0; margin: 4px 0 0; }
  .motto { font-size: 11px; font-style: italic; color: #555; margin: 2px 0; }
  .doc-title { font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-top: 8px; }
  .student-bar { background: #1565C0; color: #fff; padding: 10px 14px; border-radius: 8px; margin-bottom: 12px; }
  .student-name { font-size: 16px; font-weight: 700; }
  .student-meta { font-size: 12px; opacity: 0.85; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 12px; }
  th, td { border-bottom: 1px solid #ddd; padding: 6px 4px; text-align: center; }
  th { background: #E3EFFD; color: #1565C0; }
  td:first-child, th:first-child { text-align: left; }
  .summary-row td { padding: 3px 0; font-size: 12px; border-bottom: none; }
  .summary-label { color: #666; text-align: left; }
  .summary-value { font-weight: 700; text-align: right; }
  h3 { font-size: 13px; color: #1565C0; margin: 16px 0 6px; }
  .remark { font-size: 12px; margin: 4px 0; }
  .notice { font-size: 11px; color: #B26A00; margin-bottom: 12px; }
  .footer-note { font-size: 11px; color: #888; text-align: center; margin-top: 20px; }
`;

// ── Term report card (MyResultsScreen's `report` shape) ─────────────────────
export async function buildTermReportHtml(report: any, brand: SchoolBrand | null): Promise<string> {
  const { student, term, scores, attendance, class_record, summary } = report;
  const logo = await logoDataUri(brand);
  const rows = (scores ?? []).map((s: any) => `
    <tr>
      <td>${escapeHtml(s.subject_name)}</td>
      <td>${Number(s.ca1) + Number(s.ca2)}</td>
      <td>${escapeHtml(s.exam)}</td>
      <td><b>${escapeHtml(s.total)}</b></td>
      <td>${escapeHtml(s.grade ?? '—')}</td>
      <td>${s.class_average ?? '—'}</td>
      <td>${s.class_highest ?? '—'}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>${baseStyles}</style></head><body>
    <div class="letterhead">
      ${logo ? `<img src="${logo}" />` : ''}
      <div class="school-name">${escapeHtml(brand?.name ?? '')}</div>
      <div class="motto">${escapeHtml(brand?.motto ?? '')}</div>
      <div class="doc-title">TERM REPORT CARD</div>
    </div>
    <div class="student-bar">
      <div class="student-name">${escapeHtml(student.full_name)}</div>
      <div class="student-meta">${escapeHtml(student.class_name)} &middot; Adm: ${escapeHtml(student.admission_number ?? '—')}</div>
    </div>
    <h3>${escapeHtml(term?.name ?? '')} — ${escapeHtml(term?.academic_year ?? '')}</h3>
    <table>
      <tr class="summary-row"><td class="summary-label">Days Opened</td><td class="summary-value">${attendance?.days_opened ?? 0}</td></tr>
      <tr class="summary-row"><td class="summary-label">Days Present</td><td class="summary-value">${attendance?.days_present ?? 0}</td></tr>
      <tr class="summary-row"><td class="summary-label">Subjects Taken</td><td class="summary-value">${summary.subject_count}</td></tr>
      <tr class="summary-row"><td class="summary-label">Total Score</td><td class="summary-value">${summary.total_score}</td></tr>
      <tr class="summary-row"><td class="summary-label">Average</td><td class="summary-value">${summary.average}%</td></tr>
    </table>
    <h3>Subject Scores &amp; Class Performance</h3>
    <table>
      <tr><th>Subject</th><th>CA</th><th>Exam</th><th>Total</th><th>Grade</th><th>Class Avg</th><th>Class High</th></tr>
      ${rows || '<tr><td colspan="7">No scores entered yet for this term.</td></tr>'}
    </table>
    ${(class_record?.class_teacher_remark || class_record?.admin_remark) ? `
      <h3>Remarks</h3>
      ${class_record?.class_teacher_remark ? `<div class="remark"><b>Class Teacher:</b> ${escapeHtml(class_record.class_teacher_remark)}</div>` : ''}
      ${class_record?.admin_remark ? `<div class="remark"><b>Head/Principal:</b> ${escapeHtml(class_record.admin_remark)}</div>` : ''}
    ` : ''}
    ${term?.next_term_begins ? `<div class="footer-note">Next term begins: ${escapeHtml(term.next_term_begins)}</div>` : ''}
    <div class="footer-note">Generated ${new Date().toLocaleString()} via STS School App</div>
  </body></html>`;
}

// ── Session report (SessionReportScreen's `report` shape) ───────────────────
export async function buildSessionReportHtml(report: any, brand: SchoolBrand | null): Promise<string> {
  const { student, academic_year, terms, terms_present, is_complete_session, subjects, attendance, summary } = report;
  const logo = await logoDataUri(brand);
  const termHeaders: string[] = (terms ?? []).map((t: any) => shortTermLabel(t.name));
  const rows = (subjects ?? []).map((s: any) => `
    <tr>
      <td>${escapeHtml(s.subject_name)}</td>
      ${(s.term_scores ?? []).map((ts: any) => `<td>${ts.total ?? '—'}</td>`).join('')}
      <td><b>${escapeHtml(s.session_total)}</b></td>
      <td>${escapeHtml(s.session_average)}</td>
      <td>${escapeHtml(s.session_grade ?? '—')}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>${baseStyles}</style></head><body>
    <div class="letterhead">
      ${logo ? `<img src="${logo}" />` : ''}
      <div class="school-name">${escapeHtml(brand?.name ?? '')}</div>
      <div class="motto">${escapeHtml(brand?.motto ?? '')}</div>
      <div class="doc-title">SESSION REPORT — ${escapeHtml(academic_year ?? '')}</div>
    </div>
    <div class="student-bar">
      <div class="student-name">${escapeHtml(student.full_name)}</div>
      <div class="student-meta">${escapeHtml(student.class_name)} &middot; Adm: ${escapeHtml(student.admission_number ?? '—')}</div>
    </div>
    ${!is_complete_session ? `<div class="notice">Session in progress — ${terms_present} of 3 terms recorded (${(terms ?? []).map((t: any) => t.name).join(', ')}). Totals reflect only the terms entered so far.</div>` : ''}
    <table>
      <tr class="summary-row"><td class="summary-label">Terms Recorded</td><td class="summary-value">${terms_present} / 3</td></tr>
      <tr class="summary-row"><td class="summary-label">Days Opened (session)</td><td class="summary-value">${attendance?.days_opened ?? 0}</td></tr>
      <tr class="summary-row"><td class="summary-label">Days Present (session)</td><td class="summary-value">${attendance?.days_present ?? 0}</td></tr>
      <tr class="summary-row"><td class="summary-label">Subjects</td><td class="summary-value">${summary.subject_count}</td></tr>
      <tr class="summary-row"><td class="summary-label">Session Grand Total</td><td class="summary-value">${summary.grand_total}</td></tr>
      <tr class="summary-row"><td class="summary-label">Session Average</td><td class="summary-value">${summary.grand_average}%</td></tr>
    </table>
    <h3>Subject Collation (1st + 2nd + 3rd Term)</h3>
    <table>
      <tr><th>Subject</th>${termHeaders.map((h) => `<th>${h}</th>`).join('')}<th>Total</th><th>Avg</th><th>Grade</th></tr>
      ${rows || `<tr><td colspan="${3 + termHeaders.length}">No scores recorded for any term in this session yet.</td></tr>`}
    </table>
    <div class="footer-note">Generated ${new Date().toLocaleString()} via STS School App</div>
  </body></html>`;
}

// ── Print (opens the OS/browser print dialog directly, no file produced) ────
export async function printReportHtml(html: string): Promise<void> {
  if (Platform.OS === 'web') {
    // expo-print's printToFileAsync isn't available on web, and printAsync's
    // web support varies by SDK version — the one thing every browser
    // reliably supports is opening a fresh tab with the document and calling
    // window.print() on it, which is exactly the ExportExcelScreen.tsx
    // precedent of branching web onto a plain-web-API path rather than
    // trusting an Expo module's web shim.
    const win = window.open('', '_blank');
    if (!win) throw new Error('Pop-up blocked — allow pop-ups for this site to print.');
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Some browsers fire `onload` before the write above has finished
    // painting; the fallback timer covers those without double-printing on
    // the browsers where onload already fired correctly (repeat
    // window.print() calls on an already-open print dialog are a no-op).
    win.onload = () => win.print();
    setTimeout(() => win.print(), 300);
    return;
  }
  await Print.printAsync({ html });
}

// ── Export (produces an actual file to save/share — Drive, WhatsApp, etc.) ──
export async function exportReportHtml(html: string, filenameBase: string): Promise<void> {
  if (Platform.OS === 'web') {
    // No native filesystem/share sheet on web — the print dialog's own
    // "Save as PDF" destination is the export path there, same document the
    // user already sees for Print. Route Export to the same flow rather
    // than silently no-op-ing on web.
    return printReportHtml(html);
  }
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) throw new Error('Sharing is not available on this device.');
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${filenameBase}.pdf`,
    UTI: 'com.adobe.pdf',
  });
}
