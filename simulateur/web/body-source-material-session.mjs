// Save appearance by source ID + material generation, without retaining Mesh or Material objects.
export function createSourceMaterialSession(getMeshes){
  let saved=new Map();
  const current=()=>new Map(getMeshes().map(m=>[m.userData.source_index,m]));
  function capture(sourceIndices){
    if(saved.size)throw Error('Material session already active');
    const meshes=current(),next=new Map();
    for(const id of new Set(sourceIndices)){
      const mesh=meshes.get(id),material=mesh?.material;
      if(!Number.isInteger(id)||!material?.uuid||Array.isArray(material))throw Error('Source material unavailable');
      next.set(id,{materialId:material.uuid,values:{opacity:material.opacity,transparent:material.transparent,depthWrite:material.depthWrite}});
    }
    saved=next;
  }
  function isCurrent(sourceIndices){
    const ids=new Set(sourceIndices),meshes=current();
    return ids.size===saved.size&&[...ids].every(id=>saved.has(id)&&meshes.get(id)?.material?.uuid===saved.get(id).materialId);
  }
  function apply(patchForSource){
    if(!saved.size)return;
    const meshes=current();
    for(const [id,entry]of saved){
      const mesh=meshes.get(id);if(mesh?.material?.uuid!==entry.materialId)continue;
      const patch=patchForSource(mesh.userData);
      let changed=false;
      for(const name of ['opacity','transparent','depthWrite'])if(Object.hasOwn(patch,name)&&mesh.material[name]!==patch[name]){mesh.material[name]=patch[name];changed=true;}
      if(changed)mesh.material.needsUpdate=true;
    }
  }
  function restore(){
    if(!saved.size)return;
    const meshes=current();
    for(const [id,entry]of saved){const material=meshes.get(id)?.material;if(material?.uuid===entry.materialId){let changed=false;for(const [key,value]of Object.entries(entry.values))if(material[key]!==value){material[key]=value;changed=true}if(changed)material.needsUpdate=true}}
    saved.clear();
  }
  return {capture,apply,isCurrent,restore,get size(){return saved.size}};
}
