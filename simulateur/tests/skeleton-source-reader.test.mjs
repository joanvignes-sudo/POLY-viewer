import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import {gunzipSync} from 'node:zlib';
import {validateSkeletonManifest,readSkeletonCatalogue,readSkeletonChunk,browserSkeletonBytes} from '../web/skeleton-source-reader.mjs';import {sha256Bytes} from '../web/body-chunk-reader.mjs';
const root=process.env.POLY_SKELETON_CHUNKS_ROOT,options={skip:!root},readBytes=async(rel,{signal,maxBytes}={})=>{signal?.throwIfAborted();const b=await fs.readFile(path.join(root,rel));assert.ok(b.length<=maxBytes);return new Uint8Array(b);};
const manifest=async()=>JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json')));
test('verified skeleton reader reproduces every original number and source object in its own namespace',options,async()=>{
 const m=await manifest(),catalogue=await readSkeletonCatalogue(m,{readBytes}),source=JSON.parse(gunzipSync(await fs.readFile(new URL('../data/skeleton-source-206.json.gz',import.meta.url)))),seen=new Set();
 for(const c of m.chunks){const block=await readSkeletonChunk(m,c.id,{catalogue,readBytes});assert.ok(block.rawBytes<=4194304);for(const entry of block.entries){assert.equal(entry.namespace,'skeleton206');assert.ok(!seen.has(entry.key));seen.add(entry.key);const original=source.meshes[entry.source_index];assert.deepEqual([...entry.positions],original.positions);assert.deepEqual([...entry.indices],original.indices);assert.deepEqual(entry.metadata,Object.fromEntries(Object.entries(original).filter(([k])=>!['positions','indices'].includes(k))));}}
 assert.equal(seen.size,208);assert.equal(catalogue.registry.bones.length,206);
});
test('skeleton reader rejects changed provenance, missing coverage, unsafe resource paths and unpublished-state changes',options,async()=>{
 const m=await manifest();for(const mutate of [m=>m.namespace='hra',m=>m.published=true,m=>m.source_pins['skeleton-source-206'][1]='0'.repeat(64),m=>m.chunks[0].geometry='../escape',m=>m.chunks[0].keys.pop(),m=>m.chunks[0].raw_bytes=4194305]){const changed=structuredClone(m);mutate(changed);assert.throws(()=>validateSkeletonManifest(changed));}
 const reader=browserSkeletonBytes('http://127.0.0.1/temporary/',()=>{throw Error('must not fetch')});for(const p of ['../escape','chunks/reference-000.bin.gz','https://external.test/file','chunks/skeleton-000.bin.gz?override'])assert.throws(()=>reader(p));
});
test('skeleton caller budget, catalogue mutation and pre-abort reject before any block transfer',options,async()=>{
 const m=await manifest(),catalogue=await readSkeletonCatalogue(m,{readBytes}),noRead=()=>{throw Error('unexpected IO')};
 await assert.rejects(readSkeletonChunk(m,m.chunks[0].id,{catalogue,readBytes:noRead,maxRawBytes:1}),/budget/);
 await assert.rejects(readSkeletonChunk(m,m.chunks[0].id,{catalogue:structuredClone(catalogue),readBytes:noRead}),/Verified unchanged/);
 catalogue.data.meshes[0].name_fr='modified';await assert.rejects(readSkeletonChunk(m,m.chunks[0].id,{catalogue,readBytes:noRead}),/Verified unchanged/);
 const abort=new AbortController();abort.abort();await assert.rejects(readSkeletonCatalogue(m,{readBytes:noRead,signal:abort.signal}));
});
test('skeleton corrupt gzip and rehashed overlapping ranges are refused',options,async()=>{
 let m=await manifest(),catalogue=await readSkeletonCatalogue(m,{readBytes});await assert.rejects(readSkeletonChunk(m,m.chunks[0].id,{catalogue,readBytes:async(rel,opts)=>{const b=await readBytes(rel,opts);if(rel.endsWith('.bin.gz'))b[10]^=1;return b;}}),/compressed bytes altered/);
 m=await manifest();const c=m.chunks[0],meta=JSON.parse(await fs.readFile(path.join(root,c.metadata)));meta.entries[0].index_offset=meta.entries[0].position_offset;const bytes=new TextEncoder().encode(JSON.stringify(meta));c.metadata_sha256=await sha256Bytes(bytes);catalogue=await readSkeletonCatalogue(m,{readBytes});await assert.rejects(readSkeletonChunk(m,c.id,{catalogue,readBytes:(rel,opts)=>rel===c.metadata?bytes:readBytes(rel,opts)}),/overlapping/);
});
