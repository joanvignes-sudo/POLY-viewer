import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {readValidatedChunk,createBoundedChunkStore} from '../web/body-chunk-reader.mjs';
import {createRegionSceneAdapter} from '../web/body-region-three.mjs';

const root=process.env.POLY_CHUNKS_ROOT;
assert.ok(root,'Temporary verified chunk output required (POLY_CHUNKS_ROOT)');
const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'),'utf8'));
const readBytes=async filename=>new Uint8Array(await fs.readFile(path.join(root,filename)));
const unzip=async bytes=>new Uint8Array(gunzipSync(bytes));
const hash=async bytes=>createHash('sha256').update(bytes).digest('hex');

function fakeThree({failOnGeometry=null}={}){
 const created={geometries:0,materials:0,geometryDisposals:0,materialDisposals:0};
 class Group {
  constructor(){this.children=[]}
  add(item){this.children.push(item)}
  remove(item){this.children=this.children.filter(x=>x!==item)}
 }
 class Scene extends Group {}
 class BufferAttribute {
  constructor(array,itemSize){this.array=array;this.itemSize=itemSize;this.count=array.length/itemSize}
 }
 class BufferGeometry {
  constructor(){created.geometries++;this.attributes={};this.index=null}
  setAttribute(name,attribute){this.attributes[name]=attribute}
  setIndex(index){this.index=index}
  computeBoundingSphere(){if(failOnGeometry!==null&&created.geometries===failOnGeometry)throw Error('Injected GPU fixture')}
  dispose(){created.geometryDisposals++}
 }
 class MeshStandardMaterial {
  constructor(options){Object.assign(this,options);created.materials++;
   this.emissive={value:0,setHex:value=>{this.emissive.value=value}};
  }
  dispose(){created.materialDisposals++}
 }
 class Mesh {constructor(geometry,material){this.geometry=geometry;this.material=material;this.userData={};this.name=''}}
 return {THREE:{Group,Scene,BufferAttribute,BufferGeometry,MeshStandardMaterial,Mesh,DoubleSide:2},
  created,scene:new Scene()};
}

test('a real source chunk becomes original vertex/index buffers with same stable source IDs',async()=>{
 const c=manifest.chunks.find(x=>x.system==='skeletal')??manifest.chunks[0];
 const chunk=await readValidatedChunk(manifest,c.id,{readBytes,unzip,hash});
 const {THREE,created,scene}=fakeThree();
 const adapter=createRegionSceneAdapter({THREE,scene});
 const state=adapter.install(chunk);
 assert.equal(scene.children.length,1);
 assert.equal(state.meshes.length,c.part_count);
 assert.equal(adapter.diagnostics().meshes,c.part_count);
 for(const [i,mesh] of state.meshes.entries()){
  const source=chunk.metadata.geometries[i];
  assert.equal(mesh.userData.source_index,source.source_index);
  assert.equal(mesh.userData.source_name,source.name);
  assert.deepEqual(mesh.userData.source_offsets,source.source_offsets);
  assert.equal(mesh.geometry.attributes.position.count,source.vertex_count);
  assert.equal(mesh.geometry.attributes.normal.count,source.vertex_count);
  assert.equal(mesh.geometry.index.count,source.triangle_count*3);
  assert.equal(mesh.geometry.attributes.position.array[0],
    new DataView(chunk.bytes.buffer,chunk.bytes.byteOffset+source.position_offset).getFloat32(0,true));
  assert.equal(mesh.geometry.index.array[0],
    new DataView(chunk.bytes.buffer,chunk.bytes.byteOffset+source.index_offset).getUint32(0,true));
 }
 const first=c.original_indices[0],selected=adapter.select(first);
 assert.equal(selected.source_index,first);
 assert.equal(adapter.diagnostics().selected_source_index,first);
 assert.deepEqual(adapter.sourceInfo(first).bounds,chunk.metadata.geometries[0].bounds);
 assert.equal(adapter.select(917000),null);
 assert.equal(adapter.uninstall(state,chunk),true);
 assert.equal(adapter.diagnostics().meshes,0);
 assert.equal(scene.children.length,0);
 assert.equal(created.geometryDisposals,created.geometries);
 assert.equal(created.materialDisposals,created.materials);
 assert.equal(adapter.sourceInfo(first),null);
});

test('a simulated failure halfway through constructing a block disposes all interim buffers',async()=>{
 const c=manifest.chunks.find(x=>x.part_count>2);
 assert.ok(c);
 const chunk=await readValidatedChunk(manifest,c.id,{readBytes,unzip,hash});
 const {THREE,created,scene}=fakeThree({failOnGeometry:3});
 const adapter=createRegionSceneAdapter({THREE,scene});
 assert.throws(()=>adapter.install(chunk),/Injected GPU fixture/);
 assert.equal(scene.children.length,0);
 assert.equal(adapter.diagnostics().meshes,0);
 assert.deepEqual(adapter.listSourceIndices(),[]);
 assert.equal(created.geometryDisposals,created.geometries);
 assert.equal(created.materialDisposals,created.materials);
});

test('bounded store evicts a region, disposes its meshes, and preserves original identity upon reload',async()=>{
 const candidates=[...manifest.chunks].sort((a,b)=>b.raw_bytes-a.raw_bytes);
 const [a,b]=candidates;
 const cap=Math.max(a.raw_bytes,b.raw_bytes);
 const {THREE,created,scene}=fakeThree();
 let selectionLost=0;
 const adapter=createRegionSceneAdapter({THREE,scene,onSelectionLost:()=>{selectionLost++}});
 const store=createBoundedChunkStore(manifest,{readBytes,unzip,hash,maxRawBytes:cap,
  onInstall:adapter.install,onDispose:adapter.uninstall});
 const first=await store.load(a.id);
 const selected=adapter.select(first.metadata.geometries[0].source_index);
 assert.ok(selected);
 await store.load(b.id);
 assert.deepEqual(store.info().ids,[b.id]);
 assert.equal(scene.children.length,1);
 assert.equal(adapter.sourceInfo(selected.source_index),null);
 assert.equal(selectionLost,1);
 assert.ok(store.info().residentRawBytes<=cap);
 const afterEviction=created.geometryDisposals;
 assert.ok(afterEviction>=a.part_count);
 const again=await store.load(a.id);
 assert.equal(again.metadata.geometries[0].source_index,selected.source_index);
 assert.equal(adapter.sourceInfo(selected.source_index).source_index,selected.source_index);
 store.clear();assert.equal(scene.children.length,0);
 assert.equal(created.geometryDisposals,created.geometries);
 assert.equal(created.materialDisposals,created.materials);
});

test('corrupt compressed or metadata source cannot install any visible Three.js geometry',async()=>{
 const c=manifest.chunks[0];const {THREE,created,scene}=fakeThree();
 const adapter=createRegionSceneAdapter({THREE,scene});
 const corruptedRead=async filename=>{
  const result=await readBytes(filename);
  if(filename===c.geometry)result[9]^=1;
  return result;
 };
 const store=createBoundedChunkStore(manifest,{readBytes:corruptedRead,unzip,hash,
   onInstall:adapter.install,onDispose:adapter.uninstall});
 await assert.rejects(store.load(c.id),/gzip.*altéré/i);
 assert.equal(scene.children.length,0);
 assert.equal(created.geometries,0);
 assert.equal(store.info().residentRawBytes,0);
});

test('selection identity and bounding box remain documentary, even with multiple resident regions',async()=>{
 const [a,b]=manifest.chunks;
 const {THREE,scene}=fakeThree();
 const adapter=createRegionSceneAdapter({THREE,scene});
 const x=await readValidatedChunk(manifest,a.id,{readBytes,unzip,hash});
 const y=await readValidatedChunk(manifest,b.id,{readBytes,unzip,hash});
 adapter.install(x);adapter.install(y);
 const indices=adapter.listSourceIndices();
 assert.equal(indices.length,a.part_count+b.part_count);
 const selected=adapter.select(b.original_indices[0]);
 assert.equal(selected.chunk_id,b.id);
 assert.equal(selected.source_offsets.position_offset,y.metadata.geometries[0].source_offsets.position_offset);
 assert.ok(selected.bounds.every(row=>row.every(Number.isFinite)));
 assert.equal(selected.path.length>0,true);
 adapter.dispose();assert.equal(scene.children.length,0);
});


test('clearing while a source block is downloading prevents late geometry from entering the scene',async()=>{
 const c=manifest.chunks[0];
 const {THREE,created,scene}=fakeThree();
 const adapter=createRegionSceneAdapter({THREE,scene});
 let unlock,notify;
 const gate=new Promise(resolve=>{unlock=resolve});
 const started=new Promise(resolve=>{notify=resolve});
 const delayed=async filename=>{
  if(filename===c.geometry){notify();await gate}
  return readBytes(filename);
 };
 const store=createBoundedChunkStore(manifest,{readBytes:delayed,unzip,hash,
  onInstall:adapter.install,onDispose:adapter.uninstall});
 const pending=store.load(c.id);
 await started;
 assert.deepEqual(store.info().pending,[c.id]);
 store.clear();
 unlock();
 await assert.rejects(pending,/annulé/);
 assert.equal(store.info().residentRawBytes,0);
 assert.equal(scene.children.length,0);
 assert.equal(created.geometries,0);
});

test('releasing a specific region during download invalidates that pending request',async()=>{
 const c=manifest.chunks[0];
 const {THREE,scene}=fakeThree();
 const adapter=createRegionSceneAdapter({THREE,scene});
 let continueLoad,started;
 const gate=new Promise(resolve=>{continueLoad=resolve});
 const entered=new Promise(resolve=>{started=resolve});
 const delayed=async filename=>{
  if(filename===c.geometry){started();await gate}
  return readBytes(filename);
 };
 const store=createBoundedChunkStore(manifest,{readBytes:delayed,unzip,hash,
  onInstall:adapter.install,onDispose:adapter.uninstall});
 const pending=store.load(c.id);
 await entered;
 assert.equal(store.release(c.id),false,'No resident block yet, but pending load is invalidated');
 continueLoad();
 await assert.rejects(pending,/annulé/);
 assert.equal(adapter.diagnostics().meshes,0);
});

test('a slow asynchronous GPU installer is disposed if the user clears the scene mid-install',async()=>{
 const c=manifest.chunks[0],{THREE,created,scene}=fakeThree();
 const adapter=createRegionSceneAdapter({THREE,scene});
 let finish,notify;
 const gate=new Promise(resolve=>{finish=resolve});
 const started=new Promise(resolve=>{notify=resolve});
 const store=createBoundedChunkStore(manifest,{readBytes,unzip,hash,
  onInstall:async chunk=>{const installed=adapter.install(chunk);notify();await gate;return installed},
  onDispose:adapter.uninstall});
 const pending=store.load(c.id);
 await started;
 assert.ok(scene.children.length>0);
 store.clear();
 finish();
 await assert.rejects(pending,/annulé/);
 assert.equal(scene.children.length,0);
 assert.equal(adapter.diagnostics().meshes,0);
 assert.equal(created.geometryDisposals,created.geometries);
 assert.equal(created.materialDisposals,created.materials);
 assert.equal(store.info().residentRawBytes,0);
});
