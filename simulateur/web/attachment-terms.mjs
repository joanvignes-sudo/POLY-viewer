import {STATUS_LABELS,KIND_LABELS,ROLE_LABELS} from './attachment-engine.mjs?v=141-1';
const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e};
export function createTermExplorer(engine,data,initialTerm){
  const $=id=>document.getElementById(id), host=$('term-detail');
  const termSummary=el('p',`${data.summary.directly_documented_terms} termes avec relation directe, dont ${data.summary.documented_terms_without_geometry} sans surface rapprochée. Les 880 termes comprennent muscles nommés, groupes, parties et contexte ; ce total ne compte pas des muscles individuels.`);
  $('term-explorer').prepend(termSummary);
  for(const region of [...new Set(engine.terms().map(t=>t.region))].sort()){const o=el('option',region);o.value=region;$('term-region').append(o)}
  function card(label,r,indirect){
    const article=el('article'),badge=el('span',STATUS_LABELS[r.status]);badge.className='badge';article.dataset.relation=r.id;
    article.append(badge,el('h3',ROLE_LABELS[r.role]||r.role));
    if(indirect)article.append(el('p','Relation consultée via une surface rapprochée ; elle ne qualifie pas automatiquement le terme ou le muscle entier.'));
    const graph=el('div');graph.className='graph';graph.setAttribute('aria-label','Relation documentaire sans trajet spatial');
    graph.append(el('span',label),el('i','→'));
    if(r.via)graph.append(el('span',KIND_LABELS[r.via.kind]+' · '+r.via.label),el('i','→'));
    graph.append(el('span',KIND_LABELS[r.target.kind]+' · '+r.target.label));article.append(graph);
    article.append(el('small',r.source_surface_ids.length?'Surfaces rapprochées par nomenclature ; aucune empreinte individuelle transférée.':'Nomenclature uniquement · aucun maillage ni point 3D attribué.'));
    if(r.applicability){const p=el('p',r.applicability);p.className='warning';article.append(p)}
    article.append(el('p',r.note));
    for(const e of r.evidence){const a=el('a','Source · '+e.locator);a.href=e.url;a.target='_blank';a.rel='noopener noreferrer';article.append(a,el('small',e.scope||e.type))}
    const proof=el('details');proof.append(el('summary','Preuve, provenance et qualification'),el('pre',JSON.stringify({id:r.id,source_term_ids:r.source_term_ids,source_surface_ids:r.source_surface_ids,applicability:r.applicability,confidence:r.confidence,provenance:r.provenance,geometry:r.geometry,validation:r.validation},null,2)));article.append(proof);host.append(article);
  }
  function show(){
    const term=engine.term($('term-select').value);host.replaceChildren();
    if(!term){host.textContent='Aucun terme pour ces filtres.';window.POLY_ATTACHMENTS={selected:null,selected_term:null,summary:engine.summary()};return}
    const direct=engine.relationsForTerm(term.id);
    host.append(el('h2',term.name),el('p',`TA2:${term.id} · ${term.region} · ${term.surface_ids.length} surfaces rapprochées`));
    host.append(el('p',term.surface_ids.length?'Un rapprochement de noms ne démontre pas un muscle entier ni une insertion individuelle.':'Aucune surface rapprochée dans POLY. Fiche documentaire uniquement, sans reconstruction ni point d’insertion.'));
    if(!direct.some(r=>r.status==='documented_region'))host.append(el('p','Aucune relation documentée directement pour ce terme.'));
    for(const r of direct)card(term.name,r,false);
    if(term.surface_ids.length){
      host.append(el('h3','Surfaces rapprochées · complétude non établie'));
      for(const id of term.surface_ids){const s=engine.surface(id),a=el('a',s.name+' · '+id);a.href='#surface='+encodeURIComponent(id);a.onclick=e=>{e.preventDefault();openSurface(id)};host.append(a,el('br'))}
      const indirect=engine.relatedSurfaceRelationsForTerm(term.id);
      if(indirect.length){host.append(el('h3','Autres relations issues des surfaces · qualification distincte'));for(const r of indirect)card(term.name,r,true)}
    }
    window.POLY_ATTACHMENTS={selected:null,selected_term:term.id,summary:engine.summary(),direct_relation_count:direct.length};
    history.replaceState(null,'','#term='+encodeURIComponent(term.id));
  }
  function filter(preferred){
    const previous=typeof preferred==='string'?preferred:$('term-select').value;
    const rows=engine.filterTerms({query:$('term-query').value,region:$('term-region').value,status:$('term-qualification').value,withoutGeometry:$('term-without-geometry').checked});
    $('term-select').replaceChildren();
    for(const t of rows){const o=el('option',`${t.name} · TA2:${t.id} · ${t.surface_ids.length} surfaces`);o.value=t.id;$('term-select').append(o)}
    $('term-select').value=rows.some(t=>t.id===previous)?previous:(rows[0]?.id||'');
    $('term-status').textContent=`${rows.length} termes · ${rows.filter(t=>engine.relationsForTerm(t.id).some(r=>r.status==='documented_region')).length} avec relation documentée directe dans ce filtre`;
    show();
  }
  function switchView(){
    const terms=$('view').value==='terms';$('surface-explorer').hidden=terms;$('term-explorer').hidden=!terms;
    if(terms)show();else $('surface').dispatchEvent(new Event('change'));
  }
  function openSurface(id){
    $('query').value='';$('region').value='';$('side').value='';$('qualification').value='';$('query').dispatchEvent(new Event('input'));
    $('surface').value=id;$('view').value='surfaces';switchView();
  }
  function openTerm(id){
    $('term-query').value='';$('term-region').value='';$('term-qualification').value='';$('term-without-geometry').checked=false;
    filter(id);$('view').value='terms';switchView();
  }
  for(const id of ['term-query','term-region','term-qualification','term-without-geometry'])$(id).addEventListener('input',filter);
  $('term-select').addEventListener('change',show);$('view').addEventListener('change',switchView);
  // Prepare the terminology list without changing the current surface URL/debug selection.
  const priorHash=location.hash,priorState=window.POLY_ATTACHMENTS;filter();history.replaceState(null,'',priorHash);window.POLY_ATTACHMENTS=priorState;
  if(initialTerm)openTerm(initialTerm);
  window.addEventListener('hashchange',()=>{const h=new URLSearchParams(location.hash.slice(1));if(h.has('term'))openTerm(h.get('term'));else if(h.has('surface'))openSurface(h.get('surface'))});
}
