/**
 * Curriculum-owner resolutions for verified JSS3 FIRST-TERM source irregularities.
 *
 * Exact-source and JSS3/1st-Term-only: every rule is keyed on `1st Term/<basename>`
 * and the caller must additionally gate on canonical class "JSS 3". These encode
 * the file-by-file JSS3 First-Term review; they are NOT general parser
 * heuristics and must not be reused for other classes or terms without a new
 * source review. Second- and Third-Term JSS3 sources are deliberately NOT
 * covered here: every function below returns its input unchanged for them.
 *
 * Safety property: if a rule's anchor is absent (source changed), the rule
 * THROWS instead of silently passing text through. The importer records the
 * throw as a file read error, which blocks the audit.
 *
 * No lesson content is invented. The only text this module ever adds is
 *   (a) a structural "WEEK n" marker line derived from a heading that the same
 *       source already states (scheme row or body heading), and
 *   (b) for the two scheme-only Basic Technology headings, a
 *       "week n; <verbatim scheme phrase>" line. The phrase is captured from
 *       the source's own scheme row, never typed here.
 * Authorised scheme-only headings (scheme_only_integration_manifest.csv,
 * First Term): Basic Technology "scale drawing", Basic Technology "simple blue
 * print reading", Physical & Health Education "Practical demonstration of
 * basic skills of hockey" (the last already exists as a body heading with no
 * lesson note beneath it; it only needs its week marker made readable).
 */

type Rule = (text: string) => string;

const TERM = '1st Term';

function must(text: string, marker: RegExp, label: string): RegExpExecArray {
  const flags = marker.flags.replace('g', '');
  const m = new RegExp(marker.source, flags).exec(text);
  if (!m) throw new Error(`JSS3 resolution anchor missing: ${label}`);
  return m;
}

function countOf(text: string, marker: RegExp): number {
  const flags = marker.flags.includes('g') ? marker.flags : marker.flags + 'g';
  return [...text.matchAll(new RegExp(marker.source, flags))].length;
}

/** Identity rule that only asserts an anchor exists. */
const requires = (marker: RegExp, label: string): Rule => text => {
  must(text, marker, label);
  return text;
};

/** Keep text from the first match of `marker` onward (drops scheme/preamble). */
const fromMarker = (marker: RegExp, label: string): Rule => text =>
  text.slice(must(text, marker, label).index);

/** Replace the first match of `marker`; throws if absent. */
const replaceOnce = (marker: RegExp, replacement: string, label: string): Rule => text => {
  const flags = marker.flags.replace('g', '');
  must(text, marker, label);
  return text.replace(new RegExp(marker.source, flags), replacement);
};

const compose = (...rules: Rule[]): Rule => text => rules.reduce((t, r) => r(t), text);

// ── Week-word helpers ──────────────────────────────────────────────────────
const WORD_TO_NUM: Record<string, string> = {
  one: '1', two: '2', three: '3', four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11',
  twelve: '12', thirteen: '13',
};

/** "WEEK ONE" / "week 7 & 8" / "Week: Two" -> "1" / "7&8" / "2". */
export function canonicalJss3Week(label: string): string {
  return label
    .replace(/^\s*week\s*[:.\-]*\s*/i, '')
    .toLowerCase()
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen)\b/g, w => WORD_TO_NUM[w])
    .replace(/\band\b/g, '&')
    .replace(/\s+/g, '');
}

// ── Basic Science ──────────────────────────────────────────────────────────
// The file opens with a 9-row scheme ("Week ONE—Drug and Substances Abuse" ...)
// that the generic parser reads as 9 extra topics, duplicating the lessons.
// The lesson body starts at "WEEK ONE-DRUG AND SUBSTANCES ABUSE (!)".
// Inside the body: Week 3 has no WEEK marker (its heading is
// "CAPTER THREE --FAMILY TRAITS", sitting inside the Week 2 block) and Week 8
// is typed "WEEK EIEGHT". Both are structural; no text is rewritten except
// the one mistyped week word.
const basicScience: Rule = compose(
  requires(/^[ \t]*Week[ \t]+THREE[ \t]*-[ \t]*Family Traits/im, 'Basic Science scheme row Week THREE Family Traits'),
  fromMarker(/^[ \t]*WEEK[ \t]+ONE[ \t]*-[ \t]*DRUG AND SUBSTANCES ABUSE/m, 'Basic Science body start WEEK ONE'),
  replaceOnce(/^([ \t]*WEEK[ \t]+)EIEGHT(?=[ \t]*-)/m, '$1EIGHT', 'Basic Science WEEK EIEGHT'),
  replaceOnce(
    /^([ \t]*)(CAPTER[ \t]+THREE[ \t]*-+[ \t]*FAMILY TRAITS)/m,
    '$1WEEK THREE-FAMILY TRAITS\n\n$1$2',
    'Basic Science Week 3 body heading CAPTER THREE --FAMILY TRAITS',
  ),
);

// ── Basic Technology ───────────────────────────────────────────────────────
// Scheme rows 11 and 12 ("scale drawing", "simple blue print reading") have no
// lesson note in the source. Authorised scheme-only integration: emit them as
// the file's own "week n; <phrase>" heading form, phrase captured verbatim.
const basicTech: Rule = text => {
  const scale = must(text, /^[ \t]*11\.[ \t]*(scale drawing)[ \t]*\r?$/im, 'Basic Tech scheme row 11 scale drawing')[1];
  const blueprint = must(text, /^[ \t]*12\.[ \t]*(simple blue print reading)[ \t]*\r?$/im, 'Basic Tech scheme row 12 simple blue print reading')[1];
  must(text, /^week 10; orthographic drawing/im, 'Basic Tech body week 10 (last lesson)');
  if (/^[ \t]*week[ \t]*(?:11|12)\b/im.test(text)) {
    throw new Error('JSS3 resolution: Basic Tech now has a Week 11/12 marker; scheme-only rule no longer applies');
  }
  return `${text.replace(/\s+$/, '')}\n\nweek 11; ${scale}\n\nweek 12; ${blueprint}\n`;
};

// ── Physical & Health Education ────────────────────────────────────────────
// Six of the eleven week markers are invisible to the generic parser:
//   * four are padded with U+00A0 (NBSP), which the importer's [ \t]* anchor
//     does not accept ("WEEK TWO", "WEEK  3", "WEEK 10", "WEEK 11");
//   * two are ordinal-first ("4TH WEEK", "5TH  WEEK");
//   * Week 6 (Female Genital Mutilation) has no marker at all.
// Result without this rule: 3 of 11 lessons parsed, hockey lost. Only the
// marker lines are rewritten; no body text changes.
const PHE_ORD_FIRST = /^[ \t\u00a0]*(\d{1,2})(?:ST|ND|RD|TH)[ \t\u00a0]+WEEK[ \t\u00a0]*\r?$/gim;
const PHE_WEEK_LINE = /^[ \t\u00a0]*WEEK[ \t\u00a0]*(\d{1,2}|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN)[ \t\u00a0]*\r?$/gim;
const phe: Rule = text => {
  let rewritten = 0;
  let out = text.replace(PHE_ORD_FIRST, (_line, n: string) => { rewritten++; return `WEEK ${n}`; });
  out = out.replace(PHE_WEEK_LINE, (line, n: string) => {
    if (!/\u00a0/.test(line)) return line; // already clean (e.g. "WEEK ONE")
    rewritten++;
    return `WEEK ${WORD_TO_NUM[n.toLowerCase()] ?? n}`;
  });
  if (rewritten !== 6) {
    throw new Error(`JSS3 resolution: expected 6 NBSP/ordinal PHE week markers, found ${rewritten}`);
  }
  // Scheme row 6 = Female Genital Mutilation; the lesson (CLASS/SUBJECT/TOPIC
  // block) follows the Week 5 hockey heading with no marker of its own.
  return replaceOnce(
    /^([ \t\u00a0]*CLASS[ \t\u00a0]*:[^\n]*\n(?:[ \t\u00a0\r]*\n)*[ \t\u00a0]*SUBJECT[^\n]*\n(?:[ \t\u00a0\r]*\n)*[ \t\u00a0]*TOPIC[ \t\u00a0]*:[ \t\u00a0]*FEMALE GENITAL MUTILATION)/m,
    'WEEK 6\n\n$1',
    'PHE Week 6 lesson block (TOPIC: FEMALE GENITAL MUTILATION)',
  )(out);
};

// ── English ────────────────────────────────────────────────────────────────
// The scheme table ("WEEK" / "1" / "Revision" ...) is read as a topic with an
// empty title. The lesson body starts at "WEEK ONE (1)".
import { splitJss3EnglishLessons } from './jss3EnglishLessonSplit.js';
import { applyJss3EnglishSymbolCorrections } from './jss3EnglishSymbolCorrections.js';

const english: Rule = text => {
  const body = fromMarker(/^[ \t]*WEEK[ \t]+ONE[ \t]*\(1\)[ \t]*\r?$/m, 'English body start WEEK ONE (1)')(text);
  // Occurrence-specific phonetic-symbol corrections (Task 3); see jss3EnglishSymbolCorrections.ts.
  return splitJss3EnglishLessons(applyJss3EnglishSymbolCorrections(body), '1st Term');
};

// ── Yoruba ─────────────────────────────────────────────────────────────────
// The scheme is a bare-number table (1..13). With no WEEK marker anywhere the
// generic parser falls back to bare numbers, and the LAST scheme number ("13",
// exam) swallows every lesson body. Lesson bodies are headed by Yoruba week
// ordinals ("OSE KINNI" ...). Mirror the JSS1/JSS2 treatment: cut the scheme,
// translate the ordinals. Only the six ordinals actually present are accepted.
const YORUBA_BODY_WEEKS: Array<[string, string]> = [
  ['KINNI', '1'], ['KETA', '3'], ['KERIN', '4'], ['KARUN', '5'], ['KEFA', '6'], ['KEJE', '7'],
];
const yoruba: Rule = text => {
  let body = text.slice(must(text, /^[ \t]*OSE[ \t]+KINNI[ \t]*\r?$/im, 'Yoruba body start OSE KINNI').index);
  for (const [ordinal, week] of YORUBA_BODY_WEEKS) {
    const heading = new RegExp(`^([ \\t]*)OSE[ \\t]+${ordinal}[ \\t]*\\r?$`, 'im');
    const n = countOf(body, heading);
    if (n !== 1) throw new Error(`JSS3 resolution: expected exactly one "OSE ${ordinal}" heading, found ${n}`);
    body = body.replace(heading, `$1WEEK ${week}`);
  }
  const leftover = countOf(body, /^[ \t]*OSE[ \t]+[A-Z]+/im);
  if (leftover !== 0) throw new Error(`JSS3 resolution: ${leftover} unreviewed Yoruba OSE heading(s) remain`);
  return body;
};

const RULES: Record<string, Rule> = {
  [`${TERM}/BASIC SCIENCE.docx`]: basicScience,
  [`${TERM}/BASIC TECH.docx`]: basicTech,
  [`${TERM}/PHE JS 3.docx`]: phe,
  [`${TERM}/js 3 english.doc`]: english,
  [`${TERM}/JS3 YORUBA.docx`]: yoruba,
};

/**
 * Every JSS3 First-Term source file reviewed for this assignment (the 13
 * original files plus the supplied converted Music docx in place of the RTF).
 * Files without a text rule were reviewed and parse correctly as supplied.
 */
export const JSS3_FIRST_TERM_REVIEWED_SOURCES: readonly string[] = [
  'Agric 3.doc',
  'BASIC SCIENCE.docx',
  'BASIC TECH.docx',
  'BUSINESS STUDIES_1.docx',
  'CCA jss3 ALP 2018.docx',
  'FRENCH Jss3.docx',
  'HOME ECONS JS3 WK7-10.docx',
  'JS 3 SOCIAL STUDIES.docx',
  'JS3 YORUBA.docx',
  'JSS 3 CIVIC (E NOTE).docx',
  'JSS 3 MATHEMATICS.docx',
  'JSS3 Alpha term music Enote.docx',
  'PHE JS 3.docx',
  'js 3 english.doc',
];

/** True only for the reviewed JSS3 First-Term source files that carry a text rule. */
export function hasJss3SourceResolution(basename: string, termLabel: string): boolean {
  return Object.prototype.hasOwnProperty.call(RULES, `${termLabel}/${basename}`);
}

export function applyJss3SourceTextResolution(basename: string, termLabel: string, text: string): string {
  const key = `${termLabel}/${basename}`;
  return Object.prototype.hasOwnProperty.call(RULES, key) ? RULES[key](text) : text;
}

interface ParsedTopicLike { weekLabel: string; title: string; body: string }

const isReviewed = (basename: string, termLabel: string) =>
  termLabel === TERM && JSS3_FIRST_TERM_REVIEWED_SOURCES.includes(basename);

/**
 * Title-only corrections for reviewed First-Term rows. Never changes the week
 * label, order, or body (sourceReference), and never drops a topic.
 *
 * Root causes (all in the generic parser, left untouched by design):
 *  - the TOPIC-field lookup matches "Topics Covered" in Basic Tech Week 6;
 *  - the metadata-line filter is a bare prefix match, so a real heading that
 *    merely STARTS with "term"/"class" ("TERMS AND SIGNS",
 *    "CLASSES AND PROPERTIES OF FIBRES") is discarded as a field label;
 *  - the marker regex leaves its separator ("; ", "-", "—") on the title.
 */
export function resolveJss3ParsedTopic<T extends ParsedTopicLike>(
  basename: string,
  termLabel: string,
  topic: T,
): T | null {
  if (!isReviewed(basename, termLabel)) return topic;
  const week = canonicalJss3Week(topic.weekLabel);
  let title = topic.title;

  if (basename === 'BASIC TECH.docx') {
    const heading = must(topic.body, /^[ \t]*week[ \t]*\d+[ \t]*;[ \t]*(.+?)[ \t]*\r?$/im, `Basic Tech Week ${week} heading`);
    title = heading[1];
  } else if (basename === 'HOME ECONS JS3 WK7-10.docx' && week === '2') {
    title = must(topic.body, /^[ \t]*(CLASSES AND PROPERTIES OF FIBRES)[ \t]*\r?$/m, 'Home Economics Week 2 heading')[1];
  } else if (basename === 'JSS3 Alpha term music Enote.docx' && week === '5') {
    title = must(topic.body, /^[ \t]*(TERMS AND SIGNS)[ \t]*\r?$/m, 'Music Week 5 heading')[1];
  }

  const cleaned = title.replace(/^[\s;:\-\u2013\u2014]+/, '').trim();
  return { ...topic, title: cleaned.length > 0 ? cleaned : title };
}
