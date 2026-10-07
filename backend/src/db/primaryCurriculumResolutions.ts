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

export function applyPrimarySourceTextResolution(basename: string, text: string): string {
  if (basename === 'PRY 4 CCA First term E.docx') {
    // This reviewed source contains the complete Week 1-14 sequence followed
    // by a second embedded copy beginning at "WEEK: 1". Keep the first,
    // complete sequence only. This is exact-source cleanup, not parser logic.
    const repeatedSequence = /\n\s*WEEK:\s*1\b/i.exec(text);
    if (repeatedSequence?.index !== undefined) return text.slice(0, repeatedSequence.index);
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
