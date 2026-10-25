import {mountCaseWorkspace} from './case-workspace.mjs?v=0.139.0';
import {mountProjectFollowup} from './project-followup.mjs';

import {mountAtlasEmbed} from './atlas-embed.mjs';

import {verifyThermalDataset,selectThermalSample,buildExport} from './poly-atelier-core.mjs';

import {createSession,validateSession} from './poly-atelier-session.mjs';

const $=id=>document.getElementById(id);

mountAtlasEmbed($('body-frame'));

let data=null,run=false,raf=0,lastStamp=null,clock=60,fractional=0;

const thermalPanel=$('panel-thermal'),play=$('thermal-play'),time=$('thermal-time'),step=$('thermal-step'),status=$('thermal-status');

const modes=['chains','light','thermal'];

const caseWorkspace=mountCaseWorkspace($('case-workspace'));
const followupButton=$('open-project-followup');
const followupOpen={onclick:null};
mountProjectFollowup($('project-followup-host'),followupOpen);
followupButton.onclick=()=>{switchMode('chains');followupOpen.onclick?.();};

let thermalLoading=null;

function pause(){run=false;lastStamp=null;fractional=0;cancelAnimationFrame(raf);play.textContent='▶ Lire';}

function switchMode(mode){

 if(!modes.includes(mode))return;pause();

 for(const x of modes){$('panel-'+x).hidden=x!==mode;$('tab-'+x).setAttribute('aria-selected',String(x===mode));$('tab-'+x).tabIndex=x===mode?0:-1;}

 if(mode==='thermal'&&!data&&!thermalLoading)thermalLoading=init();

 if(mode==='light'){const f=$('light-frame');if(!f.src || f.src==='about:blank')f.src=f.dataset.src;}

 history.replaceState(null,'','#'+mode);

}

for(const t of document.querySelectorAll('[data-tab]')){

 t.onclick=()=>switchMode(t.dataset.tab);

 t.onkeydown=e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const i=modes.indexOf(t.dataset.tab),m=modes[(i+(e.key==='ArrowRight'?1:2))%3];const submenu=$('tab-'+m).closest('details');if(submenu)submenu.open=true;$('tab-'+m).focus();switchMode(m);};

}

function createSvg(tag,attrs={},content){

 const e=document.createElementNS('http://www.w3.org/2000/svg',tag);

 for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);

 if(content!==undefined)e.textContent=content;

 return e;

}

function renderGraph(){

 if(!data)return;

 const svg=$('thermal-chart'),rows=data.series[step.value];svg.replaceChildren();

 const min=Math.floor(Math.min(...rows.map(r=>Math.min(r[1],r[2])))-1),max=Math.ceil(Math.max(...rows.map(r=>Math.max(r[1],r[2])))+1);

 const X=v=>52+v/7200*752,Y=v=>278-(v-min)/(max-min)*236;

 for(let v=Math.ceil(min);v<=max;v+=2){svg.append(createSvg('line',{x1:52,x2:805,y1:Y(v),y2:Y(v),stroke:'#324b59'}));svg.append(createSvg('text',{x:7,y:Y(v)+4,fill:'#bdcbd8','font-size':13},v+'°'));}

 for(let m=0;m<=120;m+=30){svg.append(createSvg('text',{x:X(m*60),y:313,fill:'#bdcbd8','font-size':13,'text-anchor':'middle'},m+' min'));}

 svg.append(createSvg('line',{x1:X(3600),x2:X(3600),y1:24,y2:278,stroke:'#ffd18a','stroke-dasharray':'5 5'}));

 for(const [col,color] of [[1,'#52b6e8'],[2,'#90efd1']])svg.append(createSvg('polyline',{points:rows.map(r=>X(r[0])+','+Y(r[col])).join(' '),fill:'none',stroke:color,'stroke-width':2.5}));

 const cursor=selectThermalSample(data,step.value,clock);

 svg.append(createSvg('line',{x1:X(cursor.time_s),x2:X(cursor.time_s),y1:24,y2:278,stroke:'#f5f7fa','stroke-width':1.6,'stroke-dasharray':'3 4'}));

 for(const [col,color] of [[1,'#52b6e8'],[2,'#90efd1']])svg.append(createSvg('circle',{cx:X(cursor.time_s),cy:Y(rows[cursor.index][col]),r:5,fill:color,stroke:'#fff','stroke-width':1}));

 svg.append(createSvg('text',{x:60,y:19,fill:'#52b6e8','font-size':13},'● Peau moyenne'));

 svg.append(createSvg('text',{x:240,y:19,fill:'#90efd1','font-size':13},'● Sang central'));

 svg.append(createSvg('text',{x:600,y:19,fill:'#ffd18a','font-size':13},'│ Air 28 → 20 °C'));

}

function render(){

 if(!data)return;

 const s=selectThermalSample(data,step.value,clock);clock=s.time_s;time.value=String(clock);

 $('thermal-clock').textContent=Math.round(clock/60)+' / 120 min';

 $('thermal-skin').textContent=s.skin_C.toFixed(3)+' °C';$('thermal-blood').textContent=s.central_blood_C.toFixed(3)+' °C';

 $('thermal-air').textContent=s.ambient_C+' °C';

 renderGraph();

}

function tick(t){

 if(!run)return;

 if(lastStamp!==null){

  const d=Math.max(0,Math.min(1000,t-lastStamp));const delta=d/1000*Number($('thermal-speed').value);

  const s=Number(step.value);fractional+=delta;

  const count=Math.floor(fractional/s);

  if(count>0){clock=Math.min(7200,clock+count*s);fractional-=count*s;render();}

  if(clock>=7200){pause();return;}

 }lastStamp=t;raf=requestAnimationFrame(tick);

}

play.onclick=()=>{if(!data)return;if(run){pause();return;}if(clock>=7200)clock=Number(step.value);run=true;play.textContent='⏸ Pause';lastStamp=null;raf=requestAnimationFrame(tick);};

$('thermal-reset').onclick=()=>{pause();clock=Number(step.value);render();};

step.onchange=()=>{pause();time.step=step.value;time.min=step.value;clock=Math.max(Number(step.value),Math.round(clock/Number(step.value))*Number(step.value));render();};

time.oninput=()=>{pause();clock=Number(time.value);render();};

$('thermal-export').onclick=()=>{

 if(!data)return;const record=buildExport(data,selectThermalSample(data,step.value,clock));

 const u=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));

 const a=document.createElement('a');a.href=u;a.download='POLY-lecture-thermique-'+record.sample.time_s+'s.json';a.click();

 setTimeout(()=>URL.revokeObjectURL(u),1000);

};

async function init(){

 try{

  const r=await fetch('temperature-recherche.json',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);

  data=verifyThermalDataset(await r.json());

  for(const el of [play,$('thermal-reset'),$('thermal-export'),time])el.disabled=false;

  status.textContent='Séries reçues et contrôlées · 85 compartiments · 3 résolutions temporelles. Aucun nouveau calcul.';

  render();

 }catch(e){status.textContent='Lecture impossible : '+e.message;pause();}

}

function lightSelection(){

 const q=$('light-frame').contentDocument;

 return {level_lux:Number(q?.getElementById('level')?.value||9.6),

         duration_s:Number(q?.getElementById('duration')?.value||5),

         delay_s:Number(q?.getElementById('delay')?.value||0)};

}

function currentSession(){

 return createSession({mode:modes.find(m=>$('tab-'+m).getAttribute('aria-selected')==='true')||'thermal',

  thermal:{step_s:Number(step.value),speed_s:Number($('thermal-speed').value),time_s:clock},

  light:lightSelection()});

}

$('session-export').onclick=()=>{

 if($('tab-chains').getAttribute('aria-selected')==='true'){caseWorkspace.exportFile();return;}

 try{

  const s=currentSession(),u=URL.createObjectURL(new Blob([JSON.stringify(s,null,2)],{type:'application/json'}));

  const a=document.createElement('a');a.href=u;a.download='POLY-seance-consultation.json';a.click();

  setTimeout(()=>URL.revokeObjectURL(u),1000);

  $('session-status').textContent='Séance exportée (réglages uniquement)';

 }catch(e){$('session-status').textContent=e.message;}

};

function applyLight(l){

 const f=$('light-frame');

 function apply(){

  const doc=f.contentDocument;

  if(!doc?.getElementById('level'))return;

  for(const [id,value] of [['level',l.level_lux],['duration',l.duration_s],['delay',l.delay_s]]){

   const el=doc.getElementById(id);el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));

  }

 }

 if(f.contentDocument?.getElementById('level'))apply();

 else{f.addEventListener('load',apply,{once:true});if(!f.src||f.src==='about:blank')f.src=f.dataset.src;}

}

$('session-file').onchange=async()=>{

 try{

  const file=$('session-file').files?.[0];if(!file)return;

  if(file.size>120000)throw Error('Fichier de séance trop volumineux');

  const payload=JSON.parse(await file.text());

  if(['poly.case-workspace.v1','poly.case-workspace-bundle.v1','poly.case-workspace-bundle.v2','poly.case-workspace-bundle.v3'].includes(payload.schema)){await caseWorkspace.ready;caseWorkspace.restore(payload);switchMode('chains');$('session-status').textContent='Chantier restauré · états et chaîne conservés';return;}

  const s=validateSession(payload);

  if(!data)await (thermalLoading??=init());

  pause();step.value=String(s.thermal.step_s);$('thermal-speed').value=String(s.thermal.speed_s);

  time.step=step.value;time.min=step.value;clock=s.thermal.time_s;

  render();applyLight(s.light);switchMode(s.mode);

  $('session-status').textContent='Séance restaurée · consultations uniquement';

 }catch(e){$('session-status').textContent='Import refusé : '+e.message;}

 finally{$('session-file').value='';}

};

switchMode(modes.includes(location.hash.slice(1))?location.hash.slice(1):'chains');

// Le même contrôleur conserve ses validations, annulations et exports natifs.

// Aucun message inter-module ni transfert physiologique n'est introduit.

const enginePanel=document.getElementById('atelier-engine');

let nativeExportUrl=null;

window.addEventListener('message',event=>{

 const frame=document.getElementById('engine-frame');

 if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='poly.native-thermal-export.v1')return;

 const text=event.data.text;

 if(typeof text!=='string'||new TextEncoder().encode(text).length>8000000)return;

 let record;try{record=JSON.parse(text);}catch{return;}

 if(!['poly.native-thermal-pair-world.v1','poly.native-thermal-world.v1'].includes(record?.schema))return;

 // Transport du registre déjà reçu, sans affecter aucune horloge ni aucun état.

 if(nativeExportUrl)URL.revokeObjectURL(nativeExportUrl);

 nativeExportUrl=URL.createObjectURL(new Blob([text],{type:'application/json'}));

 const link=document.getElementById('atelier-native-download');

 link.href=nativeExportUrl;link.download='POLY-atelier-registre-natif.json';link.hidden=false;

 document.getElementById('atelier-native-copy').hidden=false;

 document.getElementById('atelier-native-text').value=text;

 document.getElementById('atelier-native-copy-status').textContent='';

 document.getElementById('atelier-engine-status').textContent='Registre préparé. Cliquer sur « Télécharger le registre préparé » sous le panneau pour le conserver.';

});

document.getElementById('atelier-native-copy-button').onclick=async()=>{

 try{await navigator.clipboard.writeText(document.getElementById('atelier-native-text').value);document.getElementById('atelier-native-copy-status').textContent='Registre copié. Le conserver dans un fichier .json pour le reprendre.';}

 catch{document.getElementById('atelier-native-copy-status').textContent='Copie automatique indisponible : sélectionner le texte du registre puis le copier.';}

};

window.addEventListener('pagehide',()=>{if(nativeExportUrl)URL.revokeObjectURL(nativeExportUrl);});

enginePanel.addEventListener('toggle',()=>{if(enginePanel.open)document.getElementById('atelier-engine-status').textContent='Moteur conservé dans l’atelier local. Cette publication permet la lecture des résultats reçus, sans service de calcul thermique.';});
