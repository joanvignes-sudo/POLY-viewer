import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createAttachmentEngine,validateRelation} from '../web/attachment-engine.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../data/attachment-catalogue.json',import.meta.url)));
const engine=createAttachmentEngine(data),ids=new Set(data.surfaces.map(s=>s.id));
const clone=()=>structuredClone(data.relations.find(r=>r.status==='documented_region'));
test('all source pieces have unique namespaced identities and audited reference geometry',()=>{
  assert.equal(ids.size,507);assert.equal(data.surfaces.filter(s=>s.audit.status==='mesh_audited_not_biological_validation').length,480);
  for(const s of data.surfaces){assert.equal(s.attachment_xyz,null);if(s.layer!=='native'){assert.ok(s.audit.triangle_count>0);assert.equal(s.audit.actual_muscle_volume,null);assert.equal(s.audit.validated_enthesis_xyz,null)}}
  assert.deepEqual(engine.summary(),{surfaces:507,documented_surfaces:97,validated_insertions:0});
});
test('every source file retains its exact fingerprint',()=>{
  for(const [path,hash] of Object.entries(data.provenance)){const raw=fs.readFileSync(new URL('../data/'+path,import.meta.url));assert.equal(crypto.createHash('sha256').update(path.endsWith('.gz')?raw:raw.toString('utf8').replace(/\r\n/g,'\n')).digest('hex'),hash,path)}
});
test('foreign keys and per-surface indexes reconcile',()=>{
  for(const s of data.surfaces)assert.deepEqual(s.relation_ids,engine.relationsFor(s.id).map(r=>r.id));
  for(const r of data.relations)assert.deepEqual(validateRelation(r,ids),[]);
  const bad=clone();bad.source_surface_ids=['body:missing'];assert.ok(validateRelation(bad,ids).includes('unresolved_source'));
});
test('missing proof, rejected evidence and missing provenance fail closed',()=>{
  let r=clone();r.evidence=[];assert.ok(validateRelation(r,ids).includes('missing_documentary_evidence'));
  r=clone();r.status='rejected';assert.ok(validateRelation(r,ids).includes('rejected_evidence_cannot_support_relation'));
  r=clone();r.provenance.sha256='';assert.ok(validateRelation(r,ids).includes('missing_provenance'));
  r=clone();r.geometry.target_xyz=[0,0,0];assert.ok(validateRelation(r,ids).includes('unlocated_has_coordinates'));
});
test('hypotheses require frame and transform and never count as validated insertions',()=>{
  const r=clone();r.geometry={status:'hypothetical_point',source_xyz:[0,0,0],target_xyz:[1,2,3],frame:{source:'source-atlas',target:'display',units:'mm'},registration:{method:'synthetic test only',transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}};
  assert.deepEqual(validateRelation(r,ids),[]);r.geometry.target_xyz[0]=NaN;assert.ok(validateRelation(r,ids).includes('missing_spatial_provenance'));
});
test('validated insertion needs independent landmarks, evidence and held-out error budget',()=>{
  const r=clone();r.geometry={status:'validated_insertion',source_xyz:[0,0,0],target_xyz:[1,2,3],frame:{source:'a',target:'b',units:'mm'},registration:{method:'synthetic unit test',transform:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}};
  assert.ok(validateRelation(r,ids).includes('missing_independent_validation'));
  r.validation={reviewer:'synthetic test',date:'2026-10-25',independent_source:'https://example.org/independent-test',source_landmark_id:'test-only',target_patch_id:'test-only',held_out_error_mm:1,acceptance_threshold_mm:2};
  assert.deepEqual(validateRelation(r,ids),[]);r.validation.held_out_error_mm=3;assert.ok(validateRelation(r,ids).includes('missing_independent_validation'));
  r.validation.held_out_error_mm=1;r.validation.independent_source=r.evidence[0].url;assert.ok(validateRelation(r,ids).includes('missing_independent_validation'));
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
