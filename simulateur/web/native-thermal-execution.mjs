import {validateNativeRequest} from './native-thermal-world.mjs';
import {NativeThermalSession} from './native-thermal-pair.mjs';
import {requestFrom} from './temperature-calcul.mjs';
const host=document.getElementById('native-thermal-execution');
if(host)mount(host);
async function mount(host){
 host.innerHTML='<h2>Calcul détaillé · 85 états et échanges</h2><p>Utilise les conditions saisies plus haut, avec le solveur JOS-3 complet dans un processus isolé. Domaine détaillé : 600 secondes et 40 pas au maximum, depuis le même état T4. L’option « Comparer à un témoin inchangé » ci-dessus lance deux calculs détaillés isolés. La paire n’est conservée qu’après réception des deux ; un échec garde le registre précédent.</p><p>Avant réception, chaque pas est recalculé indépendamment à partir de son opérateur et ses bilans sont vérifiés. Les 85 états finaux et leurs transactions sont ensuite conservés ensemble. Les deux autres lectures de référence restent inchangées.</p><button id="native-compute" disabled>Calculer et recevoir les 85 états</button><button id="native-cancel" disabled>Annuler la demande détaillée</button><p id="native-status" role="status">Vérification du moteur détaillé…</p><p id="native-values"></p><p id="native-balance"></p><label>Instant natif consulté <select id="native-view-step" disabled></select></label><p>Le curseur consulte un état reçu ; il ne relance pas le solveur et ne modifie pas l’état final conservé. Écart d’énergie local = capacité native × écart de température, depuis le même état initial.</p><details><summary>Les compartiments à l’instant consulté</summary><div style="overflow:auto"><table><thead><tr><th>Identité native</th><th>Température °C</th><th>Stockage W</th><th>Transfert interne W</th><th>Forçage combiné net W</th></tr></thead><tbody id="native-body"></tbody></table></div></details><button id="native-export" disabled>Exporter le registre natif complet</button><button id="native-clear" disabled>Retirer le calcul reçu</button><details><summary>Reprendre un registre natif complet</summary><label>Registre exporté <input id="native-import" type="file" accept=".json,application/json" disabled></label></details><p>Temps natif du modèle, sans correspondance à l’horloge P2. Les capacités sont en J/K, les puissances en W et les températures en °C. Le forçage combine génération, pertes et frontières ; les transferts ne représentent pas des connexions anatomiques observées. Aucun recalage HRA, commande physiologique P1, validation humaine ou repos global reçu.</p><p><a href="temperature-calcul.html#native-thermal-execution">Consultation et import des registres</a> · <a href="echange-thermique.html#thermal-model-state">Recalculer les trajectoires déjà reçues</a></p>';
 const $=id=>host.querySelector('#'+id),fields=document.getElementById('thermal-fields'),form=document.getElementById('thermal-form');
 let model,active=null,busy=false,ownsFields=false,generation=0,available=false,pairMode=false,firstTicket=null,sourceRequest=null,viewSignature="";
 const status=t=>$('native-status').textContent=t;
 async function api(path='',options={}){const r=await fetch('/api/thermal'+path,{...options,headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(10000)});if(!r.ok){let message='Moteur détaillé indisponible ('+r.status+').';try{message=(await r.json()).error||message;}catch{}throw Error(message);}return r.json();}
 function hasResult(){const d=model?.read();return !!(d?.native_source||d?.native_sources);}
 function controls(){const received=hasResult();$('native-compute').disabled=busy||!available;$('native-cancel').disabled=!active;$('native-clear').disabled=busy||!received;$('native-export').disabled=!received;$('native-import').disabled=busy||!model;}
 function idle(){model?.invalidate();firstTicket=null;pairMode=false;active=null;busy=false;if(ownsFields){fields.disabled=false;ownsFields=false;}controls();}
 function draw(){
  const d=model.read(),pair=d.schema==='poly.native-thermal-pair-world.v1',m=d.modules[2],select=$('native-view-step');
  const signature=pair?d.native_sources.intervention.canonical_sha256+':'+d.native_sources.control.canonical_sha256:d.native_source?.canonical_sha256||'';
  if(signature!==viewSignature){select.replaceChildren(...d.transactions.map((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=s.interval.end_s+' s';return o;}));select.value=String(d.transactions.length-1);viewSignature=signature;}
  select.value=String(d.native_consultation?d.transactions.findIndex(s=>s.interval.end_s===d.native_consultation.time_s):d.transactions.length-1);
  select.disabled=!m;const frame=m?d.transactions[Number(select.value)]:null,nodes=frame?.nodes||[];
  if(pair){
   $('native-values').textContent=`${d.modules.length} modules conservés · paire de ${d.transactions.length} pas · consultation native ${frame.interval.end_s} s, état final conservé à ${m.clock.state_at_s} s. Sang central : témoin ${nodes[0].control_C.toFixed(6)} °C ; intervention ${nodes[0].intervention_C.toFixed(6)} °C ; écart ${nodes[0].difference_K.toFixed(6)} K. Temps du monde inconnu.`;
   $('native-balance').textContent=`Intervention − témoin : énergie stockée ${frame.difference_stored_energy_J.toFixed(6)} J ; forçage net ${frame.difference_combined_forcing_W.toFixed(6)} W. Résidu différentiel nodal maximal ${d.numerical_receipt.max_difference_nodal_residual_W.toExponential(2)} W. Air/rayonnement pendant le pas consulté : ${frame.intervention_boundaries.air_C}/${frame.intervention_boundaries.radiant_C} °C ; témoin 28/28 °C. Le retour des frontières ne remet pas les températures à zéro.`;
  }else{
   $('native-values').textContent=m?`${d.modules.length} modules conservés · ${d.transactions.length} pas · consultation native ${frame.interval.end_s} s, état final conservé à ${m.clock.state_at_s} s ; sang central ${nodes[0].after_C.toFixed(6)} °C. Air ${m.request.air_C} °C / rayonnement ${m.request.radiant_C} °C sur [${m.request.start_s}, ${m.request.end_s}) s. Temps du monde inconnu.`:'Deux lectures conservées ; aucun nouveau calcul détaillé reçu.';
   const r=d.numerical_receipt;$('native-balance').textContent=r?`Énergie stockée depuis l’origine : ${frame.cumulative_state_energy_J.toFixed(6)} J. Résidu nodal maximal ${r.max_nodal_residual_W.toExponential(2)} W ; accord du contre-calcul ${r.max_independent_temperature_difference_K.toExponential(2)} K. Écart énergétique cumulé maximal ${r.max_energy_error_J.toExponential(2)} J.`:'';
  }
  const titles=pair?['Identité native','Témoin °C','Intervention °C','Écart K','Écart énergie J','Écart stockage W','Écart transfert interne W','Écart forçage net W']:['Identité native','Température °C','Stockage W','Transfert interne W','Forçage combiné net W'];
  $('native-body').closest('table').querySelector('thead tr').replaceChildren(...titles.map(t=>{const th=document.createElement('th');th.textContent=t;return th;}));
  $('native-body').replaceChildren(...nodes.map(n=>{const tr=document.createElement('tr'),keys=pair?['control_C','intervention_C','difference_K','energy_J','difference_storage_W','difference_internal_net_W','difference_combined_forcing_net_W']:['after_C','storage_W','internal_net_W','combined_forcing_net_W'];for(const v of [n.id,...keys.map(k=>(k==='energy_J'?n.capacity_J_K*n.difference_K:n[k]).toFixed(6))]){const td=document.createElement('td');td.textContent=v;tr.append(td);}return tr;}));controls();
 }
 $('native-view-step').onchange=()=>{try{const d=model.read(),s=d.transactions[Number($('native-view-step').value)];model.consult(s.interval.end_s);draw();status('Instant consulté conservé dans l’export ; état final calculé inchangé.');}catch(e){status('Consultation refusée : '+e.message);draw();}};
 try{const texts={};await Promise.all(['thermal-exchange-qualification.json','experience-lumiere.json','temperature-recherche.json'].map(async n=>{const r=await fetch(n,{cache:'no-store'});if(!r.ok)throw Error('Source absente : '+n);texts[n]=await r.text();}));model=await NativeThermalSession.create(texts);draw();$('native-import').disabled=false;
  if(location.hostname==='127.0.0.1'){const service=await api();available=service.schema==='poly.thermal-service.v1'&&service.native_audit?.route==='/api/thermal/native'&&service.single_active_job===true;}
  if(!available)throw Error('Voie de calcul détaillé non disponible.');controls();status('Moteur détaillé prêt ; conditions initiales et sources qualifiées.');
 }catch(e){controls();status('Calcul local indisponible : '+e.message+' Les registres exportés restent consultables si les sources sont reçues.');}
 async function poll(id,current,request){
  if(current!==generation||active!==id)return;
  try{const job=await api('/'+encodeURIComponent(id));if(current!==generation||active!==id)return;
   if(job.status==='running'){setTimeout(()=>poll(id,current,request),350);return;}
   if(job.status==='done'){
    if(job.kind!=='native')throw Error('Type de calcul différent.');const raw=JSON.stringify(job.result);
    if(pairMode&&!firstTicket){firstTicket=await model.preparePair(raw,sourceRequest);if(current!==generation)return;await start({...sourceRequest,air_C:28,radiant_C:28},current,'Intervention vérifiée ; calcul du témoin détaillé (2/2)…');return;}
    if(pairMode)await model.completePair(firstTicket,raw);else await model.receive(raw,request);if(current!==generation)return;
    draw();status(pairMode?'Paire native reçue : deux trajectoires vérifiées, différences et passé commun conservés.':'Calcul non linéaire reçu : 85 états, temps et transactions vérifiés puis conservés.');
   }else status(job.status==='cancelled'?'Demande annulée ; dernier état valide conservé.':job.error||'Échec du calcul ; dernier état valide conservé.');
   idle();
  }catch(e){if(current===generation){if(active){status('Résultat non accepté : '+e.message+' Annuler cette demande pour libérer les commandes.');$('native-cancel').disabled=false;}else{idle();status('Seconde demande non acceptée : '+e.message+' Dernier registre valide conservé.');}}}
 }
 async function start(request,current,label){
  active=null;controls();status(label);const job=await api('/native',{method:'POST',body:JSON.stringify(request)});if(current!==generation)return;active=job.id;controls();poll(active,current,request);
 }
 $('native-compute').onclick=async()=>{if(busy||!available)return;const current=++generation;
  try{if(fields.disabled)throw Error('Terminer le calcul compact actif ou attendre sa disponibilité.');const request=validateNativeRequest(requestFrom(form));sourceRequest=request;pairMode=document.getElementById('thermal-pair').checked;firstTicket=null;
   busy=true;fields.disabled=true;ownsFields=true;controls();await start(request,current,pairMode?'Calcul détaillé de l’intervention (1/2)…':'Calcul détaillé dans un processus isolé…');
  }catch(e){if(current===generation){idle();status('Demande refusée : '+e.message+' Dernier état valide conservé.');}}
 };
 $('native-cancel').onclick=async()=>{if(!active)return;const id=active;generation++;model.invalidate();$('native-cancel').disabled=true;
  try{await api('/'+encodeURIComponent(id),{method:'DELETE'});idle();status('Demande annulée ; dernier registre valide conservé.');}catch(e){$('native-cancel').disabled=false;status('Annulation non confirmée : '+e.message);}
 };
 $('native-clear').onclick=()=>{if(busy)return;generation++;model.clear();draw();status('Module calculé retiré ; deux lectures conservées.');};
 $('native-export').onclick=()=>{if(!hasResult())return;
  const text=model.save();
  if(window.parent!==window&&location.pathname.endsWith('/temperature-calcul.html')){
   window.parent.postMessage({type:'poly.native-thermal-export.v1',text},location.origin);
   status('Registre préparé : utiliser le lien de téléchargement dans l’atelier, sous ce panneau.');return;
  }
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=model.read().schema==='poly.native-thermal-pair-world.v1'?'POLY_T28_comparaison_native.json':'POLY_T27_registre_natif.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
 };
 $('native-import').onchange=async()=>{const file=$('native-import').files?.[0];if(!file||!model||busy)return;const current=++generation;busy=true;controls();
  try{if(file.size>8000000)throw Error('Registre supérieur à 8 Mo.');const text=await file.text();if(current!==generation)return;await model.restore(text);if(current!==generation)return;draw();status('Registre natif repris après contre-calcul ; modules et bilans conservés.');}
  catch(e){if(current===generation)status('Reprise refusée : '+e.message+' Dernier registre valide conservé.');}
  finally{if(current===generation){busy=false;controls();$('native-import').value='';}}
 };
}
