// Published cohort statistics, not nerve-specific coordinates or anatomical transforms.
// This module NEVER estimates a specimen trajectory from a group median.
export const HUMAN_VAGUS_SCHEMA='poly.pcbm.human-vagus-evidence.v1';
const check=(v,msg)=>{if(!v)throw Error('PCBM human vagus: '+msg)};
const idOk=x=>typeof x==='string'&&/^[a-z0-9-]{3,90}$/.test(x);
const verifiedSources=new Set(['sparc-ssv-methods','vagus-microct-literature','human-vagus-branch-map']);
const requiredFields=new Map([
 ['ssv-coordinates','reconstructed_geometry'],
 ['ssv-straight','straightened_geometry'],
 ['ssv-vagus','normalized_material']
]);
const groupIds=['sympathetic','muscular','vascular','cardiac','pulmonary','esophageal'];
const publishedIQR=[[3.0,3.9,6.6],[3.4,6.2,17.0],[5.5,9.6,15.1],[16.9,20.1,22.5],[22.8,25.0,27.6],[24.3,26.5,29.1]];
const verifiedURLs=new Map([['sparc-ssv-methods','https://docs.sparc.science/docs/subject-specific-vagus-ssv-scaffolds'],['vagus-microct-literature','https://pubmed.ncbi.nlm.nih.gov/41788551/'],['human-vagus-branch-map','https://pubmed.ncbi.nlm.nih.gov/42595102/']]);
const expectedDOIs=new Map([['vagus-microct-literature','10.3389/fnins.2026.1731234'],['human-vagus-branch-map','10.1016/j.brs.2026.103182']]);
function uniques(list,what){
 check(Array.isArray(list)&&list.length>0&&list.length<=20,what+' invalid collection');
 const ids=new Map();
 for(const e of list){check(e&&idOk(e.id)&&!ids.has(e.id),what+' duplicate or malformed identity');ids.set(e.id,e)}
 return ids;
}
export function validateVagusEvidence(data,{registry=null}={}){
 check(data?.schema===HUMAN_VAGUS_SCHEMA&&data.experimental===true&&data.published===false&&data.anatomical_registration===null,'scope incorrectly claims a published or registered atlas');
 check(typeof data.scope==='string'&&data.scope.length>30,'study scope absent');
 const frames=uniques(data.coordinate_fields,'coordinate field');
 check(frames.size===3&&[...requiredFields].every(([id,kind])=>frames.get(id)?.coordinate_kind===kind),'incomplete SSV coordinate systems');
 for(const f of frames.values()){
  check(typeof f.name==='string'&&typeof f.notes==='string'&&f.notes.length>15,'coordinate field description absent');
  if(f.id==='ssv-vagus')check(f.units==='unitless'&&JSON.stringify(f.range)==='[0,1]','SSV material coordinates confused with length');
  else check(f.units==='dataset_defined'&&f.range===undefined,'unverified metric coordinate unit');
 }
 const sources=uniques(data.sources,'study source');
 check(sources.size===3&&[...verifiedSources].every(id=>sources.has(id)),'independent literature catalog incomplete');
 for(const s of sources.values()){
  check(verifiedSources.has(s.id)&&idOk(s.study_id)&&idOk(s.cohort_id)&&s.geometries_mounted===false,'source or data-mount status invalid');
  check(s.url===verifiedURLs.get(s.id),'source URL not a verified primary reference');
  check(s.n_nerves===undefined||Number.isInteger(s.n_nerves)&&s.n_nerves>0,'invalid nerve sample count');
  if(expectedDOIs.has(s.id))check(s.doi===expectedDOIs.get(s.id),'DOI mismatch');
  if(s.id==='human-vagus-branch-map')check(s.n_donors===29&&s.n_nerves===58&&s.left_nerves===29&&s.right_nerves===29,'dissection cohort identity changed');
  if(s.id==='vagus-microct-literature')check(s.n_nerves===10&&s.n_traced_microct===5&&s.left_nerves===5&&s.right_nerves===5,'microCT cohort identity changed');
  if(s.id==='sparc-ssv-methods')check(s.measured_branched_distances===false&&s.data_scope==='method_description_not_f002_coordinates','SPARC methods misread as patient measurements');
  if(registry){const ref=registry.sources?.get(s.id);check(ref&&ref.url===s.url,'PCBM registry lacks matching primary source '+s.id)}
 }
 const b=data.branch_summary;
 check(b?.study_id==='bahadir-2026'&&b.source_id==='human-vagus-branch-map'&&b.measurement==='Distance from jugular foramen to vagus branch emergence'&&b.unit==='cm'&&b.statistic==='median_and_interquartile_range'&&b.sampling_unit==='nerve','branch statistics operator missing');
 check(b.cohorts_independent_between_rows===false&&b.individual_subject_measurements_available===false,'cohort observations falsely upgraded to independent specimens');
 check(Array.isArray(b.categories)&&b.categories.length===6&&b.categories.every((c,i)=>c.id===groupIds[i]),'vagus branch groups missing');
 for(const [index,c] of b.categories.entries()){
  check(typeof c.label==='string'&&c.label.length>3&&[c.q1,c.median,c.q3].every(Number.isFinite),'branch group statistics missing');
  check(c.q1>=0&&c.q1<=c.median&&c.median<=c.q3&&c.q3<=50,'invalid order of IQR and median');
  check([c.q1,c.median,c.q3].every((value,i)=>Math.abs(value-publishedIQR[index][i])<1e-9),'published primary statistics modified without review');
 }
 const links=uniques(data.scale_links.map((e,i)=>({id:'link-'+i,...e})),'cross-study link');
 check(links.size===3,'missing cross-study boundaries');
 const studyIds=new Set([...sources.values()].map(s=>s.study_id));
 for(const l of links.values()){
  check(studyIds.has(l.from)&&studyIds.has(l.to)&&l.from!==l.to,'cross-study identity invalid');
  check(['cross_cohort_documentary','cross_study_documentary'].includes(l.kind)&&l.same_specimen_confirmed===false&&l.metric_transform===null&&l.cohort_overlap==='unknown','cross-study geometry invented');
 }
 return Object.freeze({source_count:sources.size,coordinate_field_count:frames.size,
  branch_group_count:b.categories.length,branch_medians_cm:b.categories.map(c=>c.median),
  studies:[...sources.values()],branches:b.categories.map(c=>Object.freeze({...c})),
  spatial_registration_verified:false,individual_routes_inferred:false,
  source_data:data});
}
export function compareVagusStudyToPCBM(model,validated,studyId,representationId){
 check(model?.nodes instanceof Map&&validated?.spatial_registration_verified===false,'validated references required');
 const source=validated.studies.find(s=>s.study_id===studyId),node=model.nodes.get(representationId);
 check(source&&node,'unknown study or PCBM representation');
 return Object.freeze({study_id:source.study_id,representation_id:node.id,
  mode:'documentary_reference_only',spatial_overlay_allowed:false,individual_measurement_transferred:false,
  cohort_overlap_status:'not_established',anatomical_registration:null,
  note:'Population summaries and sample-specific scaffolds have no validated common specimen-to-specimen transform.'});
}
export async function readVagusEvidence({fetcher=fetch,signal,registry=null}={}){
 const response=await fetcher(new URL('./pcbm-vagus-evidence.json',import.meta.url),{signal,cache:'no-store'});
 check(response?.ok,'human vagus comparison absent');
 const bytes=await response.arrayBuffer();
 check(bytes.byteLength>100&&bytes.byteLength<=32000,'human vagus comparison unexpected byte size');
 signal?.throwIfAborted?.();
 return validateVagusEvidence(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)),{registry});
}
