/** Exact-source JSS3 English lesson segmentation. Original instructional characters are preserved.
 * Only structural WEEK markers are inserted between distinct instructional strands.
 * Called solely by the JSS3 First/Second-Term source-resolution modules.
 */
const WEEK = /^[ \t]*WEEK[ \t]+(?:ONE[ \t]*\(1\)|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|\d+)[ \t]*:?[ \t]*$/gim;
const FIRST_LESSON = /^(?:[ \t]*(?:GRAMMAR|SPEECH\s+WORKS?|COMPOSITION|READING\s+AND\s+COMPREHENSION|LITERATURE\s*(?:IN\s+ENGLISH|[-–]\s*IN\s*[-–]\s*ENGLISH)?|COMPREHENSION)[ \t]*:?[ \t]*[^\n]*)$/gim;
const SECOND_LESSON = /^(?:[ \t]*(?:(?:GRAMMAR|SPEECH\s+WORK|COMPOSITION)[ \t]*:[ \t]*)?TOPIC[ \t]*:?[ \t]*(?!for\s+article\b)[^\n]+|[ \t]*COMPREHENSION[ \t]*(?::[ \t]*-[^\n]*)?|[ \t]*(?:GRAMMAR[ \t]*:[ \t]*QUESTION\s+TAGS|SPEECH\s+WORK[ \t]*:[ \t]*VOWEL\s*\/Ә\/)[^\n]*)$/gim;

// A bare strand label (GRAMMAR / SPEECH WORK / COMPOSITION / COMPREHENSION) on its own line
// introduces the lesson that follows it. Second-Term only.
const TRAILING_STRAND_LABEL = /(?:^|\n)([ \t]*(?:GRAMMAR|SPEECH\s+WORK|COMPOSITION|COMPREHENSION)[ \t]*:?[ \t]*\r?\n(?:[ \t]*\r?\n)*)$/i;
const BARE_COMPREHENSION = /^[ \t]*COMPREHENSION[ \t]*:?[ \t]*\r?$/i;
const TOPIC_LINE = /^[ \t]*TOPIC[ \t]*:?/i;

export function splitJss3EnglishLessons(text: string, term: '1st Term' | '2nd Term'): string {
  // Second-Term source begins with a scheme of work (including Week 1
  // revision), followed by two Week 2 instructional lessons before WEEK THREE.
  // Exclude only that non-lesson scheme preamble from importer input.
  if (term === '2nd Term') {
    const first = /^\s*TOPIC\s*:\s*CONSONANT CONTRAST\s*\/t\/\s*and\s*\/s\//im.exec(text);
    const week3 = /^[ \t]*WEEK[ \t]+THREE[ \t]*\r?$/im.exec(text);
    if (!first || !week3 || first.index >= week3.index) throw new Error('JSS3 English 2nd Term: missing original Weeks 1–2 lessons or WEEK THREE anchor');
    const schemePreamble = text.slice(0, first.index);
    if (!/SCHEME|SHECME/i.test(schemePreamble) || !/Revision/i.test(schemePreamble)) {
      throw new Error('JSS3 English 2nd Term: unexpected source preamble; refusing to discard text');
    }
    text = text.slice(first.index);
    text = `WEEK TWO\n${text}`;
  }
  const weeks = [...text.matchAll(WEEK)];
  if (!weeks.length) throw new Error(`JSS3 English ${term}: no source week markers`);
  const lessonPattern = term === '1st Term' ? FIRST_LESSON : SECOND_LESSON;
  let output = text.slice(0, weeks[0].index);
  for (let i = 0; i < weeks.length; i++) {
    const start = weeks[i].index!;
    const end = i + 1 < weeks.length ? weeks[i + 1].index! : text.length;
    const chunk = text.slice(start, end);
    const weekLineEnd = chunk.indexOf('\n');
    if (weekLineEnd < 0) { output += chunk; continue; }
    const header = chunk.slice(0, weekLineEnd).trim();
    const body = chunk.slice(weekLineEnd + 1);
    const candidates = [...body.matchAll(lessonPattern)].filter(m => {
      const line = m[0].trim();
      if (term === '1st Term') {
        // These headings are instructional strand starts; subheadings such as
        // 'Grammar: Part of speech' are retained verbatim in their own bodies.
        return !/^(?:COMPREHENSION\s*:\s*READING\s*$)/i.test(line);
      }
      if (/^TOPIC\s*:\s*for\s+article/i.test(line)) return false;
      // COMPREHENSION followed by TOPIC is a strand label for that TOPIC lesson, not a lesson of its own.
      if (BARE_COMPREHENSION.test(line)) {
        const next = body.slice(m.index! + m[0].length).split('\n').find(l => l.trim() !== '');
        if (next !== undefined && TOPIC_LINE.test(next)) return false;
      }
      return true;
    });
    if (!candidates.length) { output += chunk; continue; }
    output += chunk.slice(0, weekLineEnd + 1);
    let previous = 0;
    for (let j = 0; j < candidates.length; j++) {
      const c = candidates[j];
      let cut = c.index!;
      if (term === '2nd Term' && j > 0) {
        // Keep a stranded strand label with the lesson it introduces (text moves with its lesson; none is dropped).
        const lead = body.slice(previous, cut);
        const label = TRAILING_STRAND_LABEL.exec(lead);
        if (label) cut = previous + lead.length - label[1].length;
      }
      output += body.slice(previous, cut);
      if (j > 0) output += `\n${header}\n`;
      previous = cut;
    }
    output += body.slice(previous);
  }
  return output;
}
