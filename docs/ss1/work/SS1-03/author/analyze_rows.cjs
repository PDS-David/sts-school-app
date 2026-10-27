const fs=require('fs'),c=require('crypto');const {parseTopics}=require('./parse.cjs');
const sha=s=>c.createHash('sha256').update(s).digest('hex');
const map={'SS1-SRC-0c9004137f95':'M1','SS1-SRC-b802686e83d2':'M2','SS1-SRC-ca00ca94afb9':'M3','SS1-SRC-43c5ab51b87f':'F2','SS1-SRC-c7a7523bdb0d':'F3','SS1-SRC-af4868d2c026':'T2'};
const out={};
for(const f of fs.readdirSync('/home/claude/work/text')){const id=f.replace('.txt','');const t=fs.readFileSync('/home/claude/work/text/'+f,'utf8');const ts=parseTopics(t);
 let eq=null; if(map[id]){eq=parseTopics(fs.readFileSync('/home/claude/work/eq/'+map[id]+'.txt','utf8'));}
 out[id]=ts.map((x,i)=>({i,week:x.weekLabel,title:x.title,len:x.body.length,id:`${id}:BODY:${sha(x.body)}`,body_sha256:sha(x.body),eqExtra:eq&&eq[i]?eq[i].body.length-x.body.length:null,eqTitleMatch:eq&&eq[i]?eq[i].title===x.title:null}));
 console.log(id,'rows',ts.length,'eq rows aligned',eq?eq.length:'-', eq? 'extra/row '+out[id].map(r=>r.eqExtra).join(','):'');}
fs.writeFileSync('/home/claude/work/rows.json',JSON.stringify(out,null,1));
