import type { SchoolBrand } from '../schoolBranding';

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character] as string));
}

function display(value: unknown, fallback = '—'): string {
  return value === undefined || value === null || value === '' ? fallback : escapeHtml(value);
}

function formatNumber(value: unknown, digits = 1): string {
  if (value === undefined || value === null || value === '') return '—';
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return number.toFixed(digits);
}

function gradeClass(grade: unknown): string {
  const normalized = String(grade ?? '').trim().toUpperCase();
  if (normalized === 'A') return 'grade-a';
  if (normalized === 'B') return 'grade-b';
  if (normalized === 'C') return 'grade-c';
  return 'grade-other';
}

function reportClassLabel(value: unknown): string {
  const name = String(value ?? '').trim();
  const primary = /^Primary\s+(\d+)$/i.exec(name);
  if (primary) return `Grade ${primary[1]}`;
  const jss = /^JSS\s+(\d+)$/i.exec(name);
  if (jss) return `JSS${jss[1]}`;
  const ss = /^SS\s+(\d+)$/i.exec(name);
  if (ss) return `SS${ss[1]}`;
  return name;
}

function optionalNumber(value: unknown, digits = 1): string {
  return value === undefined || value === null || value === ''
    ? '—'
    : formatNumber(value, digits);
}

/**
 * Render the supplied Sow the Seed term-report format.
 * This is deliberately a pure function so the exact report structure can be
 * regression-tested without importing native Expo print/share modules.
 */
export function renderTermReportHtml(
  report: any,
  brand: SchoolBrand | null,
  logoDataUri = '',
): string {
  const student = report?.student ?? {};
  const term = report?.term ?? {};
  const summary = report?.summary ?? {};
  const attendance = report?.attendance ?? {};
  const classRecord = report?.class_record ?? {};
  const scores = Array.isArray(report?.scores) ? report.scores : [];
  const isPrimary = student.school_code === 'primary';
  const maxima = isPrimary
    ? { ca1: 20, ca2: 20, exam: 60 }
    : { ca1: 15, ca2: 15, exam: 70 };

  const daysOpened = Math.max(0, Number(attendance.days_opened) || 0);
  const hasAttendance = attendance.days_present !== undefined
    && attendance.days_present !== null && attendance.days_present !== '';
  const daysPresent = hasAttendance ? Math.max(0, Number(attendance.days_present) || 0) : null;
  const daysAbsent = hasAttendance && daysOpened > 0
    ? Math.max(0, daysOpened - (daysPresent ?? 0))
    : null;
  const attendanceRate = hasAttendance && daysOpened > 0
    ? ((daysPresent ?? 0) / daysOpened) * 100
    : null;
  const attendanceRateLabel = attendanceRate === null
    ? '—'
    : Number.isInteger(attendanceRate) ? String(attendanceRate) : attendanceRate.toFixed(1);

  const rows = scores.map((score: any) => `
    <tr>
      <td class="subject">${display(score.subject_name)}</td>
      <td>${formatNumber(score.ca1)}</td>
      <td>${formatNumber(score.ca2)}</td>
      <td>${formatNumber(score.exam)}</td>
      <td class="total">${formatNumber(score.total)}</td>
      <td class="${gradeClass(score.grade)}">${display(score.grade)}</td>
      <td>${optionalNumber(score.class_highest)}</td>
      <td>${optionalNumber(score.class_average, 2)}</td>
      <td>${display(score.teacher_remark)}</td>
    </tr>`).join('');

  const schoolName = brand?.name ?? '';
  const address = brand?.address ?? '';
  const phone = brand?.phone ?? '';
  const secondRemarkLabel = isPrimary ? "HEAD TEACHER'S REMARK" : "PRINCIPAL'S REMARK";
  const secondSignatureLabel = isPrimary ? "HEAD TEACHER'S SIGNATURE" : "PRINCIPAL'S SIGNATURE";
  const classTeacherRemark = classRecord.class_teacher_remark?.trim()
    ? escapeHtml(classRecord.class_teacher_remark)
    : '<span class="no-remark">No remark entered</span>';
  const secondRemark = classRecord.admin_remark?.trim()
    ? escapeHtml(classRecord.admin_remark)
    : '<span class="no-remark">No remark entered</span>';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @page { size: A4 portrait; margin: 7mm 7mm 6mm; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; color: #171717; font-family: Arial, Helvetica, sans-serif; }
  .report { width: 100%; }
  .masthead { display: grid; grid-template-columns: 1fr 28%; align-items: center; min-height: 68px; border-bottom: 2px solid #111; padding: 0 5px 6px; }
  .school { display: flex; align-items: center; gap: 9px; min-width: 0; }
  .logo { width: 58px; height: 58px; object-fit: contain; flex: 0 0 58px; }
  .school-copy { min-width: 0; }
  .school-name { font-family: Georgia, serif; font-size: 14px; font-weight: 700; line-height: 1.15; }
  .motto { font-family: Georgia, serif; font-size: 8px; font-style: italic; margin-top: 3px; color: #444; }
  .contact { font-size: 8px; margin-top: 3px; color: #555; }
  .doc-title { border-left: 1px solid #aaa; padding-left: 10px; text-align: right; }
  .doc-title .eyebrow { display: block; font-size: 8px; letter-spacing: 1.5px; color: #777; }
  .doc-title strong { display: block; font-family: Georgia, serif; font-size: 15px; margin-top: 2px; }
  .doc-title small { display: block; font-size: 9px; color: #555; margin-top: 2px; }
  .student-info { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; border: 1px solid #111; border-top: 0; }
  .student-info > div { min-width: 0; padding: 5px 7px 4px; border-right: 1px solid #aaa; }
  .student-info > div:last-child { border-right: 0; }
  .label { display: block; font-size: 7px; letter-spacing: .6px; font-weight: 700; color: #555; margin-bottom: 3px; }
  .value { display: block; font-size: 10px; font-weight: 700; overflow-wrap: anywhere; }
  .attendance { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid #111; border-top: 0; background: #f0f0f0; }
  .attendance > div { text-align: center; padding: 5px 3px 6px; border-right: 1px solid #bbb; }
  .attendance > div:last-child { border-right: 0; }
  .attendance .label { font-size: 7px; margin-bottom: 2px; }
  .attendance .value { font-family: Georgia, serif; font-size: 15px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; margin: 0; }
  .subjects { margin-top: 1px; }
  th { background: #050505; color: #fff; font-size: 7px; font-weight: 700; line-height: 1.1; padding: 5px 2px; border: 1px solid #555; }
  td { font-size: 8px; line-height: 1.05; text-align: center; padding: 4px 2px; border: 1px solid #d0d0d0; overflow-wrap: anywhere; }
  tbody tr:nth-child(even) { background: #f0f0f0; }
  th:nth-child(1), td:nth-child(1) { width: 25%; text-align: left; padding-left: 5px; }
  th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3) { width: 7%; }
  th:nth-child(4), td:nth-child(4), th:nth-child(5), td:nth-child(5) { width: 8%; }
  th:nth-child(6), td:nth-child(6) { width: 7%; }
  th:nth-child(7), td:nth-child(7), th:nth-child(8), td:nth-child(8) { width: 10%; }
  th:nth-child(9), td:nth-child(9) { width: 18%; }
  .total { font-weight: 800; }
  .grade-a, .grade-b, .grade-c, .grade-other { font-weight: 800; }
  .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; background: #eee; border: 1px solid #111; border-top: 0; }
  .summary > div { text-align: center; padding: 5px 3px; border-right: 1px solid #aaa; }
  .summary > div:last-child { border-right: 0; }
  .summary .label { font-size: 7px; margin-bottom: 2px; }
  .summary .value { font-family: Georgia, serif; font-size: 14px; }
  .key { border: 1px solid #111; border-top: 0; padding: 5px 6px; font-size: 7px; text-align: center; line-height: 1.3; }
  .remarks { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #111; border-top: 0; }
  .remarks > div { min-height: 82px; padding: 6px 8px 5px; }
  .remarks > div:first-child { border-right: 1px solid #aaa; }
  .remark-title { font-size: 7px; letter-spacing: .5px; font-weight: 700; color: #555; }
  .remark-body { min-height: 32px; padding-top: 7px; font-family: Georgia, serif; font-size: 9px; }
  .no-remark { color: #888; font-style: italic; }
  .signature { border-top: 1px solid #aaa; padding-top: 4px; font-size: 7px; letter-spacing: .3px; color: #555; }
  footer { display: flex; justify-content: space-between; align-items: center; background: #050505; color: #eee; padding: 6px 9px; font-size: 7px; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="report">
  <header class="masthead">
    <div class="school">
      ${logoDataUri ? `<img class="logo" src="${escapeHtml(logoDataUri)}" alt="" />` : ''}
      <div class="school-copy">
        <div class="school-name">${escapeHtml(schoolName)}</div>
        <div class="motto">${escapeHtml(brand?.motto ?? '')}</div>
        <div class="contact">${escapeHtml(address)}${address && phone ? ' | ' : ''}${escapeHtml(phone)}</div>
      </div>
    </div>
    <div class="doc-title">
      <span class="eyebrow">ACADEMIC REPORT</span>
      <strong>${display(term.name, '')}</strong>
      <small>${display(term.academic_year, '')}</small>
    </div>
  </header>

  <section class="student-info">
    <div><span class="label">STUDENT NAME</span><span class="value">${display(student.full_name, '')}</span></div>
    <div><span class="label">ADMISSION NO.</span><span class="value">${display(student.admission_number)}</span></div>
    <div><span class="label">CLASS</span><span class="value">${escapeHtml(reportClassLabel(student.class_name))}</span></div>
    <div><span class="label">TERM / SESSION</span><span class="value">${display(term.name, '')}, ${display(term.academic_year, '')}</span></div>
  </section>

  <section class="attendance">
    <div><span class="label">DAYS SCHOOL OPENED</span><span class="value">${daysOpened > 0 ? daysOpened : "—"}</span></div>
    <div><span class="label">DAYS PRESENT</span><span class="value">${display(daysPresent)}</span></div>
    <div><span class="label">DAYS ABSENT</span><span class="value">${display(daysAbsent)}</span></div>
    <div><span class="label">ATTENDANCE RATE</span><span class="value">${attendanceRateLabel}${attendanceRate === null ? "" : "%"}</span></div>
  </section>

  <table class="subjects">
    <thead><tr>
      <th>SUBJECT</th>
      <th>CA 1<br>(${maxima.ca1})</th>
      <th>CA 2<br>(${maxima.ca2})</th>
      <th>EXAM<br>(${maxima.exam})</th>
      <th>TOTAL<br>(100)</th>
      <th>GRADE</th>
      <th>HIGHEST<br>IN CLASS</th>
      <th>CLASS<br>AVERAGE</th>
      <th>REMARK</th>
    </tr></thead>
    <tbody>
      ${rows || '<tr><td colspan="9">No scores entered yet for this term.</td></tr>'}
    </tbody>
  </table>

  <section class="summary">
    <div><span class="label">TOTAL SCORE</span><span class="value">${formatNumber(summary.total_score)}</span></div>
    <div><span class="label">AVERAGE</span><span class="value">${formatNumber(summary.average)}%</span></div>
    <div><span class="label">SUBJECTS TAKEN</span><span class="value">${display(summary.subject_count, '0')}</span></div>
  </section>

  <section class="key">
    <strong>KEY:</strong>
    A 70–100 Excellent &nbsp; · &nbsp; B 60–69 Very Good &nbsp; · &nbsp; C 50–59 Good
    &nbsp; · &nbsp; D 45–49 Fair &nbsp; · &nbsp; E 40–44 Poor &nbsp; · &nbsp; F 0–39 Fail
  </section>

  <section class="remarks">
    <div>
      <div class="remark-title">CLASS TEACHER'S REMARK</div>
      <div class="remark-body">${classTeacherRemark}</div>
      <div class="signature">CLASS TEACHER'S SIGNATURE: ______________________________</div>
    </div>
    <div>
      <div class="remark-title">${secondRemarkLabel}</div>
      <div class="remark-body">${secondRemark}</div>
      <div class="signature">${secondSignatureLabel}: ______________________________</div>
    </div>
  </section>

  <footer>
    <span>${escapeHtml(schoolName)} · ${escapeHtml(address)}</span>
    <span>© ${display(term.academic_year, '')}</span>
  </footer>
</div>
</body>
</html>`;
}
