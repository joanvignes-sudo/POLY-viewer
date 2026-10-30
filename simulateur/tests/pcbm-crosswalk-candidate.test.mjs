import test from 'node:test';
import assert from 'node:assert/strict';
import {auditC1RCandidate,parseLocalC1RCandidate} from '../web/pcbm-crosswalk-candidate.mjs';
const id=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
const points=[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[2,3,4]];
const fixture=()=>({
 schema:'poly.pcbm.c1r-crosswalk-candidate.v1',publication_status:'local_candidate_only',approved:false,
 anatomical_registration:null,specimen_id:'f002',side:'right',segment_id:'C1R',
 source:{source_dataset_doi:'10.26275/imas-52lf',xml_coordinate_unit:'unknown',
 xml_frame:'C1R_XML_unresolved',target_frame:'C1R_LPS_mm',
 xml_sha256:'a'.repeat(64),lps_markups_sha256:'b'.repeat(64),
 fit_selection_sha256:'c'.repeat(64),holdout_selection_sha256:'d'.repeat(64),
 bytes_independently_verified:false},
 hypothesis:{kind:'declared_affine_not_estimated',matrix_convention:'row_major_column_vector',matrix4x4:id.slice(),estimated_from_holdouts:false},
 holdout_pairs:points.map((p,i)=>({id:'p'+i,xml_xyz_raw:p.slice(),lps_xyz_mm:p.slice()}))
});
test('candidate computes heldout error but never claims registration or XML units',()=>{
 const r=auditC1RCandidate(fixture());
 assert.equal(r.held_out_max_mm,0);
 assert.equal(r.held_out_rms_mm,0);
 assert.equal(r.holdout_count,5);
 assert.equal(r.status,'candidate_residuals_only');
 assert.equal(r.source_point_unit,'unknown');
 assert.equal(r.anatomical_registration_validated,false);
 assert.equal(r.xml_axis_origin_resolved,false);
 assert.equal(r.c1r_to_ssv_validated,false);
 assert.equal(r.observations_independent_of_fit_unproven,true);
});
test('nonzero candidate residuals are computed, not rounded away',()=>{
 const f=fixture();f.holdout_pairs[4].lps_xyz_mm=[2,3,6];
 const r=auditC1RCandidate(f);
 assert.equal(r.heldout_max_mm,2);
 assert.ok(Math.abs(r.heldout_rms_mm-2/Math.sqrt(5))<1e-12);
});
test('candidate rejects false biological or publication approval',()=>{
 for(const mutation of [
  x=>x.approved=true,x=>x.anatomical_registration={approved:true},
  x=>x.publication_status='published',x=>x.side='left',
  x=>x.source.xml_coordinate_unit='mm',x=>x.source.bytes_independently_verified=true,
  x=>x.hypothesis.estimated_from_holdouts=true
 ]){const x=fixture();mutation(x);assert.throws(()=>auditC1RCandidate(x),/candidate/);}
});
test('candidate blocks invalid source lineage and invented independence',()=>{
 for(const mutation of [
  x=>x.source.xml_sha256='not-sha',x=>x.source.lps_markups_sha256='a'.repeat(64),
  x=>x.source.holdout_selection_sha256=x.source.fit_selection_sha256,
  x=>x.source.source_dataset_doi='10.0000/other'
 ]){const x=fixture();mutation(x);assert.throws(()=>auditC1RCandidate(x),/candidate/);}
});
test('candidate rejects degenerate matrices, bad coordinate correspondences and duplicate point ids',()=>{
 for(const mutation of [
  x=>x.hypothesis.matrix4x4[15]=0,
  x=>x.hypothesis.matrix4x4[0]=0,
  x=>x.hypothesis.matrix4x4[0]=Infinity,
  x=>x.holdout_pairs[0].id=x.holdout_pairs[1].id,
  x=>x.holdout_pairs[0].xml_xyz_raw=[NaN,0,0],
  x=>x.holdout_pairs.splice(3),
  x=>x.holdout_pairs.forEach(p=>p.xml_xyz_raw=[0,0,0]),
  x=>x.holdout_pairs.forEach(p=>p.lps_xyz_mm=[0,0,0])
 ]){const x=fixture();mutation(x);assert.throws(()=>auditC1RCandidate(x),/candidate/);}
});
test('local import bounds and truncation are enforced',async()=>{
 const bytes=new TextEncoder().encode(JSON.stringify(fixture()));
 const file={size:bytes.length,arrayBuffer:async()=>bytes.buffer};
 assert.equal((await parseLocalC1RCandidate(file)).status,'candidate_residuals_only');
 await assert.rejects(()=>parseLocalC1RCandidate({...file,size:1000001}),/candidate/);
 await assert.rejects(()=>parseLocalC1RCandidate({...file,size:bytes.length+3}),/candidate/);
});
