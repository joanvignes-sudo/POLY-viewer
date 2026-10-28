// POLY: human tissue-rate evidence + conditional *illustration* of intracellular lactate allocation.
// Li et al., PNAS Nexus (2025), Table 1, doi:10.1093/pnasnexus/pgaf072.
// No cell-resolved measurement, no rerun of raw 7T DMRSI, no model fitting.
export const TISSUES=Object.freeze(['WM','GM','WB']);
export const VARIABLES=Object.freeze(['CMRGlc','CMRLac','VTCA','Tmax']);
const finiteNonnegative=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0;
function requireValid(condition,message){if(!condition)throw new Error(message);}
export function validateLiTable(d){
 requireValid(d?.schema==='poly.human-metabolism.li2025-table1.v1','Unsupported evidence schema');
 requireValid(d.source?.doi==='10.1093/pnasnexus/pgaf072','Unexpected scientific source');
 requireValid(d.source?.unit==='µmol/g/min','Unexpected unit');
 requireValid(Array.isArray(d.subjects)&&d.subjects.length===5,'Expected five participants');
 const seen=new Set();
 for(const s of d.subjects){
  requireValid(typeof s.id==='string'&&s.id&&!seen.has(s.id),'Participant identity invalid or repeated');
  seen.add(s.id);
  for(const t of TISSUES)for(const v of VARIABLES)requireValid(finiteNonnegative(s[t]?.[v]),'Missing or invalid '+s.id+'/'+t+'/'+v);
 }
 for(const t of TISSUES)for(const v of VARIABLES){
  const pair=d.published_group?.[t]?.[v];
  requireValid(Array.isArray(pair)&&pair.length===2&&pair.every(finiteNonnegative),'Missing published summary '+t+'/'+v);
 }
 return d;
}
export function sampleStats(values){
 requireValid(Array.isArray(values)&&values.length>1&&values.every(finiteNonnegative),'Need at least two nonnegative values');
 const mean=values.reduce((a,b)=>a+b,0)/values.length;
 const sd=Math.sqrt(values.reduce((a,b)=>a+(b-mean)**2,0)/(values.length-1));
 return {mean,sd,n:values.length};
}
export function arithmeticAudit(data){
 const d=validateLiTable(data),rows=[];
 for(const tissue of TISSUES)for(const variable of VARIABLES){
  const stats=sampleStats(d.subjects.map(s=>s[tissue][variable]));
  const [publishedMean,publishedSd]=d.published_group[tissue][variable];
  // Table 1 reports only two decimal places, so compare rounded results.
  const roundedMean=Number(stats.mean.toFixed(2)),roundedSd=Number(stats.sd.toFixed(2));
  rows.push({tissue,variable,...stats,roundedMean,roundedSd,publishedMean,publishedSd,pass:roundedMean===publishedMean&&roundedSd===publishedSd});
 }
 return {schema:'poly.li2025.arithmetic-audit.v1',n_subjects:d.subjects.length,rows,all_pass:rows.every(r=>r.pass),scope:'Recomputes arithmetic of rounded published estimates only; does not reproduce imaging or kinetic fits'};
}
export function selectRates(data,tissue='WB',subject='mean'){
 const d=validateLiTable(data);
 requireValid(TISSUES.includes(tissue),'Unknown tissue');
 if(subject==='mean')return Object.fromEntries(VARIABLES.map(v=>[v,sampleStats(d.subjects.map(s=>s[tissue][v])).mean]));
 const row=d.subjects.find(s=>s.id===subject);
 requireValid(row,'Unknown participant');
 return {...row[tissue]};
}
export function ratioAerobicGlycolysis(rates){
 requireValid(finiteNonnegative(rates.CMRLac)&&finiteNonnegative(rates.CMRGlc)&&rates.CMRGlc>0,'Invalid ratio input');
 return rates.CMRLac/(2*rates.CMRGlc);
}
// This decomposition is a toy stationary allocation of SOURCE contributions, not a
// mechanistic fit or validated cell-to-cell shuttle. alpha/beta are user assumptions.
// With P = P_A + P_N, transfer J = beta*P_A, the tissue total cannot identify J.
export function conditionalLactateScenario(data,{tissue='WB',subject='mean',alpha=.5,beta=.5}={}){
 requireValid(typeof alpha==='number'&&Number.isFinite(alpha)&&alpha>=0&&alpha<=1,'Astrocyte production share must be in [0,1]');
 requireValid(typeof beta==='number'&&Number.isFinite(beta)&&beta>=0&&beta<=1,'Internal transfer share must be in [0,1]');
 const rates=selectRates(data,tissue,subject),P=rates.CMRLac;
 const astrocyte_production=P*alpha,neuronal_production=P*(1-alpha);
 const assumed_internal_transfer=astrocyte_production*beta;
 const astrocyte_remaining=astrocyte_production-assumed_internal_transfer;
 const neuronal_pool_contribution=neuronal_production+assumed_internal_transfer;
 const balance_residual=(astrocyte_remaining+neuronal_pool_contribution)-P;
 return {schema:'poly.li2025.conditional-lactate-allocation.v1',tissue,subject,unit:'µmol/g/min',assumptions:{alpha,beta},observables:{...rates,AG_ratio:ratioAerobicGlycolysis(rates)},model_only:{astrocyte_production,neuronal_production,assumed_internal_transfer,astrocyte_remaining,neuronal_pool_contribution,balance_residual},identifiability:{observed_equation:'CMRLac = astrocyte_production + neuronal_production',transfer_observed:false,independent_parameters_not_identified:2,qualifier:'Illustrative allocation; no measured astrocyte-to-neuron exchange, cell oxidation, blood-to-brain transport or validation in humans'}};
}
