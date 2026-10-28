import {verifySourceText} from '../web/source-text-integrity.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fetchBoundedBytes} from '../web/bounded-fetch.mjs';
import {readCerebraSource,planCerebraBuffers,CEREBRA_SOURCE} from '../web/brain-atlas-source.mjs';
const root=new URL('../models/cerebra/',import.meta.url),meta=JSON.parse(await fs.readFile(new URL('ATLAS_ANATOMIQUE.json',root)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fetcher=async url=>new Response(await fs.readFile(new URL(new URL(url).pathname.split('/').at(-1),root)));
test('actual CerebrA source is authenticated and its retained display array buffers are planned separately',async()=>{
 const source=await readCerebraSource({fetcher,hash});
 assert.equal(hash(new Uint8Array(source.buffer)),CEREBRA_SOURCE.geometrySha256);
 assert.equal(source.plan.bufferBytes,10707096);assert.equal(source.plan.regions,17);
 assert.equal(source.buffer.byteLength,5372724);
});
test('insufficient display budget refuses before downloading the geometric asset',async()=>{
 const requests=[];
 await assert.rejects(readCerebraSource({hash,maxBufferBytes:10707095,fetcher:async url=>{requests.push(String(url));return fetcher(url)}}),/budget/);
 assert.equal(requests.length,1);assert.ok(requests[0].endsWith('ATLAS_ANATOMIQUE.json'));
 assert.throws(()=>planCerebraBuffers({...meta,units:'m'},12*1024*1024),/identity/);
});
test('altered metadata or geometric bytes cannot become a cerebral reference',async()=>{
 await assert.rejects(readCerebraSource({hash,fetcher:async url=>String(url).endsWith('.json')?new Response('{}'):fetcher(url)}),/metadata altered/);
 await assert.rejects(readCerebraSource({hash,fetcher,unzip:async()=>new Uint8Array(5372724)}),/geometry altered/);
});
test('declared and streaming transfer limits cancel oversized responses',async()=>{
 for(const declared of [false,true]){
  let cancelled=false;
  const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(12))},cancel(){cancelled=true}});
  await assert.rejects(fetchBoundedBytes('fixture',{maxBytes:8,fetcher:async()=>new Response(stream,{headers:declared?{'Content-Length':'12'}:{}})}),/budget/);
  assert.equal(cancelled,true);
 }
});
test('abort cancels a pending response stream instead of retaining its read',async()=>{
 const controller=new AbortController();let cancelled=false,notify;
 const entered=new Promise(r=>notify=r),stream=new ReadableStream({pull(){notify()},cancel(){cancelled=true}});
 const task=fetchBoundedBytes('fixture',{maxBytes:8,signal:controller.signal,fetcher:async()=>new Response(stream)});
 await entered;controller.abort(Error('cancelled fixture'));await assert.rejects(task,/cancelled fixture/);assert.equal(cancelled,true);
});


test('source text verification accepts LF/CRLF only, without changing scientific JSON values',async()=>{
 const bytes=await fs.readFile(new URL('ATLAS_ANATOMIQUE.json',root)),lf=new TextDecoder().decode(bytes).replace(/\r\n/g,'\n');
 for(const text of [lf,lf.replace(/\n/g,'\r\n')])assert.deepEqual(JSON.parse(await verifySourceText(new TextEncoder().encode(text),CEREBRA_SOURCE.metadataSha256,{hash})),meta);
 await assert.rejects(verifySourceText(new TextEncoder().encode(lf.replace('Homo sapiens','other species')),CEREBRA_SOURCE.metadataSha256,{hash}),/altered/);
});
