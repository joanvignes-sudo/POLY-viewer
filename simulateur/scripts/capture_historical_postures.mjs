// Capture the actual pre-extraction repository code, not a rewritten reference formula.
import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import * as THREE from '../web/vendor/three.module.js?v=audit-o-1';import {deformPosition} from '../web/rig.js?v=audit-o-1';
const reference='bab3065144a358e2c40dd9fdcdce1c6cb782ffc2';
const source=execFileSync('git',['show',reference+':simulateur/web/activities.js'],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const start=source.indexOf(' function clearPose()'),end=source.indexOf(" setMode('stand');showTime();return");
if(start<0||end<=start)throw Error('Historical source boundaries changed');const code=source.slice(start,end);
const construct=new Function('THREE','deformPosition','u',"let mode='stand';const dayPlaying=false,props={},spoon={position:new THREE.Vector3()};"+code+";return {apply(next,time){mode=next;update(0,time);return next==='eat'?spoon.position.toArray():null;}};");
const seed={hipR:.13,hipL:-.24,kneeR:.4,kneeL:.5,ankR:-.08,ankL:.09,bob:.01,armSwingR:.33,armSwingL:.44,rootTilt:.2,rootShift:{x:.02,y:.03,z:.04},eatShoulder:{x:.1,y:.2,z:0,w:.9},eatForearm:{x:.2,y:0,z:.1,w:.9}};
const cases=[];for(const mode of ['stand','walk','run','sit','lie','eat','sleep'])for(const time of [0,.35,1.25,4]){
 const u=Object.fromEntries(Object.entries(seed).map(([key,value])=>[key,{value:typeof value==='number'?value:key==='rootShift'?new THREE.Vector3(value.x,value.y,value.z):new THREE.Quaternion(value.x,value.y,value.z,value.w)}]));
 const wrist=construct(THREE,deformPosition,u).apply(mode,time),pose=Object.fromEntries(Object.entries(u).map(([key,{value}])=>[key,typeof value==='number'?value:key==='rootShift'?{x:value.x,y:value.y,z:value.z}:{x:value.x,y:value.y,z:value.z,w:value.w}]));cases.push({mode,time,pose,wrist});
}
const output=process.argv[2];if(!output)throw Error('A new output file is required');await fs.writeFile(output,JSON.stringify({schema:'poly.historical-posture-reference.v1',source_commit:reference,source_recipe_sha256:createHash('sha256').update(code).digest('hex'),scope:'Synthetic display regression inputs and historical recipe outputs; not biological observations',seed,cases},null,2)+'\n',{flag:'wx'});console.log(cases.length+' historical display cases captured');
