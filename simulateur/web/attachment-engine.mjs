// Pure, read-only graph queries and fail-closed qualification gates.
export const STATUS_LABELS = Object.freeze({
  documented_region:'Région documentée', source_candidate:'Source candidate à vérifier',
  rejected:'Référence rejetée', unreviewed_description:'Description héritée non vérifiée',
  unmapped:'Attaches à rechercher'
});
export const KIND_LABELS = Object.freeze({bone:'Os',tendon:'Tendon',aponeurosis:'Aponévrose',fascia:'Fascia',ligament:'Ligament',cartilage:'Cartilage',skin:'Peau',organ:'Organe',mixed_region:'Région composite',unresolved:'Cible à qualifier'});
export const REGION_LABELS = Object.freeze({trunk:'Visage, cou et tronc',arm_shoulder:'Bras et épaule',forearm:'Avant-bras',hand:'Main / avant-bras distal',thigh:'Hanche et cuisse',leg:'Jambe et pied','HRA natif':'Pièces de contexte HRA'});
export const ROLE_LABELS = Object.freeze({origin_region:'Origine régionale',insertion_region:'Terminaison régionale',regional_association:'Relation régionale',unspecified:'Description à qualifier',distal_tendon_insertion:'Insertion tendineuse distale',muscle_origin_region:'Origine régionale',muscle_insertion_region:'Terminaison régionale'});
const TARGET_KINDS = new Set(['bone','tendon','aponeurosis','fascia','ligament','cartilage','skin','organ','mixed_region','unresolved']);
const point = p => Array.isArray(p) && p.length === 3 && p.every(Number.isFinite);
const https = s => {try{return new URL(s).protocol === 'https:'}catch{return false}};
export function validateRelation(r, surfaceIds, termIds = new Set()) {
  const errors = [];
  const refs = r.source_surface_ids, terms = r.source_term_ids || [];
  if (!r.id || !Array.isArray(refs) || !Array.isArray(terms) || (!refs.length && !terms.length) ||
      refs.some(id=>!surfaceIds.has(id)) || terms.some(id=>!termIds.has(id))) errors.push('unresolved_source');
  if (!TARGET_KINDS.has(r.target?.kind) || !r.target?.label) errors.push('invalid_target');
  if (!Object.hasOwn(STATUS_LABELS,r.status) || r.status === 'unmapped') errors.push('invalid_status');
  if (!r.provenance?.path || !/^[a-f0-9]{64}$/.test(r.provenance?.sha256 || '')) errors.push('missing_provenance');
  if (!Array.isArray(r.evidence)) errors.push('missing_evidence_array');
  if (r.status === 'documented_region' && (!r.evidence?.length || r.evidence.some(e=>!https(e.url) || !e.locator || !e.type))) errors.push('missing_documentary_evidence');
  if (r.status === 'rejected' && r.evidence?.length) errors.push('rejected_evidence_cannot_support_relation');
  const g = r.geometry;
  if (Array.isArray(refs) && !refs.length && g?.status !== 'unlocated') errors.push('terminology_has_no_spatial_geometry');
  if (!g || !['unlocated','hypothetical_point','estimated_geometry','validated_insertion'].includes(g.status)) errors.push('invalid_geometry_status');
  if (g?.status === 'unlocated' && (g.source_xyz !== null || g.target_xyz !== null || g.frame !== null || g.registration !== null)) errors.push('unlocated_has_coordinates');
  if (g && g.status !== 'unlocated') {
    if (!point(g.source_xyz) || !point(g.target_xyz) || !g.frame?.source || !g.frame?.target || !g.frame?.units || !g.registration?.method) errors.push('missing_spatial_provenance');
    if (!Array.isArray(g.registration?.transform) || g.registration.transform.length !== 16 || !g.registration.transform.every(Number.isFinite)) errors.push('missing_transform');
  }
  if (g?.status === 'validated_insertion') {
    const v = r.validation;
    if (r.status !== 'documented_region' || !v?.reviewer || !v.date || !https(v.independent_source) ||
        r.evidence.some(e=>e.url === v.independent_source) || !v.source_landmark_id || !v.target_patch_id ||
        !Number.isFinite(v.held_out_error_mm) || v.held_out_error_mm < 0 ||
        !Number.isFinite(v.acceptance_threshold_mm) || v.acceptance_threshold_mm <= 0 ||
        v.held_out_error_mm > v.acceptance_threshold_mm) errors.push('missing_independent_validation');
  } else if (r.validation !== null) errors.push('validation_on_unvalidated_geometry');
  return errors;
}
export function createAttachmentEngine(data) {
  if (!['poly.attachment-catalogue/1','poly.attachment-catalogue/2'].includes(data.schema)) throw Error('Unsupported attachment catalogue');
  const surfaces = new Map(data.surfaces.map(s=>[s.id,s]));
  const terms = new Map((data.terms||[]).map(t=>[t.id,t])), termIds=new Set(terms.keys()),surfaceIds=new Set(surfaces.keys());
  if (surfaces.size !== data.surfaces.length) throw Error('Duplicate surface identity');
  if (terms.size !== (data.terms||[]).length) throw Error('Duplicate term identity');
  for(const t of terms.values())if(t.surface_ids.some(id=>!surfaces.has(id)))throw Error('Unresolved term geometry');
  const ids = new Set(), bySurface = new Map([...surfaces.keys()].map(id=>[id,[]]));
  const byTerm = new Map([...terms.keys()].map(id=>[id,[]]));
  for (const r of data.relations) {
    const errors = validateRelation(r,surfaceIds,termIds);
    if (ids.has(r.id)) errors.push('duplicate_relation');
    if (errors.length) throw Error(`${r.id}: ${errors.join(', ')}`);
    ids.add(r.id);
    for (const id of r.source_surface_ids) bySurface.get(id).push(r);
    for (const id of r.source_term_ids||[]) byTerm.get(id).push(r);
  }
  return Object.freeze({
    surfaces:()=>[...surfaces.values()],
    relationsFor:id=>[...(bySurface.get(id)||[])],
    surface:id=>surfaces.get(id),
    terms:()=>[...terms.values()],
    term:id=>terms.get(id),
    relationsForTerm:id=>[...(byTerm.get(id)||[])],
    relatedSurfaceRelationsForTerm:id=>{
      const directIds=new Set((byTerm.get(id)||[]).map(r=>r.id));
      return [...new Map((terms.get(id)?.surface_ids||[]).flatMap(s=>bySurface.get(s)||[]).filter(r=>!directIds.has(r.id)).map(r=>[r.id,r])).values()];
    },
    filterTerms:({query='',region='',status='',withoutGeometry=false}={})=>{
      const q=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      return [...terms.values()].filter(t=>(!region||t.region===region) && (!withoutGeometry||!t.surface_ids.length) &&
        (!status||(status==='unmapped'?!byTerm.get(t.id).some(r=>r.status==='documented_region'):byTerm.get(t.id).some(r=>r.status===status))) &&
        JSON.stringify([t,'TA2:'+t.id,byTerm.get(t.id)]).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));
    },
    filter:({query='',region='',status='',side=''}={})=>{
      const q=query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      return [...surfaces.values()].filter(s=> (!region || s.region===region) && (!side || s.side===side) &&
        (!status || (status==='unmapped' ? !bySurface.get(s.id).some(r=>r.status==='documented_region') : bySurface.get(s.id).some(r=>r.status===status))) &&
        JSON.stringify([s.id,s.name,s.term_ids.map(id=>'TA2:'+id),bySurface.get(s.id)]).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(q));
    },
    // Rendering only: no relation here can change rig weights, coordinates or force calculations.
    summary:()=>({surfaces:surfaces.size,documented_surfaces:[...bySurface.values()].filter(rs=>rs.some(r=>r.status==='documented_region')).length,
      validated_insertions:data.relations.filter(r=>r.geometry.status==='validated_insertion').length})
  });
}
