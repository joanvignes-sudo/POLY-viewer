import {validateResult,compareResults} from './temperature-reception.mjs';
const canonical=x=>JSON.stringify(sort(x));
const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
export async function decodeThermalRuntime(text,qualification){
 if(typeof text!=='string'||text.length>250000)throw Error('Export thermique trop volumineux ou invalide.');
 const d=JSON.parse(text);let result;
 if(d?.schema==='poly.thermal-result.v1')result=validateResult(d,d.request,qualification);
 else if(d?.schema==='poly.thermal-comparison.v1'){
  result=compareResults(d.intervention,d.control,qualification);
  if(canonical(d)!==canonical(result))throw Error('Comparaison altérée : écarts ou métadonnées incompatibles.');
 }else if(d?.schema==='poly.thermal-runtime-reading.v1')throw Error('Ce fichier est un relevé isolé. Importer un export de calcul ou de comparaison T4 pour reprendre une trajectoire.');
 else throw Error('Format thermique T4 incompatible ; aucun checkpoint P2 accepté ici.');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
 return {result,sha256:Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')};
}
export function thermalRuntimeReading(source,index){
 const pair=source.result.schema==='poly.thermal-comparison.v1',run=pair?source.result.intervention:source.result;
 if(!Number.isInteger(index)||index<0||index>=run.rows.length)throw Error('Échantillon natif inconnu ; aucune interpolation.');
 const row=run.rows[index];
 const reading={schema:'poly.thermal-runtime-reading.v1',module:'thermal-T4',source:{sha256:source.sha256,initial_state_sha256:run.initial_state_sha256,source_commit:run.source_commit},profile:structuredClone(run.profile),request:structuredClone(run.request),
  clock:{kind:'model_native',elapsed_s:row[0],world_time_s:null},location:{kind:'model_compartments',skin:'weighted mean of 17 native skin compartments',central_blood:'native central blood compartment',human_geometry:null},
  values:{skin_mean_C:row[1],central_blood_C:row[2],air_C_previous_step:row[3],radiant_C_previous_step:row[4]},
  paired_comparison:pair,avatar_write:false,experimental_validation:false,synthetic_checkpoint_included:false};
 if(pair){reading.difference_K={skin:source.result.rows[index][1],central_blood:source.result.rows[index][2]};reading.control_C={skin:source.result.control.rows[index][1],central_blood:source.result.control.rows[index][2]};}
 return reading;
}
export function refuseThermalCoupling(){throw Error('U-CLOCK : correspondance temporelle et couplage physiologique non qualifiés.');}

// No kernel, avatar or existing PAR1.2 channel is passed into this reader.
export async function mountThermalRuntime(host){
 const section=document.createElement('section');section.id='p2-thermal-runtime';
 section.innerHTML='<h2>Thermique T4 · export local</h2><p>Lecture seule d’un calcul ou d’une comparaison T4 (PAR 1,4). Le canal de démonstration PAR 1,2 reste distinct. Aucun temps global ni commande de l’avatar.</p><p><a href="temperature-calcul.html" style="color:#90efd1">Ouvrir le calcul thermique</a></p><label>Importer un export thermique T4 <input id="runtime-import" type="file" accept=".json,application/json"></label><details><summary>Importer le JSON par copier-coller</summary><textarea id="runtime-text" aria-label="Export thermique T4 JSON" maxlength="250000" style="width:100%;min-height:100px"></textarea><button id="runtime-paste">Vérifier l’export thermique</button></details><p id="runtime-status" role="status">Aucun export T4 chargé.</p><label>Échantillon thermique T4 <input id="runtime-index" type="range" min="0" max="0" value="0" step="1" disabled></label><p id="runtime-values"></p><p id="runtime-source" style="overflow-wrap:anywhere"></p><button id="runtime-join">Vérifier le couplage de cette lecture</button><button id="runtime-export" disabled>Exporter cette lecture T4</button>';
 host.append(section);const $=id=>section.querySelector('#'+id);let source=null,generation=0,qualification;
 function draw(){
  if(!source)return;const v=thermalRuntimeReading(source,Number($('runtime-index').value));
  $('runtime-values').textContent=`Temps natif ${v.clock.elapsed_s} s · peau moyenne ${v.values.skin_mean_C.toFixed(6)} °C · sang central ${v.values.central_blood_C.toFixed(6)} °C.${v.paired_comparison?` Écart intervention − témoin : peau ${v.difference_K.skin.toFixed(6)} K ; sang central ${v.difference_K.central_blood.toFixed(6)} K.`:''} Temps global inconnu.`;
  $('runtime-source').textContent=`T4 · PAR ${v.profile.PAR} · état initial SHA-256 ${v.source.initial_state_sha256} · export SHA-256 ${v.source.sha256}. Position anatomique humaine non qualifiée ; aucune validation expérimentale.`;
 }
 try{const r=await fetch('temperature-qualification.json',{cache:'no-store'});if(!r.ok)throw Error('Qualification indisponible');qualification=await r.json();}
 catch(e){$('runtime-status').textContent='Lecteur T4 indisponible : '+e.message;$('runtime-import').disabled=true;$('runtime-paste').disabled=true;return;}
 async function receive(text,current=++generation){
  try{const next=await decodeThermalRuntime(text,qualification);if(current!==generation)return;
   source=next;const run=next.result.intervention||next.result;$('runtime-index').max=run.rows.length-1;$('runtime-index').value=0;$('runtime-index').disabled=false;$('runtime-export').disabled=false;draw();
   $('runtime-status').textContent='Export T4 vérifié ; horloge native conservée. Le scénario P2 et les autres lectures sont inchangés.';
  }catch(e){if(current===generation)$('runtime-status').textContent='Import T4 refusé : '+e.message+' La lecture précédente et P2 sont conservés.';}
 }
 $('runtime-paste').onclick=()=>receive($('runtime-text').value);
 $('runtime-import').onchange=async()=>{const file=$('runtime-import').files?.[0];if(!file)return;const current=++generation;try{if(file.size>250000)throw Error('Fichier trop volumineux');const text=await file.text();if(current===generation)await receive(text,current);}catch(e){if(current===generation)$('runtime-status').textContent='Import T4 refusé : '+e.message+' La lecture précédente et P2 sont conservés.';}finally{if(current===generation)$('runtime-import').value='';}};
 $('runtime-index').oninput=draw;
 $('runtime-join').onclick=()=>{try{refuseThermalCoupling();}catch(e){$('runtime-status').textContent=e.message+' P2 reste inchangé.';}};
 $('runtime-export').onclick=()=>{if(!source)return;const v=thermalRuntimeReading(source,Number($('runtime-index').value)),url=URL.createObjectURL(new Blob([JSON.stringify(v,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_lecture_thermique_T4.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
