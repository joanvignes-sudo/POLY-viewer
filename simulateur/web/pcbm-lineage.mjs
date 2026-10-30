// PCBM: provenance DAG, with strict distinction between derived assets and independent evidence.
export const LINEAGE_SCHEMA='poly.pcbm.lineage.v1';
const fail=(ok,m)=>{if(!ok)throw Error('PCBM lineage: '+m)};
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{2,90}$/.test(x);
const allowedRoles=new Set(['primary_dataset','multi_specimen_container','derived_record','population_study']);
const statuses=new Set(['remote_metadata_verified','catalog_lineage_only','published_summary_only']);
const allowedSources=new Map([
 ['f002-primary',['10.26275/imas-52lf','https://discover.pennsieve.io/datasets/674']],
 ['ssv-collection',['10.26275/tjzi-muqm','https://discover.pennsieve.io/datasets/426']],
 ['f002-scaffold-reference',[null,'https://docs.sparc.science/docs/subject-specific-vagus-ssv-scaffolds']],
 ['bahadir-population',['10.1016/j.brs.2026.103182','https://pubmed.ncbi.nlm.nih.gov/42595102/']],
 ['thompson-microct',['10.3389/fnins.2026.1731234','https://pubmed.ncbi.nlm.nih.gov/41788551/']]
]);
export function validatePCBMLineage(raw){
 fail(raw?.schema===LINEAGE_SCHEMA&&raw.experimental===true&&raw.published===false&&raw.data_assets_mounted===false&&raw.independent_subject_claims===false,'lineage scope incompatible');
 fail(Array.isArray(raw.resources)&&raw.resources.length===5,'research resource index incomplete');
 const resources=new Map();
 for(const r of raw.resources){
  fail(r&&id(r.id)&&!resources.has(r.id)&&allowedSources.has(r.id),'duplicate, unknown or missing lineage resource');
  const [doi,url]=allowedSources.get(r.id);
  fail(r.doi===doi&&r.url===url,'unverified DOI or URL');
  fail(allowedRoles.has(r.role)&&statuses.has(r.status)&&typeof r.notes==='string'&&r.notes.length>15,'resource role or provenance status absent');
  fail(r.sample_id===null||r.sample_id==='f002','invalid sample identifier');
  if(r.role==='multi_specimen_container'||r.role==='population_study')fail(r.sample_id===null&&r.side===null,'population falsely identified as one specimen');
  else fail(r.sample_id==='f002'&&['unspecified','unresolved'].includes(r.side),'unsupported side-specific identity');
  resources.set(r.id,r);
 }
 fail(resources.get('f002-primary')?.role==='primary_dataset'&&
  resources.get('f002-scaffold-reference')?.role==='derived_record'&&
  resources.get('ssv-collection')?.role==='multi_specimen_container','raw and derived roles confused');
 fail(Array.isArray(raw.links)&&raw.links.length===2,'lineage links absent');
 const seen=new Set(),parent=new Map();
 for(const l of raw.links){
  fail(resources.has(l.from)&&resources.has(l.to)&&l.from!==l.to,'unknown lineage endpoint');
  const key=l.from+'|'+l.relationship+'|'+l.to;fail(!seen.has(key),'duplicated lineage link');seen.add(key);
  fail(l.qualification==='catalog_documented'&&l.files_verified===false,'unverified files presented as measured');
  if(l.relationship==='derived_from'){
   fail(l.from==='f002-scaffold-reference'&&l.to==='f002-primary','wrong primary lineage');
   fail(!parent.has(l.from),'multiple conflicting original datasets');parent.set(l.from,l.to);
  }else if(l.relationship==='distributed_in'){
   fail(l.from==='f002-scaffold-reference'&&l.to==='ssv-collection','wrong dataset container');
  }else fail(false,'unsupported lineage relationship');
 }
 fail(parent.get('f002-scaffold-reference')==='f002-primary'&&seen.has('f002-scaffold-reference|distributed_in|ssv-collection'),'derivative source lineage incomplete');
 // Generic ancestry guards future additions, not only the known f002 pair.
 for(const key of resources.keys()){let current=key;const visited=new Set();while(parent.has(current)){fail(!visited.has(current),'lineage cycle');visited.add(current);current=parent.get(current);fail(resources.has(current),'missing parent')}}
 fail(Array.isArray(raw.possible_cohort_overlap)&&raw.possible_cohort_overlap.length===3,'cross-cohort uncertainty omitted');
 const expectedPairs=new Set(['f002-primary|bahadir-population','f002-primary|thompson-microct','bahadir-population|thompson-microct']);
 for(const c of raw.possible_cohort_overlap){
  const key=c.a+'|'+c.b;
  fail(expectedPairs.delete(key)&&c.status==='unknown'&&typeof c.reason==='string'&&c.reason.length>15,'unwarranted cohort independence claim');
 }
 fail(expectedPairs.size===0,'missing cohort overlap declaration');
 return Object.freeze({resources,parent,independent_primary_count_for_f002:1,
  primary_dataset_doi:'10.26275/imas-52lf',derived_collection_doi:'10.26275/tjzi-muqm',
  assets_mounted:false,individual_mapping_verified:false});
}
export function lineageComparison(model,a,b){
 fail(model?.resources instanceof Map&&model.resources.has(a)&&model.resources.has(b),'unknown comparison resources');
 const root=k=>{let x=k;while(model.parent.has(x))x=model.parent.get(x);return x};
 const left=model.resources.get(a),right=model.resources.get(b);
 const singleSpecimen=left.sample_id==='f002'&&right.sample_id==='f002';
 const sameOrigin=singleSpecimen&&root(a)===root(b);
 return Object.freeze({
  left_id:a,right_id:b,same_provenance_root:sameOrigin,
  independent_evidence:sameOrigin?false:null,
  // Matching resource IDs or specimen tags do not identify an individual axon, side, or human donor.
  subject_identity_resolved:false,
  same_declared_sample_tag:singleSpecimen,
  spatial_registration_allowed:false,
  conclusion:sameOrigin?'Données f002 reliées par dérivation : une seule origine expérimentale, pas deux confirmations indépendantes.':
   'Collection ou études comparées : nombre de spécimens et chevauchement de donneurs non déterminés par cette comparaison.'
 });
}
export async function readPCBMLineage({fetcher=fetch,signal}={}){
 const response=await fetcher(new URL('./pcbm-lineage.json',import.meta.url),{cache:'no-store',signal});
 fail(response?.ok,'dataset lineage manifest unavailable');
 const bytes=await response.arrayBuffer();
 fail(bytes.byteLength>100&&bytes.byteLength<=30000,'dataset lineage manifest too large');
 signal?.throwIfAborted?.();
 return validatePCBMLineage(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)));
}
