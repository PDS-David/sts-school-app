import assert from 'node:assert/strict';
import test from 'node:test';
import { renderSessionReportHtml } from '../../mobile/src/utils/reportTemplate.ts';

const brand = {
  code: 'primary' as const,
  name: 'Sow the Seed Nursery & Primary School',
  shortName: 'Nursery & Primary',
  motto: 'Growing in Wisdom',
  logo: 1,
  address: 'Olosan Road, Ibadan',
  phone: '+2348107551000',
};

test('session PDF shows expected subjects, missing marks and unentered attendance honestly', () => {
  const html = renderSessionReportHtml({
    student: { full_name: 'Student One', class_name: 'Primary 4', admission_number: 'P4-001' },
    academic_year: '2026/2027',
    terms: [{ name: '1st Term' }, { name: '2nd Term' }, { name: '3rd Term' }],
    terms_present: 3,
    is_complete_session: false,
    subjects: [
      { subject_name: 'English', term_scores: [{ total: 80 }, { total: 75 }, { total: 90 }], session_total: 245, session_average: 81.67, session_grade: 'A' },
      { subject_name: 'Mathematics', term_scores: [{ total: 70 }, { total: null }, { total: null }], session_total: null, session_average: null, session_grade: null },
    ],
    attendance: { days_opened: 0, days_present: null },
    summary: { subject_count: 1, expected_subject_count: 2, grand_total: 245, grand_average: null },
  }, brand);

  for (const expected of ['SESSION REPORT', 'Student One', 'T1', 'T2', 'T3', 'English', 'Mathematics', '245', 'Subjects expected', '2', 'Session in progress']) {
    assert.ok(html.includes(expected), `missing session report content: ${expected}`);
  }
  assert.ok(html.includes('<td>—</td>'), 'missing term marks must render as dashes');
  assert.ok(html.includes('Days Present (session)</td><td class="summary-value">—</td>'));
  assert.ok(html.includes('Session Average</td><td class="summary-value">—</td>'));
  assert.ok(html.includes('No scores have been entered yet.') === false, 'partially marked sessions are not described as wholly unmarked');
});

test('session PDF escapes student, school, subject and term labels', () => {
  const html = renderSessionReportHtml({
    student: { full_name: '<script>bad()</script>', class_name: 'Primary 1', admission_number: 'A-1' },
    academic_year: '2026/2027',
    terms: [{ name: '<img src=x>' }],
    terms_present: 0,
    is_complete_session: false,
    subjects: [{ subject_name: '<svg onload=bad()>', term_scores: [], session_total: null }],
    attendance: {},
    summary: {},
  }, { ...brand, name: '<script>school</script>' });

  assert.ok(html.includes('&lt;script&gt;bad()&lt;/script&gt;'));
  assert.ok(html.includes('&lt;script&gt;school&lt;/script&gt;'));
  assert.ok(html.includes('&lt;img src=x&gt;'));
  assert.ok(html.includes('&lt;svg onload=bad()&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img src=x>'));
});
