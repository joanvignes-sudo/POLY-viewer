import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readHandReference,planHandBuffers} from '../web/hand-reference-source.mjs';
const bytes=await fs.readFile(new URL('../data/hand-muscles-reference.json.gz',import.meta.url));
const original=JSON.parse(gunzipSync(bytes)),hash=b=>createHash('sha256').update(b).digest('hex');
test('the complete hand reference preserves geometry identities and documentary observations',async()=>{
 const source=await readHandReference({fetcher:async()=>new Response(bytes),hash});
 assert.deepEqual(source.data,original);assert.equal(source.plan.parts,76);
 assert.equal(source.plan.vertices,39589);assert.equal(source.plan.bufferUpperBound,3401772);
 assert.ok(source.data.human_latency_observations.length>0);
});
test('geometry budgets and invalid source ranges refuse before any display construction',()=>{
 assert.throws(()=>planHandBuffers(original,3401771),/budget/);
 const invalid=structuredClone(original);invalid.parts[0].indices[0]=invalid.parts[0].positions.length;
 assert.throws(()=>planHandBuffers(invalid),/geometry invalid/);
 const duplicate=structuredClone(original);duplicate.parts[1].id=duplicate.parts[0].id;
 assert.throws(()=>planHandBuffers(duplicate),/identity invalid/);
});
test('altered hand data cannot be accepted as the verified separate anatomical reference',async()=>{
 await assert.rejects(readHandReference({fetcher:async()=>new Response(bytes),hash,unzip:async()=>new Uint8Array(1538211)}),/altered/);
});
