// Source identities only are indexed. Mesh references are resolved for the current action.
export function createFunctionalBindings(nodes,records,getMeshes){
  const sourceIds=Object.fromEntries(Object.entries(nodes).map(([id,node])=>[id,
    node.match?records.filter(r=>r.name.includes(node.match)||r.path.some(p=>p.includes(node.match))).map(r=>r.source_index):[]]));
  function visible(mesh){
    if(mesh.material?.opacity===0)return false;
    for(let object=mesh;object;object=object.parent)if(object.visible===false)return false;
    return true;
  }
  function snapshot(){
    const meshes=getMeshes(),byId=new Map(meshes.map(m=>[m.userData.source_index,m]));
    const matches=Object.fromEntries(Object.entries(sourceIds).map(([id,ids])=>[id,ids.map(i=>byId.get(i)).filter(Boolean)]));
    const coverage=Object.fromEntries(Object.entries(sourceIds).map(([id,ids])=>[id,{
      kind:nodes[id].match?'source_match':'documentary_marker',expected:ids.length,
      resident:matches[id].map(m=>m.userData.source_index),
      visible:matches[id].filter(visible).map(m=>m.userData.source_index),
      missing:ids.filter(i=>!byId.has(i)),
    }]));
    return {matches,coverage};
  }
  return {snapshot};
}
