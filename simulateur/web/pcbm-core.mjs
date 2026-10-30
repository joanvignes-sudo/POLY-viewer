// PCBM — isolated, deterministic multi-scale transition contract.
// No anatomical registration, biological time, or physiological flux is inferred here.
export const REGISTRY_SCHEMA='poly.pcbm.registry.v1';
const modes=new Set(['spatial','structural','documentary']);
const evidence=new Set(['documented','candidate','unknown']);
const representations=new Set(['measured_atlas','reference_atlas','documentary','conceptual']);
const availability=new Set(['viewer','external','not_mounted']);
const frames=new Set(['atlas','normalized','illustrative','abstract','unregistered_image']);
const units=new Set(['mm','display_unit','unitless','none','voxel']);
const officialHosts=new Set(['pubmed.ncbi.nlm.nih.gov','docs.sparc.science']);
const idOk=s=>typeof s==='string'&&/^[a-z][a-z0-9-]{1,80}$/.test(s);
const assert=(yes,message)=>{if(!yes)throw Error('PCBM: '+message)};
function unique(items,what){
 assert(Array.isArray(items)&&items.length>0&&items.length<=2000,what+' missing or oversized');
 const map=new Map();
 for(const item of items){assert(item&&idOk(item.id)&&!map.has(item.id),what+' identifier missing or duplicated');map.set(item.id,item)}
 return map;
}
function localViewerUrl(s){
 return typeof s==='string'&&/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/i.test(s);
}
function validEvidenceList(ids,sources){
 return Array.isArray(ids)&&ids.length>0&&ids.length<=20&&new Set(ids).size===ids.length&&ids.every(id=>sources.has(id));
}
export function validatePCBM(reg){
 assert(reg?.schema===REGISTRY_SCHEMA&&reg.experimental===true&&reg.published===false&&reg.claims_spatial_registration===false,'registry publication or spatial scope');
 const bySource=unique(reg.sources,'sources');
 for(const s of bySource.values()){
  assert(typeof s.title==='string'&&s.title.length>5&&['repository_file','research_note','study_reference'].includes(s.kind),'unqualified source');
  assert(['source_read','documentary_only','not_mounted'].includes(s.verification),'source verification status absent');
  assert(s.path===null||typeof s.path==='string'&&/^simulateur\/(?:web|data|reports)\/[a-zA-Z0-9._/-]+$/.test(s.path)&&!s.path.includes('..'),'unsafe source path');
  if(s.url!==undefined&&s.url!==null){let u;try{u=new URL(s.url)}catch{throw Error('PCBM: invalid source URL')};assert(u.protocol==='https:'&&officialHosts.has(u.hostname)&&!u.username&&!u.password,'unapproved source URL')}
  if(s.doi!==undefined&&s.doi!==null)assert(typeof s.doi==='string'&&/^10\.\d{4,9}\/\S{2,120}$/.test(s.doi),'invalid DOI');
  if(s.pmid!==undefined&&s.pmid!==null)assert(typeof s.pmid==='string'&&/^\d{5,10}$/.test(s.pmid),'invalid PMID');
 }
 const byFrame=unique(reg.frames,'frames');
 for(const f of byFrame.values()){
  assert(frames.has(f.kind)&&units.has(f.unit)&&typeof f.description==='string','invalid coordinate frame');
  if(f.kind==='abstract')assert(f.unit==='none','abstract frame has metric unit');
  if(f.kind==='normalized')assert(f.unit==='unitless','normalized coordinate interpreted as length');
 }
 const byNode=unique(reg.nodes,'nodes');
 for(const n of byNode.values()){
  assert(typeof n.label==='string'&&n.label.length>2&&typeof n.detail==='string'&&n.detail.length>10,'node description missing');
  assert(byFrame.has(n.frame_id)&&representations.has(n.representation)&&availability.has(n.availability),'node frame or representation absent');
  assert(validEvidenceList(n.source_ids,bySource),'node sources absent');
  assert(n.order_exponent_m===null||Number.isInteger(n.order_exponent_m)&&n.order_exponent_m>=-15&&n.order_exponent_m<=3,'invalid illustrative scale');
  assert(n.scale_basis==='illustrative_only','scale treated as measured');
  assert(n.specimen_id===null||idOk(n.specimen_id),'unqualified specimen identity');
  if(n.availability==='viewer')assert(localViewerUrl(n.href),'viewer route not local');
  else assert(n.href===null,'unmounted or external data presented as local viewer');
 }
 const byLink=unique(reg.links,'links');
 for(const l of byLink.values()){
  assert(byNode.has(l.from)&&byNode.has(l.to)&&l.from!==l.to,'edge endpoints invalid');
  assert(modes.has(l.mode)&&evidence.has(l.evidence_status)&&validEvidenceList(l.source_ids,bySource),'edge type or sources absent');
  assert(typeof l.relationship==='string'&&typeof l.note==='string'&&l.note.length>12,'edge scientific qualification missing');
  if(l.mode==='spatial'){
   const from=byNode.get(l.from),to=byNode.get(l.to),t=l.registration;
   assert(l.evidence_status==='documented'&&t?.status==='independently_validated'&&validEvidenceList(t.source_ids,bySource),'spatial transform unvalidated');
   assert(from.specimen_id!==null&&from.specimen_id===to.specimen_id,'spatial edge crosses distinct or unknown specimens');
   assert(t.from_frame===from.frame_id&&t.to_frame===to.frame_id&&Array.isArray(t.matrix4x4)&&t.matrix4x4.length===16&&t.matrix4x4.every(Number.isFinite),'spatial frame mapping invalid');
   assert(typeof t.method==='string'&&t.method.length>8&&Number.isFinite(t.error_bound)&&t.error_bound>=0&&units.has(t.error_unit)&&t.error_unit!=='none'&&t.error_unit!=='unitless','spatial transform lacks quantified error');
  }else{
   assert(l.registration===null,'non-spatial link includes fabricated registration');
   if(l.mode==='structural')assert(l.relationship==='contains'&&l.evidence_status==='documented','unsupported structural connection');
   if(l.mode==='documentary')assert(l.relationship!=='contains','anatomical containment downgraded ambiguously');
  }
 }
 assert(reg.entry_id&&byNode.has(reg.entry_id)&&reg.goal_id&&byNode.has(reg.goal_id),'entry or goal missing');
 return Object.freeze({registry:reg,nodes:byNode,links:byLink,frames:byFrame,sources:bySource});
}
export function planPCBM(model,start,goal){
 assert(model?.nodes instanceof Map&&model?.links instanceof Map,'validated registry required');
 assert(model.nodes.has(start)&&model.nodes.has(goal),'unknown route endpoints');
 if(start===goal)return {ids:[start],links:[]};
 const queue=[start],previous=new Map([[start,null]]);
 while(queue.length){
  const current=queue.shift();
  for(const link of model.links.values()){
   if(link.from!==current||previous.has(link.to))continue;
   previous.set(link.to,{parent:current,link});
   if(link.to===goal){
    const ids=[goal],links=[];let k=goal;
    while(k!==start){const step=previous.get(k);links.unshift(step.link);ids.unshift(step.parent);k=step.parent}
    return {ids,links};
   }
   queue.push(link.to);
  }
 }
 return null;
}
export function classifyPCBM(model,link){
 const l=typeof link==='string'?model.links.get(link):link;
 assert(l&&model.links.get(l.id)===l,'unknown transition');
 const from=model.nodes.get(l.from),to=model.nodes.get(l.to);
 return Object.freeze({
  from:from.id,to:to.id,mode:l.mode,relationship:l.relationship,
  spatially_continuous:l.mode==='spatial',
  preserves_specimen:l.mode==='spatial'&&from.specimen_id===to.specimen_id,
  elapsed_biological_seconds:null,anatomical_registration:l.mode==='spatial'?l.registration:null,
  evidence_status:l.evidence_status,source_ids:[...l.source_ids],
  scientific_note:l.note,
  available_viewer:to.availability==='viewer'
 });
}
export function createPCBMNavigator(model,initial=model.registry.entry_id){
 assert(model.nodes.has(initial),'unknown initial representation');
 const past=[initial];let cursor=0;
 return {
  current:()=>past[cursor],
  visit(id){
   assert(model.nodes.has(id),'unknown representation');
   if(id===past[cursor])return this.snapshot();
   past.splice(cursor+1);
   past.push(id);if(past.length>64)past.shift();
   cursor=past.length-1;
   return this.snapshot();
  },
  back(){if(cursor>0)cursor--;return this.snapshot()},
  forward(){if(cursor<past.length-1)cursor++;return this.snapshot()},
  snapshot:()=>Object.freeze({current:past[cursor],history:[...past],cursor,can_back:cursor>0,can_forward:cursor<past.length-1})
 };
}
export function PCBMReceipt(model,route){
 assert(route?.ids?.length>0,'missing route');
 return {
  schema:'poly.pcbm.navigation-receipt.v1',engine:'documentation_only',
  spatial_transformations_applied:0,biological_time_inferred:false,
  steps:route.ids.map((id,index)=>{
   const n=model.nodes.get(id);
   assert(n,'unknown receipt node');
   return {representation_id:id,label:n.label,frame_id:n.frame_id,scale_order_exponent_m:n.order_exponent_m,scale_basis:n.scale_basis,
    specimen_id:n.specimen_id,data_availability:n.availability,source_ids:[...n.source_ids],
    incoming:index?classifyPCBM(model,route.links[index-1]):null};
  })
 };
}
