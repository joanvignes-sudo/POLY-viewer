import {HYPOTHESES} from './recycling-hypotheses-core.mjs';
export function virtualGrid(seed){
 let s=seed>>>0;function rng(){s=(Math.imul(1664525,s)+1013904223)>>>0;return s/4294967296;}
 const center=[rng()*.8-.4,rng()*.8-.4,rng()*.8-.4],cells=[];
 for(let x=0;x<12;x++)for(let y=0;y<12;y++)for(let z=0;z<12;z++){const p=[x,y,z].map(i=>-1+(i+.5)/6),w=Math.exp(-p.reduce((sum,a,i)=>sum+(a-center[i])**2,0)/(2*.35**2));cells.push({position:p,weight:w});}
 const total=cells.reduce((sum,c)=>sum+c.weight,0);for(const c of cells)c.weight/=total;
 return {center,cells};
}
export function c4Sample(cycle,hypothesis,tau){
 const h=HYPOTHESES.find(x=>x.id===hypothesis);if(!h||![.25,.32,.39].includes(cycle)||!Number.isFinite(tau)||tau<0||tau>6)throw Error('Condition C4 hors contrat');
 const r=(h.extra===null?0:cycle*(1+h.extra))/.8,lambda=1+r,steady=.104*r/lambda,on=Math.min(2,tau),rise=-Math.expm1(-lambda*on),peak=steady*rise;
 const F=tau<=2?peak:peak*Math.exp(-lambda*(tau-2));
 const incoming=r*.104*on,outgoing=r*.104*(on-rise/lambda)+(tau>2?peak*(-Math.expm1(-lambda*(tau-2))):0);
 return [tau,F,incoming,outgoing];
}
export function runC4Spatial(p){
 if(!p||Object.keys(p).sort().join(',')!=='cycle_umol_g_min,schema,seed'||p.schema!=='poly.c4-spatial-request.v1'||![.25,.32,.39].includes(p.cycle_umol_g_min)||!Number.isInteger(p.seed)||p.seed<0||p.seed>4294967295)throw Error('Demande C4/spatiale incompatible');
 const grid=virtualGrid(p.seed),series=HYPOTHESES.map(h=>({hypothesis:h.id,samples:Array.from({length:121},(_,i)=>c4Sample(p.cycle_umol_g_min,h.id,i/20))}));
 return {schema:'poly.c4-spatial.v1',request:{...p},source:{doi:'10.1523/JNEUROSCI.22-05-01523.2002',equations:'1,2 steady; normalized conditional transient extension by POLY'},protocol:{input_C4_fraction:.104,initial_F:0,pulse_off_tau:2,end_tau:6,time:'tau=Vn*t/Pn; common normalized coordinate, unknown Pn',origin:'analyst counterfactual pulse, not a measured human experiment'},series,projection:{frame:'virtual dimensionless cube [-1,1]^3',algorithm:'LCG32 + normalized discrete Gaussian v1',grid:12,kernel_width:.35,center:grid.center,weight_sum:grid.cells.reduce((s,c)=>s+c.weight,0),meaning:'voxel shares of normalized neuronal C4 pool, not voxel concentrations'},receipt:{max_balance_residual:Math.max(...series.flatMap(s=>s.samples.map(v=>Math.abs(v[2]-v[3]-v[1]))))},scope:{human_seconds:null,cell_count:null,energy_W:null,ATP:null,anatomical_registration:false,biological_spatial_diffusion:false,experimental_validation:false,avatar_write:false}};
}
function canonical(x){if(Array.isArray(x))return '['+x.map(canonical).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';return JSON.stringify(x);}
export function restoreC4Spatial(p){if(p?.schema!=='poly.c4-spatial.v1')throw Error('Registre C4 spatial incompatible');const {consultation,...model}=p,accepted=runC4Spatial(p.request);if(canonical(model)!==canonical(accepted))throw Error('Registre C4 spatial altéré');if(consultation===undefined)return accepted;if(!consultation||Object.keys(consultation).sort().join(',')!=='angle,hypothesis,index'||!Number.isInteger(consultation.index)||consultation.index<0||consultation.index>120||!Number.isInteger(consultation.angle)||consultation.angle<0||consultation.angle>360||!HYPOTHESES.some(h=>h.id===consultation.hypothesis))throw Error('Repère de consultation C4 incompatible');return {...accepted,consultation:{...consultation}};}
