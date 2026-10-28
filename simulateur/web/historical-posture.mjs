import * as THREE from './vendor/three.module.js?v=audit-o-1';
import {deformPosition} from './rig.js?v=audit-o-1';
const scalarKeys=['hipR','hipL','kneeR','kneeL','ankR','ankL','bob','armSwingR','armSwingL','rootTilt'];
const modes=new Set(['stand','walk','run','sit','lie','eat','sleep']);
export function createHistoricalPosture(u){
 const S=new THREE.Vector3(-.36,2.85,0),E=new THREE.Vector3(-.63,2.27,.03),W=new THREE.Vector3(-.9,1.78,.05),A=E.clone().sub(S),B=W.clone().sub(E),lenA=A.length(),lenB=B.length();
 const set3=(value,x,y,z)=>{if(typeof value.set==='function')value.set(x,y,z);else Object.assign(value,{x,y,z});};
 const set4=(value,x,y,z,w)=>{if(typeof value.set==='function')value.set(x,y,z,w);else Object.assign(value,{x,y,z,w});};
 function roots(){u.rootTilt.value=0;set3(u.rootShift.value,0,0,0);set4(u.eatShoulder.value,0,0,0,1);set4(u.eatForearm.value,0,0,0,1);}
 function reset(){for(const key of scalarKeys)u[key].value=0;roots();}
 function eating(t){
  const f=(1-Math.cos(t*1.8))/2,goal=new THREE.Vector3(-.42,2.12,.95).lerp(new THREE.Vector3(-.09,3.12,.28),f),dir=goal.clone().sub(S),d=THREE.MathUtils.clamp(dir.length(),Math.abs(lenA-lenB)+.02,lenA+lenB-.02);dir.normalize();goal.copy(S).addScaledVector(dir,d);
  const along=(lenA*lenA-lenB*lenB+d*d)/(2*d),height=Math.sqrt(Math.max(0,lenA*lenA-along*along)),bend=new THREE.Vector3(-1,-.2,0);bend.addScaledVector(dir,-bend.dot(dir)).normalize();
  const elbow=S.clone().addScaledVector(dir,along).addScaledVector(bend,height),q1=new THREE.Quaternion().setFromUnitVectors(A.clone().normalize(),elbow.clone().sub(S).normalize()),localLower=goal.clone().sub(elbow).applyQuaternion(q1.clone().invert()),q2=new THREE.Quaternion().setFromUnitVectors(B.clone().normalize(),localLower.normalize());
  set4(u.eatShoulder.value,q1.x,q1.y,q1.z,q1.w);set4(u.eatForearm.value,q2.x,q2.y,q2.z,q2.w);return deformPosition(W.toArray(),u);
 }
 return {reset,apply(mode,time){
  if(!modes.has(mode)||!Number.isFinite(time)||time<0)throw Error('Invalid historical display posture/time');
  if(mode==='walk'){u.armSwingR.value=u.hipL.value*.55;u.armSwingL.value=u.hipR.value*.55;roots();return null;}
  reset();if(['sit','eat'].includes(mode)){u.hipR.value=u.hipL.value=-Math.PI/2;u.kneeR.value=u.kneeL.value=Math.PI/2;u.rootShift.value.y=-.86;if(mode==='eat')return eating(time);}
  else if(['lie','sleep'].includes(mode)){u.rootTilt.value=-Math.PI/2;set3(u.rootShift.value,0,.34,1.75);}
  else if(mode==='run'){const phase=time*6;u.hipR.value=-.65*Math.cos(phase);u.hipL.value=.65*Math.cos(phase);u.kneeR.value=.25+1.1*Math.max(0,-Math.sin(phase));u.kneeL.value=.25+1.1*Math.max(0,Math.sin(phase));u.armSwingR.value=u.hipL.value*.8;u.armSwingL.value=u.hipR.value*.8;const feet=[deformPosition([-.27,.1,.1],u)[1],deformPosition([.27,.1,.1],u)[1]];u.rootShift.value.y=.025-Math.min(...feet)+Math.max(0,Math.cos(2*phase))*.16;}
  return null;
 }};
}
