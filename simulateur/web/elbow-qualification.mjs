// Read-only qualification panel: literature, atlas mesh topology, and blocking criteria.
// It never creates insertion coordinates, force paths, or muscle volume estimates.
const node=(tag,label,className='')=>{
  const e=document.createElement(tag);
  if(label!==undefined)e.textContent=label;
  if(className)e.className=className;
  return e;
};

export async function createElbowQualificationPanel(card){
  const host=node('section');
  host.id='elbow-anatomy-qualification';
  host.className='elbow-qualification';
  host.hidden=true;
  host.setAttribute('aria-label','Qualification scientifique des insertions et des maillages du coude');
  card.querySelector('#forearm-motor-bone-relations').after(host);
  const style=node('style');
  style.textContent=`
    #elbow-anatomy-qualification{margin:13px 0;padding:13px;border:1px solid #7bc9b5;border-radius:11px;background:#102e39}
    #elbow-anatomy-qualification[hidden]{display:none!important}
    #elbow-anatomy-qualification h4{margin:0 0 7px;font-size:14px;color:#d5fff2}
    #elbow-anatomy-qualification article{border-top:1px solid #426673;padding-top:10px;margin-top:10px}
    #elbow-anatomy-qualification article strong{display:block;color:#e8f8fa}
    #elbow-anatomy-qualification p,#elbow-anatomy-qualification .elbow-status{font-size:12px;line-height:1.5;color:#c0d6db;margin:5px 0}
    #elbow-anatomy-qualification .elbow-status{padding:7px 10px;border-radius:7px;background:#1a3544;color:#f3d0a6}
    #elbow-anatomy-qualification .elbow-mesh-warning{border-left:3px solid #edc38a;padding-left:9px}
    #elbow-anatomy-qualification a{color:#a1f1df;text-underline-offset:2px}
  `;
  document.head.append(style);
  let qualifications=null,audit=null,motion=null;
  try{
    const [q,a,m]=await Promise.all([
      fetch('../data/elbow-anatomical-qualifications.json').then(r=>{if(!r.ok)throw Error('qualification');return r.json()}),
      fetch('../data/elbow-surface-audit.json').then(r=>{if(!r.ok)throw Error('mesh audit');return r.json()}),
      fetch('../data/elbow-motion-display-audit.json').then(r=>{if(!r.ok)throw Error('motion audit');return r.json()})
    ]);
    qualifications=q;audit=a;motion=m;
  }catch(e){
    console.warn('POLY elbow qualification unavailable; no unsupported claims displayed',e);
  }
  const auditByCase=new Map((audit?.cases||[]).map(c=>[c.id,c]));
  const motionByPart=new Map((motion?.results||[]).map(x=>[x.part_id,x]));
  const byPart=new Map();
  for(const c of qualifications?.cases||[]){
    for(const partId of c.source_surface_ids){
      if(!byPart.has(partId))byPart.set(partId,[]);
      byPart.get(partId).push(c);
    }
  }
  function show(partId){
    host.replaceChildren();
    const cases=byPart.get(partId)||[];
    host.hidden=cases.length===0;
    if(!cases.length)return;
    host.append(node('h4','Bras et avant-bras — qualification anatomique'));
    host.append(node('p','Données humaines publiées et maillages de référence : aucune enthèse localisée en 3D, aucun volume musculaire réel, aucune déformation validée.','elbow-status'));
    for(const c of cases){
      const article=node('article');
      article.append(node('strong',c.label),node('p',c.bone_region+' · '+c.anatomical_evidence));
      const group=auditByCase.get(c.id);
      const row=group?.surfaces.find(s=>s.source_part_id===partId);
      if(row){
        article.append(node('p',row.boundary_edge_count+' arêtes de bord sur ce maillage ('+row.triangle_count+' triangles) : '+(row.watertight_candidate?'topologie fermée candidate, volume toujours non validé.':'surface ouverte, volume non calculable directement.'),'elbow-mesh-warning'));
        if(Number.isFinite(row.bbox_muscle_to_bone_enclosure_ratio))
          article.append(node('p','Indice géométrique boîte muscle/os : '+row.bbox_muscle_to_bone_enclosure_ratio.toFixed(3)+' (encombrement AABB uniquement, pas un rapport de volumes tissulaires).'));
      }
      const deformation=motionByPart.get(partId);
      if(deformation){
        const pct=(100*deformation.rms_relative_mesh_edge_length_change).toFixed(2);
        article.append(node('p',partId.endsWith('M')?'Animation locale du coude gauche non pilotée par ce test ; variation des arêtes : 0 % (absence de flexion, pas rigidité biologique).':'Flexion illustrative du coude droit à 60° : variation quadratique moyenne des longueurs d’arêtes '+pct+' % (effet graphique, pas déformation des fibres ou des tendons).'));
      }
      article.append(node('p',c.notes));
      const a=node('a','Étude ou référence anatomique');
      a.href=c.source_url;a.target='_blank';a.rel='noopener noreferrer';
      article.append(a);
      host.append(article);
    }
    window.POLY_ELBOW_QUALIFICATION={
      selected_part_id:partId,
      documented_relations:cases.length,
      true_enthesis_coordinates:0,
      verified_muscle_volume_count:0,
      dynamic_constraints_validated:0
    };
  }
  return {show,available:!!qualifications&&!!audit&&!!motion};
}
