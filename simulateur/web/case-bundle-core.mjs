import {validateCaseSession} from './case-workspace-core.mjs';
import {restoreHumanLactate} from './human-lactate-core.mjs';
import {restoreRecyclingHypotheses} from './recycling-hypotheses-core.mjs';
import {restoreC4Spatial} from './c4-spatial-core.mjs';
export function validateCaseBundle(payload,catalog){
 if(payload?.schema==='poly.case-workspace-bundle.v3'){
  if(Object.keys(payload).sort().join(',')!=='models,scenario,schema'||!payload.models||Object.keys(payload.models).sort().join(',')!=='c4_spatial,human_blood_lactate,recycling_hypotheses')throw Error('Séance v3 incompatible');
  const {c4_spatial,...models}=payload.models,prior=validateCaseBundle({schema:'poly.case-workspace-bundle.v2',scenario:payload.scenario,models},catalog);
  if(c4_spatial!==null&&!catalog.computational_adapters?.includes('conditional-c4-spatial-v1'))throw Error('Cascade non autorisée dans ce dossier');
  const accepted=c4_spatial===null?null:restoreC4Spatial(c4_spatial);return {schema:payload.schema,scenario:prior.scenario,models:{...prior.models,c4_spatial:accepted}};
 }
 if(payload?.schema==='poly.case-workspace.v1')return {schema:'poly.case-workspace-bundle.v1',scenario:validateCaseSession(payload,catalog),models:{human_blood_lactate:null}};
 if(payload?.schema==='poly.case-workspace-bundle.v2'){
  if(Object.keys(payload).sort().join(',')!=='models,scenario,schema'||!payload.models||Object.keys(payload.models).sort().join(',')!=='human_blood_lactate,recycling_hypotheses')throw Error('Sauvegarde composée v2 incompatible');
  const legacy=validateCaseBundle({schema:'poly.case-workspace-bundle.v1',scenario:payload.scenario,models:{human_blood_lactate:payload.models.human_blood_lactate}},catalog);
  const value=payload.models.recycling_hypotheses;
  if(value!==null&&!catalog.computational_adapters?.includes('human-recycling-hypotheses-v1'))throw Error('Comparaison non autorisée dans ce catalogue');
  const model=value===null?null:restoreRecyclingHypotheses(value);
  return {schema:payload.schema,scenario:legacy.scenario,models:{human_blood_lactate:legacy.models.human_blood_lactate,recycling_hypotheses:model}};
 }
 if(payload?.schema!=='poly.case-workspace-bundle.v1'||Object.keys(payload).sort().join(',')!=='models,scenario,schema'||!payload.models||Object.keys(payload.models).join(',')!=='human_blood_lactate')throw Error('Sauvegarde composée incompatible');
 // Both parts are received before the caller commits anything to the UI or local storage.
 const scenario=validateCaseSession(payload.scenario,catalog),value=payload.models.human_blood_lactate;
 if(value!==null&&!catalog.computational_adapters?.includes('human-blood-lactate-regressions-v1'))throw Error('Calcul non autorisé dans ce catalogue');
 const model=value===null?null:restoreHumanLactate(value);
 return {schema:'poly.case-workspace-bundle.v1',scenario,models:{human_blood_lactate:model}};
}
export function createCaseBundle(scenario,model,catalog,recycling=null,spatial=null){return validateCaseBundle(spatial!==null?{schema:'poly.case-workspace-bundle.v3',scenario,models:{human_blood_lactate:model,recycling_hypotheses:recycling,c4_spatial:spatial}}:recycling===null?{schema:'poly.case-workspace-bundle.v1',scenario,models:{human_blood_lactate:model}}:{schema:'poly.case-workspace-bundle.v2',scenario,models:{human_blood_lactate:model,recycling_hypotheses:recycling}},catalog);}
