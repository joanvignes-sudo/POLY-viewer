(()=>{'use strict';
const local=document.querySelector('[data-ergo-local]');
const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/œ/g,'oe');
const search=document.querySelector('#ergo-search');
if(search){
 const cards=[...document.querySelectorAll('.ergo-card')];
 const update=()=>{const terms=normalize(search.value.trim()).split(/\s+/).filter(Boolean);let count=0;
  for(const card of cards){const haystack=normalize(card.textContent+' '+(card.dataset.search||''));card.hidden=!terms.every(t=>haystack.includes(t));if(!card.hidden)count++;}
  document.querySelector('#ergo-count').textContent=search.value.trim()?`${count} catégorie${count===1?'':'s'} correspondante${count===1?'':'s'} sur ${cards.length}`:`${cards.length} catégories · tous les parcours sont affichés`;
  document.querySelector('#ergo-empty').hidden=count!==0;
 };
 search.addEventListener('input',update);
 document.querySelector('#ergo-reset').addEventListener('click',()=>{search.value='';update();search.focus();});
 const oldState=new URLSearchParams(location.hash.slice(1));
 const legacyAnchors=['workspace','dossier','annotations','process-title','comparison'];
 if(oldState.has('id')||legacyAnchors.includes(location.hash.slice(1))){location.replace('atelier.html'+location.search+location.hash);return;}
 document.querySelector('.ergo-global').addEventListener('click',e=>{const a=e.target.closest('a');if(a){search.value='';update();}});
 update();
}
if(!local)return;
const list=local.querySelector('[data-ergo-sections]');
let nextAnchor=0;
const controls=local.querySelector('[data-ergo-controls]');
const selectLabels={view:'Contenu à afficher',sample:'Échantillon',level:'Niveau d’observation',field:'Champ microscopique',bbframe:'Repère d’affichage'};
function refreshChoices(){
 const selects=Object.keys(selectLabels).map(id=>document.getElementById(id)).filter(el=>el?.tagName==='SELECT');
 const modes=[...document.querySelectorAll('button[data-mode],button[data-detail],.nav button[data-tab]')];
 const signature=JSON.stringify([selects.map(s=>[s.id,s.value,s.disabled,[...s.options].map(o=>[o.value,o.textContent,o.disabled])]),modes.map(b=>[b.textContent,b.getAttribute('aria-pressed'),b.className,b.disabled])]);
 if(signature===controls.dataset.signature)return;
 controls.dataset.signature=signature;
 const fragment=document.createDocumentFragment();
 const group=title=>{const div=document.createElement('div'),h=document.createElement('h3'),row=document.createElement('div');div.className='ergo-choice-group';h.textContent=title;row.className='ergo-links';row.setAttribute('role','group');row.setAttribute('aria-label',title);div.append(h,row);fragment.append(div);return row;};
 for(const select of selects){
  const options=[...select.options].filter(o=>!o.disabled&&o.value);
  if(options.length<2)continue;
  const row=group(selectLabels[select.id]);
  for(const option of options){const b=document.createElement('button');b.type='button';b.textContent=option.textContent;b.disabled=select.disabled;b.setAttribute('aria-pressed',String(select.value===option.value));b.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));schedule();});row.append(b);}
 }
 if(modes.length){const row=group('Modes de lecture et de présentation');for(const original of modes){const b=document.createElement('button');b.type='button';b.textContent=original.textContent;b.disabled=original.disabled;b.setAttribute('aria-pressed',String(original.getAttribute('aria-pressed')==='true'||original.classList.contains('active')));b.addEventListener('click',()=>{original.click();schedule();});row.append(b);}}
 controls.replaceChildren(fragment);local.querySelector('[data-ergo-choices]').hidden=!controls.children.length;
}
function visibleHeading(h){return !h.closest('[hidden]')&&!h.closest('.poly-orientation')&&!h.closest('.ergo-local')&&!h.closest('#results')&&!h.closest('details:not([open])');}
function refresh(){
 const headings=[...document.querySelectorAll('main h2, main h3')].filter(visibleHeading);
 const signature=headings.map(h=>h.id+'|'+h.textContent.trim()).join('\n');
 if(signature===list.dataset.signature)return;
 list.dataset.signature=signature;
 const fragment=document.createDocumentFragment();
 headings.forEach(h=>{if(!h.id){let id;do{id='ergo-section-'+nextAnchor++;}while(document.getElementById(id));h.id=id;}const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent.trim();fragment.append(a);});
 if(document.getElementById('results')){const a=document.createElement('a');a.href='#results';a.textContent='Résultats de la recherche';fragment.append(a);}
 list.replaceChildren(fragment);
 local.querySelector('[data-ergo-fallback]').hidden=list.children.length>0;
}
list.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const target=document.getElementById(a.hash.slice(1));if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}});
let scheduled=false;
const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh();refreshChoices();});}};
const main=document.querySelector('main');
if(main)new MutationObserver(schedule).observe(main,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','open','disabled','aria-pressed']});
document.addEventListener('toggle',schedule,true);document.addEventListener('change',schedule);document.addEventListener('click',schedule);refresh();refreshChoices();
})();
