import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';import path from 'node:path';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
import {readReferenceCatalogue,readReferenceChunk} from '../web/reference-source-reader.mjs';
import {loadReferenceSelection,planReferenceSelection} from '../web/reference-selection.mjs';
import {referenceSelectionProfile,REFERENCE_WHOLE_BUDGET} from '../web/reference-selection-profile.mjs';
const root=process.env.POLY_REFERENCE_CHUNKS_ROOT;assert(root);
const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'))),readBytes=async name=>new Uint8Array(await fs.readFile(path.join(root,name))),hash=async b=>createHash('sha256').update(b).digest('hex'),unzip=async b=>new Uint8Array(gunzipSync(b));
const catalogue=await readReferenceCatalogue(manifest,{readBytes,hash,unzip}),keys=[...catalogue.data.parts.map((_,i)=>'parts/'+i),...catalogue.data.bones.map((_,i)=>'bones/'+i)];
test('whole selection reads each actual block once and retains all 526 source identities',async()=>{
 const requests=[],result=await loadReferenceSelection(manifest,keys,{...referenceSelectionProfile(true,REFERENCE_WHOLE_BUDGET),catalogue,readBytes:async name=>{requests.push(name);return readBytes(name);},readChunk:(m,id,opts)=>readReferenceChunk(m,id,{...opts,hash,unzip})});
 assert.equal(result.blocks.length,46);assert.equal(result.plan.rawBytes,74469464);assert.deepEqual(result.entries.map(e=>e.key),keys);
 assert.equal(requests.filter(p=>p.endsWith('.bin.gz')).length,46);assert.equal(new Set(requests).size,92);
 for(const entry of result.entries){const [name,index]=entry.key.split('/');assert.equal(entry.metadata,catalogue.data[name][Number(index)]);assert(entry.positions instanceof Float64Array);assert(entry.indices instanceof Uint32Array);}
});
test('late corrupted whole block cannot return a partial selection',async()=>{
 let completed=0;const last=planReferenceSelection(manifest,keys,referenceSelectionProfile(true,REFERENCE_WHOLE_BUDGET)).blocks.at(-1);
 await assert.rejects(loadReferenceSelection(manifest,keys,{...referenceSelectionProfile(true,REFERENCE_WHOLE_BUDGET),catalogue,readBytes:async name=>{const bytes=await readBytes(name);if(name==='chunks/'+last+'.bin.gz')bytes[9]^=1;return bytes;},readChunk:async(m,id,opts)=>{const block=await readReferenceChunk(m,id,{...opts,hash,unzip});completed++;return block;}}),/altered/);
 assert.equal(completed,45);
});
