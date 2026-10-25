import {mountThermalWorldPreview} from './thermal-world-preview.mjs';
import {validateRequest} from './temperature-reception.mjs';
const canonical=x=>JSON.stringify(sort(x));const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
const check=(ok,message)=>{if(!ok)throw Error(message);};const finite=Number.isFinite;
export function validateThermalExchange(d,q){
 check(d?.schema==='poly.thermal-state-exchange.v1'&&q?.schema==='poly.thermal-exchange-qualification.v1','Contrat thermique inconnu.');validateRequest(d.request);check(canonical(Object.keys(d).sort())===canonical(["avatar_write", "boundary_mode", "capacity_unit", "experimental_validation", "fixed_boundaries", "geometry_registration", "initial_state_sha256", "interpretation", "interval", "nodes", "parameters_fitted", "power_unit", "profile", "request", "run_id", "schema", "source_commit", "source_files_sha256", "state_unit", "steps", "time", "world_id", "world_state_write"]),'Champs de contrat incompatibles.');
 check(d.boundary_mode==='input_parameterization'&&d.interval==='half-open; input at step start, state at step end','Mode de frontière incompatible.');
 check(d.world_id==='POLY:WORLD:research'&&typeof d.run_id==='string'&&d.run_id.length>0&&d.time?.basis==='native_model_elapsed'&&d.time.unit==='s'&&d.time.world_time_s===null&&d.state_unit==='degC'&&d.capacity_unit==='J/K'&&d.power_unit==='W','Identité, temps ou unités incompatibles.');
 check(d.avatar_write===false&&d.world_state_write===false&&d.experimental_validation===false&&d.geometry_registration===null&&d.parameters_fitted===false,'Portée physiologique incompatible.');
 for(const key of ['initial_state_sha256','source_files_sha256','source_commit','profile','fixed_boundaries','nodes'])check(canonical(d[key])===canonical(q[key]),'Provenance native incompatible : '+key);
 check(d.nodes.length===85&&q.initial_temperature_C.length===85&&d.nodes.every((n,i)=>n.index===i&&n.capacity_J_K>0&&finite(n.capacity_J_K)&&n.geometry_registration===null),'Compartiments natifs incomplets.');
 check(Array.isArray(d.steps)&&d.steps.length===d.request.duration_s/d.request.step_s,'Grille incomplète.');let maxNode=0,maxGlobal=0,maxInternal=0;
 const vector=a=>Array.isArray(a)&&a.length===85&&a.every(v=>typeof v==='number'&&finite(v));
 d.steps.forEach((s,k)=>{
  const dt=d.request.step_s,start=k*dt,active=d.request.start_s<=start&&start<d.request.end_s;
  check(s.start_s===start&&s.end_s===start+dt&&s.air_C===(active?d.request.air_C:28)&&s.radiant_C===(active?d.request.radiant_C:28),'Frontière ou intervalle incompatible.');
  for(const key of ['temperature_before_C','temperature_after_C','combined_source_W','boundary_coefficient_W_K','internal_net_W','boundary_and_generation_net_W','storage_W'])check(vector(s[key]),'Vecteur invalide : '+key);
  check(canonical(s.temperature_before_C)===canonical(k?d.steps[k-1].temperature_after_C:q.initial_temperature_C),'État discontinu.');
  check(Array.isArray(s.operator_edges)&&s.operator_edges.length<=85*84,'Opérateur invalide.');const internal=Array(85).fill(0),seen=new Set();
  for(const edge of s.operator_edges){check(Array.isArray(edge)&&edge.length===3,'Coefficient invalide.');const [from,to,g]=edge,key=from+':'+to;check(Number.isInteger(from)&&from>=0&&from<85&&Number.isInteger(to)&&to>=0&&to<85&&from!==to&&typeof g==='number'&&finite(g)&&g>0&&!seen.has(key),'Identité ou coefficient invalide.');seen.add(key);internal[to]+=g*(s.temperature_after_C[from]-s.temperature_after_C[to]);}
  let sumStorage=0,sumBoundary=0,sumInternal=0;
  for(let i=0;i<85;i++){const h=s.boundary_coefficient_W_K[i];check(h>=-1e-10&&(d.nodes[i].layer==='skin'||Math.abs(h)<1e-7),'Frontière hors peau non qualifiée.');const storage=d.nodes[i].capacity_J_K*(s.temperature_after_C[i]-s.temperature_before_C[i])/dt,boundary=s.combined_source_W[i]-h*s.temperature_after_C[i];
   const residual=Math.max(Math.abs(storage-internal[i]-boundary),Math.abs(storage-s.storage_W[i]),Math.abs(internal[i]-s.internal_net_W[i]),Math.abs(boundary-s.boundary_and_generation_net_W[i]));maxNode=Math.max(maxNode,residual);check(residual<1e-7,'Bilan nodal refusé.');sumStorage+=storage;sumBoundary+=boundary;sumInternal+=internal[i];}
  maxGlobal=Math.max(maxGlobal,Math.abs(sumStorage-sumBoundary));maxInternal=Math.max(maxInternal,Math.abs(sumInternal));check(Math.abs(sumInternal)<1e-7&&Math.abs(sumStorage-sumBoundary)<1e-7,'Conservation globale refusée.');
  check(finite(s.linear_solve_difference_K)&&s.linear_solve_difference_K>=0&&s.linear_solve_difference_K<1e-8&&finite(s.linear_relative_residual)&&s.linear_relative_residual>=0&&s.linear_relative_residual<1e-12,'Recette linéaire refusée.');
 });
 return {max_node_residual_W:maxNode,max_global_residual_W:maxGlobal,max_internal_sum_W:maxInternal,steps:d.steps.length,nodes:85,physiological_validation:false};
}
if(typeof document!=='undefined'&&document.getElementById('exchange-status')){
 const $=id=>document.getElementById(id);try{
  const load=async p=>{const r=await fetch(p);if(!r.ok)throw Error('Fichier indisponible : '+p);return r.json();};
  const [q,control,air]=await Promise.all([load('thermal-exchange-qualification.json'),load('thermal-exchange-control.json'),load('thermal-exchange-air.json')]);const runs={control,air};for(const d of Object.values(runs))validateThermalExchange(d,q);
  function draw(){const d=runs[$('exchange-run').value],s=d.steps[Number($('exchange-step').value)],receipt=validateThermalExchange(d,q);$('exchange-status').textContent=`Bilan numérique vérifié : 85 compartiments, ${receipt.steps} pas ; résidu nodal maximal ${receipt.max_node_residual_W.toExponential(2)} W. Aucune validation physiologique.`;
   $('exchange-summary').textContent=`Intervalle natif [${s.start_s}, ${s.end_s}) s ; air ${s.air_C} °C, rayonnement ${s.radiant_C} °C. Stockage total ${s.storage_W.reduce((a,b)=>a+b,0).toFixed(6)} W ; terme combiné frontières + génération ${s.boundary_and_generation_net_W.reduce((a,b)=>a+b,0).toFixed(6)} W. Temps global inconnu.`;
   $('exchange-body').replaceChildren(...d.nodes.map((n,i)=>{const row=document.createElement('tr');for(const v of [n.id,n.capacity_J_K.toFixed(3),s.temperature_before_C[i].toFixed(6),s.temperature_after_C[i].toFixed(6),s.storage_W[i].toFixed(6),s.internal_net_W[i].toFixed(6),s.boundary_and_generation_net_W[i].toFixed(6)]){const cell=document.createElement('td');cell.textContent=v;row.append(cell);}return row;}));}
  $('exchange-run').onchange=draw;$('exchange-step').oninput=draw;draw();await mountThermalWorldPreview(document.querySelector('main')||document.body,runs,q,validateThermalExchange,()=>({key:$('exchange-run').value,index:Number($('exchange-step').value)}));
  $('exchange-export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(runs[$('exchange-run').value],null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_T13_echange_natif.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 }catch(e){$('exchange-status').textContent='Échange refusé : '+e.message;$('exchange-export').disabled=true;}
}
