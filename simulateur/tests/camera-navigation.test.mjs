import test from 'node:test';import assert from 'node:assert/strict';
import {orientedCamera,createCameraHistory,CAMERA_POLE_LIMIT} from '../web/camera-navigation.mjs';
const view={target:[0,1.7,0],distance:7,azimuth:.4,elevation:.2};
test('six camera orientations preserve the target/distance and stay away from singular poles',()=>{
 for(const id of ['front','back','right','left','top','bottom']){const next=orientedCamera(view,id);assert.deepEqual(next.target,view.target);assert.equal(next.distance,7);assert.ok(Math.abs(next.elevation)<=CAMERA_POLE_LIMIT);assert.notEqual(next.target,view.target);}assert.throws(()=>orientedCamera(view,'unknown'));
});
test('camera history stores bounded scalar snapshots with copies, deduplication and explicit clear',()=>{
 const history=createCameraHistory(2),input=structuredClone(view);history.push(input);input.target[0]=9;history.push(view);assert.equal(history.size,1);history.push({...view,distance:8});history.push({...view,distance:9});assert.equal(history.size,2);assert.equal(history.pop().distance,9);assert.equal(history.pop().distance,8);assert.equal(history.pop(),null);history.push(view);history.clear();assert.equal(history.size,0);assert.throws(()=>history.push({...view,distance:NaN}));
});
