import {GROUPS,makeLiteCatalogue,filterLite,projectLiteBox} from './body-light-core.mjs';
const $=id=>document.getElementById(id),svgNS='http://www.w3.org/2000/svg';
let catalogue=null,filtered=[],selected=null,visibleRows=45;
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);return node};
function svgEl(tag,attributes={},label){
 const node=document.createElementNS(svgNS,tag);
 for(const [k,v]of Object.entries(attributes))node.setAttribute(k,String(v));
 if(label!==undefined){const title=document.createElementNS(svgNS,'title');title.textContent=label;node.append(title);}
 return node;
}
function details(record){
 const target=$('selected');target.replaceChildren();
 if(!record){target.append(el('p','','Aucune structure sélectionnée pour ce filtre.'));return;}
 const h=el('h3','',record.name.replace(/^VH_M_/,'').replaceAll('_',' '));
 const system=el('p','','Groupe de l’atlas : '+(GROUPS[record.system]||record.system));
 const path=el('p','','Chemin de provenance : '+record.path.join(' / '));
 const box=el('p','','Volume englobant du repère 3D : min ['+record.bounds[0].map(v=>v.toFixed(3)).join(' ; ')+'] · max ['+record.bounds[1].map(v=>v.toFixed(3)).join(' ; ')+']');
 const status=el('p','','Statut : bornes d’une géométrie anatomique de référence, pas une région cérébrale individuelle, une enthèse vérifiée ou une simulation.');
 target.append(h,system,path,box,status);
}
function draw(){
 const svg=$('map');svg.replaceChildren();
 const view=$('view').value;
 const grid=svgEl('g',{'aria-hidden':'true'});
 for(let i=1;i<=5;i++){grid.append(svgEl('line',{x1:50,y1:i*113,x2:550,y2:i*113,stroke:'#244357','stroke-width':1}));}
 svg.append(grid);
 const projection=svgEl('g',{'data-layer':'atlas-bounds'});
 for(const record of filtered){
  const p=projectLiteBox(record,catalogue.bounds,view);
  const circle=svgEl('circle',{cx:p.centerX,cy:p.centerY,r:3,fill:record.system==='skeletal'?'#a4c5d6':'#6baec4','fill-opacity':.57,'data-source-index':record.index},record.name);
  circle.addEventListener('click',()=>select(record.index));
  projection.append(circle);
 }
 svg.append(projection);
 if(selected){
  const p=projectLiteBox(selected,catalogue.bounds,view);
  const rect=svgEl('rect',{x:p.x,y:p.y,width:Math.max(2,p.width),height:Math.max(2,p.height),fill:'#f4ca85','fill-opacity':.12,stroke:'#f4ca85','stroke-width':2,'data-selected-index':selected.index},'Boîte englobante de '+selected.name);
  rect.style.pointerEvents='none';svg.append(rect);
  svg.append(svgEl('circle',{cx:p.centerX,cy:p.centerY,r:6,fill:'#f4ca85','data-selected-point':selected.index}));
  const text=svgEl('text',{x:16,y:24,'font-size':13,fill:'#f2d5a2'},selected.name.replace(/^VH_M_/,'').replaceAll('_',' ').slice(0,55));
  // Plain SVG text with no trusted HTML inserted.
  text.textContent=selected.name.replace(/^VH_M_/,'').replaceAll('_',' ').slice(0,55);
  svg.append(text);
 }
}
function select(index){
 const record=catalogue.records.find(r=>r.index===Number(index));
 if(!record||!filtered.some(r=>r.index===record.index))return;
 selected=record;
 details(selected);draw();
 for(const b of $('results').querySelectorAll('button[data-source-index]'))b.setAttribute('aria-current',String(b.dataset.sourceIndex===String(index)));
}
function list(){
 const results=$('results');results.replaceChildren();
 const count=$('count');count.textContent=filtered.length+' structure'+(filtered.length===1?'':'s')+' trouvée'+(filtered.length===1?'':'s')+' · '+catalogue.records.length+' dans l’inventaire de référence.';
 for(const r of filtered.slice(0,visibleRows)){
  const button=el('button','',r.name.replace(/^VH_M_/,'').replaceAll('_',' '));
  button.type='button';button.dataset.sourceIndex=String(r.index);button.setAttribute('aria-current',String(selected?.index===r.index));
  const tag=el('small','',(GROUPS[r.system]||r.system)+' · '+r.path.at(-1));button.append(tag);
  button.onclick=()=>select(r.index);results.append(button);
 }
 if(!filtered.length)results.append(el('p','','Aucune structure de cet atlas ne correspond à cette recherche. Cela ne prouve pas l’absence de cette structure dans le corps humain.'));
 $('more').hidden=filtered.length<=visibleRows;
 $('more').textContent='Afficher '+Math.min(45,filtered.length-visibleRows)+' résultats supplémentaires';
}
function refresh(reset=true){
 if(reset)visibleRows=45;
 const q=$('search').value;
 filtered=filterLite(catalogue,{system:$('system').value,query:q});
 if(!filtered.some(x=>x.index===selected?.index))selected=filtered[0]||null;
 details(selected);list();draw();
}
async function start(){
 try{
  const response=await fetch('../models/body-display.json',{cache:'no-store'});
  if(!response.ok)throw Error('Inventaire indisponible (HTTP '+response.status+')');
  catalogue=makeLiteCatalogue(await response.json());
  $('loading').hidden=true;$('app').hidden=false;
  $('system').addEventListener('change',()=>refresh());
  $('search').addEventListener('input',()=>{if($('search').value.trim()&&$('system').value!=='all')$('system').value='all';refresh();});
  $('view').addEventListener('change',draw);
  $('more').onclick=()=>{visibleRows+=45;list();};
  refresh();
 }catch(e){
  $('loading').setAttribute('role','alert');
  $('loading').textContent='L’explorateur léger est indisponible : '+e.message+'. Ouvrir les observations humaines et les dossiers reste possible via la navigation.';
 }
}
start();
