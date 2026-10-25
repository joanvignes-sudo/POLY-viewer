import {restoreC4Spatial} from './c4-spatial-core.mjs';
import {c4Reading} from './c4-reading.mjs';
import {HYPOTHESES} from './recycling-hypotheses-core.mjs';

// Dependency graph of the existing conditional balance, not molecular events.
export function createC4Lineage(value){
 const receipt=restoreC4Spatial(value);
 const prefix=`c4:${receipt.request.cycle_umol_g_min}:${receipt.request.seed}`;
 return {snapshot(index,hypothesis){
  const reading=c4Reading(receipt,index,hypothesis),nodes=[];
  const base={time:{tau:reading.tau,unit:'1',human_time:null},location:{frame:'normalized model compartments',anatomical_registration:false},source:{doi:receipt.source.doi,law:'POLY conditional single-pool extension of stationary balance'},unknowns:['Compatible neuronal pool for human minutes','Original human forcing timecourse','Cellular coordinates and molecular event counts']};
  const id=key=>`${prefix}:i${index}:${key}`;
  function add(key,label,value,unit,parents,law,origin='model_derived',compartment='neuronal C4 pool'){
   const node={id:id(key),key,label,value,unit,parents:parents.map(id),law,origin,...structuredClone(base)};
   node.location.compartment=compartment;nodes.push(node);return node.id;
  }
  add('pulse','Programme imposé',null,'protocol',[],'u=0.104 on [0,2), then 0','analyst_hypothesis','glial source');
  add('source','Source marquée à cet instant',reading.source_fraction,'fraction', ['pulse'],'u(τ), right-hand value at τ=2','analyst_hypothesis','glial source');
  function branch(h){
   const sample=receipt.series.find(s=>s.hypothesis===h).samples[index],definition=HYPOTHESES.find(x=>x.id===h);
   const ratio=(definition.extra===null?0:receipt.request.cycle_umol_g_min*(1+definition.extra))/.8;
   add(h+':ratio','Rapport de transfert · '+definition.label,ratio,'1',[],'r=T/Vn; route weights are scenario hypotheses','model_parameter');
   add(h+':initial','Marquage initial',receipt.protocol.initial_F,'fraction',[],'F(0)=0','analyst_hypothesis');
   add(h+':in','Entrée cumulée',sample[2],'normalized pool fraction',[h+':ratio','pulse'],'Integral from 0 to τ of r*u; existing analytical trajectory');
   add(h+':out','Sortie cumulée',sample[3],'normalized pool fraction',[h+':ratio','pulse',h+':initial'],'Integral from 0 to τ of (1+r)*F; existing analytical trajectory');
   add(h+':retained','Marquage retenu · '+definition.label,sample[1],'fraction',[h+':initial',h+':in',h+':out'],'F=F(0)+cumulative input-cumulative output');
  }
  branch(hypothesis);if(hypothesis!=='gln')branch('gln');
  add('entry','Entrée instantanée',reading.entry_per_tau,'fraction/tau',[hypothesis+':ratio','source'],'entry=r*u');
  add('exit','Sortie / dilution instantanée',reading.exit_per_tau,'fraction/tau',[hypothesis+':ratio',hypothesis+':retained'],'exit=(1+r)*F');
  add('net','Variation instantanée',reading.net_per_tau,'fraction/tau',['entry','exit'],'dF/dτ=entry-exit');
  add('difference','Écart à Glu/Gln',reading.difference_fraction,'fraction',[hypothesis+':retained','gln:retained'],'F(selected)-F(Glu/Gln), same τ and source');
  return {schema:'poly.c4-lineage.v1',request:{...receipt.request},index,hypothesis,tau:reading.tau,phase:reading.phase,nodes,roots:{net:id('net'),retained:id(hypothesis+':retained'),difference:id('difference')},scope:{dependency_graph_only:true,experimental_causality:false,molecular_event_count:null,gross_reaction_counts:null,human_minutes:null,energy_W:null,ATP:null},balance_residual:reading.cumulative_balance_residual};
 }};
}

export function traceC4Parents(snapshot,nodeId){
 if(snapshot?.schema!=='poly.c4-lineage.v1'||!Array.isArray(snapshot.nodes))throw Error('Journal de filiation incompatible');
 const byId=new Map(snapshot.nodes.map(n=>[n.id,n]));
 if(byId.size!==snapshot.nodes.length||!byId.has(nodeId))throw Error('Identité de filiation inconnue ou répétée');
 const visited=new Set(),active=new Set(),ordered=[];
 function visit(id){
  if(active.has(id))throw Error('Cycle dans le journal de filiation');
  if(visited.has(id))return;
  const node=byId.get(id);if(!node||!Array.isArray(node.parents))throw Error('Parent de filiation absent');
  active.add(id);for(const p of node.parents)visit(p);active.delete(id);visited.add(id);ordered.push(node);
 }
 visit(nodeId);return ordered;
}
