import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createAttachmentEngine,validateRelation} from '../web/attachment-engine.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../data/attachment-catalogue.json',import.meta.url)));
const engine=createAttachmentEngine(data),ids=new Set(data.surfaces.map(s=>s.id));
const termIds=new Set(data.terms.map(t=>t.id));
const clone=()=>structuredClone(data.relations.find(r=>r.status==='documented_region'));
test('all source pieces have unique namespaced identities and audited reference geometry',()=>{
  assert.equal(ids.size,507);assert.equal(data.surfaces.filter(s=>s.audit.status==='mesh_audited_not_biological_validation').length,480);
  for(const s of data.surfaces){assert.equal(s.attachment_xyz,null);if(s.layer!=='native'){assert.ok(s.audit.triangle_count>0);assert.equal(s.audit.actual_muscle_volume,null);assert.equal(s.audit.validated_enthesis_xyz,null)}}
  assert.deepEqual(engine.summary(),{surfaces:507,documented_surfaces:143,validated_insertions:0});
});
test('every source file retains its exact fingerprint',()=>{
  for(const [path,hash] of Object.entries(data.provenance)){const raw=fs.readFileSync(new URL('../data/'+path,import.meta.url));assert.equal(crypto.createHash('sha256').update(path.endsWith('.gz')?raw:raw.toString('utf8').replace(/\r\n/g,'\n')).digest('hex'),hash,path)}
});
test('foreign keys and per-surface indexes reconcile',()=>{
  for(const s of data.surfaces)assert.deepEqual(s.relation_ids,engine.relationsFor(s.id).map(r=>r.id));
  for(const r of data.relations)assert.deepEqual(validateRelation(r,ids,termIds),[]);
  const bad=clone();bad.source_surface_ids=['body:missing'];assert.ok(validateRelation(bad,ids,termIds).includes('unresolved_source'));
});
test('missing proof, rejected evidence and missing provenance fail closed',()=>{
  let r=clone();r.evidence=[];assert.ok(validateRelation(r,ids,termIds).includes('missing_documentary_evidence'));
  r=clone();r.status='rejected';assert.ok(validateRelation(r,ids,termIds).includes('rejected_evidence_cannot_support_relation'));
  r=clone();r.provenance.sha256='';assert.ok(validateRelation(r,ids,termIds).includes('missing_provenance'));
  r=clone();r.geometry.target_xyz=[0,0,0];assert.ok(validateRelation(r,ids,termIds).includes('unlocated_has_coordinates'));
});
test('hypotheses require frame and transform and never count as validated insertions',()=>{
  const r=clone();r.geometry={status:'hypothetical_point',source_xyz:[0,0,0],target_xyz:[1,2,3],frame:{source:'source-atlas',target:'display',units:'mm'},registration:{method:'synthetic test only',transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}};
  assert.deepEqual(validateRelation(r,ids,termIds),[]);r.geometry.target_xyz[0]=NaN;assert.ok(validateRelation(r,ids,termIds).includes('missing_spatial_provenance'));
});
test('validated insertion needs independent landmarks, evidence and held-out error budget',()=>{
  const r=clone();r.geometry={status:'validated_insertion',source_xyz:[0,0,0],target_xyz:[1,2,3],frame:{source:'a',target:'b',units:'mm'},registration:{method:'synthetic unit test',transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}};
  assert.ok(validateRelation(r,ids,termIds).includes('missing_independent_validation'));
  r.validation={reviewer:'synthetic test',date:'2026-10-25',independent_source:'https://example.org/independent-test',source_landmark_id:'test-only',target_patch_id:'test-only',held_out_error_mm:1,acceptance_threshold_mm:2};
  assert.deepEqual(validateRelation(r,ids,termIds),[]);r.validation.held_out_error_mm=3;assert.ok(validateRelation(r,ids,termIds).includes('missing_independent_validation'));
  r.validation.held_out_error_mm=1;r.validation.independent_source=r.evidence[0].url;assert.ok(validateRelation(r,ids,termIds).includes('missing_independent_validation'));
});
test('candidate/rejected references remain unqualified despite optimistic legacy labels',()=>{
  assert.equal(data.relations.filter(r=>r.status==='rejected').length,4);
  assert.equal(data.relations.filter(r=>r.status==='source_candidate').length,24);
  assert.equal(data.relations.filter(r=>r.id.startsWith('legacy:cy_')).length,0);
  assert.ok(engine.filter({status:'unmapped'}).length>0);
});
test('queries handle laterality, diacritics, target tissues and empty results',()=>{
  assert.ok(engine.filter({query:'aponevrose',status:'documented_region'}).length>0);
  assert.ok(engine.filter({side:'L'}).every(s=>s.side==='L'));
  assert.equal(engine.filter({query:'nonexistent-surface-xyz'}).length,0);
  assert.deepEqual(engine.relationsFor('unknown'),[]);
});
test('duplicate IDs reject the catalogue',()=>{
  const bad=structuredClone(data);bad.relations.push(bad.relations[0]);assert.throws(()=>createAttachmentEngine(bad),/duplicate_relation/);
});
test('new trunk/pelvis batch preserves evidence dates and spatial qualification',()=>{
  const batch=data.relations.filter(r=>r.id.startsWith('trunk-pelvis:'));
  assert.equal(batch.length,40);assert.equal(batch.filter(r=>!r.source_surface_ids.length).length,10);
  assert.equal(data.summary.documented_terms_without_geometry,7);
  for(const r of batch){assert.equal(r.evidence[0].review_date,'2026-10-28');assert.equal(r.geometry.status,'unlocated');assert.equal(r.geometry.target_xyz,null);assert.equal(r.validation,null)}
  for(const r of data.relations.filter(r=>r.id.startsWith('reviewed:')))assert.equal(r.evidence[0].review_date,'2026-10-25');
});
test('terminology-only evidence does not invent surfaces or propagate to descendants',()=>{
  assert.equal(engine.term('2417').surface_ids.length,0);assert.equal(engine.relationsForTerm('2417').length,2);
  assert.equal(engine.filterTerms({query:'TA2:2417'}).length,1);
  const erector=engine.relationsForTerm('2254');assert.equal(erector.length,2);
  assert.ok(erector.every(r=>r.source_surface_ids.length===0));
  assert.equal(engine.relationsForTerm('2258').length,0); // iliocostalis lumborum is not the whole erector-spinae group.
  const missing=engine.filterTerms({status:'documented_region',withoutGeometry:true});assert.equal(missing.length,7);
  assert.ok(missing.every(t=>t.surface_ids.length===0));
});
test('terminology-only relations reject spatial qualification and unresolved term identities',()=>{
  const r=structuredClone(engine.relationsForTerm('2417')[0]);r.source_term_ids=['999999'];
  assert.ok(validateRelation(r,ids,termIds).includes('unresolved_source'));
  r.source_term_ids=['2417'];r.geometry.status='hypothetical_point';
  assert.ok(validateRelation(r,ids,termIds).includes('terminology_has_no_spatial_geometry'));
});
test('sex-specific descriptions coexist without assigning an avatar variant',()=>{
  const rs=engine.relationsForTerm('2418');assert.equal(rs.length,2);
  assert.ok(rs.some(r=>r.applicability.includes('Description masculine')));
  assert.ok(rs.some(r=>r.applicability.includes('Description féminine')));
  assert.ok(rs.every(r=>r.source_surface_ids.length===0&&r.geometry.status==='unlocated'));
});
test('direct term relations and surface-derived associations stay separate',()=>{
  assert.equal(engine.relationsForTerm('2413').length,0); // General perineal group shares an atlas surface with the external sphincter.
  assert.ok(engine.relatedSurfaceRelationsForTerm('2413').some(r=>r.id==='trunk-pelvis:external-anal-sphincter-origin'));
  const r=engine.relationsForTerm('2426').find(r=>r.id==='trunk-pelvis:external-anal-sphincter-origin');
  assert.deepEqual(r.source_term_ids,['2426','3020']);assert.equal(r.source_surface_ids.length,2);
});
