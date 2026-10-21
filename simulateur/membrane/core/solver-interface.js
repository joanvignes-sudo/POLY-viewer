/* POLY: explicit contract for FUTURE quantitative models; no solver is bundled.
   Completing this manifest never constitutes experimental validation.
 */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.PolyModelContract=api;
})(typeof window==='undefined'?globalThis:window,function(){
 'use strict';
 const MODEL_SCHEMA='poly.quantitative.model/1';
 const REQUIRED=['id','version','organism','preparation','mechanism','equations_source',
   'parameter_sources','state_variables','model_outputs','applicability_limits',
   'independent_validation','implementation_sha256','licence'];
 const STATUS=Object.freeze({INCOMPLETE:'INCOMPLETE_METADATA',CANDIDATE:'CANDIDATE_AWAITING_SCIENTIFIC_REVIEW',
   UNSUPPORTED:'INCOMPATIBLE_WITH_SCENARIO',NO_ENGINE:'NO_VALIDATED_SOLVER_AVAILABLE'});
 class ModelNotExecutable extends Error {
   constructor(reasons){super('Calcul biologique interdit sans modèle validé : '+reasons.join(', '));
    this.name='ModelNotExecutable';this.code='SCIENTIFIC_MODEL_NOT_VALIDATED';this.reasons=reasons;}
 }
 function inspect(model,scenario){
   const reasons=[];
   if(!model||model.schema!==MODEL_SCHEMA)return {eligible:false,status:STATUS.INCOMPLETE,reasons:['MODEL_SCHEMA_UNKNOWN']};
   for(const key of REQUIRED)if(model[key]==null || model[key]==='' || (Array.isArray(model[key])&&model[key].length===0))
     reasons.push('MISSING_'+key.toUpperCase());
   if(!Array.isArray(model.parameter_sources)||!model.parameter_sources.every(p=>
      p&&typeof p.name==='string'&&p.name&&typeof p.unit==='string'&&p.unit&&
      typeof p.source_url==='string'&&p.source_url.startsWith('https://')))
     reasons.push('PARAMETER_PROVENANCE_INSUFFICIENT');
   if(!Array.isArray(model.state_variables)||!model.state_variables.every(v=>
      v&&typeof v.name==='string'&&v.name&&typeof v.unit==='string'&&v.unit))
     reasons.push('STATE_VARIABLES_UNITS_MISSING');
   if(!model.independent_validation||model.independent_validation.review_state!=='approved'||
      !model.independent_validation.validation_dataset_id||
      !model.independent_validation.validation_protocol_url)
     reasons.push('INDEPENDENT_VALIDATION_NOT_APPROVED');
   if(scenario){
     if(scenario.scientific_mode==='DOCUMENTARY_REPLAY_ONLY'||scenario.species==='mixed')
       reasons.push('DOCUMENTARY_MIXED_PREPARATIONS_CANNOT_BE_PREDICTED');
     if(model.organism!==scenario.species)reasons.push('SPECIES_INCOMPATIBLE');
   }
   if(model.executable_backend!==true)reasons.push('EXECUTABLE_BACKEND_ABSENT');
   // Even apparently complete manifests require a separate signed release-review gate.
   reasons.push('INDEPENDENT_RELEASE_GATE_NOT_IMPLEMENTED');
   return Object.freeze({eligible:false,
     status:reasons.some(x=>x.startsWith('MISSING_'))?STATUS.INCOMPLETE:STATUS.NO_ENGINE,
     reasons:[...new Set(reasons)].sort(),
     metadata_completeness_only:reasons.filter(x=>x.startsWith('MISSING_')).length===0,
     proves_biological_behavior:false});
 }
 function simulate(model,scenario,conditions){
   void conditions;
   const result=inspect(model,scenario);
   throw new ModelNotExecutable(result.reasons);
 }
 const emptyModel=Object.freeze({
   schema:MODEL_SCHEMA,id:'NO_AVAILABLE_MODEL',version:'candidate',
   organism:'human',preparation:'unknown',mechanism:'not_selected',
   equations_source:null,parameter_sources:[],state_variables:[],model_outputs:[],
   applicability_limits:'No validated model yet',independent_validation:null,
   implementation_sha256:null,licence:null,executable_backend:false
 });
 return Object.freeze({MODEL_SCHEMA,STATUS,ModelNotExecutable,inspect,simulate,emptyModel});
});
