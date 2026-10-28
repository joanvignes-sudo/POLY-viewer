import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadReferenceNerveDocumentation,resolveReferenceNervePath} from '../web/reference-nerve-documentation.mjs';
const packed=await readFile(new URL('../data/human-nerves.json.gz',import.meta.url));
test('pinned nerve source preserves all steps, sources and terminal limits',async()=>{
 const data=await loadReferenceNerveDocumentation({fetcher:async()=>new Response(packed)});
 for(const path of data.regional_itineraries){const resolved=resolveReferenceNervePath(data,path.id);assert.deepEqual(resolved.routes.map(r=>r.id),path.ids);assert.equal(resolved.path,path);assert.ok(resolved.sources.length);}
 assert.equal(resolveReferenceNervePath(data,'missing'),null);
});
test('nerve documentation refuses altered source and aborted transfer',async()=>{
 const changed=new Uint8Array(packed);changed[9]^=1;
 await assert.rejects(loadReferenceNerveDocumentation({fetcher:async()=>new Response(changed)}),/altered/);
 const controller=new AbortController();controller.abort();let calls=0;
 await assert.rejects(loadReferenceNerveDocumentation({signal:controller.signal,fetcher:async()=>{calls++;return new Response(packed)}}));assert.equal(calls,0);
});
test('nerve resolver refuses missing steps and references instead of inventing continuity',()=>{
 const data={regional_itineraries:[{id:'p',ids:['r'],sources:['s']}],routes:[],sources:{s:{}}};
 assert.throws(()=>resolveReferenceNervePath(data,'p'),/missing/);data.routes=[{id:'r',sources:['unknown']}];assert.throws(()=>resolveReferenceNervePath(data,'p'),/source missing/);
});
