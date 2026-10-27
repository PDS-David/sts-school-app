import fs from 'node:fs'; import mammoth from 'mammoth';
import { recoverEquationsInDocx } from './eqrec.ts';
const [src,out]=process.argv.slice(2);
const {buffer,...rest}=await recoverEquationsInDocx(fs.readFileSync(src));
const t=(await mammoth.extractRawText({buffer})).value; fs.writeFileSync(out,t); console.log(src.split('/').pop(),t.length,JSON.stringify(rest));
