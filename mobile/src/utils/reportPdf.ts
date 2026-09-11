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
  @page { size: A4; margin: 12mm 10mm; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #1a1a1a; padding: 10px 16px; }
  .letterhead { text-align: center; margin-bottom: 8px; }
  .letterhead img { width: 84px; height: 84px; border-radius: 42px; }
  .school-name { font-size: 19px; font-weight: 800; color: #1565C0; margin: 6px 0 0; }
  .doc-subtitle { font-size: 12px; color: #555; margin: 2px 0 4px; }
  .contact-line { font-size: 10px; color: #666; margin: 0 0 8px; }
  .header-rule { border: none; border-top: 3px solid #1565C0; margin: 0 0 12px; }
  .motto { font-size: 11px; font-style: italic; color: #555; margin: 2px 0; }
  .doc-title { font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-top: 8px; }
  .info-block { margin-bottom: 12px; }
  .info-row { display: flex; margin-bottom: 4px; }
  .info-item { flex: 1; font-size: 13px; }
  .info-label { font-weight: 700; color: #1a1a1a; }
  .info-value { color: #444; margin-left: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; }
  th, td { border-bottom: 1px solid #eee; padding: 6px 4px; text-align: center; }
  th { background: #F2F6FC; color: #667; font-weight: 600; font-size: 10px; text-transform: uppercase; }
  th small, td.subhead { display: block; font-size: 9px; font-weight: 400; color: #99a; text-transform: none; }
  td:first-child, th:first-child { text-align: left; }
  td.total-cell { font-weight: 700; }
  .grade-A { color: #2E7D32; font-weight: 700; }
  .grade-B { color: #1565C0; font-weight: 700; }
  .grade-C { color: #B26A00; font-weight: 700; }
  .grade-other { color: #555; font-weight: 700; }
  .stats-row { display: flex; text-align: center; margin: 10px 0 4px; padding-top: 8px; border-top: 1px solid #eee; }
  .stat { flex: 1; }
  .stat-label { font-size: 11px; color: #777; margin-bottom: 2px; }
  .stat-value { font-size: 15px; font-weight: 800; color: #1a1a1a; }
  .summary-row td { padding: 3px 0; font-size: 12px; border-bottom: none; }
  .summary-label { color: #666; text-align: left; }
  .summary-value { font-weight: 700; text-align: right; }
  h3 { font-size: 13px; color: #1565C0; margin: 12px 0 6px; }
  .remark { font-size: 12px; margin: 4px 0; }
  .notice { font-size: 11px; color: #B26A00; margin-bottom: 12px; }
  .footer-note { font-size: 11px; color: #888; text-align: center; margin-top: 12px; }
`;

function gradeClass(grade: string | undefined): string {
  if (!grade) return 'grade-other';
  const g = grade.trim().toUpperCase();
  if (g === 'A') return 'grade-A';
  if (g === 'B') return 'grade-B';
  if (g === 'C') return 'grade-C';
  return 'grade-other';
}

// ── Term report card (MyResultsScreen's `report` shape) ─────────────────────
// Rebuilt to be an exact, one-page replica of the school's actual in-use
// report format (reference PDF Grace supplied, already commended by
// parents) — see: separate CA1/CA2 columns (not combined), a per-subject
// Position column, and an "Overall Position X out of Y students" stat
// alongside Total Score/Average. Position/overall position/class_size come
// from backend/src/routes/scores.ts's GET /report/:student_id.
//
// No separate motto line: confirmed with Grace that the crest image itself
// (brand.logo) already has the school's motto worked into the artwork —
// there's nothing else to render here beyond the logo displaying correctly.
//
// Attendance, Class Teacher/Head remarks, and "Next term begins" are
// deliberately NOT on this document — confirmed with Grace they don't
// belong here, to keep this an exact match of the reference and strictly
// one page. If a use for them resurfaces, it should be a separate report,
// not added back onto this one.
export async function buildTermReportHtml(report: any, brand: SchoolBrand | null): Promise<string> {
  const { student, term, scores, summary } = report;
  const logo = await logoDataUri(brand);
  const rows = (scores ?? []).map((s: any) => `
    <tr>
      <td>${escapeHtml(s.subject_name)}</td>
      <td>${escapeHtml(s.ca1)}</td>
      <td>${escapeHtml(s.ca2)}</td>
      <td>${escapeHtml(s.exam)}</td>
      <td class="total-cell">${escapeHtml(s.total)}</td>
      <td class="${gradeClass(s.grade)}">${escapeHtml(s.grade ?? '—')}</td>
      <td>${s.subject_position ?? '—'}</td>
      <td>${s.class_highest ?? '—'}</td>
      <td>${s.class_average ?? '—'}</td>
      <td>${s.subject_remark ? escapeHtml(s.subject_remark) : '-'}</td>
    </tr>`).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>${baseStyles}</style></head><body>
    <div class="letterhead">
      ${logo ? `<img src="${logo}" />` : ''}
      <div class="school-name">${escapeHtml(brand?.name ?? '')}</div>
      <div class="doc-subtitle">Student Report Card</div>
      ${(brand?.address || brand?.phone) ? `<div class="contact-line">📍 ${escapeHtml(brand?.address ?? '')}${brand?.address && brand?.phone ? ' | ' : ''}${brand?.phone ? `📞 ${escapeHtml(brand.phone)}` : ''}</div>` : ''}
    </div>
    <hr class="header-rule" />
    <div class="info-block">
      <div class="info-row">
        <div class="info-item"><span class="info-label">Student Name:</span><span class="info-value">${escapeHtml(student.full_name)}</span></div>
        <div class="info-item"><span class="info-label">Admission No:</span><span class="info-value">${escapeHtml(student.admission_number ?? '—')}</span></div>
      </div>
      <div class="info-row">
        <div class="info-item"><span class="info-label">Class:</span><span class="info-value">${escapeHtml(student.class_name)}</span></div>
        <div class="info-item"><span class="info-label">Term:</span><span class="info-value">${escapeHtml(term?.name ?? '')} ${escapeHtml(term?.academic_year ?? '')}</span></div>
      </div>
    </div>
    <table>
      <tr>
        <th>Subject</th>
        <th>CA1<small>(15)</small></th>
        <th>CA2<small>(15)</small></th>
        <th>Exam<small>(70)</small></th>
        <th>Total<small>(100)</small></th>
        <th>Grade</th>
        <th>Position</th>
        <th>Highest</th>
        <th>Average</th>
        <th>Remark</th>
      </tr>
      ${rows || '<tr><td colspan="10">No scores entered yet for this term.</td></tr>'}
    </table>
    <div class="stats-row">
      <div class="stat">
        <div class="stat-label">Overall Position</div>
        <div class="stat-value">${summary.overall_position ?? '—'}${summary.class_size ? ` out of ${summary.class_size} students` : ''}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Total Score</div>
        <div class="stat-value">${summary.total_score}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Average</div>
        <div class="stat-value">${summary.average}%</div>
      </div>
    </div>
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
