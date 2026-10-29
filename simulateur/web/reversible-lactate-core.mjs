import {EVENTS} from './reversible-lactate-contract.mjs';
// P8: closed substrate/redox system with external imposed proton activities.
// Capacities and the chemical equilibrium are synthetic model choices.
const IDS=['A','E','N'],FIELDS=['lactate_mmol','pyruvate_mmol','NADH_mmol','NAD_mmol','proton_boundary_mmol'];
const REACTIONS=['LDH_A','MCT_AE','MCT_EN','LDH_N'];
export const P8_MODEL={version:'poly.reversible-lactate.p8.v1',origin:'synthetic_scenario',quantity_unit:'mmol',time_unit:'synthetic_time',volume_L:{A:1,E:1,N:1},reference_concentration_mM:1,reference_proton_activity:1e-7,chemical_lnK:7*Math.LN10,chemical_standard:'explicit_proton_activities_relative_to_1_M',capacities_mmol_per_synthetic_time:{LDH_A:.15,MCT_AE:.2,MCT_EN:.2,LDH_N:.15},initial:[4,3,2,1,0,1,0,0,0,0,1,2,1,2,0,0,0,0,0,0,0,0,0],cases:['control','capacity_AE','extracellular_pH'],program:{start:2,end:6,end_time:8,capacity_remaining:.25,baseline_pH:7,extracellular_pH:6},limits:['All capacities, equilibrium, amounts and volumes are synthetic, not human estimates','pH is an imposed external activity; no buffer-capacity, water or ion closure','No glucose supply, mitochondrial oxidation, ATP, watts or human clock','Gross forward/backward rates are model rates, not counted molecular events','P4 is a separate model and is unchanged']};
function freeze(x){Object.values(x).forEach(v=>{if(v&&typeof v==='object')freeze(v);});return Object.freeze(x);}freeze(P8_MODEL);
const clone=x=>JSON.parse(JSON.stringify(x));
const columns=REACTIONS.map(id=>IDS.flatMap(c=>FIELDS.map(k=>EVENTS[id][c]?.[k]??0)));
export function p8Factors(t,id){if(!P8_MODEL.cases.includes(id)||!Number.isFinite(t)||t<0||t>8)throw Error('Cas ou temps P8 invalide');const active=t>=2&&t<6;return {pH:{A:7,E:active&&id==='extracellular_pH'?6:7,N:7},capacity_AE:active&&id==='capacity_AE'?.25:1,boundary_program_active:active&&id!=='control'};}
function physical(y){if(!Array.isArray(y)||y.length!==23||y.some(x=>!Number.isFinite(x))||y.some((x,i)=>i<15&&i%5!==4&&x<0)||y.slice(15).some(x=>x<0))throw Error('Stock ou cumul P8 non physique ; aucun écrêtage');}
export function p8Flux(y,f){physical(y);if(!f?.pH||Object.keys(f.pH).sort().join('|')!=='A|E|N'||!IDS.every(c=>typeof f.pH[c]==='number'&&Number.isFinite(f.pH[c])&&f.pH[c]>=0&&f.pH[c]<=14)||![.25,1].includes(f.capacity_AE))throw Error('Frontière P8 invalide');const h=IDS.map(c=>10**(7-f.pH[c])),l=[y[0],y[5],y[10]],p=[y[1],y[6],y[11]],r=[y[2],y[7],y[12]],o=[y[3],y[8],y[13]];
 // All volumes are fixed to 1 L here; n_mmol / (V_L * 1 mM) is dimensionless.
 const raw=[[p[0]*r[0]*h[0],l[0]*o[0]],[l[0]*h[0],l[1]*h[1]],[l[1]*h[1],l[2]*h[2]],[p[2]*r[2]*h[2],l[2]*o[2]]];
 const k=[.15,.2*f.capacity_AE,.2,.15];
 return Object.fromEntries(REACTIONS.map((id,i)=>{const [a,b]=raw[i],forward=k[i]*a,reverse=k[i]*b,net=forward-reverse,affinity=a>0&&b>0?Math.log(b)-Math.log(a):null;if(![forward,reverse,net].every(Number.isFinite))throw Error('Débordement de taux P8');return [id,{forward,reverse,net,dG_RT:affinity,dissipation_product:affinity===null?null:net*affinity}];}));
}
function derivative(y,f){const flux=p8Flux(y,f),dy=Array(23).fill(0);REACTIONS.forEach((id,i)=>{const x=flux[id];for(let k=0;k<15;k++)dy[k]+=columns[i][k]*x.net;dy[15+2*i]=x.forward;dy[16+2*i]=x.reverse;});return dy;}
function step(y,h,f){const a=derivative(y,f),b=derivative(y.map((v,i)=>v+h*a[i]/2),f),c=derivative(y.map((v,i)=>v+h*b[i]/2),f),d=derivative(y.map((v,i)=>v+h*c[i]),f);return y.map((v,i)=>v+h*(a[i]+2*b[i]+2*c[i]+d[i])/6);}
export function p8Invariants(y){return {substrate_C3:y[0]+y[1]+y[5]+y[6]+y[10]+y[11],NAD_A:y[2]+y[3],NAD_N:y[12]+y[13],reduced_plus_lactate:y[0]+y[2]+y[5]+y[7]+y[10]+y[12]};}
export function p8Potential(y,f){let g=0;for(let i=0;i<15;i++){if(i%5===4)g+=y[i]*Math.LN10*(7-f.pH[IDS[Math.floor(i/5)]]);else if(y[i]>0)g+=y[i]*(Math.log(y[i])-1);}return g;}
export function runP8({schema,dt}){if(schema!=='poly.p8.request.v1'||![.02,.01,.005].includes(dt)||arguments[0]===null||Object.keys(arguments[0]).sort().join('|')!=='dt|schema')throw Error('Requête P8 invalide');const series={},initial=p8Invariants(P8_MODEL.initial);let residual=0,maxDissipation=0;
 for(const id of P8_MODEL.cases){let y=P8_MODEL.initial.slice(),rows=[];for(let i=0;i<=Math.round(8/dt);i++){const t=Number((i*dt).toFixed(10)),f=p8Factors(t,id),flux=p8Flux(y,f),invariants=p8Invariants(y);for(const k in initial)residual=Math.max(residual,Math.abs(invariants[k]-initial[k]));for(const x of Object.values(flux))if(x.dissipation_product!==null)maxDissipation=Math.max(maxDissipation,x.dissipation_product);
  if(i%Math.round(.1/dt)===0)rows.push({t,state:y.slice(),flux,factors:f,potential:p8Potential(y,f)});
  if(i<Math.round(8/dt))y=step(y,dt,p8Factors(t+dt/2,id));}
  series[id]=rows;
 }
 return {schema:'poly.p8.trial.v1',model:clone(P8_MODEL),request:{schema,dt},series,receipt:{max_invariant_residual:residual,max_positive_net_times_affinity:maxDissipation},scope:{human_validation:false,human_clock:null,ATP:null,power_W:null,kinetics:'synthetic_detailed_balance_mass_action',pH:'external_imposed_boundary',buffer_capacity:null}};
}
