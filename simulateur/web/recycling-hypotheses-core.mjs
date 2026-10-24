// Original reduced stationary C4 balance, conditional on published human tracer data.
// Lebon et al. 2002, Table 1 neuronal C4 balance, Table 2 corrected grey-matter FE.
const DOI='10.1523/JNEUROSCI.22-05-01523.2002';
export const HYPOTHESES=Object.freeze([{id:'internal',label:'Échange interne seul',extra:null},{id:'gln',label:'Cycle Glu/Gln',extra:0},{id:'minor-kg',label:'Glu/Gln + αKG 10 %',extra:.1},{id:'major-kg',label:'Glu/Gln + αKG 100 %',extra:1}].map(Object.freeze));
export function runRecyclingHypotheses(request){
 if(!request||Object.keys(request).sort().join(',')!=='design,schema'||request.schema!=='poly.recycling-request.v1'||request.design!=='published-sensitivity-v1')throw Error('Plan de comparaison incompatible');
 const observed=.029,sd=.009,gln=.104,tca=.8,rows=[];
 for(let i=25;i<=39;i++)for(const h of HYPOTHESES){
  const cycle=i/100,transfer=h.extra===null?0:cycle*(1+h.extra),fe=gln*transfer/(transfer+tca),incoming=transfer*gln,outgoing=(transfer+tca)*fe;
  rows.push({cycle_umol_g_min:cycle,hypothesis:h.id,transfer_umol_g_min:transfer,neuronal_C4_fraction:fe,observed_difference_fraction:fe-observed,inside_descriptive_SD_band:fe>=observed-sd&&fe<=observed+sd,incoming_label_umol_g_min:incoming,outgoing_label_umol_g_min:outgoing,stationary_residual_umol_g_min:incoming-outgoing});
 }
 return {schema:'poly.recycling-comparison.v1',request:{...request},source:{doi:DOI,pmcid:'PMC2995528',human_participants:8,table:'1: stationary neuronal C4 balance; 2: model-corrected grey-matter FE'},origin:'reduced_model_conditional_on_published_human_data',parameters:{gln_C4_fraction:gln,neuronal_TCA_umol_g_min:tca,observed_neuronal_C4_fraction:observed,observed_SD_fraction:sd,cycle_mean_umol_g_min:.32,cycle_SD_umol_g_min:.07},design:{selected_cycle_values:[.25,.32,.39],sweep_count:15,hypotheses:4,alphaKG_fractions_origin:'counterfactual route weights, not measurements',SD_usage:'one-at-a-time sensitivity, not population subgroups or joint confidence bounds'},rows,receipt:{evaluations:rows.length,max_absolute_stationary_residual_umol_g_min:Math.max(...rows.map(r=>Math.abs(r.stationary_residual_umol_g_min)))},scope:{stationary:true,transient_simulation:false,physiological_clock_s:null,full_tracer_model:false,independent_experimental_validation:false,raw_subject_data:false,ANLS_or_MCT2_conclusion:false,ATP_prediction:false,avatar_write:false,manual_states_write:false,selection_probability:null}};
}
function canonical(x){if(Array.isArray(x))return '['+x.map(canonical).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';return JSON.stringify(x);}
export function restoreRecyclingHypotheses(payload){
 if(payload?.schema!=='poly.recycling-comparison.v1')throw Error('Comparaison de recyclage incompatible');
 const received=runRecyclingHypotheses(payload.request);
 if(canonical(payload)!==canonical(received))throw Error('Comparaison altérée : résultats, hypothèses ou provenance différents du recalcul');
 return received;
}
