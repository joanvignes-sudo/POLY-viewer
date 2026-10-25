// A source-native display set, not a graph of anatomical attachments.
export const KNEE_NODES=Object.freeze({
 405:'VH_M_rectus_femoris_L',406:'VH_M_tendon_of_quadriceps_femoris_L',
 1029:'VH_M_patellar_ligament_L',1034:'VH_M_femur_L',1050:'VH_M_tibia_L',1051:'VH_M_patella_L'
});
export function nativeKneeEntries(entries,metadata){
 if(metadata.reference!=='HRA united male v1.10, Visible Human')throw Error('Source HRA différente');
 return Object.entries(KNEE_NODES).map(([key,name])=>{
  const node=Number(key),matches=entries.filter(e=>e.source_node===node),parts=metadata.structures.filter(e=>e.node===node);
  if(matches.length!==1||parts.length!==1||matches[0].source_name!==name||parts[0].name!==name||matches[0].id!==`POLY:HRA:${node}`)throw Error('Identité native incompatible');
  return matches[0];
 });
}
export function nativeContextMatch(entry,system){return system==='native-knee-left'?KNEE_NODES[entry.source_node]===entry.source_name:system==='all'||entry.system===system;}
export function visibleInHierarchy(mesh){for(let p=mesh;p;p=p.parent)if(p.visible===false)return false;return Boolean(mesh);}
