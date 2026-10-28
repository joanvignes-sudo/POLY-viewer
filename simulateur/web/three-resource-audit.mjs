// Shared geometries are legitimate; different geometry objects with the same numeric ID are not.
export function auditSceneGeometryIds(scene){
  const ids=new Map(),objects=new Set(),collisions=new Set();
  scene.traverse(object=>{
    const geometry=object.geometry;if(!geometry)return;objects.add(geometry.uuid);
    const prior=ids.get(geometry.id);
    if(prior!==undefined&&prior!==geometry.uuid)collisions.add(geometry.id);
    else ids.set(geometry.id,geometry.uuid);
  });
  return {distinct_geometry_objects:objects.size,numeric_id_collisions:[...collisions],consistent:collisions.size===0};
}
