/**
 * Curriculum-owner resolutions for verified Primary source irregularities.
 *
 * These are deliberately exact-basename rules, not fuzzy parser heuristics.
 * They preserve the supplied archive as evidence while making the audited
 * import reproducible on another machine. Additions require source review.
 */

type ParsedTopicLike = { weekLabel: string; title: string; body: string };

const EXCLUDED_FILES = new Set([
  // Filename says PHE; content duplicates the correctly named Primary 1 ICT
  // 3rd-term source week-for-week.
  'PRY 1 PHE 3RD TERM.doc',
  // Byte-identical/misplaced copy of the retained Primary 1 PHE 2nd-term
  // lesson resource; no evidence supports assigning it to Primary 2 3rd term.
  'PRY 2 PHE 3RD TERM.docx',
  'PRY 2 PHE 3RD TERM_1.docx',
  // Incomplete Primary 6 Mathematics copy: Week 2 has no lesson body. The
  // reviewed _1 copy contains the Binary Numbers lesson and is retained.
  'PRY 6 MATHS IST TERM.doc',
  // Verified duplicate/alternate Primary 4 First-Term sources. Retain the
  // corresponding canonical unsuffixed source in each case.
  'PRY 4  Civic Ist term_1.docx',
  'PRY 4 CCA First term E_1.docx',
  '[1st Term] PRY 4 English 1.docx',
  'PRY 4 Maths Ist term_1.doc',
  // Filename says BST (Basic Technology) but the document is headed "PRY 4
  // BASIC SCIENCE FIRST TERM ENOTE" and its lessons are Basic Science (changes
  // in nature, weather, colours, measurement). The same lessons are in the
  // Primary 4 Basic Science 1st-Term source "1st termBasicscience4.docx", which
  // is the file that is retained. Primary 4 has no genuine Basic Technology
  // 1st-Term source. NOTE: the 2023 "1st Term Basic 4" zip does not contain
  // "1st termBasicscience4.docx"; importing only that zip would leave Primary 4
  // Basic Science 1st Term empty.
  'PRY 4 BST Ist term.docx',
  // Byte-for-byte the same lessons as Primary 4's "PRY 4 HOME ECONS RD TERM.docx",
  // whose heading is "THIRD TERM HOME ECONOMICS PRIMARY FOUR". Found in the live
  // database as 21 Primary 3 2nd-Term rows with the same hashes as Primary 4's;
  // removed with the curriculum owner's approval. Primary 3 has no Home
  // Economics source of its own.
  'PRY 3 HOME ECONS 2ND TERM.docx',
  // Anonymous source overlaps the retained, clearly identified Primary 5 CCA
  // First-Term source; do not let the anonymous copy duplicate its lesson.
  'み.docx',
  'Γü┐.docx',
]);

const canonicalWeek = (value: string) => value
  .toLowerCase()
  .replace(/^\s*week\s*[:.\-]*\s*/i, '')
  .replace(/\band\b/g, '&')
  .replace(/\s+/g, '');

const TOPIC_OVERRIDES = new Map<string, Map<string, string>>([
  ['PRY 1 MATHS  3rd term.doc', new Map([
    ['3&4', 'Telling the Time to the Hour'],
  ])],
  ['PRY 6 MATHS IST TERM_1.doc', new Map([
    ['2', 'Binary Numbers'],
  ])],
  ['THIRD TERM PRY 3 COMPUTER PRY   3.doc', new Map([
    ['9&10', 'Floppy Disk/Diskette'],
  ])],
]);

const DROP_ORPHAN_WEEKS = new Map<string, Set<string>>([
  ['THIRD TERM PHYSICAL AND HEALTH EDUCATION PRY FOUR.doc', new Set(['5'])],
  ['PRY3  CCA 3RD TERM.doc', new Set(['5&6'])],
]);

export function isPrimarySourceExcluded(basename: string, sourceIdentity = ''): boolean {
  if (EXCLUDED_FILES.has(basename)) return true;

  // Verified against the original Primary 5 First-Term archive: it contains
  // exactly nine named curriculum files. Any other .doc/.docx in this exact
  // extracted source folder is an extraction/nested-archive artifact.
  const normalizedSource = sourceIdentity.replace(/\\/g, '/');
  if (
    normalizedSource.includes('/BASIC FIVE/1st Term Basic 5/')
    && /\.docx?$/i.test(basename)
  ) {
    const verifiedPrimary5FirstTermFiles = new Set([
      'PRY 5 IST TERM ICT.doc',
      'PRY 5  BASIC SCI Ist term.doc',
      'PRY 5 PHE Ist term.doc',
      'PRY 5 SOS Ist term.doc',
      'PRY 5 English Ist term.doc',
      'PRY 5 AGRIC Ist term.doc',
      'PRY 5 CCA  Ist term.doc',
      'PRY 5 IST TERM CIVIC.doc',
      'PRY 5 Maths Ist term.docx',
    ]);
    return !verifiedPrimary5FirstTermFiles.has(basename);
  }

  return false;
}

// Byte-identical files that the curriculum owner has reviewed and chosen to
// keep in BOTH classes. Any other byte-identical pair across different classes
// blocks the import audit (see crossClassByteDuplicate in ingestTopics.ts).
const ACKNOWLEDGED_CROSS_CLASS_DUPLICATES: Array<[string, string]> = [
  // Same bytes, no class named inside either file; owner decided on
  // 2026-11-12 to keep the lessons in both Primary 3 and Primary 4.
  ['PRY 3 AGRIC SCIENCE 3RD TERM.docx', 'PRY 4 AGRIC 3RD TERM.docx'],
];

export function isAcknowledgedCrossClassDuplicate(a: string, b: string): boolean {
  return ACKNOWLEDGED_CROSS_CLASS_DUPLICATES.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x),
  );
}

// Exact-basename subject corrections where the filename and the document's own
// heading disagree about the subject.
export function resolvePrimarySubjectName<T extends { name: string; fallback: boolean }>(
  basename: string,
  termLabel: string,
  subjectName: T,
): T {
  // Filename says BASIC SCIENCE but the document is headed "BASIC TECHNOLOGY
  // THIRD TERM PRIMARY 4" (technology, ICT gadgets, shape construction,
  // buildings, energy).
  if (termLabel === '3rd Term' && basename === 'BASIC SCIENCE THIRD TERM PRY 4.docx') {
    return { ...subjectName, name: 'Basic Technology', fallback: false };
  }
  return subjectName;
}

export function applyPrimarySourceTextResolution(basename: string, text: string): string {
  if (basename === '1st termBasicscience4.docx') {
    // The opening section is a short scheme outline. Detailed notes begin at
    // the first doubled marker, e.g. "WEEK: WEEK 1". Keep the lesson section
    // and normalize only this exact source's malformed week headings so the
    // shared parser can split its detailed lesson blocks correctly.
    const detailedLessons = /\\n\\s*WEEK\\s*:\\s*WEEK\\s*1\\b/i.exec(text);
    if (detailedLessons?.index !== undefined) {
      return text.slice(detailedLessons.index).trimStart()
        .replace(/^([ \\t]*)WEEK\\s*:\\s*WEEK\\s*(\\d{1,2})\\b/gim, '$1WEEK $2');
    }
    return text;
  }

  if (basename === 'PRY 4 CCA First term E.docx') {
    // This source begins with a scheme-of-work outline, then switches to the
    // detailed lesson notes at the first explicit "WEEK: 1" heading. The old
    // projection kept only the outline by slicing the text before that marker.
    // Retain the detailed section instead; the outline remains in the source
    // archive and is not emitted as a separate learner lesson.
    const detailedLessons = /\n\s*WEEK:\s*1\b/i.exec(text);
    if (detailedLessons?.index !== undefined) return text.slice(detailedLessons.index).trimStart();
    return text;
  }

  if (basename === 'PRY 1 PHE 2ND TERM.docx') {
    // Verified source uses Lesson 1-4 instead of week markers. Convert only
    // these four explicit lesson headings; no general Lesson=>Week heuristic.
    const lessons = [
      ['1', 'Manipulative Movements'],
      ['2', 'Fundamental Rhythms and Movements'],
      ['3', 'Creative Rhythms and Movements'],
      ['4', 'Locomotor Movements'],
    ] as const;
    let resolved = text;
    for (const [number, title] of lessons) {
      const re = new RegExp(`(^|\\n)\\s*lesson\\s+${number}\\b[^\\n]*`, 'i');
      resolved = resolved.replace(re, `$1WEEK ${number}\\nTOPIC: ${title}`);
    }
    return resolved;
  }

  if (basename === 'PRY 6 Civic Ist term.doc') {
    // The reviewed source establishes the First-Term scheme explicitly, but
    // legacy .doc extraction does not preserve a parseable WEEK/TOPIC layout.
    // Use the verified curriculum sequence as a deterministic text projection
    // for this exact source only; no generic parser heuristic is introduced.
    const verifiedTopics = [
      ['1&2', 'National Honors Award'],
      ['3', 'Valuing Nigerian Goods'],
      ['4', 'Values that Promote Peace'],
      ['5', 'Co-operation'],
      ['6', 'National Unity'],
      ['7', 'National Consciousness and Identity'],
      ['8', 'Patriotism'],
      ['9', 'Ethnicity'],
      ['10', 'National Symbols'],
    ] as const;
    return verifiedTopics
      .map(([week, title]) => `WEEK ${week}\nTOPIC: ${title}\nVerified curriculum-owner resolution for legacy source extraction.`)
      .join('\n');
  }

  return text;
}

export function resolvePrimaryParsedTopic<T extends ParsedTopicLike>(
  basename: string,
  topic: T,
): T | null {
  const week = canonicalWeek(topic.weekLabel);
  if (DROP_ORPHAN_WEEKS.get(basename)?.has(week)) return null;

  const title = TOPIC_OVERRIDES.get(basename)?.get(week);
  if (!title) return topic;
  return { ...topic, title };
}
