import fs from 'node:fs/promises';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {performance} from 'node:perf_hooks';import assert from 'node:assert/strict';
import * as THREE from '../web/vendor/three.module.js?v=audit-o-1';import {createRegionSceneAdapter} from '../web/body-region-three.mjs';import {readValidatedChunk} from '../web/body-chunk-reader.mjs';import {createRegionalRig} from '../web/body-region-motion.mjs';import {createHistoricalPosture} from '../web/historical-posture.mjs';
const root=process.env.POLY_CHUNKS_ROOT;if(!root)throw Error('POLY_CHUNKS_ROOT required');
const legacyCommit='66caf49b8086f8eb04253a8724f85d8097a9000c',legacyText=execFileSync('git',['show',legacyCommit+':simulateur/web/body-region-three.mjs'],{encoding:'utf8'}).replace("'./body-source-contract.mjs'",JSON.stringify(new URL('../web/body-source-contract.mjs',import.meta.url).href));
const legacy=await import('data:text/javascript;base64,'+Buffer.from(legacyText).toString('base64'));
const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'))),chunk=await readValidatedChunk(manifest,manifest.chunks.find(c=>c.system==='skeletal').id,{readBytes:async name=>new Uint8Array(await fs.readFile(path.join(root,name))),unzip:async bytes=>new Uint8Array(gunzipSync(bytes)),hash:async bytes=>createHash('sha256').update(bytes).digest('hex')});
const sourceHash=createHash('sha256').update(chunk.bytes).digest('hex');
function build(create){let counts,seen;class Geometry extends THREE.BufferGeometry{constructor(){super();if(counts)counts.geometries++;}setAttribute(name,a){if(counts&&name==='position'&&!seen.has(a.array.buffer)){seen.add(a.array.buffer);counts.position_bytes+=a.array.buffer.byteLength;}return super.setAttribute(name,a);}dispose(){if(counts)counts.disposals++;super.dispose();}}class Mesh extends THREE.Mesh{constructor(...args){super(...args);if(counts)counts.meshes++;}}
 const rig=createRegionalRig(),adapter=create({THREE:{...THREE,BufferGeometry:Geometry,Mesh},scene:new THREE.Scene(),rig});adapter.install(chunk);const posture=createHistoricalPosture(rig.uniforms);
 return {adapter,rig,posture,begin(){counts={geometries:0,meshes:0,disposals:0,position_bytes:0};seen=new WeakSet();},end(){const snapshot={...counts};counts=null;return snapshot;}};
}
const before=build(legacy.createRegionSceneAdapter),after=build(createRegionSceneAdapter),rows=[];
for(const mode of ['stand','sit','eat']){
 before.posture.apply(mode,.35);after.posture.apply(mode,.35);
 const b=before.adapter.sourceInfo(808).bounds;
 for(let i=0;i<12;i++){
  const local=[(b[0][0]+b[1][0])/2,b[0][1]+(b[1][1]-b[0][1])*(.05+i*.08),(b[0][2]+b[1][2])/2],point=new THREE.Vector3(...before.rig.deform(local)),origin=point.clone().add(new THREE.Vector3(.12,.1,2)),ray=new THREE.Raycaster(origin,point.clone().sub(origin).normalize());
  const run=item=>{item.begin();const start=performance.now(),hit=item.adapter.pick(ray);return {source_index:hit?.source_index??null,ms:performance.now()-start,...item.end()};};
  let old,next;if(i%2){next=run(after);old=run(before);}else{old=run(before);next=run(after);}assert.equal(next.source_index,old.source_index);assert.equal(next.geometries,1);assert.equal(next.meshes,1);assert.equal(next.disposals,1);assert.ok(next.position_bytes<=old.position_bytes);rows.push({mode,ray:i,before:old,after:next});
 }
}
assert.ok(rows.some(r=>r.after.source_index!==null));assert.equal(createHash('sha256').update(chunk.bytes).digest('hex'),sourceHash);before.adapter.dispose();after.adapter.dispose();
const median=values=>values.sort((a,b)=>a-b)[Math.floor(values.length/2)],receipt={schema:'poly.regional-pick-profile.v1',legacy_commit:legacyCommit,source_chunk:chunk.id,source_sha256:sourceHash,rays:rows.length,identical_source_selections:true,source_bytes_unchanged:true,limits:'Local Node CPU method only. Counts are temporary geometries/meshes and position ArrayBuffer bytes, not total allocations, retained heap, GPU or phone measurements.',summary:{before_geometries_per_pick:rows[0].before.geometries,after_geometries_per_pick:1,before_position_bytes:rows[0].before.position_bytes,after_position_bytes:rows[0].after.position_bytes,before_median_ms:median(rows.map(r=>r.before.ms)),after_median_ms:median(rows.map(r=>r.after.ms))},rows};
if(process.argv[2])await fs.writeFile(process.argv[2],JSON.stringify(receipt,null,2));console.log(JSON.stringify({...receipt,rows:undefined}));
