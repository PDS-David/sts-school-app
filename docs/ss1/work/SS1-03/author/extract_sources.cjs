// Mirrors ingestTopics.ts extractText (generic path) + parseTopics verbatim for ID computation
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const mammoth=require('mammoth');const WordExtractor=require('word-extractor');
async function extractText(p){ if(/\.(docx|docm)$/i.test(p)){const {value}=await mammoth.extractRawText({path:p});return value;} const d=await new WordExtractor().extract(p);return d.getBody(); }
module.exports={extractText};
if(require.main===module){(async()=>{const csv=fs.readFileSync(process.argv[2],'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l=>l.split(','));
 const want=new Set(['mathematics','further-mathematics','physics','technical-drawing']);
 for(const r of csv){const slug=r[5];if(!want.has(slug))continue;const f=path.join('/home/claude/ss1-staged',r[1]);const t=await extractText(f);fs.writeFileSync(`/home/claude/work/text/${r[0]}.txt`,t);console.log(r[0],slug,r[4],t.length);}})();}
