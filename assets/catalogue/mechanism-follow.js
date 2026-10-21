(function(root){'use strict';
 const pain={
 I01:['Chaleur locale','Terminaison cutanée','Transduction','Plusieurs capteurs possibles ; la main est illustrative.'],
 I02:['Canal sensible','Courant / dépolarisation','Excitabilité','Un courant ne garantit pas un potentiel d’action.'],
 I03:['Côté cutané','Afférence Aδ ou C','Entrée spinale','Deux familles alternatives ; aucune vitesse biologique ajoutée.'],
 I04:['Afférence','Relais spinal','Suite / modulation','La transmission et la modulation sont à distinguer.'],
 I05:['Voie ascendante','Relais candidats','Opercule / insula','Raccord pédagogique ; relais et continuité restent à confirmer.'],
 I06:['Signal cortical','Enregistrement','Rapport distinct','Un signal évoqué ne date pas directement le vécu.'],
 I07:['Personne','Déclaration','Rapport observé','Pas un déplacement nerveux ni un centre unique de douleur.'],
 I08:['ATP / ions','Pompe membranaire','Gradients entretenus','Mécanisme local, condition de l’excitabilité.'],
 I09:['Gradients ioniques','KCC2 membranaire','Gradient Cl⁻','Mécanisme local ; contexte de préparation à conserver.']};
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function describe(group,action,route){
  const primary=action.source_node_id||action.nodeIds?.[0];
  let cfg=group.id==='ARCHIVE:pain'?pain[action.id]:null;
  const row=(root.PolyLocalizations||[]).find(r=>r.group===group.id&&r.node===primary);
  if(row&&/^(ETUDE:|HUMAIN:|ARCHIVE:stable$)/.test(group.id)&&(action.template==='GENERIC_TRANSFORM'||action.output_label==='État résultant à préciser')){
   const labels={nose:'Respiration / capteur',lungs:'Thorax / respiration',heart:'Cœur',skin:'Peau / capteur',brain:'Cerveau',amygdala:'Amygdale',insula:'Insula',eye:'Entrée visuelle',face:'Visage',recording:'Enregistrement',analysis:'Analyse',statistics:'Estimation',report:'Rapport / réponse',task:'Dispositif / tâche',iv_site:'Injection périphérique',blood:'Apport sanguin',cytosol:'Cytosol',mitochondrion:'Mitochondries',membrane:'Membrane',extracellular:'Milieu extracellulaire',dendrite:'Entrées dendritiques',axon:'Axone / activité',astrocyte:'Astrocyte',endothelium:'Endothélium',vascular_muscle:'Paroi vasculaire',endosome:'Compartiment récupéré',vesicle:'Vésicule / pool'};
   const operations={MEASURE:'Mesure instrumentale',PARALLEL:'Mesures parallèles',ANALYSIS:'Calcul / comparaison',REPORT:'Réponse de la personne',CONTEXT:'Condition de protocole',BODY:'Lien illustratif',MECHANISM:'Transformation locale'};
   cfg=[labels[row.fromSite]||row.fromSite,operations[row.role]||'Opération décrite',labels[row.toSite]||row.toSite,row.rationale];
   if(primary==='EMO-CLOCK')cfg=['Horloges distinctes','Raccord à vérifier','Alignement non acquis',row.rationale];
   if(primary==='HASS-EMOTION')cfg=['Rapports après essai','p négatif = 0,053','Seuil 0,05 non franchi',row.rationale];
   if(primary==='INMAN-AUTON')cfg=['Peau et cœur','Deux capteurs','Signaux distincts',row.rationale];
  }
  if(['P03-ISO-PANIC-ROUTE','P03-ISO-DIAL-ROUTE','HASS-GAP'].includes(primary)&&['spinal','vagal'].includes(route)){const alt=row?.alternatives?.find(a=>a.id===route);cfg=['Cœur',route==='spinal'?'Ganglion dorsal / moelle ?':'Passage vagal cervical ?',primary==='HASS-GAP'?'Relais → insula ?':'Tronc · relais candidats',alt?.rationale||'Alternatives non départagées par cette étude.'];}
  const review=(root.PolyIntervalReviews||[]).find(r=>r.group===group.id&&r.interval===action.id);if(!cfg&&review?.render_mode==='CONTEXTUAL_SCHEME')cfg=[...review.phase_labels,review.annotation];
  return cfg ? [...cfg] : null;
 }
 function html(group,action,route){let cfg=describe(group,action,route);if(!cfg)return null;const review=(root.PolyIntervalReviews||[]).find(r=>r.group===group.id&&r.interval===action.id);if(review&&!review.specific_descriptor_already_available&&review.render_mode==='CONTEXTUAL_SCHEME')cfg=[...review.visual_labels,review.annotation];
  return '<div class="follow-scheme" style="font:12px Segoe UI,sans-serif;color:#244b40;padding:12px;width:400px;height:230px;box-sizing:border-box"><div style="font-size:10px;letter-spacing:1px;color:#617a65">MÉCANISME · SCHÉMA PÉDAGOGIQUE</div><h3 style="font:17px Georgia,serif;margin:10px 0">'+esc(action.title)+'</h3><svg role="img" aria-label="'+esc(cfg.slice(0,3).join(' → '))+'" viewBox="0 0 376 100" style="width:100%;height:100px"><path d="M32 50 H344" stroke="#608b74" stroke-width="4" stroke-dasharray="5 4"/>'+cfg.slice(0,3).map((label,i)=>'<g data-follow-step="'+i+'"><rect x="'+(i*126)+'" y="16" width="122" height="68" rx="12" fill="#e1ecd7" stroke="#719579"/><foreignObject x="'+(i*126+6)+'" y="23" width="110" height="54"><div xmlns="http://www.w3.org/1999/xhtml" style="font:12px Segoe UI,sans-serif;text-align:center;line-height:1.3;padding-top:8px">'+esc(label)+'</div></foreignObject></g>').join('')+(review?.role==='CONDITION'?'':'<circle data-follow-pulse="true" cx="12" cy="91" r="5" fill="#95702c"/>')+'</svg><p style="font-size:10px;line-height:1.4;margin:6px 0">'+esc(cfg[3])+'</p></div>';
 }
 function update(progress){
  const p=Math.max(0,Math.min(1,progress)),pulse=document.querySelector('[data-follow-pulse]');if(!pulse)return;
  pulse.setAttribute('cx',String(12+p*352));
  document.querySelectorAll('[data-follow-step]').forEach(e=>{e.setAttribute('opacity','1');const r=e.querySelector('rect');if(r){const active=Number(e.dataset.followStep)===Math.min(2,Math.floor(p*3));r.setAttribute('fill',active?'#c6dfae':'#eef3e8');r.setAttribute('stroke-width',active?'3':'1');}});
  document.documentElement.dataset.mechanismProgress=p.toFixed(4);
 }
 const api={html,describe,update};if(typeof module==='object'&&module.exports)module.exports=api;else root.PolyMechanismFollow=api;
})(typeof window==='undefined'?globalThis:window);
