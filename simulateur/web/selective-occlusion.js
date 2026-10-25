import * as THREE from './vendor/three.module.js?v=audit-o-1';
// Display-only sampling on the HRA meshes in their undeformed standing pose.
function visibleInScene(mesh){for(let p=mesh;p;p=p.parent)if(!p.visible)return false;return Boolean(mesh);}
// Cache only within the undeformed standing display domain. Include the states
// used by ray admission: skin opacity and ancestor visibility can change even
// when neither the camera nor the selected structure moves.
export function occlusionSceneKey(camera,targets,meshes){
 camera.updateWorldMatrix(true,false);
 const state=mesh=>{if(!mesh)return 'null';mesh.updateWorldMatrix(true,false);const m=mesh.material;
  return [mesh.uuid,visibleInScene(mesh)?1:0,mesh.geometry?.uuid,...mesh.matrixWorld.elements,
   Array.isArray(m)?'array':m?.uuid,Array.isArray(m)?'':m?.opacity,Array.isArray(m)?'':m?.side].join(',');};
 return [camera.matrixWorld.elements.join(','),targets.map(state).join(';'),meshes.map(state).join(';')].join('|');
}
export function findOccluders(camera,selected,meshes){
 return findGroupOccluders(camera,[selected],meshes);
}
export function findGroupOccluders(camera,targets,meshes){
 const visible=targets.filter(visibleInScene),targetSet=new Set(targets),materials=new Set(targets.filter(Boolean).map(m=>m.material));if(!visible.length)return [];
 const box=new THREE.Box3();for(const mesh of visible){mesh.updateWorldMatrix(true,false);mesh.geometry.computeBoundingBox();box.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));}
 const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3()).multiplyScalar(.35);
 const samples=[center];for(let axis=0;axis<3;axis++)for(const sign of [-1,1]){const p=center.clone();p.setComponent(axis,p.getComponent(axis)+sign*size.getComponent(axis));samples.push(p);}
 const origin=camera.getWorldPosition(new THREE.Vector3()),found=new Set(),raycaster=new THREE.Raycaster();
 for(const point of samples){const delta=point.clone().sub(origin),distance=delta.length();if(distance<1e-5)continue;raycaster.set(origin,delta.normalize());raycaster.far=Infinity;
  // A hollow surface may be hit beyond its bounding-box centre. Bound occluders
  // by the first actual target hit, rather than clipping that hit at the centre.
  const targetHit=raycaster.intersectObjects(visible,false)[0];if(!targetHit)continue;raycaster.far=targetHit.distance-1e-5;if(raycaster.far<=0)continue;
  for(const mesh of meshes){if(targetSet.has(mesh)||!visibleInScene(mesh)||!mesh.material||Array.isArray(mesh.material)||materials.has(mesh.material)||mesh.material.opacity<=.1)continue;
   mesh.updateWorldMatrix(true,false);if(!mesh.geometry.boundingBox)mesh.geometry.computeBoundingBox();const bounds=mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);if(!raycaster.ray.intersectsBox(bounds))continue;
   if(raycaster.intersectObject(mesh,false).some(hit=>hit.distance<raycaster.far))found.add(mesh);
  }
 }return [...found];
}
export function createMaterialMask(){
 const saved=new Map();return {
  apply(meshes,opacity=.12){for(const mesh of meshes){const m=mesh.material;if(!m||Array.isArray(m)||saved.has(m))continue;saved.set(m,{opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite});m.opacity=Math.min(m.opacity,opacity);m.transparent=true;m.depthWrite=false;m.needsUpdate=true;}},
  restore(){for(const [m,state]of saved){Object.assign(m,state);m.needsUpdate=true;}saved.clear();},
  get size(){return saved.size;}
 };
}
