import {P8_MODEL,p8Flux,runP8} from './reversible-lactate-core.mjs';
import {qualifyReversibleState} from './reversible-lactate-contract.mjs';
let verified=null;
export function verifyExistingKernel(){
 if(verified)return structuredClone(verified);
 const run=runP8({schema:'poly.p8.request.v1',dt:.01});
 if(run.receipt.max_invariant_residual>1e-9||run.receipt.max_positive_net_times_affinity>1e-10)throw Error('Le noyau P8 ne respecte pas ses contrôles.');
 const witnesses=new Map();
 // Automatic finite witness search, never a fit or a user-adjustable biological scenario.
 for(let ai=1;ai<12;ai++)for(let ei=1;ei<12;ei++){
  const A=ai/4,E=ei/4,N=3.5-A-E;if(N<=0)continue;
  const y=[...[A,E,N].flatMap(l=>[l,1,1,1,0]),...Array(8).fill(0)];const flux=p8Flux(y,{pH:{A:7,E:7,N:7},capacity_AE:1});
  const key=[Math.sign(flux.MCT_AE.net),Math.sign(flux.MCT_EN.net)].join(',');if(key.includes('0'))continue;
  const compartments=Object.fromEntries(['A','E','N'].map((id,i)=>[id,{volume_L:1,pH:7,lactate_mmol:[A,E,N][i],pyruvate_mmol:1,NADH_mmol:1,NAD_mmol:1,proton_boundary_mmol:0}]));
  const qualified=qualifyReversibleState({schema:'poly.lactate-state.p7.v1',origin:'synthetic_scenario',amount_unit:'mmol',volume_unit:'L',pH_mode:'imposed_activity_boundary',compartments,ldh_equilibrium:{lnK:P8_MODEL.chemical_lnK,standard:'chemical_explicit_proton',origin:'synthetic_scenario'}});
  for(const id of ['MCT_AE','MCT_EN'])if((qualified.transport[id].direction==='forward'?1:-1)!==Math.sign(flux[id].net))throw Error('Sens P7 et P8 contradictoires');
  if(!witnesses.has(key))witnesses.set(key,{directions:key,synthetic_pools_mmol:{A,E,N},net_AE:flux.MCT_AE.net,net_EN:flux.MCT_EN.net});
 }
 if(witnesses.size!==4)throw Error('Les témoins attendus n’ont pas été retrouvés.');
 verified={status:'existing_synthetic_kernel_verified',version:P8_MODEL.version,model_origin:'synthetic_scenario',data_fitted:false,rows_checked:Object.values(run.series).reduce((n,s)=>n+s.length,0),receipt:run.receipt,strict_orientation_witnesses:[...witnesses.values()],witness_search_exhaustive:false,witness_data_constraints_applied:false,scope:run.scope,missing_modules:['Apport glucose et glycolyse complète','Oxydation mitochondriale / ATP','Tampons, eau et fermeture ionique','Cinétique HCAR1–sérine et observation synaptique calibrée']};
 return structuredClone(verified);
}
export function assessReconstruction(g,observations,kernel=verifyExistingKernel()){
 const incidence=new Map(g.nodes.map(n=>[n.id,{incoming:[],outgoing:[],routes:[]}]))
 for(const e of g.edges){incidence.get(e.from).outgoing.push(e.id);incidence.get(e.to).incoming.push(e.id);}
 for(const r of g.routes)for(const id of new Set(r.edges.flatMap(id=>{const e=g.edges.find(e=>e.id===id);return [e.from,e.to];})))incidence.get(id).routes.push(r.id);
 const crossings=[...incidence].filter(([,n])=>n.routes.length>1||n.outgoing.length>1).map(([id,n])=>({id,...n}));
 const constraints=(observations?.series??[]).map(s=>({series_id:s.id,edge_id:s.edge_id,context:s.context,unit:s.unit,admitted:'observation_readout_only',cellular_flux_identified:false,bulk_net_index:s.direction==='signed_net_blood_region',operator_calibrated_to_P8:false}));
 return {schema:'poly.metabolic-reconstruction.v1',kernel,crossings,observation_constraints:constraints,data_calibrated_cellular_fluxes:0,full_chain_calibrated:false,inferred_cellular_direction:null,frontiers:g.edges.filter(e=>e.status!=='documented').map(e=>({edge_id:e.id,status:e.status})),necessary_constraints:['Concentrations et pH dans la même préparation','Volumes et entrées/sorties des compartiments','Capacités / cinétiques qualifiées','Production et utilisation indépendamment contraintes','Opérateur de chaque mesure et unités indépendantes'],cross_preparation_propagation:false};
}
