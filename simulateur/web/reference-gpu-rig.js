import {Vector3} from './vendor/three.module.js?v=audit-o-1';
import {deformReferenceBone} from './reference-bone-rig.js?v=ar-1';
import {rigGLSL} from './rig.js?v=audit-o-1';
import {legGLSL} from './reference-leg-rig.js?v=ac-1';

const handGLSL=`uniform float referenceSide;
vec3 polyReferenceHand(vec3 p){
 p=polyRX(p,2.85,referenceSide>0.0?armSwingL:armSwingR);
 if(referenceSide<0.0){
  vec3 e=vec3(-0.63,2.27,0.03),s=vec3(-0.36,2.85,0.0);
  p=polyQ(p-e,eatForearm)+e;
  p=polyQ(p-s,eatShoulder)+s;
 }
 p.y+=bob;p=polyRX(p,0.0,rootTilt);return p+rootShift;
}`;

export function installReferenceRig(material,uniforms,{hand=false,leg=false,foot=false,side='R'}={}){
 material.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,uniforms);
  if(foot){
   const apply=p=>deformReferenceBone(p,{bone_family:'foot',side},uniforms);
   for(const [key,point]of Object.entries({referenceFootOrigin:[0,0,0],referenceFootX:[1,0,0],referenceFootY:[0,1,0],referenceFootZ:[0,0,1]})){const vector=new Vector3();shader.uniforms[key]={get value(){const p=apply(point),o=key==='referenceFootOrigin'?[0,0,0]:apply([0,0,0]);return vector.set(p[0]-o[0],p[1]-o[1],p[2]-o[2])}};}
  }
  if(hand)shader.uniforms.referenceSide={value:side==='L'?1:-1};
  shader.vertexShader=rigGLSL+'\n'+(foot?'uniform vec3 referenceFootOrigin;uniform vec3 referenceFootX;uniform vec3 referenceFootY;uniform vec3 referenceFootZ;vec3 polyReferenceFoot(vec3 p){return referenceFootOrigin+referenceFootX*p.x+referenceFootY*p.y+referenceFootZ*p.z;}':hand?handGLSL:leg?legGLSL:'')+'\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed='+(foot?'polyReferenceFoot':hand?'polyReferenceHand':leg?'polyReferenceLeg':'polyDeform')+'(position);');
 };
 material.customProgramCacheKey=()=>foot?'poly-reference-foot-affine-as':hand?'poly-reference-hand-rigid-aa':leg?'poly-reference-leg-ac':'poly-reference-shared-rig-aa';
}
