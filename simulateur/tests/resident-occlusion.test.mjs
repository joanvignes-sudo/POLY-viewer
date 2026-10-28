import test from 'node:test';import assert from 'node:assert/strict';
import * as THREE from '../web/vendor/three.module.js?v=audit-o-1';
import {createResidentOcclusion,isNeutralRig} from '../web/resident-occlusion.mjs';
import {createRegionalRig} from '../web/body-region-motion.mjs';
test('neutral domain rejects movement, root shifts and non-identity shoulder quaternions',()=>{
 const rig=createRegionalRig();assert.equal(isNeutralRig(rig.uniforms),true);
 for(const change of [()=>rig.uniforms.hipR.value=.1,()=>rig.uniforms.rootShift.value.x=.1,()=>rig.uniforms.eatShoulder.value.w=.9]){rig.reset();change();assert.equal(isNeutralRig(rig.uniforms),false);}rig.reset();assert.equal(isNeutralRig(rig.uniforms),true);
});
function setup(){const camera=new THREE.PerspectiveCamera(40,1,.01,100);camera.position.z=5;camera.lookAt(0,0,0);camera.updateMatrixWorld();const target=new THREE.Mesh(new THREE.SphereGeometry(.4,12,8),new THREE.MeshBasicMaterial()),front=new THREE.Mesh(new THREE.SphereGeometry(.6,12,8),new THREE.MeshBasicMaterial());front.position.z=1.5;target.userData.source_index=1;front.userData.source_index=2;return {camera,target,front,meshes:[target,front]};}
test('real occluder ray sampling masks only during render, restores exceptions and caches source identities',()=>{
 const s=setup(),layer=createResidentOcclusion(()=>s.meshes);const original={opacity:s.front.material.opacity,transparent:s.front.material.transparent,depthWrite:s.front.material.depthWrite};
 assert.throws(()=>layer.render(s.camera,[1],()=>{assert.equal(s.front.material.opacity,.12);assert.equal(s.target.material.opacity,1);throw Error('render failed')}),/render failed/);
 for(const [key,value]of Object.entries(original))assert.equal(s.front.material[key],value);assert.equal(layer.info().saved_materials,0);assert.deepEqual(layer.info().cached_source_indices,[2]);
 layer.render(s.camera,[1],()=>{});assert.equal(layer.info().cache_hits,1);s.front.position.x=3;layer.render(s.camera,[1],()=>{});assert.deepEqual(layer.info().cached_source_indices,[]);layer.clear();assert.equal(layer.info().cached_key_characters,0);
});
test('same-ID replacement during render never restores old appearance onto a new material generation',()=>{
 const s=setup(),layer=createResidentOcclusion(()=>s.meshes);const next=new THREE.Mesh(s.front.geometry,new THREE.MeshBasicMaterial({opacity:.55,transparent:true}));next.userData.source_index=2;
 layer.render(s.camera,[1],()=>{s.meshes=[s.target,next]});assert.equal(next.material.opacity,.55);assert.equal(layer.info().saved_materials,0);layer.clear();
});
