import {HYPOTHESES} from './recycling-hypotheses-core.mjs';
// Reading an already received trajectory, with right-hand source state at pulse-off.
export function c4Reading(receipt,index,hypothesis){
 if(receipt?.schema!=='poly.c4-spatial.v1'||!Number.isInteger(index)||index<0||index>120)throw Error('Repère de lecture incompatible');
 const h=HYPOTHESES.find(x=>x.id===hypothesis);if(!h)throw Error('Hypothèse de lecture inconnue');
 const sample=receipt.series.find(s=>s.hypothesis===hypothesis).samples[index],reference=receipt.series.find(s=>s.hypothesis==='gln').samples[index],tau=sample[0];
 const ratio=(h.extra===null?0:receipt.request.cycle_umol_g_min*(1+h.extra))/.8,source=tau<receipt.protocol.pulse_off_tau?receipt.protocol.input_C4_fraction:0;
 const entry=ratio*source,exit=(1+ratio)*sample[1];
 return {tau,source_fraction:source,entry_per_tau:entry,retained_fraction:sample[1],exit_per_tau:exit,net_per_tau:entry-exit,difference_fraction:sample[1]-reference[1],cumulative_balance_residual:sample[2]-sample[3]-sample[1],phase:source>0?'input_on':'input_off'};
}
export function c4ChartGeometry(receipt,index,hypothesis){
 c4Reading(receipt,index,hypothesis);
 const X=t=>42+t/6*448,Y=f=>192-f/.06*160;
 return {cursor_x:X(index/20),pulse_off_x:X(2),paths:receipt.series.map(s=>({id:s.hypothesis,selected:s.hypothesis===hypothesis,points:s.samples.map(v=>[X(v[0]),Y(v[1])])}))};
}
