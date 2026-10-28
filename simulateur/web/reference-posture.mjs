import {fetchBoundedBytes} from './bounded-fetch.mjs';
import {sha256Bytes,readGzipBounded} from './body-chunk-reader.mjs';
import {verifySourceText} from './source-text-integrity.mjs';
import {createRegionalRig,createWalkSampler} from './body-region-motion.mjs';
import {alignReferencePoint} from './reference-placement.js?v=aa-final-2';
import {lookupMuscleFit,applyMuscleFitPoint} from './muscle-display-fit.mjs';
import {deformPosition} from './rig.js?v=audit-o-1';
import {deformReferenceLeg} from './reference-leg-rig.js?v=ac-1';
import {deformReferenceTrunk} from './reference-trunk-rig.js?v=bl-1';
import {deformReferenceBone} from './reference-bone-rig.js?v=bv-1';
export async function loadReferencePosture({signal,fetcher=fetch}={}){
 const read=(path,maxBytes)=>fetchBoundedBytes(new URL(path,import.meta.url),{signal,fetcher,maxBytes});
 const [fitBytes,walkBytes,metaPacked]=await Promise.all([read('../data/muscle-bone-display-calibration.json',32768),read('../data/walk.json',65536),read('../models/body-display.json.gz',427196)]);
 const fit=JSON.parse(await verifySourceText(fitBytes,'3eac812b60fe1b59dd7054d12452b66a5c3278bd136ae746aed180c8805901e2'));
 if(await sha256Bytes(walkBytes)!=='b22455ced299545f9fe2aa95e14153952b02db864eef218a208604db44eff5fb')throw Error('Walking source altered');
 const meta=await readGzipBounded(metaPacked,427196);
 if(await sha256Bytes(meta)!=='cf140a39c11163508e91e12b0df9820e6e36ea2f2b50392f62cd9f404fea1573')throw Error('Display coordinate frame altered');
 signal?.throwIfAborted();const scale=JSON.parse(new TextDecoder().decode(meta)).normalization.scale;
 return {fit,rig:createRegionalRig(),sampler:createWalkSampler(JSON.parse(new TextDecoder().decode(walkBytes)),scale)};
}
// Identical to the historical workbench's display recipe; never source registration.
export function placeReferencePoint(point,part,data,fit){
 const placement=part.placement??data.placement,c=Math.cos(placement.rotation_x_rad),s=Math.sin(placement.rotation_x_rad);
 const [x,y,z]=point.map((v,i)=>(v-placement.source_origin[i])*placement.scale);
 const aligned=alignReferencePoint([x+placement.target_origin[0],c*z+s*y+placement.target_origin[1],s*z-c*y+placement.target_origin[2]],part.illustrative_alignment??data.illustrative_alignment?.[part.side??'R']);
 return applyMuscleFitPoint(aligned.map((v,i)=>v+(part.illustrative_offset?.[i]??0)),lookupMuscleFit(part,fit));
}
export function deformReferencePoint(point,part,uniforms){
 return part.region==='trunk'?deformReferenceTrunk(point,uniforms):part.reference_deformation==='rigid_foot'?deformReferenceBone(point,{...part,bone_family:'foot'},uniforms):part.kind==='bone'?deformReferenceBone(point,part,uniforms):['leg','thigh'].includes(part.region)?deformReferenceLeg(point,uniforms):deformPosition(point,uniforms);
}
export function makeReferencePostureBase(entry,data,fit){
 const base=new Float32Array(entry.positions.length);
 for(let i=0;i<base.length;i+=3)base.set(placeReferencePoint(Array.from(entry.positions.subarray(i,i+3)),entry.metadata,data,fit),i);
 if(!base.every(Number.isFinite))throw Error('Non-finite illustrative placement');return base;
}
export function writeReferencePosture(base,target,part,uniforms){
 for(let i=0;i<base.length;i+=3)target.set(deformReferencePoint([base[i],base[i+1],base[i+2]],part,uniforms),i);
 if(!target.every(Number.isFinite))throw Error('Non-finite illustrative deformation');
}
export function deformReferenceRoute(point,route,uniforms){
 if(route.reference_deformation==='foot_connector'){
  const leg=deformReferenceLeg(point,uniforms),foot=deformReferenceBone(point,{bone_family:'foot',side:route.reference_side},uniforms);
  const start=route.points[0][1],end=route.points.at(-1)[1],t=Math.max(0,Math.min(1,(start-point[1])/(start-end))),w=t*t*(3-2*t);
  return leg.map((v,i)=>v*(1-w)+foot[i]*w);
 }
 return route.reference_deformation==='trunk'?deformReferenceTrunk(point,uniforms):route.reference_deformation==='rigid_foot'?deformReferenceBone(point,{bone_family:'foot',side:route.reference_side},uniforms):route.reference_deformation==='leg'?deformReferenceLeg(point,uniforms):deformPosition(point,uniforms);
}
