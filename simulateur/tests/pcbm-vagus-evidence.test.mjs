import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateVagusEvidence,compareVagusStudyToPCBM} from '../web/pcbm-vagus-evidence.mjs';
import {validatePCBM} from '../web/pcbm-core.mjs';
const original=JSON.parse(readFileSync(new URL('../web/pcbm-vagus-evidence.json',import.meta.url),'utf8'));
const registry=validatePCBM(JSON.parse(readFileSync(new URL('../web/pcbm-registry.json',import.meta.url),'utf8')));
const fresh=()=>structuredClone(original);
test('three distinct vagus reference studies remain separate and not registered',()=>{
 const e=validateVagusEvidence(fresh(),{registry});
 assert.equal(e.source_count,3);
 assert.equal(e.coordinate_field_count,3);
 assert.equal(e.branch_group_count,6);
 assert.equal(e.spatial_registration_verified,false);
 assert.equal(e.individual_routes_inferred,false);
 assert.deepEqual(e.branch_medians_cm,[3.9,6.2,9.6,20.1,25,26.5]);
});
test('published dissection ranges and cohorts preserve actual units and aggregation',()=>{
 const e=validateVagusEvidence(fresh(),{registry});
 assert.equal(e.studies.find(s=>s.study_id==='bahadir-2026').n_donors,29);
 assert.equal(e.studies.find(s=>s.study_id==='bahadir-2026').n_nerves,58);
 assert.equal(e.studies.find(s=>s.study_id==='thompson-2026').n_traced_microct,5);
 assert.ok(e.branches.every(s=>s.q1<=s.median&&s.median<=s.q3));
 const link=compareVagusStudyToPCBM(registry,e,'bahadir-2026','vagus-f002');
 assert.equal(link.mode,'documentary_reference_only');
 assert.equal(link.spatial_overlay_allowed,false);
 assert.equal(link.anatomical_registration,null);
});
test('cannot turn normalized SSV material coordinates into millimetres',()=>{
 const x=fresh();x.coordinate_fields[2].units='mm';
 assert.throws(()=>validateVagusEvidence(x),/SSV material coordinates confused/);
});
test('cannot infer cohort statistics as f002 individual coordinates',()=>{
 for(const edit of [
  x=>x.anatomical_registration={matrix4x4:[]},
  x=>x.scale_links[0].same_specimen_confirmed=true,
  x=>x.scale_links[1].metric_transform=[1,0,0,0],
  x=>x.scale_links[2].cohort_overlap='known_independent'
 ]){const x=fresh();edit(x);assert.throws(()=>validateVagusEvidence(x),/scope incorrectly|cross-study geometry invented/);}
});
test('reject biased or falsified medians and interquartile ordering',()=>{
 for(const edit of [
  x=>x.branch_summary.categories[0].median=1,
  x=>x.branch_summary.categories[4].q1=40,
  x=>x.branch_summary.unit='SSV',
  x=>x.branch_summary.cohorts_independent_between_rows=true,
  x=>x.branch_summary.categories.pop()
 ]){const x=fresh();edit(x);assert.throws(()=>validateVagusEvidence(x),/invalid order|statistics operator missing|observations falsely upgraded|groups missing/)}
});
test('reference sample size cannot be quietly inflated',()=>{
 for(const edit of [
  x=>x.sources[1].n_traced_microct=10,
  x=>x.sources[2].n_nerves=580,
  x=>x.sources[2].doi='10.5555/fake'
 ]){const x=fresh();edit(x);assert.throws(()=>validateVagusEvidence(x),/cohort identity changed|DOI mismatch/);}
});
test('registry source lineage is required',()=>{
 const raw=fresh();raw.sources[1].id='fabricated-study';
 assert.throws(()=>validateVagusEvidence(raw,{registry}),/catalog incomplete|registry lacks source/);
});
