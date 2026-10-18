import fs from 'node:fs';import assert from 'node:assert/strict';
import {createDeliveryResolver} from '../../../../../backend/src/utils/jss3DeliveryCorrection.ts';
const rows=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const dir='docs/jss3/batch2-close/A_MATH_TECH_BUSINESS/';
const corrections=JSON.parse(fs.readFileSync(dir+'DELIVERY_CORRECTIONS.json','utf8'));
const lessons=JSON.parse(fs.readFileSync('backend/src/db/data/jss3Supplements.json','utf8'));
const resolve=createDeliveryResolver(corrections,lessons);const seen=new Set();
for(const row of rows){const original=JSON.stringify(row);const result=resolve({school_code:'secondary',class_name:row.className,title:row.title,source_reference:row.sourceReference});assert.equal(JSON.stringify(row),original);if(result){assert.ok(!seen.has(result.correctionId));seen.add(result.correctionId);assert.ok(result.teaching.length>500);assert.notEqual(result.teaching,row.sourceReference);}}
assert.equal(seen.size,corrections.length);console.log(JSON.stringify({actualMainRows:rows.length,exactCorrectionMatches:seen.size,originalRowsMutated:0,passed:true},null,2));
