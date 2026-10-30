import {readVagusEvidence,compareVagusStudyToPCBM} from './pcbm-vagus-evidence.mjs';
import {fetchPCBMCoverage,filterPCBMCoverage} from './pcbm-coverage.mjs';
import {validatePCBM,planPCBM,classifyPCBM,PCBMReceipt} from './pcbm-core.mjs';
const $=id=>document.getElementById(id);
const labels={spatial:'Spatial · recalage validé',structural:'Structurel · sans superposition',documentary:'Documentaire · rupture explicite'};
const verification={source_read:'Fichier de référence inspecté',documentary_only:'Rapport documentaire, non validation biologique',not_mounted:'Non monté, non revérifié ici'};
const status={viewer:'Visualiseur existant',external:'Données externes non montées',not_mounted:'Données non montées'};
let model=null,route=null,index=0,previewNode=null,coverage=null,vagusEvidence=null;
function closePreview(){ $('viewer-frame').removeAttribute('src');$('viewer-panel').hidden=true;previewNode=null }
function text(id,value){$(id).textContent=String(value)}
function empty(node){node.replaceChildren()}
function setError(message){
 $('loading').hidden=true;$('app').hidden=true;$('error').hidden=false;$('error').textContent='PCBM indisponible : '+message;
}
function collectSources(node,incoming){
 const ids=new Set([...node.source_ids,...(incoming?.source_ids??[])]);
 const list=$('sources');empty(list);
 for(const id of ids){
  const source=model.sources.get(id),li=document.createElement('li'),strong=document.createElement('strong'),small=document.createElement('small');
  strong.textContent=source.title;small.textContent=verification[source.verification]+' · '+source.id;
  li.append(strong,small);
  if(source.path){
   const a=document.createElement('a');
   a.href='https://github.com/joanvignes-sudo/POLY-viewer/blob/main/'+source.path;
   a.target='_blank';a.rel='noopener';a.textContent='Voir le fichier d’origine';li.append(a);
  }
  if(source.url){const link=document.createElement('a');link.href=source.url;link.target='_blank';link.rel='noopener';link.textContent='Consulter la référence externe officielle';li.append(link)}
  list.append(li);
 }
}
function order(node){
 return node.order_exponent_m===null?'Non quantifiée':('10^'+node.order_exponent_m+' m · ordre de grandeur pédagogique');
}
function render(){
 if(!model||!route)return;
 if(previewNode!==route.ids[index])closePreview();
 const ul=$('steps');empty(ul);
 route.ids.forEach((id,j)=>{
  const node=model.nodes.get(id),li=document.createElement('li'),b=document.createElement('button');
  b.type='button';b.className='step-button';b.setAttribute('aria-current',j===index?'step':'false');
  const scale=document.createElement('span'),name=document.createElement('span'),info=document.createElement('span');
  scale.className='step-scale';scale.textContent=node.order_exponent_m===null?'n/d':'10^'+node.order_exponent_m;
  name.className='step-label';name.textContent=node.label;info.className='step-mode';
  info.textContent=j===0?'Départ':labels[route.links[j-1].mode];
  b.append(scale,name,info);b.addEventListener('click',()=>{index=j;render()});li.append(b);ul.append(li);
 });
 const node=model.nodes.get(route.ids[index]),frame=model.frames.get(node.frame_id),incoming=index?classifyPCBM(model,route.links[index-1]):null;
 text('count',route.ids.length+' étapes');
 text('position','ÉTAPE '+(index+1)+' / '+route.ids.length);
 text('node-title',node.label);text('node-detail',node.detail);
 text('scale',order(node));text('frame',frame.id+' · '+frame.description);
 text('specimen',node.specimen_id??'Indéterminée / référence générique');
 text('availability',status[node.availability]);
 $('open-viewer').hidden=node.availability!=='viewer';$('embed-viewer').hidden=node.availability!=='viewer';
 if(node.availability==='viewer')$('open-viewer').href=node.href;
 else $('open-viewer').removeAttribute('href');
 $('unavailable').hidden=node.availability==='viewer';
 text('transition-title',incoming?labels[incoming.mode]:'Point de départ');
 text('transition-text',incoming?incoming.scientific_note:'Point de départ de ce parcours. Aucun zoom géométrique n’a encore été effectué.');
 text('transition-boundary',incoming?
  (incoming.spatially_continuous?'Transformation documentée et qualifiée.':'Aucune continuité spatiale ou chronologie biologique transférée.') :
  'Les échelles indiquées sont des ordres de grandeur, pas des dimensions mesurées ici.');
 collectSources(node,incoming);
 $('previous').disabled=index===0;$('next').disabled=index>=route.ids.length-1;
 $('route-notice').textContent='Itinéraire documentaire disponible · '+route.links.filter(l=>l.mode==='spatial').length+' raccordement spatial validé.';
}
function build(){
 const from=$('from').value,to=$('to').value;
 const proposal=planPCBM(model,from,to);
 if(!proposal){
  $('route-notice').textContent='Aucun itinéraire documenté dans ce sens ; PCBM ne fabrique pas de relation.';
  return;
 }
 closePreview();route=proposal;index=0;render();
}
function renderCoverage(){
 if(!coverage)return;
 const found=filterPCBMCoverage(coverage,{family:$('coverage-family').value,query:$('coverage-query').value});
 text('coverage-count',found.length+' sujets sur '+coverage.topic_count+' · preuves et modèles à qualifier');
 const list=$('coverage-list');empty(list);
 for(const e of found.slice(0,30)){
  const li=document.createElement('li'),strong=document.createElement('strong'),meta=document.createElement('span'),details=document.createElement('details'),summary=document.createElement('summary'),missing=document.createElement('ul');
  strong.textContent=e.topic;meta.textContent=e.family+' · candidat documentaire · aucune preuve attachée';
  summary.textContent='Qualifications manquantes ('+e.missing.length+')';
  for(const gap of e.missing){const item=document.createElement('li');item.textContent=gap;missing.append(item)}
  details.append(summary,missing);li.append(strong,meta,details);list.append(li);
 }
 if(found.length>30){const li=document.createElement('li');li.textContent='30 sujets affichés ; utilisez le filtre pour voir les autres.';list.append(li)}
}
async function loadCoverage(){
 $('coverage-load').disabled=true;
 text('coverage-status','Lecture du registre de recherche, sans promotion scientifique…');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
 try{
  const checked=await fetchPCBMCoverage({signal:controller.signal});
  coverage=checked;
  const select=$('coverage-family');select.replaceChildren(new Option('Toutes les familles','all'));
  for(const f of coverage.families)select.add(new Option(f,f));
  $('coverage-query').value='';
  $('coverage-panel').hidden=false;
  text('coverage-status',coverage.topic_count+' sujets, '+coverage.family_count+' familles · non validés dans cet inventaire');
  renderCoverage();
 }catch(error){
  coverage=null;$('coverage-panel').hidden=true;
  text('coverage-status','Inventaire indisponible ou incompatible : '+(error?.message??error));
 }finally{clearTimeout(timeout);$('coverage-load').disabled=false}
}
function renderVagusEvidence(validated){
 const panel=$('vagus-study-panel'),cohorts=$('vagus-cohorts');empty(cohorts);
 const names=new Map([['sparc-ssv','SPARC · référence méthodologique'],['thompson-2026','Thompson et coll. · microCT et histologie'],['bahadir-2026','Bahadir et coll. · branches anatomiques']]);
 for(const study of validated.studies){
  const div=document.createElement('div'),strong=document.createElement('strong'),detail=document.createElement('p');
  strong.textContent=names.get(study.study_id);
  detail.textContent=study.study_id==='thompson-2026'?'10 nerfs examinés, 5 suivis en microCT.':
   study.study_id==='bahadir-2026'?'58 nerfs issus de 29 donneurs, 29 à gauche et 29 à droite.':
   'Méthode de comparaison normalisée de spécimens ; aucune coordonnée individuelle f002 importée.';
  div.append(strong,detail);cohorts.append(div);
 }
 const frames=$('vagus-coordinate-fields');empty(frames);
 for(const field of validated.source_data.coordinate_fields){
  const dt=document.createElement('dt'),dd=document.createElement('dd');
  dt.textContent=field.name;dd.textContent=field.notes;frames.append(dt,dd);
 }
 const chart=$('vagus-branch-chart');empty(chart);
 const max=30;
 for(const b of validated.branches){
  const row=document.createElement('div'),label=document.createElement('strong'),plot=document.createElement('div'),iqr=document.createElement('span'),median=document.createElement('span'),values=document.createElement('span');
  row.className='vagus-branch-row';row.setAttribute('role','listitem');
  row.setAttribute('aria-label',b.label+' : médiane '+b.median+' cm, IQR '+b.q1+' à '+b.q3+' cm');
  label.textContent=b.label;plot.className='vagus-plot';plot.setAttribute('aria-hidden','true');
  iqr.className='vagus-iqr';iqr.style.left=(b.q1/max*100)+'%';iqr.style.width=((b.q3-b.q1)/max*100)+'%';
  median.className='vagus-median';median.style.left=(b.median/max*100)+'%';
  plot.append(iqr,median);
  values.textContent=b.median.toFixed(1)+' cm ['+b.q1.toFixed(1)+' – '+b.q3.toFixed(1)+']';
  row.append(label,plot,values);chart.append(row);
 }
 const sources=$('vagus-study-sources');empty(sources);
 for(const study of validated.studies){
  const li=document.createElement('li'),a=document.createElement('a');
  a.href=study.url;a.rel='noopener';a.target='_blank';a.textContent=names.get(study.study_id);
  li.append(a);sources.append(li);
 }
 const boundary=compareVagusStudyToPCBM(model,validated,'bahadir-2026','vagus-f002');
 if(boundary.spatial_overlay_allowed||boundary.individual_measurement_transferred)throw Error('Incompatible cross-study overlay');
 panel.hidden=false;
}
async function loadVagusEvidence(){
 $('vagus-study-load').disabled=true;
 text('vagus-study-status','Vérification des références et des unités…');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 try{
  const verified=await readVagusEvidence({signal:controller.signal,registry:model});
  vagusEvidence=verified;renderVagusEvidence(verified);
  text('vagus-study-status','3 références distinctes · 6 groupes publiés · aucun recalage entre spécimens');
 }catch(error){
  vagusEvidence=null;$('vagus-study-panel').hidden=true;
  text('vagus-study-status','Comparaison refusée ou indisponible : '+(error?.message??error));
 }finally{clearTimeout(timer);$('vagus-study-load').disabled=false}
}
function init(reg){
 model=validatePCBM(reg);
 const ordered=model.registry.nodes;
 for(const id of ['from','to']){
  const select=$(id);empty(select);
  for(const node of ordered){const option=document.createElement('option');option.value=node.id;option.textContent=node.label;select.append(option);}
 }
 $('from').value=model.registry.entry_id;
 $('to').value=model.registry.goal_id;
 $('build').onclick=build;
 $('coverage-load').onclick=loadCoverage;
 $('vagus-study-load').onclick=loadVagusEvidence;
 $('coverage-family').onchange=renderCoverage;
 $('coverage-query').oninput=renderCoverage;
 $('embed-viewer').onclick=()=>{const current=model.nodes.get(route.ids[index]);if(current.availability!=='viewer')return;closePreview();$('viewer-frame').title='POLY · '+current.label;$('viewer-frame').src=current.href;$('viewer-panel').hidden=false;previewNode=current.id;};
 $('close-viewer').onclick=closePreview;
 $('previous').onclick=()=>{if(index>0){index--;render()}};
 $('next').onclick=()=>{if(route&&index<route.ids.length-1){index++;render()}};
 $('export').onclick=()=>{
  if(!route)return;
  const result=PCBMReceipt(model,route),blob=new Blob([JSON.stringify(result,null,2)+'\n'],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='PCBM_navigation_receipt.json';document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
 };
 document.addEventListener('keydown',event=>{
  if(event.target?.closest?.('input,select,textarea,button,a,[contenteditable]'))return;
  if(event.key==='ArrowLeft'&&index>0){index--;render()}
  if(event.key==='ArrowRight'&&route&&index<route.ids.length-1){index++;render()}
 });
 build();
 $('loading').hidden=true;$('app').hidden=false;
 window.__pcbmDiagnostics=()=>({loaded:!!model,node:route?.ids[index]??null,step_count:route?.ids.length??0,index,
   modes:route?.links.map(l=>l.mode)??[],registered_spatial:route?.links.filter(l=>l.mode==='spatial').length??0,
   world_transform_applied:false,biological_clock:null});
}
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
try{
 const response=await fetch('./pcbm-registry.json',{signal:controller.signal,cache:'no-store'});
 if(!response.ok)throw Error('Registre indisponible (HTTP '+response.status+')');
 const reg=await response.json();
 init(reg);
}catch(error){setError(error?.message??String(error))}
finally{clearTimeout(timer)}
