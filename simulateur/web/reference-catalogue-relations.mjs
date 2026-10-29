// Resolve documentary links only from explicit source fields. No geometry is needed.
export function referenceRelations(data,key){
 const match=/^(parts|bones)\/(\d+)$/.exec(key);
 const item=match&&data[match[1]]?.[Number(match[2])];
 if(!item)return null;
 const rows=[];
 for(const collection of ['parts','bones'])for(const [i,metadata] of (data[collection]??[]).entries())rows.push({key:collection+'/'+i,collection,metadata});
 const relations=(data.bone_relations??[]).filter(r=>match[1]==='parts'?(r.parts??[]).includes(item.id):r.bone_family===item.bone_family);
 const links=new Map();
 for(const relation of relations)for(const row of rows){
  if(row.key===key||!item.side||row.metadata.side!==item.side)continue;
  if(match[1]==='parts'?row.collection==='bones'&&row.metadata.bone_family===relation.bone_family:row.collection==='parts'&&(relation.parts??[]).includes(row.metadata.id))links.set(row.key,row);
 }
 const opposite=item.contralateral_id?rows.find(r=>r.collection===match[1]&&r.metadata.id===item.contralateral_id):null;
 const itineraries=new Set([item.itinerary,...(item.itineraries??[]).map(p=>p.id)].filter(Boolean));
 return {item,relations,links:[...links.values()],opposite:opposite??null,
  observations:(data.human_latency_observations??[]).filter(o=>o.part_ids?o.part_ids.includes(item.id)&&(o.allowed_paths??[]).some(id=>itineraries.has(id)):itineraries.has(o.itinerary)),
  interactions:(data.human_interaction_observations??[]).filter(o=>item.side&&(o['parts_'+item.side]??[]).includes(item.id))};
}

// Match the exact study membership and side; no antagonist is inferred from names.
export function referenceInteractionSelection(data,key,observationId){
 const model=referenceRelations(data,key),observation=model?.interactions.find(o=>o.id===observationId);if(!observation||!['L','R'].includes(model.item.side))return null;
 const ids=observation['parts_'+model.item.side];if(!Array.isArray(ids)||ids.length<2||new Set(ids).size!==ids.length||!ids.includes(model.item.id))return null;
 const keys=[];for(const id of ids){const matches=data.parts.map((part,index)=>({part,index})).filter(row=>row.part.id===id&&row.part.side===model.item.side);if(matches.length!==1)return null;keys.push('parts/'+matches[0].index);}
 return {observation,keys:[key,...keys.filter(other=>other!==key)]};
}
