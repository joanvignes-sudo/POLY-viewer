import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSSVPreview,compareSSVPreviews,parseLocalSSVFile} from '../web/pcbm-ssv-preview.mjs';
const d='9'.repeat(64);
const valid=()=>({
 schema:'poly.pcbm.ssv-level-preview.v1',published:false,review_status:'unreviewed_local_import',
 specimen_id:'f002',side:'left',source_dataset_doi:'10.26275/imas-52lf',scaffold_collection_doi:'10.26275/tjzi-muqm',
 coordinate_field:'vagus coordinates',unit:'unitless',physical_length_mm:null,xyz_coordinates:null,anatomical_registration:null,
 source_digest_status:'declared_not_verified',source_artifact_sha256:d,
 landmarks:[{id:'level-a',label:'Synthetic level A',ssv:.1,physical_mm:null,xyz:null},
            {id:'level-b',label:'Synthetic level B',ssv:.5,physical_mm:null,xyz:null}],
 segments:[{id:'segment-a',start_ssv:.12,end_ssv:.48,length_mm:null,xyz:null,source_label:'SYNTHETIC_TEST_ONLY'}]
});
test('normalised SSV preview preserves sample, side and absence of metric conversion',()=>{
 const r=validateSSVPreview(valid());
 assert.equal(r.can_convert_to_mm,false);assert.equal(r.source_digest_verified,false);assert.equal(r.can_overlay_HRA,false);
 assert.equal(r.landmarks.length,2);assert.equal(r.segments.length,1);
});
test('reject millimetres, XYZ, false publication and fabricated anatomical registration',()=>{
 const mutations=[
  o=>o.unit='mm',o=>o.xyz_coordinates=[0,0,0],o=>o.physical_length_mm=100,
  o=>o.anatomical_registration={matrix:[]},o=>o.published=true,
  o=>o.landmarks[0].xyz=[0,0,0],o=>o.segments[0].length_mm=7,
  o=>o.source_digest_status='verified'
 ];
 for(const change of mutations){const o=valid();change(o);assert.throws(()=>validateSSVPreview(o),/unsupported publication|normalized SSV|invented landmark|fabricated physical|source artifact provenance/)}
});
test('reject out-of-bounds, nonmonotonic and repeated coordinates',()=>{
 const x=valid();x.landmarks[0].ssv=1.1;assert.throws(()=>validateSSVPreview(x),/invalid material coordinate/);
 const y=valid();y.landmarks[1].ssv=0.05;assert.throws(()=>validateSSVPreview(y),/non-monotonic/);
 const z=valid();z.segments[0].end_ssv=1.1;assert.throws(()=>validateSSVPreview(z),/invalid segment/);
 const w=valid();w.landmarks[1].id='level-a';assert.throws(()=>validateSSVPreview(w),/duplicated/);
});
test('cannot transfer an individual normalized marker onto population mean',()=>{
 const a=validateSSVPreview(valid());const b=valid();b.side='right';
 const res=compareSSVPreviews(a,validateSSVPreview(b));
 assert.equal(res.same_sample,true);assert.equal(res.same_side,false);assert.equal(res.direct_xyz_alignment,false);
 assert.equal(res.median_population_cm_transfer,false);assert.equal(res.can_infer_length_mm,false);
});
test('bounded file input accepts only declared unreviewed synthetic preview',async()=>{
 const text=JSON.stringify(valid()),encoder=new TextEncoder(),array=encoder.encode(text);
 const f={size:array.length,arrayBuffer:async()=>array.buffer};
 const r=await parseLocalSSVFile(f);
 assert.equal(r.landmarks.length,2);
 await assert.rejects(()=>parseLocalSSVFile({...f,size:300000}),/size limits/);
 await assert.rejects(()=>parseLocalSSVFile({...f,size:array.length+1}),/incomplete/);
});
