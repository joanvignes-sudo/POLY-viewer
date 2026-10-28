import {auditSceneGeometryIds} from '../web/three-resource-audit.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createSourceMaterialSession} from '../web/body-source-material-session.mjs';
import {EyeReader} from '../web/p1-eye-reader.mjs';

const mesh=(id,uuid='generation-a')=>({userData:{source_index:id,name:'source'},material:{uuid,opacity:.7,transparent:false,depthWrite:true}});
test('appearance restores only the same source and material generation',()=>{
 let meshes=[mesh(1)],session=createSourceMaterialSession(()=>meshes);
 session.capture([1]);session.apply(()=>({opacity:.2,transparent:true,depthWrite:false}));
 assert.equal(meshes[0].material.opacity,.2);
 const replacement=mesh(1,'generation-b');replacement.material.opacity=.9;meshes=[replacement];
 assert.equal(session.isCurrent([1]),false);session.restore();
 assert.equal(replacement.material.opacity,.9);assert.equal(session.size,0);
});
test('eviction restores remaining surfaces and releases all saved appearances',()=>{
 let meshes=[mesh(1),mesh(2)],session=createSourceMaterialSession(()=>meshes);
 session.capture([1,2]);session.apply(()=>({opacity:.1}));meshes.shift();
 assert.equal(session.isCurrent([1,2]),false);session.restore();
 assert.equal(meshes[0].material.opacity,.7);assert.equal(session.size,0);
});
test('capture is atomic and rejects missing or duplicate active sessions',()=>{
 const meshes=[mesh(1)],session=createSourceMaterialSession(()=>meshes);
 assert.throws(()=>session.capture([1,2]),/unavailable/);assert.equal(session.size,0);
 session.capture([1]);assert.throws(()=>session.capture([1]),/already active/);
 session.restore();assert.equal(session.isCurrent([]),true);
});
test('appearance changes cannot rewrite source metadata or unrelated material properties',()=>{
 const meshes=[mesh(1)],session=createSourceMaterialSession(()=>meshes),before=structuredClone(meshes[0].userData);
 session.capture([1]);session.apply(()=>({opacity:.2,source_index:9,uuid:'forged',name:'forged'}));
 assert.deepEqual(meshes[0].userData,before);assert.equal(meshes[0].material.uuid,'generation-a');session.restore();
});
test('P1 checkpoint retains unknown biological time and rejects altered contracts',async()=>{
 const c=JSON.parse(await fs.readFile(new URL('../web/p1-eye-light.json',import.meta.url))),reader=new EyeReader(c);
 reader.select(1);const checkpoint=reader.save(),reloaded=new EyeReader(c);reloaded.restore(checkpoint);
 assert.equal(reloaded.read().biologicalTime,null);assert.equal(reloaded.read().displayPhase,5);
 assert.ok(reloaded.read().trace.every(e=>e.biologicalTime===null));
 const forged=JSON.parse(checkpoint);forged.contract.mechanisms[0].time.value=1;
 assert.throws(()=>reloaded.restore(JSON.stringify(forged)),/incompatible/);
});


test('scene audit accepts shared geometry and detects distinct objects with colliding runtime IDs',()=>{
 const a={id:1,uuid:'a'},b={id:1,uuid:'b'};
 let geometries=[a,a];const scene={traverse:visit=>geometries.forEach(geometry=>visit({geometry}))};
 assert.equal(auditSceneGeometryIds(scene).consistent,true);
 geometries=[a,b];assert.deepEqual(auditSceneGeometryIds(scene).numeric_id_collisions,[1]);
 assert.equal(auditSceneGeometryIds(scene).distinct_geometry_objects,2);
});


test('unchanged appearance does not request shader recompilation on each frame',()=>{
 const meshes=[mesh(1)];let updates=0;Object.defineProperty(meshes[0].material,'needsUpdate',{set(){updates++}});
 const session=createSourceMaterialSession(()=>meshes);session.capture([1]);
 session.apply(()=>({opacity:0,transparent:true}));session.apply(()=>({opacity:0,transparent:true}));
 assert.equal(updates,1);session.restore();assert.equal(updates,2);session.restore();assert.equal(updates,2);
});
