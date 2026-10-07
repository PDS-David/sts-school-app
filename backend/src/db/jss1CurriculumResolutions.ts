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

export function applyJss1SourceTextResolution(
  basename: string,
  termLabel: string,
  text: string,
): string {
  if (termLabel === '1st Term' && basename === 'BUSINESS STUDIES_1.docx') {
    // The opening table is the reviewed JSS1 scheme. The lesson body then
    // explicitly changes class to JSS3 ("WEEK ONE JSS 3") and must not be
    // ingested as JSS1.
    return truncateAt(text, /^\s*WEEK\s+ONE\s+JSS\s*3\b/im);
  }

  if (termLabel === '1st Term' && basename === 'P H E.docx') {
    // The valid JSS1 First-Term PHE material is followed by a second embedded
    // document explicitly headed BASIC 8. Stop before that appended source.
    return truncateAt(text, /^\s*SUBJECT[-–—\s]*PHYSICAL\s+AND\s+HEALTH\s+EDUCATION\s*\n\s*BASIC\s*8\b/im);
  }

  if (termLabel === '2nd Term' && basename === 'basic tech js 1.docx') {
    // The JSS1 Basic Technology scheme is valid, but the following lesson body
    // switches to unrelated Road Safety content. Retain only the reviewed
    // scheme as structural evidence.
    return truncateAt(text, /^\s*Week\s*1\s*;\s*Home\s*[›>]\s*Road\s+Safety\b/im);
  }

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
