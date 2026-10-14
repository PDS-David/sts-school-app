// Transaction-control tests with a fake PG client; not a live PostgreSQL test.
import test from 'node:test';
import assert from 'node:assert/strict';
import { pool } from '../backend/src/db/pool.ts';
import { attachAssets, type PreparedAsset } from '../backend/src/db/attachTopicAssets.ts';
const asset: PreparedAsset = {asset_key:'A',file:'a.png',sha256:'abc',order_index:2,caption:'new',kind:'image',displayed:true,sort_order:10,expected_title:'Lesson',bytes:Buffer.from('image'),mime:'image/png'};
const existing = {sha256:'abc',mime:'image/png',caption:'old',kind:'image',displayed:false,sort_order:20};
const options = {schoolCode:'test',subject:'Music',className:'JSS 3',termLabel:'1st Term',apply:false,skipTitleCheck:false};
function stub(t: any, row = existing, failUpdate = false) {
  const calls: Array<{sql:string,params:any[]}> = [];
  let released=false;
  t.mock.method(pool, 'connect', async () => ({
    query: async (sql:string, params:any[] = []) => {
      calls.push({sql,params});
      if (sql.includes('SELECT t.id')) return {rows:[{id:7,title:'Lesson'}]};
      if (sql.includes('SELECT sha256')) return {rows:[row]};
      if (sql.includes('UPDATE topic_assets')) return {rows:[],rowCount:failUpdate?0:1};
      return {rows:[],rowCount:0};
    },
    release: () => {released=true;},
  }));
  return {calls, released:()=>released};
}
test('metadata drift aborts by default without writes and releases client', async t => {
  const s=stub(t);
  await assert.rejects(attachAssets([asset],options),/Metadata conflict/);
  assert.ok(s.calls.some(c=>c.sql==='ROLLBACK'));
  assert.ok(!s.calls.some(c=>/^(INSERT|UPDATE)/.test(c.sql)));
  assert.ok(s.released());
});
test('explicit metadata dry run reports planned update but never writes', async t => {
  const s=stub(t);
  assert.deepEqual(await attachAssets([asset],{...options,updateMetadata:true}),{planned:0,inserted:0,alreadyPresent:0,metadataPlanned:1,metadataUpdated:0});
  assert.ok(s.calls.some(c=>c.sql==='ROLLBACK'));
  assert.ok(!s.calls.some(c=>/^(INSERT|UPDATE)/.test(c.sql)));
});
test('explicit apply updates metadata only, retaining byte/hash/MIME and topic identity', async t => {
  const s=stub(t);
  const r=await attachAssets([asset],{...options,apply:true,updateMetadata:true});
  assert.equal(r.metadataUpdated,1);
  const update=s.calls.find(c=>c.sql.startsWith('UPDATE'))!;
  assert.deepEqual(update.params,[7,'A','image','new',10,true,'abc','image/png']);
  assert.doesNotMatch(update.sql.split('WHERE')[0],/\b(bytes|sha256|mime|topic_id|asset_key)\s*=/);
  assert.ok(s.calls.some(c=>c.sql==='COMMIT'));
  assert.match(s.calls.find(c=>c.sql.includes('SELECT t.id'))!.sql,/FOR UPDATE OF t/);
});
test('unchanged metadata is idempotent', async t => {
  const s=stub(t,{...existing,caption:asset.caption!,displayed:asset.displayed,sort_order:asset.sort_order});
  const r=await attachAssets([asset],{...options,apply:true,updateMetadata:true});
  assert.equal(r.alreadyPresent,1);assert.equal(r.metadataUpdated,0);
  assert.ok(!s.calls.some(c=>/^(INSERT|UPDATE)/.test(c.sql)));
});
test('metadata flag cannot authorize replacement bytes', async t => {
  const s=stub(t,{...existing,sha256:'different'});
  await assert.rejects(attachAssets([asset],{...options,apply:true,updateMetadata:true}),/different sha256/);
  assert.ok(s.calls.some(c=>c.sql==='ROLLBACK'));
});
test('metadata flag cannot authorize a MIME change', async t => {
  stub(t,{...existing,mime:'image/gif'});
  await assert.rejects(attachAssets([asset],{...options,apply:true,updateMetadata:true}),/different MIME/);
});
test('lost update aborts the transaction instead of falsely reporting success', async t => {
  const s=stub(t,existing,true);
  await assert.rejects(attachAssets([asset],{...options,apply:true,updateMetadata:true}),/Metadata update conflict/);
  assert.ok(s.calls.some(c=>c.sql==='ROLLBACK'));
  assert.ok(!s.calls.some(c=>c.sql==='COMMIT'));
});
