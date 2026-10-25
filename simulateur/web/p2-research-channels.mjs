import {qualifyLightReading} from './qualified-light-reading.mjs';
import {readResearchSource,lightExchange,thermalExchange} from './research-exchange.mjs';

const canonical=x=>JSON.stringify(sort(x));
function sort(x){return Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;}
export function indexForNativeTime(times,value){
 if((typeof value!=='number'&&typeof value!=='string')||(typeof value==='string'&&!value.trim()))throw Error('Indiquer un temps natif');
 const t=Number(value);if(!Number.isFinite(t))throw Error('Temps non fini');
 const index=times.findIndex(x=>Math.abs(x-t)<1e-8);
 if(index<0)throw Error('Aucun échantillon à cet instant : aucune interpolation ni arrondi automatique');
 return index;
}
export function exportResearchReadings(records){
 return JSON.stringify({schema:'poly.p2-research-readings.v1',causal_join:false,synthetic_checkpoint_included:false,records},null,2);
}
export function decodeResearchReadings(text,{light,thermal},context){
 if(typeof text!=='string'||text.length>25000)throw Error('Fichier de lectures trop volumineux ou invalide');
 const d=JSON.parse(text);
 if(d?.schema!=='poly.p2-research-readings.v1'||d.causal_join!==false||d.synthetic_checkpoint_included!==false||!Array.isArray(d.records)||d.records.length!==2)throw Error('Format de lectures incompatible');
 if(Object.keys(d).sort().join(',')!=='causal_join,records,schema,synthetic_checkpoint_included')throw Error('Champs de fichier incompatibles');
 const a=d.records.find(r=>r?.module==='light'),b=d.records.find(r=>r?.module==='thermal');
 if(!a||!b||a.source?.sha256!==light.sha256||b.source?.sha256!==thermal.sha256)throw Error('Sources différentes : reprendre les lectures avec leurs sources exactes');
 const lightIndex=light.data.time_recording_s.indexOf(a.clock?.value),step=b.scenario?.step_s;
 // This P2 reader exposes the received 60-second thermal series only.
 if(step!==60)throw Error('Ce lecteur reprend seulement le pas thermique de 60 secondes');
 const thermalIndex=thermal.data.series[60].findIndex(row=>row[0]===b.clock?.value);
 const selection={scenarioId:a.scenario?.id,lightIndex,thermalIndex};
 const expected=[lightExchange(light,{...context,scenarioId:selection.scenarioId,index:lightIndex}),thermalExchange(thermal,{...context,step:60,index:thermalIndex})];
 if(canonical(a)!==canonical(expected[0])||canonical(b)!==canonical(expected[1]))throw Error('Lecture altérée ou incompatible avec les sources : aucune valeur importée');
 return {selection,records:expected};
}

// This sidecar has no reference to the mutable kernel or avatar.
export class ResearchChannels {
 #records=new Map();
 put(record){
  if(record?.schema!=='poly.research-exchange.v1'||record.avatar_write!==false||record.experimental_validation!==false||record.clock?.world_time_s!==null||!['light','thermal'].includes(record.module))throw Error('Unsupported research record');
  const copy=structuredClone(record);this.#records.set(record.module,copy);return structuredClone(copy);
 }
 snapshot(){return structuredClone([...this.#records.values()]);}
 restore(text,sources,context){
  const decoded=decodeResearchReadings(text,sources,context);
  // Commit both channels only after both regenerated records have passed.
  const next=new Map(decoded.records.map(r=>[r.module,structuredClone(r)]));
  this.#records=next;return structuredClone(decoded.selection);
 }
 join(){throw Error('U-CLOCK: no qualified mapping between native clocks; causal join refused');}
}

export async function mountResearchChannels(host){
 const section=document.createElement('section');section.id='p2-research';
 section.innerHTML='<h2>Modules de recherche · lecture seule</h2><p>Deux résultats calculés, deux horloges natives. Aucune synchronisation avec les ticks P2, aucune commande de l’avatar. Ces lectures ne sont pas incluses dans le checkpoint synthétique.</p><p id="research-status" role="status">Chargement des sources…</p>';
 host.append(section);const status=section.querySelector('#research-status');
 try{
  const load=async(name,kind)=>{const r=await fetch(name);if(!r.ok)throw Error('Source indisponible');return readResearchSource(await r.text(),kind);};
  const [light,thermal]=await Promise.all([load('experience-lumiere.json','light'),load('temperature-recherche.json','thermal')]);
  const channels=new ResearchChannels(),context={worldId:'POLY:WORLD:research',runId:'P2-read-only'};
  const label=document.createElement('label');label.textContent='Scénario lumière ';const choice=document.createElement('select');choice.id='research-light-scenario';
  for(const s of light.data.scenarios){const o=document.createElement('option');o.value=s.id;o.textContent=`${s.nominal_lux} lux · ${Math.round(s.end_s-s.start_s)} s`;choice.append(o);}label.append(choice);section.append(label);
  function slider(id,max,text){const l=document.createElement('label');l.style.display='block';l.textContent=text;const input=document.createElement('input');input.type='range';input.min=0;input.max=max;input.step=1;input.value=0;input.id=id;l.append(input);section.append(l);return input;}
  const li=slider('research-light-index',light.data.time_recording_s.length-1,'Instant lumière (enregistrement) ');
  const ti=slider('research-thermal-index',thermal.data.series[60].length-1,'Instant thermique (démonstration, pas 60 s) ');
  function timeInput(id,text,min,max,step){const label=document.createElement('label');label.style.display='block';label.textContent=text;const input=document.createElement('input');input.type='number';input.id=id;input.min=min;input.max=max;input.step=step;input.style.width='100px';label.append(input);section.append(label);return input;}
  const lightTime=timeInput('research-light-seconds','Temps d’enregistrement lumière (s) ',45,90,.05);
  const thermalTime=timeInput('research-thermal-seconds','Temps de démonstration thermique (s) ',60,7200,60);
  const output=document.createElement('p');output.id='research-values';section.append(output);
  const scope=document.createElement('p');scope.id='research-light-scope';section.append(scope);let qualifiedLight;
  function draw(){
   const a=channels.put(lightExchange(light,{...context,scenarioId:choice.value,index:Number(li.value)}));
   qualifiedLight=qualifyLightReading(a,light);scope.textContent='Lumière qualifiée L1 · entrée : éclairement nominal au niveau de l’œil (lux). Sortie : contraste statistique du diamètre pupillaire (mm), pas un diamètre absolu observé. Latéralité et recalage anatomique inconnus ; aucun signal rétinien, neuronal ou chimique déduit. Temps natif : '+a.clock.value.toFixed(2)+' s ; temps du monde inconnu.';
   const b=channels.put(thermalExchange(thermal,{...context,step:60,index:Number(ti.value)}));
   lightTime.value=a.clock.value.toFixed(2);thermalTime.value=String(b.clock.value);
   output.textContent=`Lumière : ${a.clock.value.toFixed(2)} s d’enregistrement ; ${a.values[0].value} lux ; contraste conditionnel ${a.values[1].value.toFixed(4)} mm. Thermique : ${b.clock.value} s de démonstration ; peau moyenne ${b.values[0].value.toFixed(3)} °C ; sang central ${b.values[1].value.toFixed(3)} °C. Temps global : inconnu pour les deux.`;
   status.textContent='Résultats précalculés non validés expérimentalement ; aucune réunion causale autorisée.';
  }
  for(const el of [choice,li,ti])el.addEventListener('input',draw);draw();
  for(const [input,slider,times,name] of [[lightTime,li,light.data.time_recording_s,'lumière'],[thermalTime,ti,thermal.data.series[60].map(r=>r[0]),'thermique']]){
   const apply=()=>{try{const index=indexForNativeTime(times,input.value);slider.value=index;draw();}catch(e){draw();status.textContent='Instant refusé : '+e.message+'. Les lectures sont conservées.';}};
   const button=document.createElement('button');button.id=input.id+'-apply';button.textContent='Lire cet instant '+name;button.onclick=apply;input.after(button);
   input.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();apply();}};
  }
  const provenance=document.createElement('details');provenance.innerHTML='<summary>Sources et portée des lectures</summary>';
  const sourceText=document.createElement('p');sourceText.textContent=`Lumière : sujet 01 / sn2, contraste statistique conditionnel en mm. Thermique : démonstration JOS-3, PAR 1,2 ; ce profil ne qualifie pas le repos physiologique debout. Monde de lecture : ${context.worldId}. Les empreintes vérifient l’identité des fichiers, sans authentifier leur auteur.`;
  provenance.append(sourceText);for(const [name,source,url] of [['Lumière',light,'experience-lumiere.html'],['Thermique',thermal,'temperature-recherche.html']]){const p=document.createElement('p');p.style.overflowWrap='anywhere';p.textContent=`${name} · SHA-256 ${source.sha256} · `;const a=document.createElement('a');a.href=url;a.textContent='Ouvrir le dossier du module';a.style.color='#90efd1';p.append(a);provenance.append(p);}section.append(provenance);
  const join=document.createElement('button');join.id='research-join';join.textContent='Vérifier une réunion lumière + température';join.onclick=()=>{try{channels.join();}catch(e){status.textContent='Réunion refusée : aucune correspondance qualifiée entre ces horloges. Le scénario P2 est conservé.';}};
  const save=document.createElement('button');save.id='research-export';save.textContent='Exporter ces deux lectures';save.onclick=()=>{const url=URL.createObjectURL(new Blob([exportResearchReadings(channels.snapshot())],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_P2_lectures_recherche.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Deux lectures exportées avec sources, unités, horloges et inconnues.';};
  const qualifiedSave=document.createElement('button');qualifiedSave.id='research-light-qualified-export';qualifiedSave.textContent='Exporter la lecture lumière qualifiée';qualifiedSave.onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(qualifiedLight,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY_L1_lecture_lumiere_qualifiee.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Lecture lumière L1 exportée avec portée de chaque grandeur ; aucune écriture physiologique.';};
  section.append(join,save,qualifiedSave);
  const importLabel=document.createElement('label');importLabel.style.display='block';importLabel.textContent='Reprendre un fichier de lectures ';const input=document.createElement('input');input.id='research-import';input.type='file';input.accept='.json,application/json';importLabel.append(input);section.append(importLabel);
  function receive(text){
   try{
    const selection=channels.restore(text,{light,thermal},context);
    choice.value=selection.scenarioId;li.value=selection.lightIndex;ti.value=selection.thermalIndex;draw();
    status.textContent='Reprise vérifiée : deux sources exactes, scénario et instants restaurés ; horloges natives conservées. Le scénario P2 est inchangé.';
   }catch(e){status.textContent='Reprise refusée : '+e.message+'. Les lectures courantes et P2 sont conservés.';}
  }
  input.onchange=async()=>{const file=input.files?.[0];if(!file)return;try{if(file.size>25000)throw Error('Fichier de lectures trop volumineux');receive(await file.text());}catch(e){status.textContent='Reprise refusée : '+e.message+'. Les lectures courantes et P2 sont conservés.';}finally{input.value='';}};
  const paste=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Reprendre des lectures par copier-coller';paste.append(summary);
  const text=document.createElement('textarea');text.id='research-import-text';text.setAttribute('aria-label','Lectures de recherche JSON');text.maxLength=25000;text.style.cssText='width:100%;min-height:100px';
  const resume=document.createElement('button');resume.id='research-import-paste';resume.textContent='Vérifier et reprendre les lectures';resume.onclick=()=>receive(text.value);paste.append(text,resume);section.append(paste);
 }catch(e){status.textContent='Lecture de recherche indisponible : '+e.message;}
}
