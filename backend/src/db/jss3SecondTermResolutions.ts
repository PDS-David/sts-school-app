/**
 * Curriculum-owner resolutions for verified JSS3 SECOND-TERM source irregularities.
 *
 * Exact-source and JSS3/2nd-Term-only: every rule is keyed on `2nd Term/<basename>`
 * and the caller must additionally gate on canonical class "JSS 3" (the importer
 * wiring does). These encode the file-by-file JSS3 Second-Term review; they are
 * NOT general parser heuristics and must not be reused for other classes or terms
 * without a new source review. First- and Third-Term JSS3 sources are deliberately
 * NOT covered here: every function below returns its input unchanged for them
 * (topics: the same object reference). First-Term behaviour lives in
 * jss3CurriculumResolutions.ts and is neither modified nor duplicated here.
 *
 * Safety property: if a rule's anchor is absent OR ambiguous (matches more than
 * once) the rule THROWS instead of silently passing text through. The importer
 * records the throw as a file read error, which blocks the audit.
 *
 * No lesson content is invented. The only text this module ever adds is
 *   (a) a structural "WEEK n" marker line derived from a heading the same source
 *       already states, and
 *   (b) for the five scheme-only headings (Business Studies weeks 4, 8, 9, 10 and
 *       Mathematics "Statistics II"), a "WEEK n" line plus the heading text (and,
 *       for Statistics II, its four sub-lines) copied verbatim from the source's
 *       own scheme of work. Source typos and punctuation are preserved.
 * Authorised scheme-only headings: scheme_only_integration_manifest.csv, 2nd Term.
 */

import { canonicalJss3Week } from './jss3CurriculumResolutions.js';

type Rule = (text: string) => string;

const TERM = '2nd Term';

// ── Anchor helpers (stricter than First Term: ambiguity also throws) ───────
function all(text: string, marker: RegExp): RegExpMatchArray[] {
  const flags = marker.flags.includes('g') ? marker.flags : marker.flags + 'g';
  return [...text.matchAll(new RegExp(marker.source, flags))];
}

/** Exactly one match, else throw (missing OR ambiguous). */
function once(text: string, marker: RegExp, label: string): RegExpMatchArray {
  const found = all(text, marker);
  if (found.length === 0) throw new Error(`JSS3 2nd-Term resolution anchor missing: ${label}`);
  if (found.length > 1) {
    throw new Error(`JSS3 2nd-Term resolution anchor ambiguous (${found.length} matches): ${label}`);
  }
  return found[0];
}

/** Keep text from the single match of `marker` onward (drops scheme/preamble). */
const fromMarker = (marker: RegExp, label: string): Rule => text =>
  text.slice(once(text, marker, label).index!);

/** Replace the single match of `marker`; throws if missing or ambiguous. */
function replaceOnce(text: string, marker: RegExp, replacement: string, label: string): string {
  once(text, marker, label);
  return text.replace(new RegExp(marker.source, marker.flags.replace('g', '')), replacement);
}

const compose = (...rules: Rule[]): Rule => text => rules.reduce((t, r) => r(t), text);

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ── Scheme-only headings (single source of truth for rules, exports, tests) ─
export interface Jss3SchemeOnlyHeading {
  subject: string;
  basename: string;
  /** Canonical week ("4", "8", ...). */
  week: string;
  title: string;
}

const BUSINESS = 'business_studies JSS3.docx';
const MATHS = 'BASIC 9 MATHEMATICS E-NOTE.docx';

/** The five 2nd-Term rows in scheme_only_integration_manifest.csv. */
export const JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS: readonly Jss3SchemeOnlyHeading[] = [
  { subject: 'Business Studies', basename: BUSINESS, week: '4', title: 'Book \u2013 keeping ethnics' },
  { subject: 'Business Studies', basename: BUSINESS, week: '8', title: 'Display' },
  { subject: 'Business Studies', basename: BUSINESS, week: '9', title: 'Types of Display' },
  { subject: 'Business Studies', basename: BUSINESS, week: '10', title: 'Printers correction signs / speed development' },
  { subject: 'Mathematics', basename: MATHS, week: '4', title: 'Statistics II' },
];

const schemeTitle = (basename: string, week: string): string => {
  const h = JSS3_SECOND_TERM_SCHEME_ONLY_HEADINGS.find(x => x.basename === basename && x.week === week);
  if (!h) throw new Error(`JSS3 2nd-Term internal: no scheme-only heading for ${basename} week ${week}`);
  return h.title;
};

/** Capture a scheme row's text verbatim (the phrase must exist as its own line, once). */
const captureSchemeRow = (text: string, phrase: string, label: string): string =>
  once(text, new RegExp(`^[ \\t]*(${escapeRegExp(phrase)})[ \\t]*\\r?$`, 'm'), label)[1];

// ── Basic Science ──────────────────────────────────────────────────────────
// A 9-row scheme ("WEEK 1-RESOURCES FROM LIVING THINGS" ...) precedes the lessons
// and is read as 9 extra topics. The lesson body starts at "Wk1-Resources from
// living things." Body markers are typed Wk1/WK2/WK3 (em dash)/WK4/WK6/WK7/8/WK9;
// the generic parser sees none of them. Only those marker tokens are rewritten;
// WEEK 5 and WEEK 11 are already well formed.
const BASIC_SCIENCE_MARKERS: ReadonlyArray<readonly [string, RegExp, string]> = [
  ['Wk1', /^([ \t]*)Wk1(?=[ \t]*-)/gm, '$1WEEK 1'],
  ['WK2', /^([ \t]*)WK2(?=[ \t]*-)/gm, '$1WEEK 2'],
  ['WK3 (em dash)', /^([ \t]*)WK3(?=[ \t]*\u2014)/gm, '$1WEEK 3'],
  ['bare WK4', /^([ \t]*)WK4(?=[ \t]*\r?$)/gm, '$1WEEK 4'],
  ['WK6', /^([ \t]*)WK6(?=[ \t]*-)/gm, '$1WEEK 6'],
  ['WK7/8', /^([ \t]*)WK7\/8(?=[ \t]*-)/gm, '$1WEEK 7&8'],
  ['WK9', /^([ \t]*)WK9(?=[ \t]+\S)/gm, '$1WEEK 9'],
];
const basicScience: Rule = compose(
  fromMarker(/^[ \t]*Wk1[ \t]*-[ \t]*Resources from living things/m, 'Basic Science body start Wk1-Resources from living things'),
  text => {
    let out = text;
    for (const [label, marker, replacement] of BASIC_SCIENCE_MARKERS) {
      out = replaceOnce(out, marker, replacement, `Basic Science marker ${label}`);
    }
    const leftover = all(out, /^[ \t]*wk[ \t]*\d/im).length;
    if (leftover !== 0) throw new Error(`JSS3 2nd-Term resolution: ${leftover} unreviewed Basic Science WK marker(s) remain`);
    return out;
  },
);

// ── Basic Technology ───────────────────────────────────────────────────────
// A 12-row scheme ("Week 1; revision of last terms work" ...) precedes the lessons
// and duplicates them. The lesson body starts at "Week 1; revision".
const basicTech: Rule = fromMarker(/^[ \t]*Week 1;[ \t]*revision[ \t]*\r?$/m, 'Basic Tech body start Week 1; revision');

// ── Music ──────────────────────────────────────────────────────────────────
// The scheme ("WEEK ONE - REVISION" ...) duplicates the nine lessons. The body
// starts at the bare "WEEK ONE" line.
const music: Rule = fromMarker(/^[ \t]*WEEK ONE[ \t]*\r?$/m, 'Music body start WEEK ONE');

// ── Yoruba ─────────────────────────────────────────────────────────────────
// The scheme is a bare-number table with no WEEK marker; lessons are headed by
// Yoruba ordinals. Cut the scheme, translate exactly the three ordinals present.
const YORUBA_WEEKS: ReadonlyArray<readonly [string, string]> = [['KINNI', '1'], ['KEJI', '2'], ['KETA', '3']];
const yoruba: Rule = text => {
  let body = text.slice(once(text, /^[ \t]*OSE[ \t]+KINNI[ \t]*\r?$/m, 'Yoruba body start OSE KINNI').index!);
  for (const [ordinal, week] of YORUBA_WEEKS) {
    body = replaceOnce(
      body,
      new RegExp(`^([ \\t]*)OSE[ \\t]+${ordinal}[ \\t]*\\r?$`, 'm'),
      `$1WEEK ${week}`,
      `Yoruba heading OSE ${ordinal}`,
    );
  }
  const leftover = all(body, /^[ \t]*OSE[ \t]+[A-Z]+/im).length;
  if (leftover !== 0) throw new Error(`JSS3 2nd-Term resolution: ${leftover} unreviewed Yoruba OSE heading(s) remain`);
  return body;
};

// ── Cultural & Creative Arts (Fine Art) ────────────────────────────────────
// Each lesson opens with one run-on line "CLASS; JSS3  WEEK n   TOPIC; ...". The
// generic parser needs WEEK at the start of a line, so each of the nine header
// lines is split into "WEEK n / CLASS... / TOPIC...". The scheme is deliberately
// NOT cut: its SUBJECT lines identify the subject for the importer.
const FINE_ART_HEADER =
  /^[ \t\u00a0]*(CLASS[^\n]*?)[ \t\u00a0]*\bWEEK[ \t\u00a0]*(\d{1,2})\b[^\n]*?\b(TOPIC[ \t\u00a0]*[;:][^\n]*)$/gm;
const fineArt: Rule = text => {
  const headers = all(text, FINE_ART_HEADER);
  if (headers.length !== 9) {
    throw new Error(`JSS3 2nd-Term resolution: expected exactly 9 Fine Art CLASS/WEEK/TOPIC header lines, found ${headers.length}`);
  }
  const weeks = headers.map(h => Number(h[2])).sort((a, b) => a - b);
  if (weeks.some((w, i) => w !== i + 1)) {
    throw new Error(`JSS3 2nd-Term resolution: Fine Art header weeks must be 1..9 exactly once, found ${weeks.join(',')}`);
  }
  const clean = (s: string) => s.replace(/\u00a0/g, ' ').trim();
  return text.replace(FINE_ART_HEADER, (_line, cls: string, wk: string, topic: string) =>
    `WEEK ${Number(wk)}\n${clean(cls)}\n${clean(topic)}`);
};

// ── Business Studies (scheme-only rows) ────────────────────────────────────
// The lessons cover scheme weeks 2-3, 5, 6, 7 only. Weeks 4, 8, 9, 10 exist solely
// as scheme rows; the authorised manifest integrates them as heading-only rows.
const BODY_BUSINESS_WEEK = /^[ \t]*week[ \t]*[:.\-]*[ \t]*(?:4|8|9|10|four|eight|nine|ten)\b/im;
const businessStudies: Rule = text => {
  const ethnics = captureSchemeRow(text, schemeTitle(BUSINESS, '4'), 'Business Studies scheme row 4');
  const display = captureSchemeRow(text, schemeTitle(BUSINESS, '8'), 'Business Studies scheme row 8');
  const types = captureSchemeRow(text, schemeTitle(BUSINESS, '9'), 'Business Studies scheme row 9');
  const printers = captureSchemeRow(text, schemeTitle(BUSINESS, '10'), 'Business Studies scheme row 10');
  if (BODY_BUSINESS_WEEK.test(text)) {
    throw new Error('JSS3 2nd-Term resolution: Business Studies now has a Week 4/8/9/10 marker; scheme-only rule no longer applies');
  }
  // "WEEK TWO – THREE" (en dash) is not read as a range by the generic parser.
  let out = replaceOnce(
    text,
    /^([ \t]*WEEK[ \t]+TWO[ \t]*)\u2013([ \t]*THREE[ \t]*\r?)$/m,
    '$1-$2',
    'Business Studies WEEK TWO \u2013 THREE',
  );
  const five = once(out, /^[ \t]*WEEK FIVE[ \t]*\r?$/m, 'Business Studies WEEK FIVE marker');
  out = `${out.slice(0, five.index!)}WEEK 4\n\n${ethnics}\n\n${out.slice(five.index!)}`;
  return `${out.replace(/\s+$/, '')}\n\nWEEK 8\n\n${display}\n\nWEEK 9\n\n${types}\n\nWEEK 10\n\n${printers}\n`;
};

// ── Mathematics (scheme-only row) ──────────────────────────────────────────
// Scheme item "Statistics II" (with four sub-lines) has no lesson in the body.
// It is integrated as a heading + its own scheme sub-lines, placed after the body
// WEEK 4 lesson and before WEEK 5. Two rows labelled WEEK 4 result; this is expected
// (the scheme's docx auto-numbering makes Statistics II item 4, while the body's
// WEEK 4 is "Solving simultaneous equation graphically").
const mathematics: Rule = text => {
  const start = once(text, new RegExp(`^[ \\t]*(${escapeRegExp(schemeTitle(MATHS, '4'))})[ \\t]*\\r?$`, 'm'), 'Mathematics scheme line Statistics II');
  const end = once(text, /^[ \t]*Variation[ \t]*\r?$/m, 'Mathematics scheme line Variation');
  const from = start.index! + start[0].length;
  if (end.index! < from) throw new Error('JSS3 2nd-Term resolution: Mathematics "Variation" precedes "Statistics II"');
  const subLines = text.slice(from, end.index!).split('\n').map(l => l.trim()).filter(Boolean);
  if (subLines.length === 0) throw new Error('JSS3 2nd-Term resolution: Mathematics "Statistics II" has no sub-lines');
  const week5 = once(text, /^[ \t]*WEEK 5[ \t]*\r?$/m, 'Mathematics WEEK 5 marker');
  if (week5.index! < end.index!) throw new Error('JSS3 2nd-Term resolution: Mathematics WEEK 5 marker precedes the scheme');
  return `${text.slice(0, week5.index!)}WEEK 4\n\n${start[1]}\n${subLines.join('\n')}\n\n${text.slice(week5.index!)}`;
};

import { splitJss3EnglishLessons } from './jss3EnglishLessonSplit.js';

const english: Rule = text => splitJss3EnglishLessons(text, '2nd Term');

const RULES: Record<string, Rule> = {
  [`${TERM}/Basic science.docx`]: basicScience,
  [`${TERM}/basic tech.docx`]: basicTech,
  [`${TERM}/music.docx`]: music,
  [`${TERM}/YORUBA  JS 3.docx`]: yoruba,
  [`${TERM}/JS 3 FINE ART.docx`]: fineArt,
  [`${TERM}/${BUSINESS}`]: businessStudies,
  [`${TERM}/${MATHS}`]: mathematics,
  [`${TERM}/js 3 english.docx`]: english,
};

/**
 * Every JSS3 Second-Term source file reviewed for this assignment. Files without
 * a text rule were reviewed and parse correctly as supplied (FRENCH needs a
 * title-only fix, below).
 */
export const JSS3_SECOND_TERM_REVIEWED_SOURCES: readonly string[] = [
  'Agric 2ndT.doc',
  'BASIC 9 MATHEMATICS E-NOTE.docx',
  'Basic science.docx',
  'FRENCH  js 3.docx',
  'JS 3 FINE ART.docx',
  'P H E JS_3.docx',
  'YORUBA  JS 3.docx',
  'basic tech.docx',
  'business_studies JSS3.docx',
  'home econs.docx',
  'js 3 civic.docx',
  'js 3 english.docx',
  'music.docx',
  'social studies.docx',
];

/** True only for the reviewed JSS3 Second-Term source files that carry a text rule. */
export function hasJss3SecondTermSourceResolution(basename: string, termLabel: string): boolean {
  return Object.prototype.hasOwnProperty.call(RULES, `${termLabel}/${basename}`);
}

export function applyJss3SecondTermSourceTextResolution(basename: string, termLabel: string, text: string): string {
  const key = `${termLabel}/${basename}`;
  return Object.prototype.hasOwnProperty.call(RULES, key) ? RULES[key](text) : text;
}

// ── Title-only corrections ─────────────────────────────────────────────────
interface ParsedTopicLike { weekLabel: string; title: string; body: string }

const isReviewed = (basename: string, termLabel: string) =>
  termLabel === TERM && JSS3_SECOND_TERM_REVIEWED_SOURCES.includes(basename);

/**
 * Title-only corrections for reviewed Second-Term rows. Never changes the week
 * label, order, or body (sourceReference), and never drops a topic. `null`
 * (produced by an earlier per-class stage) passes through untouched.
 *
 *  - the marker regex leaves its separator ("-", "–", "—", ";", ":") on the title;
 *  - FRENCH week 2: the real heading "Dater et mesurer le temp" starts with the
 *    word "date"-prefix, so the parser's metadata filter skips it and picks the
 *    next line; the heading is recovered from the body (source typo preserved);
 *  - Fine Art week 5: the source wraps "TOPIC; SINGING IN PARTS AND / CADENCE
 *    IDENTIFICATION" over two lines; the two source fragments are joined with one
 *    space.
 */
export function resolveJss3SecondTermParsedTopic<T extends ParsedTopicLike>(
  basename: string,
  termLabel: string,
  topic: T | null,
): T | null {
  if (topic === null) return null;
  if (!isReviewed(basename, termLabel)) return topic;
  const week = canonicalJss3Week(topic.weekLabel);
  let title = topic.title;

  if (basename === 'FRENCH  js 3.docx' && week === '2') {
    title = once(topic.body, /^[ \t]*(Dater et mesurer le temp)[ \t]*\r?$/m, 'French Week 2 heading')[1];
  } else if (basename === 'JS 3 FINE ART.docx' && week === '5') {
    const m = once(
      topic.body,
      /^[ \t]*TOPIC[ \t]*[;:][ \t]*(SINGING IN PARTS AND)[ \t]*\r?\n(?:[ \t]*\r?\n)*[ \t]*(CADENCE IDENTIFICATION)[ \t]*\r?$/m,
      'Fine Art Week 5 wrapped topic',
    );
    title = `${m[1]} ${m[2]}`;
  }

  if (basename === 'js 3 english.docx' && ['7', '8', '9'].includes(week)) {
    // Comprehension activities split out of their preceding lesson by jss3EnglishLessonSplit.
    // The row heading is the activity description verbatim from the body; the body is untouched.
    const lines = topic.body.split('\n').slice(1).map(l => l.trim()).filter(Boolean);
    if (lines.length > 0 && /^COMPREHENSION\b/i.test(lines[0])) {
      const inline = /^COMPREHENSION[ \t]*:[ \t]*-[ \t]*(\S.*)$/i.exec(lines[0]);
      const content = lines.slice(1).map(l => /^CONTENT[ \t]*:[ \t]*(\S.*)$/i.exec(l)).find(Boolean);
      const heading = inline?.[1] ?? content?.[1];
      if (heading) title = heading;
    }
  }

  const cleaned = title.replace(/^[\s;:\-\u2013\u2014]+/, '').trim();
  return { ...topic, title: cleaned.length > 0 ? cleaned : title };
}

// ── Non-instructional rows ─────────────────────────────────────────────────
// Revision / examination rows stay in the import (they are real scheme weeks) but
// are excluded from the instructional count. Matched on (basename, canonical week).
export interface Jss3NonInstructional {
  subject: string;
  basename: string;
  /** Canonical week ("1", "7", "10", ...). */
  week: string;
  kind: 'revision' | 'examination';
}

export const JSS3_SECOND_TERM_NON_INSTRUCTIONAL: readonly Jss3NonInstructional[] = [
  { subject: 'Agricultural Science', basename: 'Agric 2ndT.doc', week: '1', kind: 'revision' },
  { subject: 'Mathematics', basename: MATHS, week: '7', kind: 'examination' },
  { subject: 'French', basename: 'FRENCH  js 3.docx', week: '1', kind: 'revision' },
  // Basic Technology Week 1 (headed "revision") is NOT listed: its body is substantive wood-processing / MDF text (1F-R2).
  { subject: 'Basic Technology', basename: 'basic tech.docx', week: '11', kind: 'revision' },
  { subject: 'Basic Technology', basename: 'basic tech.docx', week: '12', kind: 'examination' },
  { subject: 'Civic Education', basename: 'js 3 civic.docx', week: '1', kind: 'revision' },
  { subject: 'English Language', basename: 'js 3 english.docx', week: '10', kind: 'revision' },
  { subject: 'English Language', basename: 'js 3 english.docx', week: '11', kind: 'examination' },
  { subject: 'Music', basename: 'music.docx', week: '1', kind: 'revision' },
];

export function isJss3SecondTermNonInstructional(basename: string, termLabel: string, weekLabel: string): boolean {
  if (termLabel !== TERM) return false;
  const week = canonicalJss3Week(weekLabel);
  return JSS3_SECOND_TERM_NON_INSTRUCTIONAL.some(e => e.basename === basename && e.week === week);
}

// ── English Second-Term activities that depend on a textbook ──────────────
// Audit note only (no schema/UI change; not consumed by the importer). These rows are
// real source activities, but the source supplies only a reference to the New Oxford
// English course book / a passage that is NOT in the supplied files. They are therefore
// textbook-dependent activities, not complete supplied lessons. No passage was invented.
export type Jss3EnglishActivityCompleteness = 'textbook-dependent' | 'heading-only-incomplete';

export interface Jss3EnglishActivityNote {
  basename: 'js 3 english.docx';
  /** Canonical week ("6", "7", ...). */
  week: string;
  /** Case-insensitive prefix of the parsed row title. */
  titlePrefix: string;
  completeness: Jss3EnglishActivityCompleteness;
  note: string;
}

export const JSS3_SECOND_TERM_ENGLISH_ACTIVITY_NOTES: readonly Jss3EnglishActivityNote[] = [
  { basename: 'js 3 english.docx', week: '6', titlePrefix: 'READING AND ANSWERING QUESTION IN NEW OXFORD', completeness: 'textbook-dependent', note: 'Source gives only a New Oxford English for JSS3 reading reference; the passage/questions are not supplied.' },
  { basename: 'js 3 english.docx', week: '7', titlePrefix: 'EXPOSITORY', completeness: 'heading-only-incomplete', note: 'Source supplies the heading only (no body). Incomplete; nothing was added.' },
  { basename: 'js 3 english.docx', week: '7', titlePrefix: 'Reading a passage in New Oxford', completeness: 'textbook-dependent', note: 'Comprehension passage is in the New Oxford course book and is not supplied.' },
  { basename: 'js 3 english.docx', week: '8', titlePrefix: 'Reading and answering questions on', completeness: 'textbook-dependent', note: 'Comprehension passage is not supplied in the source.' },
  { basename: 'js 3 english.docx', week: '9', titlePrefix: 'Reading and answer questions in a passage', completeness: 'textbook-dependent', note: 'Comprehension passage is in the New Oxford course book and is not supplied.' },
];

export function getJss3SecondTermEnglishActivityNote(
  basename: string,
  termLabel: string,
  weekLabel: string,
  title: string,
): Jss3EnglishActivityNote | undefined {
  if (termLabel !== TERM || basename !== 'js 3 english.docx') return undefined;
  const week = canonicalJss3Week(weekLabel);
  const t = title.trim().toLowerCase();
  return JSS3_SECOND_TERM_ENGLISH_ACTIVITY_NOTES.find(n => n.week === week && t.startsWith(n.titlePrefix.toLowerCase()));
}
