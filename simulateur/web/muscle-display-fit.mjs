// Display-only calibration of distinct published anatomical meshes.
// This changes neither the original JSON surfaces nor anatomical identities.
// Provenance, source/target proxy anchors, limits and residuals are in the JSON.
let pending=null;
export function loadMuscleDisplayFit(){
  if(!pending)pending=(new URLSearchParams(location.search).get('muscle-fit')==='source')
    ? Promise.resolve(null)
    : fetch('../data/muscle-bone-display-calibration.json')
      .then(r=>r.ok?r.json():null).catch(()=>null);
  return pending;
}
export function fitRegion(part,layer='body'){
  if(layer==='hand')return 'hand';
  if(part?.kind==='bone'){
    switch(part.bone_family){
      case 'humerus':case 'clavicle':case 'scapula':return 'arm_shoulder';
      case 'radius':case 'ulna':return 'forearm';
      case 'femur':return 'thigh';
      case 'tibia':case 'fibula':return 'leg';
      case 'foot':return 'foot';
      default:return null;
    }
  }
  if(part?.reference_deformation==='rigid_foot')return 'foot';
  return ['arm_shoulder','forearm','thigh','leg'].includes(part?.region)
    ? part.region
    : part?.region==null?'forearm':null;
}
export function lookupMuscleFit(part,fit,layer='body'){
  const side=part?.side,region=fitRegion(part,layer);
  return (side==='R'||side==='L')&&region ? fit?.groups?.[side+':'+region]||null:null;
}
export function applyMuscleFitPoint(point,transform){
  if(!transform)return point;
  const a=transform.source_center,b=transform.target_center,s=transform.scale;
  return [b[0]+s*(point[0]-a[0]),b[1]+s*(point[1]-a[1]),b[2]+s*(point[2]-a[2])];
}
export function refitSelectionFocus(part,fit,layer='body'){
  const transform=lookupMuscleFit(part,fit,layer);
  if(transform && Array.isArray(part.illustrative_center)){
    part.illustrative_center=applyMuscleFitPoint(part.illustrative_center,transform);
    if(Number.isFinite(part.illustrative_extent))part.illustrative_extent*=transform.scale;
  }
  return transform;
}
export function publicFitSummary(fit){
  const groups=Object.entries(fit?.groups||{});
  return {
    enabled:groups.length>0,
    mode:groups.length?'bone-proxy-display-similarity':'original-source-display',
    geometricOnly:true,
    validatedAnatomicalRegistration:false,
    groups:groups.length,
    registered:groups.map(([key,v])=>({key,scale:v.scale,n_bone_proxies:v.n_bone_proxies,before:v.rms_center_before,after:v.rms_center_after}))
  };
}
