import {validateThermalExchange} from './thermal-exchange.mjs';
import {readResearchSource,lightExchange,thermalExchange} from './research-exchange.mjs';

// Pin the received operator trajectories. Recomputing these operators from a changed
// state requires the full nonlinear solver and is outside this adapter's authority.
const PINS = {"thermal-exchange-qualification.json": "5592ef752821ccdb0b9679745a03592bad1e17e24f4fe0ace37ff630d9756843", "thermal-exchange-air.json": "0c7bf9d1e051d2c1a9bb41dc7d804df3da3510b51ac665959a16d0b04f881d28", "thermal-exchange-control.json": "42fba743d3d742102f5b4a492acc59652df9bfe5f92324b39228d106120945d2", "experience-lumiere.json": "4937612857def19fc1d7b93635597cbfd14269f8782a420a33462235835895ca", "temperature-recherche.json": "567b908ed19cb009035acbe7dde01f56a96af337798a160968fe4b1444248d91"};
const WORLD='POLY:WORLD:research', ID='thermal-T4-computed', TOKEN=Symbol();
const canonical=x=>JSON.stringify(sort(x));
function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
const require=(ok,message)=>{if(!ok)throw Error(message);};
const sum=a=>a.reduce((s,x)=>s+x,0), max=a=>Math.max(...a.map(Math.abs));
async function digest(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}

// Partial pivoting; copies inputs. This does not call the JOS-3 Python solve.
export function solveLinear(A,b){
 const n=b.length;require(n>0&&A.length===n&&A.every(r=>r.length===n),'Dimensions linéaires incompatibles.');
 const m=A.map((r,i)=>[...r,b[i]]);require(m.every(r=>r.every(Number.isFinite)),'Coefficient non fini.');
 for(let k=0;k<n;k++){
  let p=k;for(let i=k+1;i<n;i++)if(Math.abs(m[i][k])>Math.abs(m[p][k]))p=i;
  require(Math.abs(m[p][k])>Number.EPSILON,'Système singulier.');[m[k],m[p]]=[m[p],m[k]];
  for(let i=k+1;i<n;i++){const f=m[i][k]/m[k][k];m[i][k]=0;for(let j=k+1;j<=n;j++)m[i][j]-=f*m[k][j];}
 }
 const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let v=m[i][n];for(let j=i+1;j<n;j++)v-=m[i][j]*x[j];x[i]=v/m[i][i];}
 require(x.every(Number.isFinite),'Solution non finie.');return x;
}

export class ThermalModelWorld{
 #runs;#qualification;#base;#key='air';#state;#ledger=[];#step=0;
 constructor(runs,q,base,token){require(token===TOKEN,'Qualification préalable requise.');this.#runs=runs;this.#qualification=q;this.#base=structuredClone(base);this.reset();}
 static async create(texts){
  const data={};for(const [name,pin]of Object.entries(PINS)){
   const text=texts[name];require(typeof text==='string'&&new TextEncoder().encode(text).length<500000,'Source absente ou trop volumineuse : '+name);
   require(await digest(text)===pin,'Source différente du périmètre reçu : '+name);data[name]=JSON.parse(text);
  }
  const q=data['thermal-exchange-qualification.json'];
  const runs={air:data['thermal-exchange-air.json'],control:data['thermal-exchange-control.json']};
  for(const d of Object.values(runs))validateThermalExchange(d,q);
  const light=await readResearchSource(texts['experience-lumiere.json'],'light'),thermal=await readResearchSource(texts['temperature-recherche.json'],'thermal');
  const context={worldId:WORLD,runId:'P2-read-only'};
  const base=[lightExchange(light,{...context,scenarioId:light.data.scenarios[0].id,index:0}),thermalExchange(thermal,{...context,step:60,index:0})];
  return new ThermalModelWorld(runs,q,base,TOKEN);
 }
 reset(key=this.#key){require(Object.hasOwn(this.#runs,key),'Scénario non qualifié.');this.#key=key;this.#state=[...this.#qualification.initial_temperature_C];this.#step=0;this.#ledger=[];return this.read();}
 advance(){
  const d=this.#runs[this.#key],s=d.steps[this.#step];require(s,'Fin de la trajectoire reçue : aucun opérateur extrapolé.');
  require(max(this.#state.map((v,i)=>v-s.temperature_before_C[i]))<1e-8,'État hors de la trajectoire qualifiée.');
  const before=[...this.#state],dt=s.end_s-s.start_s,C=d.nodes.map(n=>n.capacity_J_K);
  const A=C.map((c,i)=>Array.from({length:85},(_,j)=>i===j?c/dt+s.boundary_coefficient_W_K[i]:0));
  for(const [from,to,g]of s.operator_edges){A[to][to]+=g;A[to][from]-=g;}
  const b=C.map((c,i)=>c/dt*before[i]+s.combined_source_W[i]),after=solveLinear(A,b);
  const internal=Array(85).fill(0);for(const [from,to,g]of s.operator_edges)internal[to]+=g*(after[from]-after[to]);
  const storage=C.map((c,i)=>c*(after[i]-before[i])/dt),forcing=after.map((t,i)=>s.combined_source_W[i]-s.boundary_coefficient_W_K[i]*t);
  const nodal=max(storage.map((p,i)=>p-internal[i]-forcing[i])),global=Math.abs(sum(storage)-sum(forcing)),internalSum=Math.abs(sum(internal));
  const referenceDifference=max(after.map((t,i)=>t-s.temperature_after_C[i]));
  const residual=max(A.map((r,i)=>sum(r.map((a,j)=>a*after[j]))-b[i]));
  const normA=Math.max(...A.map(r=>sum(r.map(Math.abs)))),relative=residual/(normA*max(after)+max(b));
  require(nodal<1e-7&&global<1e-7&&internalSum<1e-7&&referenceDifference<1e-8&&relative<1e-12,'Recette du pas refusée ; état précédent conservé.');
  const energyDelta=sum(C.map((c,i)=>c*(after[i]-this.#qualification.initial_temperature_C[i])));
  const boundaryEnergy=sum(this.#ledger.map(t=>t.boundary_energy_J))+sum(forcing)*dt;
  require(Math.abs(energyDelta-boundaryEnergy)<1e-5,'Bilan énergétique cumulé refusé ; état précédent conservé.');
  const transaction={id:d.run_id+':computed:'+s.end_s,source_run:d.run_id,source_sha256:PINS['thermal-exchange-'+this.#key+'.json'],
   interval:{start_s:s.start_s,end_s:s.end_s,unit:'s',basis:'native_model_elapsed',world_time_s:null},
   boundaries:{air_C:s.air_C,radiant_C:s.radiant_C},
   nodes:d.nodes.map((n,i)=>({id:n.id,capacity_J_K:C[i],before_C:before[i],after_C:after[i],storage_W:storage[i],internal_net_W:internal[i],combined_forcing_net_W:forcing[i]})),
   internal_operator_edges:s.operator_edges.length,boundary_energy_J:sum(forcing)*dt,stored_energy_J:sum(storage)*dt,
   cumulative_energy_delta_J:energyDelta,cumulative_boundary_energy_J:boundaryEnergy,
   receipt:{max_nodal_residual_W:nodal,global_residual_W:global,internal_sum_W:internalSum,reference_difference_K:referenceDifference,linear_relative_residual:relative,cumulative_energy_error_J:Math.abs(energyDelta-boundaryEnergy)}};
  // Commit the 85 states, native time and complete transaction together after admission.
  this.#state=after;this.#step++;this.#ledger.push(transaction);return this.read();
 }
 read(){
  const d=this.#runs[this.#key],time=this.#step?d.steps[this.#step-1].end_s:0;
  return {schema:'poly.research-model-world.v1',world_id:WORLD,world_time_s:null,
   modules:[...this.#base.map(record=>({id:record.module,kind:'precomputed_reading',record:structuredClone(record)})),
    {id:ID,kind:'received_linear_operator_execution',source_run:d.run_id,scenario:this.#key,
     profile:structuredClone(d.profile),fixed_boundaries:structuredClone(d.fixed_boundaries),initial_state_sha256:d.initial_state_sha256,source_commit:d.source_commit,source_files_sha256:structuredClone(d.source_files_sha256),parameters_fitted:false,
     source_sha256:PINS['thermal-exchange-'+this.#key+'.json'],clock:{basis:'native_model_elapsed',state_at_s:time,world_time_s:null},
     state:d.nodes.map((n,i)=>({id:n.id,temperature_C:this.#state[i],capacity_J_K:n.capacity_J_K})),geometry_registration:null}],
   step_index:this.#step,transactions:structuredClone(this.#ledger),source_pins:{...PINS},
   permissions:{write_native_model_state:true,execute_P1:false,write_avatar:false,join_world_clock:false,replace_other_modules:false},
   physiological_write:false,experimental_validation:false,global_rest_received:false,causal_join:false,synthetic_checkpoint_included:false,
   limits:['Operators imposed from the received JOS-3 trajectory; not a fresh nonlinear thermoregulation solve.',
    'No changed initial state, boundary, conductance or extrapolated step admitted.',
    'Combined forcing includes generation, losses and imposed boundaries; it is not metabolism alone.',
    'Directed operator terms are model heat contributions, not observed anatomical connections.',
    'Two reference readings retain their native initial times; no cross-module synchronization.']};
 }
 save(){return JSON.stringify(this.read(),null,2);}
 restore(text){
  require(typeof text==='string'&&new TextEncoder().encode(text).length<250000,'Reprise invalide ou trop volumineuse.');
  const value=JSON.parse(text),key=value?.modules?.find(m=>m.id===ID)?.scenario,index=value?.step_index;
  require(Object.hasOwn(this.#runs,key)&&Number.isInteger(index)&&index>=0&&index<=this.#runs[key].steps.length,'Reprise hors trajectoire.');
  const candidate=new ThermalModelWorld(this.#runs,this.#qualification,this.#base,TOKEN);candidate.reset(key);for(let i=0;i<index;i++)candidate.advance();
  require(canonical(candidate.read())===canonical(value),'Reprise altérée ; état précédent conservé.');
  this.#key=key;this.#step=candidate.#step;this.#state=candidate.#state;this.#ledger=candidate.#ledger;return this.read();
 }
 get finished(){return this.#step===this.#runs[this.#key].steps.length;}
}

async function mount(host){
 host.innerHTML='<h2>Calculer et conserver l’état thermique natif</h2><p>Les 85 températures sont recalculées ensemble, puis enregistrées avec leurs bilans dans un module du registre de recherche. Deux lectures de référence lumière et thermique restent conservées à leurs temps initiaux propres.</p><p><strong>Opérateurs imposés par pas depuis les trajectoires JOS-3 reçues, sur 120 secondes.</strong> Ce recalcul linéaire vérifie un raccord numérique ; il ne recalcule pas les régulations non linéaires pour une nouvelle condition. Aucun couplage à l’avatar ou aux ticks P2.</p><label>Trajectoire reçue <select id="model-scenario"><option value="air">Air à 26 °C sur [0,60) s, puis 28 °C</option><option value="control">Référence constante à 28 °C</option></select></label><button id="model-advance" disabled>Calculer le pas suivant · 30 s</button><button id="model-reset" disabled>Revenir à l’état initial</button><p id="model-status" role="status">Qualification des sources…</p><p id="model-values"></p><p id="model-balance"></p><details><summary>Les 85 états et leur dernier bilan</summary><div style="overflow:auto"><table><thead><tr><th>Identité native</th><th>Température °C</th><th>Stockage W</th><th>Transfert interne W</th><th>Forçage combiné net W</th></tr></thead><tbody id="model-body"></tbody></table></div></details><button id="model-export" disabled>Exporter le registre et les échanges</button><details><summary>Reprendre un registre vérifié</summary><label>Registre exporté <input id="model-import" type="file" accept=".json,application/json"></label></details><p>La reprise recalcule les pas avant d’accepter les valeurs. Un fichier altéré laisse le dernier état valide intact. Localisations anatomiques et temps commun inconnus ; aucune validation physiologique. Les forçages combinent production, pertes et frontières. Les transferts sont ceux de l’opérateur natif.</p>';
 const $=id=>host.querySelector('#'+id);let model,generation=0;
 function draw(){const d=model.read(),m=d.modules.find(x=>x.id===ID),last=d.transactions.at(-1);$('model-values').textContent=`${d.modules.length} modules conservés · ${d.step_index}/4 pas · temps thermique natif ${m.clock.state_at_s} s. Sang central : ${m.state[0].temperature_C.toFixed(6)} °C. Temps du monde inconnu.`;
  $('model-balance').textContent=last?`Énergie stockée depuis l’origine : ${last.cumulative_energy_delta_J.toFixed(6)} J ; écart du bilan ${last.receipt.cumulative_energy_error_J.toExponential(2)} J. Résidu nodal maximal ${last.receipt.max_nodal_residual_W.toExponential(2)} W. Accord au calcul JOS-3 reçu : ${last.receipt.reference_difference_K.toExponential(2)} K.`:'État T4 initial ; aucun pas encore calculé.';
  $('model-body').replaceChildren(...m.state.map((n,i)=>{const tr=document.createElement('tr'),flow=last?.nodes[i];for(const v of [n.id,n.temperature_C.toFixed(6),...['storage_W','internal_net_W','combined_forcing_net_W'].map(k=>flow?flow[k].toFixed(6):'—')]){const td=document.createElement('td');td.textContent=v;tr.append(td);}return tr;}));$('model-advance').disabled=model.finished;$('model-reset').disabled=false;$('model-export').disabled=false;$('model-scenario').value=m.scenario;
 }
 try{const texts={};await Promise.all(Object.keys(PINS).map(async name=>{const r=await fetch(name,{cache:'no-store'});if(!r.ok)throw Error('Source absente : '+name);texts[name]=await r.text();}));model=await ThermalModelWorld.create(texts);draw();$('model-status').textContent='Sources exactes reçues ; état initial prêt. P1 physiologique reste verrouillé.';}
 catch(e){$('model-status').textContent='Calcul indisponible : '+e.message;$('model-scenario').disabled=true;$('model-import').disabled=true;return;}
 $('model-advance').onclick=()=>{generation++;try{model.advance();draw();$('model-status').textContent=model.finished?'Quatre pas recalculés et conservés. Aucun opérateur extrapolé.':'Pas reçu : 85 états et bilan enregistrés ensemble.';}catch(e){$('model-status').textContent='Pas refusé : '+e.message;}};
 $('model-reset').onclick=()=>{generation++;model.reset();draw();$('model-status').textContent='État initial restauré ; les deux autres lectures sont conservées.';};
 $('model-scenario').onchange=()=>{generation++;model.reset($('model-scenario').value);draw();$('model-status').textContent='Trajectoire changée : reprise depuis le même état T4 initial.';};
 $('model-export').onclick=()=>{const url=URL.createObjectURL(new Blob([model.save()],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='POLY_T26_registre_thermique.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 $('model-import').onchange=async()=>{const f=$('model-import').files?.[0];if(!f)return;const current=++generation;try{require(f.size<250000,'Reprise trop volumineuse.');const text=await f.text();if(current!==generation)return;model.restore(text);draw();$('model-status').textContent='Registre recalculé puis repris ; lectures, temps et bilans conservés.';}catch(e){if(current===generation)$('model-status').textContent='Reprise refusée : '+e.message;}finally{if(current===generation)$('model-import').value='';}};
}
if(typeof document!=='undefined'&&document.getElementById('thermal-model-state'))mount(document.getElementById('thermal-model-state'));
