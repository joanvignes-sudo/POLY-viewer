import test from 'node:test';
import assert from 'node:assert/strict';
import {planReferenceSelection,loadReferenceSelection} from '../web/reference-selection.mjs';
const manifest={chunks:[{id:'a',keys:['parts/0','parts/1'],raw_bytes:60},{id:'b',keys:['bones/0'],raw_bytes:50}]};
test('selection counts shared blocks once and refuses combined oversubscription',()=>{
 assert.deepEqual(planReferenceSelection(manifest,['parts/0','parts/1'],{maxRawBytes:60}).blocks,['a']);
 assert.equal(planReferenceSelection(manifest,['parts/0','bones/0'],{maxRawBytes:110}).rawBytes,110);
 for(const keys of [[],['missing'],['parts/0','parts/0']])assert.throws(()=>planReferenceSelection(manifest,keys));
 assert.throws(()=>planReferenceSelection(manifest,['parts/0','bones/0'],{maxRawBytes:100}),/combined/);
});
test('group reuses residents, preserves requested identity order and transfers only missing blocks',async()=>{
 const resident={id:'a',entries:[{key:'parts/0'},{key:'parts/1'}]},calls=[];
 const result=await loadReferenceSelection(manifest,['bones/0','parts/0'],{resident:[resident],readChunk:async(m,id)=>{calls.push(id);return {id,entries:[{key:'bones/0'}]}}});
 assert.deepEqual(calls,['b']);assert.equal(result.blocks[1],resident);assert.deepEqual(result.entries.map(e=>e.key),['bones/0','parts/0']);
});
test('budget refusal makes no request and corrupt/missing groups never return a partial result',async()=>{
 let calls=0;const reader=async()=>{calls++;throw Error('corrupt');};
 await assert.rejects(loadReferenceSelection(manifest,['parts/0','bones/0'],{maxRawBytes:100,readChunk:reader}),/budget/);assert.equal(calls,0);
 await assert.rejects(loadReferenceSelection(manifest,['parts/0','bones/0'],{readChunk:reader}),/corrupt/);
 await assert.rejects(loadReferenceSelection(manifest,['parts/0'],{readChunk:async()=>({id:'a',entries:[]})}),/missing/);
});
test('group cancellation stops before the next block',async()=>{
 const controller=new AbortController();let calls=0;
 await assert.rejects(loadReferenceSelection(manifest,['parts/0','bones/0'],{signal:controller.signal,readChunk:async()=>{calls++;controller.abort();return {id:'a',entries:[{key:'parts/0'}]}}}));assert.equal(calls,1);
});
