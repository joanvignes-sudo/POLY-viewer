// Catalogue-only selection: never downloads geometry or merges bone concepts.
export function selectSkeletonObjects(catalogue,{region='all',concept='all'}={}){
 const meshes=catalogue?.data?.meshes;if(!Array.isArray(meshes))throw Error('Skeleton catalogue required');
 return meshes.map((metadata,source_index)=>({key:'skeleton206/'+source_index,source_index,metadata})).filter(e=>(region==='all'||e.metadata.region===region)&&(concept==='all'||e.metadata.bone_id===concept));
}
