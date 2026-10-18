(()=>{'use strict';
if(new URLSearchParams(location.search).get('lecture')!=='etapes')return;
// Fragment-only navigation does not reload the historical viewer. Reload this
// presentation when a shared selection changes, so the rendered state matches it.
window.addEventListener('hashchange',()=>{if(new URLSearchParams(location.hash.slice(1)).get('id'))location.reload();});
const exploration=document.querySelector('.exploration'),head=document.querySelector('.selection-head'),process=document.querySelector('.process');if(!exploration||!head||!process)return;
head.after(process);const graphScroll=process.querySelector('.graph-scroll');if(graphScroll)process.querySelector('.process-head').after(graphScroll);
const nav=document.createElement('nav');nav.className='ux-breadcrumb';nav.setAttribute('aria-label','Fil d’Ariane');
const home=document.createElement('a');home.href='index.html';home.textContent='Accueil';
const catalogue=document.createElement('a');catalogue.href='chaines.html';catalogue.textContent='Chaînes d’actions · changer de chaîne';
const current=document.createElement('span');current.setAttribute('aria-current','page');nav.append(home,catalogue,current);document.querySelector('.ergo-top').after(nav);
const title=document.querySelector('#selection-title');title.setAttribute('tabindex','-1');let arrived=false;
const requested=document.documentElement.dataset.uxRequestedId;
const update=()=>{
 if(title.textContent==='Le registre ne peut pas être chargé.'){
  if(arrived)return;
  arrived=true;
  document.documentElement.classList.add('ux-load-error');
  current.textContent='Registre indisponible';
  head.setAttribute('role','alert');
  const scope=document.querySelector('#selection-scope');
  if(scope){
   const original=scope.textContent;
   scope.textContent='Les informations nécessaires à cette chaîne n’ont pas pu être lues. Réessayez le chargement ou choisissez une autre chaîne. Les annotations déjà enregistrées ne sont pas modifiées.';
   const diagnostic=document.createElement('details');diagnostic.className='ux-load-diagnostic';
   const summary=document.createElement('summary');summary.textContent='Diagnostic technique';
   const text=document.createElement('pre');text.textContent=original;
   diagnostic.append(summary,text);head.append(diagnostic);
  }
  title.focus({preventScroll:true});
  return;
 }
 current.textContent=document.querySelector('#selection-id')?.textContent||'Chargement';
 if(arrived||!document.querySelector('#graph [data-node]'))return;
 const exists=!requested||[...document.querySelectorAll('#catalogue-list [data-id]')].some(x=>x.dataset.id===requested);
 if(!exists){
  document.documentElement.classList.add('ux-invalid');
  const error=document.createElement('section');error.className='ux-route-error';error.setAttribute('role','alert');error.setAttribute('tabindex','-1');
  const heading=document.createElement('h1');heading.textContent='Cette sélection est introuvable';
  const text=document.createElement('p');text.textContent='Ce lien ne correspond à aucune chaîne ou parcours disponible. Choisissez une chaîne dans le catalogue.';
  const link=document.createElement('a');link.href='chaines.html';link.textContent='Choisir une chaîne d’actions';error.append(heading,text,link);nav.after(error);error.focus({preventScroll:true});
  const url=new URL(location.href),params=new URLSearchParams(url.hash.slice(1));params.set('id',requested);url.hash=params.toString();history.replaceState(null,'',url);
 }else title.focus({preventScroll:true});
 arrived=true;
};
new MutationObserver(update).observe(document.querySelector('.exploration'),{childList:true,subtree:true,characterData:true});update();
})();
