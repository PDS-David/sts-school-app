/**
 * Curriculum-owner decision (8 Oct 2026): JSS3 Third Term is strictly BECE
 * examination preparation. Every substantive instructional topic found in the
 * original JSS3 Third-Term sources is redistributed into JSS3 First or Second
 * Term; Third Term receives ZERO topic rows. Computer Studies is excluded.
 *
 * Exact-source and JSS3/3rd-Term-only: every rule is keyed on `3rd Term/<basename>`
 * and the importer wiring additionally gates on canonical class "JSS 3". First-
 * and Second-Term behaviour lives in jss3CurriculumResolutions.ts and
 * jss3SecondTermResolutions.ts and is neither modified nor duplicated here.
 *
 * Safety properties
 *  - A text rule THROWS if its anchor is missing or ambiguous.
 *  - redistributeJss3ThirdTermTopics THROWS if the parsed topics of a reviewed
 *    source do not match the manifest exactly (count, order, week, title), so an
 *    unaccounted-for Third-Term topic fails the import audit instead of being
 *    silently dropped or silently kept in Third Term.
 *  - Only an exact duplicate may be omitted, and the importer re-proves each
 *    claimed duplicate against the actual First/Second-Term row body hash.
 *
 * No lesson content is invented. The only text this module adds is a structural
 * "WEEK n" marker line derived from a heading the same source already states.
 * Source typos (RADIOACTVITY, Ethnical, MAKETING, TRAINIG, REVITIONS,
 * AKORIN EKO, ...) are preserved verbatim.
 */

import { canonicalJss3Week } from './jss3CurriculumResolutions.js';

type Rule = (text: string) => string;

export const JSS3_THIRD_TERM = '3rd Term';
const TERM = JSS3_THIRD_TERM;

// ── Anchor helpers (missing OR ambiguous throws) ───────────────────────────
function all(text: string, marker: RegExp): RegExpMatchArray[] {
  const flags = marker.flags.includes('g') ? marker.flags : marker.flags + 'g';
  return [...text.matchAll(new RegExp(marker.source, flags))];
}

function once(text: string, marker: RegExp, label: string): RegExpMatchArray {
  const found = all(text, marker);
  if (found.length === 0) throw new Error(`JSS3 3rd-Term resolution anchor missing: ${label}`);
  if (found.length > 1) {
    throw new Error(`JSS3 3rd-Term resolution anchor ambiguous (${found.length} matches): ${label}`);
  }
  return found[0];
}

const fromMarker = (marker: RegExp, label: string): Rule => text =>
  text.slice(once(text, marker, label).index!);

function replaceOnce(text: string, marker: RegExp, replacement: string, label: string): string {
  once(text, marker, label);
  return text.replace(new RegExp(marker.source, marker.flags.replace('g', '')), replacement);
}

// ── Basic Science ──────────────────────────────────────────────────────────
// A 5-row scheme ("WEEK 1-Family life Education One" ...) precedes the lessons and
// is read as 5 extra topics. The lesson body starts at "WEEK 1- FAMILY LIFE EDUCATION [i]".
const basicScience: Rule = fromMarker(
  /^[ \t]*WEEK 1-[ \t]*FAMILY LIFE EDUCATION \[i\]/m,
  'Basic Science body start WEEK 1- FAMILY LIFE EDUCATION [i]',
);

// ── Basic Technology ───────────────────────────────────────────────────────
// A 6-row scheme ("Week 1: revision of last term's work" ...) precedes the lessons
// and duplicates them. The lesson body starts at "Week 1         revision".
const basicTech: Rule = fromMarker(/^Week 1[ \t]{2,}revision[ \t]*\r?$/m, 'Basic Tech body start Week 1 revision');

// ── Music ──────────────────────────────────────────────────────────────────
// The scheme ("WEEK ONE ---- REVISION & REVISION EXERCISE" ...) duplicates the lessons.
// The body starts at the bare "WEEK ONE" line.
const music: Rule = fromMarker(/^[ \t]*WEEK ONE[ \t]*\r?$/m, 'Music body start WEEK ONE');

// ── Yoruba ─────────────────────────────────────────────────────────────────
// Bare-number scheme (1..6); lessons are headed by Yoruba ordinals. Cut the scheme and
// translate exactly the five ordinals present (the body has no lesson for scheme
// week 4 "AKANLO EDE", so body ordinals run one behind the scheme from KERIN).
const YORUBA_WEEKS: ReadonlyArray<readonly [string, string]> = [
  ['KINNI', '1'], ['KEJI', '2'], ['KETA', '3'], ['KERIN', '4'], ['KAUN', '5'],
];
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
  const leftover = all(body, /^[ \t]*OSE[ \t]+[A-Z]+[ \t]*\r?$/m).length;
  if (leftover !== 0) throw new Error(`JSS3 3rd-Term resolution: ${leftover} unreviewed Yoruba OSE heading(s) remain`);
  return body;
};

// ── Cultural & Creative Arts (Fine art) ────────────────────────────────────
// Each lesson opens "CLASS;  J S S 3  WEEK n" on one line with "TOPIC; ..." on the
// next. The generic parser needs WEEK at the start of a line, so each of the six
// header lines is split into "WEEK n / CLASS...". The scheme's own WEEK rows are
// dropped (they would duplicate the lessons); the file's preamble (SUBJECT line)
// is kept because it identifies the subject for the importer.
const FINE_ART_HEADER =
  /^[ \t\u00a0]*(CLASS[^\n]*?)[ \t\u00a0]*\bWEEK[ \t\u00a0]*(\d{1,2}(?:[ \t\u00a0]*-[ \t\u00a0]*\d{1,2})?)[ \t\u00a0\r]*$/gm;
const fineArt: Rule = text => {
  const headers = all(text, FINE_ART_HEADER);
  if (headers.length !== 6) {
    throw new Error(`JSS3 3rd-Term resolution: expected exactly 6 Fine Art CLASS/WEEK header lines, found ${headers.length}`);
  }
  const scheme = once(text, /^[ \t]*SCHEME OF WORK[ \t]*\r?$/m, 'Fine Art SCHEME OF WORK');
  const firstHeader = headers[0].index!;
  if (firstHeader < scheme.index!) throw new Error('JSS3 3rd-Term resolution: Fine Art lesson header precedes the scheme');
  const clean = (s: string) => s.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
  const body = text.slice(firstHeader).replace(
    FINE_ART_HEADER,
    (_line, cls: string, wk: string) => `WEEK ${clean(wk).replace(/\s+/g, '')}\n${clean(cls)}`,
  );
  return `${text.slice(0, scheme.index!)}${body}`;
};

// ── English ────────────────────────────────────────────────────────────────
// The scheme is an unnumbered "Review of ..." list read as nothing; the lessons sit
// under only three WEEK headings (TWO, THREE, THREE) but carry nine TOPIC lines.
// Cut the scheme and give every TOPIC block its own WEEK line (inheriting the week
// heading it sits under) so each topic parses as its own row. A block opens with
// "REVISION / <SECTION> / TOPIC: ..." (section = SPEECH WORK, GRAMMAR, ...).
const english: Rule = text => {
  const start = once(text, /^[ \t]*WEEK TWO[ \t]*\r?$/m, 'English body start WEEK TWO');
  const lines = text.slice(start.index!).split('\n');
  const out: string[] = [];
  let week = '';
  let pendingMarker = false; // a WEEK line was just emitted and no topic block has used it yet
  const blockStart = /^[ \t]*REVISION[ \t]*\r?$/;
  const section = /^[ \t]*(SPEECH WORK|GRAMMAR|COMPOSITION|LITERATURE)[ \t]*\r?$/;
  const topicLine = /^[ \t]*TOPIC[ \t]*:/;
  const nextNonBlank = (from: number): number => {
    let j = from;
    while (j < lines.length && lines[j].trim() === '') j++;
    return j;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wk = /^[ \t]*WEEK[ \t]+(TWO|THREE)[ \t]*\r?$/.exec(line);
    if (wk) {
      week = wk[1];
      pendingMarker = true;
      out.push(line);
      continue;
    }
    if (blockStart.test(line)) {
      const j = nextNonBlank(i + 1);
      const k = j < lines.length && section.test(lines[j]) ? nextNonBlank(j + 1) : -1;
      if (k >= 0 && k < lines.length && topicLine.test(lines[k])) {
        if (!week) throw new Error('JSS3 3rd-Term resolution: English topic block before any WEEK heading');
        if (!pendingMarker) out.push(`WEEK ${week}`);
        pendingMarker = false;
      }
    }
    out.push(line);
  }
  return out.join('\n');
};

// ── Physical & Health Education ────────────────────────────────────────────
// The last lesson block ("WEEK SIX / DRUG EDUCATION") is followed in the source by a
// separate heading pair "WEEKS SEVEN AND EIGHT" / "REVISON AND EXAMINATION" (1F-R5).
// The generic parser only reads WEEK<number> markers, so the plural "WEEKS ..." line
// was not a boundary and both lines were swallowed into the Drug Education body.
// One structural marker line "WEEK 7&8" (the weeks the source heading itself names;
// the scheme row reads "7& 8.") is inserted immediately before the heading. The
// heading lines are kept byte-for-byte, so the source spelling "REVISON" is preserved
// and the parsed title is the body's own first heading line, "REVISON AND EXAMINATION".
// Every other line, including the whole Drug Education lesson, is untouched.
const phe: Rule = text =>
  replaceOnce(
    text,
    /^([ \t]*)(WEEKS SEVEN AND EIGHT[ \t]*\r?\n(?:[ \t]*\r?\n)*[ \t]*REVISON AND EXAMINATION[ \t]*\r?)$/m,
    '$1WEEK 7&8\n$1$2',
    'PHE heading WEEKS SEVEN AND EIGHT / REVISON AND EXAMINATION',
  );

const RULES: Record<string, Rule> = {
  [`${TERM}/Basic science.docx`]: basicScience,
  [`${TERM}/BASIC TECH.docx`]: basicTech,
  [`${TERM}/MUSIC.docx`]: music,
  [`${TERM}/OMEGA TERM YORUBA JS3.docx`]: yoruba,
  [`${TERM}/Fine art.docx`]: fineArt,
  [`${TERM}/ENGLISH.docx`]: english,
  [`${TERM}/PHE.docx`]: phe,
};

/** True only for the reviewed JSS3 Third-Term source files that carry a text rule. */
export function hasJss3ThirdTermSourceResolution(basename: string, termLabel: string): boolean {
  return Object.prototype.hasOwnProperty.call(RULES, `${termLabel}/${basename}`);
}

export function applyJss3ThirdTermSourceTextResolution(basename: string, termLabel: string, text: string): string {
  const key = `${termLabel}/${basename}`;
  return Object.prototype.hasOwnProperty.call(RULES, key) ? RULES[key](text) : text;
}

// ═══════════════════════════════════════════════════════════════════════════
// Source → destination manifest
// ═══════════════════════════════════════════════════════════════════════════

export type Jss3Destination = '1st Term' | '2nd Term';
export type Jss3ThirdTermClassification =
  | 'instructional'     // substantive teaching content; imported into destination term
  | 'exact-duplicate'   // body identical to an existing First/Second-Term row; not re-imported
  | 'revision'          // revision / review week; BECE preparation, no topic row
  | 'examination'       // examination / past-question practice; BECE preparation, no topic row
  | 'held';             // heading-only or scheme-only item NOT covered by an owner-approved manifest; not imported

export interface Jss3ThirdTermEntry {
  subject: string;
  basename: string;
  /** Canonical source week as canonicalJss3Week() renders it ("2", "5&6", "6-8", ...) or "scheme". */
  week: string;
  /** Expected (cleaned) topic title for parsed rows; the scheme phrase for scheme-only rows. */
  title: string;
  kind: 'parsed' | 'scheme-only';
  classification: Jss3ThirdTermClassification;
  destination?: Jss3Destination;
  duplicateOf?: { basename: string; week: string; term: '1st Term' };
  /** scheme-only rows: text that must appear in the source (traceability test). */
  sourcePhrase?: string;
  /** Instructional rows only: import this row immediately before the same file's entry for this canonical week. */
  placeBeforeWeek?: string;
  note: string;
}

const T1 = '1st Term' as const;
const T2 = '2nd Term' as const;

const AGRIC = 'Agriculture science  Book 3.docx';
const BTECH = 'BASIC TECH.docx';
const BUSS = 'BUSINESS STUDIES FOR JSS3.docx';
const BSCI = 'Basic science.docx';
const CIVIC = 'CIVIC.docx';
const ENGL = 'ENGLISH.docx';
const FART = 'Fine art.docx';
const HECO = 'HOME ECONS.docx';
const MUSI = 'MUSIC.docx';
const YORU = 'OMEGA TERM YORUBA JS3.docx';
const PHED = 'PHE.docx';
const CIVIC_T1 = 'JSS 3 CIVIC (E NOTE).docx';

const inst = (subject: string, basename: string, week: string, title: string, destination: Jss3Destination, note: string): Jss3ThirdTermEntry =>
  ({ subject, basename, week, title, kind: 'parsed', classification: 'instructional', destination, note });
const dup = (week: string, title: string): Jss3ThirdTermEntry => ({
  subject: 'Civic Education', basename: CIVIC, week, title, kind: 'parsed', classification: 'exact-duplicate',
  duplicateOf: { basename: CIVIC_T1, week, term: T1 },
  note: `Body is byte-for-byte (normalized) identical to the First-Term Civic Education week ${week} row; not re-imported.`,
});
const nonInst = (
  subject: string, basename: string, week: string, title: string,
  classification: 'revision' | 'examination' | 'held', kind: 'parsed' | 'scheme-only', note: string, sourcePhrase?: string,
): Jss3ThirdTermEntry => ({ subject, basename, week, title, kind, classification, note, ...(sourcePhrase ? { sourcePhrase } : {}) });

/**
 * One entry per Third-Term scheme item and per parsed lesson of the eleven original
 * JSS3 Third-Term sources. Destination choices follow subject sequence: each topic
 * joins the term whose existing strand it continues (rationale in `note`). They are
 * proposals for owner review; changing one is a one-line manifest edit.
 */
export const JSS3_THIRD_TERM_MANIFEST: readonly Jss3ThirdTermEntry[] = [
  // ── Agricultural Science ────────────────────────────────────────────────
  nonInst('Agricultural Science', AGRIC, 'scheme', 'Revision', 'revision', 'scheme-only', 'Scheme week 1 "Revision"; no lesson text.', 'Revision'),
  inst('Agricultural Science', AGRIC, '2', 'Definition and objectives of export promotion in agriculture', T1, 'Marketing strand: 1st Term runs packaging, branding, advertising; export promotion continues agricultural marketing.'),
  inst('Agricultural Science', AGRIC, '3', 'Example of Nigerian export product', T1, 'Marketing strand (follows export promotion definition).'),
  inst('Agricultural Science', AGRIC, '4', 'Benefits of export promotion', T1, 'Marketing strand (scheme: "Benefit of export production in agriculture"; body heading preserved).'),
  // ── Basic Science ───────────────────────────────────────────────────────
  inst('Basic Science', BSCI, '1', 'FAMILY LIFE EDUCATION [i]', T1, 'Health/family strand: 1st Term has drug abuse, drug control agencies, family traits.'),
  inst('Basic Science', BSCI, '2', 'FAMILY LIFE EDUCATION [ii].', T1, 'Health/family strand (continuation of [i]).'),
  inst('Basic Science', BSCI, '3', 'RADIOACTVITY', T2, 'Physics strand: 2nd Term has light, sound, magnetism, electrical energy. Source typo "RADIOACTVITY" preserved (scheme: Radioactivity).'),
  inst('Basic Science', BSCI, '4', 'Ethnical issues in science and development', T2, 'Follows the 2nd-Term science/technology strand. Source typo "Ethnical" preserved (scheme: Ethical).'),
  inst('Basic Science', BSCI, '5', 'Simple Machine', T2, 'Physics strand (energy and machines).'),
  // ── Basic Technology ────────────────────────────────────────────────────
  // Week 1 is headed "revision" but its body is a substantive explanation of linear/rotary motion
  // components (air cylinders ... roller screws) with two questions. Instructional; imported into
  // 2nd Term immediately before "machine motion", keeping source term 3rd / week 1 and the full body.
  { ...inst('Basic Technology', BTECH, '1', 'Linear and Rotary Motion Components', T2, 'Source heading "Week 1 revision" but substantive motion-component explanations and two questions (1F-R2). Continues the motion strand; placed immediately before "machine motion". Title is the body\'s own first heading; body untouched, source truncations preserved.'), placeBeforeWeek: '5&6' },
  inst('Basic Technology', BTECH, '2', 'Fault detection', T2, 'Follows 2nd-Term electrical house wiring and tools.'),
  inst('Basic Technology', BTECH, '3', 'basic Electronics', T2, 'Electrical strand (2nd-Term house wiring).'),
  inst('Basic Technology', BTECH, '4', 'Components of electronics', T2, 'Electrical strand (scheme: "basic electronics (continues) - components, uses").'),
  inst('Basic Technology', BTECH, '5&6', 'machine motion', T2, 'Continues 2nd-Term "motion in engineering". Combined-week lesson: scheme splits linear (wk 5) and rotary (wk 6) motion; the body is one "Week 5 and 6" lesson, kept as one row.'),
  nonInst('Basic Technology', BTECH, 'scheme', 'revision & examination', 'examination', 'scheme-only', 'Scheme "7_12 revision & examination."; no lesson text.', '7_12 revision'),
  // ── Business Studies ────────────────────────────────────────────────────
  nonInst('Business Studies', BUSS, 'scheme', 'REVISION OF LAST TERM’S WORK', 'revision', 'scheme-only', 'Scheme week 1 revision; no lesson text.', 'REVISION OF LAST TERM'),
  inst('Business Studies', BUSS, '2', 'ERASING TECHNIQUES', T2, 'Office-practice strand: 2nd Term has keyboarding, display, printers correction signs.'),
  inst('Business Studies', BUSS, '3', 'MEMORANDUM', T2, 'Office-practice strand (documents).'),
  inst('Business Studies', BUSS, '4', 'BUSINESS LETTER', T2, 'Office-practice strand (documents).'),
  inst('Business Studies', BUSS, '5', 'BUSINESS LETTER (CONTINUATION)', T2, 'Office-practice strand (continuation).'),
  inst('Business Studies', BUSS, '6', 'SIMPLE TABULATION', T2, 'Office-practice strand (typed display).'),
  nonInst('Business Studies', BUSS, 'scheme', 'REVISION/EXAMINATION', 'examination', 'scheme-only', 'Scheme week 7; no lesson text.', 'REVISION/EXAMINATION'),
  // ── Civic Education ─────────────────────────────────────────────────────
  nonInst('Civic Education', CIVIC, '1', 'Review of last term work', 'revision', 'parsed', 'Week 1 review.'),
  dup('2', 'The role of citizen in constitutional developments'),
  dup('3', 'National Security'),
  dup('4', 'State Security Service'),
  dup('5', 'Self-Employment'),
  dup('6', 'Self Employment II'),
  dup('7', 'Managing For Results.'),
  nonInst('Civic Education', CIVIC, '8', 'General Revision.', 'revision', 'parsed', 'Week 8 general revision.'),
  nonInst('Civic Education', CIVIC, '9', 'Practice past AKWA', 'examination', 'parsed', 'Week 9 past-question practice ("AKWA" is the source wording).'),
  // ── English Language ────────────────────────────────────────────────────
  nonInst('English Language', ENGL, 'scheme', 'Scheme of work: review / past-question weeks and 11 EXAMINATION', 'revision', 'scheme-only', 'The unnumbered scheme lists review and past-question weeks (comprehension, structure, composition, literature) and "11 EXAMINATION"; no per-line lesson text beyond the body topics below.', 'OMEGA TERM JSS THREE'),
  inst('English Language', ENGL, '2', 'THE VOWEL SOUNDS', T2, 'Speech-work strand: 1st Term has consonant sounds, 2nd Term vowel contrasts. Each body block sits under a "REVISION" caption in the source; treated as instructional because it is full teaching text (owner to confirm).'),
  inst('English Language', ENGL, '2', 'MEANING AND TYPES OF NOUN', T1, 'Grammar foundations (1st-Term grammar sequence). Source caption "REVISION"; full teaching text.'),
  inst('English Language', ENGL, '2', 'ESSAY WRITING', T2, 'Composition strand: 2nd Term opens with article writing. Source caption "REVISION"; full teaching text.'),
  inst('English Language', ENGL, '3', 'VOWEL SOUNDS', T2, 'Speech-work strand (sub-topic: diphthongs). Source caption "REVISION"; full teaching text.'),
  inst('English Language', ENGL, '3', 'LITERARY TERMS', T1, 'Literature strand: 1st Term introduces fiction/non-fiction and poetry. Source caption "REVISION".'),
  inst('English Language', ENGL, '3', 'ARTICLE', T1, 'Grammar strand (second source block labelled WEEK THREE; label preserved). Grammatical articles, distinct from 2nd-Term "article writing".'),
  inst('English Language', ENGL, '3', 'PART OF SPEECH', T1, 'Grammar strand (adjectives and adverbs; extends 1st-Term grammar rows).'),
  // ── Cultural & Creative Arts ────────────────────────────────────────────
  inst('Cultural & Creative Arts', FART, '1', 'MODULATION.', T2, 'Music-theory strand: follows 2nd-Term harmony, cadences and minor scale.'),
  inst('Cultural & Creative Arts', FART, '2', 'MAKETING OF ART WORKS.', T1, 'Follows 1st-Term exhibition and display techniques. Source typo "MAKETING" preserved.'),
  inst('Cultural & Creative Arts', FART, '3', 'UNITY.', T2, 'Design-principles strand with 2nd-Term motifs and lettering.'),
  inst('Cultural & Creative Arts', FART, '4', 'PRACTICAL: BREATH CONTROL VOICE TRAINIG AND INSTRUMENTALS.', T2, 'Vocal strand (2nd-Term singing in parts). Source typo "TRAINIG" preserved; wrapped source title joined.'),
  inst('Cultural & Creative Arts', FART, '5', 'BATIK', T2, 'Textile-craft strand (2nd-Term knitting).'),
  nonInst('Cultural & Creative Arts', FART, '6-8', 'REVITIONS ON PREVIOUS WORKS.', 'revision', 'parsed', 'Weeks 6-8 revision. Source typo "REVITIONS" preserved.'),
  nonInst('Cultural & Creative Arts', FART, 'scheme', 'J S C E EXAMINATION', 'examination', 'scheme-only', 'Scheme line after week 6; no lesson text.', 'EXAMINATION'),
  // ── Home Economics ──────────────────────────────────────────────────────
  nonInst('Home Economics', HECO, 'scheme', 'Revision of last terms work', 'revision', 'scheme-only', 'First scheme line; no lesson text.', 'Revision of last terms work'),
  inst('Home Economics', HECO, '1', 'FAMILY LIVING AND RELATIONSHIP', T1, 'Family-living strand opens in 1st Term.'),
  inst('Home Economics', HECO, '2', 'PREGNACY AND CHILDBIRTH', T1, 'Family-living strand. Source typo "PREGNACY" preserved.'),
  inst('Home Economics', HECO, '3', 'CHILD CARE', T2, 'Family-living strand continues in 2nd Term (sequence kept: relationships, pregnancy, then child care and development).'),
  inst('Home Economics', HECO, '4', 'CHILD CARE [CONTD]', T2, 'Continuation of child care.'),
  inst('Home Economics', HECO, '5', 'CHILD DEVELOPMENT', T2, 'Closes the family-living strand.'),
  nonInst('Home Economics', HECO, 'scheme', 'Project work on JSSCE and examination', 'examination', 'scheme-only', 'Last scheme line; no lesson text.', 'Project work on JSSCE'),
  // ── Music ───────────────────────────────────────────────────────────────
  nonInst('Music', MUSI, '1', 'REVISION EXERCISE', 'revision', 'parsed', 'Week 1 revision exercise.'),
  inst('Music', MUSI, '2', 'PERIODS IN MUSIC: BAROUQE, CLASSICAL & ROMANTIC', T1, 'History strand with 1st-Term composers and musical forms. Source typo "BAROUQE" preserved.'),
  inst('Music', MUSI, '3', 'TRANSCRIPTION FROM STAFF TO SOLFA-NOTATION', T1, 'Notation skill before 1st-Term melody writing.'),
  inst('Music', MUSI, '4', 'TRANSPOSITION', T2, 'Extends 2nd-Term "TRANSPOSITION" (week 9): this lesson (clef and key-to-dominant transposition) shares only its 3-line introduction with it, so it is retained, not treated as a duplicate. Owner may merge.'),
  inst('Music', MUSI, '5', 'MODULATION', T2, 'Follows 2nd-Term cadences and inversion of triads.'),
  inst('Music', MUSI, '6', 'TERMS & SIGNS', T1, 'Glossary of 19 terms (anon ... ) with no entry in common with 1st-Term "TERMS AND SIGNS" (dynamics etc.); joins it in 1st Term.'),
  nonInst('Music', MUSI, 'scheme', 'REVISION OF PAST QUESTION & EXAMINATION', 'examination', 'scheme-only', 'Scheme weeks 7-13; no lesson text.', 'REVISION OF PAST QUESTION'),
  // ── Yoruba ──────────────────────────────────────────────────────────────
  inst('Yoruba', YORU, '1', 'AKORI EKO: LETA GBEFE', T2, 'Follows 2nd-Term informal letter (leta aigbefe).'),
  inst('Yoruba', YORU, '2', 'AKORI EKO: ATUNYEWO OWE ILE YORUBA', T1, 'Oral-literature/culture strand with 1st-Term poetry and sports.'),
  inst('Yoruba', YORU, '3', 'AKORI EKO: AAYAN OGBUFO', T2, 'Translation skill, language-use strand (2nd-Term sentence building, letters).'),
  nonInst('Yoruba', YORU, 'scheme', 'AKANLO EDE', 'held', 'scheme-only', 'Scheme week 4 "AKANLO EDE" has NO lesson body in the source (the body has five OSE headings for six scheme topics). Not covered by the owner-approved scheme-only manifest; held for owner approval, not imported.', 'AKANLO EDE'),
  inst('Yoruba', YORU, '4', 'AKORIN EKO: ISEDA ORO{ISODOURKO}', T1, 'Word-formation strand with 1st-Term phonology and word structure. Body heading is OSE KERIN (week 4) although the scheme numbers it 5; body wording preserved ("AKORIN").'),
  inst('Yoruba', YORU, '5', 'AKORI EKO: EYAN', T2, 'Same topic and five-type taxonomy as 2nd-Term week 3 EYAN, but the body is a separate write-up with no shared 10-word run, so it is retained, not treated as an exact duplicate. Body heading is OSE KAUN (week 5; scheme numbers it 6). Owner may merge.'),
  nonInst('Yoruba', YORU, 'scheme', 'Atunyewo lori gbogbo ise saa yii ati idanwo ipari', 'revision', 'scheme-only', 'Final scheme line (revision of the term and end-of-term examination).', 'idanwo ipari'),
  // ── Physical & Health Education ─────────────────────────────────────────
  inst('Physical & Health Education', PHED, '1', 'Family Health', T1, 'Health strand: 1st Term has female genital mutilation, family life and sex education, ageing.'),
  inst('Physical & Health Education', PHED, '2', 'TAEKWONDO', T2, 'Combat/sports strand with 2nd-Term swimming and gymnastics.'),
  nonInst('Physical & Health Education', PHED, '3', 'Practical on Taekwondo', 'held', 'parsed', 'Heading only: three lines, no lesson text, and not in the owner-approved scheme-only manifest. Held for owner approval, not imported.'),
  inst('Physical & Health Education', PHED, '4', 'Sexually Transmitted Diseases (STDs)', T1, 'Health strand (1st-Term family life and sex education).'),
  inst('Physical & Health Education', PHED, '5', 'BOXING', T2, 'Combat/sports strand (with Taekwondo).'),
  inst('Physical & Health Education', PHED, '6', 'DRUG EDUCATION', T1, 'Health strand (1st-Term).'),
  // 1F-R5: the source heading "WEEKS SEVEN AND EIGHT" / "REVISON AND EXAMINATION" was embedded in the Drug Education body.
  // It is now its own parsed block (see the PHE text rule); BECE preparation, not a lesson. Source spelling "REVISON" preserved.
  nonInst('Physical & Health Education', PHED, '7&8', 'REVISON AND EXAMINATION', 'examination', 'parsed', 'Source heading "WEEKS SEVEN AND EIGHT / REVISON AND EXAMINATION" (scheme row "7& 8. Revision and Examination"); no lesson text. Revision/examination marker, BECE preparation; not imported. Separated from the Drug Education body in 1F-R5.'),
];

/** The eleven reviewed Third-Term source files (Computer Studies and French/Mathematics/Social Studies have none). */
export const JSS3_THIRD_TERM_REVIEWED_SOURCES: readonly string[] = [
  AGRIC, BTECH, BUSS, BSCI, CIVIC, ENGL, FART, HECO, MUSI, YORU, PHED,
];

/** Subjects that must have zero JSS3 rows in every term. */
export const JSS3_EXCLUDED_SUBJECTS: readonly string[] = ['Computer Studies'];

// ── Title resolution ───────────────────────────────────────────────────────
interface ParsedTopicLike { weekLabel: string; title: string; body: string }

const cleanTitle = (title: string): string => {
  const cleaned = title.replace(/^[\s;:\-\u2013\u2014.]+/, '').replace(/\s+/g, ' ').trim();
  return cleaned.length > 0 ? cleaned : title.trim();
};
const normTitle = (t: string): string => cleanTitle(t).normalize('NFKC').toLowerCase();

/**
 * Title-only recovery for two rows whose generic title is wrong. Week label, order
 * and body are never touched.
 *  - Music week 6: the real heading "TERMS & SIGNS" starts with "term", so the
 *    parser's metadata filter skips it and picks the first glossary line.
 *  - Fine Art week 4: the source wraps "TOPIC; PRACTICAL: BREATH CONTROL VOICE
 *    TRAINIG AND / INSTRUMENTALS."; the two fragments are joined with one space.
 */
function resolveTitle(basename: string, week: string, topic: ParsedTopicLike): string {
  if (basename === BTECH && week === '1') {
    return once(topic.body, /^[ \t]*(Linear and Rotary Motion Components)[ \t]*\r?$/m, 'Basic Tech week 1 heading')[1];
  }
  if (basename === MUSI && week === '6') {
    return once(topic.body, /^[ \t]*(TERMS & SIGNS)[ \t]*\r?$/m, 'Music week 6 heading')[1];
  }
  if (basename === FART && week === '4') {
    const m = once(
      topic.body,
      /^[ \t]*TOPIC[ \t]*[;:][ \t]*(PRACTICAL: BREATH CONTROL VOICE TRAINIG AND)[ \t]*\r?\n(?:[ \t]*\r?\n)*[ \t]*(INSTRUMENTALS\.)[ \t]*\r?$/m,
      'Fine Art week 4 wrapped topic',
    );
    return `${m[1]} ${m[2]}`;
  }
  return topic.title;
}

export interface Jss3DuplicateClaim {
  basename: string;
  week: string;
  title: string;
  bodyHashInput: string;
  duplicateOf: { basename: string; week: string; term: '1st Term' };
}

export interface Jss3ThirdTermRecord {
  subject: string;
  basename: string;
  originalTerm: '3rd Term';
  week: string;
  title: string;
  kind: 'parsed' | 'scheme-only';
  classification: Jss3ThirdTermClassification;
  destination: Jss3Destination | '';
  duplicateOf: string;
  note: string;
  /** Raw (pre-normalization) body of a parsed row, for hashing by the caller; '' for scheme-only rows. */
  bodyForHash: string;
}

export interface Jss3Redistribution<T> {
  /** Instructional topics to import, each stamped with its destination term. */
  kept: Array<T & { destinationTerm: Jss3Destination }>;
  claims: Jss3DuplicateClaim[];
  records: Jss3ThirdTermRecord[];
}

/**
 * Account for every parsed topic of one JSS3 Third-Term source. Throws unless the
 * parsed (week, title) sequence equals the manifest's parsed entries for that file,
 * so a missing, extra, renamed or reordered topic fails the audit.
 */
export function redistributeJss3ThirdTermTopics<T extends ParsedTopicLike>(
  basename: string,
  termLabel: string,
  subjectName: string,
  topics: T[],
): Jss3Redistribution<T> {
  if (termLabel !== TERM) throw new Error(`JSS3 3rd-Term redistribution called for term "${termLabel}"`);
  if (!JSS3_THIRD_TERM_REVIEWED_SOURCES.includes(basename)) {
    throw new Error(`JSS3 3rd-Term source "${basename}" has not been reviewed; its topics are not accounted for`);
  }
  const entries = JSS3_THIRD_TERM_MANIFEST.filter(e => e.basename === basename);
  const parsedEntries = entries.filter(e => e.kind === 'parsed');
  const resolved = topics.map(t => {
    const week = canonicalJss3Week(t.weekLabel);
    return { topic: t, week, title: cleanTitle(resolveTitle(basename, week, t)) };
  });
  const describe = (xs: Array<{ week: string; title: string }>) => xs.map(x => `${x.week}:${x.title}`).join(' | ');
  const mismatch =
    resolved.length !== parsedEntries.length
    || resolved.some((r, i) => r.week !== parsedEntries[i].week || normTitle(r.title) !== normTitle(parsedEntries[i].title));
  if (mismatch) {
    throw new Error(
      `JSS3 3rd-Term manifest mismatch for "${basename}": parsed [${describe(resolved)}] vs manifest [${describe(parsedEntries)}]`,
    );
  }
  const wrongSubject = entries.find(e => e.subject !== subjectName);
  if (wrongSubject) {
    throw new Error(`JSS3 3rd-Term subject mismatch for "${basename}": importer says "${subjectName}", manifest says "${wrongSubject.subject}"`);
  }

  const kept: Array<T & { destinationTerm: Jss3Destination }> = [];
  const claims: Jss3DuplicateClaim[] = [];
  const records: Jss3ThirdTermRecord[] = [];
  const keptEntries: Jss3ThirdTermEntry[] = [];
  let cursor = 0;
  for (const e of entries) {
    const rec = (body: string): Jss3ThirdTermRecord => ({
      subject: e.subject, basename: e.basename, originalTerm: TERM, week: e.week, title: e.title, kind: e.kind,
      classification: e.classification, destination: e.destination ?? '',
      duplicateOf: e.duplicateOf ? `${e.duplicateOf.term} / ${e.duplicateOf.basename} / week ${e.duplicateOf.week}` : '',
      note: e.note, bodyForHash: body,
    });
    if (e.kind === 'scheme-only') { records.push(rec('')); continue; }
    const r = resolved[cursor++];
    records.push(rec(r.topic.body));
    if (e.classification === 'instructional') {
      kept.push({ ...r.topic, title: r.title, destinationTerm: e.destination! });
      keptEntries.push(e);
    } else if (e.classification === 'exact-duplicate') {
      claims.push({ basename, week: e.week, title: e.title, bodyHashInput: r.topic.body, duplicateOf: e.duplicateOf! });
    }
  }
  // Honour explicit placement (e.g. Basic Technology Week 1 immediately before "machine motion").
  // Order only; every row and body is retained exactly once.
  [...keptEntries].forEach(e => {
    if (!e.placeBeforeWeek) return;
    const i = keptEntries.indexOf(e);
    const target = keptEntries.findIndex(x => x.week === e.placeBeforeWeek);
    if (target < 0) throw new Error(`JSS3 3rd-Term placement target week ${e.placeBeforeWeek} missing for "${basename}" week ${e.week}`);
    const [row] = kept.splice(i, 1);
    keptEntries.splice(i, 1);
    const at = keptEntries.findIndex(x => x.week === e.placeBeforeWeek);
    kept.splice(at, 0, row);
    keptEntries.splice(at, 0, e);
  });
  return { kept, claims, records };
}
