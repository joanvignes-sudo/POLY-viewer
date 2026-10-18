(function(scope){'use strict';
function validate(data){const errors=[],warnings=[];const issue=(list,path,message)=>list.push({path,message});
 if(!data||typeof data!=='object'||Array.isArray(data))return {ok:false,errors:[{path:'root',message:'Objet de registre attendu.'}],warnings};
 if(!data.chains||typeof data.chains!=='object'||Array.isArray(data.chains))issue(errors,'chains','Dictionnaire de chaînes attendu.');
 if(!Array.isArray(data.paths))issue(errors,'paths','Liste de parcours attendue.');
 const entryIds=new Set();
 function check(id,nodes,edges,values,evidence,path){if(typeof id!=='string'||!id)issue(errors,path,'Identifiant obligatoire.');else if(entryIds.has(id))issue(errors,path,'Identifiant de dossier dupliqué.');else entryIds.add(id);
  if(!Array.isArray(nodes)||!nodes.length){issue(errors,path+'.nodes','Au moins un élément est nécessaire.');return;}
  const ids=new Set();nodes.forEach((n,i)=>{const p=path+'.nodes['+i+']';if(!n||typeof n!=='object'){issue(errors,p,'Élément invalide.');return;}if(typeof n.id!=='string'||!n.id)issue(errors,p+'.id','Identifiant obligatoire.');else if(ids.has(n.id))issue(errors,p+'.id','Identifiant de maillon dupliqué.');else ids.add(n.id);if(typeof(n.title||n.label)!=='string'||!(n.title||n.label).trim())issue(errors,p,'Libellé manquant.');});
  if(!Array.isArray(edges)){issue(errors,path+'.edges','Liste de relations attendue.');return;}const edgeIds=new Set();edges.forEach((e,i)=>{const p=path+'.edges['+i+']';if(!e||typeof e!=='object'){issue(errors,p,'Relation invalide.');return;}if(!e.id||edgeIds.has(e.id))issue(errors,p+'.id','Identifiant de relation absent ou dupliqué.');edgeIds.add(e.id);if(!ids.has(e.from)||!ids.has(e.to))issue(errors,p,'Relation vers un maillon absent.');if(!e.status)issue(warnings,p,'Statut documentaire à préciser.');});
  if(!Array.isArray(values))issue(errors,path+'.values','Liste d’observations attendue.');
  const valueIds=new Set();(Array.isArray(values)?values:[]).forEach((v,i)=>{const p=path+'.values['+i+']';if(!v||typeof v!=='object'){issue(errors,p,'Observation invalide.');return;}if(!v.value_id||valueIds.has(v.value_id))issue(errors,p,'Identifiant d’observation absent ou dupliqué.');valueIds.add(v.value_id);if(!Array.isArray(v.applies_to))issue(errors,p,'Portée explicite requise.');else v.applies_to.forEach(n=>{if(!ids.has(n))issue(errors,p,'Observation attribuée à un maillon absent.');});if(v.display_value&&v.display_value!=='ND'){if(!v.quantity_type)issue(errors,p,'Nature de quantité manquante.');if(!v.clock_scope)issue(warnings,p,'Horloge à préciser ; aucun délai déduit.');if(!(v.evidence_ids||[]).length)issue(warnings,p,'Source de la mesure à préciser.');}});
  if(!Array.isArray(evidence))issue(errors,path+'.evidence','Liste de sources attendue.');
  (Array.isArray(evidence)?evidence:[]).forEach((e,i)=>{if(!e||typeof e!=='object'){issue(errors,path+'.evidence['+i+']','Source invalide.');return;}if(e.url){if(/^atlas\/[A-Za-z0-9_./-]+(?:#[A-Za-z0-9_-]+)?$/.test(e.url)&&!e.url.includes('..'))return;try{if(!['https:','http:'].includes(new URL(e.url).protocol))issue(errors,path+'.evidence['+i+']','Protocole d’adresse interdit.');}catch{issue(errors,path+'.evidence['+i+']','Adresse primaire invalide.');}}});
 }
 Object.entries(data.chains||{}).forEach(([id,c])=>{if(!c||typeof c!=='object'){issue(errors,'chains.'+id,'Chaîne invalide.');return;}if(!c.metadata||typeof c.metadata.title!=='string'||!c.metadata.title.trim())issue(errors,'chains.'+id+'.metadata','Titre de chaîne obligatoire.');check(id,c.nodes,c.edges,c.values,c.evidence,'chains.'+id);});
 (Array.isArray(data.paths)?data.paths:[]).forEach((p,i)=>{if(!p||typeof p!=='object'){issue(errors,'paths['+i+']','Parcours invalide.');return;}check(p.id,p.steps,p.links,[],p.sources,'paths['+i+']');if(!p.species)issue(warnings,'paths['+i+']','Espèce non précisée.');});
 if(!Array.isArray(data.timings))issue(errors,'timings','Liste de repères temporels attendue.');else{const ids=new Set();data.timings.forEach((t,i)=>{const p='timings['+i+']';if(!t||typeof t!=='object'){issue(errors,p,'Repère invalide.');return;}if(!t.id||ids.has(t.id))issue(errors,p,'Identifiant temporel absent ou dupliqué.');ids.add(t.id);if(typeof t.value==='number'&&!Number.isFinite(t.value))issue(errors,p,'Valeur temporelle non finie.');if(typeof t.unit!=='string'||!t.unit.trim()||!t.kind||!t.start||!t.end)issue(errors,p,'Unité, nature, départ et arrivée requis.');});}

 for(const [id,c] of Object.entries(data.chains||{})){
  const ev=new Set(),refs=new Set(),targets=new Set([...(c.nodes||[]).map(n=>n.id),...(c.values||[]).map(v=>v.value_id)]);
  for(const e of c.evidence||[]){if(ev.has(e.evidence_id))issue(errors,id,'Identifiant de preuve dupliqué.');ev.add(e.evidence_id);refs.add(e.evidence_id);if(e.source_id)refs.add(e.source_id);}
  for(const v of c.values||[])for(const eid of v.evidence_ids||[])if(!refs.has(eid))issue(errors,id+'.'+v.value_id,'Référence de preuve absente : '+eid);
  for(const n of c.nodes||[])for(const ref of n.sources||[])if(!refs.has(ref))issue(errors,id+'.'+n.id,'Référence de maillon absente : '+ref);
  for(const e of c.evidence||[])for(const target of [...(e.supports||[]),...(e.related_nodes||[])])if(!targets.has(target))issue(errors,id+'.'+e.evidence_id,'Cible de source absente : '+target);
 }
 const recordIds=new Set([...(data.review_records||[]),...(data.primary_records||[])].map(r=>r.id));
 for(const p of data.paths||[])for(const rid of p.evidence_records||[])if(!recordIds.has(rid))issue(errors,p.id,'Extraction absente : '+rid);
 return {ok:errors.length===0,errors,warnings};
}
function boundedIndex(value,length){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(length-1,Math.trunc(n))):0;}
function validateNotes(input,lookup){const errors=[];if(!input||input.format!=='POLY-annotations'||!Array.isArray(input.notes))return {ok:false,errors:['Format d’annotations POLY attendu.'],notes:[]};if(input.notes.length>10000)return {ok:false,errors:['Plus de 10 000 annotations.'],notes:[]};const notes=[];
 input.notes.forEach((n,i)=>{const e=n&&lookup(n.entry),target=e&&(e.nodes.some(x=>x.id===n.target)||e.edges.some(x=>x.id===n.target));if(!e||!target||!e.nodes.some(x=>x.id===n.node)||typeof n.id!=='string'||!n.id||typeof n.text!=='string'||!n.text.trim()||n.text.length>8000||typeof n.date!=='string'||!Number.isFinite(Date.parse(n.date))){errors.push('Annotation '+(i+1)+' : cible, contenu ou date invalide.');return;}notes.push({id:n.id,version:'0.94',entry:n.entry,node:n.node,target:n.target,date:n.date,text:n.text,url:typeof n.url==='string'?n.url:''});});return {ok:errors.length===0,errors,notes};
}
const api={validate,boundedIndex,validateNotes};if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.PolyIntegrity=api;
})(typeof globalThis!=='undefined'?globalThis:this);
