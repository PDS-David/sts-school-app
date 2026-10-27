const WEEK_NUMBER_WORD = 'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen';
const WEEK_MARKER = new RegExp(
  `^[ \\t]*week\\s*[:.\\-]*\\s*((?:\\d+(?:\\s*(?:&|and|,|-)\\s*\\d+)?)|(?:${WEEK_NUMBER_WORD})(?:\\s*(?:&|and|,|-)\\s*(?:${WEEK_NUMBER_WORD}))?)`,
  'gim',
);



// Some files (confirmed real case: this school's Yoruba-language files)
// flatten what was originally a table into plain text where the week
// number appears completely alone on its own line — e.g. "OSE" (Yoruba for
// "WEEK") followed by a blank line, then just "1", then the week's content.
// No "week"/spelled-out-number text appears anywhere, so WEEK_MARKER above
// can't match. This catches that shape specifically: a standalone line
// containing ONLY a number 1-20 (optionally a range like "1&2"), and
// nothing else on that line.
const BARE_NUMBER_LINE = /^[ \t]*(\d{1,2}(?:\s*(?:&|and|,|-)\s*\d{1,2})?)[ \t]*$/gim;

function parseTopics(text) {
  const rawMatches = [...text.matchAll(WEEK_MARKER)];
  // Some valid lesson notes repeat the same marker back-to-back (for
  // example "WEEK 6" immediately followed by "Week: Six"). Collapse only
  // equivalent adjacent markers with no intervening content. Different
  // adjacent weeks are retained so a genuinely empty week remains visible
  // to the audit instead of being silently hidden.
  const weekWordNumber = {
    one: '1', two: '2', three: '3', four: '4', five: '5', six: '6',
    seven: '7', eight: '8', nine: '9', ten: '10', eleven: '11',
    twelve: '12', thirteen: '13',
  };
  const canonicalWeek = (m) => m[1].toLowerCase()
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen)\b/g, w => weekWordNumber[w])
    .replace(/\band\b/g, '&')
    .replace(/\s+/g, '');
  const matches = rawMatches.filter((m, i) => {
    if (i + 1 >= rawMatches.length) return true;
    const next = rawMatches[i + 1];
    const between = text.slice(m.index + m[0].length, next.index).trim();
    return between.length > 0 || canonicalWeek(m) !== canonicalWeek(next);
  });
  if (matches.length > 0) {
    const topics = [];
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index;
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const block = text.slice(start, end).trim();
      const weekLabel = matches[i][0].trim();

      // Prefer an explicit TOPIC field when present. Real Primary sources use
      // several separators (TOPIC:, TOPIC;, TOPIC-, TOPIC—), so accepting only
      // ':' and ';' turned valid lesson plans into one-character/metadata titles.
      const topicLineMatch = block.match(/^\s*topics?\s*(?:[:;\-–—]+\s*)?(.+)$/im);
      let title;
      if (topicLineMatch) {
        title = topicLineMatch[1].trim();
      } else {
        const afterMarker = block.slice(weekLabel.length).trim();
        const metadataLine = /^(?:class|subject|date|duration|term|week|behaviou?ral objectives?|performance objectives?|instructional materials?|reference materials?|previous knowledge|evaluation|content)\s*[:;\-–—]?/i;
        // Some real Primary lesson notes use WEEK -> lesson heading without a
        // TOPIC: label. Accept only a credible heading: skip metadata, bare
        // page/sequence numbers and punctuation fragments, and require at
        // least two letters/numbers. This remains deliberately conservative;
        // an actually empty week stays "(untitled)" and blocks the audit.
        const firstLine = afterMarker
          .split('\n')
          .map(l => l.trim())
          .find(l => {
            if (!l || metadataLine.test(l) || /^\d{1,3}$/.test(l)) return false;
            const signal = l.normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '');
            return signal.length > 1;
          });
        title = (firstLine ?? '(untitled)').slice(0, 200);
      }

      topics.push({ weekLabel, title, body: block });
    }
    return topics;
  }

  // Fallback: bare-number-line week markers (see BARE_NUMBER_LINE above).
  // Require at least 2 matches — a single bare number anywhere in a file
  // (e.g. a page number, a stray count) is not enough evidence this file
  // actually uses this structure, and treating it as one would produce a
  // single giant "topic" covering the whole document.
  const bareMatches = [...text.matchAll(BARE_NUMBER_LINE)];
  if (bareMatches.length >= 2) {
    const topics = [];
    for (let i = 0; i < bareMatches.length; i++) {
      const start = bareMatches[i].index;
      const end = i + 1 < bareMatches.length ? bareMatches[i + 1].index : text.length;
      const block = text.slice(start, end).trim();
      const weekLabel = `Week ${bareMatches[i][1].trim()}`;
      const afterMarker = block.slice(bareMatches[i][0].trim().length).trim();
      const firstLine = afterMarker.split('\n').map(l => l.trim()).find(l => l.length > 0);
      topics.push({ weekLabel, title: (firstLine ?? '(untitled)').slice(0, 200), body: block });
    }
    return topics;
  }

  // Neither structure found — deliberately give up rather than guess.
  // An earlier version of this script fell back to "treat every non-empty
  // line as its own topic", which sounded reasonable but produced 500-1300+
  // garbage single-line rows per file once tested against real files (this
  // school's documents wrap far more aggressively than expected). Flooding
  // `topics` with fragments would actively hurt the feature this data feeds
  // (Brainee-grounded lessons/exercises) — reported as a skip instead, for
  // manual review, same as any other unparseable file.
  return [];
}


module.exports={parseTopics};
