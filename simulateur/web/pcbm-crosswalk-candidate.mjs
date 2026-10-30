// PCBM C1R — numerical inspection of a DECLARED XML-native -> LPS-mm candidate.
// Not an anatomical registration, not a fit, not a conversion inferred from images.
// Source XML coordinates have UNKNOWN physical units; the candidate matrix asserts
// a conversion into LPS millimetres and must be independently established.
export const CROSSWALK_CANDIDATE_SCHEMA='poly.pcbm.c1r-crosswalk-candidate.v1';
const demand=(ok,msg)=>{if(!ok)throw Error('PCBM candidate: '+msg)};
const sha=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const vec=x=>Array.isArray(x)&&x.length===3&&x.every(v=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=1e8);
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9._-]{1,90}$/.test(x);
function determinant(m){
 return m[0]*(m[5]*m[10]-m[6]*m[9])-m[1]*(m[4]*m[10]-m[6]*m[8])+m[2]*(m[4]*m[9]-m[5]*m[8]);
}
function apply(m,p){return [0,1,2].map(i=>m[i*4]*p[0]+m[i*4+1]*p[1]+m[i*4+2]*p[2]+m[i*4+3]);}
function isGeometricallyIndependent(points){
 let diameter=0,largest=0;
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)
  diameter=Math.max(diameter,Math.hypot(...points[i].map((v,k)=>v-points[j][k])));
 if(diameter<=1e-8)return false;
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++)for(let k=j+1;k<points.length;k++){
  const a=points[j].map((v,c)=>v-points[i][c]),b=points[k].map((v,c)=>v-points[i][c]);
  const cross=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  largest=Math.max(largest,Math.hypot(...cross));
 }
 return largest>diameter*diameter*1e-8; // planar landmarks accepted as 2D coverage only
}
export function auditC1RCandidate(raw){
 demand(raw?.schema===CROSSWALK_CANDIDATE_SCHEMA&&raw.publication_status==='local_candidate_only'&&raw.approved===false&&raw.anatomical_registration===null,'must remain an unapproved local candidate');
 demand(raw.specimen_id==='f002'&&raw.side==='right'&&raw.segment_id==='C1R','specimen, side or section mismatch');
 demand(raw.source?.xml_coordinate_unit==='unknown'&&raw.source?.xml_frame==='C1R_XML_unresolved'&&raw.source?.target_frame==='C1R_LPS_mm','unresolved XML coordinate system misrepresented');
 demand(raw.source?.source_dataset_doi==='10.26275/imas-52lf','source DOI mismatch');
 demand(sha(raw.source?.xml_sha256)&&sha(raw.source?.lps_markups_sha256)&&raw.source.xml_sha256!==raw.source.lps_markups_sha256,'source byte fingerprints missing or identical');
 demand(sha(raw.source?.fit_selection_sha256)&&sha(raw.source?.holdout_selection_sha256)&&raw.source.fit_selection_sha256!==raw.source.holdout_selection_sha256,'distinct selection fingerprints required');
 demand(raw.source?.bytes_independently_verified===false,'source authenticity cannot be claimed by this local audit');
 demand(raw.hypothesis?.kind==='declared_affine_not_estimated'&&raw.hypothesis?.matrix_convention==='row_major_column_vector'&&raw.hypothesis?.estimated_from_holdouts===false,'candidate transform falsely fitted or qualified');
 const m=raw.hypothesis.matrix4x4;
 demand(Array.isArray(m)&&m.length===16&&m.every(Number.isFinite)&&Math.abs(m[12])<=1e-12&&Math.abs(m[13])<=1e-12&&Math.abs(m[14])<=1e-12&&Math.abs(m[15]-1)<=1e-12,'matrix must be a finite row-major affine 4x4');
 const det=determinant(m);demand(Number.isFinite(det)&&Math.abs(det)>1e-12,'singular candidate');
 const scale=Math.max(...[0,1,2].map(i=>Math.abs(m[i*4])+Math.abs(m[i*4+1])+Math.abs(m[i*4+2])));
 demand(scale>0&&scale<=1e4,'candidate spatial scale unreasonable');
 const pairs=raw.holdout_pairs;
 demand(Array.isArray(pairs)&&pairs.length>=4&&pairs.length<=256,'at least four held-out point correspondences required');
 const seen=new Set(),src=[],dst=[],dist=[];
 for(const p of pairs){
  demand(id(p?.id)&&!seen.has(p.id),'invalid or duplicate point identifier');seen.add(p.id);
  demand(vec(p.xml_xyz_raw)&&vec(p.lps_xyz_mm),'invalid point coordinate or unsupported unit');
  src.push(p.xml_xyz_raw);dst.push(p.lps_xyz_mm);
  const predicted=apply(m,p.xml_xyz_raw);
  demand(predicted.every(Number.isFinite)&&predicted.every(v=>Math.abs(v)<1e8),'overflow in candidate mapping');
  dist.push(Math.hypot(...predicted.map((v,i)=>v-p.lps_xyz_mm[i])));
 }
 demand(isGeometricallyIndependent(src)&&isGeometricallyIndependent(dst),'held-out points insufficiently distinct');
 const max=Math.max(...dist),rms=Math.sqrt(dist.reduce((sum,r)=>sum+r*r,0)/dist.length);
 return Object.freeze({
  schema:'poly.pcbm.c1r-crosswalk-audit.v1',status:'candidate_residuals_only',
  specimen_id:'f002',side:'right',source_frame:'C1R_XML_unresolved',target_frame:'C1R_LPS_mm',
  source_point_unit:'unknown',target_point_unit:'mm',candidate_matrix_determinant:det,
  holdout_count:pairs.length,heldout_rms_mm:rms,heldout_max_mm:max,
  fit_selection_sha256:raw.source.fit_selection_sha256,holdout_selection_sha256:raw.source.holdout_selection_sha256,
  fingerprint_format:'declared_not_independently_verified',observations_independent_of_fit_unproven:true,
  xml_axis_origin_resolved:false,xml_axis_unit_resolved:false,
  biological_landmark_identity_verified:false,anatomical_registration_validated:false,
  c1r_to_ssv_validated:false,c1r_to_hra_validated:false,
  limitation:'Erreur calculée seulement pour la matrice et les paires déclarées. Le fichier XML, le volume microCT et la correspondance biologique des repères ne sont pas authentifiés ici.'
 });
}
export async function parseLocalC1RCandidate(file,{maxBytes=1000000}={}){
 demand(file&&Number.isSafeInteger(file.size)&&file.size>100&&file.size<=maxBytes,'file missing or exceeds 1 MB');
 const bytes=await file.arrayBuffer();demand(bytes.byteLength===file.size,'truncated file input');
 const obj=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
 return auditC1RCandidate(obj);
}

// Optional byte-level check of the TWO small source artifacts selected by the user.
// A digest match proves agreement with the locally supplied manifest, NOT origin,
// identity, provenance from SPARC, or correctness of anatomical correspondences.
export async function checkC1RSourceFingerprints(candidate,xmlFile,lpsFile,{maxBytes=32*1024*1024}={}){
 const audit=auditC1RCandidate(candidate);
 demand(audit.anatomical_registration_validated===false,'scientific status was unexpectedly elevated');
 demand(xmlFile&&lpsFile&&xmlFile!==lpsFile,'two different local files must be selected');
 demand(globalThis.crypto?.subtle?.digest,'SHA-256 implementation unavailable');
 const verify=async(file,expected)=>{
  demand(Number.isSafeInteger(file.size)&&file.size>0&&file.size<=maxBytes,'source artifact outside local verification size budget');
  const bytes=await file.arrayBuffer();
  demand(bytes.byteLength===file.size,'incomplete source artifact');
  const digest=await globalThis.crypto.subtle.digest('SHA-256',bytes);
  const hex=[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  demand(hex===expected,'source bytes differ from declared SHA-256');
  return {size:bytes.byteLength,sha256:hex};
 };
 const xml=await verify(xmlFile,candidate.source.xml_sha256);
 const lps=await verify(lpsFile,candidate.source.lps_markups_sha256);
 return Object.freeze({
  schema:'poly.pcbm.c1r-source-byte-check.v1',
  status:'local_byte_fingerprints_match_declared_manifest',
  xml_sha256:xml.sha256,xml_bytes:xml.size,
  lps_sha256:lps.sha256,lps_bytes:lps.size,
  original_source_authenticity_verified:false,
  point_correspondences_independently_verified:false,
  anatomical_registration_validated:false,
  large_microct_volumes_verified:false,
  caution:'Only SHA-256 equality to local manifest checked; no SPARC authenticity, coordinate semantics or anatomical registration inferred.'
 });
}
