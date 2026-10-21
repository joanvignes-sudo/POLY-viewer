/* POLY Adaptive Lab local browser shell — three views, zero implied 3D registration. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const Core=window.PolyAdaptiveCore;
  const Views=window.PolyRepresentations;
  const Registry=window.PolyEnvironmentRegistry;
  let session=null,ticker=null,organChoiceExplicit=false;
  const env=Registry.defaults();

  function showError(e) {
    $('error').hidden=false;
    $('error').textContent='Impossible de charger le laboratoire : '+(e && e.message || String(e))+
      ' · Vérifier le serveur local et les fichiers de données.';
  }
  function stop(){
    if(ticker!==null)clearInterval(ticker);
    ticker=null;
    $('play').textContent='▶ Lecture pédagogique';
  }
  function drawAtlas(snapshot){
    const canvas=$('canvas');
    $('atlas-organ').disabled=false;
    const select=$('atlas-organ');
    const suggestion=window.PolyAtlasViewer?.suggestedOrgan(snapshot);
    if(!organChoiceExplicit && suggestion && suggestion!==select.value)select.value=suggestion;
    if(!canvas.querySelector('#atlas-stage')){
      canvas.innerHTML='<section class="presentation atlas-presentation" data-view="hra_atlas">'+
        '<div class="stage-head"><strong>Human Reference Atlas · v2.5</strong><span>Exploration de référence, sans recalage POLY</span></div>'+
        '<div id="atlas-stage" class="atlas-stage" role="img" aria-label="Modèle 3D anatomique HRA de référence"></div>'+
        '<label class="atlas-structure-label" for="atlas-subpart">Explorer une sous-structure de l’atlas (non localisée dans POLY)</label>'+ 
        '<select id="atlas-subpart" disabled><option value="">Organe complet</option></select>'+ 
        '<p id="atlas-status" role="status" data-level="info">Chargement du moteur WebGL local…</p>'+
        '<p id="atlas-provenance" class="visual-note">Modèles HRA CC BY 4.0, conservés sur le PC.</p>'+
        '<div class="scientific-warning">Correspondance de vocabulaire uniquement : ni trajet nerveux mesuré, ni correspondance individuelle avec f002, ni vitesse de propagation.</div>'+
        '</section>';
    }
    canvas.dataset.view='hra_atlas';
    if(window.PolyAtlasViewer){
      window.PolyAtlasViewer.mount($('atlas-stage'),snapshot,select.value).catch(showError);
    }
  }

  function render(){
    if(!session)return;
    const s=session.snapshot(),e=s.event;
    if(s.view_id==='hra_atlas'){
      drawAtlas(s);
    }else{
      window.PolyAtlasViewer?.stop();
      $('atlas-organ').disabled=true;
      $('canvas').dataset.view=s.view_id;
      $('canvas').innerHTML=Views.render(s);
    }
    $('position').textContent='Intervalle '+e.id+' · '+(s.index+1)+' / '+s.total;
    $('position-slider').value=String(s.index);
    $('back').disabled=s.index===0;
    $('next').disabled=s.index===s.total-1;
    $('event-title').textContent=e.title;
    $('event-role').textContent=e.stage_class+' / '+e.role;
    $('event-species').textContent=e.species+' · '+e.preparation;
    $('event-location').textContent=e.location_explanation+' · '+e.spatial_status;
    $('event-route').textContent=e.route_status+' · Continuité mesurée : NON';
    $('warning').textContent=e.qualification_note ||
      'Source à relire : présence de référence ne démontre pas le lien causal.';
    $('confirmation').textContent=e.confirmation_question || 'Validation indépendante requise.';
    const sources=$('sources');sources.replaceChildren();
    if(e.source_urls.length===0){
      const none=document.createElement('p');none.textContent='Aucune référence directe associée à cet intervalle.';sources.append(none);
    } else for(const [i,url] of e.source_urls.entries()){
      const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';
      try{a.textContent=(i+1)+'. '+new URL(url).hostname;}catch{a.textContent=(i+1)+'. Source';}
      a.title=url;sources.append(a);
    }
    const caps=$('capabilities');caps.replaceChildren();
    const table=document.createElement('dl');
    for(const type of Registry.KINDS){
      const term=document.createElement('dt');term.textContent=type;
      const detail=document.createElement('dd');
      detail.textContent=env.describe().filter(a=>a.kind===type)
        .map(a=>a.id+' : '+(a.status==='ready'?'accessible':'non intégré')).join(' ; ');
      table.append(term,detail);
    }
    caps.append(table);
    window.dispatchEvent(new CustomEvent("poly-documentary-render",{detail:JSON.parse(JSON.stringify(s))}));
  }

  async function init(){
    const response=await fetch('../data/pain_thermal_r6.json',{cache:'no-store'});
    if(!response.ok)throw new Error('Registre documentaire HTTP '+response.status);
    const payload=await response.json();
    Core.validateScenario(payload);
    if(!env.resolve('anatomical',['conceptual_anchors'],'mixed').some(x=>x.allowed))
      throw new Error('Aucun adaptateur anatomique conceptuel compatible.');
    session=Core.makeSession(payload);
    $('position-slider').max=String(payload.events.length-1);
    $('view-mode').addEventListener('change',()=>{
      stop();organChoiceExplicit=false;
      session.setView($('view-mode').value);render();
    });
    $('atlas-organ').addEventListener('change',()=>{
      if(session.snapshot().view_id==='hra_atlas'){
        organChoiceExplicit=true;render();
      }
    });
    $('position-slider').addEventListener('input',()=>{
      stop();session.seek(Number($('position-slider').value));render();
    });
    $('back').addEventListener('click',()=>{stop();session.step(-1);render();});
    $('next').addEventListener('click',()=>{stop();session.step(1);render();});
    $('play').addEventListener('click',()=>{
      if(ticker!==null){stop();return;}
      if(session.snapshot().index===session.snapshot().total-1)session.seek(0);
      render();
      $('play').textContent='Ⅱ Pause';
      ticker=setInterval(()=>{
        if(session.snapshot().index>=session.snapshot().total-1){stop();return;}
        session.step(1);render();
      },2800);
    });
    render();
    $('canvas').dataset.ready='true';
    window.PolyAdaptiveLab={session,env};
  }
  window.addEventListener('poly-atlas-ready',()=>{
    if(session?.snapshot().view_id==='hra_atlas')render();
  });
  init().catch(showError);
})();
