export const backgroundSHA='45a65186b8061622d76d01d29d128c81d7032140220722dac60ee229fc7bb18d';
const sum=a=>a.reduce((s,x)=>s+x,0);
const powers=['production_W','respiration_loss_W','evaporation_loss_W','dry_loss_implicit_W','dry_loss_before_step_W','internal_net_W','storage_W'];
export function validateBackground(d){
 if(d?.schema!=='poly.thermal-background.v1'||d.source_commit!=='3c74ee2af2f79aa360093cc517e38bf465ec8c5b'||d.experimental_validation!==false||d.avatar_write!==false||d.world_state_write!==false||d.geometry_registration!==null||d.time?.world_time_s!==null||d.time?.basis!=='native_model_elapsed')throw Error('Portée thermique incompatible.');
 if(d.nodes?.length!==85||d.capacity_J_K?.length!==85||!d.capacity_J_K.every(x=>Number.isFinite(x)&&x>0)||new Set(d.nodes.map(n=>n.id)).size!==85||!d.nodes.every((n,i)=>n.index===i))throw Error('Identités thermiques invalides.');
 for(const [name,dt] of [['reference',30],['intervention',30],['intervention_15',15]]){
  const r=d.runs?.[name];if(r?.steps?.length!==600/dt||r.request.step_s!==dt)throw Error('Trajectoire incomplète.');
  for(const [i,s]of r.steps.entries()){
   if(s.start_s!==i*dt||s.end_s!==(i+1)*dt)throw Error('Horloge native invalide.');
   const active=s.start_s>=120&&s.start_s<300,cold=name!=='reference';
   if(s.air_C!==(active&&cold?27.25:28)||s.radiant_C!==(active&&cold?26.75:28))throw Error('Conditions imposées modifiées.');
   for(const key of [...powers,'temperature_after_C'])if(s[key]?.length!==85||!s[key].every(Number.isFinite))throw Error('Vecteur non fini ou incomplet.');
   for(let j=0;j<85;j++){
    if(Math.abs(s.storage_W[j]-s.internal_net_W[j]-s.production_W[j]+s.respiration_loss_W[j]+s.evaporation_loss_W[j]+s.dry_loss_implicit_W[j])>1e-7)throw Error('Bilan local non reçu.');
    if(i&&Math.abs(s.storage_W[j]-d.capacity_J_K[j]*(s.temperature_after_C[j]-r.steps[i-1].temperature_after_C[j])/dt)>1e-7)throw Error('Stockage incohérent.');
   }
   if(Math.abs(sum(s.internal_net_W))>1e-7)throw Error('Transferts internes non conservatifs.');
  }
 }
 return true;
}
export function backgroundFrame(d,index){
 validateBackground(d);if(!Number.isInteger(index)||index<0||index>=20)throw Error('Instant absent.');
 const reference=d.runs.reference.steps[index],intervention=d.runs.intervention.steps[index],fine=d.runs.intervention_15.steps[2*index+1];
 const totals=s=>Object.fromEntries(powers.map(k=>[k,sum(s[k])]));
 const energy=r=>r.steps.slice(0,index+1).reduce((v,s)=>v+sum(s.storage_W)*(s.end_s-s.start_s),0);
 const regional=region=>{const indices=d.nodes.filter(n=>n.region===region).map(n=>n.index);return {region,node_ids:indices.map(i=>d.nodes[i].id),reference:Object.fromEntries(powers.map(k=>[k,sum(indices.map(i=>reference[k][i]))])),intervention:Object.fromEntries(powers.map(k=>[k,sum(indices.map(i=>intervention[k][i]))]))};};
 const regions=[...new Set(d.nodes.map(n=>n.region))].map(regional);
 return structuredClone({schema:'poly.thermal-background-frame.v1',source_sha256:backgroundSHA,native_end_s:intervention.end_s,previous_interval_s:[intervention.start_s,intervention.end_s],reference:totals(reference),intervention:totals(intervention),regions,energy_storage_J:{reference:energy(d.runs.reference),intervention:energy(d.runs.intervention)},skin_contrast_K:intervention.skin_mean_C-reference.skin_mean_C,central_blood_contrast_K:intervention.central_blood_C-reference.central_blood_C,max_30_vs_15_K:Math.max(...fine.temperature_after_C.map((v,i)=>Math.abs(v-intervention.temperature_after_C[i]))),world_time_s:null,experimental_validation:false,avatar_write:false,world_state_write:false});
}
export function regionalBackground(d,index,region){
 const frame=backgroundFrame(d,index),selected=frame.regions.find(r=>r.region===region);
 if(!selected)throw Error('Région native absente.');
 const nodeIndices=d.nodes.filter(n=>n.region===region).map(n=>n.index);
 const entries=nodeIndices.map(i=>({identity:structuredClone(d.nodes[i]),reference:{temperature_C:d.runs.reference.steps[index].temperature_after_C[i],...Object.fromEntries(powers.map(k=>[k,d.runs.reference.steps[index][k][i]]))},intervention:{temperature_C:d.runs.intervention.steps[index].temperature_after_C[i],...Object.fromEntries(powers.map(k=>[k,d.runs.intervention.steps[index][k][i]]))}}));
 return {schema:'poly.thermal-native-region.v1',source_sha256:backgroundSHA,native_end_s:frame.native_end_s,previous_interval_s:frame.previous_interval_s,region,totals:selected,entries,world_time_s:null,geometry_registration:null,avatar_write:false,experimental_validation:false};
}
if(typeof document!=='undefined'&&document.getElementById('background-status')){
 const status=document.getElementById('background-status');
 try{
  const response=await fetch('thermal-background.json',{cache:'no-store'});if(!response.ok)throw Error('Calcul indisponible.');const raw=await response.text();const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),x=>x.toString(16).padStart(2,'0')).join('');if(sha!==backgroundSHA)throw Error('Le calcul a changé ; nouvelle réception nécessaire.');
  const data=JSON.parse(raw);validateBackground(data);const select=document.getElementById('background-step');for(let i=0;i<20;i++){const o=document.createElement('option');o.value=i;o.textContent=(i+1)*30+' s';select.append(o);}select.value='0';
  const regionSelect=document.getElementById('background-region');for(const region of [...new Set(data.nodes.map(n=>n.region))]){const o=document.createElement('option');o.value=region;o.textContent=region;regionSelect.append(o);}regionSelect.value='Chest';
  const names={production_W:'Production métabolique (+)',respiration_loss_W:'Pertes respiratoires (−)',evaporation_loss_W:'Évaporation cutanée (−)',dry_loss_implicit_W:'Échange sec sortant (−)',storage_W:'Stockage net',internal_net_W:'Somme des transferts internes'};
  function render(){const frame=backgroundFrame(data,Number(select.value));
   const regional=regionalBackground(data,Number(select.value),regionSelect.value);document.getElementById('region-identity').textContent='Région native '+regional.region+' · '+regional.native_end_s+' s · '+regional.entries.length+' compartiments. Localisation géométrique inconnue ; aucune sélection HRA équivalente déduite.';const regionalNodes=document.getElementById('region-nodes');regionalNodes.replaceChildren();for(const entry of regional.entries){const tr=document.createElement('tr');for(const value of [entry.identity.id,entry.reference.temperature_C.toFixed(6),entry.intervention.temperature_C.toFixed(6),entry.intervention.production_W.toFixed(6),entry.intervention.internal_net_W.toFixed(6),(entry.intervention.respiration_loss_W+entry.intervention.evaporation_loss_W+entry.intervention.dry_loss_implicit_W).toFixed(6),entry.intervention.storage_W.toFixed(6)]){const td=document.createElement('td');td.textContent=value;tr.append(td);}regionalNodes.append(tr);}document.getElementById('region-export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(regional,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_T19_region_'+regional.region+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.getElementById('background-summary').textContent='Intervalle natif '+frame.previous_interval_s.join(' → ')+' s ; contraste peau '+frame.skin_contrast_K.toFixed(6)+' K, sang central '+frame.central_blood_contrast_K.toFixed(6)+' K. Écart maximal 30 s / 15 s : '+frame.max_30_vs_15_K.toFixed(6)+' K.';
   document.getElementById('background-energy').textContent='Énergie stockée cumulée depuis 0 s : référence '+frame.energy_storage_J.reference.toFixed(6)+' J ; intervention '+frame.energy_storage_J.intervention.toFixed(6)+' J. Un signe négatif indique une perte nette de chaleur du modèle.';
   const regionalBody=document.getElementById('background-regions');regionalBody.replaceChildren();for(const r of frame.regions){const tr=document.createElement('tr');for(const text of [r.region,r.node_ids.length,r.intervention.production_W.toFixed(6),r.intervention.internal_net_W.toFixed(6),(r.intervention.respiration_loss_W+r.intervention.evaporation_loss_W+r.intervention.dry_loss_implicit_W).toFixed(6),r.intervention.storage_W.toFixed(6)]){const td=document.createElement('td');td.textContent=String(text);tr.append(td);}regionalBody.append(tr);}
   const body=document.getElementById('background-body');body.replaceChildren();for(const [key,label]of Object.entries(names)){const tr=document.createElement('tr');for(const text of [label,frame.reference[key].toFixed(6),frame.intervention[key].toFixed(6)]){const td=document.createElement('td');td.textContent=text;tr.append(td);}body.append(tr);}
   document.getElementById('background-export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(frame,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_T18_fond_thermique.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  }select.onchange=render;regionSelect.onchange=render;render();document.getElementById('region-export').disabled=false;document.getElementById('background-export').disabled=false;status.textContent='Bilan des 85 compartiments vérifié sur 80 pas ; comparaison numérique, sans validation expérimentale.';
 }catch(e){status.textContent='Fond thermique non reçu : '+e.message;}
}
