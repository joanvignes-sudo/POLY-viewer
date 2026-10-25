#!/usr/bin/env node
// Kinematic display audit, NOT muscle fiber strain or clinical biomechanics.
// Run: node simulateur/scripts/audit_elbow_display_motion.mjs
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/,'$1')),'..');
const rigText=fs.readFileSync(path.join(root,'web','rig.js'),'utf8');
const {deformPosition}=await import('data:text/javascript;base64,'+Buffer.from(rigText).toString('base64'));
const sourcePath=path.join(root,'data','forearm-motor-reference.json.gz');
const atlas=JSON.parse(zlib.gunzipSync(fs.readFileSync(sourcePath)));
const fit=JSON.parse(fs.readFileSync(path.join(root,'data','muscle-bone-display-calibration.json'),'utf8'));
const selected=new Set(['FJ1512','FJ1478','FJ1480','FJ1477','FJ1479','FJ1503','FJ1512M','FJ1478M','FJ1480M','FJ1477M','FJ1479M','FJ1503M']);

function rotate(v,q){const [x,y,z]=v,[qx,qy,qz,qw]=q;
  const tx=2*(qy*z-qz*y),ty=2*(qz*x-qx*z),tz=2*(qx*y-qy*x);
  return [x+qw*tx+qy*tz-qz*ty,y+qw*ty+qz*tx-qx*tz,z+qw*tz+qx*ty-qy*tx];
}
function place(p,part){
  const d=part.placement||atlas.placement,c=Math.cos(d.rotation_x_rad),s=Math.sin(d.rotation_x_rad);
  const [x,y,z]=p.map((v,i)=>(v-d.source_origin[i])*d.scale);
  let v=[x+d.target_origin[0],c*z+s*y+d.target_origin[1],s*z-c*y+d.target_origin[2]];
  const a=part.illustrative_alignment||atlas.illustrative_alignment?.[part.side||'R'];
  if(a) v=rotate(v.map((x,i)=>x-a.source_wrist_proxy[i]),a.quaternion).map((x,i)=>a.target_wrist_proxy[i]+x*a.scale);
  v=v.map((x,i)=>x+(part.illustrative_offset?.[i]||0));
  const region=part.reference_deformation==='rigid_foot'?'foot':(part.region||'forearm');
  const t=fit.groups[part.side+':'+region];
  if(t)v=v.map((x,i)=>t.target_center[i]+t.scale*(x-t.source_center[i]));
  return v;
}
function uniform(angle){return{
  armSwingR:{value:0},armSwingL:{value:0},
  eatShoulder:{value:{x:0,y:0,z:0,w:1}},
  eatForearm:{value:{x:Math.sin(angle/2),y:0,z:0,w:Math.cos(angle/2)}},
  rootShift:{value:{x:0,y:0,z:0}},
};}
const original=uniform(0),elbowFlex=uniform(Math.PI/3);
const result=[];
for(const part of atlas.parts.filter(p=>selected.has(p.id))){
 const verts=[];for(let i=0;i<part.positions.length;i+=3)verts.push(place(part.positions.slice(i,i+3),part));
 const before=verts.map(p=>deformPosition(p,original));
 const after=verts.map(p=>deformPosition(p,elbowFlex));
 const faces=part.indices;const distinctEdges=new Set(),differences=[];
 for(let i=0;i<faces.length;i+=3){
  for(const [i0,i1] of [[0,1],[1,2],[2,0]]){
   const a=faces[i+i0],b=faces[i+i1],pair=a<b?a+':'+b:b+':'+a;
   if(distinctEdges.has(pair))continue;distinctEdges.add(pair);
   const dist=(u,v)=>Math.hypot(u[0]-v[0],u[1]-v[1],u[2]-v[2]);
   const ref=dist(before[a],before[b]),deformed=dist(after[a],after[b]);
   if(ref>1e-8)differences.push(Math.abs(deformed/ref-1));
  }
 }
 differences.sort((a,b)=>a-b);
 const rms=Math.sqrt(differences.reduce((acc,x)=>acc+x*x,0)/differences.length);
 result.push({part_id:part.id,side:part.side,edge_count:differences.length,
   rms_relative_mesh_edge_length_change:Number(rms.toFixed(7)),
   p95_relative_mesh_edge_length_change:Number(differences[Math.floor((differences.length-1)*.95)].toFixed(7)),
   max_relative_mesh_edge_length_change:Number(differences.at(-1).toFixed(7)),
   source_fascicle_strain_measured:false,biomechanical_validation:false});
}
const report={
 schema:'poly.elbow-motion-display-audit/1',
 motion:'Test rig.js deformPosition, 60 degrees of illustrated right elbow flexion from an identity pose, no load.',
 scope:'Visual mesh-edge distortion only. Triangle edges are not fascicles or tendon fibers; outputs are dimensionless, not biological strain or force.',
 right_only_in_existing_shader:true,
 left_forearm_flexion_not_modeled_in_current_eatForearm_quaternion:true,
 segmentation_or_enthese_landmarks_present:false,
 results:result
};
fs.writeFileSync(path.join(root,'data','elbow-motion-display-audit.json'),JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify(result.map(x=>[x.part_id,x.rms_relative_mesh_edge_length_change,x.p95_relative_mesh_edge_length_change])));
