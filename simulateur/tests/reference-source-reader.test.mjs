import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {validateReferenceManifest,readReferenceCatalogue,readReferenceChunk} from '../web/reference-source-reader.mjs';
const root=process.env.POLY_REFERENCE_CHUNKS_ROOT;
assert.ok(root,'Verified temporary reference chunks required (POLY_REFERENCE_CHUNKS_ROOT)');
const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json')));
const readBytes=async filename=>new Uint8Array(await fs.readFile(path.join(root,filename)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),unzip=async bytes=>new Uint8Array(gunzipSync(bytes));
const catalogue=await readReferenceCatalogue(manifest,{readBytes,hash,unzip});
test('all 526 packed entities retain exactly the original JavaScript numeric bits and metadata',async()=>{
 const original=JSON.parse(gunzipSync(await fs.readFile(new URL('../data/forearm-motor-reference.json.gz',import.meta.url))));
 const stripped={...original};for(const collection of ['parts','bones'])stripped[collection]=original[collection].map(({positions,indices,...metadata})=>metadata);
 assert.deepEqual(catalogue.data,stripped);
 const seen=new Set();let maxBytes=0;
 for(const c of manifest.chunks){
  const chunk=await readReferenceChunk(manifest,c.id,{catalogue,readBytes,hash,unzip});maxBytes=Math.max(maxBytes,chunk.rawBytes);
  for(const entry of chunk.entries){
   assert.ok(!seen.has(entry.key));seen.add(entry.key);const [collection,index]=entry.key.split('/'),source=original[collection][Number(index)];
   assert.equal(entry.source_id,source.id);
   assert.deepEqual(Buffer.from(entry.positions.buffer,entry.positions.byteOffset,entry.positions.byteLength),Buffer.from(new Float64Array(source.positions).buffer),entry.json_pointer+' positions');
   assert.deepEqual(Buffer.from(entry.indices.buffer,entry.indices.byteOffset,entry.indices.byteLength),Buffer.from(new Uint32Array(source.indices).buffer),entry.json_pointer+' triangles');
  }
 }
 assert.equal(seen.size,526);assert.ok(maxBytes<=4194304);
});
test('metadata-only inventory does not read any geometry block',async()=>{
 const requests=[];await readReferenceCatalogue(manifest,{hash,unzip,readBytes:async filename=>{requests.push(filename);return readBytes(filename)}});
 assert.deepEqual(requests,['CATALOGUE.json.gz']);assert.equal(catalogue.data.parts.length,458);assert.equal(catalogue.data.bones.length,68);
});
test('catalogue stages expose a bounded diagnostic trace; cancellation during hash stops decompression',async()=>{
 const stages=[];await readReferenceCatalogue(manifest,{readBytes,hash,unzip,onStage:stage=>stages.push(stage)});
 assert.deepEqual(stages,['catalogue_fetch','catalogue_compressed_hash','catalogue_decompress','catalogue_raw_hash','catalogue_parse','catalogue_validated']);
 const controller=new AbortController();let decompressed=false;
 await assert.rejects(readReferenceCatalogue(manifest,{readBytes,signal:controller.signal,hash:bytes=>{controller.abort(Error('deadline'));return hash(bytes)},unzip:async()=>{decompressed=true;throw Error('must not decompress')}}),/deadline/);assert.equal(decompressed,false);
});
test('caller budget rejects before block download and altered block bytes cannot be accepted',async()=>{
 let requested=false;
 await assert.rejects(readReferenceChunk(manifest,manifest.chunks[0].id,{catalogue,maxRawBytes:1,readBytes:async()=>{requested=true;throw Error('Must not read')}}),/budget/);assert.equal(requested,false);
 const c=manifest.chunks[0];
 await assert.rejects(readReferenceChunk(manifest,c.id,{catalogue,hash,unzip,readBytes:async name=>{const b=await readBytes(name);if(name.endsWith('.bin.gz'))b[9]^=1;return b}}),/altered/);
});
test('published, unverified, traversal and duplicate-entity manifests fail closed',()=>{
 for(const mutate of [m=>m.published=true,m=>delete m.source_value_verification,m=>m.chunks[0].metadata='../outside.json',m=>m.chunks[0].keys[0]=m.chunks[1].keys[0]]){
  const m=structuredClone(manifest);mutate(m);assert.throws(()=>validateReferenceManifest(m));
 }
});
test('cancellation during each asynchronous chunk digest prevents further work and returning geometry',async()=>{
 const chunk=manifest.chunks[0];
 for(const abortAt of [1,2,3]){
  const controller=new AbortController();let calls=0,decompressions=0;
  const reason=Error('cancelled during digest '+abortAt);
  await assert.rejects(readReferenceChunk(manifest,chunk.id,{catalogue,readBytes,signal:controller.signal,
   hash:async bytes=>{const digest=hash(bytes);if(++calls===abortAt){await Promise.resolve();controller.abort(reason);}return digest;},
   unzip:async bytes=>{decompressions++;return unzip(bytes);}
  }),error=>error===reason);
  assert.equal(calls,abortAt,'no later digest after cancellation');
  assert.equal(decompressions,abortAt===3?1:0,'no decompression after cancelled metadata/compressed digest');
 }
});
