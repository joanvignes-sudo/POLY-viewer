import {prepareThermalExecution,acceptThermalExecution,requestThermalAuthority} from './thermal-execution-ports.mjs';
import {validateRequest,validateResult,compareResults} from './temperature-reception.mjs';
const $=id=>document.getElementById(id),form=$('thermal-form'),fields=$('thermal-fields'),status=$('thermal-status'),cancel=$('thermal-cancel');
let active=null,result=null,pending=false,qualification=null,ticket=null,request=null,first=null,paired=false,cancelling=false;
const setStatus=text=>status.textContent=text;
async function api(path='',options={}) {
 const response=await fetch('/api/thermal'+path,{...options,headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(10000)});
 if(!response.ok){let message=`Erreur du moteur (${response.status}).`;try{message=(await response.json()).error||message;}catch{}throw Error(message);}
 return response.json();
}
export function requestFrom(form) {
 const request={schema:'poly.thermal-request.v1'};
 for(const key of ['air_C','radiant_C','start_s','end_s','duration_s','step_s'])request[key]=Number(form.elements.namedItem(key).value);
 return validateRequest(request);
}
function draw(){
 if(!result)return;
 const index=Number($('result-index').value),isPair=result.schema==='poly.thermal-comparison.v1';
 const row=(isPair?result.intervention:result).rows[index];
 $('result-values').textContent=`Temps natif ${row[0]} s · Peau moyenne ${row[1].toFixed(6)} °C · Sang central ${row[2].toFixed(6)} °C · ${row[0]===0?'Conditions initiales':'Frontières du pas précédent'} : air ${row[3]} °C / rayonnement ${row[4]} °C.`;
 $('result-difference').textContent=isPair?`Intervention moins témoin : peau ${result.rows[index][1].toFixed(6)} K ; sang central ${result.rows[index][2].toFixed(6)} K. Témoin : peau ${result.control.rows[index][1].toFixed(6)} °C ; sang central ${result.control.rows[index][2].toFixed(6)} °C.`:'Calcul isolé ; aucune différence au témoin calculée.';
}
function receive(value){
 result=value;const pair=result.schema==='poly.thermal-comparison.v1',run=pair?result.intervention:result,r=run.request;
 $('result-request').textContent=`${pair?'Comparaison reçue (deux calculs isolés)':'Calcul reçu'} : air ${r.air_C} °C / rayonnement ${r.radiant_C} °C sur [${r.start_s}, ${r.end_s}[ s ; durée ${r.duration_s} s, pas ${r.step_s} s.${pair?' Témoin inchangé : air et rayonnement 28 °C.':''}`;
 const energy=pair?Math.max(run.receipt.max_corrected_energy_residual_W,result.control.receipt.max_corrected_energy_residual_W):run.receipt.max_corrected_energy_residual_W;
 $('result-audit').textContent=`Provenance, grille et ${pair?'deux recettes numériques':'recette numérique'} reçues · résidu énergétique corrigé maximal ${energy.toExponential(2)} W. Ceci ne constitue pas une validation humaine.`;
 $('result-index').max=run.rows.length-1;$('result-index').value=0;$('result').hidden=false;draw();
}
function idle(){active=null;pending=false;first=null;cancelling=false;fields.disabled=false;cancel.disabled=true;}
async function start(r,label){
 ticket=prepareThermalExecution(r,qualification);requestThermalAuthority(ticket,'start_isolated_solver');pending=true;cancel.disabled=true;setStatus(label);
 const job=await api('',{method:'POST',body:JSON.stringify(r)});active=job.id;cancel.disabled=false;poll(active);
}
async function poll(id){
 if(active!==id)return;
 try{const job=await api('/'+id);if(active!==id)return;
  if(job.status==='running'){setTimeout(()=>poll(id),350);return;}
  if(cancelling)return;
  if(job.status==='done'){
   const expected=first?{...request,air_C:28,radiant_C:28}:request;
   if(JSON.stringify(ticket.request)!==JSON.stringify(expected))throw Error('Requête active incohérente.');const checked=acceptThermalExecution(ticket,job.result);
   if(paired&&!first){first=checked;await start({...request,air_C:28,radiant_C:28},'Intervention reçue ; calcul du témoin (2/2)…');return;}
   const accepted=paired?compareResults(first,checked,qualification):checked;
   receive(accepted);setStatus(paired?'Comparaison terminée ; deux calculs et passé commun vérifiés.':'Calcul terminé ; reçu numérique disponible.');
  }
  else setStatus(job.status==='cancelled'?'Calcul annulé ; aucun nouveau résultat accepté.':job.error||'Échec du calcul.');
  idle();
 }catch(error){if(active===id){setStatus('Résultat non accepté : '+error.message+' Utilisez Annuler pour libérer cette demande.');cancel.disabled=false;}}
}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(pending||active)return;
 try{request=requestFrom(form);paired=$('thermal-pair').checked;first=null;cancelling=false;pending=true;fields.disabled=true;
  await start(request,paired?'Calcul de l’intervention (1/2)…':'Calcul en cours dans un processus isolé…');
 }catch(error){idle();setStatus(error.message);}
});
cancel.addEventListener('click',async()=>{
 if(!active)return;const id=active;cancelling=true;cancel.disabled=true;
 try{const job=await api('/'+id,{method:'DELETE'});if(active!==id)return;
  setStatus('Demande annulée ; aucun nouveau résultat accepté.');idle();
 }catch(error){cancel.disabled=false;setStatus('Annulation non confirmée : '+error.message);}
});
$('result-index').addEventListener('input',draw);
$('result-export').addEventListener('click',()=>{if(!result)return;const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='poly-thermal-result.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
if(location.hostname!=='127.0.0.1'){setStatus('Moteur indisponible sur cette version statique. Les expériences déjà calculées restent consultables.');}
else Promise.all([api(),fetch('./temperature-qualification.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Qualification absente.');return r.json();})]).then(([value,q])=>{if(value.schema!=='poly.thermal-service.v1')throw Error('Moteur incompatible.');qualification=q;fields.disabled=false;setStatus('Moteur local disponible ; une seule exécution active.');}).catch(()=>setStatus('Moteur local ou qualification indisponible. Les expériences déjà calculées restent consultables.'));
