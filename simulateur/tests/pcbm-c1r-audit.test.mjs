import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateC1RAudit} from '../web/pcbm-c1r-audit.mjs';
const ref=JSON.parse(readFileSync(new URL('../web/pcbm-c1r-audit.json',import.meta.url),'utf8'));
const fresh=()=>structuredClone(ref);
test('C1R reported observations remain a candidate, not an anatomical registration',()=>{
 const r=validateC1RAudit(fresh());
 assert.equal(r.reported_points_total,55);
 assert.equal(r.reported_direct_nonzero_ratio,54/55);
 assert.equal(r.reported_candidate_epineurium_ratio,42/54);
 assert.equal(r.XML_to_LPS_verified,false);
 assert.equal(r.C1R_to_SSV_verified,false);
 assert.equal(r.complete_point_witness_present,false);
});
test('derived C1R resolution cannot inherit C1L spacing or primary acquisition scale',()=>{
 for(const alter of [
  x=>x.acquisition.derived_reported_voxel_spacing_um=9,
  x=>x.acquisition.primary_physical_voxel_spacing_um=9,
  x=>x.acquisition.derived_image_dimensions[0]=806
 ]){const x=fresh();alter(x);assert.throws(()=>validateC1RAudit(x),/resolution confused/)}
});
test('55/55 within bounds does not prove 55 nonzero voxel centers or segmentation identity',()=>{
 for(const alter of [
  x=>x.anatomical_annotations.direct_nonzero_voxel_count=55,
  x=>x.anatomical_annotations.semantic_segmentation_values_reviewed=true,
  x=>x.point_coordinates_mounted=true
 ]){const x=fresh();alter(x);assert.throws(()=>validateC1RAudit(x),/sample counts|semantic segmentation|unverified source/)}
});
test('42 of 54 points and unresolved axial metadata must remain unresolved',()=>{
 for(const alter of [
  x=>x.xml_contours.candidate_orientation_status='validated',
  x=>x.xml_contours.candidate_inside_epineurium=54,
  x=>x.xml_contours.mismatch_explained=true,
  x=>x.xml_contours.transform_xml_to_lps=[1,0,0,0]
 ]){const x=fresh();alter(x);assert.throws(()=>validateC1RAudit(x),/candidate orientation|XML axis discrepancy/)}
});
test('source status cannot falsely claim local 3D bytes or peer review',()=>{
 for(const alter of [
  x=>x.publication_status='independently_validated',
  x=>x.anatomical_registration={matrix:[]},
  x=>x.derived_volume_mounted=true,
  x=>x.file_checksums_available_in_pcbm=true
 ]){const x=fresh();alter(x);assert.throws(()=>validateC1RAudit(x),/false registration|unverified source/)}
});
