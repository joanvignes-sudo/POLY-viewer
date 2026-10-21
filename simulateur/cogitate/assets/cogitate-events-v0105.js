(function(root){
  'use strict';
  const MAX_BYTES=20*1024*1024;
  const missing=v=>v===''||/^(n\/?a|nan)$/i.test(v);
  function number(v){
    const s=v.trim();
    if(missing(s))return {kind:'missing'};
    if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)||!Number.isFinite(Number(s)))return {kind:'invalid'};
    return {kind:'valid',value:Number(s)};
  }
  function inspectEvents(text){
    if(typeof text!=='string'||!text.trim())throw Error('Le fichier est vide.');
    const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/);
    while(lines.length&&!lines[lines.length-1].trim())lines.pop();
    const header=lines[0].split('\t').map(s=>s.trim());
    if(header.some(h=>!h)||new Set(header).size!==header.length)throw Error('Les noms de colonnes sont vides ou dupliqués.');
    if(!header.includes('onset'))throw Error('Colonne BIDS onset absente. Choisir un fichier events.tsv.');
    const oi=header.indexOf('onset'),di=header.indexOf('duration');
    const kind=['trial_type','event_type','value'].find(k=>header.includes(k));
    const ki=kind?header.indexOf(kind):-1;
    const report={format:'POLY COGITATE events audit v0.105',rows:0,columns:header,event_type_column:kind||null,event_types:Object.create(null),onsets:{valid:0,missing:0,invalid:0,min_seconds:null,max_seconds:null,out_of_order:0},durations:{column_present:di>=0,valid:0,missing:0,invalid:0,negative:0},row_width_errors:0,blank_internal_rows:0,first_issues:[],clock_synchronization_verified:false,trial_pairing_performed:false,neural_latency_calculated:false};
    const issue=(line,reason)=>{if(report.first_issues.length<15)report.first_issues.push({line,reason});};
    let previous=null;
    for(let i=1;i<lines.length;i++){
      if(!lines[i].trim()){report.blank_internal_rows++;issue(i+1,'Ligne vide au milieu du fichier');continue;}
      report.rows++;
      const cells=lines[i].split('\t');
      if(cells.length!==header.length){report.row_width_errors++;issue(i+1,'Nombre de colonnes différent de l’en-tête');continue;}
      const label=ki<0?'Type non fourni':cells[ki].trim()||'Type manquant';
      report.event_types[label]=(report.event_types[label]||0)+1;
      const onset=number(cells[oi]);report.onsets[onset.kind]++;
      if(onset.kind==='valid'){
        report.onsets.min_seconds=report.onsets.min_seconds===null?onset.value:Math.min(report.onsets.min_seconds,onset.value);
        report.onsets.max_seconds=report.onsets.max_seconds===null?onset.value:Math.max(report.onsets.max_seconds,onset.value);
        if(previous!==null&&onset.value<previous){report.onsets.out_of_order++;issue(i+1,'Horodatage inférieur au précédent');}
        previous=onset.value;
      }else issue(i+1,onset.kind==='missing'?'Horodatage manquant':'Horodatage non numérique ou non fini');
      if(di>=0){const duration=number(cells[di]);report.durations[duration.kind]++;if(duration.kind==='valid'&&duration.value<0){report.durations.negative++;issue(i+1,'Durée négative');}}
    }
    if(!report.rows)throw Error('Le fichier contient un en-tête mais aucun événement.');
    return report;
  }
  root.POLY_COGITATE={inspectEvents,MAX_BYTES};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.POLY_COGITATE;
  if(typeof document==='undefined')return;
  const input=document.getElementById('events-file'),status=document.getElementById('events-status'),view=document.getElementById('events-summary'),download=document.getElementById('events-export');
  if(!input)return;
  let report=null,request=0;
  function paragraph(text){const p=document.createElement('p');p.textContent=text;view.appendChild(p);}
  input.addEventListener('change',async()=>{
    const version=++request;report=null;view.replaceChildren();download.disabled=true;
    const file=input.files[0];if(!file){status.textContent='En attente d’un fichier.';return;}
    if(file.size>MAX_BYTES){status.textContent='Fichier trop volumineux : limite de lecture locale de 20 Mio.';return;}
    status.textContent='Lecture locale en cours…';
    try{
      const text=await file.text();if(version!==request)return;
      report=inspectEvents(text);report.local_file=file.name;
      status.textContent=`${report.rows} lignes d’événements examinées. Synchronisation physique non vérifiée.`;
      paragraph(`Horodatages : ${report.onsets.valid} numériques, ${report.onsets.missing} manquants, ${report.onsets.invalid} invalides. ${report.row_width_errors} lignes ont un nombre de colonnes incorrect.`);
      if(report.onsets.valid)paragraph(`Plage des horodatages lus : ${report.onsets.min_seconds} à ${report.onsets.max_seconds} secondes. Ces valeurs sont relatives au début de l’enregistrement selon la convention BIDS ; elles ne sont pas des latences neuronales.`);
      paragraph(`${report.onsets.out_of_order} retours en arrière dans l’ordre des horodatages ; ${report.blank_internal_rows} lignes vides internes.`);
      paragraph(report.durations.column_present?`Durées : ${report.durations.valid} numériques, ${report.durations.missing} manquantes, ${report.durations.invalid} invalides, ${report.durations.negative} négatives.`:'Colonne duration absente : les durées ne peuvent pas être contrôlées.');
      const table=document.createElement('table'),head=table.createTHead().insertRow();
      for(const label of ['Type lu dans le fichier','Lignes']){const th=document.createElement('th');th.textContent=label;head.appendChild(th);}
      const body=table.createTBody();for(const [label,count] of Object.entries(report.event_types)){const row=body.insertRow();row.insertCell().textContent=label;row.insertCell().textContent=count;}
      const wrap=document.createElement('div');wrap.className='scroll';wrap.appendChild(table);view.appendChild(wrap);
      if(report.first_issues.length)paragraph('Premiers points à vérifier : '+report.first_issues.map(x=>`ligne ${x.line} : ${x.reason}`).join(' ; '));
      download.disabled=false;
    }catch(e){if(version===request)status.textContent='Lecture impossible : '+e.message;}
  });
  download.addEventListener('click',()=>{
    if(!report)return;const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='POLY-controle-evenements.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
})(typeof window!=='undefined'?window:globalThis);
