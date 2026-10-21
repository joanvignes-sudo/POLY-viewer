'use strict';
// Read-only presentation boundary. Does not register a solver with the adaptive core.
const crypto=require('node:crypto');
const digest=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
const clone=x=>JSON.parse(JSON.stringify(x));
function envelope(result,{implementation_sha256,reference_sha256}={}){
 if(!result || result.schema!=='poly.quantitative.test-result/1' || result.species!=='squid' ||
 result.human_transfer_validated!==false || result.anatomical_position!=='none' ||
 result.biological_timing!=='model_computed_not_experimental' ||
 result.scientific_validation!=='NUMERICAL_TESTED_NOT_INDEPENDENTLY_EMPIRICALLY_VALIDATED' ||
 result.params?.temperature_C!==6.3) throw new TypeError('UNSUPPORTED_SCIENTIFIC_SCOPE');
 if(![implementation_sha256,reference_sha256].every(x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x)))
 throw new TypeError('SOURCE_HASH_REQUIRED');
 const u=result.units;
 if(u?.time!=='ms'||u?.voltage!=='mV'||u?.current_density!=='uA/cm^2'||u?.gates!=='dimensionless')
 throw new TypeError('UNITS_MISMATCH');
 if(!Array.isArray(result.rows)||result.rows.length<2)throw new TypeError('TRACE_MISSING');
 for(let i=0;i<result.rows.length;i++){
  const r=result.rows[i];
  if(!['t_ms','voltage_mV','m','h','n','current_uA_cm2'].every(k=>Number.isFinite(r[k]))||
    (i===0&&r.t_ms!==0)||(i>0&&r.t_ms<=result.rows[i-1].t_ms)||
    ['m','h','n'].some(k=>r[k]<0||r[k]>1))throw new TypeError('INVALID_TRACE');
 }
 return {schema:'poly.quantitative.sidecar/1',species:'squid',preparation:'idealized_single_membrane_patch',
 evidence_class:'SIMULATED',empirical_validation:false,human_transfer_validated:false,
 clock:{id:'isolated_hh_model_time',unit:'ms',origin:'synthetic_protocol_start',
   aligned_to_documentary_events:false},
 spatial_registration:null,causal_documentary_links:[],
 provenance:{implementation_sha256,reference_sha256,result_sha256:digest(result)},
 result:clone(result)};
}
function compose(session,sidecar){
 if(sidecar?.schema!=='poly.quantitative.sidecar/1'||sidecar.evidence_class!=='SIMULATED'||
 sidecar.human_transfer_validated!==false||sidecar.empirical_validation!==false||
 sidecar.spatial_registration!==null||sidecar.causal_documentary_links?.length!==0||
 sidecar.clock?.aligned_to_documentary_events!==false)throw new TypeError('SIDECAR_SCOPE_CHANGED');
 // Re-check scope and data integrity, including after persistence/user mutation.
 const checked=envelope(sidecar.result,sidecar.provenance);
 if(digest(checked)!==digest(sidecar))throw new TypeError('SIDECAR_INTEGRITY_MISMATCH');
 const snapshot=session.snapshot();
 if(snapshot.capabilities?.predictive_physiology!==false || snapshot.timeline_type!=='PEDAGOGICAL_STEP_INDEX')
 throw new TypeError('DOCUMENTARY_SESSION_REQUIRED');
 return {schema:'poly.adaptive.comparison-view/1',documentary:clone(snapshot),
 quantitative:clone(sidecar),relationship:'SIDE_BY_SIDE_ONLY',
 aligned_clock:false,registered_anatomy:false,can_drive_events:false,
 applicability:{human:false,documentary_scenario_prediction:false},
 warnings:['Modèle calmar à 6,3 °C ; aucune prédiction humaine.',
 'Horloge simulée distincte de l’ordre documentaire ; aucun recalage HRA.']};
}
function applyToScenario(){throw new Error('BIOLOGICAL_COUPLING_NOT_VALIDATED');}
module.exports={envelope,compose,applyToScenario};
