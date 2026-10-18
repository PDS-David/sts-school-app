/**
 * JSS3 Mathematics — recovery of Word equation (Office Math, OMML) text.
 *
 * `mammoth.extractRawText` silently drops every `<m:oMath>` element, so the two JSS3 Mathematics sources
 * lost their fractions, powers, roots and formulas (379 equations in the First-Term file, 75 in the Second-Term
 * file; recorded as OB-14). This module rewrites each equation in `word/document.xml` as an ordinary text run
 * holding a plain-text rendering of the equation, so the unchanged mammoth call then reads it in place.
 *
 * Scope is deliberately narrow: only the two JSS3 Mathematics source files named below are processed, so every
 * other class, subject and document keeps its previous importer output byte for byte. Nothing here touches the
 * source file on disk, a database or any other class.
 *
 * Rendering conventions (plain text a learner can read):
 *   fraction  a/b  (brackets added when numerator or denominator is more than one simple token)
 *   power     x² x³ x⁴ …, otherwise x^(n)      subscript  x_1
 *   root      √x or √(a + b); an nth root is √[n](x)
 *   brackets  ( … ) and any bracket characters stored in the equation
 *   sum       Σf (limits shown as _(…)^(…) only when present)
 *   function  sin 30°, tan θ
 * Anything not listed is rendered as its child text in order, never dropped.
 */
import path from 'node:path';
import JSZip from 'jszip';

/** `<folder>|<basename>` of the only sources this recovery applies to (folder names are trimmed). */
export const JSS3_EQUATION_SOURCES: readonly string[] = [
  'JSS3 1ST TERM|JSS 3 MATHEMATICS.docx',
  'JSS3 2ND TERM|BASIC 9 MATHEMATICS E-NOTE.docx',
];

export function isJss3EquationSource(filePath: string): boolean {
  const norm = filePath.replace(/\\/g, '/');
  const base = path.posix.basename(norm).trim();
  const folder = path.posix.basename(path.posix.dirname(norm)).trim();
  return JSS3_EQUATION_SOURCES.includes(`${folder}|${base}`);
}

// ── minimal XML tree (OMML is regular; no external XML dependency is needed) ──────────────────────
interface XNode { name: string; attrs: Record<string, string>; kids: XNode[]; text: string }
const unesc = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10))).replace(/&amp;/g, '&');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function parseXml(src: string): XNode {
  const root: XNode = { name: '#root', attrs: {}, kids: [], text: '' };
  const stack: XNode[] = [root];
  const re = /<(\/?)([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[5] !== undefined) { stack[stack.length - 1].text += unesc(m[5]); continue; }
    if (m[1]) { if (stack.length > 1) stack.pop(); continue; }
    const attrs: Record<string, string> = {};
    for (const a of m[3].matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[a[1]] = unesc(a[2] ?? a[3] ?? '');
    const node: XNode = { name: m[2], attrs, kids: [], text: '' };
    stack[stack.length - 1].kids.push(node);
    if (!m[4]) stack.push(node);
  }
  return root.kids[0] ?? root;
}

// ── OMML to plain text ──────────────────────────────────────────────────────────────────────────
const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const kid = (n: XNode, name: string) => n.kids.find(k => k.name === name);
const isProp = (n: XNode) => /Pr$/.test(n.name) || n.name === 'w:rPr';
const simple = (s: string) => /^[\w.,°π∞θα-ωΑ-Ω′″-]+$/u.test(s.trim()) || /^\([^()]*\)$/.test(s.trim());
const wrap = (s: string) => (simple(s) ? s.trim() : `(${s.trim()})`);

function kids(n: XNode | undefined): string { return n ? n.kids.filter(k => !isProp(k)).map(lin).join('') : ''; }

function lin(n: XNode): string {
  switch (n.name) {
    case 'm:t': return n.text;
    case 'm:r': return kids(n);
    case 'm:f': return `${wrap(kids(kid(n, 'm:num')))}/${wrap(kids(kid(n, 'm:den')))}`;
    case 'm:sSup': { const b = kids(kid(n, 'm:e')), e = kids(kid(n, 'm:sup')).trim(); return `${/[+\-−×÷\s]/.test(b.trim()) && !/^\(.*\)$/.test(b.trim()) ? `(${b.trim()})` : b}${/^\d$/.test(e) ? SUP[e] : /^\d+$/.test(e) ? [...e].map(c => SUP[c]).join('') : `^${wrap(e)}`}`; }
    case 'm:sSub': return `${kids(kid(n, 'm:e'))}_${wrap(kids(kid(n, 'm:sub')))}`;
    case 'm:sSubSup': return `${kids(kid(n, 'm:e'))}_${wrap(kids(kid(n, 'm:sub')))}^${wrap(kids(kid(n, 'm:sup')))}`;
    case 'm:rad': {
      const deg = kids(kid(n, 'm:deg')).trim(), e = kids(kid(n, 'm:e'));
      return deg && deg !== '2' ? `√[${deg}]${wrap(e)}` : (simple(e) ? `√${e.trim()}` : `√(${e.trim()})`);
    }
    case 'm:d': {
      const pr = kid(n, 'm:dPr'); const beg = kid(pr ?? n, 'm:begChr')?.attrs['m:val'] ?? '('; const end = kid(pr ?? n, 'm:endChr')?.attrs['m:val'] ?? ')';
      const sep = kid(pr ?? n, 'm:sepChr')?.attrs['m:val'] ?? ',';
      return `${beg}${n.kids.filter(k => k.name === 'm:e').map(kids).join(sep)}${end}`;
    }
    case 'm:nary': {
      const pr = kid(n, 'm:naryPr'); const chr = kid(pr ?? n, 'm:chr')?.attrs['m:val'] ?? '∫';
      const sub = kids(kid(n, 'm:sub')).trim(), sup = kids(kid(n, 'm:sup')).trim();
      return `${chr}${sub ? `_${wrap(sub)}` : ''}${sup ? `^${wrap(sup)}` : ''}${kids(kid(n, 'm:e'))}`;
    }
    case 'm:func': { const f = kids(kid(n, 'm:fName')).trim(), e = kids(kid(n, 'm:e')); return e.startsWith('(') ? `${f}${e}` : `${f} ${e}`; }
    case 'm:limLow': return `${kids(kid(n, 'm:e'))}_${wrap(kids(kid(n, 'm:lim')))}`;
    case 'm:limUpp': return `${kids(kid(n, 'm:e'))}^${wrap(kids(kid(n, 'm:lim')))}`;
    case 'm:eqArr': return n.kids.filter(k => k.name === 'm:e').map(kids).join('; ');
    case 'm:m': return `[${n.kids.filter(k => k.name === 'm:mr').map(r => r.kids.filter(c => c.name === 'm:e').map(kids).join(' ')).join('; ')}]`;
    default: return kids(n);
  }
}

/** Plain-text rendering of one `<m:oMath>` or `<m:oMathPara>` element given as XML text. */
export function ommlToText(xml: string): string {
  const root = parseXml(xml);
  const parts = root.name === 'm:oMathPara' ? root.kids.filter(k => k.name === 'm:oMath').map(lin) : [lin(root)];
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/** Replace every equation in a WordprocessingML document by a text run holding its plain-text rendering. */
export function replaceEquationsInDocumentXml(xml: string): { xml: string; count: number } {
  let count = 0;
  const run = (block: string) => { count += 1; return `<w:r><w:t xml:space="preserve">${esc(ommlToText(block))}</w:t></w:r>`; };
  let out = xml.replace(/<m:oMathPara\b[^>]*>[\s\S]*?<\/m:oMathPara>/g, run);
  out = out.replace(/<m:oMath\b[^>]*\/>/g, () => '').replace(/<m:oMath\b[^>]*>[\s\S]*?<\/m:oMath>/g, run);
  return { xml: out, count };
}

/** Returns a copy of the .docx bytes with its equations rewritten as text runs. The input is never modified. */
export async function recoverEquationsInDocx(bytes: Buffer): Promise<{ buffer: Buffer; count: number }> {
  const zip = await JSZip.loadAsync(bytes);
  const entry = zip.file('word/document.xml');
  if (!entry) throw new Error('word/document.xml missing; cannot recover equations');
  const { xml, count } = replaceEquationsInDocumentXml(await entry.async('string'));
  zip.file('word/document.xml', xml);
  return { buffer: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }), count };
}
