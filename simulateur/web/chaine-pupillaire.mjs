import {validatePupilChain,validatePupilObserved,descriptiveEventWindow,pupilEvidenceReceipt} from './pupil-evidence-core.mjs';
const $=id=>document.getElementById(id);
let contract=null,data=null,current=null;
const svgNS='http://www.w3.org/2000/svg';
const num=(x,p=3)=>Number(x).toFixed(p).replace('.',',');
function addSvg(tag,attributes={},value){
 const e=document.createElementNS(svgNS,tag);
 for(const [key,val] of Object.entries(attributes))e.setAttribute(key,String(val));
 if(value!==undefined)e.textContent=String(value);
 $('pupil-plot').append(e);
 return e;
}
function drawPlot(){
 const svg=$('pupil-plot'),t=current.event.recording_time_s,start=t-1,end=t+2;
 const bins=data.bins.filter(b=>b.t>=start-1e-8&&b.end<=end+1e-8&&b.observed>0);
 svg.replaceChildren();
 addSvg('rect',{x:55,y:28,width:280,height:225,fill:'#214557',opacity:.45});
 addSvg('rect',{x:335,y:28,width:520,height:225,fill:'#182d42',opacity:.5});
 addSvg('line',{x1:335,y1:27,x2:335,y2:253,stroke:'#f4c785','stroke-width':2,'stroke-dasharray':'5 5'});
 for(const [position,label] of [[55,'−1 s'],[335,'0 (marqueur)'],[595,'+1 s'],[855,'+2 s']]){
  addSvg('text',{x:position,y:284,fill:'#bed6e1','text-anchor':position===55?'start':position===855?'end':'middle','font-size':14},label);
 }
 const values=bins.map(b=>b.mean);
 if(!values.length){addSvg('text',{x:450,y:135,fill:'#f3c984','text-anchor':'middle'},'Aucune mesure disponible dans ces fenêtres');return;}
 const min=Math.min(...values),max=Math.max(...values),range=Math.max(.2,max-min),low=min-range*.15,high=max+range*.15;
 const x=time=>55+(time-start)/(end-start)*800,y=value=>236-(value-low)/(high-low)*196;
 for(let i=0;i<4;i++){const value=low+(high-low)*i/3;addSvg('line',{x1:55,y1:y(value),x2:855,y2:y(value),stroke:'#406077','stroke-width':1});addSvg('text',{x:8,y:y(value)+4,fill:'#b4c9d5','font-size':12},num(value,2));}
 for(const b of bins){const center=(b.t+b.end)/2;addSvg('circle',{cx:x(center),cy:y(b.mean),r:Math.max(2,2.7*Math.sqrt(b.observed/b.n)),fill:center<t?'#f0d493':'#8bdaff'});}
 addSvg('text',{x:855,y:17,fill:'#becfda','text-anchor':'end','font-size':13},'Diamètre binoculaire observé (mm) · aucun raccordement de points');
}
function setMetric(prefix,stats){
 $(prefix+'-val').textContent=stats.weighted_mean_mm===null?'Données insuffisantes':num(stats.weighted_mean_mm)+' mm';
 $(prefix+'-coverage').textContent=stats.observed_samples+' / '+stats.possible_samples+' échantillons · '+num(stats.coverage_fraction*100,1)+' % disponibles';
}
function showEvent(){
 const id=Number($('event').value);
 current=descriptiveEventWindow(data,contract,id);
 const e=current.event;
 $('event-label').textContent='Personne '+data.subject+' · tâche '+data.session+' · '+num(e.recording_time_s,3)+' s (horloge du fichier) · éclairement nominal '+num(e.nominal_illuminance_lux,1)+' lx. Aucun déclenchement nerveux directement mesuré.';
 setMetric('pre',current.before);setMetric('post',current.after);
 $('delta-val').textContent=current.descriptive_delta_mm===null?'Non calculable':(current.descriptive_delta_mm>=0?'+':'')+num(current.descriptive_delta_mm,3)+' mm';
 $('export-status').textContent='';
 drawPlot();
}
function renderGraph(){
 const ol=$('chain');ol.replaceChildren();
 for(const [index,node] of contract.nodes.entries()){
  const item=document.createElement('li');item.className='step '+(node.source_kind==='literature_anatomy'||node.source_kind==='literature_mechanism'?'known':'observed');
  const circle=document.createElement('span');circle.className='number';circle.textContent=String(index+1).padStart(2,'0');
  const content=document.createElement('div');content.className='step-content';
  const title=document.createElement('h3');title.textContent=node.label;
  const description=document.createElement('p');description.textContent=node.detail;
  const type=document.createElement('small');type.textContent=node.source_kind==='human_recording'?'Mesure humaine':node.source_kind==='observed_protocol_metadata'?'Protocole observé':'Connaissance anatomique publiée';
  content.append(title,description,type);
  item.append(circle,content);
  if(index>0){
   const edge=contract.edges.find(e=>e.from===contract.nodes[index-1].id&&e.to===node.id);
   if(edge){
    const evidence=document.createElement('div');evidence.className='edge';
    evidence.textContent=edge.status==='cross_level_hypothesis_not_subject_verified'?'Raccord individuel non validé · délai inconnu':edge.status==='documented_anatomical_pathway_bilateral'?'Projection bilatérale documentée · délai inconnu':'Voie anatomique documentée · délai inconnu';
    item.append(evidence);
   }
  }
  ol.append(item);
 }
}
function exportCurrent(){
 if(!current)return;
 const receipt=pupilEvidenceReceipt(data,contract,current.event.index);
 const url=URL.createObjectURL(new Blob([JSON.stringify(receipt,null,2)+'\n'],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='POLY-chaine-pupille-sujet01-evenement'+current.event.index+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
 $('export-status').textContent='Reçu descriptif exporté avec la source et les limites. Aucun état neuronal ni délai physiologique ajouté.';
}
async function start(){
 try{
  const [source,observations]=await Promise.all([
   fetch(new URL('../data/pupil-reflex-documentary.json',import.meta.url),{cache:'no-store'}),
   fetch(new URL('./observations-lumiere.json',import.meta.url),{cache:'no-store'})
  ]);
  if(!source.ok||!observations.ok)throw Error('Source documentaire ou mesures indisponibles');
  contract=validatePupilChain(await source.json());
  data=validatePupilObserved(await observations.json(),contract);
  const select=$('event');for(const e of data.events){
   const opt=document.createElement('option');opt.value=String(e.event_index);
   opt.textContent=String(e.event_index).padStart(2,'0')+' · '+num(e.time_recording_s,3)+' s · '+num(e.illuminance_nominal_lux,1)+' lx nominaux';
   select.append(opt);
  }
  select.value=data.events.some(x=>x.event_index===4)?'4':String(data.events[0].event_index);
  renderGraph();select.addEventListener('change',showEvent);$('export').onclick=exportCurrent;
  $('loading').hidden=true;$('app').hidden=false;showEvent();
 }catch(error){$('loading').setAttribute('role','alert');$('loading').textContent='Lecture suspendue : '+error.message+'. Aucun bilan physiologique affiché lorsque les sources ne sont pas qualifiées.';}
}
start();
