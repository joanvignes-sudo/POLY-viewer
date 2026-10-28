import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import * as THREE from '../web/vendor/three.module.js?v=audit-o-1';
import {createHistoricalPosture} from '../web/historical-posture.mjs';import {createRegionalRig} from '../web/body-region-motion.mjs';import {isNeutralRig} from '../web/resident-occlusion.mjs';
const reference=JSON.parse(await fs.readFile(new URL('./fixtures/historical-postures-v1.json',import.meta.url)));
function near(actual,expected){if(typeof expected==='number')assert.ok(Math.abs(actual-expected)<1e-12,actual+' != '+expected);else if(expected===null)assert.equal(actual,null);else for(const key of Object.keys(expected))near(actual[key],expected[key]);}
test('shared evaluator matches all 28 outputs captured from the actual historical commit, with real vectors and plain regional values',()=>{
 for(const typed of [false,true])for(const item of reference.cases){const u=Object.fromEntries(Object.entries(reference.seed).map(([key,value])=>[key,{value:typeof value==='number'?value:!typed?structuredClone(value):key==='rootShift'?new THREE.Vector3(value.x,value.y,value.z):new THREE.Quaternion(value.x,value.y,value.z,value.w)}]));const posture=createHistoricalPosture(u),wrist=posture.apply(item.mode,item.time);for(const [key,value]of Object.entries(item.pose))near(u[key].value,value);near(wrist,item.wrist);}
 assert.equal(reference.source_commit,'bab3065144a358e2c40dd9fdcdce1c6cb782ffc2');assert.match(reference.source_recipe_sha256,/^[a-f0-9]{64}$/);
});
test('returning to stand clears every root/quaternion component used by standing-domain tools',()=>{
 const rig=createRegionalRig(),posture=createHistoricalPosture(rig.uniforms);for(const mode of ['run','sit','lie','eat']){posture.apply(mode,.4);assert.equal(isNeutralRig(rig.uniforms),false);posture.apply('stand',0);assert.equal(isNeutralRig(rig.uniforms),true);}
});
test('invalid mode or graphical time refuses before changing the existing pose',()=>{
 const rig=createRegionalRig(),posture=createHistoricalPosture(rig.uniforms);posture.apply('sit',0);const before=JSON.stringify(rig.uniforms);for(const [mode,time]of [['other',0],['run',NaN],['eat',-1]])assert.throws(()=>posture.apply(mode,time));assert.equal(JSON.stringify(rig.uniforms),before);
});
