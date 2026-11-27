// Computable difference report. Never promote scenario metadata to experimental causality.
import {p8Factors} from './reversible-lactate-core.mjs';
function linearEdges(model){
 const s=model.system,edges=new Map();
 for(let i=0;i<s.states.length;i++)for(let j=0;j<s.states.length;j++){
  if(i===j)continue;
  const rate=s.rate_matrix[i][j];
  if(rate>0)edges.set(s.states[j]+'→'+s.states[i],rate);
 }
 return edges;
}
export function explainModelChange(a,b){
 const changes=[];
 if(a.engine==='linear-mass-balance'&&b.engine==='linear-mass-balance'){
  const before=new Set(a.system.states),after=new Set(b.system.states);
  for(const name of after)if(!before.has(name))changes.push({kind:'added_compartment',detail:'Compartiment '+name+' ajouté au second modèle.'});
  for(const name of before)if(!after.has(name))changes.push({kind:'removed_compartment',detail:'Compartiment '+name+' absent du second modèle.'});
  const ea=linearEdges(a),eb=linearEdges(b);
  for(const [name,value] of eb){
   if(!ea.has(name))changes.push({kind:'added_transport',detail:'Transfert '+name+' ajouté (coefficient synthétique '+value+').'});
   else if(Math.abs(ea.get(name)-value)>1e-12)changes.push({kind:'changed_rate',detail:'Transfert '+name+' : coefficient '+ea.get(name)+' → '+value+' (temps synthétique).'});
  }
  for(const [name] of ea)if(!eb.has(name))changes.push({kind:'removed_transport',detail:'Transfert '+name+' absent du second modèle.'});
  return {status:'compared_topology_and_rates',changes,scope:'computed_from_declared_matrices',limitation:'Topologie et coefficients synthétiques ; aucune relation cellulaire biologiquement démontrée.'};
 }
 if(a.engine==='p8'&&b.engine==='p8'){
  const fa=p8Factors(3,a.scenario),fb=p8Factors(3,b.scenario);
  if(fa.capacity_AE!==fb.capacity_AE)changes.push({kind:'changed_rate',detail:'Capacité MCT_AE : facteur '+fa.capacity_AE+' → '+fb.capacity_AE+' entre t=2 et t=6.'});
  for(const key of ['A','E','N'])if(fa.pH[key]!==fb.pH[key])changes.push({kind:'changed_boundary',detail:'pH '+key+' imposé : '+fa.pH[key]+' → '+fb.pH[key]+' entre t=2 et t=6.'});
  return {status:'compared_boundaries',changes,scope:'computed_from_existing_P8_program',limitation:'Conditions d’un noyau synthétique ; aucune équivalence avec un temps ou un pH humain mesuré.'};
 }
 return {status:'not_structurally_comparable',changes:[],scope:'different_adapter_families',limitation:'Aucun rapprochement automatique entre les équations de solveurs différents.'};
}
