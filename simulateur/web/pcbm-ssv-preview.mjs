// PCBM: optional local preview of extracted subject-specific vagus material coordinates.
// The data are never promoted to anatomical registration, clinical measurements, or published sources.
const ok=(x,m)=>{if(!x)throw Error('PCBM SSV: '+m)};
const validId=x=>typeof x==='string'&&/^[a-z][a-z0-9-]{2,90}$/.test(x);
const finite01=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1;
export const SSV_PREVIEW_SCHEMA='poly.pcbm.ssv-level-preview.v1';
export function validateSSVPreview(input){
 ok(input?.schema===SSV_PREVIEW_SCHEMA&&input.published===false&&input.review_status==='unreviewed_local_import'&&input.anatomical_registration===null,'unsupported publication or registration status');
 ok(input.specimen_id==='f002'&&['left','right'].includes(input.side),'sample and laterality must be explicit');
 ok(input.source_dataset_doi==='10.26275/imas-52lf'&&input.scaffold_collection_doi==='10.26275/tjzi-muqm','source and derived dataset DOI mismatch');
 ok(input.coordinate_field==='vagus coordinates'&&input.unit==='unitless'&&input.physical_length_mm===null&&input.xyz_coordinates===null,'normalized SSV coordinate misread as millimetres or 3D');
 ok(input.source_digest_status==='declared_not_verified'&&/^[a-f0-9]{64}$/.test(input.source_artifact_sha256),'source artifact provenance missing or overclaimed');
 ok(Array.isArray(input.landmarks)&&input.landmarks.length>=2&&input.landmarks.length<=64,'expected 2-64 annotated landmarks');
 const seen=new Set();let previous=-1;
 for(const landmark of input.landmarks){
  ok(validId(landmark?.id)&&!seen.has(landmark.id),'missing or duplicated level identifier');seen.add(landmark.id);
  ok(typeof landmark.label==='string'&&landmark.label.length>4&&finite01(landmark.ssv),'invalid material coordinate');
  ok(landmark.ssv>previous,'non-monotonic level coordinates');previous=landmark.ssv;
  ok(landmark.physical_mm===null&&landmark.xyz===null,'invented landmark XYZ or metric position');
 }
 ok(Array.isArray(input.segments)&&input.segments.length<=150,'segments must form a bounded optional list');
 const segmentIds=new Set();
 for(const s of input.segments){
  ok(validId(s?.id)&&!segmentIds.has(s.id),'invalid or repeated segment identifier');segmentIds.add(s.id);
  ok(finite01(s.start_ssv)&&finite01(s.end_ssv)&&s.start_ssv<s.end_ssv,'invalid segment interval');
  ok(s.length_mm===null&&s.xyz===null,'fabricated physical segment lengths');
  ok(s.source_label===null||typeof s.source_label==='string'&&s.source_label.length>0,'missing segment source label');
 }
 return Object.freeze({schema:SSV_PREVIEW_SCHEMA,side:input.side,sample_id:'f002',
  landmarks:input.landmarks.map(v=>Object.freeze({...v})),
  segments:input.segments.map(v=>Object.freeze({...v})),
  mathematical_axis:[0,1],material_frame:'vagus coordinates',
  physical_length_mm:null,spatial_registration:null,
  source_doi:input.source_dataset_doi,source_artifact_sha256:input.source_artifact_sha256,
  source_digest_verified:false,
  confidence:'UNREVIEWED_EXTRACTED_COORDINATES',can_overlay_HRA:false,
  can_convert_to_mm:false,can_infer_axons:false});
}
export function compareSSVPreviews(a,b){
 ok(a?.schema===SSV_PREVIEW_SCHEMA&&b?.schema===SSV_PREVIEW_SCHEMA,'validated previews required');
 return Object.freeze({same_sample:a.sample_id===b.sample_id,same_side:a.side===b.side,
  comparison:'normalized_material_coordinates_only',direct_xyz_alignment:false,
  median_population_cm_transfer:false,can_infer_length_mm:false,
  note:'Different samples or lateralities cannot be spatially overlaid by their shared normalized ssv axis.'});
}
export async function parseLocalSSVFile(file,{maxBytes=200000}={}){
 ok(file&&Number.isFinite(file.size)&&file.size>50&&file.size<=maxBytes,'local SSV JSON exceeds size limits');
 const data=await file.arrayBuffer();
 ok(data.byteLength===file.size,'local file read was incomplete');
 const text=new TextDecoder('utf-8',{fatal:true}).decode(data);
 return validateSSVPreview(JSON.parse(text));
}
