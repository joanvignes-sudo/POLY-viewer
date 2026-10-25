export function validateNativeEye(c,meta){
 const expected=[[358,'VH_M_cornea_R'],[350,'VH_M_lens_R'],[336,'VH_M_retina_R']];
 if(c?.schema!=='poly.native-eye-context.v1'||c.id!=='HRA-NATIVE-EYE-R'||c.physiological_model!==false||c.human_observation!==false||c.study_participant_mapping!==false||c.source_reference!==meta.reference||c.display_sha256!==meta.display_sha256||!Array.isArray(c.steps)||c.steps.length!==3)throw Error('Contexte source HRA incompatible.');
 for(let i=0;i<3;i++){const s=c.steps[i],e=expected[i];if(s.node!==e[0]||s.name!==e[1]||typeof s.label!=='string'||!s.label.length||meta.structures.filter(x=>x.node===s.node&&x.name===s.name).length!==1)throw Error('Identité de surface non reçue.');}
 return c;
}
export function nativeEyeStep(c,index){
 if(!Number.isInteger(index)||index<0||index>=c.steps.length)throw Error('Étape native inconnue.');
 return {context_id:c.id,step_id:`${c.id}:${c.steps[index].node}`,source_node:c.steps[index].node,source_name:c.steps[index].name,time_kind:'browsing order only',physiological_time_s:null,study_participant_mapping:false};
}
export function requireStudyHRAIdentity(node){
 // The current human protocols contain regional descriptions only.
 if(!node||!Number.isInteger(node.hra_node))throw Error('U-ANATOMIE : identifiant HRA explicite absent ; aucun rapprochement par nom.');
 throw Error('U-ANATOMIE : correspondance entre participant et atlas non qualifiée.');
}
export function mountNativeEyeContext({host,meta,meshes,allowed,begin,choose,end}){
 const section=document.createElement('section');section.className='small';section.innerHTML='<h3>Parcours source · œil droit HRA</h3><p>Trois structures du même atlas, dans un ordre de consultation. Aucun trajet lumineux, délai, événement cellulaire ou participant d’étude déduit. La couche osseuse Z-Anatomy est suspendue pendant ce parcours HRA puis restaurée.</p><p>Les 82 étapes des protocoles humains n’ont pas de correspondance HRA explicite : leur raccord reste refusé.</p><button id="native-eye-open" disabled>Ouvrir le parcours source</button><div id="native-eye-steps" hidden><button id="native-eye-prev">Étape précédente</button><button id="native-eye-next">Étape suivante</button><button id="native-eye-body">Corps et contexte</button><button id="native-eye-focus">Cadrer la même structure</button><button id="native-eye-close">Quitter et restaurer le contexte</button></div><p id="native-eye-status" role="status">Vérification des identités source…</p>';
 host.after(section);const $=id=>section.querySelector('#'+id);let contract,active=false,index=0,saved;
 function status(message){$('native-eye-status').textContent=message;}
 function paint(mode='focus'){
  const s=nativeEyeStep(contract,index),mesh=meshes.find(m=>m.userData.node===s.source_node&&m.userData.name===s.source_name);
  if(!mesh)throw Error('Surface source indisponible.');
  choose(mesh,mode,saved);$('native-eye-prev').disabled=index===0;$('native-eye-next').disabled=index===2;
  status(`${index+1}/3 · ${contract.steps[index].label} · ${s.step_id} · même identité en vue corps ou cadrée ; temps physiologique inconnu. Occultants HRA échantillonnés sur sept rayons.`);
 }
 function close(restore=true){if(!active)return;active=false;end(saved,restore);saved=null;$('native-eye-steps').hidden=true;status(restore?'Contexte et sélection restaurés ; aucun modèle physiologique modifié.':'Parcours quitté après changement de vue ; navigation conservée et mode d’occultants libéré.');}
 const act=fn=>()=>{try{fn();}catch(e){status(e.message);}};
 $('native-eye-open').onclick=act(()=>{if(active){paint();return;}if(!allowed())throw Error('Passer d’abord à Anatomie HRA, debout en pause, hors vue spécialisée et hors protocole humain. Les trois surfaces HRA doivent être visibles.');saved=begin();active=true;index=0;$('native-eye-steps').hidden=false;paint();});
 $('native-eye-prev').onclick=act(()=>{if(active&&index>0){index--;paint();}});
 $('native-eye-next').onclick=act(()=>{if(active&&index<2){index++;paint();}});
 $('native-eye-body').onclick=act(()=>{if(active)paint('body');});
 $('native-eye-focus').onclick=act(()=>{if(active)paint('focus');});
 $('native-eye-close').onclick=()=>close(true);
 fetch('native-eye-context.json').then(r=>{if(!r.ok)throw Error('Contrat indisponible');return r.json();}).then(c=>{contract=validateNativeEye(c,meta);$('native-eye-open').disabled=false;status('Identités natives reçues. Utiliser Anatomie HRA, debout en pause. Le parcours reste distinct des études humaines.');}).catch(e=>status(e.message));
 return {update(){if(active&&!allowed(true))close(false);},get active(){return active;}};
}
