// Original evaluation of published rounded regression coefficients; no source code copied.
// Reference: Boumezbeur et al. 2010, DOI 10.1523/JNEUROSCI.2040-10.2010, Fig. 6.
const source=Object.freeze({doi:'10.1523/JNEUROSCI.2040-10.2010',pmcid:'PMC2996729',model:'blood-to-regional-brain-lactate-regressions',version:1,humans:7,kinetic_experiments:9,region:'occipito-parietal spectroscopy volume',input_range_mmol_L:[0.8,2.8]});
function exactKeys(x,keys){return x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));}
export function validateLactateRequest(p){
 if(!exactKeys(p,['schema','plasma_reference_mmol_L','plasma_condition_mmol_L'])||p.schema!=='poly.human-lactate-request.v1')throw Error('Format de demande lactate incompatible');
 for(const key of ['plasma_reference_mmol_L','plasma_condition_mmol_L'])if(typeof p[key]!=='number'||!Number.isFinite(p[key])||p[key]<0.8||p[key]>2.8)throw Error('Lactate plasmatique requis entre 0,8 et 2,8 mmol/L, sans extrapolation');
 return {...p};
}
function evaluate(x){
 const influx=0.042*x,net=0.019*x-0.007;
 return {plasma_mmol_L:x,regional_lactate_umol_g:0.63*x,influx_umol_g_min:influx,net_consumption_umol_g_min:net,derived_efflux_umol_g_min:influx-net};
}
export function compareHumanLactate(input){
 const request=validateLactateRequest(input),reference=evaluate(request.plasma_reference_mmol_L),condition=evaluate(request.plasma_condition_mmol_L);
 const difference=Object.fromEntries(Object.keys(reference).map(k=>[k,condition[k]-reference[k]]));
 return {schema:'poly.human-lactate-comparison.v1',request,source:{...source,input_range_mmol_L:[...source.input_range_mmol_L]},origin:'model_published_regressions',reference,condition,condition_minus_reference:difference,units:{plasma:'mmol/L',regional_lactate:'µmol/g',fluxes:'µmol/g/min'},receipt:{max_stationary_balance_residual_umol_g_min:Math.max(...[reference,condition].map(v=>Math.abs(v.influx_umol_g_min-v.derived_efflux_umol_g_min-v.net_consumption_umol_g_min)))},scope:{individual_prediction:false,astrocyte_neuron_flux:false,MCT2_specific_parameter:false,causal_intervention_effect:false,physiological_clock_s:null,avatar_write:false,experimental_validation_by_POLY:false,prediction_interval:null}};
}
function stable(x){if(Array.isArray(x))return '['+x.map(stable).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';return JSON.stringify(x);}
export function restoreHumanLactate(p){
 if(p?.schema!=='poly.human-lactate-comparison.v1')throw Error('Registre lactate incompatible');
 const received=compareHumanLactate(p.request);
 if(stable(p)!==stable(received))throw Error('Registre lactate différent du recalcul : source, nombres ou portée altérés');
 return received;
}
