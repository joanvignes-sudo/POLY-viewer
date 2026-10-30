import {validateModelRegistry} from './model-lab-contract.mjs';
import {compareModels} from './model-lab-compare.mjs';
const get=id=>document.getElementById(id);
let registry;
function element(tag,parent,text,className){
 const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=String(text);if(parent)parent.appendChild(e);return e;
}
function clear(id){get(id).replaceChildren();}
function showModels(left,right){
 clear('model-details');
 for(const m of [left,right]){
  const box=element('article',get('model-details'),undefined,'model-card');
  element('b',box,m.title);
  element('p',box,m.status==='runnable_synthetic'?'Exécutable : modèle synthétique':'Documentaire : aucun solveur qualifié');
  element('p',box,'Contexte : '+m.scope.species+' · '+m.scope.preparation+' · '+m.scope.time_basis);
  element('p',box,'Sources : '+m.source_ids.join(', '));
 }
}
function addMetric(k,v){const box=element('div',get('metrics'));element('dt',box,k);element('dd',box,v);}
const asNumber=n=>Number.isFinite(n)?n.toPrecision(5):'ND';
function renderChart(a,b){
 const svg=get('chart'),NS='http://www.w3.org/2000/svg';svg.replaceChildren();
 const values=[...a,...b].map(p=>p.value),min=Math.min(...values),max=Math.max(...values);
 const pad=Math.max((max-min)*.1,0.01),lo=Math.max(0,min-pad),hi=max+pad;
 const left=75,right=860,top=28,bottom=313,t0=a[0].t,t1=a.at(-1).t;
 const X=t=>left+(t-t0)/(t1-t0)*(right-left),Y=v=>bottom-(v-lo)/(hi-lo)*(bottom-top);
 const line=(x1,y1,x2,y2,color)=>{const e=document.createElementNS(NS,'line');for(const [k,v] of Object.entries({x1,y1,x2,y2,stroke:color,'stroke-width':1}))e.setAttribute(k,v);svg.appendChild(e);};
 const text=(x,y,value)=>{const e=document.createElementNS(NS,'text');e.setAttribute('x',x);e.setAttribute('y',y);e.setAttribute('fill','#c2d6ec');e.setAttribute('font-size','15');e.textContent=value;svg.appendChild(e);};
 for(let i=0;i<5;i++){const v=lo+(hi-lo)*i/4,y=Y(v);line(left,y,right,y,'#2e4663');text(8,y+5,v.toFixed(3));}
 for(let i=0;i<5;i++){const t=t0+(t1-t0)*i/4,x=X(t);line(x,bottom,x,bottom+6,'#aac0d8');text(x-11,bottom+26,t.toFixed(1));}
 text(350,356,'Temps synthétique (sans unité physiologique)');text(8,16,'Lactate E (mM synthétiques)');
 const plot=(pts,color)=>{const e=document.createElementNS(NS,'polyline');e.setAttribute('points',pts.map(p=>X(p.t).toFixed(3)+','+Y(p.value).toFixed(3)).join(' '));e.setAttribute('fill','none');e.setAttribute('stroke',color);e.setAttribute('stroke-width','3');e.setAttribute('vector-effect','non-scaling-stroke');svg.appendChild(e);};
 plot(a,'#6fd7ff');plot(b,'#f4bd72');
 get('figure').hidden=false;
}
function explain(result,left,right){
 const panel=get('explanation');panel.replaceChildren();
 if(result.status!=='compared_synthetic'){
  element('h3',panel,'Comparaison refusée');
  for(const reason of result.reasons)element('p',panel,reason);
  element('p',panel,'Aucune courbe n’a été créée : le logiciel ne transpose pas les valeurs entre préparations ou horloges incompatibles.');
  return;
 }
 element('h3',panel,'Ce que les modèles ont réellement changé');
 for(const m of [left,right])element('p',panel,m.title+' : '+m.driver.description);
 element('h3',panel,'Interprétation permise');
 element('p',panel,result.interpretation.conclusion);
 element('p',panel,'Il s’agit de '+(result.interpretation.kind==='distinct_model_families'?'deux structures mécanistiques différentes.':'deux configurations d’une même famille de calcul.'));
 element('h3',panel,'Ce que POLY ne sait pas conclure');
 element('p',panel,'Aucune observation indépendante n’a été confrontée à ces courbes. Les flux réels entre cellules, les constantes humaines et la validation d’une hypothèse restent inconnus.');
}
function execute(){
 const left=registry.models.find(m=>m.id===get('left').value),right=registry.models.find(m=>m.id===get('right').value);
 showModels(left,right);get('figure').hidden=true;clear('metrics');clear('explanation');
 try{
  const result=compareModels(registry,left.id,right.id);
  if(result.status==='compared_synthetic'){
   get('verdict').textContent='Comparaison numérique synthétique réussie — aucune validation biologique.';
   renderChart(result.series.left,result.series.right);
   get('label-a').textContent=left.title;get('label-b').textContent=right.title;
   addMetric('Écart maximal absolu',asNumber(result.metrics.max_absolute_difference)+' mM');
   addMetric('Instant de cet écart',asNumber(result.metrics.time_of_max_difference)+' (temps synthétique)');
   addMetric('Différence finale B − A',asNumber(result.metrics.delta_at_end)+' mM');
   addMetric('Écart intégré',asNumber(result.metrics.integral_absolute_difference_synthetic_time)+' mM × temps synthétique');
  }else get('verdict').textContent='Comparaison non autorisée : contraintes scientifiques non satisfaites.';
  explain(result,left,right);
 }catch(e){get('verdict').textContent='Calcul interrompu : '+e.message;}
}
async function load(){
 try{
  const response=await fetch('./model-lab-registry.json',{cache:'no-store'});
  if(!response.ok)throw Error('Registre introuvable : HTTP '+response.status);
  registry=validateModelRegistry(await response.json());
  for(const id of ['left','right']){
   for(const m of registry.models){const opt=document.createElement('option');opt.value=m.id;opt.textContent=m.title+(m.status==='documentary_only'?' [sans solveur]':'');get(id).appendChild(opt);}
   get(id).disabled=false;
  }
  get('left').value='p8-control';get('right').value='p8-mct-reduced';
  get('compare').disabled=false;get('compare').addEventListener('click',execute);
  get('status').textContent=registry.models.length+' modèles et configurations enregistrés ; exécution uniquement après demande.';
  execute();
 }catch(e){get('status').textContent='Erreur de réception : '+e.message;}
}
load();
