/**
 * Curriculum-owner resolutions for verified JSS1 source irregularities.
 *
 * These rules are intentionally exact-source and JSS1-only. They encode the
 * file-by-file review completed before import; they are not general parser
 * heuristics and must not be reused for JSS2 or later classes without a new
 * source review.
 */

type ParsedTopicLike = { weekLabel: string; title: string; body: string };

const canonicalWeek = (value: string) => value
  .toLowerCase()
  .replace(/^\s*week\s*[:.\-]*\s*/i, '')
  .replace(/\band\b/g, '&')
  .replace(/\s+/g, '');

function truncateAt(text: string, marker: RegExp): string {
  const match = marker.exec(text);
  return match?.index === undefined ? text : text.slice(0, match.index);
}

function fromMarker(text: string, marker: RegExp, replacementPrefix = ''): string {
  const match = marker.exec(text);
  if (match?.index === undefined) return text;
  return replacementPrefix + text.slice(match.index);
}

function fromNthMarker(text: string, marker: RegExp, occurrence: number): string {
  const flags = marker.flags.includes('g') ? marker.flags : marker.flags + 'g';
  const matches = [...text.matchAll(new RegExp(marker.source, flags))];
  const match = matches[occurrence - 1];
  return match?.index === undefined ? text : text.slice(match.index);
}

const YORUBA_WEEK_NUMBERS: Array<[RegExp, string]> = [
  [/kin[\s-]*in[\s-]*(?:ni|in)/i, '1'],
  [/keji/i, '2'],
  [/keta/i, '3'],
  [/kerin/i, '4'],
  [/karun(?:[\s-]*un)?/i, '5'],
  [/kefa/i, '6'],
  [/keje/i, '7'],
  [/kejo/i, '8'],
  [/kesa(?:[\s-]*an)?/i, '9'],
  [/kewaa/i, '10'],
  [/kokanla/i, '11'],
  [/kejila/i, '12'],
  [/ketala/i, '13'],
];

function normalizeYorubaWeeks(text: string): string {
  return text.replace(
    /^[ \t]*OSE[ \t]+([^\r\n:]+)(?:[ \t]*:[ \t]*)?/gim,
    (whole, ordinal: string) => {
      const resolved = YORUBA_WEEK_NUMBERS.find(([pattern]) => pattern.test(ordinal));
      return resolved ? `WEEK ${resolved[1]}` : whole;
    },
  );
}

function normalizeInlineJss1WeekHeadings(text: string): string {
  // Reviewed CCA/Fine-Art material sometimes flattens "CLASS; JSS1" and
  // "WEEK n" onto one line. The generic parser intentionally requires WEEK
  // at line start, so restore only that lost line break for JSS1 sources.
  return text.replace(
    /^([ \t]*CLASS\s*[:;\-–—]?\s*J\s*\.?\s*S\s*\.?\s*S?\s*\.?\s*1)\s*(WEEK\s*[:;\-–—]?\s*(?:\d+(?:\s*[-&]\s*\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen))/gim,
    '$1\n$2',
  );
}

export function isJss1SourceExcluded(basename: string, termLabel: string): boolean {
  // This file contains a genuine JSS1 scheme followed by an explicit JSS3
  // Advertising lesson body. A scheme alone is structural evidence, not
  // student lesson content, so the reviewed file contributes no topic rows.
  return (
    (termLabel === '1st Term' && basename === 'BUSINESS STUDIES_1.docx')
    || (termLabel === '2nd Term' && basename === 'basic tech js 1.docx')
  );
}

export function applyJss1SourceTextResolution(
  basename: string,
  termLabel: string,
  text: string,
): string {
  // Reviewed scheme+lesson files: start at the actual lesson sequence so
  // scheme-of-work rows cannot become student topics. Exact-source/JSS1-only.
  const lessonBodyStart: Record<string, { marker: RegExp; occurrence: number }> = {
    '1st Term/JSS 1 GENERAL MATHEMATICS.docx': { marker: /^\s*WEEK\s*1\b/gim, occurrence: 2 },
    '1st Term/SOCIAL STUDIES..docx': { marker: /^\s*WEEK\s+(?:1|ONE)\b/gim, occurrence: 2 },
    '2nd Term/JS 1 MATHS.docx': { marker: /^\s*WEEK\s*2\b/gim, occurrence: 2 },
    '2nd Term/new 2nd term SOCIAL STUDIES e note  2017 ..docx': { marker: /^\s*WEEK\s+(?:1|ONE)\b/gim, occurrence: 2 },
    '3rd Term/BASIC TECHNOLOGY.docx': { marker: /^\s*WEEK\s*1\b/gim, occurrence: 2 },
    '3rd Term/ENGLISH.docx': { marker: /^\s*WEEK\s+(?:1|ONE)\b/gim, occurrence: 2 },
    '3rd Term/MATHS.docx': { marker: /^\s*WEEK\s*1\b/gim, occurrence: 2 },
    '3rd Term/S0CIAL STUDIES.docx': { marker: /^\s*WEEK\s+(?:1|ONE)\b/gim, occurrence: 2 },
  };
  const lessonStart = lessonBodyStart[`${termLabel}/${basename}`];
  if (lessonStart) {
    text = fromNthMarker(text, lessonStart.marker, lessonStart.occurrence);
  }

  if (termLabel === '1st Term' && basename === 'P H E.docx') {
    // The valid JSS1 First-Term PHE material is followed by a second embedded
    // document explicitly headed BASIC 8. Stop before that appended source.
    text = truncateAt(text, /^\s*SUBJECT[-–—\s]*PHYSICAL\s+AND\s+HEALTH\s+EDUCATION\s*\n\s*BASIC\s*8\b/im);
  }

  if (termLabel === '2nd Term' && basename === 'basic tech js 1.docx') {
    // The JSS1 Basic Technology scheme is valid, but the following lesson body
    // switches to unrelated Road Safety content. Retain only the reviewed
    // structural evidence; no unrelated lesson text can pass through.
    text = truncateAt(text, /^\s*Week\s*1\s*;\s*Home\s*[›>]\s*Road\s+Safety\b/im);
  }

  if (termLabel === '1st Term' && basename === 'YORUBA LANGUAGE JSS 1 E NOTE   NEW1.docx') {
    // Its numbered scheme is structural evidence. The lesson body begins with
    // the Week-1 alphabet topic but omits an OSE heading there; add only that
    // missing parser marker, then normalize the later Yoruba OSE headings.
    text = fromMarker(text, /^\s*AKOLE\s+ISE\s*[–—-]\s*ALIFABETI\s+YORUBA\b/im, 'WEEK 1\n');
    text = normalizeYorubaWeeks(text);
  }

  if (termLabel === '2nd Term' && basename === '1. 2nd term YORUBA e note js  20 17.docx') {
    // Skip the scheme preamble by starting at the standalone Week-1 lesson
    // heading, then translate Yoruba week ordinals for the generic parser.
    text = fromMarker(text, /^\s*OSE\s+KIN[\s-]*IN[\s-]*(?:NI|IN)\s*$/im);
    text = normalizeYorubaWeeks(text);
  }

  if (termLabel === '3rd Term' && basename === 'YORUBA.docx') {
    text = normalizeYorubaWeeks(text);
  }

  text = normalizeInlineJss1WeekHeadings(text);
  return text;
}

export function resolveJss1ParsedTopic<T extends ParsedTopicLike>(
  basename: string,
  termLabel: string,
  topic: T,
): T | null {
  const week = canonicalWeek(topic.weekLabel);

  if (
    termLabel === '2nd Term'
    && basename === 'business_studies JSS1.docx'
    && week === '9'
  ) {
    // The supplied Business Studies source itself contains a Week 9 chemicals
    // lesson. Review found it anomalous for this subject; do not invent a
    // replacement and do not import the anomalous row.
    return null;
  }

  if (termLabel === '3rd Term' && basename === 'MATHS.docx') {
    const normalizedTitle = topic.title.toLowerCase().replace(/\s+/g, ' ').trim();
    // The scheme reserves Week 1 for revision. The lesson body starts Simple
    // Equation as Week 1 and Plane Shapes as Week 2; align those two explicit
    // lesson labels to the verified scheme. Later lesson labels already align.
    if (week === '1' && normalizedTitle.includes('simple equation')) {
      return { ...topic, weekLabel: 'WEEK 2' };
    }
    if (week === '2' && normalizedTitle.includes('plane shape')) {
      return { ...topic, weekLabel: 'WEEK 3' };
    }
  }

  return topic;
}
