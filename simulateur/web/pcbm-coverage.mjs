// PCBM — read-only research BACKLOG from the canonical POLY multiscale inventory.
// Each topic remains a research candidate, never a validated phenomenon or model.
export const INVENTORY_SCHEMA='poly.multiscale-inventory/1';
const req=(v,msg)=>{if(!v)throw Error('PCBM coverage: '+msg)};
const norm=s=>String(s??'').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll('œ','oe');
export function validatePCBMCoverage(raw){
 req(raw?.schema===INVENTORY_SCHEMA&&raw.exhaustive===false,'not a bounded incomplete inventory');
 req(Array.isArray(raw.families)&&raw.families.length>0&&raw.families.length<=50,'families invalid');
 const families=new Set();
 for(const f of raw.families){req(typeof f==='string'&&f.length>3&&!families.has(f),'duplicate or invalid family');families.add(f)}
 req(Array.isArray(raw.entries)&&raw.entries.length>0&&raw.entries.length<=1000,'inventory size invalid');
 const ids=new Set();
 for(const e of raw.entries){
  req(e&&typeof e.id==='string'&&/^INV-\d\d-\d\d$/.test(e.id)&&!ids.has(e.id),'invalid or repeated topic');ids.add(e.id);
  req(families.has(e.family)&&typeof e.topic==='string'&&e.topic.length>3,'topic or family invalid');
  req(e.status==='candidate_to_document'&&e.runtime_model===false,'topic promoted without new review');
  req(Array.isArray(e.evidence_ids)&&e.evidence_ids.length===0,'unreviewed scientific evidence');
  req(e.parameters===null&&e.anatomical_registration===null,'unreviewed parameters or registration');
  req(Array.isArray(e.missing)&&e.missing.length>0&&e.missing.every(s=>typeof s==='string'&&s.length>3),'missing qualification rules');
 }
 return Object.freeze({schema:'poly.pcbm.coverage.v1',incomplete:true,scientific_validation_claimed:false,
  family_count:families.size,topic_count:ids.size,families:[...families],
  entries:raw.entries.map(e=>({id:e.id,family:e.family,topic:e.topic,status:e.status,
   evidence_count:0,runtime_model:false,qualified_registration:false,missing:[...e.missing]}))});
}
export function filterPCBMCoverage(coverage,{family='all',query=''}={}){
 req(coverage?.schema==='poly.pcbm.coverage.v1','validated inventory required');
 req(family==='all'||coverage.families.includes(family),'unknown family');
 const q=norm(query.trim());
 return coverage.entries.filter(e=>(family==='all'||e.family===family)&&(!q||norm(e.family+' '+e.topic+' '+e.missing.join(' ')).includes(q)));
}
export async function fetchPCBMCoverage({fetcher=fetch,signal}={}){
 const r=await fetcher(new URL('../data/inventaire-multiechelle.json',import.meta.url),{cache:'no-store',signal});
 req(r.ok,'canonical inventory unavailable');
 const bytes=await r.arrayBuffer();
 req(bytes.byteLength>0&&bytes.byteLength<=250000,'canonical inventory too large');
 signal?.throwIfAborted?.();
 return validatePCBMCoverage(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)));
}
