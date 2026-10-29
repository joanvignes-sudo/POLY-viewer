// P7: stoichiometry and thermodynamic qualification, not a kinetic solver.
// Proton ledgers represent exchange with an imposed-pH boundary, never free H+.
const IDS=['A','E','N'];
const POOLS=['lactate_mmol','pyruvate_mmol','NADH_mmol','NAD_mmol'];
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join('|')===keys.slice().sort().join('|');
const clone=x=>JSON.parse(JSON.stringify(x));
export const REVERSIBLE_SCOPE={version:'poly.lactate-contract.p7.v1',kind:'stoichiometry_and_ideal_chemical_affinity',amount_unit:'mmol',volume_unit:'L',standard_concentration:'1 mol/L',pH_mode:'imposed_activity_boundary',buffer_capacity:null,kinetics:null,human_validation:false,human_clock:null,ATP:null,power_W:null};
export const EVENTS={
 LDH_A:{A:{pyruvate_mmol:-1,NADH_mmol:-1,lactate_mmol:1,NAD_mmol:1,proton_boundary_mmol:-1}},
 MCT_AE:{A:{lactate_mmol:-1,proton_boundary_mmol:-1},E:{lactate_mmol:1,proton_boundary_mmol:1}},
 MCT_EN:{E:{lactate_mmol:-1,proton_boundary_mmol:-1},N:{lactate_mmol:1,proton_boundary_mmol:1}},
 LDH_N:{N:{pyruvate_mmol:-1,NADH_mmol:-1,lactate_mmol:1,NAD_mmol:1,proton_boundary_mmol:-1}}
};
export function validateReversibleState(s){
 if(!exact(s,['schema','origin','amount_unit','volume_unit','pH_mode','compartments','ldh_equilibrium'])||s.schema!=='poly.lactate-state.p7.v1'||s.origin!=='synthetic_scenario'||s.amount_unit!=='mmol'||s.volume_unit!=='L'||s.pH_mode!=='imposed_activity_boundary'||!exact(s.compartments,IDS))throw Error('Contrat de quantités, unités ou origine incompatible');
 for(const id of IDS){const c=s.compartments[id];if(!exact(c,['volume_L','pH',...POOLS,'proton_boundary_mmol'])||typeof c.volume_L!=='number'||!Number.isFinite(c.volume_L)||c.volume_L<=0||typeof c.pH!=='number'||!Number.isFinite(c.pH)||c.pH<0||c.pH>14||!POOLS.every(k=>typeof c[k]==='number'&&Number.isFinite(c[k])&&c[k]>=0)||typeof c.proton_boundary_mmol!=='number'||!Number.isFinite(c.proton_boundary_mmol))throw Error('Compartiment incomplet ou quantité non physique');}
 if(s.ldh_equilibrium!==null){const k=s.ldh_equilibrium;if(!exact(k,['lnK','standard','origin'])||typeof k.lnK!=='number'||!Number.isFinite(k.lnK)||k.standard!=='chemical_explicit_proton'||k.origin!=='synthetic_scenario')throw Error('K chimique avec proton explicite requis ; ne pas mélanger K transformé et pH');}
 return clone(s);
}
function lnActivity(c,k){const n=c[k];if(n===0)return null;const v=Math.log(n)-Math.log(c.volume_L)-Math.log(1000);if(!Number.isFinite(v))throw Error('Activité non représentable');return v;}
function direction(d){return Math.abs(d)<1e-12?'equilibrium':d<0?'forward':'reverse';}
export function qualifyReversibleState(state){
 const s=validateReversibleState(state),transport={};
 for(const [id,a,b]of [['MCT_AE','A','E'],['MCT_EN','E','N']]){const x=s.compartments[a],y=s.compartments[b],lx=lnActivity(x,'lactate_mmol'),ly=lnActivity(y,'lactate_mmol');
  if(lx===null||ly===null){transport[id]={status:'zero_pool_boundary_not_resolved',flux:null};continue;}
  const dmu_RT=ly-lx+Math.LN10*(x.pH-y.pH);transport[id]={status:'ideal_direction_only',dmu_RT,direction:direction(dmu_RT),net_charge_per_pair:0,flux:null,delay:null};
 }
 const ldh={};for(const id of ['A','N']){const c=s.compartments[id],a=Object.fromEntries(POOLS.map(k=>[k,lnActivity(c,k)]));
  if(Object.values(a).some(x=>x===null)){ldh[id]={status:'zero_pool_boundary_not_resolved',flux:null};continue;}
  const lnQ=a.lactate_mmol+a.NAD_mmol-a.pyruvate_mmol-a.NADH_mmol+Math.LN10*c.pH;
  ldh[id]=s.ldh_equilibrium===null?{status:'chemical_equilibrium_unknown',lnQ,dG_RT:null,direction:null,flux:null}:{status:'synthetic_equilibrium_only',lnQ,dG_RT:lnQ-s.ldh_equilibrium.lnK,direction:direction(lnQ-s.ldh_equilibrium.lnK),flux:null};
 }
 return {scope:clone(REVERSIBLE_SCOPE),transport,ldh,missing_for_trajectory:['reversible rate laws and capacities with provenance','buffer/water/ion closure or qualified imposed-pH protocol','boundary substrate and redox sources/sinks','observation operator and matching protocol','a human time scale and validation data']};
}
export function reversibleTotals(state){
 const s=validateReversibleState(state),c=s.compartments;
 return {substrate_C3_mmol:IDS.reduce((t,id)=>t+c[id].lactate_mmol+c[id].pyruvate_mmol,0),NAD_pair_mmol:IDS.reduce((t,id)=>t+c[id].NADH_mmol+c[id].NAD_mmol,0),redox_plus_lactate_mmol:IDS.reduce((t,id)=>t+c[id].NADH_mmol+c[id].lactate_mmol,0),proton_boundary_mmol:IDS.reduce((t,id)=>t+c[id].proton_boundary_mmol,0)};
}
export function applyPrescribedExtent(state,event){
 const s=validateReversibleState(state);
 if(!exact(event,['id','extent_mmol','origin'])||!Object.hasOwn(EVENTS,event.id)||event.origin!=='prescribed_synthetic_extent'||typeof event.extent_mmol!=='number'||!Number.isFinite(event.extent_mmol))throw Error('Avancement prescrit signé requis ; ni taux ni nombre de réactions mesuré');
 for(const [id,stoich]of Object.entries(EVENTS[event.id]))for(const [pool,coefficient]of Object.entries(stoich))s.compartments[id][pool]+=event.extent_mmol*coefficient;
 validateReversibleState(s); // Atomic refusal; caller input is never mutated.
 return {state:s,event:clone(event),scope:'prescribed_balance_not_kinetic_prediction',pH_updated:false,free_proton_amount_inferred:false,full_charge_or_atom_balance_claimed:false,totals:reversibleTotals(s)};
}
