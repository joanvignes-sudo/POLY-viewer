export function validateData(d){
 if(!d||typeof d!=='object'||!/^\d{2}$/.test(d.subject)||d.session!=='sn2')throw Error('Identité de mesure invalide');
 if(d.schema!=='poly.observed-light.v1'||d.unit!=='mm'||d.model_prediction!==false||d.interpolation_shown!==false||!Array.isArray(d.bins)||!d.bins.length)throw Error('Contrat de mesures invalide');
 if(!/^[a-f0-9]{64}$/.test(d.source_member_sha256)||!Number.isFinite(d.sample_rate_Hz)||d.sample_rate_Hz<=0)throw Error('Provenance invalide');
 let end=0;
 for(const b of d.bins){if(!b||!Number.isFinite(b.t)||!Number.isFinite(b.end)||Math.abs(b.t-end)>1e-8||b.end<=b.t||!Number.isInteger(b.n)||b.n<=0||Math.abs((b.end-b.t)*d.sample_rate_Hz-b.n)>1e-6||!Number.isInteger(b.observed)||b.observed<0||b.observed>b.n)throw Error('Groupe invalide');
  if(b.observed===0){if([b.mean,b.min,b.max].some(x=>x!==null))throw Error('Trou masqué');}
  else if(![b.mean,b.min,b.max].every(Number.isFinite)||b.min>b.mean||b.mean>b.max)throw Error('Résumé invalide');end=b.end;
 }
 if(!Array.isArray(d.events)||!d.events.length)throw Error('Événements absents');
 const ids=new Set();let time=-Infinity;
 for(const e of d.events){if(!e||!Number.isInteger(e.event_index)||e.event_index<1||ids.has(e.event_index)||!Number.isFinite(e.time_recording_s)||e.time_recording_s<0||e.time_recording_s> end||e.time_recording_s<time||!Number.isFinite(e.illuminance_nominal_lux)||e.illuminance_nominal_lux<0||e.subject_id!==d.subject||e.session_label!==d.session)throw Error('Événement incohérent');ids.add(e.event_index);time=e.time_recording_s;}
 if(!Array.isArray(d.cohort_quality)||!d.cohort_quality.length)throw Error('Cohorte absente');
 const people=new Set();for(const row of d.cohort_quality){if(!row||!/^\d{2}$/.test(row.subject)||people.has(row.subject)||!Number.isFinite(row.missing_fraction)||row.missing_fraction<0||row.missing_fraction>1)throw Error('Cohorte invalide');people.add(row.subject);}
 if(!people.has(d.subject))throw Error('Personne absente de la cohorte');return d;
}
export function windowStats(d,a,b){if(!Number.isFinite(a)||!Number.isFinite(b)||b<=a)throw Error('Fenêtre invalide');const bins=d.bins.filter(x=>x.end>a&&x.t<b);return {bins,observed:bins.reduce((s,x)=>s+x.observed,0),samples:bins.reduce((s,x)=>s+x.n,0)};}
if(typeof document!=='undefined'){
 const status=document.querySelector('#status');
 try{
  const response=await fetch('observations-lumiere.json');if(!response.ok)throw Error('Données indisponibles');
  let d=validateData(await response.json());const select=document.querySelector('#event');
  for(const e of d.events){const option=document.createElement('option');option.value=String(e.event_index);option.textContent=`${e.time_recording_s.toFixed(3)} s · ${e.illuminance_nominal_lux} lux nominaux`;select.append(option);}
  const ns='http://www.w3.org/2000/svg',svg=document.querySelector('#chart');
  function add(tag,attrs,text){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(text!==undefined)el.textContent=text;svg.append(el);return el;}
  function draw(){let a=0,b=d.bins.at(-1).end;const chosen=d.events.find(e=>String(e.event_index)===select.value);if(chosen){a=Math.max(0,chosen.time_recording_s-2);b=Math.min(b,chosen.time_recording_s+7);}
   const q=windowStats(d,a,b);const finite=q.bins.filter(v=>v.observed>0);svg.replaceChildren();
   if(!finite.length){status.textContent='Aucune mesure dans cette fenêtre.';document.querySelector('#coverage').textContent=`Échantillons observés : 0 / ${q.samples}. Aucun point interpolé.`;return;}
   const lo=Math.floor(Math.min(...finite.map(v=>v.min))*2)/2-.1,hi=Math.ceil(Math.max(...finite.map(v=>v.max))*2)/2+.1;
   const X=t=>65+(t-a)/(b-a)*910,Y=y=>310-(y-lo)/(hi-lo)*270;
   for(let i=0;i<=4;i++){const value=lo+(hi-lo)*i/4;add('line',{x1:65,x2:975,y1:Y(value),y2:Y(value),stroke:'#365061'});add('text',{x:8,y:Y(value)+5,fill:'#b7cbd7','font-size':14},value.toFixed(2));}
   for(const v of finite){const x=X((v.t+v.end)/2);add('line',{x1:x,x2:x,y1:Y(v.min),y2:Y(v.max),stroke:'#52b6e8','stroke-width':1.4});add('circle',{cx:x,cy:Y(v.mean),r:1,fill:'#d4f5ff'});}
   for(const e of d.events.filter(e=>e.time_recording_s>=a&&e.time_recording_s<=b)){const x=X(e.time_recording_s);add('line',{x1:x,x2:x,y1:30,y2:315,stroke:'#90efd1','stroke-dasharray':'3 5',opacity:.5});if(chosen)add('text',{x:x+4,y:25,fill:'#90efd1','font-size':12},`${e.illuminance_nominal_lux} lx`);}
   for(let i=0;i<=5;i++){const t=a+(b-a)*i/5;add('text',{x:X(t),y:340,fill:'#b7cbd7','text-anchor':'middle','font-size':14},t.toFixed(1));}
   add('text',{x:500,y:373,fill:'#b7cbd7','text-anchor':'middle'},'Temps de l’enregistrement (s) · diamètre (mm)');
   status.textContent=`Sujet ${d.subject} · ${a.toFixed(2)} à ${b.toFixed(2)} secondes`;
   document.querySelector('#coverage').textContent=`Groupes affichés : ${q.bins.length}. Échantillons observés : ${q.observed.toLocaleString('fr-FR')} / ${q.samples.toLocaleString('fr-FR')} (${(100*q.observed/q.samples).toFixed(1)} %). Les groupes de bord peuvent dépasser légèrement la fenêtre.`;
  }
  select.addEventListener('change',draw);draw();
  const person=document.querySelector('#person');let requestId=0;
  for(const row of d.cohort_quality){const o=document.createElement('option');o.value=row.subject;o.textContent=`Personne ${row.subject}`;person.append(o);}person.value=d.subject;
  person.addEventListener('change',async()=>{
   const id=person.value,request=++requestId;
   if(!/^\d{2}$/.test(id)||!d.cohort_quality.some(x=>x.subject===id))return;
   select.disabled=true;svg.hidden=true;document.querySelector('#coverage').textContent='';status.textContent=`Chargement de la personne ${id}…`;
   try{
    const r=await fetch(`observations-lumiere-data/${id}.json`);if(!r.ok)throw Error('Données indisponibles');
    const next=validateData(await r.json());if(next.subject!==id)throw Error('Identité incohérente');if(request!==requestId)return;d=next;
    select.replaceChildren();const full=document.createElement('option');full.value='full';full.textContent='Tout l’enregistrement';select.append(full);
    for(const e of d.events){const o=document.createElement('option');o.value=String(e.event_index);o.textContent=`${e.time_recording_s.toFixed(3)} s · ${e.illuminance_nominal_lux} lux nominaux`;select.append(o);}
    document.querySelector('#subject-label').textContent=d.subject;
    document.querySelector('#identity').textContent=`Fichier source : SHA256 ${d.source_member_sha256}`;svg.hidden=false;select.disabled=false;draw();
   }catch(e){if(request===requestId){person.value=d.subject;svg.hidden=false;select.disabled=false;draw();status.textContent=`Chargement impossible : ${e.message}. Les données précédentes restent affichées.`;}}
  });
  for(const row of d.cohort_quality){const tr=document.createElement('tr');for(const s of [row.subject,`${(100*row.missing_fraction).toFixed(2)} %`]){const td=document.createElement('td');td.textContent=s;tr.append(td);}document.querySelector('#quality').append(tr);}
  document.querySelector('#identity').textContent=`Fichier source : SHA256 ${d.source_member_sha256}`;
 }catch(e){status.textContent=`Lecture impossible : ${e.message}`;}
}
