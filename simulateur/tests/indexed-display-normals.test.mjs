import {test} from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../web/vendor/three.module.js?v=audit-o-1';
import {writeIndexedDisplayNormals} from '../web/indexed-display-normals.mjs';
function compare(positions,indices){const original=Buffer.from(positions.buffer.slice(0)),sourceIndices=Buffer.from(indices.buffer.slice(0)),geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setIndex(new THREE.BufferAttribute(indices,1));try{geometry.computeVertexNormals();const expected=geometry.attributes.normal.array,actual=new Float32Array(positions.length);actual.fill(9);writeIndexedDisplayNormals(positions,indices,actual);assert.deepEqual(Buffer.from(actual.buffer),Buffer.from(expected.buffer));assert.deepEqual(Buffer.from(positions.buffer),original);assert.deepEqual(Buffer.from(indices.buffer),sourceIndices);}finally{geometry.dispose();}}
test('indexed scalar display normals reproduce Three Float32 bytes including unused and degenerate vertices',()=>{
 compare(new Float32Array([0,0,0,1,0,0,0,1,0,0,0,1,3,3,3]),new Uint32Array([0,1,2,0,2,3,0,0,0,1,2,1]));
 compare(new Float32Array([-0,0,-0,0,-0,0,0,0,-0]),new Uint32Array([0,1,2,2,1,0]));
 compare(new Float32Array(),new Uint32Array());
 let seed=42;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
 for(let sample=0;sample<12;sample++){const p=Float32Array.from({length:900},()=>random()*4-2),ids=Uint32Array.from({length:1800},()=>Math.floor(random()*300));compare(p,ids);}
});
test('invalid normal buffers are rejected without changing the destination',()=>{
 const p=new Float32Array([0,0,0,1,0,0,0,1,0]),n=new Float32Array(9).fill(7);
 for(const [positions,indices,normals]of [[p,new Uint32Array([0,1,3]),n],[p,new Uint32Array([0,1]),n],[p,new Uint32Array([0,1,2]),p],[new Float32Array([NaN,0,0]),new Uint32Array([0,0,0]),new Float32Array(3)],[new Float64Array(p),new Uint32Array([0,1,2]),n]])assert.throws(()=>writeIndexedDisplayNormals(positions,indices,normals));
 assert.deepEqual([...n],Array(9).fill(7));
});
