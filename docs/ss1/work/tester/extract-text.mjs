// Extract the text of a registered source member the way the workers do, to re-derive their hashes.
//   node docs/ss1/work/tester/extract-text.mjs "<archive member path>" <out.txt>
// .docx -> mammoth extractRawText; .doc -> word-extractor getBody(). Prints length, line count and SHA256 of member and text.
// The member is read from docs/ss1/sources/SSS1-original.zip into a private temp file (never committed).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root = resolve(new URL('../../../../', import.meta.url).pathname);
const [member, out] = process.argv.slice(2);
if (!member || !out) { console.error('usage: extract-text.mjs "<member>" <out.txt>'); process.exit(2); }
const sha = b => createHash('sha256').update(b).digest('hex');
const archive = join(root, 'docs/ss1/sources/SSS1-original.zip');
const bytes = execFileSync('unzip', ['-p', archive, member], { maxBuffer: 256 * 1024 * 1024 });
const tmp = join(mkdtempSync(join(tmpdir(), 'ss1-')), 'src' + extname(member));
writeFileSync(tmp, bytes);
let text;
if (extname(member).toLowerCase() === '.docx') {
  const mammoth = (await import(join(root, 'node_modules/mammoth/lib/index.js'))).default;
  text = (await mammoth.extractRawText({ path: tmp })).value;
} else {
  const WE = (await import(join(root, 'node_modules/word-extractor/lib/word.js'))).default;
  text = (await new WE().extract(tmp)).getBody();
}
writeFileSync(out, text);
console.log(JSON.stringify({ member_bytes: bytes.length, member_sha256: sha(bytes), text_chars: text.length, text_lines: text.split('\n').length, text_sha256: sha(Buffer.from(text, 'utf8')) }));
