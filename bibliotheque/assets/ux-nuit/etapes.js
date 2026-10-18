(()=>{'use strict';
if(new URLSearchParams(location.search).get('lecture')!=='etapes')return;
const process=document.querySelector('.process'),graph=document.querySelector('#graph'),graphScroll=document.querySelector('.graph-scroll'),card=document.querySelector('#step-card');if(!process||!graph||!graphScroll||!card)return;
const controls=document.createElement('div');controls.className='ux-step-views';controls.setAttribute('role','group');controls.setAttribute('aria-label','Présentation des éléments');
const listButton=document.createElement('button');listButton.type='button';listButton.id='ux-view-list';listButton.textContent='Liste lisible';listButton.setAttribute('aria-pressed','true');listButton.setAttribute('aria-controls','ux-step-list');
const mapButton=document.createElement('button');mapButton.type='button';mapButton.id='ux-view-map';mapButton.textContent='Carte des relations';mapButton.setAttribute('aria-pressed','false');mapButton.setAttribute('aria-controls','graph-scroll');graphScroll.id='graph-scroll';
controls.append(listButton,mapButton);
const note=document.createElement('p');note.className='ux-step-note';note.textContent='Ordre du registre, pas une chronologie.';
const list=document.createElement('ul');list.id='ux-step-list';list.className='ux-step-list';list.setAttribute('aria-label','Éléments du dossier, dans l’ordre documentaire du registre');
const details=document.createElement('details');details.id='ux-step-details';details.className='ux-step-details';
const summary=document.createElement('summary');summary.textContent='Lire l’élément sélectionné';
const back=document.createElement('button');back.type='button';back.className='ux-step-return';back.textContent='Revenir à la liste des éléments';
details.append(summary,back,card);card.setAttribute('tabindex','-1');
process.querySelector('.process-head').after(controls,note,list);list.after(details);
let signature='',view='list',firstBuild=true;
function show(next){view=next;list.hidden=next!=='list';note.hidden=next!=='list';graphScroll.hidden=next!=='map';listButton.setAttribute('aria-pressed',String(next==='list'));mapButton.setAttribute('aria-pressed',String(next==='map'));if(next==='map'){const active=graph.querySelector('[data-node][aria-pressed="true"]');if(active){graphScroll.scrollTop=Math.max(0,active.offsetTop-80);graphScroll.scrollLeft=Math.max(0,active.offsetLeft-40);}}}
listButton.addEventListener('click',()=>{show('list');const active=list.querySelector('[aria-pressed="true"]')||list.querySelector('button');if(active){active.focus({preventScroll:true});active.scrollIntoView({block:'center'});}});
mapButton.addEventListener('click',()=>{show('map');graphScroll.focus({preventScroll:true});graphScroll.scrollIntoView({block:'start'});});
function openDetails(){details.open=true;card.focus({preventScroll:true});details.scrollIntoView({block:'start'});}
back.addEventListener('click',()=>{show('list');details.open=false;const active=list.querySelector('[aria-pressed="true"]')||list.querySelector('button');if(active){active.focus({preventScroll:true});active.scrollIntoView({block:'center'});}});
graph.addEventListener('click',e=>{if(e.target.closest('[data-node]'))openDetails();});
// Keep the selected dossier in the shared URL when scrolling to its sources.
card.querySelectorAll('a[href="#dossier"],a[href="#annotations"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const target=document.querySelector(a.getAttribute('href'));if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({block:'start'});}}));
function update(){
 const originals=[...graph.querySelectorAll('[data-node]')];if(!originals.length)return;
 const next=originals.map(b=>b.getAttribute('aria-label')).join('\n');
 if(next!==signature){
  signature=next;list.replaceChildren();
  for(const original of originals){
   const item=document.createElement('li'),button=document.createElement('button'),id=document.createElement('small'),label=document.createElement('span');
   button.type='button';button.dataset.uxNode=original.dataset.node;button.setAttribute('aria-label',original.getAttribute('aria-label'));
   id.textContent=original.querySelector('small')?.textContent||'';label.className='ux-step-label';label.textContent=[...original.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();
   button.append(id,label);
   if(original.classList.contains('gap')){const gap=document.createElement('span');gap.className='ux-gap-label';gap.id='ux-gap-'+original.dataset.node;gap.textContent='Point ouvert';button.classList.add('ux-step-gap');button.setAttribute('aria-describedby',gap.id);button.append(gap);}
   button.addEventListener('click',()=>{const source=graph.querySelector('[data-node="'+button.dataset.uxNode+'"]');if(source)source.click();});
   item.append(button);list.append(item);
  }
 }
 for(const button of list.querySelectorAll('[data-ux-node]')){const source=graph.querySelector('[data-node="'+button.dataset.uxNode+'"]');button.setAttribute('aria-pressed',source?.getAttribute('aria-pressed')||'false');}
 const selected=graph.querySelector('[data-node][aria-pressed="true"]');
 if(selected)summary.textContent=(document.querySelector('#selection-id')?.textContent.split(' · ')[0]||'Dossier')+' · Élément '+(+selected.dataset.node+1)+' / '+originals.length;
 show(view);
 if(firstBuild){firstBuild=false;if(selected&&selected.dataset.node!=='0')openDetails();}
}
new MutationObserver(update).observe(graph,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed']});update();
})();
