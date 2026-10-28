import {validateNativeEye,nativeEyeStep,requireStudyHRAIdentity} from '../web/native-eye-context.mjs';
import {createFunctionalBindings} from '../web/body-functional-bindings.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import * as THREE from '../web/vendor/three.module.js';
import {sourceMeshData,planSourceBlocks} from '../web/body-source-contract.mjs';
import {createResidentInspector} from '../web/body-resident-inspector.mjs';
import {createRegionalRig,createWalkSampler} from '../web/body-region-motion.mjs';
import {createRegionSceneAdapter} from '../web/body-region-three.mjs';
import {readValidatedChunk,createBoundedChunkStore} from '../web/body-chunk-reader.mjs';

const original=JSON.parse(gunzipSync(await fs.readFile(new URL('../models/body-display.json.gz',import.meta.url))));
const records=original.structures.map((r,i)=>sourceMeshData(r,{sourceIndex:i}));
const motion=JSON.parse(await fs.readFile(new URL('../data/walk.json',import.meta.url)));
const root=process.env.POLY_CHUNKS_ROOT;
assert.ok(root,'Temporary verified chunks required');
const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json')));
const readBytes=async file=>new Uint8Array(await fs.readFile(path.join(root,file)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=c=>readValidatedChunk(manifest,c.id,{readBytes,hash,unzip:async x=>new Uint8Array(gunzipSync(x))});

test('partial organ coverage updates after eviction and new residents without retaining meshes',()=>{
 const member=records.find(r=>records.filter(x=>x.path.includes(r.path[2])).length>1);
 const members=records.filter(r=>r.path.includes(member.path[2]));
 let meshes=[{userData:member,visible:true}];
 const inspector=createResidentInspector({records,getMeshes:()=>meshes});
 assert.equal(inspector.open(member.source_index),true);
 assert.equal(inspector.info().expected,members.length);
 assert.equal(inspector.info().resident.length,1);
 assert.equal(inspector.info().missing.length,members.length-1);
 const another=records.find(r=>!r.path.includes(member.path[2]));
 meshes.push({userData:another,visible:true});inspector.refresh();
 assert.equal(meshes[1].visible,false);
 meshes.shift();inspector.refresh();
 assert.equal(inspector.info().scope,null);
 assert.equal(meshes[0].visible,true);
 assert.equal(inspector.open(member.source_index),false);
});

test('single-structure inspection and return restore visibility by identity, including new meshes',()=>{
 let meshes=records.slice(0,3).map(userData=>({userData,visible:true}));
 meshes[1].visible=false;
 const inspector=createResidentInspector({records,getMeshes:()=>meshes});
 assert.ok(inspector.open(0,{single:true}));
 assert.deepEqual(meshes.map(m=>m.visible),[true,false,false]);
 meshes.push({userData:records[3],visible:true});inspector.refresh();
 assert.equal(meshes[3].visible,false);
 inspector.close();
 assert.deepEqual(meshes.map(m=>m.visible),[true,false,true,true]);
 assert.equal(inspector.info().scope,null);
});

test('walk transfer reproduces historical angles, crossfade, bob and contralateral arm swing',()=>{
 const rig=createRegionalRig(),sampler=createWalkSampler(motion,original.normalization.scale);
 const col=Object.fromEntries(motion.columns.map((k,i)=>[k,i])),rows=motion.rows,start=rows[0][0];
 for(const elapsed of [0,.03,.4,.93,1.07,1.08,2.51]){
  const t=start+elapsed%1.08,i=Math.max(0,Math.min(rows.length-2,Math.floor((t-start)*60)));
  const a=rows[i],b=rows[i+1],f=Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0])));
  const blend=THREE.MathUtils.smoothstep(t,start+1.08-.16,start+1.08);
  const expected=THREE.MathUtils.lerp(THREE.MathUtils.lerp(a[col.hip_flexion_r],b[col.hip_flexion_r],f),rows[0][col.hip_flexion_r],blend);
  sampler.apply(elapsed,rig.uniforms);
  assert.ok(Math.abs(rig.uniforms.hipR.value+expected*Math.PI/180)<1e-12);
  assert.equal(rig.uniforms.armSwingL.value,rig.uniforms.hipR.value*.55);
 }
 rig.reset();
 assert.deepEqual(rig.deform([.2,1.2,.3]),[.2,1.2,.3]);
 assert.throws(()=>sampler.apply(NaN,rig.uniforms));
 assert.throws(()=>createWalkSampler({...motion,rows:[]},1));
});

test('render binding uses historical shader/uniforms; CPU picking deforms current residents and disposes proxies',async()=>{
 const rig=createRegionalRig(),scene=new THREE.Scene();
 const adapter=createRegionSceneAdapter({THREE,scene,rig});
 const chunk=await read(manifest.chunks.find(c=>c.system==='skeletal'));
 const before=hash(chunk.bytes),token=adapter.install(chunk);
 const first=adapter.sources.resolve(chunk.metadata.geometries[0].source_index);
 assert.equal(first.frustumCulled,false,'Source bounds cannot cull deformed poses');
 const shader={uniforms:{},vertexShader:'#include <begin_vertex>'};
 first.material.onBeforeCompile(shader);
 assert.equal(shader.uniforms.hipR,rig.uniforms.hipR);
 assert.ok(shader.vertexShader.includes('transformed=polyDeform(position)'));
 createWalkSampler(motion,original.normalization.scale).apply(.4,rig.uniforms);
 let calls=0,disposals=0;
 first.visible=false;
 const picked=adapter.pick({intersectObject(proxy){
  proxy.geometry.addEventListener('dispose',()=>disposals++);
  const m=token.meshes.filter(m=>m.visible!==false)[calls++];
  const a=m.geometry.attributes.position.array;
  const expected=new Float32Array(rig.deform([a[0],a[1],a[2]]));
  assert.deepEqual(proxy.geometry.attributes.position.array.slice(0,3),expected);
  return [{distance:calls,object:proxy}];
 }});
 assert.equal(calls,token.meshes.length-1);
 assert.equal(disposals,calls);
 assert.notEqual(picked.source_index,first.userData.source_index);
 assert.equal(hash(chunk.bytes),before,'Animation and picking must not rewrite source coordinates');
 adapter.dispose();
 assert.equal(token.meshes.length,0,'Retained installation token cannot retain disposed CPU buffers');
 assert.equal(scene.children.length,0);
});

test('picking exceptions still dispose CPU proxy geometry',async()=>{
 const rig=createRegionalRig(),adapter=createRegionSceneAdapter({THREE,scene:new THREE.Scene(),rig});
 adapter.install(await read(manifest.chunks[0]));
 let disposed=0;
 assert.throws(()=>adapter.pick({intersectObject(proxy){
  proxy.geometry.addEventListener('dispose',()=>disposed++);throw Error('Injected pick failure');
 }}),/Injected/);
 assert.equal(disposed,1);adapter.dispose();
});


test('a stale uninstall token cannot dispose a newly reloaded region',async()=>{
 const adapter=createRegionSceneAdapter({THREE,scene:new THREE.Scene()});
 const chunk=await read(manifest.chunks[0]),old=adapter.install(chunk);
 adapter.uninstall(old,chunk);
 const current=adapter.install(chunk);
 assert.equal(adapter.uninstall(old,chunk),false);
 assert.equal(adapter.diagnostics().meshes,chunk.metadata.geometries.length);
 assert.equal(adapter.uninstall(current,chunk),true);
});

test('consumer failure during installation leaves no registered or visible meshes',async()=>{
 const scene=new THREE.Scene(),adapter=createRegionSceneAdapter({THREE,scene,onChange(){throw Error('Consumer failure')}});
 await assert.rejects(async()=>adapter.install(await read(manifest.chunks[0])),/Consumer failure/);
 assert.equal(scene.children.length,0);assert.equal(adapter.diagnostics().meshes,0);
 assert.deepEqual(adapter.diagnostics().blocks,[]);
});


test('real Three.js raycasting hits an isolated animated source triangle',async()=>{
 const rig=createRegionalRig(),adapter=createRegionSceneAdapter({THREE,scene:new THREE.Scene(),rig});
 const chunk=await read(manifest.chunks.find(c=>c.system==='skeletal'));adapter.install(chunk);
 createWalkSampler(motion,original.normalization.scale).apply(.4,rig.uniforms);
 const mesh=adapter.listSourceIndices().map(i=>adapter.sources.resolve(i)).find(m=>m.userData.bounds[1][1]<1.85);
 assert.ok(mesh,'Need actual lower-limb source surface');
 for(const id of adapter.listSourceIndices())adapter.sources.resolve(id).visible=id===mesh.userData.source_index;
 const pos=mesh.geometry.attributes.position,indices=mesh.geometry.index.array;
 let center,normal;
 for(let i=0;i<indices.length;i+=3){
  const points=[0,1,2].map(k=>new THREE.Vector3(...rig.deform([pos.getX(indices[i+k]),pos.getY(indices[i+k]),pos.getZ(indices[i+k])])));
  normal=new THREE.Vector3().subVectors(points[1],points[0]).cross(new THREE.Vector3().subVectors(points[2],points[0]));
  if(normal.length()>1e-10){normal.normalize();center=points[0].add(points[1]).add(points[2]).divideScalar(3);break;}
 }
 assert.ok(center);
 const ray=new THREE.Raycaster(center.clone().addScaledVector(normal,.01),normal.clone().negate());
 assert.equal(adapter.pick(ray)?.source_index,mesh.userData.source_index);
 adapter.dispose();
});


test('single/local source plans fetch only required whole blocks with honest budget totals',()=>{
 const a=manifest.chunks[0],b=manifest.chunks[1];
 const one=planSourceBlocks(manifest,[a.original_indices[0]],a.raw_bytes);
 assert.deepEqual(one.ids,[a.id]);assert.equal(one.rawBytes,a.raw_bytes);assert.equal(one.compressedBytes,a.compressed_bytes);
 assert.equal(one.fitsBudget,true);
 const pair=planSourceBlocks(manifest,[a.original_indices[0],b.original_indices[0]],a.raw_bytes+b.raw_bytes-1);
 assert.deepEqual(pair.ids,[a.id,b.id]);assert.equal(pair.fitsBudget,false);
 assert.equal(pair.rawBytes,a.raw_bytes+b.raw_bytes);
 assert.throws(()=>planSourceBlocks(manifest,[918],1));
});


test('release and clear abort both outstanding network reads before installation',async()=>{
 for(const action of ['release','clear']){
  let count=0,aborted=0,notify;const started=new Promise(r=>notify=r);
  const store=createBoundedChunkStore(manifest,{readBytes:(file,{signal})=>new Promise((resolve,reject)=>{
   signal.addEventListener('abort',()=>{aborted++;reject(signal.reason)},{once:true});
   if(++count===2)notify();
  }),onInstall(){throw Error('Must not install')}});
  const pending=store.load(manifest.chunks[0].id);await started;
  if(action==='release')store.release(manifest.chunks[0].id);else store.clear();
  await assert.rejects(pending,/annulé/);assert.equal(aborted,2);assert.deepEqual(store.info().pending,[]);
 }
});


test('functional bindings resolve reloaded meshes and distinguish absent sources from documentary markers',()=>{
 const heart=records.find(r=>r.path.includes('VH_M_heart'));
 const nodes={heart:{match:'VH_M_heart'},ground:{match:null},unknown:{match:'not_in_source'}};
 let meshes=[{userData:heart,visible:true}];
 const bindings=createFunctionalBindings(nodes,records,()=>meshes);
 assert.equal(bindings.snapshot().matches.heart[0],meshes[0]);
 assert.equal(bindings.snapshot().coverage.ground.kind,'documentary_marker');
 assert.equal(bindings.snapshot().coverage.unknown.expected,0);
 meshes=[];
 assert.deepEqual(bindings.snapshot().matches.heart,[]);
 assert.ok(bindings.snapshot().coverage.heart.missing.includes(heart.source_index));
 const replacement={userData:heart,visible:false};meshes=[replacement];
 assert.equal(bindings.snapshot().matches.heart[0],replacement);
 assert.equal(bindings.snapshot().coverage.heart.visible.length,0);
});


test('native eye browsing retains exact source identities and never invents physiological time or study registration',async()=>{
 const contract=JSON.parse(await fs.readFile(new URL('../web/native-eye-context.json',import.meta.url)));
 validateNativeEye(contract,original);
 for(const [i,node]of [358,350,336].entries()){
  const step=nativeEyeStep(contract,i);assert.equal(step.source_node,node);assert.equal(step.physiological_time_s,null);
  assert.equal(step.study_participant_mapping,false);
 }
 assert.throws(()=>requireStudyHRAIdentity({hra_node:358}),/non qualifiée/);
 assert.throws(()=>validateNativeEye({...contract,study_participant_mapping:true},original));
});
