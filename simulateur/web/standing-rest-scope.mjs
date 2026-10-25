const commit='3c74ee2af2f79aa360093cc517e38bf465ec8c5b';
export const restSourceSHA='bfee0e38a0e0c46d1fe647f411c75874d95a85f12f7da5b286227fbe82f4d50d';
export function standingRestScope(d){
 const r=d?.receipt,c=r?.contract,k=c?.criteria_before_calculation;
 if(r?.schema!=='poly.standing-thermal-receipt.v1'||c?.schema!=='poly.standing-thermal-scenario.v1'||c.source_commit!==commit||r.nodes!==85||c.profile?.posture!=='standing'||c.profile?.PAR!==1.4||r.experimental_validation!==false||r.avatar_coupled!==false||c.experimental_validation!==false||c.avatar_coupled!==false||r.stationarity_received!==true||r.uniform_perturbation_contraction_received!==false)throw Error('Périmètre du repos thermique incompatible.');
 if(!k||k.stationarity_600s_max_change_K!==.001||k.stationarity_600s_abs_storage_W!==.05||k.contraction_3600s_max_distance_K!==.1||!Array.isArray(r.checks)||r.checks.length!==6||![r.skin_mean_C,r.central_blood_C].every(Number.isFinite))throw Error('Recette thermique incomplète.');
 const checked=[];for(const step of [60,15])for(const perturbation of [0,.1,-.1]){const matches=r.checks.filter(v=>v.step_s===step&&v.perturbation_K===perturbation);if(matches.length!==1)throw Error('Essai thermique manquant ou dupliqué.');const v=matches[0];if(![v.max_change_600s_K,v.mean_storage_600s_W,v.distance_3600s_K].every(Number.isFinite))throw Error('Résultat thermique non fini.');checked.push(v);}
 const stationary=checked.filter(v=>v.perturbation_K===0).every(v=>v.max_change_600s_K>=0&&v.max_change_600s_K<=k.stationarity_600s_max_change_K&&Math.abs(v.mean_storage_600s_W)<=k.stationarity_600s_abs_storage_W);
 const contraction=checked.filter(v=>v.perturbation_K!==0).every(v=>v.distance_3600s_K>=0&&v.distance_3600s_K<=k.contraction_3600s_max_distance_K);
 if(!stationary||contraction)throw Error('Les résultats ne correspondent plus à la portée R4 reçue.');
 return {schema:'poly.standing-rest-scope.v1',global_rest_received:false,thermal_stationarity_received:stationary,thermal_one_hour_contraction_received:contraction,physiological_validation:false,avatar_coupled:false,world_time_s:null,profile:structuredClone(c.profile),boundaries:structuredClone(c.boundaries),values:{skin_mean_C:r.skin_mean_C,central_blood_C:r.central_blood_C},thermal_compartments:85,source_commit:commit};
}
if(typeof document!=='undefined'&&document.getElementById('rest-status')){
 const status=document.getElementById('rest-status');
 try{const response=await fetch('temperature-debout.json',{cache:'no-store'});if(!response.ok)throw Error('Source T4 indisponible.');const raw=await response.text(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw))),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==restSourceSHA)throw Error('La source T4 a changé ; nouvelle qualification nécessaire.');const scope=standingRestScope(JSON.parse(raw));
 document.getElementById('rest-thermal').textContent=`85 compartiments de modèle ; peau moyenne ${scope.values.skin_mean_C.toFixed(6)} °C, sang central ${scope.values.central_blood_C.toFixed(6)} °C. Stationnarité reçue à 60 s et 15 s ; retour sous 0,1 K à une heure non reçu.`;
 document.getElementById('rest-source').textContent='T4 · SHA-256 '+hash+' · commit '+scope.source_commit;
 status.textContent='Périmètre vérifié : repos global non reçu ; point fixe thermique partiel seulement.';
 document.getElementById('rest-export').disabled=false;document.getElementById('rest-export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({...scope,source_sha256:hash},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_R4_portee_repos.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 }catch(e){status.textContent='Portée non vérifiée : '+e.message;}
}
