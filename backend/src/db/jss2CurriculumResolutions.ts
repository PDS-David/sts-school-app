/**
 * Curriculum-owner resolutions for verified JSS2 source irregularities.
 *
 * Exact-source and JSS2-only: every rule is keyed on `termLabel/basename` and
 * the caller must additionally gate on canonical class "JSS 2". These encode
 * the file-by-file JSS2 review; they are NOT general parser heuristics and
 * must not be reused for other classes without a new source review.
 *
 * Safety property: if a rule's anchor is absent (source changed), the rule
 * THROWS instead of silently passing text through. The importer records the
 * throw as a file read error, which blocks the audit.
 */

type Rule = (text: string) => string;

function must(text: string, marker: RegExp, label: string): RegExpExecArray {
  const flags = marker.flags.replace('g', '');
  const m = new RegExp(marker.source, flags).exec(text);
  if (!m) throw new Error(`JSS2 resolution anchor missing: ${label}`);
  return m;
}

/** Keep text from the first match of `marker` onward (drops scheme/preamble). */
const fromMarker = (marker: RegExp, label: string): Rule => text =>
  text.slice(must(text, marker, label).index);

/** Replace first match of `marker`; throws if absent. */
const replaceOnce = (marker: RegExp, replacement: string, label: string): Rule => text => {
  const flags = marker.flags.replace('g', '');
  must(text, marker, label);
  return text.replace(new RegExp(marker.source, flags), replacement);
};

const compose = (...rules: Rule[]): Rule => text => rules.reduce((t, r) => r(t), text);

// ── Yoruba: OSE ordinal -> WEEK n (anchored; rewrites ONLY the ordinal) ────
// Dash variants: ASCII hyphen, U+2010–U+2015, U+2212, plus blanks.
const SEP = '[ \\t\\-\\u2010-\\u2015\\u2212]';
const YORUBA_ORDINALS: Array<[string, string]> = [
  [`KIN${SEP}*IN${SEP}*NI`, '1'],
  ['KEJI', '2'],
  ['KETA', '3'],
  ['KERIN', '4'],
  [`KARUN(?:${SEP}*UN)?`, '5'],
  ['KEFA', '6'],
  ['KEJE', '7'],
  ['KEJO', '8'],
  [`KESAN(?:${SEP}*AN)?`, '9'],
  ['KEWAA', '10'],
  ['KOKANLA[ \\t]+ATI[ \\t]+IKEJILA', '11 & 12'],
];
// Longest-first alternation + trailing (?![A-Za-z]) guards: KEJI can never
// match inside IKEJILA (the heading must START with OSE + ordinal), and an
// ordinal may not run on into further letters.
const YORUBA_OSE_HEADING = new RegExp(
  `^([ \\t]*)OSE${SEP}+(${YORUBA_ORDINALS.map(([p]) => p).join('|')})(?![A-Za-z])`,
  'gim',
);
function normalizeJss2YorubaWeeks(text: string): string {
  return text.replace(YORUBA_OSE_HEADING, (whole, indent: string, ordinal: string) => {
    const hit = YORUBA_ORDINALS.find(([p]) => new RegExp(`^(?:${p})$`, 'i').test(ordinal));
    return hit ? `${indent}WEEK ${hit[1]}` : whole;
  });
}
const yorubaCutAndNormalize = (): Rule => text => normalizeJss2YorubaWeeks(
  fromMarker(
    new RegExp(`^[ \\t]*OSE${SEP}+KIN${SEP}*IN${SEP}*NI[ \\t]*\\r?$`, 'im'),
    'standalone OSE KIN-IN-NI',
  )(text),
);

// ── Inline "CLASS; JSS 2  WEEK n" -> restore the lost line break ───────────
const INLINE_CLASS_WEEK = /^([ \t]*CLASS[ \t]*[:;][ \t]*J[ \t]*\.?[ \t]*S[ \t]*\.?[ \t]*S[ \t]*\.?[ \t]*2)[ \t]*(?=WEEK[ \t]*\d)/gim;
const splitInlineClassWeek: Rule = text => {
  if (!new RegExp(INLINE_CLASS_WEEK.source, 'im').test(text)) {
    throw new Error('JSS2 resolution anchor missing: inline CLASS/WEEK headings');
  }
  return text.replace(INLINE_CLASS_WEEK, '$1\n');
};

// ── Home Economics: remove ONLY the verified "WEEK ONE TO WEEK N" banner ───
const dropBanner = (last: 'THIRTEEN' | 'TWELVE'): Rule => replaceOnce(
  new RegExp(`^[ \\t]*WEEK[ \\t]+ONE[ \\t]+TO[ \\t]+WEEK[ \\t]+${last}[ \\t]*\\r?\\n`, 'im'),
  '',
  `Home Economics banner WEEK ONE TO WEEK ${last}`,
);

// ── T3 Agriculture: neutralize exactly five textbook/exercise references ──
const TEXTBOOK_REF = /^([ \t]*)(Week[ \t]+\d+[ \t]+(?:pg|exercise)\b)/gim;
const neutralizeAgricTextbookRefs: Rule = text => {
  const n = [...text.matchAll(TEXTBOOK_REF)].length;
  if (n !== 5) throw new Error(`JSS2 resolution: expected 5 Agric textbook references, found ${n}`);
  // Only the leading "Week" token is displaced; all text is retained.
  return text.replace(TEXTBOOK_REF, '$1Textbook reference: $2');
};

const RULES: Record<string, Rule> = {
  // Home Economics banners (10→9, 12→11, 11→10)
  '1st Term/HOME ECONS JS 2.docx': dropBanner('THIRTEEN'),
  '2nd Term/E-NOTES FOR J.S.S. TWO  H ECONS.docx': dropBanner('TWELVE'),
  '3rd Term/HOME ECONS-1.docx': dropBanner('TWELVE'),

  // Missed / mis-typed lesson markers
  '1st Term/ENOTE SOCIAL STUDIES JSS2 1ST TERM.docx': fromMarker(
    /^[ \t]*WEEK[ \t]+TWO[ \t]*\r?$/m,
    'Social Studies substantive body WEEK TWO',
  ),
  '2nd Term/Jss 2 civic edu.docx': replaceOnce(
    /^([ \t]*WEEK[ \t]+)EGHT(?=[ \t]*:)/m, '$1EIGHT', 'WEEK EGHT'),
  '3rd Term/COMPUTER.docx': replaceOnce(
    /^([ \t]*CLASS[ \t]*:[ \t]*JSS[ \t]+TWO)[ \t]+(?=WEEK[ \t]*:[ \t]*2\b)/m, '$1\n', 'inline CLASS : JSS TWO   WEEK : 2'),

  // Scheme + body: cut scheme, start at verified substantive body
  '3rd Term/AGRIC.docx': compose(
    fromMarker(/^[ \t]*WEEK 1\.[ \t]*\r?$/m, 'Agric body start WEEK 1.'),
    neutralizeAgricTextbookRefs,
  ),
  '1st Term/JSS 2 MATHEMATICS.docx': fromMarker(/^[ \t]*WEEK[ \t]+1[ \t]*&[ \t]*2\b/m, 'T1 Maths WEEK 1 & 2'),
  '2nd Term/MATHS.docx': fromMarker(/^[ \t]*WEEK 2 WORD PROBLEM LEADING TO ALGEBRAIC EXPRESSION/m, 'T2 Maths W2 body'),
  '2nd Term/basic tech.docx': fromMarker(/^[ \t]*Week 1;[ \t]*revision[ \t]*\r?$/m, 'T2 Basic Tech Week 1; revision'),
  '3rd Term/BASIC SCIENCE.docx': fromMarker(/^[ \t]*WEEK 1: THERMAL ENERGY\.[ \t]*\r?$/m, 'T3 Basic Science body'),
  '3rd Term/MATHS.docx': fromMarker(/^[ \t]*WEEK[ \t]+1[ \t]+AND[ \t]+2\b/m, 'T3 Maths WEEK 1 AND  2'),
  '3rd Term/BASIC TECHNOLOGY.docx': fromMarker(/^[ \t]*Week1[ \t]*\.[ \t]*revision of last term work/m, 'T3 Basic Tech Week1 . revision'),

  // Yoruba
  '1st Term/YORUBA.docx': normalizeJss2YorubaWeeks,
  '2nd Term/2. 2nd term YORUBA e note js   2017.docx': yorubaCutAndNormalize(),
  '3rd Term/YORUBA.docx': yorubaCutAndNormalize(),

  // Fine Art / CCA
  '2nd Term/JS 2 FINE ART.docx': splitInlineClassWeek,
  '3rd Term/FINE ART.docx': compose(
    fromMarker(/^[ \t]*CLASS;[ \t]*J S S 2[ \t]+WEEK 1[ \t]+TOPIC;[ \t]*PATTERNS\./m, 'T3 Fine Art body start'),
    splitInlineClassWeek,
  ),
};

/** True only for the reviewed JSS2 source files that carry a resolution. */
export function hasJss2SourceResolution(basename: string, termLabel: string): boolean {
  return Object.prototype.hasOwnProperty.call(RULES, `${termLabel}/${basename}`);
}

export function applyJss2SourceTextResolution(
  basename: string,
  termLabel: string,
  text: string,
): string {
  const key = `${termLabel}/${basename}`;
  return Object.prototype.hasOwnProperty.call(RULES, key) ? RULES[key](text) : text;
}

export function resolveJss2SubjectName<T extends { name: string; fallback: boolean }>(
  basename: string,
  termLabel: string,
  subjectName: T,
): T {
  // The reviewed scheme preamble of this file states
  // "SUBJECT; CULTURAL AND CREATIVE ARTS", but the scheme is cut from the
  // import text, which removes the only subject evidence. Restore it here.
  if (termLabel === '3rd Term' && basename === 'FINE ART.docx') {
    return { ...subjectName, name: 'Cultural & Creative Arts', fallback: false };
  }
  return subjectName;
}
