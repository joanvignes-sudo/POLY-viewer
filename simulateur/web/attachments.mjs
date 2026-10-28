import {createAttachmentEngine,STATUS_LABELS,KIND_LABELS,REGION_LABELS,ROLE_LABELS} from './attachment-engine.mjs?v=141-1';
import {createTermExplorer} from './attachment-terms.mjs?v=141-1';
const $=id=>document.getElementById(id), el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n};
try {
  const response=await fetch('../data/attachment-catalogue.json?v=141-1');
  if(!response.ok)throw Error('Catalogue indisponible');
  const data=await response.json(),engine=createAttachmentEngine(data);
  for(const [count,label] of [[data.summary.surfaces,'surfaces inventoriées'],[engine.summary().documented_surfaces,'avec région documentée'],[data.summary.audited_meshes,'maillages audités'],[engine.summary().validated_insertions,'insertions 3D validées']]){
    const p=el('p');p.append(el('strong',count),el('span',label));$('counts').append(p);
  }
  const table=el('table'), head=el('tr');for(const t of ['Région de présentation','Surfaces','Documentées'])head.append(el('th',t));table.append(head);
  for(const [region,c] of Object.entries(data.summary.by_region)){const row=el('tr');for(const t of [REGION_LABELS[region]||region,c.surfaces,c.documented])row.append(el('td',t));table.append(row)}$('coverage').append(table);
  data.limitations.forEach(l=>$('limits').append(el('li',l)));
  for(const region of [...new Set(data.surfaces.map(s=>s.region))].sort()){
    const o=el('option',REGION_LABELS[region]||region);o.value=region;$('region').append(o);
  }
  function show() {
    const s=engine.surface($('surface').value);if(!s)return;$('detail').replaceChildren();
    $('detail').append(el('h2',s.name),el('p',`${s.id} · ${s.side||'côté non attribué'} · ${s.atlas}`),el('p','Placement 3D estimé · points d’insertion non localisés.'));
    const link=el('a','Observer la surface dans l’avatar →');link.href=s.href;$('detail').append(link);
    const audit=s.audit;
    $('detail').append(el('p',audit.status==='not_audited'?'Pièce de contexte HRA · topologie non auditée ici.':`${audit.triangle_count} triangles · ${audit.boundary_edge_count} arêtes de bord · ${audit.nonmanifold_edge_count} arêtes non-manifold. ${audit.watertight_candidate?'Fermeture topologique candidate uniquement.':'Surface ouverte ou non-manifold.'} Aucun volume biologique validé.`));
    const rs=engine.relationsFor(s.id);
    if(!rs.some(r=>r.status==='documented_region'))$('detail').append(el('p','Aucune attache documentée qualifiée pour cette surface. Chantier ouvert.'));
    for(const r of [...rs].sort((a,b)=>(a.status==='documented_region'?-1:1)-(b.status==='documented_region'?-1:1))){
      const card=el('article');const badge=el('span',STATUS_LABELS[r.status]);badge.className='badge';card.append(badge,el('h3',ROLE_LABELS[r.role]||r.role));
      const graph=el('div');graph.className='graph';graph.setAttribute('aria-label','Relation documentaire, sans trajet 3D');
      graph.append(el('span',s.name),el('i','→'));if(r.via)graph.append(el('span',`${KIND_LABELS[r.via.kind]} · ${r.via.label}`),el('i','→'));
      graph.append(el('span',`${KIND_LABELS[r.target.kind]} · ${r.target.label}`));card.append(graph,el('small',r.source_surface_ids.length>1?'Référence partagée entre plusieurs surfaces ; aucune empreinte attribuée par chef ou par côté.':'Relation régionale propre à cette fiche documentaire.'));
      card.append(el('p',r.note));
      for(const e of r.evidence){const a=el('a','Source · '+e.locator);a.href=e.url;a.target='_blank';a.rel='noopener noreferrer';card.append(a,el('small',e.scope||e.type))}
      const proof=el('details');proof.append(el('summary','Preuve, provenance et qualification'),el('pre',JSON.stringify({id:r.id,confidence:r.confidence,provenance:r.provenance,geometry:r.geometry,validation:r.validation},null,2)));card.append(proof);$('detail').append(card);
    }
    window.POLY_ATTACHMENTS={selected:s.id,summary:engine.summary(),relation_count:rs.length};
    history.replaceState(null,'','#surface='+encodeURIComponent(s.id));
  }
  function filter(preferred){const prior=typeof preferred==='string'?preferred:$('surface').value;const rows=engine.filter({query:$('query').value,region:$('region').value,side:$('side').value,status:$('qualification').value});$('surface').replaceChildren();for(const s of rows){const o=el('option',`${s.name} · ${s.side||'?'} · ${s.id}`);o.value=s.id;$('surface').append(o)}$('surface').value=rows.some(s=>s.id===prior)?prior:(rows[0]?.id||'');$('status').textContent=`${rows.length} surfaces · ${rows.filter(s=>s.attachment_status==='documented_region').length} avec région documentée dans ce filtre`;$('detail').textContent=rows.length?'':'Aucune surface pour ces filtres.';show()}
  for(const id of ['query','region','qualification','side'])$(id).addEventListener('input',filter);$('surface').addEventListener('change',show);
  const initialHash=new URLSearchParams(location.hash.slice(1));
  filter(initialHash.get('surface'));
  createTermExplorer(engine,data,initialHash.get('term'));
} catch(error) {$('status').textContent='Catalogue non chargé ou qualification invalide : '+error.message;console.error(error)}
