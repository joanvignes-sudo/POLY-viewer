import {EyeReader} from './p1-eye-reader.mjs';
export function mountEyeReader(view,panel) {
 const box=document.createElement('details');box.id='p1-eye-reader';
 const summary=document.createElement('summary');summary.textContent='Lire le contrat P1 · cornée → rétine';box.append(summary);
 const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Lecture documentaire : temps biologique inconnu ; aucune réponse électrique calculée.';box.append(status);
 const current=document.createElement('p'),trace=document.createElement('ol');box.append(current,trace);
 let reader,checkpoint,engaged=false,disposed=false;const controller=new AbortController();
 const storageKey='poly.p1.eye.documentary.v1';
 const buttons=[];
 function button(label,id,action){const b=document.createElement('button');b.id=id;b.textContent=label;b.type='button';b.addEventListener('click',()=>{if(disposed)return;try{action();}catch(e){status.textContent=`Lecture refusée : ${e.message}`;}});buttons.push(b);box.append(b);return b;}
 function paint(){const snapshot=reader.read();view.readDocumentary(snapshot.displayPhase);engaged=true;
  current.textContent=`${snapshot.eventId} · ${snapshot.entityId} — ${snapshot.definition}`;
  trace.replaceChildren(...snapshot.trace.map(e=>{const li=document.createElement('li');li.textContent=`${e.instanceId} → ${e.definitionId} · cause : ${e.parent??'origine'} · temps biologique inconnu`;return li;}));
  status.textContent='Position documentaire fixe · temps biologique inconnu · localisation schématique. Pont vers les cellules non résolu.';
 }
 button('Cornée · arrivée','p1-eye-arrival',()=>{reader.select(0);paint();});
 button('Rétine · absorption','p1-eye-absorption',()=>{reader.select(1);paint();});
 button('Mémoriser la lecture','p1-eye-save',()=>{checkpoint=reader.save();restore.disabled=false;try{localStorage.setItem(storageKey,checkpoint);status.textContent='Lecture conservée dans ce navigateur, y compris après rechargement. Aucun temps humain ajouté.';}catch{status.textContent='Stockage indisponible : lecture conservée seulement en mémoire de cette page.';}});
 const restore=button('Reprendre la lecture','p1-eye-restore',()=>{reader.restore(checkpoint);paint();});restore.disabled=true;
 button('Quitter la lecture P1','p1-eye-release',()=>{view.releaseDocumentary();engaged=false;current.textContent='';trace.replaceChildren();status.textContent='Lecture P1 quittée ; animation pédagogique restaurée.';});
 for(const b of buttons)b.disabled=true;
 panel.append(box);
 let loading;
 const onToggle=()=>{if(disposed)return;if(!box.open){if(engaged){view.releaseDocumentary();engaged=false;current.textContent='';trace.replaceChildren();status.textContent='Lecture P1 repliée ; animation pédagogique restaurée.';}return;}if(reader||loading)return;
  loading=fetch(new URL('./p1-eye-light.json',import.meta.url),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error(`Contrat indisponible (${r.status})`);return r.json();}).then(c=>{if(disposed)return;reader=new EyeReader(c);for(const b of buttons)b.disabled=false;restore.disabled=true;status.textContent='Contrat P1 chargé. Choisir la cornée ou la rétine pour une lecture fixe.';
   try{const stored=localStorage.getItem(storageKey);if(stored){new EyeReader(c).restore(stored);checkpoint=stored;restore.disabled=false;status.textContent='Lecture locale disponible : Reprendre la lecture, ou choisir une étape.';}}catch{status.textContent='Sauvegarde locale incompatible ou indisponible. Choisir une étape pour commencer.';}
  }).catch(e=>{if(!disposed)status.textContent=e.message;}).finally(()=>{loading=null;});
 };box.addEventListener('toggle',onToggle);
 const onClosed=()=>{if(engaged){engaged=false;current.textContent='';trace.replaceChildren();}box.open=false;};panel.addEventListener('poly-eye-closed',onClosed);
 return {dispose(){if(disposed)return;disposed=true;controller.abort();if(engaged)view.releaseDocumentary();engaged=false;reader=null;checkpoint=null;panel.removeEventListener('poly-eye-closed',onClosed);box.removeEventListener('toggle',onToggle);box.remove();}};
}
