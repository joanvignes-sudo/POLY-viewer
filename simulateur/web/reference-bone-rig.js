// Rigid context bones. This illustrates posture; it does not reconstruct joint mechanics.
export function deformReferenceBone(point,bone,uniforms){
 let [x,y,z]=point;
 const value=key=>uniforms[key]?.value||0;
 function rotateX(pivot,angle){const dy=y-pivot,oldZ=z;y=pivot+Math.cos(angle)*dy-Math.sin(angle)*oldZ;z=Math.sin(angle)*dy+Math.cos(angle)*oldZ}
 function quaternion(pivot,q){
  if(!q)return;const px=x-pivot[0],py=y-pivot[1],pz=z-pivot[2];
  const tx=2*(q.y*pz-q.z*py),ty=2*(q.z*px-q.x*pz),tz=2*(q.x*py-q.y*px);
  x=pivot[0]+px+q.w*tx+q.y*tz-q.z*ty;
  y=pivot[1]+py+q.w*ty+q.z*tx-q.x*tz;
  z=pivot[2]+pz+q.w*tz+q.x*ty-q.y*tx;
 }
 const arm=['humerus','radius','ulna','hand'].includes(bone.bone_family);
 if(arm){
  rotateX(2.85,value(bone.side==='L'?'armSwingL':'armSwingR'));
  if(bone.side==='R'){
   if(['radius','ulna','hand'].includes(bone.bone_family))quaternion([-.63,2.27,.03],uniforms.eatForearm?.value);
   quaternion([-.36,2.85,0],uniforms.eatShoulder?.value);
  }
 }
 if(bone.bone_family==='foot')rotateX(.18,value(bone.side==='L'?'ankL':'ankR'));
 if(['tibia','fibula','foot'].includes(bone.bone_family)){
  rotateX(.99,value(bone.side==='L'?'kneeL':'kneeR'));
  rotateX(1.83,value(bone.side==='L'?'hipL':'hipR'));
 }
 y+=value('bob');rotateX(0,value('rootTilt'));
 const shift=uniforms.rootShift?.value||{x:0,y:0,z:0};return [x+shift.x,y+shift.y,z+shift.z];
}
// A rigid transform is affine: calculate its basis once per bone, not per vertex.
export function writeReferenceBonePositions(base,target,bone,uniforms){
 const origin=deformReferenceBone([0,0,0],bone,uniforms);
 const axes=[[1,0,0],[0,1,0],[0,0,1]].map(p=>deformReferenceBone(p,bone,uniforms).map((v,i)=>v-origin[i]));
 for(let i=0;i<base.length;i+=3){const x=base[i],y=base[i+1],z=base[i+2];for(let k=0;k<3;k++)target[i+k]=origin[k]+axes[0][k]*x+axes[1][k]*y+axes[2][k]*z}
}
