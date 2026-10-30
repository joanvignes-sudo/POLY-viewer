// POLY ModelLab v0.1 — validated metadata, not a universal model interpreter.
// No expressions from imported JSON are evaluated as code.
export const REGISTRY_SCHEMA='poly.model-lab.registry.v1';
const idOk=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{1,90}$/.test(x);
const nonEmpty=x=>typeof x==='string'&&x.trim().length>0&&x.length<=1000;
function ensure(test,message){if(!test)throw Error('ModelLab: '+message);}
function unique(items,label,min=1,max=200){
 ensure(Array.isArray(items)&&items.length>=min&&items.length<=max,label+' size');
 const m=new Map();
 for(const item of items){ensure(item&&idOk(item.id)&&!m.has(item.id),label+' identifier');m.set(item.id,item);}
 return m;
}
function validateScope(s){
 ensure(s&&['synthetic','human','mouse','rat','literature_mixed','unknown'].includes(s.species),'species');
 for(const k of ['preparation','region','time_basis'])ensure(nonEmpty(s[k]),'scope '+k);
}
export function validateModelRegistry(input){
 ensure(input?.schema===REGISTRY_SCHEMA&&input.published===false,'schema or publication flag');
 const sources=unique(input.sources,'sources',1,100);
 for(const s of sources.values()){
  ensure(nonEmpty(s.title)&&['repository_file','article_reference'].includes(s.kind),'source qualification');
  ensure(['verified_repository_bytes','bibliography_only'].includes(s.verification),'source verification');
  if(s.kind==='repository_file')ensure(/^simulateur\/web\/[a-zA-Z0-9._/-]+$/.test(s.path)&&!s.path.includes('..'),'source path');
  else ensure(/^10\.\d{4,9}\/\S{2,120}$/.test(s.doi),'source DOI');
 }
 const models=unique(input.models,'models',2,100);
 for(const m of models.values()){
  ensure(nonEmpty(m.title)&&nonEmpty(m.version)&&idOk(m.family),'model metadata');
  ensure(['runnable_synthetic','documentary_only'].includes(m.status),'model execution status');
  validateScope(m.scope);
  ensure(m.observable&&idOk(m.observable.id)&&nonEmpty(m.observable.unit)&&nonEmpty(m.observable.operator),'observable metadata');
  ensure(Array.isArray(m.source_ids)&&m.source_ids.length>0&&new Set(m.source_ids).size===m.source_ids.length&&m.source_ids.every(id=>sources.has(id)),'model provenance');
  ensure(Array.isArray(m.assumptions)&&m.assumptions.length>0&&m.assumptions.every(nonEmpty),'assumptions');
  ensure(m.validation?.independent===false&&m.validation?.human===false,'unqualified validation');
  if(m.status==='runnable_synthetic'){
   ensure(idOk(m.engine)&&nonEmpty(m.scenario),'runnable model engine');
   ensure(m.scope.species==='synthetic'&&m.scope.time_basis==='synthetic_time','synthetic scope');
   ensure(m.driver&&idOk(m.driver.id)&&nonEmpty(m.driver.description),'driver attribution');
  }else{
   ensure(m.engine===null&&m.scenario===null&&m.driver===null,'documentary model masquerading as executable');
  }
 }
 return input;
}
export function modelById(registry,id){
 validateModelRegistry(registry);
 return registry.models.find(m=>m.id===id)??null;
}
export function checkComparisonCompatibility(a,b){
 const reasons=[];
 if(a.status!=='runnable_synthetic'||b.status!=='runnable_synthetic')reasons.push('Au moins un modèle ne possède pas de solveur qualifié.');
 if(a.observable.id!==b.observable.id||a.observable.unit!==b.observable.unit||a.observable.operator!==b.observable.operator)reasons.push('Les observables, unités ou opérateurs de mesure diffèrent.');
 for(const k of ['species','preparation','region','time_basis'])if(a.scope[k]!==b.scope[k])reasons.push('Contexte incompatible : '+k+'.');
 if(a.validation.independent||b.validation.independent)throw Error('ModelLab: unexpected independent validation flag');
 return {compatible:reasons.length===0,reasons};
}
