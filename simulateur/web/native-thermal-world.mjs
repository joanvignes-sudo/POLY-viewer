import {validateRequest} from './temperature-reception.mjs';
import {validateThermalExchange} from './thermal-exchange.mjs';
import {solveLinear} from './thermal-model-state.mjs';
import {readResearchSource,lightExchange,thermalExchange} from './research-exchange.mjs';
const PINS={"thermal-exchange-qualification.json": "5592ef752821ccdb0b9679745a03592bad1e17e24f4fe0ace37ff630d9756843", "experience-lumiere.json": "4937612857def19fc1d7b93635597cbfd14269f8782a420a33462235835895ca", "temperature-recherche.json": "567b908ed19cb009035acbe7dde01f56a96af337798a160968fe4b1444248d91"},TOKEN=Symbol(),WORLD='POLY:WORLD:research',ID='thermal-T4-native-computed';
const canonical=x=>JSON.stringify(sort(x));function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
const check=(ok,message)=>{if(!ok)throw Error(message);},sum=a=>a.reduce((a,b)=>a+b,0),max=a=>Math.max(...a.map(Math.abs));
async function hash(text){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function validateNativeRequest(r){validateRequest(r);check(r.duration_s<=600&&r.duration_s/r.step_s<=40,'Calcul détaillé limité à 600 s et 40 pas.');return r;}
export class NativeThermalWorld{
 #q;#base;#native=null;#epoch=0;
 constructor(q,base,token){check(token===TOKEN,'Sources qualifiées requises.');this.#q=q;this.#base=base;}
 static async create(texts){
  for(const [name,pin]of Object.entries(PINS))check(typeof texts[name]==='string'&&await hash(texts[name])===pin,'Source de référence différente : '+name);
  const q=JSON.parse(texts['thermal-exchange-qualification.json']),light=await readResearchSource(texts['experience-lumiere.json'],'light'),thermal=await readResearchSource(texts['temperature-recherche.json'],'thermal');
  const c={worldId:WORLD,runId:'P2-read-only'},base=[lightExchange(light,{...c,scenarioId:light.data.scenarios[0].id,index:0}),thermalExchange(thermal,{...c,step:60,index:0})];
  return new NativeThermalWorld(q,base,TOKEN);
 }
 async #build(raw,request){
  validateNativeRequest(request);check(typeof raw==='string'&&new TextEncoder().encode(raw).length<=2000000,'Résultat détaillé absent ou supérieur à 2 Mo.');
  const d=JSON.parse(raw);check(canonical(d.request)===canonical(request),'Résultat associé à une autre demande.');
  const originalReceipt=validateThermalExchange(d,this.#q);check(d.steps.length<=40,'Trop de pas.');
  let before=[...this.#q.initial_temperature_C],boundaryEnergy=0,ledger=[],maxDifference=0,maxNodal=0,maxGlobal=0,maxEnergy=0;
  const C=d.nodes.map(n=>n.capacity_J_K),origin=[...before];
  for(const s of d.steps){
   const dt=s.end_s-s.start_s,A=C.map((c,i)=>Array.from({length:85},(_,j)=>i===j?c/dt+s.boundary_coefficient_W_K[i]:0));
   for(const [from,to,g]of s.operator_edges){A[to][to]+=g;A[to][from]-=g;}
   const b=C.map((c,i)=>c/dt*before[i]+s.combined_source_W[i]),after=solveLinear(A,b),internal=Array(85).fill(0);
   for(const [from,to,g]of s.operator_edges)internal[to]+=g*(after[from]-after[to]);
   const forcing=after.map((t,i)=>s.combined_source_W[i]-s.boundary_coefficient_W_K[i]*t),storage=C.map((c,i)=>c*(after[i]-before[i])/dt);
   const difference=max(after.map((t,i)=>t-s.temperature_after_C[i])),nodal=max(storage.map((v,i)=>v-internal[i]-forcing[i])),global=Math.abs(sum(storage)-sum(forcing)),internalSum=Math.abs(sum(internal));
   const residual=max(A.map((row,i)=>sum(row.map((v,j)=>v*after[j]))-b[i])),normA=Math.max(...A.map(row=>sum(row.map(Math.abs)))),relative=residual/(normA*max(after)+max(b));
   check(difference<1e-8&&nodal<1e-7&&global<1e-7&&internalSum<1e-7&&relative<1e-12,'Contre-calcul indépendant refusé.');
   boundaryEnergy+=sum(forcing)*dt;const delta=sum(C.map((c,i)=>c*(after[i]-origin[i]))),energyError=Math.abs(delta-boundaryEnergy);
   // Accumulated tolerance follows the admitted per-step global power error.
   check(energyError<1e-7*s.end_s+1e-8,'Énergie cumulée incompatible.');
   ledger.push({id:d.run_id+':accepted:'+s.end_s,interval:{start_s:s.start_s,end_s:s.end_s,unit:'s',basis:'native_model_elapsed',world_time_s:null},
    boundaries:{air_C:s.air_C,radiant_C:s.radiant_C},
    nodes:d.nodes.map((n,i)=>({id:n.id,before_C:before[i],after_C:after[i],capacity_J_K:C[i],storage_W:storage[i],internal_net_W:internal[i],combined_forcing_net_W:forcing[i]})),
    cumulative_boundary_energy_J:boundaryEnergy,cumulative_state_energy_J:delta,
    receipt:{source_temperature_difference_K:difference,max_nodal_residual_W:nodal,global_residual_W:global,internal_sum_W:internalSum,linear_relative_residual:relative,energy_error_J:energyError}});
   before=after;maxDifference=Math.max(maxDifference,difference);maxNodal=Math.max(maxNodal,nodal);maxGlobal=Math.max(maxGlobal,global);maxEnergy=Math.max(maxEnergy,energyError);
  }
  return {result:d,canonical_sha256:await hash(canonical(d)),transactions:ledger,
   module:{id:ID,kind:'nonlinear_JOS3_result_independently_recomputed',source_run:d.run_id,source_commit:d.source_commit,source_files_sha256:structuredClone(d.source_files_sha256),initial_state_sha256:d.initial_state_sha256,
    profile:structuredClone(d.profile),fixed_boundaries:structuredClone(d.fixed_boundaries),request:structuredClone(request),
    clock:{basis:'native_model_elapsed',state_at_s:request.duration_s,unit:'s',world_time_s:null},geometry_registration:null,parameters_fitted:false,
    state:d.nodes.map((n,i)=>({id:n.id,temperature_C:before[i],capacity_J_K:C[i]}))},
   receipt:{original:originalReceipt,steps:d.steps.length,nodes:85,max_independent_temperature_difference_K:maxDifference,max_nodal_residual_W:maxNodal,max_global_residual_W:maxGlobal,max_energy_error_J:maxEnergy}};
 }
 #snapshot(native=this.#native){return {schema:'poly.native-thermal-world.v1',world_id:WORLD,world_time_s:null,
  modules:[...this.#base.map(record=>({id:record.module,kind:'precomputed_reading',record:structuredClone(record)})),...(native?[structuredClone(native.module)]:[])],
  native_source:native?{canonical_sha256:native.canonical_sha256,result:structuredClone(native.result)}:null,
  transactions:native?structuredClone(native.transactions):[],numerical_receipt:native?structuredClone(native.receipt):null,
  reference_source_pins:{...PINS},model_state_write:true,physiological_write:false,P1_execution:false,avatar_write:false,experimental_validation:false,global_rest_received:false,causal_join:false,synthetic_checkpoint_included:false,
  limits:['Full native result received from isolated JOS-3 worker; independent linear re-solve checks its recorded operators, not an independent physiological implementation.',
   'Imported provenance is checked against declared source versions and numerical identities; file metadata alone cannot prove which program produced it.',
   'The two other records remain reference readings at their own initial native times, not live selections captured from another P2 tab.',
   'No HRA registration, common clock or physiological write authority. Combined forcing is not metabolism alone.']};}
 read(){return this.#snapshot();}
 invalidate(){this.#epoch++;}
 clear(){this.invalidate();this.#native=null;return this.read();}
 async receive(raw,request){const epoch=++this.#epoch,next=await this.#build(raw,request);check(epoch===this.#epoch,'Demande remplacée ou annulée.');this.#native=next;return this.read();}
 save(){return JSON.stringify(this.read());}
 async restore(text){
  const epoch=++this.#epoch;check(typeof text==='string'&&new TextEncoder().encode(text).length<=4000000,'Registre invalide ou supérieur à 4 Mo.');const d=JSON.parse(text);
  check(d?.schema==='poly.native-thermal-world.v1'&&d.native_source?.result,'Registre natif attendu.');
  const candidate=await this.#build(JSON.stringify(d.native_source.result),d.native_source.result.request);
  check(canonical(this.#snapshot(candidate))===canonical(d),'Registre altéré ; état valide conservé.');check(epoch===this.#epoch,'Reprise remplacée ou annulée.');this.#native=candidate;return this.read();
 }
}
