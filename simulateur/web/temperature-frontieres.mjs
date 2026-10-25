const settings={control:[28,28],air:[26,28],radiant:[28,26],both:[26,26]};
export function validateBoundaryCatalogue(d){
 if(d?.schema!=='poly.thermal-boundary-experiment.v1'||d.experimental_validation!==false||d.avatar_coupled!==false||!/^[a-f0-9]{64}$/.test(d.initial_state_sha256)||d.source_commit!=='3c74ee2af2f79aa360093cc517e38bf465ec8c5b'||d.plan?.duration_s!==3600||JSON.stringify(d.plan.intervention_interval_s)!=='[600,2400]')throw Error('Catalogue incompatible');
 let initial;
 for(const [key,bounds]of Object.entries(settings))for(const dt of [60,30,15]){
  const rows=d.series?.[key]?.[dt];if(!Array.isArray(rows)||rows.length!==3600/dt+1)throw Error('Série incomplète');
  if(d.plan.scenarios?.[key]?.Ta!==bounds[0]||d.plan.scenarios?.[key]?.Tr!==bounds[1])throw Error('Plan incompatible');
  for(let i=0;i<rows.length;i++){
   const r=rows[i];if(!Array.isArray(r)||r.length!==5||!r.every(Number.isFinite)||r[0]!==i*dt)throw Error('Échantillon invalide');
   const active=i>0&&(i-1)*dt>=600&&(i-1)*dt<2400;
   if(r[3]!== (active?bounds[0]:28)||r[4]!== (active?bounds[1]:28))throw Error('Conditions aux limites incohérentes');
  }
  const first=JSON.stringify(rows[0]);if(initial&&first!==initial)throw Error('États initiaux différents');initial=first;
  const control=d.series?.control?.[dt];for(let i=0;i<=600/dt;i++)if(rows[i][1]!==control[i][1]||rows[i][2]!==control[i][2])throw Error('Passé de l’intervention modifié');
 }
 return d;
}
export function boundaryReading(d,scenario,step,index){
 const rows=d.series[scenario]?.[step];if(!rows||!Number.isInteger(index)||index<0||index>=rows.length)throw Error('Sélection invalide');
 const r=rows[index],control=d.series.control[step][index];return {elapsed_s:r[0],skin_mean_C:r[1],central_blood_C:r[2],air_previous_step_C:r[3],radiant_previous_step_C:r[4],skin_difference_K:r[1]-control[1],central_blood_difference_K:r[2]-control[2],experimental_validation:false,avatar_coupled:false};
}
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);try{
  const response=await fetch('temperature-frontieres.json');if(!response.ok)throw Error('Données absentes');const d=validateBoundaryCatalogue(await response.json());
  function draw(){const step=Number($('boundary-step').value),key=$('boundary-scenario').value;$('boundary-index').max=3600/step;const r=boundaryReading(d,key,step,Number($('boundary-index').value));
   $('boundary-values').textContent=`Temps de simulation : ${r.elapsed_s} s. Peau moyenne ${r.skin_mean_C.toFixed(4)} °C (${r.skin_difference_K.toFixed(4)} K par rapport au témoin) ; sang central ${r.central_blood_C.toFixed(4)} °C (${r.central_blood_difference_K.toFixed(4)} K). ${r.elapsed_s===0?'Conditions initiales':'Entrées appliquées pendant le pas terminé'} : air ${r.air_previous_step_C} °C, rayonnement ${r.radiant_previous_step_C} °C.`;
   $('boundary-status').textContent=`Lecture ${key} · pas ${step} s · instant ${r.elapsed_s} s. Calcul de modèle, sans commande physiologique de l’avatar.`;
  }
  $('boundary-scenario').onchange=draw;$('boundary-index').oninput=draw;$('boundary-step').onchange=()=>{$('boundary-index').value=0;draw();$('boundary-status').textContent='Pas changé : instant remis à zéro, sans interpolation.';};draw();$('boundary-status').textContent='Douze séries précalculées vérifiées numériquement ; pas de validation humaine ni de commande de l’avatar.';
  $('boundary-export').onclick=()=>{const payload={schema:'poly.thermal-boundary-selection.v1',scenario:$('boundary-scenario').value,step_s:Number($('boundary-step').value),reading:boundaryReading(d,$('boundary-scenario').value,Number($('boundary-step').value),Number($('boundary-index').value)),initial_state_sha256:d.initial_state_sha256,source_commit:d.source_commit,plan:d.plan};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_frontieres_thermiques_selection.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('boundary-status').textContent='Sélection exportée avec scénario, état initial et limites de preuve.';};
 }catch(e){$('boundary-status').textContent='Lecture refusée : '+e.message;}
}
