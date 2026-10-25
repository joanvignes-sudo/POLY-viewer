import {mountC4Spatial} from './c4-spatial-view.mjs?v=0.139.0';
import {mountRecyclingHypotheses} from './recycling-hypotheses-view.mjs';
import {mountHumanLactate} from './human-lactate-view.mjs';
import {createCaseBundle,validateCaseBundle} from './case-bundle-core.mjs';
import {STATE_STYLES,activeCaseWorksite,validateCatalog,createCaseSession,validateCaseSession,selectCaseChain,updateCaseState,summarizeZone,zoneColor} from './case-workspace-core.mjs';
export function mountCaseWorkspace(host){
 let catalog=null,session=null,exportUrl=null,storageKey=null;
 const $=id=>host.querySelector('#'+id);
 host.innerHTML=`<span class="case-badge">Dossier actif · énergétique cérébrale</span><h3 id="case-title"></h3><p id="case-objective"></p>
 <div class="case-toolbar"><label>Chaîne <select id="case-chain"></select></label><button id="case-previous" type="button">← Étape</button><button id="case-next" type="button">Étape →</button></div>
 <p class="case-workflow">Choisir une chaîne, examiner ses mécanismes et renseigner les états. Les états de scénario se conservent quand on change de chantier.</p>
 <div class="case-zones" id="case-zones" aria-label="Zones de la carte cellulaire"></div><div class="case-legend" id="case-legend"></div>
 <label>Contraste des états <input id="case-contrast" type="range" min="0.35" max="1" step="0.05" value="0.8"></label>
 <ol class="case-steps" id="case-steps" aria-label="Mécanismes de la chaîne"></ol>
 <section class="case-detail"><strong id="case-node-title"></strong><p id="case-node-description"></p><label>État du mécanisme sélectionné <select id="case-state"></select></label><p id="case-node-source"></p><span class="case-badge">Origine : saisie de scénario</span></section>
 <details class="case-references"><summary>Notes et préparation du calcul cellulaire</summary><label for="case-notes">Hypothèse de travail ou question à examiner</label><textarea class="case-note" id="case-notes" rows="4" maxlength="5000"></textarea><p>Le futur modèle cellulaire recevra les états et les paramètres via un adaptateur. Il faudra préciser les compartiments, les bilans, les lois de transport, les conditions et les observables. La voie directe du glucose reste distincte de l’hypothèse ANLS.</p><p>Carte cellulaire de travail, sans coordonnées dans l’atlas de l’avatar. Pas de concentration, de délai ou de résultat biologique chiffré généré par les couleurs.</p><p>Socle : revue Bordone et al., DOI 10.1111/jnc.14829, publiée en 2020 ; données d’espèces et préparations diverses à qualifier à la source avant tout paramétrage humain.</p></details>
 <div id="case-spatial"></div><div id="case-recycling"></div><div id="case-lactate"></div>
 <div class="case-toolbar"><button id="case-reset" type="button">Réinitialiser les états</button><button id="case-export" type="button">Préparer la sauvegarde du chantier</button></div>
 <p class="case-status" id="case-status" role="status">Chargement du dossier…</p>
 <details id="case-save" hidden><summary>Sauvegarde du chantier</summary><a id="case-download">Télécharger le chantier</a><button type="button" id="case-copy">Copier la sauvegarde</button><textarea class="case-case-copy" id="case-save-text" rows="4" readonly aria-label="Sauvegarde du chantier"></textarea><p>À reprendre avec « Importer une séance ». Les anciennes séances lumière/thermique restent compatibles.</p></details>`;
 let lactate={read:()=>null,set:value=>{if(value!==null)throw Error('Modèle absent du dossier actif');}};
 let recycling={read:()=>null,set:value=>{if(value!==null)throw Error('Comparaison absente du dossier actif');}};
 let spatial={read:()=>null,set:value=>{if(value!==null)throw Error('Cascade absente du dossier');}};
 function status(t){$('case-status').textContent=t;}
 function persist(){try{const bundle=createCaseBundle(session,lactate.read(),catalog,recycling.read(),spatial.read());localStorage.setItem(storageKey,JSON.stringify(bundle));$('case-save').hidden=true;status('Chantier conservé localement · états saisis'+(bundle.models.human_blood_lactate?' et calcul lactate reçu':'')+(bundle.models.recycling_hypotheses?' et comparaison reçue':''));}catch{status('Sauvegarde locale indisponible ; exporter le chantier pour le conserver.');}}
 function draw(){
  const chain=catalog.chains.find(c=>c.id===session.selected_chain),id=chain.nodes[session.selected_step],node=catalog.nodes.find(n=>n.id===id);
  $('case-chain').value=chain.id;$('case-contrast').value=session.contrast;$('case-state').value=session.states[id];
  $('case-node-title').textContent=node.title;$('case-node-description').textContent=node.description;
  $('case-node-source').textContent='Revue · pages PDF '+node.source_pages.join(', ')+' · '+(chain.kind==='hypothesis'?'branche hypothétique à comparer':'mécanisme à qualifier pour le calcul');
  $('case-previous').disabled=session.selected_step===0;$('case-next').disabled=session.selected_step===chain.nodes.length-1;
  $('case-steps').replaceChildren(...chain.nodes.map((nodeId,i)=>{const li=document.createElement('li'),b=document.createElement('button'),n=catalog.nodes.find(x=>x.id===nodeId),state=STATE_STYLES[session.states[nodeId]];b.type='button';b.textContent=(i+1)+'. '+n.title+' '+state.symbol;b.title=state.label;b.style.borderColor=zoneColor(session.states[nodeId],session.contrast);b.setAttribute('aria-current',i===session.selected_step?'step':'false');b.onclick=()=>{session.selected_step=i;draw();persist();};li.append(b);return li;}));
  $('case-zones').replaceChildren(...catalog.zones.map(zone=>{const b=document.createElement('button'),s=summarizeZone(session,zone.id,catalog),focused=node.zone===zone.id,state=focused?session.states[id]:s.state,style=STATE_STYLES[state];b.type='button';b.className='case-zone';b.dataset.zone=zone.id;b.dataset.state=state;b.setAttribute('aria-pressed',String(focused));b.style.borderColor=zoneColor(state,session.contrast);b.style.background=zoneColor(state,session.contrast*0.25);if(state==='unknown')b.style.borderStyle='dashed';const title=document.createElement('strong'),label=document.createElement('span'),detail=document.createElement('small');title.textContent=zone.title;label.textContent=(focused?'Sélection : ':'')+style.symbol+' '+style.label;detail.textContent=(focused?node.title+' · ':'')+s.documented+' / '+s.total+' mécanismes renseignés';b.append(title,label,detail);b.onclick=()=>{const i=chain.nodes.findIndex(n=>catalog.nodes.find(x=>x.id===n).zone===zone.id);if(i>=0){session.selected_step=i;draw();persist();}else status('Cette zone n’intervient pas dans la chaîne sélectionnée.');};return b;}));
 }
 function exportFile(){if(!session){status('Le dossier est encore en chargement.');return;}const text=JSON.stringify(createCaseBundle(session,lactate.read(),catalog,recycling.read(),spatial.read()),null,2);if(exportUrl)URL.revokeObjectURL(exportUrl);exportUrl=URL.createObjectURL(new Blob([text],{type:'application/json'}));$('case-download').href=exportUrl;$('case-download').download='POLY-chantier-pellerin.json';$('case-save-text').value=text;$('case-save').hidden=false;$('case-save').open=true;status('Sauvegarde prête : télécharger ou copier le chantier.');}
 function restore(payload){if(!catalog)throw Error('Attendre le chargement du dossier');const accepted=validateCaseBundle(payload,catalog);session=accepted.scenario;lactate.set(accepted.models.human_blood_lactate);recycling.set(accepted.models.recycling_hypotheses??null);spatial.set(accepted.models.c4_spatial??null);$('case-notes').value=session.notes;draw();persist();}
 const ready=(async()=>{try{
  const registry=await fetch('worksites.json',{cache:'no-store'});if(!registry.ok)throw Error('Registre des chantiers absent');const active=activeCaseWorksite(await registry.json());
  const r=await fetch(active.catalog,{cache:'no-store'});if(!r.ok)throw Error('Dossier absent');catalog=validateCatalog(await r.json());if(catalog.id!==active.id)throw Error('Catalogue différent du chantier actif');session=createCaseSession(catalog);storageKey='poly.case-workspace.'+catalog.id+'.v1';
  if(catalog.computational_adapters?.includes('human-blood-lactate-regressions-v1'))lactate=mountHumanLactate($('case-lactate'),()=>{if(session)persist();});
  if(catalog.computational_adapters?.includes('human-recycling-hypotheses-v1'))recycling=mountRecyclingHypotheses($('case-recycling'),()=>{if(session)persist();});
  if(catalog.computational_adapters?.includes('conditional-c4-spatial-v1'))spatial=mountC4Spatial($('case-spatial'),()=>{if(session)persist();});
  try{const saved=localStorage.getItem(storageKey)||(catalog.id==='pellerin-neuroenergetics'?localStorage.getItem('poly.case-workspace.pellerin.v1'):null);if(saved){const accepted=validateCaseBundle(JSON.parse(saved),catalog);session=accepted.scenario;lactate.set(accepted.models.human_blood_lactate);recycling.set(accepted.models.recycling_hypotheses??null);spatial.set(accepted.models.c4_spatial??null);}}catch{status('Ancienne sauvegarde incompatible ; dossier original conservé.');}
  $('case-title').textContent=catalog.title;$('case-objective').textContent=catalog.objective;
  $('case-chain').replaceChildren(...catalog.chains.map(c=>new Option(c.title,c.id)));
  $('case-state').replaceChildren(...Object.entries(STATE_STYLES).filter(([id])=>id!=='mixed').map(([id,s])=>new Option(s.symbol+' '+s.label,id)));
  $('case-legend').replaceChildren(...Object.entries(STATE_STYLES).filter(([id])=>id!=='mixed').map(([,s])=>{const el=document.createElement('span');el.textContent=s.symbol+' '+s.label;el.style.setProperty('--state-color',s.color);return el;}));
  $('case-notes').value=session.notes;
  $('case-chain').onchange=()=>{session=selectCaseChain(session,$('case-chain').value,catalog);draw();persist();};
  $('case-state').onchange=()=>{const chain=catalog.chains.find(c=>c.id===session.selected_chain);session=updateCaseState(session,chain.nodes[session.selected_step],$('case-state').value,catalog);draw();persist();};
  $('case-contrast').oninput=()=>{session.contrast=Number($('case-contrast').value);draw();persist();};
  $('case-notes').oninput=()=>{session.notes=$('case-notes').value;persist();};
  $('case-previous').onclick=()=>{session.selected_step--;draw();persist();};$('case-next').onclick=()=>{session.selected_step++;draw();persist();};
  $('case-reset').onclick=()=>{session.states=createCaseSession(catalog).states;draw();persist();};
  $('case-export').onclick=exportFile;
  $('case-copy').onclick=async()=>{try{await navigator.clipboard.writeText($('case-save-text').value);status('Chantier copié : conserver ce texte dans un fichier .json.');}catch{status('Copier le texte de sauvegarde ci-dessous.');}};
  draw();status(catalog.chains.length+' chaînes · '+catalog.nodes.length+' mécanismes · états de scénario prêts');
 }catch(e){status('Dossier indisponible : '+e.message);}})();
 return {ready,exportFile,restore};
}
