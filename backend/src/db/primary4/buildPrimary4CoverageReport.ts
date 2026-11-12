import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sourceManifest from './sourceManifest.json' with { type: 'json' };
import homeEconomics12 from './researched/homeEconomicsTerms1And2.json' with { type: 'json' };
import homeEconomics3 from './researched/homeEconomicsTerm3Supplements.json' with { type: 'json' };
import basicScience3 from './researched/basicScienceTerm3.json' with { type: 'json' };

export function buildPrimary4CoverageReport() {
  const subjects = (sourceManifest as any).expected_subjects as string[];
  const terms = (sourceManifest as any).expected_terms as string[];
  const records = (sourceManifest as any).records as any[];
  const packages = [
    ...(homeEconomics12 as any).lessons.map((lesson: any) => ({ subject: 'Home Economics', term: lesson.term })),
    ...(homeEconomics3 as any).lessons.map(() => ({ subject: 'Home Economics', term: '3rd Term' })),
    ...(basicScience3 as any).lessons.map(() => ({ subject: 'Basic Science', term: '3rd Term' })),
  ];
  const matrix = subjects.flatMap(subject => terms.map(term => {
    const existing = records.filter(row => row.subject === subject && row.term === term);
    const researched = packages.filter(row => row.subject === subject && row.term === term).length;
    let status = existing.length ? 'SOURCE_ROWS_PRESENT_REVIEW_REQUIRED' : 'MISSING';
    if (subject === 'Basic Technology' && ['1st Term', '2nd Term'].includes(term)) {
      status = 'NO_SEPARATE_TERM_ASSIGNMENT_FOUND';
    } else if (subject === 'Basic Science' && term === '3rd Term' && researched) {
      status = 'RESEARCHED_PROPOSED_TERM_ALLOCATION';
    } else if (subject === 'Home Economics' && ['1st Term', '2nd Term'].includes(term) && researched) {
      status = 'RESEARCHED_PACKAGE_PENDING_APPROVAL';
    } else if (subject === 'Home Economics' && term === '3rd Term' && researched) {
      status = 'SOURCE_ROWS_PLUS_RESEARCHED_SUPPLEMENTS';
    }
    return {
      subject,
      term,
      status,
      existing_export_rows: existing.length,
      researched_lessons_prepared: researched,
      total_planned_lessons: existing.length + researched,
    };
  }));
  return {
    report_version: 'primary4-33-combination-coverage-v1',
    class_name: 'Primary 4',
    subject_count: subjects.length,
    term_count: terms.length,
    combination_count: matrix.length,
    export_record_count: records.length,
    provenance_note: 'Source-row counts are from the user-supplied database export. Researched lesson counts are newly authored packages and are not production records until an approved import is performed.',
    archive_verification: 'Original Word archive and extracted p4txt folder were not mounted in this execution environment; source hashes cover exported source_reference text only.',
    matrix,
    curriculum_decisions: [
      {
        subject: 'Basic Technology',
        terms: ['1st Term', '2nd Term'],
        status: 'NEEDS_SCHOOL_TERM_ALLOCATION',
        decision: 'Do not invent or duplicate a separate term sequence. NERDC lists Primary 4 Basic Technology topics without term labels. The Lagos State 2021 Primary 4–6 integrated BST scheme presents the Basic Technology sequence in its Third-Term section; no separate First- or Second-Term Basic Technology sequence was found in that scheme.',
        nerdc_source: 'https://nerdc.gov.ng/content_manager/primary/pri4-6_basic_science_technology.pdf',
        state_scheme_source: 'https://classbasic.com/wp-content/uploads/2020/08/Basic-Science-and-Technology-BST-New-Lagos-State-Unified-Scheme-of-Work-for-Primary-4-6-2021-Edition.pdf',
        required_evidence: 'A school-specific term scheme or owner approval for a clearly labelled supplementary progression.',
      },
      {
        subject: 'Basic Science',
        terms: ['3rd Term'],
        status: 'PROPOSED_LOCAL_ALLOCATION',
        decision: 'Three lessons address NERDC Primary 4 topics not represented as distinct lessons in the supplied export. NERDC does not prescribe their Third-Term placement; the placement remains proposed pending school approval.',
        source: 'https://nerdc.gov.ng/content_manager/primary/pri4-6_basic_science_technology.pdf',
      },
      {
        subject: 'Home Economics',
        terms: ['1st Term', '2nd Term', '3rd Term'],
        status: 'RESEARCHED_PACKAGES_PENDING_APPROVAL',
        decision: 'Eighteen First/Second-Term lessons and seven Third-Term supplements are newly authored from the Lagos State Primary 4 scheme transcription. They do not overwrite the supplied sewing lessons.',
        source: 'https://syllabus.ng/primary4-scheme-of-work/home-economics/',
      },
    ],
    unresolved: matrix.filter(row => row.status === 'MISSING' || row.status === 'NO_SEPARATE_TERM_ASSIGNMENT_FOUND'),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(buildPrimary4CoverageReport(), null, 2)}\n`);
}
