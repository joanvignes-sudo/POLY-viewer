export function validateEMDR(d){
 if(d?.schema!=='poly.emdr-protocol.v1'||d.source?.doi!=='10.1371/journal.pone.0045753'||d.physiological_model!==false||d.avatar_coupled!==false||d.individual_therapeutic_prediction!==false||d.availability?.raw_eeg_imported!==false)throw Error('Portée EMDR incompatible');
 if(!Array.isArray(d.stages)||d.stages.length!==5||new Set(d.stages.map(s=>s.id)).size!==5||d.stages.some(s=>s.duration_s!==null))throw Error('Durée individuelle non qualifiée');
 if(d.acquisition?.sample_rate_Hz!==256||d.acquisition.eeg_channels!==37||d.preparation?.concatenated_duration_s!==180||d.preparation.continuous_session!==false||d.preparation.observed_sample_count!==null)throw Error('Signal et préparation confondus');
 if(d.source_estimation?.direct_cell_observation!==false||d.availability.raw_eeg_license_qualified!==false)throw Error('Preuve ou licence non qualifiée');
 const patients=d.groups?.find(g=>g.id==='patients'),controls=d.groups?.find(g=>g.id==='controls');if(patients?.n!==10||JSON.stringify(patients.visits)!=='["T0","T1"]'||patients.repeated_people!==true||controls?.n!==10||JSON.stringify(controls.visits)!=='["T0"]')throw Error('Groupes et visites incompatibles');return d;
}
export function protocolStage(d,id){const stage=d.stages.find(s=>s.id===id);if(!stage)throw Error('Étape inconnue');return {...stage,time_kind:'stage order only; individual duration unknown',simulation:false};}
if(typeof document!=='undefined'){
 const $=id=>document.getElementById(id);try{
  const response=await fetch('emdr-protocole.json');if(!response.ok)throw Error('Dossier absent');const d=validateEMDR(await response.json());
  for(const stage of d.stages){const b=document.createElement('button');b.textContent=stage.title;b.dataset.stage=stage.id;b.onclick=()=>show(stage.id);$('emdr-stages').append(b);}
  function show(id){const s=protocolStage(d,id);$('emdr-stage-detail').textContent=s.title+' : '+s.observable+'. Durée individuelle inconnue ; ordre documentaire, sans horloge simulée.';for(const b of $('emdr-stages').children)b.setAttribute('aria-pressed',String(b.dataset.stage===id));}show(d.stages[0].id);
  $('emdr-status').textContent='Source primaire vérifiée ; signal brut non importé, aucune simulation thérapeutique.';
 }catch(e){$('emdr-status').textContent='Lecture refusée : '+e.message;}
}
