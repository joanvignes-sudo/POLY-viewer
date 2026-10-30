import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validatePCBMLineage,lineageComparison} from '../web/pcbm-lineage.mjs';
const raw=JSON.parse(readFileSync(new URL('../web/pcbm-lineage.json',import.meta.url),'utf8'));
const clone=()=>structuredClone(raw);
test('f002 primary and scaffold derivative count as one original measurement lineage',()=>{
 const model=validatePCBMLineage(clone()),m=lineageComparison(model,'f002-primary','f002-scaffold-reference');
 assert.equal(model.independent_primary_count_for_f002,1);
 assert.equal(m.same_provenance_root,true);assert.equal(m.independent_evidence,false);
 assert.equal(m.spatial_registration_allowed,false);
 assert.equal(model.assets_mounted,false);
});
test('two named publications do not establish independence between cohorts',()=>{
 const model=validatePCBMLineage(clone());
 const m=lineageComparison(model,'f002-primary','bahadir-population');
 assert.equal(m.same_provenance_root,false);
 assert.equal(m.independent_evidence,null);
 assert.equal(m.spatial_registration_allowed,false);
 assert.equal(m.subject_identity_resolved,false);
});
test('container DOI is not mistaken for a new independently measured specimen',()=>{
 const model=validatePCBMLineage(clone());
 assert.equal(model.resources.get('ssv-collection').sample_id,null);
 assert.equal(model.resources.get('ssv-collection').role,'multi_specimen_container');
});
test('file distribution is not a source lineage or valid recalage',()=>{
 const x=clone();x.links[0].relationship='distributed_in';
 assert.throws(()=>validatePCBMLineage(x),/wrong dataset container|derivative source lineage incomplete/);
});
test('tampering with original DOI, specimen or evidence status is rejected',()=>{
 for(const change of [
  x=>x.resources[0].doi='10.26275/not-real',
  x=>x.resources[1].sample_id='f002',
  x=>x.resources[3].sample_id='f002',
  x=>x.links[0].files_verified=true,
  x=>x.possible_cohort_overlap[0].status='independent',
  x=>x.resources[0].url='javascript:alert(1)'
 ]){
  const x=clone();change(x);
  assert.throws(()=>validatePCBMLineage(x),/unverified DOI|population falsely identified|unverified files|unwarranted cohort/);
 }
});
