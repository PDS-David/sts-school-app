import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLessonAssets } from '../mobile/src/api/lessonAssets.ts';
test('image token is read after the metadata request refreshes authentication',async()=>{
 let token='expired'; const events:string[]=[];
 const result=await loadLessonAssets(5,async url=>{
  assert.equal(url,'/learning/topics/5/assets');events.push('request');
  await Promise.resolve();token='refreshed';return {data:{assets:[{id:1}]}};
 },async()=>{events.push('token');return token;});
 assert.deepEqual(events,['request','token']);assert.equal(result.token,'refreshed');
});
test('metadata failure rejects rather than pretending a lesson has no pictures',async()=>{
 await assert.rejects(loadLessonAssets(5,async()=>{throw new Error('offline');},async()=>'token'),/offline/);
});
test('malformed response rejects rather than silently hiding pictures',async()=>{
 await assert.rejects(loadLessonAssets(5,async()=>({data:{}}),async()=>'token'),/Invalid asset response/);
});
test('missing token with pictures rejects',async()=>{
 await assert.rejects(loadLessonAssets(5,async()=>({data:{assets:[{id:1}]}}),async()=>null),/No image access token/);
});
test('legitimate empty asset list remains a successful empty result',async()=>{
 assert.deepEqual(await loadLessonAssets(5,async()=>({data:{assets:[]}}),async()=>null),{assets:[],attributions:[],token:null});
});
