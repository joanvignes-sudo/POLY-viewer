const kinds=new Set(['matter','reaction','energy','signal','regulation','environment','observation']);
const statuses=new Set(['documented','hypothesis','unknown']);
const compartments=new Set(['vascular','astrocyte','extracellular','neuron','observation','outcome']);
function requireValue(ok,message){if(!ok)throw Error(message);}
function ids(items,label){const out=new Map();for(const x of items){requireValue(x&&typeof x.id==='string'&&!out.has(x.id),label+' : identifiant dupliqué');out.set(x.id,x);}return out;}
export function validateGraph(g,original){
 requireValue(g?.schema==='poly.metabolic-network.v1'&&g.layout?.kind==='hypothetical_documentary'&&g.layout.units==='abstract'&&g.layout.anatomical_registration===null&&g.quantitative_propagation===false&&g.biological_clock===null,'Repère ou portée incompatible');
 requireValue(g.case_digest_format==='lf-utf8'&&/^[a-f0-9]{64}$/.test(g.case_sha256),'Empreinte source absente');
 for(const size of [g.layout.width,g.layout.height])requireValue(Number.isFinite(size)&&size>0&&size<5000,'Dimensions invalides');
 requireValue(g.kernel_sources?.length===2&&g.kernel_sources.every((r,i)=>r.path===['reversible-lactate-core.mjs','reversible-lactate-contract.mjs'][i]&&/^[a-f0-9]{64}$/.test(r.sha256)),'Noyau sans provenance');
 const nodes=ids(g.nodes,'Maillons'),edges=ids(g.edges,'Relations'),routes=ids(g.routes,'Parcours');
 for(const n of nodes.values()){
  requireValue(compartments.has(n.compartment)&&typeof n.title==='string'&&typeof n.detail==='string'&&n.position?.length===2&&n.position.every(Number.isFinite),'Maillon invalide');
  requireValue(n.position[0]>=0&&n.position[0]<=g.layout.width&&n.position[1]>=0&&n.position[1]<=g.layout.height,'Maillon hors repère');
  requireValue(n.source_ids?.length&&n.source_ids.every(id=>g.sources[id]),'Source du maillon absente');
 }
 requireValue(original?.schema==='poly.case-catalog.v1','Catalogue historique incompatible');
 for(const n of original.nodes){const v=nodes.get(n.id);requireValue(v?.origin==='case-pellerin'&&v.title===n.title&&v.detail===n.description&&v.compartment===n.zone,'Identité historique modifiée : '+n.id);}
 for(const e of edges.values())requireValue(nodes.has(e.from)&&nodes.has(e.to)&&kinds.has(e.kind)&&statuses.has(e.status)&&typeof e.context==='string'&&e.source_ids?.length&&e.source_ids.every(id=>g.sources[id])&&typeof e.reversible==='boolean','Relation invalide : '+e.id);
 for(const r of routes.values())requireValue(r.edges?.length&&r.edges.every(id=>edges.has(id)),'Parcours invalide');
 for(const r of original.chains)requireValue(JSON.stringify(routes.get(r.id)?.legacy_nodes)===JSON.stringify(r.nodes),'Parcours historique perdu : '+r.id);
 return g;
}
export function validateObservations(o,g){
 requireValue(o?.schema==='poly.metabolic-observations.v1'&&o.published===false&&o.cross_preparation_propagation===false,'Observations incompatibles');
 const edges=new Map(g.edges.map(e=>[e.id,e]));ids(o.series,'Séries');
 for(const s of o.series){
  const e=edges.get(s.edge_id);requireValue(e?.kind==='observation'&&e.context===s.context&&e.source_ids.includes(s.source_id),'Observation rattachée au mauvais contexte');
  requireValue(typeof s.unit==='string'&&['source_minutes','conditions'].includes(s.x_kind)&&['readout','signed_net_blood_region'].includes(s.direction)&&s.provenance?.derived_sha256?.match(/^[a-f0-9]{64}$/),'Contrat de série absent');
  requireValue(s.samples?.length>0&&s.samples.length<1000,'Série vide ou excessive');
  if(s.direction==='signed_net_blood_region')requireValue(s.context==='human_blood_region'&&s.unit==='mmol/min (indice net)','Sens net attribué à une mauvaise mesure');
  let before=-Infinity;
  for(const v of s.samples){
   requireValue(Number.isFinite(v.x)&&v.x>before&&typeof v.label==='string','Ordre source invalide');before=v.x;
   requireValue(v.value===null||Number.isFinite(v.value),'Valeur invalide');
   for(const key of ['SE','n','min','max','n_numeric','n_expected'])if(v[key]!==undefined&&v[key]!==null)requireValue(Number.isFinite(v[key]),'Métadonnée numérique invalide');
   if(v.SE!==undefined)requireValue(v.SE>=0,'SE invalide');
   if(v.n_numeric!==undefined)requireValue(v.n_numeric<=v.n_expected&&!(v.n_numeric<v.n_expected&&v.value!==null),'Moyenne incomplète non admise');
   if(v.environment)for(const x of Object.values(v.environment))requireValue(Number.isFinite(x),'Environnement invalide');
  }
 }
 return o;
}
export function visualEncoding(series,index){
 requireValue(Number.isInteger(index)&&index>=0&&index<series.samples.length,'Point source invalide');
 const sample=series.samples[index],valid=series.samples.map(x=>x.value).filter(Number.isFinite);
 if(sample.value===null)return {missing:true,radius:8,width:1.5,level:'unknown',direction:0,shape:'hollow',bend:0,value:null};
 const lo=Math.min(...valid),hi=Math.max(...valid),ratio=hi===lo ? .5 : (sample.value-lo)/(hi-lo);
 const direction=series.direction==='signed_net_blood_region'?Math.sign(sample.value):1;
 const ph=sample.environment?.pH;const values=series.samples.map(s=>s.environment?.pH).filter(Number.isFinite);const min=Math.min(...values),max=Math.max(...values);
 return {missing:false,radius:6+ratio*8,width:1.5+ratio*2.5,level:ratio>.66?'upper':ratio<.33?'lower':'middle',direction,shape:series.direction==='readout'?'ellipse':'circle',bend:ph===undefined?0:max===min?0:(ph-min)/(max-min)*70-35,value:sample.value};
}
export function boundaryReason(previous,next){
 if(next.status!=='documented')return next.status==='hypothesis'?'Hypothèse : aucun transfert animé franchi.':'Relation non qualifiée : arrêt de la lecture.';
 if(previous&&previous.to!==next.from)return 'Nouveau départ : les deux observations ne forment pas un trajet continu.';
 if(previous&&previous.context!==next.context)return 'Changement de préparation : poursuivre seulement comme lecture documentaire.';
 return null;
}
export function outgoing(g,nodeId){return g.edges.filter(e=>e.from===nodeId||e.reversible&&e.to===nodeId);}
export function canAnimate(edge,encoding){return edge.status==='documented'&&(!encoding||!encoding.missing&&encoding.direction!==0);}
export async function digestHex(bytes){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export async function loadLocalObservations(g,{signal,fetcher=fetch}={}){
 const root='../data/metabolic-observations-preview/';const meta=await fetcher(root+'MANIFEST.json',{signal,cache:'no-store'});if(!meta.ok)throw Error('Données locales non montées ('+meta.status+').');
 const m=await meta.json();requireValue(m.schema==='poly.metabolic-preview.v1'&&m.published===false&&m.resource==='OBSERVATIONS.json'&&Number.isInteger(m.bytes)&&m.bytes>0&&m.bytes<=2_000_000&&/^[a-f0-9]{64}$/.test(m.sha256),'Manifeste local incompatible');
 const response=await fetcher(root+m.resource,{signal,cache:'no-store'});if(!response.ok)throw Error('Observations indisponibles.');
 const length=response.headers?.get('Content-Length');if(length!==null&&length!==undefined)requireValue(Number(length)===m.bytes,'Longueur des observations différente');
 const bytes=await response.arrayBuffer();if(signal?.aborted)throw new DOMException('Lecture annulée','AbortError');requireValue(bytes.byteLength===m.bytes,'Taille des observations modifiée');
 requireValue(await digestHex(bytes)===m.sha256,'Empreinte des observations différente');if(signal?.aborted)throw new DOMException('Lecture annulée','AbortError');
 const o=JSON.parse(new TextDecoder().decode(bytes));requireValue(o.graph_digest_format==='json-stringify-utf8'&&o.graph_sha256===await digestHex(new TextEncoder().encode(JSON.stringify(g))),'Graphe et observations de versions différentes');if(signal?.aborted)throw new DOMException('Lecture annulée','AbortError');
 return validateObservations(o,g);
}

export function catalogueDigest(bytes){return digestHex(new TextEncoder().encode(new TextDecoder().decode(bytes).replace(/\r\n/g,'\n')));}
