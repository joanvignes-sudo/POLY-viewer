import test from 'node:test';import assert from 'node:assert/strict';
import {mountOrbitPointerInput} from '../web/orbit-pointer-input.mjs';
function fixture(){const canvas=new EventTarget(),captures=new Set(),taps=[];let view={azimuth:.3,elevation:.1,distance:5};canvas.setPointerCapture=id=>captures.add(id);canvas.hasPointerCapture=id=>captures.has(id);canvas.releasePointerCapture=id=>{captures.delete(id);emit('lostpointercapture',{pointerId:id});};
 function emit(type,values={}){const e=new Event(type,{cancelable:true});Object.assign(e,{pointerId:1,clientX:0,clientY:0,pointerType:'touch',button:0,...values});canvas.dispatchEvent(e);return e;}
 const controller=mountOrbitPointerInput(canvas,{getView:()=>view,setView:v=>view=v,onTap:(x,y)=>taps.push([x,y])});return {emit,controller,taps,captures,get view(){return view;}};
}
test('single touch selects; an excursion returning to its origin never becomes a click',()=>{
 const f=fixture();f.emit('pointerdown',{clientX:10,clientY:20});f.emit('pointerup',{clientX:10,clientY:20});assert.deepEqual(f.taps,[[10,20]]);
 f.emit('pointerdown');f.emit('pointermove',{clientX:30});f.emit('pointermove');f.emit('pointerup');assert.equal(f.taps.length,1);assert.equal(f.captures.size,0);
});
test('two fingers never pick; doubling their span halves distance without rotating',()=>{
 const f=fixture();f.emit('pointerdown',{pointerId:1,clientX:0});f.emit('pointerdown',{pointerId:2,clientX:100});f.emit('pointermove',{pointerId:2,clientX:200});assert.deepEqual(f.view,{azimuth:.3,elevation:.1,distance:2.5});
 f.emit('pointerup',{pointerId:2,clientX:200});f.emit('pointermove',{pointerId:1,clientX:30});assert.equal(f.view.distance,2.5);f.emit('pointerup',{pointerId:1,clientX:30});assert.deepEqual(f.taps,[]);assert.equal(f.captures.size,0);
});
test('lifting the last-added unmoved finger cannot select the underlying surface',()=>{
 const f=fixture();f.emit('pointerdown',{pointerId:1});f.emit('pointerdown',{pointerId:2,clientX:10});f.emit('pointerup',{pointerId:2,clientX:10});f.emit('pointerup',{pointerId:1});assert.deepEqual(f.taps,[]);
});
test('source cancellation, lost capture and three-finger interruption release all gesture state',()=>{
 for(const action of ['cancel','capture','pointercancel','third']){const f=fixture();f.emit('pointerdown');
  if(action==='cancel')f.controller.cancel();else if(action==='capture')f.emit('lostpointercapture');else if(action==='pointercancel')f.emit('pointercancel');else{f.emit('pointerdown',{pointerId:2,clientX:20});f.emit('pointerdown',{pointerId:3,clientX:30});f.emit('pointermove',{pointerId:2,clientX:200});f.emit('pointerup',{pointerId:3});f.emit('pointerup',{pointerId:2});}
  f.emit('pointerup');assert.deepEqual(f.taps,[]);assert.deepEqual(f.controller.info(),{pointers:0,multi:false});assert.equal(f.captures.size,0);
 }
});
test('camera keyboard and wheel controls remain bounded and preserve browser modifier shortcuts',()=>{
 const f=fixture();assert.equal(f.emit('keydown',{key:'ArrowRight'}).defaultPrevented,true);assert.equal(f.view.azimuth,.4);f.emit('keydown',{key:'+'});assert.equal(f.view.distance,5/1.1);
 f.emit('wheel',{deltaY:1e9});assert.equal(f.view.distance,100000);f.emit('wheel',{deltaY:-1e9});assert.equal(f.view.distance,.001);
 const before={...f.view};assert.equal(f.emit('wheel',{deltaY:500,ctrlKey:true}).defaultPrevented,false);assert.equal(f.emit('keydown',{key:'+',ctrlKey:true}).defaultPrevented,false);assert.deepEqual(f.view,before);
});
test('right mouse button and stale moves are ignored; disposal is idempotent',()=>{
 const f=fixture();f.emit('pointerdown',{pointerType:'mouse',button:2});f.emit('pointerup');assert.deepEqual(f.taps,[]);
 const before={...f.view};f.emit('pointermove',{clientX:200});assert.deepEqual(f.view,before);f.emit('pointerdown');f.controller.dispose();f.controller.dispose();f.emit('pointerup');f.emit('wheel',{deltaY:20});assert.deepEqual(f.view,before);assert.deepEqual(f.taps,[]);assert.equal(f.captures.size,0);
});
test('malformed coordinates and overflowing screen deltas never corrupt the view',()=>{
 const f=fixture(),before={...f.view};f.emit('pointerdown',{pointerId:-1});f.emit('pointerdown',{clientX:NaN});assert.equal(f.controller.info().pointers,0);
 f.emit('pointerdown',{clientX:-1e308});f.emit('pointermove',{clientX:1e308});assert.deepEqual(f.view,before);f.controller.cancel();
 f.emit('wheel',{deltaY:NaN});assert.deepEqual(f.view,before);
});
