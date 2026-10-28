import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {
 validateChunkManifest,readValidatedChunk,createBoundedChunkStore,
 sha256Bytes,readGzipBounded
} from '../web/body-chunk-reader.mjs';

const dir=process.env.POLY_CHUNKS_ROOT;
const fixture=dir?JSON.parse(await fs.readFile(path.join(dir,'MANIFEST.json'),'utf8')):null;
const sha=async b=>createHash('sha256').update(b).digest('hex');
const readBytes=async name=>new Uint8Array(await fs.readFile(path.join(dir,name)));
const unzip=async bytes=>new Uint8Array(gunzipSync(bytes));

test('CI provides temporary source-verified chunks, not repository or published artefacts',()=>{
 assert.ok(dir,'POLY_CHUNKS_ROOT must reference the temporary CI generation');
 assert.ok(fixture,'MANIFEST.json missing');
 assert.equal(validateChunkManifest(fixture),fixture);
 assert.equal(fixture.source_count,918);
 assert.equal(fixture.source.geometry_uncompressed_bytes,30693264);
 assert.equal(fixture.total_raw_chunk_bytes,30693264);
 assert.equal(fixture.status,'experimental_not_deployed');
 assert.equal(fixture.published,false);
 assert.equal(fixture.byte_for_byte_structure_verification,'PASS');
 assert.ok(fixture.chunks.length>1&&fixture.chunks.length<100);
 assert.deepEqual(fixture.oversized_source_chunks,[]);
});

test('reader verifies all genuine chunk hashes, offsets, identities and original source',async()=>{
 const seen=new Set();let bytes=0;
 for(const candidate of fixture.chunks){
  const item=await readValidatedChunk(fixture,candidate.id,{readBytes,unzip,hash:sha});
  assert.equal(item.bytes.byteLength,candidate.raw_bytes);
  assert.equal(item.rawBytes,candidate.raw_bytes);
  assert.equal(item.metadata.geometries.length,candidate.part_count);
  for(const g of item.metadata.geometries){
   assert.equal(seen.has(g.source_index),false);
   seen.add(g.source_index);
  }
  bytes+=item.rawBytes;
 }
 assert.equal(seen.size,918);
 assert.equal(bytes,30693264);
});

test('browser-compatible gzip and WebCrypto verify a real compressed anatomical chunk',async()=>{
 const c=fixture.chunks[0];
 const chunk=await readValidatedChunk(fixture,c.id,{readBytes,unzip:readGzipBounded,hash:sha256Bytes});
 assert.equal(chunk.rawBytes,c.raw_bytes);
 assert.equal(await sha256Bytes(chunk.bytes),c.geometry_sha256);
});

test('corrupted meta and compressed data are rejected, never installed',async()=>{
 const c=fixture.chunks[0];
 const wrongMeta=async name=>{
  const bytes=await readBytes(name);
  if(name===c.metadata)bytes[0]^=1;
  return bytes;
 };
 await assert.rejects(readValidatedChunk(fixture,c.id,{readBytes:wrongMeta,unzip,hash:sha}),/Métadonnées.*altérées/);
 const wrongZip=async name=>{
  const bytes=await readBytes(name);
  if(name===c.geometry)bytes[8]^=1;
  return bytes;
 };
 await assert.rejects(readValidatedChunk(fixture,c.id,{readBytes:wrongZip,unzip,hash:sha}),/gzip.*altéré/);
 await assert.rejects(readValidatedChunk(fixture,'unknown-999',{readBytes,unzip,hash:sha}),/absent/);
});

test('manifest traversal, forged source, and dropped structures fail closed',()=>{
 const forged=structuredClone(fixture);forged.source.geometry_sha256='0'.repeat(64);
 assert.throws(()=>validateChunkManifest(forged),/provenance/);
 const traversal=structuredClone(fixture);traversal.chunks[0].geometry='../other.bin.gz';
 assert.throws(()=>validateChunkManifest(traversal),/Chemin/);
 const removed=structuredClone(fixture);removed.chunks[0].original_indices[0]=removed.chunks[1].original_indices[0];
 assert.throws(()=>validateChunkManifest(removed),/Structure omise/);
 const published=structuredClone(fixture);published.published=true;
 assert.throws(()=>validateChunkManifest(published),/publié/);
});

test('bounded cache evicts least recently used unpinned item and calls disposal',async()=>{
 const [a,b]=fixture.chunks;
 const cap=Math.max(a.raw_bytes,b.raw_bytes);
 let installed=0,disposed=0;
 const store=createBoundedChunkStore(fixture,{readBytes,unzip,hash:sha,maxRawBytes:cap,
  onInstall:chunk=>{installed++;return {id:chunk.id}},
  onDispose:token=>{assert.ok(token?.id);disposed++}
 });
 await store.load(a.id);
 assert.deepEqual(store.info().ids,[a.id]);
 await store.load(a.id);
 assert.equal(installed,1,'Cache hit must not reinstall');
 await store.load(b.id);
 assert.deepEqual(store.info().ids,[b.id]);
 assert.equal(disposed,1);
 assert.ok(store.info().residentRawBytes<=cap);
 assert.equal(store.release(b.id),true);
 assert.equal(store.release(b.id),false);
 assert.equal(store.info().residentRawBytes,0);
 assert.equal(disposed,2);
});

test('a pinned chunk cannot be silently evicted or overwritten by another region',async()=>{
 const [a,b]=fixture.chunks;
 const cap=Math.max(a.raw_bytes,b.raw_bytes);
 const disposed=[];
 const store=createBoundedChunkStore(fixture,{readBytes,unzip,hash:sha,maxRawBytes:cap,onDispose:(_,chunk)=>disposed.push(chunk.id)});
 await store.load(a.id,{pin:true});
 await assert.rejects(store.load(b.id),/Budget RAM indisponible/);
 assert.deepEqual(store.info().ids,[a.id]);
 assert.deepEqual(disposed,[]);
 store.unpin(a.id);
 await store.load(b.id);
 assert.deepEqual(store.info().ids,[b.id]);
 assert.deepEqual(disposed,[a.id]);
 store.clear();
 assert.equal(store.info().residentRawBytes,0);
});


test('two different concurrent downloads cannot exceed the bounded cache after installation',async()=>{
 const [a,b]=fixture.chunks,cap=Math.max(a.raw_bytes,b.raw_bytes);
 const disposed=[];
 const store=createBoundedChunkStore(fixture,{readBytes,unzip,hash:sha,maxRawBytes:cap,
  onInstall:async chunk=>{await Promise.resolve();return {id:chunk.id}},
  onDispose:(token)=>disposed.push(token.id)
 });
 await Promise.all([store.load(a.id),store.load(b.id)]);
 const info=store.info();
 assert.ok(info.residentRawBytes<=cap);
 assert.equal(info.ids.length,1);
 assert.equal(disposed.length,1);
 store.clear();
 assert.equal(store.info().residentRawBytes,0);
});

test('a concurrent duplicate request can add a pin without downloading or installing twice',async()=>{
 const a=fixture.chunks[0];
 let installs=0;
 const store=createBoundedChunkStore(fixture,{readBytes,unzip,hash:sha,maxRawBytes:a.raw_bytes,
  onInstall:async chunk=>{installs++;await Promise.resolve();return {id:chunk.id}}
 });
 const [one,two]=await Promise.all([store.load(a.id),store.load(a.id,{pin:true})]);
 assert.equal(one.id,two.id);
 assert.equal(installs,1);
 assert.deepEqual(store.info().pinned,[a.id]);
 store.unpin(a.id);
 store.clear();
});
