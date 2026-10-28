import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {sourceMeshData,createSourceAccess} from '../web/body-source-contract.mjs';

const meta=JSON.parse(gunzipSync(fs.readFileSync(new URL('../models/body-display.json.gz',import.meta.url))));
const meshes=meta.structures.map((r,i)=>({userData:sourceMeshData(r,{sourceIndex:i,system:'fixture'})}));
test('918 historical identities retain every field consumed by inspection and source addressing',()=>{
 assert.equal(meshes.length,918);
 for(const [i,m] of meshes.entries()){
  const r=meta.structures[i],d=m.userData;
  for(const key of ['name','node','path','bounds','vertex_count','triangle_count','position_offset','normal_offset','index_offset'])
   assert.deepEqual(d[key],r[key],`${i}: ${key}`);
  assert.equal(d.source_index,i);
  assert.notEqual(d.path,r.path);
  assert.notEqual(d.bounds,r.bounds);
 }
});
test('French aliases, accents, empty and missing searches use the real catalogue',()=>{
 const access=createSourceAccess(()=>meshes);
 for(const [a,b] of [['cœur','heart'],['COEUR','heart'],['rein gauche','left_kidney'],['œsophage','esophagus'],['vésicule biliaire','gallbladder']]){
  if(a!=='œsophage')assert.ok(access.search(a).length,a);
  assert.deepEqual(access.search(a),access.search(b));
 }
 assert.deepEqual(access.search('  '),[]);
 assert.deepEqual(access.search('no_such_anatomy'),[]);
 assert.ok(access.search('VH_M').length<=35);
});
test('resolving an identity after eviction never returns the previous mesh',()=>{
 let resident=[meshes[0]];
 const access=createSourceAccess(()=>resident);
 assert.equal(access.resolve(0),meshes[0]);
 resident=[];
 assert.equal(access.resolve(0),null);
 assert.deepEqual(access.search(meta.structures[0].name),[]);
 const replacement={userData:sourceMeshData(meta.structures[0],{sourceIndex:0})};
 resident=[replacement];
 assert.equal(access.resolve(0),replacement);
 assert.notEqual(access.resolve(0),meshes[0]);
});
