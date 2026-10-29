import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {snapshotChain} from '../web/documentary-context.mjs';
import {RESOURCE_PATHS,validateManifest,verifyDigests} from '../web/documentary-manifest.mjs';
import {create} from '../web/documentary-engine.js';
const groups=JSON.parse(fs.readFileSync(new URL('../data/documentary-chains.json',import.meta.url))).groups;
const view={target:[0,2,0],zoom:1,pitch:0,angle:0};
const resources=RESOURCE_PATHS.map(path=>({path,sha256:'a'.repeat(64)}));
function record(g,index,progress=0,edge=null){return {schema:'poly.documentary-manifest.v1',scope:'documentary-view-only',physiological_replay:false,representation:'body',context:snapshotChain(g,index,progress,edge),view:structuredClone(view),body_view:structuredClone(view),resources:structuredClone(resources)};}
test('every actual documentary node and edge keeps source identity and engine boundaries',()=>{
 let boundaries=0,visible=0;
 for(const g of groups.filter(g=>g.id!=='WALK'))for(const [i,n] of g.nodes.entries()){
  assert.doesNotThrow(()=>validateManifest(record(g,i),groups));
  const model=create(g);model.select(n.id);
  for(const e of model.outgoing()){
   assert.doesNotThrow(()=>validateManifest(record(g,i,0,e.id),groups));
   const r=record(g,i,.5,e.id);
   if(model.assess(e)==='VISIBLE'){visible++;assert.doesNotThrow(()=>validateManifest(r,groups));}
   else {boundaries++;assert.throws(()=>validateManifest(r,groups),/frontière documentaire/);}
  }
 }
 assert.ok(boundaries>0);assert.ok(visible>0);
});
test('import rejects changed source claims and incomplete contexts before restoration',()=>{
 const g=groups[0],original=record(g,0);
 for(const key of ['schema','title','region','kind','coordinate_system','localization_kind','source_ids','identity','node_id','time_kind','microscopic_observations','anatomical_registration']){
  const changed=structuredClone(original);changed.context[key]=key==='source_ids'?['invented']: 'invented';
  assert.throws(()=>validateManifest(changed,groups),undefined,key);
  const missing=structuredClone(original);delete missing.context[key];assert.throws(()=>validateManifest(missing,groups),undefined,key);
 }
 assert.throws(()=>validateManifest({...original,context:null},groups));
 const free=structuredClone(original);free.context.reading_progress=.5;assert.throws(()=>validateManifest(free,groups),/sans relation/);
});
test('manifest provenance includes context and traversal rules and refuses changed digest',()=>{
 assert.ok(RESOURCE_PATHS.includes('documentary-context.mjs'));
 assert.ok(RESOURCE_PATHS.includes('documentary-engine.js'));
 verifyDigests(resources,structuredClone(resources));
 const changed=structuredClone(resources);changed[0].sha256='b'.repeat(64);
 assert.throws(()=>verifyDigests(resources,changed),/ressources ont changé/);
 const old=record(groups[0],0);old.resources=old.resources.filter(r=>!['documentary-context.mjs','documentary-engine.js'].includes(r.path));
 assert.throws(()=>validateManifest(old,groups),/Provenance incomplète/);
});
