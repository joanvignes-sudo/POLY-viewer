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
  observations:(data.human_latency_observations??[]).filter(o=>itineraries.has(o.itinerary))};
}
