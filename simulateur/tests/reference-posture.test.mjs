import {refitSelectionFocus} from '../web/muscle-display-fit.mjs';
import {referenceInteractionSelection} from '../web/reference-catalogue-relations.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {loadReferencePosture,applyReferenceActivity,referenceFocusPoint,placeReferencePoint,makeReferencePostureBase,writeReferencePosture,deformReferencePoint,deformReferenceRoute} from '../web/reference-posture.mjs';
import {deformReferenceBone} from '../web/reference-bone-rig.js';
const data=JSON.parse(gunzipSync(await readFile(new URL('../data/forearm-motor-reference.json.gz',import.meta.url))));
const fetcher=async url=>new Response(await readFile(new URL(url)));
test('pinned historical display inputs load without a geometry monolith',async()=>{
 const calls=[];const posture=await loadReferencePosture({fetcher:async url=>{calls.push(String(url));return fetcher(url)}});
 assert.equal(calls.length,3);assert.ok(calls.every(url=>!url.includes('body-display.bin')&&!url.includes('forearm-motor')));assert.equal(posture.sampler.duration,1.08);
});
test('placement and CPU posture cover every original muscle/bone, preserve source numbers, and restore rest deterministically',async()=>{
 const posture=await loadReferencePosture({fetcher});
 for(const part of [...data.parts,...data.bones]){
  const positions=new Float64Array(part.positions.slice(0,9)),before=positions.slice(),entry={positions,metadata:part};
  const base=makeReferencePostureBase(entry,data,posture.fit),output=new Float32Array(base.length);
  assert.deepEqual(Array.from(base.subarray(0,3)),Array.from(new Float32Array(placeReferencePoint(part.positions.slice(0,3),part,data,posture.fit))));
  posture.rig.reset();writeReferencePosture(base,output,part,posture.rig.uniforms);const rest=output.slice();
  posture.sampler.apply(.4,posture.rig.uniforms);writeReferencePosture(base,output,part,posture.rig.uniforms);assert.ok(output.every(Number.isFinite));
  assert.deepEqual(Array.from(output.subarray(0,3)),Array.from(new Float32Array(deformReferencePoint(Array.from(base.subarray(0,3)),part,posture.rig.uniforms))));
  posture.rig.reset();writeReferencePosture(base,output,part,posture.rig.uniforms);assert.deepEqual(output,rest);assert.deepEqual(positions,before);
 }
});
test('rigid foot route uses the same historical bone transform',async()=>{
 const posture=await loadReferencePosture({fetcher});posture.sampler.apply(.3,posture.rig.uniforms);const p=[-.2,.2,.1];
 assert.deepEqual(deformReferenceRoute(p,{reference_deformation:'rigid_foot',reference_side:'R'},posture.rig.uniforms),deformReferenceBone(p,{bone_family:'foot',side:'R'},posture.rig.uniforms));
});
test('altered calibration or walking input refuses the illustrative mode',async()=>{
 await assert.rejects(loadReferencePosture({fetcher:async url=>String(url).includes('walk.json')?new Response('{}'):fetcher(url)}),/Walking source altered/);
});
test('every pinned documentary route remains finite in rest and walking presentation without changing its points',async()=>{
 const nerves=JSON.parse(gunzipSync(await readFile(new URL('../data/human-nerves.json.gz',import.meta.url)))),posture=await loadReferencePosture({fetcher});
 for(const phase of [null,.4]){if(phase===null)posture.rig.reset();else posture.sampler.apply(phase,posture.rig.uniforms);
  for(const route of nerves.routes)for(const point of route.points){const before=[...point],result=deformReferenceRoute(point,route,posture.rig.uniforms);assert.ok(result.every(Number.isFinite),route.id);assert.deepEqual(point,before);}
 }
});
test('bulk trunk writer is float32-bit-identical to the historical scalar path on full large surfaces',async()=>{
 const posture=await loadReferencePosture({fetcher});
 const largest=data.parts.filter(p=>p.region==='trunk').sort((a,b)=>b.positions.length-a.positions.length).slice(0,4);
 for(const part of largest){const entry={positions:new Float64Array(part.positions),metadata:part},base=makeReferencePostureBase(entry,data,posture.fit),actual=new Float32Array(base.length),expected=new Float32Array(base.length);
  for(const phase of [null,.4]){if(phase===null)posture.rig.reset();else posture.sampler.apply(phase,posture.rig.uniforms);
   writeReferencePosture(base,actual,part,posture.rig.uniforms);for(let i=0;i<base.length;i+=3)expected.set(deformReferencePoint(Array.from(base.subarray(i,i+3)),part,posture.rig.uniforms),i);
   assert.deepEqual(Buffer.from(actual.buffer),Buffer.from(expected.buffer),part.id);assert.deepEqual(entry.positions,new Float64Array(part.positions));}
 }
});

test('source interaction comparisons resolve the exact two same-side muscles and retain selected order',()=>{
 for(const observation of data.human_interaction_observations)for(const side of ['L','R'])for(const id of observation['parts_'+side]){const index=data.parts.findIndex(p=>p.id===id&&p.side===side),key='parts/'+index,result=referenceInteractionSelection(data,key,observation.id);assert.ok(result);assert.equal(result.observation,observation);assert.equal(result.keys[0],key);assert.deepEqual(result.keys.map(k=>data.parts[Number(k.split('/')[1])].id).sort(),[...observation['parts_'+side]].sort());}
 assert.equal(referenceInteractionSelection(data,'parts/0','absent-study'),null);
 const study=data.human_interaction_observations[0],id=study.parts_R[0],index=data.parts.findIndex(p=>p.id===id),missing={...data,parts:data.parts.filter(p=>p.id!==study.parts_R[1])},key='parts/'+missing.parts.findIndex(p=>p.id===id);assert.equal(referenceInteractionSelection(missing,key,study.id),null);const ambiguous={...data,parts:[...data.parts,data.parts.find(p=>p.id===study.parts_R[1])]};assert.equal(referenceInteractionSelection(ambiguous,'parts/'+index,study.id),null);
});
test('all source pieces retain finite manual historical poses, deterministic rest and immutable source samples',async()=>{
 const posture=await loadReferencePosture({fetcher});for(const part of [...data.parts,...data.bones]){const positions=new Float64Array(part.positions.slice(0,9)),before=positions.slice(),base=makeReferencePostureBase({positions,metadata:part},data,posture.fit),output=new Float32Array(base.length);posture.rig.reset();writeReferencePosture(base,output,part,posture.rig.uniforms);const rest=output.slice();for(const [mode,time]of [['stand',0],['run',.7],['sit',0],['lie',0],['eat',1.3]]){applyReferenceActivity(posture,mode,time);writeReferencePosture(base,output,part,posture.rig.uniforms);assert.ok(output.every(Number.isFinite),part.id+' '+mode);assert.deepEqual(positions,before);}applyReferenceActivity(posture,'stand',0);writeReferencePosture(base,output,part,posture.rig.uniforms);assert.deepEqual(output,rest);}
 for(const [mode,time]of [['unknown',0],['eat',6.01],['walk',1.08],['sit',1],['run',NaN]]){const before=JSON.stringify(posture.rig.uniforms);assert.throws(()=>applyReferenceActivity(posture,mode,time));assert.equal(JSON.stringify(posture.rig.uniforms),before);}
});

test('camera follow points match the actual historical refitted center without mutating source centers',async()=>{const posture=await loadReferencePosture({fetcher});for(const part of [...data.parts,...data.bones]){const before=JSON.stringify(part.illustrative_center);if(!Array.isArray(part.illustrative_center))assert.equal(referenceFocusPoint(part,posture.fit,posture.rig.uniforms),null);else{const copy={...part,illustrative_center:[...part.illustrative_center]};refitSelectionFocus(copy,posture.fit);for(const [mode,time]of [['stand',0],['run',.3],['eat',1.4]]){applyReferenceActivity(posture,mode,time);assert.deepEqual(referenceFocusPoint(part,posture.fit,posture.rig.uniforms),deformReferencePoint(copy.illustrative_center,part,posture.rig.uniforms));}}assert.equal(JSON.stringify(part.illustrative_center),before);}assert.equal(referenceFocusPoint({},posture.fit,posture.rig.uniforms),null);});
