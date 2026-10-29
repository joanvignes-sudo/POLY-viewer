import {create} from './documentary-engine.js';
export function snapshotChain(group,index,progress=0,edge=null){
 if(!group||typeof group.id!=='string'||!Array.isArray(group.nodes)||!Number.isInteger(index)||!group.nodes[index]||!Number.isFinite(progress)||progress<0||progress>1)throw Error('Contexte documentaire invalide');
 const n=group.nodes[index];return {schema:'poly.documentary-view-bridge.v1',identity:`documentary:${group.id}:${n.id??index}`,group_id:group.id,node_id:n.id??String(index),index,title:n.title,region:n.kind==='gap'?null:n.region??null,kind:n.kind??'documentary',edge_id:edge,reading_progress:progress,time_kind:'graphical reading fraction, not physiological seconds',source_ids:[...(n.sources??[])],coordinate_system:'POLY display scene units; not millimetres',localization_kind:'regional documentary anchor, not measured individual coordinates',microscopic_observations:false,anatomical_registration:false};
}
export function sameContext(a,b){return ['identity','edge_id','reading_progress','time_kind'].every(k=>a[k]===b[k]);}

export function validateDocumentaryContext(s,groups){
 const g=groups.find(g=>g.id===s?.group_id),n=g?.nodes[s?.index];if(!n||!Number.isInteger(s.index)||s.index<0||g.id==='WALK'||s.node_id!==(n.id??String(s.index))||s.identity!==`documentary:${g.id}:${n.id??s.index}`||!Number.isFinite(s.reading_progress)||s.reading_progress<0||s.reading_progress>1||s.time_kind!=='graphical reading fraction, not physiological seconds'||s.microscopic_observations!==false||s.anatomical_registration!==false)throw Error('Contexte incohérent');
 if(s.edge_id!==null&&!g.edges?.some(e=>e.id===s.edge_id&&e.fromId===n.id))throw Error('Relation incohérente');
 if(s.edge_id===null&&s.reading_progress!==0)throw Error('Progression sans relation');
 const canonical=snapshotChain(g,s.index,s.reading_progress,s.edge_id);
 for(const key of Object.keys(canonical))if(JSON.stringify(s[key])!==JSON.stringify(canonical[key]))throw Error('Contexte source modifié : '+key);
 if(s.edge_id!==null&&s.reading_progress>0){const model=create(g);model.select(n.id);if(model.assess(g.edges.find(e=>e.id===s.edge_id))!=='VISIBLE')throw Error('Progression au-delà d’une frontière documentaire');}
 if(JSON.stringify(s.source_ids)!==JSON.stringify(n.sources??[]))throw Error('Sources incohérentes');
 return s;
}
