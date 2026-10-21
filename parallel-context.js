(function(root){'use strict';
const definitions={
 'ETUDE:HASSANPOUR':{title:'Une perturbation, plusieurs observations',description:'Pendant le protocole : capteurs cardiorespiratoires, molette et acquisition ASL. Les rapports émotionnels sont recueillis après. La position commune sert à comparer les explications ; elle ne synchronise pas des données individuelles.',kind:'PARALLEL_PROTOCOL_OBSERVATIONS',lanes:[
 {node:'HASS-PERTURB',label:'Perturbation / contrôle',operation:'Périphérie · protocole',timing:'Condition expérimentale'},
 {node:'HASS-BODY',label:'Cœur et respiration',operation:'Deux canaux périphériques',timing:'Enregistrements pendant acquisition'},
 {node:'HASS-DIAL',label:'Sensations suivies',operation:'Molette · intensité globale',timing:'Rapport continu cardiorespiratoire'},
 {node:'HASS-ASL',label:'Réponse hémodynamique',operation:'Cerveau · ASL indirecte',timing:'Fenêtres du protocole ; TR4s'},
 {node:'HASS-EMOTION',label:'Émotions rapportées',operation:'Évaluation différée',timing:'Après · p négatif0,053',deferred:true}],relations:[
 {from:'HASS-PERTURB',to:'HASS-BODY',kind:'EXPERIMENTAL_COMPARISON',label:'Comparer les réponses au contrôle ; pas une route nerveuse'},
 {from:'HASS-BODY',to:'HASS-GAP',kind:'UNRESOLVED_ROUTE',label:'Afférences et relais : raccord encore ouvert'},
 {from:'HASS-ASL',to:'HASS-INSULA',kind:'ANALYTIC_DEPENDENCY',label:'Acquisition → contrastes insulaires'},
 {from:'HASS-DIAL',to:'HASS-EMOTION',kind:'DISTINCT_REPORTS',label:'Intensité continue et émotions après : variables distinctes'}]},
 'ARCHIVE:stable':{title:'Entretenir les conditions de l’activité',description:'Boucle fonctionnelle de lecture proposée à partir de plusieurs préparations. Apport, production d’ATP, gradients, activité et milieu interagissent. Aucune simultanéité individuelle ni durée commune n’est démontrée par ce montage.',kind:'PROPOSED_FUNCTIONAL_LOOP_MIXED_PREPARATIONS',lanes:[
 {node:'bas0',label:'Apport de substrats',operation:'Sang / tissus',timing:'Stocks et apport continu'},
 {node:'bas1',label:'ATP disponible',operation:'Cytosol / mitochondries',timing:'Production et consommation'},
 {node:'bas2',label:'Pompes membranaires',operation:'Membranes neuronales/gliales',timing:'Entretien continu'},
 {node:'bas3',label:'Gradients entretenus',operation:'Membrane / milieu',timing:'État conditionnant l’excitabilité'},
 {node:'bas4',label:'Activité ou silence',operation:'Cellules / réseau',timing:'Dépend des entrées et de l’état'},
 {node:'bas5',label:'Milieu modifié',operation:'K+ / transmetteurs / glie',timing:'Influence les réponses suivantes'},
 {node:'bas6',label:'Débit ajusté',operation:'Endothélium / artérioles',timing:'Apport renouvelé ; BOLD indirect'}],relations:[
 {from:'bas1',to:'bas2',kind:'FUNCTIONAL_DEPENDENCY',label:'ATP → fonctionnement des pompes'},
 {from:'bas2',to:'bas3',kind:'FUNCTIONAL_DEPENDENCY',label:'Pompes → entretien des gradients'},
 {from:'bas4',to:'bas5',kind:'FUNCTIONAL_DEPENDENCY',label:'Activité → changements du milieu'},
 {from:'bas5',to:'bas4',kind:'PROPOSED_FEEDBACK',label:'Milieu → activité suivante : retour fonctionnel'},
 {from:'bas6',to:'bas0',kind:'PROPOSED_FEEDBACK',label:'Débit → apport renouvelé : boucle proposée'}]}
};
function model(group,node,progress){if(!Number.isFinite(progress))throw Error('Position pédagogique non finie');const d=definitions[group];if(!d)return null;return{...d,group,node,progress:Math.max(0,Math.min(1,progress)),biologicalSynchronization:false,lanes:d.lanes.map(l=>({...l,selected:l.node===node}))};}
let currentKey='',panel,isolated=false;
function render(group,action,progress){const m=model(group.id,action.source_node_id||action.nodeIds?.[0],progress);panel=panel||document.getElementById('parallel-context');if(!panel)return;const open=document.getElementById('parallel-focus');if(open){open.hidden=!m;open.onclick=()=>panel.scrollIntoView({behavior:'smooth',block:'start'});}if(!m){panel.hidden=true;currentKey='';return;}panel.hidden=false;if(!m.lanes.some(l=>l.selected))isolated=false;
 const key=m.group+'|'+m.node;
 if(currentKey!==key){currentKey=key;panel.replaceChildren();const title=document.createElement('h2');title.textContent=m.title;panel.append(title);const description=document.createElement('p');description.textContent=m.description;panel.append(description);
  const toggle=document.createElement('button');toggle.type='button';toggle.id='parallel-isolate';toggle.disabled=!m.lanes.some(l=>l.selected);toggle.textContent=isolated?'Revoir les autres actions':'Isoler ce maillon';toggle.onclick=()=>{isolated=!isolated;currentKey='';render(group,action,Number(document.getElementById('journey-seek').value)/1000);};panel.append(toggle);
  const grid=document.createElement('div');grid.className='parallel-lanes';for(const lane of m.lanes){const button=document.createElement('button');button.type='button';button.className='parallel-lane';button.dataset.node=lane.node;button.classList.toggle('selected',lane.selected);button.hidden=isolated&&!lane.selected;for(const text of [lane.label,lane.operation,lane.timing]){const span=document.createElement('span');span.textContent=text;button.append(span);}const track=document.createElement('div');track.className='parallel-track';const dot=document.createElement('i');if(!lane.deferred)track.append(dot);else track.textContent='Après acquisition';button.dataset.deferred=String(!!lane.deferred);button.append(track);button.onclick=()=>{const target=group.intervals.find(a=>a.source_node_id===lane.node)||group.intervals.find(a=>a.nodeIds?.includes(lane.node));if(!target)return;const seek=document.getElementById('journey-seek'),value=seek.value,select=document.getElementById('interval');select.value=target.id;select.dispatchEvent(new Event('change',{bubbles:true}));seek.value=value;seek.dispatchEvent(new Event('input',{bubbles:true}));};grid.append(button);}panel.append(grid);
  const relations=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Dépendances, retours et limites';relations.append(summary);for(const r of m.relations){const p=document.createElement('p');p.textContent=r.label;relations.append(p);}panel.append(relations);const status=document.createElement('p');status.id='parallel-position';panel.append(status);
 }
 panel.dataset.group=m.group;panel.dataset.kind=m.kind;panel.dataset.progress=m.progress.toFixed(4);panel.dataset.isolated=String(isolated);panel.dataset.biologicalSynchronization='false';panel.style.setProperty('--parallel-progress',String(m.progress));document.getElementById('parallel-position').textContent='Position de consultation '+Math.round(m.progress*100)+' % · aucune horloge biologique commune ajoutée.';
}
const api={definitions,model,render};if(typeof module==='object'&&module.exports)module.exports=api;else root.PolyParallelContext=api;
})(typeof window==='undefined'?globalThis:window);
