import {NativeThermalWorld,validateNativeRequest} from './native-thermal-world.mjs';
const TOKEN=Symbol(),canonical=x=>JSON.stringify(sort(x));
function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
const check=(ok,msg)=>{if(!ok)throw Error(msg);},sum=a=>a.reduce((s,v)=>s+v,0),max=a=>Math.max(0,...a.map(Math.abs));
function compare(a,b,request){
 const da=a.native_source.result,db=b.native_source.result,ma=a.modules[2],mb=b.modules[2];
 const controlRequest={...request,air_C:28,radiant_C:28};
 check(canonical(da.request)===canonical(request)&&canonical(db.request)===canonical(controlRequest),'Conditions de la paire incompatibles.');
 for(const key of ['profile','fixed_boundaries','initial_state_sha256','source_files_sha256','source_commit','nodes'])check(canonical(da[key])===canonical(db[key]),'Références incompatibles : '+key);
 check(canonical(a.modules.slice(0,2))===canonical(b.modules.slice(0,2)),'Autres lectures différentes.');
 check(da.steps.length===db.steps.length&&ma.clock.state_at_s===mb.clock.state_at_s,'Grilles temporelles différentes.');
 let boundaryEnergy=0,maxNodal=0,maxEnergy=0,maxPast=0;
 const transactions=a.transactions.map((sa,k)=>{
  const sb=b.transactions[k],dt=sa.interval.end_s-sa.interval.start_s;
  check(canonical(sa.interval)===canonical(sb.interval),'Instants natifs différents.');
  const nodes=sa.nodes.map((na,i)=>{
   const nb=sb.nodes[i];check(na.id===nb.id&&na.capacity_J_K===nb.capacity_J_K,'Identité ou capacité différente.');
   const before_K=na.before_C-nb.before_C,after_K=na.after_C-nb.after_C;
   const storage_W=na.storage_W-nb.storage_W,internal_net_W=na.internal_net_W-nb.internal_net_W,combined_forcing_net_W=na.combined_forcing_net_W-nb.combined_forcing_net_W;
   const balance=Math.abs(na.capacity_J_K*(after_K-before_K)/dt-internal_net_W-combined_forcing_net_W);maxNodal=Math.max(maxNodal,balance);check(balance<2e-7,'Bilan différentiel nodal refusé.');
   if(sa.interval.end_s<=request.start_s){maxPast=Math.max(maxPast,Math.abs(after_K));check(Math.abs(after_K)<1e-8,'Passé commun différent avant l’intervention.');}
   return {id:na.id,capacity_J_K:na.capacity_J_K,control_C:nb.after_C,intervention_C:na.after_C,difference_K:after_K,before_difference_K:before_K,
    difference_storage_W:storage_W,difference_internal_net_W:internal_net_W,difference_combined_forcing_net_W:combined_forcing_net_W};
  });
  const power=sum(nodes.map(n=>n.difference_combined_forcing_net_W));boundaryEnergy+=power*dt;
  const stateEnergy=sum(nodes.map(n=>n.capacity_J_K*n.difference_K)),energyError=Math.abs(stateEnergy-boundaryEnergy);
  maxEnergy=Math.max(maxEnergy,energyError);check(energyError<2e-7*sa.interval.end_s+2e-8,'Bilan différentiel énergétique refusé.');
  return {interval:structuredClone(sa.interval),control_boundaries:structuredClone(sb.boundaries),intervention_boundaries:structuredClone(sa.boundaries),nodes,
   difference_combined_forcing_W:power,difference_stored_energy_J:stateEnergy,cumulative_difference_boundary_energy_J:boundaryEnergy,energy_error_J:energyError};
 });
 const last=transactions.at(-1),module={id:'thermal-T4-native-comparison',kind:'paired_nonlinear_JOS3_results',profile:structuredClone(da.profile),fixed_boundaries:structuredClone(da.fixed_boundaries),
  request:structuredClone(request),control_request:controlRequest,initial_state_sha256:da.initial_state_sha256,source_commit:da.source_commit,
  clock:{basis:'matched_native_model_elapsed',state_at_s:request.duration_s,unit:'s',world_time_s:null},geometry_registration:null,parameters_fitted:false,
  state:structuredClone(last.nodes)};
 return {schema:'poly.native-thermal-pair-world.v1',world_id:a.world_id,world_time_s:null,
  modules:[...structuredClone(a.modules.slice(0,2)),module],
  native_sources:{intervention:structuredClone(a.native_source),control:structuredClone(b.native_source)},
  transactions,numerical_receipt:{intervention:structuredClone(a.numerical_receipt),control:structuredClone(b.numerical_receipt),
   max_difference_nodal_residual_W:maxNodal,max_difference_energy_error_J:maxEnergy,max_common_past_temperature_difference_K:maxPast},
  reference_source_pins:structuredClone(a.reference_source_pins),comparison:{sign:'intervention minus control',temperature_unit:'K',power_unit:'W',energy_unit:'J',native_grid_matched:true,mode:'input_parameterization',experimental_causal_effect:false},
  model_state_write:true,physiological_write:false,P1_execution:false,avatar_write:false,experimental_validation:false,global_rest_received:false,causal_join:false,synthetic_checkpoint_included:false,
  limits:['Both native trajectories use the same fixed T4 initial state, profile and integration grid; only the declared air/radiant inputs differ.',
   'Differences may persist after the imposed interval; return of boundaries is not a temperature reset.',
   'Native pair time alignment does not synchronize other modules, observations, or P2 ticks.',
   'Recorded operators are independently re-solved, not an independent implementation or human validation of thermoregulation.',
   'Imported provenance metadata cannot by itself prove program execution; no anatomical registration or avatar write.',
   'Two other elements are reference readings at their own initial native times, not captured live selections from another tab.']};
}
// One current register, accepting legacy T27 singles and T28 pairs. A staged first
// result never replaces that register; only a complete qualified pair can commit.
export class NativeThermalSession{
 #texts;#initial;#current;#pending=null;#epoch=0;#consultation=null;
 constructor(texts,initial,token){check(token===TOKEN,'Qualification préalable requise.');this.#texts={...texts};this.#initial=initial;this.#current=structuredClone(initial);}
 static async create(texts){const captured={...texts},w=await NativeThermalWorld.create(captured);return new NativeThermalSession(captured,w.read(),TOKEN);}
 async #single(raw,request){const w=await NativeThermalWorld.create(this.#texts);await w.receive(raw,request);return w.read();}
 read(){const d=structuredClone(this.#current);if(this.#consultation)d.native_consultation=structuredClone(this.#consultation);return d;}
 save(){return JSON.stringify(this.read());}
 #qualifiedConsultation(d,time){
  check(Number.isFinite(time)&&d.transactions.some(s=>s.interval.end_s===time),'Instant consulté absent de la grille native ; aucun arrondi.');
  return {basis:'native_model_elapsed',time_s:time,relation_to_commit:'read_only_consultation',world_time_s:null};
 }
 consult(time){this.#consultation=this.#qualifiedConsultation(this.#current,time);return this.read();}
 invalidate(){this.#epoch++;this.#pending=null;}
 clear(){this.invalidate();this.#current=structuredClone(this.#initial);this.#consultation=null;return this.read();}
 async receive(raw,request){const expected=structuredClone(validateNativeRequest(request));this.invalidate();const epoch=this.#epoch,next=await this.#single(raw,expected);check(epoch===this.#epoch,'Demande remplacée ou annulée.');this.#current=next;this.#consultation=null;return this.read();}
 async preparePair(raw,request){
  const expected=structuredClone(validateNativeRequest(request));this.invalidate();const epoch=this.#epoch,first=await this.#single(raw,expected);check(epoch===this.#epoch,'Paire remplacée ou annulée.');
  const ticket=Symbol();this.#pending={ticket,epoch,request:expected,first};return ticket;
 }
 async completePair(ticket,rawControl){
  const pending=this.#pending;check(pending&&ticket===pending.ticket&&pending.epoch===this.#epoch,'Première trajectoire absente ou annulée.');
  const control=await this.#single(rawControl,{...pending.request,air_C:28,radiant_C:28});
  check(this.#pending===pending&&pending.epoch===this.#epoch,'Seconde trajectoire remplacée ou annulée.');
  const next=compare(pending.first,control,pending.request);this.#current=next;this.#consultation=null;this.#pending=null;return this.read();
 }
 async receivePair(rawIntervention,rawControl,request){const ticket=await this.preparePair(rawIntervention,request);return this.completePair(ticket,rawControl);}
 async restore(text){
  check(typeof text==='string'&&new TextEncoder().encode(text).length<=8000000,'Registre absent ou supérieur à 8 Mo.');
  this.invalidate();const epoch=this.#epoch,d=JSON.parse(text);let next;
  check(d&&typeof d==='object'&&!Array.isArray(d),'Registre natif JSON attendu.');
  const consultation=d?.native_consultation;delete d.native_consultation;
  if(d?.schema==='poly.native-thermal-world.v1'){
   const w=await NativeThermalWorld.create(this.#texts);await w.restore(JSON.stringify(d));next=w.read();
  }else if(d?.schema==='poly.native-thermal-pair-world.v1'){
   const a=d.native_sources?.intervention?.result,b=d.native_sources?.control?.result;check(a&&b,'Deux sources natives requises.');
   const [first,second]=await Promise.all([this.#single(JSON.stringify(a),a.request),this.#single(JSON.stringify(b),b.request)]);
   next=compare(first,second,a.request);check(canonical(next)===canonical(d),'Comparaison altérée ; registre précédent conservé.');
  }else throw Error('Format de registre natif inconnu.');
  const cursor=consultation===undefined?null:this.#qualifiedConsultation(next,consultation?.time_s);
  if(cursor)check(canonical(cursor)===canonical(consultation),'Repère de consultation altéré ; état valide conservé.');
  check(epoch===this.#epoch,'Reprise remplacée ou annulée.');this.#current=next;this.#consultation=cursor;return this.read();
 }
}
