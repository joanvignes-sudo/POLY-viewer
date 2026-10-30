// PCBM: science quarantine for a candidate C1R crosswalk from the existing POLY vagus run.
// Report numbers are transcribed from an automation result, NOT reverified against 3D bytes in PCBM.
export const C1R_SCHEMA='poly.pcbm.c1r-audit.v1';
const assertion=(x,msg)=>{if(!x)throw Error('PCBM C1R: '+msg)};
const equal=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
export function validateC1RAudit(raw){
 assertion(raw?.schema===C1R_SCHEMA&&raw.publication_status==='unreviewed_automation_summary'&&raw.anatomical_registration===null,'false registration/publication claim');
 assertion(raw.specimen_id==='f002'&&raw.side==='right'&&raw.segment_id==='C1R','wrong specimen or segment');
 assertion(raw.source_dataset_doi==='10.26275/imas-52lf'&&raw.source_run_report_filename==='POLY_VAGUE_RUN10_C1R_CROSSWALK_20261030.json','original source lineage missing');
 assertion(raw.run_report_mounted===false&&raw.raw_primary_volume_mounted===false&&raw.derived_volume_mounted===false&&raw.point_coordinates_mounted===false&&raw.file_checksums_available_in_pcbm===false,'unverified source falsely presented as mounted');
 const acquisition=raw.acquisition,annotations=raw.anatomical_annotations,xml=raw.xml_contours;
 assertion(equal(acquisition.primary_microct_dimensions,[806,1256,4042])&&equal(acquisition.derived_image_dimensions,[403,628,2021])&&acquisition.primary_physical_voxel_spacing_um===null&&acquisition.derived_reported_voxel_spacing_um===18,'C1R resolution confused with primary or left C1L');
 assertion(acquisition.derived_lps_affine_read_in_original_report===true&&acquisition.derived_lps_affine_mounted_in_pcbm===false,'unverified derived affine promoted');
 assertion(annotations.lps_point_count===55&&annotations.points_inside_derived_bounds===55&&annotations.direct_nonzero_voxel_count===54&&annotations.nearby_nonzero_voxel_count===55,'reported annotation sample counts altered');
 assertion(annotations.semantic_segmentation_values_reviewed===false&&annotations.nonzero_voxel_neighborhood_radius_defined_in_pcbm===false,'semantic segmentation overclaimed');
 assertion(xml.observed_contours===824&&xml.observed_points===103995,'original XML contour evidence mismatch');
 assertion(xml.candidate_orientation_status==='hypothesis'&&xml.candidate_points_evaluable===54&&xml.candidate_inside_epineurium===42&&xml.four_other_orientations_inside_epineurium===0,'candidate orientation promoted or counts altered');
 assertion(xml.xml_axial_spacing_reported===-9&&xml.xml_number_of_sections===2021&&xml.xml_coordinate_min_reported===-32436&&xml.xml_coordinate_unit==='unresolved'&&xml.mismatch_explained===false&&xml.transform_xml_to_lps===null,'unresolved XML axis discrepancy suppressed');
 assertion(Array.isArray(raw.forbidden_inferences)&&raw.forbidden_inferences.length>=5,'scientific boundaries missing');
 // This is a conditional arithmetic diagnostic, NOT an anatomical or coordinate-system proof.
 const hypotheticalZeroOriginSpan=Math.abs(xml.xml_axial_spacing_reported)*(xml.xml_number_of_sections-1);
 const reportedCoordinateExtent=Math.abs(xml.xml_coordinate_min_reported);
 const observedToHypotheticalSpanRatio=reportedCoordinateExtent/hypotheticalZeroOriginSpan;
 return Object.freeze({
  axial_diagnostic:{
   assuming_zero_origin_and_same_XML_axis:true,
   expected_absolute_span_XML_units:hypotheticalZeroOriginSpan,
   reported_absolute_min_XML_units:reportedCoordinateExtent,
   ratio_observed_to_expected:observedToHypotheticalSpanRatio,
   inferred_origin_offset_XML_units:null,
   interpretation:'Conditional mismatch only; unknown XML coordinate origin and axis may explain the discrepancy.'
  },
  specimen_id:'f002',side:'right',segment_id:'C1R',
  reported_points_total:55,
  reported_direct_nonzero_ratio:54/55,
  reported_neighborhood_nonzero_ratio:1,
  reported_candidate_epineurium_ratio:42/54,
  orientation_candidates_not_supported:4,
  primary_voxel_spacing_um:null,
  derived_voxel_spacing_um:18,
  XML_to_LPS_verified:false,
  C1R_to_SSV_verified:false,
  C1R_to_HRA_verified:false,
  complete_point_witness_present:false,
  candidate_status:'unreviewed_not_anatomical_proof',
  original_run_report_filename:raw.source_run_report_filename
 });
}
export async function readC1RAudit({fetcher=fetch,signal}={}){
 const r=await fetcher(new URL('./pcbm-c1r-audit.json',import.meta.url),{cache:'no-store',signal});
 assertion(r?.ok,'C1R audit summary unavailable');
 const bytes=await r.arrayBuffer();
 assertion(bytes.byteLength>100&&bytes.byteLength<20000,'C1R summary file outside expected bounds');
 signal?.throwIfAborted?.();
 return validateC1RAudit(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes)));
}
